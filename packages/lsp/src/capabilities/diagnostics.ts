import Parser from "tree-sitter";
import {
    Diagnostic, _Connection,
    DidOpenTextDocumentParams,
    DidCloseTextDocumentParams,
    DidChangeTextDocumentParams,
    WorkDoneProgress,
    WorkDoneProgressBegin,
    WorkDoneProgressEnd,
    WorkDoneProgressCreateRequest,
    TextDocumentContentChangeEvent,
    Range
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { GlobalState } from "../server";
import IntervalTree from '@flatten-js/interval-tree';
import { BinderResult, create } from "../symbols/binder/binder"
import { getRandomToken } from "../common/progress"
import { asLspRange, containsRange } from "../common/calc";
import { search } from "../common/intervals";
import { NeedTypeCheck, Scope, ScopeOrSymbol } from "../symbols/definitions";
import { GlobalScope } from "../symbols/scopes/global";
import { CommentSymbol } from "../symbols/symbols/comment";
import { ExpressionScope } from "../symbols/scopes/expression";
import { LazySymbol, LazySymbolKind } from "../symbols/symbols/lazy";
import { referenceMulipleScope } from "../symbols/scopes/referenceMuliple";

const documentProvider = (globals: GlobalState) => {
    let {
        parser,
        queries,
        documents,
        trees,
        symbols,
        connection,
        logger
    } = globals

    const openDocument = async (params: DidOpenTextDocumentParams): Promise<void> => {
        logger.info(`Opening document: ${params.textDocument.uri}`)
        let diagsResolve: ((value: any) => any) | null = null
        let diagsReject: ((value: any) => any) | null = null

        globals.diagnostics = new Promise((resolve, reject) => {
            diagsResolve = resolve
            diagsReject = reject
        })

        const diagToken = await startProgress(connection, "Running diagnostics")

        const uri = params.textDocument.uri
        // Create a new document and add it to the documents map
        const doc = TextDocument.create(params.textDocument.uri, 'iec', params.textDocument.version, params.textDocument.text)
        documents.set(params.textDocument.uri, doc)

        // Parse the document and add it to the trees map
        const tree = parser.parse(doc.getText())
        trees.set(params.textDocument.uri, tree)

        // Get all tree sitter error nodes and format them as diagnostics
        const errors = getErrorNodes(tree.rootNode).map(node => formatError(node))

        // Use the outline query to get all scopes, nodes and their ranges
        const captures = queries.outline.captures(tree.rootNode)

        // Init ranges
        const ranges = new IntervalTree<ScopeOrSymbol>()

        // Create symbol table
        const rootNodes = createSymbolTable(captures, ranges, uri)
        if (rootNodes.diagnostics) {
            errors.push(...rootNodes.diagnostics)
        }

        const globalScope = new GlobalScope(null, uri, ranges)

        rootNodes.rootNodes.forEach(node => {
            if (node.item.item instanceof Scope) {
                const name = node.item.item.getName
                if (name) {
                    if (globalScope.items[name.getName]) {
                        errors.push({
                            range: node.range,
                            message: `Duplicate identifier '${name}'`,
                        })
                        errors.push({
                            range: globalScope.items[name.getName].getRange,
                            message: `Duplicate identifier '${name}'`,
                        })
                    }
                    else {
                        globalScope.items[name.getName] = node.item.item
                        node.item.item.setParent(globalScope)
                    }
                }
            }
        })

        rootNodes.lazyItems.forEach(item => {
            const result = item.solveLazy(ranges)
            if (result) {
                errors.push(...result)
            }
        })

        rootNodes.typeChecks.forEach(expression => {
            const result = expression.typeCheck()
            if (result) {
                errors.push(...result)
            }
        })

        setComments(ranges, uri, tree, queries)

        // Add the ranges to the symbols map
        symbols.set(doc.uri, globalScope)

        //@ts-expect-error
        diagsResolve()

        endProgress(connection, diagToken, "Diagnostics complete")
        connection.sendDiagnostics({ uri: doc.uri, diagnostics: errors })
    }
    const editDocument = async (params: DidChangeTextDocumentParams): Promise<void> => {
        logger.info(`Editing document: ${params.textDocument.uri}`)
        const oldTree = trees.get(params.textDocument.uri)!;
        const change = params.contentChanges

        // We only support incremental changes
        if (!TextDocumentContentChangeEvent.isIncremental(change[0])) {
            connection.window.showErrorMessage("Only incremental changes are supported")
            return
        }

        let diagsResolve: ((value: any) => any) | null = null
        let diagsReject: ((value: any) => any) | null = null

        globals.diagnostics = new Promise((resolve, reject) => {
            diagsResolve = resolve
            diagsReject = reject
        })

        const diagToken = await startProgress(connection, "Running diagnostics")

        const uri = params.textDocument.uri
        // Update the text document with the source
        const doc = documents.get(params.textDocument.uri)!
        const updated = TextDocument.update(doc, params.contentChanges, params.textDocument.version)

        for (const change of params.contentChanges as {
            range: Range;
            rangeLength?: number;
            text: string;
        }[]) {
            const rangeOffset = updated.offsetAt({
                line: change.range.start.line,
                character: change.range.start.character
            })

            const oldEndIndex = rangeOffset + change.rangeLength!
            const newEndIndex = rangeOffset + change.text.length

            // Update the tree with the new source & ranges
            oldTree.edit({
                startIndex: rangeOffset,
                oldEndIndex,
                newEndIndex,
                startPosition: { row: change.range.start.line, column: change.range.start.character },
                oldEndPosition: { row: change.range.end.line + change.rangeLength!, column: change.range.end.line + change.rangeLength! },
                newEndPosition: { row: change.range.end.line + change.text.length, column: + change.text.length }
            });
        }

        // Parse the new document and get the new tree
        const newTree = parser.parse(updated.getText(), oldTree);
        trees.set(updated.uri, newTree);

        // Change ranges as a result of the edit
        const globalRange = oldTree.getChangedRanges(newTree)

        // Get the actual edited range
        const localRange = oldTree.getEditedRange(newTree)

        const test = queries.outline.captures(newTree.rootNode, {startIndex: localRange.startIndex, endIndex: localRange.endIndex })

        // Get all tree sitter error nodes and format them as diagnostics
        const errors = getErrorNodes(newTree.rootNode).map(node => formatError(node))

        const captures = queries.outline.captures(newTree.rootNode)

        //console.dir(captures, { depth: null })

        // Init ranges
        const ranges = new IntervalTree<ScopeOrSymbol>()

        // Create symbol table
        const rootNodes = createSymbolTable(captures, ranges, uri)
        if (rootNodes.diagnostics) {
            errors.push(...rootNodes.diagnostics)
        }

        const globalScope = new GlobalScope(null, uri, ranges)

        rootNodes.rootNodes.forEach(node => {
            if (node.item.item instanceof Scope) {
                const name = node.item.item.getName
                if (name) {
                    if (globalScope.items[name.getName]) {
                        errors.push({
                            range: node.range,
                            message: `Duplicate identifier '${name}'`,
                        })
                        errors.push({
                            range: globalScope.items[name.getName].getRange,
                            message: `Duplicate identifier '${name}'`,
                        })
                    }
                    else {
                        globalScope.items[name.getName] = node.item.item
                        node.item.item.setParent(globalScope)
                    }
                }
            }
        })

        rootNodes.lazyItems.forEach(item => {
            const result = item.solveLazy(ranges)
            if (result) {
                errors.push(...result)
            }
        })

        rootNodes.typeChecks.forEach(expression => {
            const result = expression.typeCheck()
            if (result) {
                errors.push(...result)
            }
        })

        // Add the ranges to the symbols map
        symbols.set(doc.uri, globalScope)

        endProgress(connection, diagToken, "Diagnostics complete")

        setComments(ranges, uri, newTree, queries)

        //@ts-expect-error
        diagsResolve()
        connection.sendDiagnostics({ uri: updated.uri, diagnostics: errors })
    }

    const closeDocument = async (params: DidCloseTextDocumentParams): Promise<void> => {
        documents.delete(params.textDocument.uri)
        trees.delete(params.textDocument.uri)
    }

    return {
        openDocument,
        editDocument,
        closeDocument
    }
}

export default documentProvider

type Node = {
    readonly range: Range;
    readonly item: BinderResult
}

export const createSymbolTable = (captures: Parser.QueryCapture[], ranges: IntervalTree<any>, uri: string): 
{ rootNodes: Node[], lazyItems: ScopeOrSymbol[], typeChecks: NeedTypeCheck[], diagnostics: Diagnostic[] | null } => {
    let diagnostics: Diagnostic[] = []
    const roots: Node[] = []
    const stack: Node[] = []
    const lazyItems: ScopeOrSymbol[] = []
    const typeChecks: NeedTypeCheck[] = []

    let parent = null
    for (const capture of captures) {
        const item = create(capture, ranges, uri, asLspRange(capture.node));
        
        if (!item.item) continue
        if (item.err) {
            diagnostics.push(item.err)
            break;
        }
        if (item.typeCheck) {
            typeChecks.push(item.item as unknown as NeedTypeCheck)
        }
        
        const node = { range: asLspRange(capture.node), items: [], item }

        parent = stack.pop();
        while (true) {
            if (!parent) {
                roots.push(node);
                stack.push(node);
                break;
            }
            if (containsRange(parent.range, node.range)) {
                const attempt = parent.item.item!.addSymbol(node.item.item!)
                if (attempt) {
                    diagnostics.push(...attempt)
                } else {
                    if (node.item.lazyItem) {
                        lazyItems.push(parent.item!.item!)
                        const lazy = node.item.item as LazySymbol
                        if (lazy.kind === LazySymbolKind.Reference) parent.item.item!.addLazyReference(lazy)
                        if (lazy.kind === LazySymbolKind.TypeReference) parent.item.item!.addLazyTypeReference(lazy)
                    }
                }
                stack.push(parent);
                stack.push(node);
                break;
            }
            parent = stack.pop();
        }
    }

    return { rootNodes: roots, lazyItems, typeChecks, diagnostics: diagnostics.length ? diagnostics : null }
}


/// Start a progress notification and returns its token
const startProgress = async (connection: _Connection, title: string): Promise<string> => {
    const token = getRandomToken()
    await connection.sendRequest(WorkDoneProgressCreateRequest.method, { token })
    connection.sendProgress(WorkDoneProgress.type, token, {
        kind: 'begin',
        title,
        cancellable: false
    } as WorkDoneProgressBegin);
    return token;
}

/// End a progress notification
const endProgress = (connection: _Connection, token: string, message: string) => {
    connection.sendProgress(WorkDoneProgress.type, token, {
        kind: 'end',
        message
    } as WorkDoneProgressEnd);
}

/// Get all error nodes from the tree sitter parser
const getErrorNodes = (node: Parser.SyntaxNode) => {
    const errors: Parser.SyntaxNode[] = []
    const findError = (node: Parser.SyntaxNode) => {
        node.children.forEach(child => {
            if (child.isError || child.isMissing)
                errors.push(child)
            if (child.hasError)
                findError(child)
        })
    }
    findError(node)
    return errors
}

/// Format the tree sitter error nodes as diagnostics
const formatError = (node: Parser.SyntaxNode): Diagnostic => {
    const range = {
        start: {
            line: node.startPosition.row,
            character: node.startPosition.column,
        },
        end: {
            line: node.endPosition.row,
            character: node.endPosition.column,
        }
    }
    if (node.hasError && node.isMissing) {
        return {
            range,
            message: `Syntax error: ${node.toString()}`,
        }
    }
    else {
        return {
            range,
            message: `Unexpected token(s): '${node.children.map(n => n.text).join(" ")}'`,
        }
    }
}


/// Use the comment query to get all comments and assign them to the correct scope
export const setComments = (ranges: IntervalTree, uri: string, tree: Parser.Tree, queries: GlobalState["queries"]) => {
    const commentCaptures = queries.comments.captures(tree.rootNode)
    for (const capture of commentCaptures) {
        const next = capture.node.nextSibling
        if (!next) continue
        const range = [next.startIndex, next.endIndex]

        const item = search(ranges, [range[0], range[1]], true)

        if (item) {
            if (item instanceof Symbol) {
                if (item.getParent) {
                    const comment = new CommentSymbol(asLspRange(capture.node), uri, capture.node.text)
                    item.getParent?.addSymbol(comment)
                }
            }
            if (item instanceof Scope) {
                const comment = new CommentSymbol(asLspRange(capture.node), uri, capture.node.text)
                item.addSymbol(comment)
            }
        }
    }
}
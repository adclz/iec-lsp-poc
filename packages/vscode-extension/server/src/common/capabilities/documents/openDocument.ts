import { DidOpenTextDocumentParams } from "vscode-languageserver";
import { SingleTons } from "../../server";
import { TextDocument } from "vscode-languageserver-textdocument";
import { getTreeSitterErrors } from "./tree-sitter-lexer";
import { endProgress, startProgress } from "../../common/progress";
import { GapBuffer } from "../../common/gap-buffer";
import { Item, Scope } from "../../symbol-table/items/definitions";
import { builder } from "../../symbol-table/builder";
import { GlobalScope } from "../../symbol-table/items/scopes/global";
import { assignComments } from "../../symbol-table/items/comments";

const openDocumentProvider = (singleTons: SingleTons) => {
    let {
        parser,
        queries,
        documents,
        trees,
        buffers,
        connection,
    } = singleTons
    return async (params: DidOpenTextDocumentParams) => {
        console.info(`Opening document: ${params.textDocument.uri}`)
        let diagsResolve: ((value: any) => any) | null = null
        let diagsReject: ((value: any) => any) | null = null

        singleTons.diagnostics = new Promise((resolve, reject) => {
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
        const errors = getTreeSitterErrors(tree.rootNode)

        // Use the outline query to get all scopes, nodes and their ranges
        const captures = queries.outline.captures(tree.rootNode)

        const buffer = new GapBuffer<Item>()

        const rootNodes = builder(captures, tree, buffer, uri)
        if (rootNodes.diagnostics) {
            errors.push(...rootNodes.diagnostics)
        }

        const globalScope = new GlobalScope(uri, buffer)

        rootNodes.rootNodes.forEach(node => {
            if (node.item.item instanceof Scope) {
                const name = node.item.item.getName
                if (name) {
                    if (globalScope.items[name.getName]) {
                        errors.push({
                            range: node.range,
                            message: `Duplicate identifier '${name.getName}'`,
                            relatedInformation: [
                                {
                                    location: {
                                        uri: uri,
                                        range: globalScope.items[name.getName].getRange(tree)
                                    },
                                    message: `'${name.getName}' is declared here`
                                },
                                {
                                    location: {
                                        uri: uri,
                                        range: node.range,
                                    },
                                    message: `'${name.getName}' is declared here`
                                }
                            ]
                        })
                        errors.push({
                            range: globalScope.items[name.getName].getRange(tree),
                            message: `Duplicate identifier '${name.getName}'`,
                            relatedInformation: [
                                {
                                    location: {
                                        uri: uri,
                                        range: globalScope.items[name.getName].getRange(tree)
                                    },
                                    message: `'${name.getName}' is declared here`
                                },
                                {
                                    location: {
                                        uri: uri,
                                        range: node.range,
                                    },
                                    message: `'${name.getName}' is declared here`
                                }
                            ]
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
            const result = item.solveLazy(tree, buffer)
            if (result) {
                errors.push(...result)
            }
        })

        rootNodes.typeChecks.forEach(expression => {
            const result = expression.typeCheck(tree)
            if (result) {
                errors.push(...result)
            }
        })

        assignComments(uri, tree, queries, buffer)

        // Add the ranges to the symbols map
        buffers.set(doc.uri, globalScope)

        //@ts-expect-error
        diagsResolve()

        endProgress(connection, diagToken, "Diagnostics complete")
        connection.sendDiagnostics({ uri: doc.uri, diagnostics: errors })
    }
}

export default openDocumentProvider
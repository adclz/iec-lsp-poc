import { DidChangeTextDocumentParams, Diagnostic, Range, TextDocumentContentChangeEvent } from "vscode-languageserver";
import { SingleTons } from "../../server";
import { TextDocument } from "vscode-languageserver-textdocument";
import { getTreeSitterErrors } from "./tree-sitter-lexer";
import { endProgress, startProgress } from "../../common/progress";
import { GapBuffer } from "../../common/gap-buffer";
import { Item, Scope } from "../../symbol-table/items/definitions";
import { builder } from "../../symbol-table/builder";
import { GlobalScope } from "../../symbol-table/items/scopes/global";
import { assignComments } from "../../symbol-table/items/comments";

const editDocumentProvider = (singleTons: SingleTons) => {
    let {
        parser,
        queries,
        documents,
        trees,
        buffers,
        connection,
    } = singleTons
    return async (params: DidChangeTextDocumentParams) => {
        console.info(`Editing document: ${params.textDocument.uri}`)
        const oldTree = trees.get(params.textDocument.uri)!;
        const change = params.contentChanges

        // We only support incremental changes
        if (!TextDocumentContentChangeEvent.isIncremental(change[0])) {
            connection.window.showErrorMessage("Only incremental changes are supported")
            return
        }

        let diagsResolve: ((value: any) => any) | null = null
        let diagsReject: ((value: any) => any) | null = null

        singleTons.diagnostics = new Promise((resolve, reject) => {
            diagsResolve = resolve
            diagsReject = reject
        })

        const diagToken = await startProgress(connection, "Running diagnostics")
        let diagnostics: Diagnostic[] = [];
        const uri = params.textDocument.uri

        try {
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
                    newEndPosition: { row: change.range.end.line + change.text.length, column: change.text.length }
                });
            }

            const tree = parser.parse(updated.getText(), oldTree);
            trees.set(updated.uri, tree);

            // Get all tree sitter error nodes and format them as diagnostics
            diagnostics.push(...getTreeSitterErrors(tree.rootNode))

            // Use the outline query to get all scopes, nodes and their ranges
            const captures = queries.outline.captures(tree.rootNode)

            const buffer = new GapBuffer<Item>()

            const rootNodes = builder(captures, tree, uri, buffer)
            if (rootNodes.diagnostics) {
                diagnostics.push(...rootNodes.diagnostics)
            }

            const globalScope = new GlobalScope(uri, tree.rootNode.endIndex, buffer)

            rootNodes.rootNodes.forEach(node => {
                if (node.item.item instanceof Scope) {
                    const name = node.item.item.getName
                    if (name) {
                        if (globalScope.items[name.getName]) {
                            diagnostics.push({
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
                            diagnostics.push({
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
                    diagnostics.push(...result)
                }
            })

            rootNodes.typeChecks.forEach(expression => {
                const result = expression.typeCheck(tree)
                if (result) {
                    diagnostics.push(...result)
                }
            })

            assignComments(uri, tree, queries, buffer)

            // Add the ranges to the symbols map
            buffers.set(doc.uri, globalScope)

        } catch (e: any) {
            connection.window.showErrorMessage(e.message)
            //@ts-expect-error
            diagsReject(e)
        }
        finally {
            connection.sendDiagnostics({ uri, diagnostics })

            endProgress(connection, diagToken, "Diagnostics complete")

            //@ts-expect-error
            diagsResolve()
        }
    }
}

export default editDocumentProvider
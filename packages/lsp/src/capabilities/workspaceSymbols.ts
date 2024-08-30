import Parser, { Query, QueryCapture } from "tree-sitter";
import { DocumentSymbol, WorkspaceSymbolParams, Range, SymbolInformation, WorkspaceSymbol } from "vscode-languageserver";
import { GlobalState } from "../server";
import { asLspRange, containsRange, symbolMapping } from "../common/calc";
import { Scope } from "../symbols/definitions";
import iec61331 from "iec61331-tree-sitter"

const workspaceSymbolsProvider = (globalState: GlobalState): (params: WorkspaceSymbolParams) => 
    Promise<SymbolInformation[] | WorkspaceSymbol[] | null> => {
    const {
        queries,
        trees,
        symbols,
        parser
    } = globalState

    return async (params) => {
        const query = params.query
        if (params.query === "") return []
        const workspaceSymbols: WorkspaceSymbol[] = []

        const identifierQuery = new Query(iec61331, `((identifier) @id (#match? @id "^${query}+"))`)

        trees.forEach((tree, uri) => {
            identifierQuery.captures(tree.rootNode).forEach((capture) => {
                if (capture.node.text.includes(query)) {
                    const symTable = symbols.get(uri)
                    if (symTable) {
                        Object.values(symTable.items).forEach((item) => {
                            //@ts-ignore
                            if (item["name"]) {
                                workspaceSymbols.push(
                                    ...item.getDocumentSymbols()
                                    .map((sym) => WorkspaceSymbol.create(sym.name, sym.kind, uri, sym.range))
                                )
                            }
                        })
                    }
                }
            })
        })

        return workspaceSymbols
    }
}

export default workspaceSymbolsProvider
import { Query, QueryCapture } from "web-tree-sitter";
import { DocumentSymbol, WorkspaceSymbolParams, Range, SymbolInformation, WorkspaceSymbol } from "vscode-languageserver";
import { SingleTons } from "../server";
import { asLspRange, containsRange, symbolMapping } from "../common/common";
import { Scope } from "../symbol-table/items/definitions";

const workspaceSymbolsProvider = (singleTons: SingleTons): (params: WorkspaceSymbolParams) =>
    Promise<SymbolInformation[] | WorkspaceSymbol[] | null> => {
    const {
        language,
        trees,
        symbols,
        parser
    } = singleTons

    return async (params) => {
        const query = params.query
        if (params.query === "") return []
        const workspaceSymbols: WorkspaceSymbol[] = []

        const identifierQuery = language.query(`((identifier) @id (#match? @id "^${query}+"))`)

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
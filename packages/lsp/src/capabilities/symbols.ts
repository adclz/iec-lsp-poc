import Parser, { Query, QueryCapture } from "tree-sitter";
import { DocumentSymbol, DocumentSymbolParams, Range, SymbolKind } from "vscode-languageserver";
import { GlobalState } from "../server";
import { asLspRange, containsRange, symbolMapping } from "../common/calc";
import { Scope } from "../symbols/definitions";

type Node = {
    range: Range,
    children: Node[],
    capture: QueryCapture
}

const symbolsProvider = (globalState: GlobalState): (params: DocumentSymbolParams) => Promise<DocumentSymbol[]> => {
    const {
        queries,
        trees,
        symbols
    } = globalState

    return async (params) => {
        const tree = trees.get(params.textDocument.uri);
        if (!tree) {
            return [];
        }

        const docSymbols = symbols.get(params.textDocument.uri);
        if (!docSymbols) {
            return []
        }

        const items = docSymbols.items
        const docs: DocumentSymbol[] = []
        Object.values(items)
            .forEach((item) => {
                if (item instanceof Scope) {
                    docs.push(...item.getDocumentSymbols())
                }
            })

        return docs
    }
}

export default symbolsProvider
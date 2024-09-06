import { HoverParams, Hover, MarkupKind } from "vscode-languageserver";
import { SingleTons } from "../server";
import { search } from "../common/intervals";
import { Scope } from "../symbol-table/items/definitions";

const hoverProvider = (singleTons: SingleTons): (params: HoverParams) => Promise<Hover | null> => {
    const {
        documents,
        trees,
        symbols
    } = singleTons
    return async (params) => {
        const doc = documents.get(params.textDocument.uri)!;
        const tree = trees.get(params.textDocument.uri);
        if (!tree) {
            return null;
        }

        const getSymbols = symbols.get(params.textDocument.uri);
        if (!getSymbols) {
            return null;
        }

        const offset = doc.offsetAt(params.position);
        const uniqueSymbol = search(getSymbols.symbols, [offset, offset])

        if (!uniqueSymbol) {
            return null
        }

        //console.log(uniqueSymbol)

        // Only symbols can be hovered
        if (uniqueSymbol instanceof Scope) {
            return null
        }

        const value = uniqueSymbol.hoverInfo
        if (!value) {
            return null
        }

        return {
            contents: {
                kind: MarkupKind.Markdown,
                value
            }
        }
    }
}

export default hoverProvider
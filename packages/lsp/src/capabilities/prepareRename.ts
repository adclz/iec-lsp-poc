import Parser, { Query, QueryCapture } from "tree-sitter";
import { PrepareRenameParams, Range, WorkspaceEdit } from "vscode-languageserver";
import { GlobalState } from "../server";
import { search } from "../common/intervals";

const hoverProvider = (globalState: GlobalState): (params: PrepareRenameParams) =>
     Promise<Range | { range: Range, placeholder: string } | { defaultBehavior: boolean } | null> => {
    const {
        documents,
        trees,
        symbols
    } = globalState
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
        //console.log(uniqueSymbol)
        if (!uniqueSymbol) {
            return null
        }

        return null
    }
}

export default hoverProvider
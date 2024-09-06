import { Query, QueryCapture } from "tree-sitter";
import { RenameParams, WorkspaceEdit } from "vscode-languageserver";
import { SingleTons } from "../server";
import { search } from "../common/intervals";

const hoverProvider = (singleTons: SingleTons): (params: RenameParams) => Promise<WorkspaceEdit | null> => {
    const {
        documents,
        trees,
        buffers
    } = singleTons
    return async (params) => {
        const doc = documents.get(params.textDocument.uri)!;
        const tree = trees.get(params.textDocument.uri);
        if (!tree) {
            return null;
        }

        const getSymbols = buffers.get(params.textDocument.uri);
        if (!getSymbols) {
            return null;
        }

        const offset = doc.offsetAt(params.position);
        const uniqueSymbol = getSymbols.buffer.get(offset);
        //console.log(uniqueSymbol)
        if (!uniqueSymbol) {
            return null
        }

        return null
    }
}

export default hoverProvider
import { DidCloseTextDocumentParams } from "vscode-languageserver";
import { SingleTons } from "../../server";
import { TextDocument } from "vscode-languageserver-textdocument";
import { getTreeSitterErrors } from "./tree-sitter-lexer";
import { endProgress, startProgress } from "../../common/progress";
import { GapBuffer } from "../../common/gap-buffer";
import { Item, Scope } from "../../symbol-table/items/definitions";
import { builder } from "../../symbol-table/builder";
import { GlobalScope } from "../../symbol-table/items/scopes/global";
import { assignComments } from "../../symbol-table/items/comments";

const closeDocumentProvider = (singleTons: SingleTons) => {
    let {
        parser,
        queries,
        documents,
        trees,
        buffers,
        connection,
    } = singleTons
    return async (params: DidCloseTextDocumentParams) => {

    }
}

export default closeDocumentProvider
import Parser, { Query, QueryCapture } from "tree-sitter";
import { SignatureHelpParams, SignatureHelp, SignatureInformation } from "vscode-languageserver";
import { GlobalState } from "../server";
import { asLspRange, containsRange, symbolMapping } from "../common/calc";
import { Scope } from "../symbols/definitions";
import iec61331 from "iec61331-tree-sitter"
import { search } from "../common/intervals";
import { SignatureScope } from "../symbols/scopes/signature";

const signatureProvider = (globalState: GlobalState): (params: SignatureHelpParams) => 
    Promise<SignatureHelp | null> => {
    const {
        documents,
        trees,
        symbols,
        parser
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

        if (!uniqueSymbol) {
            return null
        }

        //console.log("SIGNATURE")

        if (uniqueSymbol instanceof SignatureScope) {
            return uniqueSymbol.getSignatureParameters()
        }

        return null

    }
}

export default signatureProvider
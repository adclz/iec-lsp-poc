import { SignatureHelpParams, SignatureHelp, SignatureInformation } from "vscode-languageserver";
import { SingleTons } from "../server";
import { asLspRange, containsRange, symbolMapping } from "../common/common";
import { search } from "../common/intervals";
import { SignatureScope } from "../symbol-table/items/scopes/signature";

const signatureProvider = (singleTons: SingleTons): (params: SignatureHelpParams) =>
    Promise<SignatureHelp | null> => {
    const {
        documents,
        trees,
        symbols,
        parser
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

        if (uniqueSymbol instanceof SignatureScope) {
            return uniqueSymbol.getSignatureParameters()
        }

        return null

    }
}

export default signatureProvider
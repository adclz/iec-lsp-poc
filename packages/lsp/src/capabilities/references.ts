import { ReferenceParams, Location } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { GlobalState } from "../server";
import { search } from "../common/intervals";
import { ReferenceSymbol } from "../symbols/symbols/reference";
import { VariableScope } from "../symbols/scopes/variable";
import { TypeReferenceSymbol } from "../symbols/symbols/typeReference";
import { ScopeOrSymbol } from "../symbols/definitions";

const referencesProvider = (globalState: GlobalState): (params: ReferenceParams) => Promise<Location[]> => {
    const {
        documents,
        trees,
        symbols
    } = globalState
    return async (params) => {
        const doc = documents.get(params.textDocument.uri)!;
        const tree = trees.get(params.textDocument.uri);
        if (!tree) {
            return [];
        }

        const getSymbols = symbols.get(params.textDocument.uri);
        if (!getSymbols) {
            return [];
        }

        const offset = doc.offsetAt(params.position);
        const uniqueSymbol = search(getSymbols.symbols, [offset, offset])

        if (!uniqueSymbol) {
            return []
        }

        if (uniqueSymbol instanceof ReferenceSymbol) {
            const reference = uniqueSymbol.getLinkedReference!
            return getAllReferences(params, reference)
        }

        if (uniqueSymbol instanceof TypeReferenceSymbol) {
            return []
        }

        const scope = uniqueSymbol.getParent

        if (!scope) {
            return []
        }

        if (scope instanceof VariableScope) {
            return getAllReferences(params, scope)
        }
        return []
    }
}

export default referencesProvider

const getAllReferences = (params: ReferenceParams, scope: ScopeOrSymbol) => {
    const references = scope.getReferences
    return references.map((reference) => {
        return {
            uri: params.textDocument.uri,
            range: reference.getRange
        }
    })
}
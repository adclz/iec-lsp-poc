import Parser, { Query, QueryCapture } from "tree-sitter";
import { TypeDefinitionParams, Hover, MarkupKind, LocationLink, Location } from "vscode-languageserver";
import { GlobalState } from "../server";
import { search } from "../common/intervals";
import { TypeReferenceSymbol } from "../symbols/symbols/typeReference";
import { VariableScope } from "../symbols/scopes/variable";
import { ReferenceSymbol } from "../symbols/symbols/reference";

const typeDefinitionProvider = (globalState: GlobalState): 
(params: TypeDefinitionParams) => Promise<Location | Location[] | LocationLink[] | null> => {
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

        const parent = uniqueSymbol.getParent


        if (uniqueSymbol instanceof ReferenceSymbol) {
            const type = uniqueSymbol.getLinkedReference
            if (type) {
                return {
                    uri: params.textDocument.uri,
                    range: type!.getRange
                }
            }
        }

        if (uniqueSymbol instanceof TypeReferenceSymbol) {
            const type = uniqueSymbol.getLinkedTypeReference
            return {
                uri: params.textDocument.uri,
                range: type!.getRange
            }
        }


        if (parent instanceof VariableScope) {
            const typeReference = parent.getType()
            if (typeReference) {
                return {
                    uri: params.textDocument.uri,
                    range: typeReference.getRange
                }
            }
        }

        return []
    }
}

export default typeDefinitionProvider
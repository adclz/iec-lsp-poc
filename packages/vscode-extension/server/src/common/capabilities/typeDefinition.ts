import { TypeDefinitionParams, Hover, MarkupKind, LocationLink, Location } from "vscode-languageserver";
import { SingleTons } from "../server";
import { search } from "../common/intervals";
import { TypeReferenceSymbol } from "../symbol-table/items/symbols/typeReference";
import { VariableScope } from "../symbol-table/items/scopes/variable";
import { ReferenceSymbol } from "../symbol-table/items/symbols/reference";

const typeDefinitionProvider = (singleTons: SingleTons):
    (params: TypeDefinitionParams) => Promise<Location | Location[] | LocationLink[] | null> => {
    const {
        documents,
        trees,
        buffers
    } = singleTons
    return async (params) => {
        const doc = documents.get(params.textDocument.uri)!;
        const tree = trees.get(params.textDocument.uri);
        if (!tree) {
            return [];
        }

        const getSymbols = buffers.get(params.textDocument.uri);
        if (!getSymbols) {
            return [];
        }

        const offset = doc.offsetAt(params.position);
        let uniqueSymbol;
        const rt = tree.rootNode.namedDescendantForIndex(offset)
        uniqueSymbol = getSymbols.buffer.get(rt.startIndex)

        if (!uniqueSymbol) {
            return []
        }

        const parent = uniqueSymbol.getParent


        if (uniqueSymbol instanceof ReferenceSymbol) {
            const type = uniqueSymbol.getLinkedReference
            if (type) {
                return {
                    uri: params.textDocument.uri,
                    range: type!.getRange(tree)
                }
            }
        }

        if (uniqueSymbol instanceof TypeReferenceSymbol) {
            const type = uniqueSymbol.getLinkedTypeReference
            return {
                uri: params.textDocument.uri,
                range: type!.getRange(tree)
            }
        }


        if (parent instanceof VariableScope) {
            const typeReference = parent.getType()
            if (typeReference) {
                return {
                    uri: params.textDocument.uri,
                    range: typeReference.getRange(tree)
                }
            }
        }

        return []
    }
}

export default typeDefinitionProvider
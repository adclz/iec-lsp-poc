import { ReferenceParams, Location } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { SingleTons } from "../server";
import { ReferenceSymbol } from "../symbol-table/items/symbols/reference";
import { VariableScope } from "../symbol-table/items/scopes/variable";
import { TypeReferenceSymbol } from "../symbol-table/items/symbols/typeReference";
import { Item } from "../symbol-table/items/definitions";
import { SignatureScope } from "../symbol-table/items/scopes/signature";
import { Tree } from "web-tree-sitter";

const referencesProvider = (singleTons: SingleTons): (params: ReferenceParams) => Promise<Location[]> => {
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

        if (uniqueSymbol instanceof ReferenceSymbol) {
            const reference = uniqueSymbol.getLinkedReference!
            return getAllReferences(params, reference, tree)
        }

        if (uniqueSymbol instanceof TypeReferenceSymbol) {
            return []
        }

        const scope = uniqueSymbol.getParent

        if (!scope) {
            return []
        }

        return getAllReferences(params, scope, tree)

        return []
    }
}

export default referencesProvider

const getAllReferences = (params: ReferenceParams, scope: Item, tree: Tree) => {
    const references = scope.getReferences
    return references.map((reference) => {
        return {
            uri: params.textDocument.uri,
            range: reference.getRange(tree)
        }
    })
}
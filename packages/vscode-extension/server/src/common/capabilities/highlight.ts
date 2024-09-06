import { DocumentHighlightParams, DocumentHighlightKind, DocumentHighlight } from "vscode-languageserver";
import { SingleTons } from "../server";
import { asLspRange } from "../common/common";
import { CommentSymbol } from "../symbol-table/items/symbols/comment";
import { ReferenceSymbol } from "../symbol-table/items/symbols/reference";
import { VariableScope } from "../symbol-table/items/scopes/variable";
import { TypeReferenceSymbol } from "../symbol-table/items/symbols/typeReference";
import { findTypeScope, TypeScope } from "../symbol-table/items/scopes/type";

const highlightProvider = (singleTons: SingleTons): (params: DocumentHighlightParams) => Promise<DocumentHighlight[]> => {
    const {
        documents,
        buffers,
        trees
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

        if (uniqueSymbol instanceof CommentSymbol) {
            return []
        }

        if (uniqueSymbol instanceof ReferenceSymbol) {
            const reference = uniqueSymbol.getLinkedReference
            if (reference) {
                const references = reference.getReferences
                return [
                    {
                        range: reference.getRange(tree),
                        kind: DocumentHighlightKind.Text
                    }, ...references.map((reference) => ({
                        range: reference.getRange(tree),
                        kind: DocumentHighlightKind.Write
                    }))]
            }
        }

        if (uniqueSymbol instanceof TypeReferenceSymbol) {
            const reference = uniqueSymbol.getLinkedTypeReference
            if (reference) {
                const references = reference.getTypeReferences
                return [
                    {
                        range: uniqueSymbol.getRange(tree),
                        kind: DocumentHighlightKind.Text
                    }, ...references.map((reference) => ({
                        range: reference.getRange(tree),
                        kind: DocumentHighlightKind.Write
                    }))]
            }
        }

        const parent = uniqueSymbol.getParent

        const type = findTypeScope(uniqueSymbol)

        if (type) {
            const references = type.getReferences
            return [
                {
                    range: type.getRange(tree),
                    kind: DocumentHighlightKind.Text
                }, ...references.map((reference) => ({
                    range: reference.getRange(tree),
                    kind: DocumentHighlightKind.Write
                }))]
        }

        if (parent instanceof VariableScope) {
            const references = parent.getReferences
            return [
                {
                    range: parent.getRange(tree),
                    kind: DocumentHighlightKind.Text
                }, ...references.map((reference) => ({
                    range: reference.getRange(tree),
                    kind: DocumentHighlightKind.Write
                }))]
        }

        const treeNode = tree.rootNode.descendantForPosition({
            row: params.position.line,
            column: params.position.character
        })

        if (!treeNode) {
            return []
        }

        const treeParent = treeNode.parent

        if (!treeParent) {
            return []
        }

        return [
            {
                range: asLspRange(treeParent),
                kind: DocumentHighlightKind.Text
            }
        ]

        return []
    }
}

export default highlightProvider
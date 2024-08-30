import { DocumentHighlightParams, DocumentHighlightKind, DocumentHighlight } from "vscode-languageserver";
import { GlobalState } from "../server";
import { asLspRange } from "../common/calc";
import { search } from "../common/intervals";
import { CommentSymbol } from "../symbols/symbols/comment";
import { ReferenceSymbol } from "../symbols/symbols/reference";
import { VariableScope } from "../symbols/scopes/variable";
import { TypeReferenceSymbol } from "../symbols/symbols/typeReference";
import { findTypeScope, TypeScope } from "../symbols/scopes/type";
import { ArrayScope } from "../symbols/scopes/array";
import { EnumScope } from "../symbols/scopes/enum";

const highlightProvider = (globalState: GlobalState): (params: DocumentHighlightParams) => Promise<DocumentHighlight[]> => {
    const {
        documents,
        symbols,
        trees
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

        if (uniqueSymbol instanceof CommentSymbol) {
            return []
        }

        if (uniqueSymbol instanceof ReferenceSymbol) {
            const reference = uniqueSymbol.getLinkedReference
            if (reference) {
                const references = reference.getReferences
                return [
                    {
                        range: reference.getRange,
                        kind: DocumentHighlightKind.Text
                    }, ...references.map((reference) => ({
                        range: reference.getRange,
                        kind: DocumentHighlightKind.Write
                    }))]
            }
        }

        if (uniqueSymbol instanceof TypeReferenceSymbol) {
            const reference = uniqueSymbol.getLinkedTypeReference
            if (reference) {
                const references = reference.getReferences
                return [
                    {
                        range: uniqueSymbol.getRange,
                        kind: DocumentHighlightKind.Text
                    }, ...references.map((reference) => ({
                        range: reference.getRange,
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
                    range: type.getRange,
                    kind: DocumentHighlightKind.Text
                }, ...references.map((reference) => ({
                    range: reference.getRange,
                    kind: DocumentHighlightKind.Write
                }))]
        }

        if (parent instanceof VariableScope) {
            const references = parent.getReferences
            return [
                {
                    range: parent.getRange,
                    kind: DocumentHighlightKind.Text
                }, ...references.map((reference) => ({
                    range: reference.getRange,
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
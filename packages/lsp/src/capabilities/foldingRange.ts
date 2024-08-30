import Parser, { Query, QueryCapture } from "tree-sitter";
import { FoldingRangeParams, FoldingRange, FoldingRangeKind } from "vscode-languageserver";
import { GlobalState } from "../server";
import { asLspRange, containsRange, symbolMapping } from "../common/calc";
import { Scope } from "../symbols/definitions";
import iec61331 from "iec61331-tree-sitter"

const workspaceSymbolsProvider = (globalState: GlobalState): (params: FoldingRangeParams) => 
    Promise<FoldingRange[] | null> => {
    const {
        queries,
        trees,
        symbols,
        parser
    } = globalState

    return async (params) => {
        const tree = trees.get(params.textDocument.uri);
        if (!tree) {
            return null
        }

        const ranges: FoldingRange[] = []

        queries.foldingRanges.captures(tree.rootNode)
        .forEach((capture) => {
            let kind: FoldingRangeKind | undefined = undefined
            if (capture.name === "fold.region") kind = FoldingRangeKind.Region
            if (capture.name === "fold.comment") kind = FoldingRangeKind.Comment
            ranges.push({
                startLine: capture.node.startPosition.row,
                startCharacter: capture.node.startPosition.column,
                endLine: capture.node.endPosition.row,
                endCharacter: capture.node.endPosition.column,
                kind
            })
        })
        



        return ranges
    }
}

export default workspaceSymbolsProvider
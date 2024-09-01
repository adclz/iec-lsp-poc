import { Query, QueryCapture } from "tree-sitter";
import { FoldingRangeParams, FoldingRange, FoldingRangeKind } from "vscode-languageserver";
import { SingleTons } from "../server";

const workspaceSymbolsProvider = (singleTons: SingleTons): (params: FoldingRangeParams) =>
    Promise<FoldingRange[] | null> => {
    const {
        queries,
        trees,
        symbols,
        parser
    } = singleTons

    return async (params) => {
        const tree = trees.get(params.textDocument.uri);
        if (!tree) {
            return null
        }

        const ranges: FoldingRange[] = []

        queries.fold.captures(tree.rootNode)
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
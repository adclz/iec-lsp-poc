import { Tree } from "web-tree-sitter"
import { SingleTons } from "../../server"
import { Symbol, Scope, Item } from "../items/definitions";
import { CommentSymbol } from "../items/symbols/comment";
import { GapBuffer } from "../../common/gap-buffer";

/// Use the comment query to get all comments and assign them to the correct scope
export const assignComments = (uri: string, tree: Tree, queries: SingleTons["queries"], buffer: GapBuffer<Item>) => {
    const commentCaptures = queries.comments.captures(tree.rootNode)
    for (const capture of commentCaptures) {
        const item = buffer.get(capture.node.nextSibling?.startIndex!)

        if (item) {
            if (item instanceof Symbol) {
                if (item.getParent) {
                    const comment = new CommentSymbol(capture.node.endIndex + 1, uri, capture.node.text)
                    item.getParent?.addSymbol(comment, tree)
                }
            }
            if (item instanceof Scope) {
                const comment = new CommentSymbol(capture.node.endIndex + 1, uri, capture.node.text)
                item.addSymbol(comment, tree)
            }
        }
    }
}
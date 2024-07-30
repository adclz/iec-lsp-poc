import Parser from "tree-sitter";
import { Diagnostic, PublishDiagnosticsParams } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { GlobalState } from "../server";

export type change = {
    range: {
        start: {
            line: number,
            character: number
        },
        end: {
            line: number,
            character: number
        },
    },
    rangeLength: number,
    text: string
};

export const validateTextDocument = (
    globals: GlobalState,
    updated: TextDocument,
    tree: Parser.Tree,
    change?: change): PublishDiagnosticsParams => {
    // update the tree with the new text
    if (change) {
        const rangeOffset = updated.offsetAt({
            line: change.range.start.line,
            character: change.range.start.character
        })

        const oldEndIndex = rangeOffset + change.rangeLength
        const newEndIndex = rangeOffset + change.text.length

        tree.edit({
            startIndex: rangeOffset,
            oldEndIndex,
            newEndIndex,
            startPosition: { row: change.range.start.line, column: change.range.start.character },
            oldEndPosition: { row: change.range.end.line + change.rangeLength, column: change.range.end.line + change.rangeLength },
            newEndPosition: { row: change.range.end.line + change.text.length, column: + change.text.length }
        });
    }

    const newTree = globals.parser.parse(updated.getText(), tree);
    globals.trees.set(updated.uri, newTree);

    const matches = globals.queries.error.matches(newTree.rootNode)
    const diagnostics: Diagnostic[] = []

    for (const match of matches) {
        for (const capture of match.captures) {
            const node = capture.node;

            diagnostics.push({
                range: {
                    start: {
                        line: node.startPosition.row,
                        character: node.startPosition.column,
                    },
                    end: {
                        line: node.endPosition.row,
                        character: node.endPosition.column,
                    }
                },
                message: node.isMissing ?
                    `Syntax error: Missing ${node.text}` :
                    `Unexpected token '${node.text}'`,
            })
        }
    }

    return {
        uri: updated.uri,
        diagnostics
    }
}
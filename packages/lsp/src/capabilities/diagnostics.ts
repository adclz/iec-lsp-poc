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

const getErrorNodes = (node: Parser.SyntaxNode) => {
    const errors: Parser.SyntaxNode[] = []
    const findError = (node: Parser.SyntaxNode) => {
        node.children.forEach(child => {
            if (child.isError || child.isMissing)
                errors.push(child)
            if (child.hasError)
                findError(child)
        })
    }
    findError(node)
    return errors
}

const formatError = (node: Parser.SyntaxNode): Diagnostic => {
    const range = {
        start: {
            line: node.startPosition.row,
            character: node.startPosition.column,
        },
        end: {
            line: node.endPosition.row,
            character: node.endPosition.column,
        }
    }
    if (node.hasError && node.isMissing) {
        return {
            range,
            message: `Syntax error: ${node.toString()}`,
        }
    }
    else {
        return {
            range,
            message: `Unexpected token(s) '${node.children.map(n => n.text).join(" ")}'`,
        }
    }
}

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

    const diagnostics = getErrorNodes(newTree.rootNode).map(node => formatError(node))

    return {
        uri: updated.uri,
        diagnostics
    }
}
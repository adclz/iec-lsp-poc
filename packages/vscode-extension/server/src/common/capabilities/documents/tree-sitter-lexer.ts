import {
    Diagnostic, _Connection,
} from "vscode-languageserver";
import { SyntaxNode } from "web-tree-sitter";

/// Get all error nodes from the tree sitter parser
export const getTreeSitterErrors = (node: SyntaxNode) => {
    const errors: SyntaxNode[] = []
    const findError = (node: SyntaxNode) => {
        node.children.forEach(child => {
            if (child.isError || child.isMissing)
                errors.push(child)
            if (child.hasError)
                findError(child)
        })
    }
    findError(node)
    return errors.map(formatError)
}

/// Format the tree sitter error nodes as diagnostics
const formatError = (node: SyntaxNode): Diagnostic => {
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
            message: `Unexpected token(s): '${node.children.map(n => n.text).join(" ")}'`,
        }
    }
}
import { SyntaxNode } from "web-tree-sitter";
import { HoverParams, Hover, MarkupKind, SelectionRangeParams, SelectionRange } from "vscode-languageserver";
import { SingleTons } from "../server";
import { search } from "../common/intervals";
import { asLspRange } from "../common/common";

const hoverProvider = (singleTons: SingleTons): (params: SelectionRangeParams) => Promise<SelectionRange[] | null> => {
    const {
        documents,
        trees,
        symbols
    } = singleTons
    return async (params) => {
        const document =  documents.get(params.textDocument.uri);
        if (!document) {
            return [];
        }
		const tree = await trees.get(document.uri);
		if (!tree) {
			return [];
		}

		const result: SelectionRange[] = [];

		for (const position of params.positions) {
			const stack: SyntaxNode[] = [];
			const offset = document.offsetAt(position);

			let node = tree.rootNode;
			stack.push(node);

			while (true) {
				let child = node.namedChildren.find(candidate => {
					return candidate.startIndex <= offset && candidate.endIndex > offset;
				});

				if (child) {
					stack.push(child);
					node = child;
					continue;
				}
				break;
			}

			let parent: SelectionRange | undefined;
			for (let node of stack) {
				let range = SelectionRange.create(asLspRange(node), parent);
				parent = range;
			}
			if (parent) {
				result.push(parent);
			}
		}

		return result;
    }
}

export default hoverProvider
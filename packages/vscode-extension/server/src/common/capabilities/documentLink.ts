import { DocumentLinkParams, DocumentLink } from "vscode-languageserver";
import { SingleTons } from "../server";

const documentLinkProvider = (singleTons: SingleTons): (params: DocumentLinkParams) => Promise<DocumentLink[] | null> => {
	const {
		workspaceRoot,
		documents,
		trees,
		queries,
	} = singleTons
	return async (params) => {
		const document = documents.get(params.textDocument.uri);
		if (!document) {
			return [];
		}
		const tree = trees.get(document.uri);
		if (!tree) {
			return [];
		}

		const result: DocumentLink[] = [];
		const urlPattern = /\s+source:\/\/(\w+.\w+):(\d+)/g

		const commentQuery = queries.comments.captures(tree.rootNode)

		for (const capture of commentQuery) {
			const commentNode = capture.node;
			const commentText = capture.node.text

			// Use regex to find file URLs in the comment

			let match: RegExpExecArray | null = null;
			while ((match = urlPattern.exec(commentText)) !== null) {
				const linkStart = match.index;
				const linkEnd = match.index + match[0].length;
				const [_, filePath, lineNumber] = match;

				// Create a DocumentLink for each file URL found
				result.push({
					range: {
						start: document.positionAt(commentNode.startIndex + linkStart),
						end: document.positionAt(commentNode.startIndex + linkEnd),
					},
					target: `${workspaceRoot}/${filePath}#L${lineNumber}`, // File path with line number as a target,
				});
			}
		}

		return result;
	}
}

export default documentLinkProvider
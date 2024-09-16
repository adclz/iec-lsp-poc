import { CodeLensParams, CodeLens } from "vscode-languageserver";
import { SingleTons } from "../server";
import { Scope } from "../symbol-table/items/definitions";

const codeLensProvider = (singleTons: SingleTons): (params: CodeLensParams) => Promise<CodeLens[] | null[]> => {
	const {
		workspaceRoot,
		documents,
		trees,
		buffers,
		queries,
		language
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

		const result: CodeLens[] = [];

		const lensQuery = language.query(`
			(function_declaration) @lens
			(function_block_declaration) @lens
			(var2_init_decl) @lens
			(type_declaration) @lens`
		)

		const buffer = buffers.get(document.uri)!.buffer

		lensQuery.captures(tree.rootNode)
			. forEach((capture) => {
				let lens = buffer.get(capture.node.startIndex)
				if (lens) {
					if (!(lens instanceof Scope)) lens = lens.getParent!
					const references = lens.getReferences
					const typeReferences = lens.getTypeReferences
					if (references.length)
						result.push({
							range: {
								start: document.positionAt(capture.node.startIndex),
								end: document.positionAt(capture.node.endIndex)
							},
							command: {
								title: `${references.length} reference(s)`,
								command: "",
							}
						})
					if (typeReferences.length)
						result.push({
							range: {
								start: document.positionAt(capture.node.startIndex),
								end: document.positionAt(capture.node.endIndex)
							},
							command: {
								title: `${typeReferences.length} type reference(s)`,
								command: "",
							}
						})
				}
			})

		return result;
	}
}

export default codeLensProvider
import { Query, SyntaxNode, Tree } from "web-tree-sitter";
import { CompletionItem, CompletionList, CompletionItemKind, CompletionParams, InsertTextFormat } from "vscode-languageserver";
import { SingleTons } from "../server";
import { scopedCompletionProvider } from "../extends/scope-symbols";

/*const grammar = require.resolve("iec61331-tree-sitter/src/grammar.json");
const grammarSyntax = JSON.parse(fs.readFileSync(grammar, "utf8"));

type StringNode = {
    type: "STRING",
    value: string
}

type SymbolNode = {
    type: "SYMBOL",
    name: string
}

type ChoiceNode = {
    type: "CHOICE",
    members: GrammarNode[]
}

type SequenceNode = {
    type: "SEQ",
    members: GrammarNode[]
}

type RepeatNode = {
    type: "REPEAT",
    content: GrammarNode
}
type BlankNode = {
    type: "BLANK"
}

type GrammarNode = StringNode | SymbolNode | ChoiceNode | SequenceNode | RepeatNode | BlankNode

const checkCursorWithinGroup = (node: SyntaxNode, params: CompletionParams) => {
    const type = node.type;

    let index = -1;

    for (let i = 0; i < node.childCount; i++) {
        let child = node.child(i)!;
        if (params.position.line >= child.startPosition.row &&
            params.position.line <= child.endPosition.row) {
            if (params.position.line === child.startPosition.row &&
                params.position.character < child.startPosition.column) {
                break; // Cursor is before this node
            }
            if (params.position.line === child.endPosition.row &&
                params.position.character > child.endPosition.column) {
                continue; // Cursor is after this node
            }
            index = i;
            break;
        }
    }

    const _type = grammarSyntax["rules"][type];
    if (!_type) {
        return [];
    }

    const members = grammarSyntax["rules"][type]["members"];
    if (!members) {
        return [];
    }

    const currentSyntaxNode = members[index];
    if (!currentSyntaxNode) {
        return []
    }

    return getCompletionItems(currentSyntaxNode)
}

const isOptional = (node: GrammarNode & { members?: any }) => {
    if (!node.members) return false
    if (!node.members.length) return false
    return node.members.at(-1)?.type === "BLANK"
}

const getCompletionItems = (node: GrammarNode) => {
    const items: CompletionItem[] = [];
    let optional = isOptional(node)

    const getItems = (node: GrammarNode) => {
        switch (node.type) {
            case "CHOICE":
                node.members.forEach(x => getItems(x))
                break;
            case "REPEAT":
                getItems(node.content)
                break;
            case "SEQ":
                getItems(node.members[0])
                break;
            case "STRING":
                items.push({
                    label: node.value,
                    kind: CompletionItemKind.Keyword,
                    labelDetails: optional ? {
                        detail: " - optional keyword"
                    } : {}
                });
                break;
        }
    }
    getItems(node);
    return items;
}

const treeSitterCompletion = (params: CompletionParams, tree: Tree): CompletionItem[] => {

    let node: SyntaxNode | null = tree.rootNode.descendantForPosition({
        row: params.position.line,
        column: params.position.character
    });

    if (node.hasError()) {
        node = node.parent || null
    }

    if (!node) {
        return [];
    }

    return checkCursorWithinGroup(node, params)
}*/

const completionProvider = (singleTons: SingleTons): (params: CompletionParams) => Promise<CompletionList | CompletionItem[]> => {
    const {
        documents,
        trees,
        buffers,
    } = singleTons

    return async (params) => {
        const doc = documents.get(params.textDocument.uri)!;
        const tree = trees.get(params.textDocument.uri);
        if (!tree) {
            return [];
        }

        const bucket: CompletionItem[] = []

        const getSymbols = buffers.get(params.textDocument.uri);

        if (!getSymbols) {
            return bucket;
        }

        const offset = doc.offsetAt(params.position);

        let uniqueSymbol;
        const rt = tree.rootNode.descendantForIndex(offset)
        uniqueSymbol = getSymbols.buffer.get(rt.startIndex)

        if (!uniqueSymbol) {
            return scopedCompletionProvider(null)
        }

        const auto = uniqueSymbol.missingAutoComplete()
        if (auto) {
            bucket.push(...auto)
            return bucket
        }

        bucket.push(...scopedCompletionProvider(uniqueSymbol))
        bucket.push(...uniqueSymbol.getCompletionItems())

        return bucket
    }
}

export default completionProvider;

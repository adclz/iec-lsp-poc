import { Diagnostic, Range } from "vscode-languageserver";
import { QueryCapture, SyntaxNode, Tree } from "web-tree-sitter";
import { NeedTypeCheck, Scope, Item } from "../symbol-table/items/definitions";
import { binder, BinderResult } from "./binder"
import { asLspRange, containsRange } from "../common/common";
import { LazySymbol, LazySymbolKind } from "./items/symbols/lazy";
import { GapBuffer } from "../common/gap-buffer";

type Node = {
    readonly range: Range;
    readonly item: BinderResult
}

export interface BuilderResult {
    rootNodes: Node[],
    lazyItems: Item[],
    typeChecks: NeedTypeCheck[],
    diagnostics: Diagnostic[] | null
}

export const builder = (captures: QueryCapture[], tree: Tree, buffer: GapBuffer<Item>, uri: string): BuilderResult => {
    let diagnostics: Diagnostic[] = []
    const rootNodes: Node[] = []
    const stack: Node[] = []
    const lazyItems: Item[] = []
    const typeChecks: NeedTypeCheck[] = []

    let parent: Node | undefined
    for (const capture of captures) {
        const item = binder(capture, uri);

        if (!item.item) continue
        if (item.err) {
            diagnostics.push(item.err)
            break;
        }
        if (item.typeCheck) {
            typeChecks.push(item.item as unknown as NeedTypeCheck)
        }
        buffer.insert(capture.node.startIndex, item.item)

        const node = { range: asLspRange(capture.node), items: [], item }

        parent = stack.pop();
        while (true) {
            if (!parent) {
                rootNodes.push(node);
                stack.push(node);
                break;
            }
            if (containsRange(parent.range, node.range)) {
                const attempt = parent.item.item!.addSymbol(node.item.item!, tree)
                if (attempt) {
                    diagnostics.push(...attempt)
                } else {
                    if (node.item.lazyItem) {
                        lazyItems.push(parent.item!.item!)
                        const lazy = node.item.item as LazySymbol
                        if (lazy.kind === LazySymbolKind.Reference) parent.item.item!.addLazyReference(lazy)
                        if (lazy.kind === LazySymbolKind.TypeReference) parent.item.item!.addLazyTypeReference(lazy)
                    }
                }
                stack.push(parent);
                stack.push(node);
                break;
            }
            parent = stack.pop();
        }
    }

    return {
        rootNodes,
        lazyItems,
        typeChecks,
        diagnostics: diagnostics.length ? diagnostics : null
    }
}
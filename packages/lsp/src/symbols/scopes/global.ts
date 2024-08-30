import IntervalTree from "@flatten-js/interval-tree";
import { Scope, ScopeOrSymbol } from "../definitions";
import { CompletionItem, CompletionItemKind, Diagnostic } from "vscode-languageserver";
import { VariableScope } from "./variable";
import { TypeScope } from "./type";

export class GlobalScope extends Scope {
    symbols: IntervalTree<ScopeOrSymbol>
    items: Record<string, ScopeOrSymbol> = {}

    constructor(range: any, uri: string, symbols: IntervalTree<ScopeOrSymbol>) {
        super(range, uri)
        this.symbols = symbols
    }

    public getCompletionItems(): CompletionItem[] {
        const items: CompletionItem[] = []
        Object.entries(this.items)
            .forEach(([key, value]) => {
                return items.push(...value.getCompletionItem())
            })
            return items
    }

    public findReference(name: string) {
        const symbol = this.items[name]
        if (symbol instanceof VariableScope) {
            return symbol
        }
        return null
    }

    public findTypeReference(name: string) {
        const symbol = this.items[name]
        if (symbol instanceof TypeScope) {
            return symbol
        }
        return null
    }
}

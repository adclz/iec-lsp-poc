import { Scope, Item } from "../definitions";
import { CompletionItem, CompletionItemKind, Diagnostic } from "vscode-languageserver";
import { VariableScope } from "./variable";
import { TypeScope } from "./type";
import { GapBuffer } from "../../../common/gap-buffer";

export class GlobalScope extends Scope {
    buffer: GapBuffer<Item>
    items: Record<string, Item> = {}

    constructor(uri: string, size: number, buffer: GapBuffer<Item>) {
        super(0, size, uri)
        this.buffer = buffer
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

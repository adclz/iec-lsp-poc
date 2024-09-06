import { CompletionItem, Diagnostic, Range } from "vscode-languageserver";
import { Item, Symbol } from "../definitions";

export enum LazySymbolKind {
    TypeReference,
    Reference
}

export class LazySymbol extends Symbol {
    _kind: LazySymbolKind
    name: string
    intervalRange: [number, number]

    constructor(offset: number, uri: string, intervalRange: [number, number], name: string, kind: LazySymbolKind) {
        super(offset, uri)
        this.name = name
        this.intervalRange = intervalRange
        this._kind = kind
    }

    public get getName() {
        return this.name!
    }

    public get getIntervalRange() {
        return this.intervalRange
    }

    public get kind() {
        return this._kind
    }

    public getCompletionItems(): CompletionItem[] {
        if (this.parent) {
            return this.parent.getCompletionItems()
        }
        return []
    }

    public missingAutoComplete() {
        if (this.parent) {
            return this.parent.missingAutoComplete()
        }
        return null
    }
}

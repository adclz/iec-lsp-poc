import { CompletionItem, Diagnostic, Range } from "vscode-languageserver";
import { Item, Symbol } from "../definitions";

export enum LazySymbolKind {
    TypeReference,
    Reference
}

export class LazySymbol extends Symbol {
    _kind: LazySymbolKind
    name: string

    constructor(offset: number, size: number, uri: string, name: string, kind: LazySymbolKind) {
        super(offset, size, uri)
        this.name = name
        this._kind = kind
    }

    public get getName() {
        return this.name!
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

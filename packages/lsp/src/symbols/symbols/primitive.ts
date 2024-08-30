import { CompletionItem, CompletionItemKind, Diagnostic, DocumentSymbol, SymbolKind as DocumentSymbolKind, Range } from "vscode-languageserver";
import { ScopeOrSymbol, Symbol } from "../definitions";
import { NameSymbol } from "./name";
import { PrimitiveTypesDefinitions } from "../../extends/completionsKind";
import { AnyTypeToGeneric } from "../../extends/type-checker";

export class PrimitiveSymbol extends Symbol {
    type: string

    constructor(range: Range, uri: string, type: string) {
        super(range, uri)
        this.type = type
    }

    public addSymbol(symbol: ScopeOrSymbol): Diagnostic[] | null {
        return null
    }

    public getDocumentSymbols(useParent?: boolean, name?: NameSymbol): DocumentSymbol[] {
        return [{
            name: name?.getName!,
            kind: DocumentSymbolKind.Field,
            range: useParent ? this.getParent!.getRange : this.getRange,
            selectionRange: name!.getRange!,
            children: []
        }]
    }

    public get getTypeName(): string {
        return this.type!
    }

    public get hoverInfo(): string {
        return PrimitiveTypesDefinitions[this.type!]!
    }

    getCompletionItem(name?: NameSymbol): CompletionItem[] {
        return [
            {
                label: name!.getName!,
                kind: CompletionItemKind.Property,
                detail: this.type
            }
        ];
    }

    public getPrimitiveIdentifier() {
        //@ts-ignore
        return AnyTypeToGeneric[this.type] || this.type
    }
}

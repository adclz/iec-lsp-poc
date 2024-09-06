import { CompletionItem, CompletionItemKind, Diagnostic, DocumentSymbol, SymbolKind as DocumentSymbolKind, Range } from "vscode-languageserver";
import { Item, Symbol } from "../definitions";
import { NameSymbol } from "./name";
import { PrimitiveTypesDefinitions } from "../../../extends/completionsKind";
import { AnyTypeToGeneric } from "../../../extends/type-checker";
import { Tree } from "web-tree-sitter";

export class PrimitiveSymbol extends Symbol {
    type: string

    constructor(offset: number, uri: string, type: string) {
        super(offset, uri)
        this.type = type
    }

    public getDocumentSymbols(tree: Tree, name?: NameSymbol): DocumentSymbol[] {
        return [{
            name: name?.getName!,
            kind: DocumentSymbolKind.Field,
            range: this.getParent!.getRange(tree),
            selectionRange: name!.getRange(tree),
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

import { Scope, ScopeOrSymbol } from "../definitions";
import { NameSymbol } from "../symbols/name";
import { CommentSymbol } from "../symbols/comment";
import { CompletionItem, CompletionItemKind, Diagnostic, DocumentSymbol, SymbolKind as DocumentSymbolKind, Range } from "vscode-languageserver";
import { ReferenceSymbol } from "../symbols/reference";
import { ValueSymbol } from "../symbols/value";
import { TypeReferenceSymbol } from "../symbols/typeReference";
import {  ArrayScope } from "./array";
import { EnumScope } from "./enum";
import { StructScope } from "./struct";
import { PrimitiveSymbol } from "../symbols/primitive";
import { FunctionScope } from "./function";

// A variable could be any of the following
type AnyFieldType = TypeReferenceSymbol | ReferenceSymbol | ArrayScope | EnumScope | StructScope | PrimitiveSymbol;

export class FieldScope extends Scope {
    private type?: AnyFieldType;
    private value?: ValueSymbol;

    addSymbol(symbol: ScopeOrSymbol): Diagnostic[] | null {
        if (symbol instanceof NameSymbol) {
            this.name = symbol;
            symbol.setParent(this);
            if (this.getParent instanceof StructScope) {
                return this.getParent.solveField(symbol.getName);
            }
        }
        if (symbol instanceof CommentSymbol) {
            this.comment = symbol;
            return null;
        }
        if (symbol instanceof TypeReferenceSymbol || symbol instanceof ReferenceSymbol
            || symbol instanceof ArrayScope || symbol instanceof EnumScope || symbol instanceof StructScope || symbol instanceof PrimitiveSymbol) {
            this.type = symbol;
            symbol.setParent(this);
            return null;
        }

        if (symbol instanceof ValueSymbol) {
            this.value = symbol;
            // TODO perform type checker
            symbol.setParent(this);
            return null;
        }
        return null
    }

    public get getTypeName(): string {
        return this.type?.getTypeName!
    }

    public get getName(): NameSymbol | undefined {
        return this.name;
    }

    get hoverInfo(): string {
        const name = this.name?.getName
        const comment = this.comment ? this.comment.getValue : "";
        const type = this.type?.getTypeName
        const value = this.value?.value


        let codeSnippet = `
\`\`\`typescript 
(property) ${name}: ${type} ${value ? `= ${value}` : ''}
\`\`\`
${comment}
`;
        return codeSnippet;
    }

    getDocumentSymbols(useParent?: boolean): DocumentSymbol[] {
        const mainSymbol: DocumentSymbol = {
            name: this.name!.getName!,
            kind: DocumentSymbolKind.Variable,
            range: useParent ? this.getParent!.getRange : this.getRange,
            selectionRange: this.name!.getRange,
        };
        return [mainSymbol];
    }

    getCompletionItems(): CompletionItem[] {
        return [
            {
                label: this.name!.getName!,
                kind: CompletionItemKind.Field,
            }
        ];
    }

    getPrimitiveIdentifier() {
        return this.type? this.type.getPrimitiveIdentifier() : null
    }
}

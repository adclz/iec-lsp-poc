import { CompletionItem, DocumentSymbol, Diagnostic } from "vscode-languageserver";
import { Scope, ScopeOrSymbol } from "../definitions";
import { NameSymbol } from "../symbols/name";
import { ArrayScope } from "./array";
import { PrimitiveSymbol } from "../symbols/primitive";
import { EnumScope } from "./enum";
import { StructScope } from "./struct";
import { TypeReferenceSymbol } from "../symbols/typeReference";
import { CommentSymbol } from "../symbols/comment";

type AnyType = ArrayScope | StructScope | EnumScope | PrimitiveSymbol;


export const findTypeScope = (symbol: ScopeOrSymbol): TypeScope | null => {
    if (symbol instanceof TypeScope) {
        return symbol;
    }
    if (symbol.getParent) {
        return findTypeScope(symbol.getParent);
    }
    return null;
}

export class TypeScope extends Scope {
    type: AnyType | null = null;
    typeReferences: TypeReferenceSymbol[] = [];

    addSymbol(symbol: ScopeOrSymbol): Diagnostic[] | null {
        if (symbol instanceof NameSymbol) {
            this.name = symbol;
            symbol.setParent(this);
        }
        if (symbol instanceof CommentSymbol) {
            this.comment = symbol;
            return null;
        }
        if (symbol instanceof PrimitiveSymbol
            || symbol instanceof ArrayScope || symbol instanceof EnumScope || symbol instanceof StructScope) {
            this.type = symbol;
            this.type.addSymbol(this.name!)
            symbol.setParent(this);
            return null;
        }
        return null
    }

    get hoverInfo(): string {
        const name = this.name?.getName;
        const comment = this.comment ? this.comment.getValue : "";
        const type = this.type?.getTypeName;

        let codeSnippet = `
\`\`\`typescript 
type ${name} = ${type}
\`\`\`
${comment}
`;
        return codeSnippet;
    }

    public getCompletionItem(): CompletionItem[] {
        if (this.type) {
            return this.type.getCompletionItem(this.name);
        }
        return []
    }

    getPrimitiveIdentifier() {
        return this.type!.getPrimitiveIdentifier()
    }

    get getType() {
        return this.type;
    }

    get getTypeName() {
        return this.type!.getTypeName
    }

    public findField(name: string): ScopeOrSymbol | null {
        return this.type!.findField(name)
    }

    public getCompletionItems(): CompletionItem[] {
        if (this.parent) {
            this.parent.getCompletionItems()
        }
        if (this.type) {
            return this.type.getCompletionItems();
        }
        return []
    }

    public getSignatureParameters(activeParameter?: number) {
        return this.type?.getSignatureParameters(activeParameter) || null
    }

    public getDocumentSymbols(): DocumentSymbol[] {
        if (this.type) {
            return this.type.getDocumentSymbols(true, this.name);
        }
        return []
    }
}
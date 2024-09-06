import { Scope, Item } from "../definitions";
import { NameSymbol } from "../symbols/name";
import { CompletionItem, CompletionItemKind, Diagnostic, DocumentSymbol, SymbolKind as DocumentSymbolKind, Range } from "vscode-languageserver";
import { CommentSymbol } from "../symbols/comment";
import { ArrayMinSymbol } from "../symbols/arrayMin";
import { ArrayMaxSymbol } from "../symbols/arrayMax";
import { StructScope } from "./struct";
import { TypeReferenceSymbol } from "../symbols/typeReference";
import { EnumScope } from "./enum";
import { PrimitiveSymbol } from "../symbols/primitive";
import { TypeScope } from "./type";
import { Tree } from "web-tree-sitter";

type AnyArrayType = TypeReferenceSymbol | PrimitiveSymbol | ArrayScope | EnumScope | StructScope;

export class ArrayScope extends Scope {
    private min?: ArrayMinSymbol
    private max?: ArrayMaxSymbol
    private type?: AnyArrayType
    private defaultValues?: AnyArrayType[]

    addSymbol(symbol: Item, tree: Tree): Diagnostic[] | null {
        if (symbol instanceof NameSymbol) {
            this.name = symbol;
            symbol.setParent(this);
        }
        if (symbol instanceof CommentSymbol) {
            this.comment = symbol;
        }
        if (symbol instanceof TypeReferenceSymbol
            || symbol instanceof PrimitiveSymbol || symbol instanceof ArrayScope || symbol instanceof EnumScope || symbol instanceof StructScope) {
            this.type = symbol;
            symbol.setParent(this);
        }
        if (symbol instanceof ArrayMinSymbol) {
            this.min = symbol;
        }
        if (symbol instanceof ArrayMaxSymbol) {
            this.max = symbol;
        }
        return null
    }

    get hoverInfo(): string {
        if (this.parent instanceof TypeScope) {
            return this.parent.hoverInfo
        }
        const name = this.name?.getName
        const comment = this.comment ? this.comment.getValue : "";
        const min = this.min?.value
        const max = this.max?.value
        const type = this.type?.getTypeName

        let codeSnippet = `
\`\`\`typescript 
${name} array<${min}..${max}> of ${type}
\`\`\`
${comment}
`;
        return codeSnippet;
    }

    get getTypeName(): string {
        const min = this.min?.value
        const max = this.max?.value
        const type = this.type?.getTypeName

        return `array<${min}..${max}> of ${type}`
    }

    getDocumentSymbols(tree: Tree): DocumentSymbol[] {
        const mainSymbol: DocumentSymbol = {
            name: this.name!.getName!,
            kind: DocumentSymbolKind.Array,
            range: this.getParent!.getRange(tree),
            selectionRange: this.name!.getRange(tree),
        };
        return [mainSymbol];
    }

    getCompletionItem(): CompletionItem[] {
        return [
            {
                label: this.name!.getName!,
                kind: CompletionItemKind.Property,
                detail: this.getTypeName,
            }
        ];
    }
}

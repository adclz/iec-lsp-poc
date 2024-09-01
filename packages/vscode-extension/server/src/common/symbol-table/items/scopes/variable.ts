import { NeedTypeCheck, Scope, Item } from "../definitions";
import { NameSymbol } from "../symbols/name";
import { CommentSymbol } from "../symbols/comment";
import { CompletionItem, CompletionItemKind, Diagnostic, DocumentSymbol, SymbolKind as DocumentSymbolKind, Range } from "vscode-languageserver";
import { ReferenceSymbol } from "../symbols/reference";
import { ValueSymbol } from "../symbols/value";
import { TypeReferenceSymbol } from "../symbols/typeReference";
import { ArrayScope } from "./array";
import { EnumScope } from "./enum";
import { StructScope } from "./struct";
import { PrimitiveSymbol } from "../symbols/primitive";
import { FunctionScope } from "./function";
import { SignatureScope } from "./signature"
import { solveLazy } from "../../lazy"
import IntervalTree from "@flatten-js/interval-tree";
import { simpleTypeMap } from "../../../extends/type-checker";
import { PrimitiveTypesDefinitions } from "../../../extends/completionsKind";

// A variable could be any of the following
type AllVariableTypes = TypeReferenceSymbol | ReferenceSymbol | ArrayScope | EnumScope | StructScope | PrimitiveSymbol;

export class VariableScope extends Scope implements NeedTypeCheck {
    private type?: AllVariableTypes;
    private value?: ValueSymbol;

    addSymbol(symbol: Item): Diagnostic[] | null {
        if (symbol instanceof NameSymbol) {
            this.name = symbol;
            symbol.setParent(this);
            if (this.getParent instanceof FunctionScope) {
                return this.getParent.solveVariable(symbol.getName);
            }
        }
        if (symbol instanceof CommentSymbol) {
            this.comment = symbol;
        }
        if (symbol instanceof TypeReferenceSymbol || symbol instanceof ReferenceSymbol
            || symbol instanceof ArrayScope || symbol instanceof EnumScope || symbol instanceof StructScope || symbol instanceof PrimitiveSymbol) {
            this.type = symbol;
            symbol.setParent(this);
        }

        if (symbol instanceof ValueSymbol) {
            this.value = symbol;
            symbol.setParent(this);
        }
        if (symbol instanceof SignatureScope) {
            this.signature = symbol;
            symbol.setParent(this);
        }
        return null
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
var ${name}: ${type} ${value ? `= ${value}` : ''}
\`\`\`
${comment}
`;
        return codeSnippet;
    }

    get getTypeName() {
        const type = this.type?.getTypeName || "[Unsolved]"
        const value = this.value?.value

        return `${type} ${value ? `= ${value}` : ''}`
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

    public getCompletionItem(): CompletionItem[] {
        return [
            {
                label: this.name!.getName!,
                kind: CompletionItemKind.Variable,
                detail: this.getTypeName
            }
        ];
    }

    getCompletionItems(): CompletionItem[] {
        return this.type?.getCompletionItems() || []
    }

    public findField(name: string): Item | null {
        return this.type?.findField(name) || null
    }

    public findTypeReference(name: string) {
        if (this.parent) {
            return this.parent.findTypeReference(name)
        }
        return null
    }

    public solveLazy(ranges: IntervalTree<Item>): Diagnostic[] | null {
        return solveLazy.call(this, ranges)
    }

    get getReferences() {
        return this._references;
    }

    typeCheck(): Diagnostic[] | null {
        if (this.type instanceof PrimitiveSymbol) {
            if (this.value) {
                const value = this.value.getPrimitiveIdentifier()!
                if (Array.isArray(value)) {
                    return value
                }
                return simpleTypeMap[this.type!.type!]!(value, this.value.getRange!)
            }
        }
        if (this.type instanceof TypeReferenceSymbol) {
            let type = this.type.getLinkedTypeReference
            if (type instanceof EnumScope) {

                if (this.value) {
                    const value = parseInt(this.value.value!)
                    if (isNaN(value)) {
                        return [Diagnostic.create(this.value.getRange, `Invalid value for enum ${type.getName?.getName}`, 1)]
                    }
                    else return type.checkEnumRange(value, this.value.getRange)
                }
            }
        }
        return null
    }

    getPrimitiveIdentifier() {
        return this.type?.getPrimitiveIdentifier() || null
    }

    getType() {
        return this.type
    }

    public missingAutoComplete(): CompletionItem[] | null {
        const items: CompletionItem[] = [
            ...this.parent?.getCompletionItems() || []
        ]

        if (!this.type) {
            items.push(...Object.entries(PrimitiveTypesDefinitions).map(([label, detail]) => {
                return {
                    label,
                    kind: CompletionItemKind.TypeParameter,
                    detail
                }
            }))
        }

        if (this.type && !this.value) {
            items.push(
                {
                    label: "SHOULD SEE THIS",
                    kind: CompletionItemKind.Variable,
                    detail: this.getTypeName
                }
            )
        }

        return items
    }
}

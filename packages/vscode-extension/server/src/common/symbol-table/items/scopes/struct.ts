import { Scope, Item } from "../definitions";
import { NameSymbol } from "../symbols/name";
import { CompletionItem, CompletionItemKind, Diagnostic, DocumentSymbol, SymbolKind as DocumentSymbolKind, ParameterInformation, Range, SignatureHelp } from "vscode-languageserver";
import { CommentSymbol } from "../symbols/comment";
import { TypeScope } from "./type";
import { FieldScope } from "./field";
import { Tree } from "web-tree-sitter";

export class StructScope extends Scope {
    temp_field?: FieldScope
    fields: Record<string, FieldScope> = {}

    addSymbol(symbol: Item, tree: Tree) {
        if (symbol instanceof NameSymbol) {
            this.name = symbol;
            symbol.setParent(this);
        }
        if (symbol instanceof CommentSymbol) {
            this.comment = symbol;
            return null;
        }
        if (symbol instanceof FieldScope) {
            this.temp_field = symbol;
            symbol.setParent(this);
            return null;
        }
        return null
    }

    solveField(name: string) {
        if (this.temp_field) {
            if (this.fields[name]) {
                return [
                    {
                        message: `Field ${name} is declared multiple times`,
                        //@ts-expect-error
                        range: this.temp_field.name!.range
                    },
                    {
                        message: `Field ${name} is declared multiple times`,
                        //@ts-expect-error
                        range: this.fields[name].name!.range
                    }
                ] as Diagnostic[];
            } else {
                this.fields[name] = this.temp_field;
                this.temp_field = undefined;
                return null;
            }
        }
        return null
    }

    getFields() {
        return this.fields;
    }

    get hoverInfo(): string {
        if (this.parent instanceof TypeScope) {
            return this.parent.hoverInfo
        }
        const name = this.name?.getName
        const comment = this.comment ? this.comment.getValue : "";

        let codeSnippet = `
\`\`\`typescript 
${name} struct 
\`\`\`
${comment}
`;
        return codeSnippet;
    }

    get getTypeName(): string {
        if (this.name?.getName) return `struct ${this.name.getName}`
        return `struct`
    }

    get getTypeReferences() {
        if (this.parent)
        return this.parent!.getTypeReferences
    return []
    }

    getDocumentSymbols(tree: Tree): DocumentSymbol[] {
        if (!this.name) return []
        const mainSymbol: DocumentSymbol = {
            name: this.name!.getName!,
            kind: DocumentSymbolKind.Struct,
            range: this.getParent!.getRange(tree),
            selectionRange: this.name!.getRange(tree),
            children: []
        };

        Object.values(this.fields).forEach(field => {
            if (field.getName)
            mainSymbol.children!.push(...field.getDocumentSymbols(tree));
        });

        return [mainSymbol];
    }

    getCompletionItems(): CompletionItem[] {
        return Object.entries(this.fields).map(([name, field]) => {
            return {
                label: name!,
                kind: CompletionItemKind.Property
            }
        })
    }

    getCompletionItem(): CompletionItem[] {
        return [
            {
                label: this.name!.getName!,
                kind: CompletionItemKind.Struct,
                detail: this.getTypeName,
            }
        ];
    }

    public getSignatureParameters(activeParameter?: number): SignatureHelp {
        const is = (index: number) => activeParameter === index ? "**" : ""
        const documentation = `${this.name?.getName}(${Object.entries(this.fields)
            .map(([name, field], index) => `${is(index)}${name} := ${field.getTypeName}${is(index)}`)
            .join(", ")})`
        return {
            signatures: [
                {
                    label: this.name?.getName!,
                    documentation: {
                        kind: "markdown",
                        value: documentation
                    },
                    parameters: Object.entries(this.fields)
                        .map(([name, field]) => {
                            return {
                                label: name,
                                documentation: {
                                    kind: "markdown",
                                    value: field.hoverInfo
                                }
                            } as ParameterInformation
                        })
                }
            ],
            activeSignature: 0,
            activeParameter: activeParameter || 0
        }
    }

    public findField(name: string): Item | null {
        return this.fields[name] || null
    }
}

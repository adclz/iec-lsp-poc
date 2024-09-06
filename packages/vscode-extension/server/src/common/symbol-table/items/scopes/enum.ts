import { Scope, Item } from "../definitions";
import { CommentSymbol } from "../symbols/comment";
import { EnumMemberSymbol } from "../symbols/enumMember";
import { NameSymbol } from "../symbols/name";
import { CompletionItem, CompletionItemKind, Diagnostic, DocumentSymbol, SymbolKind as DocumentSymbolKind, Range } from "vscode-languageserver";
import { TypeScope } from "./type";
import { Tree } from "web-tree-sitter";

export class EnumScope extends Scope {
    private members: EnumMemberSymbol[] = [];

    addSymbol(symbol: Item, tree: Tree): Diagnostic[] | null {
        if (symbol instanceof NameSymbol) {
            this.name = symbol;
            symbol.setParent(this);
        }
        if (symbol instanceof CommentSymbol) {
            this.comment = symbol;
        }
        if (symbol instanceof EnumMemberSymbol) {
            this.members.push(symbol);
            symbol.setParent(this);
        }
        return null;
    }

    get hoverInfo(): string {
        if (this.parent instanceof TypeScope) {
            return this.parent.hoverInfo
        }
        const name = this.name?.getName
        const comment = this.comment ? this.comment.getValue : "";

        let codeSnippet = `
\`\`\`typescript 
${name} enum
\`\`\`
${comment}
`;
        return codeSnippet;
    }

    get getTypeName(): string {
        return `enum`
    }

    getDocumentSymbols(tree: Tree): DocumentSymbol[] {
        const mainSymbol: DocumentSymbol = {
            name: this.name!.getName!,
            kind: DocumentSymbolKind.Enum,
            range: this.getParent!.getRange(tree),
            selectionRange: this.name!.getRange(tree),
            children: this.members
                .filter(member => member.getName)
                .map(member => {
                    return {
                        name: member.getName!,
                        kind: DocumentSymbolKind.EnumMember,
                        range: member.getRange(tree),
                        selectionRange: member.getRange(tree),
                    }
                }),
        };
        return [mainSymbol];
    }

    getCompletionItems(): CompletionItem[] {
        return this.members
            .map(member => {
                return {
                    label: member.getName!,
                    kind: CompletionItemKind.EnumMember
                }
            })
    }

    getCompletionItem(): CompletionItem[] {
        return [
            {
                label: this.name!.getName!,
                kind: CompletionItemKind.Enum
            }
        ];
    }

    get getMembers() {
        return this.members;
    }

    checkEnumRange(value: number, range: Range): Diagnostic[] | null {
        if (value < 0 || value >= this.members.length) {
            return [
                {
                    message: `Enum value ${value} is out of range for ${this.name?.getName}`,
                    range,
                    severity: 1
                }
            ] as Diagnostic[];
        }
        return null
    }

    public findField(name: string): Item | null {
        return this.members.find(member => member.getName === name) || null;
    }
}

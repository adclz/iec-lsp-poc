import { Item, Scope } from "../definitions";
import { NameSymbol } from "../symbols/name";
import { CommentSymbol } from "../symbols/comment";
import { VariableScope } from "./variable";
import { CompletionItem, CompletionItemKind, Diagnostic, DocumentSymbol, SymbolKind as DocumentSymbolKind, Range } from "vscode-languageserver";
import { ReferenceSymbol } from "../symbols/reference";
import { TypeReferenceSymbol } from "../symbols/typeReference";
import { ArrayScope } from "./array";
import { StructScope } from "./struct";
import { EnumScope } from "./enum";
import { PrimitiveSymbol } from "../symbols/primitive";
import { solveLazy } from "../../lazy";
import { Tree } from "web-tree-sitter";
import { GapBuffer } from "../../../common/gap-buffer";

// A function return type could be any of the following
type AllFunctionTypes = TypeReferenceSymbol | ReferenceSymbol | ArrayScope | EnumScope | StructScope | PrimitiveSymbol;


export class FunctionScope extends Scope {
    return_type?: AllFunctionTypes;
    temp_variable?: VariableScope;
    variables: Record<string, VariableScope> = {};
    references: ReferenceSymbol[] = []

    addSymbol(symbol: Item, tree: Tree): Diagnostic[] | null {
        if (symbol instanceof NameSymbol) {
            this.name = symbol;
            symbol.setParent(this);
        }
        if (symbol instanceof CommentSymbol) {
            this.comment = symbol;
        }
        if (symbol instanceof VariableScope) {
            this.temp_variable = symbol;
            symbol.setParent(this);
        }

        if (symbol instanceof TypeReferenceSymbol || symbol instanceof ReferenceSymbol
            || symbol instanceof ArrayScope || symbol instanceof EnumScope || symbol instanceof StructScope || symbol instanceof PrimitiveSymbol) {
            this.return_type = symbol;
            symbol.setParent(this);
            return null;
        }
        symbol.setParent(this);

        return null

    }

    get hoverInfo(): string {
        const name = this.name?.getName
        const comment = this.comment ? this.comment.getValue : "";
        let variables;
        if (this.variables) {
            variables = Object.entries(this.variables)
                .map(([name, value]) => `${name}: ${value.getTypeName}`)
        }
        const return_type = this.return_type?.getTypeName || "void"

        let codeSnippet = `
\`\`\`typescript 
function ${name}(${variables ? variables.join(", ") : ""}): ${return_type} 
\`\`\`
${comment}
`;
        return codeSnippet;
    }

    public get getTypeName(): string {
        return "Function"
    }

    solveVariable(name: string, tree: Tree,) {
        if (this.temp_variable) {
            if (this.variables[name]) {
                return [
                    {
                        message: `Variable ${name} is declared multiple times`,
                        range: this.temp_variable.getRange(tree)
                    },
                    {
                        message: `Variable ${name} is declared multiple times`,
                        range: this.variables[name]!.getName!.getRange(tree)
                    }
                ] as Diagnostic[];
            } else {
                this.variables[name] = this.temp_variable;
                this.temp_variable = undefined;
                return null;
            }
        }
        return null
    }

    getDocumentSymbols(tree: Tree): DocumentSymbol[] {
        if (!this.name) return []
        const mainSymbol: DocumentSymbol = {
            name: this.name!.getName!,
            kind: DocumentSymbolKind.Function,
            range: this.getRange(tree),
            selectionRange: this.name!.getRange(tree),
            children: []
        };

        Object.values(this.variables).forEach(item => {
            mainSymbol.children!.push(...item.getDocumentSymbols(tree));
        });

        return [mainSymbol];
    }

    getCompletionItem(): CompletionItem[] {
        return [
            {
                label: this.name!.getName!,
                kind: CompletionItemKind.Function,
            }
        ]
    }

    getCompletionItems(): CompletionItem[] {
        const items: CompletionItem[] = [];
        if (this.getParent) {
            items.push(...this.getParent.getCompletionItems());
        }
        Object.values(this.variables)
            .forEach(x => {
                items.push(...x.getCompletionItem());
            });
        return items;
    }

    findReference(name: string) {
        return this.variables[name] ||
            (this.getParent ? this.getParent.findReference(name) : null);
    }

    public findTypeReference(name: string) {
        if (this.parent) {
            return this.parent.findTypeReference(name)
        }
        return null
    }

    public solveLazy(tree: Tree, buffer: GapBuffer<Item>): Diagnostic[] | null {
        return solveLazy.call(this, tree, buffer)
    }

    getVariables() {
        return this.variables;
    }

    getPrimitiveIdentifier() {
        if (this.return_type instanceof PrimitiveSymbol) {
            return this.return_type.type
        }
        return null
    }
}

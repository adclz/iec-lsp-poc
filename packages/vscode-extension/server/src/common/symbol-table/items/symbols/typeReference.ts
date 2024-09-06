import { Tree } from "web-tree-sitter";
import { Item, Symbol } from "../definitions";
import { TypeScope } from "../scopes/type";

export class TypeReferenceSymbol extends Symbol {
    referTo?: TypeScope

    linkTypeReference(symbol: TypeScope) {
        this.referTo = symbol;
    }

    unlinkTypeReference() {
        this.referTo = undefined;
    }

    get getLinkedTypeReference() {
        return this.referTo;
    }

    public findField(name: string): Item | null {
        return this.referTo?.findField(name) || null
    }

    get getTypeName() {
        return this.referTo?.getTypeName!
    }

    public get hoverInfo() {
        return this.referTo?.hoverInfo!
    }

    public getDocumentSymbols(tree: Tree) {
        return this.referTo!.getDocumentSymbols(tree);
    }

    public getCompletionItems() {
        return this.referTo!.getCompletionItems();
    }

    public getSignatureParameters(activeParameter?: number) {
        return this.referTo?.getSignatureParameters(activeParameter) || null
    }

    public getPrimitiveIdentifier(tree: Tree): string | null {
        return this.referTo?.getPrimitiveIdentifier(tree) || null
    }
}


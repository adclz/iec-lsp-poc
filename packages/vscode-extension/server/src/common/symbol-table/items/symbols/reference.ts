import { Item, Symbol } from "../definitions";

type AnyReference =  Item;


export class ReferenceSymbol extends Symbol {
    referTo?: Item

    linkReference(symbol: Item) {
        this.referTo = symbol;
        // symbol.typeReferences.push(this);
    }

    unlinkReference() {
        this.referTo = undefined;
    }

    get getLinkedReference() {
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

    public getDocumentSymbols(useParent?: boolean) {
        return this.referTo!.getDocumentSymbols();
    }

    public getCompletionItems() {
        return this.referTo!.getCompletionItems();
    }

    public getSignatureParameters(activeParameter?: number) {
        return this.referTo?.getSignatureParameters(activeParameter) || null
    }

    public getPrimitiveIdentifier(): string | null {
        return this.referTo?.getPrimitiveIdentifier() || null
    }
}

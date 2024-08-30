import { ScopeOrSymbol, Symbol } from "../definitions";
import { FunctionScope } from "../scopes/function";
import { VariableScope } from "../scopes/variable";

type AnyReference =  ScopeOrSymbol;


export class ReferenceSymbol extends Symbol {
    referTo?: ScopeOrSymbol

    linkReference(symbol: ScopeOrSymbol) {
        this.referTo = symbol;
        // symbol.typeReferences.push(this);
    }

    unlinkReference() {
        this.referTo = undefined;
    }

    get getLinkedReference() {
        return this.referTo;
    }

    public findField(name: string): ScopeOrSymbol | null {
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

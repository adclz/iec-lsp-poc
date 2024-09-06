import { Diagnostic, Range } from "vscode-languageserver";
import { Symbol } from "../definitions";

export class ValueSymbol extends Symbol {
    value: string

    constructor(offset: number, uri: string, value: string) {
        super(offset, uri)
        this.value = value
    }

    public typeCheck(): Diagnostic[] | null {
        if (this.parent) {
            
        }
        return null
    }

    public getPrimitiveIdentifier(): string | null {
        return this.value
    }
}

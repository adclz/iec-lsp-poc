import { Range } from "vscode-languageserver";
import { Symbol } from "../definitions";

export class OperatorSymbol extends Symbol {
    value: string

    constructor(offset: number, uri: string,value: string) {
        super(offset, uri)
        this.value = value
    }
}

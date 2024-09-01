import { Range } from "vscode-languageserver";
import { Symbol } from "../definitions";

export class OperatorSymbol extends Symbol {
    value: string

    constructor(range: Range, uri: string,value: string) {
        super(range, uri)
        this.value = value
    }
}

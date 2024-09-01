import { Range } from "vscode-languageserver";
import { Symbol } from "../definitions";

export class ArrayMaxSymbol extends Symbol {
    value: number

    constructor(range: Range, uri: string, value: number) {
        super(range, uri)
        this.value = value
    }
}

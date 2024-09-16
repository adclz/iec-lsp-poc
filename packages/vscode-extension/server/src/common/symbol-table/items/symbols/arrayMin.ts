import { Range } from "vscode-languageserver";
import { Symbol } from "../definitions";

export class ArrayMinSymbol extends Symbol {
    value: number

    constructor(offset: number, size: number, uri: string, value: number) {
        super(offset, size, uri)
        this.value = value
    }
}

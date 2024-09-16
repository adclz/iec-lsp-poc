import { Range } from "vscode-languageserver";
import { Scope, Symbol } from "../definitions";

export class NameSymbol extends Symbol {
    value: string

    constructor(offset: number, size: number, uri: string, value: string) {
        super(offset, size, uri)
        this.value = value
    }

    public get getName() {
        return this.value;
    }

    public setParent(parent: Scope): void {
        this.parent = parent;
    }

    public get hoverInfo() {
        return this.getParent!.hoverInfo;
    }
}
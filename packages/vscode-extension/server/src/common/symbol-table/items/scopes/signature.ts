import { Diagnostic } from "vscode-languageserver";
import { Scope, Item } from "../definitions";
import { ReferenceSymbol } from "../symbols/reference";
import { ValueSymbol } from "../symbols/value";
import { CommentSymbol } from "../symbols/comment";
import { Tree } from "web-tree-sitter";
import { GapBuffer } from "../../../common/gap-buffer";


export class SignatureScope extends Scope {
    referTo: Item | null = null
    parametersType: Item[] = []
    parametersValue: Item[] = []

    public get parametersTypes(): Item[] {
        return this.parametersType
    }

    public get parametersValues(): Item[] {
        return this.parametersValue
    }

    public get getTypeName(): string {
        return this.referTo?.getTypeName || "Unknown"
    }

    public get getComment(): CommentSymbol | undefined {
        return this.referTo?.getComment
    }

    public addSymbol(symbol: Item, tree: Tree): Diagnostic[] | null {
        if (symbol instanceof ReferenceSymbol) {
            this.parametersType.push(symbol)
            symbol.setParent(this)
        }

        if (symbol instanceof ValueSymbol) {
            this.parametersValue.push(symbol)
            symbol.setParent(this)
        }

        return null
    }

    public getSignatureParameters() {
        return this.referTo?.getSignatureParameters(this.parametersTypes.length) || null
    }

    public setReferTo(symbol: Item): void {
        this.referTo = symbol
    }

    public solveLazy(tree: Tree, buffer: GapBuffer<Item>): Diagnostic[] | null {
        const errors: Diagnostic[] = []

        this.lazyReferences.forEach(item => {
            const exists = this.referTo!.findField(item.getName)
            if (exists) {
                const ref = new ReferenceSymbol(item.getOffset, item.getSize, item.getUri)
                ref.linkReference(exists)
                exists.addReference(ref)

                buffer.swap(item.getOffset, ref)
                this.addSymbol(ref, tree)
            } else {
                errors.push({
                    message: `Could not find reference ${item.name} in ${this.referTo?.getTypeName}`,
                    range: item.getRange(tree),
                    severity: 1
                })
            }
        })

        this.lazyReferences.length = 0
        this.lazyTypeReferences.length = 0
        return errors.length > 0 ? errors : null
    }
}
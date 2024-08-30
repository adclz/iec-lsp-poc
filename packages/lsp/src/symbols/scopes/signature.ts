import { Diagnostic } from "vscode-languageserver";
import { Scope, ScopeOrSymbol } from "../definitions";
import { ReferenceSymbol } from "../symbols/reference";
import { TypeReferenceSymbol } from "../symbols/typeReference";
import { ValueSymbol } from "../symbols/value";
import IntervalTree from "@flatten-js/interval-tree";
import { solveLazy } from "../type-checker/lazySolver";
import { CommentSymbol } from "../symbols/comment";


export class SignatureScope extends Scope {
    referTo: ScopeOrSymbol | null = null
    parametersType: ScopeOrSymbol[] = []
    parametersValue: ScopeOrSymbol[] = []

    public get parametersTypes(): ScopeOrSymbol[] {
        return this.parametersType
    }

    public get parametersValues(): ScopeOrSymbol[] {
        return this.parametersValue
    }

    public get getTypeName(): string {
        return this.referTo?.getTypeName || "Unknown"
    }

    public get getComment(): CommentSymbol | undefined {
        return this.referTo?.getComment
    }

    public addSymbol(symbol: ScopeOrSymbol): Diagnostic[] | null {
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

    public setReferTo(symbol: ScopeOrSymbol): void {
        this.referTo = symbol
    }

    public solveLazy(ranges: IntervalTree<ScopeOrSymbol>): Diagnostic[] | null {
        const errors: Diagnostic[] = []

        this.lazyReferences.forEach(item => {
            const exists = this.referTo!.findField(item.getName)
            if (exists) {
                const ref = new ReferenceSymbol(item.getRange, item.getUri)
                ref.linkReference(exists)
                exists.addReference(ref)

                const interval = item.getIntervalRange
                ranges.remove(interval, item)

                ranges.insert(interval, ref)
                this.addSymbol(ref)
            } else {
                errors.push({
                    message: `Could not find reference ${item.name} in ${this.referTo?.getTypeName}`,
                    range: item.getRange,
                    severity: 1
                })
            }
        })

        this.lazyReferences.length = 0
        this.lazyTypeReferences.length = 0
        return errors.length > 0 ? errors : null
    }
}
import { CompletionItem, Diagnostic, Range } from "vscode-languageserver";
import { Scope, Item } from "../definitions";
import { ValueSymbol } from "../symbols/value";
import { ReferenceSymbol } from "../symbols/reference";
import { OperatorSymbol } from "../symbols/operator";
import { TypesPromotions, AnyValueToGeneric, AnyTypeToGeneric } from "../../../extends/check-expression";
import { solveLazy } from "../../lazy";
import { referenceMulipleScope } from "./referenceMuliple";
import { Tree, TreeCursor } from "web-tree-sitter";
import { GapBuffer } from "../../../common/gap-buffer";

type Operand = ExpressionScope | ValueSymbol | ReferenceSymbol | referenceMulipleScope | null

export class ExpressionScope extends Scope {
    _members: (Operand | OperatorSymbol)[] = []

    public addSymbol(symbol: Item, tree: Tree): Diagnostic[] | null {
        if (symbol instanceof OperatorSymbol) {
            this._members.push(symbol)
            symbol.setParent(this)
        }
        if (symbol instanceof ExpressionScope || symbol instanceof ValueSymbol || symbol instanceof ReferenceSymbol || symbol instanceof referenceMulipleScope) {
            this._members.push(symbol)
            symbol.setParent(this)
        }
        return null
    }

    public getTypeOfExpression(tree: Tree): Diagnostic[] | string {
        let left: string | null,
            operator: string | null,
            right: string | null = null

        if (this._members.length === 1) {
            const identifer = this._members[0]!.getPrimitiveIdentifier(tree)
            if (identifer) return identifer
            return [{
                message: `Failed to determine type of expression`,
                range: this.getRange(tree),
                severity: 1
            }]
        }

        const check = () => {
            if (left && operator && right) {
                const operator1 = TypesPromotions[operator]
                if (!operator1) {
                    return [{
                        message: `Cannot perform operation ${left} ${operator} ${right}`,
                        range: this.getRange,
                        severity: 1
                    }]
                }
                const promotion1 = TypesPromotions[operator][left]
                if (!promotion1) {
                    return [{
                        message: `Cannot perform operation ${left} ${operator} ${right}`,
                        range: this.getRange,
                        severity: 1
                    }]
                }
                const promotion2 = promotion1[right]
                if (!promotion2) {
                    return [{
                        message: `Cannot perform operation ${left} ${operator} ${right}`,
                        range: this.getRange,
                        severity: 1
                    }]
                }
                left = promotion2
                operator = null
                right = null
            }
        }

        this._members.forEach(member => {
            check()
            if (member instanceof OperatorSymbol) {
                operator = member.value
            }
            const identifer = member!.getPrimitiveIdentifier(tree)

            if (identifer) {
                if (!left) left = AnyValueToGeneric(identifer)
                else right = AnyValueToGeneric(identifer)
            }
            else {
                return [{
                    message: `Failed to determine type of expression`,
                    range: this.getRange,
                    severity: 1
                }]
            }
        })

        check()

        return left!
    }

    public typeCheck(tree: Tree): Diagnostic[] | null {
        const traverse = this.getTypeOfExpression(tree)
        if (traverse instanceof Array) return traverse
        //console.log(traverse)
        return null
    }

    public getPrimitiveIdentifier(tree: Tree): string | null {
        const identifer = this.getTypeOfExpression(tree)
        if (Array.isArray(identifer)) return null
        return identifer
    }

    public solveLazy(tree: Tree, buffer: GapBuffer<Item>): Diagnostic[] | null {
        return solveLazy.call(this, tree, buffer)
    }

    public missingAutoComplete(): CompletionItem[] | null {
        const last = this._members.at(-1)
        if (last instanceof referenceMulipleScope) {
            return last.getCompletionItems()
        }
        else if (this.parent) {
            return this.parent.getCompletionItems()
        }
        return null
    }
}
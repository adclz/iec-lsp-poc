import { Diagnostic } from "vscode-languageserver";
import { NeedTypeCheck, Scope, Item, } from "../definitions";
import { ReferenceSymbol } from "../symbols/reference";
import { ExpressionScope } from "./expression";
import { VariableScope } from "./variable";
import { PrimitiveSymbol } from "../symbols/primitive";
import { AnyTypeToGeneric, simpleTypeMap } from "../../../extends/type-checker";
import IntervalTree from "@flatten-js/interval-tree";
import { solveLazy } from "../../lazy";
import { referenceMulipleScope } from "./referenceMuliple";

type Assignable = ReferenceSymbol | referenceMulipleScope

export class AssignScope extends Scope implements NeedTypeCheck {
    assign?: Assignable;
    to?: Item;

    addSymbol(symbol: Item) {
        if (symbol instanceof ReferenceSymbol) {
            this.assign = symbol;
            symbol.setParent(this);
        }

        if (symbol instanceof referenceMulipleScope) {
            this.assign = symbol;
            symbol.setParent(this);
        }

        if (symbol instanceof ExpressionScope) {
            this.to = symbol;
            symbol.setParent(this);
        }
        return null;
    }

    public typeCheck(): Diagnostic[] | null {
        const asg = this.assign?.getPrimitiveIdentifier()
        if (asg) {
            const value = this.to?.getPrimitiveIdentifier()!
            if (Array.isArray(value)) {
                return value
            }
            return simpleTypeMap[asg](value, this.to?.getRange!)
        }
        else {
            return [{
                message: `Cannot assign`,
                range: this.assign?.getRange
            } as Diagnostic]
        }
    }

    public solveLazy(ranges: IntervalTree<Item>): Diagnostic[] | null {
        return solveLazy.call(this, ranges)
    }
}
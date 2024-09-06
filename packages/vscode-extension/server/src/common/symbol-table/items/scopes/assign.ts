import { Diagnostic } from "vscode-languageserver";
import { NeedTypeCheck, Scope, Item, } from "../definitions";
import { ReferenceSymbol } from "../symbols/reference";
import { ExpressionScope } from "./expression";
import { AnyTypeToGeneric, simpleTypeMap } from "../../../extends/type-checker";
import { solveLazy } from "../../lazy";
import { referenceMulipleScope } from "./referenceMuliple";
import { Tree } from "web-tree-sitter";
import { GapBuffer } from "../../../common/gap-buffer";

type Assignable = ReferenceSymbol | referenceMulipleScope

export class AssignScope extends Scope implements NeedTypeCheck {
    assign?: Assignable;
    to?: Item;

    addSymbol(symbol: Item, tree: Tree) {
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

    public typeCheck(tree: Tree): Diagnostic[] | null {
        const asg = this.assign?.getPrimitiveIdentifier(tree)
        if (asg) {
            const value = this.to?.getPrimitiveIdentifier(tree)!
            if (Array.isArray(value)) {
                return value
            }
            return simpleTypeMap[asg](value, this.to?.getRange(tree)!)
        }
        else {
            return [{
                message: `Cannot assign`,
                range: this.assign?.getRange(tree)
            } as Diagnostic]
        }
    }

    public solveLazy(tree: Tree, buffer: GapBuffer<Item>): Diagnostic[] | null {
        return solveLazy.call(this, tree, buffer)
    }
}
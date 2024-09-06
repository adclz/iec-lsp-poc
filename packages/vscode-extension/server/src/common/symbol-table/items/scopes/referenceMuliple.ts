import { CompletionItem, Diagnostic } from "vscode-languageserver";
import { Scope, Item } from "../definitions";
import { ReferenceSymbol } from "../symbols/reference";
import { LazySymbol } from "../symbols/lazy";
import { EnumScope } from "./enum";
import { TypeReferenceSymbol } from "../symbols/typeReference";
import { Tree } from "web-tree-sitter";
import { GapBuffer } from "../../../common/gap-buffer";

function filterInPlace<T>(array: T[], condition: (...args: any[]) => boolean) {
    var iOut = 0;
    for (var i = 0; i < array.length; i++)
        if (condition(array[i]))
            array[iOut++] = array[i];
    array.length = iOut;
}

export class referenceMulipleScope extends Scope {
    current: Item | null = null
    items: (TypeReferenceSymbol | ReferenceSymbol)[] = []
    lazyConstruct: LazySymbol[] = []

    addSymbol(symbol: Item, tree: Tree) {
        if (symbol instanceof ReferenceSymbol || symbol instanceof TypeReferenceSymbol) {
            this.items.push(symbol)
            symbol.setParent(this)
        }
        return null
    }

    public addLazyReference(name: LazySymbol): void {
        this.lazyConstruct.push(name)
        name.setParent(this)
    }

    public addLazyTypeReference(name: LazySymbol): void {
        this.lazyConstruct.push(name)
        name.setParent(this)
    }

    public solveLazy(tree: Tree, buffer: GapBuffer<Item>): Diagnostic[] | null {
        const errors: Diagnostic[] = []

        this.lazyConstruct.forEach((item, index) => {
            // First element could be an enum so we also check for types
            if (index == 0) {
                const exists = this.findTypeReference(item.getName)
                if (exists) {
                    if (exists.getType instanceof EnumScope) {
                        const ref = new TypeReferenceSymbol(item.getOffset, item.getUri)
                        ref.linkTypeReference(exists)
                        exists.addTypeReference(ref)

                        buffer.swap(item.getOffset, ref)
                        this.addSymbol(ref, tree)

                        this.current = exists
                    }
                    else {
                        errors.push({
                            message: `${item.getName} is not a reference or valid enum name`,
                            range: item.getRange(tree),
                            severity: 1
                        })
                    }
                }
                else {
                    const exists = this.findReference(item.getName)
                    if (exists) {
                        const ref = new ReferenceSymbol(item.getOffset, item.getUri)
                        ref.linkReference(exists)
                        exists.addReference(ref)
                        this.addSymbol(ref, tree)

                        buffer.swap(item.getOffset, ref)
                        this.addSymbol(ref, tree)

                        this.current = exists
                    }
                    else errors.push({
                        message: `Could not find type or reference ${item.getName}`,
                        range: item.getRange(tree),
                        severity: 1
                    })
                }
            }
            // if base is set, we iter through the target type
            else {
                const base = this.current!
                if (base) {
                    const exists = base.findField(item.getName)
                    if (exists) {
                        const ref = new ReferenceSymbol(item.getOffset, item.getUri)
                        ref.linkReference(exists)
                        exists.addReference(ref)
                        this.addSymbol(ref, tree)

                        buffer.swap(item.getOffset, ref)
                        this.addSymbol(ref, tree)

                        this.current = exists
                    } else {
                        errors.push({
                            message: `Could not find field ${item.getName} in ${base.getTypeName}`,
                            range: item.getRange(tree),
                            severity: 1
                        })
                    }
                }
            }
        })
        this.lazyConstruct = []
        return errors.length > 0 ? errors : null
    }

    public getCompletionItems(): CompletionItem[] {
        if (this.current) {
            return this.current.getCompletionItems()
        }
        return []
    }

    public missingAutoComplete(): CompletionItem[] | null {
        if (this.current) {
            return this.current.getCompletionItems()
        }
        return null
    }

    public getPrimitiveIdentifier(tree: Tree): string | null {
        return this.items.at(-1)?.getPrimitiveIdentifier(tree) || null
    }
}
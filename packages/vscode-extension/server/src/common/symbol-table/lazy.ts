import { Diagnostic } from "vscode-languageserver"
import { ReferenceSymbol } from "./items/symbols/reference"
import { TypeReferenceSymbol } from "./items/symbols/typeReference"
import { Item } from "./items/definitions"
import IntervalTree from "@flatten-js/interval-tree"
import { search } from "../common/intervals"
import { VariableScope } from "./items/scopes/variable"

export const solveLazy = function (this: Item, ranges: IntervalTree<Item>): Diagnostic[] | null  {
    const errors: Diagnostic[] = []

    this.lazyReferences.forEach(item => {
       const exists = this.findReference(item.getName)
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
                 message: `Could not find reference ${item.name}`,
                 range: item.getRange,
                 severity: 1
            })
       }
    })

    this.lazyTypeReferences.forEach(item => {
        const exists = this.findTypeReference(item.getName)
        if (exists) {
             const ref = new TypeReferenceSymbol(item.getRange, item.getUri)
             ref.linkTypeReference(exists)
             exists.addTypeReference(ref)

             const interval = item.getIntervalRange
             ranges.remove(interval, item)

             ranges.insert(interval, ref)
             this.addSymbol(ref)
        } else {
             errors.push({
                  message: `Could not find type ${item.name}`,
                  range: item.getRange,
                  severity: 1
             })
        }
     })

     if (this.signature && this instanceof VariableScope) {
          const exists = this.getType()
          if (exists) {
               this.signature.setReferTo(exists)
          }
     }

     this.lazyReferences.length = 0
     this.lazyTypeReferences.length = 0
     return errors.length > 0 ? errors : null
}
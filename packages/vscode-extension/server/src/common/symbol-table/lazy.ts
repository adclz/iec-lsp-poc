import { Diagnostic } from "vscode-languageserver"
import { ReferenceSymbol } from "./items/symbols/reference"
import { TypeReferenceSymbol } from "./items/symbols/typeReference"
import { Item } from "./items/definitions"
import { VariableScope } from "./items/scopes/variable"
import { Tree } from "web-tree-sitter"
import { GapBuffer } from "../common/gap-buffer"

export const solveLazy = function (this: Item, tree: Tree, buffer: GapBuffer<Item>): Diagnostic[] | null  {
    const errors: Diagnostic[] = []

    this.lazyReferences.forEach(item => {
       const exists = this.findReference(item.getName)
       if (exists) {
            const ref = new ReferenceSymbol(item.getOffset, item.getUri)
            ref.linkReference(exists)
            exists.addReference(ref)

            buffer.swap(item.getOffset, ref)
            this.addSymbol(ref, tree)
       } else {
            errors.push({
                 message: `Could not find reference ${item.name}`,
                 range: item.getRange(tree),
                 severity: 1
            })
       }
    })

    this.lazyTypeReferences.forEach(item => {
        const exists = this.findTypeReference(item.getName)
        if (exists) {
             const ref = new TypeReferenceSymbol(item.getOffset, item.getUri)
             ref.linkTypeReference(exists)
             exists.addTypeReference(ref)

             buffer.swap(item.getOffset, ref)
             this.addSymbol(ref, tree)
        } else {
             errors.push({
                  message: `Could not find type ${item.name}`,
                  range: item.getRange(tree),
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
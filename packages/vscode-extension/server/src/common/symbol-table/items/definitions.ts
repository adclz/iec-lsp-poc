import { CompletionItem, Diagnostic, DocumentSymbol, ParameterInformation, Range, SignatureHelp } from "vscode-languageserver"
import { NameSymbol } from "./symbols/name"
import { CommentSymbol } from "./symbols/comment"
import { TypeScope } from "./scopes/type"
import { VariableScope } from "./scopes/variable"
import { LazySymbol } from "./symbols/lazy"
import { TypeReferenceSymbol } from "./symbols/typeReference"
import { ReferenceSymbol } from "./symbols/reference"
import { SignatureScope } from "./scopes/signature"
import { Tree } from "web-tree-sitter"
import { GapBuffer } from "../../common/gap-buffer"

type TypeReference = TypeScope
type Reference = VariableScope

export abstract class Item {
    private _offset: number
    private uri: string
    protected parent?: Scope
    private _lazyReferences: LazySymbol[] = []
    private _lazyTypeReferences: LazySymbol[] = []
    protected _references: ReferenceSymbol[] = [];
    protected _typeReferences: TypeReferenceSymbol[] = [];
    protected signature?: SignatureScope
    protected comment?: CommentSymbol

    constructor(offset: number, uri: string, parent?: Scope) {
        this._offset = offset
        this.uri = uri
        this.parent = parent
    }

    public get getOffset() {
        return this._offset
    }

    public set setOffset(offset: number) {
        this._offset = offset
    }

    public getRange(tree: Tree): Range {
        const node = tree.rootNode.namedDescendantForIndex(this._offset)
        return {
            start: {
                line: node.startPosition.row,
                character: node.startPosition.column
            },
            end: {
                line: node.endPosition.row,
                character: node.endPosition.column
            }
        }
    }

    public get getUri() {
        return this.uri
    }

    public get hoverInfo(): string | null {
        return null
    }

    public get getTypeName(): string {
        return "Unknown"
    }

    public addSymbol(symbol: Item, tree: Tree): Diagnostic[] | null {
        return null
    }

    public setParent(parent: Scope) {
        this.parent = parent
    }

    public get getParent() {
        return this.parent
    }

    public getDocumentSymbols(tree: Tree): DocumentSymbol[] {
        return []
    }

    public getCompletionItem(): CompletionItem[] {
        return []
    }

    public getCompletionItems(): CompletionItem[] {
        if (this.parent) {
            return this.parent.getCompletionItems()
        }
        return []
    }

    public getSignatureParameters(activeParameter?: number): SignatureHelp | null {
        return null
    }

    public missingAutoComplete(): CompletionItem[] | null {
        return null
    }

    public findReference(name: string): Reference | null {
        if (this.parent) {
            return this.parent.findReference(name)
        }
        return null
    }

    public addReference(reference: ReferenceSymbol) {
        this._references.push(reference)
    }

    public addTypeReference(reference: TypeReferenceSymbol) {
        this._typeReferences.push(reference)
    }

    public get getReferences() {
        return this._references
    }

    public get getTypeReferences() {
        return this._typeReferences
    }

    public findTypeReference(name: string): TypeReference | null {
        if (this.parent) {
            return this.parent.findTypeReference(name)
        }
        return null
    }

    public solveLazy(tree: Tree, buffer: GapBuffer<Item>): Diagnostic[] | null {
        return null
    }

    public addLazyReference(name: LazySymbol) {
        this._lazyReferences.push(name)
        //@ts-expect-error
        name.setParent(this)
    }

    public addLazyTypeReference(name: LazySymbol) {
        this._lazyTypeReferences.push(name)
        //@ts-expect-error
        name.setParent(this)
    }

    public get lazyReferences() {
        return this._lazyReferences
    }

    public get lazyTypeReferences() {
        return this._lazyTypeReferences
    }

    public findField(name: string): Item | null {
        return null
    }

    public getPrimitiveIdentifier(tree: Tree): string | null {
        return null
    }

    public get getComment(): CommentSymbol | undefined {
        return this.comment
    }
}

export interface NeedTypeCheck {
    typeCheck(tree: Tree): Diagnostic[] | null
}

export abstract class Scope extends Item {
    protected name?: NameSymbol

    public get getName(): NameSymbol | undefined {
        return this.name
    }

    public setName(name: NameSymbol) {
        this.name = name
    }

    public setComment(comment: CommentSymbol) {
        this.comment = comment
    }
}


export abstract class Symbol extends Item {

}

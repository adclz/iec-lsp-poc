import { Scope, Item } from "./items/definitions"
import IntervalTree from "@flatten-js/interval-tree";
import { Diagnostic, Range } from "vscode-languageserver";
import { simpleTypeMap } from "../extends/type-checker";
import { ArrayScope } from "./items/scopes/array";
import { EnumScope } from "./items/scopes/enum";
import { FunctionScope } from "./items/scopes/function";
import { StructScope } from "./items/scopes/struct";
import { TypeScope } from "./items/scopes/type";
import { VariableScope } from "./items/scopes/variable";
import { ArrayMaxSymbol } from "./items/symbols/arrayMax";
import { ArrayMinSymbol } from "./items/symbols/arrayMin";
import { EnumMemberSymbol } from "./items/symbols/enumMember";
import { NameSymbol } from "./items/symbols/name";
import { PrimitiveSymbol } from "./items/symbols/primitive";
import { ValueSymbol } from "./items/symbols/value";
import { AssignScope } from "./items/scopes/assign";
import { FieldScope } from "./items/scopes/field";
import { ExpressionScope } from "./items/scopes/expression";
import { LazySymbol, LazySymbolKind } from "./items/symbols/lazy";
import { OperatorSymbol } from "./items/symbols/operator";
import { referenceMulipleScope } from "./items/scopes/referenceMuliple";
import { SignatureScope } from "./items/scopes/signature";
import { QueryCapture } from "web-tree-sitter";

export type BinderResult = { err?: Diagnostic, item?: Item, lazyItem?: boolean, typeCheck?: boolean }

export const create = (query: QueryCapture, ranges: IntervalTree<Item>, uri: string, lspRange: Range)
    : BinderResult => {
    let result: BinderResult = {}

    if (query.name === "function") result.item = new FunctionScope(lspRange, uri)
    if (query.name === "variable") {result.item = new VariableScope(lspRange, uri); result.typeCheck = true}
    if (query.name === "enum") result.item = new EnumScope(lspRange, uri)
    if (query.name === "array") result.item = new ArrayScope(lspRange, uri)
    if (query.name === "struct") result.item = new StructScope(lspRange, uri)
    if (query.name === "field") result.item = new FieldScope(lspRange, uri)
    if (query.name === "array.min") result.item = new ArrayMinSymbol(lspRange, uri, parseInt(query.node.text))
    if (query.name === "array.max") result.item = new ArrayMaxSymbol(lspRange, uri, parseInt(query.node.text))
    if (query.name === "operator") result.item = new OperatorSymbol(lspRange, uri, query.node.text)
    if (query.name === "enumMember") result.item = new EnumMemberSymbol(lspRange, uri, query.node.text)
    if (query.name === "assign") result.item = new AssignScope(lspRange, uri)
    if (query.name === "value") result.item = new ValueSymbol(lspRange, uri, query.node.text)
    if (query.name === "name") result.item = new NameSymbol(lspRange, uri, query.node.text)
    if (query.name === "type") result.item = new TypeScope(lspRange, uri)
    if (query.name === "expression") {result.item = new ExpressionScope(lspRange, uri); result.typeCheck = true}
    if (query.name === "lazy.reference.multi") result.item = new referenceMulipleScope(lspRange, uri)
    if (query.name === "assign") {result.item = new AssignScope(lspRange, uri); result.typeCheck = true}
    if (query.name === "signature") {
        result.item = new SignatureScope(lspRange, uri)
        result.lazyItem = true
    }
        
    if (query.name === "lazy.type") {
        const name = query.node.text;
        // check if type is primitive
        const isSimpleType = simpleTypeMap[name];
        if (typeof isSimpleType !== "undefined") {
            result.item = new PrimitiveSymbol(lspRange, uri, name)
        }
        // check if a type has the same name
        else {
            result.item = new LazySymbol(lspRange, uri, [query.node.startIndex, query.node.endIndex], query.node.text, LazySymbolKind.TypeReference)
            result.lazyItem = true
        }
    }

    if (query.name === "lazy.reference") {
        result.item = new LazySymbol(lspRange, uri, [query.node.startIndex, query.node.endIndex], query.node.text, LazySymbolKind.Reference)
        result.lazyItem = true
    }

    if (result.item) {
        ranges.insert([query.node.startIndex, query.node.endIndex], result.item)
    }
    return result
}
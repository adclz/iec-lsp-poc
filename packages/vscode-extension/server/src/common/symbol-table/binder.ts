import { Scope, Item } from "./items/definitions"
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

export const binder = (query: QueryCapture, uri: string)
    : BinderResult => {
    let result: BinderResult = {}

    // TODO: eventually convert to switch 
    if (query.name === "function") result.item = new FunctionScope(query.node.startIndex, query.node.endIndex, uri)
    else if (query.name === "variable") { result.item = new VariableScope(query.node.startIndex, query.node.endIndex, uri); result.typeCheck = true }
    else if (query.name === "enum") result.item = new EnumScope(query.node.startIndex, query.node.endIndex, uri)
    else if (query.name === "array") result.item = new ArrayScope(query.node.startIndex, query.node.endIndex, uri)
    else if (query.name === "struct") result.item = new StructScope(query.node.startIndex, query.node.endIndex, uri)
    else if (query.name === "field") result.item = new FieldScope(query.node.startIndex, query.node.endIndex, uri)
    else if (query.name === "array.min") result.item = new ArrayMinSymbol(query.node.startIndex, query.node.endIndex, uri, parseInt(query.node.text))
    else if (query.name === "array.max") result.item = new ArrayMaxSymbol(query.node.startIndex, query.node.endIndex, uri, parseInt(query.node.text))
    else if (query.name === "operator") result.item = new OperatorSymbol(query.node.startIndex, query.node.endIndex, uri, query.node.text)
    else if (query.name === "enumMember") result.item = new EnumMemberSymbol(query.node.startIndex, query.node.endIndex, uri, query.node.text)
    else if (query.name === "assign") result.item = new AssignScope(query.node.startIndex, query.node.endIndex, uri)
    else if (query.name === "value") result.item = new ValueSymbol(query.node.startIndex, query.node.endIndex, uri, query.node.text)
    else if (query.name === "name") result.item = new NameSymbol(query.node.startIndex, query.node.endIndex, uri, query.node.text)
    else if (query.name === "type") result.item = new TypeScope(query.node.startIndex, query.node.endIndex, uri)
    else if (query.name === "expression") { result.item = new ExpressionScope(query.node.startIndex, query.node.endIndex, uri); result.typeCheck = true }
    else if (query.name === "lazy.reference.multi") 
        result.item = new referenceMulipleScope(query.node.startIndex, query.node.endIndex, uri)
    else if (query.name === "assign") { result.item = new AssignScope(query.node.startIndex, query.node.endIndex, uri); result.typeCheck = true }
    else if (query.name === "signature") {
        result.item = new SignatureScope(query.node.startIndex, query.node.endIndex, uri)
        result.lazyItem = true
    }

    else if (query.name === "lazy.type") {
        const name = query.node.text;
        // check if type is primitive
        const isSimpleType = simpleTypeMap[name];
        if (typeof isSimpleType !== "undefined") {
            result.item = new PrimitiveSymbol(query.node.startIndex, query.node.endIndex, uri, name)
        }
        // check if a type has the same name
        else {
            result.item = new LazySymbol(query.node.startIndex, query.node.endIndex, uri, query.node.text, LazySymbolKind.TypeReference)
            result.lazyItem = true
        }
    }

    else if (query.name === "lazy.reference") {
        result.item = new LazySymbol(query.node.startIndex, query.node.endIndex, uri, query.node.text, LazySymbolKind.Reference)
        result.lazyItem = true
    }
    return result
}
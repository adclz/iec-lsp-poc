import { CompletionItem, CompletionItemKind, InsertTextFormat } from "vscode-languageserver"
import { Scope, Item } from "../symbol-table/items/definitions"
import { FunctionScope } from "../symbol-table/items/scopes/function"

const FunctionsCompletion: CompletionItem[] = [
    {
        label: "FUNCTION ... END_FUNCTION",
        kind: CompletionItemKind.Snippet,
        insertTextFormat: InsertTextFormat.Snippet,
        insertText: "FUNCTION ${1:function_name} : ${2:INT} \n\nEND_FUNCTION"
    },
    {
        label: "FUNCTION_BLOCK ... END_FUNCTION_BLOCK",
        kind: CompletionItemKind.Snippet,
        insertTextFormat: InsertTextFormat.Snippet,
        insertText: "FUNCTION_BLOCK ${1:function_block_name} \n\nEND_FUNCTION_BLOCK"
    }]

const STsCompletion: CompletionItem[] = [
        {
            label: "IF ... ",
            kind: CompletionItemKind.Snippet,
            insertTextFormat: InsertTextFormat.Snippet,
            insertText: "IF ${1:condition} THEN : ${2:;} \n\nEND_IF"
        }]    

const VariablesCompletions: CompletionItem[] = [
    {
        label: "VAR ... ",
        kind: CompletionItemKind.Snippet,
        insertTextFormat: InsertTextFormat.Snippet,
        insertText: "VAR RETAIN\n  ${1:VarName} : ${2:INT};\nEND_VAR"
    },
    {
        label: "VAR_INPUT ... END_VAR",
        kind: CompletionItemKind.Snippet,
        insertTextFormat: InsertTextFormat.Snippet,
        insertText: "VAR_INPUT RETAIN\n ${1:VarName} : ${2:INT};\nEND_VAR"
    },
    {
        label: "VAR_OUTPUT ... END_OUTPUT",
        kind: CompletionItemKind.Snippet,
        insertTextFormat: InsertTextFormat.Snippet,
        insertText: "VAR_OUTPUT\n   ${1:VarName} : ${2:INT};\nEND_VAR"
    },
    {
        label: "VAR_TEMP ... END_VAR",
        kind: CompletionItemKind.Snippet,
        insertTextFormat: InsertTextFormat.Snippet,
        insertText: "VAR_TEMP\n ${1:VarName} : ${2:INT};\nEND_VAR"
    },
    {
        label: "VAR_IN_OUT ... END_VAR",
        kind: CompletionItemKind.Snippet,
        insertTextFormat: InsertTextFormat.Snippet,
        insertText: "VAR_IN_OUT\n   ${1:VarName} : ${2:INT};\nEND_VAR"
    }]



export const scopedCompletionProvider = (scope: Item | null) => {
    if (scope) {
        if (scope instanceof FunctionScope) {
            return [...VariablesCompletions, ...STsCompletion]
        }
    }

    return FunctionsCompletion
}
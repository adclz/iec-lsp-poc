import { Connection, DidChangeConfigurationNotification, FileChangeType, InitializeParams, InitializeResult, TextDocumentSyncKind } from 'vscode-languageserver';
import { TextDocument } from "vscode-languageserver-textdocument";
import Parser, { Language } from "web-tree-sitter";
import { InitOptions, Queries } from "../../../shared/initOptions"
import openDocumentProvider from "./capabilities/documents/openDocument"
import editDocumentProvider from "./capabilities/documents/editDocument"
import closeDocumentProvider from "./capabilities/documents/closeDocument"
import semanticTokensProvider from './capabilities/semanticTokens';
import completionsProvider from "./capabilities/completions"
import symbolsProvider from "./capabilities/symbols"
import workspaceSymbolsProvider from "./capabilities/workspaceSymbols"
import highlightProvider from "./capabilities/highlight"
import hoverProvider from "./capabilities/hover"
import referencesProvider from "./capabilities/references"
import typeDefinitionsProvider from "./capabilities/typeDefinition"
import selectionRangeProvider from "./capabilities/selectionRanges"
import prepareRenameProvider from "./capabilities/prepareRename"
import renameProvider from "./capabilities/rename"
import foldingRangeProvider from "./capabilities/foldingRange"
import signatureProvider from "./capabilities/signature"
import definitionProvider from "./capabilities/definition"
import documentLinkProvider from "./capabilities/documentLink"
import codeLensProvider from "./capabilities/codeLens"

import { GlobalScope } from './symbol-table/items/scopes/global';

//@ts-ignore
import iec61131_2 from "../../node_modules/parser-iec-61131-3-2/tree-sitter-IEC61131_3_2.wasm"
//@ts-ignore
import comments from "../../node_modules/parser-iec-61131-3-2/queries/comments.scm"
//@ts-ignore
import fold from "../../node_modules/parser-iec-61131-3-2/queries/fold.scm"
//@ts-ignore
import highlights from "../../node_modules/parser-iec-61131-3-2/queries/highlights.scm"
//@ts-ignore
import outline from "../../node_modules/parser-iec-61131-3-2/queries/outline.scm"

export interface SingleTons {
    connection: Connection,
    workspaceRoot: string,
    documents: Map<string, TextDocument>,
    trees: Map<string, Parser.Tree>,
    parser: Parser,
    queries: Record<keyof Queries, Parser.Query>,
    buffers: Map<string, GlobalScope>,
    language: Language,
    diagnostics: Promise<any> | null,
}

export const startServer = (connection: Connection) => {
    console.log = connection.console.log.bind(connection.console);
    console.warn = connection.console.warn.bind(connection.console);
    console.error = connection.console.error.bind(connection.console);

    let singleTons: SingleTons

    connection.onInitialize(async (params: InitializeParams) => {
        const initOptions = params.initializationOptions.initializationOptions as InitOptions

        await Parser.init({
            locateFile: () => {
                return initOptions.treeSitterWasmUri
            }
        })

        const parser = new Parser()
        const language = await Parser.Language.load(iec61131_2)
        parser.setLanguage(language)

        singleTons = {
            connection,
            workspaceRoot: params.workspaceFolders![0].uri,
            documents: new Map(),
            trees: new Map(),
            parser,
            buffers: new Map(),
            language,
            queries: {
                comments: language.query(comments),
                fold: language.query(fold),
                highlights: language.query(highlights),
                outline: language.query(outline)
            },
            diagnostics: null
        }

        const result: InitializeResult = {
            capabilities: {
                textDocumentSync: TextDocumentSyncKind.Incremental,
                completionProvider: {
                    triggerCharacters: ['.', ':']
                },
                documentSymbolProvider: true,
                documentHighlightProvider: true,
                hoverProvider: true,
                referencesProvider: true,
                typeDefinitionProvider: true,
                selectionRangeProvider: true,
                renameProvider: {
                    prepareProvider: true
                },
                workspaceSymbolProvider: true,
                foldingRangeProvider: true,
                signatureHelpProvider: {
                    triggerCharacters: ['(', ',', ':', '=']
                },
                definitionProvider: true,
                documentLinkProvider: {
                    resolveProvider: false
                },
                codeLensProvider: {
                    resolveProvider: false
                }
            }
        };
        return result;
    })

    connection.onInitialized(() => {
        // workspace
        connection.onRequest("workspace/symbol", async request => await waitForDiagnostics(singleTons, request, workspaceSymbolsProvider(singleTons)))

        // documents
        connection.onDidOpenTextDocument(openDocumentProvider(singleTons))
        connection.onDidChangeTextDocument(editDocumentProvider(singleTons))
        connection.onDidCloseTextDocument(closeDocumentProvider(singleTons))

        // language features
        connection.onRequest("textDocument/semanticTokens/range", async request => await waitForDiagnostics(singleTons, request, semanticTokensProvider(singleTons)))
        connection.onRequest("textDocument/completion", async request => await waitForDiagnostics(singleTons, request, completionsProvider(singleTons)))
        connection.onRequest("textDocument/documentSymbol", async request => await waitForDiagnostics(singleTons, request, symbolsProvider(singleTons)))
        connection.onRequest("textDocument/documentHighlight", async request => await waitForDiagnostics(singleTons, request, highlightProvider(singleTons)))
        connection.onRequest("textDocument/references", async request => await waitForDiagnostics(singleTons, request, referencesProvider(singleTons)))
        connection.onRequest("textDocument/hover", async request => await waitForDiagnostics(singleTons, request, hoverProvider(singleTons)))
        connection.onRequest("textDocument/typeDefinition", async request => await waitForDiagnostics(singleTons, request, typeDefinitionsProvider(singleTons)))
        connection.onRequest("textDocument/definition", async request => await waitForDiagnostics(singleTons, request, definitionProvider(singleTons)))
        connection.onRequest("textDocument/selectionRange", async request => await waitForDiagnostics(singleTons, request, selectionRangeProvider(singleTons)))
        connection.onRequest("textDocument/prepareRename", async request => await waitForDiagnostics(singleTons, request, prepareRenameProvider(singleTons)))
        connection.onRequest("textDocument/rename", async request => await waitForDiagnostics(singleTons, request, renameProvider(singleTons)))
        connection.onRequest("textDocument/foldingRange", async request => await waitForDiagnostics(singleTons, request, foldingRangeProvider(singleTons)))
        connection.onRequest("textDocument/signatureHelp", async request => await waitForDiagnostics(singleTons, request, signatureProvider(singleTons)))
        connection.onRequest("textDocument/documentLink", async request => await waitForDiagnostics(singleTons, request, documentLinkProvider(singleTons)))
        connection.onRequest("textDocument/codeLens", async request => await waitForDiagnostics(singleTons, request, codeLensProvider(singleTons)))

        console.log("IEC 61131 LSP Server initialized");

        //connection.client.register(DidChangeConfigurationNotification.type, undefined);
    });

    connection.listen();
}

const waitForDiagnostics = async (singleTons: SingleTons, request: any, cb: (...args: any[]) => Promise<any>) => {
    if (singleTons.diagnostics) {
        await singleTons.diagnostics
    }
    return await cb(request)
}
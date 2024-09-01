import { Connection, DidChangeConfigurationNotification, FileChangeType, InitializeParams, InitializeResult, TextDocumentSyncKind } from 'vscode-languageserver';
import { TextDocument } from "vscode-languageserver-textdocument";
//@ts-ignore
import Parser, { Language } from "web-tree-sitter";
import { decodeBase64 } from "../../../shared/base64"
import { InitOptions, Queries } from "../../../shared/initOptions"
import semanticTokensProvider from './capabilities/semanticTokens';
import documentProvider from './capabilities/diagnostics';
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
import { GlobalScope } from './symbol-table/items/scopes/global';

export interface SingleTons {
    connection: Connection,
    documents: Map<string, TextDocument>,
    trees: Map<string, Parser.Tree>,
    parser: Parser,
    queries: Record<keyof Queries, Parser.Query>,
    symbols: Map<string, GlobalScope>,
    language: Language,
    diagnostics: Promise<any> | null,
}

export const startServer = (connection: Connection) => {
    console.log = connection.console.log.bind(connection.console);
    console.warn = connection.console.warn.bind(connection.console);
    console.error = connection.console.error.bind(connection.console);

    connection.onInitialize(async (params: InitializeParams) => {
        const initOptions = params.initializationOptions as InitOptions

        const languageB64 = decodeBase64(initOptions.parserData.language)
        await Parser.init({
            locateFile: () => {
                return initOptions.treeSitterWasmUri
            }
        })

        const parser = new Parser()
        const language = await Parser.Language.load(languageB64)
        parser.setLanguage(language)

        const singleTons: SingleTons = {
            connection,
            documents: new Map(),
            trees: new Map(),
            parser,
            symbols: new Map(),
            language,
            //@ts-expect-error
            queries: Object.fromEntries(Object.entries(initOptions.parserData.queries)
                .map(([key, value]) => [key, language.query(value)])),
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
                }
            }
        };

        const { openDocument, editDocument, closeDocument } = documentProvider(singleTons)
        connection.onDidOpenTextDocument(openDocument)
        connection.onDidChangeTextDocument(editDocument)
        connection.onDidCloseTextDocument(closeDocument)

        connection.onRequest("textDocument/semanticTokens/range", async request => await waitForDiagnostics(singleTons, request, semanticTokensProvider(singleTons)))
        connection.onRequest("textDocument/completion", async request => await waitForDiagnostics(singleTons, request, completionsProvider(singleTons)))
        connection.onRequest("textDocument/documentSymbol", async request => await waitForDiagnostics(singleTons, request, symbolsProvider(singleTons)))
        connection.onRequest("textDocument/documentHighlight", async request => await waitForDiagnostics(singleTons, request, highlightProvider(singleTons)))
        connection.onRequest("textDocument/references", async request => await waitForDiagnostics(singleTons, request, referencesProvider(singleTons)))
        connection.onRequest("textDocument/hover", async request => await waitForDiagnostics(singleTons, request, hoverProvider(singleTons)))
        connection.onRequest("textDocument/typeDefinition", async request => await waitForDiagnostics(singleTons, request, typeDefinitionsProvider(singleTons)))
        connection.onRequest("textDocument/selectionRange", async request => await waitForDiagnostics(singleTons, request, selectionRangeProvider(singleTons)))
        connection.onRequest("textDocument/prepareRename", async request => await waitForDiagnostics(singleTons, request, prepareRenameProvider(singleTons)))
        connection.onRequest("textDocument/rename", async request => await waitForDiagnostics(singleTons, request, renameProvider(singleTons)))
        connection.onRequest("textDocument/foldingRange", async request => await waitForDiagnostics(singleTons, request, foldingRangeProvider(singleTons)))
        connection.onRequest("textDocument/signatureHelp", async request => await waitForDiagnostics(singleTons, request, signatureProvider(singleTons)))
        connection.onRequest("workspace/symbol", async request => await waitForDiagnostics(singleTons, request, workspaceSymbolsProvider(singleTons)))
        return result;
        return result;
    })

    connection.onInitialized(() => {
        console.log("IEC 61131 LSP Server initialized");
        connection.client.register(DidChangeConfigurationNotification.type, undefined);
    });

    connection.listen();
}

const waitForDiagnostics = async (singleTons: SingleTons, request: any, cb: (...args: any[]) => Promise<any>) => {
    if (singleTons.diagnostics) {
        await singleTons.diagnostics
    }
    return await cb(request)
}
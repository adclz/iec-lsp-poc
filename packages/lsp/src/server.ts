import {
  createConnection,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  TextDocumentSyncKind,
  InitializeResult,
  SemanticTokenTypes,
  SemanticTokenModifiers,
  _Connection
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser from "tree-sitter";
import initParser from './parser/parser';
import initQueries, { Queries } from './parser/queries';
import semanticTokensProvider, { tokenTypes, tokenModifiers } from './capabilities/semanticTokens';
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

import { GlobalScope } from './symbols/scopes/global';

let connection = createConnection(ProposedFeatures.all);

export type GlobalState = {
  connection: _Connection,
  documents: Map<string, TextDocument>,
  trees: Map<string, Parser.Tree>,
  parser: Parser,
  queries: Queries,
  symbols: Map<string, GlobalScope>,
  diagnostics: Promise<any> | null,
  logger: _Connection['console']
}

connection.onInitialize(async (params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      semanticTokensProvider: {
        legend: {
          tokenTypes,
          tokenModifiers
        },
        range: true,
        full: false
      },
      completionProvider: {
        triggerCharacters: [
          "=", "."
        ],
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

  const globals: GlobalState = {
    connection,
    documents: new Map<string, TextDocument>(),
    trees: new Map<string, Parser.Tree>(),
    parser: initParser(),
    queries: initQueries(),
    symbols: new Map(),
    diagnostics: null,
    logger: connection.console
  }

  const { openDocument, editDocument, closeDocument } = documentProvider(globals)
  connection.onDidOpenTextDocument(openDocument)
  connection.onDidChangeTextDocument(editDocument)
  connection.onDidCloseTextDocument(closeDocument)

  connection.onRequest("textDocument/semanticTokens/range", async request => await waitForDiagnostics(globals, request, semanticTokensProvider(globals)))
  connection.onRequest("textDocument/completion", async request => await waitForDiagnostics(globals, request, completionsProvider(globals)))
  connection.onRequest("textDocument/documentSymbol", async request => await waitForDiagnostics(globals, request, symbolsProvider(globals)))
  connection.onRequest("textDocument/documentHighlight", async request => await waitForDiagnostics(globals, request, highlightProvider(globals)))
  connection.onRequest("textDocument/references", async request => await waitForDiagnostics(globals, request, referencesProvider(globals)))
  connection.onRequest("textDocument/hover", async request => await waitForDiagnostics(globals, request, hoverProvider(globals)))
  connection.onRequest("textDocument/typeDefinition", async request => await waitForDiagnostics(globals, request, typeDefinitionsProvider(globals)))
  connection.onRequest("textDocument/selectionRange", async request => await waitForDiagnostics(globals, request, selectionRangeProvider(globals)))
  connection.onRequest("textDocument/prepareRename", async request => await waitForDiagnostics(globals, request, prepareRenameProvider(globals)))
  connection.onRequest("textDocument/rename", async request => await waitForDiagnostics(globals, request, renameProvider(globals)))
  connection.onRequest("textDocument/foldingRange", async request => await waitForDiagnostics(globals, request, foldingRangeProvider(globals)))
  connection.onRequest("textDocument/signatureHelp", async request => await waitForDiagnostics(globals, request, signatureProvider(globals)))
  connection.onRequest("workspace/symbol", async request => await waitForDiagnostics(globals, request, workspaceSymbolsProvider(globals)))
  return result;
});

connection.onInitialized(() => {
  console.log("IEC 61131 LSP Server initialized");
  connection.client.register(DidChangeConfigurationNotification.type, undefined);
});

connection.listen();

const waitForDiagnostics = async (globals: GlobalState, request: any, cb: (...args: any[]) => Promise<any>) => {
  if (globals.diagnostics) {
    await globals.diagnostics
  }
  return await cb(request)
}

import {
  createConnection,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  TextDocumentSyncKind,
  InitializeResult
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser from "tree-sitter";
import initQueries, { Queries } from './parser/queries';
import semanticTokensProvider, { tokenTypes } from './capabilities/semanticTokens';
import initParser from './parser/parser';
import { change, validateTextDocument } from './capabilities/diagnostics';

// Create a connection for the server. The connection uses Node's IPC as a transport

let connection = createConnection(ProposedFeatures.all);

export type GlobalState = {
  documents: Map<string, TextDocument>,
  trees: Map<string, Parser.Tree>,
  parser: Parser,
  queries: Queries,
}

connection.onInitialize(async (params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      semanticTokensProvider: {
        legend: {
          tokenTypes,
          tokenModifiers: [],
        },
        full: true,
      }
    }
  };

  const documents = new Map<string, TextDocument>()
  const trees = new Map<string, Parser.Tree>() 
  const parser = initParser()
  const queries = initQueries()

  const GlobalState: GlobalState = {
    documents,
    trees,
    parser,
    queries
  }

  connection.onDidOpenTextDocument(e => {
    const doc = TextDocument.create(e.textDocument.uri, 'iec', e.textDocument.version, e.textDocument.text)
    documents.set(e.textDocument.uri, doc)
  
    const tree = parser.parse(doc.getText())
    trees.set(e.textDocument.uri, tree)
  
    connection.sendDiagnostics(validateTextDocument(GlobalState, doc, tree))
  })
  
  connection.onDidCloseTextDocument(e => {
    documents.delete(e.textDocument.uri)
    trees.delete(e.textDocument.uri)
  })
  
  connection.onDidChangeTextDocument(event => {
    const tree = trees.get(event.textDocument.uri)!;
    const change = event.contentChanges[0] as change
  
    const doc = documents.get(event.textDocument.uri)
    const updated = TextDocument.update(doc!, event.contentChanges, event.textDocument.version)
  
    connection.sendDiagnostics(validateTextDocument(GlobalState, updated, tree, change))
  });

  connection.onRequest("textDocument/semanticTokens/full", semanticTokensProvider(documents, parser, queries))

  return result;
});

connection.onInitialized(() => {
  console.log("IEC 61331 LSP Server initialized");
  connection.client.register(DidChangeConfigurationNotification.type, undefined);
});

connection.listen();

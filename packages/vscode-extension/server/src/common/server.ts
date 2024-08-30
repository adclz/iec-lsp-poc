import { Connection, FileChangeType, InitializeParams, InitializeResult, TextDocumentSyncKind } from 'vscode-languageserver';
import { TextDocument } from "vscode-languageserver-textdocument";
import Parser, { Query } from "web-tree-sitter";

interface SingleTons {
    connection: Connection;
    documents: Map<string, TextDocument>,
    trees: Map<string, Parser.Tree>,
    //parser: Parser,
    //queries: Queries,
    //symbols: Map<string, GlobalScope>,
    diagnostics: Promise<any> | null,
}

export const startServer = (connection: Connection) => {
    console.log = connection.console.log.bind(connection.console);
    console.warn = connection.console.warn.bind(connection.console);
    console.error = connection.console.error.bind(connection.console);

    connection.onInitialize((params: InitializeParams) => {
        const result: InitializeResult = {
            capabilities: {
                textDocumentSync: TextDocumentSyncKind.Incremental,
                /*completionProvider: {
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
                }*/
            }
        };
        return result;
    })


}
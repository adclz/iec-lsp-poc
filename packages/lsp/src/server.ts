import {
    createConnection,
    ProposedFeatures,
    InitializeParams,
    DidChangeConfigurationNotification,
    TextDocumentSyncKind,
    InitializeResult,
    Diagnostic,
    SemanticTokens
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import Parser, { Query } from "tree-sitter";
import iec61331 from "iec61331-tree-sitter"; 
import fs from "fs"; 
import path from 'path';

// Create a connection for the server. The connection uses Node's IPC as a transport

let connection = createConnection(ProposedFeatures.all);

const documents = new Map<string, TextDocument>()
const trees: Map<string, Parser.Tree> = new Map()

let parser: Parser;
let tsQuery: Parser.Query;

let highlightQuery: Parser.Query;

const tokenTypes = [
    'comment',
    'keyword.function',
    'keyword.modifier',
    'keyword.coroutine',
    'keyword.operator',
    'type.definition',
    'type.builtin',
    'punctuation.separator',
    'punctuation.bracket',
    'number',
    'number.float',
    'variable',
    'variable.parameter' 
];

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

    parser = new Parser;
    parser.setLanguage(iec61331)

    const lspPath = path.join(path.dirname(require.resolve('iec61331-tree-sitter')), "../../")

    const highlights = fs.readFileSync(path.join(lspPath, "queries/highlights.scm"), "utf8")
    highlightQuery = new Query(iec61331, highlights)

    tsQuery = new Query(iec61331, `
        (ERROR) @error
        `)

    return result;
});

connection.onRequest('textDocument/semanticTokens/full', (params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {
      return { data: [] };
    }
  
    const tree = parser.parse(document.getText());
    const captures = highlightQuery.captures(tree.rootNode);  
    const builder = new SemanticTokensBuilder();
  
    captures.forEach((capture) => {
      const tokenTypeIndex = tokenTypes.indexOf(capture.name);
      if (tokenTypeIndex === -1) {
        return;
      }
  
      const { startPosition, endPosition } = capture.node;
      builder.push(
        startPosition.row,
        startPosition.column,
        endPosition.column - startPosition.column,
        tokenTypeIndex,
        0 // No modifiers used in this example
      );
    });
  
    return builder.build();
  });

  class SemanticTokensBuilder {

    private _id!: number;
    private _prevLine!: number;
    private _prevChar!: number;
    private _data!: number[];
    private _dataLen!: number;
  
    constructor() {
      this.initialize();
    }
  
    private initialize() {
      this._id = Date.now();
      this._prevLine = 0;
      this._prevChar = 0;
      this._data = [];
      this._dataLen = 0;
    }
  
    public push(line: number, char: number, length: number, tokenType: number, tokenModifiers: number): void {
      let pushLine = line;
      let pushChar = char;
      if (this._dataLen > 0) {
        pushLine -= this._prevLine;
        if (pushLine === 0) {
          pushChar -= this._prevChar;
        }
      }
  
      this._data[this._dataLen++] = pushLine;
      this._data[this._dataLen++] = pushChar;
      this._data[this._dataLen++] = length;
      this._data[this._dataLen++] = tokenType;
      this._data[this._dataLen++] = tokenModifiers;
  
      this._prevLine = line;
      this._prevChar = char;
    }
  
    public get id(): string {
      return this._id.toString();
    }
  
    public build(): SemanticTokens {
      return {
        resultId: this.id,
        data: this._data,
      };
    }
  }
connection.onInitialized(() => {
    console.log("IEC 61331 LSP Server initialized");
    connection.client.register(DidChangeConfigurationNotification.type, undefined);
});

connection.onDidOpenTextDocument(e => {
    const doc = TextDocument.create(e.textDocument.uri, 'lad', e.textDocument.version, e.textDocument.text)
    documents.set(e.textDocument.uri, doc)

    const tree = parser.parse(doc.getText())
    trees.set(e.textDocument.uri, tree)

    validateTextDocument(doc, tree)
})

connection.onDidCloseTextDocument(e => {
    documents.delete(e.textDocument.uri)
    trees.delete(e.textDocument.uri)
})

type change = {
    range: {
        start: {
            line: number,
            character: number
        },
        end: {
            line: number,
            character: number
        },
    },
    rangeLength: number,
    text: string
};

connection.onDidChangeTextDocument(event => {
    const tree = trees.get(event.textDocument.uri)!;
    const change = event.contentChanges[0] as change

    const doc = documents.get(event.textDocument.uri)
    const updated = TextDocument.update(doc!, event.contentChanges, event.textDocument.version)

    validateTextDocument(updated, tree, change)
});


const validateTextDocument = (updated: TextDocument, tree: Parser.Tree, change?: change) => {
    // update the tree with the new text
    if (change) {
        const rangeOffset = updated.offsetAt({
            line: change.range.start.line,
            character: change.range.start.character
        })

        const oldEndIndex = rangeOffset + change.rangeLength
        const newEndIndex = rangeOffset + change.text.length

        tree.edit({
            startIndex: rangeOffset,
            oldEndIndex,
            newEndIndex,
            startPosition: { row: change.range.start.line, column: change.range.start.character },
            oldEndPosition: { row: change.range.end.line + change.rangeLength, column: change.range.end.line + change.rangeLength },
            newEndPosition: { row: change.range.end.line + change.text.length, column: + change.text.length }
        });
    }

    const newTree = parser.parse(updated.getText(), tree);
    trees.set(updated.uri, newTree);

    const matches = tsQuery.matches(newTree.rootNode)
    const diagnostics: Diagnostic[] = []

    for (const match of matches) {
        for (const capture of match.captures) {
            console.log(capture)
            const node = capture.node;
            
            diagnostics.push({
                range: {
                    start: {
                        line: node.startPosition.row,
                        character: node.startPosition.column,
                    },
                    end: {
                        line: node.endPosition.row,
                        character: node.endPosition.column,
                    }
                },
                message: node.isMissing ? 
                `Syntax error: Missing ${node.text}` : 
                `Unexpected token '${node.text}'`,
            })
        }
    }

    connection.sendDiagnostics({
        uri: updated.uri,
        diagnostics
    });
}

connection.listen();

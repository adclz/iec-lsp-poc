import Parser from "tree-sitter";
import { SemanticTokens, SemanticTokensRequest } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Queries } from "../parser/queries";

export const tokenTypes = [
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

const semanticTokensProvider = (documents: Map<string, TextDocument>, parser: Parser, queries: Queries) => {
    const handler: SemanticTokensRequest.HandlerSignature = (params) => {
        const document = documents.get(params.textDocument.uri);
        if (!document) {
            return { data: [] };
        }

        const tree = parser.parse(document.getText());
        const captures = queries.semanticTokens.captures(tree.rootNode);
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
                0
            )
        })
        return builder.build();
    }
    return handler
}


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

type SemanticToken = [
    line: number,
    character: number,
    length: number,
    tokenTypes: number,
    tokenModifiers: number,
]

function buildTokens(tokens: SemanticToken[]) {
    const builder = new SemanticTokensBuilder();
    const sortedTokens = tokens.sort((a, b) => a[0] - b[0] === 0 ? a[1] - b[1] : a[0] - b[0]);
    for (const token of sortedTokens) {
        builder.push(...token);
    }
    return builder.build();
}

export default semanticTokensProvider
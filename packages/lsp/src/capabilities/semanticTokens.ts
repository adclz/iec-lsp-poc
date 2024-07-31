import Parser from "tree-sitter";
import { SemanticTokens, SemanticTokensRequest, SemanticTokensRangeRequest } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Queries } from "../parser/queries";
import { GlobalState } from "../server";

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

const semanticTokensProvider = (globalState: GlobalState, parser: Parser, queries: Queries) => {
    const fullHandler: SemanticTokensRequest.HandlerSignature = (params) => {
        //console.log('fullHandler', params);
        const tree = globalState.trees.get(params.textDocument.uri);
        if (!tree) {
            return { data: [] };
        }

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

    const rangeHandler: SemanticTokensRangeRequest.HandlerSignature = (params) => {
        //console.log('rangeHandler', params);
        const tree = globalState.trees.get(params.textDocument.uri);
        if (!tree) {
            return { data: [] };
        }

        const { start, end } = params.range;
        const captures = queries.semanticTokens.captures(tree.rootNode);
        const builder = new SemanticTokensBuilder();

        captures.forEach((capture) => {
            const tokenTypeIndex = tokenTypes.indexOf(capture.name);
            if (tokenTypeIndex === -1) {
                return;
            }

            const { startPosition, endPosition } = capture.node;

            // Check if the capture node is within the specified range
            if (
                (startPosition.row > start.line || (startPosition.row === start.line && startPosition.column >= start.character)) &&
                (endPosition.row < end.line || (endPosition.row === end.line && endPosition.column <= end.character))
            ) {
                builder.push(
                    startPosition.row,
                    startPosition.column,
                    endPosition.column - startPosition.column,
                    tokenTypeIndex,
                    0
                );
            }
        });

        return builder.build();
    }

    return {
        fullHandler,
        rangeHandler
    }
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

export default semanticTokensProvider
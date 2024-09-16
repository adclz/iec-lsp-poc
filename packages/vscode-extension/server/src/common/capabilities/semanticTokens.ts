import { SemanticTokens, SemanticTokensRangeParams, SemanticTokensRangeRequest } from "vscode-languageserver";
import { SingleTons } from "../server";

export const tokenTypes = [
    'namespace',
    'type',
    'class',
    'enum',
    'interface',
    'struct',
    'typeParameter',
    'parameter',
    'variable',
    'property',
    'enumMember',
    'event',
    'function',
    'method',
    'macro',
    'keyword',
    'modifier',
    'comment',
    'string',
    'number',
    'regexp',
    'operator',
    'decorator'
];

export const tokenModifiers = [
    'declaration',
    'definition',
    'readonly',
    'static',
    'deprecated',
    'abstract',
    'async',
    'modification',
    'documentation',
    'defaultLibrary'
]

const semanticTokensProvider = (singleTons: SingleTons):
    (params: SemanticTokensRangeParams) => Promise<SemanticTokens> => {
    const {
        queries,
        trees
    } = singleTons

    return async (params) => {
        const tree = trees.get(params.textDocument.uri);

        if (!tree) {
            return { data: [] };
        }

        const { start, end } = params.range;
        const captures = queries.highlights.captures(tree.rootNode,
            {
                startPosition: { row: start.line, column: start.character },
                endPosition: { row: end.line, column: end.character }
            }
        );

        const builder = new SemanticTokensBuilder();

        captures.forEach((capture) => {
            const [type, modifier] = capture.name.split('.');
            const tokenTypeIndex = tokenTypes.indexOf(type);

            if (tokenTypeIndex === -1) {
                return;
            }

            // Check if the modifier exists and calculate its bitwise value.
            const tokenModifierIndex = tokenModifiers.indexOf(modifier);
            const tokenModifiersBit = tokenModifierIndex !== -1 ? 1 << tokenModifierIndex : 0;


            const { startPosition, endPosition } = capture.node;

            builder.push(
                startPosition.row,
                startPosition.column,
                endPosition.column - startPosition.column,
                tokenTypeIndex,
                tokenModifiersBit
            );

        });

        return builder.build();
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
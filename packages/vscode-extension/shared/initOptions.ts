export interface Queries {
    comments: string,
    fold: string,
    highlights: string,
    outline: string
}

export interface ParserData {
    language: string,
    queries: Queries
}

export interface InitOptions {
    treeSitterWasmUri: string
    parserData: ParserData
}

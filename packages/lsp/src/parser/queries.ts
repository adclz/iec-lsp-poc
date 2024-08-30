import path from "path"
import fs from "fs"
import Parser, { Query } from "tree-sitter"
import iec61331 from "iec61331-tree-sitter"

export interface Queries {
    semanticTokens: Query,
    foldingRanges: Query,
    outline: Query,
    comments: Query
}

export const initQueries = (): Queries => {
    const lspPath = path.join(path.dirname(require.resolve('iec61331-tree-sitter')), "../../")
    
    const semanticTokens = fs.readFileSync(path.join(lspPath, "queries/highlights.scm"), "utf8")
    const outline = fs.readFileSync(path.join(lspPath, "queries/outline.scm"), "utf8")
    const comments = fs.readFileSync(path.join(lspPath, "queries/comments.scm"), "utf8")
    const foldingRanges = fs.readFileSync(path.join(lspPath, "queries/fold.scm"), "utf8")


    return {   
        semanticTokens: new Query(iec61331, semanticTokens),
        outline: new Query(iec61331, outline),
        comments: new Query(iec61331, comments),
        foldingRanges: new Query(iec61331, foldingRanges)
    }
}

export default initQueries
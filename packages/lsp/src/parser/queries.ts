import path from "path"
import fs from "fs"
import Parser, { Query } from "tree-sitter"
import iec61331 from "iec61331-tree-sitter"

export interface Queries {
    error: Query,
    semanticTokens: Query
}

const initQueries = (): Queries => {
    const lspPath = path.join(path.dirname(require.resolve('iec61331-tree-sitter')), "../../")
    
    const semanticTokens = fs.readFileSync(path.join(lspPath, "queries/highlights.scm"), "utf8")

    return {
        error: new Query(iec61331, `(ERROR) @error`),    
        semanticTokens: new Query(iec61331, semanticTokens)
    }
}

export default initQueries
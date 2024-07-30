import Parser, { Query } from "tree-sitter";
import iec61331 from "iec61331-tree-sitter";

const initParser = () => {
    const parser = new Parser();
    parser.setLanguage(iec61331);
    return parser;
}

export default initParser
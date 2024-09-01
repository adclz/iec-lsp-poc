import { Range } from "vscode-languageserver";
import { Symbol } from "../definitions";

export class CommentSymbol extends Symbol {
    value: string

    constructor(range: Range, uri: string, value: string) {
        super(range, uri)
        this.value = value
    }

    public get getValue() {
        return formatComment(this.value!);
    }
}

const formatComment = (comment: string) => {
    return comment.replace("//", "")
        .replace("(**", "")
        .replace("**)", "")
}

    
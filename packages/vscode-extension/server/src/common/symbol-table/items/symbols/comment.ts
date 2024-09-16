import { Range } from "vscode-languageserver";
import { Symbol } from "../definitions";

export class CommentSymbol extends Symbol {
    value: string

    constructor(offset: number, size: number, uri: string, value: string) {
        super(offset, size, uri)
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

    
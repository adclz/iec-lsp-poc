import { Range } from "vscode-languageserver";
import { Symbol } from "../definitions";
import { EnumScope } from "../scopes/enum";

export class EnumMemberSymbol extends Symbol {
    name: string

    constructor(offset: number, size: number, uri: string, name: string) {
        super(offset, size, uri)
        this.name = name
    }

    public get getName() {
        return this.name
    }

    public get hoverInfo() {
        const _enum = this.getParent
        if (!(_enum instanceof EnumScope)) { return "unsolved" }
        const index = _enum.getMembers.findIndex(member => member === this)
        let codeSnippet = `
\`\`\`typescript 
(enum member) ${_enum.getName?.getName}.${this.name} = ${index}
\`\`\`
`;
        return codeSnippet
    }

    public getPrimitiveIdentifier(): string | null {
        return "ANY_INT"
    }
}

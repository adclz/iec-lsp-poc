import * as vscode from 'vscode';
import { InitOptions, ParserData } from "../../../shared/initOptions"
import { encodeBase64 } from "../../../shared/base64"

/*export const loadParser = async (languagePath: vscode.Uri, wasmfile: string): Promise<ParserData> => {
    return {
        //language: await loadLanguage(languagePath, wasmfile),
        //queries: await loadQueries(languagePath)
    }
}

const loadLanguage = async (languagePath: vscode.Uri, wasmfile: string) => {
    return encodeBase64(await vscode.workspace.fs.readFile(vscode.Uri.joinPath(languagePath, wasmfile)))
}*/

/*type Queries = {
    comments: string,
    fold: string,
    highlights: string,
    outline: string
}

const loadQueries = async (languagePath: vscode.Uri) => {
    type Writeable<T> = { -readonly [P in keyof T]: Writeable<T[P]> };
    const decoder = new TextDecoder();
    const result: Writeable<Queries> = {
        comments: decoder.decode(await vscode.workspace.fs.readFile(vscode.Uri.joinPath(languagePath, "/queries/comments.scm"))),
        fold: decoder.decode(await vscode.workspace.fs.readFile(vscode.Uri.joinPath(languagePath, "/queries/fold.scm"))),
        highlights: decoder.decode(await vscode.workspace.fs.readFile(vscode.Uri.joinPath(languagePath, "/queries/highlights.scm"))),
        outline: decoder.decode(await vscode.workspace.fs.readFile(vscode.Uri.joinPath(languagePath, "/queries/outline.scm")))
    };
    return result
}*/
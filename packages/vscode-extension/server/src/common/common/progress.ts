import { _Connection, WorkDoneProgressCreateRequest, WorkDoneProgress, WorkDoneProgressBegin, WorkDoneProgressEnd } from "vscode-languageserver";

export const rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

export const getRandomToken = function() {
    return rand() + rand() + rand() + "-" + rand() + rand() + rand(); // to make it longer
};

/// Start a progress notification and returns its token
export const startProgress = async (connection: _Connection, title: string): Promise<string> => {
    const token = getRandomToken()
    await connection.sendRequest(WorkDoneProgressCreateRequest.method, { token })
    connection.sendProgress(WorkDoneProgress.type, token, {
        kind: 'begin',
        title,
        cancellable: false
    } as WorkDoneProgressBegin);
    return token;
}

/// End a progress notification
export const endProgress = (connection: _Connection, token: string, message: string) => {
    connection.sendProgress(WorkDoneProgress.type, token, {
        kind: 'end',
        message
    } as WorkDoneProgressEnd);
}
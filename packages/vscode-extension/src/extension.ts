import path from 'node:path';
import * as vscode from 'vscode';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
} from 'vscode-languageclient/node'; 

const serverModule = require.resolve('iec61131-lsp-server');

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
    // Start the LSP

    const serverOptions = {
        run: { command: 'node', args: [serverModule, '--stdio'] },
        debug: { command: 'node', args: ['--inspect=6009', serverModule, '--stdio'] }
    };

    	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		documentSelector: [
            { scheme: 'file', language: 'st' },
            { scheme: 'file', language: 'plaintext' }
        ],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	console.log("Starting IEC 61331 Language Server");

	// Create the language client and start the client.
	client = new LanguageClient(
		'iec61331',
		'IEC 61331 Client',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();

	console.log("Started");

}

export function deactivate() { }

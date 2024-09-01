import * as vscode from 'vscode';
import {
	BaseLanguageClient, LanguageClientOptions
} from 'vscode-languageclient';
import { LanguageClient } from 'vscode-languageclient/browser';
import { loadParser } from "../common/loadLanguage";

let client: BaseLanguageClient;

export async function activate(context: vscode.ExtensionContext) {
	// Start the LSP
	const serverMain = vscode.Uri.joinPath(context.extensionUri, 'dist/iec.server.browser.js');
	const worker = new Worker(serverMain.toString());

	// Load the parser
	const parser = await loadParser(vscode.Uri.joinPath(context.extensionUri, 'dist'), "tree-sitter-IEC61131.wasm")
	console.log("Parser loaded");
	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		documentSelector: [
			{ scheme: 'file', language: 'st' },
			{ scheme: 'file', language: 'plaintext' }
		],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		},
		initializationOptions: {
			parser
		}
	};

	console.log("Starting IEC 61131 Language Server");

	// Create the language client and start the client.
	client = new LanguageClient(
		'iec61131',
		'IEC 61131 Client',
		clientOptions,
		worker
	);

	// Start the client. This will also launch the server
	await client.start();

	console.log("Started");

}

export function deactivate() { }
import * as vscode from 'vscode';
import { BaseLanguageClient, LanguageClientOptions, RevealOutputChannelOn } from 'vscode-languageclient';
import { LanguageClient } from 'vscode-languageclient/browser';
import { initClientOptions } from '../common/clientOptions';

let client: BaseLanguageClient;

export async function activate(context: vscode.ExtensionContext) {

	// Start the LSP
	const serverMain = vscode.Uri.joinPath(context.extensionUri, 'dist/iec.server.browser.js');
	const worker = new Worker(serverMain.toString());

	console.log("Starting IEC 61131 Language Server");
	const channel = vscode.window.createOutputChannel('iec');

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		outputChannel: channel,
		revealOutputChannelOn: RevealOutputChannelOn.Info,
		documentSelector: [
			{ language: 'st' },
			{ language: 'plaintext' }
		],
		synchronize: {},
		initializationOptions: await initClientOptions(context)
	};

	console.log("Starting IEC 61131 Language Server");

	// Create the language client and start the client.
	const client = new LanguageClient(
		'iec61131',
		'IEC 61131 Client',
		clientOptions,
		worker
	);

	client.onDidChangeState((event) => {
		console.log("State changed", event.newState)
	})


	client.start().then(() => {
		console.log("READY")
		context.subscriptions.push(client);
	})
}

export function deactivate() { }

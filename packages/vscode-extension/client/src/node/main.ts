import * as vscode from 'vscode';
import {
	BaseLanguageClient, LanguageClientOptions
} from 'vscode-languageclient';
import { LanguageClient, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import { loadParser } from '../common/loadLanguage';
import { InitOptions } from '../../../shared/initOptions';

let client: BaseLanguageClient;

export async function activate(context: vscode.ExtensionContext) {
	// Start the LSP
	const serverModule = vscode.Uri.joinPath(context.extensionUri, 'dist/iec.server.node.js').fsPath;

	// The debug options for the server
	const debugOptions = { execArgv: ['--nolazy', '--inspect=' + (7000 + Math.round(Math.random() * 999))] };

	const treeSitterWasmUri = vscode.Uri.joinPath(context.extensionUri, './server/node_modules/web-tree-sitter/tree-sitter.wasm');

	const initializationOptions: InitOptions = {
		treeSitterWasmUri: 'importScripts' in globalThis ? treeSitterWasmUri.toString() : treeSitterWasmUri.fsPath,
		parserData: await loadParser(vscode.Uri.joinPath(context.extensionUri, '../parser-iec-61131-3-2'), "tree-sitter-IEC61131.wasm")
	}
	console.log("Parser loaded");

	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
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
		},
		initializationOptions
	};

	console.log("Starting IEC 61131 Language Server");

	// Create the language client and start the client.
	client = new LanguageClient(
		'iec61131',
		'IEC 61131 Client',
		serverOptions,
		clientOptions
	);


	await client.start();

	console.log("Started");
}

export function deactivate() { }

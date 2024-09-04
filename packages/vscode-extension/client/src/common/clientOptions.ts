import * as vscode from 'vscode';
import {
	BaseLanguageClient, LanguageClientOptions
} from 'vscode-languageclient';
import { InitOptions } from '../../../shared/initOptions';

export const initClientOptions = async (context: vscode.ExtensionContext) => {
	const treeSitterWasmUri = vscode.Uri.joinPath(context.extensionUri, './server/node_modules/web-tree-sitter/tree-sitter.wasm');

	const watcher = vscode.workspace.createFileSystemWatcher("**/*.{st}");

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		documentSelector: [
			{ scheme: 'file', language: 'st' },
			{ scheme: 'file', language: 'plaintext' }
		],
		synchronize: {
			fileEvents: watcher
		},
		initializationOptions: {
			treeSitterWasmUri: 'importScripts' in globalThis ? treeSitterWasmUri.toString() : treeSitterWasmUri.fsPath,
		}
	};

	return clientOptions
}
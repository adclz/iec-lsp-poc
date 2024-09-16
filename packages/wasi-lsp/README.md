# Wasi Preview 2 LSP

This is an experimental draft aimed at testing if tree-sitter, rusty and lsp can all be bundled together in a single wasm file conforming to the WASI 0.2 standard.

So far it's working great, but still needs to be tested in real use cases.

## Build

You'll need to install wasi-sdk and place it at /opt/wasi-sdk.

Next run **make build** to compile a wasm file.

Although rustc will only compile to WASI preview1 for now, binaries can be converted to preview2 using the [cargo component package](https://github.com/bytecodealliance/cargo-component).

## Debugging

We don't debug WASM files directly but instead we  run the code on a native architecture directly.

See https://code.visualstudio.com/docs/languages/rust#_debugging

## Test

For now, only 2 tests exist to check a safe and unsafe implementations of a builder fn that constructs a recursive tree from tree sitter queries.

Next step will probably be running the LSP using [@vscode/wasm](https://github.com/microsoft/vscode-wasm) since the IDE now has support for WASI.

Moreover, it seems Microsoft is working on a [LSP package](https://github.com/microsoft/vscode-wasm/tree/main/wasm-wasi-lsp) to easily implements wasm-based language servers.

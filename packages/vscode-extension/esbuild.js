const esbuild = require('esbuild')
const watch = process.argv.includes('--watch');
const path = require('path')
const fs = require('fs')

const wasmPlugin = {
	name: 'wasm',
	setup(build) {
		build.onLoad({ filter: /\.wasm$/ }, async (args) => ({
			contents: await fs.promises.readFile(args.path),
			loader: 'binary',
		}))
	},
}

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

const assets = {
	name: 'assets transform',
	setup(build) {
		build.onLoad({ filter: /\.(scm)$/ }, async (args) => {
			return {
				contents: await fs.promises.readFile(args.path, 'utf8'),
				loader: 'text'
			};
		});
	}
}

// --- extension

const clientBuildOptions = {
	bundle: true,
	external: ['vscode'],
	target: 'es2020',
	format: 'cjs',
	sourcemap: true,
}

const browserClient = esbuild.context({
	...clientBuildOptions,
	entryPoints: ['client/src/browser/main.ts'],
	outfile: 'dist/iec.extension.browser.js',
	plugins: [esbuildProblemMatcherPlugin],
}).catch((e) => {
	console.error(e)
});

const nodeClient = esbuild.context({
	...clientBuildOptions,
	platform: 'node',
	entryPoints: ['client/src/node/main.ts'],
	outfile: 'dist/iec.extension.node.js',
	plugins: [esbuildProblemMatcherPlugin],
}).catch((e) => {
	console.error(e)
})

// --- server

const serverBuildOptions = {
	bundle: true,
	external: ['fs', 'path', "node-gyp-build"], // not ideal but because of treesitter/emcc
	target: 'es2020',
	format: 'iife',
	sourcemap: true,
	plugins: [esbuildProblemMatcherPlugin],
}

const browserServer = esbuild.context({
	...serverBuildOptions,
	entryPoints: ['server/src/browser/main.ts'],
	outfile: 'dist/iec.server.browser.js',
	plugins: [esbuildProblemMatcherPlugin, wasmPlugin, assets],
}).catch((e) => {
	console.error(e)
});

const nodeServer = esbuild.context({
	...serverBuildOptions,
	platform: 'node',
	entryPoints: ['server/src/node/main.ts'],
	outfile: 'dist/iec.server.node.js',
	plugins: [esbuildProblemMatcherPlugin, wasmPlugin, assets],
}).catch((e) => {
	console.error(e)
})


Promise.all([
	browserClient, browserServer, // client
	nodeClient, nodeServer, // server
]).then(results => {
	results.forEach(async result => {
		if (watch && result) {
			await result.watch()
			console.log('watching for file changes')
		} else {
			console.log('done building')
		}
	})
})
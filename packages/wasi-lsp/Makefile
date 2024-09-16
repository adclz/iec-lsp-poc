.PHONY: build
build:
	RUSTFLAGS="-L /opt/wasi-sdk/share/wasi-sysroot/lib/wasm32-wasip1" CC="/opt/wasi-sdk/bin/clang" CFLAGS="-Wno-implicit-function-declaration" cargo build --target=wasm32-wasip1
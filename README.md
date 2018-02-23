### Description
It's a script which verifies transition to kovan-wasm.

### Run
It's supposed that scripts run from `parity-kovan-wasm-check` dir.

At first make sure you run the script against node with clean database. To clean all data run:
```
cargo run --manifest-path=../parity/Cargo.toml -- db kill --chain spec.json
```

Than run Parity node:
```
cargo run --manifest-path=../parity/Cargo.toml -- --jsonrpc-apis all --chain spec.json
```

And run the script:
```
npm install
node index.js ./identity.wasm
```

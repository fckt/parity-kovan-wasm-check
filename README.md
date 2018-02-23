### Description
It's a script which verifies transition to kovan-wasm. It tries to deploy a Wasm contract twice and makes sure that first fime it fails to deploy and second time is success (following the spec Wasm is enabled on the 2nd block https://github.com/fckt/parity-kovan-wasm-check/blob/master/spec.json#L12).

### Run Parity
It's supposed to run scripts from `parity-kovan-wasm-check` dir.

At first make sure you run the script against node with clean database. To clean all data run:
```
cargo run --manifest-path=../parity/Cargo.toml -- db kill --chain spec.json
```

Than run Parity node:
```
cargo run --manifest-path=../parity/Cargo.toml -- --jsonrpc-apis all --chain spec.json
```

### Run script

```
npm install
node index.js ./identity.wasm
```

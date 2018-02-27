### Description
It's a script which verifies transition to kovan-wasm. It tries to deploy a Wasm contract twice and makes sure that first fime it fails to deploy and second time is success (following the spec Wasm is enabled on the 2nd block https://github.com/fckt/parity-kovan-wasm-check/blob/master/spec.json#L12).

### Run Parity
It's supposed to run scripts from `parity-kovan-wasm-check` dir.

At first make sure you run the script against node with clean database. To clean all data run:
```
parity db kill --chain spec.json
```

Then run Parity node:
```
parity --jsonrpc-apis all --chain spec.json
```

### Run script
Make sure you have the latest node to run the script (https://nodejs.org/en/).

```
npm install
node index.js ./identity.wasm
```

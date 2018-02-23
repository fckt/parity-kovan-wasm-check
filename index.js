var Web3 = require("web3");
var fetch = require("node-fetch-polyfill");
var fs = require("fs");

const ADDRESS = "0x004ec07d2329997267ec62b4166639513386f32e";
const PASSPHRASE = "user"
const WAIT_FOR = 5000;
const HOST = "http://localhost:8545";

const abi = [
    {
      "type": "constructor",
      "inputs": []
    }
];

(async function() {
    try {
        const codePath = process.argv[2];
        const web3 = new Web3(new Web3.providers.HttpProvider(HOST));
        web3.eth.defaultAccount = ADDRESS;
        console.log("Creating account " + web3.eth.defaultAccount)
        const res = await rpc(HOST, "parity_newAccountFromPhrase", [PASSPHRASE, PASSPHRASE]); // will create 0x004ec07d2329997267ec62b4166639513386f32e
        if (res != ADDRESS) {
            throw Error("Creating account failed: parity_newAccountFromPhrase shall return " + web3.eth.defaultAccount);
        } else {
            console.log( web3.eth.defaultAccount + " created")
        }
        if (await web3.eth.personal.unlockAccount(web3.eth.defaultAccount, "user")) {
            console.log("unlock OK");
        } else {
            console.log("unlock FAILED");
        }

        const codeHex = '0x' + fs.readFileSync(codePath).toString('hex');
        let Contract = new web3.eth.Contract(abi, { data: codeHex, from: web3.eth.defaultAccount });
        try {
            console.log("First attempt to deploy Wasm contract");
            Contract = await Contract.deploy({nonce: 0, data: codeHex, arguments: []}).send({from: web3.eth.defaultAccount, gas: 599433, gasPrice: '100000'});
        } catch(e) {
            console.log("First attempt is failed as expected: Wasm isn't enabled on the block #1");
        }

        console.log("Wait for " + WAIT_FOR/1000 + " seconds...");
        await new Promise((r, e) => setTimeout(() => r(), WAIT_FOR));

        Contract = new web3.eth.Contract(abi, { data: codeHex, from: web3.eth.defaultAccount });
        if (await web3.eth.personal.unlockAccount(web3.eth.defaultAccount, "user")) {
            console.log("unlock OK");
        } else {
            console.log("unlock FAILED");
        }

        try {
            console.log("Second attempt to deploy Wasm contract");
            Contract = await Contract.deploy({nonce: 1, data: codeHex, arguments: []}).send({from: web3.eth.defaultAccount, gas: 599433, gasPrice: '100000'});
            console.log("TEST OK: Wasm contract was deployed at address: " + Contract.options.address);
        } catch(e) {
            console.log("TEST FAILED: Wasm should be enabled on the block #2. Check wasmActivationTransition in spec.json");
            console.log(e);
        }
    } catch (e) {
        console.log("ERROR");
        console.log(e);
    }
})();

async function rpc(host, method, params, id = 0) {
    return fetch(host, {
        method: 'POST',
        body: JSON.stringify({ jsonrpc:"2.0", method, params, id }),
        headers: {"Content-Type": "application/json"}
    }).then(res => res.json()).then(json => json.result);
};

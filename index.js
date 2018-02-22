var Web3 = require("web3");
var fetch = require("node-fetch-polyfill");
var fs = require("fs");

var abi = [
    {
      "type": "constructor",
      "inputs": []
    }
];

(async function() {
    try {
        let codePath = process.argv[2];
        var host = "http://localhost:8545";
        var web3 = new Web3(new Web3.providers.HttpProvider(host));
        web3.eth.defaultAccount = "0x004ec07d2329997267ec62b4166639513386f32e";
        let res = await rpc(host, "parity_newAccountFromPhrase", ["user", "user"]); // will create 0x004ec07d2329997267ec62b4166639513386f32e
        if (await web3.eth.personal.unlockAccount(web3.eth.defaultAccount, "user")) {
            console.log("unlock OK");
        }

        let codeHex = '0x' + fs.readFileSync(codePath).toString('hex');
        var Contract = new web3.eth.Contract(abi, { data: codeHex, from: web3.eth.defaultAccount });
        try {
            console.log("First attempt to deploy Wasm contract");
            Contract = await Contract.deploy({nonce: 0, data: codeHex, arguments: []}).send({from: web3.eth.defaultAccount, gas: 599433, gasPrice: '100000'});
        } catch(e) {
            console.log("First attempt is failed as expected: Wasm isn't enabled on the block #1");
        }
        Contract = new web3.eth.Contract(abi, { data: codeHex, from: web3.eth.defaultAccount });
        await new Promise((r, e) => setTimeout(() => r(), 1000));
        if (await web3.eth.personal.unlockAccount(web3.eth.defaultAccount, "user")) {
            console.log("unlock OK");
        }
        try {
            console.log("Second attempt to deploy Wasm contract");
            await Contract.deploy({nonce: 1, data: codeHex, arguments: []}).send({from: web3.eth.defaultAccount, gas: 599433, gasPrice: '100000'});
            console.log("TEST OK");
        } catch(e) {
            console.log("TEST FAILED: Wasm should be enabled on the block #2");
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
    }).then(res => res.json().result);
};

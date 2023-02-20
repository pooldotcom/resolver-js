import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.7.2.esm.min.js"
import { chainConfigs } from "./chains.js"

let tldMap = {
    "ens": { tlds: ["eth"], func: resolveENS },
    "unstoppable": { tlds: ["blockchain", "bitcoin", "nft", "wallet", "888", "dao", "x", "hi"], func: resolveUnstoppable }, // https://unstoppabledomains.freshdesk.com/support/solutions/articles/48001186821-what-are-the-different-tlds-
    // the rest will do pool lookup
}

// Get Pool root contract
let apiURL = "https://api.pool.com"
let rootContracts = {}
async function fetchRoot() {
    let r = await fetch(`${apiURL}/v1/root/addresses`)
    let j = await r.json()
    console.log(j)
    rootContracts = j.roots
}
fetchRoot()

const erc721abi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function tokenURI(uint256 _tokenId) external view returns (string memory)",
];

/*
resolve is the main resolver function to use.

Options map:

* "type": either crypto symbol or DNS record type. Defaults to 'ETH' to match ENS default.

*/
export async function resolve(name, { type = 'ETH' } = {}) {
    console.log(name, "type", type)
    console.log(arguments)
    if (!name) throw "invalid name"
    name = name.toLowerCase()
    let split = name.split(".")
    let tld = split[split.length - 1]
    console.log("TLD", tld)
    for (let [k, v] of Object.entries(tldMap)) {
        console.log(k, v)
        if (v.tlds.includes(tld)) {
            let r = await v.func(name)
            console.log("response:", r)
            return r
        }
    }
    return await resolvePool(name, { type: type })
}

let isProd = true
async function resolvePool(name, { type = '' } = {}) {
    let split = name.split(".")
    let network;
    //     console.log(chainConfigs)
    if (isProd && split.length == 1) {
        // then check ethereum
        network = "ETH"
    } else {
        network = "MATIC"
    }
    let chain = chainConfigs[network]
    let nh = ethers.utils.namehash(name)
    // console.log(nh)
    let provider = new ethers.providers.JsonRpcProvider(chain.rpc[0])
    let erc721contract = new ethers.Contract(rootContracts[network], erc721abi, provider)
    // let tokenID = ethers.BigNumber.from(nh)
    // console.log("token iD:", tokenID)
    let tokenURI = await erc721contract.tokenURI(nh)
    console.log('tokenURI', tokenURI)
    let r = await fetch(tokenURI)
    let j = await r.json()
    console.log(j)
    for (const r of j.wallets) {
        if (r.type === type) {
            return r.address
        }
    }
    for (const r of j.dns) {
        if (r.type === type) {
            return r.data
        }
    }
    return j
}

async function resolveENS(name, { } = {}) {
    let chain = chainConfigs["ETH"]
    let provider = new ethers.providers.JsonRpcProvider(chain.rpc[0])
    return await provider.resolveName(name)
}

// todo: move all this unstoppable stuff into separate file

async function resolveUnstoppable(name, { type = 'ETH' } = {}) {
    // https://docs.unstoppabledomains.com/developer-toolkit/resolution-integration-methods/direct-blockchain-calls/resolve-unstoppable-domain-names/

    let ethProvider = new ethers.providers.JsonRpcProvider(chainConfigs["ETH"].rpc[0])
    var ethContract = new ethers.Contract(unstoppableETHAddress, unstoppableABI, ethProvider)
    let polygonProvider = new ethers.providers.JsonRpcProvider(chainConfigs["MATIC"].rpc[0])
    var polygonContract = new ethers.Contract(unstoppablePolygonAddress, unstoppableABI, polygonProvider);

    let data = await fetchContractData(polygonContract, ["crypto.ETH.address"], ethers.utils.namehash(name))
    if (isEmpty(data.owner)) {
        data = await fetchContractData(ethContract, ["crypto.ETH.address"], ethers.utils.namehash(name))
    }
    console.log(data)
    return data[2]
}
async function fetchContractData(contract, keys, tokenId) {
    return contract.getData(keys, tokenId);
}

function isEmpty(msg) {
    return !msg || msg === '0x0000000000000000000000000000000000000000';
}

var unstoppableETHAddress = '0xc3C2BAB5e3e52DBF311b2aAcEf2e40344f19494E';
var unstoppablePolygonAddress = '0xA3f32c8cd786dc089Bd1fC175F2707223aeE5d00';

var unstoppableABI = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'string[]',
                name: 'keys',
                type: 'string[]',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'getData',
        outputs: [
            {
                internalType: 'address',
                name: 'resolver',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'string[]',
                name: 'values',
                type: 'string[]',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    }
];

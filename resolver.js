import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.7.2.esm.min.js"
import { chainConfigs } from "./chains.js"

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
resolve the main resolver function to use.
*/ 
export async function resolve(name) {
    if (!name) throw "invalid name"
    let split = name.split(".")
    return resolve2(name, split)
}

let isProd = true
async function resolve2(name, split) {
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
    return j
}

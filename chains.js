// from: https://github.com/ethereum-lists/chains
let chainConfigs = {}

chainConfigs['MATIC'] = {
    "name": "Polygon Mainnet",
    "chain": "Polygon",
    "rpc": [
        "https://polygon-rpc.com/",
        "https://rpc-mainnet.matic.network",
        "https://matic-mainnet.chainstacklabs.com",
        "https://rpc-mainnet.maticvigil.com",
        "https://rpc-mainnet.matic.quiknode.pro",
        "https://matic-mainnet-full-rpc.bwarelabs.com",
        "https://polygon-bor.publicnode.com"
    ],
    "faucets": [],
    "nativeCurrency": {
        "name": "MATIC",
        "symbol": "MATIC",
        "decimals": 18
    },
    "infoURL": "https://polygon.technology/",
    "shortName": "matic",
    "chainId": 137,
    "networkId": 137,
    "slip44": 966,
    "explorers": [
        {
            "name": "polygonscan",
            "url": "https://polygonscan.com",
            "standard": "EIP3091"
        }
    ]
}
chainConfigs['ETH'] = {
    "name": "Ethereum Mainnet",
    "chain": "ETH",
    "icon": "ethereum",
    "rpc": [
        "https://rpc.ankr.com/eth",
        "https://api.mycryptoapi.com/eth",
        "https://cloudflare-eth.com"
    ],
    "features": [{ "name": "EIP155" }, { "name": "EIP1559" }],
    "faucets": [],
    "nativeCurrency": {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
    },
    "infoURL": "https://ethereum.org",
    "shortName": "eth",
    "chainId": 1,
    "networkId": 1,
    "slip44": 60,
    "ens": {
        "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
    },
    "explorers": [
        {
            "name": "etherscan",
            "url": "https://etherscan.io",
            "standard": "EIP3091"
        }
    ]
}
chainConfigs['GO'] = {
    "name": "GoChain",
    "chain": "GO",
    "rpc": ["https://rpc.gochain.io"],
    "faucets": ["https://free-online-app.com/faucet-for-eth-evm-chains/"],
    "nativeCurrency": {
        "name": "GoChain Ether",
        "symbol": "GO",
        "decimals": 18
    },
    "infoURL": "https://gochain.io",
    "shortName": "go",
    "chainId": 60,
    "networkId": 60,
    "slip44": 6060,
    "explorers": [
        {
            "name": "GoChain Explorer",
            "url": "https://explorer.gochain.io",
            "standard": "EIP3091"
        }
    ]
}

function explorerURL(network, address, tokenID) {
    let c = chainConfigs[network.toUpperCase()]
    if (!c) {
        throw "Invalid chain"
    }
    return c.explorers[0].url
}

export { chainConfigs, explorerURL }

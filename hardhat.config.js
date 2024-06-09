/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-toolbox')
require('@nomicfoundation/hardhat-chai-matchers')
// require('@nomiclabs/hardhat-etherscan')
require('solidity-coverage')
require("hardhat-gas-reporter")
// require("hardhat-contract-sizer")
require('hardhat-deploy')
require('dotenv').config()



const MANTA_TESTNET_PRIVATE_KEY = process.env.MANTA_TESTNET_PRIVATE_KEY; // private key
const MANTA_TESTNET_RPC_URL = process.env.MANTA_TESTNET_RPC_URL // MANTA rpc url

const REPORT_GAS = process.env.REPORT_GAS || false // gas reporting

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            chainId: 31337,
        },
        MANTATestnet: {
            url: MANTA_TESTNET_RPC_URL,
            chainId: 3636,
            accounts: [MANTA_TESTNET_PRIVATE_KEY]
        },
       
    },
    gasReporter: {
        enabled: REPORT_GAS,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
   
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
       
    },
    solidity: {
        compilers: [
            {
                version: "0.8.19",
                version : "0.8.20"
            },
        ],
        settings : {
            optimizer : {
                enabled : true,
                runs : 200,
                details : {
                    yul : true
                }
            },
            viaIR : true
        }
    },
    mocha: {
        timeout: 200000, // 200 seconds max for running tests
    },
}
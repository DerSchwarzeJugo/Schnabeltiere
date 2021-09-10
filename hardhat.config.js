/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [WALLET_PRIVATE_KEY],
      chainId: 80001
    },
    polygon: {
      url: POLYGON_RPC_URL,
      accounts: [WALLET_PRIVATE_KEY],
      chainId: 137
    },
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [WALLET_PRIVATE_KEY],
      chainId: 4 
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: [WALLET_PRIVATE_KEY],
      chainId: 1
    }
  },
  etherscan: {
    // apiKey: ETHERSCAN_API_KEY
    apiKey: POLYGONSCAN_API_KEY
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
};

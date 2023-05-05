require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    // https://docs.bnbchain.org/docs/hardhat-new/
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545", // https://docs.bnbchain.org/docs/rpc
      accounts: [process.env.PRIV_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  },
};

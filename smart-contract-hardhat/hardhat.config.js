require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.4.11",
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      url: `${process.env.INFURA_URL_RINKEBY}`,
      accounts: [`0x${process.env.PRIVATE_KEY_RINKEBY}`],
    },
    bsctest: {
      url: `${process.env.MORALIS_URL_BSCTEST}`,
      // accounts: [`0x${process.env.PRIVATE_KEY_BSCTEST}`],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_TOKEN_RINKEBY,
  },
  bscscan: {
    apiKey: process.env.ETHERSCAN_TOKEN_BSC,
  },
};

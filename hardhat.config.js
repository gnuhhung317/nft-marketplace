require("@nomicfoundation/hardhat-toolbox");
require('dotenv').configDotenv({path:'./.env.local'})
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    // Other networks...
  },
  // networks: {
  //   hardhat:{
  //     chainId:80002
  //   },
  //   polygonAmoy: {
  //     url: `https://polygon-amoy.g.alchemy.com/v2/vkTR7T80RK9fA-7o_XBHtsC5vCZJCjMm`,
  //     accounts: [process.env.ACCOUNT_PRIVATE_KEY],
  //   },
  // },
};

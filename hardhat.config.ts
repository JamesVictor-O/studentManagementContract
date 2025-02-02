
require("@nomiclabs/hardhat-etherscan");
import { HardhatUserConfig } from "hardhat/config";

import dotenv from "dotenv";

dotenv.config();


const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    "sepolia": {
      url: process.env.ALCHEMY_API_KEY!,
      accounts:[process.env.ACCOUNT_PRIVATE_KEY!],
      chainId: 11155111,
      gas:200000000000000,
      gasPrice:1000000000
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY!, 
  },
};
export default config;

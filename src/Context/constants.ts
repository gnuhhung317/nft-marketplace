import nftMarketplace from "./NFTMarketplace.json";

//NFT MARKETPLACE
// Multiple network support
export const SUPPORTED_NETWORKS = {
  LOCALHOST: {
    chainId: 31337,
    chainIdHex: '0x7A69', // 31337 in hex
    name: "Localhost",
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    rpcUrl: "http://127.0.0.1:8545/"
  },
  POLYGON_AMOY: {
    chainId: 80002,
    chainIdHex: '0x13882', // 80002 in hex
    name: "Polygon Amoy",
    contractAddress: "0xd9145CCE52D386f254917e481eB44e9943F39138", // Địa chỉ sau khi deploy trên Polygon Amoy
    rpcUrl: "https://polygon-amoy.g.alchemy.com/v2/vkTR7T80RK9fA-7o_XBHtsC5vCZJCjMm",
  }
};

// Default to localhost if using Hardhat
export const NFTMarketplaceAddress = 
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const NFTMarketplaceABI = nftMarketplace.abi;

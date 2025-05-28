const hre = require("hardhat");

async function main() {
  console.log("🚀 Bắt đầu deploy NFT Marketplace contract...");

  // Deploy contract
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();

  console.log("⏳ Đang chờ contract được deploy...");
  await nftMarketplace.deployed();

  console.log("✅ NFT Marketplace đã được deploy thành công!");
  console.log(`📝 Contract Address: ${nftMarketplace.address}`);

  // Verify contract on Polygonscan
  if (process.env.POLYGONSCAN_API_KEY) {
    console.log("⏳ Đang verify contract trên Polygonscan...");
    try {
      await hre.run("verify:verify", {
        address: nftMarketplace.address,
        constructorArguments: [],
      });
      console.log("✅ Contract đã được verify thành công trên Polygonscan!");
    } catch (error) {
      console.log("❌ Lỗi khi verify contract:", error.message);
    }
  }
}

main().catch((error) => {
  console.error("❌ Lỗi khi deploy:", error);
  process.exitCode = 1;
});

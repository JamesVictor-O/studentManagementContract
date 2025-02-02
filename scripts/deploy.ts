
import { ethers } from "hardhat";

async function main() {
  // Replace 'YourContractName' with your actual contract name
  const Contract = await ethers.getContractFactory("StudentManagement");
  const contract = await Contract.deploy();

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`✅ Contract deployed to: ${contractAddress}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
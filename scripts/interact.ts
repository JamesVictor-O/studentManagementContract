import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Interacting with contract as: ${deployer.address}`);
   
  const contractAddress='0x01f11F807308782b5D1c5Bc8257d2C9C41F800D2'
  const Contract = await ethers.getContractFactory("StudentManagement");
  const contract = Contract.attach(contractAddress);

  // reading from contract

  const students = await contract.getStudents();
  console.log("students:", students);

  await contract.waitForDeployment();

  // writting to smart contract
  const tx = await contract.registerStudent("james", 14, "jss3", 1);
  const recipe=await tx.wait();
  console.log("Student registered successfully!", recipe);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});

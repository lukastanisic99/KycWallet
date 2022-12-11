import { ethers } from "hardhat";
const fs = require("fs");
const path = require("path");
async function main() {
  // Get eth signers
  const signers = await ethers.getSigners();

  // await signers[0].sendTransaction({
  //   to: "0x8F0fB9Aa5d99218747A9DF13e8BBB0e28DC75B42",
  //   value: ethers.utils.parseEther("10.0"),
  // });
  // await signers[0].sendTransaction({
  //   to: "0x0a4DEcf85a4B0CA7775AA77E5ed36131BA3E7868",
  //   value: ethers.utils.parseEther("10.0"),
  // });

  // prepare the contract for deployment
  const counterFactory = await ethers.getContractFactory("SigTest", signers[0]);

  // DEPLOY
  const sigTest = await counterFactory.deploy(signers[0].address);
  await sigTest.deployed();
  sigTest.address;

  const frontPath = path.resolve(__dirname, "../../app/contracts.json");
  // console.log(frontPath);
  const artifactPath = "../artifacts/contracts/Verify.sol/SigTest.json";
  let artifactsJSON = require(artifactPath);
  const contractsJSON = {
    address: sigTest.address,
    abi: artifactsJSON.abi,
  };
  // console.log("ContractsJSON:", contractsJSON);
  fs.writeFileSync(frontPath, JSON.stringify(contractsJSON, null, 2));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

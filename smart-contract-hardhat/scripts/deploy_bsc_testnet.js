const hre = require("hardhat");
const { ethers } = require("hardhat");
require("dotenv").config();

const name = process.env.NAME;
const symbol = process.env.SYMBOL;
const baseURI = process.env.BASE_URI;

const vrfCoordinatorContract = process.env.VRF_COORDINATOR_RINKEBY;
const linkTokenContract = process.env.LINK_RINKEBY;
const fee = process.env.LINK_FEE_RINKEBY; // 0.1 LINK
const keyHash = process.env.KEYHASH_RINKEBY;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account ${deployer.address}`);
  console.log(`Account balance: ${(await deployer.getBalance()).toString()} ETH ** 18`);

  const Derpies = await ethers.getContractFactory("Derpies");
  const derpies = await Derpies.deploy(name, symbol, baseURI, vrfCoordinatorContract, linkTokenContract, keyHash, fee);
  await derpies.deployed();
  console.log(`Derpies contract deployed to ${derpies.address}`);

  const setSaleStatusTx = await derpies.toggleIsSaleActive();
  await setSaleStatusTx.wait();
  const isSaleActiveTx = await derpies.isSaleActive();
  console.log(`isSaleActive set to ${isSaleActiveTx}: minting is live`);
  console.log(`Don't forget to fund the Derpies contract with 50 LINK!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

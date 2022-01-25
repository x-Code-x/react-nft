const hre = require("hardhat");
const { ethers } = require("hardhat");
require("dotenv").config();

const name = process.env.NAME;
const symbol = process.env.SYMBOL;
const baseURI = process.env.BASE_URI;

const fee = process.env.LINK_FEE_RINKEBY; // 0.1 LINK
const keyHash = process.env.KEYHASH_RINKEBY;
const fundAmount = "50000000000000000000"; // 50 LINK (enough to call Chainlink VRF 500 times)

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account ${deployer.address}`);
  console.log(`Account balance: ${(await deployer.getBalance()).toString()} ETH ** 18`);

  // Deploy mocks
  const LinkToken = await ethers.getContractFactory("LinkToken");
  const linkTokenContract = await LinkToken.deploy();
  await linkTokenContract.deployed();
  console.log(`linkTokenContract contract deployed to ${linkTokenContract.address}`);

  const VRFCoordinatorMock = await ethers.getContractFactory("VRFCoordinatorMock");
  const vrfCoordinatorContract = await VRFCoordinatorMock.deploy(linkTokenContract.address);
  await vrfCoordinatorContract.deployed();
  console.log(`vrfCoordinatorMock contract deployed to ${vrfCoordinatorContract.address}`);

  const Derpies = await ethers.getContractFactory("Derpies");
  const derpies = await Derpies.deploy(
    name,
    symbol,
    baseURI,
    vrfCoordinatorContract.address,
    linkTokenContract.address,
    keyHash,
    fee
  );

  await derpies.deployed();
  console.log(`Derpies contract deployed to ${derpies.address}`);

  // Fund contract with link
  const fundLinkTx = await linkTokenContract.transfer(derpies.address, fundAmount);
  fundLinkTx.wait();
  console.log(`Funded Derpies contract with ${fundAmount} LINK ** 18`);

  const setSaleStatusTx = await derpies.toggleIsSaleActive();
  await setSaleStatusTx.wait();
  const isSaleActiveTx = await derpies.isSaleActive();
  console.log(`isSaleActive set to ${isSaleActiveTx}: minting is live`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

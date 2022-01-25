const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

const name = process.env.NAME;
const symbol = process.env.SYMBOL;
const baseURI = process.env.BASE_URI;

// vrfCoordinator and link parameters
const fee = process.env.LINK_FEE_RINKEBY; // 0.1 LINK
const keyHash = process.env.KEYHASH_RINKEBY;
const fundAmount = "50000000000000000000"; // 50 LINK - enough to mint 500 derpies

describe("Whoopsie Derpies NFT", () => {
  let Derpies, derpies;
  let deployer, addr1, addr2, addrs;
  let LinkToken, linkTokenContract;
  let VRFCoordinatorMock, vrfCoordinatorContract;

  beforeEach(async () => {
    // Deploy mocks
    LinkToken = await ethers.getContractFactory("LinkToken");
    linkTokenContract = await LinkToken.deploy();
    await linkTokenContract.deployed();

    VRFCoordinatorMock = await ethers.getContractFactory("VRFCoordinatorMock");
    vrfCoordinatorContract = await VRFCoordinatorMock.deploy(linkTokenContract.address);
    await vrfCoordinatorContract.deployed();

    Derpies = await ethers.getContractFactory("Derpies");
    derpies = await Derpies.deploy(
      name,
      symbol,
      baseURI,
      vrfCoordinatorContract.address,
      linkTokenContract.address,
      keyHash,
      fee
    );
    await derpies.deployed();

    // Fund contract with link
    const fundLinkTx = await linkTokenContract.transfer(derpies.address, fundAmount);
    fundLinkTx.wait();

    [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    it("Should set owner of the contract to the deployer address", async () => {
      expect(await derpies.owner()).to.equal(deployer.address);
    });

    it("isSaleActive should return false when contract first deployed", async () => {
      expect(await derpies.isSaleActive()).to.equal(false);
    });
  });

  describe("Transactions", () => {
    it("Should not allow minting if isSaleActive set to false", async () => {
      await expect(
        derpies.connect(addr1).mintDerpie({ value: ethers.utils.parseEther(process.env.DERPIE_PRICE_IN_ETH) })
      ).to.be.revertedWith("Sale paused");
    });

    it("isSaleActive should return true after toggleIsSaleActive is called", async () => {
      const toggleSaleTx = await derpies.toggleIsSaleActive();
      await toggleSaleTx.wait();
      expect(await derpies.isSaleActive()).to.equal(true);
    });

    it("Should allow minting of a derpie once isSaleActive set to true", async () => {
      const toggleSaleTx = await derpies.toggleIsSaleActive();
      await toggleSaleTx.wait();
      const mintDerpieTx = await derpies.mintDerpie({
        value: ethers.utils.parseEther(process.env.DERPIE_PRICE_IN_ETH),
      });
      const receipt = await mintDerpieTx.wait();
      const requestId = receipt.logs[3].topics[1];
      console.log(`requestId = ${requestId}`);
      const tokenId = receipt.events[3].topics[2];
      console.log(`tokenId = ${tokenId.toString()}`);

      console.log("now waiting for VRF...");
      const randNumTx = await vrfCoordinatorContract.callBackWithRandomness(requestId, 5, derpies.address);
      await randNumTx.wait();

      expect(await derpies.ownerOf(0)).to.equal(deployer.address);
    });

    it("Should return the correct tokenURI", async () => {
      const toggleSaleTx = await derpies.toggleIsSaleActive();
      await toggleSaleTx.wait();
      const mintDerpieTx = await derpies.mintDerpie({
        value: ethers.utils.parseEther(process.env.DERPIE_PRICE_IN_ETH),
      });
      const receipt = await mintDerpieTx.wait();
      const requestId = receipt.logs[3].topics[1];
      const tokenId = receipt.events[3].topics[2];
      const randNumTx = await vrfCoordinatorContract.callBackWithRandomness(requestId, 20, derpies.address);
      await randNumTx.wait();
      const uri = await derpies.tokenURI(0);
      console.log(uri);

      expect(await derpies.tokenURI(0)).to.equal("ipfs://QmNicPcpKMNDdiLUFbBo4kt53Ht2vHczJSrrTpduE5RGdn/Beaver.json");
    });

    it("Should allow an address that is the token owner to transfer the token, and should update ownership", async () => {
      const toggleSaleTx = await derpies.toggleIsSaleActive();
      await toggleSaleTx.wait();
      const mintDerpieTx = await derpies.mintDerpie({
        value: ethers.utils.parseEther(process.env.DERPIE_PRICE_IN_ETH),
      });
      const receipt = await mintDerpieTx.wait();
      const requestId = receipt.logs[3].topics[1];
      const tokenId = receipt.events[3].topics[2];
      const randNumTx = await vrfCoordinatorContract.callBackWithRandomness(requestId, 4, derpies.address);
      await randNumTx.wait();

      const transferTx = await derpies.transferFrom(deployer.address, addr1.address, tokenId);
      await transferTx.wait();
      expect(await derpies.ownerOf(tokenId)).to.equal(addr1.address);
    });

    it("Should not allow an address that is not the token owner to transfer the token", async () => {
      const toggleSaleTx = await derpies.toggleIsSaleActive();
      await toggleSaleTx.wait();
      const mintDerpieTx = await derpies.mintDerpie({
        value: ethers.utils.parseEther(process.env.DERPIE_PRICE_IN_ETH),
      });
      const receipt = await mintDerpieTx.wait();
      const requestId = receipt.logs[3].topics[1];
      const tokenId = receipt.events[3].topics[2];
      const randNumTx = await vrfCoordinatorContract.callBackWithRandomness(requestId, 4, derpies.address);
      await randNumTx.wait();

      const transferTx = await derpies.transferFrom(deployer.address, addr1.address, tokenId);
      await transferTx.wait();
      await expect(derpies.connect(addr1).transferFrom(deployer.address, addr1.address, tokenId)).to.be.reverted;
    });

    it("Should emit an event when a token is transferred", async () => {
      const toggleSaleTx = await derpies.toggleIsSaleActive();
      await toggleSaleTx.wait();
      const mintDerpieTx = await derpies.mintDerpie({
        value: ethers.utils.parseEther(process.env.DERPIE_PRICE_IN_ETH),
      });
      const receipt = await mintDerpieTx.wait();
      const requestId = receipt.logs[3].topics[1];
      const tokenId = receipt.events[3].topics[2];
      const randNumTx = await vrfCoordinatorContract.callBackWithRandomness(requestId, 4, derpies.address);
      await randNumTx.wait();

      await expect(derpies.transferFrom(deployer.address, addr1.address, tokenId))
        .to.emit(derpies, "Transfer")
        .withArgs(deployer.address, addr1.address, tokenId);
    });

    it("Should not allow minting if not enough ether sent", async () => {
      const toggleSaleTx = await derpies.toggleIsSaleActive();
      await toggleSaleTx.wait();

      await expect(derpies.connect(addr1).mintDerpie({ value: ethers.utils.parseEther("0.005") })).to.be.revertedWith(
        "Not enough Ether"
      );
    });

    it("Should not allow minting if all tokens already minted", async () => {
      const toggleSaleTx = await derpies.toggleIsSaleActive();
      await toggleSaleTx.wait();

      // Mint 501 tokens
      for (let i = 0; i < 500; i++) {
        const mintDerpieTx = await derpies.mintDerpie({
          value: ethers.utils.parseEther(process.env.DERPIE_PRICE_IN_ETH),
        });
        const receipt = await mintDerpieTx.wait();
        const requestId = receipt.logs[3].topics[1];
        const tokenId = receipt.events[3].topics[2];
        const randNumTx = await vrfCoordinatorContract.callBackWithRandomness(requestId, 4, derpies.address);
        await randNumTx.wait();
        if (i === 100 || i === 200 || i === 300 || i === 400 || i === 500) {
          console.log(i);
        }
      }

      await expect(
        derpies.mintDerpie({ value: ethers.utils.parseEther(process.env.DERPIE_PRICE_IN_ETH) })
      ).to.be.revertedWith("So very sorry - All Derpies have been minted");
    }).timeout(50000); // increase timeout from 20 seconds to 50 seconds to allow async function to complete

    it("Should properly set _baseTokenURI after calling setBaseURI", async () => {
      const setBaseUriTx = await derpies.setBaseURI("new-base-uri/");
      await setBaseUriTx.wait();

      expect(await derpies.baseTokenURI()).to.equal("new-base-uri/");
    });

    it("Should properly set a new price after calling setPrice", async () => {
      const toggleSaleTx = await derpies.toggleIsSaleActive();
      await toggleSaleTx.wait();

      const setPriceTx = await derpies.setPrice(ethers.utils.parseEther("2"));
      await setPriceTx.wait();

      expect(await derpies.price()).to.equal(ethers.utils.parseEther("2"));
      await expect(
        derpies.mintDerpie({ value: ethers.utils.parseEther(process.env.DERPIE_PRICE_IN_ETH) })
      ).to.be.revertedWith("Not enough Ether");
      const mintDerpieTx = await derpies.mintDerpie({
        value: ethers.utils.parseEther("2"),
      });
      const receipt = await mintDerpieTx.wait();
      const requestId = receipt.logs[3].topics[1];
      const tokenId = receipt.events[3].topics[2];
      const randNumTx = await vrfCoordinatorContract.callBackWithRandomness(requestId, 4, derpies.address);
      await randNumTx.wait();
      expect(await derpies.ownerOf(tokenId)).to.equal(deployer.address);
    });

    it("Should allow deployer to withdraw funds", async () => {
      const provider = ethers.provider;
      const toggleSaleTx = await derpies.toggleIsSaleActive();
      await toggleSaleTx.wait();

      const mintDerpieTx = await derpies.mintDerpie({
        value: ethers.utils.parseEther(process.env.DERPIE_PRICE_IN_ETH),
      });
      const receipt = await mintDerpieTx.wait();
      const requestId = receipt.logs[3].topics[1];
      const tokenId = receipt.events[3].topics[2];
      const randNumTx = await vrfCoordinatorContract.callBackWithRandomness(requestId, 4, derpies.address);
      await randNumTx.wait();

      const beforeBalance = await provider.getBalance(deployer.address);

      const withdrawTx = await derpies.withdraw();
      await withdrawTx.wait();

      const afterBalance = await provider.getBalance(deployer.address);

      expect(parseFloat(afterBalance.toString())).to.be.greaterThan(parseFloat(beforeBalance.toString()));
    });

    it("Fallback function should allow ether to be deposited to contract with no function call", async () => {
      const provider = ethers.provider;

      const fallbackTx = await deployer.sendTransaction({ to: derpies.address, value: ethers.utils.parseEther("5") });
      await fallbackTx.wait();

      expect(await provider.getBalance(derpies.address)).to.equal(ethers.utils.parseEther("5"));
    });
  });
});

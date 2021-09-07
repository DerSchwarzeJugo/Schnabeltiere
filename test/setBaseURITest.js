const { expect } = require("chai");
const { ethers } = require("hardhat");
const { PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS } = require("./testConstants.js")

describe("NFTContract", function () {
  it("Should set new baseURI", async function () {
	//   getSigners() returns list of accounts from connected chain
    const [deployer, addr1] = await ethers.getSigners();

	const MyNFT = await ethers.getContractFactory("NFTContract");
    // Start deployment, returning a promise that resolves to a contract object
	const myNFT = await MyNFT.deploy(PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS);
    await myNFT.deployed();

    expect(await myNFT.baseTokenURI()).to.equal(PASSED_URI);

	const newBaseURI = "test";
	await myNFT.setBaseURI(newBaseURI);
	const baseURI = await myNFT.baseTokenURI();
	expect(newBaseURI == baseURI).to.be.true;
	
  });
});
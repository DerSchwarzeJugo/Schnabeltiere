const { expect } = require("chai");
const { ethers } = require("hardhat");
const { PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS } = require("./testConstants.js")

describe("NFTContract", function () {
  it("Should mint 3 tokens to adress of Owner", async function () {
	//   getSigners() returns list of accounts from connected chain
    const [deployer] = await ethers.getSigners();

	const MyNFT = await ethers.getContractFactory("NFTContract");
    // Start deployment, returning a promise that resolves to a contract object
	const myNFT = await MyNFT.deploy(PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS);
    await myNFT.deployed();

    expect(await myNFT.baseTokenURI()).to.equal(PASSED_URI);

	// connect to wallet addr1 and mint 3 tokens to own adress
	await myNFT.mint(deployer.address, 3);

	const totalSupply = await myNFT.totalSupply();
	expect(totalSupply).to.equal(23);

	const balanceOfOwner = await myNFT.balanceOf(deployer.address);
	expect(balanceOfOwner).to.equal(23);


	
  });
});


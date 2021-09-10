const { expect } = require("chai");
const { ethers } = require("hardhat");
const { PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS } = require("./testConstants.js")

describe("NFTContract", function () {
  it("Should mint 3 tokens to adress #2", async function () {
	//   getSigners() returns list of accounts from connected chain
    const [deployer, addr1] = await ethers.getSigners();

	const MyNFT = await ethers.getContractFactory("NFTContract");
    // Start deployment, returning a promise that resolves to a contract object
	const myNFT = await MyNFT.deploy(PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS);
    await myNFT.deployed();

    expect(await myNFT.baseTokenURI()).to.equal(PASSED_URI);
	const cost = ethers.utils.formatEther(await myNFT.cost());
	const amount = 3
	let overrides = {
		// To convert Ether to Wei:
		value: ethers.utils.parseEther(String(amount * cost))     // ether in this case MUST be a string
	}
	// connect to wallet addr1 and mint 3 tokens to own adress
	// mint takes two arguments, pass overrides as third param
	await myNFT.connect(addr1).mint(addr1.address, amount, overrides);

	const balanceOfAddr1 = await myNFT.balanceOf(addr1.address);
	expect(balanceOfAddr1).to.equal(amount);

	
  });
});

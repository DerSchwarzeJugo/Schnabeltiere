const { expect } = require("chai");
const { ethers } = require("hardhat");
const { PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS } = require("./testConstants.js")

describe("NFTContract", function () {
  it("Should withdraw max amount to deployer wallet", async function () {
	//   getSigners() returns list of accounts from connected chain
    const [deployer, addr1] = await ethers.getSigners();

	const MyNFT = await ethers.getContractFactory("NFTContract");
    // Start deployment, returning a promise that resolves to a contract object
	const myNFT = await MyNFT.deploy(PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS);
    await myNFT.deployed();

    expect(await myNFT.baseTokenURI()).to.equal(PASSED_URI);

	// payable function, must be funded
	let overrides = {
		// To convert Ether to Wei:
		value: ethers.utils.parseEther("0.075")     // ether in this case MUST be a string
	}
	await myNFT.connect(addr1).mint(addr1.address, 3, overrides);

	// now there should be 0.075 eth in smartcontract which we will try to withdraw
	// first get balance for reference
	const prevBalance = await deployer.getBalance();
	await myNFT.withdraw();
	const postBalance = await deployer.getBalance();

	// lt = lowerThan, working with BigNumber Type here
	expect(prevBalance.lt(postBalance)).to.be.true;
	
  });
});
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS } = require("./testConstants.js")

describe("NFTContract", function () {
  it("Should withdraw max amount of charity to deployer wallet", async function () {
	//   getSigners() returns list of accounts from connected chain
    const [deployer, addr1] = await ethers.getSigners();

	const MyNFT = await ethers.getContractFactory("NFTContract");
    // Start deployment, returning a promise that resolves to a contract object
	const myNFT = await MyNFT.deploy(PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS);
    await myNFT.deployed();

    expect(await myNFT.baseTokenURI()).to.equal(PASSED_URI);
	// first get balance for reference
	const prevBalance = await myNFT.charityReceived(deployer.address);
	const prevOwnerBalance = await deployer.getBalance()
	
	// payable function, must be funded
	let overrides = {
		// To convert Ether to Wei:
		from: addr1.address,
		to: myNFT.address,
		value: ethers.utils.parseEther("0.05")     // ether in this case MUST be a string
	}
	await addr1.sendTransaction(overrides)
	
	// now there should be 0.05 eth in smartcontract which we will try to withdraw
	// check if amount was received from the fallback to charity function
	
	await myNFT.withdraw();
	const postBalance = await myNFT.charityReceived(deployer.address);
	const postOwnerBalance = await deployer.getBalance()
	expect(ethers.utils.formatEther(postBalance)).to.equal("0.05")

	// lt = lowerThan, working with BigNumber Type here
	expect(prevBalance.lt(postBalance)).to.be.true;
	expect(prevOwnerBalance.lt(postOwnerBalance)).to.be.true;
	
  });
});
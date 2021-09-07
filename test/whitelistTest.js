const { expect } = require("chai");
const { ethers } = require("hardhat");
const { PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS } = require("./testContstants.js")

describe("NFTContract", function () {
  it("Should whitelist addr1 and deWhitelist it after", async function () {
	//   getSigners() returns list of accounts from connected chain
    const [deployer, addr1] = await ethers.getSigners();

	console.log("Deploying contracts with the account:", deployer.address);

	const MyNFT = await ethers.getContractFactory("NFTContract");
    // Start deployment, returning a promise that resolves to a contract object
	const myNFT = await MyNFT.deploy(PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS);
    await myNFT.deployed();
	console.log("Contract deployed to address:", myNFT.address);

    expect(await myNFT.baseTokenURI()).to.equal(PASSED_URI);

	// whitelisting addr1
	await myNFT.whitelistUser(addr1.address);
	
	// after whitelisting, addr1 should be able to buy without passing msg.value
	await myNFT.connect(addr1).mint(addr1.address, 5);	
	const balanceOfAddr1 = await myNFT.balanceOf(addr1.address);
	expect(balanceOfAddr1).to.equal(5);
	// for public properties of smart contracts, solidity automatically creates getters
	// also assert that whitelisted eq true
	expect(await myNFT.whitelisted(addr1.address)).to.equal(true);
	
	// remove addr1 from whitelisting
	await myNFT.removeWhitelistUser(addr1.address);

	expect(await myNFT.whitelisted(addr1.address)).to.equal(false);
	
  });
});
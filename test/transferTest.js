const { expect } = require("chai");
const { ethers } = require("hardhat");
const { PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS } = require("./testContstants.js")

describe("NFTContract", function () {
  it("Should transfer token #15 to addr1", async function () {
	//   getSigners() returns list of accounts from connected chain
    const [deployer, addr1, addr2] = await ethers.getSigners();

	console.log("Deploying contracts with the account:", deployer.address);

	const MyNFT = await ethers.getContractFactory("NFTContract");
    // Start deployment, returning a promise that resolves to a contract object
	const myNFT = await MyNFT.deploy(PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS);
    await myNFT.deployed();
	console.log("Contract deployed to address:", myNFT.address);
    expect(await myNFT.baseTokenURI()).to.equal(PASSED_URI);

	// transfer item with id 15 to addr1
	// approve & safeTransferFrom are overloaded functions (from erc721), this has diffrent syntax
	await myNFT["safeTransferFrom(address,address,uint256)"](deployer.address, addr1.address, 15);
	const balanceOfAddr1 = await myNFT.balanceOf(addr1.address);
	expect(balanceOfAddr1).to.equal(1);

	// get tokens of addr1
	const walletOfAddr1 = await myNFT.connect(addr1).walletOfOwner(addr1.address);
	convertedArr = []
	for (i = 0; i <= walletOfAddr1.length - 1; i++) {
		// covert bigNumber to number
		convertedArr[i] = walletOfAddr1[0].toNumber() 
	}

	expect(convertedArr[0]).to.equal(15)

	await myNFT["safeTransferFrom(address,address,uint256)"](deployer.address, addr2.address, 11);
	
	await myNFT.connect(addr2)["safeTransferFrom(address,address,uint256)"](addr2.address, addr1.address, 11);

	const balanceOfAddr2 = await myNFT.balanceOf(addr2.address);
	expect(balanceOfAddr2).to.equal(0);

  });
});
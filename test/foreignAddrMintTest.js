const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTContract", function () {
  it("Should mint 3 tokens to adress #2", async function () {
	//   getSigners() returns list of accounts from connected chain
    const [deployer, addr1] = await ethers.getSigners();
	// %20 = " ", %23 = "#"
	const PASSED_URI = "https://nft.derschwarzejugo.com/schnabeltiere/metadata/Fat%20Plat%20%23";
	const TOKEN_NAME = "SchnabelTierTest";
	const TOKEN_SYMBOL = "FTPT";
	const OPENSEA_PROXY_ADDRESS = "0x58807baD0B376efc12F5AD86aAc70E78ed67deaE";

	console.log("Deploying contracts with the account:", deployer.address);

	const MyNFT = await ethers.getContractFactory("NFTContract");
    // Start deployment, returning a promise that resolves to a contract object
	const myNFT = await MyNFT.deploy(PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS);
    await myNFT.deployed();
	console.log("Contract deployed to address:", myNFT.address);

    expect(await myNFT.baseTokenURI()).to.equal(PASSED_URI);

	let overrides = {
		// To convert Ether to Wei:
		value: ethers.utils.parseEther("0.075")     // ether in this case MUST be a string
	}
	// connect to wallet addr1 and mint 3 tokens to own adress
	// mint takes two arguments, pass overrides as third param
	await myNFT.connect(addr1).mint(addr1.address, 3, overrides);

	const balanceOfAddr1 = await myNFT.balanceOf(addr1.address);
	expect(balanceOfAddr1).to.equal(3);

	
  });
});

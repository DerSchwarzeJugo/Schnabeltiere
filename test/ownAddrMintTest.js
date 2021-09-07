const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTContract", function () {
  it("Should mint 3 tokens to adress of Owner", async function () {
	//   getSigners() returns list of accounts from connected chain
    const [deployer] = await ethers.getSigners();
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

	// connect to wallet addr1 and mint 3 tokens to own adress
	await myNFT.mint(deployer.address, 3);

	const totalSupply = await myNFT.totalSupply();
	expect(totalSupply).to.equal(23);

	const balanceOfOwner = await myNFT.balanceOf(deployer.address);
	expect(balanceOfOwner).to.equal(23);


	
  });
});


async function main() {
	const [deployer] = await ethers.getSigners();
	// %20 = " ", %23 = "#"
	const PASSED_URI = "https://nft.derschwarzejugo.com/schnabeltiere/metadata/Fat%20Plat%20%23"
	const TOKEN_NAME = "SchnabelTierTest"
	const TOKEN_SYMBOL = "FTPT"
	const OPENSEA_PROXY_ADDRESS = "0x58807baD0B376efc12F5AD86aAc70E78ed67deaE"

	console.log("Deploying contracts with the account:", deployer.address);

	const MyNFT = await ethers.getContractFactory("NFTContract")
  
	// Start deployment, returning a promise that resolves to a contract object
	const myNFT = await MyNFT.deploy(PASSED_URI, TOKEN_NAME, TOKEN_SYMBOL, OPENSEA_PROXY_ADDRESS)
	console.log("Contract deployed to address:", myNFT.address)
  }
  
  main()
	.then(() => process.exit(0))
	.catch((error) => {
	  console.error(error)
	  process.exit(1)
	})
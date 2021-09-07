// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./opensea/ERC721Tradable.sol";

contract NFTContract is ERC721Tradable {
	using Strings for uint256;

	string public baseURI;
	string public baseExtension = ".json";
	uint256 public cost = 0.025 ether;
	uint256 public maxSupply = 4096;
	uint256 public maxMintAmount = 20;
	bool public paused = false;	
	mapping(address => bool) public whitelisted;

	constructor (
		string memory _initBaseURI,
		string memory _name,
		string memory _symbol,
		address _proxyRegistryAddress
	) ERC721Tradable (_name, _symbol, _proxyRegistryAddress) {
		setBaseURI(_initBaseURI);
		mint(_msgSender(), 20);
	}



	// internal, overriding default function of erc721 contract
	function _baseURI() internal view virtual override returns (string memory) {
		return baseURI;
	}

	 function baseTokenURI() public view override returns (string memory) {
		return baseURI;
	}

	// public
	function mint(address _to, uint256 _mintAmount) public payable {
		uint256 supply = totalSupply();
		// conditions
		require(!paused);
		require(_mintAmount > 0);
		require(_mintAmount <= maxMintAmount);
		require(supply + _mintAmount <= maxSupply);

		// check if owner or whitelisted adress is buying, else set a fee
		if (_msgSender() != owner()) {
			if(whitelisted[_msgSender()] != true) {
				require(msg.value >= cost * _mintAmount);
			}
		}

		// iterate over the wished mintamount and call underlying safemint function
		for (uint256 i; i <= _mintAmount - 1; i++) {
			_safeMint(_to, supply + i);
		}
	}

	function walletOfOwner(address _owner)
		public
		view
		returns (uint256[] memory)
	{
		// make sure the array has the length it need for the nftIDs
		uint256 ownerTokenCount = balanceOf(_owner);
		uint256[] memory tokenIds = new uint256[](ownerTokenCount);
		for (uint256 i; i < ownerTokenCount; i++) {
			tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
		}
		return tokenIds;
	}

	// override default erc721 function
	function tokenURI(uint256 tokenId)
		public
		view
		virtual
		override
		returns (string memory)
	{
		require(
		_exists(tokenId),
		"ERC721Metadata: URI query for nonexistent token"
		);

		string memory currentBaseURI = _baseURI();
		return bytes(currentBaseURI).length > 0
			? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
			: "";
	}

	//only owner
	function setCost(uint256 _newCost) public onlyOwner() {
		cost = _newCost;
	}

	function setMaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner() {
		maxMintAmount = _newmaxMintAmount;
	}

	function setBaseURI(string memory _newBaseURI) public onlyOwner {
		baseURI = _newBaseURI;
	}

	function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
		baseExtension = _newBaseExtension;
	}

	function setPause(bool _state) public onlyOwner {
		paused = _state;
	}
	
	function whitelistUser(address _user) public onlyOwner {
		whitelisted[_user] = true;
	}
	
	function removeWhitelistUser(address _user) public onlyOwner {
		whitelisted[_user] = false;
	}

	function withdraw() public payable onlyOwner {
		require(payable(_msgSender()).send(address(this).balance));
	}
} 
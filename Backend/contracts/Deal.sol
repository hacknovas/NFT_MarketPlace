// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.6 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketPlace is ERC721URIStorage {
    address payable owner;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    Counters.Counter private _itemSold;

    uint listPrice = 0.001 ether;

    constructor() ERC721("NFTMarketPlace", "NFTM") {
        owner = payable(msg.sender);
    }

    struct ListedToken {
        uint tokenId;
        address payable owner;
        address payable seller;
        uint price;
        bool currentlyListed;
    }

    mapping(uint => ListedToken) idToListedToken;

    // helper function
    function updateListPrice(uint _listPrice) public {
        require(msg.sender == owner, "Only Owner Can Perform Any Change");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint) {
        return listPrice;
    }

    function getLatestIdToListedToken()
        public
        view
        returns (ListedToken memory)
    {
        uint currentTokenId = _tokenId.current();
        return idToListedToken[currentTokenId];
    }

    function getListedforTokenId(
        uint tokenId
    ) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint) {
        return _tokenId.current();
    }

    // Main function

    function createToken(
        string memory tokenURI,
        uint price
    ) public payable returns (uint) {
        require(msg.value == listPrice, "Not Enough Ether To List Item.");
        require(price > 0, "Price should Positive");

        _tokenId.increment();
        uint currentTokentId = _tokenId.current();

        _safeMint(msg.sender, currentTokentId); //already implemented function
        _setTokenURI(currentTokentId, tokenURI); //already implemented function

        createListedToken(currentTokentId, price);

        return currentTokentId;
    }

    function createListedToken(uint tokenId, uint price) private {
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            true
        );

        _transfer(msg.sender, address(this), tokenId);
    }

    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenId.current();

        ListedToken[] memory token = new ListedToken[](nftCount);

        uint currentIndex = 0;
        uint currentId;

        for (uint i = 0; i < nftCount; i++) {
            currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            token[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return token;
    }

    function getMyNFT() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenId.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;

        for (uint i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                itemCount += 1;
            }
        }

        ListedToken[] memory items = new ListedToken[](itemCount);

        for (uint i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                currentId = i + 1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    function executeSale(uint tokenId) public payable {
        uint price = idToListedToken[tokenId].price;
        require(msg.value == price, "Please Submit Asking Price For NFT");

        address seller = idToListedToken[tokenId].seller;

        idToListedToken[tokenId].currentlyListed = true;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemSold.increment();

        _transfer(address(this), msg.sender, tokenId); //transfering owership of nft

        approve(address(this), tokenId);

        payable(owner).transfer(listPrice); //transfer amount to owner of webNFT
        payable(seller).transfer(msg.value); //transer amount to prev seller
    }
}



// contract Address= 0xa16040820B5C2762B1f15F452C6bFF63FbF16a5b
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.001 ether;
    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;
    
    mapping(uint256 => TransactionHistory[]) private tokenTransactionHistory;
    mapping(uint256 => Provenance) private tokenProvenance;
    mapping(uint256 => address[]) private tokenOwnershipHistory;
    mapping(uint256 => string) private tokenMediaType;
    mapping(string => uint256[]) private mediaTypeToTokens;

    uint256[] private activeMarketItems;
    mapping(address => uint256[]) private userOwnedTokens;
    mapping(address => uint256[]) private userListedTokens;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    struct TransactionHistory {
        address from;
        address to;
        uint256 price;
        uint256 timestamp;
        TransactionType transactionType;
    }

    struct Provenance {
        address creator;
        uint256 creationTime;
        string metadataURI;
        bool verified;
    }

    enum TransactionType {
        MINT,
        SALE,
        RESELL,
        TRANSFER
    }

    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    event TokenSold(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 price,
        uint256 timestamp
    );

    event TokenResold(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price,
        uint256 timestamp
    );

    event ProvenanceRecorded(
        uint256 indexed tokenId,
        address indexed creator,
        string metadataURI,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "only owner of the marketplace can change the listing price"
        );
        _;
    }

    constructor() ERC721("Metaverse Tokens", "METT") {
        owner = payable(msg.sender);
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint256 _listingPrice)
        public
        payable
        onlyOwner
    {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* OPTIMIZED: Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, uint256 price, string memory mediaType)
        public
        payable
        nonReentrant
        returns (uint256)
    {
        require(price > 0, "Price must be greater than 0");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        tokenMediaType[newTokenId] = mediaType;
        mediaTypeToTokens[mediaType].push(newTokenId);
        
        _recordProvenance(newTokenId, tokenURI);
        tokenOwnershipHistory[newTokenId].push(msg.sender);
        _recordTransaction(newTokenId, address(0), msg.sender, 0, TransactionType.MINT);
        
        createMarketItem(newTokenId, price);
        return newTokenId;
    }

    // NEW: Internal function to record provenance
    function _recordProvenance(uint256 tokenId, string memory metadataURI) private {
        tokenProvenance[tokenId] = Provenance({
            creator: msg.sender,
            creationTime: block.timestamp,
            metadataURI: metadataURI,
            verified: true
        });
        
        emit ProvenanceRecorded(tokenId, msg.sender, metadataURI, block.timestamp);
    }

    // NEW: Internal function to record transaction
    function _recordTransaction(uint256 tokenId, address from, address to, uint256 price, TransactionType txType) private {
        tokenTransactionHistory[tokenId].push(TransactionHistory({
            from: from,
            to: to,
            price: price,
            timestamp: block.timestamp,
            transactionType: txType
        }));
    }

    function createMarketItem(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.sender == ownerOf(tokenId), "Only token owner can create market item");

        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        // OPTIMIZED: Update tracking arrays
        activeMarketItems.push(tokenId);
        userListedTokens[msg.sender].push(tokenId);
        _removeFromUserOwnedTokens(msg.sender, tokenId);

        _transfer(msg.sender, address(this), tokenId);
        emit MarketItemCreated(tokenId, msg.sender, address(this), price, false);
    }

    /* OPTIMIZED: allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Only item owner can perform this operation");
        require(msg.value == listingPrice, "Price must be equal to listing price");
        require(price > 0, "Price must be greater than 0");
        
        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        _itemsSold.decrement();

        // OPTIMIZED: Update tracking arrays
        activeMarketItems.push(tokenId);
        userListedTokens[msg.sender].push(tokenId);
        _removeFromUserOwnedTokens(msg.sender, tokenId);

        // NEW: Record transaction history
        _recordTransaction(tokenId, msg.sender, address(this), price, TransactionType.RESELL);

        _transfer(msg.sender, address(this), tokenId);
        
        emit TokenResold(tokenId, msg.sender, price, block.timestamp);
    }

    /* OPTIMIZED: Creates the sale of a marketplace item */
    function createMarketSale(uint256 tokenId) public payable nonReentrant {
        uint256 price = idToMarketItem[tokenId].price;
        address seller = idToMarketItem[tokenId].seller;
        
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        require(address(this) == ownerOf(tokenId), "Marketplace must be the owner of the token");
        require(!idToMarketItem[tokenId].sold, "This item is already sold");
        require(msg.sender != seller, "Seller cannot buy their own token");

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        _itemsSold.increment();

        // OPTIMIZED: Update tracking arrays
        _removeFromActiveMarketItems(tokenId);
        _removeFromUserListedTokens(seller, tokenId);
        userOwnedTokens[msg.sender].push(tokenId);

        // NEW: Update ownership history
        tokenOwnershipHistory[tokenId].push(msg.sender);

        // NEW: Record transaction history
        _recordTransaction(tokenId, seller, msg.sender, price, TransactionType.SALE);
        
        _transfer(address(this), msg.sender, tokenId);
        payable(owner).transfer(listingPrice);
        payable(seller).transfer(msg.value);

        emit TokenSold(tokenId, seller, msg.sender, price, block.timestamp);
    }

    // OPTIMIZED: Helper functions for array management
    function _removeFromActiveMarketItems(uint256 tokenId) private {
        for (uint256 i = 0; i < activeMarketItems.length; i++) {
            if (activeMarketItems[i] == tokenId) {
                activeMarketItems[i] = activeMarketItems[activeMarketItems.length - 1];
                activeMarketItems.pop();
                break;
            }
        }
    }

    function _removeFromUserOwnedTokens(address user, uint256 tokenId) private {
        uint256[] storage tokens = userOwnedTokens[user];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }

    function _removeFromUserListedTokens(address user, uint256 tokenId) private {
        uint256[] storage tokens = userListedTokens[user];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }

    /* OPTIMIZED: Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        MarketItem[] memory items = new MarketItem[](activeMarketItems.length);
        for (uint256 i = 0; i < activeMarketItems.length; i++) {
            uint256 tokenId = activeMarketItems[i];
            items[i] = idToMarketItem[tokenId];
        }
        return items;
    }

    /* OPTIMIZED: Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256[] memory ownedTokens = userOwnedTokens[msg.sender];
        MarketItem[] memory items = new MarketItem[](ownedTokens.length);
        
        for (uint256 i = 0; i < ownedTokens.length; i++) {
            uint256 tokenId = ownedTokens[i];
            items[i] = idToMarketItem[tokenId];
        }
        return items;
    }

    /* OPTIMIZED: Returns only items a user has listed for sale */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint256[] memory listedTokens = userListedTokens[msg.sender];
        MarketItem[] memory items = new MarketItem[](listedTokens.length);
        
        for (uint256 i = 0; i < listedTokens.length; i++) {
            uint256 tokenId = listedTokens[i];
            items[i] = idToMarketItem[tokenId];
        }
        return items;
    }

    /* NEW: Returns only items that a specific address has purchased */
    function fetchOwnedNFTs(address targetAddress) public view returns (MarketItem[] memory) {
        uint256[] memory ownedTokens = userOwnedTokens[targetAddress];
        MarketItem[] memory items = new MarketItem[](ownedTokens.length);
        
        for (uint256 i = 0; i < ownedTokens.length; i++) {
            uint256 tokenId = ownedTokens[i];
            items[i] = idToMarketItem[tokenId];
        }
        return items;
    }

    /* NEW: Returns only items a specific address has listed for sale */
    function fetchListedNFTs(address targetAddress) public view returns (MarketItem[] memory) {
        uint256[] memory listedTokens = userListedTokens[targetAddress];
        MarketItem[] memory items = new MarketItem[](listedTokens.length);
        
        for (uint256 i = 0; i < listedTokens.length; i++) {
            uint256 tokenId = listedTokens[i];
            items[i] = idToMarketItem[tokenId];
        }
        return items;
    }

    // ===== NEW TRACKING FEATURES =====

    /* 1. LỊCH SỬ GIAO DỊCH - Get transaction history of a token */
    function getTokenTransactionHistory(uint256 tokenId) 
        public 
        view 
        returns (TransactionHistory[] memory) 
    {
        require(_exists(tokenId), "Token does not exist");
        return tokenTransactionHistory[tokenId];
    }

    /* 2. NGUỒN GỐC - Get provenance information of a token */
    function getTokenProvenance(uint256 tokenId) 
        public 
        view 
        returns (Provenance memory) 
    {
        require(_exists(tokenId), "Token does not exist");
        return tokenProvenance[tokenId];
    }

    /* 3. CHỦ SỞ HỮU - Get ownership history of a token */
    function getTokenOwnershipHistory(uint256 tokenId) 
        public 
        view 
        returns (address[] memory) 
    {
        require(_exists(tokenId), "Token does not exist");
        return tokenOwnershipHistory[tokenId];
    }

    /* Additional utility functions for tracking */
    
    /* Get current owner of a token */
    function getCurrentTokenOwner(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return ownerOf(tokenId);
    }

    /* Get total number of transactions for a token */
    function getTokenTransactionCount(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return tokenTransactionHistory[tokenId].length;
    }

    /* Get total number of previous owners for a token */
    function getTokenOwnerCount(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return tokenOwnershipHistory[tokenId].length;
    }

    /* Verify if a token is original (created by current owner) */
    function isOriginalToken(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        return tokenProvenance[tokenId].creator == ownerOf(tokenId);
    }

    /* Get tokens created by a specific address */
    function getTokensCreatedBy(address creator) public view returns (uint256[] memory) {
        uint256 totalTokens = _tokenIds.current();
        uint256 count = 0;
        
        // Count tokens created by this address
        for (uint256 i = 1; i <= totalTokens; i++) {
            if (tokenProvenance[i].creator == creator) {
                count++;
            }
        }
        
        // Collect token IDs
        uint256[] memory createdTokens = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= totalTokens; i++) {
            if (tokenProvenance[i].creator == creator) {
                createdTokens[index] = i;
                index++;
            }
        }
        
        return createdTokens;
    }

    /* NEW: Returns NFT details by tokenId with access control */
    function fetchNFTByTokenId(uint256 tokenId) public view returns (MarketItem memory) {
        require(_exists(tokenId), "Token does not exist");
        
        // Kiểm tra xem token có đang được list trên market không
        bool isListed = false;
        for (uint256 i = 0; i < activeMarketItems.length; i++) {
            if (activeMarketItems[i] == tokenId) {
                isListed = true;
                break;
            }
        }
        
        // Kiểm tra xem người dùng có phải là chủ sở hữu token không
        bool isOwner = ownerOf(tokenId) == msg.sender;
        
        // Chỉ cho phép xem nếu token đang được list hoặc người dùng là chủ sở hữu
        require(isListed || isOwner, "Token is not accessible");
        
        return idToMarketItem[tokenId];
    }

    /* NEW: Returns all NFTs of a specific media type */
    function fetchNFTsByMediaType(string memory mediaType) public view returns (MarketItem[] memory) {
        uint256[] memory tokens = mediaTypeToTokens[mediaType];
        uint256 count = 0;
        
        // Đếm số lượng token đang được list trên market
        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 tokenId = tokens[i];
            if (!idToMarketItem[tokenId].sold) {
                count++;
            }
        }
        
        // Tạo mảng kết quả
        MarketItem[] memory items = new MarketItem[](count);
        uint256 index = 0;
        
        // Lấy thông tin các token đang được list
        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 tokenId = tokens[i];
            if (!idToMarketItem[tokenId].sold) {
                items[index] = idToMarketItem[tokenId];
                index++;
            }
        }
        
        return items;
    }

    /* NEW: Returns the media type of a specific token */
    function getTokenMediaType(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return tokenMediaType[tokenId];
    }

    /* NEW: Returns all available media types */
    function getAvailableMediaTypes() public view returns (string[] memory) {
        // Lưu ý: Trong thực tế, bạn nên lưu trữ danh sách các media type đã sử dụng
        // Đây là một ví dụ đơn giản với các media type cố định
        string[] memory mediaTypes = new string[](3);
        mediaTypes[0] = "image";
        mediaTypes[1] = "video";
        mediaTypes[2] = "audio";
        return mediaTypes;
    }
}

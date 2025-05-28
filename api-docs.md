# NFT Marketplace API Documentation

This document outlines the backend API endpoints available in the NFT Marketplace application. The API is organized into several logical sections according to functionality.

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Account Management](#account-management)
4. [NFT Management](#nft-management)
5. [Marketplace Operations](#marketplace-operations)
6. [Wallet Integration](#wallet-integration)
7. [Social Features](#social-features)
8. [API Best Practices](#api-best-practices)

## API Overview

The NFT Marketplace backend is built with Next.js Server Actions, which provides a set of API endpoints that interact with:

- PostgreSQL database (via Prisma ORM)
- Ethereum blockchain (via ethers.js)
- IPFS/Pinata for storage

All API responses follow a standard format:

```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

## Authentication

### Connect Wallet

Establishes a connection between the user's blockchain wallet and the application.

```http
POST /api/wallet/connect
```

**Request Body:**
```json
{
  "walletType": "metamask" | "walletconnect" | "walletlink" | "formatic"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accountAddress": "0x123...",
    "chainId": "0x89",
    "balance": "0.05"
  }
}
```

### Disconnect Wallet

Disconnects the user's wallet from the application.

```http
POST /api/wallet/disconnect
```

**Response:**
```json
{
  "success": true
}
```

### Sign Transaction

Signs a transaction using the connected wallet.

```http
POST /api/wallet/sign-transaction
```

**Request Body:**
```json
{
  "transaction": {
    "to": "0xContractAddress",
    "data": "0xEncodedData",
    "value": "0.01"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "signature": "0xSignature..."
  }
}
```

## Account Management

### Get Account

Retrieves account information for the specified wallet address.

```http
GET /api/account/:accountAddress
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accountAddress": "0x123...",
    "username": "CryptoCreator",
    "email": "user@example.com",
    "description": "Digital artist and NFT creator",
    "website": "https://example.com",
    "facebook": "https://facebook.com/user",
    "twitter": "https://twitter.com/user",
    "instagram": "https://instagram.com/user",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

### Update Account

Updates account information for the authenticated user.

```http
PUT /api/account
```

**Request Body:**
```json
{
  "accountAddress": "0x123...",
  "username": "CryptoCreator",
  "email": "user@example.com",
  "description": "Digital artist and NFT creator",
  "website": "https://example.com",
  "facebook": "https://facebook.com/user",
  "twitter": "https://twitter.com/user",
  "instagram": "https://instagram.com/user",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true
}
```

## NFT Management

### Create NFT

Creates a new NFT token on the blockchain and stores metadata in the database.

```http
POST /api/nft
```

**Request Body:**
```json
{
  "tokenURI": "ipfs://QmMetadataHash",
  "price": "0.1",
  "seller": "0x123...",
  "owner": "0x123...",
  "sold": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokenId": "1",
    "seller": "0x123...",
    "owner": "0x123...",
    "price": "0.1",
    "sold": false,
    "tokenURI": "ipfs://QmMetadataHash",
    "name": "Artwork Name",
    "image": "ipfs://QmImageHash",
    "description": "NFT description"
  }
}
```

### Upload to IPFS

Uploads an image to IPFS/Pinata and returns the hash.

```http
POST /api/nft/upload
```

**Request Body:**
```
Form Data with 'file' field containing image data
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hash": "QmImageHash",
    "url": "ipfs://QmImageHash"
  }
}
```

### Get NFT Details

Retrieves detailed information about a specific NFT.

```http
GET /api/nft/:tokenId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokenId": "1",
    "seller": "0x123...",
    "owner": "0x123...",
    "price": "0.1",
    "sold": false,
    "tokenURI": "ipfs://QmMetadataHash",
    "name": "Artwork Name",
    "image": "ipfs://QmImageHash",
    "description": "NFT description",
    "likes": [
      {
        "accountAddress": "0x456...",
        "liked": 1
      }
    ]
  }
}
```

### Get All NFTs

Retrieves all NFTs currently listed on the marketplace.

```http
GET /api/nft/market
```

**Query Parameters:**
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `search` (optional): Search by name

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "tokenId": "1",
      "seller": "0x123...",
      "owner": "0x123...",
      "price": "0.1",
      "sold": false,
      "tokenURI": "ipfs://QmMetadataHash",
      "name": "Artwork Name",
      "image": "ipfs://QmImageHash",
      "description": "NFT description"
    }
  ]
}
```

### Get NFTs by Owner

Retrieves all NFTs owned by a specific address.

```http
GET /api/nft/owner/:address
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "tokenId": "1",
      "seller": "0x123...",
      "owner": "0x456...",
      "price": "0.1",
      "sold": true,
      "tokenURI": "ipfs://QmMetadataHash",
      "name": "Artwork Name",
      "image": "ipfs://QmImageHash",
      "description": "NFT description"
    }
  ]
}
```

### Get NFTs by Seller

Retrieves all NFTs created or currently being sold by a specific address.

```http
GET /api/nft/seller/:address
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "tokenId": "1",
      "seller": "0x123...",
      "owner": "0x123...",
      "price": "0.1",
      "sold": false,
      "tokenURI": "ipfs://QmMetadataHash",
      "name": "Artwork Name",
      "image": "ipfs://QmImageHash",
      "description": "NFT description"
    }
  ]
}
```

## Marketplace Operations

### Buy NFT

Purchases an NFT from the marketplace.

```http
POST /api/market/buy
```

**Request Body:**
```json
{
  "tokenId": "1",
  "price": "0.1",
  "buyer": "0x456..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokenId": "1",
    "seller": "0x123...",
    "owner": "0x456...",
    "price": "0.1",
    "sold": true
  }
}
```

### Resell NFT

Lists a previously purchased NFT for sale.

```http
POST /api/market/resell
```

**Request Body:**
```json
{
  "tokenId": "1",
  "price": "0.2",
  "seller": "0x456..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokenId": "1",
    "seller": "0x456...",
    "owner": "0xMarketplaceContract...",
    "price": "0.2",
    "sold": false
  }
}
```

### Get Listing Price

Retrieves the current marketplace listing fee.

```http
GET /api/market/listing-price
```

**Response:**
```json
{
  "success": true,
  "data": {
    "listingPrice": "0.000000"
  }
}
```

## Wallet Integration

### Get Balance

Retrieves the current balance of the connected wallet.

```http
GET /api/wallet/balance/:address
```

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": "0.05",
    "symbol": "ETH"
  }
}
```

### Get Transaction History

Retrieves the transaction history for a wallet.

```http
GET /api/wallet/transactions/:address
```

**Query Parameters:**
- `type` (optional): Filter by transaction type (buy, sell, mint)
- `limit` (optional): Number of transactions to return
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "transactionHash": "0xHash...",
      "type": "buy",
      "tokenId": "1",
      "from": "0x123...",
      "to": "0x456...",
      "price": "0.1",
      "timestamp": "2023-05-15T12:00:00Z"
    }
  ]
}
```

### Switch Network

Switches the connected wallet to a different blockchain network.

```http
POST /api/wallet/switch-network
```

**Request Body:**
```json
{
  "chainId": "0x89" // Polygon Mainnet
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "chainId": "0x89",
    "name": "Polygon Mainnet"
  }
}
```

### Get Supported Networks

Retrieves a list of supported blockchain networks.

```http
GET /api/wallet/supported-networks
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "chainId": "0x1",
      "name": "Ethereum Mainnet"
    },
    {
      "chainId": "0x89",
      "name": "Polygon Mainnet"
    },
    {
      "chainId": "0x13881",
      "name": "Polygon Mumbai Testnet"
    }
  ]
}
```

## Social Features

### Like or Dislike NFT

Toggles a like/dislike on an NFT by a user.

```http
POST /api/social/like
```

**Request Body:**
```json
{
  "tokenId": "1",
  "accountAddress": "0x123..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nFTTokenId": "1",
    "accountAddress": "0x123...",
    "liked": 1
  }
}
```

### Get Likes

Retrieves all likes for a specific NFT.

```http
GET /api/social/likes/:tokenId
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nFTTokenId": "1",
      "accountAddress": "0x123...",
      "liked": 1
    }
  ]
}
```

## API Best Practices

### Error Handling

All API endpoints handle errors consistently and return appropriate HTTP status codes:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication failure
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

Error responses follow this format:

```json
{
  "success": false,
  "error": "Detailed error message"
}
```

### Authentication

Most API endpoints require authentication via:

1. A valid wallet connection
2. Message signature verification for sensitive operations

### Rate Limiting

To prevent abuse, API rate limiting is implemented:

- 60 requests per minute for unauthenticated users
- 120 requests per minute for authenticated users

### Versioning

The API uses versioning to ensure backward compatibility:

```
/api/v1/resource
```

Future versions will be accessible via:

```
/api/v2/resource
```

### Pagination

For endpoints that return large collections, pagination is supported via:

- `limit`: Number of items to return (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

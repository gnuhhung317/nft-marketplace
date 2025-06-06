# Kiến thức Blockchain & NFT trong NFT Marketplace

## 1. Blockchain & Ethereum

### 1.1. Blockchain
- Là một sổ cái phân tán (distributed ledger)
- Lưu trữ thông tin một cách an toàn và minh bạch
- Không thể sửa đổi dữ liệu đã được ghi nhận
- Được bảo mật bởi cơ chế đồng thuận

### 1.2. Ethereum
- Nền tảng blockchain phổ biến nhất cho dApps
- Cho phép tạo và chạy smart contract
- Có máy ảo Ethereum (EVM) để thực thi code
- Hỗ trợ nhiều ngôn ngữ lập trình (Solidity, Vyper)

### 1.3. Mạng trong dự án
- **Ethereum Mainnet**: Mạng chính
- **Polygon Amoy**: Mạng test
- **Hardhat**: Mạng local cho phát triển
- **Chain ID**:
  + Ethereum Mainnet: 1
  + Polygon Amoy: 80002
  + Localhost: 31337

## 2. Smart Contract

### 2.1. Khái niệm
- Là các đoạn code chạy trên blockchain
- Tự động thực thi khi đáp ứng điều kiện
- Không thể sửa đổi sau khi triển khai
- Được viết bằng ngôn ngữ Solidity

### 2.2. Smart Contract trong dự án
- **NFTMarketplace.sol**: Contract chính
- Kế thừa từ ERC721 của OpenZeppelin
- Quản lý toàn bộ hoạt động marketplace
- Xử lý mint, mua bán, chuyển NFT

### 2.3. Cấu trúc dữ liệu
```solidity
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
```

## 3. Token & NFT

### 3.1. Token
- Đại diện cho một tài sản hoặc quyền lợi
- Có thể thay thế (fungible) hoặc không thay thế (non-fungible)
- Tuân theo các chuẩn ERC

### 3.2. NFT (Non-Fungible Token)
- Token không thể thay thế
- Mỗi token là duy nhất
- Đại diện cho tài sản số
- Tuân theo chuẩn ERC721

### 3.3. Chuẩn ERC721
- Chuẩn kỹ thuật cho NFT trên Ethereum
- Các hàm cơ bản:
  + `balanceOf`: Kiểm tra số lượng NFT
  + `ownerOf`: Kiểm tra chủ sở hữu
  + `transferFrom`: Chuyển NFT
  + `approve`: Cho phép chuyển NFT
  + `setApprovalForAll`: Cho phép quản lý tất cả NFT

## 4. Mint & Giao dịch

### 4.1. Mint
- Quá trình tạo NFT mới trên blockchain
- Yêu cầu phí gas
- Trong dự án: Hàm `createToken()`
- Lưu trữ metadata trên IPFS

### 4.2. Gas Fee
- Phí giao dịch trên blockchain
- Phụ thuộc vào:
  + Độ phức tạp của giao dịch
  + Giá gas hiện tại
  + Độ ưu tiên giao dịch

### 4.3. Giao dịch
- **Mint**: Tạo NFT mới
- **Sale**: Bán NFT
- **Resell**: Bán lại NFT
- **Transfer**: Chuyển NFT

## 5. IPFS & Pinata

### 5.1. IPFS
- Hệ thống lưu trữ phi tập trung
- Lưu trữ file theo content hash
- Không có địa chỉ IP cố định
- Cần pinning để duy trì file

### 5.2. Pinata
- Dịch vụ pinning IPFS
- Cung cấp API để upload file
- Lưu trữ metadata NFT
- Đảm bảo tính sẵn sàng của dữ liệu

## 6. Wallet & Web3

### 6.1. Wallet
- Ví điện tử để quản lý tài sản số
- Lưu trữ private key
- Ký giao dịch
- Tương tác với dApps

### 6.2. Web3
- Thư viện tương tác với blockchain
- Cung cấp API để:
  + Đọc dữ liệu từ blockchain
  + Gửi giao dịch
  + Tương tác với smart contract

### 6.3. Web3Modal
- Thư viện UI để kết nối ví
- Hỗ trợ nhiều loại ví:
  + MetaMask
  + WalletConnect
  + Coinbase Wallet
  + Trust Wallet

## 7. Metadata & Provenance

### 7.1. Metadata
- Thông tin mô tả về NFT
- Bao gồm:
  + Tên
  + Mô tả
  + Hình ảnh
  + Thuộc tính
- Được lưu trữ trên IPFS

### 7.2. Provenance
- Lịch sử nguồn gốc của NFT
- Bao gồm:
  + Người tạo
  + Thời gian tạo
  + Lịch sử sở hữu
  + Giá giao dịch
- Giúp xác minh tính xác thực

## 8. Công cụ phát triển

### 8.1. Hardhat
- Môi trường phát triển smart contract
- Tính năng:
  + Biên dịch contract
  + Test contract
  + Triển khai contract
  + Tương tác với contract
  + Debug contract

### 8.2. OpenZeppelin
- Thư viện smart contract chuẩn
- Cung cấp:
  + ERC721
  + ReentrancyGuard
  + AccessControl
  + Các contract an toàn khác

### 8.3. Alchemy
- Dịch vụ cung cấp node blockchain
- Tính năng:
  + API để tương tác với blockchain
  + Theo dõi giao dịch
  + Quản lý event
  + Hỗ trợ nhiều mạng

## 9. Bảo mật

### 9.1. ReentrancyGuard
- Bảo vệ khỏi tấn công reentrancy
- Ngăn chặn gọi lại hàm trong quá trình thực thi
- Được sử dụng trong các hàm quan trọng

### 9.2. Access Control
- Kiểm soát quyền truy cập
- Chỉ cho phép địa chỉ được ủy quyền
- Sử dụng modifier trong Solidity

### 9.3. Gas Optimization
- Tối ưu hóa gas fee
- Sử dụng cấu trúc dữ liệu hiệu quả
- Tránh vòng lặp không cần thiết
- Sử dụng mapping thay vì array

## 10. Marketplace

### 10.1. Chức năng chính
- Đăng bán NFT
- Mua NFT
- Đấu giá
- Theo dõi giá
- Quản lý danh sách

### 10.2. Quy trình giao dịch
1. Người bán đăng NFT
2. Người mua xem thông tin
3. Thực hiện giao dịch
4. Cập nhật quyền sở hữu
5. Lưu lịch sử giao dịch

### 10.3. Phí giao dịch
- Phí listing
- Phí gas
- Phí marketplace
- Phí creator (royalty)

## 11. Kiến trúc hệ thống Blockchain

### 11.1. Cấu trúc cơ bản
- **Node**: Máy tính tham gia vào mạng blockchain
  + Full Node: Lưu trữ toàn bộ blockchain
  + Light Node: Chỉ lưu trữ header
  + Archive Node: Lưu trữ toàn bộ lịch sử

- **Block**: Đơn vị lưu trữ dữ liệu
  + Header: Thông tin về block
  + Transactions: Danh sách giao dịch
  + State Root: Trạng thái của toàn bộ hệ thống

- **Consensus**: Cơ chế đồng thuận
  + Proof of Work (PoW): Ethereum 1.0
  + Proof of Stake (PoS): Ethereum 2.0
  + Delegated Proof of Stake (DPoS): Polygon

### 11.2. Tương tác với Blockchain

#### 11.2.1. RPC (Remote Procedure Call)
- Giao thức cho phép gọi hàm từ xa
- Các phương thức RPC phổ biến:
  ```json
  {
    "jsonrpc": "2.0",
    "method": "eth_getBalance",
    "params": ["0x...", "latest"],
    "id": 1
  }
  ```
- Các provider RPC:
  + Alchemy
  + Infura
  + QuickNode
  + Public RPC

#### 11.2.2. Web3 Provider
- Kết nối ứng dụng với blockchain
- Các loại provider:
  ```typescript
  // HTTP Provider
  const provider = new ethers.providers.JsonRpcProvider(url);
  
  // WebSocket Provider
  const provider = new ethers.providers.WebSocketProvider(url);
  
  // MetaMask Provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  ```

#### 11.2.3. Event & Listener
- Lắng nghe sự kiện từ smart contract
- Ví dụ:
  ```typescript
  contract.on("Transfer", (from, to, tokenId, event) => {
    console.log(`NFT ${tokenId} transferred from ${from} to ${to}`);
  });
  ```

### 11.3. Quản lý State

#### 11.3.1. State Tree
- Cấu trúc dữ liệu Merkle Patricia Trie
- Lưu trữ:
  + Account balances
  + Smart contract storage
  + Code storage
  + Nonce

#### 11.3.2. Storage Layout
- Cách dữ liệu được lưu trữ trong contract
- Các kiểu storage:
  ```solidity
  // Storage: Lưu trữ vĩnh viễn
  uint256 private value;
  
  // Memory: Tạm thời trong function
  function example(uint256[] memory data) {}
  
  // Stack: Biến local
  function example() {
    uint256 local = 1;
  }
  ```

### 11.4. Gas & Transaction

#### 11.4.1. Gas Calculation
- Cách tính gas:
  + Base cost: 21,000 gas
  + Data cost: 4 gas/byte
  + Computation cost: Theo opcode
  + Storage cost: 20,000 gas cho lần đầu, 5,000 gas cho lần sau

#### 11.4.2. Transaction Flow
1. Tạo transaction
2. Ký transaction với private key
3. Broadcast lên mạng
4. Miner/Validator xác nhận
5. Thêm vào block
6. Cập nhật state

### 11.5. Smart Contract Interaction

#### 11.5.1. ABI (Application Binary Interface)
- Định nghĩa cách tương tác với contract
- Ví dụ:
  ```json
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
  ```

#### 11.5.2. Contract Instance
- Tạo instance để tương tác:
  ```typescript
  const contract = new ethers.Contract(
    address,
    abi,
    signer
  );
  ```

#### 11.5.3. Function Calls
- Read functions (view/pure):
  ```typescript
  const owner = await contract.ownerOf(tokenId);
  ```
- Write functions:
  ```typescript
  const tx = await contract.transferFrom(from, to, tokenId);
  await tx.wait();
  ```

### 11.6. Network & Node Management

#### 11.6.1. Node Types
- **Archive Node**
  + Lưu trữ toàn bộ lịch sử
  + Dùng cho indexer, explorer
  + Yêu cầu nhiều storage

- **Full Node**
  + Lưu trữ state hiện tại
  + Có thể validate transactions
  + Yêu cầu vừa phải

- **Light Node**
  + Chỉ lưu trữ headers
  + Dùng cho mobile wallet
  + Yêu cầu ít tài nguyên

#### 11.6.2. Network Configuration
- Chain ID
- Network ID
- Genesis block
- Bootnodes
- Peers

#### 11.6.3. Syncing
- Full sync
- Fast sync
- Light sync
- Archive sync

### 11.7. Security & Optimization

#### 11.7.1. Security Best Practices
- Input validation
- Access control
- Reentrancy protection
- Integer overflow/underflow
- Gas optimization

#### 11.7.2. Gas Optimization
- Batch operations
- Efficient data structures
- Storage vs Memory
- Loop optimization
- Event optimization

#### 11.7.3. Testing & Verification
- Unit testing
- Integration testing
- Formal verification
- Security audits
- Gas profiling 
# NFT Marketplace Smart Contract

## Tổng Quan

Smart Contract NFTMarketplace là trung tâm của hệ thống, được xây dựng trên tiêu chuẩn ERC721 để quản lý việc tạo, mua bán và chuyển nhượng NFT. Contract này triển khai trên mạng Ethereum (hoặc các mạng tương thích như Polygon), cho phép người dùng đúc (mint) NFT mới, đăng bán trên sàn giao dịch, và thực hiện giao dịch mua bán.

## Thông Tin Kỹ Thuật

- **Ngôn ngữ**: Solidity v0.8.4
- **Tiêu chuẩn**: ERC721 (NFT standard)
- **Thư viện**: OpenZeppelin Contracts (ERC721URIStorage, Counters)
- **Tên Token**: "Metaverse Tokens"
- **Ký hiệu Token**: "METT"

## Cấu Trúc Dữ Liệu

### Biến Trạng Thái

- `_tokenIds`: Bộ đếm để theo dõi tổng số NFT đã được tạo
- `_itemsSold`: Bộ đếm để theo dõi số lượng NFT đã bán
- `listingPrice`: Phí niêm yết NFT trên sàn (0.000000 ether - có thể được cập nhật)
- `owner`: Địa chỉ người sở hữu và quản lý sàn giao dịch
- `idToMarketItem`: Mapping lưu trữ thông tin chi tiết của từng NFT

### Struct

```solidity
struct MarketItem {
    uint256 tokenId;    // ID của NFT
    address payable seller;  // Người bán
    address payable owner;   // Người sở hữu hiện tại
    uint256 price;      // Giá của NFT
    bool sold;         // Trạng thái đã bán hay chưa
}
```

### Events

```solidity
event MarketItemCreated(
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
);
```
Event này được phát ra khi một NFT mới được tạo hoặc được đăng bán lại trên sàn.

## Chức Năng Chính

### 1. Quản Lý Sàn Giao Dịch

#### `updateListingPrice(uint256 _listingPrice)`
- **Mô tả**: Cập nhật phí niêm yết trên sàn
- **Quyền truy cập**: Chỉ chủ sở hữu sàn (owner)
- **Tham số**: `_listingPrice` - Phí mới sẽ được áp dụng

#### `getListingPrice()`
- **Mô tả**: Trả về phí niêm yết hiện tại
- **Quyền truy cập**: Public
- **Trả về**: Giá trị phí niêm yết (uint256)

### 2. Tạo và Quản Lý NFT

#### `createToken(string memory tokenURI, uint256 price)`
- **Mô tả**: Tạo NFT mới và đăng lên sàn giao dịch
- **Quyền truy cập**: Public, có thể đính kèm ETH (payable)
- **Tham số**:
  - `tokenURI`: URI chứa metadata của NFT (JSON lưu trên IPFS)
  - `price`: Giá bán NFT
- **Yêu cầu**: Người gọi phải gửi kèm đúng phí niêm yết
- **Quy trình**:
  1. Tăng bộ đếm _tokenIds
  2. Mint NFT mới cho người gọi
  3. Thiết lập tokenURI 
  4. Tạo item trên marketplace
  5. Trả về ID của token mới

#### `createMarketItem(uint256 tokenId, uint256 price)` (private)
- **Mô tả**: Hàm internal để tạo một item trên marketplace
- **Quyền truy cập**: Private 
- **Tham số**:
  - `tokenId`: ID của NFT
  - `price`: Giá bán NFT
- **Yêu cầu**:
  - Giá phải lớn hơn 0
  - Người gọi phải gửi kèm đúng phí niêm yết
- **Quy trình**:
  1. Lưu thông tin NFT vào mapping
  2. Chuyển quyền sở hữu NFT tạm thời cho contract
  3. Phát ra event MarketItemCreated

### 3. Giao Dịch NFT

#### `resellToken(uint256 tokenId, uint256 price)`
- **Mô tả**: Cho phép người sở hữu NFT đăng bán lại
- **Quyền truy cập**: Public, có thể đính kèm ETH (payable)
- **Tham số**:
  - `tokenId`: ID của NFT cần bán lại
  - `price`: Giá bán mới
- **Yêu cầu**:
  - Người gọi phải là chủ sở hữu NFT
  - Phải gửi kèm đúng phí niêm yết
- **Quy trình**:
  1. Cập nhật thông tin NFT trong mapping
  2. Giảm bộ đếm _itemsSold
  3. Chuyển NFT về cho contract

#### `createMarketSale(uint256 tokenId)`
- **Mô tả**: Thực hiện giao dịch mua NFT
- **Quyền truy cập**: Public, có thể đính kèm ETH (payable)
- **Tham số**: `tokenId` - ID của NFT muốn mua
- **Yêu cầu**: Người mua phải gửi đúng số ETH bằng giá trị NFT
- **Quy trình**:
  1. Chuyển quyền sở hữu NFT cho người mua
  2. Cập nhật trạng thái bán
  3. Tăng bộ đếm _itemsSold
  4. Chuyển phí niêm yết cho chủ sàn
  5. Chuyển tiền thanh toán cho người bán

### 4. Truy Vấn Dữ Liệu

#### `fetchMarketItems()`
- **Mô tả**: Lấy danh sách tất cả NFT đang được bán trên sàn
- **Quyền truy cập**: Public view
- **Trả về**: Mảng các MarketItem chưa bán

#### `fetchMyNFTs()`
- **Mô tả**: Lấy danh sách NFT mà người gọi sở hữu
- **Quyền truy cập**: Public view
- **Trả về**: Mảng các MarketItem thuộc sở hữu của người gọi

#### `fetchItemsListed()`
- **Mô tả**: Lấy danh sách NFT mà người gọi đang bán
- **Quyền truy cập**: Public view
- **Trả về**: Mảng các MarketItem do người gọi đăng bán

## Mô Hình Hoạt Động

1. **Đúc NFT Mới**:
   - Người dùng gọi `createToken` với metadata và giá
   - Họ phải trả phí niêm yết
   - NFT được mint và đăng lên sàn

2. **Mua NFT**:
   - Người mua gọi `createMarketSale` với số tiền bằng giá NFT
   - NFT được chuyển cho người mua
   - Tiền được chuyển cho người bán
   - Phí niêm yết được chuyển cho chủ sàn

3. **Bán Lại NFT**:
   - Chủ sở hữu gọi `resellToken` với giá mới
   - Họ phải trả phí niêm yết
   - NFT được đăng lại lên sàn để bán

## Bảo Mật và Kiểm Soát

- **Modifier `onlyOwner`**: Giới hạn một số chức năng chỉ cho chủ sở hữu sàn
- **Kiểm tra quyền sở hữu**: Đảm bảo chỉ chủ sở hữu NFT mới có thể đăng bán lại
- **Xác thực giao dịch**: Đảm bảo người mua trả đúng giá yêu cầu
- **Ngăn chặn giao dịch giá 0**: Yêu cầu giá NFT phải > 0

## Kết Luận

Smart contract NFTMarketplace triển khai đầy đủ các chức năng cốt lõi của một sàn giao dịch NFT, bao gồm tạo NFT, mua bán, và quản lý quyền sở hữu. Contract được thiết kế để bảo đảm tính minh bạch, an toàn và hiệu quả trong giao dịch. Nó sử dụng các tiêu chuẩn và thư viện từ OpenZeppelin, đảm bảo tuân thủ các tiêu chuẩn tốt nhất trong phát triển smart contract. 
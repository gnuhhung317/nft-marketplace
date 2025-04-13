# NFT Marketplace - Luồng Hoạt Động Chức Năng

## 1. Luồng Kết Nối Ví (Wallet Connection)

1. Người dùng truy cập trang Connect Wallet hoặc nhấn nút kết nối
2. Gọi hàm `connectWallet()` từ NFTMarketplaceContext
3. Kiểm tra xem MetaMask đã được cài đặt chưa
4. Gọi `window.ethereum.request()` với method "eth_requestAccounts"
5. Lưu địa chỉ ví vào state `currentAccount`
6. Kết nối với smart contract thông qua `connectingWithSmartContract()`
7. Lắng nghe sự kiện thay đổi tài khoản từ MetaMask

## 2. Luồng Tạo NFT (NFT Creation)

1. Người dùng truy cập trang tạo NFT
2. Nhập thông tin: tên, mô tả, giá, tải ảnh lên
3. Ảnh được upload lên IPFS/Pinata thông qua `uploadToPinata()`
4. Tạo metadata và upload lên IPFS
5. Gọi hàm `createSale()` với URL metadata và giá
6. Kết nối với smart contract
7. Lấy phí listing từ `getListingPrice()`
8. Gọi `contract.createToken()` trên blockchain với giá trị giao dịch bao gồm phí listing
9. Chờ giao dịch hoàn thành và cập nhật UI

## 3. Luồng Hiển Thị NFT Marketplace

1. Trang chủ marketplace load
2. Gọi hàm `fetchNFTs()` từ NFTMarketplaceContext
3. Kết nối với smart contract
4. Lấy dữ liệu từ `contract.fetchMarketItems()`
5. Cho mỗi NFT, lấy tokenURI để truy cập metadata
6. Lấy thông tin hình ảnh, tên, mô tả từ IPFS
7. Định dạng giá từ wei sang ether
8. Lưu danh sách NFT vào state `nfts`
9. Render UI với danh sách NFT

## 4. Luồng Giao Dịch / Mua NFT

1. Người dùng xem chi tiết NFT và nhấn nút Mua
2. Gọi hàm `buyNFT()` với thông tin NFT
3. Kết nối với smart contract
4. Chuyển đổi giá từ ether sang wei
5. Gọi `contract.createMarketSale()` với tokenId và giá trị giao dịch
6. Chờ giao dịch hoàn thành
7. Chuyển hướng người dùng đến trang Author để xem NFT đã mua
8. Cập nhật trạng thái NFT trong database

## 5. Luồng Lưu Trữ Database

1. Backend sử dụng Prisma ORM để tương tác với PostgreSQL
2. Schema Prisma định nghĩa các model: Account, NFT, Like
3. Khi NFT được tạo, thông tin được lưu vào database
4. Khi có giao dịch, cập nhật trạng thái NFT và tạo bản ghi giao dịch
5. Next.js Server Actions thực hiện các thao tác CRUD với database
6. Dữ liệu từ database được kết hợp với dữ liệu blockchain để hiển thị

## 6. Luồng Bán Lại NFT

1. Người dùng truy cập trang NFT của mình
2. Chọn NFT để bán lại và nhập giá mới
3. Gọi hàm `createSale()` với tham số `isReselling=true` và tokenId
4. Kết nối với smart contract
5. Lấy phí listing từ `getListingPrice()`
6. Gọi `contract.resellToken()` với tokenId, giá mới và phí listing
7. Chờ giao dịch hoàn thành
8. Cập nhật trạng thái NFT trong database và hiển thị lại trên marketplace

## 7. Luồng Quản Lý Tài Khoản

1. Người dùng kết nối ví và truy cập trang Author
2. Tải thông tin tài khoản từ địa chỉ ví
3. Gọi `fetchMyNFTsOrListedNFTs()` để lấy NFT sở hữu
4. Hiển thị thông tin tài khoản và danh sách NFT
5. Người dùng có thể chỉnh sửa thông tin cá nhân, avatar
6. Thông tin được cập nhật vào database

## 8. Luồng Tìm Kiếm và Lọc NFT

1. Người dùng nhập từ khóa tìm kiếm hoặc chọn bộ lọc
2. Frontend gửi tham số tìm kiếm/lọc
3. Gọi hàm tìm kiếm trong NFTMarketplace context
4. Lọc danh sách NFT theo các tiêu chí (tên, giá, danh mục)
5. Hiển thị kết quả lọc cho người dùng 
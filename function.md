# NFT Marketplace Chức Năng

| Chức năng | Mô tả ngắn | Trạng thái | File tham chiếu |
|-----------|------------|------------|-----------------|
| Kết nối ví MetaMask | Kết nối bằng Ethers.js và Web3Modal, hỗ trợ đổi tài khoản và chuyển mạng | ✅ | src/Context/NFTMarketplaceContext.tsx (connectWallet) |
| Tạo NFT (Mint) | Tạo token ERC-721 trên blockchain thông qua contract.createToken(), upload ảnh lên IPFS/Pinata | ✅ | src/Context/NFTMarketplaceContext.tsx (createSale), contracts/NFTMarketplace.sol |
| Hiển thị NFT Marketplace | Lấy dữ liệu NFT từ blockchain và DB (Prisma), render UI bằng Next.js | ✅ | src/Context/NFTMarketplaceContext.tsx (fetchNFTs) |
| Giao dịch / Mua NFT | Thực hiện giao dịch on-chain qua contract.createMarketSale() | ⏳ | src/Context/NFTMarketplaceContext.tsx (buyNFT) |
| Lưu dữ liệu vào DB | Sử dụng Prisma ORM để lưu thông tin NFT, người dùng và giao dịch vào PostgreSQL | ✅ | src/db/prisma.ts, prisma/schema.prisma |
| Bán lại NFT | Đăng bán NFT đã sở hữu qua contract.resellToken() | ⏳ | src/Context/NFTMarketplaceContext.tsx (createSale với isReselling=true) |
| Quản lý tài khoản | Kết nối với ví, hiển thị thông tin và NFT sở hữu | ✅ | src/app/connectWallet/page.tsx, src/app/author/page.tsx |
| Tìm kiếm và lọc NFT | Chức năng tìm kiếm, lọc theo danh mục và giá | ✅ | src/components/Category.tsx, src/components/Search.tsx |
| Thay đổi giá listing | Cập nhật giá niêm yết của NFT trên marketplace | ⏳ | contracts/NFTMarketplace.sol (updateListingPrice) |
| Theo dõi lịch sử giao dịch | Hiển thị lịch sử mua/bán NFT | ✅ | src/Context/NFTMarketplaceContext.tsx (fetchMyNFTsOrListedNFTs) | 
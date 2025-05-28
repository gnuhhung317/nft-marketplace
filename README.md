# Hướng Dẫn Cài Đặt và Chạy NFT Marketplace

## Yêu Cầu Hệ Thống

- Node.js (v16 trở lên)
- npm hoặc yarn
- PostgreSQL (hoặc Neon - PostgreSQL serverless)
- MetaMask wallet (extension trình duyệt)
- Docker (tùy chọn, để chạy PostgreSQL local)

## Các Bước Cài Đặt

### 1. Clone Repository

```bash
git clone <repository-url>
cd NFT-Marketplace
```

### 2. Cài Đặt Dependencies

```bash
npm install
# hoặc
yarn
```

### 3. Cấu Hình Environment Variables

Tạo file `.env.local` với nội dung sau:

```
# Database - sử dụng một trong các chuỗi kết nối sau

# Neon PostgreSQL serverless (khuyến nghị)
DATABASE_URL="postgresql://neondb_owner:password@ep-fragrant-unit-a1q43zjg-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Hoặc PostgreSQL local
# DATABASE_URL="postgresql://username:password@localhost:5432/nft_marketplace"

# Blockchain
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret_key
NEXT_PUBLIC_INFURA_ID=your_infura_id
```

Đồng thời, tạo một file `.env` (Prisma sẽ đọc từ file này):

```
DATABASE_URL="postgresql://neondb_owner:password@ep-fragrant-unit-a1q43zjg-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

### 4. Thiết Lập Database

#### Sử dụng Neon (Khuyến nghị)

Neon là dịch vụ PostgreSQL serverless, không cần cài đặt local:

1. Tạo tài khoản tại [Neon](https://neon.tech)
2. Tạo project mới
3. Sử dụng chuỗi kết nối được cung cấp trong file `.env.local` và `.env`:
   ```
   DATABASE_URL="postgresql://neondb_owner:password@ep-fragrant-unit-a1q43zjg-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
   ```

#### Hoặc sử dụng Docker

```bash
# Khởi động PostgreSQL container
docker-compose up -d
```

#### Hoặc sử dụng PostgreSQL đã cài đặt sẵn

Tạo database:
```sql
CREATE DATABASE nft_marketplace;
```

### 5. Chạy Prisma Migrations

```bash
# Generate Prisma client
npx prisma generate

# Chạy migrations
npx prisma migrate dev

# Hoặc sử dụng script có sẵn với dotenv
npm run prismaDev
```

> **Lưu ý**: Nếu bạn gặp lỗi "Environment variable not found: DATABASE_URL", hãy đảm bảo bạn đã tạo file `.env` (không phải chỉ `.env.local`) vì Prisma mặc định sẽ tìm biến môi trường trong file `.env`.
> 
> Hoặc có thể chạy như sau để chỉ định file env:
> ```bash
> npx dotenv -e .env.local -- npx prisma migrate dev
> ```

### 6. Triển Khai Smart Contract

```bash
# Biên dịch smart contracts
npx hardhat compile

# Triển khai lên Polygon testnet (Amoy)
npx hardhat run scripts/deploy.js --network amoy
```

Sau khi triển khai, cập nhật địa chỉ contract trong mã nguồn (nếu cần).

### 7. Khởi Động Ứng Dụng

```bash
# Chạy Hardhat node (local blockchain)
npx hardhat node

# Mở terminal mới và chạy ứng dụng ở chế độ development
npm run dev
```

Ứng dụng sẽ chạy tại địa chỉ: [http://localhost:3331](http://localhost:3331)

> **Lưu ý**: Khi chạy với Hardhat node, bạn cần:
> - Mở terminal mới để chạy `npm run dev`
> - Kết nối MetaMask với Hardhat network (localhost:8545)
> - Import test accounts từ Hardhat vào MetaMask để test

## Kiểm Tra Các Chức Năng

### 1. Kết Nối Ví MetaMask

- Cài đặt extension MetaMask
- Chuyển sang mạng Polygon Amoy Testnet (Chain ID: 0x13882)
- Kết nối ví với ứng dụng

### 2. Tạo NFT

- Truy cập trang tạo NFT
- Nhập thông tin và tải ảnh lên
- Xác nhận giao dịch trên MetaMask

### 3. Xem NFT Marketplace

- Truy cập trang chủ để xem danh sách NFT
- Xem chi tiết NFT

### 4. Mua NFT

- Chọn NFT muốn mua
- Nhấn nút Mua và xác nhận giao dịch trên MetaMask

## Xử Lý Sự Cố Thường Gặp

### Lỗi Kết Nối Với MetaMask

- Đảm bảo đã cài đặt MetaMask
- Đảm bảo đã chuyển sang mạng Polygon Amoy Testnet
- Làm mới trang và thử kết nối lại

### Lỗi Database

- Kiểm tra chuỗi kết nối DATABASE_URL trong cả hai file `.env` và `.env.local`
- Nếu sử dụng Neon, đảm bảo đã bật chế độ "Pooled connections" trong dashboard
- Nếu sử dụng PostgreSQL local, đảm bảo PostgreSQL đang chạy
- Chạy lại migrations: `npx prisma migrate reset`

### Lỗi Smart Contract

- Đảm bảo đã triển khai contract lên mạng đúng
- Kiểm tra ví có đủ MATIC testnet để chi trả gas fee
- Có thể lấy MATIC testnet từ Polygon Faucet 
# NFT Marketplace - Kịch Bản Trình Diễn

## 1. Giới Thiệu (2 phút)

- **Tên dự án**: NFT Marketplace
- **Mục tiêu dự án**: Xây dựng sàn giao dịch NFT tích hợp với ví tùy chỉnh
- **Công nghệ sử dụng**: React/Next.js, Solidity, Ethereum
- **Đặc điểm nổi bật**: Hỗ trợ ví tùy chỉnh, UI/UX thân thiện, đầy đủ tính năng

## 2. Demo Tính Năng (8 phút)

### Phần 1: Đăng Nhập và Kết Nối Ví

1. Hiển thị trang chủ khi chưa đăng nhập
2. Demo đăng nhập bằng username/password
3. Chỉ ra cách hệ thống kết nối với tài khoản ví
4. Hiển thị địa chỉ ví và số dư sau khi đăng nhập

> **Điểm nhấn**: "Chúng tôi đã tạo một lớp trung gian (WalletContext) để quản lý trạng thái kết nối giữa ứng dụng và ví blockchain, cho phép hỗ trợ nhiều loại ví khác nhau."

### Phần 2: Khám Phá NFT

1. Điều hướng đến trang thị trường
2. Hiển thị danh sách NFT đang được bán
3. Demo tính năng tìm kiếm và lọc NFT
4. Xem chi tiết một NFT cụ thể

> **Điểm nhấn**: "Dữ liệu NFT được lấy trực tiếp từ blockchain và metadata được lưu trữ phi tập trung trên IPFS, đảm bảo tính bất biến và minh bạch."

### Phần 3: Tạo NFT Mới

1. Điều hướng đến trang tạo NFT
2. Tải lên hình ảnh (hoặc sử dụng hình ảnh đã chuẩn bị)
3. Điền thông tin (tên, mô tả, giá)
4. Tạo NFT và giải thích quá trình:
   - Tải ảnh lên IPFS
   - Tạo metadata và lưu trên IPFS
   - Đúc NFT trên blockchain
   - Niêm yết NFT lên thị trường

> **Điểm nhấn**: "Quá trình này được đơn giản hóa nhưng vẫn đảm bảo đầy đủ các bước cần thiết để tạo một NFT thực sự trên blockchain."

### Phần 4: Mua NFT

1. Chọn một NFT để mua
2. Xem chi tiết và giá
3. Thực hiện giao dịch mua
4. Hiển thị trạng thái giao dịch và xác nhận

> **Điểm nhấn**: "Chúng tôi đã tối ưu hóa quy trình mua để chỉ cần một cú nhấp chuột, nhưng phía sau đó là cả một quá trình giao dịch blockchain phức tạp."

### Phần 5: Quản Lý Bộ Sưu Tập

1. Điều hướng đến trang bộ sưu tập cá nhân
2. Hiển thị các NFT đã mua
3. Hiển thị các NFT đang bán
4. Demo tính năng bán lại NFT đã mua

> **Điểm nhấn**: "Người dùng có toàn quyền kiểm soát bộ sưu tập NFT của họ, có thể dễ dàng xem, bán lại hoặc quản lý các tài sản kỹ thuật số."

## 3. Giải Thích Kỹ Thuật (5 phút)

### Kiến Trúc Hệ Thống

1. **Tổng quan kiến trúc** - Mô hình client-server với blockchain
2. **Smart Contract** - Logic quản lý NFT và thị trường
3. **Tích hợp Ví** - WalletContext và tương tác API tùy chỉnh

### Giải Quyết Thách Thức

1. **Vấn đề Seller** - Giải thích cách sử dụng sendTransaction để đảm bảo seller chính xác
2. **Quản lý trạng thái** - Cơ chế caching và đồng bộ hóa dữ liệu
3. **Tối ưu hiệu suất** - Giảm thiểu số lượng cuộc gọi đến blockchain

## 4. Tương Lai và Phát Triển (2 phút)

### Cải Tiến Tiếp Theo

1. Hỗ trợ nhiều blockchain khác
2. Tính năng đấu giá NFT
3. Tạo bộ sưu tập (Collections)
4. Tính năng xã hội (theo dõi, bình luận)

### Roadmap

1. Q3 2023: Hoàn thiện các tính năng cốt lõi
2. Q4 2023: Ra mắt phiên bản beta công khai
3. Q1 2024: Tích hợp thêm blockchain và mở rộng tính năng

## 5. Kết Luận & Q&A (3 phút)

- Tổng kết giá trị và đặc điểm nổi bật của dự án
- Mở phiên hỏi đáp

---

## Ghi Chú Chuẩn Bị

### Chuẩn Bị Môi Trường Demo
- Đảm bảo các tài khoản đã được nạp ETH đủ để demo
- Chuẩn bị sẵn 2-3 NFT trên thị trường để demo
- Chuẩn bị sẵn hình ảnh để tạo NFT mới
- Đảm bảo mạng blockchain hoạt động ổn định

### Xử Lý Sự Cố
- Nếu giao dịch chậm: "Đây là đặc điểm của blockchain, trong môi trường thực tế các giao dịch có thể mất từ 15 giây đến vài phút tùy thuộc vào mạng."
- Nếu kết nối ví gặp vấn đề: Chuyển sang tài khoản dự phòng đã chuẩn bị trước.

### Câu Hỏi Thường Gặp
1. **Q:** Làm thế nào đảm bảo bảo mật cho ví người dùng?
   **A:** Chúng tôi không bao giờ lưu trữ private key. Tất cả giao dịch đều được ký bởi ví của người dùng thông qua API bảo mật.

2. **Q:** Chi phí giao dịch (gas) được tính như thế nào?
   **A:** Gas được tính dựa trên độ phức tạp của giao dịch và tình trạng của mạng Ethereum. Người dùng sẽ luôn được thông báo về chi phí trước khi xác nhận giao dịch.

3. **Q:** Làm thế nào để đối phó với việc giá NFT biến động?
   **A:** Giá được niêm yết bằng ETH, điều này có thể dẫn đến biến động USD. Trong tương lai, chúng tôi có kế hoạch thêm tùy chọn niêm yết bằng stablecoin. 
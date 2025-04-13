# Luồng hoạt động của NFT Marketplace

## 1. Luồng xác thực và kết nối ví

### Đăng nhập/Kết nối ví
1. Người dùng truy cập trang web
2. Nhấn nút "Connect Wallet"
3. Chọn loại ví muốn kết nối (MetaMask, WalletConnect, WalletLink, Fortmatic)
4. Phê duyệt kết nối từ ví
5. Hệ thống lưu trạng thái kết nối và địa chỉ ví
6. Hiển thị thông tin người dùng và số dư

### Ngắt kết nối
1. Người dùng nhấn nút "Disconnect"
2. Hệ thống xóa thông tin kết nối
3. Chuyển về trạng thái chưa đăng nhập

### Tự động kết nối lại
1. Kiểm tra local storage xem có thông tin kết nối cũ không
2. Nếu có, thử kết nối lại tự động
3. Nếu thành công, khôi phục phiên làm việc
4. Nếu thất bại, yêu cầu người dùng kết nối lại thủ công

## 2. Luồng tạo NFT (Mint)

### Tạo NFT mới
1. Người dùng truy cập trang "Create NFT"
2. Tải lên file (hình ảnh, video, etc.)
3. Điền thông tin NFT:
   - Tên
   - Mô tả
   - Thuộc tính (attributes)
   - Giá (nếu muốn bán ngay)
4. Xem trước NFT
5. Xác nhận tạo NFT
6. Phê duyệt giao dịch từ ví
7. Đợi xác nhận trên blockchain
8. Hiển thị thông báo thành công và chuyển đến trang chi tiết NFT

### Tạo NFT hàng loạt
1. Người dùng truy cập trang "Batch Create"
2. Tải lên nhiều file cùng lúc
3. Điền thông tin chung cho tất cả NFT
4. Tùy chỉnh thông tin riêng cho từng NFT (tùy chọn)
5. Xem trước tất cả NFT
6. Xác nhận tạo
7. Phê duyệt giao dịch từ ví
8. Theo dõi tiến trình tạo
9. Hiển thị kết quả và danh sách NFT đã tạo

## 3. Luồng mua bán NFT

### Đăng bán NFT
1. Người dùng truy cập trang chi tiết NFT của họ
2. Nhấn nút "List for Sale"
3. Chọn phương thức bán:
   - Giá cố định
   - Đấu giá
4. Điền thông tin bán:
   - Giá (nếu bán giá cố định)
   - Giá khởi điểm và thời gian (nếu đấu giá)
5. Xác nhận đăng bán
6. Phê duyệt giao dịch từ ví
7. Đợi xác nhận trên blockchain
8. NFT xuất hiện trên marketplace

### Mua NFT
1. Người dùng tìm thấy NFT muốn mua
2. Xem chi tiết NFT
3. Nhấn nút "Buy Now" (nếu bán giá cố định)
4. Xác nhận mua
5. Phê duyệt giao dịch từ ví
6. Đợi xác nhận trên blockchain
7. NFT được chuyển vào ví người mua
8. Hiển thị thông báo thành công

### Đấu giá
1. Người dùng tìm thấy NFT đang đấu giá
2. Xem chi tiết và thời gian còn lại
3. Nhấn nút "Place Bid"
4. Nhập số tiền đặt giá
5. Xác nhận đặt giá
6. Phê duyệt giao dịch từ ví
7. Đợi xác nhận trên blockchain
8. Cập nhật giá cao nhất và người đặt giá

### Kết thúc đấu giá
1. Hệ thống kiểm tra thời gian đấu giá
2. Khi hết thời gian:
   - Xác định người thắng đấu giá
   - Chuyển NFT cho người thắng
   - Chuyển tiền cho người bán
3. Gửi thông báo cho người bán và người thắng
4. Cập nhật trạng thái NFT

## 4. Luồng quản lý bộ sưu tập

### Xem bộ sưu tập
1. Người dùng truy cập trang "My Collection"
2. Hệ thống hiển thị danh sách NFT đã sở hữu
3. Lọc và sắp xếp theo tiêu chí
4. Xem chi tiết từng NFT

### Chuyển NFT
1. Người dùng chọn NFT muốn chuyển
2. Nhấn nút "Transfer"
3. Nhập địa chỉ ví người nhận
4. Xác nhận chuyển
5. Phê duyệt giao dịch từ ví
6. Đợi xác nhận trên blockchain
7. Cập nhật bộ sưu tập

### Xóa NFT khỏi marketplace
1. Người dùng truy cập NFT đang bán
2. Nhấn nút "Cancel Listing"
3. Xác nhận hủy đăng bán
4. Phê duyệt giao dịch từ ví
5. Đợi xác nhận trên blockchain
6. NFT biến mất khỏi marketplace

## 5. Luồng tìm kiếm và khám phá

### Tìm kiếm NFT
1. Người dùng nhập từ khóa vào ô tìm kiếm
2. Hệ thống hiển thị kết quả phù hợp
3. Lọc kết quả theo:
   - Giá
   - Thời gian
   - Trạng thái (đang bán, đấu giá, đã bán)
4. Sắp xếp kết quả
5. Xem chi tiết NFT

### Khám phá NFT
1. Người dùng truy cập trang "Explore"
2. Hệ thống hiển thị NFT theo:
   - Xu hướng
   - Mới nhất
   - Giá cao nhất
   - Sắp kết thúc đấu giá
3. Lọc theo danh mục
4. Xem chi tiết NFT

### Theo dõi người bán
1. Người dùng xem trang người bán
2. Nhấn nút "Follow"
3. Hệ thống cập nhật danh sách theo dõi
4. Nhận thông báo khi người bán có NFT mới

## 6. Luồng quản lý tài khoản

### Cập nhật thông tin cá nhân
1. Người dùng truy cập trang "Profile"
2. Nhấn nút "Edit Profile"
3. Cập nhật thông tin:
   - Tên hiển thị
   - Ảnh đại diện
   - Mô tả
   - Liên kết mạng xã hội
4. Lưu thay đổi

### Xem lịch sử giao dịch
1. Người dùng truy cập trang "Activity"
2. Hệ thống hiển thị:
   - Giao dịch mua
   - Giao dịch bán
   - Đấu giá
   - Chuyển NFT
3. Lọc theo thời gian
4. Xem chi tiết từng giao dịch

### Quản lý thông báo
1. Người dùng truy cập trang "Notifications"
2. Xem danh sách thông báo:
   - Đấu giá sắp kết thúc
   - Giá đặt bị vượt qua
   - NFT đã bán
   - NFT mới từ người theo dõi
3. Đánh dấu đã đọc
4. Xóa thông báo

## 7. Luồng quản trị viên

### Quản lý người dùng
1. Admin truy cập trang "User Management"
2. Xem danh sách người dùng
3. Tìm kiếm người dùng
4. Xem chi tiết người dùng
5. Khóa/mở khóa tài khoản

### Quản lý NFT
1. Admin truy cập trang "NFT Management"
2. Xem danh sách NFT
3. Tìm kiếm NFT
4. Xem chi tiết NFT
5. Xóa NFT vi phạm

### Quản lý giao dịch
1. Admin truy cập trang "Transaction Management"
2. Xem danh sách giao dịch
3. Tìm kiếm giao dịch
4. Xem chi tiết giao dịch
5. Hủy giao dịch vi phạm

### Cấu hình hệ thống
1. Admin truy cập trang "Settings"
2. Cấu hình phí giao dịch
3. Cấu hình thời gian đấu giá
4. Cấu hình thông báo
5. Cấu hình bảo mật

## 8. Luồng khẩn cấp

### Tạm dừng hệ thống
1. Admin phát hiện vấn đề bảo mật
2. Truy cập trang "Emergency Controls"
3. Nhấn nút "Pause System"
4. Xác nhận tạm dừng
5. Hệ thống ngừng hoạt động
6. Thông báo cho người dùng

### Khôi phục hệ thống
1. Admin khắc phục vấn đề
2. Truy cập trang "Emergency Controls"
3. Nhấn nút "Resume System"
4. Xác nhận khôi phục
5. Hệ thống hoạt động lại
6. Thông báo cho người dùng

### Hoàn tiền giao dịch
1. Admin phát hiện giao dịch lỗi
2. Truy cập trang "Transaction Management"
3. Tìm giao dịch lỗi
4. Nhấn nút "Refund"
5. Xác nhận hoàn tiền
6. Hoàn tiền cho người dùng
7. Cập nhật trạng thái giao dịch 
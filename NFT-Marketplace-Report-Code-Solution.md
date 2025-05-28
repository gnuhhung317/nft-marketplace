# Giải Pháp Kỹ Thuật: Xử Lý Vấn Đề Seller trong Giao Dịch NFT

## Vấn Đề

Trong ứng dụng NFT Marketplace, chúng ta gặp phải vấn đề quan trọng:

**Seller luôn được đặt là địa chỉ tài khoản đầu tiên từ Hardhat** thay vì địa chỉ người dùng thực tế đang kết nối (currentAccount).

Nguyên nhân:
- Khi gọi trực tiếp contract bằng `contract.createToken()`, thông tin người gửi (msg.sender) được lấy từ signer mặc định của provider
- Provider đang sử dụng là JsonRpcProvider với endpoint mặc định của Hardhat

## Giải Pháp

Thay vì gọi trực tiếp phương thức contract, chúng ta sử dụng phương thức `sendTransaction` từ WalletContext để đảm bảo giao dịch được ký và gửi bởi địa chỉ người dùng hiện tại.

### Thay đổi Hàm `createSale`

```typescript
const createSale: NFTMarketplaceContextType["createSale"] = async (
  url,
  formInputPrice,
  isReselling = false,
  id?
) => {
  try {
    setLoading(true);
    
    // Kiểm tra ví đã kết nối chưa
    if (!walletContext) {
      setError("Wallet not connected");
      setOpenError(true);
      setLoading(false);
      return;
    }
    
    // Lấy hàm sendTransaction từ wallet context
    const { sendTransaction } = walletContext;
    
    if (!sendTransaction || typeof sendTransaction !== 'function') {
      setError("Wallet does not support transactions");
      setOpenError(true);
      setLoading(false);
      return;
    }
    
    // Lấy contract chỉ để đọc thông tin
    const contract = await connectingWithSmartContract();
    if (!contract) {
      setError("Failed to connect to contract");
      setOpenError(true);
      setLoading(false);
      return;
    }
    
    // Chuyển đổi giá sang wei
    const price = ethers.utils.parseUnits(formInputPrice, "ether");
    
    // Lấy phí niêm yết từ contract
    const listingPrice = await contract.getListingPrice();
    
    // Chuẩn bị dữ liệu giao dịch
    const contractAddress = NFTMarketplaceAddress;
    const currentAccount = LocalStorageService.getAccountAddress();
    
    // Xác định loại giao dịch (tạo mới hoặc bán lại)
    const txData = !isReselling 
      ? {
          from: currentAccount,          // Địa chỉ người gửi (seller)
          to: contractAddress,           // Địa chỉ contract
          value: listingPrice.toString(), // Phí niêm yết
          method: "createToken",         // Phương thức muốn gọi
          params: [url, price]           // Tham số cho phương thức
        }
      : {
          from: currentAccount,
          to: contractAddress,
          value: listingPrice.toString(),
          method: "resellToken",
          params: [id, price]
        };
    
    // Gửi giao dịch thông qua wallet context
    const transaction = await sendTransaction(txData);
    
    setLoading(false);
    return transaction;
  } catch (error: any) {
    setLoading(false);
    setError(error.message || "Error creating sale");
    setOpenError(true);
    console.error(error);
  }
};
```

### Cách Thức Hoạt Động

1. **Xác định Người Gửi**: 
   - Sử dụng `currentAccount` từ localStorage hoặc WalletContext làm địa chỉ `from`
   - Đảm bảo người tạo NFT được ghi nhận đúng là seller

2. **Tạo Dữ Liệu Giao Dịch**:
   - Chuẩn bị đầy đủ thông tin cần thiết: địa chỉ contract, hàm cần gọi, tham số, giá trị gửi kèm
   - Xác định đúng phương thức cần gọi (`createToken` hoặc `resellToken`)

3. **Sử Dụng WalletContext**:
   - `sendTransaction` của WalletContext sẽ đảm nhiệm việc ký và gửi giao dịch
   - WalletService sẽ xử lý giao tiếp với blockchain thông qua API tùy chỉnh

## Ưu Điểm Của Giải Pháp

1. **Đúng Người Tạo**: Seller được ghi nhận chính xác là người dùng đang kết nối

2. **Tương Thích**: Hoạt động với cả wallet tùy chỉnh và wallet tiêu chuẩn

3. **Bảo Mật**: Không lộ private key của người dùng, mọi giao dịch đều được ký an toàn

4. **Linh Hoạt**: Có thể mở rộng dễ dàng cho các phương thức khác của contract

## Triển Khai WalletService

WalletService cần hỗ trợ phương thức sendTransaction như sau:

```typescript
// Trong WalletService.ts
async sendTransaction(txData: {
  from: string;
  to: string;
  value: string;
  method: string;
  params: any[];
  isCallStatic?: boolean;
}) {
  try {
    const response = await this.apiCall('/transaction', {
      method: 'POST',
      body: JSON.stringify(txData)
    });
    
    return response;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}
```

## Kết Luận

Giải pháp này không chỉ giải quyết vấn đề seller bị gán sai, mà còn cải thiện toàn bộ kiến trúc giao dịch của ứng dụng, cho phép tích hợp linh hoạt với nhiều loại ví khác nhau trong tương lai. 
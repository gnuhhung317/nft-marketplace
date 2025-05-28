const KEYS = {
    ACCOUNT_ADDRESS: "accountAddress",
    ACCOUNT_ID: "accountId",
    WALLET_TOKEN: "walletToken",
}
export class LocalStorageService {
    private static readonly ACCOUNT_ADDRESS_KEY = 'account_address';
    private static readonly ACCOUNT_ID_KEY = 'account_id';
    private static readonly WALLET_TOKEN_KEY = 'wallet_token';
    private static readonly PRIVATE_KEY_KEY = 'private_key';

    // Safe method to access localStorage
    private static safeLocalStorage(operation: 'get' | 'set' | 'remove', key: string, value?: string): string | null {
        if (typeof window === 'undefined' || !window.localStorage) {
            console.log('LocalStorage not available');
            return null;
        }
        
        try {
            if (operation === 'get') {
                return localStorage.getItem(key);
            } else if (operation === 'set' && value !== undefined) {
                localStorage.setItem(key, value);
                return value;
            } else if (operation === 'remove') {
                localStorage.removeItem(key);
            }
        } catch (error) {
            console.error('LocalStorage operation failed:', error);
        }
        
        return null;
    }

    // Compatibility methods for legacy code
    static getItem(key: string) {
        console.log('LocalStorageService: Using deprecated getItem method for key:', key);
        const value = this.safeLocalStorage('get', key);
        return value ? JSON.parse(value) : null;
    }

    static setItem(key: string, value: any) {
        console.log('LocalStorageService: Using deprecated setItem method for key:', key);
        this.safeLocalStorage('set', key, JSON.stringify(value));
    }
    
    static removeItem(key: string) {
        console.log('LocalStorageService: Using deprecated removeItem method for key:', key);
        this.safeLocalStorage('remove', key);
    }

    // Account address methods
    static getAccountAddress(): string | null {
        const address = this.safeLocalStorage('get', this.ACCOUNT_ADDRESS_KEY);
        console.log('LocalStorageService: Đọc địa chỉ tài khoản:', address);
        return address;
    }

    static setAccountAddress(address: string): void {
        this.safeLocalStorage('set', this.ACCOUNT_ADDRESS_KEY, address);
        console.log('LocalStorageService: Đã lưu địa chỉ tài khoản:', address);
    }

    static clearAccountAddress(): void {
        this.safeLocalStorage('remove', this.ACCOUNT_ADDRESS_KEY);
        console.log('LocalStorageService: Đã xóa địa chỉ tài khoản');
    }

    // Account ID methods
    static getAccountId(): string | null {
        return this.safeLocalStorage('get', this.ACCOUNT_ID_KEY);
    }

    static setAccountId(accountId: string): void {
        this.safeLocalStorage('set', this.ACCOUNT_ID_KEY, accountId);
    }

    // Wallet token methods
    static getWalletToken(): string | null {
        return this.safeLocalStorage('get', this.WALLET_TOKEN_KEY);
    }

    static setWalletToken(token: string): void {
        this.safeLocalStorage('set', this.WALLET_TOKEN_KEY, token);
    }

    static getPrivateKey(): string | null {
        return this.safeLocalStorage('get', this.PRIVATE_KEY_KEY);
    }

    static setPrivateKey(privateKey: string): void {
        this.safeLocalStorage('set', this.PRIVATE_KEY_KEY, privateKey);
    }

    static clearPrivateKey(): void {
        this.safeLocalStorage('remove', this.PRIVATE_KEY_KEY);
    }

    // Clear all data
    static clearAll(): void {
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                localStorage.clear();
                console.log('LocalStorageService: Đã xóa tất cả dữ liệu');
            } catch (error) {
                console.error('Failed to clear localStorage:', error);
            }
        }
    }
}
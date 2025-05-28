
const KEYS = {
    ACCOUNT_ADDRESS: "accountAddress",
    ACCOUNT_ID: "accountId",
    WALLET_TOKEN: "walletToken",
    ACCOUNT_DATA: "accountData",
    AVATAR: "avatar",
    USER_PREFERENCES: "userPreferences"
}

export class LocalStorageProvider {
    static setItem(key: string, value: any) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
    
    static getItem(key: string) {
        if (typeof window === 'undefined') return null;
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }
    
    static removeItem(key: string) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
        }
    }
    
    static clear() {
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
    }

    static setAccountAddress(address: string) {
        this.setItem(KEYS.ACCOUNT_ADDRESS, address);
    }
    
    static getAccountAddress() {
        return this.getItem(KEYS.ACCOUNT_ADDRESS);
    }
    
    static setAccountData(accountData: any) {
        this.setItem(KEYS.ACCOUNT_DATA, accountData);
    }
    
    static getAccountData() {
        return this.getItem(KEYS.ACCOUNT_DATA);
    }
    
    static setAvatar(avatarUrl: string) {
        this.setItem(KEYS.AVATAR, avatarUrl);
    }
    
    static getAvatar() {
        return this.getItem(KEYS.AVATAR);
    }

    static clearAccount() {
        this.removeItem(KEYS.ACCOUNT_ADDRESS);
        this.removeItem(KEYS.ACCOUNT_ID);
        this.removeItem(KEYS.WALLET_TOKEN);
        this.removeItem(KEYS.ACCOUNT_DATA);
        this.removeItem(KEYS.AVATAR);
    }
}
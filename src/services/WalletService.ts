import { ethers } from 'ethers';
import { SUPPORTED_NETWORKS } from '../Context/constants';
import { LocalStorageService } from './LocalStorageService';

export class WalletService {
    private apiUrl: string;
    private token: string;

    constructor(apiUrl: string, token: string) {
        this.apiUrl = apiUrl;
        this.token = token;
    }
        
    async setToken(token: string)  {
        this.token = token;
    }

    // Kết nối/switch account
    async connect(accountId: number) {
        const response = await fetch(`${this.apiUrl}/wallet/switch-account`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account_id: accountId
            })
        });
        return response.json();
    }

    async getPrivateKey(accountId: number, password: string) {
        const url = new URL(`${this.apiUrl}/wallet/get-account-details`);
        url.searchParams.append('account_id', accountId.toString());
        url.searchParams.append('password', password);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data.data.private_key;
    }

    // Ký và gửi transaction
    async sendTransaction(tx: any) {
        const response = await fetch(`${this.apiUrl}/wallet/call-contract`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account_id: tx.accountId,
                contract_address: tx.to,
                method: tx.method,
                params: tx.params
            })
        });
        return response.json();
    }

    async getAccounts() {
        const url = new URL(`${this.apiUrl}/wallet/list-accounts`);
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        const data = await response.json();
        if (data.error_code !== 'OK') {
            throw new Error('Lỗi khi lấy tài khoản: ' + data.error_code);
        }
        return data.data;
    }
    // Lấy số dư
    async getBalance(accountId: number) {
        const url = new URL(`${this.apiUrl}/wallet/get-balance`);
        url.searchParams.append('account_id', accountId.toString());
        url.searchParams.append('chain_id', '1');
        this.token = LocalStorageService.getWalletToken() || '';
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        return response.json();
    }

    // Lấy thông tin mạng
    async getNetwork() {
        // const response = await fetch(`${this.apiUrl}/wallet/network`, {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${this.token}`
        //     }
        // });
        const response = {
            isConnected: true,
            address: "",
            balance: "123",
            network: {
                chainId: SUPPORTED_NETWORKS.LOCALHOST.chainId, // hoặc bất kỳ chain ID nào bạn đang sử dụng
                name: "localhost", // hoặc tên mạng khác
                currency: "ETH",
                rpcUrl: SUPPORTED_NETWORKS.LOCALHOST.rpcUrl,
            }
        }

        return response.network;
    }

    // Lấy địa chỉ tài khoản, 

    // Kiểm tra mạng hợp lệ
    async validateNetwork() {
        // const network = await this.getNetwork();
        // return network.chainId === SUPPORTED_NETWORKS.LOCALHOST.chainId || 
        //        network.chainId === SUPPORTED_NETWORKS.POLYGON_AMOY.chainId;
        return SUPPORTED_NETWORKS.LOCALHOST.chainId;
    }

    // Chuyển mạng
    async switchNetwork(chainId: number) {
        const response = await fetch(`${this.apiUrl}/wallet/switch-network`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chain_id: chainId
            })
        });
        return response.json();
    }

    // Add a login method to handle wallet login
    async login(username: string, password: string): Promise<string> {
        const response = await fetch(`${this.apiUrl}/auth/login-wallet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.error_code === 'OK') {
            this.token = result.data.token; // Update the token for future requests
            return this.token;
        } else {
            throw new Error('Đăng nhập thất bại: ' + result.error_code);
        }
    }

    async getChainId(): Promise<string> {
        // Simulate fetching the chain ID from the wallet
        return "0x1"; // Example chain ID for Ethereum Mainnet
    }
}
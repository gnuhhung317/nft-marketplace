import { ethers } from "ethers";

class CustomWalletProvider {
    private apiUrl: string;
    private token : string;

    constructor(apiUrl: string, token: string) {
        this.apiUrl = apiUrl;
        this.token = token;
    }
    async request(method: string, params: any[]) {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
    }
}

export default CustomWalletProvider;
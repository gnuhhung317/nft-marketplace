import CustomWalletProvider  from "./CustomWalletProvider";

class WalletService {
    private provider : CustomWalletProvider;

    constructor(provider: CustomWalletProvider) {
        this.provider = provider;
    }
}
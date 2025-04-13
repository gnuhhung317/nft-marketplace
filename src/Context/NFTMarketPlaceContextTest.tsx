import React, {useState, useEffect, useContext,createContext} from "react";

import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Router from "next/router";
import axios from "axios";
import {create as ipfsHttpClient} from "ipfs-http-client";
import { NFTMarketplaceAddress, NFTMarketplaceABI } from "./constants";

export const NFTMarketPlaceContext = createContext({});
export const NFTMarketPlaceProvider = ({children}:{children:React.ReactNode}) => {
    const [currentAccount, setCurrentAccount] = useState<string | null>("");

    const checkIfWalletIsConnected = async () => {
        try {
            const {ethereum} = window.ethereum;
            if(!ethereum) {
                ("Please install Metamask!");
                return;
            }
            const accounts = await ethereum.request({method: "eth_accounts"});
            if(accounts.length > 0) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log("No account found");
            }
            
        } catch (error) {
            console.log("Có lỗi xảy ra khi kết nối với wallet");
        }
    }
    return(

        <NFTMarketPlaceContext.Provider value={{}}>
            {children}
        </NFTMarketPlaceContext.Provider>
    )
}

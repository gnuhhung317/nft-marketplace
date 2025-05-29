'use client';
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { WalletService } from "../services/WalletService";
import { ethers } from "ethers";

// Define interface for WalletContext to improve type safety
export interface WalletContextType {
  state: {
    isConnected: boolean;
    address: string;
    balance: string;
    network?: {
      name: string;
      chainId: number;
      rpcUrl: string;
    };
  };
  connect: (accountId: number) => Promise<void>;
  disconnect: () => void;
  sendTransaction: (tx: any) => Promise<any>;
  getAccounts: () => Promise<any>;
  login: (username: string, password: string) => Promise<string>;
  getPrivateKey: (accountId: number, password: string) => Promise<string>;
  walletService: WalletService;
}

export const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {  const [state, setState] = useState({
    isConnected: false,
    address: "",
    balance: "",
    network: {
      name: "",
      chainId: 0,
      rpcUrl: ""
    }
  });

  const [showLoginModal, setShowLoginModal] = useState(false);

  // Initialize the wallet service with environment variables
  const walletService = new WalletService(
    process.env.NEXT_PUBLIC_WALLET_API_URL || "", 
    process.env.NEXT_PUBLIC_WALLET_API_TOKEN || ""
  );
  const connect = async (accountId?: number) => {
    try {
      if (!state.isConnected) {
        // Show login modal if not logged in
        setShowLoginModal(true);
        return;
      }

      // Nếu không có accountId cụ thể, lấy danh sách và sử dụng account đầu tiên
      if (!accountId) {
        const accounts = await walletService.getAccounts();
        if (accounts && accounts.data && accounts.data.length > 0) {
          accountId = accounts.data[0].id;
        } else {
          throw new Error("No accounts available");
        }
      }

      console.log("Connecting to account ID:", accountId);
      if (accountId === undefined) {
        throw new Error("Account ID is undefined");
      }
      const response = await walletService.connect(accountId);
      
      if (response.error_code === "OK" && response.data) {
        setState({
          isConnected: true,
          address: response.data.address,
          balance: response.data.balance || "0",
          network: response.data.network
        });
        
        console.log("Wallet connected successfully:", response.data);
        return response.data.data;
      } else {
        throw new Error(response.error_message || "Failed to connect wallet");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };
  const disconnect = () => {
    setState({ isConnected: false, address: "", balance: "", network: {
      name: "",
      chainId: 0,
      rpcUrl: ""
    } });
  };
  const sendTransaction = async (tx: any) => {
    try {
      console.log("Sending transaction:", tx);
      // Kiểm tra xem có phải là callStatic không
      const isStaticCall = tx.isCallStatic === true;
      
      // Tạo response dựa vào loại giao dịch
      const response = await walletService.sendTransaction({
        ...tx,
        isCallStatic: isStaticCall
      });
      
      console.log("Transaction response:", response);
      return response.data;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error; // Re-throw để có thể bắt ở component gọi
    }
  };
  const getAccounts = async () => {
    try {
      const accounts = await walletService.getAccounts();
      return accounts;
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };
  const login = async (username: string, password: string): Promise<string> => {
    try {
      const token = await walletService.login(username, password);
      console.log('Login successful, token:', token);
      return token;
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      throw error;
    }
  };

  const getPrivateKey = async (accountId: number, password: string) => {
    const privateKey = await walletService.getPrivateKey(accountId, password);
    return privateKey;
  };
  

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        const isValidNetwork = await walletService.validateNetwork();
        if (isValidNetwork) {
          const network = await walletService.getNetwork();
          setState((prevState) => ({ ...prevState, network }));
        }
      } catch (error) {
        console.error("Error validating network:", error);
      }
    };
    checkConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ state, connect, disconnect, sendTransaction, login, getAccounts, getPrivateKey, walletService }}>
      {children}
    </WalletContext.Provider>
  );
};
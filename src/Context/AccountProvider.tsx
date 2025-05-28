"use client";
import { existAccountByAccountAddress } from "@/actions/Account";
import { AccountSchema } from "@/scheme";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { z } from "zod";
import { NFTMarketplaceContext } from "./NFTMarketplaceContext";
import { LocalStorageService } from "@/services/LocalStorageService";

export type AccountType = Partial<z.infer<typeof AccountSchema>>;

export const accountData: AccountType = {
  username: "",
  email: "",
  description: "",
  website: "",
  facebook: "",
  twitter: "",
  instagram: "",
  avatar: "",
  accountAddress: "",
};

export const AccountContext = createContext<{ account: AccountType, setAccount: Dispatch<SetStateAction<AccountType>> } | null>(null);

export const useLoading = () => useContext(AccountContext);
export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const { currentAccount } = useContext(NFTMarketplaceContext)!;
  const [account, setAccount] = useState<AccountType>(() => {
    // Khôi phục dữ liệu từ localStorage nếu có
    if (typeof window !== 'undefined') {
      const savedAccount = LocalStorageService.getItem('accountData');
      return savedAccount || accountData;
    }
    return accountData;
  });
  useEffect(() => {
    
    if (!currentAccount) return;
    const getDetail = async () => {
      const account = await existAccountByAccountAddress(currentAccount);
      LocalStorageService.setAccountAddress(currentAccount);
      
      const updatedAccount = {
        avatar: account?.avatar || "",
        username: account?.username || "",
        email: account?.email || "",
        description: account?.description || "",
        website: account?.website || "",
        facebook: account?.facebook || "",
        twitter: account?.twitter || "",
        instagram: account?.instagram || "",
        accountAddress: account?.accountAddress || currentAccount,
      };
      
      // Cập nhật state và lưu vào localStorage
      setAccount(updatedAccount);
      LocalStorageService.setItem('accountData', updatedAccount);
    };
    getDetail();
  }, [currentAccount]);
  return (
    <AccountContext.Provider
      value={{
        account: account,
        setAccount: setAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

"use client";

import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
  createContext,
  useMemo,
  useCallback,
} from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import axios from "axios";
//INTERNAL  IMPORT
import { NFTMarketplaceAddress, NFTMarketplaceABI, SUPPORTED_NETWORKS } from "./constants";
import { TLike, TMarketItem } from "@/types";
import { MediaType } from "@/types/nft";
import { createNewNFT, getLikes } from "@/actions/NFT";
import { LoadingContext } from "./LoadingSpinnerProvider";
import { WalletContext } from "./WalletContext";
import { WalletService } from "../services/WalletService";
import LoginModal from "../components/LoginModal";
import { LocalStorageService } from "@/services/LocalStorageService";
import BuyNFTConfirmationModal from '../components/BuyNFTConfirmationModal';
import CreateNFTConfirmationModal from "@/components/CreateNFTConfirmationModal";

export type CreateNFTParams = {
  name: string;
  price: string;
  mediaUrl: string;
  description: string;
  category: string;
  mediaType: MediaType;
  thumbnailUrl?: string;
  properties?: {
    fileSize?: string;
    duration?: string;
    format?: string;
    [key: string]: string | undefined;
  };
  router: any;
};

export type CreateNFT = (params: CreateNFTParams) => Promise<void>;

// defined the type of value in the Context
export type NFTMarketplaceContextType = {
  uploadToPinata: (file: File) => Promise<string | undefined>;
  checkIfWalletConnected: () => Promise<void>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  createNFT: CreateNFT;
  fetchNFTs: () => Promise<TMarketItem[]>;
  fetchMyNFTsOrListedNFTs: (type?: string, targetAddress?: string) => Promise<TMarketItem[]>;
  fetchNFTsByOwner: (ownerAddress: string) => Promise<TMarketItem[]>;
  fetchNFTByTokenId: (tokenId: string) => Promise<TMarketItem | null>;
  buyNFT: (nftId: TMarketItem) => void;
  createSale: (
    url: string,
    formInputPrice: CreateNFTParams["price"],
    isReselling?: boolean,
    id?: string
  ) => void;
  currentAccount: string | null;
  titleData: string;
  setOpenError: (open: boolean) => void;
  openError: boolean;
  setError: Dispatch<SetStateAction<string>>;
  error: string | null;
  accountBalance: string;
  gasEstimate: string;
  nfts: TMarketItem[];
  setNfts: Dispatch<SetStateAction<TMarketItem[]>>;
  likes: TLike[][];
  setLikes: Dispatch<SetStateAction<TLike[][]>>;
  openSwitchNetwork: boolean;
  setOpenSwitchNetwork: Dispatch<SetStateAction<boolean>>;
  getTokenTransactionHistory: (tokenId: string) => Promise<any[]>;
  getTokenProvenance: (tokenId: string) => Promise<any>;
  getTokenOwnershipHistory: (tokenId: string) => Promise<string[]>;
  getCurrentTokenOwner: (tokenId: string) => Promise<string>;
  getTokenTransactionCount: (tokenId: string) => Promise<number>;
  getTokenOwnerCount: (tokenId: string) => Promise<number>;
  isOriginalToken: (tokenId: string) => Promise<boolean>;
  getTokensCreatedBy: (creator: string) => Promise<string[]>;
  getListingPrice: () => Promise<string>;
};

export const NFTMarketplaceContext = createContext<NFTMarketplaceContextType | null>(null);
export const NFTMarketplaceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const titleData = "Khám phá, sưu tầm và bán NFT";

  //------USESTAT
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const router = useRouter();
  const { setLoading } = useContext(LoadingContext);
  const [nfts, setNfts] = useState<TMarketItem[]>([]);
  const [likes, setLikes] = useState<TLike[][]>([]);
  const [openSwitchNetwork, setOpenSwitchNetwork] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [contractInstance, setContractInstance] = useState<ethers.Contract | null>(null);
  const [showBuyConfirmation, setShowBuyConfirmation] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<TMarketItem | null>(null);
  const [gasEstimate, setGasEstimate] = useState("0");

  const walletContext = useContext(WalletContext);
  

  const fetchBalance = useCallback(async () => {
    const accountId = LocalStorageService.getAccountId();
    if (!accountId) return;
    debugger;
    const balance = await walletContext?.walletService.getBalance(Number(accountId));
    setAccountBalance(balance.data.balance);
  }, [walletContext]);
  // Memoize contract connection
  const connectingWithSmartContract = useCallback(async () => {
    try {
      const savedAddress = LocalStorageService.getAccountAddress();
      if (savedAddress) {
        const provider = new ethers.providers.JsonRpcProvider(SUPPORTED_NETWORKS.LOCALHOST.rpcUrl);
        const privateKey = LocalStorageService.getPrivateKey();
        if (!privateKey) {
          throw new Error("No private key found");
        }
        const wallet = new ethers.Wallet(privateKey, provider);
        const signer = wallet.connect(provider);
        const contract = fetchContract(signer);
        setContractInstance(contract);
        fetchBalance();
        return contract;
      }
    } catch (error) {
      console.error("Error connecting to smart contract:", error);
      setError("Failed to connect to smart contract");
      setOpenError(true);
      return null;
    }
  }, []);

  // Add separate useEffect for balance updates
  useEffect(() => {
    if (currentAccount) {
      fetchBalance();
    }
  }, [currentAccount, fetchBalance]);

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  //---UPLOAD TO IPFS FUNCTION
  const uploadToPinata = async (file: File) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key:
              process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

        return ImgHash;
      } catch (error) {
        console.log("Không thể tải ảnh lên Pinata");
      }
    }
  };

  //---CREATENFT FUNCTION
  const createNFT: CreateNFT = async ({
    name,
    price,
    mediaUrl,
    description,
    category,
    mediaType,
    thumbnailUrl,
    properties,
    router,
  }) => {
    if (!name || !description || !price || !mediaUrl || !category || !mediaType)
      return setError("Thiếu dữ liệu"), setOpenError(true);
    setLoading(true);
    const data = JSON.stringify({
      name,
      description,
      mediaUrl,
      category,
      mediaType,
      thumbnailUrl,
      properties,
    });
    try {
      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
          "Content-Type": "application/json",
        },
      });
      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      await createSale(url, price, false);
      router.push("/searchPage");
    } catch (error) {
      setLoading(false);
      setError("Lỗi khi tạo NFT");
      setOpenError(true);
    }
  };

  function convertCidToImage(cid: string) {
    if (!cid) {
      throw new Error("CID không hợp lệ");
    }
  
    const imageUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
  
    return imageUrl;
  }
  const getListingPrice = async () => {
    const contract = await connectingWithSmartContract();
    if (!contract) return;
    const listingPrice = await contract.getListingPrice();
    return listingPrice;
  }

  const createSale: NFTMarketplaceContextType["createSale"] = async (
    url,
    formInputPrice,
    isReselling = false,
    id?
  ) => {
    try {

      const price = ethers.utils.parseUnits(formInputPrice, "ether");
      
      const contract = await connectingWithSmartContract();
      if (!contract) return;
        
      const listingPrice = await contract.getListingPrice();
      
      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.resellToken(id, price, {
            value: listingPrice.toString(),
          });
      await transaction.wait();
      
      setLoading(false);
      
      console.log(transaction);
    } catch (error :any) {
      if (JSON.parse(error.body).error.code === -32000){
        setError("Số dư không đủ nha bạn ơi");
        setOpenError(true);
        return;
      }
      setError("Lỗi khi tạo giao dịch bán");
      setOpenError(true);
      console.log(error);
    }
  };

  // Memoize fetchNFTs function
  const fetchNFTs = useCallback(async () => {
    try {
      const contract = await connectingWithSmartContract();
      if (!contract) {
        console.error("Không thể kết nối với contract");
        return [];
      }
      
      // Chỉ lấy các NFT đang được bán trên thị trường
      const marketItems = await contract.fetchMarketItems();
      console.log("Dữ liệu thô từ blockchain:", marketItems);
      
      if (!marketItems || !marketItems.length) {
        console.log("Không có NFT nào đang được bán trên thị trường");
        return [];
      }

      const items = await Promise.all(
        marketItems.map(async (item: any) => {
          try {
            if (item.sold) return null;
            const tokenId = item.tokenId.toString();
            const tokenURI = await contract.tokenURI(tokenId);
            const meta = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(item.price.toString(), "ether");
            const nftItem: TMarketItem = {
              id: 0,
              tokenId,
              seller: item.seller,
              owner: item.owner,
              price,
              sold: item.sold,
              tokenURI,
              name: meta.data.name,
              mediaUrl: meta.data.mediaUrl,
              mediaType: meta.data.mediaType,
              thumbnailUrl: meta.data.thumbnailUrl,
              description: meta.data.description,
              category: meta.data.category,
              properties: meta.data.properties,
              accountId: null,
              accountAddress: item.owner,
              createAt: new Date(),
              updatedAt: new Date(),
            };
            return nftItem;
          } catch (error) {
            return null;
          }
        })
      );

      const validItems = items.filter(item => item !== null);
      console.log(`Trả về ${validItems.length} NFT hợp lệ từ thị trường`);
      return validItems;

    } catch (error) {
      console.error("Lỗi khi tải NFTs từ thị trường:", error);
      return [];
    }
  }, [connectingWithSmartContract]);

  useEffect(() => {
    fetchNFTs().then((items: TMarketItem[]) => {
      console.log("fetchNFTs", items);
      setNfts(items?.reverse());
    });
  }, [fetchNFTs]);

  //--FETCHING MY NFT OR LISTED NFTs
  /**
   * Fetch NFTs based on the specified type and target address:
   * - "fetchMyNFTs": Retrieves NFTs owned by the target address (purchased NFTs)
   * - "fetchItemsListed": Retrieves NFTs listed by the target address for sale
   * - If no type is provided, it defaults to "fetchMyNFTs"
   * - If no targetAddress is provided, it uses the current account
   * 
   * @param type - The type of NFTs to fetch: "fetchMyNFTs" or "fetchItemsListed"
   * @param targetAddress - The address to fetch NFTs for. If not provided, uses current account
   * @returns Promise containing an array of NFT items
   */
  const fetchMyNFTsOrListedNFTs: NFTMarketplaceContextType["fetchMyNFTsOrListedNFTs"] =
    async (type?: string, targetAddress?: string) => {
      try {
        // Sử dụng targetAddress nếu được cung cấp, nếu không thì dùng currentAccount
        const accountToUse = targetAddress || LocalStorageService.getAccountAddress();
        console.log("fetchMyNFTsOrListedNFTs đang sử dụng tài khoản:", accountToUse);
        
        if (!accountToUse) {
          console.log("Không có tài khoản để truy vấn NFT");
          return [];
        }
          
        const contract = await connectingWithSmartContract();
        if (!contract) return [];
        
        console.log(`Gọi contract với ${type || "fetchMyNFTs"} cho tài khoản ${accountToUse}`);
        const data =
          type == "fetchItemsListed"
            ? await contract.fetchListedNFTs(accountToUse)  // NFTs the target address has listed for sale  
            : await contract.fetchOwnedNFTs(accountToUse);  // NFTs the target address owns
          
        console.log(`Nhận được ${data.length} NFTs từ contract`);
        
        const items = await Promise.all(
          data.map(
            async (item: any, index: number) => {
              try {
                // Extract necessary properties safely
                const tokenId = item.tokenId || (Array.isArray(item) ? item[0] : null);
                const seller = item.seller || (Array.isArray(item) ? item[1] : null);
                const owner = item.owner || (Array.isArray(item) ? item[2] : null);
                const price = item.price || (Array.isArray(item) ? item[3] : null);
                
                if (!tokenId) {
                  console.log(`Bỏ qua NFT ${index} - không tìm thấy tokenId`);
                  return null;
                }
                
                console.log(`Xử lý NFT ${index} với tokenId: ${tokenId}`);
                
                const tokenURI = await contract.tokenURI(tokenId);
                
                let metadata: Partial<TMarketItem> = {};
                try {
                  const response = await axios.get(tokenURI);
                  metadata = response.data;
                } catch (err) {
                  console.error(`Lỗi khi lấy metadata cho ${tokenId}:`, err);
                  return null;
                }
                
                const priceFormatted = ethers.utils.formatUnits(
                  price.toString(),
                  "ether"
                );
  
                return {
                  price: priceFormatted,
                  tokenId: tokenId.toString(),
                  seller,
                  owner,
                  mediaUrl: metadata.mediaUrl,
                  name: metadata.name,
                  description: metadata.description,
                  tokenURI,
                  mediaType: metadata.mediaType,
                };
              } catch (error) {
                console.error(`Lỗi xử lý NFT ${index}:`, error);
                return null;
              }
            }
          )
        );
        
        // Filter out null items
        const validItems = items.filter(item => item !== null);
        console.log(`Trả về ${validItems.length} NFT hợp lệ`);
        return validItems;
      } catch (error) {
        console.error("Lỗi khi tải NFT:", error);
        return [];
      }
    };

  /**
   * Fetch NFTs owned by a specific address
   * @param ownerAddress - The Ethereum address to fetch NFTs for
   * @returns Promise containing an array of NFT items owned by the address
   */
  const fetchNFTsByOwner: NFTMarketplaceContextType["fetchNFTsByOwner"] = async (ownerAddress) => {
    try {
      const contract = await connectingWithSmartContract();
      if (!contract) return [];
      const data = await contract.fetchMyNFTs();
      const items = await Promise.all(
        data.map(async (i: any) => {
          try {
            const tokenId = i.tokenId.toString();
            const tokenURI = await contract.tokenURI(tokenId);
            const meta = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(i.price.toString(), "ether");
            const nftItem: TMarketItem = {
              id: 0,
              tokenId,
              seller: i.seller,
              owner: i.owner,
              price,
              sold: i.sold,
              tokenURI,
              name: meta.data.name,
              mediaUrl: meta.data.mediaUrl,
              mediaType: meta.data.mediaType,
              thumbnailUrl: meta.data.thumbnailUrl,
              description: meta.data.description,
              category: meta.data.category,
              properties: meta.data.properties,
              accountId: null,
              accountAddress: ownerAddress,
              createAt: new Date(),
              updatedAt: new Date(),
            };
            return nftItem;
          } catch (error) {
            return null;
          }
        })
      );
      return items.filter((item): item is TMarketItem => item !== null);
    } catch (error) {
      return [];
    }
  };

  //---BUY NFTs FUNCTION
  const buyNFT: NFTMarketplaceContextType["buyNFT"] = async (nft) => {
    try {
      const contract = await connectingWithSmartContract();
      if (!contract) return;

      // Kiểm tra xem người dùng hiện tại có phải là người bán không
      if (nft.seller.toLowerCase() === currentAccount.toLowerCase()) {
        setError("Bạn không thể mua NFT của chính mình");
        setOpenError(true);
        return;
      }

      // Estimate gas for the transaction
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const gasEstimate = await contract.estimateGas.createMarketSale(nft.tokenId, {
        value: price,
      });
      
      // Convert gas estimate to ETH (assuming standard gas price)
      const gasPrice = await contract.provider?.getGasPrice();
      const gasCostInEth = ethers.utils.formatEther(gasEstimate.mul(gasPrice || 0));
      
      setGasEstimate(gasCostInEth);
      setSelectedNFT(nft);
      setShowBuyConfirmation(true);
    } catch (error: any) {
      console.error("Lỗi khi ước tính gas:", error);
      setError("Lỗi khi ước tính phí giao dịch");
      setOpenError(true);
    }
  };

  const handleConfirmBuy = async () => {
    if (!selectedNFT) return;
    
    try {
      const contract = await connectingWithSmartContract();
      if (!contract) return;

      const price = ethers.utils.parseUnits(selectedNFT.price.toString(), "ether");

      const transaction = await contract.createMarketSale(selectedNFT.tokenId, {
        value: price,
      });

      await transaction.wait();
      setShowBuyConfirmation(false);
      router.push("/author");
    } catch (error: any) {
      console.error("Lỗi khi mua NFT:", error);
      if (error.message?.includes("Seller cannot buy their own token")) {
        setError("Bạn không thể mua NFT của chính mình");
      } else {
        setError("Lỗi khi mua NFT");
      }
      setOpenError(true);
    }
  };

  // monitoring when user account change
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setCurrentAccount(accounts[0]);
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  // catch up when new Token Created
  useEffect(() => {
    let contract: ethers.Contract | null = null;
    async function onNewTokenCreated() {
      const newContract = await connectingWithSmartContract();
      if (newContract) {
        contract = newContract;
        contract.on("MarketItemCreated", onMarketItemCreatedEvent);
      }
    }
    onNewTokenCreated();
    return () => {
      contract?.off("MarketItemCreated", onMarketItemCreatedEvent);
    };
  }, [currentAccount]);

  //---DISCONNECT WALLET FUNCTION
  const disconnectWallet = async () => {
    try {
      // Use wallet context to disconnect if available
      if (walletContext?.disconnect) {
        walletContext.disconnect();
      }
      
      // Reset local state
      setCurrentAccount("");
      setAccountBalance("");
      setContractInstance(null);
      
      // Clear persisted data
      LocalStorageService.clearAccountAddress();
    } catch (error) {
      setError("Failed to disconnect wallet");
      setOpenError(true);
    }
  };

  //---FETCHING SMART CONTRACT
  const fetchContract = (
  signerOrProvider: ethers.Signer | ethers.providers.Provider
) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );

  const onMarketItemCreatedEvent = async (
    tokenId: string,
    seller: string,
    owner: string,
    price: string,
    sold: boolean
  ) => {
    try {
      const contract = await connectingWithSmartContract();
      if (contract) {
        const tokenURI = await contract.tokenURI(tokenId);
        let metadata: Partial<TMarketItem> = {};
        try {
          const response = await axios.get(tokenURI);
          metadata = response.data;
        } catch (err) {
          console.log("Lỗi khi lấy metadata từ tokenURI", err);
        }
        createNewNFT({
          tokenId: tokenId.toString(),
          seller,
          owner,
          price: ethers.utils.formatUnits(price.toString(), "ether"),
          sold,
          tokenURI,
          category: (metadata && metadata.category) ? metadata.category : "",
          likes: [],
        });
      }
    } catch (error) {
      console.log("Lỗi khi tạo NFT trong cơ sở dữ liệu", error);
    }
  };

  //---CHECK IF WALLET IS CONNECTED
  const checkIfWalletConnected = async () => {
    try {
      // Use WalletContext when available
      if (walletContext) {
        const { state } = walletContext;
        
        if (state.isConnected && state.address) {
          // Use wallet context state when connected
          setCurrentAccount(state.address);
          setAccountBalance(state.balance || "");
          // Save for persistence only if different from current
          if (state.address !== LocalStorageService.getAccountAddress()) {
            LocalStorageService.setAccountAddress(state.address);
          }
          return;
        }
      }
      
      // Fallback to localStorage only if we don't have a current account
      if (!currentAccount) {
        const savedAddress = LocalStorageService.getAccountAddress();
        if (savedAddress) {
          setCurrentAccount(savedAddress);
        }
      }
    } catch (error) {
      setError("Failed to connect wallet");
      setOpenError(true);
    }
  };

  // Theo dõi thay đổi của currentAccount để log
  useEffect(() => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log("currentAccount đã thay đổi:", currentAccount);
    }
    // Lưu địa chỉ mới vào localStorage chỉ khi có thay đổi
    if (currentAccount && currentAccount !== LocalStorageService.getAccountAddress()) {
      LocalStorageService.setAccountAddress(currentAccount);
    }
  }, [currentAccount]);

  //---CONNECT WALLET FUNCTION
  const connectWallet = async () => {
    try {
      if (!walletContext) {
        // Show login modal if wallet context is not available
        setShowLoginModal(true);
        return;
      }

      const { connect, state } = walletContext;

      if (!state.isConnected) {
        // Show login modal for authentication
        setShowLoginModal(true);
        return;
      }

      // If already connected, update our state from wallet context
      setCurrentAccount(state.address);
      setAccountBalance(state.balance || "");
      LocalStorageService.setAccountAddress(state.address);

      // Initialize contract with current network
      if (!contractInstance) {
        await connectingWithSmartContract();
      }
    } catch (error) {
      setError("Failed to connect wallet");
      setOpenError(true);
    }
  };

  // Thêm các hàm tracking mới
  const getTokenTransactionHistory = async (tokenId: string) => {
    try {
      const contract = await connectingWithSmartContract();
      if (!contract) return [];
      
      const history = await contract.getTokenTransactionHistory(tokenId);
      return history.map((tx: any) => ({
        from: tx.from,
        to: tx.to,
        price: ethers.utils.formatUnits(tx.price.toString(), "ether"),
        timestamp: new Date(tx.timestamp.toNumber() * 1000).toLocaleString(),
        type: ["MINT", "SALE", "RESELL", "TRANSFER"][tx.transactionType]
      }));
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử giao dịch:", error);
      return [];
    }
  };

  const getTokenProvenance = async (tokenId: string) => {
    try {
      const contract = await connectingWithSmartContract();
      if (!contract) return null;
      
      const provenance = await contract.getTokenProvenance(tokenId);
      return {
        creator: provenance.creator,
        creationTime: new Date(provenance.creationTime.toNumber() * 1000).toLocaleString(),
        metadataURI: provenance.metadataURI,
        verified: provenance.verified
      };
    } catch (error) {
      console.error("Lỗi khi lấy thông tin nguồn gốc:", error);
      return null;
    }
  };

  const getTokenOwnershipHistory = async (tokenId: string) => {
    try {
      const contract = await connectingWithSmartContract();
      if (!contract) return [];
      
      return await contract.getTokenOwnershipHistory(tokenId);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử sở hữu:", error);
      return [];
    }
  };

  const getCurrentTokenOwner = async (tokenId: string) => {
    try {
      const contract = await connectingWithSmartContract();
      if (!contract) return "";
      
      return await contract.getCurrentTokenOwner(tokenId);
    } catch (error) {
      console.error("Lỗi khi lấy chủ sở hữu hiện tại:", error);
      return "";
    }
  };

  const getTokenTransactionCount = async (tokenId: string) => {
    try {
      const contract = await connectingWithSmartContract();
      if (!contract) return 0;
      
      return (await contract.getTokenTransactionCount(tokenId)).toNumber();
    } catch (error) {
      console.error("Lỗi khi lấy số lượng giao dịch:", error);
      return 0;
    }
  };

  const getTokenOwnerCount = async (tokenId: string) => {
    try {
      const contract = await connectingWithSmartContract();
      if (!contract) return 0;
      
      return (await contract.getTokenOwnerCount(tokenId)).toNumber();
    } catch (error) {
      console.error("Lỗi khi lấy số lượng chủ sở hữu:", error);
      return 0;
    }
  };

  const isOriginalToken = async (tokenId: string) => {
    try {
      const contract = await connectingWithSmartContract();
      if (!contract) return false;
      
      return await contract.isOriginalToken(tokenId);
    } catch (error) {
      console.error("Lỗi khi kiểm tra token gốc:", error);
      return false;
    }
  };

  const getTokensCreatedBy = async (creator: string) => {
    try {
      const contract = await connectingWithSmartContract();
      if (!contract) return [];
      
      return await contract.getTokensCreatedBy(creator);
    } catch (error) {
      console.error("Lỗi khi lấy tokens được tạo bởi:", error);
      return [];
    }
  };

  const fetchNFTByTokenId: NFTMarketplaceContextType["fetchNFTByTokenId"] = async (tokenId) => {
    try {
      // Get contract instance only once
      const contract = await connectingWithSmartContract();
      if (!contract) {
        console.error("Không thể kết nối với smart contract");
        return null;
      }

      // Verify contract has required methods
      if (!contract.fetchNFTByTokenId || typeof contract.fetchNFTByTokenId !== 'function') {
        console.error("Contract không có phương thức fetchNFTByTokenId");
        return null;
      }


      // Fetch all required data in parallel
      const marketItem = await contract.fetchNFTByTokenId(tokenId);
      const tokenURI = await contract.tokenURI(tokenId);

      if (!marketItem || !tokenURI) {
        console.error("Không thể lấy thông tin NFT");
        return null;
      }

      // Get metadata
      const meta = await axios.get(tokenURI);
      
      // Format price once
      const price = ethers.utils.formatUnits(marketItem.price.toString(), "ether");

      // Return formatted NFT item
      return {
        id: 0,
        tokenId: marketItem.tokenId.toString(),
        seller: marketItem.seller,
        owner: marketItem.owner,
        price,
        sold: marketItem.sold,
        tokenURI,
        name: meta.data.name,
        mediaUrl: meta.data.mediaUrl,
        mediaType: meta.data.mediaType,
        thumbnailUrl: meta.data.thumbnailUrl,
        description: meta.data.description,
        category: meta.data.category,
        properties: meta.data.properties,
        accountId: null,
        accountAddress: marketItem.owner,
        createAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error("Lỗi khi lấy thông tin NFT:", error);
      return null;
    }
  };


  // Memoize context value
  const contextValue = useMemo(() => ({
    uploadToPinata,
    checkIfWalletConnected,
    connectWallet,
    disconnectWallet,
    createNFT,
    setError,
    fetchNFTs,
    fetchMyNFTsOrListedNFTs,
    fetchNFTsByOwner,
    fetchNFTByTokenId,
    buyNFT,
    createSale,
    currentAccount,
    titleData,
    setOpenError,
    openError,
    error,
    accountBalance,
    gasEstimate,
    nfts,
    setNfts,
    likes,
    setLikes,
    openSwitchNetwork,
    setOpenSwitchNetwork,
    getTokenTransactionHistory,
    getTokenProvenance,
    getTokenOwnershipHistory,
    getCurrentTokenOwner,
    getTokenTransactionCount,
    getTokenOwnerCount,
    isOriginalToken,
    getTokensCreatedBy,
    getListingPrice,
  }), [
    uploadToPinata,
    checkIfWalletConnected,
    connectWallet,
    disconnectWallet,
    createNFT,
    setError,
    fetchNFTs,
    fetchMyNFTsOrListedNFTs,
    fetchNFTsByOwner,
    fetchNFTByTokenId,
    buyNFT,
    createSale,
    currentAccount,
    titleData,
    setOpenError,
    openError,
    error,
    accountBalance,
    gasEstimate,
    nfts,
    setNfts,
    likes,
    setLikes,
    openSwitchNetwork,
    setOpenSwitchNetwork,
    getTokenTransactionHistory,
    getTokenProvenance,
    getTokenOwnershipHistory,
    getCurrentTokenOwner,
    getTokenTransactionCount,
    getTokenOwnerCount,
    isOriginalToken,
    getTokensCreatedBy,
    getListingPrice
  ]);

  return (
    <NFTMarketplaceContext.Provider value={contextValue}>
      {children}      
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={async (username: string, password: string) => {
            try {
              setLoading(true);
              if (!walletContext) {
                throw new Error("Wallet context not available");
              }
              const token = await walletContext.login(username, password);
              LocalStorageService.setWalletToken(token);
              const accounts = await walletContext.getAccounts();
              if (!accounts?.[0]) {
                throw new Error("No accounts available");
              }
              const account = accounts[0];
              setCurrentAccount(account.address);
              const privateKey = await walletContext.getPrivateKey(account.id, password);
              LocalStorageService.setAccountId(account.id);
              LocalStorageService.setPrivateKey(privateKey);
              LocalStorageService.setAccountAddress(account.address);
              await walletContext.setToken(token);
              setShowLoginModal(false);
            } catch (error) {
              setError("Login failed");
              setOpenError(true);
            } finally {
              setLoading(false);
            }
          }}
        />
      )}
      {showBuyConfirmation && selectedNFT && (
        <BuyNFTConfirmationModal
          isOpen={showBuyConfirmation}
          onClose={() => setShowBuyConfirmation(false)}
          onConfirm={handleConfirmBuy}
          nft={selectedNFT}
          userBalance={accountBalance}
          gasEstimate={gasEstimate}
        />
      )}

    </NFTMarketplaceContext.Provider>
  );
};

export default NFTMarketplaceContext;

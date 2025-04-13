"use client";

import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import axios from "axios";
//INTERNAL  IMPORT
import { NFTMarketplaceAddress, NFTMarketplaceABI, SUPPORTED_NETWORKS } from "./constants";
import { TLike, TMarketItem } from "@/types";
import { createNewNFT, getLikes } from "@/actions/NFT";
import { LoadingContext } from "./LoadingSpinnerProvider";

export type CreateNFTParams = {
  name: string;
  price: string;
  image: string;
  description: string;
  router: any;
};

export type CreateNFT = (params: CreateNFTParams) => Promise<void>;

// defined the type of value in the Context
export type TNFTMarketplaceContextType = {
  uploadToPinata: (file: File) => Promise<string | undefined>;
  checkIfWalletConnected: () => Promise<void>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  createNFT: CreateNFT;
  fetchNFTs: () => Promise<TMarketItem[]>;
  fetchMyNFTsOrListedNFTs: (type?: string) => Promise<TMarketItem[]>;
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
  nfts: TMarketItem[];
  setNfts: Dispatch<SetStateAction<TMarketItem[]>>;
  likes: TLike[][];
  setLikes: Dispatch<SetStateAction<TLike[][]>>;
  openSwitchNetwork: boolean;
  setOpenSwitchNetwork: Dispatch<SetStateAction<boolean>>;
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
const web3Modal = globalThis.window && new Web3Modal();

//---CONNECTING WITH SMART CONTRACT
const connectingWithSmartContract = async () => {
  try {
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);
    console.log("connecting with smart contract: ", contract);

    const network = await provider.getNetwork();
    console.log("Connected network:", network);
    
    return contract;
  } catch (error) {
    console.log("Something went wrong while connecting with contract", error);
  }
};
// listen NFT created
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
      console.log("tokenId", tokenId);
      const tokenURI = await contract.tokenURI(tokenId);
      console.log("tokenURI", tokenURI);
      console.log({
        tokenId: tokenId.toString(),
        seller,
        owner,
        price: ethers.utils.formatUnits(price.toString(), "ether"),
        sold,
        tokenURI,
      });
      createNewNFT({
        tokenId: tokenId.toString(),
        seller,
        owner,
        price: ethers.utils.formatUnits(price.toString(), "ether"),
        sold,
        tokenURI,
      });
    }
  } catch (error) {
    console.log("createNFT in database has a problem ", error);
  }
};

export const NFTMarketplaceContext =
  React.createContext<TNFTMarketplaceContextType | null>(null);

export const NFTMarketplaceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const titleData = "Discover, collect, and sell NFTs";

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

  //---CHECK IF WALLET IS CONNECTD
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");

      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const network = await provider.getNetwork();
      console.log("Current network in checkIfWalletConnected:", network);
      
      // Support both localhost and Polygon Amoy networks
      if (network.chainId !== SUPPORTED_NETWORKS.LOCALHOST.chainId && 
          network.chainId !== SUPPORTED_NETWORKS.POLYGON_AMOY.chainId) {
        setOpenSwitchNetwork(true);
      }
      
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts && accounts.length) {
        setCurrentAccount(accounts[0]!);
        // console.log(accounts[0]);
      } else {
        // setError("No Account Found");
        // setOpenError(true);
        console.log("No account");
      }

      const getBalance = await provider.getBalance(accounts?.[0]!);
      const bal = ethers.utils.formatEther(getBalance);
      setAccountBalance(bal);
    } catch (error) {
      // setError("Something wrong while connecting to wallet");
      // setOpenError(true);
      console.log("not connected");
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  //---CONNET WALLET FUNCTION
  const connectWallet = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");

      // Kiểm tra mạng hiện tại
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      console.log("Current network in connectWallet:", network);

      // Hỗ trợ cả mạng localhost và Polygon Amoy
      const isValidNetwork = 
        network.chainId === SUPPORTED_NETWORKS.LOCALHOST.chainId || 
        network.chainId === SUPPORTED_NETWORKS.POLYGON_AMOY.chainId;
      
      // Nếu không phải mạng được hỗ trợ, hiển thị modal chuyển mạng
      if (!isValidNetwork) {
        setOpenSwitchNetwork(true);
        // Không cần tự động chuyển mạng ở đây, để người dùng chọn
        // thông qua modal SwitchNetwork
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("accounts:", accounts);
      setCurrentAccount(accounts[0]);

      // window.location.reload();
      connectingWithSmartContract();
    } catch (error) {
      // setError("Error while connecting to wallet");
      setOpenError(true);
      console.log("Connection error:", error);
    }
  };

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
        console.log("Unable to upload image to Pinata");
      }
    }
  };

  //---CREATENFT FUNCTION
  const createNFT: CreateNFT = async ({
    name,
    price,
    image,
    description,
    router,
  }) => {
    if (!name || !description || !price || !image)
      return setError("Data Is Missing"), setOpenError(true);
    setLoading(true);
    const data = JSON.stringify({ name, description, image });
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
      console.log(url);

      await createSale(url, price);
      router.push("/searchPage");
    } catch (error) {
      setLoading(false);
      setError("Error while creating NFT");
      setOpenError(true);
    }
  };

  function convertCidToImage(cid: string) {
    // Kiểm tra xem CID có hợp lệ không
    if (!cid) {
      throw new Error("CID không hợp lệ");
    }
  
    // Tạo URL từ CID
    const imageUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
  
    return imageUrl;
  }

  /**
   * Creates a new NFT sale or resells an existing NFT on the marketplace
   * @param url - The IPFS URL of the NFT metadata
   * @param formInputPrice - The price of the NFT in ETH
   * @param isReselling - Optional flag to indicate if this is a resale of an existing NFT
   * @param id - Optional token ID for reselling an existing NFT
   */
  const createSale: TNFTMarketplaceContextType["createSale"] = async (
    url,
    formInputPrice,
    isReselling?,
    id?
  ) => {
    try {
      // Log the sale creation attempt and parameters
      console.log("createSale");
      console.log(url, formInputPrice, isReselling, id);
      
      // Convert the price from ETH to Wei (the smallest unit in Ethereum)
      const price = ethers.utils.parseUnits(formInputPrice, "ether");

      // Connect to the smart contract
      const contract = await connectingWithSmartContract();
      if (!contract) return;
      
      // Get the listing fee required to create a sale
      const listingPrice = await contract.getListingPrice();
      console.log("listingPrice:", listingPrice);
      
      // Determine whether to create a new token or resell an existing one
      // If isReselling is true, call resellToken with the token ID
      // Otherwise, call createToken with the metadata URL
      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(), // Include the listing fee in the transaction
          })
        : await contract.resellToken(id, price, {
            value: listingPrice.toString(), // Include the listing fee in the transaction
          });
      
      // Log the transaction details
      console.log("wait for mining" ,transaction);
      
      // Wait for the transaction to be mined on the blockchain
      await transaction.wait();
      
      // Turn off the loading indicator
      setLoading(false);
      
      // Log the completed transaction
      console.log(transaction);
    } catch (error) {
      // Handle any errors that occur during the sale creation process
      setError("error while creating sale");
      setOpenError(true);
      console.log(error);
    }
  };

  //--FETCHNFTS FUNCTION

  const fetchNFTs: TNFTMarketplaceContextType["fetchNFTs"] = async () => {
    try {
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const contract = fetchContract(provider);

      const data = await contract.fetchMarketItems();

      console.log(data);

      const items = await Promise.all(
        data.map(
          async ({
            tokenId,
            seller,
            owner,
            price: unformattedPrice,
          }: TMarketItem) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const {
              data: { image, name, description },
            } = await axios.get(tokenURI, {});
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );
            return {
              price,
              tokenId: tokenId?.toString(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );

      return items;

      // }
    } catch (error) {
      // setError("Error while fetching NFTS");
      // setOpenError(true);
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    fetchNFTs().then((items: TMarketItem[]) => {
      console.log("fetchNFTs", items);
      setNfts(items?.reverse());
    });
  }, []);

  //--FETCHING MY NFT OR LISTED NFTs
  const fetchMyNFTsOrListedNFTs: TNFTMarketplaceContextType["fetchMyNFTsOrListedNFTs"] =
    async (type?: string) => {
      try {
        if (currentAccount) {
          const contract = await connectingWithSmartContract();
          if (!contract) return [];
          const data =
            type == "fetchItemsListed"
              ? await contract.fetchItemsListed()
              : await contract.fetchMyNFTs();
          const items = await Promise.all(
            data.map(
              async ({
                tokenId,
                seller,
                owner,
                price: unformattedPrice,
              }: TMarketItem) => {
                const tokenURI = await contract.tokenURI(tokenId);
                const {
                  data: { image, name, description },
                } = await axios.get(tokenURI);
                const price = ethers.utils.formatUnits(
                  unformattedPrice.toString(),
                  "ether"
                );

                return {
                  price,
                  tokenId: tokenId?.toString(),
                  seller,
                  owner,
                  image,
                  name,
                  description,
                  tokenURI,
                };
              }
            )
          );
          return items;
        }
        return [];
      } catch (error) {
        // setError("Error while fetching listed NFTs");
        // setOpenError(true);
        return [];
      }
    };

  useEffect(() => {
    fetchMyNFTsOrListedNFTs();
  }, []);

  //---BUY NFTs FUNCTION
  const buyNFT: TNFTMarketplaceContextType["buyNFT"] = async (nft) => {
    try {
      const contract = await connectingWithSmartContract();
      console.log(contract);
      if (!contract) return;
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      console.log(price, nft);

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });

      await transaction.wait();
      router.push("/author");
    } catch (error) {
      setError("Error While buying NFT");
      setOpenError(true);
    }
  };

  // monitoring when user account change
  useEffect(() => {
    // Check if window.ethereum is available
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setCurrentAccount(accounts[0]);
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // Cleanup the event listener on component unmount
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  // catch up when new Token Created
  useEffect(() => {
    let contract: ethers.Contract | undefined;
    async function onNewTokenCreated() {
      contract = await connectingWithSmartContract();
      contract && contract.on("MarketItemCreated", onMarketItemCreatedEvent);
    }
    onNewTokenCreated();
    return () => {
      contract?.off("MarketItemCreated", onMarketItemCreatedEvent);
    };
  }, [currentAccount]);

  //---DISCONNECT WALLET FUNCTION
  const disconnectWallet = async () => {
    try {
      // Reset current account state
      setCurrentAccount("");
      
      // Clear local connection data if any
      localStorage.removeItem("walletConnected");
      
      // Note: MetaMask doesn't have an official disconnect method
      // This just resets the app state, user can still be connected in MetaMask
      
      console.log("Wallet disconnected from app");
      
      // Optionally redirect to home page
      // window.location.href = "/";
    } catch (error) {
      console.log("Error while disconnecting wallet:", error);
      setError("Lỗi khi đăng xuất");
      setOpenError(true);
    }
  };

  return (
    <NFTMarketplaceContext.Provider
      value={{
        uploadToPinata,
        checkIfWalletConnected,
        connectWallet,
        disconnectWallet,
        createNFT,
        setError,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        createSale,
        currentAccount,
        titleData,
        setOpenError,
        openError,
        error,
        accountBalance,
        nfts,
        setNfts,
        likes,
        setLikes,
        openSwitchNetwork,
        setOpenSwitchNetwork,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};

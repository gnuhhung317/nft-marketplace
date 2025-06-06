import React, { useContext, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // cn function for dynamic class names
import { getSellerByAddress } from "@/actions/Account";

// ICONS IMPORT
import {
  MdVerified,
  MdCloudUpload,
  MdReportProblem,
  MdOutlineDeleteSweep,
} from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaWallet, FaPercentage } from "react-icons/fa";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
} from "react-icons/ti";
import { BiTransferAlt, BiDollar } from "react-icons/bi";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import images from "@/img";
import { TMarketItem } from "@/types";
import NFTTabs from "./NFTTabs";
import { Button } from "@/components/ui/button";
import DropDown from "@/components/DropDown";
import { LocalStorageService } from "@/services/LocalStorageService";
import EthPriceDisplay from '@/components/EthPriceDisplay';

const cloudItems = [
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <TiSocialInstagram /> Instagram{" "}
      </div>
    ),
  },
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <TiSocialLinkedin /> LinkedIn
      </div>
    ),
  },
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <TiSocialTwitter /> Twitter
      </div>
    ),
  },
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <TiSocialYoutube /> YouTube
      </div>
    ),
  },
];
const helpsItems = [
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <BiDollar /> Thay đổi giá
      </div>
    ),
  },
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <BiTransferAlt /> Chuyển nhượng{" "}
      </div>
    ),
  },
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <MdReportProblem /> Báo cáo lạm dụng
      </div>
    ),
  },
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <MdOutlineDeleteSweep /> Xóa mục
      </div>
    ),
  },
];
const provenanceArray = [
  images.user6,
  images.user7,
  images.user8,
  images.user9,
  images.user10,
];
const ownerArray = [
  images.user1,
  images.user8,
  images.user2,
  images.user6,
  images.user5,
];
const historyArray = [
  images.user1,
  images.user2,
  images.user3,
  images.user4,
  images.user5,
];

interface ISeller {
  id: number;
  username: string | null;
  avatar: string | null;
  accountAddress: string;
}

interface TransactionData {
  from: string;
  to: string;
  price: string;
  timestamp: string;
  type: string;
}

interface ProvenanceData {
  creator: string;
  creationTime: string;
  metadataURI: string;
  verified: boolean;
}

interface TabData {
  id: number;
  title: string;
  description: string;
}

const NFTDescription = ({ nft }: { nft: TMarketItem }) => {
  const [social, setSocial] = useState(false);
  const [NFTMenu, setNFTMenu] = useState(false);
  const [history, setHistory] = useState(false);
  const [provenance, setProvenance] = useState(false);
  const [owner, setOwner] = useState(false);
  const [seller, setSeller] = useState<ISeller | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [historyData, setHistoryData] = useState<TransactionData[]>([]);
  const [provenanceData, setProvenanceData] = useState<ProvenanceData | null>(null);
  const [ownerData, setOwnerData] = useState<string[]>([]);

  const router = useRouter();
  const { buyNFT, currentAccount, getTokenTransactionHistory, getTokenProvenance, getTokenOwnershipHistory, getCurrentTokenOwner, getTokenTransactionCount, getTokenOwnerCount, isOriginalToken, getTokensCreatedBy } = useContext(NFTMarketplaceContext)!;

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        if (!nft.seller) return;
        
        const result = await getSellerByAddress(nft.seller);
        if (!result.success || !result.data) {
          throw new Error(result.error);
        }
        setSeller(result.data as ISeller);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người bán:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (nft.seller) {
      fetchSeller();
    }
  }, [nft.seller]);

  useEffect(() => {
    const fetchData = async () => {
      if (history && nft.tokenId) {
        setIsLoading(true);
        const data = await getTokenTransactionHistory(nft.tokenId);
        setHistoryData(data);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [history, nft.tokenId]);

  useEffect(() => {
    const fetchData = async () => {
      if (provenance && nft.tokenId) {
        setIsLoading(true);
        const data = await getTokenProvenance(nft.tokenId);
        setProvenanceData(data);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [provenance, nft.tokenId]);

  useEffect(() => {
    const fetchData = async () => {
      if (owner && nft.tokenId) {
        setIsLoading(true);
        const data = await getTokenOwnershipHistory(nft.tokenId);
        setOwnerData(data);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [owner, nft.tokenId]);

  const switchTab = (tab: "history" | "provenance" | "owner") => {
    setHistory(tab === "history");
    setProvenance(tab === "provenance");
    setOwner(tab === "owner");
  };

  // Format data for display
  const historyArray: TabData[] = historyData.map((tx, index) => ({
    id: index + 1,
    title: `Giao dịch ${tx.type}`,
    description: `Từ: ${tx.from}\nĐến: ${tx.to}\nGiá: ${tx.price} ETH\nThời gian: ${tx.timestamp}`,
  }));

  const provenanceArray: TabData[] = provenanceData ? [{
    id: 1,
    title: "Thông tin nguồn gốc",
    description: `Người tạo: ${provenanceData.creator}\nThời gian tạo: ${provenanceData.creationTime}\nĐã xác minh: ${provenanceData.verified ? "Có" : "Không"}`,
  }] : [];

  const ownerArray: TabData[] = ownerData.map((address, index) => ({
    id: index + 1,
    title: `Chủ sở hữu ${index + 1}`,
    description: address,
  }));

  return (
    <div className={cn("w-full")}>
      <div className={cn("w-full m-auto")}>
        <div className={cn("flex items-center justify-between relative")}>
          <p
            className={cn(
              "bg-icons text-main-bg p-[0.2rem_0.8rem] rounded-[2rem]"
            )}
          >
           {nft.category} 
          </p>
          <div className="flex items-center gap-4">
            <DropDown items={cloudItems}>
              <MdCloudUpload className={cn("cursor-pointer")} />
            </DropDown>

            <DropDown items={helpsItems}>
              <BsThreeDots className={cn("cursor-pointer")} />
            </DropDown>
          </div>
        </div>

        <div className={cn("flex flex-col items-start gap-[2rem] pb-[1.5rem]")}>
          <h1 className={cn("text-4xl font-bold mt-4 leading-[1] ")}>
            {nft.name} #{nft.tokenId}
          </h1>
          <div className={cn("flex items-center gap-[2rem]")}>
            <div
              className={cn(
                "flex items-center self-center gap-[1rem] leading-[1]"
              )}
            >
              <Image
                src={seller?.avatar || images.user1}
                alt="profile"
                width={40}
                height={40}
                className={cn("rounded-full")}
              />
              <div>
                <small className={cn("font-medium")}>Người bán</small> <br />
                <Link href={{ pathname: `/author/${seller?.id}` }}>
                  <span className={cn("font-bold flex items-center")}>
                    {seller?.username || nft.seller} <MdVerified />
                  </span>
                </Link>
              </div>
            </div>

            <div
              className={cn(
                "flex items-center gap-[1rem] leading-[1] border-l-[1px] border-icons pl-[2rem]"
              )}
            >
              <Image
                src={images.creatorbackground1}
                alt="profile"
                width={40}
                height={40}
                className={cn("rounded-full")}
              />
              {/* <div>
                <small className={cn("font-medium")}>Bộ sưu tập</small> <br />
                <span className={cn("font-bold flex items-center")}>
                  Ứng dụng Mokeny <MdVerified />
                </span>
              </div> */}
            </div>
          </div>          <div className={cn("my-[1rem]")}>

            <div
              className={cn(
                "grid xl:grid-cols-[4fr_1fr] sm:grid-cols-[4fr_1fr] lg:grid-cols-1 gap-[3rem] items-end justify-between mt-[4rem]"
              )}
            >
              <div
                className={cn(
                  "border-[2px] leading-[1.5] border-icons rounded-[0.5rem]"
                )}
              >
                <small
                  className={cn(
                    "text-[1.2rem] bg-icons text-main-bg px-[1rem] py-[0.5rem] rounded-[0.5rem] ml-[2rem]"
                  )}
                >
                  Giá hiện tại
                </small>
                <br />
                <EthPriceDisplay ethAmount={nft.price} className={cn("px-[1rem] text-[1.5rem] font-extrabold")} />
              </div>
            </div>

            <div className={cn("mt-[3rem] flex items-center gap-[3rem]")}>
              
              {currentAccount?.toLocaleLowerCase() === nft.seller?.toLocaleLowerCase() ? (
                <p>Bạn không thể mua NFT của chính mình</p>
              ) : currentAccount?.toLocaleLowerCase() === nft.owner?.toLocaleLowerCase() ? (
                <Button
                  onClick={() =>
                    router.push(
                      `/reSellToken?id=${nft.tokenId}&tokenURI=${nft.tokenURI}&price=${nft.price}`
                    )
                  }
                  className={cn("button")}
                >
                  <FaWallet />
                  &nbsp; Đưa lên Thị Trường
                </Button>
              ) : (
                <Button onClick={() => buyNFT(nft)} className={cn("button")}>
                  <FaWallet />
                  &nbsp; Mua NFT
                </Button>
              )}
            </div>

            <div className={cn("mt-[3rem] flex flex-wrap gap-[1rem]")}>
              <button
                onClick={() => switchTab("history")}
                className={cn(
                  "text-[1rem] py-[1rem] px-[2rem] whitespace-nowrap border-0 bg-shadow-dark text-icons rounded-[2rem] cursor-pointer font-semibold",
                  history && "bg-icons text-main-bg"
                )}
              >
                Lịch sử Giao dịch
              </button>
              <button
                onClick={() => switchTab("provenance")}
                className={cn(
                  "text-[1rem] py-[1rem] px-[2rem] whitespace-nowrap border-0 bg-shadow-dark text-icons rounded-[2rem] cursor-pointer font-semibold",
                  provenance && "bg-icons text-main-bg"
                )}
              >
                Nguồn gốc
              </button>
              <button
                onClick={() => switchTab("owner")}
                className={cn(
                  "text-[1rem] py-[1rem] px-[2rem] whitespace-nowrap border-0 bg-shadow-dark text-icons rounded-[2rem] cursor-pointer font-semibold",
                  owner && "bg-icons text-main-bg"
                )}
              >
                Chủ sở hữu
              </button>
            </div>

            {isLoading ? (
              <div className={cn("mt-[2rem] p-[1rem] text-center")}>
                Đang tải dữ liệu...
              </div>
            ) : (
              <>
                {history && (
                  <div className={cn("mt-[2rem] p-[1rem]")}>
                    <NFTTabs dataTab={historyArray} />
                  </div>
                )}
                {provenance && (
                  <div className={cn("mt-[2rem] p-[1rem]")}>
                    <NFTTabs dataTab={provenanceArray} />
                  </div>
                )}
                {owner && (
                  <div className={cn("mt-[2rem] p-[1rem]")}>
                    <NFTTabs dataTab={ownerArray} icon={<MdVerified />} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDescription;

import React, { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEthereum } from "react-icons/fa";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import { LoadingContext } from "@/Context/LoadingSpinnerProvider";
import { TMarketItem } from "@/types";
import { cn } from "@/lib/utils";

type NFTCardProps = {
  nft: TMarketItem;
  listedMode?: boolean;
};

const NFTCard = ({ nft, listedMode = false }: NFTCardProps) => {
  const { buyNFT } = useContext(NFTMarketplaceContext)!;
  const { setLoading } = useContext(LoadingContext) || { setLoading: () => {} };
  const [isBuying, setIsBuying] = useState(false);

  const handleBuyNFT = async () => {
    try {
      setIsBuying(true);
      await buyNFT(nft);
    } catch (error) {
      console.error("Lỗi khi mua NFT:", error);
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-icons/30 bg-main-bg shadow-custom transition-all duration-300 hover:shadow-lg hover:border-icons/60">      {/* NFT Image */}
      <Link href={`/NFT-details/${nft.tokenId}`} className="block relative">
        <div className="relative h-60 w-full overflow-hidden group">
          <Image
            src={nft.image || "/images/nft_1.png"}
            alt={nft.name || "NFT"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 bg-main-bg/70 backdrop-blur-sm rounded-full px-3 py-1 border border-icons/20">
            <div className="flex items-center">
              <FaEthereum className="text-icons mr-1" />
              <span className="text-primary font-medium">{nft.price}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* NFT Info */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Link href={`/NFT-details/${nft.tokenId}`} className="block w-3/4">
            <h3 className="text-primary font-semibold text-xl truncate hover:text-icons transition-colors">
              {nft.name || `NFT #${nft.tokenId}`}
            </h3>
          </Link>
        </div>
          <div className="flex justify-between items-center mb-4">
          <Link href={`/author?address=${nft.seller}`} className="block">
            <span className="text-primary/70 text-sm hover:text-icons transition-colors flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
              {nft.seller && nft.seller !== "0x0000000000000000000000000000000000000000" 
                ? `${nft.seller.substring(0, 6)}...${nft.seller.substring(nft.seller.length - 4)}`
                : "No seller info"
              }
            </span>
          </Link>
        </div>

        {listedMode && (
          <button
            onClick={handleBuyNFT}
            disabled={isBuying}
            className={cn(
              "w-full py-2.5 rounded-lg text-center font-semibold",
              "bg-icons text-main-bg hover:bg-main-bg hover:text-icons transition-colors duration-300",
              "border border-transparent hover:border-icons",
              "flex items-center justify-center",
              isBuying ? "opacity-70 cursor-not-allowed" : ""
            )}
          >
            {isBuying ? (
              <>
                <div className="h-4 w-4 border-2 border-main-bg border-t-transparent animate-spin rounded-full mr-2"></div>
                Đang xử lý...
              </>
            ) : (
              "Mua ngay"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default NFTCard;

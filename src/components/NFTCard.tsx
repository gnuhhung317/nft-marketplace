'use client'
import React, { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEthereum } from "react-icons/fa";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import { LoadingContext } from "@/Context/LoadingSpinnerProvider";
import { TMarketItem } from "@/types";
import { cn } from "@/lib/utils";
import MediaPreview from "./MediaPreview";
import { BsImage } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import LikeProfile from "./LikeProfile";
import { Like } from "./Like";

type NFTCardProps = {
  nft: TMarketItem;
  listedMode?: boolean;
};

const NFTCard = ({ nft, listedMode = false }: NFTCardProps) => {
  const { buyNFT, currentAccount } = useContext(NFTMarketplaceContext)!;
  const { setLoading } = useContext(LoadingContext) || { setLoading: () => {} };
  const [isBuying, setIsBuying] = useState(false);
  const [like, setLike] = useState(false);
  const [likeInc, setLikeInc] = useState(21);

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

  const likeNFT = () => {
    setLike(!like);
    setLikeInc(like ? likeInc - 1 : likeInc + 1);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-icons/30 bg-main-bg shadow-custom transition-all duration-300 hover:shadow-lg hover:border-icons/60">
      {/* NFT Media */}
      <div className="block relative">
        <div className="relative h-60 w-full overflow-hidden group">
          <MediaPreview
            mediaType={nft.mediaType}
            mediaUrl={nft.mediaUrl}
            thumbnailUrl={nft.thumbnailUrl}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 bg-main-bg/70 backdrop-blur-sm rounded-full px-3 py-1 border border-icons/20">
            <div className="flex items-center">
              <FaEthereum className="text-icons mr-1" />
              <span className="text-primary font-medium">{nft.price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-sm font-medium">Người bán</p>
              <p className="text-xs text-icons/70">{nft.seller?.slice(0, 6)}...{nft.seller?.slice(-4)}</p>
            </div>
          </div>
        </div>

        <Link href={`/NFT-details/${nft.tokenId}`} className="block">
          <h3 className="text-lg font-bold mb-2">{nft.name}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MdVerified className="text-primary" />
              <span className="text-sm text-icons/70">Đã xác minh</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEthereum className="text-primary" />
              <span className="font-bold">{nft.price} ETH</span>
            </div>
          </div>
        </Link>

        {listedMode && currentAccount !== nft.seller && (
          <button
            onClick={handleBuyNFT}
            disabled={isBuying}
            className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBuying ? "Đang xử lý..." : "Mua ngay"}
          </button>
        )}
      </div>
    </div>
  );
};

export default NFTCard;

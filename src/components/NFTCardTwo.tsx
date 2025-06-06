"use client";
import React, { useContext, useState, useEffect } from "react";
import { BsImage } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TMarketItem } from "@/types";
import LikeProfile from "./LikeProfile";
import { Like } from "./Like";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import { getNFTByTokenId } from "@/actions/NFT";
import MediaPreview from "./MediaPreview";

const NFTCardTwo = ({ NFTs }: { NFTs: TMarketItem[] }) => {
  const { currentAccount } = useContext(NFTMarketplaceContext)!;
  const [nftData, setNftData] = useState<TMarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setLoading(true);
        const updatedNFTs = await Promise.all(
          NFTs.map(async (nft) => {
            if (nft.tokenId) {
              const result = await getNFTByTokenId(nft.tokenId);
              if (result.success) {
                return result.data;
              }
            }
            return nft;
          })
        );
        setNftData(updatedNFTs);
      } catch (err) {
        setError("Không thể tải dữ liệu NFT");
        console.error("Error fetching NFT data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [NFTs]);

  if (loading) {
    return (
      <div className="w-full text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Đang tải NFTs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center p-6 bg-red-50 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  if (!nftData || nftData.length === 0) {
    return (
      <div className="w-full text-center p-8 bg-gray-50 rounded-lg">
        <div className="mb-4 text-gray-400">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700">Không có NFT nào được tìm thấy</h3>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto grid lg:grid-cols-3 gap-12 mb-56 grid-cols-1 md:w-9/10 md:grid-cols-2"
      )}
    >
      {nftData?.map((el, i) => (
        <Link href={`/NFT-details/${el.tokenId}`} key={i}>
          <div
            className={cn(
              "cursor-pointer relative transition-all duration-300 ease-in rounded-lg",
              "hover:shadow-[0_0_15px_rgba(93,222,226,1)]"
            )}
          >
            <div className={cn("absolute w-full p-4 grid-cols-1 z-2")}>
              <div className={cn("flex items-center w-full justify-between")}>
                <BsImage className={cn("text-icons text-4xl")} />
                <Like nFTTokenId={el.tokenId!} currentAccount={currentAccount!}></Like>
              </div>
            </div>
            <div className={cn("grid-cols-1 relative aspect-square")}>
              <MediaPreview
                mediaType={el.mediaType}
                mediaUrl={el.mediaUrl}
                thumbnailUrl={el.thumbnailUrl}
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
            <div className={cn("flex justify-between p-4")}>
              <div>
                <LikeProfile></LikeProfile>
                <p className="text-xl truncate max-w-[200px]">{el.name}</p>
              </div>
            </div>
            <div className={cn("flex justify-between items-end p-4")}>
              <div>
                <small className="bg-primary text-main-bg py-1 px-2 rounded-sm ml-4">
                  Giá Hiện Tại
                </small>
                <p
                  className={cn(
                    "border-[1px] -mt-4 whitespace-nowrap border-icons p-6 text-[1.4rem] rounded-sm"
                  )}
                >
                  {el.price || i + 4} ETH
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NFTCardTwo;

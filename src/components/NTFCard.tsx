"use client";
import React, { useContext, useState } from "react";
import { BsImage } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TMarketItem } from "@/types";
import LikeProfile from "./LikeProfile";
import { Like } from "./Like";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import MediaPreview from "./MediaPreview";

const NTFCard = ({ NFTs }: { NFTs: TMarketItem[] }) => {
  const { currentAccount } = useContext(NFTMarketplaceContext)!;
  const [like, setLike] = useState(false);
  const [likeInc, setLikeInc] = useState(21);

  const likeNFT = () => {
    setLike(!like);
    setLikeInc(like ? likeInc - 1 : likeInc + 1);
  };

  return (
    <div
      className={cn(
        "mx-auto grid lg:grid-cols-3 gap-12 mb-56 grid-cols-1 md:w-9/10 md:grid-cols-2"
      )}
    >
      {NFTs?.map((el, i) => (
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
                className="col-span-full object-fill row-span-full transition-all duration-400 ease-in-out w-full h-full"
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

export default NTFCard;

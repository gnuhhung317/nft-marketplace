import { cn } from "@/lib/utils";
import { BsImages } from "react-icons/bs";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import React, { useContext, useState } from "react";
import { TMarketItem } from "@/types";
import { Like } from "@/components/Like";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import MediaPreview from "@/components/MediaPreview";

const NFTDetailsImg = ({ nft }: { nft: TMarketItem }) => {
  const [description, setDescription] = useState(true);
  const [details, setDetails] = useState(true);
  const { currentAccount } = useContext(NFTMarketplaceContext)!;
  const toggleDescription = () => setDescription(!description);
  const toggleDetails = () => setDetails(!details);

  return (
    <div className={cn("w-full")}>
      <div>
        <div className={cn("grid")}>
          <div
            className={cn(
              "grid grid-cols-[1fr] grid-rows-[auto_auto] z-[11] self-start p-[2rem]"
            )}
          >
            <div className={cn("flex items-center justify-between")}>
              <BsImages className={cn("text-[1.4rem]")} />
              <Like nFTTokenId={nft.tokenId!} currentAccount={currentAccount!}></Like>
            </div>
            <div className="relative w-full aspect-square">
              <MediaPreview
                mediaType={nft.mediaType}
                mediaUrl={nft.mediaUrl}
                thumbnailUrl={nft.thumbnailUrl}
                className="rounded-[1rem] w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center justify-between bg-icons-bg p-[1rem] rounded-[0.5rem] cursor-pointer mt-[1rem] text-shadow-dark"
          )}
          onClick={toggleDescription}
        >
          <p>Mô tả</p>
          {description ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </div>

        {description && (
          <div className={cn("p-[0.1rem_1rem] mt-2 text-[1rem]")}>
            <p>{nft.description}</p>
          </div>
        )}

        <div
          className={cn(
            "flex items-center justify-between bg-icons-bg p-[1rem] rounded-[0.5rem] cursor-pointer mt-[1rem] text-shadow-dark"
          )}
          onClick={toggleDetails}
        >
          <p>Chi tiết</p>
          {details ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </div>

        {details && (
          <div className={cn("p-[0.1rem_1rem] mt-2 text-[1rem]")}>
            <small> {nft.description} 
              <br />
               {nft.properties?.duration} {nft.mediaType} ({nft.properties?.fileSize})</small>
            <p>
              <small>Địa chỉ người bán</small>
              <br />
              {nft.seller}
            </p>
            <p>
              <small>ID Token</small>
              &nbsp;&nbsp;{nft.tokenId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTDetailsImg;

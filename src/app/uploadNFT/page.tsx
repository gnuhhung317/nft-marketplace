'use client'
import React, { useContext } from "react";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import { cn } from "@/lib/utils";
import UploadNFT from "./UloadNFT";

const UploadNFTComponent = () => {
  const { createNFT, uploadToPinata, accountBalance, gasEstimate, getListingPrice } = useContext(NFTMarketplaceContext)!;

  return (
    <div className={cn("w-full my-32")}>
      <div className={cn("xl:w-3/5 lg:w-4/5 w-full mx-auto")}>
        <div className={cn("border-b border-shadow-dark")}>
          <h1 className={cn("text-4xl leading-none")}>Tạo NFT Mới</h1>
          <p className={cn("text-lg leading-snug w-7/10 py-4")}>
            Bạn có thể đặt tên hiển thị ưa thích, tạo URL hồ sơ và quản lý các cài đặt cá nhân khác.
          </p>
        </div>

        <div className={cn("border-b border-shadow-dark mt-8")}>
          <h2 className={cn("text-3xl leading-none")}>Hình ảnh, Video, Âm thanh</h2>
          <p className={cn("text-lg font-medium py-4")}>
            Các định dạng tệp được hỗ trợ: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Kích thước tối đa: 100 MB
          </p>
        </div>

        <div>
          <UploadNFT
            createNFT={createNFT}
            uploadToPinata={uploadToPinata}
            accountBalance={accountBalance}
            gasEstimate={gasEstimate}
            getListingPrice={getListingPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadNFTComponent;

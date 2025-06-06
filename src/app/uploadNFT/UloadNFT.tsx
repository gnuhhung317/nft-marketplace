"use client";

import React, { useState } from "react";
import { MdOutlineHttp } from "react-icons/md";
import { FaPercent } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NFTMarketplaceContextType } from "@/Context/NFTMarketplaceContext";
import DropZone from "./DropZone";
import { IconInput } from "@/components/IconInput";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import { CATEGORIES } from "@/constants/categories";
import { MediaType, INFTMetadata } from "@/types/nft";
import MediaPreview from "@/components/MediaPreview";
import CreateNFTConfirmationModal from "@/components/CreateNFTConfirmationModal";
import { ethers } from "ethers";

// Hàm xác định mediaType từ file extension
const getMediaTypeFromFile = (file: File): MediaType => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    // Image types
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return MediaType.IMAGE;
    
    // Video types
    case 'mp4':
    case 'webm':
    case 'mov':
    case 'avi':
      return MediaType.VIDEO;
    
    // Audio types
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'm4a':
      return MediaType.AUDIO;
    
    default:
      return MediaType.IMAGE; // Default to IMAGE if unknown
  }
};

const UploadNFT: React.FC<
  Pick<NFTMarketplaceContextType, "createNFT" | "uploadToPinata" | "accountBalance" | "gasEstimate" | "getListingPrice">
> = ({ createNFT, uploadToPinata, accountBalance, gasEstimate ,getListingPrice}) => {
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(0);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [category, setCategory] = useState("");
  const [properties, setProperties] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [listingFee, setListingFee] = useState("0");
  const router = useRouter();

  const handlePreview = () => {
    if (!mediaUrl || !mediaType) {
      alert("Vui lòng upload file trước khi xem trước");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFileUpload = async (file: File) => {
    try {
      const mediaType = getMediaTypeFromFile(file);
      setMediaType(mediaType);
      
      const url = await uploadToPinata(file);
      if (url) {
        setMediaUrl(url);
        
        // Nếu là video, tạo thumbnail từ frame đầu tiên
        if (mediaType === MediaType.VIDEO) {
          const video = document.createElement('video');
          video.src = URL.createObjectURL(file);
          video.onloadeddata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0);
              canvas.toBlob(async (blob) => {
                if (blob) {
                  const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
                  const thumbnailUrl = await uploadToPinata(thumbnailFile);
                  if (thumbnailUrl) {
                    setThumbnailUrl(thumbnailUrl);
                  }
                }
              }, 'image/jpeg');
            }
          };
        }
      }
    } catch (error) {
      console.error("Lỗi khi upload file:", error);
      alert("Có lỗi xảy ra khi upload file");
    }
  };

  const handleCreateNFT = async () => {
    if (!mediaType || !mediaUrl) {
      alert("Vui lòng upload file trước khi tạo NFT");
      return;
    }

    if (!name || !description || !price || !category) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const metadata: INFTMetadata = {
      name,
      price,
      mediaUrl,
      description,
      category,
      mediaType,
      thumbnailUrl: thumbnailUrl || undefined,
      properties: {
        fileSize,
        ...(properties ? { properties } : {}),
      },
    };

    const listingPrice = await getListingPrice();
    setListingFee(ethers.utils.formatEther(listingPrice));
    // Show confirmation modal
    setShowConfirmation(true);
  };

  const handleConfirmCreate = async () => {
    const metadata: INFTMetadata = {
      name,
      price,
      mediaUrl,
      description,
      category,
      mediaType: mediaType!,
      thumbnailUrl: thumbnailUrl || undefined,
      properties: {
        fileSize,
        ...(properties ? { properties } : {}),
      },
    };

    await createNFT({
      ...metadata,
      router,
    });
    setShowConfirmation(false);
  };

  return (
    <div className={cn("p-4")}>
      {/* Hiển thị balance */}
      <div className={cn("mb-4 p-4 border border-icons rounded-xl")}>
        <p className="font-bold text-xl">Số dư tài khoản:</p>
        <p className="text-lg">{accountBalance} ETH</p>
      </div>

      <DropZone
        title="JPG, PNG, WEBM, MP4, WAV, MP3, TỐI ĐA 100MB"
        heading="Kéo và thả tệp"
        subHeading="hoặc Duyệt phương tiện trên thiết bị của bạn"
        name={name}
        website={website}
        description={description}
        fileSize={fileSize}
        category={category}
        properties={properties}
        setImage={setMediaUrl}
        uploadToPinata={uploadToPinata}
        setName={setName}
        setFileSize={setFileSize}
        onFileUpload={handleFileUpload}
      />
      <div className={cn("flex flex-col gap-4")}>
        {/* Text inputs for item name, website, description */}
        <div className={cn("flex flex-col gap-2")}>
          <label htmlFor="nft" className="font-bold text-xl">
            Tên Mục
          </label>
          <input
            type="text"
            placeholder="Nhập tên mục"
            value={name}
            className={cn(
              "w-full bg-transparent outline-none rounded-xl p-4 border border-icons"
            )}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={cn("mt-8")}>
          <label
            htmlFor="website"
            className={cn("block w-full mb-2 font-bold text-xl")}
          >
            Website
          </label>
          <div
            className={cn(
              "w-full border border-icons rounded-xl flex items-center gap-4 overflow-hidden"
            )}
          >
            <div
              className={cn(
                "text-2xl bg-icons p-2 px-4 text-main-bg grid cursor-pointer"
              )}
            >
              <MdOutlineHttp className="text-4xl" />
            </div>
            <input
              type="text"
              placeholder="website"
              onChange={(e) => setWebsite(e.target.value)}
              className={cn("w-[90%] bg-transparent border-0 outline-none")}
            />
          </div>
        </div>
        <div className={cn("flex flex-col gap-2")}>
          <label htmlFor="description" className="font-bold text-xl">
            Mô Tả
          </label>
          <textarea
            cols={30}
            rows={6}
            placeholder="Mô tả mục của bạn"
            className={cn(
              "w-full bg-transparent outline-none rounded-xl p-4 border border-icons"
            )}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Categories grid */}
        <div className={cn("grid grid-cols-2 xl:grid-cols-3 gap-4")}>
          {CATEGORIES.map((el, i) => (
            <div
              key={el.id}
              className={cn(
                "border border-icons rounded-lg p-4 cursor-pointer",
                active === i + 1 && "bg-icons text-main-bg"
              )}
              onClick={() => {
                setActive(i + 1);
                setCategory(el.id);
              }}
            >
              <div className={cn("flex items-center justify-between")}>
                <Image
                  src={el.image}
                  alt={el.name}
                  width={70}
                  height={70}
                  className={cn("rounded-full")}
                />
                <div
                  className={cn(
                    "bg-icons text-main-bg rounded-full p-1 grid place-items-center"
                  )}
                >
                  <TiTick />
                </div>
              </div>
              <p className={cn("text-lg font-bold leading-snug")}>
                {el.name}
              </p>
              <p className={cn("text-sm text-icons/70")}>
                {el.description}
              </p>
            </div>
          ))}
        </div>
        <div>
          <IconInput
            value={fileSize}
            label="Kích thước"
            placeholder="Nhập kích thước tệp"
            onChange={(e) => setFileSize(e.target.value)}
            icon={<FaPercent className="text-4xl p-3" />}
          />
          <IconInput
            label="Thuộc tính"
            placeholder="Nhập thuộc tính"
            onChange={(e) => setProperties(e.target.value)}
            icon={<FaPercent className="text-4xl p-3" />}
          />
          <IconInput
            label="Giá"
            placeholder="Nhập Giá"
            onChange={(e) => setPrice(e.target.value)}
            icon={<FaPercent className="text-4xl p-3" />}
          />
        </div>
        <div className={cn("grid grid-cols-[repeat(2,1fr)] gap-8")}>
          <Button
            onClick={handleCreateNFT}
            className={cn("w-full grid self-center text-[1.3rem]")}
          >
            Tải lên
          </Button>
          <Button
            onClick={handlePreview}
            className={cn("w-full grid self-center text-[1.3rem]")}
          >
            Xem trước
          </Button>
        </div>
      </div>

      {/* Modal xem trước */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Xem trước NFT"
        >
          <div className={cn("p-4 max-h-[80vh] overflow-y-auto")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phần preview media */}
              <div className="w-full">
                <h2 className="text-2xl font-bold mb-4 break-words">{name || "Chưa có tên"}</h2>
                {mediaUrl && mediaType && (
                  <div className="aspect-square">
                    <MediaPreview
                      mediaType={mediaType}
                      mediaUrl={mediaUrl}
                      thumbnailUrl={thumbnailUrl}
                      className="rounded-lg w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Phần thông tin */}
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <div className="break-words">
                    <p className="font-bold">Mô tả:</p>
                    <p className="whitespace-pre-wrap">{description || "Chưa có mô tả"}</p>
                  </div>
                  <div className="break-words">
                    <p className="font-bold">Giá:</p>
                    <p>{price ? `${price} ETH` : "Chưa có giá"}</p>
                  </div>
                  <div className="break-words">
                    <p className="font-bold">Danh mục:</p>
                    <p>{category || "Chưa chọn danh mục"}</p>
                  </div>
                  {fileSize && (
                    <div className="break-words">
                      <p className="font-bold">Kích thước:</p>
                      <p>{fileSize}</p>
                    </div>
                  )}
                  {properties && (
                    <div className="break-words">
                      <p className="font-bold">Thuộc tính:</p>
                      <p className="whitespace-pre-wrap">{properties}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {showConfirmation && (
        <CreateNFTConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmCreate}
          metadata={{
            name,
            price,
            mediaUrl,
            description,
            category,
            mediaType: mediaType!,
            thumbnailUrl: thumbnailUrl || undefined,
            properties: {
              fileSize,
              ...(properties ? { properties } : {}),
            },
          }}
          listingFee={listingFee}
          gasEstimate={gasEstimate}
          userBalance={accountBalance}
        />
      )}
    </div>
  );
};

export default UploadNFT;

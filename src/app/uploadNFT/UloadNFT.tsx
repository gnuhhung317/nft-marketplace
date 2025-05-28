"use client";

import React, { useState } from "react";
import { MdOutlineHttp, MdOutlineAttachFile } from "react-icons/md";
import { FaPercent } from "react-icons/fa";
import { AiTwotonePropertySafety } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import images from "@/img";
import type { NFTMarketplaceContextType } from "@/Context/NFTMarketplaceContext";
import DropZone from "./DropZone";
import { IconInput } from "@/components/IconInput";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";

const UploadNFT: React.FC<
  Pick<NFTMarketplaceContextType, "createNFT" | "uploadToPinata">
> = ({ createNFT, uploadToPinata }) => {
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(0);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [royalties, setRoyalties] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [category, setCategory] = useState("");
  const [properties, setProperties] = useState("");
  const [image, setImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const categoryArray = [
    {
      image: images.nft_image_1,
      category: "Thể Thao",
    },
    {
      image: images.nft_image_2,
      category: "Nghệ Thuật",
    },
    {
      image: images.nft_image_3,
      category: "Âm Nhạc",
    },
    {
      image: images.nft_image_1,
      category: "Kỹ Thuật Số",
    },
    // {
    //   image: images.nft_image_2,
    //   category: "Thời Gian",
    // },
    {
      image: images.nft_image_3,
      category: "Nhiếp Ảnh",
    },
  ]; // Mảng ví dụ cho mục đích minh họa

  const handlePreview = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={cn("p-4")}>
      <DropZone
        title="JPG, PNG, WEBM , TỐI ĐA 100MB"
        heading="Kéo và thả tệp"
        subHeading="hoặc Duyệt phương tiện trên thiết bị của bạn"
        name={name}
        website={website}
        description={description}
        royalties={royalties}
        fileSize={fileSize}
        category={category}
        properties={properties}
        setImage={setImage}
        uploadToPinata={uploadToPinata}
        setName={setName}
        setFileSize={setFileSize} // Pass the existing setFileSize
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

        {/* Slider for categories */}
        <div className={cn("grid grid-cols-2 xl:grid-cols-3 gap-4")}>
          {categoryArray.map((el, i) => (
            <div
              key={i}
              className={cn(
                "border border-icons rounded-lg p-4 cursor-pointer",
                active === i + 1 && "bg-icons text-main-bg"
              )}
              onClick={() => {
                setActive(i + 1);
                setCategory(el.category);
              }}
            >
              <div className={cn("flex items-center justify-between")}>
                <Image
                  src={el.image}
                  alt="hình ảnh nền"
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
                Crypto Legend - {el.category}
              </p>
            </div>
          ))}
        </div>
        <div>
          <IconInput
            label="Royalty"
            placeholder="Nhập tỷ lệ phần trăm royalty"
            onChange={(e) => setRoyalties(e.target.value)}
            icon={<FaPercent className="text-4xl p-3" />}
          ></IconInput>

          <IconInput

            value={fileSize}
            label="Kích thước"
            placeholder="Nhập kích thước tệp"
            onChange={(e) => setFileSize(e.target.value)}
            icon={<FaPercent className="text-4xl p-3" />}
          ></IconInput>
          <IconInput
            label="Thuộc tính"
            placeholder="Nhập thuộc tính"
            onChange={(e) => setProperties(e.target.value)}
            icon={<FaPercent className="text-4xl p-3" />}
          ></IconInput>
          <IconInput
            label="Giá"
            placeholder="Nhập Giá"
            onChange={(e) => setPrice(e.target.value)}
            icon={<FaPercent className="text-4xl p-3" />}
          ></IconInput>
        </div>
        <div className={cn("grid grid-cols-[repeat(2,1fr)] gap-8")}>
          <Button
            onClick={async () =>
              createNFT({
                name,
                price,
                image,
                description,
                router,
              })
            }
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

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Connect to Dragon Wallet">
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 mb-6 rounded-lg overflow-hidden border border-icons shadow-custom">
            {image ? (
              <img
                src={image}
                alt="NFT Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-shadow-dark/20 flex items-center justify-center text-icons/50">
                No Image
              </div>
            )}
          </div>

          <div className="w-full space-y-3 text-primary">
            <div className="grid grid-cols-[100px_1fr] items-center border-b border-icons/30 pb-2">
              <span className="font-medium">Tên:</span>
              <span>{name || "—"}</span>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center border-b border-icons/30 pb-2">
              <span className="font-medium">Giá:</span>
              <span>{price || "—"}</span>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center border-b border-icons/30 pb-2">
              <span className="font-medium">Danh mục:</span>
              <span>{category || "—"}</span>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center border-b border-icons/30 pb-2">
              <span className="font-medium">Royalty:</span>
              <span>{royalties || "—"}</span>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center border-b border-icons/30 pb-2">
              <span className="font-medium">Kích thước:</span>
              <span>{fileSize || "—"}</span>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center border-b border-icons/30 pb-2">
              <span className="font-medium">Thuộc tính:</span>
              <span>{properties || "—"}</span>
            </div>

            {description && (
              <div className="pt-2">
                <div className="font-medium mb-1">Mô tả:</div>
                <p className="text-sm text-primary/80 bg-shadow-dark/10 p-3 rounded-md">{description}</p>
              </div>
            )}
          </div>

          <div className="mt-6 w-full flex justify-end">
            <Button onClick={closeModal} className="bg-icons text-main-bg hover:bg-main-bg hover:text-icons hover:border-icons border">
              Đóng
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default UploadNFT;

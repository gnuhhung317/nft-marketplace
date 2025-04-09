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
import { TNFTMarketplaceContextType } from "@/Context/NFTMarketplaceContext";
import DropZone from "./DropZone";
import { IconInput } from "@/components/IconInput";
import { Button } from "@/components/ui/button";

const UploadNFT: React.FC<
  Pick<TNFTMarketplaceContextType, "createNFT" | "uploadToPinata">
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
    {
      image: images.nft_image_2,
      category: "Thời Gian",
    },
    {
      image: images.nft_image_3,
      category: "Nhiếp Ảnh",
    },
  ]; // Mảng ví dụ cho mục đích minh họa

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
            onClick={() => {}}
            className={cn("w-full grid self-center text-[1.3rem]")}
          >
            Xem trước
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadNFT;

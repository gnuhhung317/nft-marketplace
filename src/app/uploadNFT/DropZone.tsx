import React, { useState, useCallback, Dispatch, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TNFTMarketplaceContextType } from "@/Context/NFTMarketplaceContext";
import images from "@/img";

type TDropZone = {
  title: string;
  heading: string;
  subHeading: string;
  name: string;
  website: string;
  description: string;
  royalties: string;
  fileSize: string;
  category: string;
  properties: string;
  uploadToPinata: TNFTMarketplaceContextType["uploadToPinata"];
  setImage: Dispatch<SetStateAction<string>>;
  setName: Dispatch<SetStateAction<string>>;
  setFileSize: Dispatch<SetStateAction<string>>;
};

const DropZone = ({
  title,
  heading,
  subHeading,
  name,
  website,
  description,
  royalties,
  fileSize,
  category,
  properties,
  uploadToPinata,
  setImage,
  setName,
  setFileSize,
}: TDropZone) => {
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(-1);
  // const [fileSize, setFileSize] = useState("");
  
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setLoading(1);
        const file = acceptedFiles[0];
        const url = await uploadToPinata(file);
        setFileUrl(url!);
        setImage(url!);
        setName(file.name);
        setFileSize((file.size / 1024).toFixed(2) + " KB");
        setLoading(0);
      } catch (error) {
        setLoading(-1);
      }
    },
    [setImage, uploadToPinata]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { image: ["*"] },
    maxSize: 100000000, // 100MB max size
  });

  return (
    <div className={cn("w-full my-12")}>
      {loading === -1 && (
        <div
          className={cn(
            "mx-auto w-full border-4 border-dotted border-icons rounded-xl text-center p-4 cursor-pointer"
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p className={cn("text-2xl font-bold")}>{title}</p>
          <Image
            src={images.upload}
            alt="Biểu tượng tải lên"
            width={100}
            height={100}
            className={cn("rounded-lg m-auto my-4")}
          />
          <p className={cn("text-xl")}>{heading}</p>
          <p className={cn("text-lg")}>{subHeading}</p>
        </div>
      )}
      {loading !== -1 && (
        <div
          className={cn(
            "mt-12 border-2 border-dotted border-icons rounded-md p-8"
          )}
        >
          <div className={cn("grid grid-cols-2 gap-12")}>
            <Image
              src={fileUrl || images.upload}
              alt="Xem trước NFT"
              width={150}
              height={150}
              className={cn("col-span-1 object-cover")}
              blurDataURL={images.upload}
            />
            <div className={cn("col-span-1 space-y-4")}>
              <p className={cn("text-2xl font-bold")}>
                Tên tệp: {name || "N/A"}
              </p>
              <p className={cn("text-xl")}>Kích thước tệp: {fileSize || "N/A"}</p>
              <p className={cn("text-2xl font-bold")}>
                Tên NFT: {name || "N/A"}
              </p>
              <p className={cn("text-2xl font-bold")}>
                Website: {website || "N/A"}
              </p>
              <p className={cn("text-xl")}>
                Mô tả: {description || "N/A"}
              </p>
              <p className={cn("text-xl")}>Royalty: {royalties || "N/A"}</p>
              <p className={cn("text-xl")}>Thuộc tính: {properties || "N/A"}</p>
              <p className={cn("text-xl")}>Danh mục: {category || "N/A"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;

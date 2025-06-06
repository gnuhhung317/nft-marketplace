import React, { useState, useCallback, Dispatch, SetStateAction, useDebugValue } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NFTMarketplaceContextType } from "@/Context/NFTMarketplaceContext";
import images from "@/img";
import { MediaType } from "@/types/nft";

type DropZoneProps = {
  title: string;
  heading: string;
  subHeading: string;
  name: string;
  website: string;
  description: string;
  fileSize: string;
  category: string;
  properties: string;
  setImage: (url: string) => void;
  uploadToPinata: (file: File) => Promise<string | undefined>;
  setName: (name: string) => void;
  setFileSize: (size: string) => void;
  onFileUpload?: (file: File) => Promise<void>;
};

const DropZone: React.FC<DropZoneProps> = ({
  title,
  heading,
  subHeading,
  name,
  website,
  description,
  fileSize,
  category,
  properties,
  setImage,
  uploadToPinata,
  setName,
  setFileSize,
  onFileUpload
}) => {
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(-1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log("acceptedFiles", acceptedFiles);
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        setLoading(0);
        
        // Cập nhật tên file và kích thước
        setName(file.name);
        setFileSize(formatFileSize(file.size));
        
        // Xác định loại media
        const extension = file.name.split('.').pop()?.toLowerCase();
        let type: MediaType = MediaType.IMAGE;
        
        if (['mp4', 'webm', 'mov', 'avi'].includes(extension || '')) {
          type = MediaType.VIDEO;
        } else if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension || '')) {
          type = MediaType.AUDIO;
        }
        setMediaType(type);
        
        // Tạo URL preview cho file
        const previewUrl = URL.createObjectURL(file);
        setFileUrl(previewUrl);

        if (onFileUpload) {
          await onFileUpload(file);
        } else {
          const url = await uploadToPinata(file);
          if (url) {
            setImage(url);
          }
        }
      }
    },
    [setImage, uploadToPinata, onFileUpload, setName, setFileSize]
  );

  // Hàm format kích thước file
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov', '.avi'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a']
    },
    maxSize: 100000000, // 100MB max size
  });

  const renderPreview = () => {
    if (!selectedFile || !fileUrl) return null;

    switch (mediaType) {
      case MediaType.VIDEO:
        return (
          <video
            src={fileUrl}
            controls
            className={cn("w-full h-full object-cover rounded-lg")}
          >
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        );
      case MediaType.AUDIO:
        return (
          <div className={cn("w-full h-full flex items-center justify-center bg-shadow-dark/20 rounded-lg")}>
            <audio
              src={fileUrl}
              controls
              className="w-full max-w-md"
            >
              Trình duyệt của bạn không hỗ trợ audio.
            </audio>
          </div>
        );
      default:
        return (
          <Image
            src={fileUrl}
            alt="Xem trước NFT"
            width={300}
            height={300}
            className={cn("object-cover rounded-lg")}
          />
        );
    }
  };

  return (
    <div className={cn("w-full my-12")}>
      {!selectedFile && (
        <div
          className={cn(
            "mx-auto w-full border-4 border-dotted border-icons rounded-xl text-center p-4 cursor-pointer"
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p className={cn("text-2xl font-bold break-words")}>{title}</p>
          <Image
            src={images.upload}
            alt="Biểu tượng tải lên"
            width={100}
            height={100}
            className={cn("rounded-lg m-auto my-4")}
          />
          <p className={cn("text-xl break-words")}>{heading}</p>
          <p className={cn("text-lg break-words")}>{subHeading}</p>
        </div>
      )}
      {selectedFile && (
        <div
          className={cn(
            "mt-12 border-2 border-dotted border-icons rounded-md p-8"
          )}
        >
          <div className={cn("grid grid-cols-2 gap-8")}>
            <div className={cn("col-span-1")}>
              {renderPreview()}
            </div>
            <div className={cn("col-span-1 space-y-4")}>
              <div className="flex flex-col">
                <p className={cn("text-2xl font-bold break-words")}>
                  Tên tệp:
                </p>
                <p className={cn("text-xl break-words text-primary/80")}>
                  {selectedFile.name}
                </p>
              </div>
              <div className="flex flex-col">
                <p className={cn("text-xl break-words")}>
                  Kích thước tệp: {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <div className="flex flex-col">
                <p className={cn("text-2xl font-bold break-words")}>
                  Tên NFT:
                </p>
                <p className={cn("text-xl break-words text-primary/80")}>
                  {name || "N/A"}
                </p>
              </div>
              <div className="flex flex-col">
                <p className={cn("text-2xl font-bold break-words")}>
                  Website:
                </p>
                <p className={cn("text-xl break-words text-primary/80")}>
                  {website || "N/A"}
                </p>
              </div>
              <div className="flex flex-col">
                <p className={cn("text-xl break-words")}>
                  Mô tả:
                </p>
                <p className={cn("text-lg break-words text-primary/80")}>
                  {description || "N/A"}
                </p>
              </div>
              <div className="flex flex-col">
                <p className={cn("text-xl break-words")}>
                  Thuộc tính:
                </p>
                <p className={cn("text-lg break-words text-primary/80")}>
                  {properties || "N/A"}
                </p>
              </div>
              <div className="flex flex-col">
                <p className={cn("text-xl break-words")}>
                  Danh mục:
                </p>
                <p className={cn("text-lg break-words text-primary/80")}>
                  {category || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;

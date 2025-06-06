'use client'
import React, { useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { cn } from "@/lib/utils";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MediaPreview from "@/components/MediaPreview";
import { MediaType } from "@/types/nft";

const ReSellToken = () => {
  const { createSale } = useContext(NFTMarketplaceContext)!;
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.IMAGE);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>();
  const [price, setPrice] = useState("");
  const [id, setId] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setPrice(searchParams.get('price')!);
    setId(searchParams.get('id')!);
    setTokenURI(searchParams.get('tokenURI')!);
  }, [searchParams]);
  
  const fetchNFT = async () => {
    if (!tokenURI) return;
    const { data } = await axios.get(tokenURI as string);
    setMediaUrl(data.image);
    setMediaType(data.mediaType || MediaType.IMAGE);
    setThumbnailUrl(data.thumbnailUrl);
  };

  useEffect(() => {
    fetchNFT();
  }, [id]);

  const resell = async () => {
    try {
      await createSale(tokenURI as string, price, true, id as string);
      router.push("/author");
    } catch (error) {
      console.log("Lỗi khi bán lại", error);
    }
  };

  return (
    <div className={cn("w-full my-16")}>
      <div className={cn("lg:w-3/5 mx-auto w-full")}>
        <h1 className={cn("text-4xl font-bold")}>Bán lại Token của bạn, Đặt giá</h1>
        <div className={cn("my-4")}>
          <label htmlFor="price" className={cn("block text-lg")}>Giá</label>
          <Input
            type="number"
            min={0.1}
            placeholder="Giá bán lại"
            className={cn("w-full p-2 mt-2 bg-transparent border border-primary")}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            id="price"
          />
        </div>

        <div className={cn("my-16 relative w-full aspect-square")}>
          {mediaUrl && (
            <MediaPreview
              mediaType={mediaType}
              mediaUrl={mediaUrl}
              thumbnailUrl={thumbnailUrl}
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>

        <Button onClick={resell}>Bán lại NFT</Button>
      </div>
    </div>
  );
};

export default ReSellToken;

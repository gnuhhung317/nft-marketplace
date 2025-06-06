'use client'

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import NFTDetailsPage from "../NFTDetailsPage";
import Loader from "@/components/Loader";
import { TMarketItem } from "@/types";

const NFTDetails = () => {
  const params = useParams();
  const tokenId = params.id as string;
  const { fetchNFTByTokenId } = useContext(NFTMarketplaceContext)!;
  const [nft, setNft] = useState<TMarketItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchNFTDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const foundNft = await fetchNFTByTokenId(tokenId);
        
        if (!isMounted) return;

        if (foundNft) {
          setNft(foundNft);
        } else {
          setError("NFT không có trên thị trường");
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin NFT:", error);
        if (isMounted) {
          setError("Có lỗi xảy ra khi tải thông tin NFT");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (tokenId) {
      fetchNFTDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [tokenId]);

  if (loading) {
    return <Loader />;
  }

  if (error || !nft) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Lỗi</h1>
        <p className="text-gray-600">{error || "NFT không có trên thị trường"}</p>
      </div>
    );
  }

  return <NFTDetailsPage nft={nft} />;
};

export default NFTDetails; 
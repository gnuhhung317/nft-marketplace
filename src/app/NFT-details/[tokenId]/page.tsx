'use client'
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import Brand from "@/components/Brand";
import Category from "@/components/Category";
import NFTDetailsPage from "../NFTDetailsPage";
import { TMarketItem } from "@/types";
import Loader from "@/components/Loader";

const NFTDetails = () => {
  const params = useParams();
  const tokenId = params.tokenId as string;
  const { fetchNFTs } = useContext(NFTMarketplaceContext)!;
  const [nft, setNft] = useState<TMarketItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchNFTDetails = async () => {
      try {
        setLoading(true);
        // Fetch all NFTs and find the one with the matching tokenId
        const allNfts = await fetchNFTs();
        if (isMounted) {
          const foundNft = allNfts.find(item => item.tokenId === tokenId);
          if (foundNft) {
            setNft(foundNft);
          }
        }
      } catch (error) {
        console.error("Error fetching NFT details:", error);
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

  if (!nft) {
    return <div className="p-20 text-center">NFT không có trên thị trường</div>;
  }

  return (
    <div>
      <NFTDetailsPage nft={nft} />
      <Category />
      <Brand />
    </div>
  );
};

export default NFTDetails;

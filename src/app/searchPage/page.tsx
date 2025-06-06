'use client'
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import Banner from "@/components/Banner";
import Brand from "@/components/Brand";
import Filter from "@/components/Filter";
import Loader from "@/components/Loader";
import NFTCardTwo from "@/components/NFTCardTwo";
import SearchBar from "@/components/SearchBar";
import Slider from "@/components/Slider";
import images from "@/img";
import { TMarketItem } from "@/types";
import React, { useEffect, useState, useContext } from "react";

const SearchPage = () => {
  const { fetchNFTs, setError, currentAccount } = useContext(
    NFTMarketplaceContext
  )!;
  const [nfts, setNfts] = useState<TMarketItem[]>([]);
  const [nftsCopy, setNftsCopy] = useState<TMarketItem[]>([]);

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        console.log('Bắt đầu tải NFTs...');
        const items = await fetchNFTs();
        console.log('Dữ liệu NFTs nhận được:', items);
        
        if (!items || items.length === 0) {
          console.log('Không có NFT nào được tìm thấy');
          setNfts([]);
          setNftsCopy([]);
          return;
        }

        // Đảm bảo dữ liệu hợp lệ trước khi lưu
        const validItems = items.filter(item => 
          item && 
          item.tokenId && 
          item.name && 
          item.mediaUrl && 
          item.price
        );

        console.log(`Đã lọc được ${validItems.length} NFT hợp lệ`);
        setNfts(validItems);
        setNftsCopy(validItems);
      } catch (error) {
        console.error('Lỗi khi tải NFTs:', error);
        setError("Không thể tải dữ liệu NFT. Vui lòng thử lại sau.");
      }
    };

    loadNFTs();
  }, [fetchNFTs, setError]);

  const onHandleSearch = (value: string) => {
    if (!value.trim()) {
      setNfts(nftsCopy);
      return;
    }

    const searchTerm = value.toLowerCase().trim();
    const filteredNFTS = nftsCopy.filter(({ name }) =>
      name.toLowerCase().includes(searchTerm)
    );

    setNfts(filteredNFTS);
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  return (
    <div >
      <Banner bannerImage={images.creatorbackground2} />
      <SearchBar
        onHandleSearch={onHandleSearch}
        onClearSearch={onClearSearch}
      />
      <Filter />
      {nfts.length == 0 ? <Loader /> : <NFTCardTwo NFTs={nfts} />}
      <Slider />
      <Brand />
    </div>
  );
};

export default SearchPage;

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
    try {
      // if (currentAccount) {
        console.log('fetchNFTS')
      fetchNFTs().then((items: TMarketItem[]) => {
        console.log(items);
        setNfts(items?.reverse());
        setNftsCopy(items);
      }).catch((reason)=>{
        console.log(reason)
      });
      // }
    } catch (error) {
      setError("Please reload the browser");
    }
  }, []);

  const onHandleSearch = (value: string) => {
    const filteredNFTS = nfts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );
    if (filteredNFTS.length === 0) {
      setNfts(nftsCopy);
    } else {
      setNfts(filteredNFTS);
    }
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

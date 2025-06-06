'use client'
import React, { useState, useEffect } from 'react';
import {
  FaFilter,
  FaAngleDown,
  FaAngleUp,
  FaWallet,
  FaMusic,
  FaVideo,
  FaImages,
  FaUserAlt,
} from 'react-icons/fa';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdVerified } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import { Button } from './ui/button';
import { CATEGORIES } from '@/constants/categories';
import { useRouter, useSearchParams } from 'next/navigation';
import { TMarketItem } from '@/types';
import { MediaType } from '@/types/nft';
import { Input } from '@/components/ui/input';

interface FilterProps {
  nfts: TMarketItem[];
  onFilterChange: (filteredNFTs: TMarketItem[]) => void;
}

const Filter: React.FC<FilterProps> = ({ nfts, onFilterChange }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState(true);
  const [image, setImage] = useState(true);
  const [video, setVideo] = useState(true);
  const [music, setMusic] = useState(true);
  const [noNFTs, setNoNFTs] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const currentCategory = searchParams.get('category') || '';

  const toggleFilter = () => setFilter(!filter);
  const toggleImage = () => setImage(!image);
  const toggleVideo = () => setVideo(!video);
  const toggleMusic = () => setMusic(!music);
  const togglePriceFilter = () => setShowPriceFilter(!showPriceFilter);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
  };

  const applyFilters = () => {
    let filteredNFTs = nfts;

    // Lọc theo category
    if (currentCategory) {
      filteredNFTs = filteredNFTs.filter(nft => nft.category === currentCategory);
    }

    // Lọc theo thể loại media
    if (!image || !video || !music) {
      filteredNFTs = filteredNFTs.filter(nft => {
        // Nếu media type được chọn (true) thì giữ lại NFT có media type đó
        if (image && nft.mediaType === MediaType.IMAGE) return true;
        if (video && nft.mediaType === MediaType.VIDEO) return true;
        if (music && nft.mediaType === MediaType.AUDIO) return true;
        return false;
      });
    }

    // Lọc theo giá
    if (minPrice || maxPrice) {
      filteredNFTs = filteredNFTs.filter(nft => {
        const price = parseFloat(nft.price);
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }

    setNoNFTs(filteredNFTs.length === 0);
    onFilterChange(filteredNFTs);
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`?${params.toString()}`, { scroll: false });
    applyFilters();
  };

  // Áp dụng filter khi media type thay đổi
  useEffect(() => {
    applyFilters();
  }, [image, video, music]);

  // Áp dụng filter khi giá thay đổi
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [minPrice, maxPrice]);

  return (
    <div className="py-16 w-full">
      <div className="w-4/5tt mx-auto flex sm:flex-row flex-col  justify-between items-center pb-16">
        <div className="flex flex-wrap w-full  gap-8">
          <Button 
            className={`bg-main-bg text-icons font-semibold py-4 px-6 rounded-full border border-main-bg hover:border-icons hover:text-icons hover:shadow-custom transition-all duration-300 cursor-pointer ${
              !currentCategory ? 'bg-icons text-main-bg' : ''
            }`}
            onClick={() => handleCategoryChange('')}
          >
            Tất cả
          </Button>
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              className={`bg-main-bg text-icons font-semibold py-4 px-6 rounded-full border border-main-bg hover:border-icons hover:text-icons hover:shadow-custom transition-all duration-300 cursor-pointer ${
                currentCategory === category.id ? 'bg-icons text-main-bg' : ''
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="border-icons mt-12 sm:mt-2 border px-8 py-4 rounded-full flex items-center gap-4 cursor-pointer shadow-md"
          onClick={toggleFilter}>
          <FaFilter />
          <span>Bộ Lọc</span>
          {filter ? <FaAngleDown /> : <FaAngleUp />}
        </div>
      </div>

      {filter && (
        <div className="w-4/5tt mx-auto flex flex-col gap-8 border-t border-icons-light py-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2 items-center border border-icons p-4 rounded-full cursor-pointer"
              onClick={toggleImage}>
              <FaImages /> <small>Hình Ảnh</small>
              {image ? <TiTick /> : <AiFillCloseCircle />}
            </div>
            <div className="flex gap-2 items-center border border-icons p-4 rounded-full cursor-pointer"
              onClick={toggleVideo}>
              <FaVideo /> <small>Video</small>
              {video ? <TiTick /> : <AiFillCloseCircle />}
            </div>
            <div className="flex gap-2 items-center border border-icons p-4 rounded-full cursor-pointer"
              onClick={toggleMusic}>
              <FaMusic /> <small>Âm Nhạc</small>
              {music ? <TiTick /> : <AiFillCloseCircle />}
            </div>
            <div 
              className={`flex gap-2 items-center border border-icons p-4 rounded-full cursor-pointer transition-all duration-300 ${
                showPriceFilter ? 'bg-icons text-main-bg' : ''
              }`}
              onClick={togglePriceFilter}
            >
              <FaWallet /> <small>Giá</small>
              {showPriceFilter ? <TiTick /> : <AiFillCloseCircle />}
            </div>
          </div>

          {showPriceFilter && (
            <div className="flex items-center gap-4 bg-main-bg/50 p-4 rounded-lg border border-icons-light">
              <Input
                type="number"
                value={minPrice}
                onChange={handleMinPriceChange}
                placeholder="Giá tối thiểu"
                className="w-32 bg-main-bg border-icons text-icons placeholder:text-icons/50"
              />
              <span className="text-icons">-</span>
              <Input
                type="number"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                placeholder="Giá tối đa"
                className="w-32 bg-main-bg border-icons text-icons placeholder:text-icons/50"
              />
              <span className="text-icons">ETH</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Filter;

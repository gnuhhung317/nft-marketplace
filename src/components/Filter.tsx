'use client'
import React, { useState } from 'react';
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

const Filter: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState(true);
  const [image, setImage] = useState(true);
  const [video, setVideo] = useState(true);
  const [music, setMusic] = useState(true);

  const currentCategory = searchParams.get('category') || '';

  const toggleFilter = () => setFilter(!filter);
  const toggleImage = () => setImage(!image);
  const toggleVideo = () => setVideo(!video);
  const toggleMusic = () => setMusic(!music);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`?${params.toString()}`);
  };

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
        <div className="w-4/5tt mx-auto flex flex-wrap gap-4 border-t border-icons-light py-8">
          <div className="flex gap-2 items-center bg-icons text-main-bg p-4 rounded-full cursor-pointer">
            <FaWallet /> <span>10 ETH</span> <AiFillCloseCircle />
          </div>
          <div className="flex gap-2 items-center border border-icons p-4 rounded-full cursor-pointer"
            onClick={toggleImage}>
            <FaImages /> <small>Hình Ảnh</small>
            {image ? <AiFillCloseCircle /> : <TiTick />}
          </div>
          <div className="flex gap-2 items-center border border-icons p-4 rounded-full cursor-pointer"
            onClick={toggleVideo}>
            <FaVideo /> <small>Video</small>
            {video ? <AiFillCloseCircle /> : <TiTick />}
          </div>
          <div className="flex gap-2 items-center border border-icons p-4 rounded-full cursor-pointer"
            onClick={toggleMusic}>
            <FaMusic /> <small>Âm Nhạc</small>
            {music ? <AiFillCloseCircle /> : <TiTick />}
          </div>
          <div className="flex gap-2 items-center bg-icons text-main-bg p-4 rounded-full cursor-pointer">
            <FaUserAlt /> <span>Đã Xác Minh</span> <MdVerified />
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;

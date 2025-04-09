import React from 'react';
import Image from 'next/image';
import { BsCircleFill } from 'react-icons/bs';
import images from "@/img";

const CategoryArray = [
  {
    images: images.creatorbackground1,
    name: "Nhảy Múa",
  },
  {
    images: images.creatorbackground2,
    name: "Thể Thao",
  },
  {
    images: images.creatorbackground3,
    name: "Nghệ Thuật Giải Trí",
  },
  {
    images: images.creatorbackground4,
    name: "Thời Gian Cuộc Sống",
  },
  {
    images: images.creatorbackground5,
    name: "Nghệ Thuật Động Vật",
  },
  {
    images: images.creatorbackground6,
    name: "Âm Nhạc",
  },
  {
    images: images.creatorbackground7,
    name: "Nghệ Thuật Kỹ Thuật Số",
  },
  {
    images: images.creatorbackground8,
    name: "Sở Thích",
  },
  {
    images: images.creatorbackground8,
    name: "Nghệ Thuật Xấu",
  },
  {
    images: images.creatorbackground9,
    name: "Nghệ Thuật",
  },
  {
    images: images.creatorbackground10,
    name: "Yêu Thích Của Tôi",
  },
];

const Category: React.FC = () => {
  return (
    <div className="w-4/5tt mx-auto md:w-11/12tt">
      <div className="py-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {CategoryArray.map((el, i) => (
          <div className="relative overflow-hidden rounded-lg cursor-pointer p-4 transition-all duration-300 hover:shadow-custom" key={i}>
            <Image
              src={el.images}
              alt="Hình ảnh nền"
              width={350}
              height={150}
              className="rounded-lg object-cover w-full h-32"
            />
            <div className="flex items-center p-4 gap-4">
              <span className="text-3xl mt-4"><BsCircleFill /></span>
              <div>
                <h4>{el.name}</h4>
                <small>{i + 1}995 NFTS</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;

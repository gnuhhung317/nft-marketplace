import { StaticImageData } from "next/image";
import images from "@/img";

export interface ICategory {
  id: string;
  name: string;
  image: string;
  description: string;
}

export const CATEGORIES: ICategory[] = [
  {
    id: "sports",
    name: "Thể Thao",
    image: images.nft_image_1,
    description: "NFT liên quan đến thể thao, vận động viên, và các sự kiện thể thao"
  },
  {
    id: "art",
    name: "Nghệ Thuật",
    image: images.nft_image_2,
    description: "NFT nghệ thuật số, tranh vẽ, và các tác phẩm sáng tạo"
  },
  {
    id: "music",
    name: "Âm Nhạc",
    image: images.nft_image_3,
    description: "NFT âm nhạc, album, và các tác phẩm âm thanh"
  },
  {
    id: "digital",
    name: "Kỹ Thuật Số",
    image: images.nft_image_1,
    description: "NFT công nghệ số, phần mềm, và các sản phẩm kỹ thuật số"
  },
  {
    id: "photography",
    name: "Nhiếp Ảnh",
    image: images.nft_image_3,
    description: "NFT nhiếp ảnh, hình ảnh, và các tác phẩm nhiếp ảnh"
  }
];

export const getCategoryById = (id: string): ICategory | undefined => {
  return CATEGORIES.find(category => category.id === id);
};

export const getCategoryByName = (name: string): ICategory | undefined => {
  return CATEGORIES.find(category => category.name === name);
}; 
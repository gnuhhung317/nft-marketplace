'use client'
import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import MediaPreview from "./MediaPreview";
import { MediaType } from "@/types/nft";

const Category = () => {
  const router = useRouter();
  const CategoryArray = [
    {
      images: "/images/category/category1.jpg",
      step: "Bước 1",
      title: "Kết nối ví",
      description: "Kết nối ví của bạn để bắt đầu mua và bán NFT",
    },
    {
      images: "/images/category/category2.jpg",
      step: "Bước 2",
      title: "Tạo NFT",
      description: "Tạo NFT của riêng bạn và đưa nó lên thị trường",
    },
    {
      images: "/images/category/category3.jpg",
      step: "Bước 3",
      title: "Bán NFT",
      description: "Bán NFT của bạn và kiếm lợi nhuận",
    },
  ];

  return (
    <div className={cn("w-4/5tt mx-auto")}>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        )}
      >
        {CategoryArray.map((el, i) => (
          <div
            key={i + 1}
            className={cn(
              "p-4 border border-icons rounded-xl transition-all duration-300",
              "hover:shadow-[0_0_15px_rgba(93,222,226,1)]"
            )}
          >
            <div className={cn("relative w-full aspect-video mb-4")}>
              <MediaPreview
                mediaType={MediaType.IMAGE}
                mediaUrl={el.images}
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
            <div className={cn("p-4")}>
              <span className={cn("text-primary")}>{el.step}</span>
              <h2 className={cn("text-2xl font-bold my-2")}>{el.title}</h2>
              <p className={cn("text-gray-500")}>{el.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;

'use client'

import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const HelpCenter: React.FC = () => {
  const router = useRouter();
  const helpItems = [

    {
      name: "Tìm kiếm",
      link: "/searchPage",
    },
    {
      name: "Hồ sơ tác giả",
      link: "/author",
    },
    {
      name: "Cài đặt tài khoản",
      link: "/account",
    },
    {
      name: "Tải lên NFT",
      link: "/uploadNFT",
    },
  ];

  return (
    <div className={cn("flex flex-col")}>
      {helpItems.map((item, index) => (
        <div 
          key={index} 
          className={cn("p-2 my-1 transition-all duration-300 hover:bg-icons hover:text-shadow-dark hover:rounded-sm cursor-pointer")}
          onClick={() => router.push(item.link)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default HelpCenter;

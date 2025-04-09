import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HelpCenter: React.FC = () => {
  const helpItems = [
    {
      name: "Bộ sưu tập",
      link: "collection",
    },
    {
      name: "Tìm kiếm",
      link: "searchPage",
    },
    {
      name: "Hồ sơ tác giả",
      link: "author",
    },
    {
      name: "Cài đặt tài khoản",
      link: "account",
    },
    {
      name: "Tải lên NFT",
      link: "uploadNFT",
    },
    {
      name: "Kết nối ví",
      link: "connectWallet",
    },
    {
      name: "Blog",
      link: "blog",
    },
  ];

  return (
    <div className={cn("flex flex-col")}>
      {helpItems.map((item, index) => (
        <div key={index} className={cn("p-2 my-1 transition-all duration-300 hover:bg-icons hover:text-shadow-dark hover:rounded-sm")}>
          <Link href={item.link}>{item.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default HelpCenter;

'use client'
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

//INTERNAL IMPORT
import images from "@/img";

const Service = () => {
  const [services] = useState([
    { step: "Bước 1", title: "Kết Nối Ví", image: images.service1, desc: "Kết nối MetaMask hoặc ví Web3 khác để bắt đầu hành trình NFT của bạn trên Polygon Amoy Testnet" },
    { step: "Bước 2", title: "Khám Phá NFT", image: images.service2, desc: "Tìm kiếm, lọc và khám phá các NFT độc đáo từ các nghệ sĩ và nhà sáng tạo trên marketplace" },
    { step: "Bước 3", title: "Tạo & Đăng Bán", image: images.service3, desc: "Tạo NFT mới từ tác phẩm của bạn, đặt giá và đăng bán trên marketplace" },
    { step: "Bước 4", title: "Mua & Giao Dịch", image: images.service1, desc: "Mua NFT yêu thích, quản lý bộ sưu tập và bán lại NFT để kiếm lợi nhuận" }
  ])
  return (
    <div className={cn("w-4/5tt mx-auto my-32 md:w-11/12tt")}>
      <div className={cn("grid grid-cols-2 gap-4 text-center md:grid-cols-4 md:gap-12")}>
        {services.map((item, index) => (
          <div className="text-center" key={index}>
            <Image src={item.image} className="m-auto" alt={item.title} width={100} height={100} />
            <p className={cn("mt-12 mb-8")}>
              <span className={cn("px-6 py-2 rounded-full bg-icons text-shadow-dark")}>{item.step}</span>
            </p>
            <h3>{item.title}</h3>
            <p className="">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;

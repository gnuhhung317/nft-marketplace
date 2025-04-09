'use client'
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

//INTERNAL IMPORT
import images from "@/img";

const Service = () => {
  const [services] = useState([
    { step: "Bước 1", title: "Lọc & Khám Phá", image: images.service1, desc: "Kết nối ví, khám phá, mua NFT, bán NFT của bạn và kiếm tiền" },
    { step: "Bước 2", title: "Lọc & Khám Phá", image: images.service2, desc: "Kết nối ví, khám phá, mua NFT, bán NFT của bạn và kiếm tiền" },
    { step: "Bước 3", title: "Kết Nối Ví", image: images.service3, desc: "Kết nối ví, khám phá, mua NFT, bán NFT của bạn và kiếm tiền" },
    { step: "Bước 4", title: "Bắt Đầu Giao Dịch", image: images.service1, desc: "Kết nối ví, khám phá, mua NFT, bán NFT của bạn và kiếm tiền" }
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

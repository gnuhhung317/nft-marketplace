'use client'
import React from "react";
import Image from "next/image";
import { DiAws } from "react-icons/di";
import { useRouter } from "next/navigation";

// Internal imports
import images from "@/img";
import { Button } from "./ui/button";
import Link from "next/link";

const Brand: React.FC = () => {
  const router = useRouter();
  return (
    <div className="mt-12 mb-12 w-full">
      <div className="mx-auto md:py-12 p-2 grid md:grid-cols-2 items-center md:w-11/12tt grid-cols-1 md:gap-16 lg:grid-cols-2">
        <div>
          <Link href={{ pathname: '/' }}>
            <DiAws className="text-[4rem]" />
          </Link>

          <h1 className="text-6xl leading-none md:text-4xl font-bold">Kiếm tiền điện tử miễn phí với Ciscrypt</h1>
          <p className="text-xl mt-2">Một công ty sáng tạo dẫn dắt và truyền cảm hứng.</p>

          <div className="flex items-center gap-8 mt-12">
            <Button
              onClick={() => router.push("/uploadNFT")}
            >Tạo</Button>
            <Button
              onClick={() => router.push("/searchPage")}
            >Khám Phá</Button>
          </div>
        </div>
        <div>
          <Image src={images.earn} alt="logo thương hiệu" width={800} height={600} />
        </div>
      </div>
    </div>
  );
};

export default Brand;

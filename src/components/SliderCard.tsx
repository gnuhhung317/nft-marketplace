import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TMarketItem } from "@/types";

//INTERNAL IMPORT
import images from "@/img";

interface SliderCardProps {
  el: TMarketItem;
  i: number;
}

const SliderCard: React.FC<SliderCardProps> = ({ el, i }) => {
  return (
    <div className={cn("p-4")}>
      <div className={cn("transition-all duration-300 ease-in rounded-2xl pb-4 hover:shadow-custom")}>
        <div className={cn("rounded-2xl overflow-hidden h-48")}>
          <Image
            src={el.thumbnailUrl || el.mediaUrl}
            alt={el.name}
            width={500}
            height={300}
            className={cn("rounded-2xl object-cover w-full h-full")}
          />
        </div>
        <div className={cn("flex items-center justify-between gap-4 px-8")}>
          <p className={cn("text-xl leading-none font-bold my-4 whitespace-nowrap")}>{el.name}</p>
        </div>

        <div className={cn("flex justify-between px-8 mt-4")}>
          <div className={cn("border relative border-icons p-2 rounded-sm")}>
            <small className={cn("bg-icons px-2 py-1 rounded-sm text-main-bg absolute top-[-1rem] left-4")}>Giá Hiện Tại</small>
            <p className={cn("text-lg font-bold mt-2 whitespace-nowrap")}>{el.price} ETH</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderCard;

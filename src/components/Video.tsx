import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// INTERNAL IMPORT
import images from "@/img";

const Video = () => {
  return (
    <div className={cn("w-full mt-56 mb-20")}>
      <div className={cn("w-4/5tt mx-auto md:w-9/10")}>
        <h1 className={cn("text-6xl leading-tight md:text-4xl")}>
          <span role="img" aria-label="Video Camera">🎬</span> Các Video
        </h1>
        <p className={cn("text-xl md:w-2/5 leading-snug w-full")}>
          Hãy xem những video hot nhất của chúng tôi. Xem thêm và chia sẻ nhiều góc nhìn mới về hầu hết mọi chủ đề. Mọi người đều được chào đón.
        </p>

        <div className={cn("grid grid-cols-8 gap-4 md:p-20 mt-24 p-0")}>
          <div className={cn("col-[1/-2] row-span-full z-10 ")}>
            <Image
              src={images.NFTVideo}
              alt="Hình ảnh video"
              width={1920}
              height={1080}
              className={cn("rounded-lg object-cover")}
            />
          </div>

          <div className={cn("col-[4/-1] bg-icons rounded-lg row-span-full p-12 mt-12 shadow-custom md:mt-[-2rem]")}>
            Chào bạn
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;

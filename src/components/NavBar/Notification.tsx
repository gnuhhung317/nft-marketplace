import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import images from "@/img"; // Giả sử images là một đường dẫn nhập hợp lệ

const Notification: React.FC = () => {
  return (
    <div className={cn("p-2 bg-main-bg shadow-shadow-dark rounded-lg z-9")}>
      <p className={cn("text-[1.3rem] font-semibold mb-8")}>Thông báo</p>
      <div className={cn("flex items-start gap-4 p-4 transition-all duration-300 hover:bg-icons group hover:text-shadow-dark rounded-sm")}>
        <div className={cn("rounded-full")}>
          <Image
            src={images.user1}
            alt="hình ảnh hồ sơ"
            width={50}
            height={50}
            className={cn("rounded-full")}
          />
        </div>
        <div className={cn("mt-[-0.8rem] leading-none")}>
          <h4 className={cn("font-semibold text-lg mt-2")}>Shoaib Akhter</h4>
          <p className={cn("text-md my-1 relative leading-[0.3]")}>Đo lường hành động của người dùng...</p>
          <small className="">3 phút trước</small>
        </div>
        <span className={cn("w-[0.5rem] h-[0.5rem] rounded-full bg-icons group-hover:bg-main-bg")}></span>
      </div>
    </div>
  );
};

export default Notification;

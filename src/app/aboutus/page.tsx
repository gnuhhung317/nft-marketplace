import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import images from "@/img";

const founderArray = [
  {
    name: "Bùi Đức Hùng",
    position: "Đồng sáng lập và Giám đốc điều hành",
    images: images.founder1,
  },
  {
    name: "Bùi Đức",
    position: "Đồng sáng lập và Giám đốc điều hành",
    images: images.founder1,
  },
  {
    name: "Hùng Đức",
    position: "Đồng sáng lập, Chủ tịch",
    images: images.founder1,
  },
  {
    name: "Đức Hùng",
    position: "Đồng sáng lập, Giám đốc Chiến lược",
    images: images.founder1,
  },
];

const factsArray = [
  {
    title: "1",
    info: "Bài viết đã được công bố trên toàn thế giới (tính đến ngày sinh nhật thứ 20 của tôi)",
  },
  {
    title: "1",
    info: "Tài khoản người dùng đã đăng ký (tính đến ngày sinh nhật thứ 20 của tôi)",
  },
  {
    title: "220+",
    info: "Các quốc gia và khu vực có sự hiện diện của chúng tôi (tính đến ngày sinh nhật thứ 20 của tôi)",
  },
];
const aboutus = () => {
  return (
    <div className={cn("w-full my-20")}>
      <div className={cn("w-4/5tt mx-auto")}>
        <div className={cn("grid lg:grid-cols-[1.5fr_2fr] items-center gap-12 grid-cols-1")}>
          <div>
            <h1 className={cn("text-4xl font-bold leading-[0.5]")}>👋 Về Chúng Tôi.</h1>
            <p className={cn("text-xl leading-loose mt-4")}>
              Chúng tôi là trung lập và độc lập, và mỗi ngày chúng tôi tạo ra
              các chương trình và nội dung đặc sắc, đẳng cấp thế giới để thông tin,
              giáo dục và giải trí hàng triệu người trên toàn thế giới.
            </p>
          </div>
          <div>
            <Image src={images.hero2} width={500}
              height={500} alt="Hình ảnh Về Chúng Tôi" />
          </div>
        </div>

        <div className={cn("mt-8")}>
          <h2 className={cn("text-4xl font-bold leading-[1]")}>⛱ Người Sáng Lập</h2>
          <p className={cn("text-xl leading-[1.2] mt-4 lg:w-2/5  w-full")}>
            Chúng tôi là trung lập và độc lập, và mỗi ngày chúng tôi tạo ra
            các chương trình và nội dung đặc sắc, đẳng cấp thế giới
          </p>
        </div>

        <div className={cn("mt-8")}>
          <div className={cn("grid lg:grid-cols-4 gap-8 grid-cols-1 md:grid-cols-2")}>
            {founderArray.map((el, i) => (
              <div key={i} className={cn("bg-icons p-4 rounded-lg text-main-bg")}>
                <Image
                  src={el.images}
                  alt={el.name}
                  width={500}
                  height={500}
                  className={cn("rounded-lg h-80 object-cover object-center")}
                />
                <h3 className={cn("text-2xl leading-none mt-4")}>{el.name}</h3>
                <p className={cn("text-1xl leading-none")}>{el.position}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={cn("mt-8")}>
          <h2 className={cn("text-4xl font-bold leading-[1]")}>🚀 Thông Tin Nhanh</h2>
          <p className={cn("text-xl leading-[1.2] lg:w-2/5 w-full mt-4")}>
            Chúng tôi là trung lập và độc lập, và mỗi ngày chúng tôi tạo ra
            các chương trình và nội dung đặc sắc, đẳng cấp thế giới
          </p>
        </div>

        <div className={cn("mt-8")}>
          <div className={cn("grid lg:grid-cols-3 gap-8 grid-cols-1")}>
            {factsArray.map((el, i) => (
              <div key={i} className={cn("bg-icons p-4 px-12 rounded-lg text-main-bg")}>
                <h3 className={cn("text-4xl leading-none lg:text-2xl")}>{el.title}</h3>
                <p>{el.info}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default aboutus;

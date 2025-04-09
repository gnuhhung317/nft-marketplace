import React from "react";
import { cn } from "@/lib/utils";
import Subscription from "./Subscription";

const subscriptionArray = [
  {
    plan: "BẮT ĐẦU",
    price: "$5/tháng",
    popular: "",
    service: ["Báo cáo tự động", "Xử lý nhanh hơn", "Tùy chỉnh"],
    info: "Thực sự bạn có thể chưa nghe về chúng, quần short jean.",
  },
  {
    plan: "CƠ BẢN",
    price: "$15/tháng",
    popular: "PHỔ BIẾN",
    service: [
      "Tất cả trong gói Bắt Đầu",
      "100 Lần xây dựng",
      "Báo cáo tiến độ",
      "Hỗ trợ cao cấp",
    ],
    info: "Thực sự bạn có thể chưa nghe về chúng, quần short jean.",
  },
  {
    plan: "NÂNG CAO",
    price: "$25/tháng",
    popular: "",
    service: [
      "Tất cả trong gói Cơ Bản",
      "Xây dựng không giới hạn",
      "Phân tích nâng cao",
      "Đánh giá công ty",
    ],
    info: "Thực sự bạn có thể chưa nghe về chúng, quần short jean.",
  },
];
export type SubscriptionsType = typeof subscriptionArray;

const subscription = () => {
  return (
    <div className={cn("w-full my-28 lg:my-16")}>
      <div className={cn(" mx-auto ")}>
        <div className={cn("text-center")}>
          <h1 className={cn("text-4xl leading-[0.5]")}>💎 Đăng Ký</h1>
          <p className={cn(" text-base mt-2")}>
            Giá cả phù hợp với nhu cầu của bất kỳ kích thước công ty nào.
          </p>
        </div>

        <div className={cn("grid xl:grid-cols-3 gap-12 mt-28 lg:grid-cols-2 grid-cols-1")}>
          {subscriptionArray.map((el, i) => (
            <Subscription key={i} el={el} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default subscription;

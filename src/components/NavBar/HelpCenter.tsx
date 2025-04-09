import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HelpCenter: React.FC = () => {
  const helpItems = [
    { name: "Giới thiệu", link: "aboutus" },
    { name: "Liên hệ với chúng tôi", link: "contactus" },
    { name: "Đăng ký", link: "signUp" },
    { name: "Đăng nhập", link: "login" },
    { name: "Đăng ký nhận tin", link: "subscription" },
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

import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { IconType } from "react-icons/lib";

interface TabData {
  id: number;
  title: string;
  description: string;
}

const NFTTabs = ({ dataTab, icon }: { dataTab: TabData[], icon?: React.ReactNode}) => {
  return (
    <div className={cn("flex flex-col gap-[1rem]")}>
      {dataTab.map((el, index) => (
        <div key={index} className={cn("flex items-center gap-[1rem] line-height-[0] py-[1rem] border-b-[1px] border-shadow-dark")}>
          <div className={cn("grid self-start line-height-[1] mt-[6px]")}>
            <span className={cn("font-bold flex items-center")}>
              {el.title}
              {icon}
            </span>
            <small className={cn("mt-[0.2rem] whitespace-pre-line")}>{el.description}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NFTTabs;

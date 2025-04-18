"use client";

import React, { useState, useContext, useCallback, useMemo } from "react";
import Image from "next/image";
import { DiAws } from "react-icons/di";
import { MdNotifications } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { CgMenuRight } from "react-icons/cg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Notification from "@/components/NavBar/Notification";
import Error from "@/components/Error";
import images from "@/img";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import Profile from "./Profile";
import SideBar from "./SideBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Discover from "./Discover";
import DropDown from "../DropDown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { create2, createNewNFT } from "@/actions/NFT";
import { AccountContext } from "@/Context/AccountProvider";
import { UpdateAccount } from "@/actions/Account";
import SwitchNetwork from "../SwitchNetwork";

const discoverItems = [
  {
    name: "Bộ sưu tập",
    link: "collection",
  },
  {
    name: "Tìm kiếm",
    link: "searchPage",
  },
  {
    name: "Hồ sơ tác giả",
    link: "author",
  },
  {
    name: "Cài đặt tài khoản",
    link: "account",
  },
  {
    name: "Tải lên NFT",
    link: "uploadNFT",
  },
  {
    name: "Kết nối ví",
    link: "connectWallet",
  }
];
const helpItems = [
  { name: "Giới thiệu", link: "aboutus" },
  { name: "Liên hệ với chúng tôi", link: "contactus" },
  { name: "Đăng ký", link: "signUp" },
  { name: "Đăng nhập", link: "login" },
  { name: "Đăng ký nhận tin", link: "subscription" },
];

const NavBar = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const { currentAccount, connectWallet, openError, openSwitchNetwork } = useContext(
    NFTMarketplaceContext
  )!;
  const { account } = useContext(AccountContext)!;
  const gotoSearchPage = useCallback(() => {
    console.log(searchValue);
    router.push(`/searchPage?keyword=${searchValue}`);
  }, [searchValue]);

  return (
    <div className="relative z-9 mx-auto mt-8 mb-12">
      <div className="grid grid-cols-[1fr_3fr] md:grid-cols-2 sm:grid-cols-[1fr_4fr] gap-4 items-center">
        <div className="grid grid-cols-[1fr_2fr] items-center gap-4">
          <Link href={{ pathname: "/" }}>
            <DiAws className="text-icons text-6xl cursor-pointer" />
          </Link>
          <div className="items-center w-3/5 border-2 border-icons rounded-full p-2 hidden md:flex">
            <input
              onKeyDown={(e) => e.key === "Enter" && gotoSearchPage()}
              className="w-full placeholder:text-primary bg-transparent outline-none px-2"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm kiếm NFT"
            />
            <BsSearch
              onClick={gotoSearchPage}
              className="text-2xl cursor-pointer mr-4"
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[1fr_1fr_0.5fr_1fr_0.5fr] gap-4 items-center justify-items-center">
          <DropDown
            items={discoverItems}
            className="cursor-pointer text-lg md:block hidden"
          >Khám Phá</DropDown>
          <DropDown
            items={helpItems}
            className="cursor-pointer text-lg md:block hidden whitespace-nowrap"
          >Trung Tâm Trợ Giúp</DropDown>
          <div className="relative cursor-pointer">
            <DropdownMenu>
              <DropdownMenuTrigger className="">
                <MdNotifications className="text-3xl" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-main-bg border border-primary">
                <DropdownMenuLabel className="mt-4">
                  <Notification />
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {currentAccount === "" ? (
            <Button
              className="w-10/12 md:block hidden min-w-20 px-0"
              onClick={connectWallet}
            >
              Kết nối
            </Button>
          ) : (
            <Button
              className="w-10/12 md:block hidden min-w-20 px-0"
              onClick={() => router.push("/uploadNFT")}
            >
              Tạo
            </Button>
          )}

          <div className="relative cursor-pointer">
            {useMemo(() => (
              <Profile currentAccount={currentAccount!} account={account} />
            ), [currentAccount, account])}
          </div>
          <div className="relative cursor-pointer md:hidden">
            <CgMenuRight
              className={cn("text-3xl")}
              onClick={() => setOpenSideMenu(true)}
            />
          </div>
        </div>
      </div>
      {openSideMenu && (
        <div className="fixed left-0 top-0 w-9/12 bg-main-bg shadow-custom z-9 h-screen overflow-y-auto">
          <SideBar
            setOpenSideMenu={() => setOpenSideMenu(false)}
            currentAccount={currentAccount!}
            connectWallet={connectWallet}
          />
        </div>
      )}
      {openError && <Error />}
      {openSwitchNetwork && <SwitchNetwork />}
    </div>
  );
};

export default NavBar;

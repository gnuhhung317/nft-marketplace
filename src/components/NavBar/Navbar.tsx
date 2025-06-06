"use client";

import React, { useState, useContext, useCallback, useMemo, useEffect } from "react";
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
import { UpdateAccount, getUserByAddress } from "@/actions/Account";
import SwitchNetwork from "../SwitchNetwork";

const discoverItems = [
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
];
const helpItems = [
  { name: "Giới thiệu", link: "aboutus" },
  { name: "Liên hệ với chúng tôi", link: "contactus" },
  { name: "Đăng ký nhận tin", link: "subscription" },
];

const NavBar = () => {
  const router = useRouter();
  const { currentAccount, connectWallet, openError, openSwitchNetwork } = useContext(NFTMarketplaceContext)!;
  const { account, setAccount } = useContext(AccountContext)!;
  const [openSideMenu, setOpenSideMenu] = useState(false);

  // Use useEffect to handle client-side state updates
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
 
  const [searchValue, setSearchValue] = useState("");
  const gotoSearchPage = useCallback(() => {
    console.log(searchValue);
    router.push(`/searchPage?keyword=${searchValue}`);
  }, [searchValue]);

  return (
    <div className={cn("w-full px-4 py-4")}>
      <div className={cn("w-full mx-auto")}>
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
            {mounted && (
              currentAccount === "" ? (
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
              )
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
      </div>
      {openSideMenu && (
        <SideBar
          setOpenSideMenu={() => setOpenSideMenu(false)}
          currentAccount={currentAccount!}
          connectWallet={connectWallet}
        />
      )}
      {openError && <Error />}
      {openSwitchNetwork && <SwitchNetwork />}
    </div>
  );
};

export default NavBar;

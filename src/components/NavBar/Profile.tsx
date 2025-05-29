import React, { useContext } from "react";
import Image from "next/image";
import { FaUserAlt, FaRegImage, FaUserEdit } from "react-icons/fa";
import { MdHelpCenter } from "react-icons/md";
import { TbDownloadOff, TbDownload } from "react-icons/tb";
import Link from "next/link";
import { cn } from "@/lib/utils";
import images from "@/img"; // Giả sử images là một đường dẫn nhập hợp lệ
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DropDown from "../DropDown";
import { AccountContext, AccountType, accountData } from "@/Context/AccountProvider";
import { useRouter } from "next/navigation";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import { LocalStorageProvider } from "@/utils/localStorageProvider";

interface ProfileProps {
  currentAccount: string;
  account: AccountType;
}

const Profile = ({ currentAccount, account }: ProfileProps) => {
  const router = useRouter();
  const { connectWallet, disconnectWallet } = useContext(NFTMarketplaceContext)!;
  const { setAccount } = useContext(AccountContext)!;

  // Hiển thị 6 ký tự đầu và 4 ký tự cuối của địa chỉ ví
  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none cursor-pointer">
        <div className="relative">
          <Image
            src={account?.avatar || images.user1}
            alt="profile"
            width={40}
            height={40}
            priority
            unoptimized
            className="rounded-full"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-main-bg border border-primary min-w-[200px]">
        {currentAccount ? (
          <>
            <DropdownMenuLabel className="flex flex-col items-center gap-2 py-3">
              <Image
                src={account?.avatar || images.user1}
                alt="profile"
                width={60}
                height={60}
                priority
                unoptimized
                className="rounded-full mb-1"
              />
              <p className="text-base font-semibold">{account?.username || "Người dùng"}</p>
              <p className="text-sm text-gray-400">{shortenAddress(currentAccount)}</p>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-gray-700" />
            
            <DropdownMenuItem
              onClick={() => router.push("/author")}
              className="cursor-pointer hover:bg-gray-800 py-2"
            >
              Hồ sơ của tôi
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => router.push("/account")}
              className="cursor-pointer hover:bg-gray-800 py-2"
            >
              Cài đặt tài khoản
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => router.push("/uploadNFT")}
              className="cursor-pointer hover:bg-gray-800 py-2"
            >
              Tạo NFT mới
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem
              onClick={() => {
                disconnectWallet();
                router.push("/");
                setAccount(accountData); // Reset account to empty data
                LocalStorageProvider.clearAccount(); // Clear localStorage data
              }}
              className="cursor-pointer hover:bg-gray-800 py-2 text-red-500"
            >
              Đăng xuất
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={connectWallet}
            className="cursor-pointer hover:bg-gray-800 py-2"
          >
            Kết nối ví
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;

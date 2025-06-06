import React, { useContext, useEffect, useState } from "react";
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
import { getUserByAddress } from "@/actions/Account";

interface ProfileProps {
  currentAccount: string;
  account: AccountType;
}

const Profile = ({ currentAccount, account }: ProfileProps) => {
  const router = useRouter();
  const { disconnectWallet } = useContext(NFTMarketplaceContext)!;
  const { setAccount } = useContext(AccountContext)!;
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentAccount) return;
      
      try {
        setIsLoading(true);
        const result = await getUserByAddress(currentAccount);
        if (result.success && result.data) {
          setUserAvatar(result.data.avatar);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentAccount]);

  const handleLogout = () => {
    disconnectWallet();
    LocalStorageProvider.clearAccount();
    LocalStorageProvider.removeItem('accountData');
    setAccount({...accountData});
    setUserAvatar(null);
    router.push("/");
  };

  // Hiển thị 6 ký tự đầu và 4 ký tự cuối của địa chỉ ví
  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          ) : (
            <Image
              src={userAvatar || account?.avatar || images.user1}
              alt="profile"
              width={40}
              height={40}
              priority
              unoptimized
              className="rounded-full object-cover"
            />
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-main-bg border border-primary min-w-[200px]">
        {currentAccount ? (
          <>
            <DropdownMenuLabel className="flex flex-col items-center gap-2 py-3">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={userAvatar || account?.avatar || images.user1}
                  alt="profile"
                  width={64}
                  height={64}
                  priority
                  unoptimized
                  className="rounded-full object-cover"
                />
              </div>
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
              onClick={handleLogout}
              className="cursor-pointer hover:bg-gray-800 py-2 text-red-500"
            >
              Đăng xuất
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={() => router.push("/login")}
            className="cursor-pointer hover:bg-gray-800 py-2"
          >
            Đăng nhập
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;

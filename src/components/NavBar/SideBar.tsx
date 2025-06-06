// React imports
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Icons
import { GrClose } from "react-icons/gr";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
  TiArrowSortedDown,
  TiArrowSortedUp,
} from "react-icons/ti";
import { DiAws } from "react-icons/di";

// Internal imports
import images from "@/img"; // Đã cập nhật để sử dụng đường dẫn tuyệt đối
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import { LocalStorageProvider } from "@/utils/localStorageProvider";
import { AccountContext, accountData } from "@/Context/AccountProvider";
import { LocalStorageService } from "@/services/LocalStorageService";

// TypeScript Props
interface SideBarProps {
  setOpenSideMenu: () => void;
  currentAccount: string;
  connectWallet: () => Promise<void>;
}

const SideBar: React.FC<SideBarProps> = ({ setOpenSideMenu, currentAccount, connectWallet }) => {
  const [openDiscover, setOpenDiscover] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const router = useRouter();
  const { disconnectWallet } = useContext(NFTMarketplaceContext)!;
  const { setAccount } = useContext(AccountContext)!;

  //--------MENU ĐIỀU HƯỚNG KHÁM PHÁ
  const discover = [
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
    },    {
      name: "Chi tiết NFT",
      link: "/", // Redirects to homepage since we need a specific tokenId
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
      name: "Blog",
      link: "blog",
    }
  ];
  //------TRUNG TÂM TRỢ GIÚP
  const helpCenter = [
    {
      name: "Giới thiệu",
      link: "about",
    },
    {
      name: "Liên hệ với chúng tôi",
      link: "contactus",
    },
    {
      name: "Đăng ký nhận tin",
      link: "subscription",
    },
  ];

  const openDiscoverMenu = () => {
    setOpenDiscover(!openDiscover);
    setOpenHelp(false);
  };

  const openHelpMenu = () => {
    setOpenHelp(!openHelp);
    setOpenDiscover(false);
  };  const handleLogout = () => {
    // Ngắt kết nối ví
    disconnectWallet();
    
    // Xóa tất cả dữ liệu tài khoản khỏi localStorage
    LocalStorageProvider.clearAccount();
    LocalStorageProvider.removeItem('accountData');
    LocalStorageService.clearAll();
    
    // Reset trạng thái tài khoản về rỗng
    setAccount({...accountData});
    
    // Chuyển hướng về trang chủ và đóng menu
    router.push("/");
    setOpenSideMenu();
    
    console.log("Đã đăng xuất và xóa thông tin tài khoản");
  };

  return (
    <div className={cn("absolute top-0 left-0 w-full h-full bg-main-bg z-9")}>
      <GrClose
        className={cn("absolute top-12 right-12 cursor-pointer transition duration-200 ease-in-out text-icons hover:rotate-45")}
        onClick={() => setOpenSideMenu()}
      />
      <div className={cn("p-8 pt-0 pb-2 border-b border-icons-light bg-main-bg")}>
        <Link href={{ pathname: '/' }}>
          <DiAws className={cn("text-5xl my-8")} />
        </Link>

        <p>
          Khám phá những bài viết nổi bật nhất về tất cả các chủ đề NFT & viết câu chuyện của riêng bạn và chia sẻ chúng.
        </p>
        <div className={cn("flex gap-5 text-xl items-center")}>
          <a href="#" className={cn("p-1 rounded-full transition-all duration-300 grid hover:bg-icons hover:text-shadow-dark")}>
            <TiSocialFacebook />
          </a>
          <a href="#" className={cn("p-1 rounded-full transition-all duration-300 grid hover:bg-icons hover:text-shadow-dark")}>
            <TiSocialLinkedin />
          </a>
          <a href="#" className={cn("p-1 rounded-full transition-all duration-300 grid hover:bg-icons hover:text-shadow-dark")}>
            <TiSocialTwitter />
          </a>
          <a href="#" className={cn("p-1 rounded-full transition-all duration-300 grid hover:bg-icons hover:text-shadow-dark")}>
            <TiSocialYoutube />
          </a>
          <a href="#" className={cn("p-1 rounded-full transition-all duration-300 grid hover:bg-icons hover:text-shadow-dark")}>
            <TiSocialInstagram />
          </a>
        </div>
      </div>
      <div className={cn("px-8 py-4 uppercase font-medium border-b border-icons-light")}>
        <div>
          <div onClick={() => openHelpMenu()} className={cn("flex justify-between text-md items-center cursor-pointer")}>
            <p className="font-bold mb-2">Khám Phá</p>
            {openHelp ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
          </div>
          {openHelp && (
            <div className={cn("pl-4")}>
              {helpCenter.map((el, i) => (
                <p key={i} className="mb-2 cursor-pointer" onClick={() => router.push(el.link)}>
                  {el.name}
                </p>
              ))}
            </div>
          )}
        </div>
        <div>
          <div onClick={() => openDiscoverMenu()} className={cn("flex justify-between text-md items-center cursor-pointer")}>
            <p className="font-bold">Khám Phá</p>
            {openDiscover ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
          </div>
          {openDiscover && (
            <div className={cn("pl-4 ")}>
              {discover.map((el, i) => (
                <p key={i} className="mb-2 cursor-pointer" onClick={() => router.push(el.link)}>
                  {el.name}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={cn("p-8 flex round items-center justify-between")}>
        {currentAccount === "" ? (
          <Button onClick={() => connectWallet()}>Kết nối</Button>
        ) : (
          <div className={cn("space-y-3")}>
            <Button onClick={() => router.push("/uploadNFT")} className={cn("w-full")}>Tạo</Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className={cn("w-full")}
            >
              Đăng xuất
            </Button>
          </div>
        )}
        <Button onClick={() => { }} >Kết nối ví</Button>
      </div>
    </div>
  );
};

export default SideBar;

import React, { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // cn function for dynamic class names

// ICONS IMPORT
import {
  MdVerified,
  MdCloudUpload,
  MdTimer,
  MdReportProblem,
  MdOutlineDeleteSweep,
} from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaWallet, FaPercentage } from "react-icons/fa";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
} from "react-icons/ti";
import { BiTransferAlt, BiDollar } from "react-icons/bi";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import images from "@/img";
import { TMarketItem } from "@/types";
import NFTTabs from "./NFTTabs";
import { Button } from "@/components/ui/button";
import DropDown from "@/components/DropDown";
import { useTimer } from "react-timer-hook";

const cloudItems = [
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <TiSocialInstagram /> Instagram{" "}
      </div>
    ),
  },
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <TiSocialLinkedin /> LinkedIn
      </div>
    ),
  },
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <TiSocialTwitter /> Twitter
      </div>
    ),
  },
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <TiSocialYoutube /> YouTube
      </div>
    ),
  },
];
const helpsItems = [
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <BiDollar /> Thay đổi giá
      </div>
    ),
  },
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <BiTransferAlt /> Chuyển nhượng{" "}
      </div>
    ),
  },
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <MdReportProblem /> Báo cáo lạm dụng
      </div>
    ),
  },
  {
    link: "",
    name: (
      <div className="flex items-center gap-2">
        <MdOutlineDeleteSweep /> Xóa mục
      </div>
    ),
  },
];
const provenanceArray = [
  images.user6,
  images.user7,
  images.user8,
  images.user9,
  images.user10,
];
const ownerArray = [
  images.user1,
  images.user8,
  images.user2,
  images.user6,
  images.user5,
];
const historyArray = [
  images.user1,
  images.user2,
  images.user3,
  images.user4,
  images.user5,
];
const formatTime = (num: number) => {
  return num < 10 ? `0${num}` : num;
};
const NFTDescription = ({ nft }: { nft: TMarketItem }) => {
  const [social, setSocial] = useState(false);
  const [NFTMenu, setNFTMenu] = useState(false);
  const [history, setHistory] = useState(true);
  const [provenance, setProvenance] = useState(false);
  const [owner, setOwner] = useState(false);

  const router = useRouter();
  const { buyNFT, currentAccount } = useContext(NFTMarketplaceContext)!;

  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: new Date(
      new Date().getTime() +
        3 * (24 * 60 * 60 * 1000) +
        (3 * 60 * 60 + 15 * 60 + 20)
    ),
  });
  const switchTab = (tab: "history" | "provenance" | "owner") => {
    setHistory(tab === "history");
    setProvenance(tab === "provenance");
    setOwner(tab === "owner");
  };
  return (
    <div className={cn("w-full")}>
      <div className={cn("w-full m-auto")}>
        <div className={cn("flex items-center justify-between relative")}>
          <p
            className={cn(
              "bg-icons text-main-bg p-[0.2rem_0.8rem] rounded-[2rem]"
            )}
          >
            Thế giới ảo
          </p>
          <div className="flex items-center gap-4">
            <DropDown items={cloudItems}>
              <MdCloudUpload className={cn("cursor-pointer")} />
            </DropDown>

            <DropDown items={helpsItems}>
              <BsThreeDots className={cn("cursor-pointer")} />
            </DropDown>
          </div>
        </div>

        <div className={cn("flex flex-col items-start gap-[2rem] pb-[1.5rem]")}>
          <h1 className={cn("text-4xl font-bold mt-4 leading-[1] ")}>
            {nft.name} #{nft.tokenId}
          </h1>
          <div className={cn("flex items-center gap-[2rem]")}>
            <div
              className={cn(
                "flex items-center self-center gap-[1rem] leading-[1]"
              )}
            >
              <Image
                src={images.user1}
                alt="profile"
                width={40}
                height={40}
                className={cn("rounded-full")}
              />
              <div>
                <small className={cn("font-medium")}>Người tạo</small> <br />
                <Link href={{ pathname: "/author" }}>
                  <span className={cn("font-bold flex items-center")}>
                    Karli Costa <MdVerified />
                  </span>
                </Link>
              </div>
            </div>

            <div
              className={cn(
                "flex items-center gap-[1rem] leading-[1] border-l-[1px] border-icons pl-[2rem]"
              )}
            >
              <Image
                src={images.creatorbackground1}
                alt="profile"
                width={40}
                height={40}
                className={cn("rounded-full")}
              />
              <div>
                <small className={cn("font-medium")}>Bộ sưu tập</small> <br />
                <span className={cn("font-bold flex items-center")}>
                  Ứng dụng Mokeny <MdVerified />
                </span>
              </div>
            </div>
          </div>

          <div className={cn("my-[1rem]")}>
            <p className={cn("flex items-center text-[1.5rem] gap-[1rem]")}>
              <MdTimer /> <span>Đấu giá sẽ kết thúc trong:</span>
            </p>
            <div className={cn("flex gap-[3rem] items-center mt-12")}>
              <div className={cn("flex flex-col items-center")}>
                <p className={cn("text-[3rem] leading-[0] font-extrabold")}>
                  {days}
                </p>
                <span className={cn("font-semibold mt-8")}>Ngày</span>
              </div>
              <div className={cn("flex flex-col items-center")}>
                <p className={cn("text-[3rem] leading-[0] font-extrabold")}>
                  {formatTime(hours)}
                </p>
                <span className={cn("font-semibold mt-8")}>Giờ</span>
              </div>
              <div className={cn("flex flex-col items-center")}>
                <p className={cn("text-[3rem] leading-[0] font-extrabold")}>
                  {formatTime(minutes)}
                </p>
                <span className={cn("font-semibold mt-8")}>Phút</span>
              </div>
              <div className={cn("flex flex-col items-center")}>
                <p className={cn("text-[3rem] leading-[0] font-extrabold")}>
                  {formatTime(seconds)}
                </p>
                <span className={cn("font-semibold mt-8")}>Giây</span>
              </div>
            </div>

            <div
              className={cn(
                "grid xl:grid-cols-[4fr_1fr] sm:grid-cols-[4fr_1fr] lg:grid-cols-1 gap-[3rem] items-end justify-between mt-[4rem]"
              )}
            >
              <div
                className={cn(
                  "border-[2px] leading-[1.5] border-icons rounded-[0.5rem]"
                )}
              >
                <small
                  className={cn(
                    "text-[1.2rem] bg-icons text-main-bg px-[1rem] py-[0.5rem] rounded-[0.5rem] ml-[2rem]"
                  )}
                >
                  Giá hiện tại
                </small>
                <p className={cn("px-[1rem] text-[1.5rem] font-extrabold")}>
                  {nft.price} ETH <span>( ≈ $3,221.22)</span>
                </p>
              </div>
              <span className=" whitespace-nowrap">[96 trong kho]</span>
            </div>

            <div className={cn("mt-[3rem] flex items-center gap-[3rem]")}>
              {currentAccount == nft.seller?.toLowerCase() ? (
                <p>Bạn không thể mua NFT của chính mình</p>
              ) : currentAccount == nft.owner?.toLowerCase() ? (
                <Button
                  onClick={() =>
                    router.push(
                      `/reSellToken?id=${nft.tokenId}&tokenURI=${nft.tokenURI}&price=${nft.price}`
                    )
                  }
                  className={cn("button")}
                >
                  <FaWallet />
                  &nbsp; Đưa lên Thị Trường
                </Button>
              ) : (
                <Button onClick={() => buyNFT(nft)} className={cn("button")}>
                  <FaWallet />
                  &nbsp; Mua NFT
                </Button>
              )}

              <Button onClick={() => {}} className={cn("button")}>
                <FaPercentage />
                &nbsp; Đưa ra đề nghị
              </Button>
            </div>

            <div className={cn("mt-[3rem] flex flex-wrap gap-[1rem]")}>
              <button
                onClick={() => switchTab("history")}
                className={cn(
                  "text-[1rem] py-[1rem] px-[2rem] whitespace-nowrap border-0 bg-shadow-dark text-icons rounded-[2rem] cursor-pointer font-semibold"
                )}
              >
                Lịch sử Đấu Giá
              </button>
              <button
                onClick={() => switchTab("provenance")}
                className={cn(
                  "text-[1rem] py-[1rem] px-[2rem]  whitespace-nowrap border-0 bg-shadow-dark text-icons rounded-[2rem] cursor-pointer font-semibold"
                )}
              >
                Nguồn gốc
              </button>
              <button
                onClick={() => switchTab("owner")}
                className={cn(
                  "text-[1rem] py-[1rem] px-[2rem]  whitespace-nowrap border-0 bg-shadow-dark text-icons rounded-[2rem] cursor-pointer font-semibold"
                )}
              >
                Chủ sở hữu
              </button>
            </div>

            {history && (
              <div className={cn("mt-[2rem] p-[1rem]")}>
                <NFTTabs dataTab={historyArray} />
              </div>
            )}
            {provenance && (
              <div className={cn("mt-[2rem] p-[1rem]")}>
                <NFTTabs dataTab={provenanceArray} />
              </div>
            )}

            {owner && (
              <div className={cn("mt-[2rem] p-[1rem]")}>
                <NFTTabs dataTab={ownerArray} icon={<MdVerified />} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDescription;

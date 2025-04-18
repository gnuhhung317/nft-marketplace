"use client";
import React, { useState, useEffect, useContext } from "react";
import { cn } from "@/lib/utils";

// INTERNAL IMPORT
import images from "@/img";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import Banner from "@/components/Banner";
import Brand from "@/components/Brand";
import FollowerTabCard from "@/components/FollowerTabCard";
import Title from "@/components/Title";
import AuthorNFTCardBox from "./AuthorNFTCardBox";
import AuthorProfileCard from "./AuthorProfileCard";
import AuthorTaps from "./AuthorTabs";
import { TMarketItem } from "@/types";
import { AccountContext } from "@/Context/AccountProvider";

const Author = () => {
  const followerArray = [
    {
      background: images.creatorbackground1,
      user: images.user1,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground2,
      user: images.user2,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground3,
      user: images.user3,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground4,
      user: images.user4,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground5,
      user: images.user5,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground6,
      user: images.user6,
      seller: "7d64gf748849j47fy488444",
    },
  ];

  const [collectiables, setCollectiables] = useState(true);
  const [created, setCreated] = useState(false);
  const [like, setLike] = useState(false);
  const [follower, setFollower] = useState(false);
  const [following, setFollowing] = useState(false);

  const { fetchMyNFTsOrListedNFTs, currentAccount } = useContext(
    NFTMarketplaceContext
  )!;
  const { account } = useContext(AccountContext)!;
  const [nfts, setNfts] = useState<TMarketItem[]>([]);
  const [myNFTs, setMyNFTs] = useState<TMarketItem[]>([]);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("fetchItemsListed").then(
      (items: TMarketItem[] | undefined) => {
        console.log(items);
        setNfts(items!);
      }
    );
  }, [currentAccount]);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("fetchMyNFTs").then(
      (items: TMarketItem[] | undefined) => {
        console.log(items);
        setMyNFTs(items!);
      }
    );
  }, [currentAccount]);

  return (
    <div>
      <Banner bannerImage={images.creatorbackground2} />
      <AuthorProfileCard currentAccount={currentAccount!} account={account} />
      <AuthorTaps
        setCollectiables={setCollectiables}
        setCreated={setCreated}
        setLike={setLike}
        setFollower={setFollower}
        setFollowing={setFollowing}
        currentAccount={currentAccount!}
      />

      <AuthorNFTCardBox
        collectiables={collectiables}
        created={created}
        like={like}
        follower={follower}
        following={following}
        nfts={nfts}
        myNFTs={myNFTs}
      />
      <Title
        heading="Những người sáng tạo nổi bật"
        paragraph="Nhấn vào biểu tượng nhạc và thưởng thức nhạc hoặc âm thanh NFT"
      />
      <div
        className={cn(
          "w-4/5tt mx-auto grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 mt-24 "
        )}
      >
        {followerArray.map((el, i) => (
          <FollowerTabCard key={i} i={i} el={el} />
        ))}
      </div>

      <Brand />
    </div>
  );
};

export default Author;

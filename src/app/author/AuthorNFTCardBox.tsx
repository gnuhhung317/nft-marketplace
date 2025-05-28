import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// INTERNAL IMPORT
import images from '@/img';
import FollowerTabCard from '@/components/FollowerTabCard';
import NFTCardTwo from '@/components/NFTCardTwo';
import { TMarketItem } from '@/types';

const AuthorNFTCardBox = ({
  collectiables,
  created,
  like,
  follower,
  following,
  nfts,
  myNFTs,
}: {
  collectiables: boolean,
  created: boolean,
  like: boolean,
  follower: boolean,
  following: boolean,
  nfts: TMarketItem[],
  myNFTs: TMarketItem[]
}) => {
  const followerArray = [
    {
      background: images.creatorbackground1,
      user: images.user1,
      seller: "d84ff74hf99999f9974hf774f99f",
    },
    {
      background: images.creatorbackground2,
      user: images.user2,
      seller: "d84ff74hf99999f9974hf774f99f",
    },
    {
      background: images.creatorbackground3,
      user: images.user3,
      seller: "d84ff74hf99999f9974hf774f99f",
    },
    {
      background: images.creatorbackground4,
      user: images.user4,
      seller: "d84ff74hf99999f9974hf774f99f",
    },
    {
      background: images.creatorbackground5,
      user: images.user5,
      seller: "d84ff74hf99999f9974hf774f99f",
    },
    {
      background: images.creatorbackground6,
      user: images.user6,
      seller: "d84ff74hf99999f9974hf774f99f",
    },
  ];

  const followingArray = [
    {
      background: images.creatorbackground3,
      user: images.user3,
      seller: "d84ff74hf99999f9974hf774f99f",
    },
    {
      background: images.creatorbackground4,
      user: images.user4,
      seller: "d84ff74hf99999f9974hf774f99f",
    },
    {
      background: images.creatorbackground5,
      user: images.user5,
      seller: "d84ff74hf99999f9974hf774f99f",
    },
    {
      background: images.creatorbackground6,
      user: images.user6,
      seller: "d84ff74hf99999f9974hf774f99f",
    },
    {
      background: images.creatorbackground1,
      user: images.user1,
      seller: "d84ff74hf99999f9974hf774f99f",
    },
  ];

  const renderEmptyState = (message: string) => (
    <div className="w-full text-center p-8 bg-gray-50 rounded-lg">
      <div className="mb-4 text-gray-400">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-700">{message}</h3>
    </div>
  );

  return (
    <div className={cn('w-full mb-[14rem]')}>
      {collectiables && (
        nfts.length > 0 ? <NFTCardTwo NFTs={nfts} /> : renderEmptyState("Không có NFT nào được hiển thị")
      )}
      {created && (
        myNFTs.length > 0 ? <NFTCardTwo NFTs={myNFTs} /> : renderEmptyState("Bạn chưa tạo NFT nào")
      )}
      {like && (
        nfts.length > 0 ? <NFTCardTwo NFTs={nfts} /> : renderEmptyState("Không có NFT nào được yêu thích")
      )}
      {follower && (
        followerArray.length > 0 ? (
          <div className={cn('mx-auto grid gap-8 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1')}>
            {followerArray.map((el, i) => (
              <FollowerTabCard key={i} i={i} el={el} />
            ))}
          </div>
        ) : renderEmptyState("Chưa có người theo dõi")
      )}
      {following && (
        followingArray.length > 0 ? (
          <div className={cn('mx-auto grid gap-8 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1')}>
            {followingArray.map((el, i) => (
              <FollowerTabCard key={i} i={i} el={el} />
            ))}
          </div>
        ) : renderEmptyState("Chưa theo dõi ai")
      )}
    </div>
  );
};

export default AuthorNFTCardBox;

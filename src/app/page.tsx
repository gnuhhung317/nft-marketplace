import BigNFTSilder from "@/components/BigNFTSilder";
import Brand from "@/components/Brand";
import Category from "@/components/Category";
import Collection from "@/components/Collection/Collection";
import FollowerTab from "@/components/FollowerTab";
import HeroSection from "@/components/HeroSection";
import Loader from "@/components/Loader";
import NFTCard from "@/components/NFTCard";
import Service from "@/components/Service";
import Slider from "@/components/Slider";
import Subscribe from "@/components/Subscribe";
import Title from "@/components/Title";
import Video from "@/components/Video";
import AudioLive from "@/components/AudioLive/AudioLive";
import { getNFTsByCategory } from '@/actions/NFT';
import Filter from '@/components/Filter';
import { Suspense } from "react";
import { NFT } from '@prisma/client';
import { MediaType } from '@/types/nft';
import { TMarketItem } from '@/types';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Home = async ({ searchParams }: Props) => {
  const resolvedParams = await searchParams;
  // Đảm bảo category là string trước khi sử dụng
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
  const { nfts, error } = await getNFTsByCategory(category);

  return (
    <div>
      <HeroSection />
      <Service />
      <BigNFTSilder />
      <Title
        heading="NFT Nổi Bật"
        paragraph="Khám phá những NFT xuất sắc nhất trong tất cả các lĩnh vực của cuộc sống."
      />
      <Filter />
      <Suspense fallback={<Loader />}>
        <div className="w-4/5tt mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : nfts.length === 0 ? (
            <p className="text-icons">Không tìm thấy NFT nào</p>
          ) : (
            nfts.map((nft: NFT) => {
              const marketItem: TMarketItem = {
                ...nft,
                mediaType: nft.mediaType as MediaType,
                thumbnailUrl: nft.thumbnailUrl || undefined,
                properties: nft.properties as TMarketItem['properties']
              };
              return <NFTCard key={nft.id} nft={marketItem} />;
            })
          )}
        </div>
      </Suspense>
      <Title
        heading="Bộ Sưu Tập Âm Thanh"
        paragraph="Khám phá những NFT xuất sắc nhất trong tất cả các lĩnh vực của cuộc sống."
      />
      <AudioLive />
      <Suspense fallback={<Loader />}>
        <FollowerTab />
      </Suspense>
      <Slider />
      <Collection />
      <Title
        heading="Duyệt theo danh mục"
        paragraph="Khám phá các NFT trong những danh mục nổi bật nhất."
      />
      <Category />
      <Subscribe />
      <Brand />
      <Video />
    </div>
  );
};

export default Home;

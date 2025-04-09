import BigNFTSilder from "@/components/BigNFTSilder";
import Brand from "@/components/Brand";
import Category from "@/components/Category";
import Collection from "@/components/Collection/Collection";
import FollowerTab from "@/components/FollowerTab";
import HeroSection from "@/components/HeroSection";
import Loader from "@/components/Loader";
import NFTCard from "@/components/NTFCard";
import Service from "@/components/Service";
import Slider from "@/components/Slider";
import Subscribe from "@/components/Subscribe";
import Title from "@/components/Title";
import Video from "@/components/Video";
import AudioLive from "@/components/AudioLive/AudioLive";
import { TMarketItem } from "@/types";
import Filter from "@/components/Filter";
import { Suspense } from "react";

const Home = () => {

  return (
    <div >
      <HeroSection />
      <Service />
      <BigNFTSilder />
      <Title
        heading="NFT Nổi Bật"
        paragraph="Khám phá những NFT xuất sắc nhất trong tất cả các lĩnh vực của cuộc sống."
      />
      <Filter />
      <Suspense fallback={<Loader />}>
        <NFTCard />
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

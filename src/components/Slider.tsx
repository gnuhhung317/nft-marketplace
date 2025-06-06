'use client'
import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { TiArrowLeftThick, TiArrowRightThick } from "react-icons/ti";
import { cn } from "@/lib/utils";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import { MediaType } from "@/types/nft";
import { TMarketItem } from "@/types";
import { FaVideo } from "react-icons/fa";

//INTERNAL IMPORT
import SliderCard from "./SliderCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import EmptyState from "./EmptyState";

const LoadingState = () => (
  <div className="w-full flex flex-col items-center justify-center py-16 px-4 bg-main-bg rounded-2xl border border-icons/20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-icons mb-4"></div>
    <p className="text-icons text-lg">Đang tải Video NFT...</p>
  </div>
);

const ErrorState = () => (
  <div className="w-full flex flex-col items-center justify-center py-16 px-4 bg-main-bg rounded-2xl border border-red-500/20">
    <div className="text-red-500 text-5xl mb-4">!</div>
    <h3 className="text-2xl font-semibold text-red-500 mb-3">Có lỗi xảy ra</h3>
    <p className="text-gray-400 text-center max-w-md">
      Không thể tải danh sách Video NFT. Vui lòng thử lại sau.
    </p>
  </div>
);

const Slider = () => {
  const [videoNFTs, setVideoNFTs] = useState<TMarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const context = useContext(NFTMarketplaceContext);
  const leftSideRef = useRef<HTMLButtonElement>(null);
  const rightSideRef = useRef<HTMLButtonElement>(null);

  const loadVideoNFTs = useCallback(async () => {
    if (!context?.fetchNFTsByMediaType) {
      console.warn("fetchNFTsByMediaType không khả dụng");
      return;
    }
    
    try {
      setIsLoading(true);
      setHasError(false);
      const videos = await context.fetchNFTsByMediaType(MediaType.VIDEO);
      setVideoNFTs(videos);
    } catch (error) {
      console.error("Lỗi khi tải video NFTs:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [context?.fetchNFTsByMediaType]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!mounted) return;
      await loadVideoNFTs();
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [loadVideoNFTs]);

  const renderContent = useMemo(() => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (hasError) {
      return <ErrorState />;
    }

    if (videoNFTs.length === 0) {
      return <EmptyState type="video" variant="compact" />;
    }

    return videoNFTs.map((nft, i) => (
      <CarouselItem className="pl-1 md:basis-1/2 xl:basis-1/3 2xl:basis-1/4" key={nft.tokenId}>
        <SliderCard i={i} el={nft} />
      </CarouselItem>
    ));
  }, [isLoading, hasError, videoNFTs]);

  return (
    <div className={cn("w-full")}>
      <div className={cn("w-4/5tt mx-auto p-[0_-4rem_8rem_0] ")}>
        <h2 className={cn("text-6xl leading-none mb-5 md:text-4xl")}>Khám Phá Video NFT</h2>
        <div className={cn("flex justify-between items-center")}>
          <p>Nhấn vào biểu tượng phát & thưởng thức Video NFT</p>
          <div className={cn("flex items-center gap-8 text-4xl")}>
            <div
              className={cn("border border-icons p-2 rounded-full cursor-pointer transition-all duration-300 ease-in hover:bg-icons hover:text-main-bg hover:shadow-custom")}
              onClick={() => leftSideRef.current?.click()}
            >
              <TiArrowLeftThick />
            </div>
            <div
              className={cn("border border-icons p-2 rounded-full cursor-pointer transition-all duration-300 ease-in hover:bg-icons hover:text-main-bg hover:shadow-custom")}
              onClick={() => rightSideRef.current?.click()}
            >
              <TiArrowRightThick />
            </div>
          </div>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full">
          <CarouselContent className="-ml-4">
            {renderContent}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 invisible" ref={leftSideRef} />
          <CarouselNext className="absolute left-0 invisible" ref={rightSideRef} />
        </Carousel>

        {/* <motion.div className={cn("w-full overflow-hidden")} ref={dragSlider}>
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            className={cn("grid grid-cols-6 gap-4 p-16 cursor-grab md:grid-cols-6 md:gap-2 md:p-16")}
          >

          </motion.div>
        </motion.div> */}
      </div>
    </div>
  );
};

export default React.memo(Slider);

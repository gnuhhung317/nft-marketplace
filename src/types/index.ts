import { LikeSchema } from "@/scheme";
import { ZodError, z } from "zod";
import { NFT } from "@prisma/client";
import { MediaType } from "@/types/nft";

export type TMarketItem = {
  id: number;
  tokenId: string;
  seller: string;
  owner: string;
  price: string;
  sold: boolean;
  tokenURI: string;
  name: string;
  mediaUrl: string;
  mediaType: MediaType;
  thumbnailUrl?: string;
  description: string;
  category: string;
  properties?: {
    fileSize?: string;
    duration?: string;
    format?: string;
    [key: string]: string | undefined;
  };
  accountId: number | null;
  accountAddress: string;
  createAt: Date;
  updatedAt: Date;
  likes?: {
    id: number;
    accountAddress: string;
    liked: "0" | "1" | "-1";
    nFTTokenId?: string;
  }[];
};

export type TLike = z.infer<typeof LikeSchema>;

export type TResponseData = {
  success: Boolean;
  error?: string | ZodError | unknown;
  data?: any;
};

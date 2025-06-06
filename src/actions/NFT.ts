"use server";
import { z } from "zod";
import { TMarketItem } from "@/types";
import { AccountSchema, NFTSchema } from "@/scheme";
import { db } from "@/db/prisma";
import { useId } from "react";
import { Optional } from "@prisma/client/runtime/library";
import axios from "axios";
import { existAccountByAccountAddress } from "./Account";
import { revalidateTag } from "next/cache";

export const create2 = async (params: any) => {
  const { data: validData, success } = NFTSchema.safeParse(params);
  console.log(validData);
  return {
    success: true,
    data: params,
  };
};
export async function createNewNFT(data: z.infer<typeof NFTSchema>) {
  try {
    const { data: validData, success } = NFTSchema.safeParse(data);
    if (!success) {
      return {
        error: "Error: nft parameter has some problem",
        success: false,
      };
    }

    const account = await existAccountByAccountAddress(validData.seller);
    if (account == null) {
      return {
        error: "Error: query account has problem",
        success: false,
      };
    }

    // Lấy metadata từ tokenURI
    const { data: imageData } = await axios.get(validData.tokenURI);
    
    // Kiểm tra cấu trúc của imageData
    if (!imageData || typeof imageData !== 'object') {
      return {
        error: "Lỗi: Metadata không hợp lệ",
        success: false,
      };
    }

    if (!imageData.image) {
      return {
        error: "Lỗi: Không tìm thấy URL hình ảnh trong metadata",
        success: false,
      };
    }
    
    // Xác định mediaType dựa trên phần mở rộng của file
    const fileExtension = imageData.image.split('.').pop()?.toLowerCase();
    let mediaType = 'image';
    if (['mp3', 'wav', 'ogg'].includes(fileExtension || '')) {
      mediaType = 'audio';
    } else if (['mp4', 'webm', 'mov'].includes(fileExtension || '')) {
      mediaType = 'video';
    }

    const res = await db.nFT.create({
      data: {
        tokenId: validData.tokenId,
        seller: validData.seller,
        owner: validData.owner,
        price: validData.price,
        sold: validData.sold,
        tokenURI: validData.tokenURI,
        category: imageData.category || 'digital',
        accountId: account.id,
        accountAddress: account.accountAddress,
        name: imageData.name,
        mediaUrl: imageData.image, // Đảm bảo mediaUrl được set từ image trong metadata
        description: imageData.description,
        mediaType: mediaType,
      },
    });

    return {
      success: true,
      data: JSON.stringify(res),
    };
  } catch (error) {
    console.error("Lỗi khi tạo NFT:", error);
    return {
      error: "Lỗi khi tạo NFT: " + error,
      success: false,
    };
  }
}

export const getLikes = async ({ tokenId }: { tokenId: string }) => {

  try {
    const likes = await db.like.findMany({
      where: { nFTTokenId: tokenId },
    });
    console.log(likes)
    return {
      success: true,
      data: JSON.parse(JSON.stringify(likes)),
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
};

export const LikeOrDislike = async ({
  tokenId,
  accountAddress,
}: {
  tokenId: string;
  accountAddress: string;
}) => {
  console.log(tokenId, accountAddress);
  let like = await db.like.findFirst({
    where: {
      nFTTokenId: tokenId,
      accountAddress: accountAddress,
    },
  });
  console.log(like);
  if (!like) {
    like = await db.like.create({
      data: {
        accountAddress: accountAddress,
        nFTTokenId: tokenId,
        liked: 0,
      },
    });
  }
  await db.like.update({
    where: {
      id: like.id,

    },
    data: {
      liked: like.liked === 0 ? 1 : 0,
    },
  });
  revalidateTag("Like");
  return {
    success: true,
    data: JSON.parse(JSON.stringify(like)),
  };
};

export const getNFTByTokenId = async (tokenId: string) => {
  try {
    const nft = await db.nFT.findUnique({
      where: {
        tokenId: tokenId
      }
    });

    if (!nft) {
      return {
        success: false,
        error: "Không thấy NFT"
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(nft))
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch NFT: " + error
    };
  }
};

type LikeType = 0 | 1; //0 disLike 1 like

export async function getNFTsByCategory(category?: string) {
  try {
    const nfts = await db.nFT.findMany({
      where: category ? { category } : {},
      orderBy: { createAt: 'desc' },
      include: {
        Account: true,
        likes: true
      }
    });

    return { nfts, error: null };
  } catch (error) {
    console.error("Lỗi khi lấy NFT theo danh mục:", error);
    return { nfts: [], error: "Không thể lấy danh sách NFT" };
  }
}

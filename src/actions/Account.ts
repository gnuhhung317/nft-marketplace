'use server'
import { z } from 'zod'
import { TMarketItem, TResponseData } from "@/types";
import { AccountSchema, NFTSchema } from '@/scheme';
import { db } from '@/db/prisma';
import { useId } from 'react';
import { Optional } from '@prisma/client/runtime/library';
import { Prisma, PrismaClient } from '@prisma/client';
import { revalidateTag } from "next/cache";



export async function UpdateAccount(params: z.infer<typeof AccountSchema>): Promise<TResponseData> {
  const { data, success, error } = AccountSchema.safeParse(params)
  if (!success) {
    return {
      success: false,
      error: error.message
    }
  }
  const account = await existAccountByAccountAddress(params.accountAddress)
  if (account == null) {
    return {
      success: false,
      error: 'Error: update account failure'
    }
  }
  try {
    const { avatar, username, email, description, website, facebook, twitter, instagram, } = data
    await db.account.update({
      where: {
        accountAddress: params.accountAddress
      },
      data: {
        avatar, username, email, description, website, facebook, twitter, instagram,
      }
    })
    return {
      success: true
    }
  } catch (error) {
    return {
      error: error,
      success: false
    }
  }

}


export async function existAccountByAccountAddress(accountAddress: string) {
  try {
    let account = await db.account.findUnique({
      where: {
        accountAddress: accountAddress,
      }
    })
    if (!account) {
      account = await db.account.create({
        data: {
          accountAddress: accountAddress,

        },
      });
    }
    return account
  } catch (error) {
    console.log('Error: query account has problem ', error)
    return null
  }

}

export const getAllUsers = async () => {
  try {
    const users = await db.account.findMany({
      select: {
        id: true,
        accountAddress: true,
        username: true,
        email: true,
        avatar: true,
        _count: {
          select: {
            nfts: true,
            likes: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(users))
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch users: " + error
    };
  }
};

export const getUserByAddress = async (address: string) => {
  try {
    const user = await db.account.findUnique({
      where: {
        accountAddress: address
      },
      select: {
        id: true,
        accountAddress: true,
        username: true,
        email: true,
        avatar: true,
        _count: {
          select: {
            nfts: true,
            likes: true
          }
        }
      }
    });

    if (!user) {
      return {
        success: false,
        error: "User not found"
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(user))
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch user: " + error
    };
  }
};

export const getTopCreators = async () => {
  try {
    const users = await db.account.findMany({
      select: {
        id: true,
        accountAddress: true,
        username: true,
        email: true,
        avatar: true,
        _count: {
          select: {
            nfts: true,
            likes: true
          }
        }
      },
      orderBy: {
        nfts: {
          _count: 'desc'
        }
      },
      take: 8
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(users))
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch top creators: " + error
    };
  }
};

export const getFollowingUsers = async (currentUserAddress: string) => {
  try {
    const following = await db.like.findMany({
      where: {
        accountAddress: currentUserAddress,
        liked: 1
      },
      select: {
        nFTTokenId: true
      }
    });

    const nftIds = following.map(f => f.nFTTokenId).filter((id): id is string => id !== null);

    const users = await db.account.findMany({
      where: {
        nfts: {
          some: {
            tokenId: {
              in: nftIds
            }
          }
        }
      },
      select: {
        id: true,
        accountAddress: true,
        username: true,
        email: true,
        avatar: true,
        _count: {
          select: {
            nfts: true,
            likes: true
          }
        }
      },
      take: 6
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(users))
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch following users: " + error
    };
  }
};

export const getNewUsers = async () => {
  try {
    const users = await db.account.findMany({
      select: {
        id: true,
        accountAddress: true,
        username: true,
        email: true,
        avatar: true,
        _count: {
          select: {
            nfts: true,
            likes: true
          }
        }
      },
      orderBy: {
        createAt: 'desc'
      },
      take: 8
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(users))
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch new users: " + error
    };
  }
};

export const getSellerByAddress = async (address: string) => {
  try {
    const seller = await db.account.findUnique({
      where: {
        accountAddress: address,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        accountAddress: true,
      },
    });

    if (!seller) {
      return {
        success: false,
        error: "Không tìm thấy người bán"
      };
    }

    return {
      success: true,
      data: seller
    };
  } catch (error) {
    return {
      success: false,
      error: "Lỗi server khi lấy thông tin người bán: " + error
    };
  }
};
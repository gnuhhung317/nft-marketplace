import { NextResponse } from "next/server";
import { db } from "@/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const seller = await db.account.findUnique({
      where: {
        accountAddress: address.toLowerCase(),
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        accountAddress: true,
      },
    });

    if (!seller) {
      return NextResponse.json(
        { error: "Không tìm thấy người bán" },
        { status: 404 }
      );
    }

    return NextResponse.json(seller);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người bán:", error);
    return NextResponse.json(
      { error: "Lỗi server khi lấy thông tin người bán" },
      { status: 500 }
    );
  }
} 
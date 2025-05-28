'use client'
import {
  RiUserFollowFill,
  RiUserUnfollowFill,
  RiAwardLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import FollowerTabCard from "@/components/FollowerTabCard";
import images from "@/img";
import { Button } from "./ui/button";
import React, { useState, useEffect, useContext, Suspense } from "react";
import { NFTMarketplaceContext } from "@/Context/NFTMarketplaceContext";
import { getTopCreators, getFollowingUsers, getNewUsers } from "@/actions/Account";

const FollowerTab = () => {
  const [tab, setTab] = useState("popular");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentAccount } = useContext(NFTMarketplaceContext)!;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let response;
        if (tab === "popular") {
          response = await getTopCreators();
        } else if (tab === "following") {
          if (!currentAccount) {
            response = { success: false, error: "No account connected" };
          } else {
            response = await getFollowingUsers(currentAccount);
          }
        } else {
          response = await getNewUsers();
        }

        if (response.success) {
          setUsers(response.data);
        } else {
          console.error("Failed to fetch users:", response.error);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [tab, currentAccount]);

  return (
    <div className={cn("w-full relative pb-52 padding-6 padding-0 sm:pb-24")}>
      <div className={cn("w-96 mx-auto pb-24 text-center sm:w-full")}>
        <h2 className={cn("text-3xl text-primary mb-16 font-bold")}>
          Danh Sách Những Người Sáng Tạo Hàng Đầu..
        </h2>
        <div
          className={cn(
            "bg-main-bg p-2 rounded-full flex justify-around gap-4 items-center text-1.2rem shadow-custom sm:text-1rem"
          )}
        >
          <Button
            className={cn(
              "bg-icons text-main-bg p-4 rounded-full cursor-pointer border-none",
              tab === "popular" ? "border" : "border-transparent"
            )}
            onClick={() => setTab("popular")}
          >
            <RiUserFollowFill /> Nổi Bật
          </Button>
          <Button
            className={cn(
              "bg-icons text-main-bg p-4 rounded-full cursor-pointer border-none",
              tab === "following" ? "border" : "border-transparent"
            )}
            onClick={() => setTab("following")}
          >
            <RiUserFollowFill /> Đang Theo Dõi
          </Button>
          <Button
            className={cn(
              "bg-icons text-main-bg p-4 rounded-full cursor-pointer border-none",
              tab === "news" ? "border" : "border-transparent"
            )}
            onClick={() => setTab("news")}
          >
            <RiAwardLine /> Đáng Chú Ý
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div
          className={cn(
            "w-4/5tt mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          )}
        >
          {users.map((user, i) => (
            <FollowerTabCard
              key={user.accountAddress}
              i={i}
              el={{
                background: user.avatar || images.creatorbackground1,
                user: user.avatar || images.user1,
                seller: user.accountAddress,
                total: user._count.nfts
              }}
            />
          ))}
        </div>
      )}

      <div className={cn("text-center")}>
        <div className={cn("mx-auto p-28")}>
          <Button className="mr-8">
            <a href="#">Hiện Thêm</a>
          </Button>
          <Button>
            <a href="#">Trở Thành Tác Giả</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FollowerTab;

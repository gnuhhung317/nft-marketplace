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
import AuthorProfileCard from "./AuthorProfileCard";
import AuthorTaps from "./AuthorTabs";
import { AccountContext } from "@/Context/AccountProvider";
import { getAllUsers } from "@/actions/Account";

const Author = () => {
  const [collectiables, setCollectiables] = useState(true);
  const [created, setCreated] = useState(false);
  const [like, setLike] = useState(false);
  const [follower, setFollower] = useState(false);
  const [following, setFollowing] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { currentAccount } = useContext(NFTMarketplaceContext)!;
  const { account } = useContext(AccountContext)!;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await getAllUsers();
        if (result.success) {
          // Lọc ra 6 user có nhiều NFTs nhất
          const sortedUsers = result.data
            .sort((a: any, b: any) => b._count.nfts - a._count.nfts)
            .slice(0, 6);
          setUsers(sortedUsers);
        } else {
          setError("Không thể tải danh sách người dùng");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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

      {error && (
        <div className="text-center p-4 mt-4 text-red-500 bg-red-50 rounded-md w-4/5 mx-auto">
          {error}
        </div>
      )}

      <Title
        heading="Những người sáng tạo nổi bật"
        paragraph="Nhấn vào biểu tượng nhạc và thưởng thức nhạc hoặc âm thanh NFT"
      />
      
      {loading ? (
        <div className="text-center py-10">Đang tải dữ liệu...</div>
      ) : (
        <div
          className={cn(
            "w-4/5 mx-auto grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 mt-24"
          )}
        >
          {users.length > 0 ? (
            users.map((user, i) => (
              <FollowerTabCard 
                key={user.id} 
                i={i} 
                el={{
                  background: images[`creatorbackground${(i % 6) + 1}`],
                  user: user.avatar || images[`user${(i % 6) + 1}`],
                  seller: user.accountAddress,
                  total: user._count.nfts,
                }} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">Không có dữ liệu người dùng để hiển thị</div>
          )}
        </div>
      )}

      <Brand />
    </div>
  );
};

export default Author;

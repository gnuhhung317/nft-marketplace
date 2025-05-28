import React, { Dispatch, SetStateAction, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { TiArrowSortedDown, TiArrowSortedUp, TiTick } from 'react-icons/ti';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import NFTCard from '@/components/NFTCard';
import { NFTMarketplaceContext } from '@/Context/NFTMarketplaceContext';
import { TMarketItem } from '@/types';
import { useSearchParams } from 'next/navigation';

const AuthorTabs = ({
  setCollectiables,
  setCreated,
  setLike,
  setFollower,
  setFollowing,
  currentAccount,
}: {
  setCollectiables: Dispatch<SetStateAction<boolean>>,
  setCreated: Dispatch<SetStateAction<boolean>>,
  setLike: Dispatch<SetStateAction<boolean>>,
  setFollower: Dispatch<SetStateAction<boolean>>,
  setFollowing: Dispatch<SetStateAction<boolean>>,
  currentAccount: string
}) => {
  // State Management
  const [openList, setOpenList] = useState(false);
  const [activeBtn, setActiveBtn] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState('Mới nhất');
  const [marketNFTs, setMarketNFTs] = useState<TMarketItem[]>([]);
  const [myNFTs, setMyNFTs] = useState<TMarketItem[]>([]);
  const [listedNFTs, setListedNFTs] = useState<TMarketItem[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(true);
  const [loadingMyNFTs, setLoadingMyNFTs] = useState(true);
  const [loadingListedNFTs, setLoadingListedNFTs] = useState(true);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const addressParam = searchParams.get('address');
  
  // Context
  const context = useContext(NFTMarketplaceContext);
  if (!context) {
    throw new Error("NFTMarketplaceContext must be used within a NFTMarketplaceProvider");
  }
  const { fetchNFTs, fetchMyNFTsOrListedNFTs } = context;

  const listArray = [
    'Mới nhất',
    'Giá cao nhất',
    'Giá thấp nhất',
    'Được yêu thích nhất',
    'Mới đăng gần đây',
  ];

  // Initial data loading - only run once on mount
  useEffect(() => {
    const loadMarketplaceNFTs = async () => {
      try {
        setLoadingMarket(true);
        setError("");
        
        console.log("Đang tải NFT thị trường...");
        const items = await fetchNFTs();
        console.log("Kết quả fetchNFTs:", items);
        setMarketNFTs(items || []);
      } catch (err) {
        console.error("Lỗi khi tải NFTs thị trường:", err);
        setError("Không thể tải dữ liệu NFT thị trường. Vui lòng thử lại sau.");
      } finally {
        setLoadingMarket(false);
      }
    };

    loadMarketplaceNFTs();
  }, []); // Empty dependency array since we only want to run once on mount
  
  // Load user data when connected or address param changes
  useEffect(() => {
    const loadUserNFTs = async () => {
      const targetAddress = addressParam || currentAccount;
      
      if (!targetAddress) {
        console.log("Không có địa chỉ để tải NFT");
        setLoadingMyNFTs(false);
        setLoadingListedNFTs(false);
        return;
      }
      
      try {
        setLoadingMyNFTs(true);
        setLoadingListedNFTs(true);
        setError("");
        
        // Fetch both owned and listed NFTs
        const [ownedItems, listedItems] = await Promise.all([
          fetchMyNFTsOrListedNFTs("owned"),
          fetchMyNFTsOrListedNFTs("fetchItemsListed")
        ]);
        
        console.log(`Đã tìm thấy ${ownedItems.length} NFT sở hữu và ${listedItems.length} NFT đang bán`);
        
        setMyNFTs(ownedItems || []);
        setListedNFTs(listedItems || []);
      } catch (err) {
        console.error("Lỗi khi tải NFTs:", err);
        setError("Không thể tải dữ liệu NFT. Vui lòng thử lại sau.");
      } finally {
        setLoadingMyNFTs(false);
        setLoadingListedNFTs(false);
      }
    };

    if (addressParam || currentAccount) {
      loadUserNFTs();
    }
  }, [addressParam, currentAccount]); // Only depend on address changes
  
  // Apply sorting based on selected menu
  useEffect(() => {
    const sortNFTs = (nfts: TMarketItem[]) => {
      const nftsCopy = [...nfts];
      
      switch (selectedMenu) {
        case 'Giá cao nhất':
          return nftsCopy.sort((a, b) => 
            parseFloat(b.price) - parseFloat(a.price)
          );
        case 'Giá thấp nhất':
          return nftsCopy.sort((a, b) => 
            parseFloat(a.price) - parseFloat(b.price)
          );
        case 'Mới đăng gần đây':
          return nftsCopy.sort((a, b) => 
            parseInt(b.tokenId || "0") - parseInt(a.tokenId || "0")
          );
        default:
          return nftsCopy;
      }
    };
    
    setMarketNFTs(prev => sortNFTs([...prev]));
    setMyNFTs(prev => sortNFTs([...prev]));
    setListedNFTs(prev => sortNFTs([...prev]));
  }, [selectedMenu]);

  const openTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btnText = (e.target as HTMLElement).innerText;
    const mapping: { [key: string]: () => void } = {
      'Thị trường': () => { 
        setCollectiables(true); setCreated(false); setFollower(false); 
        setFollowing(false); setLike(false); setActiveBtn(1); 
      },
      'NFT của tôi': () => { 
        setCollectiables(false); setCreated(true); setFollower(false); 
        setFollowing(false); setLike(false); setActiveBtn(2); 
      },
      'Đang theo dõi': () => { 
        setCollectiables(false); setCreated(false); setFollower(false); 
        setFollowing(true); setLike(false); setActiveBtn(3); 
      },
      'Người theo dõi': () => { 
        setCollectiables(false); setCreated(false); setFollower(true); 
        setFollowing(false); setLike(false); setActiveBtn(4); 
      },
    };
    mapping[btnText]?.();
  };

  const isTabLoading = () => {
    if (activeBtn === 1) return loadingMarket;
    if (activeBtn === 2) return loadingMyNFTs || loadingListedNFTs;
    return false;
  };

  const renderNFTGrid = (nfts: TMarketItem[], emptyMessage: string, isListed: boolean = false) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {nfts && nfts.length > 0 ? (
        nfts.map((nft, index) => (
          <NFTCard 
            key={`${isListed ? 'listed' : 'nft'}-${index}`} 
            nft={nft} 
            listedMode={isListed} 
          />
        ))
      ) : (
        <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
          <div className="mb-4 text-gray-400">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700">{emptyMessage}</h3>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn('mt-32 mb-12')}>
      <div className={cn('mx-auto w-4/5 lg:flex lg:justify-between')}>
        <div className={cn('flex gap-4 md:gap-8 items-center flex-wrap')}>
          {['Thị trường', 'NFT của tôi', 'Đang theo dõi', 'Người theo dõi'].map((btn, idx) => (
            <button
              key={idx}
              onClick={openTab}
              className={cn('border border-icons bg-main-bg text-[1rem] md:text-[1.2rem] whitespace-nowrap rounded-full py-1 md:py-2 px-3 md:px-4 cursor-pointer transition-all duration-300 ease-in text-icons', {
                'bg-icons text-main-bg': activeBtn === idx + 1,
                'hover:border-icons hover:bg-icons hover:text-main-bg': activeBtn !== idx + 1,
              })}
            >
              {btn}
            </button>
          ))}
        </div>
        <div className={cn('relative lg:mt-0 mt-8 z-[9]')}>
          <DropdownMenu onOpenChange={setOpenList}>
            <DropdownMenuTrigger className="flex border border-icons px-4 py-2 rounded-3xl items-center">
              <p className={cn('text-xl leading-none whitespace-nowrap mr-2')}>{selectedMenu}</p>
              {openList ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-main-bg border border-primary">
              <DropdownMenuSeparator />
              {listArray.map((el, i) => (
                <DropdownMenuItem key={i} className={cn('bg-main-bg w-64 left-[-0.75rem] shadow-custom z-9')}>
                  <div
                    onClick={() => { setSelectedMenu(el); setOpenList(false); }}
                    className={cn('flex items-center justify-between leading-none pr-4 p-4 cursor-pointer', 'hover:bg-icons hover:text-main-bg hover:rounded-sm')}
                  >
                    <p className={cn('px-4 line-height-1 cursor-pointer')}>{el}</p>
                    <span>{selectedMenu === el && <TiTick />}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {error && (
        <div className="mx-auto w-4/5 mt-8">
          <div className="text-center p-4 mt-4 text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        </div>
      )}
      
      <div className="mx-auto w-4/5 mt-8">
        {isTabLoading() ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-icons"></div>
            <p className="ml-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            {/* Thị trường NFT */}
            {activeBtn === 1 && renderNFTGrid(marketNFTs, 'Không có NFT nào trên thị trường', true)}
            
            {/* NFT của tôi/người dùng */}
            {activeBtn === 2 && (
              <>
                {(addressParam || currentAccount) ? (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">NFT Đang Sở Hữu</h2>
                      {renderNFTGrid(myNFTs, addressParam ? 'Địa chỉ này chưa sở hữu NFT nào' : 'Bạn chưa sở hữu NFT nào')}
                    </div>
                    {/* <div>
                      <h2 className="text-xl font-semibold mb-4">NFT Đang Bán</h2>
                      {renderNFTGrid(listedNFTs, addressParam ? 'Địa chỉ này chưa đăng bán NFT nào' : 'Bạn chưa đăng bán NFT nào', true)}
                    </div> */}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <div className="mb-4 text-gray-400">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">Vui lòng kết nối ví để xem NFT</h3>
                  </div>
                )}
              </>
            )}
            
            {/* Đang theo dõi */}
            {activeBtn === 3 && (
              <div className="bg-gray-50 text-center py-8 rounded-lg">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                <p className="text-primary text-lg mt-2">Chức năng đang được phát triển</p>
              </div>
            )}
            
            {/* Người theo dõi */}
            {activeBtn === 4 && (
              <div className="bg-gray-50 text-center py-8 rounded-lg">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                <p className="text-primary text-lg mt-2">Chức năng đang được phát triển</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthorTabs;

import React, { useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { NFTMarketplaceContext } from '@/Context/NFTMarketplaceContext';
import { AccountType } from '@/Context/AccountProvider';
import images from '@/img';

interface ProfileProps {
  currentAccount: string;
  account: AccountType;
}

const Profile: React.FC<ProfileProps> = ({ currentAccount, account }) => {
  const router = useRouter();
  const { disconnectWallet } = useContext(NFTMarketplaceContext)!;

  // Hiển thị 6 ký tự đầu và 4 ký tự cuối của địa chỉ ví
  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Image
          src={account.avatar || images.user1}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-main-bg border border-primary min-w-[200px]">
        <DropdownMenuLabel className="flex flex-col items-center py-3">
          <Image
            src={account.avatar || images.user1}
            alt="Profile"
            width={60}
            height={60}
            className="rounded-full object-cover mb-2"
          />
          <p className="text-base font-semibold">
            {account.username || 'Người dùng'}
          </p>
          <p className="text-sm text-gray-400">
            {currentAccount ? shortenAddress(currentAccount) : ''}
          </p>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuItem 
          onClick={() => router.push('/author')}
          className="cursor-pointer hover:bg-gray-800 py-2"
        >
          Hồ sơ của tôi
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => router.push('/account')}
          className="cursor-pointer hover:bg-gray-800 py-2"
        >
          Cài đặt tài khoản
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => router.push('/uploadNFT')}
          className="cursor-pointer hover:bg-gray-800 py-2"
        >
          Tạo NFT
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuItem 
          onClick={disconnectWallet}
          className="cursor-pointer hover:bg-gray-800 py-2 text-red-500"
        >
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile; 
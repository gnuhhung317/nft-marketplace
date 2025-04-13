import React, { useCallback, useContext, useState } from 'react';
import Image from 'next/image';
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext';
import { SUPPORTED_NETWORKS } from '../Context/constants';
import images from '@/img';
import { Button } from './ui/button';

const SwitchNetwork: React.FC = () => {
  const { setOpenSwitchNetwork } = useContext(NFTMarketplaceContext)!;
  const [selectedNetwork, setSelectedNetwork] = useState<'localhost' | 'amoy'>('localhost');
  
  const switchToNetwork = useCallback(async (networkType: 'localhost' | 'amoy') => {
    try {
      const network = networkType === 'localhost' 
        ? SUPPORTED_NETWORKS.LOCALHOST 
        : SUPPORTED_NETWORKS.POLYGON_AMOY;
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainIdHex }],
      });
      setOpenSwitchNetwork(false);
      console.log(`Switched to ${network.name} successfully`);
    } catch (switchError: any) {
      console.log(switchError);
      if (switchError.code === 4902) {
        try {
          // Network không tồn tại trong MetaMask, thêm vào
          const network = networkType === 'localhost' 
            ? SUPPORTED_NETWORKS.LOCALHOST 
            : SUPPORTED_NETWORKS.POLYGON_AMOY;
          
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainName: network.name,
              chainId: network.chainIdHex,
              rpcUrls: [network.rpcUrl],
              nativeCurrency: networkType === 'localhost' 
                ? { name: "ETH", symbol: "ETH", decimals: 18 }
                : { name: "MATIC", symbol: "MATIC", decimals: 18 },
              blockExplorerUrls: networkType === 'amoy' ? ['https://www.oklink.com/amoy'] : undefined
            }],
          });
          setOpenSwitchNetwork(false);
          console.log(`Added and switched to ${network.name} successfully`);
        } catch (addError) {
          console.error('Failed to add the network', addError);
        }
      } else {
        console.error('Failed to switch network', switchError);
      }
    }
  }, [setOpenSwitchNetwork]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[999999] cursor-pointer" onClick={() => setOpenSwitchNetwork(false)}>
      <div className="absolute top-1/2 left-1/2 bg-main-bg p-8 rounded-lg shadow-custom text-center max-w-md w-full transform -translate-x-1/2 -translate-y-1/2" 
           onClick={(e) => e.stopPropagation()}>
        <div>
          <Image
            alt="error"
            src={images.errorgif}
            width={200}
            height={200}
            className="object-cover mx-auto"
          />
          <p className="text-2xl text-icons my-4">Sai Mạng Blockchain</p>
          <p className="mb-4">Vui lòng chọn một trong các mạng được hỗ trợ:</p>
          
          <div className="flex flex-col gap-4 mb-6">
            <div 
              className={`p-4 border rounded-lg cursor-pointer ${selectedNetwork === 'localhost' ? 'border-primary bg-primary/10' : 'border-gray-500'}`}
              onClick={() => setSelectedNetwork('localhost')}
            >
              <p className="font-bold">Localhost (Hardhat)</p>
              <p className="text-sm">Dùng cho phát triển local</p>
            </div>
            
            <div 
              className={`p-4 border rounded-lg cursor-pointer ${selectedNetwork === 'amoy' ? 'border-primary bg-primary/10' : 'border-gray-500'}`}
              onClick={() => setSelectedNetwork('amoy')}
            >
              <p className="font-bold">Polygon Amoy Testnet</p>
              <p className="text-sm">Mạng thử nghiệm Polygon</p>
            </div>
          </div>
          
          <Button 
            onClick={() => switchToNetwork(selectedNetwork)} 
            className="px-6 py-2 w-full"
          >
            Chuyển sang {selectedNetwork === 'localhost' ? 'Localhost' : 'Polygon Amoy'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SwitchNetwork;

import React from 'react';
import { ethers } from 'ethers';
import { cn } from '@/lib/utils';
import { INFTMetadata } from '@/types/nft';

interface CreateNFTConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  metadata: INFTMetadata;
  listingFee: string;
  gasEstimate: string;
  userBalance: string;
}

const CreateNFTConfirmationModal: React.FC<CreateNFTConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  metadata,
  listingFee,
  gasEstimate,
  userBalance
}) => {
  if (!isOpen) return null;

  const totalCost = ethers.utils.parseEther(listingFee).add(ethers.utils.parseEther(gasEstimate));
  const hasEnoughBalance = ethers.utils.parseEther(userBalance || '0').gte(totalCost);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 w-[480px] shadow-2xl border border-gray-700/50 animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Xác nhận tạo NFT</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Tên NFT:</span>
            <span className="text-white font-medium">{metadata.name}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Giá niêm yết:</span>
            <span className="text-white font-medium">{metadata.price} ETH</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Phí niêm yết:</span>
            <span className="text-white font-medium">{listingFee} ETH</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Phí gas (ước tính):</span>
            <span className="text-white font-medium">{gasEstimate} ETH</span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
            <span className="text-gray-400">Tổng chi phí:</span>
            <span className="text-white font-bold">{ethers.utils.formatEther(totalCost)} ETH</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Số dư của bạn:</span>
            <span className="text-white font-medium">{userBalance} ETH</span>
          </div>
          
          {!hasEnoughBalance && (
            <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Số dư không đủ để thực hiện giao dịch
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={!hasEnoughBalance}
            className={cn(
              "px-6 py-2 rounded-lg font-semibold",
              "bg-icons text-main-bg hover:bg-main-bg hover:text-icons transition-colors duration-300",
              "border border-transparent hover:border-icons",
              !hasEnoughBalance && "opacity-50 cursor-not-allowed"
            )}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNFTConfirmationModal; 
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { TMarketItem } from '@/types';

interface BuyNFTConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nft: TMarketItem;
  userBalance: string;
  gasEstimate: string;
}

const BuyNFTConfirmationModal: React.FC<BuyNFTConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  nft,
  userBalance,
  gasEstimate,
}) => {
  if (!isOpen) return null;

  const totalCost = ethers.utils.parseEther(nft.price).add(ethers.utils.parseEther(gasEstimate));
  const hasEnoughBalance = ethers.utils.parseEther(userBalance || '0').gte(totalCost);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 w-[480px] shadow-2xl border border-gray-700/50 animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Xác nhận mua NFT</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Tên NFT:</span>
            <span className="text-white font-medium">{nft.name}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Giá NFT:</span>
            <span className="text-white font-medium">{nft.price} ETH</span>
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

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={!hasEnoughBalance}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              hasEnoughBalance
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Xác nhận mua
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyNFTConfirmationModal; 
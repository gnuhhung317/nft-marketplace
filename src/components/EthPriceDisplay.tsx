import React from 'react';
import useEthPrice from '@/hooks/useEthPrice';

interface EthPriceDisplayProps {
  ethAmount: string | number;
  className?: string;
}

const EthPriceDisplay: React.FC<EthPriceDisplayProps> = ({ ethAmount, className = '' }) => {
  const { price, isLoading, error } = useEthPrice();

  const calculateUsdValue = () => {
    const ethValue = typeof ethAmount === 'string' ? parseFloat(ethAmount) : ethAmount;
    return (ethValue * price).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (isLoading) {
    return <span className={`text-gray-400 ${className}`}>Đang tải giá...</span>;
  }

  if (error) {
    return <span className={`text-red-400 ${className}`}>Không thể lấy giá</span>;
  }

  return (
    <span className={className}>
      {ethAmount} ETH <span className="text-gray-400">(≈ {calculateUsdValue()})</span>
    </span>
  );
};

export default EthPriceDisplay; 
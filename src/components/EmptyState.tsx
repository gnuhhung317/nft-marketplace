import React from 'react';
import { FaVideo, FaImage, FaMusic } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { MediaType } from '@/types/nft';

interface EmptyStateProps {
  type?: 'video' | 'image' | 'audio' | 'all';
  className?: string;
  variant?: 'default' | 'compact';
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  type = 'all', 
  className,
  variant = 'default'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'video':
        return <FaVideo className="text-5xl text-icons mb-4" />;
      case 'image':
        return <FaImage className="text-5xl text-icons mb-4" />;
      case 'audio':
        return <FaMusic className="text-5xl text-icons mb-4" />;
      default:
        return <FaVideo className="text-5xl text-icons mb-4" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'video':
        return 'Không tìm thấy Video NFT';
      case 'image':
        return 'Không tìm thấy Ảnh NFT';
      case 'audio':
        return 'Không tìm thấy Âm nhạc NFT';
      default:
        return 'Không tìm thấy NFT';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'video':
        return 'Hiện tại chưa có Video NFT nào được đăng bán. Hãy quay lại sau hoặc tạo Video NFT đầu tiên của bạn!';
      case 'image':
        return 'Hiện tại chưa có Ảnh NFT nào được đăng bán. Hãy quay lại sau hoặc tạo Ảnh NFT đầu tiên của bạn!';
      case 'audio':
        return 'Hiện tại chưa có Âm nhạc NFT nào được đăng bán. Hãy quay lại sau hoặc tạo Âm nhạc NFT đầu tiên của bạn!';
      default:
        return 'Hiện tại chưa có NFT nào được đăng bán. Hãy quay lại sau hoặc tạo NFT đầu tiên của bạn!';
    }
  };

  if (variant === 'compact') {
    return (
      <div className={cn(
        "w-full flex flex-col items-center justify-center py-12 px-4",
        className
      )}>
        {getIcon()}
        <h3 className="text-xl font-semibold text-icons mb-2">{getTitle()}</h3>
        <p className="text-gray-400 text-center max-w-md text-sm">
          {getDescription()}
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full flex flex-col items-center justify-center py-16 px-4 bg-main-bg rounded-2xl border border-icons/20",
      className
    )}>
      {getIcon()}
      <h3 className="text-2xl font-semibold text-icons mb-3">{getTitle()}</h3>
      <p className="text-gray-400 text-center max-w-md">
        {getDescription()}
      </p>
    </div>
  );
};

export default EmptyState; 
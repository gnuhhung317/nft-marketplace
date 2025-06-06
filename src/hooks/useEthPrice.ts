import { useState, useEffect } from 'react';

interface EthPriceData {
  price: number;
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
}

const useEthPrice = (): EthPriceData => {
  const [priceData, setPriceData] = useState<EthPriceData>({
    price: 0,
    lastUpdated: new Date(),
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_last_updated_at=true'
        );
        
        if (!response.ok) {
          throw new Error('Không thể lấy giá ETH');
        }

        const data = await response.json();
        setPriceData({
          price: data.ethereum.usd,
          lastUpdated: new Date(data.ethereum.last_updated_at * 1000),
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setPriceData(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Lỗi không xác định',
        }));
      }
    };

    // Fetch ngay lập tức
    fetchEthPrice();

    // Cập nhật mỗi 1 phút
    const interval = setInterval(fetchEthPrice, 60000);

    return () => clearInterval(interval);
  }, []);

  return priceData;
};

export default useEthPrice; 
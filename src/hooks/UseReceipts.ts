import { useState } from 'react';
import api from '../api';
import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';

const UseReceipts = () => {
  interface ReceiptsData {
    data: any[];
    count: number;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<ReceiptsData>({ data: [], count: 0 });
  const [searchUserId, setSearchUserId] = useState('');
  const [receiptNo, setReceiptNo] = useState('');
  const [limit, setLimit] = useState(10);

  const { isLoading, error, refetch } = useQuery({
    queryKey: ['receiptsData', currentPage, limit],
    enabled: !!currentPage,
    queryFn: async () => {
      const res = await getReceiptsData();
      setData(res);
      return res;
    },
  });

  const handleViewDetails = (record: string) => {
    setSelectedReceipt(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReceipt(null);
  };

  const getReceiptsData = async () => {
    try {
      const res = await api.get(`/receipts/list?limit=${limit}&page=${currentPage}`);
      return res.data.status === 404 ? { data: [], count: 0 } : res.data;
    } catch (error) {
      console.error('Error fetching receipts data:', error);
      throw new Error('Failed to fetch receipts data');
    }
  };

  const handleSearch = async () => {
    try {
      let query = `/receipts/list?limit=${limit}&page=${currentPage}`;

      if (searchUserId.trim().length >= 4) {
        query += `&user_id=${searchUserId.trim()}`;
      } else if (receiptNo.trim().length >= 1) {
        query += `&receipt_no=${receiptNo.trim()}`;
      } else {
        const res = await getReceiptsData();
        setData(res);
        return;
      }

      const res = await api.get(query);
      setData(res.data);
    } catch (error) {
      if ((error as any)?.response?.status === 404) {
        setData({ data: [], count: 0 });
      } else {
        console.error('Search error:', error);
        message.error('Qidiruvda xatolik yuz berdi');
      }
    }
  };

  return {
    isModalOpen,
    selectedReceipt,
    handleViewDetails,
    handleCloseModal,
    data,
    isLoading,
    error,
    setCurrentPage,
    currentPage,
    handleSearch,
    searchUserId,
    setSearchUserId,
    receiptNo,
    setReceiptNo,
    refetch,
    limit,
    setLimit,
  };
};

export default UseReceipts;

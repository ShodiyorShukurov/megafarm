import { useState } from 'react';
import { IReceipt } from '../types/interface';
import api from '../api';
import { useQuery } from '@tanstack/react-query';

const UseReceipts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<IReceipt | null>(null);

  const handleViewDetails = (record: IReceipt) => {
    setSelectedReceipt(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReceipt(null);
  };

  const getReceiptsData = async () => {
    try {
      const res = await api.get('/receipts/list?limit=1&page=1');

      return res.data.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Failed to fetch user data');
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['receiptsData'],
    queryFn: getReceiptsData,
  });

  return {
    isModalOpen,
    selectedReceipt,
    handleViewDetails,
    handleCloseModal,
    data,
    isLoading,
    error,
  };
};

export default UseReceipts;

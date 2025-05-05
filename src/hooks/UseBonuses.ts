import { useState } from 'react';
import { IBonunes } from '../types/interface';
import api from '../api';
import { useQuery } from '@tanstack/react-query';

const UseBonuses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBonus, setSelectedBonus] = useState<IBonunes | null>(null);

  const handleViewDetails = (record: IBonunes) => {
    setSelectedBonus(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBonus(null);
  };

  const getBonusesData = async () => {
    try {
      const res = await api.get('/bonuses/list?limit=1&page=1');

      return res.data.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Failed to fetch user data');
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['bonusesData'],
    queryFn: getBonusesData,
  });

  return {
    isModalOpen,
    selectedBonus,
    handleViewDetails,
    handleCloseModal,
    data, isLoading, error
  };
};

export default UseBonuses;

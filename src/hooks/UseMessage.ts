import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { useState } from 'react';
import { message } from 'antd';

const UseMessage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({ data: [], count: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [isModalMessageOpen, setIsModalMessageOpen] = useState(false);

  const handleViewDetails = (id:string) => {
    setSelectedMessage(id);
    setIsModalMessageOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalMessageOpen(false);
    setSelectedMessage(null);
  };

  const getMessage = async () => {
    try {
      const res = await api.get(`/messages/list?limit=10&page=${currentPage}`);
      return res.data.status === 404 ? { data: [], count: 0 } : res.data;
    } catch (error) {
      console.error('Error fetching messages data:', error);
      throw new Error('Failed to fetch messages data');
    }
  };

  const queryClient = useQueryClient();

  const handleDeleteModal = async (id: string | null) => {
    if (!id) return;

    try {
      const res = await api.delete(`/message/delete/${id}`);
      if (res.data.status === 200) {
        message.success('User deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['messageData'] });
      }
      if (res.data.status === 400) {
        message.error('Failed to delete user!');
      }

      queryClient.invalidateQueries({ queryKey: ['messageData'] });
    } catch (error) {
      message.error('Failed to delete user!');
    }
  };

  const { isLoading, error } = useQuery({
    queryKey: ['messageData', currentPage],
    enabled: !!currentPage,
    queryFn: async () => {
      const res = await getMessage();
      setData(res);
      return res;
    },
  });

  return {
    isLoading,
    error,
    data,
    currentPage,
    setCurrentPage,
    isModalOpen,
    setIsModalOpen,
    handleViewDetails,
    handleCloseModal,
    selectedMessage,
    isModalMessageOpen,
    handleDeleteModal
  };
};

export default UseMessage;

import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { useState } from 'react';
import { message } from 'antd';
import { IAdmin } from '../types/interface';

const useAdmin = () => {
  interface AdminData {
    data: any[];
    count: number;
  }
  const [data, setData] = useState<AdminData>({ data: [], count: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<IAdmin | null>(null);

  const handleOpenFormModal = (admin: IAdmin | null) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setSelectedAdmin(null);
    setIsModalOpen(false);
  };

  const getAdmin = async () => {
    try {
      const res = await api.get(`/admin/list?limit=10&page=${currentPage}`);
      return res.data.status === 404 ? [] : res.data;
    } catch (error) {
      console.error('Error fetching admin data:', error);
      throw new Error('Failed to fetch admin data');
    }
  };

  const queryClient = useQueryClient();

  const handleDeleteModal = async (id: string | null) => {
    if (!id) return;

    const data = {
      admin_id: id,
    };

    try {
      const res = await api.delete(`/admin/delete`, { data });
      if (res.data.status === 200) {
        message.success('User deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['adminData'] });
      }
      if (res.data.status === 400) {
        message.error('Failed to delete user!');
      }

      queryClient.invalidateQueries({ queryKey: ['adminData'] });
    } catch (error) {
      message.error('Failed to delete user!');
    }
  };

  const { isLoading, error } = useQuery({
    queryKey: ['adminData', currentPage],

    queryFn: async () => {
      const res = await getAdmin();
      setData(res);
      return res;
    },
    enabled: !!currentPage,
  });

  return {
    data,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    handleDeleteModal,
    handleOpenFormModal,
    handleCloseFormModal,
    isModalOpen,
    selectedAdmin,
  };
};
export default useAdmin;

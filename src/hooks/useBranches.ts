import { useState } from 'react';
import api from '../api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, message } from 'antd';
import { IBranch } from '../types/interface';

const useBranches = () => {
  const [isModalMoreInfo, setIsModalMoreInfo] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null);
  const [selectedBranchMoreInfo, setSelectedBranchMoreInfo] = useState<
    number | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleOpenFormModal = (record: IBranch | null) => {
    setSelectedBranch(record);
    setIsModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsModalOpen(false);
    setSelectedBranch(null);
    form.resetFields();
  };

  const handleViewDetails = (record: number | null) => {
    setSelectedBranchMoreInfo(record);
    setIsModalMoreInfo(true);
  };

  const handleCloseModal = () => {
    setIsModalMoreInfo(false);
    setSelectedBranchMoreInfo(null);
  };

  const getBranchesData = async () => {
    try {
      const res = await api.get('/branches/list');

      return res.data.data;
    } catch (error) {
      if (error instanceof Error && (error as any).response && (error as any).response.status === 404) {
        return []; 
      }
      console.error('Error fetching user data:', error);
      throw new Error('Failed to fetch user data');
    }
  };

  const queryClient = useQueryClient();

  const handleDeleteModal = async (id: number | null) => {
    if (!id) return;

    try {
      const res = await api.delete(`/branch/delete/${id}`);
      if (res.data.status === 200) {
        message.success('User deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['branchesData'] });
      }
      if (res.data.status === 400) {
        message.error('Failed to delete user!');
      }

      queryClient.invalidateQueries({ queryKey: ['branchesData'] });
    } catch (error) {
      message.error('Failed to delete user!');
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['branchesData'],
    queryFn: getBranchesData,
  });

  return {
    isModalOpen,
    handleViewDetails,
    handleCloseModal,
    data,
    isLoading,
    error,
    isModalMoreInfo,
    selectedBranch,
    selectedBranchMoreInfo,
    handleCloseFormModal,
    handleOpenFormModal,
    handleDeleteModal,
  };
};

export default useBranches;

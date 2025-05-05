// UseUser.tsx
import React from 'react';
import { IUser } from '../types/interface';
import api from '../api';
import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';

const UseUser = () => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<IUser | null>(null);
  const [isUserMoreInfoOpen, setIsUserMoreInfoOpen] = React.useState(false);
  const [selectedUserMoreInfo, setSelectedUserMoreInfo] = React.useState<number | null>(null);
  const [searchPhone, setSearchPhone] = React.useState('');
  const [data, setData] = React.useState<IUser[]>([]);

  const { isLoading, error, refetch } = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const res = await getUserData();
      setData(res);
      return res;
    },
  });

  const getUserData = async () => {
    try {
      const res = await api.get('/users/list?limit=1&page=1');
      return res.status === 404 ? [] : res.data.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Failed to fetch user data');
    }
  };

  const handleSearch = async () => {
    if (searchPhone.trim().length < 4) {
      const res = await getUserData();
      setData(res);
      return;
    }

    try {
      const res = await api.get(`/users/list?limit=1&page=1&phone=${searchPhone}`);
      setData(res.data.data);
    } catch (error) {
      if ((error as any)?.response?.status === 404) {
        setData([]);
      } else {
        console.error('Error searching user:', error);
        message.error('Failed to search user');
      }
    }
  };

  const handleDeleteModal = async (id: number | null) => {
    if (!id) return;
    try {
      const res = await api.delete(`/user/delete/${id}`);
      if (res.status === 200) {
        message.success('User deleted successfully!');
        handleSearch(); // refresh after delete
      } else {
        message.error('Failed to delete user!');
      }
    } catch {
      message.error('Failed to delete user!');
    }
  };

  const handleOpenEditModal = (user: IUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleOpenUserMoreInfo = (user: number) => {
    setSelectedUserMoreInfo(user);
    setIsUserMoreInfoOpen(true);
  };

  const handleCloseUserMoreInfo = () => {
    setIsUserMoreInfoOpen(false);
    setSelectedUserMoreInfo(null);
  };

  return {
    isEditModalOpen,
    selectedUser,
    handleOpenEditModal,
    handleCloseEditModal,
    handleOpenUserMoreInfo,
    isUserMoreInfoOpen,
    selectedUserMoreInfo,
    handleCloseUserMoreInfo,
    handleDeleteModal,
    data,
    isLoading,
    error,
    searchPhone,
    setSearchPhone,
    handleSearch,
    refetch,
  };
};

export default UseUser;

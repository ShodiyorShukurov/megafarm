import { useQuery } from '@tanstack/react-query';
import api from '../api';

const UseDashboard = () => {

  
  const getDashboard = async () => {
    try {
      const res = await api.get(`/dashboard`);
      return res.data.status === 404 ? [] : res.data.data;
    } catch (error) {
      console.error('Error fetching messages data:', error);
      throw new Error('Failed to fetch messages data');
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: getDashboard,
  });

  return{
    data,
    isLoading,
    error,
  }
};

export default UseDashboard;

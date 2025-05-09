import { useQuery } from '@tanstack/react-query';
import api from '../api';

const useAdmin = () => {
  const getAdmin = async () => {
    try {
      const res = await api.get('/admin/list?limit=1&page=1');
      return res.data.status === 404 ? [] : res.data.data;
    } catch (error) {
      console.error('Error fetching admin data:', error);
      throw new Error('Failed to fetch admin data');
    }
  };


  const { data, isLoading, error } = useQuery({
    queryKey: ['adminData'],
    queryFn: getAdmin,
  });

    return {
        data,
        isLoading,
        error,
    };
};
export default useAdmin;

import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { useState } from "react";

const UseMessage = () => {
  
const [currentPage, setCurrentPage] = useState(1);
const [data, setData] = useState({ data: [], count: 0 });
const [isModalOpen, setIsModalOpen] = useState(false);

    const getMessage = async () => {
        try {
            const res = await api.get(`/messages/list?limit=10&page=${currentPage}`);
            return res.data.status === 404 ? { data: [], count: 0 } : res.data;
          } catch (error) {
            console.error('Error fetching messages data:', error);
            throw new Error('Failed to fetch messages data');
          }
    }


    const { isLoading, error } = useQuery({
        queryKey: ['messageData', currentPage],
        enabled: !!currentPage,
        queryFn: async () => {
          const res = await getMessage();
          setData(res);
          return res;
        },
      });

     return{
        isLoading,
        error,
        data,
        currentPage,
        setCurrentPage,
        isModalOpen,
        setIsModalOpen,
     }
}

export default UseMessage
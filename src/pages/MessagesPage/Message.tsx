import Admin from '../../components/Admin';
import UseMessage from '../../hooks/UseMessage';
import MessageModal from './components/MessageModal';

const Message = () => {
  const {
    // isLoading,
    // error,
    // data,
    // currentPage,
    // setCurrentPage,
    isModalOpen,
    setIsModalOpen,
  } = UseMessage();

  return (
    <Admin>
      <MessageModal 
        setIsModalOpen={setIsModalOpen} 
        isModalOpen={isModalOpen} 
      />
    </Admin>
  );
};

export default Message;

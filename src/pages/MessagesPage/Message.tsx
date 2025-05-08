import Admin from '../../components/Admin';
import UseMessage from '../../hooks/UseMessage';
import MessageModal from './components/MessageModal';
import MoreInfo from './components/MoreInfoModal';
import MessageData from './data/MessageData';

const Message = () => {
  const {
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
  } = UseMessage();

  if (isLoading) {
    return <Admin>Loading...</Admin>;
  }

  if (error) {
    return <Admin>Error: {error.message}</Admin>;
  }

  return (
    <Admin>
      <MessageModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
      <MessageData
        data={data.data}
        count={data.count}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleViewDetails={handleViewDetails}
        handleDeleteModal={handleDeleteModal}
      />
      <MoreInfo
        selectedMessage={selectedMessage}
        handleCloseModal={handleCloseModal}
        isModalMessageOpen={isModalMessageOpen}
      />
    </Admin>
  );
};

export default Message;

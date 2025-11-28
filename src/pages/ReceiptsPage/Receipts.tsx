import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Admin from '../../components/Admin';
import UseReceipts from '../../hooks/UseReceipts';
import MoreInfo from './components/MoreInfo';
import ReceiptsData from './data/ReceiptsData';

const Receipts = () => {
  const {
    isModalOpen,
    selectedReceipt,
    handleViewDetails,
    handleCloseModal,
    data,
    isLoading,
    error,
    setCurrentPage,
    currentPage,
    setSearchUserId,
    searchUserId,
    refetch,
    receiptNo,
    setReceiptNo,
    handleSearch,
    limit,
    setLimit,
  } = UseReceipts();

 

  if (isLoading) {
    return <Admin>Loading...</Admin>;
  }

  if (error) {
    return <Admin>Error: {error.message}</Admin>;
  }

  return (
    <Admin>
      <h1 className="text-2xl font-bold mb-6 text-center">Receipts</h1>
      <div className="flex gap-2 mb-4">
        <Input
          className="max-w-xs"
          placeholder="User ID"
          value={searchUserId}
          onChange={(e) => {
            const value = e.target.value;
            setSearchUserId(value);
            if (value.trim() === '') {
              refetch();
            }
          }}
          size="large"
          allowClear
          type="text"
          inputMode="numeric"
          pattern="\d*"
          onKeyDown={(e) => {
            if (
              !/[0-9]/.test(e.key) &&
              e.key !== 'Backspace' &&
              e.key !== 'Enter' &&
              e.key !== 'ArrowLeft' &&
              e.key !== 'ArrowRight'
            ) {
              e.preventDefault();
            }
          }}
        />
        <Input
          className="max-w-xs"
          placeholder="Receipt No"
          value={receiptNo}
          onChange={(e) => setReceiptNo(e.target.value.replace(/\D/, ''))}
          size="large"
          allowClear
          type="text"
          inputMode="numeric"
          pattern="\d*"
          onKeyDown={(e) => {
            if (
              !/[0-9]/.test(e.key) &&
              e.key !== 'Backspace' &&
              e.key !== 'Enter' &&
              e.key !== 'ArrowLeft' &&
              e.key !== 'ArrowRight'
            ) {
              e.preventDefault();
            }
          }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          size="large"
          onClick={handleSearch}
        >
          Qidirish
        </Button>
      </div>

      <ReceiptsData
        data={data.data}
        count={data.count}
        handleViewDetails={handleViewDetails}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        limit={limit}
        setLimit={setLimit}
      />

      <MoreInfo
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        selectedReceipt={selectedReceipt}
      />
    </Admin>
  );
};

export default Receipts;

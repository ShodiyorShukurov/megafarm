import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Admin from '../../components/Admin';
import UseBonuses from '../../hooks/UseBonuses';
import MoreInfo from './components/MoreInfo';
import BonusesData from './data/BonusesData';

const Bonuses = () => {
  const {
    isModalOpen,
    selectedBonus,
    handleViewDetails,
    handleCloseModal,
    data,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    searchUserId,
    setSearchUserId,
    receiptNo,
    setReceiptNo,
    refetch,
    handleSearch,
  } = UseBonuses();

  if (isLoading) {
    return <Admin>Loading...</Admin>;
  }

  if (error) {
    return <Admin>Error: {error.message}</Admin>;
  }

  return (
    <Admin>
      <h1 className="text-2xl font-bold mb-6 text-center">Bonuses</h1>
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
      <BonusesData
        data={data.data}
        count={data.count}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        handleViewDetails={handleViewDetails}
      />
      <MoreInfo
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        selectedBonus={selectedBonus}
      />
    </Admin>
  );
};

export default Bonuses;

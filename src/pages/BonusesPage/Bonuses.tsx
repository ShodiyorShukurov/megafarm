import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Admin from '../../components/Admin';
import UseBonuses from '../../hooks/UseBonuses';
import MoreInfo from './components/MoreInfo';
import BonusesData from './data/BonusesData';
import { useState } from 'react';

const Bonuses = () => {
  const {
    isModalOpen,
    selectedBonus,
    handleViewDetails,
    handleCloseModal,
    data,
    isLoading,
    error,
  } = UseBonuses();
console.log(data, isLoading, error);
  const [userId, setUserId] = useState('');
  const [receiptNo, setReceiptNo] = useState('');

  // Qidirish tugmasi bosilganda ishlaydigan funksiya (o'zingiz yozasiz)
  const handleSearch = () => {
    // userId va receiptNo qiymatlari bilan qidiruv funksiyasini yozing
  };

  return (
    <Admin>
      <h1 className="text-2xl font-bold mb-6 text-center">Bonuses</h1>
      <div className="flex gap-2 mb-4">
        <Input
          className="max-w-xs"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value.replace(/\D/, ''))}
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
      <BonusesData handleViewDetails={handleViewDetails} />
      <MoreInfo
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        selectedBonus={selectedBonus}
      />
    </Admin>
  );
};

export default Bonuses;

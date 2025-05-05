import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Admin from '../../components/Admin';
import UseUser from '../../hooks/UseUser';
import UserEditModal from './components/UserEditModal';
import UserMoreInfo from './components/UserMoreInfo';
import UserData from './data/UserData';

const Users = () => {
  const {
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
    refetch,
    handleSearch,
  } = UseUser();

  if (isLoading) {
    return <Admin>Loading...</Admin>;
  }

  if (error) {
    return <Admin>Error: {error.message}</Admin>;
  }

  return (
    <Admin>
      <h1 className="text-2xl font-bold mb-6 text-center">Users Data</h1>
      <div className="flex gap-2 mb-4">
        <Input
          className="max-w-xs"
          placeholder="Telefon raqamni kiriting"
          value={searchPhone}
          onChange={(e) => {
            const value = e.target.value;
            setSearchPhone(value);
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
        <Button
          type="primary"
          icon={<SearchOutlined />}
          size="large"
          onClick={handleSearch}
        >
          Qidirish
        </Button>
      </div>

      <UserData
        data={data}
        handleOpenEditModal={handleOpenEditModal}
        handleOpenUserMoreInfo={handleOpenUserMoreInfo}
        handleDeleteModal={handleDeleteModal}
      />

      <UserEditModal
        isEditModalOpen={isEditModalOpen}
        selectedUser={selectedUser}
        handleCloseEditModal={handleCloseEditModal}
      />

      <UserMoreInfo
        isUserMoreInfoOpen={isUserMoreInfoOpen}
        selectedUserMoreInfo={selectedUserMoreInfo}
        handleCloseUserMoreInfo={handleCloseUserMoreInfo}
      />
    </Admin>
  );
};

export default Users;

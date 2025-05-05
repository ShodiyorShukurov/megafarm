import Admin from '../../components/Admin';
import BranchesData from './data/BranchesData';
import BranchModal from './components/BranchModal';
import useBranches from '../../hooks/useBranches';
import BranchMoreInfo from './components/BranchMoreInfo';

const Branches = () => {
  const {
    isModalOpen,
    handleViewDetails,
    handleCloseModal,
    data,
    isLoading,
    error,
    isModalMoreInfo,
    selectedBranch,
    selectedBranchMoreInfo,
    handleCloseFormModal,
    handleOpenFormModal,
    handleDeleteModal
  } = useBranches();

  if (isLoading) {
    return <Admin>Loading...</Admin>;
  }

  if (error) {
    return <Admin>Error: {error.message}</Admin>;
  }

  return (
    <Admin>
      <BranchModal
        isModalOpen={isModalOpen}
        selectedBranch={selectedBranch}
        handleCloseFormModal={handleCloseFormModal}
        handleOpenFormModal={handleOpenFormModal}
      />
      <BranchesData
        data={data}
        handleViewDetails={handleViewDetails}
        handleOpenFormModal={handleOpenFormModal}
        handleDeleteModal={handleDeleteModal}
      />

      <BranchMoreInfo
        isModalMoreInfo={isModalMoreInfo}
        handleCloseModal={handleCloseModal}
        selectedBranchMoreInfo={selectedBranchMoreInfo}
      />
    </Admin>
  );
};

export default Branches;

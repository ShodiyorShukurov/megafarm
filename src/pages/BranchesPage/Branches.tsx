import Admin from '../../components/Admin'
import useBranches from '../../hooks/useBranches'
import BranchModal from './components/BranchModal'
import BranchMoreInfo from './components/BranchMoreInfo'
import BranchesData from './data/BranchesData'

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
		handleDeleteModal,
	} = useBranches()

	if (error) {
		return <Admin>Xato: {error.message}</Admin>
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
				isLoading={isLoading}
			/>

			<BranchMoreInfo
				isModalMoreInfo={isModalMoreInfo}
				handleCloseModal={handleCloseModal}
				selectedBranchMoreInfo={selectedBranchMoreInfo}
			/>
		</Admin>
	)
}

export default Branches

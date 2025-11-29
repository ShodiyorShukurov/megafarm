import Admin from '../../components/Admin'
import useAdmin from '../../hooks/UseAdmin'
import AdminModal from './components/AdminModal'
import AdminAddData from './data/AdminAddData'

const AdminAdd = () => {
	const {
		data,
		isLoading,
		error,
		currentPage,
		setCurrentPage,
		handleDeleteModal,
		handleOpenFormModal,
		handleCloseFormModal,
		isModalOpen,
		selectedAdmin,
	} = useAdmin()

	if (isLoading) {
		return <Admin>Yuklanmoqda...</Admin>
	}

	if (error) {
		return <Admin>Xato: {error.message}</Admin>
	}

	return (
		<Admin>
			<AdminModal
				isModalOpen={isModalOpen}
				handleOpenFormModal={handleOpenFormModal}
				selectedAdmin={selectedAdmin}
				handleCloseFormModal={handleCloseFormModal}
			/>

			<AdminAddData
				data={data.data}
				count={data.count}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				handleDeleteModal={handleDeleteModal}
				handleOpenFormModal={handleOpenFormModal}
			/>
		</Admin>
	)
}

export default AdminAdd

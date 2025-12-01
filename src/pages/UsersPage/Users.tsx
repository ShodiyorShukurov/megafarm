import { Card, Input, Typography } from 'antd'
import Admin from '../../components/Admin'
import UseUser from '../../hooks/UseUser'
import UserEditModal from './components/UserEditModal'
import UserMoreInfo from './components/UserMoreInfo'
import UserData from './data/UserData'

const { Text } = Typography

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
		currentPage,
		setCurrentPage,
		limit,
		setLimit,
		userId,
		setUserId,
	} = UseUser()

	if (error) {
		return <Admin>Error: {error.message}</Admin>
	}

	return (
		<Admin>
			<h1 className='text-2xl font-bold mb-6 text-center'>Foydalanuvchilar</h1>
			<div className='flex gap-2 mb-4 justify-between items-center'>
				<div className='flex gap-2'>
					<Input
						className='max-w-xs'
						placeholder='Telefon raqamni kiriting'
						value={searchPhone}
						onChange={e => {
							const value = e.target.value
							setSearchPhone(value)
						}}
						size='large'
						allowClear
						type='text'
						inputMode='numeric'
						pattern='\d*'
					/>
					<Input
						className='max-w-xs'
						placeholder='Foydalanuvchi ID sini kiriting'
						value={userId !== null ? userId : ''}
						onChange={e => {
							const value = e.target.value
							const numericValue = value === '' ? null : Number(value)
							setUserId(numericValue)
						}}
						size='large'
						allowClear
						type='text'
						inputMode='numeric'
						pattern='\d*'
					/>
				</div>
				<Card
					style={{
						background: '#f0f2f5',
						borderRadius: '8px',
						padding: '8px 16px',
					}}
					bodyStyle={{ padding: 0 }}
				>
					<Text strong>Jami foydalanuvchilar: </Text>
					<Text type='success'>{data.count}</Text>
				</Card>
			</div>

			<UserData
				data={data.data}
				count={data.count}
				handleOpenEditModal={handleOpenEditModal}
				handleOpenUserMoreInfo={handleOpenUserMoreInfo}
				handleDeleteModal={handleDeleteModal}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				limit={limit}
				setLimit={setLimit}
				isLoading={isLoading}
			/>

			<UserEditModal
				isEditModalOpen={isEditModalOpen}
				selectedUser={selectedUser}
				handleCloseEditModal={handleCloseEditModal}
			/>

			<UserMoreInfo
				isUserMoreInfoOpen={isUserMoreInfoOpen}
				selectedUserMoreInfo={selectedUserMoreInfo || null}
				handleCloseUserMoreInfo={handleCloseUserMoreInfo}
			/>
		</Admin>
	)
}

export default Users

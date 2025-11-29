import { Input } from 'antd'
import Admin from '../../components/Admin'
import UseBonuses from '../../hooks/UseBonuses'
import MoreInfo from './components/MoreInfo'
import BonusesData from './data/BonusesData'

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
		limit,
		setLimit,
	} = UseBonuses()

	if (error) {
		return <Admin>Error: {error.message}</Admin>
	}

	return (
		<Admin>
			<h1 className='text-2xl font-bold mb-6 text-center'>Bonuslar</h1>
			<div className='flex gap-2 mb-4'>
				<Input
					className='max-w-xs'
					placeholder='Foydalanuvchi ID'
					value={searchUserId}
					onChange={e => {
						const value = e.target.value
						setSearchUserId(value)
						if (value.trim() === '') {
							refetch()
						}
					}}
					size='large'
					allowClear
					type='text'
					inputMode='numeric'
					pattern='\d*'
				/>
				<Input
					className='max-w-xs'
					placeholder='Kvitansiya raqami'
					value={receiptNo}
					onChange={e => setReceiptNo(e.target.value.replace(/\D/, ''))}
					size='large'
					allowClear
					type='text'
					inputMode='numeric'
					pattern='\d*'
				/>
			</div>
			<BonusesData
				data={data.data}
				count={data.total}
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
				handleViewDetails={handleViewDetails}
				limit={limit}
				setLimit={setLimit}
				isLoading={isLoading}
			/>
			<MoreInfo
				isModalOpen={isModalOpen}
				handleCloseModal={handleCloseModal}
				selectedBonus={selectedBonus}
			/>
		</Admin>
	)
}

export default Bonuses

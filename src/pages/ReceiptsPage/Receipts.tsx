import { Input } from 'antd'
import Admin from '../../components/Admin'
import UseReceipts from '../../hooks/UseReceipts'
import MoreInfo from './components/MoreInfo'
import ReceiptsData from './data/ReceiptsData'

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
		limit,
		setLimit,
	} = UseReceipts()

	if (error) {
		return <Admin>Error: {error.message}</Admin>
	}

	return (
		<Admin>
			<h1 className='text-2xl font-bold mb-6 text-center'>Kvitansiyalar</h1>
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

			<ReceiptsData
				data={data.data}
				count={data.count}
				handleViewDetails={handleViewDetails}
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
				limit={limit}
				setLimit={setLimit}
				isLoading={isLoading}
			/>

			<MoreInfo
				isModalOpen={isModalOpen}
				handleCloseModal={handleCloseModal}
				selectedReceipt={selectedReceipt}
			/>
		</Admin>
	)
}

export default Receipts

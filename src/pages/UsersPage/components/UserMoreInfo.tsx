import { InfoCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Descriptions, Image, Modal, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import api from '../../../api'
import { IItem, IPayment, IReceipt } from '../../../types/interface'

interface UserMoreInfoProps {
	isUserMoreInfoOpen: boolean
	selectedUserMoreInfo: { id: number; chat_id: number } | null
	handleCloseUserMoreInfo: () => void
}

const UserMoreInfo: React.FC<UserMoreInfoProps> = ({
	isUserMoreInfoOpen,
	selectedUserMoreInfo,
	handleCloseUserMoreInfo,
}) => {
	const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
	const [selectedTransaction, setSelectedTransaction] =
		useState<IReceipt | null>(null)
	const [currentPage, setCurrentPage] = useState(1)

	const getUserMoreInfo = async () => {
		if (!selectedUserMoreInfo?.id) return null
		try {
			const res = await api.get(`/user/${selectedUserMoreInfo?.id}`)
			return res.data.data
		} catch (error) {
			console.error('Error fetching user more info:', error)
			if (
				error instanceof Error &&
				(error as any).response &&
				(error as any).response.status === 404
			) {
				return []
			}
			return []
		}
	}

	const getUserTransactions = async () => {
		if (!selectedUserMoreInfo?.chat_id) return null
		try {
			const res = await api.get(
				`/receipts/list?limit=10&page=${currentPage}&user_id=${selectedUserMoreInfo?.chat_id}`
			)
			return res.data
		} catch (error) {
			console.error('Error fetching user transactions:', error)
			if (
				error instanceof Error &&
				(error as any).response &&
				(error as any).response.status === 404
			) {
				return []
			}
			return []
		}
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ['userMoreInfo', selectedUserMoreInfo?.id],
		queryFn: getUserMoreInfo,
		enabled: !!selectedUserMoreInfo?.id,
	})

	const {
		data: userTransactionData,
		isLoading: userTransactionLoading,
		error: userTransactionError,
	} = useQuery({
		queryKey: [
			'userTransactionInfo',
			selectedUserMoreInfo?.chat_id,
			currentPage,
		],
		queryFn: getUserTransactions,
		enabled: !!selectedUserMoreInfo?.chat_id,
	})

	const handleViewTransactionDetails = (record: IReceipt) => {
		setSelectedTransaction(record)
		setIsTransactionModalOpen(true)
	}

	const handleCloseTransactionModal = () => {
		setIsTransactionModalOpen(false)
		setSelectedTransaction(null)
	}

	const transactionColumns: ColumnsType<IReceipt> = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			align: 'center',
		},
		{
			title: 'Kvitansiya raqami',
			dataIndex: 'receipt_no',
			key: 'receipt_no',
			align: 'center',
		},
		{
			title: 'Turi',
			dataIndex: 'type',
			key: 'type',
			align: 'center',
		},
		{
			title: 'Filial',
			dataIndex: 'branch',
			key: 'branch',
			align: 'center',
		},
		{
			title: 'Sana',
			dataIndex: 'date',
			key: 'date',
			render: date => new Date(date).toLocaleString(),
			align: 'center',
		},
		{
			title: 'Summa',
			dataIndex: 'amount',
			key: 'amount',
			render: value => `${parseFloat(value).toLocaleString()} UZS`,
			align: 'center',
		},
		{
			title: 'Yaratilgan vaqt',
			dataIndex: 'created_at',
			key: 'created_at',
			render: date => new Date(date).toLocaleString(),
			align: 'center',
		},
		{
			title: 'Amallar',
			key: 'actions',
			align: 'center',
			render: (_, record) => (
				<Button
					type='primary'
					icon={<InfoCircleOutlined />}
					onClick={() => handleViewTransactionDetails(record)}
				>
					Ko'rish
				</Button>
			),
		},
	]

	const paymentColumns: ColumnsType<IPayment> = [
		{
			title: "To'lov usuli",
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Qiymat',
			dataIndex: 'value',
			key: 'value',
			render: value => `${value.toLocaleString()} UZS`,
		},
	]

	const itemColumns: ColumnsType<IItem> = [
		{
			title: 'Nomi',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Miqdori',
			dataIndex: 'qty',
			key: 'qty',
		},
		{
			title: 'Narx',
			dataIndex: 'price',
			key: 'price',
			render: value => `${value.toLocaleString()} UZS`,
		},
		{
			title: 'Chegirma',
			dataIndex: 'discount',
			key: 'discount',
			render: value => `${value.toLocaleString()} UZS`,
		},
	]

	if (isLoading || userTransactionLoading) {
		return <div>Yuklanmoqda...</div>
	}

	if (error || userTransactionError) {
		return <div>Foydalanuvchi ma'lumotini yuklashda xato</div>
	}

	return (
		<>
			<Modal
				open={isUserMoreInfoOpen}
				onCancel={handleCloseUserMoreInfo}
				title={
					<div className='flex items-center'>
						<InfoCircleOutlined className='text-blue-500 mr-2' />
						Foydalanuvchi tafsilotlari
					</div>
				}
				footer={
					<div className='flex justify-end'>
						<Button type='primary' onClick={handleCloseUserMoreInfo}>
							Yopish
						</Button>
					</div>
				}
				centered
				width={800}
				className='rounded-lg'
			>
				<Descriptions column={1} bordered className='mb-6'>
					<Descriptions.Item label='ID'>{data?.id}</Descriptions.Item>
					<Descriptions.Item label='Ismi'>{data?.name}</Descriptions.Item>
					<Descriptions.Item label='Telefon raqami'>
						<a href={'tel:' + data?.phone_number}>{data?.phone_number}</a>
					</Descriptions.Item>
					<Descriptions.Item label='Kod'>{data?.code}</Descriptions.Item>
					<Descriptions.Item label='Balans'>{data?.balance}</Descriptions.Item>
					<Descriptions.Item label='QR kod'>
						<Image
							src={data?.qrcode_image_url}
							alt='QR Code'
							width={100}
							height={100}
							preview
						/>
					</Descriptions.Item>
					<Descriptions.Item label='Chat ID'>{data?.chat_id}</Descriptions.Item>
					<Descriptions.Item label='Bot tili'>
						<Tag color='green'>{data?.bot_lang.toUpperCase()}</Tag>
					</Descriptions.Item>
					<Descriptions.Item label='Bot bosqichi'>
						{data?.bot_step}
					</Descriptions.Item>
					<Descriptions.Item label='Yaratilgan vaqt'>
						{new Date(data?.created_at).toLocaleString()}
					</Descriptions.Item>
				</Descriptions>
				<h3 className='text-lg font-semibold mb-4'>Tranzaksiyalar</h3>
				<Table
					columns={transactionColumns}
					dataSource={userTransactionData?.data}
					rowKey='id'
					pagination={{
						current: currentPage,
						pageSize: 10,
						total: userTransactionData?.count,
						onChange: page => setCurrentPage(page),
					}}
					scroll={{ x: 1000 }}
					className='shadow-lg rounded-lg'
				/>
			</Modal>
			<Modal
				title={
					<div className='flex items-center'>
						<InfoCircleOutlined className='text-blue-500 mr-2' />
						Tranzaksiya tafsilotlari
					</div>
				}
				open={isTransactionModalOpen}
				onCancel={handleCloseTransactionModal}
				footer={
					<div className='flex justify-end'>
						<Button type='primary' onClick={handleCloseTransactionModal}>
							Yopish
						</Button>
					</div>
				}
				centered
				width={600}
				className='rounded-lg'
			>
				{selectedTransaction && (
					<div>
						<Descriptions column={1} bordered className='mb-6'>
							<Descriptions.Item label='ID'>
								{selectedTransaction.id}
							</Descriptions.Item>
							<Descriptions.Item label='Kvitansiya raqami'>
								{selectedTransaction.receipt_no}
							</Descriptions.Item>
							<Descriptions.Item label='Turi'>
								{selectedTransaction.type}
							</Descriptions.Item>
							<Descriptions.Item label='Foydalanuvchi ID'>
								{selectedTransaction.user_id}
							</Descriptions.Item>
							<Descriptions.Item label='Filial'>
								{selectedTransaction.branch}
							</Descriptions.Item>
							<Descriptions.Item label='Sana'>
								{new Date(selectedTransaction.date).toLocaleString()}
							</Descriptions.Item>
							<Descriptions.Item label='Summa'>
								{parseFloat(selectedTransaction.amount).toLocaleString()} UZS
							</Descriptions.Item>
							<Descriptions.Item label='Yaratilgan vaqt'>
								{new Date(selectedTransaction.created_at).toLocaleString()}
							</Descriptions.Item>
						</Descriptions>
						<h3 className='text-lg font-semibold mb-4'>To'lovlar</h3>
						<Table
							columns={paymentColumns}
							dataSource={selectedTransaction.payments}
							rowKey='name'
							pagination={false}
							size='small'
						/>
						<h3 className='text-lg font-semibold mb-4 mt-6'>Mahsulotlar</h3>
						<Table
							columns={itemColumns}
							dataSource={selectedTransaction.items}
							rowKey='name'
							pagination={false}
							size='small'
						/>
					</div>
				)}
			</Modal>
		</>
	)
}

export default UserMoreInfo

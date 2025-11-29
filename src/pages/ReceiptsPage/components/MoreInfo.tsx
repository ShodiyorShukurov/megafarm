import { InfoCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Descriptions, Modal, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import api from '../../../api'
import { IItem, IPayment } from '../../../types/interface'

interface MoreInfoProps {
	isModalOpen: boolean
	selectedReceipt: string | null
	handleCloseModal: () => void
}

const MoreInfo: React.FC<MoreInfoProps> = ({
	isModalOpen,
	selectedReceipt,
	handleCloseModal,
}) => {
	const getReceipDetails = async () => {
		if (!selectedReceipt) return null
		try {
			const res = await api.get(`/receipt/${selectedReceipt}`)

			return res.data.data
		} catch (error) {
			console.error('Error fetching receipt details:', error)
			throw new Error('Failed to fetch receipt details')
		}
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ['receiptData', selectedReceipt],
		queryFn: getReceipDetails,
	})

	if (isLoading)
		return (
			<Modal
				title={
					<div className='flex items-center'>
						<InfoCircleOutlined className='text-blue-500 mr-2' />
						Kvitansiya tafsilotlari
					</div>
				}
				open={isModalOpen}
				onCancel={handleCloseModal}
				footer={
					<div className='flex justify-end'>
						<Button type='primary' onClick={handleCloseModal}>
							Yopish
						</Button>
					</div>
				}
				centered
				width={600}
				className='rounded-lg'
			>
				Yuklanmoqda...
			</Modal>
		)

	if (error)
		return (
			<Modal
				title={
					<div className='flex items-center'>
						<InfoCircleOutlined className='text-blue-500 mr-2' />
						Kvitansiya tafsilotlari
					</div>
				}
				open={isModalOpen}
				onCancel={handleCloseModal}
				footer={
					<div className='flex justify-end'>
						<Button type='primary' onClick={handleCloseModal}>
							Yopish
						</Button>
					</div>
				}
				centered
				width={600}
				className='rounded-lg'
			>
				Xato: {error.message}
			</Modal>
		)

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
			title: '№',
			dataIndex: 'index',
			key: 'index',
			render: (_, __, index) => index + 1,
		},
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
			title: 'Chegirma',
			dataIndex: 'discount',
			key: 'discount',
		},
		{
			title: 'Narx',
			dataIndex: 'price',
			key: 'price',
			render: value => `${value.toLocaleString()} UZS`,
		},
	]

	return (
		<Modal
			title={
				<div className='flex items-center'>
					<InfoCircleOutlined className='text-blue-500 mr-2' />
					Kvitansiya tafsilotlari
				</div>
			}
			open={isModalOpen}
			onCancel={handleCloseModal}
			footer={
				<div className='flex justify-end'>
					<Button type='primary' onClick={handleCloseModal}>
						Yopish
					</Button>
				</div>
			}
			centered
			width={600}
			className='rounded-lg'
		>
			{data && (
				<div>
					<Descriptions column={1} bordered>
						<Descriptions.Item label='ID'>{data.id}</Descriptions.Item>
						<Descriptions.Item label='Kvitansiya raqami'>
							{data.receipt_no}
						</Descriptions.Item>
						<Descriptions.Item label='Turi'>{data.type}</Descriptions.Item>
						<Descriptions.Item label='Foydalanuvchi ID'>
							{data.user_id}
						</Descriptions.Item>
						<Descriptions.Item label='Filial'>{data.branch}</Descriptions.Item>
						<Descriptions.Item label='Sana'>{data.date}</Descriptions.Item>
						<Descriptions.Item label='Summa'>
							{data.amount.toLocaleString()} UZS
						</Descriptions.Item>
						<Descriptions.Item label='Yaratilgan vaqt'>
							{new Date(data.created_at).toLocaleString()}
						</Descriptions.Item>
					</Descriptions>
					<h3 className='text-lg font-semibold mt-6 mb-4'>To&apos;lovlar</h3>
					<Table
						columns={paymentColumns}
						dataSource={data.payments}
						rowKey='name'
						pagination={false}
						size='small'
					/>
					<h3 className='text-lg font-semibold mt-6 mb-4'>Mahsulotlar</h3>
					<Table
						columns={itemColumns}
						dataSource={data.items}
						rowKey='product_id'
						pagination={false}
						size='small'
					/>
				</div>
			)}
		</Modal>
	)
}

export default MoreInfo

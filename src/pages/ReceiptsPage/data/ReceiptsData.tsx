import {
	DeleteOutlined,
	ExclamationCircleOutlined,
	InfoCircleOutlined,
} from '@ant-design/icons'
import { Button, Popconfirm, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { IReceipt } from '../../../types/interface'
import useDeleteReceipts from '../../../hooks/useDeletReceipts'

interface ReceiptsDataProps {
	handleViewDetails: (record: string) => void
	data: IReceipt[]
	count: number
	setCurrentPage: (page: number) => void
	currentPage: number
	limit: number
	setLimit: (limit: number) => void
	isLoading: boolean
}

const ReceiptsData: React.FC<ReceiptsDataProps> = ({
	handleViewDetails,
	data,
	setCurrentPage,
	currentPage,
	count,
	limit,
	setLimit,
	isLoading,
}) => {

	const { mutate: handleDelete } = useDeleteReceipts()

	const handleDeleteModal = (id: number | null) => {
		if (id !== null) {
			handleDelete(id)
		}
	}

	const columns: ColumnsType<IReceipt> = [
		{
			title: '№',
			dataIndex: 'id',
			key: 'id',
			sorter: (a, b) => Number(a.id) - Number(b.id),
			align: 'center',
			render: (_, __, index) => index + 1,
		},
		{
			title: 'Kvitansiya raqami',
			dataIndex: 'receipt_no',
			key: 'receipt_no',
			sorter: (a, b) => a.receipt_no - b.receipt_no,
			align: 'center',
		},
		{
			title: 'Turi',
			dataIndex: 'type',
			key: 'type',
			align: 'center',
		},
		{
			title: 'Foydalanuvchi ID',
			dataIndex: 'user_id',
			key: 'user_id',
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
			align: 'center',
		},
		{
			title: 'Summa',
			dataIndex: 'amount',
			key: 'amount',
			render: value => `${value.toLocaleString()} UZS`,
			sorter: (a, b) => Number(a.amount) - Number(b.amount),
			align: 'center',
		},
		{
			title: 'Amallar',
			key: 'actions',
			align: 'center',
			render: (_, record) => (
				<div className='flex gap-2 justify-center'>
					<Button
						type='primary'
						icon={<InfoCircleOutlined />}
						onClick={() => handleViewDetails(record.id)}
					>
						Ko'rish
					</Button>

					<Popconfirm
						title="Ushbu kvitansiyani oʻchirmoqchimisiz?"
						description='Ushbu amalni qaytarish mumkin emas.'
						onConfirm={() => handleDeleteModal(Number(record.id))}
						onCancel={() => handleDeleteModal(null)}
						okText='Ha'
						cancelText="Yo'q"
						placement='topRight'
						icon={<ExclamationCircleOutlined className='text-red-500' />}
					>
						<Button type='primary' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</div>
			),
		},
	]

	return (
		<div className='min-h-screen'>
			<Table
				columns={columns}
				dataSource={data}
				rowKey='id'
				pagination={{
					current: currentPage,
					pageSize: limit,
					total: count,
					onChange: page => setCurrentPage(page),
					onShowSizeChange: (_, size) => setLimit(size),
					showSizeChanger: true,
				}}
				scroll={{ x: true }}
				className='shadow-lg rounded-lg'
				loading={isLoading}
			/>
		</div>
	)
}

export default ReceiptsData

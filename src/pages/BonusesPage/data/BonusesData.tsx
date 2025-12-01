import {
	DeleteOutlined,
	ExclamationCircleOutlined,
	InfoCircleOutlined,
} from '@ant-design/icons'
import { Button, Popconfirm, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { IBonunes } from '../../../types/interface'
import useDeleteBonuses from '../../../hooks/UseDeleteBonuses'

interface ReceiptsDataProps {
	data: IBonunes[]
	handleViewDetails: (record: number) => void
	count: number
	currentPage: number
	setCurrentPage: (page: number) => void
	limit: number
	setLimit: (limit: number) => void
	isLoading: boolean
}

const BonunesData: React.FC<ReceiptsDataProps> = ({
	handleViewDetails,
	data,
	count,
	currentPage,
	setCurrentPage,
	limit,
	setLimit,
	isLoading,
}) => {
	const { mutate: handleDelete } = useDeleteBonuses()

	const handleDeleteModal = (id: number | null) => {
		if (id !== null) {
			handleDelete(id)
		}
	}

	const columns: ColumnsType<IBonunes> = [
		{
			title: '№',
			dataIndex: 'index',
			key: 'index',
			sorter: (a, b) => a.id - b.id,
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
			title: 'Foydalanuvchi ID',
			dataIndex: 'user_id',
			key: 'user_id',
			align: 'center',
		},
		{
			title: 'Summa',
			dataIndex: 'amount',
			key: 'amount',
			render: value => `${value.toLocaleString()} UZS`,
			sorter: (a, b) => a.amount - b.amount,
			align: 'center',
		},
		{
			title: 'Daromad',
			dataIndex: 'income',
			key: 'income',
			render: (value: boolean) => (
				<Tag color={value ? 'green' : 'red'}>{value ? 'Ha' : "Yo'q"}</Tag>
			),
			sorter: (a, b) => Number(a.income) - Number(b.income),
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
						title="Ushbu bonusni oʻchirmoqchimisiz?"
						description='Ushbu amalni qaytarish mumkin emas.'
						onConfirm={() => handleDeleteModal(record.id)}
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
					total: count,
					pageSize: limit,
					current: currentPage,
					onChange: page => setCurrentPage(page),
					onShowSizeChange: (_, size) => setLimit(size),
					showSizeChanger: true,
				}}
				scroll={{ x: 1000 }}
				className='shadow-lg rounded-lg'
				loading={isLoading}
			/>
		</div>
	)
}

export default BonunesData

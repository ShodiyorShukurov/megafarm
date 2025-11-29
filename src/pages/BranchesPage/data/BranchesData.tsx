import {
	DeleteOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
	InfoCircleOutlined,
} from '@ant-design/icons'
import { Button, Popconfirm, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { IBranch } from '../../../types/interface'

interface BranchesDataProps {
	data: IBranch[]
	handleViewDetails: (id: number) => void
	handleOpenFormModal: (record: IBranch) => void
	handleDeleteModal: (id: number | null) => void
	isLoading: boolean
}

const BranchesData: React.FC<BranchesDataProps> = ({
	data,
	handleViewDetails,
	handleOpenFormModal,
	handleDeleteModal,
	isLoading,
}) => {
	const columns: ColumnsType<IBranch> = [
		{
			title: '№',
			dataIndex: 'id',
			key: 'id',
			render: (_, __, index) => index + 1,
			align: 'center',
		},
		{
			title: 'Ismi (UZ)',
			dataIndex: 'name_uz',
			key: 'name_uz',
			sorter: (a, b) => a.name_uz.localeCompare(b.name_uz),
			align: 'center',
		},
		{
			title: 'Telefon raqami',
			dataIndex: 'phone_number',
			key: 'phone_number',
			render: (phones: string[]) =>
				phones.map(phone => (
					<a href={'tel:' + phone} key={phone}>
						{phone} <br />
					</a>
				)),
			align: 'center',
		},
		{
			title: 'Manzil (UZ)',
			dataIndex: 'address_uz',
			key: 'address_uz',
			align: 'center',
		},
		{
			title: 'Amallar',
			key: 'actions',
			align: 'center',
			render: (_, record) => (
				<Space size='middle'>
					<Button
						type='primary'
						icon={<EditOutlined />}
						onClick={() => handleOpenFormModal(record)}
					/>
					<Popconfirm
						title="Ushbu filialni o'chirishga ishonchingiz komilmi?"
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
					<Button
						type='default'
						icon={<InfoCircleOutlined />}
						onClick={() => handleViewDetails(record.id)}
					/>
				</Space>
			),
		},
	]

	return (
		<div className='min-h-screen'>
			<Table
				columns={columns}
				dataSource={data}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				scroll={{ x: 1200 }}
				className='shadow-lg rounded-lg'
				loading={isLoading}
			/>
		</div>
	)
}

export default BranchesData

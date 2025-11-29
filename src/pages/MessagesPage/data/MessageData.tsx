import {
	DeleteOutlined,
	ExclamationCircleOutlined,
	InfoCircleOutlined,
} from '@ant-design/icons'
import { Button, Image, Popconfirm, Space, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { IMessage } from '../../../types/interface'

interface MessageDataProps {
	data: IMessage[]
	count: number
	currentPage: number
	setCurrentPage: (page: number) => void
	handleViewDetails: (id: string) => void
	handleDeleteModal: (id: string | null) => void
}

const MessageData: React.FC<MessageDataProps> = ({
	data,
	count,
	currentPage,
	setCurrentPage,
	handleViewDetails,
	handleDeleteModal,
}) => {
	const columns: ColumnsType<IMessage> = [
		{
			title: 'ID',
			dataIndex: 'index',
			key: 'index',
			align: 'center',
			render: (_, __, index) => index + 1,
		},
		{
			title: 'Matn',
			dataIndex: 'text',
			key: 'text',
			align: 'left',
			render: text => (
				<div
					style={{
						maxWidth: 300,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
					dangerouslySetInnerHTML={{ __html: text }}
				/>
			),
		},
		{
			title: 'Bot tili',
			dataIndex: 'bot_lang',
			key: 'bot_lang',
			align: 'center',
			render: lang => <Tag color={'green'}>{lang.toUpperCase()}</Tag>,
		},
		{
			title: 'Rasm',
			dataIndex: 'file_url',
			key: 'file_url',
			align: 'center',
			render: url =>
				url ? (
					<Image
						src={url}
						alt='file'
						width={50}
						height={50}
						style={{ objectFit: 'cover' }}
					/>
				) : (
					<span>Rasm yo'q</span>
				),
		},
		{
			title: 'Balansdan',
			dataIndex: 'balance_from',
			key: 'balance_from',
			align: 'center',
			render: value => value || "Ma'lumot yo'q",
		},
		{
			title: 'Balansgacha',
			dataIndex: 'balance_to',
			key: 'balance_to',
			align: 'center',
			render: value => value || "Ma'lumot yo'q",
		},
		{
			title: 'Amallar',
			key: 'actions',
			align: 'center',
			render: (_, record) => (
				<Space size='middle'>
					<Popconfirm
						title="Ushbu xabarni o'chirishga ishonchingiz komilmi?"
						description="Bu amalni bekor qilib bo'lmaydi."
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
				pagination={{
					current: currentPage,
					pageSize: 10,
					total: count,
					onChange: page => setCurrentPage(page),
				}}
				rowKey='id'
				scroll={{ x: true }}
				className='shadow-lg rounded-lg'
			/>
		</div>
	)
}

export default MessageData

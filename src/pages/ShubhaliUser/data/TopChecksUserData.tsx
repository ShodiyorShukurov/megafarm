import { InfoCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, DatePicker, Empty, Modal, Spin, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import api from '../../../api'

interface ITopCheckUser {
	user_id: string
	name: string
	phone_number: string
	balance: string
	purchase_count: string
}

interface IUserCheckItem {
	name: string
	qty: number
	price: number
	discount: number
	fixed_name?: string
}

interface IUserCheck {
	id: string
	receipt_no: string
	branch: number
	amount: string
	items: IUserCheckItem[]
	created_at: string
}

interface TopChecksUserDataProps {
	data: ITopCheckUser[]
	selectDateRangeTopChecks: [Dayjs, Dayjs] | null
	setSelectDateRangeTopChecks: (dates: [Dayjs, Dayjs] | null) => void
	page: number
	setPage: (page: number) => void
	count: number
	limit: number
	setLimit: (limit: number) => void
}

const fetchUserDetails = async (userId: string, page: number = 1) => {
	const res = await api.get(`/stats/top-checks/${userId}?page=${page}&limit=20`)
	return res.data
}

const TopChecksUserData: React.FC<TopChecksUserDataProps> = ({
	data,
	selectDateRangeTopChecks,
	setSelectDateRangeTopChecks,
	page,
	setPage,
	count,
	limit,
	setLimit,
}) => {
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalPage, setModalPage] = useState(1)

	const { data: userCheckResponse, isLoading } = useQuery({
		queryKey: ['userDetails', selectedUserId, modalPage],
		queryFn: () => fetchUserDetails(selectedUserId || '', modalPage),
		enabled: !!selectedUserId,
	})

	const columns: ColumnsType<ITopCheckUser> = [
		{
			title: '№',
			dataIndex: 'user_id',
			key: 'user_id',
			align: 'center',
			width: 80,
			render: (_, __, index: number) => (page - 1) * limit + index + 1,
		},
		{
			title: 'ID',
			dataIndex: 'user_id',
			key: 'user_id',
			align: 'center',
			width: 80,
		},
		{
			title: 'Foydalanuvchi nomi',
			dataIndex: 'name',
			key: 'name',
			align: 'left',
		},
		{
			title: 'Telefon raqami',
			dataIndex: 'phone_number',
			key: 'phone_number',
			align: 'center',
		},
		{
			title: 'Balans (UZS)',
			dataIndex: 'balance',
			key: 'balance',
			render: (value: string) => {
				const balance = parseFloat(value)
				return (
					<Tag color={balance > 0 ? 'green' : 'red'}>
						{balance.toLocaleString('uz-UZ')} UZS
					</Tag>
				)
			},
			sorter: (a, b) => parseFloat(a.balance) - parseFloat(b.balance),
			align: 'center',
		},
		{
			title: 'Xarid soni',
			dataIndex: 'purchase_count',
			key: 'purchase_count',
			render: (value: string) => <Tag color='blue'>{value}</Tag>,
			sorter: (a, b) => parseInt(a.purchase_count) - parseInt(b.purchase_count),
			align: 'center',
		},
		{
			title: 'Amallar',
			key: 'actions',
			render: (_, record: ITopCheckUser) => {
				return (
					<Button
						icon={<InfoCircleOutlined />}
						type='primary'
						onClick={() => {
							setSelectedUserId(record.user_id)
							setIsModalOpen(true)
						}}
					>
						Ko'rish
					</Button>
				)
			},
			align: 'center',
		},
	]

	return (
		<div className='p-6 bg-gray-100 rounded-2xl'>
			<h2 className='text-2xl font-semibold mb-4'>
				Eng ko'p xarid qilgan foydalanuvchilar
			</h2>
			<div className='mb-6 p-4 bg-white rounded-lg shadow-sm w-[400px]'>
				<DatePicker.RangePicker
					value={selectDateRangeTopChecks}
					onChange={dates => {
						if (dates && dates[0] && dates[1]) {
							setSelectDateRangeTopChecks([dates[0], dates[1]])
						} else {
							setSelectDateRangeTopChecks(null)
						}
					}}
					format='YYYY-MM-DD'
					placeholder={["Boshlang'ich sana", 'Tugash sanasi']}
					className='w-full'
				/>
			</div>

			<Table
				columns={columns}
				dataSource={
					data && data.length > 0
						? data.map((item, index) => ({
								...item,
								key: item.user_id + index,
							}))
						: []
				}
				pagination={{
					pageSize: limit,
					current: page,
					onChange: newPage => setPage(newPage),
					onShowSizeChange: (_, size) => setLimit(size),
					showSizeChanger: true,
					total: count,
				}}
				scroll={{ x: 1200 }}
				className='shadow-lg rounded-lg'
				loading={!data}
			/>

			<Modal
				title={`Foydalanuvchi xaridlari`}
				open={isModalOpen}
				onCancel={() => {
					setIsModalOpen(false)
					setSelectedUserId(null)
					setModalPage(1)
				}}
				footer={null}
				width={900}
			>
				{isLoading ? (
					<div className='flex justify-center py-8'>
						<Spin />
					</div>
				) : userCheckResponse?.data && userCheckResponse.data.length > 0 ? (
					<div className='space-y-4'>
						<Table
							columns={[
								{
									title: 'Xarid ID',
									dataIndex: 'id',
									key: 'id',
									width: 80,
								},
								{
									title: 'Receipt No',
									dataIndex: 'receipt_no',
									key: 'receipt_no',
									width: 100,
								},
								{
									title: 'Shox',
									dataIndex: 'branch',
									key: 'branch',
									width: 70,
									align: 'center' as const,
								},
								{
									title: 'Summa (UZS)',
									dataIndex: 'amount',
									key: 'amount',
									render: (value: string) => (
										<Tag color='green'>
											{parseFloat(value).toLocaleString('uz-UZ')} UZS
										</Tag>
									),
									width: 120,
								},
								{
									title: 'Mahsulotlar',
									dataIndex: 'items',
									key: 'items',
									render: (items: IUserCheckItem[]) => (
										<div className='text-sm'>
											{items.map((item, idx) => (
												<div key={idx} className='mb-1'>
													<div className='font-medium'>{item.name}</div>
													<div className='text-gray-500'>
														Miqdori: {item.qty} | Narx:{' '}
														{item.price.toLocaleString('uz-UZ')} UZS
													</div>
												</div>
											))}
										</div>
									),
									width: 250,
								},
								{
									title: 'Sana',
									dataIndex: 'created_at',
									key: 'created_at',
									render: (date: string) =>
										new Date(date).toLocaleString('uz-UZ'),
									width: 150,
								},
							]}
							dataSource={userCheckResponse.data.map(
								(item: IUserCheck, idx: number) => ({
									...item,
									key: item.id + idx,
								})
							)}
							pagination={{
								pageSize: 20,
								current: modalPage,
								onChange: page => setModalPage(page),
								total: userCheckResponse.total,
							}}
							scroll={{ x: 1200 }}
							size='small'
						/>
					</div>
				) : (
					<Empty description='Xaridlar topilmadi' />
				)}
			</Modal>
		</div>
	)
}

export default TopChecksUserData

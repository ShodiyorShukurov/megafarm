import { InfoCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, DatePicker, Empty, Modal, Spin, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import api from '../../../api'

interface ITopBalanceUser {
	user_id: string
	name: string
	phone_number: string
	balance: string
}

interface IBalanceCheck {
	id: string
	receipt_no: string
	amount: string
	income: boolean
	created_at: string
}

interface TopBalanceUserDataProps {
	data: ITopBalanceUser[]
	selectDateRangeTopBalance: [Dayjs, Dayjs] | null
	setSelectDateRangeTopBalance: (dates: [Dayjs, Dayjs] | null) => void
	page: number
	setPage: (page: number) => void
	count: number
}

const fetchUserBalanceDetails = async (userId: string, page: number = 1) => {
	const res = await api.get(
		`/stats/top-balance/${userId}?page=${page}&limit=20`
	)
	return res.data
}

const TopBalanceUserData: React.FC<TopBalanceUserDataProps> = ({
	data,
	selectDateRangeTopBalance,
	setSelectDateRangeTopBalance,
	page,
	setPage,
	count,
}) => {
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalPage, setModalPage] = useState(1)

	const { data: userCheckResponse, isLoading } = useQuery({
		queryKey: ['userBalanceDetails', selectedUserId, modalPage],
		queryFn: () => fetchUserBalanceDetails(selectedUserId || '', modalPage),
		enabled: !!selectedUserId,
	})
	const columns: ColumnsType<ITopBalanceUser> = [
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
			title: 'Amallar',
			key: 'actions',
			render: (_, record: ITopBalanceUser) => {
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
		<div className='p-6 bg-gray-100 rounded-2xl mt-6'>
			<h2 className='text-2xl font-semibold mb-4'>
				Eng yuqori balansli foydalanuvchilar
			</h2>
			<div className='mb-6 p-4 bg-white rounded-lg shadow-sm w-[400px]'>
				<DatePicker.RangePicker
					value={selectDateRangeTopBalance}
					onChange={dates => {
						if (dates && dates[0] && dates[1]) {
							setSelectDateRangeTopBalance([dates[0], dates[1]])
						} else {
							setSelectDateRangeTopBalance(null)
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
					pageSize: 10,
					current: page,
					onChange: newPage => setPage(newPage),
					total: count,
				}}
				scroll={{ x: 1000 }}
				className='shadow-lg rounded-lg'
				loading={!data}
			/>

			<Modal
				title={`Foydalanuvchi xaridlari (Balans bo'yicha)`}
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
									title: 'Summa (UZS)',
									dataIndex: 'amount',
									key: 'amount',
									render: (value: string) => (
										<Tag color='green'>
											{parseFloat(value).toLocaleString('uz-UZ')} UZS
										</Tag>
									),
									width: 150,
									sorter: (a: IBalanceCheck, b: IBalanceCheck) =>
										parseFloat(a.amount) - parseFloat(b.amount),
								},
								{
									title: 'Income',
									dataIndex: 'income',
									key: 'income',
									render: (value: boolean) => (
										<Tag color={value ? 'green' : 'red'}>
											{value ? 'Yes' : 'No'}
										</Tag>
									),
									width: 100,
								},
								{
									title: 'Sana',
									dataIndex: 'created_at',
									key: 'created_at',
									render: (date: string) =>
										new Date(date).toLocaleString('uz-UZ'),
									width: 200,
								},
							]}
							dataSource={userCheckResponse.data.map(
								(item: IBalanceCheck, idx: number) => ({
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
							scroll={{ x: 800 }}
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

export default TopBalanceUserData

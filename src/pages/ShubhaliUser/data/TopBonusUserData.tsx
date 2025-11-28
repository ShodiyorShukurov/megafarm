import { InfoCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, DatePicker, Empty, Modal, Spin, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import api from '../../../api'

interface ITopBonusUser {
	user_id: string
	name: string
	phone_number: string
	balance: string
	total_bonus_used_amount: string
	bonus_count: string
}

interface IBonusDetail {
	id: string
	receipt_no: string
	amount: string
	income: boolean
	created_at: string
}

interface TopBonusUserDataProps {
	data: ITopBonusUser[]
	selectDateRangeTopBonus: [Dayjs, Dayjs] | null
	setSelectDateRangeTopBonus: (dates: [Dayjs, Dayjs] | null) => void
	page: number
	setPage: (page: number) => void
	count: number
}

const fetchUserBonusDetails = async (userId: string, page: number = 1) => {
	const res = await api.get(`/stats/top-bonus/${userId}?page=${page}&limit=20`)
	return res.data
}

const TopBonusUserData: React.FC<TopBonusUserDataProps> = ({
	data,
	selectDateRangeTopBonus,
	setSelectDateRangeTopBonus,
	page,
	setPage,
	count,
}) => {
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalPage, setModalPage] = useState(1)

	const { data: bonusResponse, isLoading } = useQuery({
		queryKey: ['userBonusDetails', selectedUserId, modalPage],
		queryFn: () => fetchUserBonusDetails(selectedUserId || '', modalPage),
		enabled: !!selectedUserId,
	})
	const columns: ColumnsType<ITopBonusUser> = [
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
			title: 'Bonus Ishlatgan (UZS)',
			dataIndex: 'total_bonus_used_amount',
			key: 'total_bonus_used_amount',
			render: (value: string) => (
				<Tag color='blue'>{parseFloat(value).toLocaleString('uz-UZ')} UZS</Tag>
			),
			sorter: (a, b) =>
				parseFloat(a.total_bonus_used_amount) -
				parseFloat(b.total_bonus_used_amount),
			align: 'center',
		},
		{
			title: 'Bonus Soni',
			dataIndex: 'bonus_count',
			key: 'bonus_count',
			render: (value: string) => <Tag color='purple'>{value}</Tag>,
			sorter: (a, b) => parseInt(a.bonus_count) - parseInt(b.bonus_count),
			align: 'center',
		},
		{
			title: 'Amallar',
			key: 'actions',
			render: (_, record: ITopBonusUser) => {
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
				Eng ko'p bonus ishlatgan foydalanuvchilar
			</h2>
			<div className='mb-6 p-4 bg-white rounded-lg shadow-sm w-[400px]'>
				<DatePicker.RangePicker
					value={selectDateRangeTopBonus}
					onChange={dates => {
						if (dates && dates[0] && dates[1]) {
							setSelectDateRangeTopBonus([dates[0], dates[1]])
						} else {
							setSelectDateRangeTopBonus(null)
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
				scroll={{ x: 1200 }}
				className='shadow-lg rounded-lg'
				loading={!data}
			/>

			<Modal
				title={`Bonus ma'lumotlari`}
				open={isModalOpen}
				onCancel={() => {
					setIsModalOpen(false)
					setSelectedUserId(null)
					setModalPage(1)
				}}
				footer={null}
				width={800}
			>
				{isLoading ? (
					<div className='flex justify-center py-8'>
						<Spin />
					</div>
				) : bonusResponse?.data && bonusResponse.data.length > 0 ? (
					<div className='space-y-4'>
						<Table
							columns={[
								{
									title: 'Bonus ID',
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
										<Tag color='blue'>
											{parseFloat(value).toLocaleString('uz-UZ')} UZS
										</Tag>
									),
									width: 130,
									sorter: (a: IBonusDetail, b: IBonusDetail) =>
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
									width: 180,
								},
							]}
							dataSource={bonusResponse.data.map(
								(item: IBonusDetail, idx: number) => ({
									...item,
									key: item.id + idx,
								})
							)}
							pagination={{
								pageSize: 20,
								current: modalPage,
								onChange: page => setModalPage(page),
								total: bonusResponse.total,
							}}
							scroll={{ x: 700 }}
							size='small'
						/>
					</div>
				) : (
					<Empty description="Bonus ma'lumoti topilmadi" />
				)}
			</Modal>
		</div>
	)
}

export default TopBonusUserData

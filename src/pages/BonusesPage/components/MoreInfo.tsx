import { InfoCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Descriptions, Modal, Tag } from 'antd'
import api from '../../../api'

interface MoreInfoProps {
	isModalOpen: boolean
	selectedBonus: number | null
	handleCloseModal: () => void
}

const MoreInfo: React.FC<MoreInfoProps> = ({
	isModalOpen,
	selectedBonus,
	handleCloseModal,
}) => {
	const getBonusDetails = async () => {
		if (!selectedBonus) return null
		try {
			const res = await api.get(`/bonus/${selectedBonus}`)

			return res.data.data
		} catch (error) {
			console.error('Error fetching bonus details:', error)
		}
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ['bonusData', selectedBonus],
		queryFn: getBonusDetails,
	})

	if (isLoading)
		return (
			<Modal
				title={
					<div className='flex items-center'>
						<InfoCircleOutlined className='text-blue-500 mr-2' />
						Bonus tafsilotlari
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
						Bonus tafsilotlari
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

	return (
		<Modal
			title={
				<div className='flex items-center'>
					<InfoCircleOutlined className='text-blue-500 mr-2' />
					Bonus tafsilotlari
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
						<Descriptions.Item label='Foydalanuvchi ID'>
							{data.user_id}
						</Descriptions.Item>
						<Descriptions.Item label='Daromad'>
							<Tag color={data.income ? 'green' : 'red'}>
								{data.income ? 'Ha' : "Yo'q"}
							</Tag>
						</Descriptions.Item>
						<Descriptions.Item label='Summa'>
							{data?.amount} UZS
						</Descriptions.Item>
						<Descriptions.Item label='Yaratilgan vaqt'>
							{new Date(data.created_at).toLocaleString()}
						</Descriptions.Item>
					</Descriptions>
				</div>
			)}
		</Modal>
	)
}

export default MoreInfo

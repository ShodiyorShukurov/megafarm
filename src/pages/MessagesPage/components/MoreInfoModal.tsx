import { InfoCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Descriptions, Image, Modal, Tag } from 'antd'
import React from 'react'
import api from '../../../api'

interface MoreInfoProps {
	isModalMessageOpen: boolean
	selectedMessage: string | null
	handleCloseModal: () => void
}

const MoreInfo: React.FC<MoreInfoProps> = ({
	isModalMessageOpen,
	selectedMessage,
	handleCloseModal,
}) => {
	const getMessageDetails = async () => {
		if (!selectedMessage) return null
		try {
			const res = await api.get(`/message/${selectedMessage}`)
			return res.data.data
		} catch (error) {
			console.error('Error fetching message details:', error)
			throw new Error('Failed to fetch message details')
		}
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ['messageData', selectedMessage],
		queryFn: getMessageDetails,
	})

	if (isLoading)
		return (
			<Modal
				title={
					<div className='flex items-center'>
						<InfoCircleOutlined className='text-blue-500 mr-2' />
						Xabar tafsilotlari
					</div>
				}
				open={isModalMessageOpen}
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
						Xabar tafsilotlari
					</div>
				}
				open={isModalMessageOpen}
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
					Xabar tafsilotlari
				</div>
			}
			open={isModalMessageOpen}
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
						<Descriptions.Item label='Matn'>
							<div
								style={{
									maxWidth: 400,
									overflow: 'hidden',
									textOverflow: 'ellipsis',
								}}
								dangerouslySetInnerHTML={{ __html: data.text }}
							/>
						</Descriptions.Item>
						<Descriptions.Item label='Til'>
							<Tag color={'green'}>{data.bot_lang.toUpperCase()}</Tag>
						</Descriptions.Item>
						<Descriptions.Item label='Balansdan'>
							{data.balance_from || "Ma'lumot yo'q"}
						</Descriptions.Item>
						<Descriptions.Item label='Balansgacha'>
							{data.balance_to || "Ma'lumot yo'q"}
						</Descriptions.Item>
						<Descriptions.Item label='Rasm'>
							{data.file_url ? (
								<Image
									src={data.file_url}
									alt='file'
									width={100}
									height={100}
									style={{ objectFit: 'cover' }}
								/>
							) : (
								"Rasm yo'q"
							)}
						</Descriptions.Item>
					</Descriptions>
				</div>
			)}
		</Modal>
	)
}

export default MoreInfo

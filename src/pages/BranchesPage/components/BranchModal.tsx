import {
	EditOutlined,
	MinusCircleOutlined,
	PlusCircleOutlined,
	UploadOutlined,
} from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import {
	Button,
	Form,
	Input,
	InputNumber,
	Modal,
	Space,
	Upload,
	message,
} from 'antd'
import { useEffect } from 'react'
import api from '../../../api'
import { IBranch } from '../../../types/interface'

interface BranchFormValues {
	branch_id: number
	id?: number
	name_uz: string
	name_ru: string
	phone_number: string[]
	schedule: string
	address_uz: string
	address_ru: string
	landmark_uz: string
	landmark_ru: string
	address_link: string
	latitude: number
	longitude: number
	image: { originFileObj: File }[] | null
	image_url: string
	image_name: string
}

interface BranchModalProps {
	isModalOpen: boolean
	handleCloseFormModal: () => void
	selectedBranch: BranchFormValues | null | IBranch
	handleOpenFormModal: (record: IBranch | null) => void
}

const BranchModal: React.FC<BranchModalProps> = ({
	isModalOpen,
	handleCloseFormModal,
	selectedBranch,
	handleOpenFormModal,
}) => {
	const [form] = Form.useForm()

	useEffect(() => {
		if (selectedBranch) {
			form.setFieldsValue({
				branch_id: selectedBranch.branch_id,
				name_uz: selectedBranch.name_uz,
				name_ru: selectedBranch.name_ru,
				schedule: selectedBranch.schedule,
				address_uz: selectedBranch.address_uz,
				address_ru: selectedBranch.address_ru,
				landmark_uz: selectedBranch.landmark_uz,
				landmark_ru: selectedBranch.landmark_ru,
				address_link: selectedBranch.address_link,
				longitude: selectedBranch.longitude,
				latitude: selectedBranch.latitude,
				phone_number: selectedBranch.phone_number,
			})
		} else {
			form.resetFields()
		}
	}, [selectedBranch, form])

	const queryClient = useQueryClient()

	const handleFinish = async (values: BranchFormValues) => {
		try {
			const formData = new FormData()
			formData.append('name_uz', values.name_uz.trim())
			formData.append('branch_id', values.branch_id.toString())
			formData.append('name_ru', values.name_ru.trim())
			if (Array.isArray(values.phone_number)) {
				values.phone_number.forEach(phone => {
					formData.append('phone_number', phone)
				})
			}
			formData.append('schedule', values.schedule.trim())
			formData.append('address_uz', values.address_uz.trim())
			formData.append('address_ru', values.address_ru.trim())
			formData.append('landmark_uz', values.landmark_uz.trim() || '')
			formData.append('landmark_ru', values.landmark_ru.trim() || '')
			formData.append('address_link', values.address_link.trim() || '')
			formData.append('latitude', values.latitude.toString())
			formData.append('longitude', values.longitude.toString())
			formData.append(
				'image',
				values.image && values.image[0]?.originFileObj
					? values.image[0].originFileObj
					: ''
			)

			if (selectedBranch?.id) {
				formData.append('id', selectedBranch.id.toString())
				const res = await api.put('/branch/edit', formData)

				if (res.data.status === 200) {
					message.success('Branch updated successfully!')
				}
				if (res.data.status === 400) {
					message.error('Failed to update branch!')
				}
				if (res.data.status === 500) {
					message.error('Server error!')
				}
			} else {
				const res = await api.post('/branch/add', formData)

				if (res.data.status === 200) {
					message.success('Branch created successfully!')
				}
				if (res.data.status === 400) {
					message.error('Failed to create branch!')
				}
				if (res.data.status === 500) {
					message.error('Server error!')
				}
			}
			queryClient.invalidateQueries({ queryKey: ['branchesData'] })
			handleCloseFormModal()
			form.resetFields()
		} catch (error) {
			console.error('Error creating branch:', error)
			message.error('Failed to create branch!')
		}
	}

	const normFile = (e: any) => {
		if (Array.isArray(e)) {
			return e
		}
		return e?.fileList.slice(-1)
	}

	return (
		<div>
			<h2 className='text-2xl font-bold mb-6 text-center'>Filiallar</h2>
			<Button
				type='primary'
				icon={<PlusCircleOutlined />}
				onClick={() => handleOpenFormModal(null)}
				className='mb-4'
			>
				Yangi filial qo'sh
			</Button>
			<Modal
				title={
					<div className='flex items-center'>
						{selectedBranch?.id ? (
							<EditOutlined className='text-blue-500 mr-2' />
						) : (
							<PlusCircleOutlined className='text-blue-500 mr-2' />
						)}
						{selectedBranch?.id ? 'Filialni tahrirlash' : "Yangi filial qo'sh"}
					</div>
				}
				open={isModalOpen}
				onCancel={handleCloseFormModal}
				footer={null}
				centered
				width={700}
				className='rounded-lg'
			>
				<Form
					form={form}
					onFinish={handleFinish}
					autoComplete='off'
					className='grid grid-cols-2 gap-4'
					layout='vertical'
				>
					<Form.Item
						label='Filial ID'
						name='branch_id'
						rules={[{ required: true, message: 'Filial IDni kiriting!' }]}
						className='mb-4'
					>
						<InputNumber
							placeholder='Filial ID kiriting'
							style={{ width: '100%' }}
						/>
					</Form.Item>
					<Form.Item
						label='Nomi (UZ)'
						name='name_uz'
						rules={[
							{ required: true, message: "O'zbek tilidagi nomni kiriting!" },
						]}
						className='mb-4'
					>
						<Input placeholder="O'zbek tilidagi nomni kiriting" />
					</Form.Item>
					<Form.Item
						label='Nomi (RU)'
						name='name_ru'
						rules={[
							{ required: true, message: 'Rus tilidagi nomni kiriting!' },
						]}
						className='mb-4'
					>
						<Input placeholder='Rus tilidagi nomni kiriting' />
					</Form.Item>
					<Form.Item
						label='Ish jadva'
						name='schedule'
						rules={[{ required: true, message: 'Ish jadvalni kiriting!' }]}
						className='mb-4'
					>
						<Input placeholder='Ish jadvalni kiriting (masalan, 09:00-18:00)' />
					</Form.Item>
					<Form.Item
						label='Manzil (UZ)'
						name='address_uz'
						rules={[
							{ required: true, message: "O'zbek tilidagi manzilni kiriting!" },
						]}
						className='mb-4'
					>
						<Input placeholder="O'zbek tilidagi manzilni kiriting" />
					</Form.Item>
					<Form.Item
						label='Manzil (RU)'
						name='address_ru'
						rules={[
							{
								required: true,
								message: 'Rus tilidagi manzilni kiriting!',
							},
						]}
						className='mb-4'
					>
						<Input placeholder='Rus tilidagi manzilni kiriting' />
					</Form.Item>
					<Form.Item label='Belgi (UZ)' name='landmark_uz' className='mb-4'>
						<Input placeholder="O'zbek tilidagi belgini kiriting" />
					</Form.Item>
					<Form.Item label='Belgi (RU)' name='landmark_ru' className='mb-4'>
						<Input placeholder='Rus tilidagi belgini kiriting' />
					</Form.Item>

					<Form.Item label='Harita havola' name='address_link' className='mb-4'>
						<Input placeholder='Harita havolasini kiriting (masalan, https://maps.google.com)' />
					</Form.Item>

					<Form.Item
						label='Kenglik'
						name='latitude'
						rules={[{ required: true, message: 'Kenglikni kiriting!' }]}
						className='mb-4'
					>
						<InputNumber
							className='w-full'
							style={{ width: '100%' }}
							placeholder='Kenglikni kiriting (masalan, 41.2995)'
						/>
					</Form.Item>

					<Form.Item
						label='Uzunlik'
						name='longitude'
						rules={[{ required: true, message: 'Uzunlikni kiriting!' }]}
						className='mb-4'
					>
						<InputNumber
							className='w-full'
							style={{ width: '100%' }}
							placeholder='Uzunlikni kiriting (masalan, 69.2401)'
						/>
					</Form.Item>
					<Form.Item
						label='Rasm'
						name='image'
						valuePropName='fileList'
						getValueFromEvent={normFile}
						rules={
							!selectedBranch?.image_url
								? [{ required: true, message: 'Iltimos, rasmni yuklang!' }]
								: undefined
						}
						className='mb-4'
						style={{ width: '100%' }}
					>
						<Upload
							accept='image/png,image/jpeg, image/jpg, image/webp, image/gif'
							beforeUpload={() => false}
							maxCount={1}
							listType='picture'
							className='w-full'
							style={{ width: '100%' }}
						>
							<Button icon={<UploadOutlined />} block>
								Rasmni yuklash
							</Button>
						</Upload>
					</Form.Item>
					<Form.Item
						label='Telefon raqami'
						className='col-span-2 mb-4'
						rules={[
							{
								required: true,
								message: "Iltimos, kamida bitta telefon raqami qo'shing!",
							},
						]}
					>
						<Form.List name='phone_number'>
							{(fields, { add, remove }) => (
								<>
									{fields.map(({ key, name, ...restField }) => (
										<Space
											key={key}
											align='start'
											className='flex justify-between mb-2 mr-2'
										>
											<Form.Item
												{...restField}
												name={[name]}
												rules={[
													{
														required: true,
														message: 'Telefon raqamini kiriting!',
													},
													{
														pattern: /^\+998\d{9}$/,
														message:
															"Telefon raqamni to'g'ri kiriting (+998...)",
													},
												]}
												style={{ width: '100%' }}
											>
												<Input placeholder='Telefon raqamini kiriting (+998...)' />
											</Form.Item>
											<Button
												icon={<MinusCircleOutlined />}
												onClick={() => remove(name)}
											/>
										</Space>
									))}
									<Form.Item>
										<Button
											type='dashed'
											onClick={() => add()}
											icon={<PlusCircleOutlined />}
											block
										>
											Telefon raqamini qo'sh
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
					</Form.Item>
					<Form.Item className='col-span-2'>
						<div className='flex justify-end space-x-2'>
							<Button onClick={handleCloseFormModal}>Bekor qilish</Button>
							<Button type='primary' htmlType='submit'>
								Saqlash
							</Button>
						</div>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}

export default BranchModal

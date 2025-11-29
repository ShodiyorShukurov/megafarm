import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, message, Modal, Select } from 'antd'
import { useEffect } from 'react'
import api from '../../../api'
import { IAdmin } from '../../../types/interface'

interface BranchModalProps {
	isModalOpen: boolean
	handleCloseFormModal: () => void
	selectedAdmin: null | IAdmin
	handleOpenFormModal: (record: IAdmin | null) => void
}

const AdminModal: React.FC<BranchModalProps> = ({
	isModalOpen,
	handleCloseFormModal,
	selectedAdmin,
	handleOpenFormModal,
}) => {
	const [form] = Form.useForm()

	useEffect(() => {
		if (selectedAdmin) {
			form.setFieldsValue({
				admin_email: selectedAdmin.admin_email,
				role: selectedAdmin.role,
			})
		} else {
			form.resetFields()
		}
	}, [selectedAdmin, form])

	const queryClient = useQueryClient()

	const handleFinish = async (values: IAdmin) => {
		try {
			const data: {
				admin_email: string
				role: string
				admin_password: string
				admin_id?: string
			} = {
				admin_email: values.admin_email,
				role: values.role,
				admin_password: values.admin_password,
			}

			if (selectedAdmin?.admin_id) {
				data.admin_id = selectedAdmin.admin_id
				const res = await api.put('/admin/edit', data)

				if (res.data.status === 200) {
					message.success('Admin muvaffaqiyatli yangilandi!')
				}
				if (res.data.status === 400) {
					message.error('Admin ni yangilash muvaffaq boʻlmadi!')
				}
				if (res.data.status === 500) {
					message.error('Server xatosi!')
				}
			} else {
				const res = await api.post('/admin/register', data)

				if (res.data.status === 200) {
					message.success('Admin muvaffaqiyatli yaratildi!')
				}
				if (res.data.status === 400) {
					message.error('Admin ni yaratish muvaffaq boʻlmadi!')
				}
				if (res.data.status === 500) {
					message.error('Server xatosi!')
				}
			}
			queryClient.invalidateQueries({ queryKey: ['adminData'] })
			handleCloseFormModal()
			form.resetFields()
		} catch (error) {
			console.error('Admin yaratishda xato:', error)
			message.error('Admin ni yaratish muvaffaq boʻlmadi!')
		}
	}

	return (
		<div>
			<h1 className='text-2xl font-bold mb-6 text-center'>Adminlar</h1>
			<Button
				type='primary'
				icon={<PlusCircleOutlined />}
				onClick={() => handleOpenFormModal(null)}
				className='mb-4'
			>
				Yangi admin qo'sh
			</Button>
			<Modal
				title={
					<div className='flex items-center'>
						{selectedAdmin?.id ? (
							<EditOutlined className='text-blue-500 mr-2' />
						) : (
							<PlusCircleOutlined className='text-blue-500 mr-2' />
						)}
						{selectedAdmin?.id ? 'Adminni tahrirlash' : "Yangi admin qo'sh"}
					</div>
				}
				open={isModalOpen}
				onCancel={handleCloseFormModal}
				footer={null}
				className='rounded-lg'
			>
				<Form
					form={form}
					onFinish={handleFinish}
					autoComplete='off'
					layout='vertical'
				>
					<Form.Item
						label='Admin elektron pochta'
						name='admin_email'
						rules={[
							{
								required: true,
								message: 'Admin elektron pochtasini kiriting!',
							},
						]}
						className='mb-4'
					>
						<Input
							placeholder='Admin elektron pochtasini kiriting'
							style={{ width: '100%' }}
						/>
					</Form.Item>
					<Form.Item
						label='Rol'
						name='role'
						rules={[{ required: true, message: 'Rolni tanlang!' }]}
						className='mb-4'
					>
						<Select placeholder='Rolni tanlang' style={{ width: '100%' }}>
							<Select.Option value='admin'>Admin</Select.Option>
							<Select.Option value='superadmin'>Superadmin</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						label='Parol'
						name='admin_password'
						rules={
							!selectedAdmin?.admin_password
								? [
										{
											required: true,
											message: 'Admin parolini kiriting!',
										},
									]
								: []
						}
						className='mb-4'
					>
						<Input.Password
							placeholder='Admin parolini kiriting'
							style={{ width: '100%' }}
						/>
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

export default AdminModal

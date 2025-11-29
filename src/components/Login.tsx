import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Typography, message } from 'antd'
import { useState } from 'react'
import api from '../api/index'

const { Title } = Typography

interface FormValues {
	username: string
	password: string
}

const Login: React.FC = () => {
	const [loading, setLoading] = useState(false)

	const onFinish = async (values: FormValues) => {
		setLoading(true)
		try {
			const res = await api.post('/admin/login', values)
			if (res.data.status === 200) {
				console.log('Login successful:', res.data)
				const { token } = res.data
				localStorage.setItem('token', token)
				localStorage.setItem('role', res.data.data.role)
				window.location.href = '/dashboard'
				setLoading(false)
			} else {
				message.error(
					"Kirish muvaffaq bo'lmadi. Iltimos, login va parolni tekshiring."
				)
				setLoading(false)
			}
		} catch (error) {
			console.error('Login error:', error)
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<Card className='w-full max-w-md shadow-lg'>
				<Title level={2} className='text-center mb-6'>
					Kirish
				</Title>
				<Form name='login' onFinish={onFinish} autoComplete='off'>
					<Form.Item
						name='admin_email'
						rules={[{ required: true, message: 'Iltimos, login ni kiriting!' }]}
					>
						<Input
							prefix={<UserOutlined />}
							placeholder='Login'
							size='large'
							autoComplete='current-username'
						/>
					</Form.Item>
					<Form.Item
						name='admin_password'
						rules={[{ required: true, message: 'Iltimos, parolni kiriting!' }]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder='Parol'
							size='large'
							autoComplete='current-password'
						/>
					</Form.Item>
					<Form.Item>
						<Button
							type='primary'
							htmlType='submit'
							size='large'
							loading={loading}
							block
						>
							Kirish
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	)
}

export default Login

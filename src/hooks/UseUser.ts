// UseUser.tsx
import React from 'react'
import { IUser } from '../types/interface'
import api from '../api'
import { useQuery } from '@tanstack/react-query'
import { message } from 'antd'

const UseUser = () => {
	interface UserData {
		data: any[]
		count: number
	}

	interface UserMoreInfo {
		id: number
		chat_id: number
	}

	const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
	const [selectedUser, setSelectedUser] = React.useState<IUser | null>(null)
	const [isUserMoreInfoOpen, setIsUserMoreInfoOpen] = React.useState(false)
	const [selectedUserMoreInfo, setSelectedUserMoreInfo] =
		React.useState<UserMoreInfo | null>(null)
	const [searchPhone, setSearchPhone] = React.useState('')
	const [data, setData] = React.useState<UserData>({ data: [], count: 0 })
	const [currentPage, setCurrentPage] = React.useState(1)
	const [limit, setLimit] = React.useState(10)

	const { isLoading, error, refetch } = useQuery({
		queryKey: ['userData', currentPage, limit, searchPhone],
		enabled: !!currentPage,
		queryFn: async () => {
			const res = await getUserData()
			setData(res)
			return res
		},
	})

	const getUserData = async () => {
		try {
			let query = `/users/list?limit=${limit}&page=${currentPage}`
			if (searchPhone.trim().length >= 1) {
				query += `&phone=${searchPhone.trim()}`
			}

			const res = await api.get(query)
			return res.status === 404 ? [] : res.data
		} catch (error) {
			console.error('Error fetching user data:', error)
			return { data: [], count: 0 }
		}
	}

	const handleDeleteModal = async (id: number | null) => {
		if (!id) return
		try {
			const res = await api.delete(`/user/delete/${id}`)
			if (res.status === 200) {
				message.success('User deleted successfully!')
				refetch()
			} else {
				message.error('Failed to delete user!')
			}
		} catch {
			message.error('Failed to delete user!')
		}
	}

	const handleOpenEditModal = (user: IUser) => {
		setSelectedUser(user)
		setIsEditModalOpen(true)
	}

	const handleCloseEditModal = () => {
		setIsEditModalOpen(false)
		setSelectedUser(null)
	}

	const handleOpenUserMoreInfo = (userId: number, chat_id: number) => {
		setSelectedUserMoreInfo({ id: userId, chat_id: chat_id })
		setIsUserMoreInfoOpen(true)
	}

	const handleCloseUserMoreInfo = () => {
		setIsUserMoreInfoOpen(false)
		setSelectedUserMoreInfo(null)
	}

	return {
		isEditModalOpen,
		selectedUser,
		handleOpenEditModal,
		handleCloseEditModal,
		handleOpenUserMoreInfo,
		isUserMoreInfoOpen,
		selectedUserMoreInfo,
		handleCloseUserMoreInfo,
		handleDeleteModal,
		data,
		isLoading,
		error,
		searchPhone,
		setSearchPhone,
		refetch,
		currentPage,
		setCurrentPage,
		limit,
		setLimit,
	}
}

export default UseUser

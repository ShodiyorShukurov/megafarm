import { useState } from 'react'
import api from '../api'
import { useQuery } from '@tanstack/react-query'
import { message } from 'antd'

const UseBonuses = () => {
	interface BonusData {
		data: any[]
		total: number
	}

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedBonus, setSelectedBonus] = useState<number | null>(null)
	const [data, setData] = useState<BonusData>({ data: [], total: 0 })
	const [currentPage, setCurrentPage] = useState(1)
	const [searchUserId, setSearchUserId] = useState('')
	const [receiptNo, setReceiptNo] = useState('')
	const [limit, setLimit] = useState(10)

	const { isLoading, error, refetch } = useQuery({
		queryKey: ['branchesData', currentPage, limit],
		enabled: !!currentPage,
		queryFn: async () => {
			const res = await getBonusesData()
			setData(res)
			return res
		},
	})

	const handleViewDetails = (record: number) => {
		setSelectedBonus(record)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedBonus(null)
	}

	const getBonusesData = async () => {
		try {
			const res = await api.get(
				`/bonuses/list?limit=${limit}&page=${currentPage}`
			)

			return res.data
		} catch (error) {
			console.error('Error fetching user data:', error)
			throw new Error('Failed to fetch user data')
		}
	}

	const handleSearch = async () => {
		try {
			let query = `/bonuses/list?limit=${limit}&page=${currentPage}`

			if (searchUserId.trim().length >= 4) {
				query += `&user_id=${searchUserId.trim()}`
			} else if (receiptNo.trim().length >= 1) {
				query += `&receipt_no=${receiptNo.trim()}`
			} else {
				const res = await getBonusesData()
				setData(res)
				return
			}

			const res = await api.get(query)
			setData(res.data)
		} catch (error) {
			if ((error as any)?.response?.status === 404) {
				setData({ data: [], total: 0 })
			} else {
				console.error('Search error:', error)
				message.error('Qidiruvda xatolik yuz berdi')
			}
		}
	}

	return {
		isModalOpen,
		selectedBonus,
		handleViewDetails,
		handleCloseModal,
		data,
		isLoading,
		error,
		currentPage,
		setCurrentPage,
		searchUserId,
		setSearchUserId,
		receiptNo,
		setReceiptNo,
		refetch,
		handleSearch,
    limit,
    setLimit,
	}
}

export default UseBonuses

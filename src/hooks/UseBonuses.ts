import { useState } from 'react'
import api from '../api'
import { useQuery } from '@tanstack/react-query'


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
		queryKey: ['branchesData', currentPage, limit, searchUserId, receiptNo],
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

			let query = `/bonuses/list?limit=${limit}&page=${currentPage}`
			if (searchUserId && receiptNo) {
				query += `&user_id=${searchUserId.trim()}&receipt_no=${receiptNo.trim()}`
			} else if (searchUserId) {
				query += `&user_id=${searchUserId.trim()}`
			} else if (receiptNo.trim().length >= 1) {
				query += `&receipt_no=${receiptNo.trim()}`
			}

			const res = await api.get(query)

			return res.data
		} catch (error) {
			console.error('Error fetching user data:', error)
			return { data: [], total: 0 }
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
    limit,
    setLimit,
	}
}

export default UseBonuses

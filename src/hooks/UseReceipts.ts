import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../api'

const UseReceipts = () => {
	interface ReceiptsData {
		data: any[]
		count: number
	}

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [data, setData] = useState<ReceiptsData>({ data: [], count: 0 })
	const [searchUserId, setSearchUserId] = useState('')
	const [receiptNo, setReceiptNo] = useState('')
	const [limit, setLimit] = useState(10)

	const { isLoading, error, refetch } = useQuery({
		queryKey: ['receiptsData', currentPage, limit, searchUserId, receiptNo],
		enabled: !!currentPage,
		queryFn: async () => {
			const res = await getReceiptsData()
			setData(res)
			return res
		},
	})

	const handleViewDetails = (record: string) => {
		setSelectedReceipt(record)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedReceipt(null)
	}

	const getReceiptsData = async () => {
		try {
			let query = `/receipts/list?limit=${limit}&page=${currentPage}`
			if (searchUserId && receiptNo) {
				query += `&user_id=${searchUserId.trim()}&receipt_no=${receiptNo.trim()}`
			} else if (searchUserId) {
				query += `&user_id=${searchUserId.trim()}`
			} else if (receiptNo.trim().length >= 1) {
				query += `&receipt_no=${receiptNo.trim()}`
			}

			const res = await api.get(query)
			return res.data.status !== 200 ? { data: [], count: 0 } : res.data
		} catch (error) {
			console.error('Error fetching receipts data:', error)

			return { data: [], count: 0 }
		}
	}

	return {
		isModalOpen,
		selectedReceipt,
		handleViewDetails,
		handleCloseModal,
		data,
		isLoading,
		error,
		setCurrentPage,
		currentPage,
		searchUserId,
		setSearchUserId,
		receiptNo,
		setReceiptNo,
		refetch,
		limit,
		setLimit,
	}
}

export default UseReceipts

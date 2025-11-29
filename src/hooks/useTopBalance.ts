import { useQuery } from '@tanstack/react-query'
import api from '../api'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'

const useTopBalance = () => {
	const today = dayjs()
	const thirtyDaysAgo = dayjs().subtract(30, 'day')

	const [selectDateRangeTopBalance, setSelectDateRangeTopBalance] = useState<
		[Dayjs, Dayjs] | null
	>([thirtyDaysAgo, today])
	const [page, setPage] = useState<number>(1)
	const [limit, setLimit] = useState<number>(10)
	const [userId, setUserId] = useState<string | null>(null)
	const [phoneNumber, setPhoneNumber] = useState<string | null>(null)

	const getTopBalance = async () => {
		try {
			let query = `/stats/top-balance?page=${page}&limit=${limit}`

			const fromDate =
				selectDateRangeTopBalance?.[0]?.format('YYYY-MM-DD') ||
				thirtyDaysAgo.format('YYYY-MM-DD')
			const toDate =
				selectDateRangeTopBalance?.[1]?.format('YYYY-MM-DD') ||
				today.format('YYYY-MM-DD')

			if (userId) {
				query = `/stats/top-balance?&user_id=${userId}`
			} else if (phoneNumber) {
				query = `/stats/top-balance?&phone_number=${phoneNumber}`
			} else {
				query += `&from=${fromDate}&to=${toDate}`
			}

			const res = await api.get(query)
			return res.data
		} catch (error) {
			console.log(error)
		}
	}

	const { data, isLoading } = useQuery({
		queryKey: ['topBalanceData', selectDateRangeTopBalance, page, limit, userId, phoneNumber],
		queryFn: getTopBalance,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 60000,
	})

	return {
		data,
		isLoading,
		selectDateRangeTopBalance,
		setSelectDateRangeTopBalance,
		page,
		setPage,
		limit,
		setLimit,
		userId,
		setUserId,
		phoneNumber,
		setPhoneNumber,
	}
}
export default useTopBalance

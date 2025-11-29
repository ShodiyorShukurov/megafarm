import { useQuery } from '@tanstack/react-query'
import api from '../api'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'

const useTopChecks = () => {
	const today = dayjs()
	const thirtyDaysAgo = dayjs().subtract(30, 'day')

	const [selectDateRangeTopChecks, setSelectDateRangeTopChecks] = useState<
		[Dayjs, Dayjs] | null
	>([thirtyDaysAgo, today])
	const [page, setPage] = useState<number>(1)
	const [limit, setLimit] = useState<number>(10)
	const [userId, setUserId] = useState<string | null>(null)
	const [phoneNumber, setPhoneNumber] = useState<string | null>(null)

	const getTopChecks = async () => {
		try {
			let query = `/stats/top-checks?page=${page}&limit=${limit}`
			const fromDate =
				selectDateRangeTopChecks?.[0]?.format('YYYY-MM-DD') ||
				thirtyDaysAgo.format('YYYY-MM-DD')

			const toDate =
				selectDateRangeTopChecks?.[1]?.format('YYYY-MM-DD') ||
				today.format('YYYY-MM-DD')

			if (userId) {
				query = `/stats/top-checks?user_id=${userId}`
			} else if (phoneNumber) {
				query = `/stats/top-checks?phone_number=${phoneNumber}`
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
		queryKey: ['topChecksData', selectDateRangeTopChecks, page, limit, userId, phoneNumber],
		queryFn: getTopChecks,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 60000,
	})

	return {
		data,
		isLoading,
		selectDateRangeTopChecks,
		setSelectDateRangeTopChecks,
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
export default useTopChecks

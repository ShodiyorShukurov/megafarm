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

	const getTopBalance = async () => {
		try {
			const fromDate =
				selectDateRangeTopBalance?.[0]?.format('YYYY-MM-DD') ||
				thirtyDaysAgo.format('YYYY-MM-DD')
			const toDate =
				selectDateRangeTopBalance?.[1]?.format('YYYY-MM-DD') ||
				today.format('YYYY-MM-DD')
			const res = await api.get(
				`/stats/top-balance?fromDate=${fromDate}&toDate=${toDate}&page=${page}&limit=${limit}`
			)
			return res.data
		} catch (error) {
			console.log(error)
		}
	}

	const { data, isLoading } = useQuery({
		queryKey: ['topBalanceData', selectDateRangeTopBalance, page, limit],
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
	}
}
export default useTopBalance

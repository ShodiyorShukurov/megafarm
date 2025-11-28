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

	const getTopChecks = async () => {
		try {
			const fromDate =
				selectDateRangeTopChecks?.[0]?.format('YYYY-MM-DD') ||
				thirtyDaysAgo.format('YYYY-MM-DD')
			const toDate =
				selectDateRangeTopChecks?.[1]?.format('YYYY-MM-DD') ||
				today.format('YYYY-MM-DD')
			const res = await api.get(
				`/stats/top-checks?fromDate=${fromDate}&toDate=${toDate}&page=${page}&limit=${limit}`
			)
			return res.data
		} catch (error) {
			console.log(error)
		}
	}

	const { data, isLoading } = useQuery({
		queryKey: ['topChecksData', selectDateRangeTopChecks, page, limit],
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
	}
}
export default useTopChecks

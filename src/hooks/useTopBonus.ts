import { useQuery } from '@tanstack/react-query'
import api from '../api'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'

const useTopBonus = () => {
	const today = dayjs()
	const thirtyDaysAgo = dayjs().subtract(30, 'day')

	const [selectDateRangeTopBonus, setSelectDateRangeTopBonus] = useState<
		[Dayjs, Dayjs] | null
	>([thirtyDaysAgo, today])
	const [page, setPage] = useState<number>(1)
	const [limit, setLimit] = useState<number>(10)

	const getTopBalance = async () => {
		try {
			const fromDate =
				selectDateRangeTopBonus?.[0]?.format('YYYY-MM-DD') ||
				thirtyDaysAgo.format('YYYY-MM-DD')
			const toDate =
				selectDateRangeTopBonus?.[1]?.format('YYYY-MM-DD') ||
				today.format('YYYY-MM-DD')
			const res = await api.get(
				`/stats/top-bonus?fromDate=${fromDate}&toDate=${toDate}&page=${page}&limit=${limit}`
			)
			return res.data
		} catch (error) {
			console.log(error)
		}
	}

	const { data, isLoading } = useQuery({
		queryKey: ['topBonusData', selectDateRangeTopBonus, page, limit],
		queryFn: getTopBalance,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 60000,
	})

	return {
		data,
		isLoading,
		selectDateRangeTopBonus,
		setSelectDateRangeTopBonus,
		page,
		setPage,
		limit,
		setLimit,
	}
}
export default useTopBonus

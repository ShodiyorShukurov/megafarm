import { useQuery } from '@tanstack/react-query'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'
import api from '../api'

const useBranchCashback = () => {
	const today = dayjs()
	const thirtyDaysAgo = dayjs().subtract(30, 'day')

	const [selectDateRangeDau, setSelectDateRangeDau] = useState<
		[Dayjs, Dayjs] | null
	>([thirtyDaysAgo, today])

	const getBranchCashback = async () => {
		try {
			const fromDate =
				selectDateRangeDau?.[0]?.format('YYYY-MM-DD') ||
				thirtyDaysAgo.format('YYYY-MM-DD')
			const toDate =
				selectDateRangeDau?.[1]?.format('YYYY-MM-DD') ||
				today.format('YYYY-MM-DD')
			const res = await api.get(
				`/stats/branch-cashback?fromDate=${fromDate}&toDate=${toDate}`
			)
			return res.data.data
		} catch (error) {
			console.log(error)
		}
	}

	const { data, isLoading } = useQuery({
		queryKey: ['branchCashbackData', selectDateRangeDau],
		queryFn: getBranchCashback,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 60000,
	})

	return { data, setSelectDateRangeDau, selectDateRangeDau, isLoading }
}
export default useBranchCashback

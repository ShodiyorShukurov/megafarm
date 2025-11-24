import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../api'

type MonthlyData = Record<
	string,
	Array<{ branch_name: string; new_users_count: number | string }>
>

const useBranchesNewUsers = () => {
	const [dateRange, setDateRange] = useState<{
		fromMonth: string
		toMonth: string
	} | null>(null)

	const getBranchesNewUsers = async () => {
		try {
			// If no date range is set, fetch all data
			if (!dateRange) {
				const res = await api.get('/stats/branches/new-users')
				return res.data.data
			}

			// If date range is set, send it to backend
			const { fromMonth, toMonth } = dateRange
			const res = await api.get(
				`/stats/branches/new-users?fromMonth=${fromMonth}&toMonth=${toMonth}`
			)
			return res.data.data
		} catch (error) {
			console.log(error)
		}
	}

	const { data, isLoading } = useQuery({
		queryKey: ['branchesNewUsersData', dateRange],
		queryFn: getBranchesNewUsers,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 60000,
	})

	const handleSelectDateRange = (fromMonth: string, toMonth: string) => {
		setDateRange({ fromMonth, toMonth })
	}

	return {
		data: data as MonthlyData | undefined,
		isLoading,
		setSelectDateRangeBranchesNewUsers: handleSelectDateRange,
		selectRanageBranchesNewUsers: dateRange,
	}
}
export default useBranchesNewUsers

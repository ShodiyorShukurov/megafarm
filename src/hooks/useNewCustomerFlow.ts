import { useQuery } from '@tanstack/react-query'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'
import api from '../api'

const useNewCustomerFlow = () => {
	const today = dayjs()
	const thirtyDaysAgo = dayjs().subtract(30, 'day')

	const [selectDateRangeNewCustomer, setSelectDateRangeNewCustomer] = useState<
		[Dayjs, Dayjs] | null
	>([thirtyDaysAgo, today])

	const getNewCustomerFlow = async () => {
		try {
			const fromDate =
				selectDateRangeNewCustomer?.[0]?.format('YYYY-MM-DD') ||
				thirtyDaysAgo.format('YYYY-MM-DD')
			const toDate =
				selectDateRangeNewCustomer?.[1]?.format('YYYY-MM-DD') ||
				today.format('YYYY-MM-DD')
			const res = await api.get(
				`/stats/new-customer-flow?fromDate=${fromDate}&toDate=${toDate}`
			)
			return res.data.data
		} catch (error) {
			console.log(error)
		}
	}

	const { data, isLoading } = useQuery({
		queryKey: ['newCustomerFlowData', selectDateRangeNewCustomer],
		queryFn: getNewCustomerFlow,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 60000,
	})

	return {
		data,
		setSelectDateRangeNewCustomer,
		selectDateRangeNewCustomer,
		isLoading,
		fromDate:
			selectDateRangeNewCustomer?.[0]?.format('YYYY-MM-DD') ||
			thirtyDaysAgo.format('YYYY-MM-DD'),
		toDate:
			selectDateRangeNewCustomer?.[1]?.format('YYYY-MM-DD') ||
			today.format('YYYY-MM-DD'),
	}
}
export default useNewCustomerFlow

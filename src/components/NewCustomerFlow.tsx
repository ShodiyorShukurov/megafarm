import { DatePicker } from 'antd'
import { ApexOptions } from 'apexcharts'
import { Dayjs } from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import ReactApexChart from 'react-apexcharts'

const { RangePicker } = DatePicker

type CustomerFlowItem = {
	branch_id: number
	branch_name: string
	new_users?: string | number
	total_users?: string | number
	checks?: string | number
}

type Props = {
	data?:
		| CustomerFlowItem[]
		| { data?: CustomerFlowItem[] }
		| { current_month?: CustomerFlowItem[] }
	setSelectDateRangeNewCustomer?: (dates: [Dayjs, Dayjs] | null) => void
	selectDateRangeNewCustomer?: [Dayjs, Dayjs] | null
	fromDate?: string
	toDate?: string
}

const NewCustomerFlow: React.FC<Props> = ({
	data,
	setSelectDateRangeNewCustomer,
	selectDateRangeNewCustomer,
}) => {
	// normalize incoming payload to an array
	const items: CustomerFlowItem[] = useMemo(() => {
		if (!data) return []
		if (Array.isArray(data)) return data
		const maybe = data as Record<string, unknown>
		if (Array.isArray(maybe['data'])) return maybe['data'] as CustomerFlowItem[]
		if (Array.isArray(maybe['current_month']))
			return maybe['current_month'] as CustomerFlowItem[]
		return []
	}, [data])

	// formatted list for chart/table
	const formatted = useMemo(() => {
		return items.map(it => ({
			name: (it.branch_name || 'Unknown').toString().trim(),
			newUsers: Number(it.new_users ?? 0) || 0,
			totalUsers: Number(it.total_users ?? 0) || 0,
			checks: Number(it.checks ?? 0) || 0,
			id: it.branch_id,
		}))
	}, [items])

	const totals = useMemo(() => {
		return {
			totalNewUsers: formatted.reduce((s, f) => s + f.newUsers, 0),
			totalUsers: formatted.reduce((s, f) => s + f.totalUsers, 0),
			totalChecks: formatted.reduce((s, f) => s + f.checks, 0),
		}
	}, [formatted])

	const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
		{ name: 'Yangi foydalanuvchilar', data: [] },
		{ name: 'Jami foydalanuvchilar', data: [] },
		{ name: 'Cheklar', data: [] },
	])

	const [options, setOptions] = useState<ApexOptions>({
		chart: { type: 'bar', height: 400 },
		title: {
			text: "Filiallar bo'yicha yangi foydalanuvchi oqimi",
			align: 'left',
			style: { fontSize: '14px' },
		},
		plotOptions: {
			bar: { horizontal: false, columnWidth: '45%', borderRadius: 6 },
		},
		dataLabels: { enabled: false },
		stroke: { show: true, width: 2, colors: ['transparent'] },
		xaxis: { categories: [], labels: { rotate: -45, rotateAlways: true } },
		yaxis: {
			labels: { formatter: (val: number) => Math.round(val).toLocaleString() },
		},
		fill: { opacity: 1 },
		colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
		tooltip: {
			y: {
				formatter: (val: number) => `${Math.round(val).toLocaleString()}`,
			},
		},
		legend: { position: 'top', horizontalAlign: 'left' },
	})

	useEffect(() => {
		if (!formatted.length) {
			setSeries([
				{ name: 'Yangi foydalanuvchilar', data: [] },
				{ name: 'Jami foydalanuvchilar', data: [] },
				{ name: 'Cheklar', data: [] },
			])
			setOptions(prev => ({
				...prev,
				xaxis: { ...(prev.xaxis as object), categories: [] },
			}))
			return
		}

		const categories = formatted.map(f => f.name)
		const newUsers = formatted.map(f => f.newUsers)
		const totalUsers = formatted.map(f => f.totalUsers)
		const checks = formatted.map(f => f.checks)

		setSeries([
			{ name: 'Yangi foydalanuvchilar', data: newUsers },
			{ name: 'Jami foydalanuvchilar', data: totalUsers },
			{ name: 'Cheklar', data: checks },
		])
		setOptions(prev => ({
			...prev,
			xaxis: { ...(prev.xaxis as object), categories },
		}))
	}, [formatted])

	if (!formatted.length) {
		return (
			<div style={{ textAlign: 'center', padding: 20, color: '#595959' }}>
				Hech qanday yangi foydalanuvchi ma'lumotlari mavjud emas.
			</div>
		)
	}

	return (
		<div style={{ width: '100%', marginTop: 16 }}>
			{/* Summary Cards */}
			<div
				style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}
			>
				<div
					style={{
						flex: 1,
						minWidth: 200,
						background: '#fff',
						padding: 12,
						borderRadius: 8,
						boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
					}}
				>
					<div style={{ fontSize: 12, color: '#777' }}>
						Jami yangi foydalanuvchilar
					</div>
					<div style={{ fontSize: 18, fontWeight: 600 }}>
						{totals.totalNewUsers.toLocaleString()}
					</div>
				</div>
				<div
					style={{
						flex: 1,
						minWidth: 200,
						background: '#fff',
						padding: 12,
						borderRadius: 8,
						boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
					}}
				>
					<div style={{ fontSize: 12, color: '#777' }}>
						Jami foydalanuvchilar
					</div>
					<div style={{ fontSize: 18, fontWeight: 600 }}>
						{totals.totalUsers.toLocaleString()}
					</div>
				</div>
				<div
					style={{
						flex: 1,
						minWidth: 200,
						background: '#fff',
						padding: 12,
						borderRadius: 8,
						boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
					}}
				>
					<div style={{ fontSize: 12, color: '#777' }}>Jami cheklar</div>
					<div style={{ fontSize: 18, fontWeight: 600 }}>
						{totals.totalChecks.toLocaleString()}
					</div>
				</div>
			</div>

			{/* Date Range Picker */}
			{setSelectDateRangeNewCustomer && (
				<div style={{ marginBottom: 16 }}>
					<RangePicker
						onChange={dates => {
							if (dates && dates[0] && dates[1]) {
								setSelectDateRangeNewCustomer(dates as [Dayjs, Dayjs])
							}
						}}
						value={selectDateRangeNewCustomer ?? undefined}
						// style={{ width: '100%' }}
					/>
				</div>
			)}

			{/* Chart */}
			<div
				style={{
					background: '#fff',
					padding: 12,
					borderRadius: 8,
					marginBottom: 12,
				}}
			>
				<ReactApexChart
					options={options}
					series={series}
					type='bar'
					height={400}
				/>
			</div>

		</div>
	)
}

export default NewCustomerFlow

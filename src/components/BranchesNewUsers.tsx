import { Button, Select, Space, Tabs, TabsProps } from 'antd'
import { ApexOptions } from 'apexcharts'
import React, { useEffect, useMemo, useState } from 'react'
import ReactApexChart from 'react-apexcharts'

type BranchNewUsers = {
	branch_name: string
	new_users_count: number | string
}

type MonthlyData = Record<string, BranchNewUsers[]>

type Props = {
	branchesNewUsersData?: MonthlyData | { data?: MonthlyData }
	setSelectDateRangeBranchesNewUsers?: (
		fromMonth: string,
		toMonth: string
	) => void
}

const BranchesNewUsers: React.FC<Props> = ({
	branchesNewUsersData,
	setSelectDateRangeBranchesNewUsers,
}) => {
	const [fromYear, setFromYear] = useState<string | null>(null)
	const [fromMonth, setFromMonth] = useState<string | null>(null)
	const [toYear, setToYear] = useState<string | null>(null)
	const [toMonth, setToMonth] = useState<string | null>(null)

	// Normalize data
	const monthlyData: MonthlyData = useMemo(() => {
		if (!branchesNewUsersData) return {}
		if (
			typeof branchesNewUsersData === 'object' &&
			!Array.isArray(branchesNewUsersData) &&
			'data' in branchesNewUsersData
		) {
			return (branchesNewUsersData as { data?: MonthlyData }).data || {}
		}
		return branchesNewUsersData as MonthlyData
	}, [branchesNewUsersData])

	// Get months in order
	const monthKeys = useMemo(() => {
		return Object.keys(monthlyData)
			.filter(key => /^\d{4}-\d{2}$/.test(key))
			.sort()
	}, [monthlyData])

	// Build a years list that contains at least the last 10 years and extends up to 2035
	const years = useMemo(() => {
		const availableYears = new Set(monthKeys.map(key => key.split('-')[0]))
		const currentYear = new Date().getFullYear()
		// ensure we include at least the last 10 years
		const startYear = Math.max(currentYear - 9, 1970)
		// user requested years up to 2035
		const endYear = Math.max(currentYear, 2035)
		for (let y = startYear; y <= endYear; y++) availableYears.add(String(y))
		return Array.from(availableYears).sort((a, b) => parseInt(a) - parseInt(b))
	}, [monthKeys])

	// Show full months (01..12) for selectors so user can pick any month of the year
	const allMonths = useMemo(() => {
		return Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
	}, [])

	const fromMonthsForYear = useMemo(() => {
		if (!fromYear) return []
		return allMonths
	}, [fromYear, allMonths])

	const toMonthsForYear = useMemo(() => {
		if (!toYear) return []
		return allMonths
	}, [toYear, allMonths])

	// Initialize with reasonable defaults: if data exists use data range, otherwise use last 12 months
	useEffect(() => {
		if (!fromYear) {
			if (monthKeys.length > 0) {
				const firstKey = monthKeys[0]
				const lastKey = monthKeys[monthKeys.length - 1]
				const [fYear, fMonth] = firstKey.split('-')
				const [tYear, tMonth] = lastKey.split('-')
				setFromYear(fYear)
				setFromMonth(fMonth)
				setToYear(tYear)
				setToMonth(tMonth)
			} else {
				const now = new Date()
				const curYear = String(now.getFullYear())
				const curMonth = String(now.getMonth() + 1).padStart(2, '0')
				// default to current month as both from and to
				setFromYear(curYear)
				setFromMonth(curMonth)
				setToYear(curYear)
				setToMonth(curMonth)
			}
		}
	}, [monthKeys, fromYear])

	// Format month display
	const formatMonthLabel = (key: string) => {
		const [year, month] = key.split('-')
		const months = [
			'Yanvar',
			'Fevral',
			'Mart',
			'Aprel',
			'May',
			'Iyun',
			'Iyul',
			'Avgust',
			'Sentabr',
			'Oktabr',
			'Noyabr',
			'Dekabr',
		]
		return `${months[parseInt(month) - 1]} ${year}`
	}

	// Generate all months between from and to
	const filteredMonthKeys = useMemo(() => {
		if (!fromYear || !fromMonth || !toYear || !toMonth) return []

		const from = new Date(`${fromYear}-${fromMonth}-01`)
		const to = new Date(`${toYear}-${toMonth}-01`)

		if (from > to) return []

		const result: string[] = []
		const current = new Date(from)
		while (current <= to) {
			const year = current.getFullYear()
			const month = String(current.getMonth() + 1).padStart(2, '0')
			const key = `${year}-${month}`
			if (monthlyData[key]) {
				result.push(key)
			}
			current.setMonth(current.getMonth() + 1)
		}
		return result
	}, [fromYear, fromMonth, toYear, toMonth, monthlyData])

	// Create tab content for each month in range
	const tabItems: TabsProps['items'] = useMemo(() => {
		return filteredMonthKeys.map(monthKey => ({
			key: monthKey,
			label: formatMonthLabel(monthKey),
			children: <MonthlyTab data={monthlyData[monthKey] || []} />,
		}))
	}, [filteredMonthKeys, monthlyData])

	const handleApplyRange = () => {
		if (
			fromYear &&
			fromMonth &&
			toYear &&
			toMonth &&
			setSelectDateRangeBranchesNewUsers
		) {
			const fromStr = `${fromYear}-${fromMonth}`
			const toStr = `${toYear}-${toMonth}`
			setSelectDateRangeBranchesNewUsers(fromStr, toStr)
		}
	}

	if (!monthKeys.length) {
		return (
			<div style={{ textAlign: 'center', padding: 20, color: '#595959' }}>
				Hech qanday oylik yangi foydalanuvchi ma'lumotlari mavjud emas.
			</div>
		)
	}

	return (
		<div style={{ width: '100%', marginTop: 16 }}>
			{/* Date Range Selectors */}
			<div
				style={{
					display: 'flex',
					gap: 16,
					marginBottom: 16,
					flexWrap: 'wrap',
					alignItems: 'flex-end',
					background: '#fff',
					padding: 12,
					borderRadius: 8,
					boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
				}}
			>
				{/* From Date */}
				<div>
					<label
						style={{
							fontSize: 12,
							color: '#777',
							marginRight: 8,
							display: 'block',
							marginBottom: 4,
						}}
					>
						Boshlanish oyı va yili:
					</label>
					<Space>
						<Select
							style={{ width: 100 }}
							placeholder='Yil'
							value={fromYear}
							onChange={setFromYear}
						>
							{years.map(year => (
								<Select.Option key={year} value={year}>
									{year}
								</Select.Option>
							))}
						</Select>
						<Select
							style={{ width: 100 }}
							placeholder='Oy'
							value={fromMonth}
							onChange={setFromMonth}
						>
							{fromMonthsForYear.map(month => {
								const monthNames = [
									'Yanvar',
									'Fevral',
									'Mart',
									'Aprel',
									'May',
									'Iyun',
									'Iyul',
									'Avgust',
									'Sentabr',
									'Oktabr',
									'Noyabr',
									'Dekabr',
								]
								return (
									<Select.Option key={month} value={month}>
										{monthNames[parseInt(month) - 1]}
									</Select.Option>
								)
							})}
						</Select>
					</Space>
				</div>

				{/* To Date */}
				<div>
					<label
						style={{
							fontSize: 12,
							color: '#777',
							marginRight: 8,
							display: 'block',
							marginBottom: 4,
						}}
					>
						Tugash oyı va yili:
					</label>
					<Space>
						<Select
							style={{ width: 100 }}
							placeholder='Yil'
							value={toYear}
							onChange={setToYear}
						>
							{years.map(year => (
								<Select.Option key={year} value={year}>
									{year}
								</Select.Option>
							))}
						</Select>
						<Select
							style={{ width: 100 }}
							placeholder='Oy'
							value={toMonth}
							onChange={setToMonth}
						>
							{toMonthsForYear.map(month => {
								const monthNames = [
									'Yanvar',
									'Fevral',
									'Mart',
									'Aprel',
									'May',
									'Iyun',
									'Iyul',
									'Avgust',
									'Sentabr',
									'Oktabr',
									'Noyabr',
									'Dekabr',
								]
								return (
									<Select.Option key={month} value={month}>
										{monthNames[parseInt(month) - 1]}
									</Select.Option>
								)
							})}
						</Select>
					</Space>
				</div>

				{/* Apply Button */}
				<Button type='primary' onClick={handleApplyRange}>
					Yuborish
				</Button>
			</div>

			{/* Tabs */}
			{filteredMonthKeys.length > 0 ? (
				<Tabs items={tabItems} defaultActiveKey={filteredMonthKeys[0]} />
			) : (
				<div style={{ textAlign: 'center', padding: 20, color: '#595959' }}>
					Tanlangan sana uchun ma'lumot yo'q.
				</div>
			)}
		</div>
	)
}

// Monthly Tab Component
type MonthlyTabProps = {
	data: BranchNewUsers[]
}

const MonthlyTab: React.FC<MonthlyTabProps> = ({ data }) => {
	const formatted = useMemo(() => {
		return data.map(item => ({
			name: (item.branch_name || 'Unknown').trim(),
			count: Number(item.new_users_count ?? 0) || 0,
		}))
	}, [data])

	const total = useMemo(() => {
		return formatted.reduce((sum, f) => sum + f.count, 0)
	}, [formatted])

	const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
		{ name: 'Yangi foydalanuvchilar', data: [] },
	])

	const [options, setOptions] = useState<ApexOptions>({
		chart: { type: 'bar', height: 350 },
		title: {
			text: "Filiallar bo'yicha yangi foydalanuvchilar",
			align: 'left',
			style: { fontSize: '14px' },
		},
		plotOptions: {
			bar: { horizontal: false, columnWidth: '55%', borderRadius: 6 },
		},
		dataLabels: { enabled: false },
		stroke: { show: true, width: 2, colors: ['transparent'] },
		xaxis: { categories: [], labels: { rotate: -45, rotateAlways: true } },
		yaxis: {
			labels: { formatter: (val: number) => Math.round(val).toLocaleString() },
		},
		fill: { opacity: 1 },
		colors: ['#5C7CFA'],
		tooltip: {
			y: {
				formatter: (val: number) =>
					`${Math.round(val).toLocaleString()} foydalanuvchi`,
			},
		},
		legend: { position: 'top', horizontalAlign: 'left' },
	})

	useEffect(() => {
		if (!formatted.length) {
			setSeries([{ name: 'Yangi foydalanuvchilar', data: [] }])
			setOptions(prev => ({
				...prev,
				xaxis: { ...(prev.xaxis as object), categories: [] },
			}))
			return
		}

		const categories = formatted.map(f => f.name)
		const counts = formatted.map(f => f.count)

		setSeries([{ name: 'Yangi foydalanuvchilar', data: counts }])
		setOptions(prev => ({
			...prev,
			xaxis: { ...(prev.xaxis as object), categories },
		}))
	}, [formatted])

	if (!formatted.length) {
		return (
			<div style={{ textAlign: 'center', padding: 20, color: '#595959' }}>
				Hech qanday ma'lumot yo'q.
			</div>
		)
	}

	return (
		<div style={{ width: '100%', marginTop: 12 }}>
			{/* Summary Card */}
			<div
				style={{
					background: '#fff',
					padding: 12,
					borderRadius: 8,
					marginBottom: 12,
					boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
				}}
			>
				<div style={{ fontSize: 12, color: '#777' }}>
					Jami yangi foydalanuvchilar
				</div>
				<div style={{ fontSize: 22, fontWeight: 600 }}>
					{total.toLocaleString()}
				</div>
			</div>

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
					height={350}
				/>
			</div>

		</div>
	)
}

export default BranchesNewUsers

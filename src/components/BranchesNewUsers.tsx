import { Button, Select, Space } from 'antd'
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

	// Build stacked chart data from all available months
	const allMonthKeys = useMemo(() => {
		return Object.keys(monthlyData)
			.filter(key => /^\d{4}-\d{2}$/.test(key))
			.sort()
	}, [monthlyData])

	// Get all unique branch names
	const allBranches = useMemo(() => {
		const branchSet = new Set<string>()
		allMonthKeys.forEach(monthKey => {
			monthlyData[monthKey]?.forEach(item => {
				branchSet.add((item.branch_name || 'Unknown').trim())
			})
		})
		return Array.from(branchSet)
	}, [allMonthKeys, monthlyData])

	if (!monthKeys.length) {
		return (
			<div style={{ textAlign: 'center', padding: 20, color: '#595959' }}>
				Hech qanday oylik yangi foydalanuvchi ma'lumotlari mavjud emas.
			</div>
		)
	}

	return (
		<div
			className='border p-4 border-gray-300 rounded-2xl'
			style={{ width: '100%', marginTop: 16 }}
		>
			<h2 className='text-xl font-bold mb-2'>
				Filiallar bo'yicha yangi foydalanuvchilar
			</h2>

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

			{/* Chart */}
			{allMonthKeys.length > 0 ? (
				<MonthlyTab
					allMonthKeys={allMonthKeys}
					allBranches={allBranches}
					monthlyData={monthlyData}
				/>
			) : (
				<div style={{ textAlign: 'center', padding: 20, color: '#595959' }}>
					Tanlangan sana uchun ma'lumot yo'q.
				</div>
			)}
		</div>
	)
}

// Monthly Tab Component - Stacked Chart by Months
type MonthlyTabProps = {
	allMonthKeys: string[]
	allBranches: string[]
	monthlyData: MonthlyData
}

const MonthlyTab: React.FC<MonthlyTabProps> = ({
	allMonthKeys,
	allBranches,
	monthlyData,
}) => {
	// Colors for branches
	const branchColors = useMemo(() => {
		const colors = [
			'#FF6B6B',
			'#4ECDC4',
			'#45B7D1',
			'#FFA07A',
			'#98D8C8',
			'#F7DC6F',
			'#BB8FCE',
		]
		const colorMap: Record<string, string> = {}
		allBranches.forEach((branch, idx) => {
			colorMap[branch] = colors[idx % colors.length]
		})
		return colorMap
	}, [allBranches])

	// Format month name
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

	// Build series data for chart
	const [series, setSeries] = useState<{ name: string; data: number[] }[]>([])
	const [options, setOptions] = useState<ApexOptions>({
		chart: { type: 'bar', stacked: false, height: 400 },
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '60%',
				dataLabels: { position: 'top' },
			},
		},
		xaxis: { categories: [] },
		yaxis: {
			labels: { formatter: (val: number) => Math.round(val).toLocaleString() },
		},
		dataLabels: { enabled: false },
		fill: { opacity: 1 },
		stroke: { show: false },
		legend: { position: 'top', horizontalAlign: 'left' },
		tooltip: {
			y: {
				formatter: (val: number) =>
					`${Math.round(val).toLocaleString()} yangi foydalanuvchi`,
			},
		},
	})

	useEffect(() => {
		// Build series for each branch with months as X-axis categories
		const newSeries = allBranches.map(branch => {
			const data = allMonthKeys.map(monthKey => {
				const monthData = monthlyData[monthKey] || []
				const branchData = monthData.find(
					item => (item.branch_name || 'Unknown').trim() === branch
				)
				return Number(branchData?.new_users_count ?? 0) || 0
			})
			return {
				name: branch,
				data,
			}
		})

		setSeries(newSeries)

		// Update options with month labels and colors
		const colors = allBranches.map(branch => branchColors[branch])
		const categories = allMonthKeys.map(formatMonthLabel)

		setOptions(prev => ({
			...prev,
			xaxis: { ...(prev.xaxis as object), categories },
			colors,
		}))
	}, [allMonthKeys, allBranches, monthlyData, branchColors])

	if (!allMonthKeys.length || !allBranches.length) {
		return (
			<div style={{ textAlign: 'center', padding: 20, color: '#595959' }}>
				Hech qanday ma'lumot yo'q.
			</div>
		)
	}

	return (
		<div style={{ width: '100%', marginTop: 12 }}>
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

export default BranchesNewUsers

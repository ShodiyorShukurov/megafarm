import { DatePicker } from 'antd'
import { ApexOptions } from 'apexcharts'
import { Dayjs } from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import ReactApexChart from 'react-apexcharts'

const { RangePicker } = DatePicker

type BranchItem = {
	branch_id: number
	name_uz: string
	name_ru?: string
	cashback_given?: string | number
	cashback_used?: string | number
}

type Props = {
	branchCashbackData?:
		| BranchItem[]
		| { data?: BranchItem[] }
		| { current_month?: BranchItem[] }
	setSelectDateRangeDau: (dates: [Dayjs, Dayjs] | null) => void
	selectDateRangeDau: [Dayjs, Dayjs] | null
}

const BranchCashback: React.FC<Props> = ({
	branchCashbackData,
	setSelectDateRangeDau,
	selectDateRangeDau,
}) => {
	// normalize incoming payload to an array of BranchItem
	const items: BranchItem[] = useMemo(() => {
		if (!branchCashbackData) return []
		if (Array.isArray(branchCashbackData)) return branchCashbackData
		const maybe = branchCashbackData as Record<string, unknown>
		if (Array.isArray(maybe['data'])) return maybe['data'] as BranchItem[]
		if (Array.isArray(maybe['current_month']))
			return maybe['current_month'] as BranchItem[]
		return []
	}, [branchCashbackData])

	// formatted list for chart/table
	const formatted = useMemo(() => {
		return items.map(it => ({
			name: (it.name_uz || 'Unknown').toString().trim(),
			given: Number(it.cashback_given ?? 0) || 0,
			used: Number(it.cashback_used ?? 0) || 0,
			id: it.branch_id,
		}))
	}, [items])

	const totals = useMemo(() => {
		return {
			totalGiven: formatted.reduce((s, f) => s + f.given, 0),
			totalUsed: formatted.reduce((s, f) => s + f.used, 0),
		}
	}, [formatted])

	const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
		{ name: 'Kashbak berilgan', data: [] },
		{ name: 'Kashbak ishlatilgan', data: [] },
	])

	const [options, setOptions] = useState<ApexOptions>({
		chart: { type: 'bar', height: 380 },
		plotOptions: {
			bar: { horizontal: false, columnWidth: '50%', borderRadius: 6 },
		},
		dataLabels: { enabled: false },
		stroke: { show: true, width: 2, colors: ['transparent'] },
		xaxis: { categories: [], labels: { rotate: -45, rotateAlways: true } },
		yaxis: {
			labels: { formatter: (val: number) => Math.round(val).toLocaleString() },
		},
		fill: { opacity: 1 },
		colors: ['#1E88E5', '#43A047'],
		tooltip: {
			y: {
				formatter: (val: number, opts?: { seriesIndex?: number }) => {
					// series 0 is money (UZS), series 1 is count or used amount
					if (opts && opts.seriesIndex === 0)
						return `${Math.round(val).toLocaleString()} UZS`
					return `${Math.round(val).toLocaleString()}`
				},
			},
		},
		legend: { position: 'top', horizontalAlign: 'left' },
	})

	useEffect(() => {
		if (!formatted.length) {
			setSeries([
				{ name: 'Kashback berilgan', data: [] },
				{ name: 'Kashback ishlatilganlar', data: [] },
			])
			setOptions(prev => ({
				...prev,
				xaxis: { ...(prev.xaxis as object), categories: [] },
			}))
			return
		}

		const categories = formatted.map(f => f.name)
		const given = formatted.map(f => f.given)
		const used = formatted.map(f => f.used)

		setSeries([
			{ name: 'Kashback berilgan', data: given },
			{ name: 'Kashback ishlatilgan', data: used },
		])
		setOptions(prev => ({
			...prev,
			xaxis: { ...(prev.xaxis as object), categories },
		}))
	}, [formatted])

	if (!formatted.length) {
		return (
			<div style={{ textAlign: 'center', padding: 20, color: '#595959' }}>
				Hech qanday filial keshbek ma'lumotlari mavjud emas.
			</div>
		)
	}

	return (
		<div className='border p-4 rounded-2xl border-gray-300' style={{ width: '100%', marginTop: 16 }}>
			<h2 className='text-xl font-bold mb-2'>
				Filiallar bo'yicha keshbek ko'rinishi
			</h2>
			<RangePicker
				onChange={dates => {
					if (dates && dates[0] && dates[1]) {
						setSelectDateRangeDau(dates as [Dayjs, Dayjs])
					}
				}}
				allowClear={false}
				value={selectDateRangeDau ?? undefined}
				style={{ marginBottom: 16 }}
			/>
			<div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
				<div
					style={{
						flex: 1,
						background: '#fff',
						padding: 12,
						borderRadius: 8,
						boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
					}}
				>
					<div style={{ fontSize: 12, color: '#777' }}>
						Jami keshbek berilgan
					</div>
					<div style={{ fontSize: 18, fontWeight: 600 }}>
						{Math.round(totals.totalGiven).toLocaleString()} UZS
					</div>
				</div>
				<div
					style={{
						flex: 1,
						background: '#fff',
						padding: 12,
						borderRadius: 8,
						boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
					}}
				>
					<div style={{ fontSize: 12, color: '#777' }}>
						Jami keshbek ishlatilgan
					</div>
					<div style={{ fontSize: 18, fontWeight: 600 }}>
						{Math.round(totals.totalUsed).toLocaleString()}
					</div>
				</div>
			</div>

			<div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
				<ReactApexChart
					options={options}
					series={series}
					type='bar'
					height={380}
				/>
			</div>
		</div>
	)
}

export default BranchCashback

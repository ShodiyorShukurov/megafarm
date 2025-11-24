import React from 'react'
import Admin from '../../components/Admin'

import {
	DollarOutlined,
	FileTextOutlined,
	GiftOutlined,
	UserOutlined,
} from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'
import BranchCashback from '../../components/BranchCashback'
import NewCustomerFlow from '../../components/NewCustomerFlow'
import useBranchCashback from '../../hooks/useBranchCashback'
import UseDashboard from '../../hooks/UseDashboard'
import useNewCustomerFlow from '../../hooks/useNewCustomerFlow'
import BranchesNewUsers from '../../components/BranchesNewUsers'
import useBranchesNewUsers from '../../hooks/useBranchesNewUsers'
import Chart from '../../components/Chart'
import ApexChartData from '../../components/ApexChart'

const ApexChart: React.FC = () => {
	const { data, isLoading, error } = UseDashboard()

	const {
		data: branchCashbackData,
		setSelectDateRangeDau,
		selectDateRangeDau,
	} = useBranchCashback()

	const {
		data: newCustomerFlow,
		setSelectDateRangeNewCustomer,
		selectDateRangeNewCustomer,
		fromDate: newCustomerFromDate,
		toDate: newCustomerToDate,
	} = useNewCustomerFlow()

	const { data: branchesNewUsersData, setSelectDateRangeBranchesNewUsers } =
		useBranchesNewUsers()

	if (isLoading) return <Admin>Loading...</Admin>
	if (error) return <Admin>Error: {error?.message}</Admin>

	return (
		<Admin>
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic
							title='Jami summa'
							value={Number(data?.total_amount || 0)}
							precision={0}
							formatter={value => `${value.toLocaleString()} UZS`}
							prefix={<DollarOutlined />}
							valueStyle={{ color: '#3f8600' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic
							title='Jami keshbek'
							value={Number(data?.total_bonus || 0)}
							precision={2}
							formatter={value => `${value.toLocaleString()} UZS`}
							prefix={<GiftOutlined />}
							valueStyle={{ color: '#cf1322' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic
							title='Jami foydalanuvchilar'
							value={Number(data?.total_user || 0)}
							prefix={<UserOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic
							title='Jami kvitansiyalar'
							value={Number(data?.total_receipt || 0)}
							prefix={<FileTextOutlined />}
							valueStyle={{ color: '#faad14' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic
							title='Ishlatilgan keshbek'
							value={Number(data?.total_bonus_used || 0)}
							precision={2}
							formatter={value => `${value.toLocaleString()} UZS`}
							prefix={<GiftOutlined />}
							valueStyle={{ color: '#fa541c' }}
						/>
					</Card>
				</Col>
			</Row>

			<BranchCashback
				branchCashbackData={branchCashbackData}
				setSelectDateRangeDau={setSelectDateRangeDau}
				selectDateRangeDau={selectDateRangeDau}
			/>

			<NewCustomerFlow
				setSelectDateRangeNewCustomer={setSelectDateRangeNewCustomer}
				selectDateRangeNewCustomer={selectDateRangeNewCustomer}
				data={newCustomerFlow}
				fromDate={newCustomerFromDate}
				toDate={newCustomerToDate}
			/>

			<BranchesNewUsers
				branchesNewUsersData={branchesNewUsersData}
				setSelectDateRangeBranchesNewUsers={setSelectDateRangeBranchesNewUsers}
			/>

			<Chart data={data} />

			<ApexChartData data={data} />
		</Admin>
	)
}

export default ApexChart

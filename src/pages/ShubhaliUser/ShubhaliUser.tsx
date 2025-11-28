import Admin from '../../components/Admin'
import useTopBalance from '../../hooks/useTopBalance'
import useTopBonus from '../../hooks/useTopBonus'
import useTopChecks from '../../hooks/useTopChecks'
import TopBalanceUserData from './data/TopBalanceUserData'
import TopBonusUserData from './data/TopBonusUserData'
import TopChecksUserData from './data/TopChecksUserData'

const ShubhaliUser = () => {
	const {
		data,
		selectDateRangeTopChecks,
		setSelectDateRangeTopChecks,
		page,
		setPage,
	} = useTopChecks()

	const {
		data: topBalanceData,
		selectDateRangeTopBalance,
		setSelectDateRangeTopBalance,
		page: balancePage,
		setPage: setBalancePage,
	} = useTopBalance()

	const {
		data: topBonusData,
		selectDateRangeTopBonus,
		setSelectDateRangeTopBonus,
		page: bonusPage,
		setPage: setBonusPage,
	} = useTopBonus()

	return (
		<Admin>
			<TopChecksUserData
				data={data?.data || []}
				count={data?.total || 0}
				selectDateRangeTopChecks={selectDateRangeTopChecks}
				setSelectDateRangeTopChecks={setSelectDateRangeTopChecks}
				page={page}
				setPage={setPage}
			/>

			<TopBalanceUserData
				data={topBalanceData?.data || []}
				count={topBalanceData?.total || 0}
				selectDateRangeTopBalance={selectDateRangeTopBalance}
				setSelectDateRangeTopBalance={setSelectDateRangeTopBalance}
				page={balancePage}
				setPage={setBalancePage}
			/>

			<TopBonusUserData
				data={topBonusData?.data || []}
				count={topBonusData?.total || 0}
				selectDateRangeTopBonus={selectDateRangeTopBonus}
				setSelectDateRangeTopBonus={setSelectDateRangeTopBonus}
				page={bonusPage}
				setPage={setBonusPage}
			/>
		</Admin>
	)
}

export default ShubhaliUser

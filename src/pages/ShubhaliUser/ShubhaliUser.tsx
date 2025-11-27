import Admin from '../../components/Admin'
import useTopChecks from '../../hooks/useTopChecks'

const ShubhaliUser = () => {
	const {
		data,
		selectDateRangeTopChecks,
		setSelectDateRangeTopChecks,
		page,
		setPage,
	} = useTopChecks()

	console.log('ShubhaliUser data:', data)

	return <Admin>ShubhaliUser</Admin>
}

export default ShubhaliUser

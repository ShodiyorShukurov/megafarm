import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import { message } from 'antd'

const useDeleteBonuses = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (bonusId: number) => {
			const res = await api.delete(`/bonus/${bonusId}`)
			return res.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['bonusesData'],
			})
			message.success('Bonus muvaffaqiyatli oʻchirildi!')
		},
		onError: () => {
			message.error('Bonusni oʻchirishda xatolik yuz berdi!')
		},
	})
}

export default useDeleteBonuses

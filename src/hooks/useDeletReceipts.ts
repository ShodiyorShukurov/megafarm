import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import { message } from 'antd'

const useDeleteReceipts = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (receiptId: number) => {
			const res = await api.delete(`/receipt/${receiptId}`)
			return res.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['receiptsData'],
			})
			message.success('Kvitansiya muvaffaqiyatli oʻchirildi!')
		},
		onError: () => {
			message.error('Kvitansiyani oʻchirishda xatolik yuz berdi!')
		},
	})
}

export default useDeleteReceipts

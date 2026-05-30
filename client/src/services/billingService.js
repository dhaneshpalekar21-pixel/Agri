import api from './api'

export const getBills = (params) => api.get('/bills', { params })
export const getBill = (id) => api.get(`/bills/${id}`)
export const createBill = (data) => api.post('/bills', data)
export const getSalesAnalytics = (params) => api.get('/analytics/sales', { params })
export const getProfitAnalytics = (params) => api.get('/analytics/profit', { params })
export const getTopProducts = () => api.get('/analytics/top-products')

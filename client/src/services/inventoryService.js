import api from './api'

export const getStock = (params) => api.get('/stocks', { params })
export const updateStock = (id, data) => api.put(`/stocks/${id}`, data)
export const addStockEntry = (data) => api.post('/stocks/entry', data)
export const getStockHistory = (productId) => api.get(`/stocks/history/${productId}`)
export const getLowStockProducts = () => api.get('/stocks/low-stock')

import { useState, useEffect } from 'react'
import { Plus, ArrowUp, ArrowDown, History } from 'lucide-react'
import DataTable from '../../components/DataTable'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import { getProducts, updateProduct } from '../../services/productService'

function StockBar({ qty, threshold }) {
  const pct = Math.min(100, (qty / Math.max(threshold * 3, 1)) * 100)
  const color = qty === 0 ? '#ef4444' : qty <= threshold ? '#f97316' : '#2E7D32'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold w-12 text-right" style={{ color }}>
        {qty}
      </span>
    </div>
  )
}

export default function Inventory() {
  const [stock, setStock] = useState([])
  const [entryModal, setEntryModal] = useState(null) // {product, type: 'in'|'out'}
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(true)

  const fetchStock = async () => {
    setLoading(true)
    try {
      const res = await getProducts({ limit: 500 })
      setStock(res.data.products || [])
    } catch (err) {
      toast.error('Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStock()
  }, [])

  const chartData = stock.slice(0, 10).map(s => ({
    name: s.name.split(' ')[0],
    stock: s.quantity
  }))

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (val, row) => (
        <div>
          <p className="font-medium text-gray-800 text-sm">{val}</p>
          <p className="text-xs text-gray-400">{row.brand || 'No Brand'}</p>
        </div>
      ),
    },
    { key: 'category', label: 'Category', render: (val) => <Badge label={val} color="blue" /> },
    {
      key: 'quantity',
      label: 'Stock Level',
      render: (val, row) => (
        <div className="w-36">
          <StockBar qty={val} threshold={row.lowStockThreshold || 5} />
          <p className="text-xs text-gray-400 mt-0.5">{val} {row.unit} / Threshold: {row.lowStockThreshold || 5}</p>
        </div>
      ),
    },
    {
      key: 'quantity',
      label: 'Status',
      sortable: false,
      render: (val, row) => {
        const threshold = row.lowStockThreshold || 5
        if (val === 0) return <Badge label="Out of Stock" color="red" />
        if (val <= threshold) return <Badge label="Low Stock" color="orange" />
        return <Badge label="In Stock" color="green" />
      },
    },
    { key: 'updatedAt', label: 'Last Updated', render: (val) => <span className="text-xs text-gray-400">{val ? new Date(val).toLocaleDateString('en-IN') : '—'}</span> },
    {
      key: '_id',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setEntryModal({ product: row, type: 'in' }); reset() }}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
          >
            <ArrowUp size={12} /> In
          </button>
          <button
            onClick={() => { setEntryModal({ product: row, type: 'out' }); reset() }}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
          >
            <ArrowDown size={12} /> Out
          </button>
        </div>
      ),
    },
  ]

  const onStockEntry = async (data) => {
    const qtyChange = parseInt(data.quantity)
    const currentQty = entryModal.product.quantity
    const newQty = entryModal.type === 'in' ? currentQty + qtyChange : Math.max(0, currentQty - qtyChange)

    try {
      await updateProduct(entryModal.product._id, { quantity: newQty })
      setStock(prev => prev.map(p =>
        p._id === entryModal.product._id
          ? { ...p, quantity: newQty, updatedAt: new Date().toISOString() }
          : p
      ))
      toast.success(`Stock ${entryModal.type === 'in' ? 'added' : 'removed'} successfully!`)
    } catch (err) {
      toast.error('Failed to update stock')
    } finally {
      setEntryModal(null)
      reset()
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Inventory</h1>
          <p className="text-sm text-gray-500">Real-time stock management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Items', value: stock.length, color: '#2E7D32' },
          { label: 'In Stock', value: stock.filter(s => s.quantity > s.lowThreshold).length, color: '#2E7D32' },
          { label: 'Low Stock', value: stock.filter(s => s.quantity > 0 && s.quantity <= s.lowThreshold).length, color: '#f97316' },
          { label: 'Out of Stock', value: stock.filter(s => s.quantity === 0).length, color: '#dc2626' },
        ].map(s => (
          <div key={s.label} className="kpi-card text-center p-4">
            <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: 'Poppins, sans-serif' }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="kpi-card">
        <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Stock Levels Overview</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
            <Bar dataKey="stock" fill="#2E7D32" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={stock} searchPlaceholder="Search by product, category, supplier..." />

      {/* Stock Entry Modal */}
      <Modal
        open={!!entryModal}
        onClose={() => setEntryModal(null)}
        title={`Stock ${entryModal?.type === 'in' ? 'In ↑' : 'Out ↓'} — ${entryModal?.product?.name}`}
        size="sm"
        footer={
          <>
            <button onClick={() => setEntryModal(null)} className="btn-secondary">Cancel</button>
            <button
              form="stock-entry-form"
              type="submit"
              className={entryModal?.type === 'in' ? 'btn-primary' : 'btn-danger'}
            >
              {entryModal?.type === 'in' ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
              {entryModal?.type === 'in' ? 'Add Stock' : 'Remove Stock'}
            </button>
          </>
        }
      >
        <form id="stock-entry-form" onSubmit={handleSubmit(onStockEntry)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              id="stock-qty"
              type="number"
              className={`input-field ${errors.quantity ? 'border-red-400' : ''}`}
              placeholder="Enter quantity"
              {...register('quantity', { required: 'Quantity is required', min: { value: 1, message: 'Min 1' } })}
            />
            {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier / Reason</label>
            <input id="stock-reason" className="input-field" placeholder="Optional note" {...register('note')} />
          </div>
          <p className="text-xs text-gray-400">
            Current stock: <strong>{entryModal?.product?.quantity} {entryModal?.product?.unit}</strong>
          </p>
        </form>
      </Modal>
    </div>
  )
}

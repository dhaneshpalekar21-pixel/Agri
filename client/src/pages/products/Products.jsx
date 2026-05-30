import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, AlertTriangle, Package } from 'lucide-react'
import DataTable from '../../components/DataTable'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'
import { getProducts, deleteProduct } from '../../services/productService'

// Demo data
const demoProducts = [
  { _id: '1', name: 'Urea Fertilizer 50kg', category: 'Fertilizer', brand: 'IFFCO', quantity: 3, unit: 'Bag', price: 450, expiryDate: '2025-12-31', batchNumber: 'B001' },
  { _id: '2', name: 'DAP Fertilizer 50kg', category: 'Fertilizer', brand: 'IFFCO', quantity: 18, unit: 'Bag', price: 1350, expiryDate: '2026-03-15', batchNumber: 'B002' },
  { _id: '3', name: 'Chlorpyrifos 500ml', category: 'Pesticide', brand: 'Bayer', quantity: 12, unit: 'Bottle', price: 320, expiryDate: '2024-08-01', batchNumber: 'B003' },
  { _id: '4', name: 'BT Cotton Seeds 450g', category: 'Seeds', brand: 'Mahyco', quantity: 45, unit: 'Packet', price: 740, expiryDate: '2025-06-30', batchNumber: 'B004' },
  { _id: '5', name: 'Imidacloprid 100ml', category: 'Pesticide', brand: 'Syngenta', quantity: 8, unit: 'Bottle', price: 185, expiryDate: '2025-09-20', batchNumber: 'B005' },
  { _id: '6', name: 'NPK 19:19:19 1kg', category: 'Fertilizer', brand: 'Coromandel', quantity: 60, unit: 'Packet', price: 85, expiryDate: '2026-07-10', batchNumber: 'B006' },
  { _id: '7', name: 'Wheat Seeds 5kg', category: 'Seeds', brand: 'IARI', quantity: 22, unit: 'Bag', price: 210, expiryDate: '2025-10-01', batchNumber: 'B007' },
  { _id: '8', name: 'Drip Tape 16mm', category: 'Tools', brand: 'Netafim', quantity: 0, unit: 'Roll', price: 1800, expiryDate: null, batchNumber: 'B008' },
]

function getExpiryStatus(dateStr) {
  if (!dateStr) return null
  const exp = new Date(dateStr)
  const today = new Date()
  const diff = Math.floor((exp - today) / (1000 * 60 * 60 * 24))
  if (diff < 0) return { label: 'Expired', color: 'red' }
  if (diff <= 30) return { label: `${diff}d left`, color: 'orange' }
  return { label: 'Valid', color: 'green' }
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState(null)
  const navigate = useNavigate()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await getProducts({ limit: 500 }) // Load up to 500 products to let DataTable handle pagination/searching locally
      setProducts(res.data.products || [])
    } catch (err) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <Package size={14} className="text-green-700" />
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">{val}</p>
            <p className="text-xs text-gray-400">{row.brand} • {row.batchNumber}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', label: 'Category', render: (val) => <Badge label={val} color="blue" /> },
    {
      key: 'quantity',
      label: 'Stock',
      render: (val, row) => (
        <div className="flex items-center gap-1.5">
          {val === 0 && <AlertTriangle size={12} className="text-red-500" />}
          <span className={`font-semibold text-sm ${val === 0 ? 'text-red-600' : val <= 5 ? 'text-orange-600' : 'text-gray-800'}`}>
            {val} {row.unit}
          </span>
        </div>
      ),
    },
    { key: 'price', label: 'Price', render: (val) => <span className="font-semibold text-gray-900">₹{val.toLocaleString('en-IN')}</span> },
    {
      key: 'expiryDate',
      label: 'Expiry',
      render: (val) => {
        const status = getExpiryStatus(val)
        if (!status) return <span className="text-xs text-gray-400">N/A</span>
        return (
          <div>
            <Badge label={status.label} color={status.color} />
            {val && <p className="text-xs text-gray-400 mt-0.5">{new Date(val).toLocaleDateString('en-IN')}</p>}
          </div>
        )
      },
    },
    {
      key: '_id',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/products/edit/${row._id}`)}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteModal(row)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteModal._id)
      setProducts(products.filter(p => p._id !== deleteModal._id))
      toast.success(`"${deleteModal.name}" deleted successfully`)
    } catch (err) {
      toast.error('Failed to delete product')
    } finally {
      setDeleteModal(null)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Products</h1>
          <p className="text-sm text-gray-500">{products.length} products in inventory</p>
        </div>
        <button onClick={() => navigate('/products/add')} className="btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: products.length, color: '#2E7D32' },
          { label: 'Out of Stock', value: products.filter(p => p.quantity === 0).length, color: '#dc2626' },
          { label: 'Low Stock (≤5)', value: products.filter(p => p.quantity > 0 && p.quantity <= 5).length, color: '#f97316' },
          { label: 'Expiring (30d)', value: products.filter(p => { const s = getExpiryStatus(p.expiryDate); return s && (s.color === 'orange' || s.color === 'red') }).length, color: '#7c3aed' },
        ].map(s => (
          <div key={s.label} className="kpi-card text-center p-4">
            <p className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        searchPlaceholder="Search by name, category, brand..."
        emptyMessage="No products found. Add your first product!"
      />

      {/* Delete Modal */}
      <Modal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Product"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleDelete} className="btn-danger">Delete</button>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <p className="text-gray-700 text-sm">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">"{deleteModal?.name}"</span>?
          </p>
          <p className="text-xs text-gray-400 mt-1">This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import { getProduct, createProduct, updateProduct } from '../../services/productService'

const categories = ['Fertilizer', 'Seeds', 'Pesticide', 'Herbicide', 'Tools', 'Equipment', 'Others']
const units = ['Bag', 'Bottle', 'Packet', 'Kg', 'Litre', 'Roll', 'Box', 'Piece']

export default function AddProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (isEdit) {
      const loadProduct = async () => {
        try {
          const res = await getProduct(id)
          const data = res.data
          // Format date to YYYY-MM-DD for date input
          if (data.expiryDate) {
            data.expiryDate = new Date(data.expiryDate).toISOString().split('T')[0]
          }
          reset(data)
        } catch (err) {
          toast.error('Failed to load product details')
        }
      }
      loadProduct()
    }
  }, [id, isEdit, reset])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      if (isEdit) {
        await updateProduct(id, data)
        toast.success('Product updated!')
      } else {
        await createProduct(data)
        toast.success('Product added successfully!')
      }
      navigate('/products')
    } catch (err) {
      toast.error('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/products')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-sm text-gray-500">{isEdit ? 'Update product details' : 'Fill in product information'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="kpi-card space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              id="product-name"
              className={`input-field ${errors.name ? 'border-red-400' : ''}`}
              placeholder="e.g., Urea Fertilizer 50kg"
              {...register('name', { required: 'Product name is required' })}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                id="product-category"
                className={`input-field ${errors.category ? 'border-red-400' : ''}`}
                {...register('category', { required: 'Category is required' })}
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                id="product-brand"
                className="input-field"
                placeholder="e.g., IFFCO, Bayer"
                {...register('brand')}
              />
            </div>
          </div>
        </div>

        <div className="kpi-card space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">Pricing & Stock</h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                id="product-price"
                type="number"
                step="0.01"
                className={`input-field ${errors.price ? 'border-red-400' : ''}`}
                placeholder="0.00"
                {...register('price', { required: 'Price is required', min: { value: 0, message: 'Must be positive' } })}
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                id="product-quantity"
                type="number"
                className={`input-field ${errors.quantity ? 'border-red-400' : ''}`}
                placeholder="0"
                {...register('quantity', { required: 'Quantity is required', min: { value: 0, message: 'Must be ≥ 0' } })}
              />
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
              <select
                id="product-unit"
                className={`input-field ${errors.unit ? 'border-red-400' : ''}`}
                {...register('unit', { required: 'Unit is required' })}
              >
                <option value="">Select</option>
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              {errors.unit && <p className="text-xs text-red-500 mt-1">{errors.unit.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert Threshold</label>
            <input
              id="product-threshold"
              type="number"
              className="input-field"
              placeholder="5"
              defaultValue={5}
              {...register('lowStockThreshold')}
            />
            <p className="text-xs text-gray-400 mt-1">Alert when stock falls below this quantity</p>
          </div>
        </div>

        <div className="kpi-card space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">Batch & Expiry</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
              <input
                id="product-batch"
                className="input-field"
                placeholder="e.g., B2024-001"
                {...register('batchNumber')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                id="product-expiry"
                type="date"
                className="input-field"
                {...register('expiryDate')}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/products')} className="btn-secondary flex-1">
            Cancel
          </button>
          <button id="product-save" type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

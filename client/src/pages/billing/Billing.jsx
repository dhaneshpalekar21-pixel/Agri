import { useState } from 'react'
import { Search, Plus, Minus, Trash2, ShoppingCart, User, Printer, Loader2, IndianRupee } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const productCatalog = [
  { _id: '1', name: 'Urea Fertilizer 50kg', price: 450, unit: 'Bag', category: 'Fertilizer', stock: 3 },
  { _id: '2', name: 'DAP Fertilizer 50kg', price: 1350, unit: 'Bag', category: 'Fertilizer', stock: 18 },
  { _id: '3', name: 'Chlorpyrifos 500ml', price: 320, unit: 'Bottle', category: 'Pesticide', stock: 12 },
  { _id: '4', name: 'BT Cotton Seeds 450g', price: 740, unit: 'Packet', category: 'Seeds', stock: 45 },
  { _id: '5', name: 'Imidacloprid 100ml', price: 185, unit: 'Bottle', category: 'Pesticide', stock: 8 },
  { _id: '6', name: 'NPK 19:19:19 1kg', price: 85, unit: 'Packet', category: 'Fertilizer', stock: 60 },
  { _id: '7', name: 'Wheat Seeds 5kg', price: 210, unit: 'Bag', category: 'Seeds', stock: 22 },
]

const customers = [
  { _id: 'c1', name: 'Suresh Patil', phone: '9876543210', village: 'Baramati' },
  { _id: 'c2', name: 'Ramesh Kumar', phone: '9123456780', village: 'Pune' },
  { _id: 'c3', name: 'Anita Deshpande', phone: '9988776655', village: 'Nashik' },
]

export default function Billing() {
  const { items, customer, paymentType, discount, addItem, removeItem, updateQty, setCustomer, setPaymentType, setDiscount, clearCart, subtotal, gstAmount, total } = useCartStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [customerSearch, setCustomerSearch] = useState('')
  const [showCustomers, setShowCustomers] = useState(false)
  const [loading, setLoading] = useState(false)

  const filtered = productCatalog.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  )

  const handleBill = async () => {
    if (items.length === 0) return toast.error('Add products to the cart first')
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 1000))
      const billId = 'INV-' + Date.now()
      toast.success(`Bill ${billId} created! 🎉`)
      clearCart()
      navigate('/billing/history')
    } catch {
      toast.error('Failed to generate bill')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Billing — POS</h1>
        <p className="text-sm text-gray-500">Create new bills instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Product Search Panel */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
            <Search size={16} className="text-gray-400" />
            <input
              id="product-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products by name or category..."
              className="flex-1 text-sm outline-none bg-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin pr-1">
            {filtered.map(p => (
              <button
                key={p._id}
                onClick={() => addItem(p)}
                className="bg-white rounded-xl border border-gray-100 p-4 text-left hover:border-green-300 hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">{p.category}</span>
                  <span className="text-xs text-gray-400">{p.stock} {p.unit}</span>
                </div>
                <p className="font-semibold text-gray-800 text-sm mb-1">{p.name}</p>
                <p className="text-green-700 font-bold">₹{p.price.toLocaleString('en-IN')}/{p.unit}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                  <Plus size={12} /> Add to cart
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col" style={{ maxHeight: 'calc(100vh - 140px)' }}>
            {/* Cart Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <ShoppingCart size={18} /> Cart
                  {items.length > 0 && <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">{items.length}</span>}
                </h3>
                {items.length > 0 && <button onClick={clearCart} className="text-xs text-red-500 hover:text-red-600">Clear all</button>}
              </div>

              {/* Customer selector */}
              <div className="relative">
                <div
                  onClick={() => setShowCustomers(!showCustomers)}
                  className="flex items-center gap-2 input-field cursor-pointer"
                >
                  <User size={14} className="text-gray-400" />
                  <span className={`text-sm ${customer ? 'text-gray-800' : 'text-gray-400'}`}>
                    {customer ? `${customer.name} — ${customer.village}` : 'Select customer (optional)'}
                  </span>
                </div>
                {showCustomers && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 z-10 overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                      <input
                        value={customerSearch}
                        onChange={e => setCustomerSearch(e.target.value)}
                        placeholder="Search customer..."
                        className="w-full text-sm p-1.5 outline-none"
                        autoFocus
                      />
                    </div>
                    <button onClick={() => { setCustomer(null); setShowCustomers(false) }} className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:bg-gray-50">
                      Walk-in Customer (No account)
                    </button>
                    {filteredCustomers.map(c => (
                      <button
                        key={c._id}
                        onClick={() => { setCustomer(c); setShowCustomers(false) }}
                        className="w-full text-left px-3 py-2 hover:bg-green-50 text-sm"
                      >
                        <p className="font-medium text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.phone} • {c.village}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart size={40} className="text-gray-200 mb-3" />
                  <p className="text-sm text-gray-400">Cart is empty</p>
                  <p className="text-xs text-gray-300">Click products to add</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item._id} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-green-700 font-semibold">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-red-50">
                        <Minus size={11} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                      <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-green-50">
                        <Plus size={11} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item._id)} className="p-1 hover:text-red-500 text-gray-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bill Summary */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-100 space-y-3">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{subtotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Discount</span>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">₹</span>
                      <input
                        type="number"
                        value={discount}
                        onChange={e => setDiscount(Number(e.target.value))}
                        className="w-20 text-right text-sm border border-gray-200 rounded-lg px-2 py-0.5 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-green-700">₹{total().toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Payment Type */}
                <div className="grid grid-cols-3 gap-1.5">
                  {['cash', 'upi', 'udhari'].map(type => (
                    <button
                      key={type}
                      onClick={() => setPaymentType(type)}
                      className="py-1.5 text-xs font-medium rounded-lg border transition-all capitalize"
                      style={{
                        background: paymentType === type ? '#2E7D32' : 'white',
                        color: paymentType === type ? 'white' : '#64748b',
                        borderColor: paymentType === type ? '#2E7D32' : '#e2e8f0',
                      }}
                    >
                      {type === 'upi' ? 'UPI' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                <button
                  id="generate-bill"
                  onClick={handleBill}
                  disabled={loading}
                  className="btn-primary w-full justify-center"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
                  {loading ? 'Generating...' : 'Generate Invoice'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

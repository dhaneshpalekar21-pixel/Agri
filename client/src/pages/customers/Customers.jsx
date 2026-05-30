import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Phone, MapPin, Leaf } from 'lucide-react'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const demoCustomers = [
  { _id: 'c1', name: 'Suresh Patil', phone: '9876543210', village: 'Baramati', cropType: 'Sugarcane', landArea: '5 acres', totalPurchase: 45000, udhari: 4500 },
  { _id: 'c2', name: 'Ramesh Kumar', phone: '9123456780', village: 'Pune', cropType: 'Wheat', landArea: '3 acres', totalPurchase: 28000, udhari: 0 },
  { _id: 'c3', name: 'Anita Deshpande', phone: '9988776655', village: 'Nashik', cropType: 'Grapes', landArea: '8 acres', totalPurchase: 92000, udhari: 12000 },
  { _id: 'c4', name: 'Vijay Shinde', phone: '9867543210', village: 'Solapur', cropType: 'Cotton', landArea: '10 acres', totalPurchase: 67000, udhari: 7800 },
  { _id: 'c5', name: 'Meena Jadhav', phone: '9765432108', village: 'Kolhapur', cropType: 'Soybean', landArea: '4 acres', totalPurchase: 18000, udhari: 0 },
]

export default function Customers() {
  const [customers, setCustomers] = useState(demoCustomers)
  const [addModal, setAddModal] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onAdd = (data) => {
    setCustomers(prev => [...prev, { _id: Date.now().toString(), ...data, totalPurchase: 0, udhari: 0 }])
    toast.success('Customer added!')
    setAddModal(false)
    reset()
  }

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2E7D32, #66BB6A)' }}>
            {val.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{val}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={10} />{row.phone}</p>
          </div>
        </div>
      ),
    },
    { key: 'village', label: 'Village', render: (val) => <span className="flex items-center gap-1 text-sm text-gray-600"><MapPin size={12} />{val}</span> },
    { key: 'cropType', label: 'Crop', render: (val) => <span className="flex items-center gap-1 text-sm text-gray-600"><Leaf size={12} style={{ color: '#2E7D32' }} />{val}</span> },
    { key: 'landArea', label: 'Land', render: (val) => <span className="text-sm text-gray-600">{val}</span> },
    { key: 'totalPurchase', label: 'Total Purchases', render: (val) => <span className="font-semibold text-gray-900 text-sm">₹{val.toLocaleString('en-IN')}</span> },
    {
      key: 'udhari',
      label: 'Udhari',
      render: (val) => (
        <span className="text-sm font-semibold" style={{ color: val > 0 ? '#dc2626' : '#2E7D32' }}>
          {val > 0 ? `₹${val.toLocaleString('en-IN')}` : 'Nil'}
        </span>
      ),
    },
    {
      key: '_id',
      label: 'Action',
      sortable: false,
      render: (_, row) => (
        <button
          onClick={() => navigate(`/customers/${row._id}`)}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg"
        >
          <Eye size={13} /> View
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Customers / Farmers</h1>
          <p className="text-sm text-gray-500">{customers.length} registered farmers</p>
        </div>
        <button onClick={() => setAddModal(true)} className="btn-primary">
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Customers', value: customers.length, color: '#2E7D32' },
          { label: 'Total Revenue', value: `₹${customers.reduce((a, c) => a + c.totalPurchase, 0).toLocaleString('en-IN')}`, color: '#2E7D32' },
          { label: 'Pending Udhari', value: `₹${customers.reduce((a, c) => a + c.udhari, 0).toLocaleString('en-IN')}`, color: '#dc2626' },
          { label: 'Due Customers', value: customers.filter(c => c.udhari > 0).length, color: '#f97316' },
        ].map(s => (
          <div key={s.label} className="kpi-card text-center p-4">
            <p className="text-xl font-bold" style={{ color: s.color, fontFamily: 'Poppins, sans-serif' }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={customers} searchPlaceholder="Search by name, phone, village, crop..." />

      <Modal
        open={addModal}
        onClose={() => { setAddModal(false); reset() }}
        title="Add New Customer"
        size="md"
        footer={
          <>
            <button onClick={() => { setAddModal(false); reset() }} className="btn-secondary">Cancel</button>
            <button form="add-customer-form" type="submit" className="btn-primary">Add Customer</button>
          </>
        }
      >
        <form id="add-customer-form" onSubmit={handleSubmit(onAdd)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input id="cust-name" className={`input-field ${errors.name ? 'border-red-400' : ''}`} placeholder="Ramesh Patil" {...register('name', { required: true })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input id="cust-phone" className={`input-field ${errors.phone ? 'border-red-400' : ''}`} placeholder="9876543210" {...register('phone', { required: true })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
              <input id="cust-village" className="input-field" placeholder="Baramati" {...register('village')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
              <input id="cust-crop" className="input-field" placeholder="Sugarcane, Wheat..." {...register('cropType')} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Land Area</label>
            <input id="cust-land" className="input-field" placeholder="e.g. 5 acres" {...register('landArea')} />
          </div>
        </form>
      </Modal>
    </div>
  )
}

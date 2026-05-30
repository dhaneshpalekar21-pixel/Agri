import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, MapPin, Leaf, ShoppingCart } from 'lucide-react'

const demoCustomers = {
  c1: {
    _id: 'c1', name: 'Suresh Patil', phone: '9876543210', village: 'Baramati', cropType: 'Sugarcane',
    landArea: '5 acres', totalPurchase: 45000, udhari: 4500,
    purchases: [
      { id: 'INV-001', date: '2024-05-23', items: 3, total: 4500, status: 'paid' },
      { id: 'INV-008', date: '2024-05-15', items: 2, total: 2800, status: 'paid' },
      { id: 'INV-015', date: '2024-05-01', items: 5, total: 8200, status: 'pending' },
    ],
  },
  c2: { _id: 'c2', name: 'Ramesh Kumar', phone: '9123456780', village: 'Pune', cropType: 'Wheat', landArea: '3 acres', totalPurchase: 28000, udhari: 0, purchases: [] },
}

export default function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const customer = demoCustomers[id] || demoCustomers.c1

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/customers')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Customer Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="kpi-card">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2E7D32, #66BB6A)' }}>
            {customer.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{customer.name}</h2>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Phone size={13} />{customer.phone}</span>
              <span className="flex items-center gap-1"><MapPin size={13} />{customer.village}</span>
              <span className="flex items-center gap-1"><Leaf size={13} style={{ color: '#2E7D32' }} />{customer.cropType}</span>
              <span className="flex items-center gap-1"><Sprout size={14} className="text-emerald-600" /> {customer.landArea}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700" style={{ fontFamily: 'Poppins, sans-serif' }}>₹{customer.totalPurchase.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total Purchases</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', color: customer.udhari > 0 ? '#dc2626' : '#2E7D32' }}>
              ₹{customer.udhari.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Pending Udhari</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>{customer.purchases.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total Bills</p>
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <div className="table-wrapper">
        <div className="table-header">
          <h3 className="font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Purchase History</h3>
          <button onClick={() => navigate('/billing')} className="btn-primary text-xs py-1.5 px-3">
            <ShoppingCart size={13} /> New Bill
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              {['Invoice', 'Date', 'Items', 'Amount', 'Status'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customer.purchases.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No purchases yet</td></tr>
            ) : customer.purchases.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3 text-sm font-mono text-blue-600">{p.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{p.date}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{p.items} items</td>
                <td className="px-4 py-3 font-bold text-sm">₹{p.total.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: p.status === 'paid' ? '#f0fdf4' : '#fef2f2', color: p.status === 'paid' ? '#166534' : '#dc2626' }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

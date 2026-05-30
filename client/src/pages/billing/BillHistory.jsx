import { useNavigate } from 'react-router-dom'
import { Eye, FileText } from 'lucide-react'
import DataTable from '../../components/DataTable'
import Badge from '../../components/Badge'

const bills = [
  { _id: 'INV-001', customer: 'Suresh Patil', items: 3, total: 4500, paymentType: 'cash', createdAt: '2024-05-23 10:30', status: 'paid' },
  { _id: 'INV-002', customer: 'Ramesh Kumar', items: 5, total: 2300, paymentType: 'udhari', createdAt: '2024-05-23 11:15', status: 'pending' },
  { _id: 'INV-003', customer: 'Anita Deshpande', items: 2, total: 8900, paymentType: 'upi', createdAt: '2024-05-23 12:00', status: 'paid' },
  { _id: 'INV-004', customer: 'Walk-in Customer', items: 1, total: 1200, paymentType: 'cash', createdAt: '2024-05-22 14:30', status: 'paid' },
  { _id: 'INV-005', customer: 'Meena Jadhav', items: 4, total: 6700, paymentType: 'udhari', createdAt: '2024-05-22 15:45', status: 'pending' },
  { _id: 'INV-006', customer: 'Vijay Shinde', items: 6, total: 12400, paymentType: 'upi', createdAt: '2024-05-21 09:00', status: 'paid' },
]

const paymentColors = { cash: 'green', upi: 'blue', udhari: 'orange' }
const statusColors = { paid: 'green', pending: 'red' }

export default function BillHistory() {
  const navigate = useNavigate()

  const columns = [
    { key: '_id', label: 'Invoice', render: (val) => <span className="font-mono text-sm text-blue-600 font-medium">{val}</span> },
    { key: 'customer', label: 'Customer', render: (val) => <span className="font-medium text-gray-800 text-sm">{val}</span> },
    { key: 'items', label: 'Items', render: (val) => <span className="text-sm text-gray-600">{val} items</span> },
    { key: 'total', label: 'Amount', render: (val) => <span className="font-bold text-gray-900">₹{val.toLocaleString('en-IN')}</span> },
    { key: 'paymentType', label: 'Payment', render: (val) => <Badge label={val.toUpperCase()} color={paymentColors[val]} /> },
    { key: 'status', label: 'Status', render: (val) => <Badge label={val.charAt(0).toUpperCase() + val.slice(1)} color={statusColors[val]} /> },
    { key: 'createdAt', label: 'Date/Time', render: (val) => <span className="text-xs text-gray-400">{val}</span> },
    {
      key: '_id',
      label: 'Action',
      sortable: false,
      render: (_, row) => (
        <button
          onClick={() => navigate(`/billing/invoice/${row._id}`)}
          className="flex items-center gap-1 text-xs font-medium text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-2 py-1 rounded-lg"
        >
          <Eye size={13} /> View
        </button>
      ),
    },
  ]

  const totalRevenue = bills.reduce((acc, b) => acc + b.total, 0)
  const pendingAmount = bills.filter(b => b.status === 'pending').reduce((acc, b) => acc + b.total, 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Bill History</h1>
          <p className="text-sm text-gray-500">{bills.length} invoices generated</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Bills', value: bills.length, color: '#2E7D32' },
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: '#2E7D32' },
          { label: 'Pending Amount', value: `₹${pendingAmount.toLocaleString('en-IN')}`, color: '#dc2626' },
          { label: 'Paid Bills', value: bills.filter(b => b.status === 'paid').length, color: '#2E7D32' },
        ].map(s => (
          <div key={s.label} className="kpi-card text-center p-4">
            <p className="text-xl font-bold" style={{ color: s.color, fontFamily: 'Poppins, sans-serif' }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={bills} searchPlaceholder="Search by invoice, customer..." />
    </div>
  )
}

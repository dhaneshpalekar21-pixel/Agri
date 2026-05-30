import { useState } from 'react'
import { CreditCard, CheckCircle, Clock, Plus, Loader2 } from 'lucide-react'
import DataTable from '../../components/DataTable'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const demoUdhari = [
  { _id: 'u1', customer: 'Suresh Patil', phone: '9876543210', village: 'Baramati', totalDue: 4500, paidAmount: 1000, dueDate: '2024-06-15' },
  { _id: 'u2', customer: 'Anita Deshpande', phone: '9988776655', village: 'Nashik', totalDue: 12000, paidAmount: 5000, dueDate: '2024-06-30' },
  { _id: 'u3', customer: 'Vijay Shinde', phone: '9867543210', village: 'Solapur', totalDue: 7800, paidAmount: 7800, dueDate: '2024-05-30' },
  { _id: 'u4', customer: 'Meena Jadhav', phone: '9765432108', village: 'Kolhapur', totalDue: 3200, paidAmount: 0, dueDate: '2024-07-10' },
]

export default function Udhari() {
  const [ledger, setLedger] = useState(demoUdhari)
  const [payModal, setPayModal] = useState(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)

  const onPayment = async (data) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const amount = parseFloat(data.amount)
    setLedger(prev => prev.map(l =>
      l._id === payModal._id
        ? { ...l, paidAmount: Math.min(l.totalDue, l.paidAmount + amount) }
        : l
    ))
    toast.success(`₹${amount.toLocaleString('en-IN')} recorded for ${payModal.customer}`)
    setPayModal(null)
    reset()
    setLoading(false)
  }

  const columns = [
    {
      key: 'customer',
      label: 'Customer',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-gray-800 text-sm">{val}</p>
          <p className="text-xs text-gray-400">{row.phone} • {row.village}</p>
        </div>
      ),
    },
    {
      key: 'totalDue',
      label: 'Total Due',
      render: (val) => <span className="font-bold text-red-600 text-sm">₹{val.toLocaleString('en-IN')}</span>,
    },
    {
      key: 'paidAmount',
      label: 'Paid',
      render: (val) => <span className="font-semibold text-green-700 text-sm">₹{val.toLocaleString('en-IN')}</span>,
    },
    {
      key: '_id',
      label: 'Balance',
      sortable: false,
      render: (_, row) => {
        const bal = row.totalDue - row.paidAmount
        return <span className="font-bold text-sm" style={{ color: bal === 0 ? '#2E7D32' : '#dc2626' }}>
          ₹{bal.toLocaleString('en-IN')}
        </span>
      },
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (val) => {
        const past = new Date(val) < new Date()
        return (
          <span className="text-xs flex items-center gap-1" style={{ color: past ? '#dc2626' : '#64748b' }}>
            {past ? <Clock size={11} /> : <CheckCircle size={11} />}
            {val}
          </span>
        )
      },
    },
    {
      key: '_id',
      label: 'Status',
      sortable: false,
      render: (_, row) => {
        const bal = row.totalDue - row.paidAmount
        if (bal === 0) return <Badge label="Cleared" color="green" />
        if (new Date(row.dueDate) < new Date()) return <Badge label="Overdue" color="red" />
        return <Badge label="Pending" color="orange" />
      },
    },
    {
      key: '_id',
      label: 'Action',
      sortable: false,
      render: (_, row) => {
        const bal = row.totalDue - row.paidAmount
        return bal > 0 ? (
          <button
            onClick={() => { setPayModal(row); reset() }}
            className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 px-2 py-1 rounded-lg"
          >
            <Plus size={12} /> Payment
          </button>
        ) : (
          <span className="text-xs text-gray-400">Cleared</span>
        )
      },
    },
  ]

  const totalDue = ledger.reduce((a, l) => a + l.totalDue, 0)
  const totalPaid = ledger.reduce((a, l) => a + l.paidAmount, 0)
  const totalBalance = totalDue - totalPaid

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Udhari / Credit Ledger</h1>
        <p className="text-sm text-gray-500">Track all pending dues and payments</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Due', value: `₹${totalDue.toLocaleString('en-IN')}`, color: '#dc2626' },
          { label: 'Total Collected', value: `₹${totalPaid.toLocaleString('en-IN')}`, color: '#2E7D32' },
          { label: 'Outstanding', value: `₹${totalBalance.toLocaleString('en-IN')}`, color: '#f97316' },
          { label: 'Customers w/ Due', value: ledger.filter(l => l.totalDue > l.paidAmount).length, color: '#7c3aed' },
        ].map(s => (
          <div key={s.label} className="kpi-card text-center p-4">
            <p className="text-xl font-bold" style={{ color: s.color, fontFamily: 'Poppins, sans-serif' }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="kpi-card">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Collection Progress</p>
          <p className="text-sm font-bold text-green-700">{Math.round((totalPaid / totalDue) * 100)}%</p>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(totalPaid / totalDue) * 100}%`, background: 'linear-gradient(90deg, #2E7D32, #66BB6A)' }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>₹{totalPaid.toLocaleString('en-IN')} collected</span>
          <span>₹{totalBalance.toLocaleString('en-IN')} remaining</span>
        </div>
      </div>

      <DataTable columns={columns} data={ledger} searchPlaceholder="Search by customer, village..." />

      {/* Payment Modal */}
      <Modal
        open={!!payModal}
        onClose={() => { setPayModal(null); reset() }}
        title={`Record Payment — ${payModal?.customer}`}
        size="sm"
        footer={
          <>
            <button onClick={() => { setPayModal(null); reset() }} className="btn-secondary">Cancel</button>
            <button form="payment-form" type="submit" disabled={loading} className="btn-primary">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
              Record Payment
            </button>
          </>
        }
      >
        <form id="payment-form" onSubmit={handleSubmit(onPayment)} className="space-y-4">
          <div className="p-3 bg-red-50 rounded-xl">
            <p className="text-xs text-red-600">Outstanding balance: <strong>₹{payModal ? (payModal.totalDue - payModal.paidAmount).toLocaleString('en-IN') : 0}</strong></p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (₹) *</label>
            <input
              id="pay-amount"
              type="number"
              step="0.01"
              className={`input-field ${errors.amount ? 'border-red-400' : ''}`}
              placeholder="Enter amount"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 1, message: 'Min ₹1' },
                max: { value: payModal ? payModal.totalDue - payModal.paidAmount : 999999, message: 'Cannot exceed balance' },
              })}
            />
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
            <select id="pay-mode" className="input-field" {...register('mode')}>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <input id="pay-note" className="input-field" placeholder="Optional note" {...register('note')} />
          </div>
        </form>
      </Modal>
    </div>
  )
}

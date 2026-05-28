import { useState } from 'react'
import { Plus, Edit2, Trash2, UserCog } from 'lucide-react'
import DataTable from '../../components/DataTable'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const demoEmployees = [
  { _id: 'e1', name: 'Prakash More', role: 'Salesman', phone: '9876001234', attendance: 24, salary: 18000, status: 'active', joinDate: '2023-01-15' },
  { _id: 'e2', name: 'Seema Kulkarni', role: 'Cashier', phone: '9876002345', attendance: 22, salary: 15000, status: 'active', joinDate: '2023-03-01' },
  { _id: 'e3', name: 'Raju Pawar', role: 'Store Manager', phone: '9876003456', attendance: 25, salary: 25000, status: 'active', joinDate: '2022-06-10' },
  { _id: 'e4', name: 'Sunita Desai', role: 'Delivery', phone: '9876004567', attendance: 18, salary: 12000, status: 'inactive', joinDate: '2023-07-20' },
]

const roleColors = { Salesman: 'blue', Cashier: 'green', 'Store Manager': 'purple', Delivery: 'orange' }

export default function Employees() {
  const [employees, setEmployees] = useState(demoEmployees)
  const [addModal, setAddModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onAdd = (data) => {
    setEmployees(prev => [...prev, { _id: Date.now().toString(), ...data, attendance: 0, joinDate: new Date().toISOString().split('T')[0] }])
    toast.success('Employee added!')
    setAddModal(false)
    reset()
  }

  const columns = [
    {
      key: 'name',
      label: 'Employee',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)' }}>
            {val.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{val}</p>
            <p className="text-xs text-gray-400">{row.phone}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', label: 'Role', render: (val) => <Badge label={val} color={roleColors[val] || 'gray'} /> },
    {
      key: 'attendance',
      label: 'Attendance',
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(val / 26) * 100}%`, background: val >= 22 ? '#2E7D32' : '#f97316' }} />
          </div>
          <span className="text-xs font-medium text-gray-600">{val}/26</span>
        </div>
      ),
    },
    { key: 'salary', label: 'Salary', render: (val) => <span className="font-semibold text-sm">₹{val.toLocaleString('en-IN')}</span> },
    { key: 'status', label: 'Status', render: (val) => <Badge label={val.charAt(0).toUpperCase() + val.slice(1)} color={val === 'active' ? 'green' : 'gray'} /> },
    { key: 'joinDate', label: 'Joined', render: (val) => <span className="text-xs text-gray-400">{val}</span> },
    {
      key: '_id',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Edit2 size={14} /></button>
          <button onClick={() => setDeleteModal(row)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Employee Management</h1>
          <p className="text-sm text-gray-500">{employees.length} staff members</p>
        </div>
        <button onClick={() => setAddModal(true)} className="btn-primary">
          <Plus size={16} /> Add Employee
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Staff', value: employees.length, color: '#2E7D32' },
          { label: 'Active', value: employees.filter(e => e.status === 'active').length, color: '#2E7D32' },
          { label: 'Salary Payable', value: `₹${employees.filter(e => e.status === 'active').reduce((a, e) => a + e.salary, 0).toLocaleString('en-IN')}`, color: '#7c3aed' },
          { label: 'Avg Attendance', value: `${Math.round(employees.reduce((a, e) => a + e.attendance, 0) / employees.length)}/26`, color: '#1d4ed8' },
        ].map(s => (
          <div key={s.label} className="kpi-card text-center p-4">
            <p className="text-xl font-bold" style={{ color: s.color, fontFamily: 'Poppins, sans-serif' }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={employees} searchPlaceholder="Search by name, role..." />

      <Modal open={addModal} onClose={() => { setAddModal(false); reset() }} title="Add Employee" size="md"
        footer={
          <>
            <button onClick={() => { setAddModal(false); reset() }} className="btn-secondary">Cancel</button>
            <button form="add-emp-form" type="submit" className="btn-primary">Add Employee</button>
          </>
        }>
        <form id="add-emp-form" onSubmit={handleSubmit(onAdd)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input id="emp-name" className={`input-field ${errors.name ? 'border-red-400' : ''}`} placeholder="Prakash More" {...register('name', { required: true })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input id="emp-phone" className="input-field" placeholder="9876543210" {...register('phone')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select id="emp-role" className="input-field" {...register('role', { required: true })}>
                <option value="">Select role</option>
                <option>Salesman</option>
                <option>Cashier</option>
                <option>Store Manager</option>
                <option>Delivery</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary (₹)</label>
              <input id="emp-salary" type="number" className="input-field" placeholder="15000" {...register('salary')} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select id="emp-status" className="input-field" {...register('status')} defaultValue="active">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Remove Employee" size="sm"
        footer={
          <>
            <button onClick={() => setDeleteModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={() => { setEmployees(prev => prev.filter(e => e._id !== deleteModal._id)); toast.success('Employee removed'); setDeleteModal(null) }} className="btn-danger">Remove</button>
          </>
        }>
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCog size={24} className="text-red-500" />
          </div>
          <p className="text-gray-700 text-sm">Remove <strong>"{deleteModal?.name}"</strong> from the system?</p>
        </div>
      </Modal>
    </div>
  )
}

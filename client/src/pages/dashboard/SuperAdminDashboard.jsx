import { useNavigate } from 'react-router-dom'
import { Store, Users, IndianRupee, TrendingUp, Activity, Crown } from 'lucide-react'
import KPICard from '../../components/KPICard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const revenueData = [
  { month: 'Jan', revenue: 145000 },
  { month: 'Feb', revenue: 162000 },
  { month: 'Mar', revenue: 198000 },
  { month: 'Apr', revenue: 175000 },
  { month: 'May', revenue: 221000 },
  { month: 'Jun', revenue: 248000 },
]

const shops = [
  { name: 'Patil Krushi Kendra', city: 'Pune', plan: 'Pro', revenue: 48000, status: 'active' },
  { name: 'Shinde Agro Supplies', city: 'Nashik', plan: 'Basic', revenue: 31000, status: 'active' },
  { name: 'Kumar Seeds Store', city: 'Aurangabad', plan: 'Pro', revenue: 55000, status: 'active' },
  { name: 'Deshpande Fertilizers', city: 'Kolhapur', plan: 'Trial', revenue: 12000, status: 'trial' },
  { name: 'Jadhav Agri Center', city: 'Solapur', plan: 'Basic', revenue: 28000, status: 'active' },
]

export default function SuperAdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Super Admin 👑
          </h1>
          <p className="text-sm text-gray-500">Platform-wide overview</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Shops" value={42} subtitle="Active on platform" icon={Store} color="green" trend="up" trendValue={8.3} />
        <KPICard title="Total Users" value={186} subtitle="Across all shops" icon={Users} color="blue" trend="up" trendValue={14.2} />
        <KPICard title="Monthly Revenue" value={248000} prefix="₹" subtitle="Platform MRR" icon={IndianRupee} color="purple" trend="up" trendValue={18.7} />
        <KPICard title="Active Subscriptions" value={38} subtitle="4 on trial" icon={Crown} color="orange" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="kpi-card">
          <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Platform Revenue (6 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Shops Table */}
        <div className="table-wrapper">
          <div className="table-header">
            <h3 className="font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Active Shops</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                {['Shop', 'City', 'Plan', 'Revenue'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shops.map((s, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{s.city}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: s.plan === 'Pro' ? '#faf5ff' : s.plan === 'Basic' ? '#eff6ff' : '#fefce8',
                        color: s.plan === 'Pro' ? '#7c3aed' : s.plan === 'Basic' ? '#1d4ed8' : '#854d0e',
                      }}>
                      {s.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900">₹{s.revenue.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

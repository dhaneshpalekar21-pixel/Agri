import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Package, Users, CreditCard, TrendingUp, AlertTriangle,
  Calendar, ArrowRight, Bell, Boxes, IndianRupee
} from 'lucide-react'
import KPICard from '../../components/KPICard'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

// Mock data for demo
const salesData = [
  { day: 'Mon', sales: 12400, profit: 3200 },
  { day: 'Tue', sales: 8900, profit: 2100 },
  { day: 'Wed', sales: 15600, profit: 4800 },
  { day: 'Thu', sales: 11200, profit: 3100 },
  { day: 'Fri', sales: 18900, profit: 5400 },
  { day: 'Sat', sales: 22100, profit: 6800 },
  { day: 'Sun', sales: 9800, profit: 2900 },
]

const categoryData = [
  { name: 'Fertilizers', value: 38, color: '#2E7D32' },
  { name: 'Seeds', value: 24, color: '#66BB6A' },
  { name: 'Pesticides', value: 20, color: '#FFA726' },
  { name: 'Tools', value: 12, color: '#42A5F5' },
  { name: 'Others', value: 6, color: '#AB47BC' },
]

const recentTransactions = [
  { id: 'INV-001', customer: 'Suresh Patil', amount: 4500, type: 'Cash', time: '10:30 AM', status: 'paid' },
  { id: 'INV-002', customer: 'Ramesh Kumar', amount: 2300, type: 'Udhari', time: '11:15 AM', status: 'pending' },
  { id: 'INV-003', customer: 'Anita Deshpande', amount: 8900, type: 'UPI', time: '12:00 PM', status: 'paid' },
  { id: 'INV-004', customer: 'Vijay Shinde', amount: 1200, type: 'Cash', time: '2:30 PM', status: 'paid' },
  { id: 'INV-005', customer: 'Meena Jadhav', amount: 6700, type: 'Udhari', time: '3:45 PM', status: 'pending' },
]

const alerts = [
  { type: 'expiry', message: 'Chlorpyrifos 500ml — expires in 8 days', severity: 'red' },
  { type: 'stock', message: 'Urea 50kg — only 3 bags left', severity: 'orange' },
  { type: 'udhari', message: 'Suresh Patil — ₹4,500 due (15 days)', severity: 'orange' },
  { type: 'expiry', message: 'DAP Fertilizer — expires in 21 days', severity: 'yellow' },
]

const severityStyles = {
  red: { bg: '#fef2f2', text: '#dc2626', border: '#fee2e2', dot: '#ef4444' },
  orange: { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa', dot: '#f97316' },
  yellow: { bg: '#fefce8', text: '#854d0e', border: '#fef08a', dot: '#eab308' },
}

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{today}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/billing')} className="btn-primary">
            <ShoppingCart size={16} /> New Bill
          </button>
          <button onClick={() => navigate('/products/add')} className="btn-secondary">
            <Package size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Today's Sales"
          value={22100}
          prefix="₹"
          subtitle="18 transactions"
          icon={IndianRupee}
          color="green"
          trend="up"
          trendValue={12.4}
        />
        <KPICard
          title="Total Products"
          value={248}
          subtitle="12 categories"
          icon={Package}
          color="blue"
          trend="up"
          trendValue={3.2}
        />
        <KPICard
          title="Pending Udhari"
          value={45800}
          prefix="₹"
          subtitle="23 customers"
          icon={CreditCard}
          color="orange"
          trend="down"
          trendValue={5.1}
        />
        <KPICard
          title="Low Stock Items"
          value={7}
          subtitle="Needs restock"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Area Chart */}
        <div className="lg:col-span-2 kpi-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Weekly Sales Overview</h3>
              <p className="text-xs text-gray-400 mt-0.5">Sales vs Profit — this week</p>
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">+12.4%</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#66BB6A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(v, name) => [`₹${v.toLocaleString('en-IN')}`, name]}
              />
              <Area type="monotone" dataKey="sales" stroke="#2E7D32" strokeWidth={2.5} fill="url(#salesGrad)" name="Sales" />
              <Area type="monotone" dataKey="profit" stroke="#66BB6A" strokeWidth={2} strokeDasharray="4 2" fill="url(#profitGrad)" name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="kpi-card">
          <h3 className="font-semibold text-gray-800 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Sales by Category</h3>
          <p className="text-xs text-gray-400 mb-4">This month</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span className="text-gray-600">{c.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Transactions + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 table-wrapper">
          <div className="table-header">
            <h3 className="font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Recent Transactions</h3>
            <button
              onClick={() => navigate('/billing/history')}
              className="flex items-center gap-1 text-xs font-medium text-green-700 hover:text-green-800"
            >
              View All <ArrowRight size={13} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {['Invoice', 'Customer', 'Amount', 'Type', 'Time', 'Status'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm font-mono text-blue-600">{tx.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{tx.customer}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">₹{tx.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: tx.type === 'Udhari' ? '#fff7ed' : tx.type === 'UPI' ? '#eff6ff' : '#f0fdf4',
                          color: tx.type === 'Udhari' ? '#c2410c' : tx.type === 'UPI' ? '#1d4ed8' : '#166534',
                        }}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{tx.time}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: tx.status === 'paid' ? '#f0fdf4' : '#fef2f2',
                          color: tx.status === 'paid' ? '#166534' : '#dc2626',
                        }}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Alerts
            </h3>
            <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center font-bold">
              {alerts.length}
            </span>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, i) => {
              const s = severityStyles[alert.severity]
              return (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                  <span className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: s.dot }} />
                  <p className="text-xs leading-relaxed" style={{ color: s.text }}>{alert.message}</p>
                </div>
              )
            })}
          </div>
          <button onClick={() => navigate('/notifications')} className="btn-secondary w-full mt-4 text-xs">
            View All Alerts <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

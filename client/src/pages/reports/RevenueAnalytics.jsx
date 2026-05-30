import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  TrendingUp, IndianRupee, Download, Calendar, RefreshCw,
  Percent, ArrowUpRight, ArrowDownRight, Activity, MapPin
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts'

const REVENUE_TREND = [
  { name: 'Mon', Daily: 12000, Weekly: 85000, Monthly: 340000 },
  { name: 'Tue', Daily: 19000, Weekly: 92000, Monthly: 360000 },
  { name: 'Wed', Daily: 15000, Weekly: 88000, Monthly: 390000 },
  { name: 'Thu', Daily: 25000, Weekly: 110000, Monthly: 420000 },
  { name: 'Fri', Daily: 22000, Weekly: 105000, Monthly: 410000 },
  { name: 'Sat', Daily: 30000, Weekly: 125000, Monthly: 480000 },
  { name: 'Sun', Daily: 34000, Weekly: 140000, Monthly: 520000 }
];

const REVENUE_SOURCES = [
  { name: 'Fertilizers Sales', value: 450000, color: '#10b981' },
  { name: 'Seeds Commission', value: 310000, color: '#3b82f6' },
  { name: 'Pesticides Fee', value: 240000, color: '#f59e0b' },
  { name: 'SaaS Subscriptions', value: 180000, color: '#8b5cf6' }
];

const REGIONAL_REVENUE = [
  { region: 'Pune Division', revenue: '₹4,52,400', orders: 1240, status: 'High Performance' },
  { region: 'Nashik Division', revenue: '₹3,85,900', orders: 980, status: 'Steady Growth' },
  { region: 'Satara Division', revenue: '₹2,95,000', orders: 740, status: 'Steady Growth' },
  { region: 'Kolhapur Division', revenue: '₹1,80,000', orders: 420, status: 'Needs Promotion' }
];

export default function RevenueAnalytics() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [downloadMsg, setDownloadMsg] = useState(false)
  const [activePeriod, setActivePeriod] = useState('Daily')

  useEffect(() => {
    setActiveItem('Reports & Analytics', 'Revenue Analytics')
  }, [setActiveItem])

  const triggerDownload = (report) => {
    setDownloadMsg(true)
    setTimeout(() => setDownloadMsg(false), 3000)

    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(`Date,Revenue,Source,Region\n2026-05-28,452000,Crop Protection,Pune`))
    link.setAttribute('download', `${report.toLowerCase().replace(/ /g, '_')}_report.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
            Revenue Analytics & Finance Dashboard
          </h2>
          <p className="text-xs text-slate-500 font-medium">Review platform earnings, transactional audits, commission rates, and SaaS cycle fees</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => triggerDownload("Platform Revenue Summary")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Download size={13} />
            <span>Export Finance Data</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {downloadMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          CSV Export successful! Check your system downloads folder.
        </div>
      )}

      {/* 4 Financial Period KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Daily Revenue Index", val: "₹34,000", change: "+12.4%", trend: "up", desc: "Today's settlement" },
          { label: "Weekly Revenue Index", val: "₹1,40,000", change: "+8.5%", trend: "up", desc: "Last 7 days total" },
          { label: "Monthly Revenue Index", val: "₹5,20,000", change: "+14.2%", trend: "up", desc: "May 2026 ledger" },
          { label: "Yearly Revenue Forecast", val: "₹65,00,000", change: "+18.9%", trend: "up", desc: "Projected 2026 SaaS" }
        ].map((k, i) => (
          <div key={i} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between h-24`}>
            <div className="flex justify-between items-start">
              <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">{k.label}</span>
              <span className={`text-4xs font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500`}>
                {k.change}
              </span>
            </div>
            <div className="mt-1">
              <h3 className="text-base font-black text-slate-850 dark:text-slate-150">{k.val}</h3>
              <p className="text-4xs text-slate-400 mt-0.5">{k.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (Covers 2 columns) */}
        <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-855 dark:text-slate-200">Revenue Trends & Multi-Period Comparison</h4>
            <div className="flex gap-1.5">
              {['Daily', 'Weekly', 'Monthly'].map(period => (
                <button
                  key={period}
                  onClick={() => setActivePeriod(period)}
                  className={`px-2.5 py-1 rounded text-4xs font-bold transition-all border ${activePeriod === period ? 'bg-emerald-600 border-emerald-600 text-white' : 'dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500'}`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_TREND}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} />
                <Area type="monotone" dataKey={activePeriod} stroke="#10b981" fillOpacity={1} fill="url(#revenueGrad)" strokeWidth={2.5} name="Revenue (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Pie Chart */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-855 dark:text-slate-200">Revenue Sources (Catalog Share)</h4>
            <span className="text-4xs text-slate-400 font-bold uppercase">All Channels</span>
          </div>
          <div className="h-52 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REVENUE_SOURCES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {REVENUE_SOURCES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {REVENUE_SOURCES.map((source, i) => (
              <div key={i} className="flex justify-between text-3xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                  {source.name}
                </span>
                <span className="text-slate-705 dark:text-slate-255 font-bold">₹{source.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Region-wise Revenue breakdown list */}
      <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <div className="flex justify-between items-center border-b pb-2 dark:border-slate-850 border-slate-150">
          <span className="text-4xs font-extrabold uppercase text-slate-400">Regional Revenue Breakdown</span>
          <span className="text-4xs text-emerald-500 font-bold uppercase tracking-wider">Dynamic rankings</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {REGIONAL_REVENUE.map((reg, idx) => (
            <div key={idx} className="p-3.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between gap-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-800 dark:text-slate-105 flex items-center gap-1"><MapPin size={12} className="text-emerald-500" /> {reg.region}</span>
                <span className="text-4xs font-black uppercase text-slate-400">{reg.status}</span>
              </div>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-base font-black text-slate-855 dark:text-slate-155">{reg.revenue}</span>
                <span className="text-3xs text-slate-400 font-semibold">{reg.orders} Orders</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import {
  Search, Filter, Download, ArrowUpRight, IndianRupee,
  TrendingUp, Award, Calendar, RefreshCw
} from 'lucide-react'

const SALES_BY_CATEGORY = [
  { category: 'Fertilizers', Sales: 34000, growth: '+15.2%' },
  { category: 'Hybrid Seeds', Sales: 42000, growth: '+22.4%' },
  { category: 'Pesticides', Sales: 29000, growth: '+8.1%' },
  { category: 'Agro Tools', Sales: 18000, growth: '+4.0%' }
];

const TOP_PRODUCTS = [
  { name: 'Organic NPK Boost Fertilizer', sold: 1820, revenue: '₹4,55,000', status: 'High Demand' },
  { name: 'Hybrid Cotton Seeds v4', sold: 1450, revenue: '₹2,90,000', status: 'High Demand' },
  { name: 'Neem Oil Bio-Pesticide', sold: 980, revenue: '₹1,47,000', status: 'Steady Sales' },
  { name: 'Drip Irrigation Pipe Kit', sold: 420, revenue: '₹1,26,000', status: 'Steady Sales' }
];

export default function SalesReports() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [downloadMsg, setDownloadMsg] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState('Kharif')

  useEffect(() => {
    setActiveItem('Reports & Analytics', 'Sales Reports')
  }, [setActiveItem])

  const triggerDownload = (format) => {
    setDownloadMsg(true)
    setTimeout(() => setDownloadMsg(false), 3000)

    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`AgriAI Sales Report (${format})\nGenerated: ${new Date().toLocaleString()}`))
    link.setAttribute('download', `sales_report_${new Date().toLocaleDateString()}.${format}`)
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
            Sales Performance Reports
          </h2>
          <p className="text-xs text-slate-500 font-medium">Audit order volumes, seasonal catalog demand, product categories metrics, and regional turnovers</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => triggerDownload("xlsx")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Download size={13} />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {downloadMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          Sales file generated. Browser is initiating file download now.
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Platform Sales", val: "₹14,50,000", change: "+14.8%", color: "text-blue-500" },
          { label: "Average Order Value", val: "₹3,450", change: "+5.2%", color: "text-emerald-500" },
          { label: "Order Volume Count", val: "420 Orders Today", change: "+8.0%", color: "text-sky-500" },
          { label: "Sales Conversion Rate", val: "4.82%", change: "+0.35%", color: "text-amber-500" }
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between h-24`}>
            <div className="flex justify-between items-start">
              <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">{item.label}</span>
              <span className="text-4xs font-bold text-emerald-500">{item.change}</span>
            </div>
            <h3 className="text-base font-black text-slate-855 dark:text-slate-155 mt-1">{item.val}</h3>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Performance Bar Chart */}
        <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-855 dark:text-slate-200">Category Sales Turnover Analysis</h4>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className={`text-3xs font-bold p-1.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-350' : 'bg-slate-50 border-slate-250 text-slate-650'}`}
            >
              <option value="Kharif">Kharif Season</option>
              <option value="Rabi">Rabi Season</option>
              <option value="Summer">Summer Season</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALES_BY_CATEGORY}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} />
                <Bar dataKey="Sales" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Sales (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales heatmaps / seasonal overview panels */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <span className="text-4xs font-extrabold uppercase text-slate-400">Weekly Sales Heatmap Density</span>
          <div className="grid grid-cols-7 gap-1 mt-3">
            {Array.from({ length: 28 }).map((_, i) => {
              const density = [10, 30, 50, 80, 95][i % 5]
              let color = 'bg-slate-100 dark:bg-slate-800'
              if (density === 30) color = 'bg-emerald-500/20 text-emerald-600'
              if (density === 50) color = 'bg-emerald-500/40 text-emerald-700'
              if (density === 80) color = 'bg-emerald-500/60 text-emerald-950'
              if (density === 95) color = 'bg-emerald-600 text-white'
              return (
                <div key={i} className={`h-8 rounded flex items-center justify-center text-4xs font-black select-none ${color}`}>
                  {density}%
                </div>
              )
            })}
          </div>
          <div className="flex justify-between items-center text-4xs font-bold text-slate-400 mt-4 border-t pt-2 dark:border-slate-800 border-slate-100">
            <span>Low Turnover (10%)</span>
            <span>Peak Demand (95%)</span>
          </div>
        </div>
      </div>

      {/* Top Selling Products Leaders table */}
      <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <div className="flex justify-between items-center border-b pb-2 dark:border-slate-850 border-slate-150">
          <span className="text-4xs font-extrabold uppercase text-slate-400">Top Performing Catalog Products</span>
          <span className="text-4xs text-emerald-500 font-bold uppercase tracking-wider">High conversion products</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {TOP_PRODUCTS.map((prod, idx) => (
            <div key={idx} className="p-3.5 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between gap-1 text-xs">
              <span className="font-extrabold text-slate-800 dark:text-slate-105 truncate">{prod.name}</span>
              <span className="text-4xs font-black uppercase text-emerald-500">{prod.status}</span>
              <div className="flex justify-between items-baseline mt-2 font-semibold">
                <span className="text-base font-black text-slate-855 dark:text-slate-155">{prod.revenue}</span>
                <span className="text-3xs text-slate-400">{prod.sold} units sold</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

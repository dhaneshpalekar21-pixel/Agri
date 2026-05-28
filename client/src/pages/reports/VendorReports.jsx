import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  Search, Filter, Download, Star, Award, ShieldAlert,
  ArrowUpRight, Percent, RefreshCw, BarChart2, CheckCircle
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

const INITIAL_VENDORS = [
  { name: 'Patil Seeds Outlet', totalOrders: 1450, revenue: 385000, ratings: 4.8, complaintCount: 2, status: 'Elite Partner' },
  { name: 'Krishna Agro Industry', totalOrders: 980, revenue: 245000, ratings: 4.5, complaintCount: 8, status: 'Top Performer' },
  { name: 'Deccan Fertilizers', totalOrders: 720, revenue: 190000, ratings: 4.2, complaintCount: 14, status: 'Average' },
  { name: 'Maratha Agro Tech', totalOrders: 410, revenue: 98000, ratings: 3.9, complaintCount: 18, status: 'Needs Improvement' }
];

const PERFORMANCE_CHART = [
  { name: 'Patil Seeds', FulfillmentRate: 98, RatingScore: 96 },
  { name: 'Krishna Agro', FulfillmentRate: 94, RatingScore: 90 },
  { name: 'Deccan Fert', FulfillmentRate: 88, RatingScore: 84 },
  { name: 'Maratha Tech', FulfillmentRate: 80, RatingScore: 78 }
];

export default function VendorReports() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [vendors, setVendors] = useState(INITIAL_VENDORS)
  const [downloadMsg, setDownloadMsg] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')

  useEffect(() => {
    setActiveItem('Reports & Analytics', 'Vendor Reports')
  }, [setActiveItem])

  const triggerDownload = (format) => {
    setDownloadMsg(true)
    setTimeout(() => setDownloadMsg(false), 3000)

    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Vendor Performance Report\nGenerated: ${new Date().toLocaleString()}`))
    link.setAttribute('download', `vendor_performance_report.${format}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    v.status.toLowerCase().includes(searchFilter.toLowerCase())
  )

  const getStatusColor = (status) => {
    if (status === 'Elite Partner') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    if (status === 'Top Performer') return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    if (status === 'Average') return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20'
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
            🏪 Vendor Performance Reports
          </h2>
          <p className="text-xs text-slate-500 font-medium">Monitor vendor service levels, dispatch latency, customer reviews, and fee commissions</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => triggerDownload("csv")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Download size={13} />
            <span>Export Vendor Data</span>
          </button>
        </div>
      </div>

      {/* Export notification */}
      {downloadMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          Vendor reports compiled and downloaded.
        </div>
      )}

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Elite Partners Registered", val: vendors.filter(v=>v.status==='Elite Partner').length, icon: Award, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Total Commissions Earned", val: "₹1,24,000", icon: Percent, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Avg Vendor Satisfaction", val: "4.45 / 5.0", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Vendor Complaints Filed", val: vendors.reduce((acc, v)=>acc+v.complaintCount, 0), icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10" }
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex items-center gap-4`}>
            <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
              <item.icon size={18} />
            </div>
            <div>
              <p className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">{item.label}</p>
              <h4 className="text-base font-black text-slate-850 dark:text-slate-150 mt-0.5">{item.val}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Workspace splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table representation */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex items-center justify-between`}>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search vendor name, status..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className={`w-full text-xs pl-9 pr-4 py-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-850 focus:border-emerald-500'} transition-all`}
              />
            </div>
          </div>

          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-4xs font-bold uppercase tracking-wider text-slate-400 ${theme === 'dark' ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <th className="p-3">Vendor Name</th>
                    <th className="p-3">Total Orders</th>
                    <th className="p-3">Revenue Generated</th>
                    <th className="p-3">Rating Score</th>
                    <th className="p-3">Complaints Filed</th>
                    <th className="p-3">Performance Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                  {filteredVendors.map((v, i) => (
                    <tr key={i} className={theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50'}>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{v.name}</td>
                      <td className="p-3 font-semibold text-slate-500">{v.totalOrders}</td>
                      <td className="p-3 font-bold text-slate-700 dark:text-slate-300">₹{v.revenue.toLocaleString()}</td>
                      <td className="p-3 flex items-center gap-1 font-semibold">
                        <Star size={11} className="text-amber-500 fill-amber-500" />
                        <span>{v.ratings}</span>
                      </td>
                      <td className="p-3 text-rose-500 font-bold">{v.complaintCount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-4xs font-extrabold border uppercase ${getStatusColor(v.status)}`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fulfillment Rate Bar chart */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-855 dark:text-slate-200">Fulfillment & Accuracy Score</h4>
            <span className="text-4xs text-slate-400 font-bold uppercase">Weekly metrics</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PERFORMANCE_CHART}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="FulfillmentRate" fill="#10b981" radius={[3, 3, 0, 0]} name="Fulfillment %" />
                <Bar dataKey="RatingScore" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Quality Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

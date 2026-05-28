import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  Truck, CheckCircle, AlertTriangle, AlertOctagon, MapPin,
  Clock, Star, Search, Download, BarChart3
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

const DELIVERY_SUCCESS_TREND = [
  { week: 'Wk 1', SuccessRate: 92, DelayRate: 6 },
  { week: 'Wk 2', SuccessRate: 95, DelayRate: 4 },
  { week: 'Wk 3', SuccessRate: 94, DelayRate: 5 },
  { week: 'Wk 4', SuccessRate: 97, DelayRate: 2 },
  { week: 'Wk 5', SuccessRate: 96, DelayRate: 3 }
];

const DELAY_REASONS = [
  { reason: 'Road blockages (construction)', count: 42, impact: 'High' },
  { reason: 'Heavy rainfall in Satara region', count: 28, impact: 'Medium' },
  { reason: 'Incorrect customer coordinates', count: 18, impact: 'Low' }
];

export default function DeliveryReports() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [downloadMsg, setDownloadMsg] = useState(false)

  useEffect(() => {
    setActiveItem('Reports & Analytics', 'Delivery Reports')
  }, [setActiveItem])

  const triggerDownload = () => {
    setDownloadMsg(true)
    setTimeout(() => setDownloadMsg(false), 3000)

    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Logistics & Delivery Report\nGenerated: ${new Date().toLocaleString()}`))
    link.setAttribute('download', `logistics_delivery_report.csv`)
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
            🚚 Logistics & Delivery Reports
          </h2>
          <p className="text-xs text-slate-500 font-medium">Verify courier dispatch latency, failed attempts, delays, and regional dispatch efficiency</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={triggerDownload}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Download size={13} />
            <span>Export Delivery Data</span>
          </button>
        </div>
      </div>

      {/* Success notification */}
      {downloadMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          Delivery logistics summary export completed.
        </div>
      )}

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Successful Deliveries", val: "96.4% Rate", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Transit Delay Incidents", val: "18 Shipments", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Failed Return Packages", val: "3 Packages", icon: AlertOctagon, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "Partner Agencies Count", val: "12 Channels", icon: Truck, color: "text-blue-500", bg: "bg-blue-500/10" }
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex items-center gap-4`}>
            <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
              <item.icon size={18} />
            </div>
            <div>
              <p className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">{item.label}</p>
              <h4 className="text-base font-black text-slate-855 dark:text-slate-155 mt-0.5">{item.val}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area chart */}
        <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-855 dark:text-slate-200">Delivery Accuracy Trends</h4>
            <span className="text-4xs text-slate-400 font-bold uppercase">Weekly metrics</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DELIVERY_SUCCESS_TREND}>
                <defs>
                  <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="SuccessRate" stroke="#10b981" fillOpacity={1} fill="url(#successGrad)" strokeWidth={2} name="Success Rate %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delay reasons log panel */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 border-b pb-2 dark:border-slate-850 border-slate-150">
              <AlertTriangle className="text-amber-500 animate-pulse" size={16} />
              <span className="text-4xs font-extrabold uppercase text-slate-400">Transit Delays Log</span>
            </div>
            <div className="space-y-3">
              {DELAY_REASONS.map((d, i) => (
                <div key={i} className="p-3 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1">
                  <div className="flex justify-between items-start font-bold">
                    <span className="text-2xs text-slate-800 dark:text-slate-105">{d.reason}</span>
                    <span className="text-4xs px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500">{d.impact}</span>
                  </div>
                  <div className="text-4xs text-slate-450 mt-1 font-semibold">{d.count} shipments affected</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-4xs font-bold text-emerald-500 mt-4 flex items-center gap-1.5">
            <CheckCircle size={12} />
            <span>Optimal route recommendations pushed to partners.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

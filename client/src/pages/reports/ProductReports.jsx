import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  Boxes, Package, AlertTriangle, AlertCircle, TrendingUp,
  Search, RefreshCw, BarChart2, Star, Download
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

const DEMAND_FORECAST = [
  { name: 'June', FertilizerDemand: 120, SeedDemand: 230 },
  { name: 'July', FertilizerDemand: 190, SeedDemand: 310 },
  { name: 'Aug', FertilizerDemand: 240, SeedDemand: 280 },
  { name: 'Sept', FertilizerDemand: 150, SeedDemand: 210 },
  { name: 'Oct', FertilizerDemand: 180, SeedDemand: 340 }
];

const LOW_STOCK_ITEMS = [
  { sku: 'NPK-B-1002', name: 'Bio NPK Soil Booster (5kg)', stockRemaining: 15, reorderLevel: 50, warehouse: 'Pune Main' },
  { sku: 'HYB-CS-4001', name: 'Hybrid Cotton Seeds v4', stockRemaining: 8, reorderLevel: 30, warehouse: 'Satara Hub' },
  { sku: 'NEEM-INS-99', name: 'Organic Neem Oil Insecticide', stockRemaining: 22, reorderLevel: 40, warehouse: 'Nashik Hub' }
];

export default function ProductReports() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [downloadMsg, setDownloadMsg] = useState(false)

  useEffect(() => {
    setActiveItem('Reports & Analytics', 'Product Reports')
  }, [setActiveItem])

  const triggerDownload = (format) => {
    setDownloadMsg(true)
    setTimeout(() => setDownloadMsg(false), 3000)

    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Product Performance Report\nGenerated: ${new Date().toLocaleString()}`))
    link.setAttribute('download', `product_inventory_report.${format}`)
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
            📦 Product Catalog & Inventory Analytics
          </h2>
          <p className="text-xs text-slate-500 font-medium">Analyze catalog growth velocity, inventory stock counts, reorder warnings, and demand forecasts</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => triggerDownload("pdf")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Download size={13} />
            <span>Export Product Catalog</span>
          </button>
        </div>
      </div>

      {/* Export notification */}
      {downloadMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          PDF compiled successfully! Preparing file download.
        </div>
      )}

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Catalog Skus", val: "8,430 Products", icon: Boxes, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Items in Stock (Total)", val: "1.24 Lakh Units", icon: Package, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Low Stock Alert Skus", val: LOW_STOCK_ITEMS.length + " Alerts", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "Return Claim Rate", val: "1.45% Average", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" }
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

      {/* Workspace splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demand Forecasting Area curve */}
        <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-855 dark:text-slate-200">Pre-Season Product Demand Forecasting</h4>
            <span className="text-4xs text-slate-400 font-bold uppercase">5-Month predictive metrics</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMAND_FORECAST}>
                <defs>
                  <linearGradient id="fertGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="seedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="FertilizerDemand" stroke="#3b82f6" fillOpacity={1} fill="url(#fertGrad)" strokeWidth={2} name="Fertilizers Demand" />
                <Area type="monotone" dataKey="SeedDemand" stroke="#8b5cf6" fillOpacity={1} fill="url(#seedGrad)" strokeWidth={2} name="Hybrid Seeds Demand" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts warning log list */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 border-b pb-2 dark:border-slate-850 border-slate-150">
              <AlertTriangle className="text-rose-500 animate-pulse" size={16} />
              <span className="text-4xs font-extrabold uppercase text-slate-400">Critical Stock Warnings</span>
            </div>
            <div className="space-y-3">
              {LOW_STOCK_ITEMS.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-2xs font-extrabold text-slate-800 dark:text-slate-105">{item.name}</span>
                    <span className="text-4xs px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-500 font-bold uppercase">{item.sku}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-4xs font-semibold text-slate-400">
                    <span>Warehouse: {item.warehouse}</span>
                    <span className="text-rose-500 font-extrabold">{item.stockRemaining} / {item.reorderLevel} Left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-4xs font-bold text-amber-500 mt-4">
            Reorder thresholds reached. Notifications sent to respective suppliers.
          </div>
        </div>
      </div>
    </div>
  )
}

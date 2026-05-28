import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  MapPin, Globe, Compass, Users, Store, DollarSign,
  CloudSun, Search, Download, BarChart3, HelpCircle
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

const REGIONAL_DENSITIES = [
  { zone: 'Pune Zone', Farmers: 18200, Vendors: 420, Sales: 450000 },
  { zone: 'Nashik Zone', Farmers: 15400, Vendors: 310, Sales: 380000 },
  { zone: 'Satara Zone', Farmers: 12000, Vendors: 240, Sales: 290000 },
  { zone: 'Kolhapur Zone', Farmers: 9400, Vendors: 180, Sales: 180000 }
];

export default function RegionAnalytics() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [downloadMsg, setDownloadMsg] = useState(false)
  const [selectedZone, setSelectedZone] = useState('Pune Zone')

  useEffect(() => {
    setActiveItem('Reports & Analytics', 'Region Analytics')
  }, [setActiveItem])

  const triggerDownload = () => {
    setDownloadMsg(true)
    setTimeout(() => setDownloadMsg(false), 3000)

    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Regional Demographics & Geo-analytics\nGenerated: ${new Date().toLocaleString()}`))
    link.setAttribute('download', `regional_demographics.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const activeZoneDetails = REGIONAL_DENSITIES.find(z => z.zone === selectedZone) || REGIONAL_DENSITIES[0]

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
            🗺️ Regional Demographics & Geo-Analytics
          </h2>
          <p className="text-xs text-slate-500 font-medium">Verify regional farmer registration counts, sales distribution, weather impacts, and crop demand ratios</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={triggerDownload}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Download size={13} />
            <span>Export Regional Data</span>
          </button>
        </div>
      </div>

      {/* Success notification */}
      {downloadMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          Regional CSV report compiled and downloaded successfully.
        </div>
      )}

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Farmers in Maharashtra", val: "55,000 Total", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Regional Hubs Operating", val: "4 Main Divisions", icon: MapPin, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Vendor Outlets Count", val: "1,150 Shops", icon: Store, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Average Regional Turnover", val: "₹3,25,000", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" }
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

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comparison chart (2 columns) */}
        <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-855 dark:text-slate-200">Zone-wise Turnover & Farmer Distribution</h4>
            <span className="text-4xs text-slate-400 font-bold uppercase">Maharashtra divisions</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REGIONAL_DENSITIES}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="zone" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Farmers" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Registered Farmers" />
                <Bar dataKey="Vendors" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Active Vendors" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Zone Focus & simulated Map details */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 border-b pb-2 dark:border-slate-850 border-slate-150">
              <Compass className="text-emerald-500 animate-spin-slow" size={16} />
              <span className="text-4xs font-extrabold uppercase text-slate-400">Interactive Map Hub Focus</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-4xs font-bold text-slate-400 mb-1">CHOOSE MAP REGION</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className={`w-full text-2xs p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-300 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-800 focus:border-emerald-500'} transition-all`}
                >
                  {REGIONAL_DENSITIES.map(z => (
                    <option key={z.zone} value={z.zone}>{z.zone}</option>
                  ))}
                </select>
              </div>

              {/* Geographic stats list */}
              <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 border-slate-200 space-y-2 text-2xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400 uppercase text-3xs">REGIONAL SALES</span>
                  <span className="text-slate-800 dark:text-slate-105">₹{activeZoneDetails.Sales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400 uppercase text-3xs">TOTAL FARMERS</span>
                  <span className="text-slate-800 dark:text-slate-105">{activeZoneDetails.Farmers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400 uppercase text-3xs">TOTAL VENDORS</span>
                  <span className="text-slate-800 dark:text-slate-105">{activeZoneDetails.Vendors} Outlets</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-blue-500/10 border border-blue-500/20 text-4xs font-bold text-blue-500 mt-4 flex items-center gap-1.5">
            <CloudSun size={12} className="text-blue-400" />
            <span>Weather reports show no severe harvest impact for this zone.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

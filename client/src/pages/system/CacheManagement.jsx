import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Settings, HelpCircle, Activity, ShieldCheck, CheckCircle } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function CacheManagement() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [cacheDetails, setCacheDetails] = useState({
    apiSize: '24.5 MB',
    userSize: '12.8 MB',
    systemSize: '8.4 MB',
    totalKeys: 4290,
    hitRatio: '94.2%'
  })

  const [clearing, setClearing] = useState(false)
  const [clearResult, setClearResult] = useState(null)

  const handleClearCache = (type) => {
    setClearing(true)
    setClearResult(null)
    setTimeout(() => {
      setClearing(false)
      setClearResult(`${type} Cache cleared successfully! Rotated keys and flushed cache memory blocks.`)
    }, 1000)
  }

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Trash2 className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            System Cache Optimization
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Clear system, user, or api cache pools, track redis keys status, and manage TTL rules</p>
        </div>
      </div>

      {/* KPI Stats widgets (Equal Sizing) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">API Cache Size</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">{cacheDetails.apiSize}</span>
            <span className="text-xs text-slate-400 font-semibold">Active Keys</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">User Session Cache</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">{cacheDetails.userSize}</span>
            <span className="text-xs text-slate-400 font-semibold">Active Profiles</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Total Redis Keys</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-emerald-500">{cacheDetails.totalKeys}</span>
            <span className="text-xs text-slate-400 font-semibold">Allocated Memory</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Redis Hit Ratio</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-emerald-500">{cacheDetails.hitRatio}</span>
            <span className="text-xs text-slate-400 font-semibold">SLA Target 90%</span>
          </div>
        </div>
      </div>

      {/* Main Configurations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Left Settings */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><Settings size={18} /> Clear Cache Pools</h3>
            <p className="text-xs text-slate-455 mt-1">Manual cleanup actions</p>
          </div>

          <div className="space-y-4 flex-1 mt-4">
            <button
              onClick={() => handleClearCache('API')}
              className="w-full btn-danger text-xs md:text-sm py-3 font-semibold"
            >
              Clear API Handshake Cache
            </button>

            <button
              onClick={() => handleClearCache('User')}
              className="w-full btn-danger text-xs md:text-sm py-3 font-semibold"
            >
              Clear User Session Cache
            </button>

            <button
              onClick={() => handleClearCache('System')}
              className="w-full btn-danger text-xs md:text-sm py-3 font-semibold"
            >
              Clear Global System Cache
            </button>
          </div>
        </div>

        {/* Right Status */}
        <div className={`lg:col-span-2 rounded-xl border p-6 md:p-8 space-y-6 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Auto Cleanup Policies</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium font-body">Manage automatic scheduling parameters for cache cleanup cycles</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border dark:border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">Automatically clear caches monthly</span>
                <span className="text-3xs text-slate-400">Triggered on the first day of every month</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4 cursor-pointer" />
            </div>

            <div className="p-4 border dark:border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">Invalidate user sessions on idle (30 mins)</span>
                <span className="text-3xs text-slate-400">Autoclears idle credentials tokens</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4 cursor-pointer" />
            </div>
          </div>
        </div>

      </div>

      {/* Clear Status Feedback */}
      {clearing && (
        <div className="p-4 rounded-xl border dark:border-slate-800 animate-pulse text-xs text-slate-400">
          Sending cache invalidate signals...
        </div>
      )}
      {clearResult && (
        <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-500 text-xs md:text-sm font-semibold flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{clearResult}</span>
        </div>
      )}
    </div>
  )
}

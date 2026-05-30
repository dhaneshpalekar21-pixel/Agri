import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, HelpCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function ServerMonitoring() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [metrics] = useState({
    cpu: '18%',
    ram: '4.2 GB / 8.0 GB',
    storage: '24 GB / 80 GB',
    uptime: '14 Days, 8 Hours',
    connections: 142
  })

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Activity className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            DevOps Server Monitoring
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Verify node resource utilization, active web socket channels, and ping latency parameters</p>
        </div>
      </div>

      {/* Resource Utilization Cards (Equal Height & Width) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">CPU Core Load</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">{metrics.cpu}</span>
            <span className="text-xs text-emerald-500 font-semibold">Healthy</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">System Memory (RAM)</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">{metrics.ram}</span>
            <span className="text-xs text-slate-400 font-semibold">52% load</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">SSD Disk Storage</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">{metrics.storage}</span>
            <span className="text-xs text-slate-400 font-semibold">30% usage</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">System Node Uptime</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-emerald-500">{metrics.uptime}</span>
            <span className="text-xs text-slate-400 font-semibold">Last Boot Stable</span>
          </div>
        </div>
      </div>

      {/* Utilization graphs (Set container height to 400px–500px) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Memory Load Graph */}
        <div className={`lg:col-span-2 rounded-xl border p-6 md:p-8 space-y-6 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100">Live CPU Core Load History</h3>
            <p className="text-xs text-slate-400 mt-1">Real-time load aggregates captured every 5 seconds</p>
          </div>

          <div className="w-full h-[400px] pt-4">
            <svg viewBox="0 0 500 250" preserveAspectRatio="none" className="w-full h-full">
              <line x1="50" y1="40" x2="450" y2="40" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="1" strokeDasharray="4,4" />
              <line x1="50" y1="90" x2="450" y2="90" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="1" strokeDasharray="4,4" />
              <line x1="50" y1="140" x2="450" y2="140" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="1" strokeDasharray="4,4" />
              <line x1="50" y1="190" x2="450" y2="190" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="1" strokeDasharray="4,4" />

              <path
                d="M 50,180 L 100,160 L 150,190 L 200,140 L 250,150 L 300,110 L 350,130 L 400,90 L 450,110"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              <text x="50" y="240" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">0s ago</text>
              <text x="150" y="240" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">15s ago</text>
              <text x="250" y="240" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">30s ago</text>
              <text x="350" y="240" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">45s ago</text>
              <text x="450" y="240" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">60s ago</text>
            </svg>
          </div>
        </div>

        {/* System alerts info */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Live Active Alerting Channels</h3>
            <p className="text-xs text-slate-400 mt-1">Automatic alert notifications triggers</p>
          </div>

          <div className="space-y-4 flex-1 mt-4">
            <div className="p-4 rounded-xl border dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">Alert on CPU &gt; 90% load</span>
                <span className="text-3xs text-slate-400">Trigger alerts to Slack channels</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4 cursor-pointer" />
            </div>

            <div className="p-4 rounded-xl border dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">Alert on Disk &gt; 85% storage</span>
                <span className="text-3xs text-slate-400">Trigger automated log cleaning tasks</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4 cursor-pointer" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

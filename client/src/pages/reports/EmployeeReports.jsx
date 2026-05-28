import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  Users, Calendar, Clock, DollarSign, Download, Search,
  TrendingUp, BarChart2, Star, ShieldCheck, MapPin
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

const ATTENDANCE_STATS = [
  { name: 'Amit Shinde', OnTimeRate: 98, TasksCompleted: 48 },
  { name: 'Sunita Pawar', OnTimeRate: 94, TasksCompleted: 42 },
  { name: 'Pranali Joshi', OnTimeRate: 97, TasksCompleted: 50 },
  { name: 'Sanjay Deshmukh', OnTimeRate: 88, TasksCompleted: 35 }
];

const RECENT_LEAVES = [
  { name: 'Sanjay Deshmukh', reason: 'Medical Leave', duration: '2 Days', status: 'Approved' },
  { name: 'Sunita Pawar', reason: 'Personal Emergency', duration: '1 Day', status: 'Pending Review' }
];

export default function EmployeeReports() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [downloadMsg, setDownloadMsg] = useState(false)

  useEffect(() => {
    setActiveItem('Reports & Analytics', 'Employee Reports')
  }, [setActiveItem])

  const triggerDownload = (report) => {
    setDownloadMsg(true)
    setTimeout(() => setDownloadMsg(false), 3000)

    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`HR Employee Report: ${report}\nGenerated: ${new Date().toLocaleString()}`))
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
            💼 Employee Performance & HR Reports
          </h2>
          <p className="text-xs text-slate-500 font-medium">Audit staff attendance, task logs, shift allocations, wage lists, and active GPS coordinates</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => triggerDownload("Staff Wage Ledger")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Download size={13} />
            <span>Export Payroll Summary</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {downloadMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          HR report download initiated. Check your browser.
        </div>
      )}

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Field Staff", val: "342 Employees", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Avg Attendance Index", val: "94.8% Ratio", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Shift Completion Rate", val: "98.2% Ratio", icon: Clock, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Monthly Gross Payroll", val: "₹12,45,000", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" }
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Bar chart */}
        <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-855 dark:text-slate-200">Staff Shift Punctuality & Task Closure</h4>
            <span className="text-4xs text-slate-400 font-bold uppercase">Weekly metrics</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ATTENDANCE_STATS}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="OnTimeRate" fill="#10b981" radius={[3, 3, 0, 0]} name="On Time Arrival %" />
                <Bar dataKey="TasksCompleted" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Tasks Completed Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Logs panels */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <div className="space-y-4">
            <span className="text-4xs font-extrabold uppercase text-slate-400">Leave Requests Stream</span>
            <div className="space-y-3 mt-2">
              {RECENT_LEAVES.map((l, i) => (
                <div key={i} className="p-3 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-2xs text-slate-800 dark:text-slate-105">{l.name}</span>
                    <span className={`text-4xs px-1.5 py-0.5 rounded ${l.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {l.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-4xs font-semibold text-slate-455">
                    <span>Reason: {l.reason}</span>
                    <span>Duration: {l.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded bg-blue-500/10 border border-blue-500/20 text-4xs font-bold text-blue-500 mt-4 flex items-center gap-1.5">
            <MapPin size={12} />
            <span>GPS Tracking active for 42 field agents on duty.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

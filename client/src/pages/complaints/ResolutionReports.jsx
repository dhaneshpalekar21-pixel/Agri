import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  TrendingUp, BarChart3, Clock, Star, AlertTriangle, ShieldCheck, Download,
  Calendar, RefreshCw, FileText, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend
} from 'recharts'

const MONTHLY_ANALYTICS = [
  { month: 'Jan', ResolutionRate: 88, AvgTimeHrs: 12, Tickets: 120 },
  { month: 'Feb', ResolutionRate: 91, AvgTimeHrs: 9, Tickets: 145 },
  { month: 'Mar', ResolutionRate: 89, AvgTimeHrs: 11, Tickets: 180 },
  { month: 'Apr', ResolutionRate: 94, AvgTimeHrs: 6, Tickets: 165 },
  { month: 'May', ResolutionRate: 96, AvgTimeHrs: 4, Tickets: 210 }
];

const AGENT_PERFORMANCE = [
  { name: 'Amit Shinde', Resolved: 85, Escalated: 5, Satisfaction: 4.8 },
  { name: 'Sunita Pawar', Resolved: 72, Escalated: 12, Satisfaction: 4.5 },
  { name: 'Pranali Joshi', Resolved: 94, Escalated: 2, Satisfaction: 4.9 },
  { name: 'Sanjay Deshmukh', Resolved: 64, Escalated: 8, Satisfaction: 4.3 }
];

export default function ResolutionReports() {
  const { setActiveItem, theme } = useSuperAdminStore()

  useEffect(() => {
    setActiveItem('Complaint & Support', 'Resolution Reports')
  }, [setActiveItem])

  const [timeframe, setTimeframe] = useState('5M')
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const triggerDownload = (reportName) => {
    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3000)
    // Simulate downloading files
    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`AgriAI Support Report: ${reportName}\nGenerated on: ${new Date().toLocaleString()}`))
    link.setAttribute('download', `${reportName.toLowerCase().replace(/ /g, '_')}_report.txt`)
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
            Resolution Reports & Support KPIs
          </h2>
          <p className="text-xs text-slate-500 font-medium">Audit resolution speed index, agent support scores, and download monthly helpdesk performance logs</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => triggerDownload("Helpdesk Overall Summary")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Download size={13} />
            <span>Export CSV Summary</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {downloadSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in flex items-center gap-2">
          <ShieldCheck size={16} /> Report generated and downloaded successfully!
        </div>
      )}

      {/* Analytics KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Overall Resolution Rate", val: "94.2%", change: "+3.2%", trend: "up", color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Avg Resolution Time", val: "4.8 Hours", change: "-2.4 Hours", trend: "down", color: "text-sky-500 bg-sky-500/10" },
          { label: "Agent CSAT Average", val: "4.63 / 5.0", change: "+0.15", trend: "up", color: "text-amber-500 bg-amber-500/10" },
          { label: "Escalation Index", val: "4.8%", change: "-1.2%", trend: "down", color: "text-rose-500 bg-rose-500/10" }
        ].map((kpi, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between h-24`}>
            <div className="flex justify-between items-start">
              <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">{kpi.label}</span>
              <span className={`text-4xs font-bold px-1.5 py-0.5 rounded ${kpi.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {kpi.change}
              </span>
            </div>
            <h3 className="text-base font-black text-slate-850 dark:text-slate-150 mt-1">{kpi.val}</h3>
          </div>
        ))}
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Resolution & Tickets Area Chart */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Resolution Rates & Call Volumes</h4>
            <span className="text-4xs font-bold text-slate-400 uppercase">Last 5 Months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_ANALYTICS}>
                <defs>
                  <linearGradient id="rateColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} />
                <Area type="monotone" dataKey="ResolutionRate" stroke="#10b981" fillOpacity={1} fill="url(#rateColor)" strokeWidth={2.5} name="Resolution %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Resolution Performance Bar Chart */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Agent Performance Breakdown</h4>
            <span className="text-4xs font-bold text-slate-400 uppercase">Resolved vs Escalated</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AGENT_PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Resolved" fill="#10b981" radius={[3, 3, 0, 0]} name="Resolved Tickets" />
                <Bar dataKey="Escalated" fill="#f43f5e" radius={[3, 3, 0, 0]} name="Escalated Tickets" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed performance tables and downloads */}
      <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <span className="text-4xs font-extrabold uppercase text-slate-400">Available Support Performance Documents</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Escalation Audit Trail", desc: "Detailed breakdown of all SLA breach incidents and manager overrides.", size: "4.2 MB", type: "PDF" },
            { title: "Monthly Support Trend Analysis", desc: "Comparative charts mapping query categories to regional zones.", size: "12.8 MB", type: "Excel" },
            { title: "Agent Efficiency Metrics", desc: "Logs tracking average pickup delay, talk time, and customer ratings.", size: "1.5 MB", type: "CSV" }
          ].map((doc, idx) => (
            <div key={idx} className="p-4 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center text-xs">
              <div className="space-y-1 pr-4">
                <h5 className="font-extrabold text-slate-800 dark:text-slate-105">{doc.title}</h5>
                <p className="text-3xs text-slate-400 leading-normal">{doc.desc}</p>
                <span className="text-4xs text-slate-500 font-bold uppercase">{doc.type} • {doc.size}</span>
              </div>
              <button
                onClick={() => triggerDownload(doc.title)}
                className={`p-2 rounded-lg border dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-emerald-500 transition-colors flex-shrink-0 cursor-pointer`}
              >
                <Download size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

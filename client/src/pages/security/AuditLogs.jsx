import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  Search, Filter, Download, Calendar, RefreshCw,
  Clock, ShieldAlert, CheckCircle, Info, X
} from 'lucide-react'

const INITIAL_LOGS = [
  { user: 'Ramesh Patil', actionType: 'Permission Policy Edit', module: 'Security', ip: '192.168.1.45', timestamp: '2026-05-28 11:20 AM', status: 'Success', severity: 'High' },
  { user: 'System Sync', actionType: 'Database Auto-Backup', module: 'Database', ip: '127.0.0.1', timestamp: '2026-05-28 10:00 AM', status: 'Success', severity: 'Low' },
  { user: 'Amit Shinde', actionType: 'Bulk Product Verification', module: 'Products', ip: '103.45.22.10', timestamp: '2026-05-28 09:45 AM', status: 'Success', severity: 'Medium' },
  { user: 'Failed Login API', actionType: 'Intrusion Alert', module: 'Auth', ip: '185.220.101.4', timestamp: '2026-05-28 09:12 AM', status: 'Blocked', severity: 'Critical' }
];

export default function AuditLogs() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [logs, setLogs] = useState(INITIAL_LOGS)
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('All')
  const [downloadMsg, setDownloadMsg] = useState(false)

  useEffect(() => {
    setActiveItem('Security & Access', 'Audit Logs')
  }, [setActiveItem])

  const triggerDownload = () => {
    setDownloadMsg(true)
    setTimeout(() => setDownloadMsg(false), 3000)

    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Platform Audit Trail Logs\nGenerated: ${new Date().toLocaleString()}`))
    link.setAttribute('download', `audit_logs.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.user.toLowerCase().includes(search.toLowerCase()) ||
                          l.actionType.toLowerCase().includes(search.toLowerCase()) ||
                          l.module.toLowerCase().includes(search.toLowerCase())
    const matchesSeverity = severityFilter === 'All' || l.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

  const getSeverityStyle = (sev) => {
    if (sev === 'Critical') return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    if (sev === 'High') return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    if (sev === 'Medium') return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-855 dark:text-slate-100 flex items-center gap-2">
            📋 System Audit Trail Logs
          </h2>
          <p className="text-xs text-slate-500 font-medium">Verify admin dashboard edits, database query updates, auth failures, and API service triggers</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={triggerDownload}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Download size={13} />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Export notification */}
      {downloadMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          System audit logs compiled and exported to file.
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="space-y-4">
        {/* Filters */}
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between`}>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search user, action, module..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full text-xs pl-9 pr-4 py-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-850 focus:border-emerald-500'} transition-all`}
            />
          </div>
          
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className={`text-3xs font-bold p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-855 text-slate-355' : 'bg-slate-50 border-slate-250 text-slate-655'}`}
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Table representation */}
        <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-4xs font-bold uppercase tracking-wider text-slate-400 ${theme === 'dark' ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                  <th className="p-3">User Target</th>
                  <th className="p-3">Action Details</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                {filteredLogs.map((l, i) => (
                  <tr key={i} className={theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50'}>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{l.user}</td>
                    <td className="p-3 font-semibold text-slate-550">{l.actionType}</td>
                    <td className="p-3 text-slate-500 font-semibold">{l.module}</td>
                    <td className="p-3 font-bold text-slate-700 dark:text-slate-300">{l.ip}</td>
                    <td className="p-3 text-slate-400 text-3xs font-semibold">{l.timestamp}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-4xs font-extrabold border uppercase ${getSeverityStyle(l.severity)}`}>
                        {l.severity}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={`px-1.5 py-0.5 rounded text-4xs font-extrabold ${l.status === 'Success' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10 animate-pulse'}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

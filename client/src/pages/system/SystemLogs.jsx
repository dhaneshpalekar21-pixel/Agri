import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Search, Filter, Eye, Download, X, HelpCircle, FileText, Calendar } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function SystemLogs() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [search, setSearch] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('All')
  const [selectedLog, setSelectedLog] = useState(null)

  const [logs, setLogs] = useState([
    { id: 'LOG-3091', module: 'Auth', action: 'Failed Login Attempt', actor: 'Unknown (IP: 103.45.2.1)', timestamp: '2026-05-29 13:45', severity: 'High', details: 'Multiple login failures detected for username admin@agroerp.com from India IP address range.' },
    { id: 'LOG-3092', module: 'Database', action: 'Schema Migration Completed', actor: 'System System-Cron', timestamp: '2026-05-29 12:00', severity: 'Low', details: 'Successfully applied schema changes for table index optimization under version v2.4.1.' },
    { id: 'LOG-3093', module: 'Billing', action: 'Gateway Refund Issued', actor: 'Admin Ramesh', timestamp: '2026-05-29 11:20', severity: 'Medium', details: 'Refund reference REF-80219 issued for transaction TXN-9023 under approval mandate admin.' },
    { id: 'LOG-3094', module: 'Security', action: 'API Secret Rotation', actor: 'Super Admin', timestamp: '2026-05-28 16:10', severity: 'High', details: 'Rotated active API keys for Google Maps API and revoked older key mapping.' },
    { id: 'LOG-3095', module: 'Inventory', action: 'Stock Level Correction', actor: 'Admin Sanjay', timestamp: '2026-05-28 14:05', severity: 'Low', details: 'Corrected stock balance for urea fertilizer in Nashik warehouse from 120 bags to 142 bags.' }
  ])

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.module.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase())
    const matchesSeverity = filterSeverity === 'All' || l.severity === filterSeverity
    return matchesSearch && matchesSeverity
  })

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Terminal className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            System Administration Logs
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Audit active system actions, database modifications, security overrides, and login triggers</p>
        </div>
      </div>

      {/* Filter panel */}
      <div className={`p-6 md:p-8 rounded-2xl border flex flex-col md:flex-row items-center gap-4 justify-between ${
        isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'
      }`}>
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border w-full md:max-w-md ${
          isDark ? 'bg-slate-950/50 border-slate-800 focus-within:border-emerald-600' : 'bg-slate-50 border-slate-200 focus-within:border-emerald-600'
        } transition-all`}>
          <Search size={18} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search logs by module, action..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full placeholder-slate-455 text-slate-700 dark:text-slate-200"
          />
        </div>

        <div className="flex gap-2.5 w-full md:w-auto">
          {['All', 'Low', 'Medium', 'High'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterSeverity === sev
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
              }`}
            >
              {sev === 'All' ? 'All Severities' : `${sev} Severity`}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-450 uppercase`}>
                <th className="px-6 py-4 min-w-[140px]">Log Reference</th>
                <th className="px-6 py-4 min-w-[140px]">Module Name</th>
                <th className="px-6 py-4 min-w-[200px]">Action Performed</th>
                <th className="px-6 py-4 min-w-[180px]">User / Agent actor</th>
                <th className="px-6 py-4 min-w-[160px]">Timestamp</th>
                <th className="px-6 py-4 min-w-[120px]">Severity</th>
                <th className="px-6 py-4 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {filteredLogs.map(l => (
                <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                  <td className="px-6 py-3.5 font-mono text-blue-500 font-bold">{l.id}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-655 dark:text-slate-350">{l.module}</td>
                  <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150 truncate max-w-[200px]">{l.action}</td>
                  <td className="px-6 py-3.5 text-slate-450 font-medium truncate max-w-[180px]">{l.actor}</td>
                  <td className="px-6 py-3.5 text-slate-400 font-mono">{l.timestamp}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap inline-flex items-center justify-center ${
                      l.severity === 'High' ? 'bg-rose-500/10 text-rose-500' :
                      l.severity === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-450'
                    }`}>
                      {l.severity}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedLog(l)}
                      className="p-2 text-slate-400 hover:text-emerald-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-lg p-6 md:p-8 rounded-2xl border shadow-2xl z-10 ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <button
                onClick={() => setSelectedLog(null)}
                className="absolute top-4 right-4 text-slate-450 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>

              <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Terminal className="text-emerald-500 w-5 h-5" />
                Log Details: {selectedLog.id}
              </h3>

              <div className="space-y-4 text-xs md:text-sm">
                <div>
                  <span className="font-bold text-slate-400 block mb-1">Module Group</span>
                  <span className="font-semibold">{selectedLog.module}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block mb-1">Action Type</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block mb-1">Logged Details Statement</span>
                  <p className="text-slate-655 dark:text-slate-350 leading-relaxed font-mono bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border dark:border-slate-800">
                    {selectedLog.details}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-slate-400 block mb-1">Triggered by actor</span>
                    <span className="font-semibold">{selectedLog.actor}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block mb-1">Timestamp</span>
                    <span className="font-semibold text-slate-500">{selectedLog.timestamp}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

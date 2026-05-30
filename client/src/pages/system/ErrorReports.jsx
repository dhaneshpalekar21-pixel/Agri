import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Search, Filter, Eye, Download, X, HelpCircle, FileText, CheckCircle } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function ErrorReports() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [search, setSearch] = useState('')
  const [selectedError, setSelectedError] = useState(null)

  const [errors, setErrors] = useState([
    { id: 'ERR-401', module: 'Auth Service', type: 'JWT Token Expiry Fail', severity: 'Critical', count: 184, timestamp: '2026-05-29 13:20', status: 'Unresolved', trace: 'JsonWebTokenError: jwt expired\n  at JWT.verify (/var/www/server/node_modules/jsonwebtoken/verify.js:12:10)\n  at authMiddleware (/var/www/server/middleware/auth.js:24:5)' },
    { id: 'ERR-402', module: 'Database Core', type: 'Max Connection Timeout', severity: 'High', count: 42, timestamp: '2026-05-29 12:45', status: 'In Progress', trace: 'SequelizeConnectionTimeoutError: ResourceRequest timed out after 15000ms\n  at Pool.acquire (/var/www/server/node_modules/sequelize/lib/dialects/abstract/connection-manager.js:280:19)' },
    { id: 'ERR-403', module: 'Weather API API', type: 'Gateway Rate Limit Exceeded', severity: 'Medium', count: 215, timestamp: '2026-05-28 16:50', status: 'Resolved', trace: 'AxiosError: Request failed with status code 429\n  at OpenWeatherMap.getForecast (/var/www/server/services/weather.js:42:15)' }
  ])

  const handleResolveError = (id) => {
    setErrors(prev => prev.map(err => {
      if (err.id === id) {
        return { ...err, status: 'Resolved' }
      }
      return err
    }))
    if (selectedError && selectedError.id === id) {
      setSelectedError(prev => ({ ...prev, status: 'Resolved' }))
    }
  }

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Application Error Tracking
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Trace stack traces, monitor server uncaught exceptions, and audit resolution state workflows</p>
        </div>
      </div>

      {/* Errors table */}
      <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-450 uppercase`}>
                <th className="px-6 py-4 min-w-[140px]">Error Ref</th>
                <th className="px-6 py-4 min-w-[160px]">Service Module</th>
                <th className="px-6 py-4 min-w-[220px]">Error Type</th>
                <th className="px-6 py-4 min-w-[120px]">Severity</th>
                <th className="px-6 py-4 text-center min-w-[120px]">Occurrences</th>
                <th className="px-6 py-4 min-w-[160px]">Last Occurred</th>
                <th className="px-6 py-4 min-w-[140px]">Resolution</th>
                <th className="px-6 py-4 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {errors.map(err => (
                <tr key={err.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                  <td className="px-6 py-3.5 font-mono text-blue-500 font-bold">{err.id}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-655 dark:text-slate-350">{err.module}</td>
                  <td className="px-6 py-3.5 font-bold text-slate-850 dark:text-slate-150 truncate max-w-[200px]">{err.type}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap inline-flex items-center justify-center ${
                      err.severity === 'Critical' ? 'bg-rose-500/10 text-rose-500 font-extrabold animate-pulse' :
                      err.severity === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {err.severity}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-center font-bold text-slate-600 dark:text-slate-300">{err.count} times</td>
                  <td className="px-6 py-3.5 font-mono text-slate-400">{err.timestamp}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap inline-flex items-center justify-center ${
                      err.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' :
                      err.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {err.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right flex justify-end gap-1 items-center">
                    <button
                      onClick={() => setSelectedError(err)}
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

      {/* Error Detail Modal */}
      <AnimatePresence>
        {selectedError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedError(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-xl p-6 md:p-8 rounded-2xl border shadow-2xl z-10 ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <button
                onClick={() => setSelectedError(null)}
                className="absolute top-4 right-4 text-slate-455 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>

              <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <ShieldAlert className="text-rose-500 w-5 h-5 animate-pulse" />
                Error Stack Trace: {selectedError.id}
              </h3>

              <div className="space-y-4 text-xs md:text-sm">
                <div>
                  <span className="font-bold text-slate-400 block mb-1">Service & Issue</span>
                  <span className="font-semibold">{selectedError.module} • {selectedError.type}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block mb-1">Raw Error Stacktrace Output</span>
                  <pre className="text-2xs text-rose-400 leading-relaxed font-mono bg-slate-950 p-4 rounded-lg overflow-x-auto border border-rose-900/30 max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {selectedError.trace}
                  </pre>
                </div>
                <div className="flex gap-3 pt-2">
                  {selectedError.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolveError(selectedError.id)}
                      className="w-full btn-primary text-xs py-2.5 font-bold"
                    >
                      Resolve Exception Incident
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

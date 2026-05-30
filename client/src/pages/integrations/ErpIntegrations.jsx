import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Settings, Sparkles, AlertCircle, HelpCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function ErpIntegrations() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [tallySyncUrl, setTallySyncUrl] = useState('https://sync.agroerp.com/tally/odoo')
  const [syncStatus, setSyncStatus] = useState('Idle')

  const [logs] = useState([
    { id: 'l-1', type: 'Tally Prime Sync', message: 'Imported 142 new inventory ledgers', date: '2026-05-29 13:00', status: 'Success' },
    { id: 'l-2', type: 'SAP Business One', message: 'Pushed daily billing aggregates', date: '2026-05-29 12:30', status: 'Success' },
    { id: 'l-3', type: 'Odoo ERP Sync', message: 'Failed to authenticate secure client credentials', date: '2026-05-28 17:15', status: 'Failed' }
  ])

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <RefreshCw className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Third-party ERP Integrations
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium font-body">Map accounts ledger schemas, configure Tally Prime sync parameters and monitor synchronization logs</p>
        </div>
      </div>

      {/* Main Configurations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Settings Panel */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><Settings size={18} /> Credentials Setup</h3>
            <p className="text-xs text-slate-455 mt-1">Configure sync parameters</p>
          </div>

          <form className="space-y-4 flex-1 mt-4">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Sync URL Handler</label>
              <input
                type="text"
                value={tallySyncUrl}
                onChange={e => setTallySyncUrl(e.target.value)}
                className="input-field py-2.5 text-sm font-mono"
              />
            </div>

            <button type="button" className="w-full btn-primary text-xs md:text-sm py-3 font-semibold mt-4">
              Apply System Bindings
            </button>
          </form>
        </div>

        {/* Sync logs */}
        <div className={`lg:col-span-2 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm flex flex-col justify-between`}>
          <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Live Integration Logs</h3>
            <p className="text-xs text-slate-400 mt-1">Audit telemetry status of data mapping handshakes</p>
          </div>
          <div className="overflow-x-auto w-full flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-455 uppercase`}>
                  <th className="px-6 py-4">Sync Connector</th>
                  <th className="px-6 py-4">Description Outcome</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
                {logs.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                    <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150">{l.type}</td>
                    <td className="px-6 py-3.5 text-slate-655 dark:text-slate-350">{l.message}</td>
                    <td className="px-6 py-3.5 text-slate-400 font-medium">{l.date}</td>
                    <td className="px-6 py-3.5 text-right">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap inline-flex items-center justify-center ${
                        l.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
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

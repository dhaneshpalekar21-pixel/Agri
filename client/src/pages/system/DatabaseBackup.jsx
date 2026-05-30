import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, Plus, RefreshCw, Eye, Download, X, HelpCircle, FileText, CheckCircle, AlertTriangle } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function DatabaseBackup() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [backingUp, setBackingUp] = useState(false)
  const [backupResult, setBackupResult] = useState(null)
  
  const [backups, setBackups] = useState([
    { id: 'BK-501', type: 'Full DB Schema & Data', size: '1.4 GB', date: '2026-05-29 02:00', status: 'Completed' },
    { id: 'BK-502', type: 'Incremental Data Backup', size: '242 MB', date: '2026-05-28 12:00', status: 'Completed' },
    { id: 'BK-503', type: 'Full DB Schema & Data', size: '1.38 GB', date: '2026-05-22 02:00', status: 'Completed' },
    { id: 'BK-504', type: 'Incremental Data Backup', size: '198 MB', date: '2026-05-21 12:00', status: 'Completed' }
  ])

  const handleCreateBackup = () => {
    setBackingUp(true)
    setBackupResult(null)
    setTimeout(() => {
      const newBk = {
        id: `BK-${Date.now().toString().slice(-4)}`,
        type: 'Manual Data Backup',
        size: '185 MB',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'Completed'
      }
      setBackups(prev => [newBk, ...prev])
      setBackingUp(false)
      setBackupResult('Database backup binary compiled and pushed to Cloud storage successfully!')
    }, 1500)
  }

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Database className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Database Backup & Recovery
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Verify binary dumps, trigger manual snapshots, and configure automated cron backups</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleCreateBackup}
            className="btn-primary text-xs md:text-sm flex items-center gap-2 px-5 py-2.5 font-bold"
          >
            <Plus size={16} /> Trigger Manual Backup
          </button>
        </div>
      </div>

      {/* Backup Progress Info */}
      {backingUp && (
        <div className="p-4 rounded-xl border dark:border-slate-800 animate-pulse text-xs text-slate-455">
          Compiling table aggregates, compressing file payloads (SQL/tar)...
        </div>
      )}
      {backupResult && (
        <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-500 text-xs md:text-sm font-semibold flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{backupResult}</span>
        </div>
      )}

      {/* Main Configurations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Left Settings */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><Database size={18} /> Cloud Storage Settings</h3>
            <p className="text-xs text-slate-455 mt-1">AWS S3 / Google Cloud parameters</p>
          </div>

          <div className="space-y-4 flex-1 mt-4 text-xs md:text-sm">
            <div className="flex justify-between items-center pb-3 border-b dark:border-slate-800">
              <span className="font-semibold text-slate-455">Primary AWS Bucket</span>
              <span className="font-bold">s3://agroerp-backups</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b dark:border-slate-800">
              <span className="font-semibold text-slate-455">Automated Cron</span>
              <span className="font-bold text-emerald-500">Everyday at 02:00 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-455">Max Backups Retention</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">30 days cycles</span>
            </div>
          </div>
        </div>

        {/* Backups List Table */}
        <div className={`lg:col-span-2 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm flex flex-col justify-between`}>
          <div className="overflow-x-auto w-full flex-1">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-455 uppercase`}>
                  <th className="px-6 py-4">Backup Ref</th>
                  <th className="px-6 py-4">Backup Type</th>
                  <th className="px-6 py-4">File Binary Size</th>
                  <th className="px-6 py-4">Timestamp Created</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
                {backups.map(bk => (
                  <tr key={bk.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                    <td className="px-6 py-3.5 font-mono text-blue-500 font-bold">{bk.id}</td>
                    <td className="px-6 py-3.5 font-bold text-slate-700 dark:text-slate-200">{bk.type}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-500">{bk.size}</td>
                    <td className="px-6 py-3.5 text-slate-455">{bk.date}</td>
                    <td className="px-6 py-3.5">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 inline-flex items-center justify-center whitespace-nowrap">
                        {bk.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right flex justify-end gap-1 items-center">
                      <button className="p-2 text-slate-450 hover:text-emerald-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Download size={16} />
                      </button>
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

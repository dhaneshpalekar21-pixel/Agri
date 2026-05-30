import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database, RefreshCw, Clock, Download, AlertTriangle, ShieldCheck,
  CheckCircle, ArrowDown, Play, Trash2, Save, Cloud, Calendar
} from 'lucide-react'

const INITIAL_BACKUPS = [
  { id: "BAK-901", filename: "agriai_prod_db_20260528.sql", size: "245 MB", type: "Scheduled", target: "AWS S3 Cloud", time: "2026-05-28 04:00 AM", status: "Completed" },
  { id: "BAK-902", filename: "agriai_prod_db_20260527.sql", size: "242 MB", type: "Scheduled", target: "AWS S3 Cloud", time: "2026-05-27 04:00 AM", status: "Completed" },
  { id: "BAK-903", filename: "agriai_manual_prepatch.sql", size: "240 MB", type: "Manual", target: "Google Cloud Store", time: "2026-05-26 18:30 PM", status: "Completed" }
];

export default function DataBackup() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [backups, setBackups] = useState(INITIAL_BACKUPS)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [restoreTarget, setRestoreTarget] = useState(null)
  const [restoreSuccessMsg, setRestoreSuccessMsg] = useState(false)

  // Scheduling states
  const [backupFreq, setBackupFreq] = useState('Daily')
  const [backupHour, setBackupHour] = useState('04:00')

  useEffect(() => {
    setActiveItem('Security & Access', 'Data Backup')
  }, [setActiveItem])

  const handleManualBackup = () => {
    setIsBackingUp(true)
    setBackupProgress(0)

    const interval = setInterval(() => {
      setBackupProgress((old) => {
        if (old >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)
          // Add new backup
          const newBak = {
            id: `BAK-${Math.floor(Math.random() * 900) + 100}`,
            filename: `agriai_manual_${new Date().toISOString().split('T')[0].replace(/-/g,'')}.sql`,
            size: "246 MB",
            type: "Manual",
            target: "AWS S3 Cloud",
            time: new Date().toLocaleString(),
            status: "Completed"
          }
          setBackups([newBak, ...backups])
          return 100
        }
        return old + 10
      })
    }, 200)
  }

  const handleTriggerRestore = (bak) => {
    setRestoreTarget(bak)
    setShowRestoreModal(true)
  }

  const handleConfirmRestore = () => {
    setShowRestoreModal(false)
    setRestoreSuccessMsg(true)
    setTimeout(() => setRestoreSuccessMsg(false), 4000)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-855 dark:text-slate-100 flex items-center gap-2">
            Cloud Database Backup & Restore
          </h2>
          <p className="text-xs text-slate-500 font-medium">Schedule transactional snapshot archives, execute manual DB checkpoints, and manage cloud storage nodes</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleManualBackup}
            disabled={isBackingUp}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <RefreshCw size={13} className={isBackingUp ? "animate-spin" : ""} />
            <span>{isBackingUp ? `Archiving ${backupProgress}%` : "Backup Database Now"}</span>
          </button>
        </div>
      </div>

      {/* Restore success alert banner */}
      {restoreSuccessMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in flex items-center gap-2">
          <CheckCircle size={16} /> Database successfully rolled back to snapshot: {restoreTarget?.filename}
        </div>
      )}

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Cloud Sync Connection", val: "Operational", icon: Cloud, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Cloud Backup Storage", val: "1.42 GB Used", icon: Database, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Restore Checkpoint Health", val: "Healthy", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Active Cron schedule", val: "Daily @ 04:00 AM", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" }
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

      {/* Grid workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Backup files list */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-4xs font-extrabold uppercase text-slate-400">Database Snapshot Archives</span>
          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-4xs font-bold uppercase tracking-wider text-slate-400 ${theme === 'dark' ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <th className="p-3">File Snapshot ID</th>
                    <th className="p-3">Dump File Name</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Target</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                  {backups.map((bak, i) => (
                    <tr key={i} className={theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50'}>
                      <td className="p-3 font-bold text-slate-850 dark:text-slate-150">{bak.id}</td>
                      <td className="p-3 font-semibold text-slate-550 flex items-center gap-1.5">
                        <Database size={12} className="text-slate-400" />
                        <span>{bak.filename}</span>
                      </td>
                      <td className="p-3 text-slate-500 font-bold">{bak.size}</td>
                      <td className="p-3 text-slate-400 font-medium">{bak.target}</td>
                      <td className="p-3 text-slate-400 text-3xs font-semibold">{bak.time}</td>
                      <td className="p-3 text-right flex gap-1 justify-end">
                        <button
                          onClick={() => handleTriggerRestore(bak)}
                          className="px-2 py-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded text-4xs font-bold border border-amber-500/20 cursor-pointer"
                        >
                          Restore
                        </button>
                        <a
                          href="data:text/plain;charset=utf-8,sql-mock-content"
                          download={bak.filename}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-500 cursor-pointer"
                        >
                          <Download size={12} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right side: Backup Scheduling control forms */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs h-fit`}>
          <div className="flex items-center gap-1.5 border-b pb-2 dark:border-slate-850 border-slate-150">
            <Calendar className="text-emerald-500" size={16} />
            <span className="text-4xs font-extrabold uppercase text-slate-400 font-heading">Automated Cron schedule</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-4xs font-bold text-slate-400 mb-1">BACKUP FREQUENCY</label>
              <select
                value={backupFreq}
                onChange={(e) => setBackupFreq(e.target.value)}
                className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-300' : 'bg-slate-50 border-slate-250 text-slate-800'}`}
              >
                <option value="Hourly">Hourly</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-4xs font-bold text-slate-400 mb-1">EXECUTION TIME (UTC)</label>
              <input
                type="time"
                value={backupHour}
                onChange={(e) => setBackupHour(e.target.value)}
                className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-855 text-slate-200' : 'bg-slate-50 border-slate-250 text-slate-800'}`}
              />
            </div>

            <button
              onClick={() => {
                setRestoreSuccessMsg(true);
                setTimeout(() => setRestoreSuccessMsg(false), 3000);
              }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-3xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save size={12} /> Save Cron Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Restore dialog */}
      <AnimatePresence>
        {showRestoreModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-sm w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl overflow-hidden shadow-2xl p-5 text-xs text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-sm font-black">Rollback Database Snapshot?</h3>
              <p className="text-slate-400 leading-normal font-semibold">
                Warning: Rolling back to <strong>{restoreTarget?.filename}</strong> will overwrite current transactions. This action is irreversible.
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <button onClick={() => setShowRestoreModal(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Cancel</button>
                <button onClick={handleConfirmRestore} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg cursor-pointer">Confirm Rollback</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, Send, ShieldAlert, CheckCircle, RefreshCw, X,
  Clock, Flame, CloudLightning, ShieldCheck, PlayCircle, Eye
} from 'lucide-react'

const INITIAL_EMERGENCIES = [
  { title: "Severe Hailstorm Warning: Western Maharashtra", type: "Weather Emergency", severity: "Critical", status: "Active Broadcast", date: "2026-05-28 11:00 AM" },
  { title: "Server Gateway Anomaly: Database Latency Spike", type: "System Failure", severity: "High", status: "Resolved", date: "2026-05-27 15:30 PM" }
];

export default function EmergencyAlerts() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [emergencies, setEmergencies] = useState(INITIAL_EMERGENCIES)
  const [alertTitle, setAlertTitle] = useState('')
  const [alertType, setAlertType] = useState('Weather Emergency')
  const [severity, setSeverity] = useState('Critical')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    setActiveItem('Notification Center', 'Emergency Alerts')
  }, [setActiveItem])

  const handleBroadcastTrigger = () => {
    if (!alertTitle.trim()) return
    setShowConfirmModal(true)
  }

  const handleConfirmBroadcast = () => {
    const newEmergency = {
      title: alertTitle,
      type: alertType,
      severity: severity,
      status: "Active Broadcast",
      date: new Date().toLocaleString()
    }

    setEmergencies([newEmergency, ...emergencies])
    setAlertTitle('')
    setShowConfirmModal(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const getSeverityColor = (sev) => {
    if (sev === 'Critical') return 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-855 dark:text-slate-100 flex items-center gap-2">
            🚨 Emergency Broadcast Control Room
          </h2>
          <p className="text-xs text-slate-500 font-medium">Issue immediate high-priority warning bulletins, weather disaster triggers, and hardware system failure alerts</p>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg text-xs font-bold animate-fade-in flex items-center gap-2">
          <ShieldAlert size={16} className="animate-pulse" /> Critical emergency bulletin successfully broadcasted across active sessions.
        </div>
      )}

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Emergency Broadcasts", val: emergencies.filter(e=>e.status==='Active Broadcast').length, icon: Flame, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "SMS Broadcast Deliveries", val: "14,800 Dispatched", icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "System Fail-Safe Status", val: "Active", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Disaster Cell Coordinates", val: "Operational", icon: CloudLightning, color: "text-blue-500", bg: "bg-blue-500/10" }
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

      {/* Workspace splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Broadcast Form */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs h-fit`}>
          <div className="flex items-center gap-1.5 border-b pb-2 dark:border-slate-850 border-slate-150">
            <AlertTriangle className="text-rose-500 animate-pulse" size={16} />
            <span className="text-4xs font-extrabold uppercase text-slate-400 font-heading">Emergency Alert Composer</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-4xs font-bold text-slate-400 mb-1">BULLETIN CONTENT TITLE</label>
              <input
                type="text"
                placeholder="e.g. Hailstorm Advisory Pune Region"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-800 focus:border-emerald-500'} transition-all`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-4xs font-bold text-slate-400 mb-1">ALERT CLASSIFICATION</label>
                <select
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-855 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-800 focus:border-emerald-500'} transition-all`}
                >
                  <option value="Weather Emergency">Weather Emergency</option>
                  <option value="System Failure">System Failure</option>
                  <option value="Security Alert">Security Incident</option>
                </select>
              </div>

              <div>
                <label className="block text-4xs font-bold text-slate-400 mb-1">SEVERITY PRIORITY</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-855 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-800 focus:border-emerald-500'} transition-all`}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleBroadcastTrigger}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-3xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-rose-500/10"
            >
              <Send size={12} /> Broadcast Emergency Bulletin
            </button>
          </div>
        </div>

        {/* Right Side: Broadcast History table */}
        <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
          <div className="flex justify-between items-center border-b pb-2 dark:border-slate-850 border-slate-150">
            <span className="text-4xs font-extrabold uppercase text-slate-400">Emergency Dispatched Logs</span>
            <span className="text-4xs text-rose-500 font-bold uppercase tracking-wider">Active feeds</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b text-4xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-3">Emergency Title</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                {emergencies.map((e, i) => (
                  <tr key={i} className={theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50'}>
                    <td className="p-3 font-bold text-rose-550 dark:text-rose-400">{e.title}</td>
                    <td className="p-3 text-slate-500 font-semibold">{e.type}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-4xs font-extrabold border uppercase ${getSeverityColor(e.severity)}`}>
                        {e.severity}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 text-3xs font-semibold">{e.date}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-4xs font-extrabold ${e.status === 'Active Broadcast' ? 'text-rose-500 bg-rose-500/10 animate-pulse' : 'text-slate-500 bg-slate-500/10'}`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Broadcast confirmation dialog */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-sm w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl overflow-hidden shadow-2xl p-5 text-xs text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} className="animate-bounce" />
              </div>
              <h3 className="text-sm font-black text-rose-500">Confirm Emergency Broadcast?</h3>
              <p className="text-slate-400 leading-normal font-semibold">
                Warning: This will dispatch real-time emergency banners to all active user portals, send SMS alerts to selected regions, and alert emergency cells.
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Cancel</button>
                <button onClick={handleConfirmBroadcast} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg cursor-pointer">Confirm Broadcast</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

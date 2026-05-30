import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Send, Megaphone, Users, Calendar, Sparkles, CheckCircle, Clock } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function SchemeNotifications() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [composerMessage, setComposerMessage] = useState('')
  const [targetAudience, setTargetAudience] = useState('All registered')
  const [scheduleTime, setScheduleTime] = useState('')

  const [history] = useState([
    { id: 'not-h-1', title: 'PM Kisan installment Released', audience: 'All active holdings', date: '2026-05-28', status: 'Sent' },
    { id: 'not-h-2', title: 'Deadline warning PMFBY Insurance', audience: 'Cotton & Wheat growers', date: '2026-05-24', status: 'Sent' },
    { id: 'not-h-3', title: 'Gujarat Pump scheme launch alert', audience: 'Gujarat regional users', date: '2026-05-18', status: 'Sent' }
  ])

  const handleSendNotification = (e) => {
    e.preventDefault()
    alert('Alert registered in broadcast pipeline successfully!')
    setComposerMessage('')
  }

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Bell className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Scheme Communication Hub
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Broadcast new program alerts, target regional farmers and trace SMS/Whatsapp deliveries</p>
        </div>
      </div>

      {/* Grid: Composer & Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Left: Notification Composer Form */}
        <div className={`lg:col-span-2 rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">Notification Broadcast Composer</h3>
            <p className="text-xs text-slate-400">Push SMS, Push or Email alerts to registered agribusinesses</p>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4 flex-1 mt-4">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Target Audience Segment</label>
              <select
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                className="input-field py-2.5 text-sm"
              >
                <option value="All registered">All Registered Farmers</option>
                <option value="Only Maharashtra">Only Maharashtra Regional</option>
                <option value="Cotton growers">Cotton & Cash Crops Growers</option>
                <option value="Irrigation subsidy seekers">Micro Irrigation Enrollees</option>
              </select>
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Broadcast message payload</label>
              <textarea
                rows={4}
                required
                value={composerMessage}
                onChange={e => setComposerMessage(e.target.value)}
                className="input-field py-2.5 text-sm"
                placeholder="Write notification text or copy template guidelines..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Schedule Release Date</label>
                <input
                  type="date"
                  value={scheduleTime}
                  onChange={e => setScheduleTime(e.target.value)}
                  className="input-field py-2.5 text-sm"
                />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full btn-primary text-xs md:text-sm py-3 font-semibold flex items-center justify-center gap-2">
                  <Send size={16} /> Broadcast Dispatch Pipeline
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right: Quick templates lists */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Sparkles className="text-amber-500" size={18} /> Scheme Templates
            </h3>
            <p className="text-xs text-slate-400 mt-1">Pre-approved compliance guidelines alerts</p>
          </div>

          <div className="space-y-4 flex-1 mt-4">
            <div
              onClick={() => setComposerMessage('ATTENTION: PM Kisan installment verification guidelines have been updated. Submit your Aadhaar credentials before next week to avoid delays.')}
              className="p-3.5 border dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <span>PM Kisan Aadhaar Alert Template</span>
            </div>

            <div
              onClick={() => setComposerMessage('ALARM: The application window for Maharashtra Equipment Subsidy will close in 5 days. Ensure land extracts are uploaded.')}
              className="p-3.5 border dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <span>MahaDBT Machinery Deadline Template</span>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
        <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Notification Broadcast History</h3>
            <p className="text-xs text-slate-400 mt-1">Audit log of system communication feeds</p>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-455 uppercase`}>
                <th className="px-6 py-4 min-w-[250px]">Alert Description Title</th>
                <th className="px-6 py-4 min-w-[180px]">Target Audience</th>
                <th className="px-6 py-4 min-w-[140px]">Dispatch Date</th>
                <th className="px-6 py-4 min-w-[120px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {history.map(h => (
                <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                  <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150 truncate">{h.title}</td>
                  <td className="px-6 py-3.5 text-slate-455 font-semibold">{h.audience}</td>
                  <td className="px-6 py-3.5 text-slate-400 font-medium">{h.date}</td>
                  <td className="px-6 py-3.5">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 inline-flex items-center justify-center whitespace-nowrap">
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

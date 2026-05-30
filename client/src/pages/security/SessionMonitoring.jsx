import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  Clock, ShieldAlert, CheckCircle, Search, Trash2,
  RefreshCw, Power, AlertTriangle, Eye, X, Sliders
} from 'lucide-react'

const INITIAL_SESSIONS = [
  { id: "SESS-801", username: "Ramesh Patil", role: "Super Admin", ip: "192.168.1.45", duration: "1h 12m", lastActivity: "Just now", status: "Active" },
  { id: "SESS-802", username: "Amit Shinde", role: "Hub Manager", ip: "103.45.22.10", duration: "45m", lastActivity: "2 mins ago", status: "Active" },
  { id: "SESS-803", username: "Sunita Pawar", role: "Accountant", ip: "103.45.22.15", duration: "2h 30m", lastActivity: "18 mins ago", status: "Idle (15m+)" }
];

export default function SessionMonitoring() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [sessions, setSessions] = useState(INITIAL_SESSIONS)
  const [sessionTimeout, setSessionTimeout] = useState(30) // mins
  const [search, setSearch] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    setActiveItem('Security & Access', 'Session Monitoring')
  }, [setActiveItem])

  const handleForcedLogout = (id) => {
    setSessions(sessions.map(s => {
      if (s.id === id) {
        return { ...s, status: 'Logged Out (Forced)' }
      }
      return s
    }))
  }

  const handleSaveTimeout = (e) => {
    e.preventDefault()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const filteredSessions = sessions.filter(s => 
    s.username.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.status.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-855 dark:text-slate-100 flex items-center gap-2">
            ⏱️ Active User Session Monitor
          </h2>
          <p className="text-xs text-slate-500 font-medium">Observe live user socket lines, idle times, force logouts, and configure session lease times</p>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          System session timeout lease set to {sessionTimeout} minutes.
        </div>
      )}

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Live Sessions", val: sessions.filter(s=>s.status==='Active').length, icon: Power, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Idle Sessions Logged", val: sessions.filter(s=>s.status.includes('Idle')).length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Timeout Lease Limit", val: sessionTimeout + " Minutes", icon: Sliders, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Forced Terminations", val: sessions.filter(s=>s.status.includes('Forced')).length, icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10" }
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

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle: Live Sessions list */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex items-center justify-between`}>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search active users, roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full text-xs pl-9 pr-4 py-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-850 focus:border-emerald-500'} transition-all`}
              />
            </div>
          </div>

          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-4xs font-bold uppercase tracking-wider text-slate-400 ${theme === 'dark' ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <th className="p-3">Session ID</th>
                    <th className="p-3">Username</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Session Lease</th>
                    <th className="p-3">Last Active</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                  {filteredSessions.map((s, i) => (
                    <tr key={i} className={theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50'}>
                      <td className="p-3 font-bold text-slate-850 dark:text-slate-150">{s.id}</td>
                      <td className="p-3 font-medium">{s.username}</td>
                      <td className="p-3 text-slate-500 font-semibold">{s.role}</td>
                      <td className="p-3 font-bold text-slate-700 dark:text-slate-300">{s.ip}</td>
                      <td className="p-3 text-slate-400 font-semibold">{s.duration}</td>
                      <td className="p-3 text-slate-400 text-3xs font-semibold">{s.lastActivity}</td>
                      <td className="p-3 text-right">
                        {s.status !== 'Logged Out (Forced)' ? (
                          <button
                            onClick={() => handleForcedLogout(s.id)}
                            className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-4xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Power size={10} /> Logout
                          </button>
                        ) : (
                          <span className="text-4xs text-slate-400 font-extrabold uppercase">Terminated</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Lease settings config form */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs h-fit`}>
          <div className="flex items-center gap-1.5 border-b pb-2 dark:border-slate-850 border-slate-150">
            <Sliders className="text-emerald-500" size={16} />
            <span className="text-4xs font-extrabold uppercase text-slate-400 font-heading">Session Lease settings</span>
          </div>

          <form onSubmit={handleSaveTimeout} className="space-y-4">
            <div>
              <label className="block text-4xs font-bold text-slate-400 mb-1">MAX IDLE LEASE TIMEOUT (MINUTES)</label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
              />
            </div>
            
            <p className="text-4xs text-slate-400 leading-normal font-semibold">
              Users idle for longer than {sessionTimeout} minutes will be automatically logged out from active dashboards.
            </p>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-3xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Update Timeout Lease
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

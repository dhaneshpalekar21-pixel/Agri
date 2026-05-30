import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  ShieldAlert, ShieldCheck, Lock, Globe, AlertTriangle,
  RefreshCw, CheckSquare, Search, Trash2, Key, ToggleLeft, ToggleRight
} from 'lucide-react'

const RECENT_ATTEMPTS = [
  { user: 'Sanjay Deshmukh', ip: '192.168.1.45', status: 'Success', device: 'Chrome on Win10', time: '2026-05-28 10:45 AM' },
  { user: 'Amit Shinde', ip: '103.45.22.10', status: 'Failed Attempt', device: 'Safari on iPhone', time: '2026-05-28 10:30 AM' },
  { user: 'Unknown Root', ip: '185.220.101.4', status: 'Blocked (Geo IP)', device: 'Curl Client', time: '2026-05-28 09:12 AM' }
];

export default function LoginSecurity() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [attempts, setAttempts] = useState(RECENT_ATTEMPTS)
  const [passwordMinLength, setPasswordMinLength] = useState(8)
  const [requireSpecialChar, setRequireSpecialChar] = useState(true)
  const [ipRestrictedValue, setIpRestrictedValue] = useState('192.168.*.*')
  const [twoFactorRequired, setTwoFactorRequired] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    setActiveItem('Security & Access', 'Login Security')
  }, [setActiveItem])

  const handleSaveSecurity = (e) => {
    e.preventDefault()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-855 dark:text-slate-100 flex items-center gap-2">
            Login Security & Lockout Console
          </h2>
          <p className="text-xs text-slate-500 font-medium">Configure session passwords complexity, failed attempts lockouts thresholds, IP ranges blocklists, and 2FA rules</p>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          System login security policies updated successfully.
        </div>
      )}

      {/* KPI summaries */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Successful Logins Today", val: "142 Sessions", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Failed Attempts Today", val: "14 Logs", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Blocked IP Count", val: "3 Active IPs", icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "Two-Factor Auth Enforcement", val: "Enforced", icon: Lock, color: "text-blue-500", bg: "bg-blue-500/10" }
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

      {/* Forms and attempts list split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Password Complexity & Policy Config Form */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}>
          <div className="flex items-center gap-1.5 border-b pb-2 dark:border-slate-850 border-slate-150">
            <Lock className="text-emerald-500" size={16} />
            <span className="text-4xs font-extrabold uppercase text-slate-400 font-heading">Authentication Policies</span>
          </div>

          <form onSubmit={handleSaveSecurity} className="space-y-4">
            <div>
              <label className="block text-4xs font-bold text-slate-400 mb-1">PASSWORD MINIMUM LENGTH</label>
              <input
                type="number"
                value={passwordMinLength}
                onChange={(e) => setPasswordMinLength(parseInt(e.target.value))}
                className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
              />
            </div>

            <div>
              <label className="block text-4xs font-bold text-slate-400 mb-1">WHITELISTED IP SUBNET RANGE</label>
              <input
                type="text"
                value={ipRestrictedValue}
                onChange={(e) => setIpRestrictedValue(e.target.value)}
                className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
              />
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="font-bold text-3xs text-slate-400 uppercase">REQUIRE SPECIAL CHARACTERS</span>
              <button
                type="button"
                onClick={() => setRequireSpecialChar(!requireSpecialChar)}
                className={`p-1.5 rounded-lg border ${theme === 'dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                {requireSpecialChar ? <ToggleRight className="text-emerald-500" size={24} /> : <ToggleLeft className="text-slate-400" size={24} />}
              </button>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="font-bold text-3xs text-slate-400 uppercase">FORCE TWO-FACTOR AUTH (2FA)</span>
              <button
                type="button"
                onClick={() => setTwoFactorRequired(!twoFactorRequired)}
                className={`p-1.5 rounded-lg border ${theme === 'dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                {twoFactorRequired ? <ToggleRight className="text-emerald-500" size={24} /> : <ToggleLeft className="text-slate-400" size={24} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-3xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              Deploy Security Rules
            </button>
          </form>
        </div>

        {/* Right Side: Attempt logs */}
        <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
          <div className="flex justify-between items-center border-b pb-2 dark:border-slate-850 border-slate-150">
            <span className="text-4xs font-extrabold uppercase text-slate-400">Recent Login Session Logs</span>
            <span className="text-4xs text-emerald-500 font-bold uppercase tracking-wider">Real-time attempts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b text-4xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-3">User Target</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Device Client</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                {attempts.map((a, i) => (
                  <tr key={i} className={theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50'}>
                    <td className="p-3 font-bold">{a.user}</td>
                    <td className="p-3 text-slate-500 font-semibold">{a.ip}</td>
                    <td className="p-3 text-slate-400 font-medium">{a.device}</td>
                    <td className="p-3 text-slate-400 text-3xs font-semibold">{a.time}</td>
                    <td className="p-3 text-right">
                      <span className={`px-1.5 py-0.5 rounded text-4xs font-extrabold ${a.status === 'Success' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                        {a.status}
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

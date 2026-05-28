import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  MessageSquare, Send, CheckCircle, Clock, AlertTriangle,
  Search, Sliders, Save, Database, Trash2
} from 'lucide-react'

const INITIAL_LOGS = [
  { phone: "+91-9842104921", msg: "Your OTP verification code is 492104. Confidentially valid for 120 seconds.", type: "OTP SMS", status: "Delivered", time: "2026-05-28 11:45" },
  { phone: "+91-8832104320", msg: "Alert: Commission invoice #INV-4921 generated. Due date is next Monday.", type: "Transactional", status: "Delivered", time: "2026-05-28 10:15" },
  { phone: "+91-7210984321", msg: "Promotion: Get 15% discount on NPK Boost fertilizers this week! Code: FLASH15", type: "Promotional", status: "Failed (No Signal)", time: "2026-05-28 09:30" }
];

export default function SmsAlerts() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [logs, setLogs] = useState(INITIAL_LOGS)
  const [typedMessage, setTypedMessage] = useState('')
  const [phoneTarget, setPhoneTarget] = useState('')
  const [smsType, setSmsType] = useState('Transactional')
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    setActiveItem('Notification Center', 'SMS Alerts')
  }, [setActiveItem])

  const handleSendSMS = (e) => {
    e.preventDefault()
    if (!phoneTarget.trim() || !typedMessage.trim()) return

    const newLog = {
      phone: phoneTarget,
      msg: typedMessage,
      type: smsType,
      status: "Delivered",
      time: new Date().toLocaleString()
    }

    setLogs([newLog, ...logs])
    setPhoneTarget('')
    setTypedMessage('')
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-855 dark:text-slate-100 flex items-center gap-2">
            💬 Voice & Bulk SMS dispatch console
          </h2>
          <p className="text-xs text-slate-500 font-medium">Verify outgoing transactional logs, SMS quotas remaining, provider integration APIs, and deliverability stats</p>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          SMS message successfully queued for network dispatch.
        </div>
      )}

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "SMS Dispatched Today", val: "12,450 Messages", icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Transactional SMS Logs", val: logs.filter(l=>l.type==='Transactional').length + " Active", icon: Database, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Delivery Success Index", val: "97.4%", icon: CheckCircle, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Failed SMS Queues", val: logs.filter(l=>l.status.includes('Failed')).length + " Incidents", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" }
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
        {/* Left Side: SMS Composer Form */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs h-fit`}>
          <div className="flex items-center gap-1.5 border-b pb-2 dark:border-slate-850 border-slate-150">
            <Sliders className="text-emerald-500" size={16} />
            <span className="text-4xs font-extrabold uppercase text-slate-400 font-heading">SMS Dispatcher Composer</span>
          </div>

          <form onSubmit={handleSendSMS} className="space-y-4">
            <div>
              <label className="block text-4xs font-bold text-slate-400 mb-1">PHONE NUMBER (WITH COUNTRY CODE)</label>
              <input
                type="text"
                placeholder="e.g. +91-9842104921"
                value={phoneTarget}
                onChange={(e) => setPhoneTarget(e.target.value)}
                className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-800 focus:border-emerald-500'} transition-all`}
              />
            </div>

            <div>
              <label className="block text-4xs font-bold text-slate-400 mb-1">SMS POLICY CLASS</label>
              <select
                value={smsType}
                onChange={(e) => setSmsType(e.target.value)}
                className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-855 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-800 focus:border-emerald-500'} transition-all`}
              >
                <option value="Transactional">Transactional</option>
                <option value="Promotional">Promotional</option>
                <option value="OTP SMS">OTP Verification</option>
              </select>
            </div>

            <div>
              <label className="block text-4xs font-bold text-slate-455 mb-1 font-heading">MESSAGE TEXT</label>
              <textarea
                placeholder="Type SMS text body (max 160 characters)..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                rows="3"
                className={`w-full p-2.5 rounded-lg border outline-none resize-none ${theme === 'dark' ? 'bg-slate-955 border-slate-800 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-200 focus:border-emerald-500'} transition-all`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-3xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send size={12} /> Dispatch SMS
            </button>
          </form>
        </div>

        {/* Right Side: Active SMS dispatch history table */}
        <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
          <div className="flex justify-between items-center border-b pb-2 dark:border-slate-850 border-slate-150">
            <span className="text-4xs font-extrabold uppercase text-slate-400">SMS Transmission Logs</span>
            <span className="text-4xs text-emerald-500 font-bold uppercase tracking-wider">Gateway status logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b text-4xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-3">Phone Line</th>
                  <th className="p-3">SMS Text Content</th>
                  <th className="p-3">SMS Type</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                {logs.map((log, i) => (
                  <tr key={i} className={theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50'}>
                    <td className="p-3 font-bold">{log.phone}</td>
                    <td className="p-3 text-slate-500 font-semibold max-w-[200px] truncate">{log.msg}</td>
                    <td className="p-3 text-slate-450 font-bold">{log.type}</td>
                    <td className="p-3 text-slate-400 text-3xs font-semibold">{log.time}</td>
                    <td className="p-3 text-right">
                      <span className={`px-1.5 py-0.5 rounded text-4xs font-extrabold ${log.status === 'Delivered' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10 animate-pulse'}`}>
                        {log.status}
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

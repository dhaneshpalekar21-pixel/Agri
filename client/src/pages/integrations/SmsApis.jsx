import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, CheckCircle, HelpCircle, Activity, Settings, AlertTriangle } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function SmsApis() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [provider, setProvider] = useState('Twilio')
  const [twilioSid, setTwilioSid] = useState('AC7b89f2a4cd39e4e6')
  const [twilioToken, setTwilioToken] = useState('token_live_39fkd82')
  
  const [usage] = useState({
    sent: 14205,
    delivered: 13980,
    failed: 225,
    successRate: '98.4%'
  })

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <MessageSquare className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            SMS Gateways Configurations
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Verify SMS provider sid parameters, check remaining credit quotas and verify template rules</p>
        </div>
      </div>

      {/* KPI Stats widgets (Equal Sizing) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Sent SMS Quota</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">{usage.sent.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-semibold">This Month</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Delivered Messages</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-emerald-500">{usage.delivered.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-semibold">Success</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Failed / Delayed</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-rose-500">{usage.failed}</span>
            <span className="text-xs text-slate-400 font-semibold">Trace Logs</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">API Delivery Success</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-emerald-500">{usage.successRate}</span>
            <span className="text-xs text-slate-400 font-semibold">SLA Match</span>
          </div>
        </div>
      </div>

      {/* Main Configurations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Left Settings */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><Settings size={18} /> Credentials Setup</h3>
            <p className="text-xs text-slate-455 mt-1">Configure active SMS gateway providers</p>
          </div>

          <form className="space-y-4 flex-1 mt-4">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Provider Gateway</label>
              <select
                value={provider}
                onChange={e => setProvider(e.target.value)}
                className="input-field py-2.5 text-sm"
              >
                <option value="Twilio">Twilio Gateway (Global)</option>
                <option value="MSG91">MSG91 India Gateway</option>
                <option value="Plivo">Plivo Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Account SID / API Key</label>
              <input
                type="text"
                value={twilioSid}
                onChange={e => setTwilioSid(e.target.value)}
                className="input-field py-2.5 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Auth Token / Secret</label>
              <input
                type="password"
                value={twilioToken}
                onChange={e => setTwilioToken(e.target.value)}
                className="input-field py-2.5 text-sm font-mono"
              />
            </div>

            <button type="button" className="w-full btn-primary text-xs md:text-sm py-3 font-semibold mt-4">
              Apply Provider Config
            </button>
          </form>
        </div>

        {/* Right Templates manager */}
        <div className={`lg:col-span-2 rounded-xl border p-6 md:p-8 space-y-6 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">SMS Verification Templates</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium font-body">Manage template registration patterns according to national regulatory requirements (e.g. DLT in India)</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border dark:border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">DLT Template ID: 12015939201</span>
                <span className="px-2.5 py-0.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 rounded-full whitespace-nowrap">Approved</span>
              </div>
              <p className="text-xs text-slate-455 font-mono leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-lg border dark:border-slate-800">
                Your AgriAI OTP is {"{#var#}"}. Do not share this with anyone. Valid for 5 minutes.
              </p>
            </div>

            <div className="p-4 border dark:border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">DLT Template ID: 12015939502</span>
                <span className="px-2.5 py-0.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 rounded-full whitespace-nowrap">Approved</span>
              </div>
              <p className="text-xs text-slate-455 font-mono leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-lg border dark:border-slate-800">
                Dear {"{#var#}"}, your subsidy payout of Rs. {"{#var#}"} has been successfully processed under reference {"{#var#}"}.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

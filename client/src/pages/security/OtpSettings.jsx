import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  MessageSquare, Mail, ShieldAlert, Key, Clock,
  RefreshCw, CheckCircle, Sliders, ToggleLeft, ToggleRight, Save
} from 'lucide-react'

export default function OtpSettings() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [expirySecs, setExpirySecs] = useState(120)
  const [retryMax, setRetryMax] = useState(3)
  const [smsGateway, setSmsGateway] = useState('Twilio API Pro')
  const [emailGateway, setEmailGateway] = useState('Sendgrid Transactional')
  const [smsActive, setSmsActive] = useState(true)
  const [emailActive, setEmailActive] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    setActiveItem('Security & Access', 'OTP Settings')
  }, [setActiveItem])

  const handleSaveSettings = (e) => {
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
            🔑 OTP Delivery & Gateway settings
          </h2>
          <p className="text-xs text-slate-500 font-medium">Verify OTP expiration limits, SMS provider settings, template designs, and retry thresholds</p>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          OTP Gateways and configuration templates saved successfully.
        </div>
      )}

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "SMS Gateway Status", val: smsActive ? "Operational" : "Offline", icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Email Gateway Status", val: emailActive ? "Operational" : "Offline", icon: Mail, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "OTP Verification Rate", val: "98.2%", icon: CheckCircle, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "OTP Failures (Fail Safe)", val: "0.2%", icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10" }
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Parameters form */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}>
          <div className="flex items-center gap-1.5 border-b pb-2 dark:border-slate-850 border-slate-150">
            <Sliders className="text-emerald-500" size={16} />
            <span className="text-4xs font-extrabold uppercase text-slate-400 font-heading">OTP Delivery parameters</span>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-4xs font-bold text-slate-400 mb-1">EXPIRY TIME (SECONDS)</label>
                <input
                  type="number"
                  value={expirySecs}
                  onChange={(e) => setExpirySecs(parseInt(e.target.value))}
                  className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>
              <div>
                <label className="block text-4xs font-bold text-slate-400 mb-1">RETRY LIMIT (ATTEMPTS)</label>
                <input
                  type="number"
                  value={retryMax}
                  onChange={(e) => setRetryMax(parseInt(e.target.value))}
                  className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-4xs font-bold text-slate-400 mb-1">SMS API CUSTOM GATEWAY</label>
                <input
                  type="text"
                  value={smsGateway}
                  onChange={(e) => setSmsGateway(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>
              <div>
                <label className="block text-4xs font-bold text-slate-400 mb-1">EMAIL SMTP API GATEWAY</label>
                <input
                  type="text"
                  value={emailGateway}
                  onChange={(e) => setEmailGateway(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="font-bold text-3xs text-slate-400 uppercase">ENABLE MOBILE SMS DELIVERY</span>
              <button
                type="button"
                onClick={() => setSmsActive(!smsActive)}
                className={`p-1.5 rounded-lg border ${theme === 'dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                {smsActive ? <ToggleRight className="text-emerald-500" size={24} /> : <ToggleLeft className="text-slate-400" size={24} />}
              </button>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="font-bold text-3xs text-slate-400 uppercase">ENABLE EMAIL INBOX DELIVERY</span>
              <button
                type="button"
                onClick={() => setEmailActive(!emailActive)}
                className={`p-1.5 rounded-lg border ${theme === 'dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                {emailActive ? <ToggleRight className="text-emerald-500" size={24} /> : <ToggleLeft className="text-slate-400" size={24} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-3xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              Update OTP Gateways
            </button>
          </form>
        </div>

        {/* Right Side: Message template previews */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}>
          <div className="flex items-center gap-1.5 border-b pb-2 dark:border-slate-850 border-slate-150">
            <Key className="text-emerald-500" size={16} />
            <span className="text-4xs font-extrabold uppercase text-slate-400 font-heading">OTP SMS Template</span>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 border-slate-200 space-y-2">
            <div className="text-4xs font-bold text-slate-400">PREVIEW CONTENT</div>
            <p className="font-mono text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
              "[AgriAI ERP] Your verification code is 492104. This code is confidential and expires in {expirySecs} seconds. Do not share this OTP."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

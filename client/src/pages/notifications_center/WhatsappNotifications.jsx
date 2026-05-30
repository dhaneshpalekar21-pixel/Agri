import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  MessageSquare, Send, CheckCircle, RefreshCw, Eye,
  Search, Sliders, Save, Database, Trash2, CheckCheck
} from 'lucide-react'

const INITIAL_BROADCASTS = [
  { templateName: 'subsidy_approved_notification', audience: 'Eligible Cotton Farmers', readRate: '94.2%', status: 'Sent', date: '2026-05-28' },
  { templateName: 'payment_reminder_alert', audience: 'Overdue Udhari Customers', readRate: '88.5%', status: 'Sent', date: '2026-05-27' },
  { templateName: 'new_seed_catalog_promotion', audience: 'All Registered Vendors', readRate: '--', status: 'Scheduled', date: '2026-05-30' }
];

export default function WhatsappNotifications() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [broadcasts, setBroadcasts] = useState(INITIAL_BROADCASTS)
  const [templateName, setTemplateName] = useState('subsidy_approved_notification')
  const [audienceGroup, setAudienceGroup] = useState('Eligible Cotton Farmers')
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    setActiveItem('Notification Center', 'WhatsApp Notifications')
  }, [setActiveItem])

  const handleTriggerBroadcast = (e) => {
    e.preventDefault()
    const newBroadcast = {
      templateName,
      audience: audienceGroup,
      readRate: "0.0%",
      status: "Sent",
      date: new Date().toISOString().split('T')[0]
    }

    setBroadcasts([newBroadcast, ...broadcasts])
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-855 dark:text-slate-100 flex items-center gap-2">
            WhatsApp Business Broadcast Console
          </h2>
          <p className="text-xs text-slate-500 font-medium">Manage Meta-approved message templates, broadcast triggers, read receipts tracker, and WhatsApp business API loads</p>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          WhatsApp campaign broadcast successfully triggered via API.
        </div>
      )}

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "WhatsApp Broadcasts Sent", val: broadcasts.length, icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "API Message Delivery Rate", val: "99.4%", icon: CheckCircle, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Read Receipt Ratio", val: "91.8% Read", icon: CheckCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "API Cost (Monthly Quota)", val: "₹1,450.20", icon: Database, color: "text-blue-500", bg: "bg-blue-500/10" }
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
            <Sliders className="text-emerald-500" size={16} />
            <span className="text-4xs font-extrabold uppercase text-slate-400 font-heading">Trigger API Broadcast</span>
          </div>

          <form onSubmit={handleTriggerBroadcast} className="space-y-4">
            <div>
              <label className="block text-4xs font-bold text-slate-400 mb-1">SELECT APPROVED METADATA TEMPLATE</label>
              <select
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-800 focus:border-emerald-500'} transition-all`}
              >
                <option value="subsidy_approved_notification">subsidy_approved_notification</option>
                <option value="payment_reminder_alert">payment_reminder_alert</option>
                <option value="new_seed_catalog_promotion">new_seed_catalog_promotion</option>
              </select>
            </div>

            <div>
              <label className="block text-4xs font-bold text-slate-400 mb-1">AUDIENCE PROFILE TARGET</label>
              <select
                value={audienceGroup}
                onChange={(e) => setAudienceGroup(e.target.value)}
                className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-855 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-800 focus:border-emerald-500'} transition-all`}
              >
                <option value="Eligible Cotton Farmers">Eligible Cotton Farmers</option>
                <option value="Overdue Udhari Customers">Overdue Udhari Customers</option>
                <option value="All Registered Vendors">All Registered Vendors</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-3xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send size={12} /> Trigger Broadcast API
            </button>
          </form>
        </div>

        {/* Right Side: Mock Message View */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs h-fit`}>
          <span className="text-4xs font-extrabold uppercase text-slate-400 flex items-center gap-1"><Eye size={11} /> WhatsApp Business Chat Preview</span>
          
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950 border dark:border-slate-850 border-slate-200 max-w-[280px] mx-auto space-y-2 font-sans relative">
            <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/20 text-slate-850 dark:text-slate-200 border dark:border-emerald-500/10 space-y-1">
              <span className="text-4xs font-bold text-emerald-500 block uppercase">Template: {templateName}</span>
              <p className="text-3xs leading-relaxed font-semibold">
                {templateName === 'subsidy_approved_notification' ? "Hello! Your government subsidy claim for crop sowing has been approved. Funds disbursed to registered bank account." :
                 templateName === 'payment_reminder_alert' ? "Alert: Overdue outstanding payment of ₹12,500 detected on your Udhari ledger. Please clear before deadline." :
                 "New seed booster catalog successfully listed by premium vendors! Open catalog to place order."}
              </p>
              <div className="text-right text-4xs text-slate-400 mt-1 flex justify-end items-center gap-0.5">
                <span>11:45 AM</span>
                <CheckCheck size={10} className="text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

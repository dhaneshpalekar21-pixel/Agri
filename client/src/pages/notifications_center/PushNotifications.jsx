import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Search, Filter, Send, Calendar, RefreshCw, X, CheckCircle,
  TrendingUp, Users, MessageSquare, AlertCircle, ArrowUpRight, Megaphone
} from 'lucide-react'

const INITIAL_NOTIFICATIONS = [
  { title: "Kharif Fertilizer Subsidy Scheme", audience: "All Farmers", sentDate: "2026-05-28", status: "Sent", clickRate: "18.4%", campaignStatus: "Active" },
  { title: "Special Seed Discount Offer", audience: "Seeds Tier-1 Vendors", sentDate: "2026-05-27", status: "Sent", clickRate: "24.2%", campaignStatus: "Completed" },
  { title: "Upcoming Monsoon Advisory Alert", audience: "Pune Region Farmers", sentDate: "2026-05-29", status: "Scheduled", clickRate: "--", campaignStatus: "Scheduled" }
];

export default function PushNotifications() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState('All Farmers')
  const [campaignStatus, setCampaignStatus] = useState('Active')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    setActiveItem('Notification Center', 'Push Notifications')
  }, [setActiveItem])

  const handleComposePush = (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return

    const newPush = {
      title,
      audience,
      sentDate: new Date().toISOString().split('T')[0],
      status: "Sent",
      clickRate: "0.0%",
      campaignStatus: "Active"
    }

    setNotifications([newPush, ...notifications])
    setTitle('')
    setBody('')
    setShowAddForm(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Push Campaign Notification Center
        </h2>
        <p className="text-xs text-slate-500 font-medium">Compose push alerts, target segment client groups, schedule dispatch triggers, and check click-through rates</p>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          Push notification successfully broadcasted to active devices.
        </div>
      )}

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Push Campaigns", val: notifications.length, icon: Megaphone, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Total Devices Reached", val: "14,820 Devices", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Avg Click-Through Rate", val: "19.8%", icon: TrendingUp, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Active Push Deliveries", val: "99.8%", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" }
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
        {/* Left Side: Campaigns table */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex items-center justify-between gap-2`}>
            <span className="text-4xs font-extrabold uppercase text-slate-400">Push Delivery History</span>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Megaphone size={12} /> Compose Push Alert
            </button>
          </div>

          {/* Add Push form drawer inside page */}
          <AnimatePresence>
            {showAddForm && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleComposePush}
                className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-4xs font-bold text-slate-450 mb-1">CAMPAIGN TITLE</label>
                    <input
                      type="text"
                      placeholder="e.g. Subsidy Claim Warning"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-800 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-200 focus:border-emerald-500'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-bold text-slate-450 mb-1">TARGET AUDIENCE</label>
                    <select
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-800 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-200 focus:border-emerald-500'}`}
                    >
                      <option value="All Farmers">All Farmers</option>
                      <option value="Seeds Tier-1 Vendors">Seeds Tier-1 Vendors</option>
                      <option value="Pune Region Farmers">Pune Region Farmers</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-4xs font-bold text-slate-455 mb-1 font-heading">ALERT TEXT (BODY)</label>
                  <textarea
                    placeholder="Enter short text description (max 150 characters)..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows="2"
                    className={`w-full p-2.5 rounded-lg border outline-none resize-none ${theme === 'dark' ? 'bg-slate-955 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1.5 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer">Broadcast Alert</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-4xs font-bold uppercase tracking-wider text-slate-400 ${theme === 'dark' ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <th className="p-3">Campaign Title</th>
                    <th className="p-3">Audience Segment</th>
                    <th className="p-3">Date Dispatched</th>
                    <th className="p-3">Delivery Status</th>
                    <th className="p-3">Click Rate (CTR)</th>
                    <th className="p-3 text-right">Campaign Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                  {notifications.map((n, i) => (
                    <tr key={i} className={theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50'}>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{n.title}</td>
                      <td className="p-3 text-slate-500 font-semibold">{n.audience}</td>
                      <td className="p-3 text-slate-400 font-medium">{n.sentDate}</td>
                      <td className="p-3 font-medium text-slate-400">{n.status}</td>
                      <td className="p-3 text-emerald-500 font-bold">{n.clickRate}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-4xs font-extrabold ${n.campaignStatus === 'Active' ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 bg-slate-500/10'}`}>
                          {n.campaignStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Push Notification mockup screen */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs h-fit`}>
          <span className="text-4xs font-extrabold uppercase text-slate-400 flex items-center gap-1"><Bell size={11} /> Mobile Device Mockup Preview</span>
          
          <div className="p-4 rounded-xl bg-slate-950 text-white max-w-[280px] mx-auto border border-slate-850 shadow-xl space-y-3 font-sans relative">
            <div className="w-16 h-1.5 bg-slate-800 rounded-full mx-auto" />
            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
              <div className="flex justify-between text-4xs text-slate-300">
                <span className="font-bold flex items-center gap-0.5">AgriAI ERP</span>
                <span>now</span>
              </div>
              <h5 className="font-bold text-2xs truncate">{title || "Monsoon Advisory Alert"}</h5>
              <p className="text-3xs text-slate-300 leading-normal">{body || "Monsoon showers expected in Pune Division next 24 hours. Farmers recommend postponing sowing operations."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

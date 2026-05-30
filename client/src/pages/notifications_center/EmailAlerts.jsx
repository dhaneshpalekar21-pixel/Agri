import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  Mail, Send, CheckCircle, AlertTriangle, RefreshCw,
  Search, Sliders, Save, Database, Trash2, Eye
} from 'lucide-react'

const INITIAL_CAMPAIGNS = [
  { subject: "Monthly Crop Health Newsletter - May 2026", segment: "All Subscribed Farmers", openRate: "42.5%", clickRate: "12.8%", status: "Sent", date: "2026-05-25" },
  { subject: "Alert: Updates on Pesticides Subsidies Policies", segment: "All Registered Vendors", openRate: "58.2%", clickRate: "28.4%", status: "Sent", date: "2026-05-24" },
  { subject: "Urgent: Scheduled Maintenance on Billing Core", segment: "Secondary Administrators", openRate: "--", clickRate: "--", status: "Scheduled", date: "2026-05-30" }
];

export default function EmailAlerts() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [targetSegment, setTargetSegment] = useState('All Subscribed Farmers')
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    setActiveItem('Notification Center', 'Email Alerts')
  }, [setActiveItem])

  const handleCreateCampaign = (e) => {
    e.preventDefault()
    if (!emailSubject.trim() || !emailBody.trim()) return

    const newCampaign = {
      subject: emailSubject,
      segment: targetSegment,
      openRate: "0.0%",
      clickRate: "0.0%",
      status: "Sent",
      date: new Date().toISOString().split('T')[0]
    }

    setCampaigns([newCampaign, ...campaigns])
    setEmailSubject('')
    setEmailBody('')
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-855 dark:text-slate-100 flex items-center gap-2">
            Email Campaign & Marketing Desk
          </h2>
          <p className="text-xs text-slate-500 font-medium">Coordinate system emails, marketing newsletters, subscriber segments, and track open/bounce rates</p>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          Email newsletter successfully dispatched to delivery pools.
        </div>
      )}

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Emails Dispatched Today", val: "42,800 Sent", icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Avg Open Rate", val: "50.35%", icon: Eye, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Bouncing Mail Logs", val: "12 Bounces", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "Inbox Delivery Health", val: "99.2%", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" }
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
        {/* Left Side: Campaign composer */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs h-fit`}>
          <div className="flex items-center gap-1.5 border-b pb-2 dark:border-slate-850 border-slate-150">
            <Sliders className="text-emerald-500" size={16} />
            <span className="text-4xs font-extrabold uppercase text-slate-400 font-heading">Rich Email Campaign Editor</span>
          </div>

          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div>
              <label className="block text-4xs font-bold text-slate-400 mb-1">EMAIL SUBJECT LINE</label>
              <input
                type="text"
                placeholder="e.g. Monthly Agriculture Advisory Guide"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-805 focus:border-emerald-500'} transition-all`}
              />
            </div>

            <div>
              <label className="block text-4xs font-bold text-slate-400 mb-1">AUDIENCE SEGMENT TARGET</label>
              <select
                value={targetSegment}
                onChange={(e) => setTargetSegment(e.target.value)}
                className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-855 text-slate-205 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-805 focus:border-emerald-500'} transition-all`}
              >
                <option value="All Subscribed Farmers">All Subscribed Farmers</option>
                <option value="All Registered Vendors">All Registered Vendors</option>
                <option value="Secondary Administrators">Secondary Administrators</option>
              </select>
            </div>

            <div>
              <label className="block text-4xs font-bold text-slate-455 mb-1 font-heading">NEWSLETTER BODY (HTML SIMULATED)</label>
              <textarea
                placeholder="Type newsletter announcement text here..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows="4"
                className={`w-full p-2.5 rounded-lg border outline-none resize-none ${theme === 'dark' ? 'bg-slate-955 border-slate-800 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-200 focus:border-emerald-500'} transition-all`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-3xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send size={12} /> Dispatch Campaign
            </button>
          </form>
        </div>

        {/* Right Side: Campaigns summary table */}
        <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
          <div className="flex justify-between items-center border-b pb-2 dark:border-slate-850 border-slate-150">
            <span className="text-4xs font-extrabold uppercase text-slate-400">Newsletter Campaign History</span>
            <span className="text-4xs text-emerald-500 font-bold uppercase tracking-wider">Metrics database</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b text-4xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-3">Email Subject Line</th>
                  <th className="p-3">Target Segment</th>
                  <th className="p-3">Open Rate</th>
                  <th className="p-3">Click Rate</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-155 dark:divide-slate-800">
                {campaigns.map((c, i) => (
                  <tr key={i} className={theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50'}>
                    <td className="p-3 font-bold max-w-[200px] truncate">{c.subject}</td>
                    <td className="p-3 text-slate-500 font-semibold">{c.segment}</td>
                    <td className="p-3 text-emerald-500 font-bold">{c.openRate}</td>
                    <td className="p-3 text-blue-500 font-bold">{c.clickRate}</td>
                    <td className="p-3 text-slate-400 text-3xs font-semibold">{c.date}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-4xs font-extrabold ${c.status === 'Sent' ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 bg-slate-500/10'}`}>
                        {c.status}
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

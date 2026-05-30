import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LifeBuoy, Plus, Check, X, ShieldAlert, Sparkles, AlertCircle, Clock, Eye, HelpCircle, FileText } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function ApplicationSupport() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [tickets, setTickets] = useState([
    { id: 't-201', name: 'Ramesh Patil', topic: 'Land Document Verification Issue', date: '2026-05-28', priority: 'High', status: 'Open' },
    { id: 't-202', name: 'Sanjay Deshmukh', topic: 'Aadhaar e-KYC Failed', date: '2026-05-27', priority: 'Medium', status: 'In Progress' },
    { id: 't-203', name: 'Anil Rao', topic: 'MahaDBT login verification', date: '2026-05-26', priority: 'Low', status: 'Closed' }
  ])

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <LifeBuoy className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Application Assistance Hub
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Verify documents, manage support tickets, and resolve scheme access problems</p>
        </div>
      </div>

      {/* Support Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Left: Document Verification Checklist */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-5 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">Pending Document Auditing</h3>
            <p className="text-xs text-slate-400">Items requiring verification for scheme qualification</p>
          </div>

          <div className="space-y-4 flex-1 mt-4">
            <div className="p-3.5 border dark:border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">7/12 Extract (Land Proof)</span>
                <span className="text-3xs text-slate-400">Submitted by Ramesh Patil • 1.4MB</span>
              </div>
              <div className="flex gap-2">
                <button className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded"><Check size={16} /></button>
                <button className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"><X size={16} /></button>
              </div>
            </div>

            <div className="p-3.5 border dark:border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">Income Certificate (Aadhaar Seeded)</span>
                <span className="text-3xs text-slate-400">Submitted by Anil Rao • 800KB</span>
              </div>
              <div className="flex gap-2">
                <button className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded"><Check size={16} /></button>
                <button className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"><X size={16} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Progress Tracker Timeline */}
        <div className={`lg:col-span-2 rounded-xl border p-6 md:p-8 space-y-6 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Help Center & Service Support Resources</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Quick links to scheme guidelines and escalation points</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border dark:border-slate-800 flex items-start gap-3">
              <FileText size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs block text-slate-850 dark:text-slate-200">General Crop Subsidy Guide</span>
                <span className="text-3xs text-slate-400 mt-1 block">Full procedure detailing application pathways and required documents list.</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border dark:border-slate-800 flex items-start gap-3">
              <HelpCircle size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs block text-slate-850 dark:text-slate-200">Subsidy Escalation Matrix</span>
                <span className="text-3xs text-slate-400 mt-1 block">Who to contact in case direct bank transfers are rejected by gateways.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Tickets Table */}
      <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
        <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Assistance Requests (Tickets)</h3>
            <p className="text-xs text-slate-400 mt-1">Audit active service tickets raised by farmers</p>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-450 uppercase`}>
                <th className="px-6 py-4 min-w-[200px]">Farmer Profile</th>
                <th className="px-6 py-4 min-w-[250px]">Topic Description</th>
                <th className="px-6 py-4 min-w-[140px]">Date Logged</th>
                <th className="px-6 py-4 min-w-[140px]">Priority Level</th>
                <th className="px-6 py-4 min-w-[140px]">Status</th>
                <th className="px-6 py-4 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                  <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150 truncate">{t.name}</td>
                  <td className="px-6 py-3.5 text-slate-655 dark:text-slate-350 truncate">{t.topic}</td>
                  <td className="px-6 py-3.5 text-slate-450 font-medium">{t.date}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded font-bold text-3xs ${
                      t.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-450'
                    } whitespace-nowrap`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap inline-flex items-center justify-center ${
                      t.status === 'Open' ? 'bg-emerald-500/10 text-emerald-500 animate-pulse' :
                      t.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-450'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Eye size={16} />
                    </button>
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

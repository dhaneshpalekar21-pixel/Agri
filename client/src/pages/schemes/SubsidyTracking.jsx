import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Landmark, ArrowUpRight, TrendingUp, IndianRupee, Clock, FileText, CheckCircle, HelpCircle, Eye, Sliders } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function SubsidyTracking() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [applications, setApplications] = useState([
    { id: 'sub-app-1', farmer: 'Ramesh Patil', scheme: 'PM Kisan Samman Nidhi', amount: 2000, date: '2026-05-24', status: 'Approved', payment: 'Disbursed' },
    { id: 'sub-app-2', farmer: 'Sanjay Deshmukh', scheme: 'MahaDBT Tractor Subsidy', amount: 125000, date: '2026-05-20', status: 'Approved', payment: 'Processing' },
    { id: 'sub-app-3', farmer: 'Anil Rao', scheme: 'Sinchaee Micro Irrigation', amount: 35000, date: '2026-05-18', status: 'Pending', payment: 'On Hold' },
    { id: 'sub-app-4', farmer: 'Vijay Gowda', scheme: 'Karnataka Crop Insurance', amount: 12000, date: '2026-05-15', status: 'Rejected', payment: 'Cancelled' },
    { id: 'sub-app-5', farmer: 'Dilip Kumar', scheme: 'PM Kisan Samman Nidhi', amount: 2000, date: '2026-05-12', status: 'Approved', payment: 'Disbursed' }
  ])

  // Analytics helper stats
  const approvedTotal = applications.filter(a => a.status === 'Approved').length
  const pendingTotal = applications.filter(a => a.status === 'Pending').length
  const totalAmount = applications.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <IndianRupee className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Subsidy Tracking Ledger
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Audit application disbursements, track direct benefit transfers, and manage gateway payloads</p>
        </div>
      </div>

      {/* KPI Stats widgets (Equal Height & Width) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Total Disbursed Subsidies</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">₹{totalAmount.toLocaleString('en-IN')}</span>
            <span className="text-[10px] md:text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
              <TrendingUp size={12} /> +18.2%
            </span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Approved Subsidies</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-emerald-500">{approvedTotal}</span>
            <span className="text-xs text-slate-400 font-semibold">Active Claims</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Pending Validation</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-amber-500">{pendingTotal}</span>
            <span className="text-xs text-slate-400 font-semibold">Verification Queue</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Rejected Applications</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-rose-500">
              {applications.filter(a => a.status === 'Rejected').length}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Failed Rules Match</span>
          </div>
        </div>
      </div>

      {/* Subsidy Applications Table */}
      <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
        <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Disbursement Register</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Verify direct transfer statuses of national subsidies</p>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-455 uppercase`}>
                <th className="px-6 py-4 min-w-[180px]">Farmer Profile</th>
                <th className="px-6 py-4 min-w-[200px]">Scheme Name</th>
                <th className="px-6 py-4 min-w-[140px]">Subsidy Amount</th>
                <th className="px-6 py-4 min-w-[140px]">Application Date</th>
                <th className="px-6 py-4 min-w-[140px]">Approval Status</th>
                <th className="px-6 py-4 min-w-[140px]">Payment Status</th>
                <th className="px-6 py-4 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {applications.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                  <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150 truncate">{a.farmer}</td>
                  <td className="px-6 py-3.5 text-slate-655 dark:text-slate-350 truncate">{a.scheme}</td>
                  <td className="px-6 py-3.5 font-bold text-slate-700 dark:text-slate-200">₹{a.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3.5 text-slate-400 font-medium">{a.date}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap inline-flex items-center justify-center ${
                      a.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                      a.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap inline-flex items-center justify-center ${
                      a.payment === 'Disbursed' ? 'bg-emerald-500/10 text-emerald-500' :
                      a.payment === 'Processing' ? 'bg-blue-500/10 text-blue-500 animate-pulse' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {a.payment}
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

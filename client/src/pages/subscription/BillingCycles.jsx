import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CreditCard, Clock, FileText, CheckCircle, RefreshCcw, Settings, Trash2, CalendarClock, IndianRupee, Eye } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function BillingCycles() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [activeCycle, setActiveCycle] = useState('monthly')
  const [retryAttempts, setRetryAttempts] = useState('3')
  const [gracePeriod, setGracePeriod] = useState('7')
  const [autoDeduct, setAutoDeduct] = useState(true)

  const [cycles] = useState([
    { key: 'monthly', title: 'Monthly Cycle', duration: '30 Days', activeTenants: 1204, renewalSuccessRate: '96.2%', nextRun: '2026-06-01' },
    { key: 'quarterly', title: 'Quarterly Cycle', duration: '90 Days', activeTenants: 485, renewalSuccessRate: '97.8%', nextRun: '2026-07-01' },
    { key: 'half-yearly', title: 'Half-Yearly Cycle', duration: '180 Days', activeTenants: 219, renewalSuccessRate: '98.5%', nextRun: '2026-08-01' },
    { key: 'yearly', title: 'Yearly Cycle', duration: '365 Days', activeTenants: 590, renewalSuccessRate: '99.1%', nextRun: '2026-11-01' }
  ])

  const [billingHistory] = useState([
    { id: 'TXN-9021', tenant: 'Karnal Wheat Producers', amount: 3499, date: '2026-05-28', cycle: 'Monthly', status: 'Settled', gateway: 'Razorpay' },
    { id: 'TXN-9022', tenant: 'Vedic Farms Co.', amount: 12990, date: '2026-05-28', cycle: 'Yearly', status: 'Settled', gateway: 'Stripe' },
    { id: 'TXN-9023', tenant: 'Rajesh Agri Implements', amount: 499, date: '2026-05-27', cycle: 'Monthly', status: 'Failed', gateway: 'Razorpay' },
    { id: 'TXN-9024', tenant: 'Godavari Cold Storage', amount: 3499, date: '2026-05-27', cycle: 'Monthly', status: 'Settled', gateway: 'UPI Auto-pay' },
    { id: 'TXN-9025', tenant: 'Marathwada Cotton Mills', amount: 1299, date: '2026-05-26', cycle: 'Monthly', status: 'Processing', gateway: 'Stripe' }
  ])

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <CalendarClock className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Billing Cycles & Schedules
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5">Manage automated payment triggers, cron configurations, payment retries, and manual overrides</p>
        </div>
      </div>

      {/* Cycle Types Cards (Equal Height & Width) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {cycles.map(c => (
          <div
            key={c.key}
            onClick={() => setActiveCycle(c.key)}
            className={`cursor-pointer rounded-xl border p-6 flex flex-col justify-between transition-all min-h-[140px] ${
              activeCycle === c.key
                ? 'border-emerald-500 ring-2 ring-emerald-500/10'
                : isDark ? 'border-slate-850 bg-slate-900/40 hover:bg-slate-900' : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-extrabold text-sm text-slate-800 dark:text-slate-155">{c.title}</span>
              <Calendar size={16} className={activeCycle === c.key ? 'text-emerald-500' : 'text-slate-400'} />
            </div>
            <div className="space-y-1.5 text-xs text-slate-450 dark:text-slate-400">
              <p>Active Accounts: <span className="font-bold text-slate-700 dark:text-slate-100">{c.activeTenants}</span></p>
              <p>Success Rate: <span className="font-bold text-emerald-500">{c.renewalSuccessRate}</span></p>
              <p>Next Run: <span className="font-mono">{c.nextRun}</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Configurations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Left: Settings Panel */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Settings size={18} /> Auto Renewal Rules
            </h3>
            <p className="text-2xs text-slate-400 mt-1">Configure decline behavior patterns</p>
          </div>
          
          <div className="space-y-5 text-xs md:text-sm flex-1 mt-4">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Auto-Debit Default</label>
              <div className="flex items-center justify-between p-3.5 rounded-lg border dark:border-slate-800">
                <span className="text-slate-455 font-medium">Automatic Mandate deduction</span>
                <input
                  type="checkbox"
                  checked={autoDeduct}
                  onChange={e => setAutoDeduct(e.target.checked)}
                  className="accent-emerald-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Retry Attempts on Decline</label>
              <select
                value={retryAttempts}
                onChange={e => setRetryAttempts(e.target.value)}
                className="input-field py-2.5 text-sm"
              >
                <option value="1">1 Try (Decline Immediately)</option>
                <option value="2">2 Tries (Interval 24 hours)</option>
                <option value="3">3 Tries (Interval 48 hours)</option>
                <option value="5">5 Tries (Interval 72 hours)</option>
              </select>
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Grace Period (Days)</label>
              <input
                type="number"
                value={gracePeriod}
                onChange={e => setGracePeriod(e.target.value)}
                className="input-field py-2.5 text-sm"
                placeholder="e.g. 7"
              />
              <p className="text-[10px] md:text-xs text-slate-400 mt-1.5 leading-relaxed">Days users can access features with unpaid billing status before suspension.</p>
            </div>
          </div>

          <button className="w-full btn-primary text-xs md:text-sm py-3 font-semibold mt-4">
            Apply Global Auto-Rules
          </button>
        </div>

        {/* Right: Payment Schedule Calendar Mock */}
        <div className={`lg:col-span-2 rounded-xl border p-6 md:p-8 space-y-6 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Upcoming Billing Scheduler Calendar</h3>
              <p className="text-xs text-slate-400 mt-1">Next scheduled cron triggers and estimated payouts batch</p>
            </div>
            <button className="text-xs font-bold text-emerald-500 hover:underline w-fit">
              Run Batch Job Now
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2.5 text-center text-xs md:text-sm">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="font-bold text-slate-400 py-1.5">{d}</div>
            ))}
            {/* Simple Grid Representation */}
            {Array.from({ length: 28 }).map((_, i) => {
              const day = i + 1
              const isRunDay = day === 1 || day === 15
              return (
                <div
                  key={i}
                  className={`py-3.5 md:py-4.5 rounded-xl border transition-all relative font-semibold ${
                    isRunDay
                      ? 'border-emerald-500 bg-emerald-500/10 font-bold text-emerald-600'
                      : isDark ? 'border-slate-850 hover:bg-slate-800 text-slate-400' : 'border-slate-100 hover:bg-slate-50 text-slate-650'
                  }`}
                >
                  <span>{day}</span>
                  {isRunDay && (
                    <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Billing Invoice History Table */}
      <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
        <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Transaction Billing & Invoice Logs</h3>
            <p className="text-xs text-slate-400 mt-1">Audit gateway execution reports and current pending transactions</p>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-450 uppercase`}>
                <th className="px-6 py-4 min-w-[150px]">Txn Reference</th>
                <th className="px-6 py-4 min-w-[200px]">Agribusiness Tenant</th>
                <th className="px-6 py-4 min-w-[140px]">Amount</th>
                <th className="px-6 py-4 min-w-[140px]">Billing Date</th>
                <th className="px-6 py-4 min-w-[140px]">Cycle Term</th>
                <th className="px-6 py-4 min-w-[160px]">Gateway Mandate</th>
                <th className="px-6 py-4 min-w-[120px]">Status</th>
                <th className="px-6 py-4 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {billingHistory.map(b => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                  <td className="px-6 py-3.5 font-mono text-blue-500 font-bold">{b.id}</td>
                  <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150 truncate">{b.tenant}</td>
                  <td className="px-6 py-3.5 font-bold text-slate-700 dark:text-slate-200">₹{b.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3.5 text-slate-450">{b.date}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-655">{b.cycle}</td>
                  <td className="px-6 py-3.5 text-slate-400 font-medium">{b.gateway}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap inline-flex items-center justify-center ${
                      b.status === 'Settled' ? 'bg-emerald-500/10 text-emerald-500' :
                      b.status === 'Failed' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500 animate-pulse'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button className="p-2 text-slate-450 hover:text-emerald-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
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

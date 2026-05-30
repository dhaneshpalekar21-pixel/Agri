import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, BarChart2, TrendingUp, TrendingDown, Users, IndianRupee, Activity, AlertCircle, ArrowUpRight, CheckCircle, RefreshCcw, Sparkles } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function SubscriptionAnalytics() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [metrics] = useState({
    totalSubscribers: 1251,
    activeSubscriptions: 1142,
    expiredSubscriptions: 109,
    renewalRate: '95.4%',
    mrr: 185000,
    churnRate: '2.8%',
    growthRate: '+14.2%'
  })

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <LineChart className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Enterprise Subscription Analytics
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5">Real-time cohort insights, MRR growth trajectories, predictive forecasting, and churn metrics</p>
        </div>
      </div>

      {/* KPI Stats widgets grid (Equal Height & Width) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Total Subscribers */}
        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Total Subscribers</span>
            <Users size={18} className="text-slate-450" />
          </div>
          <div className="flex items-baseline justify-between mt-auto">
            <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">{metrics.totalSubscribers}</span>
            <span className="text-[10px] md:text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
              <TrendingUp size={12} /> {metrics.growthRate}
            </span>
          </div>
        </div>

        {/* MRR Revenue */}
        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Monthly Recurring Revenue</span>
            <IndianRupee size={18} className="text-slate-455" />
          </div>
          <div className="flex items-baseline justify-between mt-auto">
            <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">₹{metrics.mrr.toLocaleString('en-IN')}</span>
            <span className="text-[10px] md:text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
              <TrendingUp size={12} /> +8.9%
            </span>
          </div>
        </div>

        {/* Renewal Rate */}
        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Renewal success Rate</span>
            <RefreshCcw size={18} className="text-slate-450" />
          </div>
          <div className="flex items-baseline justify-between mt-auto">
            <span className="text-2xl md:text-3xl font-black text-emerald-500">{metrics.renewalRate}</span>
            <span className="text-xs text-slate-400 font-semibold">Target 95%</span>
          </div>
        </div>

        {/* Churn Rate */}
        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Subscriber Churn Rate</span>
            <TrendingDown size={18} className="text-slate-455" />
          </div>
          <div className="flex items-baseline justify-between mt-auto">
            <span className="text-2xl md:text-3xl font-black text-rose-500">{metrics.churnRate}</span>
            <span className="text-[10px] md:text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full whitespace-nowrap">
              -0.4% MoM
            </span>
          </div>
        </div>

      </div>

      {/* Visual Analytics Cohorts & Revenue Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Left: SVG Chart (Set container height to 400px–500px) */}
        <div className={`lg:col-span-2 rounded-xl border p-6 md:p-8 space-y-6 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100">MRR Subscription growth Trajectory</h3>
            <p className="text-xs text-slate-400 mt-1">Last 6 Months recurring payouts in Lakhs</p>
          </div>

          {/* Sizing height strictly to 400px-500px */}
          <div className="w-full h-[400px] md:h-[450px] pt-4">
            <svg viewBox="0 0 500 250" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="gradient-line" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="50" y1="40" x2="450" y2="40" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="1" strokeDasharray="4,4" />
              <line x1="50" y1="90" x2="450" y2="90" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="1" strokeDasharray="4,4" />
              <line x1="50" y1="140" x2="450" y2="140" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="1" strokeDasharray="4,4" />
              <line x1="50" y1="190" x2="450" y2="190" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="1" strokeDasharray="4,4" />

              {/* Area path */}
              <path
                d="M 50,190 L 130,170 L 210,180 L 290,120 L 370,90 L 450,50 L 450,220 L 50,220 Z"
                fill="url(#gradient-line)"
              />

              {/* Line path */}
              <path
                d="M 50,190 L 130,170 L 210,180 L 290,120 L 370,90 L 450,50"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Circles on Nodes */}
              <circle cx="50" cy="190" r="5" fill="#10b981" />
              <circle cx="130" cy="170" r="5" fill="#10b981" />
              <circle cx="210" cy="180" r="5" fill="#10b981" />
              <circle cx="290" cy="120" r="5" fill="#10b981" />
              <circle cx="370" cy="90" r="5" fill="#10b981" />
              <circle cx="450" cy="50" r="5" fill="#10b981" />

              {/* X Axis Labels */}
              <text x="50" y="240" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">Dec</text>
              <text x="130" y="240" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">Jan</text>
              <text x="210" y="240" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">Feb</text>
              <text x="290" y="240" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">Mar</text>
              <text x="370" y="240" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">Apr</text>
              <text x="450" y="240" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">May</text>
            </svg>
          </div>
        </div>

        {/* Right: Forecasting & Churn predictions widget */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Sparkles className="text-amber-500" size={18} /> AI Growth Prediction
            </h3>
            <p className="text-xs text-slate-400 mt-1">Estimated cohort growth patterns next 90 days</p>
          </div>

          <div className="space-y-5 text-xs md:text-sm flex-1 mt-4">
            <div className="p-4 md:p-5 rounded-xl border dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-2xs font-bold text-slate-400 uppercase">
                <span>Predicted MRR</span>
                <span className="text-emerald-500 font-extrabold">+11.4% Est.</span>
              </div>
              <span className="text-lg md:text-xl font-black mt-2 block text-slate-800 dark:text-slate-100">₹2,06,090</span>
              <p className="text-[11px] md:text-xs text-slate-455 dark:text-slate-400 mt-2 leading-relaxed">Calculated via baseline trends, contract commitments and upcoming renewals success.</p>
            </div>

            <div className="p-4 md:p-5 rounded-xl border dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-2xs font-bold text-slate-400 uppercase">
                <span>Predicted Churn Trigger</span>
                <span className="text-rose-500 font-extrabold">2.1% (Low Risk)</span>
              </div>
              <span className="text-lg md:text-xl font-black mt-2 block text-slate-800 dark:text-slate-100">22 Accounts</span>
              <p className="text-[11px] md:text-xs text-slate-455 dark:text-slate-400 mt-2 leading-relaxed">Potential non-renewals identified via activity degradation metrics.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Cohort Retention Table */}
      <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
        <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Month-on-Month Retention Performance</h3>
            <p className="text-xs text-slate-400 mt-1">Cohort data tracking subscription degradation rates by starting month</p>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-455 uppercase`}>
                <th className="px-6 py-4 min-w-[200px]">Cohort Starting Month</th>
                <th className="px-6 py-4 text-center min-w-[110px]">Month 0 (New)</th>
                <th className="px-6 py-4 text-center min-w-[110px]">Month 1</th>
                <th className="px-6 py-4 text-center min-w-[110px]">Month 2</th>
                <th className="px-6 py-4 text-center min-w-[110px]">Month 3</th>
                <th className="px-6 py-4 text-center min-w-[110px]">Month 4</th>
                <th className="px-6 py-4 text-center min-w-[110px]">Month 5</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {[
                { month: 'Jan 2026', size: 104, m0: '100%', m1: '98%', m2: '97%', m3: '96%', m4: '95%', m5: '94%' },
                { month: 'Feb 2026', size: 115, m0: '100%', m1: '99%', m2: '98%', m3: '95%', m4: '94%', m5: '—' },
                { month: 'Mar 2026', size: 120, m0: '100%', m1: '98%', m2: '96%', m3: '94%', m4: '—', m5: '—' },
                { month: 'Apr 2026', size: 145, m0: '100%', m1: '99%', m2: '97%', m3: '—', m4: '—', m5: '—' }
              ].map(c => (
                <tr key={c.month} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                  <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150">{c.month} <span className="text-3xs md:text-2xs text-slate-450 font-normal">({c.size} Tenants)</span></td>
                  <td className="px-6 py-3.5 text-center font-bold bg-emerald-500/5 text-emerald-600">{c.m0}</td>
                  <td className="px-6 py-3.5 text-center font-bold bg-emerald-500/5 text-emerald-600">{c.m1}</td>
                  <td className="px-6 py-3.5 text-center font-bold bg-emerald-500/5 text-emerald-600">{c.m2}</td>
                  <td className="px-6 py-3.5 text-center font-bold bg-emerald-500/5 text-emerald-600">{c.m3}</td>
                  <td className="px-6 py-3.5 text-center font-bold bg-emerald-500/5 text-emerald-600">{c.m4}</td>
                  <td className="px-6 py-3.5 text-center font-semibold text-slate-400">{c.m5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

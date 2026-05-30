import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sprout, RefreshCcw, Landmark, Compass, Award, Activity, Heart, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function FarmerPlans() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [plans] = useState([
    {
      id: 'fp-basic',
      name: 'Kisan Mitra (Basic)',
      price: 99,
      duration: 'Monthly',
      features: ['Soil Health Advisory Reports', 'Daily Local Weather Alerts', 'Local Mandi Price Tracker', 'Community Forum Support'],
      color: 'from-amber-500/20 to-orange-500/20',
      borderColor: 'border-amber-500/30',
      accentColor: 'text-amber-500'
    },
    {
      id: 'fp-advanced',
      name: 'Kisan Samridhi (Advanced)',
      price: 249,
      duration: 'Monthly',
      popular: true,
      features: ['Basic + Crop Doctor AI (Unlimited)', 'Satellite Biomass NDVI Index', 'Direct Agri-Expert Tele-Consults', 'Soil Carbon Monitoring'],
      color: 'from-emerald-500/20 to-green-500/20',
      borderColor: 'border-emerald-500/40',
      accentColor: 'text-emerald-500'
    },
    {
      id: 'fp-premium',
      name: 'Kisan Progressive Pro',
      price: 499,
      duration: 'Monthly',
      features: ['Advanced + IoT Soil Probe Data Sync', 'Drone Sprayer Priority Booking', 'Custom Crop Insurance Advisory', 'Export Market Direct Access'],
      color: 'from-blue-500/20 to-indigo-500/20',
      borderColor: 'border-blue-500/30',
      accentColor: 'text-blue-500'
    }
  ])

  const [activeFarmers] = useState([
    { id: 'f-1', name: 'Ramesh Patil', location: 'Nashik, MH', plan: 'Kisan Samridhi', joined: '2025-01-20', nextRenewal: '2026-06-20', usageAdvisories: 24, status: 'Active' },
    { id: 'f-2', name: 'Sanjay Deshmukh', location: 'Satara, MH', plan: 'Kisan Progressive Pro', joined: '2024-11-15', nextRenewal: '2026-06-15', usageAdvisories: 58, status: 'Active' },
    { id: 'f-3', name: 'Anil Rao', location: 'Guntur, AP', plan: 'Kisan Mitra', joined: '2025-03-01', nextRenewal: '2026-06-01', usageAdvisories: 5, status: 'Active' },
    { id: 'f-4', name: 'Vijay Gowda', location: 'Hassan, KA', plan: 'Kisan Samridhi', joined: '2025-02-14', nextRenewal: '2026-06-14', usageAdvisories: 31, status: 'Active' }
  ])

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Sprout className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Farmer Subscription Tiers
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5">Configure subsidized packages, advisory limitations, and usage quotas for smallholders</p>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
        {plans.map(p => (
          <div key={p.id} className={`rounded-2xl border p-6 md:p-8 bg-gradient-to-br ${p.color} ${p.borderColor} flex flex-col justify-between relative min-h-[300px]`}>
            <div>
              {p.popular && (
                <span className="absolute top-4 right-4 bg-emerald-600 text-white font-extrabold text-[9px] md:text-[10px] uppercase tracking-wider px-3 py-1 rounded shadow-sm">
                  Most Chosen
                </span>
              )}
              <h3 className="font-extrabold text-base md:text-lg text-slate-850 dark:text-slate-100">{p.name}</h3>
              <div className="my-5 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-850 dark:text-slate-100">₹{p.price}</span>
                <span className="text-xs text-slate-400">/{p.duration}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-455 dark:text-slate-350">
                    <CheckCircle2 size={15} className={`${p.accentColor} flex-shrink-0 mt-0.5`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Analytics Grid (Equal height & width) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <div className={`kpi-card p-6 md:p-8 flex items-center gap-5 ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500 flex-shrink-0">
            <Activity size={24} />
          </div>
          <div>
            <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">AI Advisories Generated</span>
            <span className="text-xl md:text-2xl font-black mt-2 block text-slate-800 dark:text-slate-100">4,295</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex items-center gap-5 ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <div className="p-4 rounded-xl bg-amber-500/10 text-amber-500 flex-shrink-0">
            <RefreshCcw size={24} />
          </div>
          <div>
            <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Monthly Renewal Success</span>
            <span className="text-xl md:text-2xl font-black mt-2 block text-slate-800 dark:text-slate-100">94.2%</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex items-center gap-5 ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500 flex-shrink-0">
            <Compass size={24} />
          </div>
          <div>
            <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Soil Testing Bookings</span>
            <span className="text-xl md:text-2xl font-black mt-2 block text-slate-800 dark:text-slate-100">1,829</span>
          </div>
        </div>
      </div>

      {/* Active Farmers Table */}
      <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
        <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Active Farmers Directory</h3>
            <p className="text-xs text-slate-400 mt-1">Direct control of subscription validation overrides</p>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-450 uppercase`}>
                <th className="px-6 py-4 min-w-[200px]">Farmer Name</th>
                <th className="px-6 py-4 min-w-[140px]">Region</th>
                <th className="px-6 py-4 min-w-[180px]">Subscribed Plan</th>
                <th className="px-6 py-4 min-w-[140px]">Next Renewal</th>
                <th className="px-6 py-4 text-center min-w-[160px]">Consultations</th>
                <th className="px-6 py-4 min-w-[120px]">Status</th>
                <th className="px-6 py-4 text-right min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {activeFarmers.map(f => (
                <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                  <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150 truncate">{f.name}</td>
                  <td className="px-6 py-3.5 text-slate-450 font-medium truncate">{f.location}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-650 dark:text-slate-350">{f.plan}</td>
                  <td className="px-6 py-3.5 font-mono text-slate-405">{f.nextRenewal}</td>
                  <td className="px-6 py-3.5 text-center font-semibold text-slate-500">{f.usageAdvisories} times</td>
                  <td className="px-6 py-3.5">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-emerald-500/10 text-emerald-500 inline-flex items-center justify-center">
                      {f.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button className="text-xs font-bold text-rose-500 hover:underline whitespace-nowrap">
                      Suspend Account
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

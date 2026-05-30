import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, UserCheck, AlertTriangle, ArrowUpRight, TrendingUp, IndianRupee, Gift, Star, Clock, Sparkles } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function VendorMemberships() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [members, setMembers] = useState([
    { id: 'v-101', name: 'Krishna Agro Seeds', level: 'Platinum', joinedDate: '2024-01-12', expiryDate: '2026-06-15', revenue: 45200, status: 'Active' },
    { id: 'v-102', name: 'Maharashtra Fertilizers Ltd', level: 'Gold', joinedDate: '2024-03-24', expiryDate: '2026-06-04', revenue: 28400, status: 'Expiring Soon' },
    { id: 'v-103', name: 'Shree Sai Irrigation', level: 'Silver', joinedDate: '2025-02-10', expiryDate: '2026-08-10', revenue: 12000, status: 'Active' },
    { id: 'v-104', name: 'Shetkari Tool Depot', level: 'Platinum', joinedDate: '2023-11-01', expiryDate: '2026-05-31', revenue: 58000, status: 'Expiring Soon' },
    { id: 'v-105', name: 'Narmada Organic Pesticides', level: 'Silver', joinedDate: '2025-05-01', expiryDate: '2026-11-01', revenue: 6500, status: 'Active' }
  ])

  const [history, setHistory] = useState([
    { id: 'h-1', vendor: 'Krishna Agro Seeds', from: 'Gold', to: 'Platinum', date: '2026-05-20', type: 'System Auto-Upgrade' },
    { id: 'h-2', vendor: 'Shree Sai Irrigation', from: 'Free Tier', to: 'Silver', date: '2026-05-18', type: 'Manual Admin Action' },
    { id: 'h-3', vendor: 'Maharashtra Fertilizers Ltd', from: 'Silver', to: 'Gold', date: '2026-04-12', type: 'Self Upgrade via Portal' }
  ])

  // Stats
  const totalRevenue = members.reduce((sum, item) => sum + item.revenue, 0)
  const expiringAlerts = members.filter(m => m.status === 'Expiring Soon')

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Vendor Memberships Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5">Audit active agribusiness supplier credentials, commission rates, and expiration cycles</p>
        </div>
      </div>

      {/* Expiry Alerts Banner */}
      {expiringAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? 'bg-amber-950/20 border-amber-900/50 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <div className="flex items-center gap-3 text-xs md:text-sm font-semibold">
            <AlertTriangle className="text-amber-500 flex-shrink-0 animate-bounce w-5 h-5" />
            <span>CRITICAL EXPIRY ALERTS: {expiringAlerts.length} Vendors memberships will expire in the next 15 days.</span>
          </div>
          <button className="text-xs font-bold px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all w-fit whitespace-nowrap">
            Send Automatic Reminders
          </button>
        </motion.div>
      )}

      {/* KPI Stats widgets (Equal height & width) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Membership Revenue</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">₹{totalRevenue.toLocaleString('en-IN')}</span>
            <span className="text-[10px] md:text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} /> +12.4%
            </span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Active Vendor Members</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">{members.length}</span>
            <span className="text-xs text-slate-400 font-semibold">Total Partners</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Platinum Level Tiers</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-purple-500">
              {members.filter(m => m.level === 'Platinum').length}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Elite Commission Cap</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Expiring Accounts</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-amber-500">{expiringAlerts.length}</span>
            <span className="text-xs text-slate-400 font-semibold">Requires review</span>
          </div>
        </div>
      </div>

      {/* Membership Tiers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
        {/* Silver */}
        <div className={`rounded-2xl border p-6 md:p-8 flex flex-col justify-between relative overflow-hidden min-h-[300px] ${isDark ? 'border-slate-800 bg-slate-900/25' : 'border-slate-200 bg-white'}`}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">Tier Level</span>
                <h3 className="text-lg font-extrabold mt-1 text-slate-800 dark:text-slate-100">Silver Membership</h3>
              </div>
              <span className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                <Gift size={20} />
              </span>
            </div>
            <div className="my-5">
              <span className="text-3xl font-black text-slate-800 dark:text-slate-100">2.5%</span>
              <span className="text-xs text-slate-400 font-semibold"> Commission Cap</span>
            </div>
            <ul className="text-xs md:text-sm text-slate-450 dark:text-slate-350 space-y-3 mb-6">
              <li className="flex items-center gap-2"><Star size={12} className="text-yellow-500 flex-shrink-0" /> Max 250 Active Products</li>
              <li className="flex items-center gap-2"><Star size={12} className="text-yellow-500 flex-shrink-0" /> Basic Ad Placements</li>
              <li className="flex items-center gap-2"><Star size={12} className="text-yellow-500 flex-shrink-0" /> Email Payment Settlements</li>
            </ul>
          </div>
        </div>

        {/* Gold */}
        <div className={`rounded-2xl border p-6 md:p-8 flex flex-col justify-between relative overflow-hidden min-h-[300px] ${isDark ? 'border-slate-800 bg-slate-900/25' : 'border-slate-200 bg-white'}`}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-yellow-500 uppercase">Tier Level</span>
                <h3 className="text-lg font-extrabold mt-1 text-slate-800 dark:text-slate-100">Gold Membership</h3>
              </div>
              <span className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500">
                <Star size={20} />
              </span>
            </div>
            <div className="my-5">
              <span className="text-3xl font-black text-slate-800 dark:text-slate-100">1.5%</span>
              <span className="text-xs text-slate-400 font-semibold"> Commission Cap</span>
            </div>
            <ul className="text-xs md:text-sm text-slate-450 dark:text-slate-350 space-y-3 mb-6">
              <li className="flex items-center gap-2"><Star size={12} className="text-yellow-500 flex-shrink-0" /> Max 2000 Active Products</li>
              <li className="flex items-center gap-2"><Star size={12} className="text-yellow-500 flex-shrink-0" /> Advanced Campaign Editor</li>
              <li className="flex items-center gap-2"><Star size={12} className="text-yellow-500 flex-shrink-0" /> T+1 Daily Settlements</li>
            </ul>
          </div>
        </div>

        {/* Platinum */}
        <div className={`rounded-2xl border p-6 md:p-8 flex flex-col justify-between relative overflow-hidden min-h-[300px] ${isDark ? 'border-slate-800 bg-slate-900/25' : 'border-slate-200 bg-white'}`}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-purple-500 uppercase">Tier Level</span>
                <h3 className="text-lg font-extrabold mt-1 text-slate-800 dark:text-slate-100">Platinum Premium</h3>
              </div>
              <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                <Sparkles size={20} />
              </span>
            </div>
            <div className="my-5">
              <span className="text-3xl font-black text-slate-800 dark:text-slate-100">0.8%</span>
              <span className="text-xs text-slate-400 font-semibold"> Commission Cap</span>
            </div>
            <ul className="text-xs md:text-sm text-slate-450 dark:text-slate-350 space-y-3 mb-6">
              <li className="flex items-center gap-2"><Star size={12} className="text-yellow-500 flex-shrink-0" /> Unlimited Storefront Listing</li>
              <li className="flex items-center gap-2"><Star size={12} className="text-yellow-500 flex-shrink-0" /> Priority Main Page Features</li>
              <li className="flex items-center gap-2"><Star size={12} className="text-yellow-500 flex-shrink-0" /> Instant Real-time Settlement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Active Member Table */}
      <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
        <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Active Members Directory</h3>
            <p className="text-xs text-slate-400 mt-1">Manage agricultural supply partner membership tiers and cycles</p>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-450 uppercase`}>
                <th className="px-6 py-4 min-w-[200px]">Vendor Name</th>
                <th className="px-6 py-4 min-w-[140px]">Membership Level</th>
                <th className="px-6 py-4 min-w-[140px]">Joined Date</th>
                <th className="px-6 py-4 min-w-[140px]">Expiry Date</th>
                <th className="px-6 py-4 min-w-[180px]">Accumulated Revenue</th>
                <th className="px-6 py-4 min-w-[140px]">Status</th>
                <th className="px-6 py-4 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                  <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150 truncate">{m.name}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-3 py-1 rounded-full font-bold text-xs inline-flex items-center justify-center ${
                      m.level === 'Platinum' ? 'bg-purple-500/10 text-purple-500' :
                      m.level === 'Gold' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-slate-500/10 text-slate-450'
                    } whitespace-nowrap`}>
                      {m.level}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-450">{m.joinedDate}</td>
                  <td className="px-6 py-3.5 font-mono text-slate-405">{m.expiryDate}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-200">₹{m.revenue.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap inline-flex items-center justify-center ${m.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button className="text-xs font-bold px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500 hover:text-white transition-all whitespace-nowrap">
                      Upgrade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade History Logs */}
      <div className={`rounded-xl border p-6 md:p-8 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} space-y-4`}>
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Upgrade & Downgrade History Log</h3>
          <p className="text-xs text-slate-400 mt-1">Auditable transitions of partner storefront priority changes</p>
        </div>
        <div className="space-y-4">
          {history.map(item => (
            <div key={item.id} className={`p-4 md:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs md:text-sm ${
              isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-55/50'
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-500 flex-shrink-0">
                  <ArrowUpRight size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.vendor}</h4>
                  <p className="text-2xs text-slate-400 mt-1">{item.type} • {item.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-bold text-xs md:text-sm">
                <span className="text-slate-400">{item.from}</span>
                <span className="text-slate-455">→</span>
                <span className="text-emerald-500">{item.to}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

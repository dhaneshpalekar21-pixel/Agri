import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSuperAdminStore } from '../../store/superAdminStore'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts'
import {
  Image, Plus, Upload, Eye, Play, Pause, Trash2, Calendar, TrendingUp, MousePointerClick,
  BarChart3, Filter, Search, ChevronRight, Edit, Download, RefreshCw, Clock, Globe,
  CheckCircle, AlertCircle, Settings, Megaphone, Zap, Target, ArrowUpRight, ArrowDownRight, Star
} from 'lucide-react'
import toast from 'react-hot-toast'

const bannerClickData = [
  { name: 'Wk 1', Clicks: 8200, Impressions: 410000, CTR: 2.0 },
  { name: 'Wk 2', Clicks: 11400, Impressions: 520000, CTR: 2.2 },
  { name: 'Wk 3', Clicks: 14800, Impressions: 680000, CTR: 2.2 },
  { name: 'Wk 4', Clicks: 18200, Impressions: 820000, CTR: 2.2 },
]

const dailyImpressions = [
  { name: 'Mon', value: 84000 }, { name: 'Tue', value: 96000 }, { name: 'Wed', value: 112000 },
  { name: 'Thu', value: 125000 }, { name: 'Fri', value: 138000 }, { name: 'Sat', value: 155000 }, { name: 'Sun', value: 160000 }
]

const BANNERS = [
  { id: 'BNR-001', name: 'Kharif Season Fertilizer Offer', type: 'Homepage Hero', start: 'Jun 1, 2026', end: 'Aug 31, 2026', impressions: '540,000', clicks: '12,800', ctr: '2.4%', status: 'Scheduled', img: '🌾' },
  { id: 'BNR-002', name: 'Monsoon Pesticide Discount 20%', type: 'Promotional Banner', start: 'May 25, 2026', end: 'Jun 15, 2026', impressions: '820,000', clicks: '18,200', ctr: '2.2%', status: 'Active', img: '🌧️' },
  { id: 'BNR-003', name: 'New Vendor Welcome Banner', type: 'Offer Banner', start: 'Ongoing', end: 'Ongoing', impressions: '340,000', clicks: '7,400', ctr: '2.2%', status: 'Active', img: '🏪' },
  { id: 'BNR-004', name: 'Rabi Season Crop Bundle', type: 'Seasonal Campaign', start: 'Oct 1, 2026', end: 'Dec 31, 2026', impressions: '0', clicks: '0', ctr: '—', status: 'Paused', img: '🌿' },
  { id: 'BNR-005', name: 'AI Disease Detection Feature', type: 'Feature Banner', start: 'May 1, 2026', end: 'Jun 30, 2026', impressions: '210,000', clicks: '5,400', ctr: '2.6%', status: 'Active', img: '🤖' },
]

const BANNER_TYPES = ['Homepage Hero', 'Promotional Banner', 'Offer Banner', 'Seasonal Campaign', 'Feature Banner']

export default function AdvertisementBanners() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'
  const card = `p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`

  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newBanner, setNewBanner] = useState({ name: '', type: 'Homepage Hero', startDate: '', endDate: '' })
  const [previewBanner, setPreviewBanner] = useState(null)
  const [activeMetric, setActiveMetric] = useState('impressions')

  const filteredBanners = BANNERS.filter(b => {
    const matchStatus = statusFilter === 'All' || b.status === statusFilter
    const matchSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.type.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchSearch
  })

  const statusColor = (s) => ({
    'Active': 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    'Scheduled': 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    'Paused': 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  }[s] || 'bg-slate-500/10 text-slate-400')

  const handleCreate = () => {
    if (!newBanner.name) { toast.error('Banner name is required'); return }
    toast.success(`Banner "${newBanner.name}" created successfully!`)
    setShowCreateModal(false)
    setNewBanner({ name: '', type: 'Homepage Hero', startDate: '', endDate: '' })
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">

      {/* PAGE HEADER */}
      <div className={`${card} bg-gradient-to-r from-pink-600/10 to-purple-600/10 border-pink-500/20`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-xl bg-pink-500/15 border border-pink-500/25">
                <Image size={20} className="text-pink-500" />
              </div>
              <h1 className="text-xl font-black tracking-tight font-heading">Advertisement Banners</h1>
            </div>
            <p className="text-xs text-slate-400 font-medium ml-11">
              Manage platform banners, campaigns, scheduling & performance analytics
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toast.success('Analytics report downloaded!')}
              className={`px-3 py-2 rounded-xl border text-2xs font-bold flex items-center gap-1.5 transition-all ${isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
            >
              <Download size={13} /> Export
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-2xs rounded-xl flex items-center gap-1.5 shadow-md shadow-pink-500/20 transition-all"
            >
              <Plus size={13} /> Create Banner
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Active Banners', value: '14', change: '+3', trend: 'up', icon: Image, color: 'text-pink-500', bg: 'bg-pink-500/10' },
          { label: 'Total Impressions (30d)', value: '2.4M', change: '+18.2%', trend: 'up', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Total Banner Clicks', value: '48,200', change: '+12.4%', trend: 'up', icon: MousePointerClick, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Avg. Click-Through Rate', value: '2.2%', change: '+0.4%', trend: 'up', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((kpi, i) => (
          <motion.div key={i} whileHover={{ y: -3 }} className={card}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xs font-bold uppercase tracking-wider text-slate-400">{kpi.label}</p>
                <h3 className="text-xl font-black mt-1.5 font-heading">{kpi.value}</h3>
              </div>
              <div className={`p-2 rounded-xl ${kpi.bg}`}>
                <kpi.icon size={18} className={kpi.color} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {kpi.trend === 'up' ? <ArrowUpRight size={13} className="text-emerald-500" /> : <ArrowDownRight size={13} className="text-rose-500" />}
              <span className="text-3xs font-bold text-emerald-500">{kpi.change}</span>
              <span className="text-3xs text-slate-400">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* BANNER TYPES QUICK FILTERS */}
      <div className={card}>
        <h4 className="text-xs font-bold mb-3 text-slate-700 dark:text-slate-200">Banner Categories</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { type: 'Homepage Banners', count: 3, icon: '🏠', color: 'from-pink-500/10 to-rose-500/10 border-pink-500/20' },
            { type: 'Promotional Banners', count: 5, icon: '🎯', color: 'from-orange-500/10 to-amber-500/10 border-orange-500/20' },
            { type: 'Seasonal Campaigns', count: 4, icon: '🌾', color: 'from-emerald-500/10 to-green-500/10 border-emerald-500/20' },
            { type: 'Offer Banners', count: 6, icon: '💸', color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20' },
            { type: 'Feature Banners', count: 2, icon: '✨', color: 'from-purple-500/10 to-violet-500/10 border-purple-500/20' },
          ].map((cat, i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }} className={`p-3 rounded-xl border bg-gradient-to-br ${cat.color} cursor-pointer`}>
              <div className="text-lg mb-1">{cat.icon}</div>
              <p className="text-3xs font-bold text-slate-700 dark:text-slate-200 leading-tight">{cat.type}</p>
              <p className="text-4xs text-slate-400 mt-0.5">{cat.count} banners</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ANALYTICS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Click Performance */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold">Banner Click Performance Trends</h4>
            <div className="flex gap-1">
              {['impressions', 'clicks', 'ctr'].map(m => (
                <button key={m} onClick={() => setActiveMetric(m)}
                  className={`px-2 py-1 rounded-lg text-3xs font-bold transition-all capitalize ${activeMetric === m ? 'bg-pink-600 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bannerClickData}>
                <defs>
                  <linearGradient id="bannerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ background: isDark ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} />
                <Area type="monotone" dataKey={activeMetric === 'impressions' ? 'Impressions' : activeMetric === 'clicks' ? 'Clicks' : 'CTR'}
                  stroke="#ec4899" fill="url(#bannerGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Impressions */}
        <div className={card}>
          <h4 className="text-xs font-bold mb-4">Daily Impression Volume (This Week)</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyImpressions}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: isDark ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} formatter={v => [`${(v/1000).toFixed(0)}K`, 'Impressions']} />
                <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BANNER TABLE */}
      <div className={card}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h4 className="text-xs font-bold">Active Banner Registry</h4>
          <div className="flex gap-2">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-2xs ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <Search size={12} className="text-slate-400" />
              <input type="text" placeholder="Search banners..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none placeholder-slate-400 w-32 text-3xs" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-3xs outline-none ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              {['All', 'Active', 'Scheduled', 'Paused'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} text-slate-400 uppercase font-bold text-3xs`}>
                <th className="py-3 px-3">Banner</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Schedule</th>
                <th className="py-3 px-3">Impressions</th>
                <th className="py-3 px-3">Clicks</th>
                <th className="py-3 px-3">CTR</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBanners.map((b, i) => (
                <motion.tr key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={`border-b ${isDark ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-slate-50 hover:bg-slate-50/80'} transition-colors`}>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20 flex items-center justify-center text-base">{b.img}</div>
                      <div>
                        <p className="text-2xs font-extrabold text-slate-800 dark:text-slate-100">{b.name}</p>
                        <p className="text-3xs text-slate-400">{b.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-3xs text-slate-500 font-semibold">{b.type}</td>
                  <td className="py-3 px-3 text-3xs text-slate-400">
                    <div className="flex items-center gap-1"><Calendar size={10} />{b.start}</div>
                    <div className="flex items-center gap-1 text-slate-300"><ChevronRight size={8} />{b.end}</div>
                  </td>
                  <td className="py-3 px-3 text-2xs font-bold text-blue-500">{b.impressions}</td>
                  <td className="py-3 px-3 text-2xs font-bold text-purple-500">{b.clicks}</td>
                  <td className="py-3 px-3 text-2xs font-bold text-emerald-500">{b.ctr}</td>
                  <td className="py-3 px-3"><span className={`text-3xs px-2.5 py-0.5 rounded-full font-bold ${statusColor(b.status)}`}>{b.status}</span></td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setPreviewBanner(b)} className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}><Eye size={13} /></button>
                      <button onClick={() => toast.success(`Editing ${b.name}`)} className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}><Edit size={13} /></button>
                      {b.status === 'Active' ? (
                        <button onClick={() => toast.success(`Banner paused`)} className={`p-1.5 rounded-lg text-amber-500 ${isDark ? 'hover:bg-amber-500/10' : 'hover:bg-amber-50'}`}><Pause size={13} /></button>
                      ) : (
                        <button onClick={() => toast.success(`Banner activated`)} className={`p-1.5 rounded-lg text-emerald-500 ${isDark ? 'hover:bg-emerald-500/10' : 'hover:bg-emerald-50'}`}><Play size={13} /></button>
                      )}
                      <button onClick={() => toast.success(`Banner deleted`)} className={`p-1.5 rounded-lg text-rose-500 ${isDark ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50'}`}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BANNER SCHEDULING CONTROLS + PERFORMANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheduling */}
        <div className={card}>
          <h4 className="text-xs font-bold mb-4 flex items-center gap-2"><Clock size={14} className="text-pink-500" /> Banner Scheduling</h4>
          <div className="space-y-3 text-2xs">
            {[
              { label: 'Upcoming (7 days)', count: 3, color: 'text-blue-500' },
              { label: 'Ending Soon (3 days)', count: 1, color: 'text-amber-500' },
              { label: 'Expired (this month)', count: 2, color: 'text-slate-400' },
              { label: 'Auto-Renew Enabled', count: 5, color: 'text-emerald-500' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-2.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <span className="text-slate-500 font-semibold">{item.label}</span>
                <span className={`font-black text-sm ${item.color}`}>{item.count}</span>
              </div>
            ))}
            <button onClick={() => toast.success('Schedule updated!')} className="w-full mt-2 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-2xs rounded-xl flex items-center justify-center gap-1.5 transition-all">
              <Calendar size={13} /> Manage Schedule
            </button>
          </div>
        </div>

        {/* Top Performing */}
        <div className={`${card} lg:col-span-2`}>
          <h4 className="text-xs font-bold mb-4 flex items-center gap-2"><Star size={14} className="text-amber-500" /> Top Performing Banners</h4>
          <div className="space-y-3">
            {[
              { name: 'Monsoon Pesticide Discount 20%', impressions: '820K', clicks: '18.2K', ctr: '2.22%', bg: '🌧️' },
              { name: 'AI Disease Detection Feature', impressions: '210K', clicks: '5.4K', ctr: '2.57%', bg: '🤖' },
              { name: 'New Vendor Welcome Banner', impressions: '340K', clicks: '7.4K', ctr: '2.18%', bg: '🏪' },
            ].map((p, i) => (
              <div key={i} className={`p-3.5 rounded-xl border flex items-center gap-4 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center text-xl">{p.bg}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xs font-extrabold truncate text-slate-800 dark:text-slate-100">{p.name}</p>
                  <p className="text-3xs text-slate-400">{p.impressions} impressions · {p.clicks} clicks</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-emerald-500">{p.ctr}</span>
                  <p className="text-3xs text-slate-400">CTR</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CREATE BANNER MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className="text-sm font-black mb-4 flex items-center gap-2"><Plus size={16} className="text-pink-500" /> Create New Banner</h3>
              <div className="space-y-4 text-2xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold uppercase text-3xs">Campaign Name *</label>
                  <input type="text" value={newBanner.name} onChange={e => setNewBanner({...newBanner, name: e.target.value})}
                    placeholder="e.g. Kharif Season Mega Sale" className={`w-full p-3 rounded-xl border outline-none focus:border-pink-500 transition-colors ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold uppercase text-3xs">Banner Type</label>
                  <select value={newBanner.type} onChange={e => setNewBanner({...newBanner, type: e.target.value})}
                    className={`w-full p-3 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    {BANNER_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold uppercase text-3xs">Start Date</label>
                    <input type="date" value={newBanner.startDate} onChange={e => setNewBanner({...newBanner, startDate: e.target.value})}
                      className={`w-full p-3 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold uppercase text-3xs">End Date</label>
                    <input type="date" value={newBanner.endDate} onChange={e => setNewBanner({...newBanner, endDate: e.target.value})}
                      className={`w-full p-3 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                </div>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-pink-500 transition-colors ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
                  onClick={() => toast.success('Image upload dialog opened!')}>
                  <Upload size={20} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-3xs text-slate-400 font-semibold">Click to upload banner image</p>
                  <p className="text-4xs text-slate-500 mt-1">PNG, JPG up to 5MB · 1920×600px recommended</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowCreateModal(false)} className={`flex-1 py-2.5 rounded-xl border font-bold text-2xs ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} transition-all`}>Cancel</button>
                  <button onClick={handleCreate} className="flex-1 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-2xs rounded-xl transition-all shadow-md shadow-pink-500/20">Create Banner</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewBanner && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPreviewBanner(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-2xl border p-6 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className="text-xs font-black mb-4">Banner Preview: {previewBanner.name}</h3>
              <div className="w-full h-40 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mb-4">
                <div className="text-center text-white">
                  <div className="text-5xl mb-2">{previewBanner.img}</div>
                  <p className="font-black text-sm">{previewBanner.name}</p>
                  <p className="text-xs opacity-80">{previewBanner.type}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-2xs">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                  <p className="text-slate-400">Impressions</p>
                  <p className="font-black text-sm mt-1">{previewBanner.impressions}</p>
                </div>
                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                  <p className="text-slate-400">Clicks</p>
                  <p className="font-black text-sm text-pink-500 mt-1">{previewBanner.clicks}</p>
                </div>
                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                  <p className="text-slate-400">CTR</p>
                  <p className="font-black text-sm text-emerald-500 mt-1">{previewBanner.ctr}</p>
                </div>
              </div>
              <button onClick={() => setPreviewBanner(null)} className="w-full mt-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-2xs rounded-xl transition-all">Close Preview</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

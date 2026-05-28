import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import {
  Store, Users, IndianRupee, TrendingUp, Activity, Crown, Globe, Shield, UserCog,
  Briefcase, Boxes, ShoppingCart, Coins, BrainCircuit, Megaphone, MessageSquare,
  BarChart3, Lock, BellRing, Landmark, Cpu, Terminal, Plus, ShieldAlert,
  Search, ArrowUpRight, ArrowDownRight, Settings, CheckCircle2, AlertTriangle, FileText, Check, Ban
} from 'lucide-react'
import KPICard from '../../components/KPICard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts'

// Mock Data
const revenueData = [
  { month: 'Jan', revenue: 145000 },
  { month: 'Feb', revenue: 162000 },
  { month: 'Mar', revenue: 198000 },
  { month: 'Apr', revenue: 175000 },
  { month: 'May', revenue: 221000 },
  { month: 'Jun', revenue: 248000 },
]

const shops = [
  { name: 'Patil Krushi Kendra', city: 'Pune', plan: 'Pro', revenue: 48000, status: 'active' },
  { name: 'Shinde Agro Supplies', city: 'Nashik', plan: 'Basic', revenue: 31000, status: 'active' },
  { name: 'Kumar Seeds Store', city: 'Aurangabad', plan: 'Pro', revenue: 55000, status: 'active' },
  { name: 'Deshpande Fertilizers', city: 'Kolhapur', plan: 'Trial', revenue: 12000, status: 'trial' },
  { name: 'Jadhav Agri Center', city: 'Solapur', plan: 'Basic', revenue: 28000, status: 'active' },
]

export default function SuperAdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  // Dynamic Theme state just for helper styling within panel
  const isDark = document.documentElement.classList.contains('dark')

  // RENDER DYNAMIC ERP VIEWPORTS
  const renderViewport = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard title="Total Shops" value={42} subtitle="Active on platform" icon={Store} color="green" trend="up" trendValue={8.3} />
              <KPICard title="Total Users" value={186} subtitle="Across all shops" icon={Users} color="blue" trend="up" trendValue={14.2} />
              <KPICard title="Monthly Revenue" value={248000} prefix="₹" subtitle="Platform MRR" icon={IndianRupee} color="purple" trend="up" trendValue={18.7} />
              <KPICard title="Active Subscriptions" value={38} subtitle="4 on trial" icon={Crown} color="orange" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-slate-100">
                <h3 className="font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Platform Revenue (6 Months)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Shops Table */}
              <div className="table-wrapper bg-white dark:bg-slate-900 border dark:border-slate-800">
                <div className="table-header dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Poppins, sans-serif' }}>Active Shops</h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      {['Shop', 'City', 'Plan', 'Revenue'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {shops.map((s, i) => (
                      <tr key={i} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200">{s.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{s.city}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: s.plan === 'Pro' ? '#ecfdf5' : s.plan === 'Basic' ? '#eff6ff' : '#fefce8',
                              color: s.plan === 'Pro' ? '#059669' : s.plan === 'Basic' ? '#1d4ed8' : '#854d0e',
                            }}>
                            {s.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-slate-900 dark:text-slate-100">₹{s.revenue.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      // Live Analytics
      case 'live-analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="kpi-card bg-gradient-to-tr from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 text-slate-800 dark:text-slate-100">
                <p className="text-xs font-semibold text-slate-500">Live Active Sessions</p>
                <h4 className="text-2xl font-black text-emerald-500 mt-1">428</h4>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">● Real-time user feeds</span>
              </div>
              <div className="kpi-card bg-gradient-to-tr from-blue-500/10 to-indigo-500/5 border border-blue-500/20 text-slate-800 dark:text-slate-100">
                <p className="text-xs font-semibold text-slate-500">Hourly API Requests</p>
                <h4 className="text-2xl font-black text-blue-500 mt-1">18.4k</h4>
                <span className="text-[10px] text-blue-600 font-bold block mt-1">↑ 12% vs last hour</span>
              </div>
              <div className="kpi-card bg-gradient-to-tr from-purple-500/10 to-pink-500/5 border border-purple-500/20 text-slate-800 dark:text-slate-100">
                <p className="text-xs font-semibold text-slate-500">Active IoT Nodes</p>
                <h4 className="text-2xl font-black text-purple-500 mt-1">1,208</h4>
                <span className="text-[10px] text-purple-600 font-bold block mt-1">● 98.4% uptime connection</span>
              </div>
            </div>
            <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Traffic Stream (Live)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={[
                  { time: '11:00', load: 120 },
                  { time: '11:10', load: 180 },
                  { time: '11:20', load: 240 },
                  { time: '11:30', load: 210 },
                  { time: '11:40', load: 380 },
                  { time: '11:50', load: 428 },
                ]}>
                  <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="load" stroke="#10b981" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )

      // Revenue Stats
      case 'revenue-stats':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Monthly Target Progress</h3>
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '78%' }} />
                </div>
                <div className="flex justify-between text-xs mt-2 text-slate-400">
                  <span>Current: ₹2,48,000</span>
                  <span>Target: ₹3,10,000 (78%)</span>
                </div>
              </div>
              <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Revenue Splits</h3>
                <div className="grid grid-cols-3 gap-2 text-center mt-3">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                    <p className="text-[10px] text-slate-500 font-bold">Sub plans</p>
                    <p className="text-sm font-black text-emerald-500">62%</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                    <p className="text-[10px] text-slate-500 font-bold">Vendor Comm</p>
                    <p className="text-sm font-black text-blue-500">28%</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                    <p className="text-[10px] text-slate-500 font-bold">IoT API Sales</p>
                    <p className="text-sm font-black text-purple-500">10%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      // Website Settings / Platform Management
      case 'website-settings':
      case 'app-settings':
      case 'branding':
      case 'theme-customization':
      case 'landing-editor':
      case 'banner-mgmt':
      case 'seo-settings':
      case 'language-settings':
      case 'maintenance-mode':
        return (
          <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-3xl">
            <div className="flex items-center gap-3 mb-6 border-b pb-4 dark:border-slate-800">
              <Globe className="text-emerald-500 w-6 h-6" />
              <div>
                <h2 className="text-base font-bold uppercase tracking-wider">{activeTab.replace('-', ' ')}</h2>
                <p className="text-xs text-slate-400">Configure global parameters and branding options for the application suite</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Platform Master Domain</label>
                <input type="text" defaultValue="https://agri-erp.agztech.com" className="input-field dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Default Base Currency</label>
                  <select className="input-field dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Primary Accent Theme</label>
                  <select className="input-field dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100">
                    <option>Emerald Green (Default)</option>
                    <option>Ocean Blue</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
                <CheckCircle2 className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  All branding and assets configurations will propagate automatically to vendor portals, employee timesheets, and invoices.
                </span>
              </div>

              <button className="btn-primary mt-2">Save Configuration</button>
            </div>
          </div>
        )

      // Admin / User Management Viewports
      case 'create-admin':
      case 'manage-admins':
      case 'permissions':
      case 'activity-logs':
        return (
          <div className="space-y-6">
            <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800">
              <div className="flex items-center justify-between border-b pb-4 mb-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <UserCog className="text-emerald-500 w-6 h-6" />
                  <h3 className="font-bold text-base uppercase tracking-wider">{activeTab.replace('-', ' ')}</h3>
                </div>
                <button className="btn-primary flex items-center gap-1.5 text-xs">
                  <Plus size={14} /> Add System Handler
                </button>
              </div>

              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 border-b dark:border-slate-800">
                    <th className="py-2.5 text-left font-bold uppercase">Name</th>
                    <th className="py-2.5 text-left font-bold uppercase">Role Code</th>
                    <th className="py-2.5 text-left font-bold uppercase">Last Active</th>
                    <th className="py-2.5 text-left font-bold uppercase">Uptime Logs</th>
                    <th className="py-2.5 text-right font-bold uppercase">Controls</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b dark:border-slate-800">
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">Arjun Patil</td>
                    <td className="py-3 text-slate-500">SEC_HANDLER_ROOT</td>
                    <td className="py-3 text-slate-500">2m ago</td>
                    <td className="py-3 text-emerald-500 font-bold">100% active</td>
                    <td className="py-3 text-right">
                      <button className="text-[10px] text-slate-400 hover:text-emerald-500 font-bold">Revoke</button>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-slate-800">
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">Priyah Shinde</td>
                    <td className="py-3 text-slate-500">DB_OPERATOR</td>
                    <td className="py-3 text-slate-500">1h ago</td>
                    <td className="py-3 text-emerald-500 font-bold">99.2% active</td>
                    <td className="py-3 text-right">
                      <button className="text-[10px] text-slate-400 hover:text-emerald-500 font-bold">Revoke</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )

      // Vendor management
      case 'vendor-approval':
      case 'vendor-verification':
      case 'vendor-products':
      case 'vendor-performance':
      case 'commission-settings':
      case 'vendor-payments':
      case 'vendor-complaints':
      case 'suspend-vendor':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-slate-200">
                <p className="text-xs font-semibold text-slate-500">Approved Vendors</p>
                <h4 className="text-xl font-bold mt-1">118 shops</h4>
              </div>
              <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-slate-200">
                <p className="text-xs font-semibold text-slate-500">Pending Approvals</p>
                <h4 className="text-xl font-bold mt-1 text-amber-500">3 applications</h4>
              </div>
              <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-slate-200">
                <p className="text-xs font-semibold text-slate-500">Commission Earned (MTD)</p>
                <h4 className="text-xl font-bold mt-1 text-emerald-500">₹69,420</h4>
              </div>
            </div>

            <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 uppercase text-xs tracking-wider">Pending Approvals Pipeline</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b dark:border-slate-800 text-slate-400">
                    <th className="py-2.5 text-left">Vendor Shop</th>
                    <th className="py-2.5 text-left">District</th>
                    <th className="py-2.5 text-left">License status</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b dark:border-slate-800">
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">Jai Kisan Seeds & Tools</td>
                    <td className="py-3 text-slate-500">Satara</td>
                    <td className="py-3"><span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">VERIFIED</span></td>
                    <td className="py-3 text-right space-x-2">
                      <button className="text-[10px] font-bold text-emerald-500 hover:underline">Approve</button>
                      <button className="text-[10px] font-bold text-red-500 hover:underline">Reject</button>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-slate-800">
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">Sai Agro Agencies</td>
                    <td className="py-3 text-slate-500">Sangli</td>
                    <td className="py-3"><span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">PENDING ATTACHMENT</span></td>
                    <td className="py-3 text-right space-x-2">
                      <button className="text-[10px] font-bold text-slate-400 cursor-not-allowed">Approve</button>
                      <button className="text-[10px] font-bold text-red-500 hover:underline">Reject</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )

      // AI Services Viewport
      case 'crop-rec':
      case 'disease-detect':
      case 'weather-predict':
      case 'yield-predict':
      case 'chatbot-monitor':
      case 'dataset-mgmt':
      case 'ai-analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Engine Uptime</p>
                <p className="text-xl font-bold text-emerald-500 mt-1">99.98%</p>
              </div>
              <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model Inference Time</p>
                <p className="text-xl font-bold text-indigo-500 mt-1">142ms</p>
              </div>
              <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Inferences</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">42,810</p>
              </div>
              <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dataset Samples</p>
                <p className="text-xl font-bold text-emerald-500 mt-1">480k rows</p>
              </div>
            </div>

            <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800">
              <div className="flex items-center justify-between border-b pb-4 mb-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="text-emerald-500 w-6 h-6" />
                  <h3 className="font-bold text-base uppercase tracking-wider">{activeTab.replace('-', ' ')} Controls</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-extrabold uppercase animate-pulse">Running Version 2.4.1-Prod</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Confidence Level Threshold Selector</p>
                  <input type="range" className="w-full accent-emerald-500" defaultValue="85" />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold">
                    <span>Speed optimized (50%)</span>
                    <span>Standard (85%)</span>
                    <span>Precision (98%)</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Automated Alert Logs</p>
                  <div className="space-y-1.5 mt-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Model.DiseaseDetect loaded</span>
                      <span className="text-[10px]">10:42:01</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Dataset.WeatherRec updated</span>
                      <span className="text-[10px]">09:12:55</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      // Fallback for remaining detailed screens
      default:
        return (
          <div className="kpi-card bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-4xl">
            <div className="flex items-center justify-between border-b pb-4 mb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Settings className="text-emerald-500 w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
                <div>
                  <h2 className="text-base font-extrabold uppercase tracking-wider">{activeTab.replace(/-/g, ' ')}</h2>
                  <p className="text-xs text-slate-500">Live operational panel synced with main ERP scheduler</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                Online Sync
              </span>
            </div>

            <div className="space-y-6">
              {/* Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Active Processes</span>
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-100">14 Jobs</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Queue Latency</span>
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-100">1.2ms</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Status Code</span>
                  <span className="text-lg font-bold text-emerald-500">200 OK</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Data Stream</span>
                  <span className="text-lg font-bold text-indigo-500">Secured</span>
                </div>
              </div>

              {/* Fake Table Logs */}
              <div className="border dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-950/40 px-4 py-2.5 border-b dark:border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity Streams</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="font-semibold text-slate-300">Action handler [System:INIT_SEC] executed successfully</span>
                    <span>11:34 AM</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="font-semibold text-slate-300">Broadcast listener dispatched notification updates</span>
                    <span>11:21 AM</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="font-semibold text-slate-300">Clean cache index files completed</span>
                    <span>10:55 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            SUPER CONSOLE <span className="text-emerald-500">👑</span>
          </h1>
          <p className="text-xs text-slate-400">Agricultural ERP System HQ Control Center</p>
        </div>
      </div>

      {renderViewport()}
    </div>
  )
}

import React, { useState } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  TrendingUp, Award, IndianRupee, Users, Store, ShieldAlert, Cpu, Database, Settings, ShieldCheck, Sprout, Sparkles, Tractor, Smartphone, User, X, FlaskConical, Camera,
  CheckCircle, AlertTriangle, Eye, ArrowRight, Play, Upload, Save, PlayCircle, RefreshCw, Send, Plus, Search, Trash2, MapPin,
  ShoppingBag, Truck, Package, UserCheck, AlertCircle, Clock, ArrowUpRight, ArrowDownRight, Activity, Percent, Shield, Calendar, Globe,
  Mail, Phone, Lock, Edit, Download, FileText, Check, XCircle, ThumbsUp, Ban, LockOpen, Sliders, Star, Megaphone, Briefcase, Boxes
} from 'lucide-react'

// Colors for Pie Charts
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

export default function SuperAdminDashboard() {
  const { activeCategory, activeSubItem, theme } = useSuperAdminStore()

  // State elements for interactive demo features
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [commissionRate, setCommissionRate] = useState(10)
  const [successMsg, setSuccessMsg] = useState('')
  const [searchFilter, setSearchFilter] = useState('')

  // Selected metrics for the Live Analytics interactive panels
  const [activeRevenueMetric, setActiveRevenueMetric] = useState('daily')
  const [activeOrderMetric, setActiveOrderMetric] = useState('perDay')
  const [activeGrowthMetric, setActiveGrowthMetric] = useState('farmerReg')

  // Farmer/User Management specific states
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [kycPreviewDoc, setKycPreviewDoc] = useState(null)
  const [walletTxType, setWalletTxType] = useState('All')
  const [newCampaignName, setNewCampaignName] = useState('')
  const [newCampaignPoints, setNewCampaignPoints] = useState(100)
  const [notifChannel, setNotifChannel] = useState('Push')
  const [notifAudience, setNotifAudience] = useState('All Farmers')
  const [notifContent, setNotifContent] = useState('')
  const [selectedComplaintId, setSelectedComplaintId] = useState(null)
  const [complaintReplyText, setComplaintReplyText] = useState('')
  const [suspensionReason, setSuspensionReason] = useState('Multiple policy violations')
  const [suspensionType, setSuspensionType] = useState('Temporary')

  // Employee Management specific states
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isEditingEmployee, setIsEditingEmployee] = useState(false)
  const [payrollMonth, setPayrollMonth] = useState('May 2026')
  const [salaryFilter, setSalaryFilter] = useState('All')
  const [gpsActiveStaff, setGpsActiveStaff] = useState('EMP-401')
  const [activeShiftFilter, setActiveShiftFilter] = useState('All')
  const [leaveFilter, setLeaveFilter] = useState('Pending')

  // Product & Inventory specific states
  const [selectedProdId, setSelectedProdId] = useState(null)
  const [pricingBaseRate, setPricingBaseRate] = useState(450)
  const [generatedCoupon, setGeneratedCoupon] = useState('AGRI-FLASH-15')
  const [discountPercent, setDiscountPercent] = useState(15)
  const [warehouseCapacityFilter, setWarehouseCapacityFilter] = useState('All')
  const [activeTransferId, setActiveTransferId] = useState('TRSF-202')
  const [scannedBarcode, setScannedBarcode] = useState('8901058002315')

  // Orders & Delivery specific states
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [activeRefundId, setActiveRefundId] = useState(null)
  const [deliveryChargeBase, setDeliveryChargeBase] = useState(50)
  const [activeTrackingOrder, setActiveTrackingOrder] = useState('ORD-9821')
  const [routeEfficiencyFilter, setRouteEfficiencyFilter] = useState('All')
  const [failedAttemptId, setFailedAttemptId] = useState(null)

  // Financial Management specific states
  const [selectedTxnId, setSelectedTxnId] = useState(null)
  const [activeRevenuePeriod, setActiveRevenuePeriod] = useState('Monthly')
  const [taxFilterRegion, setTaxFilterRegion] = useState('All')
  const [activeProfitForecastVal, setActiveProfitForecastVal] = useState(1200000)

  // AI Services specific states
  const [aiCropSoilPh, setAiCropSoilPh] = useState(6.5)
  const [aiCropMoisture, setAiCropMoisture] = useState(45)
  const [aiCropTemp, setAiCropTemp] = useState(28)
  const [aiCropRegion, setAiCropRegion] = useState('All')
  const [aiDiseaseScanFile, setAiDiseaseScanFile] = useState(null)
  const [aiDiseaseScanResult, setAiDiseaseScanResult] = useState(null)
  const [aiWeatherRegion, setAiWeatherRegion] = useState('Maharashtra')
  const [aiYieldCrop, setAiYieldCrop] = useState('Cotton')
  const [aiYieldRegion, setAiYieldRegion] = useState('Central District')
  const [aiChatbotActiveUser, setAiChatbotActiveUser] = useState('USR-821')
  const [aiDatasetCategory, setAiDatasetCategory] = useState('All')
  const [aiDatasetUploadName, setAiDatasetUploadName] = useState('')
  const [aiAnalyticsTimeframe, setAiAnalyticsTimeframe] = useState('7D')

  // Marketing & Promotions specific states
  const [bannerStatusFilter, setBannerStatusFilter] = useState('All')
  const [newBannerName, setNewBannerName] = useState('')
  const [newCouponCode, setNewCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(15)
  const [couponType, setCouponType] = useState('Percentage')
  const [pushNotifTitle, setPushNotifTitle] = useState('')
  const [pushNotifBody, setPushNotifBody] = useState('')
  const [pushAudience, setPushAudience] = useState('All Farmers')
  const [smsCampaignText, setSmsCampaignText] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [waMessage, setWaMessage] = useState('')
  const [socialPlatform, setSocialPlatform] = useState('Facebook')
  const [mktAnalyticsView, setMktAnalyticsView] = useState('7D')

  const handleSave = (msg = 'Configuration saved successfully!') => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  // Mini SVG Sparkline Component for KPI cards
  const Sparkline = ({ data, color = "#10b981" }) => {
    if (!data || data.length === 0) return null
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min === 0 ? 1 : max - min
    const width = 80
    const height = 24
    const points = data
      .map((val, index) => {
        const x = (index / (data.length - 1)) * width
        const y = height - ((val - min) / range) * height
        return `${x},${y}`
      })
      .join(' ')
    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    )
  }

  // --- MOCK DATA ---
  const revenueData = [
    { name: 'Jan', Sales: 4000, Profit: 2400 },
    { name: 'Feb', Sales: 3000, Profit: 1398 },
    { name: 'Mar', Sales: 9800, Profit: 5200 },
    { name: 'Apr', Sales: 6780, Profit: 3908 },
    { name: 'May', Sales: 1890, Profit: 4800 },
    { name: 'Jun', Sales: 2390, Profit: 3800 },
  ]

  const liveTraffic = [
    { time: '12:00', users: 120 },
    { time: '12:10', users: 150 },
    { time: '12:20', users: 180 },
    { time: '12:30', users: 220 },
    { time: '12:40', users: 260 },
    { time: '12:50', users: 310 },
  ]

  const pieData = [
    { name: 'Fertilizers', value: 400 },
    { name: 'Seeds', value: 300 },
    { name: 'Pesticides', value: 300 },
    { name: 'Tools', value: 200 },
  ]

  // Live Analytics Detailed Metrics Data
  const dailyRevenue = [
    { name: 'Mon', value: 12000 },
    { name: 'Tue', value: 19000 },
    { name: 'Wed', value: 15000 },
    { name: 'Thu', value: 25000 },
    { name: 'Fri', value: 22000 },
    { name: 'Sat', value: 30000 },
    { name: 'Sun', value: 34000 }
  ]
  const weeklyRevenue = [
    { name: 'Wk 1', value: 120000 },
    { name: 'Wk 2', value: 150000 },
    { name: 'Wk 3', value: 180000 },
    { name: 'Wk 4', value: 140000 },
    { name: 'Wk 5', value: 210000 },
    { name: 'Wk 6', value: 230000 }
  ]
  const monthlyRevenue = [
    { name: 'Jan', value: 850000 },
    { name: 'Feb', value: 920000 },
    { name: 'Mar', value: 1100000 },
    { name: 'Apr', value: 1050000 },
    { name: 'May', value: 1245800 }
  ]

  const ordersPerDay = [
    { name: 'Mon', value: 150 },
    { name: 'Tue', value: 230 },
    { name: 'Wed', value: 210 },
    { name: 'Thu', value: 300 },
    { name: 'Fri', value: 280 },
    { name: 'Sat', value: 340 },
    { name: 'Sun', value: 380 }
  ]
  const deliveredOrders = [
    { name: 'Mon', value: 142 },
    { name: 'Tue', value: 215 },
    { name: 'Wed', value: 202 },
    { name: 'Thu', value: 290 },
    { name: 'Fri', value: 268 },
    { name: 'Sat', value: 328 },
    { name: 'Sun', value: 365 }
  ]
  const cancelledOrders = [
    { name: 'Mon', value: 8 },
    { name: 'Tue', value: 15 },
    { name: 'Wed', value: 8 },
    { name: 'Thu', value: 10 },
    { name: 'Fri', value: 12 },
    { name: 'Sat', value: 12 },
    { name: 'Sun', value: 15 }
  ]

  const farmerRegistrations = [
    { name: 'Mon', value: 80 },
    { name: 'Tue', value: 120 },
    { name: 'Wed', value: 95 },
    { name: 'Thu', value: 140 },
    { name: 'Fri', value: 130 },
    { name: 'Sat', value: 170 },
    { name: 'Sun', value: 210 }
  ]
  const vendorGrowth = [
    { name: 'Mon', value: 5 },
    { name: 'Tue', value: 8 },
    { name: 'Wed', value: 4 },
    { name: 'Thu', value: 12 },
    { name: 'Fri', value: 10 },
    { name: 'Sat', value: 15 },
    { name: 'Sun', value: 18 }
  ]
  const deliverySuccessRate = [
    { name: 'Mon', value: 95 },
    { name: 'Tue', value: 96 },
    { name: 'Wed', value: 94 },
    { name: 'Thu', value: 97 },
    { name: 'Fri', value: 96 },
    { name: 'Sat', value: 98 },
    { name: 'Sun', value: 97 }
  ]

  const revenueVsExpense = [
    { name: 'Jan', Revenue: 850000, Expense: 610000 },
    { name: 'Feb', Revenue: 920000, Expense: 680000 },
    { name: 'Mar', Revenue: 1100000, Expense: 820000 },
    { name: 'Apr', Revenue: 1050000, Expense: 790000 },
    { name: 'May', Revenue: 1245800, Expense: 890000 }
  ]

  // Render functions for different categories
  const renderContent = () => {
    switch (activeCategory) {
      case 'Dashboard':
        return (
          <div className="space-y-8 animate-fade-in pb-12">
            
            {/* 1. OVERVIEW SECTION (8 KPI CARDS) */}
            {(activeSubItem === 'Overview' || activeSubItem === 'Dashboard') && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
                    <Activity size={16} />
                  </span>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">System Performance Overview</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: 'Total Revenue', value: '₹12,45,800', change: '+18.4%', trend: 'up', trendData: [10, 12, 11, 15, 13, 17, 20], icon: IndianRupee, color: 'text-emerald-500', glow: 'shadow-emerald-500/5 hover:border-emerald-500/30' },
                    { title: 'Total Orders', value: '18,240', change: '+14.2%', trend: 'up', trendData: [15, 14, 18, 17, 22, 21, 24], icon: ShoppingBag, color: 'text-blue-500', glow: 'shadow-blue-500/5 hover:border-blue-500/30' },
                    { title: 'Total Farmers', value: '45,200', change: '+12.1%', trend: 'up', trendData: [8, 10, 11, 13, 12, 14, 16], icon: Users, color: 'text-indigo-500', glow: 'shadow-indigo-500/5 hover:border-indigo-500/30' },
                    { title: 'Total Vendors', value: '1,240', change: '+4.5%', trend: 'up', trendData: [2, 3, 3, 4, 5, 4, 6], icon: Store, color: 'text-amber-500', glow: 'shadow-amber-500/5 hover:border-amber-500/30' },
                    { title: 'Total Deliveries', value: '16,850', change: '+15.8%', trend: 'up', trendData: [10, 13, 12, 16, 15, 18, 22], icon: Truck, color: 'text-sky-500', glow: 'shadow-sky-500/5 hover:border-sky-500/30' },
                    { title: 'Total Products', value: '8,430', change: '+8.2%', trend: 'up', trendData: [20, 21, 22, 23, 24, 25, 26], icon: Package, color: 'text-purple-500', glow: 'shadow-purple-500/5 hover:border-purple-500/30' },
                    { title: 'Active Employees', value: '342', change: '+6.0%', trend: 'up', trendData: [4, 4, 5, 5, 6, 6, 7], icon: UserCheck, color: 'text-teal-500', glow: 'shadow-teal-500/5 hover:border-teal-500/30' },
                    { title: 'Pending Complaints', value: '28', change: '-10.5%', trend: 'down', trendData: [15, 14, 12, 10, 8, 7, 5], icon: AlertCircle, color: 'text-rose-500', glow: 'shadow-rose-500/5 hover:border-rose-500/30' }
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -4, scale: 1.015 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between h-32 transition-colors duration-200 ${card.glow}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-3xs font-bold uppercase tracking-wider text-slate-400">{card.title}</p>
                          <h3 className="text-base font-black mt-1 font-heading text-slate-800 dark:text-slate-100">{card.value}</h3>
                        </div>
                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'} ${card.color}`}>
                          <card.icon size={16} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1">
                          {card.trend === 'up' ? (
                            <ArrowUpRight size={14} className="text-emerald-500" />
                          ) : (
                            <ArrowDownRight size={14} className="text-rose-500" />
                          )}
                          <span className={`text-3xs font-bold ${
                            card.title === 'Pending Complaints' 
                              ? 'text-emerald-500' 
                              : card.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
                          }`}>
                            {card.change}
                          </span>
                          <span className="text-3xs text-slate-400">MoM</span>
                        </div>
                        <div className="opacity-95">
                          <Sparkline data={card.trendData} color={card.trend === 'up' ? '#10b981' : '#ef4444'} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. LIVE ANALYTICS SECTION (INTERACTIVE CHARTS) */}
            {activeSubItem === 'Live Analytics' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
                    <TrendingUp size={16} />
                  </span>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">Realtime Platform Analytics</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Card 1: Revenue Trends */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Revenue Trends</h4>
                      <select
                        value={activeRevenueMetric}
                        onChange={(e) => setActiveRevenueMetric(e.target.value)}
                        className={`text-3xs font-semibold p-1.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                      >
                        <option value="daily">Daily Revenue</option>
                        <option value="weekly">Weekly Revenue</option>
                        <option value="monthly">Monthly Revenue</option>
                      </select>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={
                            activeRevenueMetric === 'daily' ? dailyRevenue :
                            activeRevenueMetric === 'weekly' ? weeklyRevenue : monthlyRevenue
                          }
                        >
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={(val) => `₹${val >= 1000 ? (val/1000) + 'k' : val}`} />
                          <Tooltip contentStyle={{ background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} formatter={(v) => [`₹${v}`, 'Revenue']} />
                          <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Card 2: Order Operations */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Order Analytics</h4>
                      <select
                        value={activeOrderMetric}
                        onChange={(e) => setActiveOrderMetric(e.target.value)}
                        className={`text-3xs font-semibold p-1.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                      >
                        <option value="perDay">Orders Per Day</option>
                        <option value="delivered">Delivered Orders</option>
                        <option value="cancelled">Cancelled Orders</option>
                      </select>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={
                            activeOrderMetric === 'perDay' ? ordersPerDay :
                            activeOrderMetric === 'delivered' ? deliveredOrders : cancelledOrders
                          }
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip contentStyle={{ background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} />
                          <Bar dataKey="value" fill={activeOrderMetric === 'cancelled' ? '#f43f5e' : '#3b82f6'} radius={[4, 4, 0, 0]} maxBarSize={30} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Card 3: Growth & Success Analytics */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Growth & Success</h4>
                      <select
                        value={activeGrowthMetric}
                        onChange={(e) => setActiveGrowthMetric(e.target.value)}
                        className={`text-3xs font-semibold p-1.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                      >
                        <option value="farmerReg">Farmer Registrations</option>
                        <option value="vendorGrowth">Vendor Growth</option>
                        <option value="successRate">Delivery Success Rate</option>
                      </select>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={
                            activeGrowthMetric === 'farmerReg' ? farmerRegistrations :
                            activeGrowthMetric === 'vendorGrowth' ? vendorGrowth : deliverySuccessRate
                          }
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={(val) => activeGrowthMetric === 'successRate' ? `${val}%` : val} />
                          <Tooltip contentStyle={{ background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} formatter={(v) => [activeGrowthMetric === 'successRate' ? `${v}%` : v, 'Value']} />
                          <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. REVENUE STATS SECTION */}
            {activeSubItem === 'Revenue Stats' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
                    <IndianRupee size={16} />
                  </span>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">Financial Revenue Statistics</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Financial Stats Cards Grid (Covers 8 metrics) */}
                  <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { title: 'Total Earnings', value: '₹15,62,400', desc: 'Net Platform Earnings', icon: IndianRupee, color: 'bg-emerald-500/10 text-emerald-500' },
                      { title: 'Monthly Profit', value: '₹4,85,300', desc: 'Current Month Profit', icon: TrendingUp, color: 'bg-blue-500/10 text-blue-500' },
                      { title: 'Vendor Commissions', value: '₹1,56,240', desc: 'Platform Commission Cuts', icon: Percent, color: 'bg-indigo-500/10 text-indigo-500' },
                      { title: 'Refund Amount', value: '₹24,500', desc: 'Farmer Refund Claims', icon: RefreshCw, color: 'bg-rose-500/10 text-rose-500' },
                      { title: 'Subscription Revenue', value: '₹3,12,000', desc: 'SaaS Enterprise Fees', icon: Calendar, color: 'bg-purple-500/10 text-purple-500' },
                      { title: 'Expense Tracking', value: '₹2,10,000', desc: 'Operations & Hosting Costs', icon: Database, color: 'bg-amber-500/10 text-amber-500' },
                      { title: 'Pending Payments', value: '₹68,500', desc: 'Unsettled Vendor Balances', icon: Clock, color: 'bg-orange-500/10 text-orange-500' },
                      { title: 'Tax Collection', value: '₹1,24,580', desc: 'State & Central GST Cuts', icon: Shield, color: 'bg-teal-500/10 text-teal-500' }
                    ].map((stat, i) => (
                      <div key={i} className={`p-4 rounded-xl border flex flex-col justify-between h-28 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                        <div className="flex items-center justify-between">
                          <div className={`p-1.5 rounded-lg ${stat.color}`}>
                            <stat.icon size={15} />
                          </div>
                          <span className="text-4xs font-bold text-emerald-500">+10.4%</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-3xs font-bold text-slate-400 truncate uppercase">{stat.title}</p>
                          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 font-heading mt-0.5">{stat.value}</h4>
                          <p className="text-4xs text-slate-400 truncate mt-0.5">{stat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Revenue vs Expense Comparison Panel */}
                  <div className={`p-5 rounded-xl border flex flex-col justify-between ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Revenue vs Expenses</h4>
                      <span className="text-4xs text-slate-400 font-bold uppercase tracking-wider">Last 5 Months</span>
                    </div>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueVsExpense}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={(val) => `₹${val/1000}k`} />
                          <Tooltip contentStyle={{ background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} />
                          <Bar dataKey="Revenue" fill="#10b981" radius={[3, 3, 0, 0]} />
                          <Bar dataKey="Expense" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. RECENT ACTIVITIES SECTION (TIMELINE FEED) */}
            {activeSubItem === 'Recent Activities' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
                    <Clock size={16} />
                  </span>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">System Activity Stream</h3>
                </div>
                {/* Timeline Container */}
                <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-slate-400" />
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Live Enterprise Activity Timeline</h4>
                    </div>
                    <span className="text-4xs font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full uppercase">Realtime Feed</span>
                  </div>
                  
                  <div className="relative border-l border-slate-200 dark:border-slate-800 pl-6 space-y-6 ml-3">
                    {[
                      { action: 'Vendor Approved', details: 'Shinde Agro Tech approved for seed distribution', time: '5 mins ago', icon: ShieldCheck, color: 'bg-emerald-500 text-white', iconColor: 'text-emerald-500 border-emerald-500' },
                      { action: 'Farmer Registered', details: 'Farmer Ramesh Patil (Satara) joined with UID #FMR-8321', time: '12 mins ago', icon: Users, color: 'bg-blue-500 text-white', iconColor: 'text-blue-500 border-blue-500' },
                      { action: 'Product Added', details: 'Organic Tomato Booster (liquid spray) added by Pune Fertilisers', time: '25 mins ago', icon: Plus, color: 'bg-amber-500 text-white', iconColor: 'text-amber-500 border-amber-500' },
                      { action: 'Product Approved', details: 'Neem Oil Insecticide v4 approved for global vendor listing', time: '45 mins ago', icon: CheckCircle, color: 'bg-teal-500 text-white', iconColor: 'text-teal-500 border-teal-500' },
                      { action: 'Order Placed', details: 'Order #ORD-98231 (value: ₹4,500) placed by Ramesh Patil', time: '1 hour ago', icon: ShoppingBag, color: 'bg-indigo-500 text-white', iconColor: 'text-indigo-500 border-indigo-500' },
                      { action: 'Order Delivered', details: 'Order #ORD-98210 successfully delivered to Satara hub', time: '2 hours ago', icon: Truck, color: 'bg-emerald-500 text-white', iconColor: 'text-emerald-500 border-emerald-500' },
                      { action: 'Complaint Submitted', details: 'Farmer Sanjay raised ticket #TKT-441: Defective hand sprayer', time: '3 hours ago', icon: AlertTriangle, color: 'bg-rose-500 text-white', iconColor: 'text-rose-500 border-rose-500' },
                      { action: 'Payment Completed', details: 'Payout of ₹45,000 cleared to Nashik Pesticide Outlet', time: '4 hours ago', icon: IndianRupee, color: 'bg-emerald-500 text-white', iconColor: 'text-emerald-500 border-emerald-500' },
                      { action: 'Admin Login', details: 'Secondary Admin logged in from IP 192.168.1.45', time: '5 hours ago', icon: Settings, color: 'bg-slate-500 text-white', iconColor: 'text-slate-500 border-slate-500' }
                    ].map((act, idx) => (
                      <div key={idx} className="relative group">
                        {/* Circle Dot Marker */}
                        <span className={`absolute -left-9 top-1 flex items-center justify-center w-6 h-6 rounded-full ring-4 ${theme === 'dark' ? 'ring-slate-900 bg-slate-900 border-slate-800' : 'ring-white bg-white border-slate-200'} border`}>
                          <act.icon size={12} className={act.iconColor.split(' ')[0]} />
                        </span>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-2xs gap-1 pl-1">
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 transition-colors duration-150">{act.action}</span>
                            <p className="text-slate-400 mt-0.5">{act.details}</p>
                          </div>
                          <span className="text-slate-400 font-medium whitespace-nowrap">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. AI INSIGHTS SECTION */}
            {activeSubItem === 'AI Insights' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
                    <Sparkles size={16} />
                  </span>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">AI Engine Hub</h3>
                </div>
                <div className={`p-6 rounded-xl border flex flex-col justify-between ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={16} className="text-purple-500 animate-pulse" />
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">AI Predictive Insights Engine</h4>
                    </div>
                    <span className="text-4xs font-bold bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full uppercase">Powered by AgriAI</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-2xs">
                    {[
                      { label: 'Crop Demand Prediction', desc: 'High demand expected for pulses & oilseeds in Central Zone next quarter. Recommend increasing vendor stock allocations.', type: 'info', icon: Cpu, badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
                      { label: 'Weather Alerts', desc: 'Monsoon delays by 4 days predicted in Western Maharashtra. System sent notifications to farmers to delay seed sowing.', type: 'warning', icon: AlertTriangle, badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
                      { label: 'Delivery Delay Prediction', desc: 'Possible shipping delays in Kolhapur route due to local road construction. Dynamic route optimizations suggested.', type: 'warning', icon: Truck, badgeColor: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
                      { label: 'Fraud Detection Alerts', desc: 'Anomaly detected in Vendor #VND-088. High cancellation rates immediately after payout clearances flagged for review.', type: 'danger', icon: ShieldAlert, badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
                      { label: 'Revenue Forecast', desc: 'Next month revenue is forecast to rise by 8.4% (Confidence level: 94%) based on new vendor signups & catalog scaling.', type: 'success', icon: TrendingUp, badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
                      { label: 'Low Stock Alerts', desc: 'Bio-pesticides and organic compost running low in Satara Hub. Automated replenishment trigger suggested.', type: 'warning', icon: Package, badgeColor: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
                      { label: 'High Selling Products', desc: 'Hybrid Tomato Seeds v4 is currently the #1 top-selling item with a 42% weekly increase in orders.', type: 'success', icon: Award, badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
                      { label: 'Farmer Behavior Analytics', desc: '78% of farmers accessing AI disease detection tools are adopting recommended bio-fungicides, lifting platform vendor conversions by 15%.', type: 'info', icon: Users, badgeColor: 'bg-teal-500/10 text-teal-500 border-teal-500/20' }
                    ].map((insight, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.01 }}
                        className={`p-4 rounded-lg border ${
                          theme === 'dark' 
                            ? 'bg-slate-950 border-slate-800 hover:bg-slate-900' 
                            : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-sm'
                        } transition-all duration-150`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`p-1 rounded-md ${theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-sm'} text-purple-500`}>
                            <insight.icon size={13} />
                          </span>
                          <span className="font-extrabold text-3xs text-slate-800 dark:text-slate-200">{insight.label}</span>
                          <span className={`text-4xs px-1.5 py-0.5 rounded-full border font-bold uppercase ml-auto ${insight.badgeColor}`}>
                            {insight.type}
                          </span>
                        </div>
                        <p className="text-3xs text-slate-400 mt-2 leading-relaxed">{insight.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )

      case 'Platform Management':
        return (
          <div className="space-y-6 animate-fade-in pb-12">
            
            {/* Main Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
              <div>
                <h2 className="text-sm font-black flex items-center gap-2">
                  <Globe size={18} className="text-emerald-500" />
                  <span>Platform Console: {activeSubItem}</span>
                </h2>
                <p className="text-3xs text-slate-400 font-medium">Enterprise settings console for client systems & branding customization</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md hover:shadow-emerald-500/10 cursor-pointer"
                >
                  <Save size={13} />
                  Save Configurations
                </button>
              </div>
            </div>

            {/* 1. WEBSITE SETTINGS */}
            {activeSubItem === 'Website Settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Profile Settings */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Business Profile & Website URL</h4>
                  <div className="space-y-3 text-2xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">WEBSITE SITE NAME</label>
                      <input type="text" defaultValue="AgriAI Multi-Vendor ERP" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">WEBSITE LANDING URL</label>
                      <input type="text" defaultValue="https://www.agroerp.com" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">BUSINESS REGISTRATION NAME</label>
                      <input type="text" defaultValue="AgriTech Solutions Private Limited" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">PHYSICAL HEADQUARTERS ADDRESS</label>
                      <textarea rows="2" defaultValue="Plot 45, MIDC Industrial Area, Baramati, Pune - 413133" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500 resize-none`}></textarea>
                    </div>
                  </div>
                </div>

                {/* Support & Legal */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Support Coordinates & Legal</h4>
                  <div className="space-y-3 text-2xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">SUPPORT EMAIL</label>
                        <input type="email" defaultValue="support@agroerp.com" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">HOTLINE PHONE</label>
                        <input type="text" defaultValue="+91-1800-452-9821" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">FACEBOOK PAGE</label>
                        <input type="text" defaultValue="facebook.com/agriai" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">LINKEDIN PROFILE</label>
                        <input type="text" defaultValue="linkedin.com/company/agriai" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">FOOTER COPYRIGHT STATEMENT</label>
                      <input type="text" defaultValue="© 2026 AgriAI ERP Solutions Inc. All Rights Reserved." className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 2. APP SETTINGS */}
            {activeSubItem === 'App Settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Version Control */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Mobile Apps Version Control</h4>
                  <div className="space-y-4 text-2xs">
                    <div className="grid grid-cols-2 gap-4 border-b pb-3 dark:border-slate-800 border-slate-100">
                      <div>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">Android Build Version</span>
                        <input type="text" defaultValue="v3.8.4" className={`w-full mt-1.5 p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} outline-none`} />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">Force Upgrade Threshold</span>
                        <input type="text" defaultValue="v3.7.0" className={`w-full mt-1.5 p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} outline-none`} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 border-b pb-3 dark:border-slate-800 border-slate-100">
                      <div>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">iOS Appstore Version</span>
                        <input type="text" defaultValue="v2.9.1" className={`w-full mt-1.5 p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} outline-none`} />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">Force Upgrade iOS</span>
                        <input type="text" defaultValue="v2.8.5" className={`w-full mt-1.5 p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} outline-none`} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">API BASE ENDPOINT URL</label>
                      <input type="text" defaultValue="https://api.agroerp.com/v1" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                    </div>
                  </div>
                </div>

                {/* Notifications & Permissions */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Services & Privacy Flags</h4>
                  <div className="space-y-4 text-2xs">
                    
                    {/* Toggle row */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                      <div>
                        <span className="font-extrabold text-emerald-500">Android/iOS Push Notifications</span>
                        <p className="text-3xs text-slate-400 mt-0.5">Activate automated background warnings & payouts alerts.</p>
                      </div>
                      <button className="px-3.5 py-1 bg-emerald-500 text-white text-3xs font-extrabold rounded-lg">ACTIVE</button>
                    </div>

                    {/* Permissions checklist */}
                    <div className="space-y-2">
                      <span className="font-extrabold text-slate-400 block uppercase tracking-wider">Required Client Permissions</span>
                      <div className="grid grid-cols-2 gap-2 text-3xs font-semibold">
                        {[
                          { label: 'GPS Location Services', active: true },
                          { label: 'Device Camera (KYC)', active: true },
                          { label: 'Storage Access (Invoice PDF)', active: true },
                          { label: 'Audio/Microphone (Support Chat)', active: false }
                        ].map((perm, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded border dark:border-slate-800 border-slate-100">
                            <input type="checkbox" defaultChecked={perm.active} className="accent-emerald-500" />
                            <span>{perm.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 3. BRANDING & LOGOS */}
            {activeSubItem === 'Branding & Logos' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Upload assets */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Graphic Asset Files</h4>
                  <div className="grid grid-cols-2 gap-4 text-2xs">
                    
                    <div className="border border-dashed p-4 rounded-xl flex flex-col items-center justify-center dark:border-slate-800 border-slate-200">
                      <span className="text-3xs font-extrabold text-slate-400">PRIMARY SYSTEM LOGO</span>
                      <div className="text-lg mt-2"><Sprout className="text-emerald-500" size={20} /></div>
                      <button className="mt-2 text-3xs text-emerald-500 font-bold hover:underline">Choose File</button>
                    </div>

                    <div className="border border-dashed p-4 rounded-xl flex flex-col items-center justify-center dark:border-slate-800 border-slate-200">
                      <span className="text-3xs font-extrabold text-slate-400">FAVICON ICON (16x16)</span>
                      <div className="text-lg mt-2"><Sparkles className="text-amber-500" size={20} /></div>
                      <button className="mt-2 text-3xs text-emerald-500 font-bold hover:underline">Choose File</button>
                    </div>

                    <div className="border border-dashed p-4 rounded-xl flex flex-col items-center justify-center dark:border-slate-800 border-slate-200">
                      <span className="text-3xs font-extrabold text-slate-400">SPLASH SCREEN ICON</span>
                      <div className="text-lg mt-2"><Tractor className="text-blue-500" size={20} /></div>
                      <button className="mt-2 text-3xs text-emerald-500 font-bold hover:underline">Choose File</button>
                    </div>

                    <div className="border border-dashed p-4 rounded-xl flex flex-col items-center justify-center dark:border-slate-800 border-slate-200">
                      <span className="text-3xs font-extrabold text-slate-400">MOBILE APP ICON</span>
                      <div className="text-lg mt-2"><Smartphone className="text-purple-500" size={20} /></div>
                      <button className="mt-2 text-3xs text-emerald-500 font-bold hover:underline">Choose File</button>
                    </div>
                  </div>
                </div>

                {/* Live Brand Identity Preview */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Corporate Preview</h4>
                  <div className="border p-4 rounded-xl dark:border-slate-800 border-slate-100 flex flex-col items-center justify-center bg-slate-950 text-white min-h-[160px]">
                    <span className="text-3xs uppercase tracking-widest text-slate-500 font-bold mb-3">Live Header Preview</span>
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center"><Sprout size={16} className="text-white" /></span>
                      <span className="font-extrabold text-sm tracking-tight">AgriAI ERP</span>
                    </div>
                    <span className="text-3xs text-slate-400 mt-2 font-medium">Empowering smart farming & commerce</span>
                  </div>

                  <div className="text-2xs space-y-3">
                    <div>
                      <span className="block font-bold text-slate-400 mb-1">BRAND PRIMARY TYPOGRAPHY</span>
                      <select className={`w-full p-2.5 rounded-lg border outline-none text-2xs ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        <option>Poppins, sans-serif</option>
                        <option>Inter, sans-serif</option>
                        <option>Roboto, sans-serif</option>
                        <option>Outfit, sans-serif</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 4. THEME CUSTOMIZATION */}
            {activeSubItem === 'Theme Customization' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Styling rules selectors */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Color Palette & Component Styling</h4>
                  <div className="space-y-4 text-2xs">
                    
                    {/* Predefined color swatches */}
                    <div>
                      <span className="block font-bold text-slate-400 mb-2 uppercase tracking-wide">Primary Theme Color</span>
                      <div className="flex gap-2">
                        {[
                          { color: '#2E7D32', name: 'Agro Green' },
                          { color: '#3b82f6', name: 'Tech Blue' },
                          { color: '#8b5cf6', name: 'Purple Royal' },
                          { color: '#eab308', name: 'Harvest Gold' },
                          { color: '#f43f5e', name: 'Rose Red' }
                        ].map((swatch, idx) => (
                          <button
                            key={idx}
                            className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 active:scale-95 ${swatch.color === '#2E7D32' ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-transparent'}`}
                            style={{ backgroundColor: swatch.color }}
                            title={swatch.name}
                            onClick={() => handleSave(`Switched Brand Primary to ${swatch.name}`)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Component sliders */}
                    <div className="space-y-3">
                      <div>
                        <span className="flex justify-between font-bold text-slate-400 mb-1">
                          <span>BUTTON BORDER RADIUS</span>
                          <span className="text-emerald-500">10px</span>
                        </span>
                        <input type="range" min="0" max="20" defaultValue="10" className="w-full accent-emerald-500" />
                      </div>
                      
                      <div>
                        <span className="block font-bold text-slate-400 mb-1">SIDEBAR DRAWER THEME MODE</span>
                        <select className={`w-full p-2.5 rounded-lg border outline-none text-2xs ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                          <option>Glassmorphism (Frosted Filter)</option>
                          <option>Classic Solid Dark</option>
                          <option>Sleek Solid Light</option>
                          <option>Border Outlined Minimal</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Component visual previews */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Active Component Demo Card</h4>
                  
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-200'} flex flex-col gap-3 min-h-[180px] justify-between`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest">Active Preview Card</span>
                        <h4 className="text-xs font-bold mt-1 text-slate-800 dark:text-slate-200 font-heading">Sample Card Structure</h4>
                      </div>
                      <span className="text-3xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold uppercase">PREVIEW</span>
                    </div>

                    <p className="text-3xs text-slate-400">Buttons, cards, and sidebar styling reflect choices dynamically before system application.</p>
                    
                    <div className="flex gap-2">
                      <button className="px-3.5 py-1.5 bg-emerald-600 text-white text-3xs font-extrabold rounded-lg shadow-sm">Primary Button</button>
                      <button className="px-3.5 py-1.5 border dark:border-slate-800 border-slate-300 text-3xs font-extrabold rounded-lg text-slate-400">Cancel</button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 5. LANDING PAGE EDITOR */}
            {activeSubItem === 'Landing Page Editor' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Landing layout panels */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Landing Page Sections Visibility & Content</h4>
                  
                  <div className="space-y-3.5 text-2xs">
                    
                    {[
                      { label: 'Hero Banner Section', title: 'Empowering Modern Agriculture', active: true },
                      { label: 'Platform Features Matrix', title: 'Smart Subsidies & IoT Support', active: true },
                      { label: 'Customer Testimonials Feed', title: 'Ramesh Patil (Satara Hub)', active: false },
                      { label: 'FAQs Accordions Panel', title: 'How commission schedules work', active: true },
                      { label: 'CTA Recruitment Banner', title: 'Register as Vendor Today', active: true }
                    ].map((sec, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-200'} flex items-center justify-between`}>
                        <div>
                          <span className="font-extrabold text-3xs text-slate-400 block uppercase tracking-wider">{sec.label}</span>
                          <span className="text-2xs font-medium text-slate-800 dark:text-slate-200">{sec.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked={sec.active} className="accent-emerald-500" />
                          <span className="text-3xs text-slate-400">VISIBLE</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wireframe view */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Live Website Wireframe Blueprint</h4>
                  <div className="border rounded-xl p-3 bg-slate-950 text-white min-h-[300px] flex flex-col gap-2.5 select-none relative opacity-90">
                    
                    {/* Header */}
                    <div className="border-b border-slate-800 pb-2 flex justify-between items-center text-4xs font-bold text-slate-500 uppercase">
                      <span>Website Header Navigation</span>
                      <span className="text-emerald-500">Logo</span>
                    </div>

                    {/* Wireframe Hero */}
                    <div className="p-3 border border-emerald-500/25 bg-emerald-500/5 rounded text-center text-4xs font-bold text-emerald-400">
                      <span>Hero Section Editor (ACTIVE)</span>
                    </div>

                    {/* Features */}
                    <div className="p-3 border border-blue-500/25 bg-blue-500/5 rounded text-center text-4xs font-bold text-blue-400">
                      <span>Platform Features Grid (ACTIVE)</span>
                    </div>

                    {/* Testimonials */}
                    <div className="p-2 border border-slate-800 bg-slate-900 rounded text-center text-4xs font-bold text-slate-600 line-through">
                      <span>Customer Testimonials Feed (HIDDEN)</span>
                    </div>

                    {/* Call to action recruiting */}
                    <div className="p-3 border border-purple-500/25 bg-purple-500/5 rounded text-center text-4xs font-bold text-purple-400">
                      <span>CTA Recruitment Banner (ACTIVE)</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 6. BANNER MANAGEMENT */}
            {activeSubItem === 'Banner Management' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Banner list & upload */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Active Banners & Sliders</h4>
                    <button className="px-2.5 py-1 text-3xs font-extrabold bg-emerald-600 text-white rounded-lg flex items-center gap-1">
                      <Plus size={11} /> Add Banner
                    </button>
                  </div>

                  <div className="overflow-x-auto text-2xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2 px-1">Banner Code</th>
                          <th className="py-2 px-1">Placement</th>
                          <th className="py-2 px-1">Active Dates</th>
                          <th className="py-2 px-1">Clicks</th>
                          <th className="py-2 px-1 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'BNR-01', placement: 'Homepage Hero Slider', dates: 'May 10 - Jun 10', clicks: '4,821 clicks', status: 'Active' },
                          { id: 'BNR-04', placement: 'Vendor Promo Side-panel', dates: 'Jun 01 - Jul 01', clicks: '1,240 clicks', status: 'Scheduled' },
                          { id: 'BNR-08', placement: 'Seasonal Seed Discount Footer', dates: 'Apr 01 - May 01', clicks: '12,982 clicks', status: 'Expired' }
                        ].map((bnr, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-2.5 px-1 font-bold text-slate-800 dark:text-slate-200">{bnr.id}</td>
                            <td className="py-2.5 px-1 text-slate-400">{bnr.placement}</td>
                            <td className="py-2.5 px-1">{bnr.dates}</td>
                            <td className="py-2.5 px-1 font-extrabold text-emerald-500">{bnr.clicks}</td>
                            <td className="py-2.5 px-1 text-right">
                              <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${
                                bnr.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                                bnr.status === 'Scheduled' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-400'
                              }`}>{bnr.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Banner Analytics */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Campaign Banner Engagement</h4>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'BNR-01', value: 4821 },
                        { name: 'BNR-04', value: 1240 },
                        { name: 'BNR-08', value: 12982 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                        <YAxis stroke="#94a3b8" fontSize={9} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[3, 3, 0, 0]} maxBarSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-3xs text-slate-400 font-semibold p-2.5 rounded bg-slate-500/5 border border-slate-800/10 text-center">
                    <span>Expired banners outperform active placements by 62.4% due to seasonal harvest demands.</span>
                  </div>
                </div>

              </div>
            )}

            {/* 7. SEO SETTINGS */}
            {activeSubItem === 'SEO Settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* SEO fields inputs */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Google Search Index Configurations</h4>
                  <div className="space-y-3 text-2xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">SEO META TITLE</label>
                      <input type="text" defaultValue="AgriAI ERP - Multi-vendor Smart Farming Platform" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">META DESCRIPTION STATEMENT</label>
                      <textarea rows="2" defaultValue="Manage crop advisory services, order deliveries, vendor payouts, and smart subsidy allocations inside the modern AgriAI Agriculture platform." className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500 resize-none`}></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">GOOGLE ANALYTICS TRACKING ID</label>
                        <input type="text" defaultValue="G-83219482-1" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">SEARCH CONSOLE VALUE</label>
                        <input type="text" defaultValue="google-site-verification=48a2bc" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO Previews */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Google SERP Snippet Preview</h4>
                  
                  {/* Mock snippet */}
                  <div className="p-4 rounded-xl border dark:border-slate-800 border-slate-200 bg-white dark:bg-slate-950 flex flex-col gap-1 min-h-[100px] select-none text-2xs">
                    <span className="text-3xs text-slate-400">https://www.agroerp.com</span>
                    <h4 className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">AgriAI ERP - Multi-vendor Smart Farming Platform</h4>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">Manage crop advisory services, order deliveries, vendor payouts, and smart subsidy allocations inside the modern AgriAI Agriculture platform.</p>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-1.5 text-3xs font-semibold text-slate-400">
                    <span className="block uppercase tracking-wider">SEO Compliance Checklist</span>
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <CheckCircle size={12} /> <span>Focus keywords detected in site Meta Title.</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <CheckCircle size={12} /> <span>Site Description complies with 160 characters limit.</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <AlertTriangle size={12} /> <span>Sitemap.xml contains 4 dead endpoints. Update suggested.</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 8. LANGUAGE SETTINGS */}
            {activeSubItem === 'Language Settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Active locales grid */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Registered Platform Locales</h4>
                  
                  <div className="space-y-2.5 text-2xs font-semibold">
                    {[
                      { code: 'EN', name: 'English (US Global)', direction: 'LTR (Left-to-Right)', isDefault: true },
                      { code: 'HI', name: 'Hindi (Hindi Regional)', direction: 'LTR (Left-to-Right)', isDefault: false },
                      { code: 'MR', name: 'Marathi (Local State)', direction: 'LTR (Left-to-Right)', isDefault: false },
                      { code: 'AR', name: 'Arabic (Middle East)', direction: 'RTL (Right-to-Left)', isDefault: false }
                    ].map((lang, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border flex items-center justify-between ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div>
                          <span className="text-emerald-500 font-extrabold text-3xs mr-1 bg-emerald-500/10 px-1 py-0.5 rounded">{lang.code}</span>
                          <span className="text-slate-800 dark:text-slate-200">{lang.name}</span>
                          <p className="text-4xs text-slate-400 mt-0.5">{lang.direction}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input type="radio" name="defaultLang" defaultChecked={lang.isDefault} className="accent-emerald-500" />
                          <span className="text-4xs text-slate-400">DEFAULT</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Localized strings sample lookup table */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Dictionary Translation Quick Editor</h4>
                  
                  <div className="space-y-3.5 text-2xs">
                    <div className="grid grid-cols-2 gap-3 font-bold text-slate-400 text-3xs border-b pb-1.5 dark:border-slate-800 border-slate-100">
                      <span>ENGLISH SYSTEM KEY</span>
                      <span>HINDI LOCALIZED TRANSLATION</span>
                    </div>

                    {[
                      { key: 'Welcome Super Admin', val: 'à¤¸à¥à¤µà¤¾à¤—à¤¤ à¤¹à¥ˆ à¤¸à¥à¤ªà¤° à¤à¤¡à¤®à¤¿à¤¨' },
                      { key: 'Process Delivery Payout', val: 'à¤µà¤¿à¤¤à¤°à¤£ à¤­à¥à¤—à¤¤à¤¾à¤¨ à¤•à¥€ à¤ªà¥à¤°à¤•à¥à¤°à¤¿à¤¯à¤¾' },
                      { key: 'Disease Advisory Active', val: 'à¤°à¥‹à¤— à¤ªà¤°à¤¾à¤®à¤°à¥à¤¶ à¤¸à¤•à¥à¤°à¤¿à¤¯' },
                      { key: 'Suspend Vendor Account', val: 'à¤µà¤¿à¤•à¥à¤°à¥‡à¤¤à¤¾ à¤–à¤¾à¤¤à¤¾ à¤¨à¤¿à¤²à¤‚à¤¬à¤¿à¤¤ à¤•à¤°à¥‡à¤‚' }
                    ].map((str, idx) => (
                      <div key={idx} className="grid grid-cols-2 gap-3 text-3xs items-center font-medium">
                        <span className="text-slate-400">{str.key}</span>
                        <input type="text" defaultValue={str.val} className={`p-1.5 rounded border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-200'}`} />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 9. MAINTENANCE MODE */}
            {activeSubItem === 'Maintenance Mode' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Active control panel */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Maintenance Status Control</h4>
                  
                  <div className="space-y-4 text-2xs">
                    
                    {/* Mode Toggle Switch */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                      <div>
                        <h4 className="text-2xs font-extrabold text-rose-500 uppercase tracking-wider">Maintenance Offline Mode</h4>
                        <p className="text-3xs text-slate-400 mt-0.5">Locks public farmer & vendor catalogs, routing users to fallback offline design.</p>
                      </div>
                      <button
                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                        className={`px-4 py-1.5 rounded-lg text-3xs font-extrabold transition-all cursor-pointer ${maintenanceMode ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-350'}`}
                      >
                        {maintenanceMode ? 'ACTIVE (OFFLINE)' : 'INACTIVE (LIVE)'}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-slate-400 font-bold uppercase tracking-wider">Allowed Bypass Administrator IP Addresses</label>
                      <input type="text" defaultValue="192.168.1.1, 10.0.0.8, 127.0.0.1" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-rose-500`} />
                      <p className="text-4xs text-slate-400">Comma separated IPv4 addresses that bypass the maintenance screen for sandbox verification.</p>
                    </div>
                  </div>
                </div>

                {/* Maintenance Screen Custom designer */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Bypass Maintenance Notification Designer</h4>
                  
                  <div className="space-y-3.5 text-2xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">OFFLINE WARNING BANNER MESSAGE</label>
                      <textarea rows="2" defaultValue="AgriAI system is undergoing scheduled catalog upgrades. Normal services will resume within 3 hours." className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-rose-500 resize-none`}></textarea>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">COUNTDOWN DATE TIME</label>
                        <input type="datetime-local" defaultValue="2026-06-01T04:00" className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} outline-none`} />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">EMERGENCY OPERATIONS EMAIL</label>
                        <input type="email" defaultValue="sysops@agroerp.com" className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} outline-none`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )

      case 'Admin Management':
        return (
          <div className="space-y-6 animate-fade-in pb-12">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
              <div>
                <h2 className="text-sm font-black flex items-center gap-2">
                  <UserCheck size={18} className="text-emerald-500" />
                  <span>Admin Authority: {activeSubItem}</span>
                </h2>
                <p className="text-3xs text-slate-400 font-medium">Configure administrator credentials, security access matrix, and activity audit trails</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md hover:shadow-emerald-500/10 cursor-pointer"
                >
                  <Save size={13} />
                  Apply Changes
                </button>
              </div>
            </div>

            {/* 1. CREATE ADMIN */}
            {activeSubItem === 'Create Admin' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form Card */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">New Administrator Registration</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-2xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">FULL NAME</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-slate-400" size={14} />
                        <input type="text" placeholder="John Doe" className={`w-full pl-9 p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">EMAIL ADDRESS</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-400" size={14} />
                        <input type="email" placeholder="john@agroerp.com" className={`w-full pl-9 p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">PHONE NUMBER</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-slate-400" size={14} />
                        <input type="text" placeholder="+91 98765 43210" className={`w-full pl-9 p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">ASSIGN ENTERPRISE ROLE</label>
                      <select className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-200 text-slate-650'}`}>
                        <option>Super Admin</option>
                        <option>Regional Admin</option>
                        <option>Inventory Admin</option>
                        <option>Finance Admin</option>
                        <option>Support Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">ASSIGN SYSTEM REGION</label>
                      <select className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-200 text-slate-650'}`}>
                        <option>Maharashtra (HQ)</option>
                        <option>Gujarat Region</option>
                        <option>Karnataka Hub</option>
                        <option>Punjab Center</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">DEPARTMENT SELECTION</label>
                      <select className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-200 text-slate-650'}`}>
                        <option>Operations & Supply</option>
                        <option>Core Technology</option>
                        <option>Accounting & Finance</option>
                        <option>Customer Support</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">ACCOUNT PASSWORD</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400" size={14} />
                        <input type="password" placeholder="••••••••" className={`w-full pl-9 p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">CONFIRM PASSWORD</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400" size={14} />
                        <input type="password" placeholder="••••••••" className={`w-full pl-9 p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload & Preview */}
                <div className="space-y-6">
                  
                  {/* Photo upload mock */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm text-center space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Avatar Profile Photo</h4>
                    <div className="border border-dashed p-4 rounded-xl flex flex-col items-center justify-center dark:border-slate-800 border-slate-200">
                      <div className="w-14 h-14 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-base mb-2"><User size={24} /></div>
                      <span className="text-3xs text-slate-400">PNG, JPG up to 2MB</span>
                      <button className="mt-2 text-3xs text-emerald-500 font-bold hover:underline cursor-pointer">Upload Photo</button>
                    </div>
                  </div>

                  {/* Permissions Preview Card */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-3`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">System Role Privileges</h4>
                    <div className="space-y-2 text-3xs text-slate-400 font-semibold">
                      <div className="flex items-center justify-between p-2 rounded dark:bg-slate-950 bg-slate-50">
                        <span>All ERP Modules Read Access</span>
                        <span className="text-emerald-500">ALLOWED</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded dark:bg-slate-950 bg-slate-50">
                        <span>Financial Transactions Clearance</span>
                        <span className="text-emerald-500">ALLOWED</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded dark:bg-slate-950 bg-slate-50">
                        <span>Delete Vendors / Catalogs</span>
                        <span className="text-rose-500">RESTRICTED</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. MANAGE ADMINS */}
            {activeSubItem === 'Manage Admins' && (
              <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Registered Administrators Registry</h4>
                  
                  {/* Search and Filters */}
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-3xs ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <Search size={12} className="text-slate-400" />
                      <input type="text" placeholder="Search Admins..." value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} className="bg-transparent outline-none w-28" />
                    </div>

                    <select className={`p-1.5 rounded-lg border text-3xs outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      <option>All Roles</option>
                      <option>Super Admin</option>
                      <option>Regional Admin</option>
                      <option>Finance Admin</option>
                    </select>

                    <select className={`p-1.5 rounded-lg border text-3xs outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      <option>All Regions</option>
                      <option>Maharashtra</option>
                      <option>Gujarat</option>
                    </select>
                  </div>
                </div>

                {/* Admins Table */}
                <div className="overflow-x-auto text-2xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                        <th className="py-2.5 px-4">Admin Name</th>
                        <th className="py-2.5 px-4">Role</th>
                        <th className="py-2.5 px-4">Assigned Region</th>
                        <th className="py-2.5 px-4">Last Login</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Sanjay Deshmukh', email: 'sanjay@agroerp.com', role: 'Regional Admin', region: 'Maharashtra', login: '10 mins ago', status: 'Active', initials: 'SD' },
                        { name: 'Karan Singh', email: 'karan@agroerp.com', role: 'Finance Admin', region: 'Punjab Center', login: '2 hours ago', status: 'Active', initials: 'KS' },
                        { name: 'Priya Patel', email: 'priya@agroerp.com', role: 'Support Admin', region: 'Gujarat Region', login: 'Yesterday', status: 'Suspended', initials: 'PP' }
                      ].filter(adm => adm.name.toLowerCase().includes(searchFilter.toLowerCase())).map((adm, idx) => (
                        <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-3xs">
                              {adm.initials}
                            </div>
                            <div>
                              <span className="font-extrabold text-slate-800 dark:text-slate-200">{adm.name}</span>
                              <p className="text-3xs text-slate-400 font-medium">{adm.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{adm.role}</td>
                          <td className="py-3 px-4">{adm.region}</td>
                          <td className="py-3 px-4 font-medium text-slate-400">{adm.login}</td>
                          <td className="py-3 px-4">
                            <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${adm.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                              {adm.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button className="text-emerald-500 hover:underline inline-flex items-center gap-0.5"><Edit size={10} /> Edit</button>
                            <button className="text-rose-500 hover:underline inline-flex items-center gap-0.5"><Trash2 size={10} /> Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. PERMISSIONS */}
            {activeSubItem === 'Permissions' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Role Selection */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800 border-slate-100">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Enterprise System Roles</h4>
                    <button className="px-2 py-1 bg-emerald-600 text-white rounded text-4xs font-bold flex items-center gap-0.5">
                      <Plus size={10} /> Custom Role
                    </button>
                  </div>

                  <div className="space-y-2 text-2xs font-semibold">
                    {[
                      { role: 'Super Admin', desc: 'Full root access to backend databases', active: true },
                      { role: 'Regional Admin', desc: 'Advisory and local complaints dispatch', active: false },
                      { role: 'Inventory Admin', desc: 'Warehouse inventory and approvals', active: false },
                      { role: 'Finance Admin', desc: 'Payout disbursements and tax rates', active: false },
                      { role: 'Support Admin', desc: 'Farmer queries and live chat logs', active: false }
                    ].map((item, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border cursor-pointer hover:border-emerald-500/30 transition-all ${item.active ? 'border-emerald-500 bg-emerald-500/5' : 'dark:border-slate-800 border-slate-200 bg-transparent'}`}>
                        <span className={`font-extrabold ${item.active ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-200'}`}>{item.role}</span>
                        <p className="text-3xs text-slate-400 mt-0.5 font-medium">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Permission Checklist Matrix */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 border-b pb-3 dark:border-slate-800 border-slate-100">Role Privilege Mapping: Super Admin</h4>
                  
                  <div className="space-y-4 text-2xs font-semibold">
                    
                    {[
                      {
                        group: 'Module Level Access Controls',
                        perms: [
                          { label: 'Platform Management settings panel configuration', active: true },
                          { label: 'Employee accounts salary & shift updates', active: true },
                          { label: 'AI Prediction models compute execution sandbox', active: true }
                        ]
                      },
                      {
                        group: 'Restricted Action Flags',
                        perms: [
                          { label: 'Force delete customer database directories', active: false },
                          { label: 'Clear payment invoices manually bypassing gateway', active: true },
                          { label: 'Update default system tax and commission values', active: true }
                        ]
                      }
                    ].map((grp, idx) => (
                      <div key={idx} className="space-y-2">
                        <span className="text-3xs uppercase tracking-wider text-slate-400 block">{grp.group}</span>
                        <div className="space-y-1.5">
                          {grp.perms.map((p, pIdx) => (
                            <div key={pIdx} className={`p-2.5 rounded border dark:border-slate-800 border-slate-100 flex items-center justify-between ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
                              <span className="font-medium text-slate-400">{p.label}</span>
                              <input type="checkbox" defaultChecked={p.active} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 4. ACTIVITY LOGS */}
            {activeSubItem === 'Activity Logs' && (
              <div className="space-y-6">
                
                {/* Audit Cards Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Audits', value: '82,912 logs', change: '+12% vs yesterday', color: 'text-emerald-500' },
                    { label: 'Security Flags', value: '4 events', change: 'Require review', color: 'text-rose-500' },
                    { label: 'System Modifications', value: '458 changes', change: 'Audit trail verified', color: 'text-blue-500' },
                    { label: 'Failed Logins', value: '18 attempts', change: 'IP blocks active', color: 'text-amber-500' }
                  ].map((card, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{card.label}</span>
                      <h4 className="text-sm font-black mt-1 font-heading text-slate-800 dark:text-slate-100">{card.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{card.change}</p>
                    </div>
                  ))}
                </div>

                {/* Audit trail grid */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-3 dark:border-slate-800 border-slate-100 mb-2">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Security Audit logs</h4>
                    <button className="px-3 py-1.5 border dark:border-slate-800 border-slate-200 text-3xs font-bold rounded-lg flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">
                      <Download size={11} /> Export Audit CSV
                    </button>
                  </div>

                  <div className="overflow-x-auto text-2xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2.5 px-4">Administrator</th>
                          <th className="py-2.5 px-4">Action</th>
                          <th className="py-2.5 px-4">IP Address</th>
                          <th className="py-2.5 px-4">Device/Browser</th>
                          <th className="py-2.5 px-4">Timestamp</th>
                          <th className="py-2.5 px-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Sanjay Deshmukh', action: 'Update Platform Tax to 1.5%', ip: '192.168.1.12', dev: 'Chrome / macOS', time: '10 mins ago', status: 'Success' },
                          { name: 'Karan Singh', action: 'Verify Vendor VND-104', ip: '10.0.0.124', dev: 'Safari / iPadOS', time: '1 hour ago', status: 'Success' },
                          { name: 'Priya Patel', action: 'Failed Login Attempt', ip: '192.168.21.9', dev: 'Firefox / Linux', time: '3 hours ago', status: 'Failed' }
                        ].map((log, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-3 px-4 font-extrabold text-slate-800 dark:text-slate-200">{log.name}</td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{log.action}</td>
                            <td className="py-3 px-4">{log.ip}</td>
                            <td className="py-3 px-4 font-medium text-slate-400">{log.dev}</td>
                            <td className="py-3 px-4 text-slate-400">{log.time}</td>
                            <td className="py-3 px-4 text-right">
                              <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>
        )

      case 'Vendor Management':
        return (
          <div className="space-y-6 animate-fade-in pb-12">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
              <div>
                <h2 className="text-sm font-black flex items-center gap-2">
                  <Store size={18} className="text-emerald-500" />
                  <span>Vendor Operations: {activeSubItem}</span>
                </h2>
                <p className="text-3xs text-slate-400 font-medium">Configure merchant compliance, product listings verification, commission rules, and payouts</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md hover:shadow-emerald-500/10 cursor-pointer"
                >
                  <Save size={13} />
                  Save Database
                </button>
              </div>
            </div>

            {/* 1. VENDOR APPROVAL */}
            {activeSubItem === 'Vendor Approval' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Requests List */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Pending Vendor Registrations</h4>
                  
                  <div className="overflow-x-auto text-2xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2.5 px-2">Merchant / Business</th>
                          <th className="py-2.5 px-2">Owner Details</th>
                          <th className="py-2.5 px-2">Signed Up</th>
                          <th className="py-2.5 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { business: 'Patil Agro Fertilizers', owner: 'Ramesh Patil', contact: 'patil@agro.com', date: 'May 20, 2026', initials: 'PA' },
                          { business: 'Baramati Seed Agency', owner: 'Amol Shinde', contact: 'amol@seeds.com', date: 'May 22, 2026', initials: 'BS' }
                        ].map((req, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-3 px-2 flex items-center gap-3">
                              <div className="w-7 h-7 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-3xs">
                                {req.initials}
                              </div>
                              <span className="font-extrabold text-slate-800 dark:text-slate-200">{req.business}</span>
                            </td>
                            <td className="py-3 px-2">
                              <span className="font-bold text-slate-800 dark:text-slate-200">{req.owner}</span>
                              <p className="text-3xs text-slate-400 mt-0.5">{req.contact}</p>
                            </td>
                            <td className="py-3 px-2 text-slate-400">{req.date}</td>
                            <td className="py-3 px-2 text-right space-x-1.5">
                              <button className="px-2 py-1 bg-emerald-500 text-white rounded text-4xs font-bold cursor-pointer">Approve</button>
                              <button className="px-2 py-1 bg-rose-500 text-white rounded text-4xs font-bold cursor-pointer">Reject</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Document details preview */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Merchant Business Documents</h4>
                  
                  <div className="space-y-3.5 text-2xs font-semibold">
                    <div className="p-3 border dark:border-slate-800 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50 flex items-center justify-between">
                      <div>
                        <span className="block text-3xs text-slate-400 uppercase">GSTIN LICENSE</span>
                        <span className="text-slate-800 dark:text-slate-200">27AAAAA1111A1Z1</span>
                      </div>
                      <span className="text-3xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">VERIFIED</span>
                    </div>

                    <div className="p-3 border dark:border-slate-800 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50 flex items-center justify-between">
                      <div>
                        <span className="block text-3xs text-slate-400 uppercase">PAN REGISTRATION CARD</span>
                        <span className="text-slate-800 dark:text-slate-200">ABCDE1234F</span>
                      </div>
                      <span className="text-3xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">VERIFIED</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 2. VENDOR VERIFICATION */}
            {activeSubItem === 'Vendor Verification' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Verification Checkpoints */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">KYC & Compliance Verification Checks</h4>
                  
                  <div className="space-y-3.5 text-2xs">
                    {[
                      { label: 'Merchant Identity Verification', status: 'Approved', color: 'bg-emerald-500/10 text-emerald-500' },
                      { label: 'Business Address & Hub Inspection', status: 'Pending Review', color: 'bg-amber-500/10 text-amber-500' },
                      { label: 'Fertilizer/Seed Retail Licenses', status: 'Approved', color: 'bg-emerald-500/10 text-emerald-500' },
                      { label: 'Bank Account & Voided Check Audit', status: 'Approved', color: 'bg-emerald-500/10 text-emerald-500' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-lg border dark:border-slate-800 border-slate-100 flex items-center justify-between">
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">{item.label}</span>
                        <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${item.color}`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Timeline */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">KYC Verification Audit Timeline</h4>
                  <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4 space-y-4 ml-2">
                    {[
                      { action: 'PAN Verification Completed', time: 'May 20, 14:20' },
                      { action: 'GPS Coordinates Logged', time: 'May 22, 10:12' },
                      { action: 'Seed Retail License Uploaded', time: 'May 24, 09:30' }
                    ].map((step, idx) => (
                      <div key={idx} className="relative text-3xs">
                        <span className="absolute -left-6 top-1 w-3 h-3 bg-emerald-500 rounded-full ring-4 dark:ring-slate-900 ring-white"></span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{step.action}</span>
                        <span className="text-slate-400 font-medium">{step.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 3. VENDOR PRODUCTS */}
            {activeSubItem === 'Vendor Products' && (
              <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-3 dark:border-slate-800 border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Vendor Product Inventory Directory</h4>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto text-3xs font-semibold">
                    <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <Search size={12} className="text-slate-400" />
                      <input type="text" placeholder="Search catalog..." value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} className="bg-transparent outline-none w-28" />
                    </div>
                    
                    <select className={`p-1.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      <option>All Categories</option>
                      <option>Fertilizers</option>
                      <option>Seeds</option>
                      <option>Pesticides</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto text-2xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                        <th className="py-2.5 px-2">Product Name</th>
                        <th className="py-2.5 px-2">Merchant Name</th>
                        <th className="py-2.5 px-2">Category</th>
                        <th className="py-2.5 px-2">Stock Level</th>
                        <th className="py-2.5 px-2">Price</th>
                        <th className="py-2.5 px-2 text-right">Access Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Organic Tomato Fertilizer v2', vendor: 'Pune Fertilisers & Co', category: 'Fertilizers', stock: '250 units', price: '₹450', status: 'Approved' },
                        { name: 'Hybrid Sunflower Seeds v4', vendor: 'Baramati Agri Seeds', category: 'Seeds', stock: '180 units', price: '₹850', status: 'Pending Approval' }
                      ].filter(prod => prod.name.toLowerCase().includes(searchFilter.toLowerCase())).map((prod, idx) => (
                        <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                          <td className="py-3 px-2 font-extrabold text-slate-800 dark:text-slate-200">{prod.name}</td>
                          <td className="py-3 px-2 text-slate-400">{prod.vendor}</td>
                          <td className="py-3 px-2">{prod.category}</td>
                          <td className="py-3 px-2 font-bold text-emerald-500">{prod.stock}</td>
                          <td className="py-3 px-2">{prod.price}</td>
                          <td className="py-3 px-2 text-right">
                            <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${prod.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                              {prod.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. VENDOR PERFORMANCE */}
            {activeSubItem === 'Vendor Performance' && (
              <div className="space-y-6">
                
                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Sales Generated', value: '₹14,50,000', change: '+18.4% MoM', color: 'text-emerald-500' },
                    { label: 'Revenue Commission Share', value: '₹1,45,000', change: '10% Platform Cut', color: 'text-blue-500' },
                    { label: 'Order Fulfillment Rate', value: '98.2%', change: 'Target: 95%', color: 'text-indigo-500' },
                    { label: 'Average Satisfaction Rating', value: '4.7 â­', change: '24,500 reviews', color: 'text-amber-500' }
                  ].map((card, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{card.label}</span>
                      <h4 className="text-sm font-black mt-1 font-heading text-slate-800 dark:text-slate-100">{card.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{card.change}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Leaders */}
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Merchant Leaderboard</h4>
                    <div className="overflow-x-auto text-2xs font-semibold">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                            <th className="py-2 px-1">Merchant Name</th>
                            <th className="py-2 px-1">Fulfillment</th>
                            <th className="py-2 px-1 text-right">Volume</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'Nashik Pesticide Outlet', rate: '99.1%', volume: '₹6,40,000' },
                            { name: 'Pune Fertilisers & Co', rate: '98.5%', volume: '₹4,50,000' },
                            { name: 'Baramati Agri Seeds', rate: '97.2%', volume: '₹2,10,000' }
                          ].map((merch, idx) => (
                            <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50">
                              <td className="py-2.5 px-1 text-slate-800 dark:text-slate-200">{merch.name}</td>
                              <td className="py-2.5 px-1 text-emerald-500 font-extrabold">{merch.rate}</td>
                              <td className="py-2.5 px-1 text-right">{merch.volume}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Fulfillment Performance</h4>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Nashik', value: 99 },
                          { name: 'Pune', value: 98 },
                          { name: 'Baramati', value: 97 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} domain={[90, 100]} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 5. COMMISSION SETTINGS */}
            {activeSubItem === 'Commission Settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Sliders */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Platform Commission Rules</h4>
                  
                  <div className="space-y-4 text-2xs">
                    <div>
                      <div className="flex justify-between font-bold text-slate-400 mb-1">
                        <span>GLOBAL SYSTEM CUT</span>
                        <span className="text-emerald-500">{commissionRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(e.target.value)}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-3">
                      <span className="block font-bold text-slate-400 uppercase tracking-wider">Category Wise Commissions</span>
                      {[
                        { label: 'Fertilizers & Soil Boosters', value: '12%' },
                        { label: 'Hybrid Sowing Seeds', value: '8%' },
                        { label: 'Tools & Sprayers Hardware', value: '15%' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 border dark:border-slate-800 border-slate-100 rounded bg-slate-500/5">
                          <span>{item.label}</span>
                          <span className="font-extrabold text-emerald-500">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Overrides */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Merchant Specific Rates Overrides</h4>
                  
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left font-medium">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2 px-1">Merchant ID</th>
                          <th className="py-2 px-1">Merchant Name</th>
                          <th className="py-2 px-1 text-right">Commission</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'VND-091', name: 'Pune Fertilisers & Co', rate: '6%' },
                          { id: 'VND-152', name: 'Nashik Pesticide Outlet', rate: '14%' }
                        ].map((mer, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50">
                            <td className="py-2.5 px-1 font-bold text-slate-800 dark:text-slate-200">{mer.id}</td>
                            <td className="py-2.5 px-1 text-slate-400">{mer.name}</td>
                            <td className="py-2.5 px-1 text-right font-extrabold text-emerald-500">{mer.rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 6. VENDOR PAYMENTS */}
            {activeSubItem === 'Vendor Payments' && (
              <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800 border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Settled Merchant Payout Transactions</h4>
                  <button className="px-3 py-1.5 border dark:border-slate-800 border-slate-200 text-3xs font-bold rounded-lg flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">
                    <Download size={11} /> Export Payments CSV
                  </button>
                </div>

                <div className="overflow-x-auto text-2xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                        <th className="py-2.5 px-2">Merchant Name</th>
                        <th className="py-2.5 px-2">Settled Amount</th>
                        <th className="py-2.5 px-2">Transfer Mode</th>
                        <th className="py-2.5 px-2">Transaction ID</th>
                        <th className="py-2.5 px-2">Release Date</th>
                        <th className="py-2.5 px-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Nashik Pesticide Outlet', amount: '₹1,45,000', method: 'IMPS Bank Transfer', txn: 'TXN-9832194', date: 'May 24, 2026', status: 'Cleared' },
                        { name: 'Pune Fertilisers & Co', amount: '₹84,500', method: 'UPI Instant Payout', txn: 'TXN-9831084', date: 'May 25, 2026', status: 'Cleared' },
                        { name: 'Baramati Agri Seeds', amount: '₹45,000', method: 'RTGS Settlement', txn: 'TXN-9829821', date: 'May 26, 2026', status: 'Processing' }
                      ].map((pay, idx) => (
                        <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                          <td className="py-3 px-2 font-extrabold text-slate-800 dark:text-slate-200">{pay.name}</td>
                          <td className="py-3 px-2 font-bold text-emerald-500">{pay.amount}</td>
                          <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{pay.method}</td>
                          <td className="py-3 px-2 font-mono text-slate-400">{pay.txn}</td>
                          <td className="py-3 px-2 text-slate-400">{pay.date}</td>
                          <td className="py-3 px-2 text-right">
                            <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${pay.status === 'Cleared' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                              {pay.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. VENDOR COMPLAINTS */}
            {activeSubItem === 'Vendor Complaints' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Tickets list */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Merchant Support Tickets</h4>
                  
                  <div className="overflow-x-auto text-2xs">
                    <table className="w-full text-left font-semibold">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2 px-1">Ticket ID</th>
                          <th className="py-2 px-1">Merchant</th>
                          <th className="py-2 px-1">Issue Category</th>
                          <th className="py-2 px-1">Priority</th>
                          <th className="py-2 px-1 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'TKT-902', name: 'Baramati Agri Seeds', cat: 'App payment processing failed', pri: 'High', status: 'Open' },
                          { id: 'TKT-845', name: 'Pune Fertilisers & Co', cat: 'Fulfillment hub GPS delay', pri: 'Medium', status: 'Pending Review' }
                        ].map((tkt, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-2.5 px-1 font-bold text-slate-800 dark:text-slate-200">{tkt.id}</td>
                            <td className="py-2.5 px-1 text-slate-400">{tkt.name}</td>
                            <td className="py-2.5 px-1">{tkt.cat}</td>
                            <td className="py-2.5 px-1 text-rose-500 font-extrabold">{tkt.pri}</td>
                            <td className="py-2.5 px-1 text-right">
                              <span className={`text-4xs px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-500`}>{tkt.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Response interface */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Resolve Active Ticket</h4>
                  <div className="space-y-3.5 text-2xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">REPLY STATEMENT</label>
                      <textarea rows="3" placeholder="Enter resolution explanation for the merchant..." className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500 resize-none`}></textarea>
                    </div>
                    <button onClick={() => handleSave('Resolution ticket dispatched!')} className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-2xs rounded-lg transition-all flex items-center justify-center gap-1">
                      <Send size={12} /> Dispatch Resolution
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 8. RATINGS & REVIEWS */}
            {activeSubItem === 'Ratings & Reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Reviews List */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Customer Merchant Reviews</h4>
                  
                  <div className="space-y-3.5 text-2xs">
                    {[
                      { user: 'Ramesh Patil (Farmer)', content: 'Pune Fertilisers provided fast delivery on tomato spray. Highly recommended.', rating: '5 â­', vendor: 'Pune Fertilisers & Co' },
                      { user: 'Sanjay Deshmukh (Farmer)', content: 'Seeds quality was average. Sowing delay occurred due to vendor courier lag.', rating: '3 â­', vendor: 'Baramati Agri Seeds' }
                    ].map((rev, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-700 hover:bg-slate-900' : 'bg-slate-50 border-slate-200 hover:bg-white'} transition-all`}>
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-slate-900 dark:text-slate-100 dark:text-slate-200">{rev.user}</span>
                          <span className="text-amber-500 font-extrabold">{rev.rating}</span>
                        </div>
                        <p className="text-3xs text-slate-400 mt-1 font-medium">{rev.content}</p>
                        <div className="flex justify-between items-center text-4xs text-slate-400 font-bold mt-2 uppercase border-t pt-1.5 dark:border-slate-700 border-slate-100">
                          <span>Target Merchant: {rev.vendor}</span>
                          <button className="text-rose-500 hover:underline cursor-pointer">Hide Spam</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating summary */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Overall Rating Distribution</h4>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: '5 Star', value: 1200 },
                          { name: '4 Star', value: 800 },
                          { name: '3 Star', value: 300 },
                          { name: '2 Star', value: 100 }
                        ]} innerRadius={35} outerRadius={50} paddingAngle={4} dataKey="value">
                          {COLORS.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {/* 9. SUSPEND VENDOR */}
            {activeSubItem === 'Suspend Vendor' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Controls */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Merchant Suspension Control</h4>
                  
                  <div className="space-y-4 text-2xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">SELECT MERCHANT ACCOUNT</label>
                      <select className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-200 text-slate-650'}`}>
                        <option>Vidarbha Farmer Outlet (Suspended)</option>
                        <option>Baramati Agri Seeds (Warning Flag)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">SUSPENSION TYPE</label>
                        <select className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-200'}`}>
                          <option>Temporary (30 Days)</option>
                          <option>Permanent Block</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">PENALTY VALUE CHARGED</label>
                        <input type="text" defaultValue="₹15,000" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none`} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">ADMINISTRATOR SUSPENSION NOTES</label>
                      <textarea rows="2" defaultValue="Vendor charged high shipping rates violating platform merchant limits." className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-rose-500 resize-none`}></textarea>
                    </div>
                  </div>
                </div>

                {/* Logs */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Merchant Suspension History</h4>
                  
                  <div className="space-y-3.5 text-2xs font-semibold">
                    <div className="p-3 border border-rose-500/10 rounded-lg bg-rose-500/5 flex items-center justify-between">
                      <div>
                        <span className="block text-3xs text-rose-500 uppercase font-extrabold">Vidarbha Farmer Outlet</span>
                        <span className="text-slate-400">Suspended on May 12, 2026. Reason: Overpricing.</span>
                      </div>
                      <button onClick={() => handleSave('Merchant account reactivated!')} className="px-2.5 py-1 bg-emerald-600 text-white rounded text-4xs font-bold flex items-center gap-0.5 cursor-pointer">
                        <LockOpen size={10} /> Reactivate
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )

      case 'Farmer/User Management':
        return (
          <div className="space-y-6 animate-fade-in pb-12">
            
            {/* Main Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
              <div>
                <h2 className="text-sm font-black flex items-center gap-2">
                  <Users size={18} className="text-emerald-500" />
                  <span>Farmer & User Hub: {activeSubItem}</span>
                </h2>
                <p className="text-3xs text-slate-400 font-medium">Configure customer profile details, KYC documents review, wallet logs, loyalty systems, and support tickets</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md hover:shadow-emerald-500/10 cursor-pointer"
                >
                  <Save size={13} />
                  Save Console Database
                </button>
              </div>
            </div>

            {/* 1. USER PROFILES */}
            {activeSubItem === 'User Profiles' && (
              <div className="space-y-6">
                
                {/* Search & Action Row */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-3xs ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <Search size={12} className="text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search farmers/users..." 
                        value={searchFilter} 
                        onChange={(e) => setSearchFilter(e.target.value)} 
                        className="bg-transparent outline-none w-48 text-slate-700 dark:text-slate-200" 
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSave('User registry report generated!')} 
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-3xs rounded-lg flex items-center gap-1 transition-all cursor-pointer w-full sm:w-auto justify-center"
                  >
                    <Download size={11} /> Export Registry (CSV)
                  </button>
                </div>

                {/* Farmer/User Grid Registry */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="overflow-x-auto text-2xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2.5 px-3">Farmer Profile</th>
                          <th className="py-2.5 px-3">Contact</th>
                          <th className="py-2.5 px-3">Location</th>
                          <th className="py-2.5 px-3">Registered On</th>
                          <th className="py-2.5 px-3">KYC Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'USR-8321', name: 'Ramesh Patil', email: 'ramesh.patil@gmail.com', phone: '+91 98231 44521', location: 'Satara, Maharashtra', registered: 'May 10, 2026', kyc: 'Verified', crop: 'Tomatoes & Cotton', land: '5 Acres', spent: '₹14,500' },
                          { id: 'USR-9042', name: 'Sanjay Deshmukh', email: 'sanjay.d@outlook.com', phone: '+91 95481 02842', location: 'Baramati, Pune', registered: 'May 15, 2026', kyc: 'Verified', crop: 'Sugarcane', land: '8 Acres', spent: '₹22,100' },
                          { id: 'USR-1085', name: 'Priya Patel', email: 'priya.patel@agri.com', phone: '+91 98982 73210', location: 'Mehsana, Gujarat', registered: 'May 20, 2026', kyc: 'Pending Review', crop: 'Groundnuts & Wheat', land: '4 Acres', spent: '₹3,200' }
                        ].filter(u => u.name.toLowerCase().includes(searchFilter.toLowerCase()) || u.location.toLowerCase().includes(searchFilter.toLowerCase())).map((userObj, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-3.5 px-3 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-green-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                {userObj.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-800 dark:text-slate-200">{userObj.name}</span>
                                <p className="text-3xs text-slate-400 font-bold uppercase tracking-wider">{userObj.id}</p>
                              </div>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="block text-slate-800 dark:text-slate-200">{userObj.phone}</span>
                              <p className="text-3xs text-slate-400 font-medium">{userObj.email}</p>
                            </td>
                            <td className="py-3.5 px-3 text-slate-400 font-semibold">{userObj.location}</td>
                            <td className="py-3.5 px-3 text-slate-400">{userObj.registered}</td>
                            <td className="py-3.5 px-3">
                              <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${userObj.kyc === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                {userObj.kyc}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <button 
                                onClick={() => setSelectedUser(userObj)} 
                                className="text-emerald-500 hover:text-emerald-400 underline font-bold inline-flex items-center gap-0.5 cursor-pointer"
                              >
                                <Eye size={10} /> View Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Profile Details Modal Dialog */}
                {selectedUser && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`w-full max-w-xl p-6 rounded-xl border shadow-xl ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'} space-y-5`}
                    >
                      <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800 border-slate-100">
                        <div className="flex items-center gap-2">
                          <UserCheck className="text-emerald-500" size={16} />
                          <h3 className="text-xs font-bold font-heading">Farmer Operational Profile: {selectedUser.name}</h3>
                        </div>
                        <button onClick={() => { setSelectedUser(null); setIsEditingProfile(false); }} className="text-slate-400 hover:text-slate-200 font-bold text-sm"><X size={14} /></button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-2xs">
                        <div className="p-3 rounded-lg dark:bg-slate-950 bg-slate-50 space-y-1">
                          <span className="block text-3xs text-slate-600 dark:text-slate-400 uppercase font-bold">Farming Land Size</span>
                          <span className="font-extrabold text-slate-700 dark:text-slate-200">{selectedUser.land}</span>
                        </div>
                        <div className="p-3 rounded-lg dark:bg-slate-950 bg-slate-50 space-y-1">
                          <span className="block text-3xs text-slate-600 dark:text-slate-400 uppercase font-bold">Primary Cultivated Crops</span>
                          <span className="font-extrabold text-slate-700 dark:text-slate-200">{selectedUser.crop}</span>
                        </div>
                        <div className="p-3 rounded-lg dark:bg-slate-950 bg-slate-50 space-y-1">
                          <span className="block text-3xs text-slate-600 dark:text-slate-400 uppercase font-bold">Purchase Volume Ledger</span>
                          <span className="font-extrabold text-emerald-500">{selectedUser.spent} cleared orders</span>
                        </div>
                        <div className="p-3 rounded-lg dark:bg-slate-950 bg-slate-50 space-y-1">
                          <span className="block text-3xs text-slate-600 dark:text-slate-400 uppercase font-bold">Verified Location Hub</span>
                          <span className="font-extrabold text-slate-700 dark:text-slate-200">{selectedUser.location}</span>
                        </div>
                      </div>

                      {isEditingProfile ? (
                        <div className="space-y-3 text-2xs border-t pt-4 dark:border-slate-800 border-slate-100">
                          <h4 className="font-bold text-emerald-500 uppercase tracking-wider text-3xs">Edit Profile Fields</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-slate-400 font-bold mb-1">CULTIVATED CROPS</label>
                              <input type="text" defaultValue={selectedUser.crop} className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'} outline-none`} />
                            </div>
                            <div>
                              <label className="block text-slate-400 font-bold mb-1">LAND SIZE ACREAGE</label>
                              <input type="text" defaultValue={selectedUser.land} className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'} outline-none`} />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setIsEditingProfile(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 font-bold rounded">Cancel</button>
                            <button onClick={() => { setIsEditingProfile(false); handleSave('Farmer profile parameters updated successfully!'); }} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded">Save Profile</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2 border-t pt-4 dark:border-slate-800 border-slate-100">
                          <button onClick={() => setIsEditingProfile(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-3xs rounded-lg flex items-center gap-1 transition-all cursor-pointer">
                            <Edit size={11} /> Modify Profile Coordinates
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}

              </div>
            )}

            {/* 2. KYC VERIFICATION */}
            {activeSubItem === 'KYC Verification' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Checkpoint list */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Pending KYC Audits</h4>
                  
                  <div className="space-y-3.5 text-2xs">
                    {[
                      { user: 'Priya Patel', type: 'Aadhaar & PAN Match', status: 'Pending Approval', file: 'aadhaar_priya_2026.pdf', checked: false },
                      { user: 'Sanjay Deshmukh', type: 'Bank Account Penny-drop', status: 'Approved', file: 'bank_passbook_sanjay.png', checked: true },
                      { user: 'Ramesh Patil', type: 'Address Verification Bill', status: 'Approved', file: 'utility_bill_ramesh.pdf', checked: true }
                    ].map((kycItem, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg border dark:border-slate-800 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-200 block text-xs">{kycItem.user}</span>
                          <span className="text-slate-400 font-semibold">{kycItem.type} &bull; File: {kycItem.file}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setKycPreviewDoc(kycItem.file)} 
                            className="px-2 py-1 bg-slate-800 text-slate-350 rounded font-bold hover:underline cursor-pointer"
                          >
                            Preview Doc
                          </button>
                          {kycItem.checked ? (
                            <span className="text-4xs px-2 py-1 bg-emerald-500/10 text-emerald-500 font-bold rounded">VERIFIED</span>
                          ) : (
                            <div className="flex gap-1">
                              <button onClick={() => handleSave('KYC Approved successfully!')} className="px-2 py-1 bg-emerald-600 text-white rounded text-4xs font-bold cursor-pointer">Accept</button>
                              <button onClick={() => handleSave('KYC Rejected, notification sent.')} className="px-2 py-1 bg-rose-600 text-white rounded text-4xs font-bold cursor-pointer">Reject</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Document Preview Area */}
                  {kycPreviewDoc && (
                    <div className="p-4 rounded-xl border dark:border-slate-800 border-slate-100 dark:bg-slate-950 bg-slate-50 space-y-2">
                      <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800 border-slate-200">
                        <span className="font-bold text-3xs text-emerald-500 uppercase tracking-widest">Document Reader: {kycPreviewDoc}</span>
                        <button onClick={() => setKycPreviewDoc(null)} className="text-rose-500 text-3xs font-extrabold">Close Preview</button>
                      </div>
                      <div className="h-28 border border-dashed rounded flex items-center justify-center dark:border-slate-800 border-slate-300 dark:bg-slate-900 bg-white">
                        <span className="text-3xs text-slate-400 font-medium">Visual Sandbox: PDF/Image preview for document checking is online.</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Audit Timeline & Rejected requests */}
                <div className="space-y-6">
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">KYC Validation Log</h4>
                    
                    <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4 space-y-4 ml-2">
                      {[
                        { action: 'Aadhaar Verified - Priya Patel', time: '10 mins ago' },
                        { action: 'PAN verification cleared - Ramesh Patil', time: '1 hour ago' },
                        { action: 'Bank verification check - Sanjay Deshmukh', time: '2 hours ago' }
                      ].map((step, idx) => (
                        <div key={idx} className="relative text-3xs">
                          <span className="absolute -left-6 top-1 w-3 h-3 bg-emerald-500 rounded-full ring-4 dark:ring-slate-900 ring-white"></span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">{step.action}</span>
                          <span className="text-slate-400 font-medium">{step.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl border border-rose-500/10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} shadow-sm space-y-3`}>
                    <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider">Rejected KYC Submissions</h4>
                    <div className="space-y-2 text-3xs text-slate-400">
                      <div className="p-2 rounded bg-rose-500/5 border border-rose-500/10 flex justify-between items-center">
                        <span>Anil Kumar (Incorrect Address Bill)</span>
                        <span className="text-rose-500 font-extrabold">FLAGGED</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 3. WALLET MANAGEMENT */}
            {activeSubItem === 'Wallet Management' && (
              <div className="space-y-6">
                
                {/* Stats cards row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Platform Wallet Deposits', value: '₹2,84,500', change: 'Synced with Bank APIs', color: 'text-emerald-500' },
                    { label: 'Cleared Refund Wallets', value: '₹14,900', change: '8 pending entries', color: 'text-blue-500' },
                    { label: 'Active Withdrawal Requests', value: '₹32,000', change: 'Requires manual dispatch', color: 'text-amber-500' }
                  ].map((card, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{card.label}</span>
                      <h4 className="text-sm font-black mt-1 font-heading text-slate-800 dark:text-slate-100">{card.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{card.change}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Table Panel */}
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">User Wallet Ledger</h4>
                      <div className="flex gap-2 text-3xs font-bold">
                        <select 
                          value={walletTxType} 
                          onChange={(e) => setWalletTxType(e.target.value)}
                          className={`p-1.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-200'}`}
                        >
                          <option value="All">All Transactions</option>
                          <option value="Recharge">Recharge</option>
                          <option value="Refund">Refund</option>
                          <option value="Purchase">Purchase</option>
                        </select>
                        <button onClick={() => handleSave('Transaction statement report downloaded!')} className="px-3 py-1.5 border dark:border-slate-800 border-slate-200 rounded-lg bg-emerald-600 text-white flex items-center gap-1 cursor-pointer">
                          <Download size={11} /> Export CSV
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto text-2xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                            <th className="py-2 px-2">Farmer</th>
                            <th className="py-2 px-2">Type</th>
                            <th className="py-2 px-2">Amount</th>
                            <th className="py-2 px-2">Date</th>
                            <th className="py-2 px-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'Ramesh Patil', type: 'Recharge', amount: '+₹5,000', date: 'May 24, 2026', status: 'Success' },
                            { name: 'Sanjay Deshmukh', type: 'Purchase', amount: '-₹3,500', date: 'May 25, 2026', status: 'Success' },
                            { name: 'Priya Patel', type: 'Refund', amount: '+₹1,200', date: 'May 26, 2026', status: 'Success' }
                          ].filter(tx => walletTxType === 'All' || tx.type === walletTxType).map((tx, idx) => (
                            <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                              <td className="py-2.5 px-2 text-slate-800 dark:text-slate-200 font-extrabold">{tx.name}</td>
                              <td className="py-2.5 px-2 text-slate-400">{tx.type}</td>
                              <td className={`py-2.5 px-2 font-bold ${tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-slate-500'}`}>{tx.amount}</td>
                              <td className="py-2.5 px-2 text-slate-400">{tx.date}</td>
                              <td className="py-2.5 px-2 text-right">
                                <span className="text-4xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-500">{tx.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Analytics chart */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Recharge Flow Analytics</h4>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Mon', value: 12000 },
                          { name: 'Tue', value: 15000 },
                          { name: 'Wed', value: 22000 },
                          { name: 'Thu', value: 18000 },
                          { name: 'Fri', value: 25000 },
                          { name: 'Sat', value: 31000 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip />
                          <Area type="monotone" dataKey="value" fill="#10b981" stroke="#10b981" fillOpacity={0.1} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 4. LOYALTY POINTS */}
            {activeSubItem === 'Loyalty Points' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Leaderboard and rewards progress */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Loyalty Rewards Leaderboard</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'Ramesh Patil', points: 4200, level: 'Gold Tier', rank: '#1' },
                      { name: 'Sanjay Deshmukh', points: 3150, level: 'Silver Tier', rank: '#2' }
                    ].map((userLoyal, idx) => (
                      <div key={idx} className="p-4 rounded-xl border dark:border-slate-700 border-slate-100 dark:bg-slate-950 bg-slate-50 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-200 text-xs">{userLoyal.name}</span>
                          <span className="text-emerald-500 font-extrabold text-xs">{userLoyal.rank}</span>
                        </div>
                        <div className="flex justify-between text-3xs text-slate-400 font-bold uppercase tracking-wider">
                          <span>{userLoyal.level}</span>
                          <span>{userLoyal.points} Points</span>
                        </div>
                        <div className="w-full bg-slate-300 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(userLoyal.points / 5000) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Accrued vs Redeemed Chart */}
                  <div className="space-y-4">
                    <h4 className="text-3xs font-bold text-slate-400 uppercase tracking-widest">Points Activity Statistics</h4>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { name: 'Wk 1', Accrued: 400, Redeemed: 240 },
                          { name: 'Wk 2', Accrued: 800, Redeemed: 320 },
                          { name: 'Wk 3', Accrued: 1100, Redeemed: 700 },
                          { name: 'Wk 4', Accrued: 1500, Redeemed: 980 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip />
                          <Line type="monotone" dataKey="Accrued" stroke="#10b981" strokeWidth={2} />
                          <Line type="monotone" dataKey="Redeemed" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Campaign Creator Form */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Launch Points Campaign</h4>
                  
                  <div className="space-y-3.5 text-2xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">CAMPAIGN TITLE</label>
                      <input 
                        type="text" 
                        value={newCampaignName}
                        onChange={(e) => setNewCampaignName(e.target.value)}
                        placeholder="e.g. Kharif Bonus Sowing Campaign" 
                        className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500`} 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">REWARD POINTS MULTIPLIER</label>
                      <input 
                        type="number" 
                        value={newCampaignPoints}
                        onChange={(e) => setNewCampaignPoints(Number(e.target.value))}
                        className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'} outline-none`} 
                      />
                    </div>
                    <button 
                      onClick={() => {
                        handleSave(`Rewards campaign "${newCampaignName || 'Bonus Points'}" launched successfully!`);
                        setNewCampaignName('');
                      }} 
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-2xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus size={13} /> Launch Reward Campaign
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 5. SUBSCRIPTIONS */}
            {activeSubItem === 'Subscriptions' && (
              <div className="space-y-6">
                
                {/* Active Membership Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { plan: 'Farmer Basic', price: 'Free', users: '12,450 users', details: 'Access to weather & basic multi-vendor product catalog directories.' },
                    { plan: 'Farmer Premium Silver', price: '₹149/mo', users: '4,520 users', details: 'Add priority dispatch shipping, custom pesticide analysis compute API access.' },
                    { plan: 'Farmer Enterprise Gold', price: '₹299/mo', users: '1,890 users', details: 'Full real-time yield prediction AI models, 1-on-1 support consults, 0% wallet charge fee.' }
                  ].map((tier, idx) => (
                    <div key={idx} className={`p-5 rounded-xl border flex flex-col justify-between ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                      <div className="space-y-1">
                        <span className="text-emerald-500 font-extrabold uppercase text-3xs tracking-widest block">{tier.plan}</span>
                        <h4 className="text-base font-black font-heading text-slate-900 dark:text-slate-100 dark:text-slate-100">{tier.price}</h4>
                        <span className="text-4xs text-slate-400 font-bold bg-slate-550 border border-slate-800 px-2 py-0.5 rounded-full">{tier.users}</span>
                      </div>
                      <p className="text-3xs text-slate-400 font-medium leading-relaxed">{tier.details}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Expiry Alert Registry */}
                  <div className={`lg:col-span-2 p-5 rounded-xl border border-rose-500/10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider">Subscription Expiry Notifications</h4>
                    
                    <div className="space-y-3.5 text-2xs font-semibold">
                      {[
                        { name: 'Ramesh Patil', plan: 'Gold Plan', expiry: 'May 31, 2026', alert: 'Expires in 3 days' },
                        { name: 'Sanjay Deshmukh', plan: 'Silver Plan', expiry: 'June 02, 2026', alert: 'Expires in 5 days' }
                      ].map((subAlert, idx) => (
                        <div key={idx} className="p-3 border border-rose-500/15 rounded-lg bg-rose-500/5 flex items-center justify-between">
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-slate-200 block text-xs">{subAlert.name}</span>
                            <span className="text-slate-600 dark:text-slate-400 font-semibold">{subAlert.plan} &bull; Expiration: {subAlert.expiry}</span>
                          </div>
                          <span className="text-4xs text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded uppercase tracking-wider">{subAlert.alert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recurring revenue analytics */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Monthly Subscription MRR</h4>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Jan', MRR: 45000 },
                          { name: 'Feb', MRR: 58000 },
                          { name: 'Mar', MRR: 71000 },
                          { name: 'Apr', MRR: 89000 },
                          { name: 'May', MRR: 112000 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip />
                          <Area type="monotone" dataKey="MRR" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 6. USER COMPLAINTS */}
            {activeSubItem === 'User Complaints' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Tickets registry table */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Farmer Incident Support Tickets</h4>
                  
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2.5 px-2">Ticket ID</th>
                          <th className="py-2.5 px-2">Farmer</th>
                          <th className="py-2.5 px-2">Issue Description</th>
                          <th className="py-2.5 px-2">Priority</th>
                          <th className="py-2.5 px-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'TKT-FMR-45', name: 'Ramesh Patil', desc: 'Crop Disease AI diagnosis loading failure on Android app', priority: 'High', status: 'Open' },
                          { id: 'TKT-FMR-62', name: 'Sanjay Deshmukh', desc: 'Seed package delivery location GPS mismatch', priority: 'Medium', status: 'Processing' }
                        ].map((complaint, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-3 px-2 font-bold text-slate-900 dark:text-slate-100 dark:text-slate-200">{complaint.id}</td>
                            <td className="py-3 px-2 text-slate-400">{complaint.name}</td>
                            <td className="py-3 px-2 text-slate-400 truncate max-w-[160px]">{complaint.desc}</td>
                            <td className="py-3 px-2">
                              <span className={`font-extrabold ${complaint.priority === 'High' ? 'text-rose-500' : 'text-amber-500'}`}>{complaint.priority}</span>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <button 
                                onClick={() => setSelectedComplaintId(complaint.id)}
                                className={`text-4xs px-2.5 py-1 rounded-full font-bold cursor-pointer transition-all ${selectedComplaintId === complaint.id ? 'bg-emerald-600 text-white' : 'bg-amber-500/10 text-amber-500'}`}
                              >
                                {complaint.status} (Select)
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Resolution panel */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Dispatch Incident Resolution</h4>
                  
                  {selectedComplaintId ? (
                    <div className="space-y-3.5 text-2xs">
                      <span className="block font-bold text-emerald-500 uppercase tracking-widest text-3xs">TICKET ID: {selectedComplaintId}</span>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">REPLY STATEMENT</label>
                        <textarea 
                          rows="3" 
                          placeholder="Provide the resolution message to the farmer..." 
                          value={complaintReplyText}
                          onChange={(e) => setComplaintReplyText(e.target.value)}
                          className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500 resize-none`}
                        ></textarea>
                      </div>
                      <button 
                        onClick={() => {
                          handleSave(`Resolution message dispatched to ticket ${selectedComplaintId}!`);
                          setComplaintReplyText('');
                          setSelectedComplaintId(null);
                        }} 
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-2xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send size={12} /> Dispatch Resolution
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-3xs font-medium">
                      Select an incident support ticket from the registry to open response console.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 7. NOTIFICATIONS */}
            {activeSubItem === 'Notifications' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Notification composer */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Compose Broadcast Campaign</h4>
                  
                  <div className="space-y-3.5 text-2xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">SELECT NOTIFICATION CHANNEL</label>
                        <select 
                          value={notifChannel} 
                          onChange={(e) => setNotifChannel(e.target.value)}
                          className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-250 text-slate-650'}`}
                        >
                          <option value="Push">Push Notification</option>
                          <option value="SMS">SMS Alerts</option>
                          <option value="Email">Email Newsletters</option>
                          <option value="WhatsApp">WhatsApp Message</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">TARGET SEGMENT AUDIENCE</label>
                        <select 
                          value={notifAudience} 
                          onChange={(e) => setNotifAudience(e.target.value)}
                          className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-250 text-slate-650'}`}
                        >
                          <option value="All Farmers">All Farmers</option>
                          <option value="Premium Members">Premium Gold Members</option>
                          <option value="Unverified KYC">Unverified KYC Accounts</option>
                          <option value="Maharashtra Region">Maharashtra Region Hub</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">NOTIFICATION MESSAGING BODY</label>
                      <textarea 
                        rows="4" 
                        placeholder="Write the operational notification payload here..." 
                        value={notifContent}
                        onChange={(e) => setNotifContent(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-emerald-500 resize-none`}
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          handleSave(`${notifChannel} notification campaign dispatched to ${notifAudience}!`);
                          setNotifContent('');
                        }} 
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-2xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Megaphone size={13} /> Send Notification Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delivery Logs */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Delivery history log</h4>
                  
                  <div className="space-y-3 text-3xs font-semibold text-slate-400">
                    {[
                      { title: 'Kharif crop fertilizer subsidy alert', type: 'SMS', sent: '10,000 sent', rate: '98% Delivery' },
                      { title: 'KYC missing documents submission reminder', type: 'Push', sent: '412 sent', rate: '100% Delivery' },
                      { title: 'Weekly weather prediction alert', type: 'WhatsApp', sent: '18,500 sent', rate: '92% Delivery' }
                    ].map((historyItem, idx) => (
                      <div key={idx} className="p-3 border dark:border-slate-700 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50">
                        <span className="block text-slate-800 dark:text-slate-200 text-2xs font-extrabold mb-1">{historyItem.title}</span>
                        <div className="flex justify-between items-center text-4xs">
                          <span>Channel: {historyItem.type} &bull; {historyItem.sent}</span>
                          <span className="text-emerald-500 font-extrabold">{historyItem.rate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 8. SUSPEND USERS */}
            {activeSubItem === 'Suspend Users' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Controls */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">User Suspension Management</h4>
                  
                  <div className="space-y-4 text-2xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">SELECT USER ACCOUNT</label>
                      <select className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-200 text-slate-650'}`}>
                        <option>Amit Patil (Warning Status)</option>
                        <option>Jayesh Patel (Temporary Block)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">SUSPENSION DURATION</label>
                        <select 
                          value={suspensionType} 
                          onChange={(e) => setSuspensionType(e.target.value)}
                          className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-650'}`}
                        >
                          <option value="Temporary">Temporary Block (30 Days)</option>
                          <option value="Permanent">Permanent Account Ban</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">PENALTY POINTS LEVIED</label>
                        <input type="text" defaultValue="500 Points" className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none`} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">OPERATIONAL POLICY VIOLATION DETAILS</label>
                      <textarea 
                        rows="2" 
                        value={suspensionReason}
                        onChange={(e) => setSuspensionReason(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} outline-none focus:border-rose-500 resize-none`}
                      ></textarea>
                    </div>

                    <button 
                      onClick={() => handleSave(`User suspension applied successfully!`)} 
                      className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-2xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/10"
                    >
                      <Ban size={13} /> Apply Account Restrictions
                    </button>
                  </div>
                </div>

                {/* Suspension History Logs */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Suspended Registry & Violations Log</h4>
                  
                  <div className="space-y-3.5 text-2xs font-semibold">
                    <div className="p-3.5 border border-rose-500/10 rounded-lg bg-rose-500/5 flex items-center justify-between">
                      <div>
                        <span className="block text-3xs text-rose-500 uppercase font-extrabold">Amit Patil</span>
                        <span className="text-slate-400">Suspended on May 20, 2026. Reason: Abuse of referral scheme.</span>
                      </div>
                      <button onClick={() => handleSave('Farmer account reactivated successfully!')} className="px-2.5 py-1 bg-emerald-600 text-white rounded text-4xs font-bold flex items-center gap-0.5 cursor-pointer">
                        <LockOpen size={10} /> Reactivate
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )

      case 'Employee Management':
        return (
          <div className="space-y-6 animate-fade-in pb-12">
            
            {/* Main Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
              <div>
                <h2 className="text-sm font-black flex items-center gap-2">
                  <Briefcase size={18} className="text-emerald-500" />
                  <span>Employee Console: {activeSubItem}</span>
                </h2>
                <p className="text-3xs text-slate-400 font-medium">Manage workforce registry, customize system privileges, track clock logs, and monitor operational compliance</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md hover:shadow-emerald-500/10 cursor-pointer"
                >
                  <Save size={13} />
                  Save Changes
                </button>
              </div>
            </div>

            {/* 1. EMPLOYEE ACCOUNTS */}
            {activeSubItem === 'Employee Accounts' && (
              <div className="space-y-6">
                
                {/* Filters */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-3xs ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <Search size={12} className="text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search employees..." 
                        value={searchFilter} 
                        onChange={(e) => setSearchFilter(e.target.value)} 
                        className="bg-transparent outline-none w-48 text-slate-750 dark:text-slate-200" 
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSave('Employee list registry report generated!')} 
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-3xs rounded-lg flex items-center gap-1 transition-all cursor-pointer w-full sm:w-auto justify-center"
                  >
                    <Download size={11} /> Export Registry (CSV)
                  </button>
                </div>

                {/* Table */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="overflow-x-auto text-2xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2.5 px-3">Employee</th>
                          <th className="py-2.5 px-3">ID & Dept</th>
                          <th className="py-2.5 px-3">Contact</th>
                          <th className="py-2.5 px-3">Joining Date</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'EMP-8201', name: 'Amit Verma', email: 'amit.v@agroerp.com', phone: '+91 94231 88421', dept: 'Operations', role: 'Field Manager', date: 'May 01, 2026', status: 'Active' },
                          { id: 'EMP-9022', name: 'Sunita Rao', email: 'sunita.r@agroerp.com', phone: '+91 95420 18210', dept: 'Core Technology', role: 'ML Engineer', date: 'May 10, 2026', status: 'Active' },
                          { id: 'EMP-1081', name: 'Vikram Sinha', email: 'vikram.s@agroerp.com', phone: '+91 97890 23412', dept: 'Accounting', role: 'Payroll Specialist', date: 'May 18, 2026', status: 'Active' }
                        ].filter(e => e.name.toLowerCase().includes(searchFilter.toLowerCase()) || e.dept.toLowerCase().includes(searchFilter.toLowerCase())).map((emp, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-3.5 px-3 flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                {emp.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-800 dark:text-slate-200">{emp.name}</span>
                                <p className="text-3xs text-slate-400 font-bold uppercase tracking-wider">{emp.role}</p>
                              </div>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="block text-slate-800 dark:text-slate-200">{emp.id}</span>
                              <p className="text-3xs text-slate-400 font-semibold">{emp.dept}</p>
                            </td>
                            <td className="py-3.5 px-3 text-slate-400 font-semibold">
                              <span className="block">{emp.phone}</span>
                              <p className="text-3xs font-medium">{emp.email}</p>
                            </td>
                            <td className="py-3.5 px-3 text-slate-400">{emp.date}</td>
                            <td className="py-3.5 px-3">
                              <span className="text-4xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-500">
                                {emp.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <button 
                                onClick={() => setSelectedEmployee(emp)} 
                                className="text-emerald-500 hover:text-emerald-400 underline font-bold inline-flex items-center gap-0.5 cursor-pointer"
                              >
                                <Eye size={10} /> View Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Profile Details Modal Dialog */}
                {selectedEmployee && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`w-full max-w-xl p-6 rounded-xl border shadow-xl ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'} space-y-5`}
                    >
                      <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800 border-slate-100">
                        <div className="flex items-center gap-2">
                          <UserCheck className="text-emerald-500" size={16} />
                          <h3 className="text-xs font-bold font-heading">Employee Profile: {selectedEmployee.name}</h3>
                        </div>
                        <button onClick={() => { setSelectedEmployee(null); setIsEditingEmployee(false); }} className="text-slate-400 hover:text-slate-200 font-bold text-sm"><X size={14} /></button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-2xs">
                        <div className="p-3 rounded-lg dark:bg-slate-950 bg-slate-50 space-y-1">
                          <span className="block text-3xs text-slate-600 dark:text-slate-400 uppercase font-bold">DEPARTMENT NAME</span>
                          <span className="font-extrabold text-slate-700 dark:text-slate-200">{selectedEmployee.dept}</span>
                        </div>
                        <div className="p-3 rounded-lg dark:bg-slate-950 bg-slate-50 space-y-1">
                          <span className="block text-3xs text-slate-600 dark:text-slate-400 uppercase font-bold">ROLE ASSIGNED</span>
                          <span className="font-extrabold text-slate-700 dark:text-slate-200">{selectedEmployee.role}</span>
                        </div>
                        <div className="p-3 rounded-lg dark:bg-slate-950 bg-slate-50 space-y-1">
                          <span className="block text-3xs text-slate-600 dark:text-slate-400 uppercase font-bold">JOINING DATE</span>
                          <span className="font-extrabold text-slate-700 dark:text-slate-200">{selectedEmployee.date}</span>
                        </div>
                        <div className="p-3 rounded-lg dark:bg-slate-950 bg-slate-50 space-y-1">
                          <span className="block text-3xs text-slate-600 dark:text-slate-400 uppercase font-bold">EMPLOYEE ID</span>
                          <span className="font-extrabold text-slate-700 dark:text-slate-200">{selectedEmployee.id}</span>
                        </div>
                      </div>

                      {isEditingEmployee ? (
                        <div className="space-y-3 text-2xs border-t pt-4 dark:border-slate-800 border-slate-100">
                          <h4 className="font-bold text-emerald-500 uppercase tracking-wider text-3xs">Edit Profile Fields</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-slate-400 font-bold mb-1">ASSIGNED DEPARTMENT</label>
                              <input type="text" defaultValue={selectedEmployee.dept} className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'} outline-none`} />
                            </div>
                            <div>
                              <label className="block text-slate-400 font-bold mb-1">OPERATIONAL ROLE TITLE</label>
                              <input type="text" defaultValue={selectedEmployee.role} className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'} outline-none`} />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setIsEditingEmployee(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 font-bold rounded">Cancel</button>
                            <button onClick={() => { setIsEditingEmployee(false); handleSave('Employee operational details updated!'); }} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded">Save Employee</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2 border-t pt-4 dark:border-slate-800 border-slate-100">
                          <button onClick={() => setIsEditingEmployee(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-3xs rounded-lg flex items-center gap-1 transition-all cursor-pointer">
                            <Edit size={11} /> Modify Employee Details
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}

              </div>
            )}

            {/* 2. ROLE ASSIGNMENT */}
            {activeSubItem === 'Role Assignment' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form controls */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">System Privilege Configurations</h4>
                  
                  <div className="space-y-3.5 text-2xs font-semibold">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">SELECT EMPLOYEE</label>
                        <select className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-250'}`}>
                          <option>Amit Verma (Field Manager)</option>
                          <option>Sunita Rao (ML Engineer)</option>
                          <option>Vikram Sinha (Payroll Specialist)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">ASSIGN CONSOLE AUTHORITY</label>
                        <select className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-250'}`}>
                          <option>Regional Admin</option>
                          <option>Inventory controller</option>
                          <option>Finance controller</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="block text-3xs text-slate-400 uppercase tracking-widest font-bold">Console Privileges Matrix</span>
                      {[
                        { label: 'Verify vendor licenses & GSTIN reports', active: true },
                        { label: 'Issue credit payouts bypassing check constraints', active: false },
                        { label: 'Edit system commission rates sliders', active: false }
                      ].map((perm, idx) => (
                        <div key={idx} className={`p-2.5 rounded border dark:border-slate-800 border-slate-100 flex items-center justify-between ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
                          <span className="font-medium text-slate-400">{perm.label}</span>
                          <input type="checkbox" defaultChecked={perm.active} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
                        </div>
                      ))}
                    </div>

                    <button onClick={() => handleSave('Privilege matrix applied successfully!')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-2xs rounded-lg transition-all shadow-md">
                      Apply System Access
                    </button>
                  </div>
                </div>

                {/* Role list hierarchy */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Role Structure Overview</h4>
                  <div className="space-y-3 text-3xs font-semibold text-slate-400">
                    <div className="p-3 border dark:border-slate-700 border-slate-100 rounded bg-slate-500/5">
                      <span className="block text-slate-800 dark:text-slate-200 text-2xs font-bold">1. Super Admin</span>
                      <p className="mt-0.5">Root access configuration controls bypass</p>
                    </div>
                    <div className="p-3 border dark:border-slate-700 border-slate-100 rounded bg-slate-500/5">
                      <span className="block text-slate-800 dark:text-slate-200 text-2xs font-bold">2. Regional Controllers</span>
                      <p className="mt-0.5">Complaint handling and approvals</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 3. ATTENDANCE */}
            {activeSubItem === 'Attendance' && (
              <div className="space-y-6">
                
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Today Total Active Hours', value: '48.5 Hours', change: 'Across all active shifts', color: 'text-emerald-500' },
                    { label: 'Late Clock arrivals', value: '2 occurrences', change: 'Warning notices sent', color: 'text-rose-500' },
                    { label: 'Perfect Clock Rate', value: '94.2%', change: 'Target: 95%', color: 'text-blue-500' }
                  ].map((card, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{card.label}</span>
                      <h4 className="text-sm font-black mt-1 font-heading text-slate-800 dark:text-slate-100">{card.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{card.change}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Attendance table */}
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Daily Attendance Registry</h4>
                      <button onClick={() => handleSave('Clock report CSV exported!')} className="px-3 py-1.5 border dark:border-slate-800 border-slate-200 text-3xs font-bold rounded-lg bg-emerald-600 text-white flex items-center gap-1 cursor-pointer">
                        <Download size={11} /> Export Clock List
                      </button>
                    </div>

                    <div className="overflow-x-auto text-2xs font-semibold">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                            <th className="py-2 px-2">Employee</th>
                            <th className="py-2 px-2">Clock In</th>
                            <th className="py-2 px-2">Clock Out</th>
                            <th className="py-2 px-2">Duration</th>
                            <th className="py-2 px-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'Amit Verma', checkin: '09:02 AM', checkout: '05:30 PM', hours: '8h 28m', status: 'On Time' },
                            { name: 'Sunita Rao', checkin: '09:45 AM', checkout: '06:12 PM', hours: '8h 27m', status: 'Late' },
                            { name: 'Vikram Sinha', checkin: '08:55 AM', checkout: '05:00 PM', hours: '8h 05m', status: 'On Time' }
                          ].map((clock, idx) => (
                            <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                              <td className="py-2.5 px-2 text-slate-900 dark:text-slate-100 dark:text-slate-200 font-extrabold">{clock.name}</td>
                              <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{clock.checkin}</td>
                              <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{clock.checkout}</td>
                              <td className="py-2.5 px-2">{clock.hours}</td>
                              <td className="py-2.5 px-2 text-right">
                                <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${clock.status === 'On Time' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                  {clock.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Calendar Widget mock and stats */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Attendance Calendar</h4>
                    <div className="p-4 rounded border dark:border-slate-800 border-slate-250 dark:bg-slate-950 bg-slate-50 text-center text-3xs space-y-2">
                      <span className="font-extrabold text-slate-400 block uppercase">MAY 2026</span>
                      <div className="grid grid-cols-7 gap-1 font-bold text-slate-500">
                        {['S','M','T','W','T','F','S'].map((day, idx) => <span key={idx}>{day}</span>)}
                        {Array.from({ length: 31 }).map((_, idx) => (
                          <span key={idx} className={`p-1 rounded cursor-pointer ${idx + 1 === 28 ? 'bg-emerald-500 text-white' : 'hover:bg-slate-800'}`}>{idx + 1}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 4. SALARIES */}
            {activeSubItem === 'Salaries' && (
              <div className="space-y-6">
                
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Cumulative Monthly Payroll', value: '₹14,80,000', change: 'Released on May 28', color: 'text-emerald-500' },
                    { label: 'Deductions & TDS', value: '₹1,48,000', change: '10% average deduction', color: 'text-slate-500' },
                    { label: 'Bonus Payments Disbursed', value: '₹45,000', change: 'Kharif success payouts', color: 'text-blue-500' }
                  ].map((card, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{card.label}</span>
                      <h4 className="text-sm font-black mt-1 font-heading text-slate-800 dark:text-slate-100">{card.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{card.change}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Table Panel */}
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800 border-slate-100">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Salaries & Disbursements Ledger</h4>
                      <button onClick={() => handleSave('Payroll statement downloaded!')} className="px-3 py-1.5 border dark:border-slate-800 border-slate-200 text-3xs font-bold rounded-lg bg-emerald-600 text-white flex items-center gap-1 cursor-pointer">
                        <Download size={11} /> Export Payroll CSV
                      </button>
                    </div>

                    <div className="overflow-x-auto text-2xs font-semibold">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                            <th className="py-2 px-2">Employee</th>
                            <th className="py-2 px-2">Salary</th>
                            <th className="py-2 px-2">Bonus</th>
                            <th className="py-2 px-2">Tax TDS</th>
                            <th className="py-2 px-2">Status</th>
                            <th className="py-2 px-2 text-right">Payslip</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'Amit Verma', salary: '₹45,000', bonus: '₹5,000', tds: '₹4,500', status: 'Paid' },
                            { name: 'Sunita Rao', salary: '₹85,000', bonus: '₹10,000', tds: '₹8,500', status: 'Paid' },
                            { name: 'Vikram Sinha', salary: '₹38,000', bonus: '₹2,000', tds: '₹3,800', status: 'Processing' }
                          ].map((pay, idx) => (
                            <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                              <td className="py-2.5 px-2 text-slate-900 dark:text-slate-100 dark:text-slate-200 font-extrabold">{pay.name}</td>
                              <td className="py-2.5 px-2 font-bold text-emerald-500">{pay.salary}</td>
                              <td className="py-2.5 px-2 text-slate-400 font-bold">{pay.bonus}</td>
                              <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{pay.tds}</td>
                              <td className="py-2.5 px-2">
                                <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${pay.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                  {pay.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-2 text-right">
                                <button onClick={() => handleSave(`Salary slip generated for ${pay.name}`)} className="text-emerald-500 font-extrabold hover:underline">Download</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Payroll Cumulative Growth</h4>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Jan', value: 820000 },
                          { name: 'Feb', value: 940000 },
                          { name: 'Mar', value: 1100000 },
                          { name: 'Apr', value: 1250000 },
                          { name: 'May', value: 1480000 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip />
                          <Area type="monotone" dataKey="value" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 5. LEAVE MANAGEMENT */}
            {activeSubItem === 'Leave Management' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Leave Requests */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Active Leave Requests</h4>
                  
                  <div className="space-y-3 text-2xs font-semibold">
                    {[
                      { name: 'Amit Verma', type: 'Sick Leave', reason: 'Fever recovery checking', duration: '2 days', status: 'Pending' },
                      { name: 'Sunita Rao', type: 'Casual Leave', reason: 'Family trip scheduling', duration: '5 days', status: 'Approved' }
                    ].map((leaveItem, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg border dark:border-slate-800 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-200 block text-xs">{leaveItem.name}</span>
                          <span className="text-slate-400 font-semibold">{leaveItem.type} &bull; Duration: {leaveItem.duration} &bull; Reason: {leaveItem.reason}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {leaveItem.status === 'Pending' ? (
                            <div className="flex gap-1">
                              <button onClick={() => handleSave('Leave request Approved successfully!')} className="px-2 py-1 bg-emerald-600 text-white rounded text-4xs font-bold cursor-pointer">Accept</button>
                              <button onClick={() => handleSave('Leave request Rejected successfully!')} className="px-2 py-1 bg-rose-600 text-white rounded text-4xs font-bold cursor-pointer">Reject</button>
                            </div>
                          ) : (
                            <span className="text-4xs px-2 py-1 bg-emerald-500/10 text-emerald-500 font-bold rounded">APPROVED</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leave Balance Stats */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Department Leave Balances</h4>
                  <div className="space-y-3.5 text-3xs font-bold text-slate-400">
                    <div className="flex justify-between items-center p-2 rounded dark:bg-slate-950 bg-slate-50">
                      <span>Operations team average</span>
                      <span className="text-emerald-500 font-extrabold">12 days left</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded dark:bg-slate-950 bg-slate-50">
                      <span>Technology team average</span>
                      <span className="text-emerald-500 font-extrabold">18 days left</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 6. SHIFT MANAGEMENT */}
            {activeSubItem === 'Shift Management' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Schedule list */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Work Shift Schedule</h4>
                  
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2 px-2">Employee Name</th>
                          <th className="py-2 px-2">Shift Type</th>
                          <th className="py-2 px-2">Hours Block</th>
                          <th className="py-2 px-2 text-right">Swap request</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Amit Verma', shift: 'Morning Shift', hours: '06:00 AM - 02:00 PM', swap: 'None' },
                          { name: 'Sunita Rao', shift: 'Evening Shift', hours: '02:00 PM - 10:00 PM', swap: 'Requested' },
                          { name: 'Vikram Sinha', shift: 'Night Shift', hours: '10:00 PM - 06:00 AM', swap: 'None' }
                        ].map((empShift, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-2.5 px-2 text-slate-900 dark:text-slate-100 dark:text-slate-200 font-extrabold">{empShift.name}</td>
                            <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{empShift.shift}</td>
                            <td className="py-2.5 px-2 font-mono text-slate-400">{empShift.hours}</td>
                            <td className="py-2.5 px-2 text-right">
                              {empShift.swap === 'Requested' ? (
                                <button onClick={() => handleSave('Shift swap Request Approved!')} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-4xs font-bold cursor-pointer">Accept Swap</button>
                              ) : (
                                <span className="text-slate-400 font-medium">No swap request</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Shift overview stats */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Operational Shift Loads</h4>
                  
                  <div className="space-y-3 text-3xs font-extrabold text-slate-600 dark:text-slate-400">
                    <div className="p-2.5 rounded bg-slate-550 border border-slate-800">
                      <span>MORNING SHIFT LOAD</span>
                      <p className="text-xs font-black text-emerald-500 mt-1">12 active staff</p>
                    </div>
                    <div className="p-2.5 rounded bg-slate-550 border border-slate-800">
                      <span>NIGHT SHIFT LOAD</span>
                      <p className="text-xs font-black text-indigo-500 mt-1">4 active staff</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 7. GPS TRACKING */}
            {activeSubItem === 'GPS Tracking' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Live Tracking map mock */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Delivery Route Tracker map</h4>
                    <span className="text-4xs px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-bold rounded animate-pulse">Live Map Active</span>
                  </div>

                  <div className="h-64 border border-dashed rounded flex flex-col items-center justify-center dark:border-slate-800 border-slate-350 dark:bg-slate-950 bg-slate-50">
                    <span className="text-xs font-bold text-slate-400">Coordinate Plot Sandbox</span>
                    <p className="text-3xs text-slate-400 mt-1">Simulated delivery route mapping for: {gpsActiveStaff}</p>
                  </div>
                </div>

                {/* Delivery crew list */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Field Delivery Staff Coordinates</h4>
                  
                  <div className="space-y-3.5 text-2xs font-semibold">
                    {[
                      { id: 'EMP-401', name: 'Rohan Shinde', speed: '42 km/h', loc: 'Satara Highway Hub' },
                      { id: 'EMP-452', name: 'Nikhil Patil', speed: '0 km/h (Stopped)', loc: 'Pune Warehouse Center' }
                    ].map((staff, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setGpsActiveStaff(staff.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${gpsActiveStaff === staff.id ? 'border-emerald-500 bg-emerald-500/5' : 'dark:border-slate-800 border-slate-100 hover:border-emerald-500/30'}`}
                      >
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-200 block">{staff.name} ({staff.id})</span>
                        <p className="text-3xs text-slate-400 mt-1 font-semibold">{staff.loc} &bull; Velocity: {staff.speed}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 8. ACTIVITY MONITORING */}
            {activeSubItem === 'Activity Monitoring' && (
              <div className="space-y-6">
                
                {/* Security Audit log table */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Workforce Operations security log</h4>
                  
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2.5 px-3">Employee</th>
                          <th className="py-2.5 px-3">Action Performed</th>
                          <th className="py-2.5 px-3">Module scope</th>
                          <th className="py-2.5 px-3">Timestamp</th>
                          <th className="py-2.5 px-3 text-right">Access Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Amit Verma', action: 'Verify Aadhaar doc - USR-8321', scope: 'Farmer Management', time: '12 mins ago', status: 'Success' },
                          { name: 'Sunita Rao', action: 'Update disease prediction compute config', scope: 'AI Services', time: '30 mins ago', status: 'Success' },
                          { name: 'Vikram Sinha', action: 'Failed login challenge', scope: 'Platform Security Gate', time: '2 hours ago', status: 'Flagged / Failed' }
                        ].map((log, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-200">{log.name}</td>
                            <td className="py-3 px-3 text-slate-400">{log.action}</td>
                            <td className="py-3 px-3">{log.scope}</td>
                            <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{log.time}</td>
                            <td className="py-3 px-3 text-right">
                              <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>
        )

      case 'Product & Inventory':
        return (
          <div className="space-y-6 animate-fade-in pb-12">
            
            {/* Main Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
              <div>
                <h2 className="text-sm font-black flex items-center gap-2">
                  <Boxes size={18} className="text-emerald-500" />
                  <span>Inventory & Catalog Console: {activeSubItem}</span>
                </h2>
                <p className="text-3xs text-slate-400 font-medium">Configure product categories, bulk pricing directives, discount campaigns, warehouse capacities, and QR dispatch identifiers</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md hover:shadow-emerald-500/10 cursor-pointer"
                >
                  <Save size={13} />
                  Save Configurations
                </button>
              </div>
            </div>

            {/* 1. PRODUCT CATEGORIES */}
            {activeSubItem === 'Product Categories' && (
              <div className="space-y-6">
                
                {/* Search & Add Category */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-3xs ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <Search size={12} className="text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search categories..." 
                        value={searchFilter} 
                        onChange={(e) => setSearchFilter(e.target.value)} 
                        className="bg-transparent outline-none w-48 text-slate-750 dark:text-slate-200" 
                      />
                    </div>
                  </div>
                  <button onClick={() => handleSave('New category structure initialized!')} className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-3xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer">
                    <Plus size={12} /> Add New Category
                  </button>
                </div>

                {/* Categories Table */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2.5 px-3">Category Name</th>
                          <th className="py-2.5 px-3">Subcategories</th>
                          <th className="py-2.5 px-3">Total Products</th>
                          <th className="py-2.5 px-3">Created Date</th>
                          <th className="py-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Organic Fertilizers', icon: Sprout, subs: 6, products: 124, date: 'May 01, 2026', status: 'Active' },
                          { name: 'High-Yield Seeds', icon: Sprout, subs: 12, products: 458, date: 'May 04, 2026', status: 'Active' },
                          { name: 'Crop Protection Liquid', icon: FlaskConical, subs: 4, products: 92, date: 'May 10, 2026', status: 'Active' }
                        ].filter(c => c.name.toLowerCase().includes(searchFilter.toLowerCase())).map((cat, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-3 px-3 flex items-center gap-3">
                              <cat.icon size={16} className="text-emerald-500" />
                              <span className="font-extrabold text-slate-800 dark:text-slate-200">{cat.name}</span>
                            </td>
                            <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{cat.subs} sub-folders</td>
                            <td className="py-3 px-3 font-bold text-emerald-500">{cat.products} products</td>
                            <td className="py-3 px-3 text-slate-400">{cat.date}</td>
                            <td className="py-3 px-3 text-right">
                              <span className="text-4xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-500">{cat.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 2. PRODUCT APPROVAL */}
            {activeSubItem === 'Product Approval' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Requests */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Pending Catalog Requests</h4>
                  
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2 px-2">Product Details</th>
                          <th className="py-2 px-2">Merchant</th>
                          <th className="py-2 px-2">Category</th>
                          <th className="py-2 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'PRD-802', name: 'Neem-shield Bio Pesticide', vendor: 'Pune Fertilisers Ltd', category: 'Crop Protection', stock: 240 },
                          { id: 'PRD-815', name: 'Hybrid Bt Cotton Seeds v10', vendor: 'Baramati Seeds Agency', category: 'High-Yield Seeds', stock: 150 }
                        ].map((req, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-3 px-2">
                              <span className="font-extrabold text-slate-800 dark:text-slate-200 block">{req.name}</span>
                              <span className="text-3xs text-slate-400 font-bold uppercase tracking-wider">{req.id} &bull; Stock: {req.stock}</span>
                            </td>
                            <td className="py-3 px-2 text-slate-400">{req.vendor}</td>
                            <td className="py-3 px-2 text-slate-400">{req.category}</td>
                            <td className="py-3 px-2 text-right space-x-1.5">
                              <button onClick={() => setSelectedProdId(req.id)} className="px-2 py-1 bg-slate-800 text-slate-350 rounded text-4xs font-bold cursor-pointer">Preview</button>
                              <button onClick={() => handleSave('Catalog product Approved!')} className="px-2 py-1 bg-emerald-600 text-white rounded text-4xs font-bold cursor-pointer">Accept</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Preview sidecard */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Verification Preview Box</h4>
                  {selectedProdId ? (
                    <div className="space-y-3 text-2xs">
                      <span className="block font-bold text-emerald-500 uppercase tracking-widest text-3xs">PREVIEWING ID: {selectedProdId}</span>
                      <div className="p-3 border dark:border-slate-700 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50 space-y-2">
                        <p className="font-bold">Operational Verification Parameters</p>
                        <p className="text-slate-400 text-3xs">1. Label claims matches environmental standard certs.</p>
                        <p className="text-slate-400 text-3xs">2. Packaging dimensions verified against delivery limits.</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-slate-400 font-bold">REJECTION CRITERIA NOTES</label>
                        <textarea rows="2" placeholder="Provide explanation details if rejecting..." className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-250' : 'bg-slate-50 border-slate-200'} outline-none resize-none`}></textarea>
                      </div>
                      <button onClick={() => { handleSave('Product rejected, warning notification sent.'); setSelectedProdId(null); }} className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-3xs cursor-pointer">Reject Product</button>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-3xs font-medium">Select a pending request to open validation options.</div>
                  )}
                </div>

              </div>
            )}

            {/* 3. FEATURED PRODUCTS */}
            {activeSubItem === 'Featured Products' && (
              <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Seasonal Promoted Catalog Highlights</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-2xs">
                  {[
                    { name: 'Bt Cotton Seed pack', category: 'High-Yield Seeds', rank: 'Priority #1', sched: 'May 01 - June 30' },
                    { name: 'Organic NPK Fertilizer v2', category: 'Fertilizers', rank: 'Priority #2', sched: 'May 10 - June 15' },
                    { name: 'Neem insect repellent', category: 'Crop Protection', rank: 'Priority #3', sched: 'May 12 - May 31' }
                  ].map((feat, idx) => (
                    <div key={idx} className="p-4 rounded-xl border dark:border-slate-800 border-slate-100 dark:bg-slate-950 bg-slate-50 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-emerald-500 font-bold uppercase text-4xs tracking-widest">{feat.category}</span>
                        <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 mt-1">{feat.name}</h4>
                      </div>
                      <div className="flex justify-between text-3xs text-slate-400 border-t pt-2 dark:border-slate-700 border-slate-200">
                        <span>Rank: {feat.rank}</span>
                        <span>Schedule: {feat.sched}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. PRICING RULES */}
            {activeSubItem === 'Pricing Rules' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Rule parameters */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Dynamic Pricing Slab Calculator</h4>
                  
                  <div className="space-y-4 text-2xs">
                    <div>
                      <div className="flex justify-between font-bold text-slate-400 mb-1">
                        <span>BASE UNIT COST VALUE</span>
                        <span className="text-emerald-500">₹{pricingBaseRate}</span>
                      </div>
                      <input 
                        type="range" 
                        min="100" 
                        max="2000" 
                        value={pricingBaseRate} 
                        onChange={(e) => setPricingBaseRate(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 border rounded dark:bg-slate-950 bg-slate-50 dark:border-slate-700">
                        <span className="block text-3xs text-slate-600 dark:text-slate-400 font-bold uppercase">Tax Slab Factor (18% GST)</span>
                        <span className="font-extrabold text-slate-700 dark:text-slate-100">₹{Math.floor(pricingBaseRate * 0.18)}</span>
                      </div>
                      <div className="p-3 border rounded dark:bg-slate-950 bg-slate-50 dark:border-slate-700">
                        <span className="block text-3xs text-slate-600 dark:text-slate-400 font-bold uppercase">Estimated Retail Target</span>
                        <span className="font-extrabold text-emerald-500">₹{Math.floor(pricingBaseRate * 1.18)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regional settings */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Region-wise Price Multiplier</h4>
                  <div className="space-y-3.5 text-3xs font-bold text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between items-center p-2 rounded dark:bg-slate-950 bg-slate-50">
                      <span>Maharashtra HQ Hub</span>
                      <span className="text-emerald-500">1.0x (Baseline)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded dark:bg-slate-950 bg-slate-50">
                      <span>Punjab Center Hub</span>
                      <span className="text-emerald-500">1.05x (Freight Adjust)</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 5. DISCOUNT RULES */}
            {activeSubItem === 'Discount Rules' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form generator */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Flash Campaign Coupon Creator</h4>
                  
                  <div className="space-y-4 text-2xs font-semibold">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">COUPON STRING CODE</label>
                        <input 
                          type="text" 
                          value={generatedCoupon} 
                          onChange={(e) => setGeneratedCoupon(e.target.value)}
                          className={`w-full p-2.5 rounded border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-250'} outline-none`} 
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">DISCOUNT VALUE (%)</label>
                        <input 
                          type="number" 
                          value={discountPercent} 
                          onChange={(e) => setDiscountPercent(Number(e.target.value))}
                          className={`w-full p-2.5 rounded border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-250'} outline-none`} 
                        />
                      </div>
                    </div>

                    <button onClick={() => handleSave(`Discount coupon "${generatedCoupon}" active with ${discountPercent}% discount!`)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-2xs rounded-lg transition-all shadow-md">
                      Activate Coupon Code
                    </button>
                  </div>
                </div>

                {/* Expiry alerts countdown */}
                <div className={`p-5 rounded-xl border border-rose-500/10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider">Active Flash Sales Timer</h4>
                  <div className="p-3 border border-rose-500/15 rounded bg-rose-50/5 text-center text-3xs font-extrabold">
                    <span className="block text-rose-500">KHARIF-SOW-2026 LIMIT EXPIRED IN</span>
                    <span className="text-sm font-black block mt-1 font-mono text-slate-800 dark:text-slate-100">04 Hours &bull; 12 Mins</span>
                  </div>
                </div>

              </div>
            )}

            {/* 6. TAX SETTINGS */}
            {activeSubItem === 'Tax Settings' && (
              <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Platform GST Slab Assignments</h4>
                
                <div className="overflow-x-auto text-2xs font-semibold">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                        <th className="py-2 px-2">Tax Slab Descriptor</th>
                        <th className="py-2 px-2">SGST Rate</th>
                        <th className="py-2 px-2">CGST Rate</th>
                        <th className="py-2 px-2">Applicable Scope</th>
                        <th className="py-2 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { slab: 'Agri Inputs Slab A (5%)', sgst: '2.5%', cgst: '2.5%', scope: 'Raw Seeds & compost packets' },
                        { slab: 'Agri Inputs Slab B (12%)', sgst: '6.0%', cgst: '6.0%', scope: 'Bio-Fertilizer sprays' },
                        { slab: 'Agri Tools Slab C (18%)', sgst: '9.0%', cgst: '9.0%', scope: 'Hand sprayers & physical tools' }
                      ].map((tax, idx) => (
                        <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                          <td className="py-2.5 px-2 text-slate-900 dark:text-slate-100 dark:text-slate-200 font-extrabold">{tax.slab}</td>
                          <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{tax.sgst}</td>
                          <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{tax.cgst}</td>
                          <td className="py-2.5 px-2 text-slate-400">{tax.scope}</td>
                          <td className="py-2.5 px-2 text-right">
                            <button onClick={() => handleSave('Tax rates override modified!')} className="text-emerald-500 font-bold hover:underline">Edit slab</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. PRODUCT REVIEWS */}
            {activeSubItem === 'Product Reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Review grid list */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Platform Product Reviews Registry</h4>
                  
                  <div className="space-y-3.5 text-2xs">
                    {[
                      { user: 'Ramesh Patil (Satara)', item: 'Neem Oil Spray v2', comment: 'Highly effective pesticide, saw results in 3 days.', rate: '5 â­', status: 'Visible' },
                      { user: 'Amit Verma (Field crew)', item: 'Bt Cotton Seed pack v10', comment: 'Quality is average. Germination rates were delayed due to rain.', rate: '3 â­', status: 'Pending Review' }
                    ].map((review, idx) => (
                      <div key={idx} className={`p-3 border rounded-lg dark:border-slate-800 border-slate-100 dark:bg-slate-950 bg-slate-50 space-y-2`}>
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-900 dark:text-slate-100 dark:text-slate-250">{review.user} &bull; Product: {review.item}</span>
                          <span className="text-amber-500 font-extrabold">{review.rate}</span>
                        </div>
                        <p className="text-3xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{review.comment}</p>
                        <div className="flex justify-end gap-2 border-t pt-1.5 dark:border-slate-700 border-slate-200 text-4xs">
                          {review.status === 'Visible' ? (
                            <span className="text-emerald-500 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded">APPROVED</span>
                          ) : (
                            <div className="flex gap-1.5">
                              <button onClick={() => handleSave('Review approved!')} className="text-emerald-500 font-bold hover:underline cursor-pointer">Accept</button>
                              <button onClick={() => handleSave('Review spam hidden!')} className="text-rose-500 font-bold hover:underline cursor-pointer">Hide Spam</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating distribution chart */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Rating Scale Analytics</h4>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: '5 Star', value: 820 },
                          { name: '4 Star', value: 340 },
                          { name: '3 Star', value: 120 }
                        ]} innerRadius={35} outerRadius={50} paddingAngle={4} dataKey="value">
                          {COLORS.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {/* 8. WAREHOUSES */}
            {activeSubItem === 'Warehouses' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Warehouses list */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Regional Storage Locations</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-2xs">
                    {[
                      { code: 'WH-PUNE-01', name: 'Pune Central Hub', cap: 82, location: 'Hadapsar MIDC, Pune', staff: 'Amit Verma' },
                      { code: 'WH-SATARA-02', name: 'Satara Distributing Center', cap: 45, location: 'Satara Highway road', staff: 'Rohan Shinde' }
                    ].map((wh, idx) => (
                      <div key={idx} className="p-4 border rounded-xl dark:border-slate-800 border-slate-100 dark:bg-slate-950 bg-slate-50 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{wh.name}</span>
                          <span className="text-emerald-500 font-bold font-mono text-3xs">{wh.code}</span>
                        </div>
                        <div className="space-y-1 text-3xs text-slate-400 font-semibold">
                          <p>Location: {wh.location}</p>
                          <p>Supervisor staff: {wh.staff}</p>
                        </div>
                        <div className="space-y-1 text-3xs">
                          <div className="flex justify-between text-4xs font-bold text-slate-400">
                            <span>Storage capacity load</span>
                            <span>{wh.cap}% Full</span>
                          </div>
                          <div className="w-full bg-slate-300 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${wh.cap}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details/Location map */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Warehouse location checking</h4>
                  <div className="h-44 border border-dashed rounded flex items-center justify-center dark:border-slate-800 border-slate-350 dark:bg-slate-950 bg-slate-50">
                    <span className="text-3xs text-slate-400 font-medium">GPS location map is online.</span>
                  </div>
                </div>

              </div>
            )}

            {/* 9. INVENTORY OVERVIEW */}
            {activeSubItem === 'Inventory Overview' && (
              <div className="space-y-6">
                
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Cumulative Catalog value', value: '₹45,80,000', change: 'Total 4 Warehouses sync', color: 'text-emerald-500' },
                    { label: 'Total units in catalog', value: '18,520 units', change: 'Across 14 categories', color: 'text-blue-500' },
                    { label: 'Low Stock products list', value: '4 items', change: 'Reorder limits reached', color: 'text-rose-500' },
                    { label: 'Out of Stock items', value: '0 items', change: 'Baseline checks complete', color: 'text-emerald-500' }
                  ].map((card, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{card.label}</span>
                      <h4 className="text-sm font-black mt-1 font-heading text-slate-800 dark:text-slate-100">{card.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{card.change}</p>
                    </div>
                  ))}
                </div>

                {/* Stock volume analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Category-wise Stock Volumes</h4>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Seeds', value: 8400 },
                          { name: 'Fertilizers', value: 6500 },
                          { name: 'Protection Spray', value: 2400 },
                          { name: 'Machinery tools', value: 1200 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl border border-rose-500/10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider">Low Stock Notifications</h4>
                    <div className="space-y-3.5 text-3xs font-semibold text-slate-400">
                      <div className="p-3 border border-rose-500/15 rounded bg-rose-50/5 flex justify-between items-center">
                        <div>
                          <span className="block text-slate-800 dark:text-slate-100 font-bold">Hybrid Sowing seeds pack</span>
                          <span>Stock: 8 units left</span>
                        </div>
                        <span className="text-4xs px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded font-bold uppercase">REORDER LIMIT</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 10. STOCK TRANSFER */}
            {activeSubItem === 'Stock Transfer' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active transfers */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Inter-Warehouse Transfer Orders</h4>
                  
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2 px-2">Transfer ID</th>
                          <th className="py-2 px-2">Origin WH</th>
                          <th className="py-2 px-2">Destination WH</th>
                          <th className="py-2 px-2">Item count</th>
                          <th className="py-2 px-2 text-right">Transfer status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'TRSF-202', from: 'WH-PUNE-01', to: 'WH-SATARA-02', count: '450 units', status: 'In Transit' },
                          { id: 'TRSF-220', from: 'WH-SATARA-02', to: 'WH-PUNE-01', count: '120 units', status: 'Cleared' }
                        ].map((trans, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-2.5 px-2 text-slate-900 dark:text-slate-100 dark:text-slate-200 font-extrabold">{trans.id}</td>
                            <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{trans.from}</td>
                            <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{trans.to}</td>
                            <td className="py-2.5 px-2 font-bold">{trans.count}</td>
                            <td className="py-2.5 px-2 text-right">
                              <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${trans.status === 'Cleared' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                {trans.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Transfer initiator form */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Dispatch stock transfer</h4>
                  
                  <div className="space-y-3.5 text-2xs font-semibold">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">ORIGIN WAREHOUSE</label>
                      <select className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-250'}`}>
                        <option>WH-PUNE-01 (Pune Central)</option>
                        <option>WH-SATARA-02 (Satara Distributing)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">DESTINATION WAREHOUSE</label>
                      <select className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-350' : 'bg-slate-50 border-slate-250'}`}>
                        <option>WH-SATARA-02 (Satara Distributing)</option>
                        <option>WH-PUNE-01 (Pune Central)</option>
                      </select>
                    </div>
                    <button onClick={() => handleSave('Inter-Warehouse transfer scheduled!')} className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-2xs transition-all cursor-pointer">
                      Schedule Stock Transfer
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 11. DAMAGE REPORTS */}
            {activeSubItem === 'Damage Reports' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Damaged list */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Loss & Damage Registry</h4>
                  
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2 px-2">Product Name</th>
                          <th className="py-2 px-2">Damaged count</th>
                          <th className="py-2 px-2">Warehouse</th>
                          <th className="py-2 px-2">Damage Description Reason</th>
                          <th className="py-2 px-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Organic NPK spray', count: '18 units', wh: 'WH-PUNE-01', reason: 'Packaging leakage during transport', status: 'Written Off' },
                          { name: 'Hybrid sunflower seeds pack', count: '10 units', wh: 'WH-SATARA-02', reason: 'Water damage during storm', status: 'Pending Audit' }
                        ].map((dmg, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-2.5 px-2 text-slate-900 dark:text-slate-100 dark:text-slate-200 font-extrabold">{dmg.name}</td>
                            <td className="py-2.5 px-2 font-bold text-rose-500">{dmg.count}</td>
                            <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{dmg.wh}</td>
                            <td className="py-2.5 px-2 text-slate-400 truncate max-w-[120px]">{dmg.reason}</td>
                            <td className="py-2.5 px-2 text-right">
                              <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${dmg.status === 'Written Off' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {dmg.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Loss analytics */}
                <div className={`p-5 rounded-xl border border-rose-500/10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider font-heading">Financial Loss Analytics</h4>
                  <div className="p-3.5 border border-rose-500/15 rounded bg-rose-50/5 text-center text-3xs font-extrabold space-y-1">
                    <span className="text-rose-550 block">ESTIMATED DAMAGE LOSS MONTH-TO-DATE</span>
                    <span className="text-sm font-black block text-slate-900 dark:text-slate-100 dark:text-slate-100">₹12,450</span>
                  </div>
                </div>

              </div>
            )}

            {/* 12. EXPIRY TRACKING */}
            {activeSubItem === 'Expiry Tracking' && (
              <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Product Batch Expiration Register</h4>
                
                <div className="overflow-x-auto text-2xs font-semibold">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                        <th className="py-2 px-2">Batch code ID</th>
                        <th className="py-2 px-2">Product Name</th>
                        <th className="py-2 px-2">Lifespan End Date</th>
                        <th className="py-2 px-2">Remaining life days</th>
                        <th className="py-2 px-2 text-right">Expiration alert status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { batch: 'BATCH-2026-N1', name: 'Neem Oil Insecticide', expiry: 'June 15, 2026', days: '18 Days', status: 'Near Expiry' },
                        { batch: 'BATCH-2026-F4', name: 'Organic NPK Compost Pack', expiry: 'May 30, 2026', days: '2 Days', status: 'Critical Expiry' }
                      ].map((exp, idx) => (
                        <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                          <td className="py-2.5 px-2 font-mono font-bold text-slate-900 dark:text-slate-100 dark:text-slate-200">{exp.batch}</td>
                          <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{exp.name}</td>
                          <td className="py-2.5 px-2 text-slate-400">{exp.expiry}</td>
                          <td className="py-2.5 px-2 font-extrabold text-rose-500">{exp.days}</td>
                          <td className="py-2.5 px-2 text-right">
                            <span className="text-4xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold uppercase tracking-wider">{exp.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 13. DISPATCH MONITORING */}
            {activeSubItem === 'Dispatch Monitoring' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active Dispatches */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Shipment Transit Register</h4>
                  
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2 px-2">Shipment ID</th>
                          <th className="py-2 px-2">Carrier Crew ID</th>
                          <th className="py-2 px-2">Destination Location</th>
                          <th className="py-2 px-2 text-right">Transit Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'SHIP-9821', staff: 'EMP-401 (Rohan Shinde)', dest: 'Satara Highway Hub', status: 'In Transit' },
                          { id: 'SHIP-9842', staff: 'EMP-452 (Nikhil Patil)', dest: 'Pune Warehouse Center', status: 'Delivered' }
                        ].map((ship, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-2.5 px-2 text-slate-900 dark:text-slate-100 dark:text-slate-200 font-mono font-bold">{ship.id}</td>
                            <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{ship.staff}</td>
                            <td className="py-2.5 px-2 text-slate-400">{ship.dest}</td>
                            <td className="py-2.5 px-2 text-right">
                              <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${ship.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                {ship.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Delayed dispatches */}
                <div className={`p-5 rounded-xl border border-rose-500/10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider font-heading">Delayed Dispatch Warnings</h4>
                  <div className="space-y-3.5 text-3xs font-semibold text-slate-400">
                    <div className="p-3 border border-rose-500/15 rounded bg-rose-50/5 flex justify-between items-center">
                      <div>
                        <span className="block text-slate-800 dark:text-slate-100 font-bold">SHIP-9821</span>
                        <span>Delayed by 42 Mins due to storm</span>
                      </div>
                      <span className="text-4xs px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded font-bold uppercase">DELAYED</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 14. BARCODE / QR SYSTEM */}
            {activeSubItem === 'Barcode / QR System' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Scanner and generators */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Barcode Identifier Code Generator</h4>
                  
                  <div className="space-y-4 text-2xs font-semibold">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">SCAN OR ENTER BARCODE VALUE</label>
                      <input 
                        type="text" 
                        value={scannedBarcode} 
                        onChange={(e) => setScannedBarcode(e.target.value)}
                        className={`w-full p-2.5 rounded border font-mono ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-250'} outline-none focus:border-emerald-500`} 
                      />
                    </div>
                    
                    {/* Visual bar mock */}
                    <div className="p-4 border border-dashed rounded dark:border-slate-800 border-slate-350 dark:bg-slate-950 bg-slate-50 flex flex-col items-center justify-center space-y-2">
                      <div className="h-10 w-44 bg-slate-800 flex justify-between px-2 items-stretch">
                        {Array.from({ length: 18 }).map((_, idx) => (
                          <div key={idx} className="bg-white" style={{ width: idx % 3 === 0 ? '1px' : idx % 4 === 0 ? '3px' : '2px' }}></div>
                        ))}
                      </div>
                      <span className="font-mono text-3xs text-slate-400">{scannedBarcode}</span>
                    </div>
                  </div>
                </div>

                {/* Scanning history logs */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Scanned history log</h4>
                  
                  <div className="space-y-3.5 text-3xs font-semibold text-slate-400">
                    <div className="p-3 border dark:border-slate-700 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50 flex items-center justify-between">
                      <div>
                        <span className="block text-slate-800 dark:text-slate-100 font-bold">8901058002315</span>
                        <span>Item matched: Neem oil spray batch</span>
                      </div>
                      <span className="text-4xs px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded font-bold uppercase">MATCHED</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )

      case 'Orders & Delivery':
        return (
          <div className="space-y-6 animate-fade-in pb-12">
            
            {/* Main Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
              <div>
                <h2 className="text-sm font-black flex items-center gap-2">
                  <Truck size={18} className="text-emerald-500" />
                  <span>Logistics & Order Console: {activeSubItem}</span>
                </h2>
                <p className="text-3xs text-slate-400 font-medium">Configure customer orders tracking, processing stations, delivery partners verification, geofenced routes optimization, and complaints</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md hover:shadow-emerald-500/10 cursor-pointer"
                >
                  <Save size={13} />
                  Save Console
                </button>
              </div>
            </div>

            {/* 1. ALL ORDERS */}
            {activeSubItem === 'All Orders' && (
              <div className="space-y-6">
                
                {/* Search / Filters */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-3xs ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <Search size={12} className="text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search orders..." 
                        value={searchFilter} 
                        onChange={(e) => setSearchFilter(e.target.value)} 
                        className="bg-transparent outline-none w-48 text-slate-750 dark:text-slate-200" 
                      />
                    </div>
                  </div>
                  <button onClick={() => handleSave('Full orders CSV exported!')} className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-3xs rounded-lg flex items-center gap-1 transition-all cursor-pointer">
                    <Download size={11} /> Export Registry (CSV)
                  </button>
                </div>

                {/* Orders Table */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2.5 px-3">Order ID</th>
                          <th className="py-2.5 px-3">Customer</th>
                          <th className="py-2.5 px-3">Product Summary</th>
                          <th className="py-2.5 px-3">Amount</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'ORD-9821', name: 'Ramesh Patil', items: 'Bt Cotton Seeds x5', amount: '₹4,250', status: 'Delivered', date: 'May 24, 2026' },
                          { id: 'ORD-9835', name: 'Sanjay Deshmukh', items: 'Bio NPK compost x2', amount: '₹1,500', status: 'Processing', date: 'May 25, 2026' },
                          { id: 'ORD-9842', name: 'Priya Patel', items: 'Liquid Neem pesticide x1', amount: '₹950', status: 'Pending', date: 'May 26, 2026' }
                        ].filter(o => o.id.toLowerCase().includes(searchFilter.toLowerCase()) || o.name.toLowerCase().includes(searchFilter.toLowerCase())).map((order, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-slate-100 dark:text-slate-200">{order.id}</td>
                            <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{order.name}</td>
                            <td className="py-3 px-3 text-slate-400">{order.items}</td>
                            <td className="py-3 px-3 font-bold text-emerald-500">{order.amount}</td>
                            <td className="py-3 px-3">
                              <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button onClick={() => setSelectedOrderId(order.id)} className="text-emerald-500 hover:text-emerald-450 font-bold underline cursor-pointer">Preview</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Details modal */}
                {selectedOrderId && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`w-full max-w-xl p-6 rounded-xl border shadow-xl ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-5`}
                    >
                      <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800 border-slate-100">
                        <span className="font-bold text-xs">Order details preview: {selectedOrderId}</span>
                        <button onClick={() => setSelectedOrderId(null)} className="text-slate-400 font-bold text-sm"><X size={14} /></button>
                      </div>
                      <div className="p-4 rounded border dark:border-slate-700 dark:bg-slate-950 bg-slate-50 text-2xs space-y-2">
                        <p>1. Delivery courier staff assigned successfully.</p>
                        <p>2. Shipping coordinates matches Satara Hub.</p>
                      </div>
                    </motion.div>
                  </div>
                )}

              </div>
            )}

            {/* 2. PENDING ORDERS */}
            {activeSubItem === 'Pending Orders' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Pending list queue */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Pending verification queue</h4>
                  
                  <div className="space-y-3.5 text-2xs">
                    {[
                      { id: 'ORD-9842', customer: 'Priya Patel', reason: 'Awaiting wallet penny-drop confirmation', priority: 'High' },
                      { id: 'ORD-9855', customer: 'Anil Kumar', reason: 'Inventory stock checking at Satara Hub', priority: 'Medium' }
                    ].map((pend, idx) => (
                      <div key={idx} className="p-3.5 border rounded-lg dark:border-slate-800 border-slate-100 dark:bg-slate-950 bg-slate-50 flex justify-between items-center">
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-100 block">{pend.customer} ({pend.id})</span>
                          <span className="text-slate-600 dark:text-slate-400 font-semibold text-3xs">{pend.reason}</span>
                        </div>
                        <span className={`text-4xs px-2 py-0.5 rounded font-bold uppercase ${pend.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>{pend.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className={`p-5 rounded-xl border border-rose-500/10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider">Delay alert checking</h4>
                  <div className="p-3 border border-rose-500/15 rounded bg-rose-50/5 text-center text-3xs font-extrabold">
                    <span>PENDING VERIFICATIONS OVER 12 HOURS</span>
                    <span className="text-sm font-black block mt-1 text-rose-500">2 Orders Flagged</span>
                  </div>
                </div>

              </div>
            )}

            {/* 3. PROCESSING ORDERS */}
            {activeSubItem === 'Processing Orders' && (
              <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Processing & Packing Stations</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-2xs">
                  {[
                    { id: 'ORD-9835', name: 'Sanjay Deshmukh', station: 'Packing table #2 (Pune WH)', progress: 75 },
                    { id: 'ORD-9848', name: 'Ramesh Patil', station: 'Quality checking station (Satara WH)', progress: 42 }
                  ].map((proc, idx) => (
                    <div key={idx} className="p-4 border rounded-xl dark:border-slate-800 border-slate-100 dark:bg-slate-950 bg-slate-50 space-y-3">
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 dark:text-slate-100 block">{proc.name}</span>
                        <span className="text-4xs text-slate-400 font-bold uppercase font-mono">{proc.id} &bull; {proc.station}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-4xs font-bold text-slate-600 dark:text-slate-400">
                          <span>Packing progress</span>
                          <span>{proc.progress}% Done</span>
                        </div>
                        <div className="w-full bg-slate-300 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${proc.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. DELIVERED ORDERS */}
            {activeSubItem === 'Delivered Orders' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Delivered orders registry */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Delivered Orders Log</h4>
                  
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2 px-2">Order ID</th>
                          <th className="py-2 px-2">Farmer</th>
                          <th className="py-2 px-2">Delivery Date</th>
                          <th className="py-2 px-2 text-right">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'ORD-9821', name: 'Ramesh Patil', date: 'May 24, 2026', rate: '5 â­' },
                          { id: 'ORD-9810', name: 'Sanjay Deshmukh', date: 'May 22, 2026', rate: '4 â­' }
                        ].map((del, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-2.5 px-2 text-slate-900 dark:text-slate-100 dark:text-slate-200 font-mono font-bold">{del.id}</td>
                            <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{del.name}</td>
                            <td className="py-2.5 px-2 text-slate-400">{del.date}</td>
                            <td className="py-2.5 px-2 text-right text-amber-500 font-extrabold">{del.rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Delivered stats pie */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Delivery Satisfaction rating</h4>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: '5 Star', value: 450 },
                          { name: '4 Star', value: 120 },
                          { name: '3 Star', value: 40 }
                        ]} innerRadius={35} outerRadius={50} paddingAngle={4} dataKey="value">
                          {COLORS.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {/* 5. CANCELLED ORDERS */}
            {activeSubItem === 'Cancelled Orders' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Cancelled registry */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Cancelled Orders Register</h4>
                  
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2 px-2">Order ID</th>
                          <th className="py-2 px-2">Customer</th>
                          <th className="py-2 px-2">Cancellation Reason</th>
                          <th className="py-2 px-2 text-right">Refund Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'ORD-9804', name: 'Amit Patil', reason: 'Incorrect product category selected', refund: 'Completed' },
                          { id: 'ORD-9781', name: 'Anil Kumar', reason: 'Wallet transaction double charge', refund: 'Processing' }
                        ].map((can, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-2.5 px-2 text-slate-900 dark:text-slate-100 dark:text-slate-200 font-mono font-bold">{can.id}</td>
                            <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{can.name}</td>
                            <td className="py-2.5 px-2 text-slate-400">{can.reason}</td>
                            <td className="py-2.5 px-2 text-right">
                              <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${can.refund === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                {can.refund}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Reason stats summary */}
                <div className={`p-5 rounded-xl border border-rose-500/10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider font-heading">Cancellation Reason Breakdown</h4>
                  <div className="space-y-3.5 text-3xs font-bold text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between items-center p-2 rounded dark:bg-slate-950 bg-slate-50">
                      <span>Changed mind / selected wrong crop type</span>
                      <span className="text-rose-500">65% cases</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded dark:bg-slate-950 bg-slate-50">
                      <span>Wallet checkout connectivity failed</span>
                      <span className="text-rose-500">35% cases</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 6. RETURNS & REFUNDS */}
            {activeSubItem === 'Returns & Refunds' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Return requests */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Return & Refund Requests</h4>
                  
                  <div className="space-y-3.5 text-2xs font-semibold">
                    {[
                      { id: 'ORD-9804', name: 'Amit Patil', amount: '₹12,500', reason: 'Defective sprayer package leaks', status: 'Pending Approval' }
                    ].map((ret, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg border dark:border-slate-800 border-slate-100 dark:bg-slate-950 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-100 block text-xs">{ret.name} ({ret.id})</span>
                          <span className="text-slate-400 font-semibold">{ret.reason} &bull; Refund Target: {ret.amount}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => handleSave('Refund clearance approved!')} className="px-2 py-1 bg-emerald-600 text-white rounded text-4xs font-bold cursor-pointer">Approve Refund</button>
                          <button onClick={() => handleSave('Refund rejected, support ticket logged.')} className="px-2 py-1 bg-rose-600 text-white rounded text-4xs font-bold cursor-pointer">Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Refund stats */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Refund flow stats</h4>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Mon', value: 4000 },
                        { name: 'Tue', value: 12000 },
                        { name: 'Wed', value: 8000 },
                        { name: 'Thu', value: 14000 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                        <YAxis stroke="#94a3b8" fontSize={9} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" fill="#f43f5e" stroke="#f43f5e" fillOpacity={0.1} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {/* 7. INVOICE MONITORING */}
            {activeSubItem === 'Invoice Monitoring' && (
              <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Tax Invoices registry</h4>
                
                <div className="overflow-x-auto text-2xs font-semibold">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                        <th className="py-2.5 px-2">Invoice Code</th>
                        <th className="py-2.5 px-2">Order ID</th>
                        <th className="py-2.5 px-2">Gst Value</th>
                        <th className="py-2.5 px-2">Release Date</th>
                        <th className="py-2.5 px-2 text-right">Document</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { code: 'INV-2026-9812', order: 'ORD-9821', tax: '₹765', date: 'May 24, 2026' }
                      ].map((inv, idx) => (
                        <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                          <td className="py-2.5 px-2 font-mono font-bold text-slate-900 dark:text-slate-100 dark:text-slate-200">{inv.code}</td>
                          <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{inv.order}</td>
                          <td className="py-2.5 px-2 font-bold text-emerald-500">{inv.tax}</td>
                          <td className="py-2.5 px-2 text-slate-400">{inv.date}</td>
                          <td className="py-2.5 px-2 text-right">
                            <button onClick={() => handleSave(`Payslip invoice document download initialized!`)} className="text-emerald-500 font-extrabold hover:underline">Download PDF</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 8. DELIVERY PARTNERS */}
            {activeSubItem === 'Delivery Partners' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Partners List */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Active Delivery Partner Registry</h4>
                  
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2.5 px-2">Partner Name</th>
                          <th className="py-2.5 px-2">Assigned deliveries</th>
                          <th className="py-2.5 px-2">Region hub</th>
                          <th className="py-2.5 px-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Karan Express Cargo', count: '124 orders', region: 'Satara Highway road', status: 'Active' },
                          { name: 'Baramati Local Courier', count: '82 orders', region: 'Pune MIDC road', status: 'Active' }
                        ].map((part, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-2.5 px-2 text-slate-900 dark:text-slate-100 dark:text-slate-200 font-extrabold">{part.name}</td>
                            <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{part.count}</td>
                            <td className="py-2.5 px-2 text-slate-400">{part.region}</td>
                            <td className="py-2.5 px-2 text-right">
                              <span className="text-4xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-500">{part.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Partner earnings charts */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Carrier earnings share</h4>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Karan', value: 12400 },
                        { name: 'Baramati', value: 8500 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                        <YAxis stroke="#94a3b8" fontSize={9} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {/* 9. LIVE TRACKING */}
            {activeSubItem === 'Live Tracking' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Map */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Active Delivery Route Live Map</h4>
                  <div className="h-64 border border-dashed rounded flex items-center justify-center dark:border-slate-700 border-slate-350 dark:bg-slate-950 bg-slate-50">
                    <span className="text-3xs text-slate-400 font-medium">Visual Sandbox: Tracking active coordinates for order: {activeTrackingOrder}</span>
                  </div>
                </div>

                {/* Staff listings coordinates */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Carrier Staff coordinates</h4>
                  <div className="space-y-3 text-2xs font-semibold">
                    {[
                      { id: 'ORD-9821', driver: 'Rohan Shinde (Karan Cargo)', status: 'In Transit' }
                    ].map((track, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setActiveTrackingOrder(track.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${activeTrackingOrder === track.id ? 'border-emerald-500 bg-emerald-500/5' : 'dark:border-slate-800 border-slate-100 hover:border-emerald-500/30'}`}
                      >
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-200 block">{track.driver}</span>
                        <p className="text-3xs text-slate-400 mt-1 font-semibold">Target ID: {track.id} &bull; Status: {track.status}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 10. ROUTE OPTIMIZATION */}
            {activeSubItem === 'Route Optimization' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Optimized routes */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">AI Route Optimizations</h4>
                  <div className="h-56 border border-dashed rounded flex items-center justify-center dark:border-slate-700 border-slate-350 dark:bg-slate-950 bg-slate-50">
                    <span className="text-3xs text-slate-400 font-medium">Clustered delivery pathways mapped successfully.</span>
                  </div>
                </div>

                {/* Optimization stats */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Efficiency Index</h4>
                  <div className="p-3 border rounded dark:bg-slate-950 bg-slate-50 dark:border-slate-700 text-center text-3xs font-extrabold space-y-1">
                    <span className="text-emerald-500 block">ESTIMATED FUEL EFFICIENCY GAIN</span>
                    <span className="text-sm font-black block text-slate-900 dark:text-slate-100 dark:text-slate-100">18.4% Average</span>
                  </div>
                </div>

              </div>
            )}

            {/* 11. DELIVERY CHARGES */}
            {activeSubItem === 'Delivery Charges' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Charge configurator */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Platform Distance Charges Rule Builder</h4>
                  
                  <div className="space-y-4 text-2xs">
                    <div>
                      <div className="flex justify-between font-bold text-slate-400 mb-1">
                        <span>BASE DELIVERY COURIER CHARGE</span>
                        <span className="text-emerald-500">₹{deliveryChargeBase}</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="200" 
                        value={deliveryChargeBase} 
                        onChange={(e) => setDeliveryChargeBase(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 border rounded dark:bg-slate-950 bg-slate-50 dark:border-slate-700">
                        <span className="block text-3xs text-slate-600 dark:text-slate-400 font-bold uppercase">Express delivery surcharge</span>
                        <span className="font-extrabold text-slate-700 dark:text-slate-100">₹{Math.floor(deliveryChargeBase * 1.5)}</span>
                      </div>
                      <div className="p-3 border rounded dark:bg-slate-950 bg-slate-50 dark:border-slate-700">
                        <span className="block text-3xs text-slate-600 dark:text-slate-400 font-bold uppercase">Average delivery target fee</span>
                        <span className="font-extrabold text-emerald-500">₹{deliveryChargeBase} + ₹2/km</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Region weight configurations */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Weight Surcharge Slab</h4>
                  <div className="space-y-3.5 text-3xs font-bold text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between items-center p-2 rounded dark:bg-slate-950 bg-slate-50">
                      <span>Package weight under 5kg</span>
                      <span className="text-emerald-500">₹0 Extra</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded dark:bg-slate-950 bg-slate-50">
                      <span>Package weight over 5kg</span>
                      <span className="text-emerald-500">₹15/kg Extra</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 12. FAILED DELIVERIES */}
            {activeSubItem === 'Failed Deliveries' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Failed list queue */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Failed Delivery Claims</h4>
                  
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2 px-2">Order ID</th>
                          <th className="py-2 px-2">Courier Partner</th>
                          <th className="py-2 px-2">Failure Reason</th>
                          <th className="py-2 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'ORD-9802', partner: 'Karan Cargo', reason: 'Farmer unavailable at coordinates' }
                        ].map((fail, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-2.5 px-2 text-slate-900 dark:text-slate-100 dark:text-slate-200 font-mono font-bold">{fail.id}</td>
                            <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{fail.partner}</td>
                            <td className="py-2.5 px-2 text-rose-500 font-semibold">{fail.reason}</td>
                            <td className="py-2.5 px-2 text-right">
                              <button onClick={() => handleSave('Reattempt delivery scheduled!')} className="px-2 py-1 bg-emerald-600 text-white rounded text-4xs font-bold cursor-pointer">Schedule Reattempt</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Fraud detection analytics */}
                <div className={`p-5 rounded-xl border border-rose-500/10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider font-heading">Delivery fraud warning alerts</h4>
                  <div className="p-3 border border-rose-500/15 rounded bg-rose-50/5 text-center text-3xs font-extrabold">
                    <span>SUSPICIOUS CARRIER REJECTION RATE</span>
                    <span className="text-sm font-black block mt-1 text-rose-500">0 Flags Raised</span>
                  </div>
                </div>

              </div>
            )}

            {/* 13. DELIVERY COMPLAINTS */}
            {activeSubItem === 'Delivery Complaints' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Tickets list */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Delivery Support tickets</h4>
                  
                  <div className="space-y-3 text-2xs font-semibold">
                    {[
                      { id: 'TKT-DEL-101', name: 'Ramesh Patil', desc: 'Delivery driver demands extra toll money', status: 'Open' }
                    ].map((complaint, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg border dark:border-slate-800 border-slate-100 dark:bg-slate-950 bg-slate-50 flex justify-between items-center">
                        <div>
                          <span className="font-extrabold text-slate-855 dark:text-slate-100 block text-xs">{complaint.name} ({complaint.id})</span>
                          <span className="text-slate-600 dark:text-slate-400 font-semibold">{complaint.desc}</span>
                        </div>
                        <button onClick={() => handleSave('Resolution message dispatched successfully!')} className="px-2.5 py-1 bg-emerald-600 text-white rounded text-4xs font-bold cursor-pointer">Resolve Ticket</button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )

      case 'Financial Management':
        return (
          <div className="space-y-6 animate-fade-in pb-12">
            
            {/* Main Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
              <div>
                <h2 className="text-sm font-black flex items-center gap-2">
                  <IndianRupee size={18} className="text-emerald-500" />
                  <span>Corporate Finance Console: {activeSubItem}</span>
                </h2>
                <p className="text-3xs text-slate-400 font-medium">Configure corporate revenues tracking, vendor payouts disbursement clearance, platform commissions audits, ledger transactions, and tax reports</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md hover:shadow-emerald-500/10 cursor-pointer"
                >
                  <Save size={13} />
                  Save Ledger Database
                </button>
              </div>
            </div>

            {/* 1. REVENUE */}
            {activeSubItem === 'Revenue' && (
              <div className="space-y-6">
                
                {/* Selector Row */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-3xs font-bold">
                    <span className="text-slate-400">REVENUE REPORT RANGE:</span>
                    {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((period) => (
                      <button 
                        key={period} 
                        onClick={() => setActiveRevenuePeriod(period)}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${activeRevenuePeriod === period ? 'bg-emerald-600 text-white font-extrabold' : 'bg-slate-550 text-slate-400'}`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => handleSave('Full revenue comparison report downloaded!')} className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-3xs rounded-lg flex items-center gap-1 transition-all cursor-pointer w-full sm:w-auto justify-center">
                    <Download size={11} /> Revenue Reports (PDF)
                  </button>
                </div>

                {/* Growth and Trends charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Revenue Line Chart */}
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">{activeRevenuePeriod} Revenue Trend Accruals</h4>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Mon', value: 82000 },
                          { name: 'Tue', value: 94000 },
                          { name: 'Wed', value: 120000 },
                          { name: 'Thu', value: 105000 },
                          { name: 'Fri', value: 145000 },
                          { name: 'Sat', value: 180000 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip />
                          <Area type="monotone" dataKey="value" fill="#10b981" stroke="#10b981" fillOpacity={0.1} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Revenue sources breakdown */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Revenue Stream Share</h4>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={[
                            { name: 'Commissions', value: 650000 },
                            { name: 'Subscriptions', value: 340000 },
                            { name: 'Other Payout Cuts', value: 120000 }
                          ]} innerRadius={35} outerRadius={50} paddingAngle={4} dataKey="value">
                            {COLORS.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. VENDOR PAYMENTS */}
            {activeSubItem === 'Vendor Payments' && (
              <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800 border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Merchant Payout Clearances</h4>
                  <button onClick={() => handleSave('Payout checklist CSV exported!')} className="px-3 py-1.5 border dark:border-slate-800 border-slate-200 text-3xs font-bold rounded-lg bg-emerald-600 text-white flex items-center gap-1 cursor-pointer">
                    <Download size={11} /> Export Payout Registry
                  </button>
                </div>

                <div className="overflow-x-auto text-2xs font-semibold">
                  <table className="w-full text-left font-medium">
                    <thead>
                      <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                        <th className="py-2 px-2">Merchant Name</th>
                        <th className="py-2 px-2">Payout Volume</th>
                        <th className="py-2 px-2">Transaction ID</th>
                        <th className="py-2 px-2">Release Date</th>
                        <th className="py-2 px-2 text-right">Clearance status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Nashik Pesticide Outlet', amount: '₹1,45,000', txn: 'TXN-8321045', date: 'May 24, 2026', status: 'Cleared' },
                        { name: 'Pune Fertilisers & Co', amount: '₹84,500', txn: 'TXN-8312089', date: 'May 25, 2026', status: 'Cleared' },
                        { name: 'Baramati Agri Seeds', amount: '₹45,000', txn: 'TXN-8298210', date: 'May 26, 2026', status: 'Processing' }
                      ].map((pay, idx) => (
                        <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50">
                          <td className="py-2.5 px-2 font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-200">{pay.name}</td>
                          <td className="py-2.5 px-2 font-bold text-emerald-500">{pay.amount}</td>
                          <td className="py-2.5 px-2 font-mono text-slate-600 dark:text-slate-400">{pay.txn}</td>
                          <td className="py-2.5 px-2 text-slate-400">{pay.date}</td>
                          <td className="py-2.5 px-2 text-right">
                            <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${pay.status === 'Cleared' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                              {pay.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. COMMISSION EARNINGS */}
            {activeSubItem === 'Commission Earnings' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Total commission overview */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Total Commission Earned by Vendor</h4>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Pune Fert', value: 45000 },
                        { name: 'Nashik Pest', value: 65000 },
                        { name: 'Baramati Seeds', value: 21000 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                        <YAxis stroke="#94a3b8" fontSize={9} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Earnings cards */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Commission Slabs Override</h4>
                  <div className="space-y-3.5 text-3xs font-bold text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between items-center p-2 rounded dark:bg-slate-950 bg-slate-50">
                      <span>Fertilizers category cut</span>
                      <span className="text-emerald-500">12% cut rate</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded dark:bg-slate-950 bg-slate-50">
                      <span>Seeds category cut</span>
                      <span className="text-emerald-500">8% cut rate</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 4. TRANSACTIONS */}
            {activeSubItem === 'Transactions' && (
              <div className="space-y-6">
                
                {/* Search & Actions */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-3xs ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <Search size={12} className="text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search general ledger transactions..." 
                        value={searchFilter} 
                        onChange={(e) => setSearchFilter(e.target.value)} 
                        className="bg-transparent outline-none w-64 text-slate-750 dark:text-slate-200" 
                      />
                    </div>
                  </div>
                  <button onClick={() => handleSave('Full transactions ledger report generated!')} className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-3xs rounded-lg flex items-center gap-1 transition-all cursor-pointer">
                    <Download size={11} /> Export Ledger (CSV)
                  </button>
                </div>

                {/* Ledger Grid */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left font-medium">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2.5 px-2">Transaction ID</th>
                          <th className="py-2.5 px-2">Operator entity</th>
                          <th className="py-2.5 px-2">Amount</th>
                          <th className="py-2.5 px-2">Type</th>
                          <th className="py-2.5 px-2">Gateway logs</th>
                          <th className="py-2.5 px-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'TXN-9821045', name: 'Ramesh Patil', amount: '₹4,250', type: 'Credit', gate: 'Razorpay UPI API', status: 'Success' },
                          { id: 'TXN-9831208', name: 'Pune Fertilisers & Co', amount: '₹84,500', type: 'Debit Payout', gate: 'ICICI Bank IMPS API', status: 'Success' },
                          { id: 'TXN-9801248', name: 'Amit Patil', amount: '₹12,500', type: 'Refund Credit', gate: 'Razorpay Refund API', status: 'Success' }
                        ].filter(t => t.id.toLowerCase().includes(searchFilter.toLowerCase()) || t.name.toLowerCase().includes(searchFilter.toLowerCase())).map((txn, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50 font-medium">
                            <td className="py-3 px-2 font-mono font-bold text-slate-900 dark:text-slate-100 dark:text-slate-200">{txn.id}</td>
                            <td className="py-3 px-2 text-slate-600 dark:text-slate-400 font-extrabold">{txn.name}</td>
                            <td className={`py-3 px-2 font-bold ${txn.type.startsWith('Credit') ? 'text-emerald-500' : 'text-slate-500'}`}>{txn.amount}</td>
                            <td className="py-3 px-2 text-slate-400">{txn.type}</td>
                            <td className="py-3 px-2 text-slate-400">{txn.gate}</td>
                            <td className="py-3 px-2 text-right">
                              <span className="text-4xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-500">{txn.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 5. EXPENSE TRACKING */}
            {activeSubItem === 'Expense Tracking' && (
              <div className="space-y-6">
                
                {/* Expense Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-2xs">
                  {[
                    { name: 'Employee Salaries', value: '₹14,80,000', change: 'released' },
                    { name: 'Marketing Promotions', value: '₹45,000', change: 'accrued' },
                    { name: 'Delivery Cargo Logistics', value: '₹32,000', change: 'accrued' },
                    { name: 'Server compute & APIs cost', value: '₹18,500', change: 'billed' }
                  ].map((exp, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{exp.name}</span>
                      <h4 className="text-sm font-black mt-1 font-heading text-slate-800 dark:text-slate-100">{exp.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{exp.change}</p>
                    </div>
                  ))}
                </div>

                {/* Expenses Recharts */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Expense Distribution</h4>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Salaries', value: 1480000 },
                        { name: 'Marketing', value: 45000 },
                        { name: 'Logistics', value: 32000 },
                        { name: 'Server APIs', value: 18500 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                        <YAxis stroke="#94a3b8" fontSize={9} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#f43f5e" radius={[3, 3, 0, 0]} maxBarSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {/* 6. PROFIT / LOSS REPORTS */}
            {activeSubItem === 'Profit/Loss Reports' && (
              <div className="space-y-6">
                
                {/* Net profit forecast card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Platform Net Profit', value: '₹3,55,800', change: '+15.4% YoY', color: 'text-emerald-500' },
                    { label: 'Revenue comparison', value: '₹12,45,800', change: 'Total cumulative inflow', color: 'text-blue-500' },
                    { label: 'Expense comparison', value: '₹15,75,500', change: 'Total cumulative outflow', color: 'text-rose-500' }
                  ].map((card, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{card.label}</span>
                      <h4 className="text-sm font-black mt-1 font-heading text-slate-900 dark:text-slate-100 dark:text-slate-100">{card.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{card.change}</p>
                    </div>
                  ))}
                </div>

                {/* Profit/Loss charts */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Monthly Revenue vs Expense comparison</h4>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueVsExpense}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                        <YAxis stroke="#94a3b8" fontSize={9} />
                        <Tooltip />
                        <Bar dataKey="Revenue" fill="#10b981" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="Expense" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {/* 7. TAX REPORTS */}
            {activeSubItem === 'Tax Reports' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* GST Slab collections summary */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Accrued GST Tax Collections</h4>
                  
                  <div className="space-y-3.5 text-2xs font-semibold">
                    {[
                      { slab: 'GST Slab A (5%)', amount: '₹12,450', rate: '2.5% CGST + 2.5% SGST' },
                      { slab: 'GST Slab B (12%)', amount: '₹34,800', rate: '6% CGST + 6% SGST' },
                      { slab: 'GST Slab C (18%)', amount: '₹1,12,000', rate: '9% CGST + 9% SGST' }
                    ].map((taxSlab, idx) => (
                      <div key={idx} className="p-3 border dark:border-slate-700 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50 flex justify-between items-center">
                        <div>
                          <span className="block text-slate-800 dark:text-slate-100 font-bold">{taxSlab.slab}</span>
                          <span className="text-slate-600 dark:text-slate-400 text-3xs font-semibold">{taxSlab.rate}</span>
                        </div>
                        <span className="font-extrabold text-emerald-500">{taxSlab.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Tax audits</h4>
                  <button onClick={() => handleSave('GST invoice report download initialized!')} className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-2xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    <Download size={12} /> Download GST PDF Report
                  </button>
                </div>

              </div>
            )}

            {/* 8. SUBSCRIPTION REVENUE */}
            {activeSubItem === 'Subscription Revenue' && (
              <div className="space-y-6">
                
                {/* Price indicators comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { tier: 'Farmer Basic Membership', users: '12,450 users', revenue: '₹0' },
                    { tier: 'Farmer Premium Silver', users: '4,520 users', revenue: '₹6,73,480' },
                    { tier: 'Farmer Premium Gold', users: '1,890 users', revenue: '₹5,65,110' }
                  ].map((sub, idx) => (
                    <div key={idx} className={`p-5 rounded-xl border flex flex-col justify-between ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-3`}>
                      <div>
                        <span className="text-emerald-500 font-bold uppercase text-4xs tracking-widest block">{sub.tier}</span>
                        <h4 className="text-base font-black text-slate-900 dark:text-slate-100 dark:text-slate-100 mt-1">{sub.revenue}</h4>
                      </div>
                      <span className="text-4xs text-slate-400 font-semibold bg-slate-550 border border-slate-800 px-2 py-0.5 rounded-full w-fit">{sub.users}</span>
                    </div>
                  ))}
                </div>

                {/* Subscriptions revenue charts */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Recurring MRR Trend Accruals</h4>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Jan', value: 45000 },
                        { name: 'Feb', value: 58000 },
                        { name: 'Mar', value: 71000 },
                        { name: 'Apr', value: 89000 },
                        { name: 'May', value: 112000 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                        <YAxis stroke="#94a3b8" fontSize={9} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

          </div>
        )

      case 'AI Services':
        return (
          <div className="space-y-6 animate-fade-in pb-12">
            
            {/* 1. CROP RECOMMENDATION AI */}
            {activeSubItem === 'Crop Recommendation AI' && (
              <div className="space-y-6">
                {/* Inputs and Recommendation Controls */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Interactive Soil & Environment Parameters</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-2xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Soil pH ({aiCropSoilPh})</label>
                      <input 
                        type="range" 
                        min="4" 
                        max="9" 
                        step="0.1" 
                        value={aiCropSoilPh} 
                        onChange={(e) => setAiCropSoilPh(parseFloat(e.target.value))} 
                        className="w-full accent-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Moisture Level ({aiCropMoisture}%)</label>
                      <input 
                        type="range" 
                        min="10" 
                        max="90" 
                        value={aiCropMoisture} 
                        onChange={(e) => setAiCropMoisture(parseInt(e.target.value))} 
                        className="w-full accent-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Temperature ({aiCropTemp}Â°C)</label>
                      <input 
                        type="range" 
                        min="10" 
                        max="45" 
                        value={aiCropTemp} 
                        onChange={(e) => setAiCropTemp(parseInt(e.target.value))} 
                        className="w-full accent-emerald-500" 
                      />
                    </div>
                    <div className="flex items-end">
                      <button 
                        onClick={() => handleSave('AI Crop Suitability Recalculated!')} 
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-2xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow-emerald-500/10"
                      >
                        <Sparkles size={13} />
                        Run AI Recommendation
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recommended Crops Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { crop: 'Cotton', score: '94%', demand: 'High', fert: 'NPK 12:32:16, Zinc Sulfate', bg: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20' },
                    { crop: 'Soybean', score: '88%', demand: 'Moderate', fert: 'DAP, Ammonium Phosphate', bg: 'from-emerald-500/10 to-green-500/10 border-emerald-500/20' },
                    { crop: 'Pigeon Pea (Tur)', score: '81%', demand: 'High', fert: 'Single Super Phosphate', bg: 'from-amber-500/10 to-orange-500/10 border-amber-500/20' }
                  ].map((rec, idx) => (
                    <div key={idx} className={`p-5 rounded-xl border bg-gradient-to-br ${rec.bg} flex flex-col justify-between space-y-4`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-emerald-500 text-4xs font-black uppercase tracking-widest block">AI Match Score</span>
                          <span className="text-lg font-black text-slate-900 dark:text-slate-100 dark:text-slate-100 font-heading">{rec.crop}</span>
                        </div>
                        <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">{rec.score}</span>
                      </div>
                      <div className="text-3xs space-y-2 border-t dark:border-slate-800/50 border-slate-200/50 pt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold">MARKET DEMAND:</span>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-100">{rec.demand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold">FERTILIZER SUGGESTIONS:</span>
                          <span className="font-bold text-slate-600 dark:text-slate-400 dark:text-slate-350">{rec.fert}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Region comparison table */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Region-wise Crop Suitability Matrix</h4>
                    <select 
                      value={aiCropRegion} 
                      onChange={(e) => setAiCropRegion(e.target.value)} 
                      className={`text-3xs p-1 rounded border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <option value="All">All Regions</option>
                      <option value="Western Valley">Western Valley</option>
                      <option value="Eastern Plains">Eastern Plains</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left font-medium">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2 px-2">Crop</th>
                          <th className="py-2 px-2">Soil Compatibility</th>
                          <th className="py-2 px-2">Season Yield Forecast</th>
                          <th className="py-2 px-2 text-right">Confidence Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { crop: 'Sugarcane', soil: 'Loamy Black Clay', yield: 'High (82 Tons/Acre)', conf: '91%', region: 'Western Valley' },
                          { crop: 'Chickpeas', soil: 'Sandy Clay Loam', yield: 'Moderate (1.8 Tons/Acre)', conf: '84%', region: 'Eastern Plains' }
                        ].filter(r => aiCropRegion === 'All' || r.region === aiCropRegion).map((row, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50">
                            <td className="py-2.5 px-2 font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-200">{row.crop}</td>
                            <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{row.soil}</td>
                            <td className="py-2.5 px-2 text-slate-400">{row.yield}</td>
                            <td className="py-2.5 px-2 text-right text-emerald-500 font-extrabold">{row.conf}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. DISEASE DETECTION AI */}
            {activeSubItem === 'Disease Detection AI' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Panel */}
                <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Interactive Scanning Console</h4>
                  
                  {/* Fake file dropper */}
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3 transition-colors ${aiDiseaseScanFile ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-950/20'}`}>
                    <div className="w-12 h-12 rounded-full bg-slate-800/40 flex items-center justify-center text-slate-400 text-lg">
                      <Camera size={16} className="text-slate-400" />
                    </div>
                    {aiDiseaseScanFile ? (
                      <div className="text-2xs">
                        <p className="font-extrabold text-emerald-500">Image successfully loaded: {aiDiseaseScanFile}</p>
                        <p className="text-slate-400 mt-1">Resolution: 1024x768 | Format: JPG</p>
                      </div>
                    ) : (
                      <div className="text-2xs text-slate-400">
                        <p className="font-bold">Select or capture crop leaf image</p>
                        <p className="mt-1">Supports JPEG, PNG up to 10MB</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => {
                          setAiDiseaseScanFile('soybean_rust_sample.jpg')
                          setAiDiseaseScanResult({ disease: 'Soybean Rust (Phakopsora pachyrhizi)', confidence: '96%', symptoms: 'Small, water-soaked lesions that rapidly turn tan or reddish-brown on leaf undersides.', treatment: 'Apply Triazole or Strobilurin fungicides. Maintain proper spacing to reduce crop canopy humidity.' })
                          handleSave('Crop disease scan simulated!')
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-3xs rounded-lg transition-all cursor-pointer shadow-sm"
                      >
                        Load Rusty Leaf Sample
                      </button>
                      <button 
                        onClick={() => {
                          setAiDiseaseScanFile('tomato_blight_sample.jpg')
                          setAiDiseaseScanResult({ disease: 'Early Blight (Alternaria solani)', confidence: '92%', symptoms: 'Target-like brown spots with concentric rings, primarily appearing on older leaves first.', treatment: 'Apply Copper-based fungicides. Prune lower foliage to avoid soil splashing. Implement crop rotation.' })
                          handleSave('Crop disease scan simulated!')
                        }}
                        className="px-3.5 py-1.5 border dark:border-slate-800 border-slate-200 text-3xs font-extrabold rounded-lg dark:hover:bg-slate-850 hover:bg-slate-50 cursor-pointer"
                      >
                        Load Blighted Leaf Sample
                      </button>
                    </div>
                  </div>

                  {/* Scan results info */}
                  {aiDiseaseScanResult && (
                    <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-2xs space-y-3.5 animate-fade-in">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-800 dark:text-slate-100 text-xs flex items-center gap-1">
                          <Check size={14} className="text-emerald-500" />
                          <span>AI Detection Match: {aiDiseaseScanResult.disease}</span>
                        </span>
                        <span className="text-3xs font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">{aiDiseaseScanResult.confidence} Confidence</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed font-semibold">
                        <strong className="text-slate-855 dark:text-slate-200">Symptoms:</strong> {aiDiseaseScanResult.symptoms}
                      </p>
                      <div className="p-3 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 rounded text-3xs font-medium">
                        <strong className="text-emerald-500 uppercase tracking-widest block mb-1">Recommended Treatments</strong>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">{aiDiseaseScanResult.treatment}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scan History logs */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Disease Diagnostics History</h4>
                  <div className="space-y-3 text-3xs font-bold text-slate-600 dark:text-slate-400">
                    {[
                      { disease: 'Powdery Mildew', conf: '94%', date: '2 hours ago' },
                      { disease: 'Leaf Spot', conf: '88%', date: '1 day ago' },
                      { disease: 'Bacterial Blight', conf: '91%', date: '3 days ago' }
                    ].map((hist, idx) => (
                      <div key={idx} className="p-3 border dark:border-slate-700 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50 flex justify-between items-center">
                        <div>
                          <span className="block text-slate-855 dark:text-slate-100 font-extrabold">{hist.disease}</span>
                          <span className="text-slate-400 font-medium text-4xs">{hist.date}</span>
                        </div>
                        <span className="text-emerald-500">{hist.conf} Conf</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. WEATHER PREDICTION AI */}
            {activeSubItem === 'Weather Prediction AI' && (
              <div className="space-y-6">
                {/* Region selector controls */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-3xs font-bold">
                    <span className="text-slate-400">TARGET MONITORING REGION:</span>
                    {['Maharashtra', 'Punjab', 'Karnataka', 'Gujarat'].map((reg) => (
                      <button 
                        key={reg} 
                        onClick={() => {
                          setAiWeatherRegion(reg)
                          handleSave(`Weather forecast coordinates adjusted to ${reg}`)
                        }}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${aiWeatherRegion === reg ? 'bg-emerald-600 text-white font-extrabold' : 'bg-slate-550 text-slate-400'}`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                  <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 font-extrabold text-3xs flex items-center gap-1.5">
                    <AlertTriangle size={12} className="animate-bounce" />
                    <span>Storm warning: Heavy wind forecast for next 48h</span>
                  </div>
                </div>

                {/* Weather details widgets */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-2xs">
                  {[
                    { label: 'Forecast Temperature', value: '29.5 Â°C', desc: 'Average seasonal range' },
                    { label: 'Accrued Rain forecast', value: '185 mm', desc: 'High moisture forecast' },
                    { label: 'Atmosphere Humidity', value: '64%', desc: 'Optimal range for cotton' },
                    { label: 'Wind Velocity index', value: '18 km/h', desc: 'North-East direction flow' }
                  ].map((w, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{w.label}</span>
                      <h4 className="text-sm font-black mt-1 font-heading text-slate-800 dark:text-slate-100">{w.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{w.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Chart and prediction report */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Rain & Temp Forecast Chart */}
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">AI Hourly Rain & Temperature Forecast (Next 7 Days)</h4>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { day: 'Day 1', Temp: 28, Rain: 12 },
                          { day: 'Day 2', Temp: 30, Rain: 24 },
                          { day: 'Day 3', Temp: 29, Rain: 45 },
                          { day: 'Day 4', Temp: 27, Rain: 88 },
                          { day: 'Day 5', Temp: 28, Rain: 12 },
                          { day: 'Day 6', Temp: 31, Rain: 8 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip />
                          <Line type="monotone" dataKey="Temp" stroke="#f59e0b" strokeWidth={2} />
                          <Line type="monotone" dataKey="Rain" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Interactive weather suggestions */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Farming Recommendations</h4>
                    <div className="space-y-3.5 text-3xs font-semibold leading-relaxed">
                      <div className="p-3 border dark:border-slate-800 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50">
                        <strong className="text-amber-500 block mb-1">Harvesting Alert</strong>
                        <p className="text-slate-600 dark:text-slate-400 font-semibold">Postpone wheat harvesting scheduled for tomorrow due to high rain probability index.</p>
                      </div>
                      <div className="p-3 border dark:border-slate-800 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50">
                        <strong className="text-emerald-500 block mb-1">Optimal Fertilizer Window</strong>
                        <p className="text-slate-600 dark:text-slate-400 font-semibold">Humidity and temperature indexes match perfectly for fertilizer dispersion in afternoon shifts.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. YIELD PREDICTION */}
            {activeSubItem === 'Yield Prediction' && (
              <div className="space-y-6">
                
                {/* Crop target configuration */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-4 text-3xs font-bold w-full sm:w-auto">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 uppercase">Crop:</span>
                      <select 
                        value={aiYieldCrop} 
                        onChange={(e) => setAiYieldCrop(e.target.value)} 
                        className={`p-1 rounded border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                      >
                        <option value="Cotton">Cotton</option>
                        <option value="Sugarcane">Sugarcane</option>
                        <option value="Rice">Rice</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 uppercase">Region:</span>
                      <select 
                        value={aiYieldRegion} 
                        onChange={(e) => setAiYieldRegion(e.target.value)} 
                        className={`p-1 rounded border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                      >
                        <option value="Central District">Central District</option>
                        <option value="North Border">North Border</option>
                        <option value="South Coast">South Coast</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => handleSave('Yield Forecast calculations refreshed!')} className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-3xs rounded-lg transition-all cursor-pointer">
                    Calculate Forecast
                  </button>
                </div>

                {/* Yield predictions layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Historical comparison Chart */}
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Historical vs predicted yield comparison (Tons/Hectare)</h4>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { year: '2022', Yield: 14.5 },
                          { year: '2023', Yield: 15.8 },
                          { year: '2024', Yield: 16.2 },
                          { year: '2025', Yield: 18.0 },
                          { year: '2026 (Pred)', Yield: 19.5 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip />
                          <Bar dataKey="Yield" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={25}>
                            {/* Color pred differently */}
                            <Cell fill="#10b981" />
                            <Cell fill="#10b981" />
                            <Cell fill="#10b981" />
                            <Cell fill="#10b981" />
                            <Cell fill="#6366f1" />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Accuracy indicators */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Soil Productivity Metrics</h4>
                    
                    <div className="space-y-3.5 text-3xs font-extrabold text-slate-600 dark:text-slate-400">
                      <div className="p-3 border dark:border-slate-700 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50 flex justify-between items-center">
                        <span>Soil Nitrogen Level (N)</span>
                        <span className="text-emerald-500">65 kg/ha (Optimal)</span>
                      </div>
                      <div className="p-3 border dark:border-slate-700 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50 flex justify-between items-center">
                        <span>Phosphorus Index (P)</span>
                        <span className="text-amber-500">22 kg/ha (Low)</span>
                      </div>
                      <div className="p-3 border dark:border-slate-700 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50 flex justify-between items-center">
                        <span>Potassium Index (K)</span>
                        <span className="text-emerald-500">145 kg/ha (Optimal)</span>
                      </div>
                      <div className="p-3 border dark:border-slate-700 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50 flex justify-between items-center">
                        <span>Yield accuracy threshold</span>
                        <span className="text-indigo-500">92.4% Match Rate</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 5. AI CHATBOT MONITORING */}
            {activeSubItem === 'AI Chatbot Monitoring' && (
              <div className="space-y-6">
                
                {/* Active users overview cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-2xs">
                  {[
                    { label: 'Active Chatbot Users', value: '45 users', status: 'live conversations' },
                    { label: 'Avg Accuracy Index', value: '94.8%', status: 'response validation rate' },
                    { label: 'Unhandled Questions', value: '0 questions', status: 'escalated to human' },
                    { label: 'Customer Satisfaction', value: '4.8 / 5.0', status: 'verified farmer feedback' }
                  ].map((stat, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{stat.label}</span>
                      <h4 className="text-sm font-black mt-1 font-heading text-slate-900 dark:text-slate-100 dark:text-slate-100">{stat.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{stat.status}</p>
                    </div>
                  ))}
                </div>

                {/* Conversation logs and chat simulator */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Chat Session log details */}
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800 border-slate-100">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Active User Conversations</h4>
                      <select 
                        value={aiChatbotActiveUser} 
                        onChange={(e) => setAiChatbotActiveUser(e.target.value)} 
                        className={`text-3xs p-1 rounded border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                      >
                        <option value="USR-821">Farmer Ramesh Patil (USR-821)</option>
                        <option value="USR-704">Dealer Suresh Kumar (USR-704)</option>
                      </select>
                    </div>

                    <div className="space-y-3.5 text-2xs font-semibold max-h-72 overflow-y-auto pr-2">
                      {aiChatbotActiveUser === 'USR-821' ? (
                        <>
                          <div className="p-3.5 rounded bg-slate-950/40 border dark:border-slate-700 border-slate-200 space-y-1.5">
                            <span className="text-3xs text-emerald-500 font-extrabold uppercase">Farmer Ramesh:</span>
                            <p className="text-slate-855 dark:text-slate-200">What is the best fertilizer for cotton if soil pH is 6.5?</p>
                          </div>
                          <div className="p-3.5 rounded bg-indigo-950/20 border border-indigo-500/20 space-y-1.5 ml-6">
                            <div className="flex justify-between items-center">
                              <span className="text-3xs text-indigo-400 font-extrabold uppercase flex items-center gap-1">
                                <Cpu size={12} />
                                <span>AI Chatbot:</span>
                              </span>
                              <span className="text-4xs px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">96% Conf</span>
                            </div>
                            <p className="text-slate-855 dark:text-slate-200">Based on a pH of 6.5, cotton absorbs NPK extremely well. I recommend applying NPK 12:32:16 at planting, and supplementing with Nitrogen top-dress at 45 days.</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-3.5 rounded bg-slate-950/40 border dark:border-slate-700 border-slate-200 space-y-1.5">
                            <span className="text-3xs text-emerald-500 font-extrabold uppercase">Dealer Suresh:</span>
                            <p className="text-slate-855 dark:text-slate-200">How do I track product expiry alert setups?</p>
                          </div>
                          <div className="p-3.5 rounded bg-indigo-950/20 border border-indigo-500/20 space-y-1.5 ml-6">
                            <div className="flex justify-between items-center">
                              <span className="text-3xs text-indigo-400 font-extrabold uppercase flex items-center gap-1">
                                <Cpu size={12} />
                                <span>AI Chatbot:</span>
                              </span>
                              <span className="text-4xs px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">94% Conf</span>
                            </div>
                            <p className="text-slate-855 dark:text-slate-200">Go to the Product & Inventory sidebar category, click on Expiry Tracking. The dashboard lists products expiring in under 30 days automatically.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Chatbot metrics Recharts */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Query Categories Share</h4>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={[
                            { name: 'Crop Suggestions', value: 450 },
                            { name: 'Disease Detection', value: 240 },
                            { name: 'System Usage', value: 120 }
                          ]} innerRadius={25} outerRadius={42} paddingAngle={4} dataKey="value">
                            {COLORS.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 6. DATASET MANAGEMENT */}
            {activeSubItem === 'Dataset Management' && (
              <div className="space-y-6">
                
                {/* Upload dataset catalog options */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-2 w-full sm:w-auto text-2xs font-semibold">
                    <span className="text-slate-400">DATASET FILTER:</span>
                    <select 
                      value={aiDatasetCategory} 
                      onChange={(e) => setAiDatasetCategory(e.target.value)} 
                      className={`text-3xs p-1.5 rounded border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <option value="All">All Categories</option>
                      <option value="Soil Profiles">Soil Profiles</option>
                      <option value="Leaf Disease">Leaf Disease</option>
                      <option value="Weather Data">Weather Data</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="New dataset filename..." 
                      value={aiDatasetUploadName} 
                      onChange={(e) => setAiDatasetUploadName(e.target.value)} 
                      className={`text-3xs p-1.5 rounded border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (!aiDatasetUploadName) {
                        handleSave('Please type a dataset filename first!');
                        return;
                      }
                      handleSave(`Dataset "${aiDatasetUploadName}" added to registry!`);
                      setAiDatasetUploadName('');
                    }} 
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-3xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={12} /> Upload CSV/JSON Dataset
                  </button>
                </div>

                {/* Dataset Table Grid */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 dark:text-slate-200 mb-3">Model Training Datasets</h4>
                  
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left font-medium">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2.5 px-2">Dataset Name</th>
                          <th className="py-2.5 px-2">Category</th>
                          <th className="py-2.5 px-2">Upload Date</th>
                          <th className="py-2.5 px-2">File Size</th>
                          <th className="py-2.5 px-2">Training Usage</th>
                          <th className="py-2.5 px-2 text-right">Dataset Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'maharashtra_soil_chemistry_v2.csv', category: 'Soil Profiles', date: 'May 12, 2026', size: '24.8 MB', usage: 'Crop Rec Model V4', status: 'Validated' },
                          { name: 'cotton_leaf_spot_images_verified.tar.gz', category: 'Leaf Disease', date: 'May 20, 2026', size: '412.5 MB', usage: 'Disease Vision Model V8', status: 'Validated' },
                          { name: 'wind_temp_timeseries_2026.json', category: 'Weather Data', date: 'May 24, 2026', size: '14.2 MB', usage: 'Weather Forecast V2', status: 'Processing' }
                        ].filter(d => aiDatasetCategory === 'All' || d.category === aiDatasetCategory).map((dataRow, idx) => (
                          <tr key={idx} className="border-b dark:border-slate-700/50 border-slate-50">
                            <td className="py-3 px-2 font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-100">{dataRow.name}</td>
                            <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{dataRow.category}</td>
                            <td className="py-3 px-2 text-slate-400">{dataRow.date}</td>
                            <td className="py-3 px-2 text-slate-400">{dataRow.size}</td>
                            <td className="py-3 px-2 text-indigo-500 font-semibold">{dataRow.usage}</td>
                            <td className="py-3 px-2 text-right">
                              <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${dataRow.status === 'Validated' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                {dataRow.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 7. AI ANALYTICS */}
            {activeSubItem === 'AI Analytics' && (
              <div className="space-y-6">
                
                {/* Timeframe controls */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-3xs font-bold">
                    <span className="text-slate-400">ANALYTICS TIMEFRAME:</span>
                    {['24H', '7D', '30D', '90D'].map((time) => (
                      <button 
                        key={time} 
                        onClick={() => {
                          setAiAnalyticsTimeframe(time)
                          handleSave(`Analytics timeframe switched to ${time}`)
                        }}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${aiAnalyticsTimeframe === time ? 'bg-emerald-600 text-white font-extrabold' : 'bg-slate-550 text-slate-400'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => handleSave('AI analytics audit report generated!')} className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-3xs rounded-lg transition-all cursor-pointer">
                    Export Model Performance Report
                  </button>
                </div>

                {/* Usage charts and accuracy indicators */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Model request loads */}
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">AI Inference Request Volumes ({aiAnalyticsTimeframe})</h4>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Mon', CropRec: 1450, DiseaseVis: 820 },
                          { name: 'Tue', CropRec: 1800, DiseaseVis: 940 },
                          { name: 'Wed', CropRec: 2100, DiseaseVis: 1200 },
                          { name: 'Thu', CropRec: 1950, DiseaseVis: 1100 },
                          { name: 'Fri', CropRec: 2400, DiseaseVis: 1400 },
                          { name: 'Sat', CropRec: 2800, DiseaseVis: 1650 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip />
                          <Area type="monotone" dataKey="CropRec" fill="#10b981" stroke="#10b981" fillOpacity={0.05} strokeWidth={2} />
                          <Area type="monotone" dataKey="DiseaseVis" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.05} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Latency and accuracy dials */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Compute Load & Diagnostics</h4>
                    
                    <div className="space-y-3.5 text-3xs font-extrabold text-slate-600 dark:text-slate-400">
                      <div className="p-3 border dark:border-slate-700 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50">
                        <span>CPU INFRASTRUCTURE LOAD</span>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs font-black text-emerald-500">42.8%</span>
                          <span className="text-4xs text-slate-400 font-medium">8 Cores active</span>
                        </div>
                      </div>
                      <div className="p-3 border dark:border-slate-700 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50">
                        <span>AVERAGE INFERENCE DELAY</span>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs font-black text-indigo-500">82ms</span>
                          <span className="text-4xs text-slate-400 font-medium">API endpoint gateway</span>
                        </div>
                      </div>
                      <div className="p-3 border dark:border-slate-700 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50">
                        <span>ACCURACY RECALL INDEX</span>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs font-black text-emerald-500">96.8%</span>
                          <span className="text-4xs text-slate-400 font-medium">Verified groundtruth logs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )

      case 'Marketing & Promotions':
        return (
          <div className="space-y-6 animate-fade-in pb-12">

            {/* HEADER */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div>
                <h3 className="text-sm font-black flex items-center gap-2">
                  <Megaphone size={16} className="text-pink-500" />
                  <span>Marketing Console: <span className="text-pink-500">{activeSubItem}</span></span>
                </h3>
                <p className="text-3xs text-slate-400 font-medium mt-0.5">Manage campaigns, promotions, and multi-channel marketing strategies</p>
              </div>
              <button onClick={() => handleSave('Campaign configuration saved!')} className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer">
                <Save size={13} /> Save Campaign
              </button>
            </div>

            {/* 1. ADVERTISEMENT BANNERS */}
            {activeSubItem === 'Advertisement Banners' && (
              <div className="space-y-6">
                {/* Upload + filter controls */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-3 w-full sm:w-auto text-2xs font-semibold">
                    <input
                      type="text"
                      placeholder="New banner campaign name..."
                      value={newBannerName}
                      onChange={(e) => setNewBannerName(e.target.value)}
                      className={`p-2 rounded-lg border outline-none text-3xs ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                    />
                    <select
                      value={bannerStatusFilter}
                      onChange={(e) => setBannerStatusFilter(e.target.value)}
                      className={`text-3xs p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Paused">Paused</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      if (!newBannerName) { handleSave('Please enter a banner name!'); return; }
                      handleSave(`Banner "${newBannerName}" created successfully!`);
                      setNewBannerName('');
                    }}
                    className="px-3.5 py-2 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-3xs rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Plus size={12} /> Create Banner
                  </button>
                </div>

                {/* Banner performance KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Active Banners', value: '14', sub: '3 scheduled this week' },
                    { label: 'Total Impressions', value: '2.4M', sub: 'Last 30 days' },
                    { label: 'Total Banner Clicks', value: '48,200', sub: '2.0% avg CTR' },
                    { label: 'Conversions Driven', value: '1,840', sub: 'Direct banner attribution' }
                  ].map((k, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{k.label}</span>
                      <h4 className="text-base font-black mt-1 font-heading text-slate-900 dark:text-slate-100 dark:text-slate-100">{k.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{k.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Banner table */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <h4 className="text-xs font-bold mb-3 text-slate-800 dark:text-slate-200">Active Banner Registry</h4>
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2.5 px-2">Campaign Name</th>
                          <th className="py-2.5 px-2">Type</th>
                          <th className="py-2.5 px-2">Schedule</th>
                          <th className="py-2.5 px-2">Impressions</th>
                          <th className="py-2.5 px-2">Clicks / CTR</th>
                          <th className="py-2.5 px-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Kharif Season Fertilizer Offer', type: 'Homepage Hero', schedule: 'Jun 1 – Aug 31', impressions: '540,000', clicks: '12,800 / 2.4%', status: 'Scheduled' },
                          { name: 'Monsoon Pesticide Discount 20%', type: 'Promotional Banner', schedule: 'May 25 – Jun 15', impressions: '820,000', clicks: '18,200 / 2.2%', status: 'Active' },
                          { name: 'New Vendor Welcome Banner', type: 'Offer Banner', schedule: 'Ongoing', impressions: '340,000', clicks: '7,400 / 2.2%', status: 'Active' },
                          { name: 'Rabi Season Crop Bundle', type: 'Seasonal Campaign', schedule: 'Oct 1 – Dec 31', impressions: '0', clicks: '0 / —', status: 'Paused' }
                        ].filter(b => bannerStatusFilter === 'All' || b.status === bannerStatusFilter).map((b, i) => (
                          <tr key={i} className="border-b dark:border-slate-700/50 border-slate-50">
                            <td className="py-3 px-2 font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-100">{b.name}</td>
                            <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{b.type}</td>
                            <td className="py-3 px-2 text-slate-400">{b.schedule}</td>
                            <td className="py-3 px-2 text-slate-400">{b.impressions}</td>
                            <td className="py-3 px-2 text-emerald-500 font-bold">{b.clicks}</td>
                            <td className="py-3 px-2 text-right">
                              <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${
                                b.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                                b.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-amber-500/10 text-amber-500'
                              }`}>{b.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Analytics Chart */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Banner Click Performance Trends</h4>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Week 1', Clicks: 8200, Impressions: 410000 },
                        { name: 'Week 2', Clicks: 11400, Impressions: 520000 },
                        { name: 'Week 3', Clicks: 14800, Impressions: 680000 },
                        { name: 'Week 4', Clicks: 18200, Impressions: 820000 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                        <YAxis stroke="#94a3b8" fontSize={9} />
                        <Tooltip />
                        <Area type="monotone" dataKey="Clicks" stroke="#ec4899" fill="#ec4899" fillOpacity={0.08} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* 2. COUPON SYSTEM */}
            {activeSubItem === 'Coupon System' && (
              <div className="space-y-6">
                {/* Coupon Generator Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Coupon Generator</h4>
                    <div className="space-y-3 text-2xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Coupon Code</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newCouponCode}
                            onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                            placeholder="e.g. KHARIF25"
                            className={`flex-1 p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                          />
                          <button
                            onClick={() => setNewCouponCode('AGRI-' + Math.random().toString(36).substring(2,7).toUpperCase())}
                            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-3xs font-bold rounded-lg cursor-pointer"
                          >
                            Auto
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Discount Type</label>
                        <select value={couponType} onChange={(e) => setCouponType(e.target.value)} className={`w-full p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <option value="Percentage">Percentage (%)</option>
                          <option value="Flat">Flat Amount (₹)</option>
                          <option value="Free Shipping">Free Shipping</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Discount Value ({couponDiscount}{couponType === 'Percentage' ? '%' : '₹'})</label>
                        <input type="range" min="5" max="80" value={couponDiscount} onChange={(e) => setCouponDiscount(parseInt(e.target.value))} className="w-full accent-pink-500" />
                      </div>
                      <button
                        onClick={() => {
                          if (!newCouponCode) { handleSave('Enter coupon code first!'); return; }
                          handleSave(`Coupon "${newCouponCode}" (${couponDiscount}${couponType === 'Percentage' ? '%' : '₹'} off) created!`);
                        }}
                        className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-2xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Plus size={13} /> Create Coupon
                      </button>
                    </div>
                  </div>

                  {/* Active coupons list */}
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Active Discount Coupons</h4>
                    <div className="overflow-x-auto text-2xs font-semibold">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                            <th className="py-2 px-2">Code</th>
                            <th className="py-2 px-2">Discount</th>
                            <th className="py-2 px-2">Usage / Limit</th>
                            <th className="py-2 px-2">Expiry</th>
                            <th className="py-2 px-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { code: 'KHARIF25', discount: '25% off', usage: '840 / 2000', expiry: 'Aug 31, 2026', status: 'Active' },
                            { code: 'SEED50FLAT', discount: '₹50 off Seeds', usage: '1,240 / 5000', expiry: 'Jun 30, 2026', status: 'Active' },
                            { code: 'MONSOON15', discount: '15% off', usage: '2000 / 2000', expiry: 'Jun 15, 2026', status: 'Exhausted' },
                            { code: 'NEWVENDOR10', discount: '10% off', usage: '320 / 1000', expiry: 'Dec 31, 2026', status: 'Active' }
                          ].map((c, i) => (
                            <tr key={i} className="border-b dark:border-slate-700/50 border-slate-50">
                              <td className="py-3 px-2 font-mono font-extrabold text-pink-500">{c.code}</td>
                              <td className="py-3 px-2 text-emerald-500 font-bold">{c.discount}</td>
                              <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{c.usage}</td>
                              <td className="py-3 px-2 text-slate-400">{c.expiry}</td>
                              <td className="py-3 px-2 text-right">
                                <span className={`text-4xs px-2 py-0.5 rounded-full font-bold ${
                                  c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                }`}>{c.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Redemption analytics */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Coupon Redemption Trends</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Week 1', Redemptions: 420 },
                        { name: 'Week 2', Redemptions: 680 },
                        { name: 'Week 3', Redemptions: 540 },
                        { name: 'Week 4', Redemptions: 840 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                        <YAxis stroke="#94a3b8" fontSize={9} />
                        <Tooltip />
                        <Bar dataKey="Redemptions" fill="#ec4899" radius={[3,3,0,0]} maxBarSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* 3. REFERRAL PROGRAMS */}
            {activeSubItem === 'Referral Programs' && (
              <div className="space-y-6">
                {/* KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Referrals Generated', value: '6,240', sub: 'This month' },
                    { label: 'Successful Conversions', value: '1,820', sub: '29.2% conversion rate' },
                    { label: 'Referral Earnings Paid', value: '₹2,14,500', sub: 'Rewards disbursed' },
                    { label: 'Active Referrers', value: '842', sub: 'Unique farmers sharing' }
                  ].map((k, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{k.label}</span>
                      <h4 className="text-base font-black mt-1 font-heading text-slate-900 dark:text-slate-100 dark:text-slate-100">{k.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{k.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Referral leaderboard */}
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Top Referrer Leaderboard</h4>
                    <div className="space-y-3 text-2xs font-semibold">
                      {[
                        { rank: '1', name: 'Ramesh Patil', refs: '142 referrals', earned: '₹14,200', badge: 'Gold Referrer' },
                        { rank: '2', name: 'Suresh Deshmukh', refs: '98 referrals', earned: '₹9,800', badge: 'Silver Referrer' },
                        { rank: '3', name: 'Anita Kulkarni', refs: '84 referrals', earned: '₹8,400', badge: 'Bronze Referrer' },
                        { rank: '4', name: 'Vijay Shinde', refs: '71 referrals', earned: '₹7,100', badge: 'Active Referrer' }
                      ].map((r, i) => (
                        <div key={i} className="p-3.5 rounded-lg border dark:border-slate-800 border-slate-100 dark:bg-slate-950 bg-slate-50 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-base">{r.rank}</span>
                            <div>
                              <span className="font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-100 block">{r.name}</span>
                              <span className="text-3xs text-slate-400 font-medium">{r.refs}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-emerald-500 block">{r.earned}</span>
                            <span className="text-4xs text-pink-500 font-bold">{r.badge}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Referral analytics chart */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Referral Channels Share</h4>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={[
                            { name: 'WhatsApp Share', value: 3200 },
                            { name: 'SMS Share', value: 1800 },
                            { name: 'Copy Link', value: 820 }
                          ]} innerRadius={28} outerRadius={44} paddingAngle={4} dataKey="value">
                            {COLORS.map((c, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PUSH NOTIFICATIONS */}
            {activeSubItem === 'Push Notifications' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Notification Composer */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Notification Composer</h4>
                    <div className="space-y-3 text-2xs">
                      <div>
                        <label className="block text-slate-400 mb-1">NOTIFICATION TITLE</label>
                        <input type="text" value={pushNotifTitle} onChange={(e) => setPushNotifTitle(e.target.value)} placeholder="e.g. Kharif Season Offer!" className={`w-full p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">MESSAGE BODY</label>
                        <textarea rows={3} value={pushNotifBody} onChange={(e) => setPushNotifBody(e.target.value)} placeholder="Get 25% off on all fertilizers this week only..." className={`w-full p-2 rounded-lg border outline-none resize-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">TARGET AUDIENCE</label>
                        <select value={pushAudience} onChange={(e) => setPushAudience(e.target.value)} className={`w-full p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <option value="All Farmers">All Farmers</option>
                          <option value="Premium Users">Premium Users Only</option>
                          <option value="Maharashtra">Maharashtra Region</option>
                          <option value="New Users">New Users (30 days)</option>
                        </select>
                      </div>
                      <button onClick={() => handleSave(`Push notification sent to "${pushAudience}"!`)} className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-2xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                        <Send size={13} /> Send Push Notification
                      </button>
                    </div>
                  </div>

                  {/* Live preview */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Notification Preview</h4>
                    <div className={`p-4 rounded-xl border-2 ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'} shadow-md space-y-2`}>
                      <div className="flex items-center gap-2">
                        <span className="text-base"><Sprout size={16} className="text-emerald-500" /></span>
                        <span className="text-3xs font-extrabold text-slate-400 uppercase">AgriAI App</span>
                      </div>
                      <p className="text-xs font-black text-slate-900 dark:text-slate-100 dark:text-slate-100">{pushNotifTitle || 'Notification Title Here'}</p>
                      <p className="text-3xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{pushNotifBody || 'Your notification message body will appear here...'}</p>
                      <p className="text-4xs text-slate-500 font-medium">To: {pushAudience} Â· now</p>
                    </div>
                  </div>

                  {/* Delivery analytics */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Recent Delivery Stats</h4>
                    <div className="space-y-3 text-3xs font-extrabold text-slate-600 dark:text-slate-400">
                      {[
                        { label: 'Delivered', value: '98.4%', color: 'text-emerald-500' },
                        { label: 'Opened / Read', value: '42.1%', color: 'text-blue-500' },
                        { label: 'CTA Clicks', value: '18.8%', color: 'text-pink-500' },
                        { label: 'Dismissed', value: '39.1%', color: 'text-slate-400' }
                      ].map((s, i) => (
                        <div key={i} className="flex justify-between items-center p-2.5 rounded dark:bg-slate-950 bg-slate-50 border dark:border-slate-700 border-slate-100">
                          <span>{s.label}</span>
                          <span className={`font-black ${s.color}`}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notification history */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <h4 className="text-xs font-bold mb-3 text-slate-800 dark:text-slate-200">Notification History</h4>
                  <div className="overflow-x-auto text-2xs font-semibold">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                          <th className="py-2 px-2">Title</th>
                          <th className="py-2 px-2">Audience</th>
                          <th className="py-2 px-2">Sent</th>
                          <th className="py-2 px-2">Delivered</th>
                          <th className="py-2 px-2 text-right">Open Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { title: 'Kharif Season Offer!', audience: 'All Farmers', sent: '12,450', delivered: '12,248', openRate: '44.2%' },
                          { title: 'Drip Irrigation Workshop', audience: 'Maharashtra', sent: '4,820', delivered: '4,790', openRate: '51.8%' },
                          { title: 'Pest Alert – Act Now', audience: 'All Farmers', sent: '12,450', delivered: '12,100', openRate: '68.4%' }
                        ].map((n, i) => (
                          <tr key={i} className="border-b dark:border-slate-700/50 border-slate-50">
                            <td className="py-2.5 px-2 font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-100">{n.title}</td>
                            <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{n.audience}</td>
                            <td className="py-2.5 px-2 text-slate-400">{n.sent}</td>
                            <td className="py-2.5 px-2 text-emerald-500 font-bold">{n.delivered}</td>
                            <td className="py-2.5 px-2 text-right text-pink-500 font-bold">{n.openRate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. SMS CAMPAIGNS */}
            {activeSubItem === 'SMS Campaigns' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* SMS Composer */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Bulk SMS Composer</h4>
                    <div className="space-y-3 text-2xs">
                      <div>
                        <label className="block text-slate-400 mb-1">SMS MESSAGE ({smsCampaignText.length}/160)</label>
                        <textarea
                          rows={4}
                          maxLength={160}
                          value={smsCampaignText}
                          onChange={(e) => setSmsCampaignText(e.target.value)}
                          placeholder="Type your promotional SMS message here..."
                          className={`w-full p-2 rounded-lg border outline-none resize-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">RECIPIENT FILTER</label>
                        <select className={`w-full p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <option>All Registered Farmers (12,450)</option>
                          <option>Premium Farmers (4,520)</option>
                          <option>Maharashtra Farmers (3,840)</option>
                          <option>Inactive Farmers (1,240)</option>
                        </select>
                      </div>
                      <button onClick={() => handleSave('Bulk SMS campaign queued for delivery!')} className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-2xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                        <Send size={13} /> Send Bulk SMS
                      </button>
                    </div>
                  </div>

                  {/* SMS delivery stats */}
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">SMS Campaign Delivery Reports</h4>
                    <div className="overflow-x-auto text-2xs font-semibold">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b dark:border-slate-800 border-slate-100 text-slate-400 uppercase font-bold text-3xs">
                            <th className="py-2 px-2">Campaign</th>
                            <th className="py-2 px-2">Sent</th>
                            <th className="py-2 px-2">Delivered</th>
                            <th className="py-2 px-2">Failed</th>
                            <th className="py-2 px-2 text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { campaign: 'Kharif Season Promotional SMS', sent: '12,450', delivered: '12,182', failed: '268', date: 'May 24, 2026' },
                            { campaign: 'New Product Launch Alert SMS', sent: '8,240', delivered: '8,104', failed: '136', date: 'May 20, 2026' },
                            { campaign: 'Loyalty Reward Points SMS', sent: '4,520', delivered: '4,498', failed: '22', date: 'May 18, 2026' }
                          ].map((s, i) => (
                            <tr key={i} className="border-b dark:border-slate-700/50 border-slate-50">
                              <td className="py-3 px-2 font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-100">{s.campaign}</td>
                              <td className="py-3 px-2 text-slate-400">{s.sent}</td>
                              <td className="py-3 px-2 text-emerald-500 font-bold">{s.delivered}</td>
                              <td className="py-3 px-2 text-rose-500 font-bold">{s.failed}</td>
                              <td className="py-3 px-2 text-right text-slate-400">{s.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. EMAIL MARKETING */}
            {activeSubItem === 'Email Marketing' && (
              <div className="space-y-6">
                {/* KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Emails Sent (Month)', value: '84,200', sub: 'Newsletter + campaigns' },
                    { label: 'Average Open Rate', value: '38.4%', sub: 'Industry avg: 21%' },
                    { label: 'Click-through Rate', value: '12.8%', sub: 'CTA link clicks' },
                    { label: 'Unsubscribe Rate', value: '0.4%', sub: 'Below 1% threshold' }
                  ].map((k, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{k.label}</span>
                      <h4 className="text-base font-black mt-1 font-heading text-slate-900 dark:text-slate-100 dark:text-slate-100">{k.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{k.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Email composer */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Email Campaign Editor</h4>
                    <div className="space-y-3 text-2xs">
                      <div>
                        <label className="block text-slate-400 mb-1">SUBJECT LINE</label>
                        <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Kharif Season Deal Inside!" className={`w-full p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">EMAIL BODY</label>
                        <textarea rows={5} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Dear Farmer, this season we are offering exclusive discounts on certified seeds and organic fertilizers..." className={`w-full p-2 rounded-lg border outline-none resize-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleSave('Email campaign scheduled!')} className="flex-1 py-2 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-2xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                          <Send size={12} /> Schedule
                        </button>
                        <button onClick={() => handleSave('Email preview sent to your inbox!')} className="flex-1 py-2 border dark:border-slate-800 border-slate-200 font-extrabold text-2xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 transition-all">
                          <Eye size={12} /> Preview
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Open/Click analytics chart */}
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Open & Click Trends</h4>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { name: 'Jan', Opens: 32, Clicks: 10 },
                          { name: 'Feb', Opens: 36, Clicks: 12 },
                          { name: 'Mar', Opens: 34, Clicks: 11 },
                          { name: 'Apr', Opens: 40, Clicks: 14 },
                          { name: 'May', Opens: 38, Clicks: 13 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip />
                          <Line type="monotone" dataKey="Opens" stroke="#ec4899" strokeWidth={2} />
                          <Line type="monotone" dataKey="Clicks" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. WHATSAPP MARKETING */}
            {activeSubItem === 'WhatsApp Marketing' && (
              <div className="space-y-6">
                {/* KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Messages Sent', value: '48,400', sub: 'This month via WA Business' },
                    { label: 'Delivery Rate', value: '99.1%', sub: 'Avg delivery performance' },
                    { label: 'Read Rate', value: '72.4%', sub: 'Blue tick confirmations' },
                    { label: 'Reply Rate', value: '18.2%', sub: 'Two-way conversations' }
                  ].map((k, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{k.label}</span>
                      <h4 className="text-base font-black mt-1 font-heading text-slate-900 dark:text-slate-100 dark:text-slate-100">{k.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{k.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* WA message composer */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">Broadcast Composer</h4>
                    <div className="space-y-3 text-2xs">
                      <div>
                        <label className="block text-slate-400 mb-1">WA MESSAGE</label>
                        <textarea rows={4} value={waMessage} onChange={(e) => setWaMessage(e.target.value)} placeholder="Namaste! AgriAI Kharif Season Offer is live..." className={`w-full p-2 rounded-lg border outline-none resize-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`} />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">AUDIENCE</label>
                        <select className={`w-full p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <option>All WhatsApp Opted-in Farmers</option>
                          <option>Premium Subscribers</option>
                          <option>Maharashtra Region</option>
                        </select>
                      </div>
                      <button onClick={() => handleSave('WhatsApp broadcast message scheduled!')} className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-2xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                        <Send size={13} /> Send WA Broadcast
                      </button>
                    </div>
                  </div>

                  {/* WA message preview */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">WhatsApp Preview</h4>
                    <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-black">A</div>
                        <span className="text-3xs font-extrabold text-emerald-500">AgriAI Business</span>
                      </div>
                      <div className="bg-white dark:bg-slate-950 rounded-xl rounded-tl-none p-3 shadow-sm text-2xs text-slate-800 dark:text-slate-200 leading-relaxed">
                        {waMessage || 'Your WhatsApp message preview will appear here...'}
                      </div>
                      <p className="text-4xs text-slate-500">12:30 PM âœ“âœ“</p>
                    </div>
                  </div>

                  {/* Delivery stats */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Campaign Analytics</h4>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={[
                            { name: 'Read', value: 72 },
                            { name: 'Delivered', value: 20 },
                            { name: 'Failed', value: 8 }
                          ]} innerRadius={22} outerRadius={38} paddingAngle={3} dataKey="value">
                            {['#10b981','#3b82f6','#f43f5e'].map((c, i) => <Cell key={i} fill={c} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. SOCIAL MEDIA PROMOTIONS */}
            {activeSubItem === 'Social Media Promotions' && (
              <div className="space-y-6">
                {/* Platform selector */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-3xs font-bold">
                    <span className="text-slate-400">PLATFORM:</span>
                    {['Facebook', 'Instagram', 'Twitter/X'].map((p) => (
                      <button
                        key={p}
                        onClick={() => { setSocialPlatform(p); handleSave(`Viewing ${p} campaign analytics`); }}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${socialPlatform === p ? 'bg-pink-600 text-white font-extrabold' : 'bg-slate-550 text-slate-400'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => handleSave(`${socialPlatform} campaign scheduled!`)} className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-3xs rounded-lg flex items-center gap-1.5 cursor-pointer transition-all">
                    <Plus size={12} /> New {socialPlatform} Campaign
                  </button>
                </div>

                {/* Platform KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Reach', value: socialPlatform === 'Facebook' ? '420K' : socialPlatform === 'Instagram' ? '280K' : '94K', sub: `${socialPlatform} followers reached` },
                    { label: 'Engagements', value: socialPlatform === 'Facebook' ? '18,400' : socialPlatform === 'Instagram' ? '24,200' : '8,100', sub: 'Likes + comments + shares' },
                    { label: 'Link Clicks', value: socialPlatform === 'Facebook' ? '4,820' : socialPlatform === 'Instagram' ? '2,940' : '1,200', sub: 'Bio/post link traffic' },
                    { label: 'Engagement Rate', value: socialPlatform === 'Facebook' ? '4.4%' : socialPlatform === 'Instagram' ? '8.6%' : '8.5%', sub: 'Posts this month' }
                  ].map((k, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                      <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">{k.label}</span>
                      <h4 className="text-base font-black mt-1 font-heading text-slate-900 dark:text-slate-100 dark:text-slate-100">{k.value}</h4>
                      <p className="text-4xs text-slate-400 mt-0.5 font-medium">{k.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Engagement chart + post list */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">{socialPlatform} Engagement & Reach Trend</h4>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Week 1', Reach: 82000, Engage: 3200 },
                          { name: 'Week 2', Reach: 104000, Engage: 4800 },
                          { name: 'Week 3', Reach: 148000, Engage: 6200 },
                          { name: 'Week 4', Reach: 186000, Engage: 8100 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip />
                          <Area type="monotone" dataKey="Reach" stroke="#ec4899" fill="#ec4899" fillOpacity={0.06} strokeWidth={2} />
                          <Area type="monotone" dataKey="Engage" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.06} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent posts performance */}
                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Top Performing Posts</h4>
                    <div className="space-y-3 text-3xs font-semibold">
                      {[
                        { post: 'Kharif Season – Top 5 Crops', likes: '2,840', shares: '480' },
                        { post: 'Identify Crop Disease with AI', likes: '4,120', shares: '920' },
                        { post: 'Save Water with Drip Irrigation', likes: '1,820', shares: '340' }
                      ].map((p, i) => (
                        <div key={i} className="p-3 border dark:border-slate-700 border-slate-100 rounded-lg dark:bg-slate-950 bg-slate-50">
                          <span className="block font-extrabold text-slate-900 dark:text-slate-100 dark:text-slate-100 mb-1">{p.post}</span>
                          <div className="flex gap-3 text-slate-400">
                            <span>{p.likes} likes</span>
                            <span>{p.shares} shares</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )

      default:
        // Generic fallback workspace for other enterprise sub-menus
        return (
          <div className="space-y-6 animate-fade-in">
            <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-black flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <span>{activeSubItem} Module Workspace</span>
                  </h3>
                  <p className="text-2xs text-slate-400 mt-0.5">Enterprise Dashboard section for {activeCategory} &gt; {activeSubItem}</p>
                </div>
                <button
                  onClick={() => handleSave()}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all"
                >
                  <Save size={12} />
                  Save Changes
                </button>
              </div>

              {/* Showcase list template */}
              <div className="mt-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-3xs font-bold text-slate-400 uppercase tracking-widest">Active Jobs</p>
                    <p className="text-lg font-black mt-1">28</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-3xs font-bold text-slate-400 uppercase tracking-widest">Errors / Alerts</p>
                    <p className="text-lg font-black text-rose-500 mt-1">0</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-3xs font-bold text-slate-400 uppercase tracking-widest">Sync Status</p>
                    <p className="text-lg font-black text-emerald-500 mt-1">100%</p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} text-2xs space-y-2`}>
                  <h4 className="font-extrabold mb-2 uppercase text-slate-400 tracking-wider">Submodule Configuration Fields</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1">PARAMETER NAME</label>
                      <input type="text" placeholder="Global default setting value" className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} outline-none`} />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">OPERATIONAL VALUE</label>
                      <input type="text" placeholder="Instance specification" className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} outline-none`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Success banner toast */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white font-extrabold text-xs px-4 py-3 rounded-lg shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Dynamic View Header */}
      <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2 font-heading">
            <span>{activeSubItem}</span>
            <span className="text-3xs font-extrabold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 uppercase border border-emerald-500/20">{activeCategory}</span>
          </h2>
          <p className="text-2xs text-slate-400 font-medium">Enterprise console workspace for AgriAI system management</p>
        </div>
      </div>

      {renderContent()}
    </div>
  )
}


import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSuperAdminStore } from '../store/superAdminStore'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Globe,
  UserCheck,
  Store,
  Users,
  Briefcase,
  Boxes,
  Truck,
  DollarSign,
  Cpu,
  Megaphone,
  LifeBuoy,
  BarChart3,
  Lock,
  Bell,
  Crown,
  Landmark,
  Link2,
  Terminal,
  Search,
  ChevronDown,
  LogOut,
  X,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react'

const MENU_STRUCTURE = [
  {
    category: 'Dashboard',
    icon: LayoutDashboard,
    items: ['Overview', 'Live Analytics', 'Revenue Stats', 'Recent Activities', 'AI Insights']
  },
  {
    category: 'Platform Management',
    icon: Globe,
    items: ['Website Settings', 'App Settings', 'Branding & Logos', 'Theme Customization', 'Landing Page Editor', 'Banner Management', 'SEO Settings', 'Language Settings', 'Maintenance Mode']
  },
  {
    category: 'Admin Management',
    icon: UserCheck,
    items: ['Create Admin', 'Manage Admins', 'Permissions', 'Activity Logs']
  },
  {
    category: 'Vendor Management',
    icon: Store,
    items: ['Vendor Approval', 'Vendor Verification', 'Vendor Products', 'Vendor Performance', 'Commission Settings', 'Vendor Payments', 'Vendor Complaints', 'Ratings & Reviews', 'Suspend Vendor']
  },
  {
    category: 'Farmer/User Management',
    icon: Users,
    items: ['User Profiles', 'KYC Verification', 'Wallet Management', 'Loyalty Points', 'Subscriptions', 'User Complaints', 'Notifications', 'Suspend Users']
  },
  {
    category: 'Employee Management',
    icon: Briefcase,
    items: ['Employee Accounts', 'Role Assignment', 'Attendance', 'Salaries', 'Leave Management', 'Shift Management', 'GPS Tracking', 'Activity Monitoring']
  },
  {
    category: 'Product & Inventory',
    icon: Boxes,
    items: [
      'Product Categories', 'Product Approval', 'Featured Products', 'Pricing Rules', 'Discount Rules', 'Tax Settings', 'Product Reviews',
      'Warehouses', 'Inventory Overview', 'Stock Transfer', 'Damage Reports', 'Expiry Tracking', 'Dispatch Monitoring', 'Barcode / QR System'
    ]
  },
  {
    category: 'Orders & Delivery',
    icon: Truck,
    items: [
      'All Orders', 'Pending Orders', 'Processing Orders', 'Delivered Orders', 'Cancelled Orders', 'Returns & Refunds', 'Invoice Monitoring',
      'Delivery Partners', 'Live Tracking', 'Route Optimization', 'Delivery Charges', 'Failed Deliveries', 'Delivery Complaints'
    ]
  },
  {
    category: 'Financial Management',
    icon: DollarSign,
    items: ['Revenue', 'Vendor Payments', 'Commission Earnings', 'Transactions', 'Expense Tracking', 'Profit/Loss Reports', 'Tax Reports', 'Subscription Revenue']
  },
  {
    category: 'AI Services',
    icon: Cpu,
    items: ['Crop Recommendation AI', 'Disease Detection AI', 'Weather Prediction AI', 'Yield Prediction', 'AI Chatbot Monitoring', 'Dataset Management', 'AI Analytics']
  },
  {
    category: 'Marketing & Promotions',
    icon: Megaphone,
    items: ['Advertisement Banners', 'Coupon System', 'Referral Programs', 'Push Notifications', 'SMS Campaigns', 'Email Marketing', 'WhatsApp Marketing', 'Social Media Promotions']
  },
  {
    category: 'Complaint & Support',
    icon: LifeBuoy,
    items: ['Farmer Complaints', 'Vendor Complaints', 'Delivery Complaints', 'Ticket System', 'Live Chat Monitoring', 'Call Support Logs', 'Resolution Reports']
  },
  {
    category: 'Reports & Analytics',
    icon: BarChart3,
    items: ['Revenue Analytics', 'Sales Reports', 'Vendor Reports', 'Product Reports', 'Delivery Reports', 'Employee Reports', 'AI Reports', 'Region Analytics']
  },
  {
    category: 'Security & Access',
    icon: Lock,
    items: ['Role Management', 'Permission Settings', 'Login Security', 'OTP Settings', 'Device Management', 'Session Monitoring', 'Audit Logs', 'Data Backup']
  },
  {
    category: 'Notification Center',
    icon: Bell,
    items: ['Push Notifications', 'SMS Alerts', 'Email Alerts', 'WhatsApp Notifications', 'Announcements', 'Emergency Alerts']
  },
  {
    category: 'Subscription & Plans',
    icon: Crown,
    items: ['Premium Plans', 'Vendor Memberships', 'Farmer Plans', 'Billing Cycles', 'Plan Features', 'Subscription Analytics']
  },
  {
    category: 'Government Schemes',
    icon: Landmark,
    items: ['Government Schemes', 'Farmer Eligibility', 'Subsidy Tracking', 'Application Support', 'Scheme Notifications']
  },
  {
    category: 'Integrations',
    icon: Link2,
    items: ['Payment Gateway APIs', 'SMS APIs', 'WhatsApp APIs', 'Google Maps API', 'Weather APIs', 'AI APIs', 'ERP Integrations', 'IoT Integrations']
  },
  {
    category: 'System Tools',
    icon: Terminal,
    items: ['Logs', 'Cache Management', 'Database Backup', 'Server Monitoring', 'Error Reports', 'API Monitoring']
  }
]

// Mock badges to simulate real-time updates (similar to SAP/Odoo)
const BADGES = {
  'Vendor Management': { text: '4 New', color: 'bg-amber-500 text-white' },
  'Farmer/User Management': { text: 'KYC', color: 'bg-blue-500 text-white' },
  'AI Services': { text: 'Active', color: 'bg-emerald-500 text-white animate-pulse' },
  'Complaint & Support': { text: '12', color: 'bg-rose-500 text-white' },
  'System Tools': { text: 'Alert', color: 'bg-rose-600 text-white' }
}

export default function SuperAdminSidebar({ open, onClose }) {
  const { activeCategory, activeSubItem, setActiveItem, theme, toggleTheme } = useSuperAdminStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  
  const [expandedCategories, setExpandedCategories] = useState({
    [activeCategory]: true
  })
  const [search, setSearch] = useState('')

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }))
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Filter menu structure based on search query
  const filteredMenu = MENU_STRUCTURE.map(group => {
    const isCatMatch = group.category.toLowerCase().includes(search.toLowerCase())
    const matchedItems = group.items.filter(item =>
      item.toLowerCase().includes(search.toLowerCase())
    )

    if (isCatMatch || matchedItems.length > 0) {
      return {
        ...group,
        items: isCatMatch ? group.items : matchedItems,
        matchesSearch: true
      }
    }
    return null
  }).filter(Boolean)

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-72 flex flex-col h-screen
        transition-all duration-300 ease-in-out border-r
        lg:sticky lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
        ${theme === 'dark' 
          ? 'bg-slate-900 border-slate-800 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-800'}
      `}
    >
      {/* Top Brand Header */}
      <div className={`flex items-center justify-between px-6 py-5 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-emerald-600 to-green-400 shadow-md shadow-emerald-500/20 text-white font-bold text-xl">
            🌾
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight flex items-center gap-1 font-heading">
              AgriAI <span className="text-xs px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">ERP</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Enterprise Super Admin</p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className={`lg:hidden p-1.5 rounded-lg border ${theme === 'dark' ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-100 hover:bg-slate-50 text-slate-500'}`}
        >
          <X size={16} />
        </button>
      </div>

      {/* Quick Search */}
      <div className="px-4 pt-4 pb-2">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-950/50 border-slate-800 focus-within:border-emerald-600' : 'bg-slate-50 border-slate-200 focus-within:border-emerald-600'} transition-all`}>
          <Search size={15} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search Modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs outline-none w-full placeholder-slate-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-200">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation (Scrollable) */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 scrollbar-thin">
        {filteredMenu.map((group) => {
          const Icon = group.icon
          const isExpanded = expandedCategories[group.category] || search.length > 0
          const hasActiveItem = activeCategory === group.category
          const badge = BADGES[group.category]

          return (
            <div key={group.category} className="rounded-lg overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(group.category)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200
                  ${hasActiveItem 
                    ? theme === 'dark' ? 'bg-emerald-950/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                    : theme === 'dark' ? 'hover:bg-slate-800/60 text-slate-300' : 'hover:bg-slate-50 text-slate-600'}
                `}
              >
                <Icon size={16} className={hasActiveItem ? 'text-emerald-500' : 'text-slate-400'} />
                <span className="flex-1 text-left truncate">{group.category}</span>
                
                {/* Badge if present */}
                {badge && (
                  <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded-full ${badge.color}`}>
                    {badge.text}
                  </span>
                )}

                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Submodules Accordion */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`ml-6 mt-1 pl-3 border-l ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} space-y-1`}
                  >
                    {group.items.map((subItem) => {
                      const isSubActive = activeCategory === group.category && activeSubItem === subItem
                      const COMPLAINT_ROUTES = {
                        'Farmer Complaints': '/complaints/farmer',
                        'Vendor Complaints': '/complaints/vendor',
                        'Delivery Complaints': '/complaints/delivery',
                        'Ticket System': '/complaints/tickets',
                        'Live Chat Monitoring': '/complaints/live-chat',
                        'Call Support Logs': '/complaints/call-logs',
                        'Resolution Reports': '/complaints/resolution-reports'
                      }
                      const REPORT_ROUTES = {
                        'Revenue Analytics': '/reports/revenue-analytics',
                        'Sales Reports': '/reports/sales-reports',
                        'Vendor Reports': '/reports/vendor-reports',
                        'Product Reports': '/reports/product-reports',
                        'Delivery Reports': '/reports/delivery-reports',
                        'Employee Reports': '/reports/employee-reports',
                        'AI Reports': '/reports/ai-reports',
                        'Region Analytics': '/reports/region-analytics'
                      }
                      const SECURITY_ROUTES = {
                        'Role Management': '/security/role-management',
                        'Permission Settings': '/security/permission-settings',
                        'Login Security': '/security/login-security',
                        'OTP Settings': '/security/otp-settings',
                        'Device Management': '/security/device-management',
                        'Session Monitoring': '/security/session-monitoring',
                        'Audit Logs': '/security/audit-logs',
                        'Data Backup': '/security/data-backup'
                      }
                      const NOTIF_ROUTES = {
                        'Push Notifications': '/notifications-center/push',
                        'SMS Alerts': '/notifications-center/sms',
                        'Email Alerts': '/notifications-center/email',
                        'WhatsApp Notifications': '/notifications-center/whatsapp',
                        'Announcements': '/notifications-center/announcements',
                        'Emergency Alerts': '/notifications-center/emergency'
                      }
                      return (
                        <button
                          key={subItem}
                          onClick={() => {
                            setActiveItem(group.category, subItem)
                            if (group.category === 'Complaint & Support' && COMPLAINT_ROUTES[subItem]) {
                              navigate(COMPLAINT_ROUTES[subItem])
                            } else if (group.category === 'Reports & Analytics' && REPORT_ROUTES[subItem]) {
                              navigate(REPORT_ROUTES[subItem])
                            } else if (group.category === 'Security & Access' && SECURITY_ROUTES[subItem]) {
                              navigate(SECURITY_ROUTES[subItem])
                            } else if (group.category === 'Notification Center' && NOTIF_ROUTES[subItem]) {
                              navigate(NOTIF_ROUTES[subItem])
                            } else {
                              navigate('/dashboard')
                            }
                            if (onClose) onClose() // close on mobile
                          }}
                          className={`
                            w-full text-left block py-1.5 px-3 rounded-md text-xs font-medium transition-all relative
                            ${isSubActive
                              ? 'text-emerald-500 font-bold bg-emerald-500/5'
                              : theme === 'dark' ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
                          `}
                        >
                          {isSubActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-emerald-500"
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                          {subItem}
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      {/* User Session Footer & Theme Toggle */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/50'} space-y-3`}>
        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-black text-sm relative">
            {user?.name?.charAt(0)?.toUpperCase() || 'S'}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 rounded-full border-slate-900"></span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold truncate">{user?.name || 'Super Admin'}</h4>
            <p className="text-xs text-slate-400 truncate font-medium">{user?.email || 'super@agroerp.com'}</p>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`
              flex-1 py-1.5 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors
              ${theme === 'dark'
                ? 'border-slate-800 bg-slate-800 text-yellow-400 hover:bg-slate-800'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}
            `}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={12} />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={12} />
                <span>Dark</span>
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="py-1.5 px-3 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}


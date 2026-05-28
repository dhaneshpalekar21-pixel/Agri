import { useState, useEffect, useMemo } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Globe, UserCog, Store, Users, Briefcase, Boxes,
  ShoppingCart, Coins, BrainCircuit, Megaphone, MessageSquare,
  BarChart3, Lock, BellRing, CreditCard, Landmark, Cpu, Terminal,
  Search, ChevronDown, ChevronRight, LogOut, X, CloudSun, Bell, Settings,
  Menu, Sun, Moon, HelpCircle
} from 'lucide-react'

// Original navigation for other roles
const legacyNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'user'] },
  { label: 'Products', icon: Package, path: '/products', roles: ['admin', 'user'] },
  { label: 'Inventory', icon: Boxes, path: '/inventory', roles: ['admin', 'user'] },
  { label: 'Billing', icon: ShoppingCart, path: '/billing', roles: ['admin', 'user'] },
  { label: 'Bill History', icon: FileTextIconPlaceholder, path: '/billing/history', roles: ['admin', 'user'] },
  { label: 'Customers', icon: Users, path: '/customers', roles: ['admin'] },
  { label: 'Udhari / Credit', icon: CreditCard, path: '/udhari', roles: ['admin'] },
  { label: 'Analytics', icon: BarChart3, path: '/analytics', roles: ['admin'] },
  { label: 'Weather & Crops', icon: CloudSun, path: '/weather', roles: ['admin', 'user'] },
  { label: 'Notifications', icon: Bell, path: '/notifications', roles: ['admin', 'user'] },
  { label: 'Employees', icon: UserCog, path: '/employees', roles: ['admin'] },
  { label: 'Subscription', icon: CreditCard, path: '/subscription', roles: ['admin'] },
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['admin', 'user'] },
]

function FileTextIconPlaceholder(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
      <path d="M10 9H8"/>
      <path d="M16 13H8"/>
      <path d="M16 17H8"/>
    </svg>
  )
}

// 19 Super Admin Modules
const superAdminMenu = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: 'Live',
    subItems: [
      { id: 'overview', label: 'Overview' },
      { id: 'live-analytics', label: 'Live Analytics' },
      { id: 'revenue-stats', label: 'Revenue Stats' },
      { id: 'recent-activities', label: 'Recent Activities' },
      { id: 'ai-insights', label: 'AI Insights' }
    ]
  },
  {
    id: 'platform',
    label: 'Platform Management',
    icon: Globe,
    subItems: [
      { id: 'website-settings', label: 'Website Settings' },
      { id: 'app-settings', label: 'App Settings' },
      { id: 'branding', label: 'Branding & Logos' },
      { id: 'theme-customization', label: 'Theme Customization' },
      { id: 'landing-editor', label: 'Landing Page Editor' },
      { id: 'banner-mgmt', label: 'Banner Management' },
      { id: 'seo-settings', label: 'SEO Settings' },
      { id: 'language-settings', label: 'Language Settings' },
      { id: 'maintenance-mode', label: 'Maintenance Mode' }
    ]
  },
  {
    id: 'admins',
    label: 'Admin Management',
    icon: UserCog,
    subItems: [
      { id: 'create-admin', label: 'Create Admin' },
      { id: 'manage-admins', label: 'Manage Admins' },
      { id: 'permissions', label: 'Permissions' },
      { id: 'activity-logs', label: 'Activity Logs' }
    ]
  },
  {
    id: 'vendors',
    label: 'Vendor Management',
    icon: Store,
    badge: '3',
    subItems: [
      { id: 'vendor-approval', label: 'Vendor Approval' },
      { id: 'vendor-verification', label: 'Vendor Verification' },
      { id: 'vendor-products', label: 'Vendor Products' },
      { id: 'vendor-performance', label: 'Vendor Performance' },
      { id: 'commission-settings', label: 'Commission Settings' },
      { id: 'vendor-payments', label: 'Vendor Payments' },
      { id: 'vendor-complaints', label: 'Vendor Complaints' },
      { id: 'ratings-reviews', label: 'Ratings & Reviews' },
      { id: 'suspend-vendor', label: 'Suspend Vendor' }
    ]
  },
  {
    id: 'users',
    label: 'Farmer/User Management',
    icon: Users,
    subItems: [
      { id: 'user-profiles', label: 'User Profiles' },
      { id: 'kyc-verification', label: 'KYC Verification' },
      { id: 'wallet-mgmt', label: 'Wallet Management' },
      { id: 'loyalty-points', label: 'Loyalty Points' },
      { id: 'subscriptions', label: 'Subscriptions' },
      { id: 'user-complaints', label: 'User Complaints' },
      { id: 'user-notifications', label: 'Notifications' },
      { id: 'suspend-users', label: 'Suspend Users' }
    ]
  },
  {
    id: 'employees',
    label: 'Employee Management',
    icon: Briefcase,
    subItems: [
      { id: 'employee-accounts', label: 'Employee Accounts' },
      { id: 'role-assignment', label: 'Role Assignment' },
      { id: 'attendance', label: 'Attendance' },
      { id: 'salaries', label: 'Salaries' },
      { id: 'leave-mgmt', label: 'Leave Management' },
      { id: 'shift-mgmt', label: 'Shift Management' },
      { id: 'gps-tracking', label: 'GPS Tracking' },
      { id: 'activity-monitoring', label: 'Activity Monitoring' }
    ]
  },
  {
    id: 'products-inventory',
    label: 'Product & Inventory',
    icon: Boxes,
    subItems: [
      { id: 'prod-categories', label: 'Product Categories' },
      { id: 'prod-approval', label: 'Product Approval' },
      { id: 'featured-prods', label: 'Featured Products' },
      { id: 'pricing-rules', label: 'Pricing Rules' },
      { id: 'discount-rules', label: 'Discount Rules' },
      { id: 'tax-settings', label: 'Tax Settings' },
      { id: 'prod-reviews', label: 'Product Reviews' },
      { id: 'warehouses', label: 'Warehouses' },
      { id: 'inventory-overview', label: 'Inventory Overview' },
      { id: 'stock-transfer', label: 'Stock Transfer' },
      { id: 'damage-reports', label: 'Damage Reports' },
      { id: 'expiry-tracking', label: 'Expiry Tracking' },
      { id: 'dispatch-monitoring', label: 'Dispatch Monitoring' },
      { id: 'barcode-qr-system', label: 'Barcode / QR System' }
    ]
  },
  {
    id: 'orders-delivery',
    label: 'Orders & Delivery',
    icon: ShoppingCart,
    subItems: [
      { id: 'all-orders', label: 'All Orders' },
      { id: 'pending-orders', label: 'Pending Orders' },
      { id: 'processing-orders', label: 'Processing Orders' },
      { id: 'delivered-orders', label: 'Delivered Orders' },
      { id: 'cancelled-orders', label: 'Cancelled Orders' },
      { id: 'returns-refunds', label: 'Returns & Refunds' },
      { id: 'invoice-monitoring', label: 'Invoice Monitoring' },
      { id: 'delivery-partners', label: 'Delivery Partners' },
      { id: 'live-tracking', label: 'Live Tracking' },
      { id: 'route-optimization', label: 'Route Optimization' },
      { id: 'delivery-charges', label: 'Delivery Charges' },
      { id: 'failed-deliveries', label: 'Failed Deliveries' },
      { id: 'delivery-complaints', label: 'Delivery Complaints' }
    ]
  },
  {
    id: 'finance',
    label: 'Financial Management',
    icon: Coins,
    subItems: [
      { id: 'revenue', label: 'Revenue' },
      { id: 'vendor-payments-fin', label: 'Vendor Payments' },
      { id: 'commission-earnings', label: 'Commission Earnings' },
      { id: 'transactions', label: 'Transactions' },
      { id: 'expense-tracking', label: 'Expense Tracking' },
      { id: 'profit-loss', label: 'Profit/Loss Reports' },
      { id: 'tax-reports', label: 'Tax Reports' },
      { id: 'sub-revenue', label: 'Subscription Revenue' }
    ]
  },
  {
    id: 'ai-services',
    label: 'AI Services',
    icon: BrainCircuit,
    subItems: [
      { id: 'crop-rec', label: 'Crop Recommendation AI' },
      { id: 'disease-detect', label: 'Disease Detection AI' },
      { id: 'weather-predict', label: 'Weather Prediction AI' },
      { id: 'yield-predict', label: 'Yield Prediction' },
      { id: 'chatbot-monitor', label: 'AI Chatbot Monitoring' },
      { id: 'dataset-mgmt', label: 'Dataset Management' },
      { id: 'ai-analytics', label: 'AI Analytics' }
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing & Promotions',
    icon: Megaphone,
    subItems: [
      { id: 'adv-banners', label: 'Advertisement Banners' },
      { id: 'coupon-system', label: 'Coupon System' },
      { id: 'referral-programs', label: 'Referral Programs' },
      { id: 'push-promo', label: 'Push Notifications' },
      { id: 'sms-campaigns', label: 'SMS Campaigns' },
      { id: 'email-marketing', label: 'Email Marketing' },
      { id: 'whatsapp-marketing', label: 'WhatsApp Marketing' },
      { id: 'social-promotions', label: 'Social Media Promotions' }
    ]
  },
  {
    id: 'complaints',
    label: 'Complaint & Support',
    icon: MessageSquare,
    badge: '5',
    subItems: [
      { id: 'farmer-complaints', label: 'Farmer Complaints' },
      { id: 'vendor-complaints-sup', label: 'Vendor Complaints' },
      { id: 'delivery-complaints-sup', label: 'Delivery Complaints' },
      { id: 'ticket-system', label: 'Ticket System' },
      { id: 'live-chat-monitor', label: 'Live Chat Monitoring' },
      { id: 'call-support-logs', label: 'Call Support Logs' },
      { id: 'resolution-reports', label: 'Resolution Reports' }
    ]
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: BarChart3,
    subItems: [
      { id: 'rev-analytics', label: 'Revenue Analytics' },
      { id: 'sales-reports', label: 'Sales Reports' },
      { id: 'vendor-reports', label: 'Vendor Reports' },
      { id: 'product-reports', label: 'Product Reports' },
      { id: 'delivery-reports', label: 'Delivery Reports' },
      { id: 'employee-reports', label: 'Employee Reports' },
      { id: 'ai-reports', label: 'AI Reports' },
      { id: 'region-analytics', label: 'Region Analytics' }
    ]
  },
  {
    id: 'security',
    label: 'Security & Access',
    icon: Lock,
    subItems: [
      { id: 'role-mgmt', label: 'Role Management' },
      { id: 'permission-settings', label: 'Permission Settings' },
      { id: 'login-security', label: 'Login Security' },
      { id: 'otp-settings', label: 'OTP Settings' },
      { id: 'device-mgmt', label: 'Device Management' },
      { id: 'session-monitoring', label: 'Session Monitoring' },
      { id: 'audit-logs', label: 'Audit Logs' },
      { id: 'data-backup', label: 'Data Backup' }
    ]
  },
  {
    id: 'notification-center',
    label: 'Notification Center',
    icon: BellRing,
    subItems: [
      { id: 'push-alerts', label: 'Push Notifications' },
      { id: 'sms-alerts', label: 'SMS Alerts' },
      { id: 'email-alerts', label: 'Email Alerts' },
      { id: 'whatsapp-alerts', label: 'WhatsApp Notifications' },
      { id: 'announcements', label: 'Announcements' },
      { id: 'emergency-alerts', label: 'Emergency Alerts' }
    ]
  },
  {
    id: 'subscriptions-plans',
    label: 'Subscription & Plans',
    icon: CreditCard,
    subItems: [
      { id: 'premium-plans', label: 'Premium Plans' },
      { id: 'vendor-memberships', label: 'Vendor Memberships' },
      { id: 'farmer-plans', label: 'Farmer Plans' },
      { id: 'billing-cycles', label: 'Billing Cycles' },
      { id: 'plan-features', label: 'Plan Features' },
      { id: 'sub-analytics', label: 'Subscription Analytics' }
    ]
  },
  {
    id: 'gov-schemes',
    label: 'Government Schemes',
    icon: Landmark,
    subItems: [
      { id: 'gov-schemes-list', label: 'Government Schemes' },
      { id: 'farmer-eligibility', label: 'Farmer Eligibility' },
      { id: 'subsidy-tracking', label: 'Subsidy Tracking' },
      { id: 'app-support', label: 'Application Support' },
      { id: 'scheme-notifications', label: 'Scheme Notifications' }
    ]
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: Cpu,
    subItems: [
      { id: 'payment-apis', label: 'Payment Gateway APIs' },
      { id: 'sms-apis', label: 'SMS APIs' },
      { id: 'whatsapp-apis', label: 'WhatsApp APIs' },
      { id: 'gmaps-apis', label: 'Google Maps API' },
      { id: 'weather-apis', label: 'Weather APIs' },
      { id: 'ai-apis', label: 'AI APIs' },
      { id: 'erp-integrations', label: 'ERP Integrations' },
      { id: 'iot-integrations', label: 'IoT Integrations' }
    ]
  },
  {
    id: 'system-tools',
    label: 'System Tools',
    icon: Terminal,
    subItems: [
      { id: 'sys-logs', label: 'Logs' },
      { id: 'cache-mgmt', label: 'Cache Management' },
      { id: 'db-backup', label: 'Database Backup' },
      { id: 'server-monitoring', label: 'Server Monitoring' },
      { id: 'error-reports', label: 'Error Reports' },
      { id: 'api-monitoring', label: 'API Monitoring' }
    ]
  }
]

const roleColors = {
  superadmin: { bg: '#ECFDF5', text: '#059669', label: 'Super Admin' },
  admin: { bg: '#E8F5E9', text: '#2E7D32', label: 'Admin' },
  user: { bg: '#E3F2FD', text: '#1565C0', label: 'Staff' },
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState(localStorage.getItem('admin-theme') || 'light')

  const role = user?.role || 'user'
  const isSuperAdmin = role === 'superadmin'

  // Expanded parent menus state tracker
  const [expandedMenus, setExpandedMenus] = useState(() => {
    const activeTab = searchParams.get('tab') || 'overview'
    // Auto expand parent module if a child is selected
    const initial = {}
    if (isSuperAdmin) {
      superAdminMenu.forEach(menu => {
        if (menu.subItems.some(sub => sub.id === activeTab)) {
          initial[menu.id] = true
        }
      })
    }
    return initial
  })

  // Theme support
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('admin-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }))
  }

  // Filter menu items based on search input
  const filteredSuperAdminMenu = useMemo(() => {
    if (!searchQuery.trim()) return superAdminMenu

    return superAdminMenu
      .map(menu => {
        const matchesParent = menu.label.toLowerCase().includes(searchQuery.toLowerCase())
        const filteredSubs = menu.subItems.filter(sub =>
          sub.label.toLowerCase().includes(searchQuery.toLowerCase())
        )

        if (matchesParent || filteredSubs.length > 0) {
          return {
            ...menu,
            subItems: filteredSubs.length > 0 ? filteredSubs : menu.subItems
          }
        }
        return null
      })
      .filter(Boolean)
  }, [searchQuery])

  const activeTab = searchParams.get('tab') || 'overview'

  const handleSubItemClick = (subId) => {
    setSearchParams({ tab: subId })
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // LEGACY NAVIGATION FOR OTHER ROLES
  const filteredNav = legacyNavItems.filter((item) => item.roles.includes(role))

  if (!isSuperAdmin) {
    return (
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 flex flex-col
          bg-white border-r border-gray-100 shadow-xl
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-none
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Legacy Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-700 to-green-500">
              <span className="text-lg">🌾</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>AgroERP</h2>
              <p className="text-xs text-gray-400">KrushiCare AMS</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={16} />
          </button>
        </div>

        {/* Legacy User Info */}
        <div className="px-4 py-3 mx-3 mt-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-green-700 to-green-500">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: roleColors[role]?.bg, color: roleColors[role]?.text }}
            >
              {roleColors[role]?.label}
            </span>
          </div>
        </div>

        {/* Legacy Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Main Menu</p>
          <div className="space-y-0.5">
            {filteredNav.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{label}</span>
                <ChevronRight size={14} className="ml-auto opacity-40" />
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Legacy Logout */}
        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout} className="sidebar-item w-full text-red-500 hover:bg-red-50 hover:text-red-600">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    )
  }

  // SUPER ADMIN PREMIUM ERP SIDEBAR
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 w-72 flex flex-col transition-all duration-300 ease-in-out
        lg:relative lg:translate-x-0 select-none
        ${theme === 'dark' ? 'erp-glass-dark text-slate-200' : 'erp-glass-light text-slate-800'}
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Brand Header */}
      <div className={`flex items-center justify-between px-6 py-5 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/20">
            <Globe className="text-white w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
              AGRI ERP
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Super Operations</p>
          </div>
        </div>
        <button onClick={onClose} className={`lg:hidden p-1.5 rounded-lg hover:bg-slate-500/10 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          <X size={18} />
        </button>
      </div>

      {/* Profile summary card */}
      <div className={`px-4 py-3 mx-4 mt-4 rounded-xl border flex items-center gap-3 relative overflow-hidden group ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/60 border-slate-100'}`}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-500" />
        <div className="relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-tr from-emerald-600 to-teal-500 shadow">
          {user?.name?.charAt(0)?.toUpperCase() || 'S'}
        </div>
        <div className="min-w-0 flex-1 relative z-10">
          <p className="text-sm font-bold truncate">{user?.name || 'Super Admin'}</p>
          <span className="inline-flex text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
            HQ Platform
          </span>
        </div>
      </div>

      {/* Sidebar Live Search */}
      <div className="px-4 mt-4 relative">
        <Search className={`absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
        <input
          type="text"
          placeholder="Filter ERP modules..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border outline-none transition-all ${
            theme === 'dark'
              ? 'bg-slate-950/40 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
              : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20'
          }`}
        />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 erp-scroll">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-2 mb-2">Modules Directory</p>
        
        {filteredSuperAdminMenu.map((menu) => {
          const isExpanded = expandedMenus[menu.id]
          const isAnyChildActive = menu.subItems.some(sub => sub.id === activeTab)
          const MenuIcon = menu.icon

          return (
            <div key={menu.id} className="space-y-0.5">
              {/* Parent Nav Item */}
              <button
                onClick={() => toggleMenu(menu.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all group ${
                  isAnyChildActive
                    ? theme === 'dark' ? 'bg-emerald-950/40 text-emerald-400 font-bold border-l-2 border-emerald-500' : 'bg-emerald-50 text-emerald-700 font-bold border-l-2 border-emerald-600'
                    : theme === 'dark' ? 'hover:bg-slate-900/60 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100/80 text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MenuIcon className={`w-4 h-4 ${isAnyChildActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500 transition-colors'}`} />
                  <span>{menu.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {menu.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase tracking-wider animate-pulse">
                      {menu.badge}
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    className={`transform transition-transform duration-200 opacity-60 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {/* Sub-Items dropdown */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'easeInOut' }}
                    className="overflow-hidden pl-7 space-y-0.5"
                  >
                    {menu.subItems.map((sub) => {
                      const isSubActive = sub.id === activeTab
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSubItemClick(sub.id)}
                          className={`w-full text-left py-2 px-3 rounded-lg text-[11px] font-medium transition-all ${
                            isSubActive
                              ? 'erp-submenu-item-active'
                              : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-1 h-1 rounded-full ${isSubActive ? 'bg-emerald-500' : 'bg-slate-400 opacity-30'}`} />
                            <span>{sub.label}</span>
                          </div>
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

      {/* Footer controls & Logout */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-800/80 bg-slate-950/20' : 'border-slate-100 bg-slate-50/20'}`}>
        <div className="flex items-center justify-between mb-3 px-2">
          {/* Light/Dark mode switcher */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          
          <button
            onClick={() => handleSubItemClick('website-settings')}
            className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
            title="System Settings"
          >
            <Settings size={15} />
          </button>

          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            v3.2 Enterprise
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
        >
          <LogOut size={16} />
          <span>Exit Workspace</span>
        </button>
      </div>
    </aside>
  )
}

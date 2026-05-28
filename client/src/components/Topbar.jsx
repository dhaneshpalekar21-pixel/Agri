import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  Menu, Search, Bell, ChevronDown, LogOut, Settings, User,
  Globe, Sun, Moon, Plus, ShieldCheck, CheckCircle2, AlertTriangle, Play
} from 'lucide-react'

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [actionsOpen, setActionsOpen] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('admin-theme') || 'light')

  const role = user?.role || 'user'
  const isSuperAdmin = role === 'superadmin'

  // Update theme classes on toggle
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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Get active menu labels for breadcrumbs
  const activeTab = searchParams.get('tab') || 'overview'
  
  const getBreadcrumbs = () => {
    // Map tab IDs to printable labels and category parents
    const tabMap = {
      'overview': ['Dashboard', 'Overview'],
      'live-analytics': ['Dashboard', 'Live Analytics'],
      'revenue-stats': ['Dashboard', 'Revenue Stats'],
      'recent-activities': ['Dashboard', 'Recent Activities'],
      'ai-insights': ['Dashboard', 'AI Insights'],
      'website-settings': ['Platform Management', 'Website Settings'],
      'app-settings': ['Platform Management', 'App Settings'],
      'branding': ['Platform Management', 'Branding & Logos'],
      'theme-customization': ['Platform Management', 'Theme Customization'],
      'landing-editor': ['Platform Management', 'Landing Page Editor'],
      'banner-mgmt': ['Platform Management', 'Banner Management'],
      'seo-settings': ['Platform Management', 'SEO Settings'],
      'language-settings': ['Platform Management', 'Language Settings'],
      'maintenance-mode': ['Platform Management', 'Maintenance Mode'],
      'create-admin': ['Admin Management', 'Create Admin'],
      'manage-admins': ['Admin Management', 'Manage Admins'],
      'permissions': ['Admin Management', 'Permissions'],
      'activity-logs': ['Admin Management', 'Activity Logs'],
      'vendor-approval': ['Vendor Management', 'Vendor Approval'],
      'vendor-verification': ['Vendor Management', 'Vendor Verification'],
      'vendor-products': ['Vendor Management', 'Vendor Products'],
      'vendor-performance': ['Vendor Management', 'Vendor Performance'],
      'commission-settings': ['Vendor Management', 'Commission Settings'],
      'vendor-payments': ['Vendor Management', 'Vendor Payments'],
      'vendor-complaints': ['Vendor Management', 'Vendor Complaints'],
      'ratings-reviews': ['Vendor Management', 'Ratings & Reviews'],
      'suspend-vendor': ['Vendor Management', 'Suspend Vendor'],
      'user-profiles': ['Farmer/User Management', 'User Profiles'],
      'kyc-verification': ['Farmer/User Management', 'KYC Verification'],
      'wallet-mgmt': ['Farmer/User Management', 'Wallet Management'],
      'loyalty-points': ['Farmer/User Management', 'Loyalty Points'],
      'subscriptions': ['Farmer/User Management', 'Subscriptions'],
      'user-complaints': ['Farmer/User Management', 'User Complaints'],
      'user-notifications': ['Farmer/User Management', 'Notifications'],
      'suspend-users': ['Farmer/User Management', 'Suspend Users'],
      'employee-accounts': ['Employee Management', 'Employee Accounts'],
      'role-assignment': ['Employee Management', 'Role Assignment'],
      'attendance': ['Employee Management', 'Attendance'],
      'salaries': ['Employee Management', 'Salaries'],
      'leave-mgmt': ['Employee Management', 'Leave Management'],
      'shift-mgmt': ['Employee Management', 'Shift Management'],
      'gps-tracking': ['Employee Management', 'GPS Tracking'],
      'activity-monitoring': ['Employee Management', 'Activity Monitoring'],
      'prod-categories': ['Product & Inventory', 'Product Categories'],
      'prod-approval': ['Product & Inventory', 'Product Approval'],
      'featured-prods': ['Product & Inventory', 'Featured Products'],
      'pricing-rules': ['Product & Inventory', 'Pricing Rules'],
      'discount-rules': ['Product & Inventory', 'Discount Rules'],
      'tax-settings': ['Product & Inventory', 'Tax Settings'],
      'prod-reviews': ['Product & Inventory', 'Product Reviews'],
      'warehouses': ['Product & Inventory', 'Warehouses'],
      'inventory-overview': ['Product & Inventory', 'Inventory Overview'],
      'stock-transfer': ['Product & Inventory', 'Stock Transfer'],
      'damage-reports': ['Product & Inventory', 'Damage Reports'],
      'expiry-tracking': ['Product & Inventory', 'Expiry Tracking'],
      'dispatch-monitoring': ['Product & Inventory', 'Dispatch Monitoring'],
      'barcode-qr-system': ['Product & Inventory', 'Barcode / QR System'],
      'all-orders': ['Orders & Delivery', 'All Orders'],
      'pending-orders': ['Orders & Delivery', 'Pending Orders'],
      'processing-orders': ['Orders & Delivery', 'Processing Orders'],
      'delivered-orders': ['Orders & Delivery', 'Delivered Orders'],
      'cancelled-orders': ['Orders & Delivery', 'Cancelled Orders'],
      'returns-refunds': ['Orders & Delivery', 'Returns & Refunds'],
      'invoice-monitoring': ['Orders & Delivery', 'Invoice Monitoring'],
      'delivery-partners': ['Orders & Delivery', 'Delivery Partners'],
      'live-tracking': ['Orders & Delivery', 'Live Tracking'],
      'route-optimization': ['Orders & Delivery', 'Route Optimization'],
      'delivery-charges': ['Orders & Delivery', 'Delivery Charges'],
      'failed-deliveries': ['Orders & Delivery', 'Failed Deliveries'],
      'delivery-complaints': ['Orders & Delivery', 'Delivery Complaints'],
      'revenue': ['Financial Management', 'Revenue'],
      'vendor-payments-fin': ['Financial Management', 'Vendor Payments'],
      'commission-earnings': ['Financial Management', 'Commission Earnings'],
      'transactions': ['Financial Management', 'Transactions'],
      'expense-tracking': ['Financial Management', 'Expense Tracking'],
      'profit-loss': ['Financial Management', 'Profit/Loss Reports'],
      'tax-reports': ['Financial Management', 'Tax Reports'],
      'sub-revenue': ['Financial Management', 'Subscription Revenue'],
      'crop-rec': ['AI Services', 'Crop Recommendation AI'],
      'disease-detect': ['AI Services', 'Disease Detection AI'],
      'weather-predict': ['AI Services', 'Weather Prediction AI'],
      'yield-predict': ['AI Services', 'Yield Prediction'],
      'chatbot-monitor': ['AI Services', 'AI Chatbot Monitoring'],
      'dataset-mgmt': ['AI Services', 'Dataset Management'],
      'ai-analytics': ['AI Services', 'AI Analytics'],
      'adv-banners': ['Marketing & Promotions', 'Advertisement Banners'],
      'coupon-system': ['Marketing & Promotions', 'Coupon System'],
      'referral-programs': ['Marketing & Promotions', 'Referral Programs'],
      'push-promo': ['Marketing & Promotions', 'Push Notifications'],
      'sms-campaigns': ['Marketing & Promotions', 'SMS Campaigns'],
      'email-marketing': ['Marketing & Promotions', 'Email Marketing'],
      'whatsapp-marketing': ['Marketing & Promotions', 'WhatsApp Marketing'],
      'social-promotions': ['Marketing & Promotions', 'Social Media Promotions'],
      'farmer-complaints': ['Complaint & Support', 'Farmer Complaints'],
      'vendor-complaints-sup': ['Complaint & Support', 'Vendor Complaints'],
      'delivery-complaints-sup': ['Complaint & Support', 'Delivery Complaints'],
      'ticket-system': ['Complaint & Support', 'Ticket System'],
      'live-chat-monitor': ['Complaint & Support', 'Live Chat Monitoring'],
      'call-support-logs': ['Complaint & Support', 'Call Support Logs'],
      'resolution-reports': ['Complaint & Support', 'Resolution Reports'],
      'rev-analytics': ['Reports & Analytics', 'Revenue Analytics'],
      'sales-reports': ['Reports & Analytics', 'Sales Reports'],
      'vendor-reports': ['Reports & Analytics', 'Vendor Reports'],
      'product-reports': ['Reports & Analytics', 'Product Reports'],
      'delivery-reports': ['Reports & Analytics', 'Delivery Reports'],
      'employee-reports': ['Reports & Analytics', 'Employee Reports'],
      'ai-reports': ['Reports & Analytics', 'AI Reports'],
      'region-analytics': ['Reports & Analytics', 'Region Analytics'],
      'role-mgmt': ['Security & Access', 'Role Management'],
      'permission-settings': ['Security & Access', 'Permission Settings'],
      'login-security': ['Security & Access', 'Login Security'],
      'otp-settings': ['Security & Access', 'OTP Settings'],
      'device-mgmt': ['Security & Access', 'Device Management'],
      'session-monitoring': ['Security & Access', 'Session Monitoring'],
      'audit-logs': ['Security & Access', 'Audit Logs'],
      'data-backup': ['Security & Access', 'Data Backup'],
      'push-alerts': ['Notification Center', 'Push Notifications'],
      'sms-alerts': ['Notification Center', 'SMS Alerts'],
      'email-alerts': ['Notification Center', 'Email Alerts'],
      'whatsapp-alerts': ['Notification Center', 'WhatsApp Notifications'],
      'announcements': ['Notification Center', 'Announcements'],
      'emergency-alerts': ['Notification Center', 'Emergency Alerts'],
      'premium-plans': ['Subscription & Plans', 'Premium Plans'],
      'vendor-memberships': ['Subscription & Plans', 'Vendor Memberships'],
      'farmer-plans': ['Subscription & Plans', 'Farmer Plans'],
      'billing-cycles': ['Subscription & Plans', 'Billing Cycles'],
      'plan-features': ['Subscription & Plans', 'Plan Features'],
      'sub-analytics': ['Subscription & Plans', 'Subscription Analytics'],
      'gov-schemes-list': ['Government Schemes', 'Government Schemes'],
      'farmer-eligibility': ['Government Schemes', 'Farmer Eligibility'],
      'subsidy-tracking': ['Government Schemes', 'Subsidy Tracking'],
      'app-support': ['Government Schemes', 'Application Support'],
      'scheme-notifications': ['Government Schemes', 'Scheme Notifications'],
      'payment-apis': ['Integrations', 'Payment Gateway APIs'],
      'sms-apis': ['Integrations', 'SMS APIs'],
      'whatsapp-apis': ['Integrations', 'WhatsApp APIs'],
      'gmaps-apis': ['Integrations', 'Google Maps API'],
      'weather-apis': ['Integrations', 'Weather APIs'],
      'ai-apis': ['Integrations', 'AI APIs'],
      'erp-integrations': ['Integrations', 'ERP Integrations'],
      'iot-integrations': ['Integrations', 'IoT Integrations'],
      'sys-logs': ['System Tools', 'Logs'],
      'cache-mgmt': ['System Tools', 'Cache Management'],
      'db-backup': ['System Tools', 'Database Backup'],
      'server-monitoring': ['System Tools', 'Server Monitoring'],
      'error-reports': ['System Tools', 'Error Reports'],
      'api-monitoring': ['System Tools', 'API Monitoring']
    }

    return tabMap[activeTab] || ['Dashboard', 'Overview']
  }

  const [parentName, childName] = getBreadcrumbs()

  // Fake Live Notifications for Super Admin Panel
  const superAdminNotifications = [
    { id: 1, type: 'critical', msg: 'KYC Verification backlog: 14 farmers pending', time: '5m ago' },
    { id: 2, type: 'warning', msg: 'API Latency Spike on Weather API integration', time: '18m ago' },
    { id: 3, type: 'success', msg: 'Automatic database backup complete', time: '1h ago' }
  ]

  // LEGACY TOPBAR FOR OTHER ROLES
  if (!isSuperAdmin) {
    return (
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            id="menu-toggle"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-72">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search products, customers..."
              className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="notification-btn"
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#EF5350' }} />
          </button>

          <div className="relative">
            <button
              id="user-menu"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #2E7D32, #66BB6A)' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-slide-up">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/settings'); setDropdownOpen(false) }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings size={15} />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    )
  }

  // SUPER ADMIN PREMIUM ENTERPRISE TOPBAR
  return (
    <header className={`h-16 px-4 md:px-6 sticky top-0 z-20 flex items-center justify-between backdrop-blur-md transition-all duration-300 border-b ${
      theme === 'dark'
        ? 'bg-slate-900/80 border-slate-800 text-slate-100'
        : 'bg-white/80 border-slate-100 text-slate-800'
    }`}>
      {/* Left: Menu trigger & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className={`lg:hidden p-2 rounded-xl transition-all ${
            theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Menu size={20} />
        </button>

        {/* Dynamic Breadcrumbs */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold select-none">
          <span className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>HQ Operations</span>
          <span className={`${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'}`}>/</span>
          <span className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{parentName}</span>
          <span className={`${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'}`}>/</span>
          <span className="text-emerald-500 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/10">
            {childName}
          </span>
        </div>
      </div>

      {/* Right: Tools & Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setActionsOpen(!actionsOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 active:scale-95 transition-all"
          >
            <Plus size={14} />
            <span className="hidden md:inline">Quick Action</span>
          </button>

          {actionsOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setActionsOpen(false)} />
              <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl border p-2.5 z-30 animate-slide-up ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
              }`}>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 mb-2">Shortcuts</p>
                <button
                  onClick={() => { setSearchParams({ tab: 'create-admin' }); setActionsOpen(false) }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-left transition-all ${
                    theme === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Create New Admin Account
                </button>
                <button
                  onClick={() => { setSearchParams({ tab: 'vendor-approval' }); setActionsOpen(false) }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-left transition-all ${
                    theme === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Plus size={14} className="text-emerald-500" />
                  Approve Pending Vendors
                </button>
                <button
                  onClick={() => { setSearchParams({ tab: 'push-alerts' }); setActionsOpen(false) }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-left transition-all ${
                    theme === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Plus size={14} className="text-emerald-500" />
                  Broadcast Push Notification
                </button>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle in Topbar */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-all ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-750'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
          title="Toggle UI Color Mode"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* ERP Live Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className={`relative p-2 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border p-4 z-30 animate-slide-up ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
              }`}>
                <div className="flex items-center justify-between border-b pb-2 mb-3 border-slate-500/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">HQ Status Feed</h3>
                  <span className="text-[10px] bg-rose-500/10 text-rose-500 font-extrabold px-1.5 py-0.5 rounded">3 Alerts</span>
                </div>
                <div className="space-y-2">
                  {superAdminNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2.5 rounded-xl border text-xs flex gap-2 items-start ${
                        notif.type === 'critical'
                          ? 'bg-rose-500/5 border-rose-500/10 text-rose-400'
                          : notif.type === 'warning'
                          ? 'bg-amber-500/5 border-amber-500/10 text-amber-400'
                          : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {notif.type === 'critical' && <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />}
                      {notif.type === 'warning' && <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />}
                      {notif.type === 'success' && <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <p className="font-medium text-slate-300 leading-tight">{notif.msg}</p>
                        <span className="text-[9px] text-slate-500 block mt-1">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Control Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2 p-1 rounded-xl border transition-colors ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold bg-gradient-to-tr from-emerald-600 to-teal-500">
              {user?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <span className="hidden md:block text-xs font-semibold pr-1.5">{user?.name || 'Super Admin'}</span>
            <ChevronDown size={12} className="text-slate-400 mr-1" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className={`absolute right-0 top-full mt-2 w-60 rounded-2xl shadow-2xl border p-2 z-30 animate-slide-up ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
              }`}>
                <div className="px-4 py-3 border-b border-slate-500/10 mb-1">
                  <p className="text-xs font-bold text-slate-300">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded">
                    Root privilege level
                  </span>
                </div>
                <button
                  onClick={() => { setSearchParams({ tab: 'app-settings' }); setDropdownOpen(false) }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-left transition-all ${
                    theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Settings size={14} />
                  System Config
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg text-left text-rose-500 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut size={14} />
                  Exit Space
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

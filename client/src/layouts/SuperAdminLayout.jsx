import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SuperAdminSidebar from '../components/SuperAdminSidebar'
import { useSuperAdminStore } from '../store/superAdminStore'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  Shield,
  Sparkles,
  Zap,
  Globe,
  HelpCircle,
  CheckCircle,
  Info
} from 'lucide-react'

export default function SuperAdminLayout() {
  const { activeCategory, activeSubItem, theme } = useSuperAdminStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Mock Notification Alert list
  const notifications = [
    { id: 1, title: 'New Vendor Registration', desc: 'Patil Seeds requested approval', time: '5m ago', type: 'info' },
    { id: 2, title: 'AI Services Alert', desc: 'Disease detection load high', time: '1h ago', type: 'warning' },
    { id: 3, title: 'Subsidy Payout Status', desc: 'Government scheme disbursement completed', time: '3h ago', type: 'success' },
    { id: 4, title: 'Security Event', desc: 'New login from Aurangabad IP', time: '5h ago', type: 'security' }
  ]

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/55 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enterprise Sidebar */}
      <SuperAdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Sticky Header Topbar */}
        <header className={`
          h-16 px-4 md:px-6 sticky top-0 z-20 flex items-center justify-between border-b transition-all duration-300
          ${theme === 'dark' 
            ? 'bg-slate-900/80 border-slate-800 backdrop-blur-md' 
            : 'bg-white/80 border-slate-200 backdrop-blur-md'}
        `}>
          {/* Left: Mobile Toggle + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-xl border transition-colors ${theme === 'dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
              <span className="text-slate-400">AgriAI ERP</span>
              <span className="text-slate-400 font-bold">/</span>
              <span className="text-slate-400">{activeCategory}</span>
              <span className="text-slate-400 font-bold">/</span>
              <span className="text-emerald-500 font-bold">{activeSubItem}</span>
            </div>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2">
            
            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowQuickActions(!showQuickActions)
                  setShowNotifications(false)
                  setShowProfileDropdown(false)
                }}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all
                  ${theme === 'dark' 
                    ? 'border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-200' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}
                `}
              >
                <Zap size={13} className="text-emerald-500" />
                <span>Quick Actions</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              {showQuickActions && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowQuickActions(false)} />
                  <div className={`
                    absolute right-0 mt-2 w-56 rounded-xl shadow-xl border p-2 z-30 animate-slide-up
                    ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-100 text-slate-800'}
                  `}>
                    <div className="px-3 py-1.5 border-b mb-1 border-slate-100 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-400 font-bold">
                      Platform Commands
                    </div>
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left rounded-lg hover:bg-emerald-500/10 hover:text-emerald-500 transition-all font-medium">
                      <Shield size={13} />
                      Create New Admin Account
                    </button>
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left rounded-lg hover:bg-emerald-500/10 hover:text-emerald-500 transition-all font-medium">
                      <Globe size={13} />
                      Toggle Maintenance Mode
                    </button>
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left rounded-lg hover:bg-emerald-500/10 hover:text-emerald-500 transition-all font-medium">
                      <Sparkles size={13} />
                      Generate AI Insight Report
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Notification Panel */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  setShowQuickActions(false)
                  setShowProfileDropdown(false)
                }}
                className={`
                  p-2 rounded-lg border transition-all relative
                  ${theme === 'dark' 
                    ? 'border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-200' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}
                `}
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <div className={`
                    absolute right-0 mt-2 w-80 rounded-xl shadow-xl border p-2 z-30 animate-slide-up
                    ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-100 text-slate-800'}
                  `}>
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                      <span className="text-xs font-bold">Notifications</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-rose-500/15 text-rose-500 font-extrabold">4 Urgent</span>
                    </div>
                    
                    <div className="space-y-1 max-h-72 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-2.5 rounded-lg text-left transition-all ${theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'} flex gap-3.5`}>
                          <div className="mt-0.5 flex-shrink-0">
                            {n.type === 'success' && <CheckCircle size={15} className="text-emerald-500" />}
                            {n.type === 'warning' && <Info size={15} className="text-amber-500" />}
                            {n.type === 'security' && <Shield size={15} className="text-violet-500" />}
                            {n.type === 'info' && <Info size={15} className="text-blue-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold leading-tight">{n.title}</h4>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">{n.desc}</p>
                            <span className="text-xs text-slate-500 mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown)
                  setShowNotifications(false)
                  setShowQuickActions(false)
                }}
                className={`
                  flex items-center gap-2 p-1 rounded-full border transition-all
                  ${theme === 'dark' 
                    ? 'border-slate-700 hover:bg-slate-800 text-slate-200' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'}
                `}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-white font-extrabold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                </div>
                <ChevronDown size={14} className="pr-1 text-slate-400 hidden sm:inline" />
              </button>

              {showProfileDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowProfileDropdown(false)} />
                  <div className={`
                    absolute right-0 mt-2 w-52 rounded-xl shadow-xl border p-2 z-30 animate-slide-up
                    ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-100 text-slate-800'}
                  `}>
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-xs font-bold">{user?.name || 'Super Admin'}</p>
                      <p className="text-xs text-slate-400">{user?.email || 'super@agroerp.com'}</p>
                    </div>
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">
                      <Settings size={13} />
                      ERP Settings
                    </button>
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">
                      <HelpCircle size={13} />
                      Platform Support
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left rounded-lg text-rose-500 hover:bg-rose-500/10 font-medium"
                    >
                      <LogOut size={13} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </header>

        {/* Workspace Layout Scroll */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
          <div className="max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}


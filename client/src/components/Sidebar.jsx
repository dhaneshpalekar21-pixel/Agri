import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  LayoutDashboard, Package, BarChart3, Users, CreditCard,
  ShoppingCart, FileText, CloudSun, Bell, UserCog,
  Settings, Crown, LogOut, X, ChevronRight, Boxes
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'user', 'superadmin'] },
  { label: 'Products', icon: Package, path: '/products', roles: ['admin', 'user', 'superadmin'] },
  { label: 'Inventory', icon: Boxes, path: '/inventory', roles: ['admin', 'user', 'superadmin'] },
  { label: 'Billing', icon: ShoppingCart, path: '/billing', roles: ['admin', 'user', 'superadmin'] },
  { label: 'Bill History', icon: FileText, path: '/billing/history', roles: ['admin', 'user', 'superadmin'] },
  { label: 'Customers', icon: Users, path: '/customers', roles: ['admin', 'superadmin'] },
  { label: 'Udhari / Credit', icon: CreditCard, path: '/udhari', roles: ['admin', 'superadmin'] },
  { label: 'Analytics', icon: BarChart3, path: '/analytics', roles: ['admin', 'superadmin'] },
  { label: 'Weather & Crops', icon: CloudSun, path: '/weather', roles: ['admin', 'user', 'superadmin'] },
  { label: 'Notifications', icon: Bell, path: '/notifications', roles: ['admin', 'user', 'superadmin'] },
  { label: 'Employees', icon: UserCog, path: '/employees', roles: ['admin', 'superadmin'] },
  { label: 'Subscription', icon: Crown, path: '/subscription', roles: ['admin', 'superadmin'] },
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['admin', 'user', 'superadmin'] },
]

const roleColors = {
  superadmin: { bg: '#FFF3E0', text: '#E65100', label: 'Super Admin' },
  admin: { bg: '#E8F5E9', text: '#2E7D32', label: 'Admin' },
  user: { bg: '#E3F2FD', text: '#1565C0', label: 'Staff' },
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const role = user?.role || 'user'
  const roleInfo = roleColors[role]

  const filteredNav = navItems.filter((item) => item.roles.includes(role))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2E7D32, #66BB6A)' }}>
            <span className="text-lg">🌾</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>AgroERP</h2>
            <p className="text-xs text-gray-400">KrushiCare AMS</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <X size={16} />
        </button>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 mx-3 mt-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #2E7D32, #66BB6A)' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: roleInfo.bg, color: roleInfo.text }}
          >
            {roleInfo.label}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Main Menu</p>
        <div className="space-y-0.5">
          {filteredNav.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight size={14} className="ml-auto opacity-40" />
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

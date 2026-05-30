import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Package, Search, ClipboardList } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const quickActions = [
  { label: 'Create Bill', icon: ShoppingCart, path: '/billing', color: '#2E7D32', bg: '#f0fdf4' },
  { label: 'View Products', icon: Package, path: '/products', color: '#1d4ed8', bg: '#eff6ff' },
  { label: 'Search Stock', icon: Search, path: '/inventory', color: '#c2410c', bg: '#fff7ed' },
  { label: 'My Tasks', icon: ClipboardList, path: '/notifications', color: '#7c3aed', bg: '#faf5ff' },
]

export default function UserDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Hello, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">What would you like to do today?</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map(({ label, icon: Icon, path, color, bg }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="kpi-card flex flex-col items-center gap-3 text-center hover:scale-105 transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: bg }}>
              <Icon size={26} style={{ color }} />
            </div>
            <span className="text-sm font-semibold text-gray-700">{label}</span>
          </button>
        ))}
      </div>

      <div className="kpi-card">
        <p className="text-sm text-gray-500 text-center py-8">
          Contact your admin for access to more features.
        </p>
      </div>
    </div>
  )
}

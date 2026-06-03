import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useAuthStore } from '../store/authStore'
import SuperAdminLayout from './SuperAdminLayout'

export default function DashboardLayout() {
  const { user } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (user?.role === 'superadmin') {
    return <SuperAdminLayout />
  }

  if (user?.role === 'customer' ||
      user?.role === 'farmer' ||
      user?.role === 'employee' ||
      user?.email?.toLowerCase() === 'user@agroerp.com' ||
      [
        'Sales Executive',
        'Inventory Manager',
        'Warehouse Staff',
        'Delivery Coordinator',
        'Customer Support Executive',
        'Finance Executive',
        'HR Manager',
        'Marketing Executive'
      ].includes(user?.role)
  ) {
    return <Outlet />
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F8FAFC' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin">
          <div className="max-w-screen-2xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

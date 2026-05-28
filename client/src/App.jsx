import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

// Layouts
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// Dashboard Pages
import AdminDashboard from './pages/dashboard/AdminDashboard'
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard'
import UserDashboard from './pages/dashboard/UserDashboard'

// Product Pages
import Products from './pages/products/Products'
import AddProduct from './pages/products/AddProduct'

// Inventory
import Inventory from './pages/inventory/Inventory'

// Billing
import Billing from './pages/billing/Billing'
import BillHistory from './pages/billing/BillHistory'
import InvoiceView from './pages/billing/InvoiceView'

// Customers
import Customers from './pages/customers/Customers'
import CustomerDetail from './pages/customers/CustomerDetail'

// Udhari
import Udhari from './pages/udhari/Udhari'

// Analytics
import Analytics from './pages/analytics/Analytics'

// Weather
import Weather from './pages/weather/Weather'

// Notifications
import Notifications from './pages/notifications/Notifications'

// Employees
import Employees from './pages/employees/Employees'

// Subscription + Settings
import Subscription from './pages/subscription/Subscription'
import Settings from './pages/settings/Settings'
import Landing from './pages/Landing'

// Protected route wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function DashboardRouter() {
  const { user } = useAuthStore()
  if (user?.role === 'superadmin') return <SuperAdminDashboard />
  if (user?.role === 'user') return <UserDashboard />
  return <AdminDashboard />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '10px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          },
          success: { iconTheme: { primary: '#2E7D32', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF5350', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<AddProduct />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/billing/history" element={<BillHistory />} />
          <Route path="/billing/invoice/:id" element={<InvoiceView />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/udhari" element={<Udhari />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route
            path="/employees"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

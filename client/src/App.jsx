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

// Complaints & Support Pages
import FarmerComplaints from './pages/complaints/FarmerComplaints'
import VendorComplaints from './pages/complaints/VendorComplaints'
import DeliveryComplaints from './pages/complaints/DeliveryComplaints'
import TicketSystem from './pages/complaints/TicketSystem'
import LiveChatMonitoring from './pages/complaints/LiveChatMonitoring'
import CallSupportLogs from './pages/complaints/CallSupportLogs'
import ResolutionReports from './pages/complaints/ResolutionReports'

// Reports & Analytics Pages
import RevenueAnalytics from './pages/reports/RevenueAnalytics'
import SalesReports from './pages/reports/SalesReports'
import VendorReports from './pages/reports/VendorReports'
import ProductReports from './pages/reports/ProductReports'
import DeliveryReports from './pages/reports/DeliveryReports'
import EmployeeReports from './pages/reports/EmployeeReports'
import AIReports from './pages/reports/AIReports'
import RegionAnalytics from './pages/reports/RegionAnalytics'

// Security & Access Pages
import RoleManagement from './pages/security/RoleManagement'
import PermissionSettings from './pages/security/PermissionSettings'
import LoginSecurity from './pages/security/LoginSecurity'
import OtpSettings from './pages/security/OtpSettings'
import DeviceManagement from './pages/security/DeviceManagement'
import SessionMonitoring from './pages/security/SessionMonitoring'
import AuditLogs from './pages/security/AuditLogs'
import DataBackup from './pages/security/DataBackup'

// Notification Center Pages
import PushNotifications from './pages/notifications_center/PushNotifications'
import SmsAlerts from './pages/notifications_center/SmsAlerts'
import EmailAlerts from './pages/notifications_center/EmailAlerts'
import WhatsappNotifications from './pages/notifications_center/WhatsappNotifications'
import Announcements from './pages/notifications_center/Announcements'
import EmergencyAlerts from './pages/notifications_center/EmergencyAlerts'

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

          {/* Complaint & Support Routes */}
          <Route path="/complaints/farmer" element={<ProtectedRoute allowedRoles={['superadmin']}><FarmerComplaints /></ProtectedRoute>} />
          <Route path="/complaints/vendor" element={<ProtectedRoute allowedRoles={['superadmin']}><VendorComplaints /></ProtectedRoute>} />
          <Route path="/complaints/delivery" element={<ProtectedRoute allowedRoles={['superadmin']}><DeliveryComplaints /></ProtectedRoute>} />
          <Route path="/complaints/tickets" element={<ProtectedRoute allowedRoles={['superadmin']}><TicketSystem /></ProtectedRoute>} />
          <Route path="/complaints/live-chat" element={<ProtectedRoute allowedRoles={['superadmin']}><LiveChatMonitoring /></ProtectedRoute>} />
          <Route path="/complaints/call-logs" element={<ProtectedRoute allowedRoles={['superadmin']}><CallSupportLogs /></ProtectedRoute>} />
          <Route path="/complaints/resolution-reports" element={<ProtectedRoute allowedRoles={['superadmin']}><ResolutionReports /></ProtectedRoute>} />

          {/* Reports & Analytics Routes */}
          <Route path="/reports/revenue-analytics" element={<ProtectedRoute allowedRoles={['superadmin']}><RevenueAnalytics /></ProtectedRoute>} />
          <Route path="/reports/sales-reports" element={<ProtectedRoute allowedRoles={['superadmin']}><SalesReports /></ProtectedRoute>} />
          <Route path="/reports/vendor-reports" element={<ProtectedRoute allowedRoles={['superadmin']}><VendorReports /></ProtectedRoute>} />
          <Route path="/reports/product-reports" element={<ProtectedRoute allowedRoles={['superadmin']}><ProductReports /></ProtectedRoute>} />
          <Route path="/reports/delivery-reports" element={<ProtectedRoute allowedRoles={['superadmin']}><DeliveryReports /></ProtectedRoute>} />
          <Route path="/reports/employee-reports" element={<ProtectedRoute allowedRoles={['superadmin']}><EmployeeReports /></ProtectedRoute>} />
          <Route path="/reports/ai-reports" element={<ProtectedRoute allowedRoles={['superadmin']}><AIReports /></ProtectedRoute>} />
          <Route path="/reports/region-analytics" element={<ProtectedRoute allowedRoles={['superadmin']}><RegionAnalytics /></ProtectedRoute>} />

          {/* Security & Access Routes */}
          <Route path="/security/role-management" element={<ProtectedRoute allowedRoles={['superadmin']}><RoleManagement /></ProtectedRoute>} />
          <Route path="/security/permission-settings" element={<ProtectedRoute allowedRoles={['superadmin']}><PermissionSettings /></ProtectedRoute>} />
          <Route path="/security/login-security" element={<ProtectedRoute allowedRoles={['superadmin']}><LoginSecurity /></ProtectedRoute>} />
          <Route path="/security/otp-settings" element={<ProtectedRoute allowedRoles={['superadmin']}><OtpSettings /></ProtectedRoute>} />
          <Route path="/security/device-management" element={<ProtectedRoute allowedRoles={['superadmin']}><DeviceManagement /></ProtectedRoute>} />
          <Route path="/security/session-monitoring" element={<ProtectedRoute allowedRoles={['superadmin']}><SessionMonitoring /></ProtectedRoute>} />
          <Route path="/security/audit-logs" element={<ProtectedRoute allowedRoles={['superadmin']}><AuditLogs /></ProtectedRoute>} />
          <Route path="/security/data-backup" element={<ProtectedRoute allowedRoles={['superadmin']}><DataBackup /></ProtectedRoute>} />

          {/* Notification Center Routes */}
          <Route path="/notifications-center/push" element={<ProtectedRoute allowedRoles={['superadmin']}><PushNotifications /></ProtectedRoute>} />
          <Route path="/notifications-center/sms" element={<ProtectedRoute allowedRoles={['superadmin']}><SmsAlerts /></ProtectedRoute>} />
          <Route path="/notifications-center/email" element={<ProtectedRoute allowedRoles={['superadmin']}><EmailAlerts /></ProtectedRoute>} />
          <Route path="/notifications-center/whatsapp" element={<ProtectedRoute allowedRoles={['superadmin']}><WhatsappNotifications /></ProtectedRoute>} />
          <Route path="/notifications-center/announcements" element={<ProtectedRoute allowedRoles={['superadmin']}><Announcements /></ProtectedRoute>} />
          <Route path="/notifications-center/emergency" element={<ProtectedRoute allowedRoles={['superadmin']}><EmergencyAlerts /></ProtectedRoute>} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

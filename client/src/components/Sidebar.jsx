import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useAdminStore } from '../store/adminStore'
import {
  LayoutDashboard, Store, Users, Package, Boxes, ShoppingBag, ClipboardList,
  UserCheck, CreditCard, Truck, Sprout, Megaphone, LifeBuoy, BarChart3, Settings,
  LogOut, X, ChevronDown, Search, Sun, Moon
} from 'lucide-react'

// Complete Hierarchical Menu Structure for Admin Panel
const ADMIN_MENU_STRUCTURE = [
  {
    category: 'Dashboard',
    icon: LayoutDashboard,
    items: ['Overview', 'Revenue Summary', 'Sales Analytics', 'Inventory Summary', 'Recent Orders', 'Customer Insights', 'AI Insights']
  },
  {
    category: 'Shop Management',
    icon: Store,
    items: ['Shop Profile', 'Branch Management', 'Business Hours', 'Tax Settings', 'Printer Settings']
  },
  {
    category: 'Employee Management',
    icon: Users,
    items: ['Add Employee', 'Manage Employees', 'Assign Roles', 'Attendance', 'Leave Management', 'Salary Management', 'Performance Tracking', 'GPS Tracking', 'Employee Reports']
  },
  {
    category: 'Products',
    icon: Package,
    items: ['Product Management', 'Categories', 'Brands', 'Product Pricing', 'Discounts', 'Featured Products', 'Product Reviews']
  },
  {
    category: 'Inventory Management',
    icon: Boxes,
    items: ['Stock Overview', 'Stock In', 'Stock Out', 'Low Stock Alerts', 'Expiry Tracking', 'Barcode / QR Tracking', 'Damage Reports', 'Inventory Reports']
  },
  {
    category: 'Purchase Management',
    icon: ShoppingBag,
    items: ['Suppliers', 'Purchase Orders', 'Purchase History', 'Purchase Returns', 'Supplier Payments']
  },
  {
    category: 'Order Management',
    icon: ClipboardList,
    items: ['New Orders', 'Processing Orders', 'Delivered Orders', 'Cancelled Orders', 'Returns & Refunds', 'Invoices']
  },
  {
    category: 'Customer Management',
    icon: UserCheck,
    items: ['Customers', 'Farmer Profiles', 'Credit Accounts', 'Loyalty Points', 'Customer Feedback', 'Customer Reports']
  },
  {
    category: 'Billing & POS',
    icon: CreditCard,
    items: ['Billing', 'Bill History', 'Udhari / Credit', 'Payment Collection', 'Daily Cash Reports']
  },
  {
    category: 'Delivery Management',
    icon: Truck,
    items: ['Delivery Assignments', 'Delivery Tracking', 'Delivery Staff', 'Route Optimization', 'Failed Deliveries', 'Delivery Reports']
  },
  {
    category: 'Agri Intelligence',
    icon: Sprout,
    items: ['Weather Forecast', 'Crop Advisory', 'Disease Detection', 'Yield Prediction', 'Soil Health', 'Farmer Recommendations']
  },
  {
    category: 'Marketing',
    icon: Megaphone,
    items: ['Coupons', 'Promotions', 'SMS Campaigns', 'Email Campaigns', 'Customer Notifications']
  },
  {
    category: 'Support Center',
    icon: LifeBuoy,
    items: ['Customer Complaints', 'Refund Requests', 'Help Desk', 'Support Tickets']
  },
  {
    category: 'Reports & Analytics',
    icon: BarChart3,
    items: ['Sales Reports', 'Inventory Reports', 'Customer Reports', 'Financial Reports', 'Employee Reports', 'Delivery Reports', 'Product Performance', 'Agri Analytics', 'Custom Builder', 'Recent Reports']
  },
  {
    category: 'Settings',
    icon: Settings,
    items: ['Role Permissions', 'Notification Settings', 'Security Settings', 'Backup Settings', 'System Preferences', 'Shop Appearance', 'Printer Settings', 'Tax Settings', 'Audit Logs', 'System Health']
  }
]

// Role permissions mapping
const ROLE_PERMISSIONS = {
  admin: '*', // Admin gets everything
  'Sales Executive': {
    'Dashboard': ['Overview', 'Sales Analytics', 'Recent Orders', 'Customer Insights'],
    'Products': ['Product Management', 'Product Pricing', 'Discounts'],
    'Order Management': ['New Orders', 'Processing Orders', 'Delivered Orders', 'Cancelled Orders', 'Invoices'],
    'Customer Management': ['Customers', 'Farmer Profiles', 'Loyalty Points'],
    'Billing & POS': ['Billing', 'Bill History', 'Udhari / Credit']
  },
  'Inventory Manager': {
    'Dashboard': ['Overview', 'Inventory Summary'],
    'Products': ['Product Management', 'Categories', 'Brands', 'Product Pricing'],
    'Inventory Management': ['Stock Overview', 'Stock In', 'Stock Out', 'Low Stock Alerts', 'Expiry Tracking', 'Barcode / QR Tracking', 'Inventory Reports'],
    'Purchase Management': ['Suppliers', 'Purchase Orders', 'Purchase History']
  },
  'Warehouse Staff': {
    'Inventory Management': ['Stock Overview', 'Stock In', 'Stock Out', 'Low Stock Alerts', 'Expiry Tracking', 'Barcode / QR Tracking', 'Damage Reports']
  },
  'Delivery Coordinator': {
    'Dashboard': ['Overview', 'Recent Orders'],
    'Order Management': ['New Orders', 'Processing Orders', 'Delivered Orders', 'Cancelled Orders'],
    'Delivery Management': ['Delivery Assignments', 'Delivery Tracking', 'Delivery Staff', 'Route Optimization', 'Failed Deliveries', 'Delivery Reports']
  },
  'Delivery Executive': {
    'Delivery Management': ['Delivery Assignments', 'Delivery Tracking']
  },
  'Customer Support Executive': {
    'Customer Management': ['Customers', 'Farmer Profiles', 'Customer Feedback'],
    'Support Center': ['Customer Complaints', 'Refund Requests', 'Help Desk', 'Support Tickets']
  },
  'Agriculture Expert': {
    'Dashboard': ['Overview', 'AI Insights'],
    'Agri Intelligence': ['Weather Forecast', 'Crop Advisory', 'Disease Detection', 'Yield Prediction', 'Soil Health', 'Farmer Recommendations']
  },
  'Finance Executive': {
    'Dashboard': ['Overview', 'Revenue Summary', 'Sales Analytics'],
    'Purchase Management': ['Supplier Payments', 'Purchase History'],
    'Billing & POS': ['Bill History', 'Udhari / Credit', 'Payment Collection', 'Daily Cash Reports'],
    'Reports & Analytics': ['Sales Reports', 'Inventory Reports', 'Customer Reports', 'Financial Reports']
  },
  'HR Manager': {
    'Employee Management': ['Add Employee', 'Manage Employees', 'Assign Roles', 'Attendance', 'Leave Management', 'Salary Management', 'Performance Tracking', 'Employee Reports']
  },
  'Marketing Executive': {
    'Customer Management': ['Customers', 'Farmer Profiles', 'Customer Feedback'],
    'Marketing': ['Coupons', 'Promotions', 'SMS Campaigns', 'Email Campaigns', 'Customer Notifications']
  },
  'Field Officer': {
    'Customer Management': ['Customers', 'Farmer Profiles', 'Customer Feedback'],
    'Agri Intelligence': ['Weather Forecast', 'Crop Advisory', 'Farmer Recommendations']
  },
  'Quality Checker': {
    'Products': ['Product Management', 'Product Reviews'],
    'Inventory Management': ['Stock Overview', 'Low Stock Alerts', 'Expiry Tracking', 'Damage Reports']
  },
  'Technical Support': {
    'Support Center': ['Help Desk', 'Support Tickets'],
    'Settings': ['Notification Settings', 'Security Settings', 'Backup Settings']
  }
}

const roleColors = {
  superadmin: { bg: '#FFF3E0', text: '#E65100', label: 'Super Admin' },
  admin: { bg: '#E8F5E9', text: '#2E7D32', label: 'Admin' },
  user: { bg: '#E3F2FD', text: '#1565C0', label: 'Staff' },
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuthStore()
  if (user?.role === 'customer' ||
      user?.role === 'farmer' ||
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
    return null
  }
  const { activeCategory, activeSubItem, setActiveItem } = useAdminStore()
  const navigate = useNavigate()
  
  const role = user?.role || 'user'
  
  // Dynamic role formatting
  const getRoleInfo = (r) => {
    if (roleColors[r]) return roleColors[r]
    return { bg: '#F3E5F5', text: '#7B1FA2', label: r }
  }
  const roleInfo = getRoleInfo(role)

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

  // Filter categories and submodules based on role permissions
  const getPermittedMenu = () => {
    const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['Sales Executive'] // Default to Sales Executive if not found
    
    return ADMIN_MENU_STRUCTURE.map(group => {
      // If user has all permissions (*), keep all
      if (permissions === '*') {
        return group
      }
      
      // If category is not permitted at all, omit
      if (!permissions[group.category]) {
        return null
      }
      
      // Filter allowed items in this category
      const allowedItems = group.items.filter(item => 
        permissions[group.category].includes(item)
      )
      
      if (allowedItems.length === 0) return null
      
      return {
        ...group,
        items: allowedItems
      }
    }).filter(Boolean)
  }

  const permittedMenu = getPermittedMenu()

  // Filter by search query
  const filteredMenu = permittedMenu.map(group => {
    const isCatMatch = group.category.toLowerCase().includes(search.toLowerCase())
    const matchedItems = group.items.filter(item =>
      item.toLowerCase().includes(search.toLowerCase())
    )

    if (isCatMatch || matchedItems.length > 0) {
      return {
        ...group,
        items: isCatMatch ? group.items : matchedItems
      }
    }
    return null
  }).filter(Boolean)

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 w-64 flex flex-col h-screen
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
            <Sprout size={18} className="text-white" />
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
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: roleInfo.bg, color: roleInfo.text }}
          >
            {roleInfo.label}
          </span>
        </div>
      </div>

      {/* Search Modules */}
      <div className="px-3 pt-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-100 bg-gray-50/50 focus-within:border-emerald-600 transition-all">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs outline-none w-full placeholder-gray-400 text-gray-700 font-medium"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Accordion */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Modules</p>
        
        {filteredMenu.map((group) => {
          const Icon = group.icon
          const isExpanded = expandedCategories[group.category] || search.length > 0
          const hasActiveItem = activeCategory === group.category

          return (
            <div key={group.category} className="rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(group.category)}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150
                  ${hasActiveItem 
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'hover:bg-gray-50 text-gray-600'}
                `}
              >
                <Icon size={16} className={hasActiveItem ? 'text-emerald-600' : 'text-gray-400'} />
                <span className="flex-1 text-left truncate">{group.category}</span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {isExpanded && (
                <div className="ml-5 mt-0.5 pl-2 border-l border-gray-100 space-y-0.5">
                  {group.items.map((subItem) => {
                    const isSubActive = activeCategory === group.category && activeSubItem === subItem
                    return (
                      <button
                        key={subItem}
                        onClick={() => {
                          setActiveItem(group.category, subItem)
                          navigate('/dashboard')
                          if (onClose) onClose()
                        }}
                        className={`
                          w-full text-left block py-1.5 px-3 rounded-md text-[11px] font-medium transition-all relative
                          ${isSubActive
                            ? 'text-emerald-600 font-bold bg-emerald-500/5'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}
                        `}
                      >
                        {isSubActive && (
                          <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-emerald-600" />
                        )}
                        {subItem}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

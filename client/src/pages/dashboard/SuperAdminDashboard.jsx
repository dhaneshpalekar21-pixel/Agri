import { useState } from 'react'
import {
  LayoutDashboard, Sliders, Shield, Store, Warehouse, ShoppingBag,
  TrendingUp, Users, Briefcase, Truck, DollarSign, Brain,
  Megaphone, LifeBuoy, BarChart3, Lock, Bell, Crown,
  FileText, Cpu, Plus, Check, X, AlertTriangle, Search,
  Filter, Edit3, Trash2, Power, Send, CheckCircle, RefreshCw, HelpCircle
} from 'lucide-react'
import KPICard from '../../components/KPICard'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts'

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activeSubTab, setActiveSubTab] = useState('overview')

  // Platform state
  const [appName, setAppName] = useState('Krishi Care')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [otpLogin, setOtpLogin] = useState(true)

  // Marketing Notification state
  const [pushTitle, setPushTitle] = useState('')
  const [pushMsg, setPushMsg] = useState('')
  
  // Custom coupon state
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState('15')

  // Mock State Lists
  const [pendingVendors, setPendingVendors] = useState([
    { id: 1, name: 'Kisan Agro Kendra', owner: 'Ramesh Patil', region: 'Pune', status: 'Pending' },
    { id: 2, name: 'Shetkari Seva', owner: 'Suresh Deshmukh', region: 'Nashik', status: 'Pending' },
    { id: 3, name: 'Balaji Seeds', owner: 'Venkat Rao', region: 'Solapur', status: 'Pending' },
  ])

  const [supportTickets, setSupportTickets] = useState([
    { id: 'T-104', type: 'Farmer', issue: 'Payment debited but order not placed', user: 'Baburao Shinde', status: 'Open' },
    { id: 'T-105', type: 'Vendor', issue: 'Payout delayed for batch #43', user: 'Krushi Bhandar', status: 'In Progress' },
    { id: 'T-106', type: 'Delivery', issue: 'App crashed during route navigation', user: 'Amit More', status: 'Open' },
  ])

  const [diseaseReports, setDiseaseReports] = useState([
    { id: 1, crop: 'Tomato', disease: 'Late Blight', confidence: '94%', region: 'Kolhapur', status: 'Action Taken' },
    { id: 2, crop: 'Cotton', disease: 'Leaf Curl Virus', confidence: '89%', region: 'Nagpur', status: 'Investigating' },
    { id: 3, crop: 'Soybean', disease: 'Rust', confidence: '91%', region: 'Latur', status: 'Resolved' },
  ])

  // Mock Data
  const stats = {
    revenue: 1845000,
    orders: 12450,
    vendors: 84,
    farmers: 3240,
    deliveries: 9820
  }

  const liveAnalyticsData = [
    { time: '10:00', orders: 120, activeUsers: 450 },
    { time: '11:00', orders: 185, activeUsers: 620 },
    { time: '12:00', orders: 240, activeUsers: 810 },
    { time: '13:00', orders: 210, activeUsers: 750 },
    { time: '14:00', orders: 280, activeUsers: 920 },
    { time: '15:00', orders: 310, activeUsers: 1050 },
  ]

  const pieData = [
    { name: 'Seeds', value: 400, color: '#2E7D32' },
    { name: 'Fertilizers', value: 300, color: '#1565C0' },
    { name: 'Pesticides', value: 200, color: '#E65100' },
    { name: 'Tools', value: 150, color: '#7c3aed' },
  ]

  // Menu Definition
  const menuSections = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'platform', label: 'Platform Management', icon: Sliders },
    { id: 'admin_mgmt', label: 'Admin Management', icon: Shield },
    { id: 'vendor_mgmt', label: 'Vendor Management', icon: Store },
    { id: 'warehouse', label: 'Warehouse Management', icon: Warehouse },
    { id: 'product_mgmt', label: 'Product Management', icon: ShoppingBag },
    { id: 'order_mgmt', label: 'Order Management', icon: TrendingUp },
    { id: 'farmer_mgmt', label: 'Farmer/User Management', icon: Users },
    { id: 'employee_mgmt', label: 'Employee Management', icon: Briefcase },
    { id: 'delivery_mgmt', label: 'Delivery Management', icon: Truck },
    { id: 'financial_mgmt', label: 'Financial Management', icon: DollarSign },
    { id: 'ai_mgmt', label: 'AI Management', icon: Brain },
    { id: 'marketing', label: 'Marketing Management', icon: Megaphone },
    { id: 'support', label: 'Support & Complaints', icon: LifeBuoy },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'security', label: 'Security & Access', icon: Lock },
    { id: 'notifications', label: 'Notification System', icon: Bell },
    { id: 'subscription', label: 'Subscription & Plans', icon: Crown },
    { id: 'government', label: 'Govt & Schemes', icon: FileText },
    { id: 'integrations', label: 'System Integrations', icon: Cpu },
  ]

  // Event Handlers
  const handleApproveVendor = (id) => {
    setPendingVendors(prev => prev.filter(v => v.id !== id))
  }

  const handleResolveTicket = (id) => {
    setSupportTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t))
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-100px)]">
      
      {/* Left Sub-Sidebar for Super Admin Modules */}
      <div className="w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-fit max-h-[85vh] overflow-y-auto scrollbar-thin">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Super Control Center</p>
        </div>
        <div className="space-y-1">
          {menuSections.map((sec) => {
            const Icon = sec.icon
            const active = activeTab === sec.id
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveTab(sec.id)
                  setActiveSubTab('overview')
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm font-medium transition-all ${
                  active 
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} className={active ? 'text-emerald-600' : 'text-gray-400'} />
                <span className="truncate">{sec.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Feature Content Panel */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
        
        {/* Render Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Platform Performance Dashboard</h2>
                <p className="text-sm text-gray-500">Live multi-tenant marketplace monitoring</p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 animate-pulse border border-green-200">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Live Monitoring Active
                </span>
              </div>
            </div>

            {/* Platform KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <KPICard title="Total Revenue" value={stats.revenue} prefix="₹" color="purple" trend="up" trendValue={12.4} />
              <KPICard title="Total Orders" value={stats.orders} color="blue" trend="up" trendValue={8.2} />
              <KPICard title="Total Vendors" value={stats.vendors} color="green" trend="up" trendValue={4.1} />
              <KPICard title="Total Farmers" value={stats.farmers} color="orange" trend="up" trendValue={15.3} />
              <KPICard title="Deliveries" value={stats.deliveries} color="red" trend="down" trendValue={1.8} />
            </div>

            {/* Charts & AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Line Chart */}
              <div className="lg:col-span-2 border border-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-gray-800">Live Traffic & Orders</h4>
                  <span className="text-xs text-gray-400">Updates every minute</span>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={liveAnalyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="#2E7D32" strokeWidth={2.5} name="Orders" />
                    <Line type="monotone" dataKey="activeUsers" stroke="#1565C0" strokeWidth={2.5} name="Active Farmers" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* AI Insights & Recent Activities */}
              <div className="space-y-4">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-emerald-800">
                    <Brain size={18} />
                    <h4 className="font-semibold text-sm">Agri-AI Insight Engine</h4>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Nitrogen-based fertilizers are showing an expected demand surge of <strong>24% in Vidarbha region</strong> over the next 10 days due to pre-monsoon sowing signals.
                  </p>
                </div>

                <div className="border border-gray-100 rounded-xl p-4">
                  <h4 className="font-semibold text-sm text-gray-800 mb-3">Recent System Events</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1 text-gray-600">New vendor <strong>Shivaji Seeds</strong> requested registration approval.</div>
                      <span className="text-gray-400">2m ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="flex-1 text-gray-600">Farmer <strong>Ashok Dev</strong> completed KYC verification.</div>
                      <span className="text-gray-400">12m ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="flex-1 text-gray-600">High-value order #12890 (₹48,500) placed in Nashik.</div>
                      <span className="text-gray-400">25m ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 2: Platform Management */}
        {activeTab === 'platform' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Platform Settings</h2>
              <p className="text-sm text-gray-500">Manage site theme, banner advertisements, localization, and branding assets</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 border border-gray-100 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 text-sm border-b pb-2">Website & App Configuration</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Platform Name</label>
                  <input 
                    type="text" 
                    value={appName} 
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">App Store Version</label>
                    <input type="text" defaultValue="v2.4.1" className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50" readOnly />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Play Store Version</label>
                    <input type="text" defaultValue="v2.4.9-patch3" className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50" readOnly />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700">Maintenance Mode</h4>
                      <p className="text-xs text-gray-400">Lock users out during schema upgrades</p>
                    </div>
                    <button 
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${maintenanceMode ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border border-gray-100 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 text-sm border-b pb-2">Branding, Themes & CMS</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Primary Theme Gradient</label>
                  <div className="flex gap-2">
                    <span className="w-8 h-8 rounded-full bg-emerald-700 cursor-pointer border-2 border-emerald-400"></span>
                    <span className="w-8 h-8 rounded-full bg-green-600 cursor-pointer"></span>
                    <span className="w-8 h-8 rounded-full bg-indigo-700 cursor-pointer"></span>
                    <span className="w-8 h-8 rounded-full bg-amber-600 cursor-pointer"></span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Upload Brand Logo</label>
                  <div className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-4 justify-center bg-gray-50/50 hover:bg-gray-50 cursor-pointer">
                    <span className="text-2xl">🌾</span>
                    <span className="text-xs font-medium text-gray-500">Upload new logo (.png, .svg)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Hero CMS Header</label>
                  <input type="text" defaultValue="Modern ERP Solution for Indian Agriculture" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 3: Admin Management */}
        {activeTab === 'admin_mgmt' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Regional Admins</h2>
                <p className="text-sm text-gray-500">Create, suspend, and configure regional access permissions for branch operations</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">
                <Plus size={16} /> Create Regional Admin
              </button>
            </div>

            {/* List Admins */}
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-500 border-b border-gray-100">
                    <th className="p-3">Admin Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Assigned Region</th>
                    <th className="p-3">Permissions</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  <tr>
                    <td className="p-3 font-semibold text-gray-800">Milind Kulkarni</td>
                    <td className="p-3 text-gray-500">milind.k@agroerp.com</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-medium">Western Maharashtra</span></td>
                    <td className="p-3 text-xs text-gray-500">Billing, Inventory, Approvals</td>
                    <td className="p-3 text-right space-x-2">
                      <button className="text-gray-400 hover:text-gray-600 font-medium">Edit</button>
                      <button className="text-red-500 hover:text-red-700 font-medium">Suspend</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-800">Radha Iyengar</td>
                    <td className="p-3 text-gray-500">radha.i@agroerp.com</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-xs font-medium">Karnataka North</span></td>
                    <td className="p-3 text-xs text-gray-500">Inventory, Delivery Control</td>
                    <td className="p-3 text-right space-x-2">
                      <button className="text-gray-400 hover:text-gray-600 font-medium">Edit</button>
                      <button className="text-red-500 hover:text-red-700 font-medium">Suspend</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Render Tab 4: Vendor Management */}
        {activeTab === 'vendor_mgmt' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Vendor Management Panel</h2>
              <p className="text-sm text-gray-500">Approve registrations, manage commission schedules, and verify marketplace suppliers</p>
            </div>

            {/* Pending Vendor Approvals */}
            <div className="border border-gray-100 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 text-sm mb-3">Pending Registration Approvals</h3>
              {pendingVendors.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">No pending approvals at the moment!</div>
              ) : (
                <div className="space-y-3">
                  {pendingVendors.map((vendor) => (
                    <div key={vendor.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-800">{vendor.name}</h4>
                        <p className="text-xs text-gray-500">Owner: {vendor.owner} | Region: {vendor.region}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApproveVendor(vendor.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                        >
                          <Check size={12} /> Approve
                        </button>
                        <button 
                          onClick={() => handleApproveVendor(vendor.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold"
                        >
                          <X size={12} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Commission Settings */}
            <div className="border border-gray-100 rounded-xl p-4 max-w-md">
              <h3 className="font-bold text-gray-800 text-sm mb-3">Global Commission Configurations</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Standard Market Fee (%)</label>
                  <input type="number" defaultValue="4.5" className="w-full px-3 py-1.5 border rounded-lg text-sm" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Govt Subsidy Exemption</label>
                  <select className="w-full px-3 py-1.5 border rounded-lg text-sm">
                    <option>Fully Exempt (0%)</option>
                    <option>Partial (2%)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 5: Warehouse Management */}
        {activeTab === 'warehouse' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Warehouse & Cold Storage Hubs</h2>
                <p className="text-sm text-gray-500">Track multi-warehouse inventory limits, transfers, damage, and expiries</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">
                <Plus size={16} /> Create Warehouse Hub
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-bold text-sm text-gray-800">Hub-1: Pune Central</h3>
                <p className="text-xs text-gray-400 mt-1">Capacity Utilization: 84%</p>
                <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
                <div className="mt-4 flex justify-between text-xs font-semibold">
                  <span>1,200 MT Sowed</span>
                  <span>1,500 MT Max</span>
                </div>
              </div>
              <div className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-bold text-sm text-gray-800">Hub-2: Nashik Cold Hub</h3>
                <p className="text-xs text-gray-400 mt-1">Capacity Utilization: 42%</p>
                <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <div className="mt-4 flex justify-between text-xs font-semibold">
                  <span>630 MT Stored</span>
                  <span>1,500 MT Max</span>
                </div>
              </div>
              <div className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-bold text-sm text-gray-800">Hub-3: Solapur Outlet</h3>
                <p className="text-xs text-gray-400 mt-1">Capacity Utilization: 91%</p>
                <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                </div>
                <div className="mt-4 flex justify-between text-xs font-semibold text-red-600">
                  <span>910 MT Stored</span>
                  <span>Near Limit!</span>
                </div>
              </div>
            </div>

            {/* Damage & Expiry Alerts */}
            <div className="border border-red-50 border-dashed rounded-xl p-4 bg-red-50/20">
              <div className="flex items-center gap-2 text-red-800 font-semibold text-sm mb-3">
                <AlertTriangle size={18} />
                <span>Urgent Expiry & Damage Alerts</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-white border border-red-100 p-2.5 rounded-lg">
                  <span className="font-semibold text-gray-700">Pesticide Chlorpyrifos Batch #901</span>
                  <span className="text-red-600 font-bold">Expires in 4 days (Nashik)</span>
                </div>
                <div className="flex justify-between bg-white border border-red-100 p-2.5 rounded-lg">
                  <span className="font-semibold text-gray-700">Certified Wheat Seeds (3.5 MT)</span>
                  <span className="text-amber-600 font-bold">Water Damage Reported (Solapur)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 6: Product Management */}
        {activeTab === 'product_mgmt' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Product Catalog Control</h2>
              <p className="text-sm text-gray-500">Configure global catalog categories, pricing restrictions, tax rates, and review approvals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-sm text-gray-800 border-b pb-2">Active Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {['Organic Seeds', 'Chemical Fertilizers', 'Drip Irrigation', 'Soil Enhancers', 'Tractors & Tools', 'Crop Sprayers'].map((cat, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold flex items-center gap-1.5">
                      {cat} <X size={12} className="cursor-pointer hover:text-red-500" />
                    </span>
                  ))}
                  <button className="px-3 py-1 border border-dashed border-emerald-600 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Plus size={12} /> Add Category
                  </button>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-sm text-gray-800 border-b pb-2">Tax Settings & Pricing Rules</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">GST on Seeds</label>
                    <input type="text" defaultValue="0% (Tax Free)" className="w-full px-3 py-1.5 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">GST on Equipment</label>
                    <input type="text" defaultValue="12% Standard" className="w-full px-3 py-1.5 border rounded-lg text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 7: Order Management */}
        {activeTab === 'order_mgmt' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Platform Order Pipeline</h2>
                <p className="text-sm text-gray-500">Track and filter orders across all regions, vendors, and delivery handlers</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-xs font-semibold">18 Active Delivers</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-100 rounded-lg text-xs font-semibold">4 Refund Processing</span>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-500 border-b border-gray-100">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Farmer</th>
                    <th className="p-3">Vendor Store</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  <tr>
                    <td className="p-3 font-semibold text-emerald-700">#ORD-90234</td>
                    <td className="p-3 text-gray-800">Balasaheb Thorat</td>
                    <td className="p-3 text-gray-500">Kolhapur Agri Store</td>
                    <td className="p-3 font-bold text-gray-900">₹8,450</td>
                    <td className="p-3"><span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">Processing</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-emerald-700">#ORD-90233</td>
                    <td className="p-3 text-gray-800">Dnyaneshwar Rao</td>
                    <td className="p-3 text-gray-500">Shetkari Sahakari</td>
                    <td className="p-3 font-bold text-gray-900">₹14,900</td>
                    <td className="p-3"><span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold">Delivered</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-emerald-700">#ORD-90232</td>
                    <td className="p-3 text-gray-800">Shrikant Patil</td>
                    <td className="p-3 text-gray-500">Patil Seeds Ltd</td>
                    <td className="p-3 font-bold text-gray-900">₹2,300</td>
                    <td className="p-3"><span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold">Cancelled</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Render Tab 8: Farmer/User Management */}
        {activeTab === 'farmer_mgmt' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Farmer Directory</h2>
              <p className="text-sm text-gray-500">Manage farmer KYC validation, profile updates, and loyalty system wallet balances</p>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-500 border-b border-gray-100">
                    <th className="p-3">Farmer Name</th>
                    <th className="p-3">Mobile No.</th>
                    <th className="p-3">State/Region</th>
                    <th className="p-3">KYC Status</th>
                    <th className="p-3">Loyalty Wallet</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  <tr>
                    <td className="p-3 font-semibold text-gray-800">Kashinath Pawar</td>
                    <td className="p-3 text-gray-500">+91 98450 12839</td>
                    <td className="p-3 text-gray-500">Maharashtra</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-semibold border border-green-200">Verified</span></td>
                    <td className="p-3 font-bold text-gray-800">₹450.00</td>
                    <td className="p-3 text-right">
                      <button className="text-emerald-600 hover:text-emerald-700 text-xs font-bold mr-2">Credit Wallet</button>
                      <button className="text-red-500 hover:text-red-700 text-xs font-bold">Suspend</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-800">Somappa Gowda</td>
                    <td className="p-3 text-gray-500">+91 94480 34821</td>
                    <td className="p-3 text-gray-500">Karnataka</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">Pending Docs</span></td>
                    <td className="p-3 font-bold text-gray-800">₹0.00</td>
                    <td className="p-3 text-right">
                      <button className="text-emerald-600 hover:text-emerald-700 text-xs font-bold mr-2">Credit Wallet</button>
                      <button className="text-red-500 hover:text-red-700 text-xs font-bold">Suspend</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Render Tab 9: Employee Management */}
        {activeTab === 'employee_mgmt' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Employee Management</h2>
              <p className="text-sm text-gray-500">Track shift status, GPS monitoring logs, attendance, and branch staff roles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-bold text-sm text-gray-800 mb-3">Live Active Field Staff (GPS Logged)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-gray-700">Ajit Gawade (Field Supervisor)</p>
                      <p className="text-gray-400">Region: Pune North | Device: POCO M4</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 font-semibold">Active Now</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-gray-700">Vikram Deshpande (Delivery Lead)</p>
                      <p className="text-gray-400">Region: Solapur | Device: Samsung F23</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-gray-50 text-gray-500">Offline</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-bold text-sm text-gray-800 mb-3">Attendance Stats</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-green-50 p-2.5 rounded-lg border border-green-100">
                    <p className="text-lg font-bold text-green-700">14</p>
                    <p className="text-[10px] text-green-600 uppercase font-semibold">Present</p>
                  </div>
                  <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                    <p className="text-lg font-bold text-amber-700">2</p>
                    <p className="text-[10px] text-amber-600 uppercase font-semibold">On Leave</p>
                  </div>
                  <div className="bg-red-50 p-2.5 rounded-lg border border-red-100">
                    <p className="text-lg font-bold text-red-700">0</p>
                    <p className="text-[10px] text-red-600 uppercase font-semibold">Absent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 10: Delivery Management */}
        {activeTab === 'delivery_mgmt' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Delivery Partners & Logistics</h2>
              <p className="text-sm text-gray-500">Review route optimization tasks, set delivery fees, and watch dispatch logs</p>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 max-w-lg">
              <h3 className="font-bold text-sm text-gray-800 mb-3">Delivery Rate Matrix</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Standard Shipping (Up to 5 km)</span>
                  <input type="text" defaultValue="₹50.00" className="w-24 px-2 py-1 border rounded text-right" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Bulk Freight Shipping (Per km extra)</span>
                  <input type="text" defaultValue="₹12.00" className="w-24 px-2 py-1 border rounded text-right" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 11: Financial Management */}
        {activeTab === 'financial_mgmt' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Financial Operations</h2>
              <p className="text-sm text-gray-500">Platform tax logs, subscription billings, vendor payouts, and overall profit metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-bold text-sm text-gray-800 mb-3">Net Profit Margin Share</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 text-xs font-semibold mt-2">
                  <span className="text-emerald-700">● Seeds</span>
                  <span className="text-blue-700">● Fertilizers</span>
                  <span className="text-amber-700">● Pesticides</span>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 space-y-4">
                <h3 className="font-bold text-sm text-gray-800">Pending Vendor Payout Releases</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>Pune Fertilizers Co.</span>
                    <span className="font-bold text-gray-800">₹1,84,000</span>
                    <button className="px-2 py-1 bg-emerald-600 text-white rounded font-semibold">Release Payout</button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>Sai Agro Agencies</span>
                    <span className="font-bold text-gray-800">₹92,500</span>
                    <button className="px-2 py-1 bg-emerald-600 text-white rounded font-semibold">Release Payout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 12: AI Management */}
        {activeTab === 'ai_mgmt' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>AI Model Controls & Parameters</h2>
              <p className="text-sm text-gray-500">Configure Crop Recommendation, Disease Detection, and Weather Prediction models</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gray-100 rounded-xl p-4 space-y-4">
                <h3 className="font-bold text-sm text-gray-800 border-b pb-2">Active Core Models</h3>
                
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-gray-700">Disease Identification AI (ResNet-50)</p>
                    <p className="text-gray-400">Current Accuracy: 94.2% | Inference: 180ms</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 font-semibold border border-green-200">Active</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-gray-700">Yield Prediction Model (LSTM)</p>
                    <p className="text-gray-400">Current Accuracy: 89.8% | Inference: 350ms</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 font-semibold border border-green-200">Active</span>
                </div>
              </div>

              {/* Disease Detection Image Upload logs */}
              <div className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-bold text-sm text-gray-800 mb-3">Recent Disease Detection Requests</h3>
                <div className="space-y-2">
                  {diseaseReports.map(rep => (
                    <div key={rep.id} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                      <div>
                        <p className="font-semibold text-gray-700">{rep.crop} - {rep.disease}</p>
                        <p className="text-gray-400">Region: {rep.region} | Confidence: {rep.confidence}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">{rep.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 13: Marketing Management */}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Marketing Operations</h2>
              <p className="text-sm text-gray-500">Run promo coupon systems, referral codes, SMS campaigns, and push alerts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign / Coupon System */}
              <div className="border border-gray-100 rounded-xl p-4 space-y-4">
                <h3 className="font-bold text-sm text-gray-800 border-b pb-2">Generate Promo Coupon</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Coupon Code</label>
                    <input 
                      type="text" 
                      placeholder="e.g. KISAN20" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Discount (%)</label>
                    <input 
                      type="number" 
                      value={couponDiscount}
                      onChange={(e) => setCouponDiscount(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm" 
                    />
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Coupon ${couponCode || 'PROMO'} created with ${couponDiscount}% discount!`)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Publish Coupon Code
                </button>
              </div>

              {/* Push Notifications Form */}
              <div className="border border-gray-100 rounded-xl p-4 space-y-4">
                <h3 className="font-bold text-sm text-gray-800 border-b pb-2">Broadcast Push Notification</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Notification Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Subsidy Update!" 
                    value={pushTitle} 
                    onChange={(e) => setPushTitle(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Notification Message</label>
                  <textarea 
                    placeholder="Describe content here..." 
                    value={pushMsg} 
                    onChange={(e) => setPushMsg(e.target.value)}
                    rows={2} 
                    className="w-full px-3 py-1.5 border rounded-lg text-sm"
                  ></textarea>
                </div>

                <button 
                  onClick={() => {
                    alert(`Broadcasted: "${pushTitle}" to all users.`)
                    setPushTitle('')
                    setPushMsg('')
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send size={14} /> Send Broadcast
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 14: Support & Complaints */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Support Center</h2>
              <p className="text-sm text-gray-500">Monitor active farmer, vendor, and delivery agent complaints and support logs</p>
            </div>

            <div className="border border-gray-100 rounded-xl p-4">
              <h3 className="font-bold text-sm text-gray-800 mb-3">Unresolved Complaints</h3>
              <div className="space-y-3">
                {supportTickets.map(ticket => (
                  <div key={ticket.id} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-800 text-xs">{ticket.id}</span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-gray-200 text-gray-600">{ticket.type}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 mt-1">{ticket.issue}</p>
                      <p className="text-xs text-gray-400">User: {ticket.user}</p>
                    </div>
                    <div>
                      {ticket.status !== 'Resolved' ? (
                        <button 
                          onClick={() => handleResolveTicket(ticket.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-semibold">Resolved</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 15: Reports & Analytics */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>System Reports & Analytics</h2>
              <p className="text-sm text-gray-500">Export analytics and details across sales, regional progress, and platform growth</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-100 rounded-xl p-4 text-center space-y-3">
                <span className="text-2xl">📊</span>
                <h3 className="font-semibold text-sm text-gray-800">Financial Reports</h3>
                <p className="text-xs text-gray-400">Download consolidated GST tax files & transaction logs.</p>
                <button className="w-full py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold">Export CSV</button>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 text-center space-y-3">
                <span className="text-2xl">🌱</span>
                <h3 className="font-semibold text-sm text-gray-800">Yield & Crop Analytics</h3>
                <p className="text-xs text-gray-400">Download crop recommendation success rate details.</p>
                <button className="w-full py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold">Export PDF</button>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 text-center space-y-3">
                <span className="text-2xl">👤</span>
                <h3 className="font-semibold text-sm text-gray-800">User Growth Data</h3>
                <p className="text-xs text-gray-400">Check active farmer subscription counts monthly.</p>
                <button className="w-full py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold">Export Excel</button>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 16: Security & Access Control */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Security & Access Control</h2>
              <p className="text-sm text-gray-500">Manage multi-factor verification, backup storage, and session options</p>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 space-y-4 max-w-md">
              <h3 className="font-bold text-sm text-gray-800 border-b pb-2">Auth Configurations</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700">Enforce OTP for all Admins</h4>
                  <p className="text-[10px] text-gray-400">Send standard SMS verification code on login attempt</p>
                </div>
                <button 
                  onClick={() => setOtpLogin(!otpLogin)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${otpLogin ? 'bg-emerald-600' : 'bg-gray-200'}`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${otpLogin ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700">Regular Automated Database Backups</h4>
                  <p className="text-[10px] text-gray-400">Perform snapshot capture every 24 hours</p>
                </div>
                <button className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded hover:bg-emerald-700">Backup Now</button>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 17: Notification System */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Notification Channels</h2>
              <p className="text-sm text-gray-500">Configure global API triggers for SMS, WhatsApp alerts, and email notifications</p>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 max-w-md space-y-3">
              <h3 className="font-bold text-sm text-gray-800">Alert Channels Status</h3>
              <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                <span>SMS Notification Service (Twilio)</span>
                <span className="text-green-600 font-semibold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Connected</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                <span>WhatsApp Business Service (Meta API)</span>
                <span className="text-green-600 font-semibold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Connected</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                <span>Email Service (SMTP/SendGrid)</span>
                <span className="text-red-500 font-semibold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Failed Configuration</span>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 18: Subscription & Plans */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Subscription & Membership Tiers</h2>
              <p className="text-sm text-gray-500">Define price tiers, transaction limits, and feature lists for farmers and vendors</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-emerald-600 bg-emerald-50/20 rounded-xl p-4 space-y-2">
                <span className="text-xs uppercase bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">Silver Tier</span>
                <h3 className="font-bold text-lg text-gray-800">₹999 / year</h3>
                <p className="text-xs text-gray-500">Best for small retail vendor shops. Access standard ERP billing and dashboard.</p>
                <button className="w-full py-1 bg-emerald-600 text-white rounded text-xs font-semibold">Modify Plan</button>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 space-y-2">
                <span className="text-xs uppercase bg-indigo-600 text-white font-bold px-2 py-0.5 rounded">Gold Tier</span>
                <h3 className="font-bold text-lg text-gray-800">₹2,499 / year</h3>
                <p className="text-xs text-gray-500">Includes advanced inventory management + AI recommendation capabilities.</p>
                <button className="w-full py-1 bg-emerald-600 text-white rounded text-xs font-semibold">Modify Plan</button>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 space-y-2">
                <span className="text-xs uppercase bg-amber-600 text-white font-bold px-2 py-0.5 rounded">Platinum Tier</span>
                <h3 className="font-bold text-lg text-gray-800">₹4,999 / year</h3>
                <p className="text-xs text-gray-500">Unlocks full cold chain tracking, logistics routing support & unlimited team staff.</p>
                <button className="w-full py-1 bg-emerald-600 text-white rounded text-xs font-semibold">Modify Plan</button>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 19: Government & Schemes */}
        {activeTab === 'government' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Government Scheme Portal</h2>
              <p className="text-sm text-gray-500">Publish regional agricultural subsidies and screen farmer scheme eligibility status</p>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 space-y-3">
              <h3 className="font-bold text-sm text-gray-800">Active Schemes</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs p-2.5 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold text-gray-700">PM-KISAN Fertilizer Subsidy (2026)</p>
                    <p className="text-gray-400">Status: Active | Eligibility: Smallholding Farmers</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold">Publish to Mobile App</span>
                </div>

                <div className="flex justify-between items-center text-xs p-2.5 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold text-gray-700">National Bee-keeping Initiative Grant</p>
                    <p className="text-gray-400">Status: Suspended | Eligibility: Organic Beekeepers</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-semibold">Draft Mode</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Tab 20: System Integrations */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>System API Integrations</h2>
              <p className="text-sm text-gray-500">Check and manage OAuth keys, endpoints, and credentials for third-party systems</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-gray-800">Razorpay Payment Gateway</h3>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                </div>
                <p className="text-xs text-gray-400">Credentials validation successful. Live checkout operations functional.</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold">Test Connection</button>
                  <button className="px-3 py-1 border rounded text-xs">Edit Keys</button>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-gray-800">Google Maps Platform (Route API)</h3>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                </div>
                <p className="text-xs text-gray-400">API Key status: Active. Latency: 45ms. Usage: 1,450 / day.</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold">Test Connection</button>
                  <button className="px-3 py-1 border rounded text-xs">Edit Keys</button>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-gray-800">OpenWeather Crop API</h3>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                </div>
                <p className="text-xs text-gray-400">API status: Active. Forecasting models syncing successfully.</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold">Test Connection</button>
                  <button className="px-3 py-1 border rounded text-xs">Edit Keys</button>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-gray-800">OpenAI Disease Recognition Engine</h3>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                </div>
                <p className="text-xs text-gray-400">Quota Limit Warning: 85% of monthly credit limit reached.</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold">Test Connection</button>
                  <button className="px-3 py-1 border rounded text-xs">Edit Keys</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Package, Users, CreditCard, TrendingUp, AlertTriangle,
  Calendar, ArrowRight, Bell, Boxes, IndianRupee, Store, Clock, Percent,
  Printer, UserPlus, Briefcase, Key, ShieldCheck, MapPin, Search, Plus,
  Edit2, Trash2, Tag, PercentCircle, Star, FileText, ShoppingBag, Landmark,
  RefreshCw, CheckCircle2, ChevronRight, Ban, Eye, User, Award, Shield,
  CloudSun, Sprout, Wind, Droplets, ThermometerSun, Leaf, Camera, FileCheck,
  Send, Mail, Phone, Lock, EyeOff, MessageSquare, Ticket, LifeBuoy, Download, Check, Truck
} from 'lucide-react'
import KPICard from '../../components/KPICard'
import DataTable from '../../components/DataTable'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'
import { useAuthStore } from '../../store/authStore'
import { useAdminStore } from '../../store/adminStore'

// Primary green theme colors matching AgroERP
const GREEN_PRIMARY = '#236625'
const GREEN_LIGHT = '#E8F5E9'
const GREEN_ACCENT = '#66BB6A'

// Mock data for demo
const salesData = [
  { day: 'Mon', sales: 12400, profit: 3200 },
  { day: 'Tue', sales: 8900, profit: 2100 },
  { day: 'Wed', sales: 15600, profit: 4800 },
  { day: 'Thu', sales: 11200, profit: 3100 },
  { day: 'Fri', sales: 18900, profit: 5400 },
  { day: 'Sat', sales: 22100, profit: 6800 },
  { day: 'Sun', sales: 9800, profit: 2900 },
]

const categoryData = [
  { name: 'Fertilizers', value: 38, color: '#2E7D32' },
  { name: 'Seeds', value: 24, color: '#66BB6A' },
  { name: 'Pesticides', value: 20, color: '#FFA726' },
  { name: 'Tools', value: 12, color: '#42A5F5' },
  { name: 'Others', value: 6, color: '#AB47BC' },
]

const recentTransactions = [
  { id: 'INV-001', customer: 'Suresh Patil', amount: 4500, type: 'Cash', time: '10:30 AM', status: 'paid' },
  { id: 'INV-002', customer: 'Ramesh Kumar', amount: 2300, type: 'Udhari', time: '11:15 AM', status: 'pending' },
  { id: 'INV-003', customer: 'Anita Deshpande', amount: 8900, type: 'UPI', time: '12:00 PM', status: 'paid' },
  { id: 'INV-004', customer: 'Vijay Shinde', amount: 1200, type: 'Cash', time: '2:30 PM', status: 'paid' },
  { id: 'INV-005', customer: 'Meena Jadhav', amount: 6700, type: 'Udhari', time: '3:45 PM', status: 'pending' },
]

const alerts = [
  { type: 'expiry', message: 'Chlorpyrifos 500ml — expires in 8 days', severity: 'red' },
  { type: 'stock', message: 'Urea 50kg — only 3 bags left', severity: 'orange' },
  { type: 'udhari', message: 'Suresh Patil — ₹4,500 due (15 days)', severity: 'orange' },
  { type: 'expiry', message: 'DAP Fertilizer — expires in 21 days', severity: 'yellow' },
]

const severityStyles = {
  red: { bg: '#fef2f2', text: '#dc2626', border: '#fee2e2', dot: '#ef4444' },
  orange: { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa', dot: '#f97316' },
  yellow: { bg: '#fefce8', text: '#854d0e', border: '#fef08a', dot: '#eab308' },
}

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const { activeCategory, activeSubItem, setActiveItem } = useAdminStore()
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  // --- 1. OVERVIEW & GLOBAL STATE DATA ---
  const [revenueVal, setRevenueVal] = useState(0)

  // --- SHOP MANAGEMENT STATE ---
  const [shopProfile, setShopProfile] = useState({
    logo: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=100&auto=format&fit=crop&q=60',
    name: 'KrishiCare Agro-Services Ltd.',
    id: 'KCS-IND-412',
    owner: 'Dilip Patil',
    type: 'Partnership Co.',
    gstin: '27AAAAA1111A1Z1',
    pan: 'ABCDE1234F',
    regNo: 'MH/PUN/89201',
    phone: '+91 98765 43210',
    email: 'ops@krishicareagro.com',
    website: 'www.krishicareagro.com',
    address: 'Shop No. 12, APMC Market, Baramati',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '413102'
  })

  const [branches, setBranches] = useState([
    { name: 'Baramati Main', code: 'BRM-01', manager: 'Dilip Patil', contact: '+91 98765 43210', status: 'Active', address: 'APMC Market Road' },
    { name: 'Pune Central', code: 'PUN-02', manager: 'Amit Shinde', contact: '+91 88776 65544', status: 'Active', address: 'Hadapsar Bypass' },
    { name: 'Phaltan Hub', code: 'PHL-03', manager: 'Sanjay Pawar', contact: '+91 77665 54433', status: 'Inactive', address: 'Shaniwar Peth Phaltan' }
  ])

  const [businessHours, setBusinessHours] = useState([
    { day: 'Monday', open: '09:00 AM', close: '07:00 PM', holiday: false },
    { day: 'Tuesday', open: '09:00 AM', close: '07:00 PM', holiday: false },
    { day: 'Wednesday', open: '09:00 AM', close: '07:00 PM', holiday: false },
    { day: 'Thursday', open: '09:00 AM', close: '07:00 PM', holiday: false },
    { day: 'Friday', open: '09:00 AM', close: '07:00 PM', holiday: false },
    { day: 'Saturday', open: '09:00 AM', close: '06:00 PM', holiday: false },
    { day: 'Sunday', open: '10:00 AM', close: '02:00 PM', holiday: true }
  ])

  const [taxRules, setTaxRules] = useState([
    { name: 'GST 18% (Standard)', rate: 18, cgst: 9, sgst: 9, igst: 18, active: true },
    { name: 'GST 12% (Fertilizers)', rate: 12, cgst: 6, sgst: 6, igst: 12, active: true },
    { name: 'GST 5% (Seeds/Raw Materials)', rate: 5, cgst: 2.5, sgst: 2.5, igst: 5, active: true },
    { name: 'Exempt (Tax Free Products)', rate: 0, cgst: 0, sgst: 0, igst: 0, active: false }
  ])

  const [printerConfig, setPrinterConfig] = useState({
    defaultPrinter: 'Thermal POS-80',
    invoicePrinter: 'Thermal POS-80',
    receiptPrinter: 'Thermal POS-58',
    labelPrinter: 'Zebra GK420t',
    paperSize: '80mm',
    printFormat: 'Standard Receipt',
    autoPrint: true
  })

  const [shopChanges, setShopChanges] = useState([
    { id: 1, activity: 'Printer config changed', user: 'Dilip Patil', time: '10 mins ago' },
    { id: 2, activity: 'GST 12% rule enabled', user: 'Dilip Patil', time: '1 hour ago' },
    { id: 3, activity: 'New Branch Added (Phaltan Hub)', user: 'Dilip Patil', time: '2 days ago' },
    { id: 4, activity: 'Business Hours Adjusted', user: 'Dilip Patil', time: '3 days ago' },
  ])

  useEffect(() => {
    // Animated counter simulation for total revenue
    let start = 380000
    const end = 458900
    const duration = 800
    const stepTime = Math.abs(Math.floor(duration / (end - start)))
    const timer = setInterval(() => {
      start += 2900
      if (start >= end) {
        setRevenueVal(end)
        clearInterval(timer)
      } else {
        setRevenueVal(start)
      }
    }, 10)
    return () => clearInterval(timer)
  }, [])

  // Quick Action Modals
  const [addCustomerModal, setAddCustomerModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  // Quick Add customer form
  const { register: customerReg, handleSubmit: customerSubmit, reset: customerReset } = useForm()
  const onAddCustomerSubmit = (data) => {
    toast.success(`Customer ${data.name} added successfully!`)
    setAddCustomerModal(false)
    customerReset()
  }
  const { register, handleSubmit, reset } = useForm()

  const onAddEmployee = (data) => {
    setEmployees(prev => [
      ...prev,
      {
        _id: Date.now().toString(),
        name: data.name,
        role: data.role,
        phone: data.phone || 'N/A',
        attendance: 0,
        salary: Number(data.salary) || 15000,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
      }
    ])
    toast.success('Employee registered successfully!')
    setActiveItem('Employee Management', 'Manage Employees')
  }

  const [employees, setEmployees] = useState([
    { _id: 'e1', name: 'Prakash More', role: 'Sales Executive', phone: '9876001234', attendance: 24, salary: 18000, status: 'active', joinDate: '2023-01-15' },
    { _id: 'e2', name: 'Seema Kulkarni', role: 'Finance Executive', phone: '9876002345', attendance: 22, salary: 25000, status: 'active', joinDate: '2023-03-01' },
    { _id: 'e3', name: 'Raju Pawar', role: 'Inventory Manager', phone: '9876003456', attendance: 25, salary: 28000, status: 'active', joinDate: '2022-06-10' },
    { _id: 'e4', name: 'Sunita Desai', role: 'Delivery Executive', phone: '9876004567', attendance: 18, salary: 14000, status: 'active', joinDate: '2023-07-20' },
  ])

  // --- PRODUCT MANAGEMENT STATES ---
  const [products, setProducts] = useState([
    { id: 'PRD-001', name: 'BT Cotton Seeds 450g', category: 'Seeds', brand: 'Mahyco', sku: 'SKU-SEED-001', description: 'High yield pest-resistant cotton seeds.', unitType: 'Packet', purchasePrice: 650, price: 740, gst: 5, stock: 45, reorderLevel: 10, expiryDate: '2026-12-31', status: 'Active', isFeatured: true, image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=150&auto=format&fit=crop&q=60' },
    { id: 'PRD-002', name: 'Urea Fertilizer 50kg', category: 'Fertilizers', brand: 'IFFCO', sku: 'SKU-FERT-002', description: 'Standard agricultural nitrogen fertilizer.', unitType: 'Bag', purchasePrice: 240, price: 290, gst: 12, stock: 3, reorderLevel: 15, expiryDate: '2027-06-30', status: 'Active', isFeatured: false, image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8edd85?w=150&auto=format&fit=crop&q=60' },
    { id: 'PRD-003', name: 'Bayer Confidor Insecticide', category: 'Pesticides', brand: 'Bayer', sku: 'SKU-PEST-003', description: 'Highly effective systemic insecticide.', unitType: 'Bottle', purchasePrice: 780, price: 890, gst: 18, stock: 24, reorderLevel: 5, expiryDate: '2026-09-10', status: 'Active', isFeatured: true, image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=150&auto=format&fit=crop&q=60' },
    { id: 'PRD-004', name: 'NPK 19:19:19 Fertilizer', category: 'Fertilizers', brand: 'Coromandel', sku: 'SKU-FERT-004', description: 'Water soluble balanced fertilizer.', unitType: 'Packet', purchasePrice: 70, price: 85, gst: 12, stock: 65, reorderLevel: 20, expiryDate: '2028-02-28', status: 'Active', isFeatured: false, image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8edd85?w=150&auto=format&fit=crop&q=60' },
    { id: 'PRD-005', name: 'Chlorpyrifos Liquid', category: 'Pesticides', brand: 'Syngenta', sku: 'SKU-PEST-005', description: 'Broad-spectrum organophosphate insecticide.', unitType: 'Bottle', purchasePrice: 280, price: 320, gst: 18, stock: 8, reorderLevel: 10, expiryDate: '2026-06-08', status: 'Active', isFeatured: false, image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=150&auto=format&fit=crop&q=60' }
  ])
  const [productCategories, setProductCategories] = useState([
    { name: 'Seeds', status: 'Active', count: 120 },
    { name: 'Fertilizers', status: 'Active', count: 85 },
    { name: 'Pesticides', status: 'Active', count: 64 },
    { name: 'Farm Equipment', status: 'Active', count: 28 },
    { name: 'Irrigation Tools', status: 'Inactive', count: 12 }
  ])

  const [productBrands, setProductBrands] = useState([
    { name: 'IFFCO', status: 'Active', logo: 'IF' },
    { name: 'Bayer', status: 'Active', logo: 'BY' },
    { name: 'Syngenta', status: 'Active', logo: 'SY' },
    { name: 'Coromandel', status: 'Active', logo: 'CR' },
    { name: 'UPL', status: 'Inactive', logo: 'UP' }
  ])

  const [productDiscounts, setProductDiscounts] = useState([
    { name: 'Monsoon Special Offer', type: 'Percentage', rate: 10, scope: 'Category (Seeds)', active: true },
    { name: 'Bulk Fertilizer Discount', type: 'Flat', rate: 50, scope: 'Product (Urea)', active: true },
    { name: 'Clearance Sale', type: 'Percentage', rate: 15, scope: 'All catalog', active: false }
  ])

  const [productReviews, setProductReviews] = useState([
    { author: 'Suresh Patil', rating: 5, comment: 'Excellent cotton seeds. Yield was very high last year.', status: 'Approved' },
    { author: 'Amit Deshmukh', rating: 4, comment: 'Fast effect on cotton pests. Highly recommended.', status: 'Approved' },
    { author: 'Seema Rao', rating: 2, comment: 'Average quality tools. Handle is a bit loose.', status: 'Hidden' }
  ])

  const [priceHistory, setPriceHistory] = useState([
    { product: 'Mahyco Cotton Seeds', date: '2026-05-10', previous: 890, current: 850, reason: 'Seasonal Adjustment' },
    { product: 'Urea Fertilizer 50kg', date: '2026-04-15', previous: 270, current: 290, reason: 'Govt rate update' }
  ])

  const [selectedProductDetails, setSelectedProductDetails] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [previewingProduct, setPreviewingProduct] = useState(null)
  
  // Product list filter states
  const [prodSearch, setProdSearch] = useState('')
  const [prodCategoryFilter, setProdCategoryFilter] = useState('All')
  const [prodBrandFilter, setProdBrandFilter] = useState('All')
  const [prodStatusFilter, setProdStatusFilter] = useState('All')
  const [prodSortBy, setProdSortBy] = useState('name')
  const [prodSortOrder, setProdSortOrder] = useState('asc')
  const [prodPage, setProdPage] = useState(1)
  const prodPerPage = 5

  // --- 2. REVENUE SUMMARY MODULE STATES ---
  const [revenueFilter, setRevenueFilter] = useState('Last 7 Days')
  const [revenueChartType, setRevenueChartType] = useState('line')
  
  const getRevenueData = () => {
    switch (revenueFilter) {
      case 'Today':
        return [
          { name: '08:00 AM', amount: 8000 },
          { name: '10:00 AM', amount: 15000 },
          { name: '12:00 PM', amount: 32000 },
          { name: '02:00 PM', amount: 18000 },
          { name: '04:00 PM', amount: 24000 },
          { name: '06:00 PM', amount: 19000 },
          { name: '08:00 PM', amount: 12000 },
        ]
      case 'Last 30 Days':
        return [
          { name: 'Week 1', amount: 85000 },
          { name: 'Week 2', amount: 120000 },
          { name: 'Week 3', amount: 145000 },
          { name: 'Week 4', amount: 108900 },
        ]
      case 'Last 12 Months':
        return [
          { name: 'Jun', amount: 320000 },
          { name: 'Jul', amount: 280000 },
          { name: 'Aug', amount: 410000 },
          { name: 'Sep', amount: 380000 },
          { name: 'Oct', amount: 450000 },
          { name: 'Nov', amount: 490000 },
          { name: 'Dec', amount: 520000 },
          { name: 'Jan', amount: 380000 },
          { name: 'Feb', amount: 420000 },
          { name: 'Mar', amount: 560000 },
          { name: 'Apr', amount: 620000 },
          { name: 'May', amount: 458900 },
        ]
      default: // Last 7 Days
        return [
          { name: 'Mon', amount: 45000 },
          { name: 'Tue', amount: 38000 },
          { name: 'Wed', amount: 62000 },
          { name: 'Thu', amount: 51000 },
          { name: 'Fri', amount: 72000 },
          { name: 'Sat', amount: 95000 },
          { name: 'Sun', amount: 40000 },
        ]
    }
  }

  // --- 3. SALES ANALYTICS MODULE STATES ---
  const topSalesProducts = [
    { name: 'Mahyco Cotton Seeds', sales: 480, revenue: 408000, percentage: 38 },
    { name: 'Urea Fertilizer 50kg', sales: 390, revenue: 113100, percentage: 24 },
    { name: 'Bayer Confidor Insecticide', sales: 220, revenue: 92400, percentage: 18 },
    { name: 'NPK 19:19:19 Fertilizer', sales: 180, revenue: 54000, percentage: 12 },
    { name: 'Falcon Garden Toolset', sales: 90, revenue: 31500, percentage: 8 },
  ]

  const salesTrendData = [
    { name: 'Mon', Seeds: 12000, Fertilizers: 18000, Pesticides: 15000 },
    { name: 'Tue', Seeds: 15000, Fertilizers: 14000, Pesticides: 9000 },
    { name: 'Wed', Seeds: 22000, Fertilizers: 24000, Pesticides: 16000 },
    { name: 'Thu', Seeds: 19000, Fertilizers: 17000, Pesticides: 15000 },
    { name: 'Fri', Seeds: 28000, Fertilizers: 29000, Pesticides: 15000 },
    { name: 'Sat', Seeds: 35000, Fertilizers: 40000, Pesticides: 20000 },
    { name: 'Sun', Seeds: 18000, Fertilizers: 15000, Pesticides: 7000 },
  ]

  // --- 4. INVENTORY SUMMARY MODULE STATES ---
  const [inventorySearch, setInventorySearch] = useState('')
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState('All')
  
  const inventoryItems = [
    { name: 'Mahyco Cotton Seeds', stock: 120, status: 'Healthy', expiry: '2027-08-15' },
    { name: 'Urea Fertilizer 50kg', stock: 3, status: 'Low Stock', expiry: '2026-12-01' },
    { name: 'Bayer Confidor Insecticide', stock: 0, status: 'Out of Stock', expiry: '2026-09-10' },
    { name: 'NPK 19:19:19 Fertilizer', stock: 65, status: 'Healthy', expiry: '2028-02-28' },
    { name: 'Falcon Garden Toolset', stock: 15, status: 'Healthy', expiry: 'N/A' },
    { name: 'Chlorpyrifos Liquid', stock: 8, status: 'Critical', expiry: '2026-06-08' },
  ]

  const filteredInventory = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(inventorySearch.toLowerCase())
    const matchesStatus = inventoryStatusFilter === 'All' || item.status === inventoryStatusFilter
    return matchesSearch && matchesStatus
  })

  // --- 5. RECENT ORDERS MODULE STATES ---
  const [ordersSearch, setOrdersSearch] = useState('')
  const [ordersStatusFilter, setOrdersStatusFilter] = useState('All')
  
  const initialOrders = [
    { id: 'ORD-9081', customer: 'Suresh Patil', count: 4, amount: 4500, status: 'Delivered', date: '2026-05-30', items: ['Urea Fertilizer (2)', 'Mahyco Seeds (2)'] },
    { id: 'ORD-9082', customer: 'Ramesh Kumar', count: 2, amount: 2300, status: 'Pending', date: '2026-05-30', items: ['Bayer Confidor (1)', 'NPK Fertilizer (1)'] },
    { id: 'ORD-9083', customer: 'Anita Deshpande', count: 5, amount: 8900, status: 'Delivered', date: '2026-05-29', items: ['NPK 19:19:19 (3)', 'Garden Toolset (2)'] },
    { id: 'ORD-9084', customer: 'Vijay Shinde', count: 1, amount: 1200, status: 'Processing', date: '2026-05-29', items: ['Chlorpyrifos (1)'] },
    { id: 'ORD-9085', customer: 'Meena Jadhav', count: 3, amount: 6700, status: 'Cancelled', date: '2026-05-28', items: ['Cotton Seeds (3)'] },
  ]

  const filteredOrders = initialOrders.filter(ord => {
    const matchesSearch = ord.customer.toLowerCase().includes(ordersSearch.toLowerCase()) || ord.id.includes(ordersSearch)
    const matchesStatus = ordersStatusFilter === 'All' || ord.status === ordersStatusFilter
    return matchesSearch && matchesStatus
  })

  // --- 6. CUSTOMER INSIGHTS MODULE STATES ---
  const customerGrowthData = [
    { name: 'Jan', count: 620 },
    { name: 'Feb', count: 650 },
    { name: 'Mar', count: 710 },
    { name: 'Apr', count: 780 },
    { name: 'May', count: 840 },
  ]

  const customerDistribution = [
    { name: 'Active (Returning)', value: 620, color: '#236625' },
    { name: 'New (This Month)', value: 165, color: '#66BB6A' },
    { name: 'Inactive', value: 55, color: '#EF5350' },
  ]

  // --- 7. NOTIFICATION CENTER & ACTIVITIES ---
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Low Stock Alert', desc: 'Urea 50kg is down to 3 bags.', time: '10m ago', read: false },
    { id: 2, title: 'Pending Delivery', desc: 'Order ORD-9082 is pending Coordinator dispatch.', time: '45m ago', read: false },
    { id: 3, title: 'Customer Feedback', desc: 'Ramesh Patil submitted a 5-star rating.', time: '2h ago', read: true },
    { id: 4, title: 'Order Cancelled', desc: 'Order ORD-9085 was cancelled by administrator.', time: '4h ago', read: true },
  ])

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    toast.success('All notifications marked as read!')
  }

  const activities = [
    { id: 1, icon: Plus, title: 'New Product Added', desc: 'Bayer Confidor Insecticide added to catalog.', time: 'Just now' },
    { id: 2, icon: ShoppingCart, title: 'New Order Received', desc: 'Order ORD-9082 created by Sales Executive Prakash More.', time: '15m ago' },
    { id: 3, icon: Boxes, title: 'Inventory Stock-In', desc: 'Restocked 100 bags of NPK 19:19:19.', time: '1h ago' },
    { id: 4, icon: UserPlus, title: 'Employee Registered', desc: 'Sunita Desai assigned to Delivery Executive role.', time: '1 day ago' },
  ]

  // --- EMPLOYEE MANAGEMENT STATE ---
  const [selectedEmpProfile, setSelectedEmpProfile] = useState(null)
  
  const [attendanceRecords, setAttendanceRecords] = useState([
    { _id: 'e1', name: 'Prakash More', status: 'Present', checkIn: '09:05 AM', checkOut: '06:15 PM', hours: 9.1 },
    { _id: 'e2', name: 'Seema Kulkarni', status: 'Present', checkIn: '08:55 AM', checkOut: '06:00 PM', hours: 9.0 },
    { _id: 'e3', name: 'Raju Pawar', status: 'Late', checkIn: '09:40 AM', checkOut: '06:30 PM', hours: 8.8 },
    { _id: 'e4', name: 'Sunita Desai', status: 'Absent', checkIn: '-', checkOut: '-', hours: 0 }
  ])

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 101, name: 'Seema Kulkarni', type: 'Sick Leave', reason: 'Fever and cold', start: '2026-06-02', end: '2026-06-04', status: 'Pending' },
    { id: 102, name: 'Sunita Desai', type: 'Casual Leave', reason: 'Family function', start: '2026-05-25', end: '2026-05-26', status: 'Approved' }
  ])

  const [payrollRecords, setPayrollRecords] = useState([
    { name: 'Prakash More', salary: 18000, bonus: 1500, deduction: 200, netPay: 19300 },
    { name: 'Seema Kulkarni', salary: 25000, bonus: 2000, deduction: 0, netPay: 27000 },
    { name: 'Raju Pawar', salary: 28000, bonus: 3000, deduction: 500, netPay: 30500 },
    { name: 'Sunita Desai', salary: 14000, bonus: 0, deduction: 1200, netPay: 12800 }
  ])

  const [performanceTracks, setPerformanceTracks] = useState([
    { name: 'Prakash More', rating: 4.5, target: '₹2.0L Sales', completedTasks: 18, productivity: 92 },
    { name: 'Seema Kulkarni', rating: 4.8, target: 'Reconcile Ledgers', completedTasks: 25, productivity: 96 },
    { name: 'Raju Pawar', rating: 4.2, target: 'Stock Verification', completedTasks: 14, productivity: 88 },
    { name: 'Sunita Desai', rating: 3.9, target: '20 Dispatches', completedTasks: 9, productivity: 75 }
  ])

  const [gpsLocations, setGpsLocations] = useState([
    { name: 'Prakash More', lat: '18.1564 N', lng: '74.5772 E', lastActive: '10 mins ago', route: 'APMC Market -> Katphal' },
    { name: 'Sunita Desai', lat: '18.1620 N', lng: '74.5810 E', lastActive: 'Just now', route: 'Indapur Road Area' }
  ])

  // --- INVENTORY MANAGEMENT STATE ---
  const [invStockItems, setInvStockItems] = useState([
    { id: 'INV-001', name: 'BT Cotton Seeds 450g', category: 'Seeds', available: 120, reserved: 15, reorderLevel: 20, unit: 'Packet', location: 'Rack A1', lastUpdated: '2026-05-29', status: 'In Stock', purchasePrice: 650, sellingPrice: 740, expiryDate: '2027-08-15', batchNo: 'BATCH-2024-C01' },
    { id: 'INV-002', name: 'Urea Fertilizer 50kg', category: 'Fertilizers', available: 3, reserved: 0, reorderLevel: 15, unit: 'Bag', location: 'Rack B2', lastUpdated: '2026-05-28', status: 'Low Stock', purchasePrice: 240, sellingPrice: 290, expiryDate: '2027-06-30', batchNo: 'BATCH-2024-F02' },
    { id: 'INV-003', name: 'Bayer Confidor Insecticide 250ml', category: 'Pesticides', available: 0, reserved: 0, reorderLevel: 10, unit: 'Bottle', location: 'Rack C3', lastUpdated: '2026-05-27', status: 'Out of Stock', purchasePrice: 780, sellingPrice: 890, expiryDate: '2026-09-10', batchNo: 'BATCH-2024-P03' },
    { id: 'INV-004', name: 'NPK 19:19:19 Fertilizer 1kg', category: 'Fertilizers', available: 65, reserved: 10, reorderLevel: 20, unit: 'Packet', location: 'Rack B1', lastUpdated: '2026-05-30', status: 'In Stock', purchasePrice: 70, sellingPrice: 85, expiryDate: '2028-02-28', batchNo: 'BATCH-2025-F04' },
    { id: 'INV-005', name: 'Chlorpyrifos Liquid 500ml', category: 'Pesticides', available: 8, reserved: 2, reorderLevel: 10, unit: 'Bottle', location: 'Rack C1', lastUpdated: '2026-05-30', status: 'Low Stock', purchasePrice: 280, sellingPrice: 320, expiryDate: '2026-06-08', batchNo: 'BATCH-2024-P05' },
    { id: 'INV-006', name: 'Hybrid Maize Seeds 5kg', category: 'Seeds', available: 44, reserved: 5, reorderLevel: 15, unit: 'Bag', location: 'Rack A2', lastUpdated: '2026-05-28', status: 'In Stock', purchasePrice: 1100, sellingPrice: 1350, expiryDate: '2027-03-15', batchNo: 'BATCH-2025-S06' },
    { id: 'INV-007', name: 'Drip Irrigation Kit 1 Acre', category: 'Irrigation Tools', available: 12, reserved: 3, reorderLevel: 5, unit: 'Set', location: 'Rack D1', lastUpdated: '2026-05-25', status: 'In Stock', purchasePrice: 4500, sellingPrice: 5200, expiryDate: 'N/A', batchNo: 'BATCH-2025-T07' },
    { id: 'INV-008', name: 'DAP Fertilizer 50kg', category: 'Fertilizers', available: 22, reserved: 8, reorderLevel: 15, unit: 'Bag', location: 'Rack B3', lastUpdated: '2026-05-29', status: 'In Stock', purchasePrice: 1300, sellingPrice: 1450, expiryDate: '2026-12-20', batchNo: 'BATCH-2024-F08' },
  ])

  const [invTransactions, setInvTransactions] = useState([
    { id: 'TXN-1001', type: 'Stock In', product: 'BT Cotton Seeds 450g', qty: 50, unit: 'Packet', date: '2026-05-30', by: 'Raju Pawar', reason: 'Regular Restock', ref: 'PO-2026-045', valueChange: 32500 },
    { id: 'TXN-1002', type: 'Stock Out', product: 'Urea Fertilizer 50kg', qty: 5, unit: 'Bag', date: '2026-05-30', by: 'Prakash More', reason: 'Customer Sale', ref: 'INV-9081', valueChange: -1450 },
    { id: 'TXN-1003', type: 'Damage Report', product: 'Bayer Confidor Insecticide 250ml', qty: 2, unit: 'Bottle', date: '2026-05-29', by: 'Raju Pawar', reason: 'Broken during transit', ref: 'DMG-001', valueChange: -1780 },
    { id: 'TXN-1004', type: 'Stock In', product: 'NPK 19:19:19 Fertilizer', qty: 100, unit: 'Packet', date: '2026-05-28', by: 'Raju Pawar', reason: 'Supplier Delivery', ref: 'PO-2026-044', valueChange: 7000 },
    { id: 'TXN-1005', type: 'Stock Adjustment', product: 'Chlorpyrifos Liquid 500ml', qty: -1, unit: 'Bottle', date: '2026-05-27', by: 'Raju Pawar', reason: 'Physical Count Mismatch', ref: 'ADJ-2026-012', valueChange: -280 },
    { id: 'TXN-1006', type: 'Stock Out', product: 'Hybrid Maize Seeds 5kg', qty: 8, unit: 'Bag', date: '2026-05-26', by: 'Prakash More', reason: 'Customer Sale', ref: 'INV-9078', valueChange: -10800 },
    { id: 'TXN-1007', type: 'Transfer', product: 'DAP Fertilizer 50kg', qty: 10, unit: 'Bag', date: '2026-05-25', by: 'Dilip Patil', reason: 'Branch Transfer - Pune Central', ref: 'TRF-2026-003', valueChange: 0 },
  ])

  const [damageReports, setDamageReports] = useState([
    { id: 'DMG-001', product: 'Bayer Confidor 250ml', qty: 2, value: 1780, date: '2026-05-29', reportedBy: 'Raju Pawar', cause: 'Transit Breakage', status: 'Verified', action: 'Write-off' },
    { id: 'DMG-002', product: 'Urea Fertilizer 50kg', qty: 1, value: 240, date: '2026-05-15', reportedBy: 'Raju Pawar', cause: 'Water Damaged Bag', status: 'Pending Review', action: 'Under Investigation' },
    { id: 'DMG-003', product: 'NPK Fertilizer 1kg', qty: 5, value: 350, date: '2026-05-10', reportedBy: 'Seema Kulkarni', cause: 'Packaging Defect', status: 'Verified', action: 'Supplier Claim Filed' },
  ])

  const [invSearch, setInvSearch] = useState('')
  const [invCatFilter, setInvCatFilter] = useState('All')
  const [invStatusFilter2, setInvStatusFilter2] = useState('All')
  const [invSortBy, setInvSortBy] = useState('name')
  const [showStockInModal, setShowStockInModal] = useState(false)
  const [showStockOutModal, setShowStockOutModal] = useState(false)
  const [showDamageModal, setShowDamageModal] = useState(false)
  const [selectedInvItem, setSelectedInvItem] = useState(null)
  const [barcodeItem, setBarcodeItem] = useState(null)
  const [txnTypeFilter, setTxnTypeFilter] = useState('All')
  const [txnSearch, setTxnSearch] = useState('')

  const stockMovementData = [
    { name: 'Mon', stockIn: 120, stockOut: 85, damage: 2 },
    { name: 'Tue', stockIn: 60, stockOut: 95, damage: 0 },
    { name: 'Wed', stockIn: 200, stockOut: 140, damage: 3 },
    { name: 'Thu', stockIn: 80, stockOut: 110, damage: 1 },
    { name: 'Fri', stockIn: 150, stockOut: 180, damage: 0 },
    { name: 'Sat', stockIn: 90, stockOut: 220, damage: 2 },
    { name: 'Sun', stockIn: 40, stockOut: 60, damage: 0 },
  ]

  const invCategoryData = [
    { name: 'Seeds', value: 164, color: '#2E7D32' },
    { name: 'Fertilizers', value: 90, color: '#66BB6A' },
    { name: 'Pesticides', value: 8, color: '#FFA726' },
    { name: 'Irrigation', value: 12, color: '#42A5F5' },
  ]

  const invValueTrend = [
    { name: 'Jan', value: 280000 },
    { name: 'Feb', value: 320000 },
    { name: 'Mar', value: 410000 },
    { name: 'Apr', value: 360000 },
    { name: 'May', value: 445000 },
  ]

  const expiringItems = [
    { name: 'Chlorpyrifos Liquid 500ml', batch: 'BATCH-2024-P05', expiry: '2026-06-08', daysLeft: 9, qty: 8, status: 'Critical' },
    { name: 'Bayer Confidor Insecticide', batch: 'BATCH-2024-P03', expiry: '2026-09-10', daysLeft: 103, qty: 0, status: 'Expired-Out' },
    { name: 'DAP Fertilizer 50kg', batch: 'BATCH-2024-F08', expiry: '2026-12-20', daysLeft: 204, qty: 22, status: 'Expiring Soon' },
    { name: 'Urea Fertilizer 50kg', batch: 'BATCH-2024-F02', expiry: '2027-06-30', daysLeft: 396, qty: 3, status: 'OK' },
  ]

  const lowStockAlerts = invStockItems.filter(i => i.available <= i.reorderLevel)

  const filteredInvItems = invStockItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(invSearch.toLowerCase()) || item.id.toLowerCase().includes(invSearch.toLowerCase())
    const matchCat = invCatFilter === 'All' || item.category === invCatFilter
    const matchStatus = invStatusFilter2 === 'All' || item.status === invStatusFilter2
    return matchSearch && matchCat && matchStatus
  })

  const filteredTxns = invTransactions.filter(t => {
    const matchSearch = t.product.toLowerCase().includes(txnSearch.toLowerCase()) || t.ref.toLowerCase().includes(txnSearch.toLowerCase())
    const matchType = txnTypeFilter === 'All' || t.type === txnTypeFilter
    return matchSearch && matchType
  })

  // --- PURCHASE MANAGEMENT STATE ---
  const [suppliers, setSuppliers] = useState([
    { id: 'SUP-001', name: 'Krishak Agro Supplies Pvt. Ltd.', contact: 'Rajesh Verma', phone: '9876543210', email: 'rajesh@krishakagro.com', gst: '27AAAAA1234A1Z1', address: 'APMC Market, Pune', categories: 'Seeds, Fertilizers', paymentTerms: 'Net 30', status: 'Active', totalPurchases: 485000, rating: 4.8 },
    { id: 'SUP-002', name: 'Maharashtra Fertilizer Corp.', contact: 'Sunil Patil', phone: '9765432109', email: 'sunil@mfcorp.com', gst: '27BBBBB2345B2Z2', address: 'Hadapsar Bypass, Pune', categories: 'Fertilizers', paymentTerms: 'Net 15', status: 'Active', totalPurchases: 320000, rating: 4.5 },
    { id: 'SUP-003', name: 'Syngenta India Ltd.', contact: 'Anita Sharma', phone: '9654321098', email: 'anita@syngenta.com', gst: '27CCCCC3456C3Z3', address: 'Baner, Pune', categories: 'Pesticides, Seeds', paymentTerms: 'Net 45', status: 'Active', totalPurchases: 270000, rating: 4.9 },
    { id: 'SUP-004', name: 'IFFCO Trading Division', contact: 'Mohan Lal', phone: '9543210987', email: 'mohan@iffco.coop', gst: '27DDDDD4567D4Z4', address: 'Nashik Road, Nashik', categories: 'Fertilizers', paymentTerms: 'Advance', status: 'Active', totalPurchases: 560000, rating: 4.7 },
    { id: 'SUP-005', name: 'Bayer CropScience Ltd.', contact: 'Priya Mehta', phone: '9432109876', email: 'priya@bayer.com', gst: '27EEEEE5678E5Z5', address: 'Wakad, Pune', categories: 'Pesticides', paymentTerms: 'Net 30', status: 'Active', totalPurchases: 195000, rating: 4.6 },
    { id: 'SUP-006', name: 'Green Valley Tools Co.', contact: 'Deepak Waghmare', phone: '9321098765', email: 'deepak@gvtools.com', gst: '27FFFFF6789F6Z6', address: 'Solapur, Maharashtra', categories: 'Farm Equipment, Irrigation', paymentTerms: 'Net 60', status: 'Inactive', totalPurchases: 88000, rating: 3.9 },
    { id: 'SUP-007', name: 'Coromandel International', contact: 'Kavita Nair', phone: '9210987654', email: 'kavita@coromandel.com', gst: '27GGGGG7890G7Z7', address: 'Kolhapur, Maharashtra', categories: 'Fertilizers, Pesticides', paymentTerms: 'Net 30', status: 'Active', totalPurchases: 245000, rating: 4.4 },
    { id: 'SUP-008', name: 'UPL Limited', contact: 'Sachin Deshmukh', phone: '9109876543', email: 'sachin@uplonline.com', gst: '27HHHHH8901H8Z8', address: 'Satara, Maharashtra', categories: 'Pesticides, Seeds', paymentTerms: 'Net 15', status: 'Active', totalPurchases: 168000, rating: 4.3 },
  ])

  const [purchaseOrders, setPurchaseOrders] = useState([
    { id: 'PO-2026-001', supplier: 'IFFCO Trading Division', supId: 'SUP-004', items: 'Urea 50kg (100 bags), DAP 50kg (50 bags)', totalAmount: 89000, date: '2026-05-28', expectedDelivery: '2026-06-05', status: 'Approved', remarks: 'Urgent order for monsoon season' },
    { id: 'PO-2026-002', supplier: 'Syngenta India Ltd.', supId: 'SUP-003', items: 'BT Cotton Seeds (200 packs), Chlorpyrifos 500ml (50)', totalAmount: 144000, date: '2026-05-25', expectedDelivery: '2026-06-02', status: 'Received', remarks: 'Received in good condition' },
    { id: 'PO-2026-003', supplier: 'Bayer CropScience Ltd.', supId: 'SUP-005', items: 'Confidor Insecticide 250ml (80 bottles)', totalAmount: 62400, date: '2026-05-20', expectedDelivery: '2026-06-01', status: 'Pending', remarks: 'Awaiting supplier confirmation' },
    { id: 'PO-2026-004', supplier: 'Maharashtra Fertilizer Corp.', supId: 'SUP-002', items: 'NPK 19:19:19 (500 packs)', totalAmount: 35000, date: '2026-05-15', expectedDelivery: '2026-05-25', status: 'Received', remarks: '' },
    { id: 'PO-2026-005', supplier: 'UPL Limited', supId: 'SUP-008', items: 'Hybrid Maize Seeds 5kg (60 bags)', totalAmount: 66000, date: '2026-05-10', expectedDelivery: '2026-05-20', status: 'Cancelled', remarks: 'Supplier out of stock' },
    { id: 'PO-2026-006', supplier: 'Krishak Agro Supplies Pvt. Ltd.', supId: 'SUP-001', items: 'BT Cotton Seeds (100), Urea 50kg (50 bags)', totalAmount: 77000, date: '2026-05-30', expectedDelivery: '2026-06-10', status: 'Draft', remarks: 'Review before sending' },
  ])

  const [purchaseReturns, setPurchaseReturns] = useState([
    { id: 'RET-001', supplier: 'Bayer CropScience Ltd.', product: 'Confidor Insecticide 250ml', qty: 5, reason: 'Damaged packaging on arrival', date: '2026-05-22', value: 3900, status: 'Approved', poRef: 'PO-2026-003' },
    { id: 'RET-002', supplier: 'IFFCO Trading Division', product: 'Urea 50kg', qty: 3, reason: 'Wrong product delivered - grade mismatch', date: '2026-05-18', value: 720, status: 'Completed', poRef: 'PO-2026-001' },
    { id: 'RET-003', supplier: 'UPL Limited', product: 'Hybrid Maize Seeds 5kg', qty: 10, reason: 'Order cancelled - excess stock', date: '2026-05-12', value: 11000, status: 'Pending', poRef: 'PO-2026-005' },
    { id: 'RET-004', supplier: 'Syngenta India Ltd.', product: 'Chlorpyrifos 500ml', qty: 2, reason: 'Near expiry products received', date: '2026-05-08', value: 560, status: 'Completed', poRef: 'PO-2026-002' },
  ])

  const [supplierPayments, setSupplierPayments] = useState([
    { id: 'PAY-001', supplier: 'IFFCO Trading Division', invoice: 'INV-IFFCO-2026-045', amount: 89000, dueDate: '2026-06-28', paidDate: null, mode: 'NEFT', status: 'Pending', poRef: 'PO-2026-001' },
    { id: 'PAY-002', supplier: 'Syngenta India Ltd.', invoice: 'INV-SYN-2026-112', amount: 144000, dueDate: '2026-07-09', paidDate: '2026-05-27', mode: 'RTGS', status: 'Paid', poRef: 'PO-2026-002' },
    { id: 'PAY-003', supplier: 'Bayer CropScience Ltd.', invoice: 'INV-BAYER-2026-078', amount: 58500, dueDate: '2026-06-19', paidDate: null, mode: 'Cheque', status: 'Overdue', poRef: 'PO-2026-003' },
    { id: 'PAY-004', supplier: 'Maharashtra Fertilizer Corp.', invoice: 'INV-MFC-2026-033', amount: 35000, dueDate: '2026-05-30', paidDate: '2026-05-28', mode: 'NEFT', status: 'Paid', poRef: 'PO-2026-004' },
    { id: 'PAY-005', supplier: 'UPL Limited', invoice: 'INV-UPL-2026-021', amount: 55000, dueDate: '2026-05-25', paidDate: null, mode: 'NEFT', status: 'Cancelled', poRef: 'PO-2026-005' },
    { id: 'PAY-006', supplier: 'Krishak Agro Supplies Pvt. Ltd.', invoice: 'INV-KAS-2026-067', amount: 77000, dueDate: '2026-06-30', paidDate: null, mode: 'RTGS', status: 'Pending', poRef: 'PO-2026-006' },
  ])

  const [supSearch, setSupSearch] = useState('')
  const [supStatusFilter, setSupStatusFilter] = useState('All')
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [poSearch, setPoSearch] = useState('')
  const [poStatusFilter, setPoStatusFilter] = useState('All')
  const [selectedPO, setSelectedPO] = useState(null)
  const [showCreatePOModal, setShowCreatePOModal] = useState(false)
  const [showGRNModal, setShowGRNModal] = useState(null)
  const [phSearch, setPhSearch] = useState('')
  const [phSupFilter, setPhSupFilter] = useState('All')
  const [phStatusFilter, setPhStatusFilter] = useState('All')
  const [retSearch, setRetSearch] = useState('')
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [paySearch, setPaySearch] = useState('')
  const [payStatusFilter, setPayStatusFilter] = useState('All')
  const [showPaymentModal, setShowPaymentModal] = useState(null)

  const purchaseTrendData = [
    { name: 'Jan', amount: 180000 },
    { name: 'Feb', amount: 220000 },
    { name: 'Mar', amount: 310000 },
    { name: 'Apr', amount: 275000 },
    { name: 'May', amount: 397400 },
  ]

  const purchaseCatData = [
    { name: 'Fertilizers', value: 124000, color: '#2E7D32' },
    { name: 'Seeds', value: 195000, color: '#66BB6A' },
    { name: 'Pesticides', value: 76400, color: '#FFA726' },
    { name: 'Equipment', value: 88000, color: '#42A5F5' },
  ]

  const supplierPerfData = [
    { name: 'IFFCO', onTime: 95, quality: 92 },
    { name: 'Syngenta', onTime: 88, quality: 96 },
    { name: 'Bayer', onTime: 72, quality: 89 },
    { name: 'MFC', onTime: 94, quality: 91 },
    { name: 'UPL', onTime: 65, quality: 85 },
  ]

  // --- ORDER MANAGEMENT STATE & DUMMY DATA ---
  const [orders, setOrders] = useState([
    { id: 'ORD-9081', customer: 'Suresh Patil', phone: '9876001234', address: 'Plot 45, APMC Market, Baramati', date: '2026-05-30', amount: 4500, payStatus: 'Paid', payType: 'Cash', status: 'Delivered', dateDelivered: '2026-05-30', items: [{ name: 'Urea Fertilizer 50kg', qty: 2, price: 290 }, { name: 'BT Cotton Seeds 450g', qty: 5, price: 740 }], trackingStep: 6 },
    { id: 'ORD-9082', customer: 'Ramesh Kumar', phone: '9876002345', address: 'Village Morgaon, Pune district', date: '2026-05-30', amount: 2300, payStatus: 'Pending', payType: 'Udhari', status: 'Pending', items: [{ name: 'Bayer Confidor Insecticide', qty: 1, price: 890 }, { name: 'NPK 19:19:19 Fertilizer', qty: 16, price: 85 }], trackingStep: 1 },
    { id: 'ORD-9083', customer: 'Anita Deshpande', phone: '9876003456', address: 'Bhigwan Road, Baramati', date: '2026-05-29', amount: 8900, payStatus: 'Paid', payType: 'UPI', status: 'Delivered', dateDelivered: '2026-05-29', items: [{ name: 'NPK 19:19:19 Fertilizer', qty: 50, price: 85 }, { name: 'Drip Irrigation Kit 1 Acre', qty: 1, price: 4650 }], trackingStep: 6 },
    { id: 'ORD-9084', customer: 'Vijay Shinde', phone: '9876004567', address: 'Sharda Nagar, Baramati', date: '2026-05-29', amount: 1200, payStatus: 'Paid', payType: 'Debit Card', status: 'Processing', trackingStep: 3, items: [{ name: 'Chlorpyrifos Liquid', qty: 3, price: 320 }, { name: 'NPK 19:19:19 Fertilizer', qty: 2, price: 85 }] },
    { id: 'ORD-9085', customer: 'Meena Jadhav', phone: '9876005678', address: 'Indapur Road, Baramati', date: '2026-05-28', amount: 6700, payStatus: 'Refunded', payType: 'UPI', status: 'Cancelled', cancelReason: 'Customer requested cancellation', items: [{ name: 'BT Cotton Seeds 450g', qty: 9, price: 745 }] },
    { id: 'ORD-9086', customer: 'Pandurang Hegde', phone: '9123456789', address: 'Phaltan Rural Area', date: '2026-05-27', amount: 3500, payStatus: 'Paid', payType: 'Net Banking', status: 'Processing', trackingStep: 2, items: [{ name: 'Urea Fertilizer 50kg', qty: 10, price: 290 }, { name: 'NPK 19:19:19 Fertilizer', qty: 7, price: 85 }] },
    { id: 'ORD-9087', customer: 'Sanjay Pawar', phone: '9234567890', address: 'Katphal Shivar, Baramati', date: '2026-05-26', amount: 9800, payStatus: 'Pending', payType: 'Credit Card', status: 'New', trackingStep: 1, items: [{ name: 'Drip Irrigation Kit 1 Acre', qty: 2, price: 4900 }] },
    { id: 'ORD-9088', customer: 'Sunil Deshmukh', phone: '9345678901', address: 'APMC Market Area', date: '2026-05-25', amount: 5400, payStatus: 'Failed', payType: 'UPI', status: 'Cancelled', cancelReason: 'Payment failed at gateway', items: [{ name: 'Bayer Confidor Insecticide', qty: 6, price: 900 }] },
    { id: 'ORD-9089', customer: 'Balasaheb Vikhe', phone: '9456789012', address: 'Loni Village, Ahmednagar', date: '2026-05-24', amount: 15400, payStatus: 'Paid', payType: 'UPI', status: 'Delivered', dateDelivered: '2026-05-24', items: [{ name: 'BT Cotton Seeds 450g', qty: 20, price: 740 }, { name: 'Urea Fertilizer 50kg', qty: 2, price: 300 }] },
  ])

  const [orderReturns, setOrderReturns] = useState([
    { id: 'RET-201', ordId: 'ORD-9081', customer: 'Suresh Patil', product: 'BT Cotton Seeds 450g (1 packet)', reason: 'Damaged packing / torn seed bag', status: 'Pending', date: '2026-05-30', refundAmount: 740 },
    { id: 'RET-202', ordId: 'ORD-9083', customer: 'Anita Deshpande', product: 'NPK 19:19:19 Fertilizer (5 packs)', reason: 'Incorrect product version sent', status: 'Approved', date: '2026-05-29', refundAmount: 425 },
    { id: 'RET-203', ordId: 'ORD-9085', customer: 'Meena Jadhav', product: 'BT Cotton Seeds 450g (9 packets)', reason: 'Order Cancelled - Full Refund', status: 'Refunded', date: '2026-05-28', refundAmount: 6700 },
    { id: 'RET-204', ordId: 'ORD-9089', customer: 'Balasaheb Vikhe', product: 'Urea Fertilizer 50kg (1 bag)', reason: 'Product package wet / water leakage', status: 'Rejected', date: '2026-05-25', refundAmount: 300 }
  ])

  const [invoices, setInvoices] = useState([
    { invoiceNo: 'INV-2026-091', ordId: 'ORD-9081', customer: 'Suresh Patil', amount: 4500, date: '2026-05-30' },
    { invoiceNo: 'INV-2026-092', ordId: 'ORD-9082', customer: 'Ramesh Kumar', amount: 2300, date: '2026-05-30' },
    { invoiceNo: 'INV-2026-093', ordId: 'ORD-9083', customer: 'Anita Deshpande', amount: 8900, date: '2026-05-29' },
    { invoiceNo: 'INV-2026-094', ordId: 'ORD-9084', customer: 'Vijay Shinde', amount: 1200, date: '2026-05-29' },
    { invoiceNo: 'INV-2026-096', ordId: 'ORD-9086', customer: 'Pandurang Hegde', amount: 3500, date: '2026-05-27' },
    { invoiceNo: 'INV-2026-097', ordId: 'ORD-9087', customer: 'Sanjay Pawar', amount: 9800, date: '2026-05-26' },
    { invoiceNo: 'INV-2026-099', ordId: 'ORD-9089', customer: 'Balasaheb Vikhe', amount: 15400, date: '2026-05-24' }
  ])

  // Order filters and selected item states
  const [ordSearch, setOrdSearch] = useState('')
  const [ordStatusFilter, setOrdStatusFilter] = useState('All')
  const [ordPaymentFilter, setOrdPaymentFilter] = useState('All')
  const [selectedOrdDetails, setSelectedOrdDetails] = useState(null)
  
  // Return request states
  const [retSearchOrd, setRetSearchOrd] = useState('')
  const [retStatusFilter, setRetStatusFilter] = useState('All')

  // Invoice states
  const [invSearchOrd, setInvSearchOrd] = useState('')

  // Chart data for Orders
  const orderTrendData = [
    { name: 'Mon', orders: 12, revenue: 15400 },
    { name: 'Tue', orders: 18, revenue: 22100 },
    { name: 'Wed', orders: 15, revenue: 19800 },
    { name: 'Thu', orders: 24, revenue: 31200 },
    { name: 'Fri', orders: 22, revenue: 28900 },
    { name: 'Sat', orders: 30, revenue: 41500 },
    { name: 'Sun', orders: 14, revenue: 18600 }
  ]

  const orderStatusData = [
    { name: 'New', value: 3, color: '#42A5F5' },
    { name: 'Processing', value: 5, color: '#FFA726' },
    { name: 'Delivered', value: 12, color: '#66BB6A' },
    { name: 'Cancelled', value: 2, color: '#EF5350' }
  ]

  const dailyOrderData = [
    { hour: '08 AM', count: 4 },
    { hour: '10 AM', count: 12 },
    { hour: '12 PM', count: 18 },
    { hour: '02 PM', count: 8 },
    { hour: '04 PM', count: 15 },
    { hour: '06 PM', count: 22 },
    { hour: '08 PM', count: 6 }
  ]

  const monthlyOrderData = [
    { month: 'Jan', count: 320, revenue: 280000 },
    { month: 'Feb', count: 280, revenue: 240000 },
    { month: 'Mar', count: 410, revenue: 360000 },
    { month: 'Apr', count: 390, revenue: 320000 },
    { month: 'May', count: 490, revenue: 450000 }
  ]

  // --- CUSTOMER MANAGEMENT MODULE STATE & DATA ---
  const [customers, setCustomers] = useState([
    {
      id: 'CUST-001',
      name: 'Suresh Patil',
      mobile: '9876001234',
      email: 'suresh.patil@farmmail.com',
      gender: 'Male',
      address: 'Plot 45, APMC Market',
      village: 'Baramati',
      taluka: 'Baramati',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '413102',
      custType: 'Farmer',
      totalOrders: 14,
      totalSpending: 68400,
      status: 'Active',
      loyaltyPoints: 320,
      creditLimit: 15000,
      creditBalance: 4500,
      creditDueDate: '2026-06-15',
      // Farmer profile info:
      farmName: 'Patil Organic Farms',
      landArea: '5 Acres',
      cropType: 'Cotton, Sugarcane',
      irrigation: 'Drip Irrigation',
      soilType: 'Black Clayey Soil',
      farmingExp: '12 Years'
    },
    {
      id: 'CUST-002',
      name: 'Ramesh Kumar',
      mobile: '9876002345',
      email: 'ramesh.k@gmail.com',
      gender: 'Male',
      address: 'Village Morgaon',
      village: 'Morgaon',
      taluka: 'Baramati',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '412304',
      custType: 'Farmer',
      totalOrders: 6,
      totalSpending: 24500,
      status: 'Active',
      loyaltyPoints: 110,
      creditLimit: 10000,
      creditBalance: 2300,
      creditDueDate: '2026-06-12',
      farmName: 'Ramesh Agri land',
      landArea: '3 Acres',
      cropType: 'Wheat, Jowar',
      irrigation: 'Well Irrigation',
      soilType: 'Red Sandy Soil',
      farmingExp: '8 Years'
    },
    {
      id: 'CUST-003',
      name: 'Anita Deshpande',
      mobile: '9876003456',
      email: 'anita.desh@yahoo.com',
      gender: 'Female',
      address: 'Bhigwan Road',
      village: 'Baramati',
      taluka: 'Baramati',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '413102',
      custType: 'Retail Customer',
      totalOrders: 21,
      totalSpending: 124000,
      status: 'Active',
      loyaltyPoints: 680,
      creditLimit: 30000,
      creditBalance: 0,
      creditDueDate: '',
      farmName: 'Deshpande Nursery',
      landArea: '1 Acre',
      cropType: 'Flowers, Vegetables',
      irrigation: 'Sprinkler',
      soilType: 'Loamy Soil',
      farmingExp: '15 Years'
    },
    {
      id: 'CUST-004',
      name: 'Vijay Shinde',
      mobile: '9876004567',
      email: 'vijay.shinde@rediffmail.com',
      gender: 'Male',
      address: 'Sharda Nagar',
      village: 'Baramati',
      taluka: 'Baramati',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '413102',
      custType: 'Wholesale Customer',
      totalOrders: 32,
      totalSpending: 412000,
      status: 'Active',
      loyaltyPoints: 1840,
      creditLimit: 100000,
      creditBalance: 12000,
      creditDueDate: '2026-06-25',
      farmName: 'Shinde Agro Enterprises',
      landArea: '10 Acres',
      cropType: 'Sugarcane, Grapes',
      irrigation: 'Canal Lift',
      soilType: 'Deep Black Soil',
      farmingExp: '20 Years'
    },
    {
      id: 'CUST-005',
      name: 'Meena Jadhav',
      mobile: '9876005678',
      email: 'meena.j@outlook.com',
      gender: 'Female',
      address: 'Indapur Road',
      village: 'Baramati',
      taluka: 'Baramati',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '413102',
      custType: 'Farmer',
      totalOrders: 3,
      totalSpending: 18700,
      status: 'Suspended',
      loyaltyPoints: 80,
      creditLimit: 5000,
      creditBalance: 0,
      creditDueDate: '',
      farmName: 'Jadhav Organic Green',
      landArea: '2 Acres',
      cropType: 'Pomegranate',
      irrigation: 'Drip Irrigation',
      soilType: 'Silt Soil',
      farmingExp: '5 Years'
    }
  ])

  // Customer sub-module control states
  const [custSearch, setCustSearch] = useState('')
  const [custStatusFilter, setCustStatusFilter] = useState('All')
  const [custLocationFilter, setCustLocationFilter] = useState('All')
  const [custTypeFilter, setCustTypeFilter] = useState('All')
  
  const [selectedCustProfile, setSelectedCustProfile] = useState(null)
  const [editingCust, setEditingCust] = useState(null)
  const [showAddCustModal, setShowAddCustModal] = useState(false)
  const [profileActiveTab, setProfileActiveTab] = useState('Overview')

  // Farmer / Loyalty states
  const [selectedFarmerDetail, setSelectedFarmerDetail] = useState(null)

  // Credit Account modal states
  const [showAddCreditModal, setShowAddCreditModal] = useState(null)
  const [showCollectPaymentModal, setShowCollectPaymentModal] = useState(null)

  // Customer Feedback state
  const [feedbacks, setFeedbacks] = useState([
    { id: 'FB-001', name: 'Suresh Patil', rating: 5, comment: 'Best quality cotton seeds. High germination rate.', date: '2026-05-30', resolved: true, reply: 'Thank you Suresh for your great feedback!' },
    { id: 'FB-002', name: 'Ramesh Kumar', rating: 4, comment: 'Staff was very helpful, but urea stock was a bit low.', date: '2026-05-29', resolved: false, reply: '' },
    { id: 'FB-003', name: 'Anita Deshpande', rating: 5, comment: 'Quick delivery of drip kit. Excellent service.', date: '2026-05-28', resolved: true, reply: 'Glad to assist you, Anita!' },
    { id: 'FB-004', name: 'Vijay Shinde', rating: 3, comment: 'Prices are slightly higher than general APMC market.', date: '2026-05-26', resolved: false, reply: '' }
  ])

  // Loyalty history
  const loyaltyHistory = [
    { customer: 'Suresh Patil', points: 50, action: 'Earned (ORD-9081)', date: '2026-05-30' },
    { customer: 'Anita Deshpande', points: 100, action: 'Redeemed Discount', date: '2026-05-29' },
    { customer: 'Vijay Shinde', points: 250, action: 'Earned (Bulk Purchase)', date: '2026-05-28' },
    { customer: 'Ramesh Kumar', points: 20, action: 'Earned (ORD-9082)', date: '2026-05-26' }
  ]

  // Customer trend charts data
  const customerGrowthTrend = [
    { month: 'Jan', newCustomers: 12, returningCustomers: 85 },
    { month: 'Feb', newCustomers: 18, returningCustomers: 92 },
    { month: 'Mar', newCustomers: 24, returningCustomers: 110 },
    { month: 'Apr', newCustomers: 28, returningCustomers: 145 },
    { month: 'May', newCustomers: 35, returningCustomers: 184 }
  ]

  const customerDistributionData = [
    { name: 'Farmers', value: 65, color: '#2E7D32' },
    { name: 'Retail Customers', value: 20, color: '#66BB6A' },
    { name: 'Wholesalers', value: 15, color: '#FFA726' }
  ]

  // --- BILLING & POS MODULE STATE & DUMMY DATA ---
  const [posBills, setPosBills] = useState([
    { invoiceNo: 'BILL-1001', customerName: 'Suresh Patil', phone: '9876001234', amount: 4500, payMethod: 'Cash', date: '2026-05-30', status: 'Paid', tax: 450, discount: 0, items: [{ name: 'Urea Fertilizer 50kg', qty: 2, price: 290 }, { name: 'BT Cotton Seeds 450g', qty: 5, price: 740 }] },
    { invoiceNo: 'BILL-1002', customerName: 'Ramesh Kumar', phone: '9876002345', amount: 2300, payMethod: 'Udhari', date: '2026-05-30', status: 'Pending', tax: 210, discount: 50, items: [{ name: 'Bayer Confidor Insecticide', qty: 1, price: 890 }, { name: 'NPK 19:19:19 Fertilizer', qty: 16, price: 85 }] },
    { invoiceNo: 'BILL-1003', customerName: 'Anita Deshpande', phone: '9876003456', amount: 8900, payMethod: 'UPI', date: '2026-05-29', status: 'Paid', tax: 890, discount: 100, items: [{ name: 'NPK 19:19:19 Fertilizer', qty: 50, price: 85 }, { name: 'Drip Irrigation Kit 1 Acre', qty: 1, price: 4650 }] },
    { invoiceNo: 'BILL-1004', customerName: 'Vijay Shinde', phone: '9876004567', amount: 12000, payMethod: 'UPI', date: '2026-05-28', status: 'Paid', tax: 1200, discount: 300, items: [{ name: 'Chlorpyrifos Liquid', qty: 10, price: 320 }, { name: 'Drip Irrigation Kit 1 Acre', qty: 2, price: 4400 }] }
  ])

  // POS billing interface states
  const [posCart, setPosCart] = useState([])
  const [posSearchQuery, setPosSearchQuery] = useState('')
  const [posCatFilter, setPosCatFilter] = useState('All')
  const [selectedPosCust, setSelectedPosCust] = useState(null)
  const [posDiscount, setPosDiscount] = useState(0)
  const [couponCode, setCouponCode] = useState('')
  const [changeCalculation, setChangeCalculation] = useState({ received: 0, change: 0 })
  const [paymentMode, setPaymentMode] = useState('Cash')
  const [isInvoiceOpenModal, setIsInvoiceOpenModal] = useState(null)

  // Bill history filters
  const [billSearch, setBillSearch] = useState('')
  const [billPaymentMethodFilter, setBillPaymentMethodFilter] = useState('All')

  // Daily cash report parameters
  const [dailyCash, setDailyCash] = useState({
    opening: 5000,
    sales: 27700,
    collected: 25400,
    expenses: 1200,
    closing: 29200
  })

  // Refunds / Returns states
  const [refundInvoiceNo, setRefundInvoiceNo] = useState('')
  const [refundReason, setRefundReason] = useState('Damaged Product')
  const [refundAmt, setRefundAmt] = useState(0)

  // Analytical metrics for POS
  const posSalesByHour = [
    { hour: '09 AM', amount: 1200 },
    { hour: '11 AM', amount: 4500 },
    { hour: '01 PM', amount: 8900 },
    { hour: '03 PM', amount: 3200 },
    { hour: '05 PM', amount: 7400 },
    { hour: '07 PM', amount: 2500 }
  ]

  const paymentDistributionData = [
    { name: 'Cash', value: 45, color: '#236625' },
    { name: 'UPI', value: 35, color: '#66BB6A' },
    { name: 'Card', value: 12, color: '#FFA726' },
    { name: 'Credit (Udhari)', value: 8, color: '#EF5350' }
  ]

  // --- DELIVERY MANAGEMENT MODULE STATE & DUMMY DATA ---
  const [deliveries, setDeliveries] = useState([
    { orderId: 'ORD-9081', customer: 'Suresh Patil', address: 'Plot 45, APMC Market, Baramati', executive: 'Sunita Desai', status: 'Delivered', expectedDate: '2026-05-30', actualTime: '04:30 PM', codeRequired: '4821', codeVerified: true, payStatus: 'Paid', amount: 4500 },
    { orderId: 'ORD-9082', customer: 'Ramesh Kumar', address: 'Village Morgaon, Pune district', executive: 'Sunita Desai', status: 'In Transit', expectedDate: '2026-05-31', codeRequired: '9012', codeVerified: false, payStatus: 'Pending', amount: 2300, eta: '2 Hours' },
    { orderId: 'ORD-9083', customer: 'Anita Deshpande', address: 'Bhigwan Road, Baramati', executive: 'Amit Shinde', status: 'Delivered', expectedDate: '2026-05-29', actualTime: '02:15 PM', codeRequired: '7761', codeVerified: true, payStatus: 'Paid', amount: 8900 },
    { orderId: 'ORD-9084', customer: 'Vijay Shinde', address: 'Sharda Nagar, Baramati', executive: 'Sunita Desai', status: 'Pending', expectedDate: '2026-05-30', codeRequired: '1102', codeVerified: false, payStatus: 'Paid', amount: 1200 },
    { orderId: 'ORD-9086', customer: 'Pandurang Hegde', address: 'Phaltan Rural Area', executive: 'Amit Shinde', status: 'Failed', expectedDate: '2026-05-28', codeRequired: '6651', codeVerified: false, payStatus: 'Pending', amount: 3500, failReason: 'Customer Unavailable' }
  ])

  const [deliveryExecutives, setDeliveryExecutives] = useState([
    { empId: 'DEL-EXE-01', name: 'Sunita Desai', mobile: '9876004567', assigned: 3, completed: 24, status: 'Busy' },
    { empId: 'DEL-EXE-02', name: 'Amit Shinde', mobile: '9876005544', assigned: 2, completed: 18, status: 'Available' },
    { empId: 'DEL-EXE-03', name: 'Sanjay Pawar', mobile: '9876007766', assigned: 0, completed: 32, status: 'Offline' }
  ])

  const [deliveryComplaints, setDeliveryComplaints] = useState([
    { compId: 'COMP-701', customer: 'Ramesh Kumar', orderId: 'ORD-9082', type: 'Delayed delivery', status: 'Pending' },
    { compId: 'COMP-702', customer: 'Meena Jadhav', orderId: 'ORD-9085', type: 'Damaged item packaged', status: 'Resolved' }
  ])

  // Filter parameters
  const [deliverySearchQuery, setDeliverySearchQuery] = useState('')
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('All')

  // Selected entities for modals
  const [selectedDelDetails, setSelectedDelDetails] = useState(null)
  const [showOtpVerifyModal, setShowOtpVerifyModal] = useState(null)
  const [showAssignExecModal, setShowAssignExecModal] = useState(null)
  const [selectedExecProfile, setSelectedExecProfile] = useState(null)
  const [trackingSimProgress, setTrackingSimProgress] = useState(35)
  const [isSimulatingRoute, setIsSimulatingRoute] = useState(false)
  const [activeRouteOption, setActiveRouteOption] = useState('Route A (Fastest)')
  const [otpInput, setOtpInput] = useState('')
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [deliveryReportType, setDeliveryReportType] = useState('Daily')

  // --- AGRI INTELLIGENCE MODULE STATES ---
  const [cropAdvLoc, setCropAdvLoc] = useState('Baramati')
  const [cropAdvSoil, setCropAdvSoil] = useState('Black Clayey Soil')
  const [cropAdvSeason, setCropAdvSeason] = useState('Kharif')
  const [cropAdvWater, setCropAdvWater] = useState('Medium')
  const [cropAdvResult, setCropAdvResult] = useState(null)

  const [diseaseScanCrop, setDiseaseScanCrop] = useState('Cotton')
  const [diseaseScanStatus, setDiseaseScanStatus] = useState('idle') // idle, scanning, done
  const [diseaseScanResult, setDiseaseScanResult] = useState(null)

  const [yieldCrop, setYieldCrop] = useState('BT Cotton Seeds 450g')
  const [yieldArea, setYieldArea] = useState(5)
  const [yieldSoilHealth, setYieldSoilHealth] = useState('Excellent')
  const [yieldResult, setYieldResult] = useState(null)

  const [soilPH, setSoilPH] = useState(6.8)
  const [soilN, setSoilN] = useState(42)
  const [soilP, setSoilP] = useState(25)
  const [soilK, setSoilK] = useState(180)
  const [soilMoisture, setSoilMoisture] = useState(65)

  const [savedRecommendations, setSavedRecommendations] = useState([
    { id: 'REC-101', farmer: 'Suresh Patil', crop: 'Cotton', irrigation: 'Drip 2 hours daily', fertilizer: 'Urea (20kg) at 30 days', prevention: 'Confidor spray at first pest sign', date: '2026-05-30' },
    { id: 'REC-102', farmer: 'Anita Deshpande', crop: 'Pomegranate', irrigation: 'Drip 3 hours alternate days', fertilizer: 'NPK 19:19:19 (15kg) post prune', prevention: 'Fungicide paste on stem', date: '2026-05-29' }
  ])

  const [agriReportType, setAgriReportType] = useState('Weather')

  // --- MARKETING MODULE STATES ---
  const [coupons, setCoupons] = useState([
    { code: 'KHARIF50', name: 'Monsoon Seed Discount', type: 'Flat', value: 50, startDate: '2026-06-01', endDate: '2026-06-30', limit: 100, status: 'Active', used: 24 },
    { code: 'UREA10', name: 'Bulk Fertilizer Offer', type: 'Percentage', value: 10, startDate: '2026-05-15', endDate: '2026-06-15', limit: 500, status: 'Active', used: 112 },
    { code: 'BAYER15', name: 'Bayer Pest Control Sale', type: 'Percentage', value: 15, startDate: '2026-05-01', endDate: '2026-05-30', limit: 200, status: 'Expired', used: 198 }
  ])

  const [promotions, setPromotions] = useState([
    { id: 'PRM-001', name: 'Festival Bumper Rabi Sale', type: 'Category Discount', value: '15% Off Seeds', scope: 'Seeds', status: 'Active' },
    { id: 'PRM-002', name: 'Monsoon Organic Special', type: 'Product Discount', value: 'Flat ₹100 Off NPK', scope: 'NPK Fertilizer', status: 'Inactive' }
  ])

  const [smsCampaigns, setSmsCampaigns] = useState([
    { id: 'SMS-101', name: 'Cotton Seeds Season Promo', segment: 'Farmers', content: 'Special 10% discount on Mahyco Cotton Seeds! Use code KHARIF50 on checkout.', date: '2026-05-30', sent: 620, delivered: 602, failed: 18, status: 'Sent' },
    { id: 'SMS-102', name: 'Udhari Due Reminder Notification', segment: 'Credit Customers', content: 'Dear Customer, this is a friendly reminder to clear your pending credit balances.', date: '2026-06-02', status: 'Scheduled' }
  ])

  const [emailCampaigns, setEmailCampaigns] = useState([
    { id: 'EML-201', name: 'Monthly Agri advisory Newsletter', segment: 'All Customers', subject: 'June Crop Advisories & Soil Dosing guides', date: '2026-05-28', sent: 840, opens: 420, clicks: 185, conversions: 24, status: 'Sent' }
  ])

  const [customerNotifications, setCustomerNotifications] = useState([
    { id: 'NOT-301', title: 'Heavy Rain Warning Broadcast', type: 'Offer Alert', content: 'Drought warning alert for Phaltan North. Drip irrigation recommended.', date: '2026-05-30', status: 'Sent' }
  ])

  const [customerSegments, setCustomerSegments] = useState([
    { name: 'New Customers', count: 165, desc: 'Registered in the last 30 days', avgOrder: 3400 },
    { name: 'Farmers', count: 620, desc: 'Core agricultural cultivators', avgOrder: 6800 },
    { name: 'High Value Customers', count: 85, desc: 'Lifetime spending above ₹50,000', avgOrder: 12400 },
    { name: 'Credit Customers', count: 32, desc: 'Active outstanding credit accounts', avgOrder: 8900 }
  ])

  const [marketingReportType, setMarketingReportType] = useState('Campaign')

  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false)
  const [showCreatePromoModal, setShowCreatePromoModal] = useState(false)
  const [showSmsBuilderModal, setShowSmsBuilderModal] = useState(false)
  const [showEmailBuilderModal, setShowEmailBuilderModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [showSegmentModal, setShowSegmentModal] = useState(false)

  // --- SUPPORT CENTER MODULE STATES ---
  const [supportTickets, setSupportTickets] = useState([
    { id: 'TKT-1001', customer: 'Suresh Patil', type: 'Billing', priority: 'High', status: 'Open', date: '2026-05-30', desc: 'Charged twice during credit card check-out on urea purchase.', agent: 'Seema Kulkarni' },
    { id: 'TKT-1002', customer: 'Ramesh Kumar', type: 'Delivery', priority: 'Critical', status: 'In Progress', date: '2026-05-30', desc: 'Delivery is delayed by 2 days; fertilizer urgently needed for sowing.', agent: 'Sunita Desai' },
    { id: 'TKT-1003', customer: 'Anita Deshpande', type: 'Products', priority: 'Medium', status: 'Resolved', date: '2026-05-29', desc: 'NPK fertilizer package was wet at corner, but contents are fine.', agent: 'Raju Pawar' },
    { id: 'TKT-1004', customer: 'Vijay Shinde', type: 'Technical Issues', priority: 'Low', status: 'Closed', date: '2026-05-28', desc: 'Unable to login to farmer app.', agent: 'Seema Kulkarni' }
  ])

  const [refundRequests, setRefundRequests] = useState([
    { id: 'REF-501', orderId: 'ORD-9081', customer: 'Suresh Patil', amount: 740, reason: 'Damaged packing / torn seed bag', status: 'Pending' },
    { id: 'REF-502', orderId: 'ORD-9083', customer: 'Anita Deshpande', amount: 425, reason: 'Incorrect product version sent', status: 'Approved' },
    { id: 'REF-503', orderId: 'ORD-9085', customer: 'Meena Jadhav', amount: 6700, reason: 'Order Cancelled - Full Refund', status: 'Completed' }
  ])

  const [activeChats, setActiveChats] = useState([
    { id: 'CH-801', customer: 'Suresh Patil', status: 'Active', messages: [
      { sender: 'farmer', text: 'Hi, I need help with cotton seed selections.', time: '10:30 AM' },
      { sender: 'agent', text: 'Hello Suresh, I recommend BT Cotton 450g for black clay soil.', time: '10:32 AM' }
    ] },
    { id: 'CH-802', customer: 'Ramesh Kumar', status: 'Waiting', messages: [
      { sender: 'farmer', text: 'Where is my delivery? Status shows in transit.', time: '11:15 AM' }
    ] }
  ])

  const [callLogs, setCallLogs] = useState([
    { id: 'CALL-001', customer: 'Vijay Shinde', agent: 'Sunita Desai', duration: '4m 32s', type: 'Delivery', status: 'Resolved', notes: 'Informed customer that rider is near APMC gate.' },
    { id: 'CALL-002', customer: 'Meena Jadhav', agent: 'Raju Pawar', duration: '2m 15s', type: 'Products', status: 'Resolved', notes: 'Confirmed availability of organic manure bags.' }
  ])

  const [kbArticles, setKbArticles] = useState([
    { id: 'KB-201', title: 'How to request a refund', category: 'Billing', content: 'Go to Order details, select return item, and upload image proof...' },
    { id: 'KB-202', title: 'Tracking your driver route', category: 'Delivery', content: 'Open Live tracking menu inside dashboard to track live EV coordinates...' }
  ])

  const [supportAgents, setSupportAgents] = useState([
    { name: 'Seema Kulkarni', role: 'Billing Expert', workload: 2, status: 'Online' },
    { name: 'Sunita Desai', role: 'Delivery Coordinator', workload: 1, status: 'Online' },
    { name: 'Raju Pawar', role: 'Inventory Expert', workload: 1, status: 'Busy' }
  ])

  const [supportReportType, setSupportReportType] = useState('Ticket')
  const [ticketSearchQuery, setTicketSearchQuery] = useState('')
  const [ticketStatusFilter, setTicketStatusFilter] = useState('All')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showAssignAgentModal, setShowAssignAgentModal] = useState(null)
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false)
  const [selectedChat, setSelectedChat] = useState(null)
  const [chatReplyText, setChatReplyText] = useState('')
  const [selectedCall, setSelectedCall] = useState(null)
  const [showCreateArticleModal, setShowCreateArticleModal] = useState(false)

  // --- REPORTS & ANALYTICS MODULE STATES ---
  const [customReportType, setCustomReportType] = useState('Sales')
  const [customStartDate, setCustomStartDate] = useState('2026-05-01')
  const [customEndDate, setCustomEndDate] = useState('2026-05-30')
  const [selectedMetrics, setSelectedMetrics] = useState({
    revenue: true,
    orders: true,
    customers: true,
    profit: true,
    expenses: false,
    tax: false
  })
  const [builderFilters, setBuilderFilters] = useState({
    product: 'All',
    customer: 'All',
    employee: 'All',
    category: 'All'
  })
  const [previewReport, setPreviewReport] = useState(null)

  const [recentReports, setRecentReports] = useState([
    { id: 'REP-701', type: 'Sales Report', generatedBy: 'Dilip Patil', date: '2026-05-29', size: '142 KB', format: 'PDF' },
    { id: 'REP-702', type: 'Inventory Audit', generatedBy: 'Seema Kulkarni', date: '2026-05-28', size: '280 KB', format: 'Excel' },
    { id: 'REP-703', type: 'Profit & Loss Statement', generatedBy: 'Dilip Patil', date: '2026-05-25', size: '95 KB', format: 'PDF' }
  ])

  const [salesReportTab, setSalesReportTab] = useState('Monthly')
  const [inventoryReportFilter, setInventoryReportFilter] = useState('All')
  const [customerFilter, setCustomerFilter] = useState('All')
  const [financePeriodFilter, setFinancePeriodFilter] = useState('Monthly')

  // Detailed mock report tables
  const reportSalesData = [
    { period: 'Daily (Today)', sales: 18900, orders: 34, aov: 555, growth: '+4.2%' },
    { period: 'Weekly (Current)', sales: 112400, orders: 198, aov: 567, growth: '+6.8%' },
    { period: 'Monthly (May)', sales: 489000, orders: 840, aov: 582, growth: '+12.5%' },
    { period: 'Yearly (2026 YTD)', sales: 2450000, orders: 4120, aov: 594, growth: '+18.1%' }
  ]

  const bestSellers = [
    { name: 'Urea Fertilizer 50kg', sold: 450, revenue: 135000, growth: '+15%' },
    { name: 'DAP Super Booster', sold: 310, revenue: 93000, growth: '+12%' },
    { name: 'BT Cotton Hybrid Seeds', sold: 280, revenue: 140000, growth: '+8%' },
    { name: 'Glyphosate Herbicide 1L', sold: 190, revenue: 47500, growth: '+20%' }
  ]

  const lowStockItems = [
    { name: 'Zinc Sulphate 5kg', sku: 'ZNC-098', stock: 4, status: 'Low Stock' },
    { name: 'Neem Oil Bio-Pesticide', sku: 'NEM-302', stock: 2, status: 'Low Stock' },
    { name: 'Potash Fertilizer 25kg', sku: 'POT-110', stock: 0, status: 'Out of Stock' }
  ]

  const reportsExpiringItems = [
    { name: 'Organic Compost 10kg', batch: 'B-892', expiry: '2026-06-15', daysLeft: 16 },
    { name: 'Trichlorfon Insecticide', batch: 'B-774', expiry: '2026-07-02', daysLeft: 33 }
  ]

  const topCustomers = [
    { name: 'Balasaheb Vikhe', orders: 48, spending: 64500, location: 'Rahata' },
    { name: 'Sanjay Deshmukh', orders: 39, spending: 51200, location: 'Sangamner' },
    { name: 'Vitthalrao Patil', orders: 32, spending: 42800, location: 'Loni' }
  ]

  const plStatement = [
    { item: 'Gross Sales Revenue', amount: 489000, type: 'income' },
    { item: 'Cost of Goods Sold (COGS)', amount: 290000, type: 'expense' },
    { item: 'Operating Salaries', amount: 42000, type: 'expense' },
    { item: 'Rent & Logistics', amount: 15000, type: 'expense' },
    { item: 'Tax Deductions', amount: 18500, type: 'expense' },
    { item: 'Net Profit Payout', amount: 123500, type: 'profit' }
  ]

  const employeeAttendanceData = [
    { name: 'Raju Pawar', role: 'Support Agent', present: 24, leaves: 2, performance: '9.2/10' },
    { name: 'Sunita Desai', role: 'Billing Operator', present: 25, leaves: 1, performance: '8.8/10' },
    { name: 'Seema Kulkarni', role: 'Inventory Rep', present: 23, leaves: 3, performance: '9.0/10' }
  ]

  const deliveryRiderReports = [
    { name: 'Rider Ramesh', completed: 142, failed: 2, successRate: '98.5%', avgTime: '24 mins' },
    { name: 'Rider Dinesh', completed: 128, failed: 4, successRate: '96.9%', avgTime: '29 mins' }
  ]

  const agriAIReports = [
    { type: 'Soil Health advisory', count: 320, accuracy: '94%' },
    { type: 'Wheat Disease Detection', count: 185, accuracy: '91%' },
    { type: 'Sugarcane Yield Forecast', count: 142, accuracy: '88%' }
  ]

  // --- SETTINGS MODULE STATES ---
  const [selectedPermissionsRole, setSelectedPermissionsRole] = useState('Sales Executive')
  
  // List of all 34 granular permission types
  const granularPermissionsList = [
    { key: 'dashboardAccess', label: 'Dashboard Access', group: 'System' },
    { key: 'viewAnalytics', label: 'View Analytics', group: 'System' },
    { key: 'viewAuditLogs', label: 'View Audit Logs', group: 'System' },
    { key: 'manageSettings', label: 'Manage Settings', group: 'System' },
    { key: 'generateReports', label: 'Generate Reports', group: 'System' },
    
    { key: 'viewRecords', label: 'View Records', group: 'Core Operations' },
    { key: 'createRecords', label: 'Create Records', group: 'Core Operations' },
    { key: 'editRecords', label: 'Edit Records', group: 'Core Operations' },
    { key: 'deleteRecords', label: 'Delete Records', group: 'Core Operations' },
    { key: 'approveRecords', label: 'Approve Records', group: 'Core Operations' },
    { key: 'rejectRecords', label: 'Reject Records', group: 'Core Operations' },
    { key: 'exportData', label: 'Export Data', group: 'Core Operations' },
    { key: 'importData', label: 'Import Data', group: 'Core Operations' },
    { key: 'printDocuments', label: 'Print Documents', group: 'Core Operations' },
    
    { key: 'manageInventory', label: 'Manage Inventory', group: 'Inventory & Sales' },
    { key: 'manageProducts', label: 'Manage Products', group: 'Inventory & Sales' },
    { key: 'manageOrders', label: 'Manage Orders', group: 'Inventory & Sales' },
    { key: 'manageCustomers', label: 'Manage Customers', group: 'Inventory & Sales' },
    { key: 'invoiceManagement', label: 'Invoice Management', group: 'Inventory & Sales' },
    { key: 'purchaseManagement', label: 'Purchase Management', group: 'Inventory & Sales' },
    { key: 'supplierManagement', label: 'Supplier Management', group: 'Inventory & Sales' },
    
    { key: 'manageEmployees', label: 'Manage Employees', group: 'HR & Staff' },
    { key: 'manageAttendance', label: 'Manage Attendance', group: 'HR & Staff' },
    { key: 'managePayroll', label: 'Manage Payroll', group: 'HR & Staff' },
    { key: 'manageLeaveRequests', label: 'Manage Leave Requests', group: 'HR & Staff' },
    
    { key: 'manageDeliveries', label: 'Manage Deliveries', group: 'Logistics' },
    { key: 'routeManagement', label: 'Route Management', group: 'Logistics' },
    { key: 'gpsTrackingAccess', label: 'GPS Tracking Access', group: 'Logistics' },
    
    { key: 'manageComplaints', label: 'Manage Complaints', group: 'Finance & Support' },
    { key: 'managePromotions', label: 'Manage Promotions', group: 'Finance & Support' },
    { key: 'manageAiTools', label: 'Manage AI Tools', group: 'Finance & Support' },
    { key: 'manageCreditAccounts', label: 'Manage Credit Accounts', group: 'Finance & Support' },
    { key: 'accessFinancialData', label: 'Access Financial Data', group: 'Finance & Support' },
    { key: 'assignTasks', label: 'Assign Tasks', group: 'System' }
  ]

  const [rolePermissionsMatrix, setRolePermissionsMatrix] = useState({
    'Sales Executive': {
      dashboardAccess: true, manageOrders: true, manageCustomers: true, invoiceManagement: true, viewRecords: true, generateReports: true,
      viewAnalytics: false, viewAuditLogs: false, manageSettings: false, createRecords: true, editRecords: true, deleteRecords: false,
      approveRecords: false, rejectRecords: false, exportData: true, importData: false, printDocuments: true, manageInventory: false,
      manageProducts: true, manageEmployees: false, manageAttendance: false, managePayroll: false, manageLeaveRequests: false,
      manageDeliveries: false, routeManagement: false, gpsTrackingAccess: false, manageComplaints: false, managePromotions: false,
      manageAiTools: false, manageCreditAccounts: true, accessFinancialData: false, assignTasks: false, purchaseManagement: false, supplierManagement: false
    },
    'Inventory Manager': {
      dashboardAccess: true, manageProducts: true, manageInventory: true, generateReports: true, viewRecords: true, createRecords: true,
      editRecords: true, deleteRecords: false, approveRecords: false, rejectRecords: false, exportData: true, importData: true,
      printDocuments: true, manageSettings: false, viewAnalytics: true, viewAuditLogs: false, manageOrders: false, manageCustomers: false,
      invoiceManagement: false, purchaseManagement: true, supplierManagement: true, manageEmployees: false, manageAttendance: false,
      managePayroll: false, manageLeaveRequests: false, manageDeliveries: false, routeManagement: false, gpsTrackingAccess: false,
      manageComplaints: false, managePromotions: false, manageAiTools: false, manageCreditAccounts: false, accessFinancialData: false, assignTasks: false
    },
    'Warehouse Staff': {
      dashboardAccess: true, viewRecords: true, manageInventory: true, editRecords: true, createRecords: false, deleteRecords: false,
      approveRecords: false, rejectRecords: false, exportData: false, importData: false, printDocuments: true, manageSettings: false,
      viewAnalytics: false, viewAuditLogs: false, generateReports: false, manageProducts: false, manageOrders: false, manageCustomers: false,
      invoiceManagement: false, purchaseManagement: false, supplierManagement: false, manageEmployees: false, manageAttendance: false,
      managePayroll: false, manageLeaveRequests: false, manageDeliveries: true, routeManagement: false, gpsTrackingAccess: false,
      manageComplaints: false, managePromotions: false, manageAiTools: false, manageCreditAccounts: false, accessFinancialData: false, assignTasks: false
    },
    'Delivery Coordinator': {
      dashboardAccess: true, manageDeliveries: true, routeManagement: true, generateReports: true, gpsTrackingAccess: true, viewRecords: true,
      createRecords: true, editRecords: true, deleteRecords: false, approveRecords: true, rejectRecords: true, exportData: true,
      importData: false, printDocuments: true, manageSettings: false, viewAnalytics: true, viewAuditLogs: false, manageProducts: false,
      manageInventory: false, manageOrders: true, manageCustomers: false, invoiceManagement: false, purchaseManagement: false,
      supplierManagement: false, manageEmployees: false, manageAttendance: false, managePayroll: false, manageLeaveRequests: false,
      manageComplaints: false, managePromotions: false, manageAiTools: false, manageCreditAccounts: false, accessFinancialData: false, assignTasks: true
    },
    'Delivery Executive': {
      dashboardAccess: true, viewRecords: true, manageDeliveries: true, gpsTrackingAccess: true, editRecords: true, createRecords: false,
      deleteRecords: false, approveRecords: false, rejectRecords: false, exportData: false, importData: false, printDocuments: false,
      manageSettings: false, viewAnalytics: false, viewAuditLogs: false, generateReports: false, routeManagement: true, manageProducts: false,
      manageInventory: false, manageOrders: false, manageCustomers: false, invoiceManagement: false, purchaseManagement: false,
      supplierManagement: false, manageEmployees: false, manageAttendance: false, managePayroll: false, manageLeaveRequests: false,
      manageComplaints: false, managePromotions: false, manageAiTools: false, manageCreditAccounts: false, accessFinancialData: false, assignTasks: false
    },
    'Customer Support Executive': {
      dashboardAccess: true, manageComplaints: true, viewRecords: true, createRecords: true, editRecords: true, deleteRecords: false,
      approveRecords: false, rejectRecords: true, exportData: false, importData: false, printDocuments: true, manageSettings: false,
      viewAnalytics: false, viewAuditLogs: false, generateReports: true, manageProducts: false, manageInventory: false, manageOrders: true,
      manageCustomers: true, invoiceManagement: false, purchaseManagement: false, supplierManagement: false, manageEmployees: false,
      manageAttendance: false, managePayroll: false, manageLeaveRequests: false, manageDeliveries: false, routeManagement: false,
      gpsTrackingAccess: false, managePromotions: false, manageAiTools: false, manageCreditAccounts: false, accessFinancialData: false, assignTasks: false
    },
    'Agriculture Expert': {
      dashboardAccess: true, manageAiTools: true, viewRecords: true, generateReports: true, createRecords: true, editRecords: true,
      deleteRecords: false, approveRecords: false, rejectRecords: false, exportData: false, importData: false, printDocuments: true,
      manageSettings: false, viewAnalytics: true, viewAuditLogs: false, manageProducts: false, manageInventory: false, manageOrders: false,
      manageCustomers: true, invoiceManagement: false, purchaseManagement: false, supplierManagement: false, manageEmployees: false,
      manageAttendance: false, managePayroll: false, manageLeaveRequests: false, manageDeliveries: false, routeManagement: false,
      gpsTrackingAccess: false, manageComplaints: false, managePromotions: false, manageCreditAccounts: false, accessFinancialData: false, assignTasks: false
    },
    'Finance Executive': {
      dashboardAccess: true, accessFinancialData: true, invoiceManagement: true, generateReports: true, viewAnalytics: true, viewRecords: true,
      createRecords: true, editRecords: true, deleteRecords: true, approveRecords: true, rejectRecords: true, exportData: true,
      importData: true, printDocuments: true, manageSettings: false, viewAuditLogs: true, manageProducts: false, manageInventory: false,
      manageOrders: true, manageCustomers: true, purchaseManagement: true, supplierManagement: true, manageEmployees: false,
      manageAttendance: false, managePayroll: true, manageLeaveRequests: true, manageDeliveries: false, routeManagement: false,
      gpsTrackingAccess: false, manageComplaints: true, managePromotions: false, manageAiTools: false, manageCreditAccounts: true, assignTasks: false
    },
    'HR Manager': {
      dashboardAccess: true, manageEmployees: true, manageAttendance: true, managePayroll: true, manageLeaveRequests: true, generateReports: true,
      viewRecords: true, createRecords: true, editRecords: true, deleteRecords: true, approveRecords: true, rejectRecords: true,
      exportData: true, importData: true, printDocuments: true, manageSettings: false, viewAnalytics: true, viewAuditLogs: false,
      manageProducts: false, manageInventory: false, manageOrders: false, manageCustomers: false, invoiceManagement: false,
      purchaseManagement: false, supplierManagement: false, manageDeliveries: false, routeManagement: false, gpsTrackingAccess: false,
      manageComplaints: false, managePromotions: false, manageAiTools: false, manageCreditAccounts: false, accessFinancialData: false, assignTasks: true
    },
    'Marketing Executive': {
      dashboardAccess: true, managePromotions: true, generateReports: true, viewAnalytics: true, viewRecords: true, createRecords: true,
      editRecords: true, deleteRecords: false, approveRecords: false, rejectRecords: false, exportData: true, importData: false,
      printDocuments: true, manageSettings: false, viewAuditLogs: false, manageProducts: false, manageInventory: false, manageOrders: false,
      manageCustomers: true, invoiceManagement: false, purchaseManagement: false, supplierManagement: false, manageEmployees: false,
      manageAttendance: false, managePayroll: false, manageLeaveRequests: false, manageDeliveries: false, routeManagement: false,
      gpsTrackingAccess: false, manageComplaints: false, manageAiTools: false, manageCreditAccounts: false, accessFinancialData: false, assignTasks: false
    },
    'Field Officer': {
      dashboardAccess: true, viewRecords: true, gpsTrackingAccess: true, generateReports: true, createRecords: true, editRecords: false,
      deleteRecords: false, approveRecords: false, rejectRecords: false, exportData: false, importData: false, printDocuments: false,
      manageSettings: false, viewAnalytics: false, viewAuditLogs: false, manageProducts: false, manageInventory: false, manageOrders: false,
      manageCustomers: true, invoiceManagement: false, purchaseManagement: false, supplierManagement: false, manageEmployees: false,
      manageAttendance: false, managePayroll: false, manageLeaveRequests: false, manageDeliveries: false, routeManagement: false,
      manageComplaints: false, managePromotions: false, manageAiTools: false, manageCreditAccounts: false, accessFinancialData: false, assignTasks: false
    },
    'Quality Checker': {
      dashboardAccess: true, viewRecords: true, manageInventory: true, generateReports: true, editRecords: true, createRecords: false,
      deleteRecords: false, approveRecords: true, rejectRecords: true, exportData: true, importData: false, printDocuments: true,
      manageSettings: false, viewAnalytics: false, viewAuditLogs: false, manageProducts: true, manageOrders: false, manageCustomers: false,
      invoiceManagement: false, purchaseManagement: false, supplierManagement: false, manageEmployees: false, manageAttendance: false,
      managePayroll: false, manageLeaveRequests: false, manageDeliveries: false, routeManagement: false, gpsTrackingAccess: false,
      manageComplaints: false, managePromotions: false, manageAiTools: false, manageCreditAccounts: false, accessFinancialData: false, assignTasks: false
    },
    'Technical Support': {
      dashboardAccess: true, manageSettings: true, viewAuditLogs: true, generateReports: true, viewRecords: true, createRecords: true,
      editRecords: true, deleteRecords: true, approveRecords: false, rejectRecords: false, exportData: true, importData: true,
      printDocuments: true, viewAnalytics: true, manageProducts: false, manageInventory: false, manageOrders: false, manageCustomers: false,
      invoiceManagement: false, purchaseManagement: false, supplierManagement: false, manageEmployees: false, manageAttendance: false,
      managePayroll: false, manageLeaveRequests: false, manageDeliveries: false, routeManagement: false, gpsTrackingAccess: false,
      manageComplaints: false, managePromotions: false, manageAiTools: true, manageCreditAccounts: false, accessFinancialData: false, assignTasks: true
    }
  })

  const [permissionsTabMode, setPermissionsTabMode] = useState('templates')
  const [selectedOverrideEmployee, setSelectedOverrideEmployee] = useState('Raju Pawar')
  const [employeeOverrides, setEmployeeOverrides] = useState({
    'Raju Pawar': { editRecords: true, deleteRecords: true },
    'Sunita Desai': { approveRecords: true },
    'Seema Kulkarni': { exportData: true }
  })

  const [notificationPreferences, setNotificationPreferences] = useState({
    channels: { inApp: true, email: true, sms: false, whatsapp: true },
    events: {
      newOrders: { inApp: true, email: true, sms: false, whatsapp: true },
      lowStock: { inApp: true, email: false, sms: true, whatsapp: true },
      deliveryUpdates: { inApp: true, email: false, sms: false, whatsapp: true },
      complaints: { inApp: true, email: true, sms: false, whatsapp: false },
      payments: { inApp: true, email: true, sms: true, whatsapp: true }
    }
  })

  const [changePasswordForm, setChangePasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [enable2fa, setEnable2fa] = useState(false)
  const [loginAlerts, setLoginAlerts] = useState(true)

  const [activeDevices, setActiveDevices] = useState([
    { device: 'Windows PC • Pune, IN', ip: '192.168.1.45', active: 'Current Session' },
    { device: 'iPhone 15 Pro • Baramati, IN', ip: '103.55.24.12', active: 'Active 2 hours ago' }
  ])

  const [backupHistory, setBackupHistory] = useState([
    { date: '2026-05-29 02:00 AM', size: '42.8 MB', status: 'Completed', type: 'Scheduled' },
    { date: '2026-05-28 02:00 AM', size: '42.5 MB', status: 'Completed', type: 'Scheduled' },
    { date: '2026-05-25 04:30 PM', size: '41.9 MB', status: 'Completed', type: 'Manual' }
  ])

  const [sysPrefs, setSysPrefs] = useState({
    currency: '₹ INR',
    timeZone: 'IST (UTC+05:30)',
    dateFormat: 'DD-MM-YYYY',
    language: 'English',
    units: 'Metric (kg, Litre)'
  })

  const [appearanceLogo, setAppearanceLogo] = useState('https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=100&auto=format&fit=crop&q=60')
  const [appearanceThemeColor, setAppearanceThemeColor] = useState('#236625')
  const [appearanceDarkMode, setAppearanceDarkMode] = useState(false)

  const [printerSettings, setPrinterSettings] = useState({
    defaultPrinter: 'Epson TM-T88VI (Thermal)',
    invoicePrinter: 'Epson TM-T88VI (Thermal)',
    labelPrinter: 'Zebra ZD421 (Barcode)',
    autoPrint: true
  })

  const [settingsTaxRules, setSettingsTaxRules] = useState([
    { name: 'GST-18', rate: 18, type: 'GST', status: 'Active' },
    { name: 'CGST-9', rate: 9, type: 'CGST', status: 'Active' },
    { name: 'SGST-9', rate: 9, type: 'SGST', status: 'Active' },
    { name: 'IGST-18', rate: 18, type: 'IGST', status: 'Active' }
  ])

  const [auditLogs, setAuditLogs] = useState([
    { user: 'Dilip Patil', action: 'Authorized P&L Statement print', module: 'Reports & Analytics', time: '2026-05-30 04:12 PM' },
    { user: 'Seema Kulkarni', action: 'Resolved support ticket TKT-1004', module: 'Support Center', time: '2026-05-30 03:45 PM' },
    { user: 'Raju Pawar', action: 'Updated stock level for Potash Fertilizer', module: 'Inventory Management', time: '2026-05-30 01:20 PM' },
    { user: 'Dilip Patil', action: 'Modified role permission for Warehouse Staff', module: 'Settings', time: '2026-05-30 11:05 AM' }
  ])
  const [auditSearchQuery, setAuditSearchQuery] = useState('')

  // Chart statistics data
  const deliveryTrendData = [
    { name: 'Mon', completed: 12, failed: 1 },
    { name: 'Tue', completed: 15, failed: 0 },
    { name: 'Wed', completed: 19, failed: 2 },
    { name: 'Thu', completed: 14, failed: 1 },
    { name: 'Fri', completed: 25, failed: 0 },
    { name: 'Sat', completed: 28, failed: 3 },
    { name: 'Sun', completed: 10, failed: 1 }
  ]

  const deliveryStatusDistribution = [
    { name: 'Completed', value: 42, color: '#236625' },
    { name: 'Pending', value: 8, color: '#FFA726' },
    { name: 'In Transit', value: 12, color: '#42A5F5' },
    { name: 'Failed', value: 4, color: '#EF5350' }
  ]

  useEffect(() => {
    let interval = null;
    if (isSimulatingRoute) {
      interval = setInterval(() => {
        setTrackingSimProgress(prev => {
          if (prev >= 100) {
            setIsSimulatingRoute(false);
            // Also update Ramesh Kumar's delivery state
            setDeliveries(dels => dels.map(d => d.orderId === 'ORD-9082' ? { ...d, eta: '0 Min (Awaiting OTP)' } : d));
            toast.success('Delivery Executive reached destination! OTP verification ready.');
            return 100;
          }
          return prev + 5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimulatingRoute]);

  // --- SUBMODULE WORKSPACE CONTROLLER ---
  const renderSubModule = () => {
    // We only execute when category is 'Dashboard'
    if (activeCategory !== 'Dashboard') return null

    switch (activeSubItem) {
      // 1. OVERVIEW SCREEN
      case 'Overview':
        return (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <KPICard
                title="Total Revenue"
                value={revenueVal}
                prefix="₹"
                subtitle="+14.2% vs last month"
                icon={IndianRupee}
                color="green"
                trend="up"
                trendValue={14.2}
              />
              <KPICard
                title="Total Orders"
                value={1842}
                subtitle="Today's orders: +28"
                icon={ShoppingCart}
                color="green"
                trend="up"
                trendValue={8.4}
              />
              <KPICard
                title="Total Customers"
                value={840}
                subtitle="New this month: +45"
                icon={Users}
                color="blue"
                trend="up"
                trendValue={5.6}
              />
              <KPICard
                title="Total Products"
                value={342}
                subtitle="Active products: 310"
                icon={Package}
                color="orange"
              />
              <KPICard
                title="Active Employees"
                value={12}
                subtitle="Attendance: 94.5%"
                icon={Briefcase}
                color="purple"
              />
              <KPICard
                title="Pending Deliveries"
                value={18}
                subtitle="Delayed shipments: 3"
                icon={Truck}
                color="red"
              />
            </div>

            {/* Quick Actions & Recent Activities & Notification Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Quick Actions & Notifications Column */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Modern Icon Quick Actions */}
                <div className="kpi-card">
                  <h3 className="font-bold text-gray-800 text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Quick Store Operations</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <button
                      onClick={() => {
                        toast.success('Redirecting to Product Catalog catalog...')
                        setActiveItem('Products', 'Product Management')
                      }}
                      className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-emerald-600 hover:shadow-md transition-all gap-2 bg-slate-50/50"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-800">
                        <Plus size={18} />
                      </div>
                      <span className="text-xs font-bold text-gray-700">Add Product</span>
                    </button>
                    <button
                      onClick={() => navigate('/billing')}
                      className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-emerald-600 hover:shadow-md transition-all gap-2 bg-slate-50/50"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-800">
                        <ShoppingCart size={18} />
                      </div>
                      <span className="text-xs font-bold text-gray-700">Create Order</span>
                    </button>
                    <button
                      onClick={() => setAddCustomerModal(true)}
                      className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-emerald-600 hover:shadow-md transition-all gap-2 bg-slate-50/50"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-800">
                        <UserPlus size={18} />
                      </div>
                      <span className="text-xs font-bold text-gray-700">Add Customer</span>
                    </button>
                    <button
                      onClick={() => setActiveItem('Employee Management', 'Add Employee')}
                      className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-emerald-600 hover:shadow-md transition-all gap-2 bg-slate-50/50"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-800">
                        <Briefcase size={18} />
                      </div>
                      <span className="text-xs font-bold text-gray-700">Add Employee</span>
                    </button>
                  </div>
                </div>

                {/* Notifications Panel */}
                <div className="kpi-card">
                  <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Bell className="text-emerald-700" size={16} />
                      <h3 className="font-bold text-gray-800 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Store Notification Center</h3>
                    </div>
                    <button onClick={handleMarkAllRead} className="text-xs font-semibold text-emerald-800 hover:underline">
                      Mark all as read
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex items-start justify-between p-3 rounded-lg border transition-all ${
                          notif.read ? 'bg-white border-gray-100' : 'bg-emerald-50/30 border-emerald-100/50'
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            {notif.title.includes('Stock') ? (
                              <AlertTriangle size={15} className="text-orange-500" />
                            ) : (
                              <CheckCircle2 size={15} className="text-emerald-700" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                              {notif.title}
                              {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                            </h4>
                            <p className="text-[11px] text-gray-500 mt-0.5">{notif.desc}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-semibold">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recent Activities Column */}
              <div className="kpi-card">
                <h3 className="font-bold text-gray-800 text-sm border-b pb-3 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Recent Activities</h3>
                <div className="relative pl-6 border-l border-gray-100 space-y-6">
                  {activities.map((act) => {
                    const ActIcon = act.icon
                    return (
                      <div key={act.id} className="relative">
                        <div className="absolute -left-[35px] top-0 w-[18px] h-[18px] rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-800">
                          <ActIcon size={10} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800 leading-none">{act.title}</p>
                          <p className="text-[10px] text-gray-500 mt-1">{act.desc}</p>
                          <span className="text-[9px] text-gray-400 font-semibold mt-1 block">{act.time}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Add Customer Modal */}
            <Modal open={addCustomerModal} onClose={() => setAddCustomerModal(false)} title="Add Customer Profile" size="md">
              <form onSubmit={customerSubmit(onAddCustomerSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Full Name *</label>
                  <input className="input-field mt-1" required {...customerReg('name')} placeholder="E.g., Ramesh Patil" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700">Phone Number *</label>
                  <input className="input-field mt-1" required {...customerReg('phone')} placeholder="E.g., 9822114455" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700">Location/Village</label>
                  <input className="input-field mt-1" {...customerReg('village')} placeholder="E.g., Baramati village" />
                </div>
                <button type="submit" className="w-full btn-primary py-2 text-xs font-bold uppercase tracking-wider">Save Customer</button>
              </form>
            </Modal>
          </div>
        )

      // 2. REVENUE SUMMARY SCREEN
      case 'Revenue Summary':
        return (
          <div className="kpi-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Revenue Summary Ledger</h2>
                <p className="text-xs text-gray-400 mt-0.5">Overview of business collections and credit invoices.</p>
              </div>
              
              {/* Dynamic Filter Controls */}
              <div className="flex items-center gap-2">
                {['Today', 'Last 7 Days', 'Last 30 Days', 'Last 12 Months'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setRevenueFilter(opt)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      revenueFilter === opt
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Indicator */}
            <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Net Sales Revenue ({revenueFilter})</span>
                <h3 className="text-2xl font-black text-emerald-800 mt-1" style={{ color: GREEN_PRIMARY }}>
                  ₹{getRevenueData().reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRevenueChartType('line')}
                  className={`p-2 rounded-lg border text-xs font-bold ${revenueChartType === 'line' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white border-gray-100 text-gray-500'}`}
                >
                  Line Chart
                </button>
                <button
                  onClick={() => setRevenueChartType('bar')}
                  className={`p-2 rounded-lg border text-xs font-bold ${revenueChartType === 'bar' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white border-gray-100 text-gray-500'}`}
                >
                  Bar Chart
                </button>
              </div>
            </div>

            {/* Graph Renderer */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {revenueChartType === 'line' ? (
                  <LineChart data={getRevenueData()} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="amount" stroke={GREEN_PRIMARY} strokeWidth={3} activeDot={{ r: 6 }} />
                  </LineChart>
                ) : (
                  <BarChart data={getRevenueData()} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="amount" fill={GREEN_ACCENT} radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )

      // 3. SALES ANALYTICS SCREEN
      case 'Sales Analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Product Share Pie */}
              <div className="kpi-card lg:col-span-1">
                <h3 className="font-bold text-gray-800 text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Sales Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {categoryData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {categoryData.map((c) => (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                        <span className="text-gray-600">{c.name}</span>
                      </div>
                      <span className="font-bold text-gray-800">{c.value}% share</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Selling Products */}
              <div className="kpi-card lg:col-span-2 space-y-4">
                <h3 className="font-bold text-gray-800 text-sm border-b pb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Top Performance Products</h3>
                <div className="space-y-3.5">
                  {topSalesProducts.map((p, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-700">{p.name}</span>
                        <span className="font-semibold text-gray-500">{p.sales} units (₹{p.revenue.toLocaleString('en-IN')})</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.percentage}%`, background: GREEN_PRIMARY }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sales Trend Chart */}
            <div className="kpi-card">
              <h3 className="font-bold text-gray-800 text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Department Sales Trends</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                    <Tooltip formatter={(v) => `₹${v}`} />
                    <Legend />
                    <Bar dataKey="Seeds" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Fertilizers" fill="#66BB6A" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pesticides" fill="#FFA726" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )

      // 4. INVENTORY SUMMARY SCREEN
      case 'Inventory Summary':
        return (
          <div className="kpi-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Inventory Summary Catalog</h2>
                <p className="text-xs text-gray-400 mt-0.5">Real-time status of catalog stocks and low stock alerts.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 border rounded-lg px-2 bg-slate-50">
                  <Search size={13} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search stock..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="bg-transparent text-[11px] outline-none py-1 text-gray-700"
                  />
                </div>
                <select
                  value={inventoryStatusFilter}
                  onChange={(e) => setInventoryStatusFilter(e.target.value)}
                  className="text-[10px] font-bold border rounded-lg px-2 bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Critical">Critical</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Stock count</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-slate-50/40">
                      <td className="p-3 font-semibold text-gray-800">{item.name}</td>
                      <td className="p-3 font-bold text-gray-900">{item.stock} units</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          item.status === 'Healthy' ? 'bg-green-100 text-green-800' :
                          item.status === 'Low Stock' ? 'bg-orange-100 text-orange-800' :
                          item.status === 'Critical' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-gray-500">{item.expiry}</td>
                      <td className="p-3">
                        <button onClick={() => toast.success(`Initiated PO Restock request for ${item.name}`)} className="text-[10px] font-bold text-emerald-800 hover:underline">
                          Order Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredInventory.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-gray-400 font-semibold">No products matches the search filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )

      // 5. RECENT ORDERS SCREEN
      case 'Recent Orders':
        return (
          <div className="kpi-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Order Logs & Dispatches</h2>
                <p className="text-xs text-gray-400 mt-0.5">Browse through recent invoices and delivery states.</p>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <div className="flex items-center gap-2 border rounded-lg px-2 bg-slate-50">
                  <Search size={13} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Order ID / Customer..."
                    value={ordersSearch}
                    onChange={(e) => setOrdersSearch(e.target.value)}
                    className="bg-transparent text-[11px] outline-none py-1 text-gray-700"
                  />
                </div>
                <select
                  value={ordersStatusFilter}
                  onChange={(e) => setOrdersStatusFilter(e.target.value)}
                  className="text-[10px] font-bold border rounded-lg px-2 bg-white"
                >
                  <option value="All">All States</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Products</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Invoice Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="border-b hover:bg-slate-50/40">
                      <td className="p-3 font-mono font-bold text-emerald-800">{ord.id}</td>
                      <td className="p-3 font-semibold text-gray-800">{ord.customer}</td>
                      <td className="p-3 font-medium text-gray-500">{ord.count} items</td>
                      <td className="p-3 font-bold text-gray-900">₹{ord.amount}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          ord.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                          ord.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-gray-400">{ord.date}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1 px-2.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px]"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Details Modal */}
            <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order Summary: ${selectedOrder?.id}`} size="md">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 border-b pb-3 text-xs">
                  <div>
                    <span className="block text-gray-400 font-bold uppercase text-[9px]">Bill To Customer</span>
                    <span className="font-bold text-gray-800 text-sm mt-0.5 block">{selectedOrder?.customer}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 font-bold uppercase text-[9px]">Order Date</span>
                    <span className="font-semibold text-gray-700 mt-0.5 block">{selectedOrder?.date}</span>
                  </div>
                </div>
                <div>
                  <span className="block text-gray-400 font-bold uppercase text-[9px] mb-2">Item Breakdown</span>
                  <div className="space-y-2 bg-slate-50 p-3 rounded-lg border">
                    {selectedOrder?.items?.map((itm, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-medium text-gray-700">{itm}</span>
                        <span className="font-bold text-gray-800">Checked</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center border-t pt-3 font-bold">
                  <span className="text-gray-800 text-sm">Grand Total:</span>
                  <span className="text-emerald-800 text-base" style={{ color: GREEN_PRIMARY }}>₹{selectedOrder?.amount?.toLocaleString()}</span>
                </div>
              </div>
            </Modal>
          </div>
        )

      // 6. CUSTOMER INSIGHTS SCREEN
      case 'Customer Insights':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Distribution Pie */}
              <div className="kpi-card lg:col-span-1">
                <h3 className="font-bold text-gray-800 text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Customer Retention</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={customerDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {customerDistribution.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {customerDistribution.map((c) => (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                        <span className="text-gray-600">{c.name}</span>
                      </div>
                      <span className="font-bold text-gray-800">{c.value} profiles</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Growth Graph */}
              <div className="kpi-card lg:col-span-2">
                <h3 className="font-bold text-gray-800 text-sm mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Active Farmer Growth (Monthly)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={customerGrowthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke={GREEN_PRIMARY} strokeWidth={3} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )

      // 7. AI INSIGHTS SCREEN
      case 'AI Insights':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
              <Leaf className="text-emerald-700 animate-pulse" size={20} />
              <div>
                <h3 className="text-sm font-bold text-emerald-800">KrushiCare AI Engine (Active)</h3>
                <p className="text-[11px] text-emerald-700">Predictive insights customized for local crop calendars and crop disease controls.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Sales Forecast */}
              <div className="kpi-card space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-gray-800">Sales Forecast</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">High Confidence</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Demand for **Urea fertilizers** is predicted to grow by **32%** over the next 14 days due to monsoon seeding preparation.
                </p>
                <div className="p-2.5 bg-slate-50 border rounded-lg flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-semibold">Recommended action</span>
                  <button onClick={() => toast.success('PO replenishment created!')} className="text-[10px] font-bold text-emerald-800 hover:underline">Reorder Urea</button>
                </div>
              </div>

              {/* Weather Impact Alert */}
              <div className="kpi-card space-y-3 border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <CloudSun size={14} className="text-amber-500" />
                    Crop Impact Warning
                  </span>
                  <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded">Weather</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Heavy rain warnings in Baramati block are likely to cause **downy mildew leaf spots** in grape cultivation farms.
                </p>
                <div className="p-2.5 bg-slate-50 border rounded-lg flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-semibold">Suggested Campaign</span>
                  <button onClick={() => toast.success('Fungicide SMS campaign dispatched to Grape farmers!')} className="text-[10px] font-bold text-emerald-800 hover:underline">Send Alert SMS</button>
                </div>
              </div>

              {/* Crop Yield Advisor */}
              <div className="kpi-card space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-gray-800">Suggested Products</span>
                  <span className="text-[9px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.5 rounded">Trending</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Cotton farmers in MP and Maharashtra are shifting to BT-cotton seed variants. Keep BT Hybrid seeds in stock.
                </p>
                <div className="p-2.5 bg-slate-50 border rounded-lg flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-semibold">Current BT Cotton seeds</span>
                  <span className="text-[10px] font-bold text-gray-700">120 units</span>
                </div>
              </div>

            </div>
          </div>
        )

      default:
        return null
    }
  }

  // --- 8. OTHER CATEGORIES (SHOP MANAGEMENT, EMPLOYEES, ETC.) ---
  // The rest of modules will be handled by the original code structure we established.
  const isDashboardCategory = activeCategory === 'Dashboard'

  if (isDashboardCategory) {
    return renderSubModule()
  }

  // If selecting anything else, keep the previous fallback/other panels we implemented
  return (
    <div className="kpi-card space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2 text-emerald-800">
          <FileCheck size={18} />
          <h2 className="text-base font-bold text-gray-800">{activeSubItem}</h2>
        </div>
        <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{activeCategory}</span>
      </div>

      {activeCategory === 'Shop Management' ? (
        <div className="space-y-6">
          {/* Shop Analytics Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">Total Branches</span>
              <span className="text-base font-bold text-gray-850 mt-1 block">{branches.length} Outlets</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">Active Branches</span>
              <span className="text-base font-bold text-emerald-700 mt-1 block">{branches.filter(b=>b.status==='Active').length} Active</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">Business Hours</span>
              <span className="text-base font-bold text-gray-855 mt-1 block">9 AM - 7 PM</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">Monthly Sales</span>
              <span className="text-base font-bold text-emerald-800 mt-1 block" style={{ color: GREEN_PRIMARY }}>₹4.58L</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">Tax Status</span>
              <span className="text-base font-bold text-emerald-700 mt-1 block">GST Enabled</span>
            </div>
          </div>

          {/* Sub-module Views */}
          {activeSubItem === 'Shop Profile' && (
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-100 flex items-center justify-center bg-emerald-50">
                  <img src={shopProfile.logo} alt="Shop Logo" className="object-cover w-full h-full" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-800">{shopProfile.name}</h3>
                  <p className="text-xs text-gray-400">ID: {shopProfile.id} • {shopProfile.type}</p>
                </div>
                <button onClick={() => toast.success('Logo upload triggered (Mock)')} className="btn-secondary text-[11px] py-1 px-3">
                  Upload New Logo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">Owner Name</label>
                  <input
                    type="text"
                    value={shopProfile.owner}
                    onChange={(e) => setShopProfile({ ...shopProfile, owner: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">Business Type</label>
                  <select
                    value={shopProfile.type}
                    onChange={(e) => setShopProfile({ ...shopProfile, type: e.target.value })}
                    className="input-field mt-1 font-semibold"
                  >
                    <option>Partnership Co.</option>
                    <option>Sole Proprietorship</option>
                    <option>Private Limited</option>
                    <option>LLP Company</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">GSTIN Number</label>
                  <input
                    type="text"
                    value={shopProfile.gstin}
                    onChange={(e) => setShopProfile({ ...shopProfile, gstin: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">PAN Number</label>
                  <input
                    type="text"
                    value={shopProfile.pan}
                    onChange={(e) => setShopProfile({ ...shopProfile, pan: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">Registration Number</label>
                  <input
                    type="text"
                    value={shopProfile.regNo}
                    onChange={(e) => setShopProfile({ ...shopProfile, regNo: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">Contact Mobile</label>
                  <input
                    type="text"
                    value={shopProfile.phone}
                    onChange={(e) => setShopProfile({ ...shopProfile, phone: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">Email Address</label>
                  <input
                    type="text"
                    value={shopProfile.email}
                    onChange={(e) => setShopProfile({ ...shopProfile, email: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">Website URL</label>
                  <input
                    type="text"
                    value={shopProfile.website}
                    onChange={(e) => setShopProfile({ ...shopProfile, website: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">City</label>
                  <input
                    type="text"
                    value={shopProfile.city}
                    onChange={(e) => setShopProfile({ ...shopProfile, city: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">Address</label>
                  <input
                    type="text"
                    value={shopProfile.address}
                    onChange={(e) => setShopProfile({ ...shopProfile, address: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">Pincode</label>
                  <input
                    type="text"
                    value={shopProfile.pincode}
                    onChange={(e) => setShopProfile({ ...shopProfile, pincode: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <button
                  onClick={() => {
                    toast.success('Shop Profile settings updated!')
                    setShopChanges([{ id: Date.now(), activity: 'Shop Profile Updated', user: user?.name || 'Admin', time: 'Just now' }, ...shopChanges])
                  }}
                  className="btn-primary text-xs py-2 px-5 font-bold uppercase tracking-wider"
                >
                  Save Business Changes
                </button>
              </div>
            </div>
          )}

          {activeSubItem === 'Branch Management' && (
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-base font-bold text-gray-800">Business Branch List</h3>
                <button
                  onClick={() => {
                    const newBranchName = prompt('Enter Branch Name:')
                    if (newBranchName) {
                      setBranches([...branches, { name: newBranchName, code: `BRN-0${branches.length+1}`, manager: 'TBD', contact: 'TBD', status: 'Active', address: 'TBD' }])
                      toast.success('New branch registered!')
                      setShopChanges([{ id: Date.now(), activity: `Branch Added: ${newBranchName}`, user: user?.name || 'Admin', time: 'Just now' }, ...shopChanges])
                    }
                  }}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <Plus size={13} /> Add Outlet Branch
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider bg-gray-50">
                      <th className="p-3">Branch Name</th>
                      <th className="p-3">Code</th>
                      <th className="p-3">Manager</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map((b, idx) => (
                      <tr key={idx} className="border-b hover:bg-slate-50/40">
                        <td className="p-3 font-semibold text-gray-800">{b.name}</td>
                        <td className="p-3 font-mono font-bold text-emerald-800">{b.code}</td>
                        <td className="p-3 font-medium text-gray-700">{b.manager}</td>
                        <td className="p-3 font-semibold text-gray-500">{b.contact}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              const updated = branches.map((item, i) => i === idx ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item)
                              setBranches(updated)
                              toast.success('Branch status toggled!')
                            }}
                            className="p-1 px-2.5 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold border mr-1"
                          >
                            Toggle Status
                          </button>
                          <button
                            onClick={() => {
                              setBranches(branches.filter((_, i) => i !== idx))
                              toast.error('Branch deleted!')
                            }}
                            className="p-1 text-red-500 hover:text-red-750"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubItem === 'Business Hours' && (
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="border-b pb-3 mb-4">
                <h3 className="text-base font-bold text-gray-800">Weekly Operating Hours</h3>
                <p className="text-xs text-gray-400 mt-0.5">Toggle holiday status and select operating slots for each day.</p>
              </div>

              <div className="space-y-3">
                {businessHours.map((slot, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 hover:bg-slate-50/50 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-800 w-28">{slot.day}</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={slot.open}
                        disabled={slot.holiday}
                        onChange={(e) => {
                          const updated = businessHours.map((item, i) => i === idx ? { ...item, open: e.target.value } : item)
                          setBusinessHours(updated)
                        }}
                        className="p-1 text-center w-24 text-xs font-bold border rounded-lg"
                      />
                      <span className="text-xs font-bold text-gray-400">to</span>
                      <input
                        type="text"
                        value={slot.close}
                        disabled={slot.holiday}
                        onChange={(e) => {
                          const updated = businessHours.map((item, i) => i === idx ? { ...item, close: e.target.value } : item)
                          setBusinessHours(updated)
                        }}
                        className="p-1 text-center w-24 text-xs font-bold border rounded-lg"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={slot.holiday}
                        onChange={(e) => {
                          const updated = businessHours.map((item, i) => i === idx ? { ...item, holiday: e.target.checked } : item)
                          setBusinessHours(updated)
                        }}
                        className="rounded accent-emerald-800"
                      />
                      Holiday
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t flex gap-2">
                <button
                  onClick={() => {
                    toast.success('Weekly business hours saved!')
                    setShopChanges([{ id: Date.now(), activity: 'Business Hours Adjusted', user: user?.name || 'Admin', time: 'Just now' }, ...shopChanges])
                  }}
                  className="btn-primary text-xs py-2 px-5 font-bold uppercase tracking-wider"
                >
                  Save Schedule
                </button>
              </div>
            </div>
          )}

          {activeSubItem === 'Tax Settings' && (
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-800">GST & Indirect Tax Rules</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Manage tax percentages mapped for seeds, tools, and fertilizers.</p>
                </div>
                <button
                  onClick={() => {
                    const ruleName = prompt('Enter Tax Rule Name (e.g., GST 28%):')
                    const rate = Number(prompt('Enter Tax Percentage rate:'))
                    if (ruleName && !isNaN(rate)) {
                      setTaxRules([...taxRules, { name: ruleName, rate, cgst: rate/2, sgst: rate/2, igst: rate, active: true }])
                      toast.success('New tax rule added!')
                      setShopChanges([{ id: Date.now(), activity: `Tax Rule Added: ${ruleName}`, user: user?.name || 'Admin', time: 'Just now' }, ...shopChanges])
                    }
                  }}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <Plus size={13} /> Add Tax Rule
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider bg-gray-50">
                      <th className="p-3">Rule Name</th>
                      <th className="p-3">Tax Percentage</th>
                      <th className="p-3">CGST</th>
                      <th className="p-3">SGST</th>
                      <th className="p-3">IGST</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxRules.map((t, idx) => (
                      <tr key={idx} className="border-b hover:bg-slate-50/40">
                        <td className="p-3 font-semibold text-gray-800">{t.name}</td>
                        <td className="p-3 font-bold text-gray-900">{t.rate}%</td>
                        <td className="p-3 text-gray-500">{t.cgst}%</td>
                        <td className="p-3 text-gray-500">{t.sgst}%</td>
                        <td className="p-3 text-gray-500">{t.igst}%</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {t.active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              const updated = taxRules.map((item, i) => i === idx ? { ...item, active: !item.active } : item)
                              setTaxRules(updated)
                              toast.success('Tax rule status toggled!')
                            }}
                            className="p-1 px-2.5 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold border"
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubItem === 'Printer Settings' && (
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="border-b pb-3 mb-4">
                <h3 className="text-base font-bold text-gray-800">POS Hardware Printers</h3>
                <p className="text-xs text-gray-400 mt-0.5">Map printer drivers and receipt formatting layout.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">Default POS Printer</label>
                  <select
                    value={printerConfig.defaultPrinter}
                    onChange={(e) => setPrinterConfig({ ...printerConfig, defaultPrinter: e.target.value })}
                    className="input-field mt-1 font-semibold"
                  >
                    <option>Thermal POS-80</option>
                    <option>Thermal POS-58</option>
                    <option>Zebra GK420t</option>
                    <option>HP LaserJet 1020</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">Invoice Print Output</label>
                  <select
                    value={printerConfig.invoicePrinter}
                    onChange={(e) => setPrinterConfig({ ...printerConfig, invoicePrinter: e.target.value })}
                    className="input-field mt-1 font-semibold"
                  >
                    <option>Thermal POS-80</option>
                    <option>Thermal POS-58</option>
                    <option>HP LaserJet 1020</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">Thermal Paper Size</label>
                  <select
                    value={printerConfig.paperSize}
                    onChange={(e) => setPrinterConfig({ ...printerConfig, paperSize: e.target.value })}
                    className="input-field mt-1 font-semibold"
                  >
                    <option>80mm (Standard)</option>
                    <option>58mm (Receipt)</option>
                    <option>A4 Paper Size</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase text-[10px]">Format Layout</label>
                  <select
                    value={printerConfig.printFormat}
                    onChange={(e) => setPrinterConfig({ ...printerConfig, printFormat: e.target.value })}
                    className="input-field mt-1 font-semibold"
                  >
                    <option>Standard Receipt</option>
                    <option>GST Split Invoices</option>
                    <option>Minimal Receipt</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button
                  onClick={() => {
                    toast.success('Printer Settings saved!')
                    setShopChanges([{ id: Date.now(), activity: 'Printer Config Changed', user: user?.name || 'Admin', time: 'Just now' }, ...shopChanges])
                  }}
                  className="btn-primary text-xs py-2 px-5 font-bold uppercase tracking-wider"
                >
                  Save Settings
                </button>
                <button
                  onClick={() => toast.success('Test invoice dispatched to Thermal POS-80!')}
                  className="btn-secondary text-xs py-2 px-4 font-bold"
                >
                  Trigger Test Print
                </button>
              </div>
            </div>
          )}

          {/* Shop Changes Log Timeline */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b pb-3">
              <h3 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Shop Change Logs</h3>
              <p className="text-[11px] text-gray-400">Auditable configuration modifications log timeline.</p>
            </div>
            <div className="relative pl-6 border-l border-gray-100 space-y-4">
              {shopChanges.map((log) => (
                <div key={log.id} className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-[10px] h-[10px] rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" />
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <p className="font-semibold text-gray-800">{log.activity}</p>
                      <p className="text-[10px] text-gray-400">Modified by: {log.user}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeCategory === 'Employee Management' ? (
        <div className="space-y-6">
          {/* Employee KPI Dashboard Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">Total Staff</span>
              <span className="text-base font-bold text-gray-800 mt-1 block">{employees.length} Members</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">Active Duty</span>
              <span className="text-base font-bold text-emerald-700 mt-1 block">{employees.filter(e=>e.status==='active').length} Active</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">On Leave</span>
              <span className="text-base font-bold text-orange-600 mt-1 block">1 Pending</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">New Hires</span>
              <span className="text-base font-bold text-emerald-800 mt-1 block">+2 Hired</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">Attendance</span>
              <span className="text-base font-bold text-emerald-700 mt-1 block">94.5% Avg</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">Monthly Payroll</span>
              <span className="text-base font-bold text-emerald-800 mt-1 block" style={{ color: GREEN_PRIMARY }}>₹2.45L</span>
            </div>
          </div>

          {/* Sub-module Views */}
          {activeSubItem === 'Employee Reports' && (
            <div className="kpi-card space-y-4 bg-white p-5 rounded-2xl border border-gray-100">
              <div className="border-b pb-3">
                <h3 className="text-base font-bold text-gray-800">Generate HR & Employee Analytics Reports</h3>
                <p className="text-xs text-gray-400 mt-0.5">Export operational and financial ledger datasets.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-150 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-gray-800 block">Monthly Attendance Matrix</span>
                    <span className="text-[10px] text-gray-400">Includes shift records, delays, and leave counts.</span>
                  </div>
                  <button onClick={() => toast.success('Attendance Excel Spreadsheet downloaded!')} className="btn-primary text-xs py-1 px-3">
                    Export XLSX
                  </button>
                </div>
                <div className="p-4 rounded-xl border border-gray-150 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-gray-800 block">Payroll Disbursement Ledger</span>
                    <span className="text-[10px] text-gray-400">Includes base salaries, bonuses, and tax deductions.</span>
                  </div>
                  <button onClick={() => toast.success('Disbursement Payslips PDF downloaded!')} className="btn-primary text-xs py-1 px-3">
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSubItem === 'Add Employee' && (
            <div className="kpi-card space-y-4 bg-white p-5 rounded-2xl border border-gray-100">
              <h3 className="text-base font-bold text-gray-850 border-b pb-3">Employee Registration Console</h3>
              <form onSubmit={handleSubmit(onAddEmployee)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-bold">Full Name *</label>
                    <input className="input-field mt-1" required {...register('name')} placeholder="E.g., Prakash More" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold">Email Address *</label>
                    <input type="email" className="input-field mt-1" required placeholder="E.g., prakash@agroerp.com" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold">Mobile Number *</label>
                    <input className="input-field mt-1" required placeholder="E.g., 9988776655" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold">Gender</label>
                    <select className="input-field mt-1">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold">Joining Date</label>
                    <input type="date" className="input-field mt-1" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold">Role Title *</label>
                    <select className="input-field mt-1" required {...register('role')}>
                      <option>Sales Executive</option>
                      <option>Inventory Manager</option>
                      <option>Warehouse Staff</option>
                      <option>Delivery Coordinator</option>
                      <option>Delivery Executive</option>
                      <option>Customer Support Executive</option>
                      <option>Agriculture Expert</option>
                      <option>Finance Executive</option>
                      <option>HR Manager</option>
                      <option>Marketing Executive</option>
                      <option>Field Officer</option>
                      <option>Quality Checker</option>
                      <option>Technical Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold">Monthly Base Salary (₹) *</label>
                    <input type="number" className="input-field mt-1" required {...register('salary')} placeholder="E.g., 20000" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-bold">Home Address</label>
                    <input className="input-field mt-1" placeholder="E.g., Baramati East Lane 4" />
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t">
                  <button type="submit" className="btn-primary text-xs py-2 px-5 font-bold uppercase tracking-wider">Save Employee</button>
                  <button type="reset" className="btn-secondary text-xs py-2 px-4 font-bold">Reset Form</button>
                </div>
              </form>
            </div>
          )}

          {activeSubItem === 'Manage Employees' && (
            <div className="kpi-card space-y-4 bg-white p-5 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-base font-bold text-gray-800">Shop Staff Directory</h3>
                <button onClick={() => setActiveItem('Employee Management', 'Add Employee')} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                  <Plus size={13} /> Add Employee
                </button>
              </div>
              <DataTable
                columns={[
                  {
                    key: 'name',
                    label: 'Name',
                    render: (val, row) => (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          {val.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 text-xs block">{val}</span>
                          <span className="text-[10px] text-gray-400">{row.phone}</span>
                        </div>
                      </div>
                    )
                  },
                  { key: 'role', label: 'Assigned Role' },
                  { key: 'attendance', label: 'Attendance', render: (val) => <span className="font-semibold text-xs">{val}/26 Days</span> },
                  { key: 'salary', label: 'Base Salary', render: (val) => <span className="font-bold text-xs text-gray-900">₹{val.toLocaleString('en-IN')}</span> },
                  {
                    key: '_id',
                    label: 'Actions',
                    render: (_, row) => (
                      <div className="flex gap-1">
                        <button onClick={() => setSelectedEmpProfile(row)} className="p-1 px-2 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold border">
                          View Profile
                        </button>
                        <button onClick={() => {
                          setEmployees(employees.filter(e => e._id !== row._id))
                          toast.error('Employee account suspended!')
                        }} className="p-1 text-red-500 hover:text-red-750">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )
                  }
                ]}
                data={employees}
                searchPlaceholder="Search staff roster..."
              />

              {/* View Profile Detail Modal */}
              <Modal open={!!selectedEmpProfile} onClose={() => setSelectedEmpProfile(null)} title="Staff Details" size="sm">
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xl mx-auto shadow">
                    {selectedEmpProfile?.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-800">{selectedEmpProfile?.name}</h4>
                    <p className="text-xs text-gray-400 font-bold">{selectedEmpProfile?.role}</p>
                  </div>
                  <div className="text-left text-xs bg-slate-50 p-3 rounded-lg border space-y-2">
                    <div className="flex justify-between"><span className="text-gray-400 font-bold">Phone:</span> <span className="font-semibold text-gray-700">{selectedEmpProfile?.phone}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400 font-bold">Salary:</span> <span className="font-bold text-gray-900">₹{selectedEmpProfile?.salary?.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400 font-bold">Status:</span> <span className="text-green-600 font-bold uppercase text-[9px] bg-green-50 px-1.5 py-0.5 rounded">Active</span></div>
                    <div className="flex justify-between"><span className="text-gray-400 font-bold">Joined:</span> <span className="font-semibold text-gray-600">{selectedEmpProfile?.joinDate}</span></div>
                  </div>
                </div>
              </Modal>
            </div>
          )}

          {activeSubItem === 'Assign Roles' && (
            <div className="kpi-card space-y-4 bg-white p-5 rounded-2xl border border-gray-100">
              <div className="border-b pb-3 mb-4">
                <h3 className="text-base font-bold text-gray-800">Role & Modules Mapping Tree</h3>
                <p className="text-xs text-gray-400 mt-0.5">Control operational authorization classifications.</p>
              </div>
              <div className="space-y-3">
                {['Sales Executive', 'Inventory Manager', 'Warehouse Staff', 'Delivery Executive', 'HR Manager'].map((roleName) => (
                  <div key={roleName} className="p-3 hover:bg-slate-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-xs font-bold text-gray-800 w-44">{roleName}</span>
                    <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-750">
                      {['View Modules', 'Create Records', 'Edit Records', 'Delete Records'].map((perm) => (
                        <label key={perm} className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" defaultChecked={perm === 'View Modules' || (roleName==='HR Manager' && perm!=='Delete Records')} className="rounded accent-emerald-800" />
                          {perm}
                        </label>
                      ))}
                    </div>
                    <button onClick={() => toast.success(`Permissions saved for ${roleName}`)} className="text-[10px] font-bold text-emerald-800 hover:underline">
                      Save Access
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubItem === 'Attendance' && (
            <div className="kpi-card space-y-4 bg-white p-5 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-800">Daily Attendance Register</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Check-in time logs for today's shifts.</p>
                </div>
                <button onClick={() => toast.success('Staff check-in synchronized!')} className="btn-secondary text-xs py-1 px-3">
                  Sync Biometrics
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase bg-gray-50">
                      <th className="p-3">Staff Name</th>
                      <th className="p-3">Check-In</th>
                      <th className="p-3">Check-Out</th>
                      <th className="p-3">Duty Hours</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((r, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-3 font-semibold text-gray-800">{r.name}</td>
                        <td className="p-3 font-mono">{r.checkIn}</td>
                        <td className="p-3 font-mono">{r.checkOut}</td>
                        <td className="p-3 font-bold text-gray-700">{r.hours} hrs</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            r.status === 'Present' ? 'bg-green-100 text-green-800' :
                            r.status === 'Late' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button onClick={() => {
                            const updated = attendanceRecords.map((item, i) => i === idx ? { ...item, status: item.status === 'Present' ? 'Late' : 'Present' } : item)
                            setAttendanceRecords(updated)
                            toast.success('Attendance status modified!')
                          }} className="text-[10px] font-bold text-emerald-800 hover:underline">Toggle Late</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubItem === 'Leave Management' && (
            <div className="space-y-4">
              {/* Approvals */}
              <div className="kpi-card bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-gray-800 border-b pb-3">Pending Leave Applications</h3>
                {leaveRequests.filter(l=>l.status==='Pending').map((l) => (
                  <div key={l.id} className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <span className="font-bold text-xs text-gray-800 block">{l.name} ({l.type})</span>
                      <span className="text-[10px] text-gray-500 mt-1 block">Reason: "{l.reason}" • Dates: {l.start} to {l.end}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        setLeaveRequests(leaveRequests.map(item => item.id === l.id ? { ...item, status: 'Approved' } : item))
                        toast.success('Leave application approved!')
                      }} className="btn-primary text-[10px] py-1 px-3 font-bold">Approve</button>
                      <button onClick={() => {
                        setLeaveRequests(leaveRequests.map(item => item.id === l.id ? { ...item, status: 'Rejected' } : item))
                        toast.error('Leave application rejected!')
                      }} className="btn-secondary text-[10px] py-1 px-3 text-rose-600 border-rose-100">Reject</button>
                    </div>
                  </div>
                ))}
                {leaveRequests.filter(l=>l.status==='Pending').length === 0 && (
                  <div className="text-center text-xs text-gray-400 py-6">All leave applications processed!</div>
                )}
              </div>

              {/* Roster Balance */}
              <div className="kpi-card bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-base font-bold text-gray-855 border-b pb-3 mb-4">Leave Balances</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-gray-400 block text-[9px] uppercase font-bold">Casual Leaves</span>
                    <span className="font-bold text-sm mt-1 block">12 Days</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-gray-400 block text-[9px] uppercase font-bold">Sick Leaves</span>
                    <span className="font-bold text-sm mt-1 block">8 Days</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-gray-400 block text-[9px] uppercase font-bold">Paid Leaves</span>
                    <span className="font-bold text-sm mt-1 block">15 Days</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-gray-400 block text-[9px] uppercase font-bold">Emergency Leaves</span>
                    <span className="font-bold text-sm mt-1 block">3 Days</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubItem === 'Salary Management' && (
            <div className="kpi-card space-y-4 bg-white p-5 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-800">Monthly Payroll ledger</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Base salary payout calculations with bonus incentives.</p>
                </div>
                <button onClick={() => toast.success('Salary disbursement generated!')} className="btn-primary text-xs py-1.5 px-3">
                  Disburse Salaries
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase bg-gray-50">
                      <th className="p-3">Employee</th>
                      <th className="p-3">Salary</th>
                      <th className="p-3">Bonus</th>
                      <th className="p-3">Deduction</th>
                      <th className="p-3">Net Pay</th>
                      <th className="p-3 text-right">Payslip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollRecords.map((p, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-3 font-semibold text-gray-800">{p.name}</td>
                        <td className="p-3 text-gray-600">₹{p.salary.toLocaleString()}</td>
                        <td className="p-3 text-green-600">+₹{p.bonus.toLocaleString()}</td>
                        <td className="p-3 text-red-500">-₹{p.deduction.toLocaleString()}</td>
                        <td className="p-3 font-bold text-gray-900">₹{p.netPay.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => toast.success(`PDF Payslip generated for ${p.name}!`)} className="p-1 px-2.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Download Payslip
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubItem === 'Performance Tracking' && (
            <div className="kpi-card space-y-4 bg-white p-5 rounded-2xl border border-gray-100">
              <h3 className="text-base font-bold text-gray-800 border-b pb-3 mb-4">Productivity Scores & Targets</h3>
              <div className="space-y-4">
                {performanceTracks.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50">
                    <div className="w-44">
                      <span className="text-xs font-bold text-gray-800 block">{p.name}</span>
                      <span className="text-[10px] text-gray-400 font-bold">Target: {p.target}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2 max-w-md">
                      <span className="text-[10px] font-bold text-gray-400 w-16">Productivity:</span>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.productivity}%`, background: p.productivity>=90 ? '#236625' : '#FFA726' }} />
                      </div>
                      <span className="text-xs font-bold text-gray-850 w-10 text-right">{p.productivity}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star size={13} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-black text-gray-800">{p.rating} / 5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubItem === 'GPS Tracking' && (
            <div className="kpi-card space-y-4 bg-white p-5 rounded-2xl border border-gray-100">
              <div className="border-b pb-3 mb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-gray-800">Field Employee Location Map</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Real-time GPS tracker status of delivery executives and field officers.</p>
                </div>
                <button onClick={() => toast.success('GPS coordinates refreshed!')} className="btn-secondary text-xs py-1 px-3">
                  Refresh Coordinates
                </button>
              </div>

              {/* Map Mock Graphics */}
              <div className="h-60 bg-emerald-50/40 rounded-2xl border border-dashed border-emerald-200 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-8 left-12 w-3.5 h-3.5 rounded-full bg-emerald-700 animate-ping" />
                <div className="absolute top-8 left-12 w-2.5 h-2.5 rounded-full bg-emerald-800" />
                <div className="absolute bottom-16 right-24 w-3.5 h-3.5 rounded-full bg-emerald-700 animate-ping" />
                <div className="absolute bottom-16 right-24 w-2.5 h-2.5 rounded-full bg-emerald-800" />
                <span className="text-xs font-black text-emerald-850 bg-white/95 px-3 py-1.5 rounded-full shadow border">Live Map Coverage Active</span>
              </div>

              <div className="space-y-2">
                {gpsLocations.map((loc, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2.5 hover:bg-slate-50/50 rounded-lg border">
                    <div>
                      <span className="font-bold text-gray-850 block">{loc.name}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">Route: {loc.route}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-800 block text-[10px]">{loc.lat}, {loc.lng}</span>
                      <span className="text-[9px] text-gray-400 block mt-0.5">Active {loc.lastActive}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : activeCategory === 'Products' ? (
        <div className="space-y-6">
          {/* Sub-menu Tabs for Products Category */}
          <div className="flex overflow-x-auto gap-2 border-b pb-3 no-scrollbar">
            {['Product Management', 'Categories', 'Brands', 'Product Pricing', 'Discounts', 'Featured Products', 'Product Reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveItem('Products', tab)
                  setEditingProduct(null)
                }}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap border ${
                  activeSubItem === tab
                    ? 'bg-emerald-800 text-white border-emerald-850 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                }`}
              >
                {tab === 'Product Management' && editingProduct ? 'Edit Product' : tab}
              </button>
            ))}
          </div>

          {/* 1. PRODUCT MANAGEMENT VIEW (OVERVIEW + SEARCH/FILTER + LIST TABLE + ADD/EDIT FORM) */}
          {activeSubItem === 'Product Management' && !editingProduct && (
            <div className="space-y-6">
              {/* Product Overview Analytics Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Total Products</span>
                  <span className="text-base font-bold text-gray-800 mt-1 block">{products.length} Products</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Active Products</span>
                  <span className="text-base font-bold text-emerald-700 mt-1 block">
                    {products.filter(p => p.status === 'Active').length} Active
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Featured Items</span>
                  <span className="text-base font-bold text-yellow-600 mt-1 block">
                    {products.filter(p => p.isFeatured).length} Featured
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Low Stock Alerts</span>
                  <span className="text-base font-bold text-red-650 mt-1 block">
                    {products.filter(p => p.stock <= p.reorderLevel).length} Low Stock
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Average GST</span>
                  <span className="text-base font-bold text-emerald-800 mt-1 block">11% Rate</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Categories</span>
                  <span className="text-base font-bold text-emerald-750 mt-1 block">{productCategories.length} Groups</span>
                </div>
              </div>

              {/* Low Stock Alerts Banner Box */}
              {products.filter(p => p.stock <= p.reorderLevel).length > 0 && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-red-650" size={18} />
                    <div>
                      <h4 className="text-xs font-bold text-red-800">Critical Stock Warning</h4>
                      <p className="text-[10px] text-red-700">Some products have dropped below their defined reorder thresholds. Restock immediately to avoid sales blockages.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {products.filter(p => p.stock <= p.reorderLevel).slice(0, 1).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          const updated = products.map(p => p.id === item.id ? { ...p, stock: p.stock + 50 } : p)
                          setProducts(updated)
                          toast.success(`Quick restocked +50 units of ${item.name}!`)
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Restock {item.name.split(' ')[0]} (+50)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Analytics Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Sales Performance */}
                <div className="kpi-card">
                  <h4 className="font-bold text-gray-800 text-xs mb-3">Product Sales Analytics</h4>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={products.map(p => ({ name: p.name.split(' ')[0], sales: p.stock * 8, revenue: p.price * p.stock }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="sales" stroke="#236625" fill="#E8F5E9" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Stock Values */}
                <div className="kpi-card">
                  <h4 className="font-bold text-gray-800 text-xs mb-3">Category Distribution</h4>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productCategories.map((c, i) => ({
                            name: c.name,
                            value: products.filter(p => p.category === c.name).reduce((acc, curr) => acc + curr.stock, 0) || 5
                          }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={55}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {productCategories.map((entry, idx) => (
                            <Cell key={idx} fill={idx % 2 === 0 ? '#236625' : '#66BB6A'} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pricing Distribution */}
                <div className="kpi-card">
                  <h4 className="font-bold text-gray-800 text-xs mb-3">Product Cost vs Price</h4>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={products.map(p => ({ name: p.name.split(' ')[0], Cost: p.purchasePrice, Price: p.price }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Bar dataKey="Cost" fill="#99df9a" />
                        <Bar dataKey="Price" fill="#236625" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Master List Card */}
              <div className="kpi-card space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Master Product Register</h3>
                    <p className="text-[11px] text-gray-400">Total catalog: {products.length} entries registered</p>
                  </div>
                  <button
                    onClick={() => setActiveItem('Products', 'Add Product')}
                    className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Add Product
                  </button>
                </div>

                {/* Filter and Search Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                  <div className="sm:col-span-2 flex items-center gap-2 border rounded-xl px-2.5 bg-slate-50 border-gray-100">
                    <Search size={14} className="text-gray-450" />
                    <input
                      type="text"
                      placeholder="Search by code, SKU, or name..."
                      value={prodSearch}
                      onChange={(e) => { setProdSearch(e.target.value); setProdPage(1); }}
                      className="bg-transparent text-xs outline-none py-2 text-gray-700 w-full font-medium"
                    />
                  </div>

                  <select
                    value={prodCategoryFilter}
                    onChange={(e) => { setProdCategoryFilter(e.target.value); setProdPage(1); }}
                    className="text-xs border rounded-xl px-2 bg-white border-gray-100 py-2 text-gray-700 font-semibold"
                  >
                    <option value="All">All Categories</option>
                    {productCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>

                  <select
                    value={prodBrandFilter}
                    onChange={(e) => { setProdBrandFilter(e.target.value); setProdPage(1); }}
                    className="text-xs border rounded-xl px-2 bg-white border-gray-100 py-2 text-gray-700 font-semibold"
                  >
                    <option value="All">All Brands</option>
                    {productBrands.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                  </select>

                  <select
                    value={prodStatusFilter}
                    onChange={(e) => { setProdStatusFilter(e.target.value); setProdPage(1); }}
                    className="text-xs border rounded-xl px-2 bg-white border-gray-100 py-2 text-gray-700 font-semibold"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Dynamic sorting buttons */}
                <div className="flex flex-wrap gap-2 items-center text-[10px] font-bold text-gray-500 bg-slate-50/50 p-2 rounded-xl border border-gray-100/50">
                  <span>Sort By:</span>
                  {['name', 'price', 'stock', 'id'].map((field) => (
                    <button
                      key={field}
                      onClick={() => {
                        if (prodSortBy === field) {
                          setProdSortOrder(prodSortOrder === 'asc' ? 'desc' : 'asc')
                        } else {
                          setProdSortBy(field)
                          setProdSortOrder('asc')
                        }
                      }}
                      className={`px-2.5 py-1 rounded-md border transition-all ${
                        prodSortBy === field ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      {field.toUpperCase()} {prodSortBy === field && (prodSortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                  ))}
                </div>

                {/* Product Catalog Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b text-gray-400 font-bold uppercase tracking-wider bg-gray-50/70">
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Product Code</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Brand</th>
                        <th className="p-3 text-right">Retail Price</th>
                        <th className="p-3 text-center">Stock</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const filtered = products.filter(p => {
                          const matchesSearch = p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
                            p.id.toLowerCase().includes(prodSearch.toLowerCase()) ||
                            (p.sku && p.sku.toLowerCase().includes(prodSearch.toLowerCase()))
                          const matchesCategory = prodCategoryFilter === 'All' || p.category === prodCategoryFilter
                          const matchesBrand = prodBrandFilter === 'All' || p.brand === prodBrandFilter
                          const matchesStatus = prodStatusFilter === 'All' || p.status === prodStatusFilter
                          return matchesSearch && matchesCategory && matchesBrand && matchesStatus
                        }).sort((a, b) => {
                          let valA = a[prodSortBy]
                          let valB = b[prodSortBy]
                          if (typeof valA === 'string') {
                            return prodSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
                          } else {
                            return prodSortOrder === 'asc' ? valA - valB : valB - valA
                          }
                        })

                        const startIndex = (prodPage - 1) * prodPerPage
                        const pageData = filtered.slice(startIndex, startIndex + prodPerPage)

                        if (pageData.length === 0) {
                          return (
                            <tr>
                              <td colSpan="8" className="p-6 text-center text-gray-400 font-semibold">
                                No products match your search or filter configuration.
                              </td>
                            </tr>
                          )
                        }

                        return (
                          <>
                            {pageData.map((p) => (
                              <tr key={p.id} className="border-b hover:bg-slate-50/40">
                                <td className="p-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-lg overflow-hidden border bg-slate-50 flex items-center justify-center flex-shrink-0">
                                      {p.image ? (
                                        <img src={p.image} alt={p.name} className="object-cover w-full h-full" />
                                      ) : (
                                        <Package size={14} className="text-emerald-800" />
                                      )}
                                    </div>
                                    <div>
                                      <span className="font-bold text-gray-800 text-xs block">{p.name}</span>
                                      <span className="text-[10px] text-gray-400 font-mono">SKU: {p.sku || 'N/A'}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3 font-mono font-bold text-emerald-800">{p.id}</td>
                                <td className="p-3 text-gray-500 font-semibold">{p.category}</td>
                                <td className="p-3 text-gray-500 font-semibold">{p.brand}</td>
                                <td className="p-3 text-right font-black text-gray-900">₹{p.price}</td>
                                <td className="p-3 text-center">
                                  <span className={`font-bold ${p.stock <= p.reorderLevel ? 'text-red-650' : 'text-gray-800'}`}>
                                    {p.stock} units
                                  </span>
                                  {p.stock <= p.reorderLevel && (
                                    <span className="block text-[8px] font-bold text-red-500 uppercase mt-0.5">Low Stock</span>
                                  )}
                                </td>
                                <td className="p-3 text-center">
                                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                    p.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    {p.status}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex justify-end gap-1">
                                    <button
                                      onClick={() => setSelectedProductDetails(p)}
                                      className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-850 text-[10px] font-bold"
                                      title="View Product"
                                    >
                                      <Eye size={12} />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingProduct(p)
                                        setActiveItem('Products', 'Product Management')
                                      }}
                                      className="p-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold"
                                      title="Edit Product"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button
                                      onClick={() => {
                                        const duplicate = {
                                          ...p,
                                          id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
                                          name: `${p.name} (Copy)`,
                                          sku: `${p.sku}-DUP`
                                        }
                                        setProducts([...products, duplicate])
                                        toast.success(`Duplicated "${p.name}" successfully!`)
                                      }}
                                      className="p-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 text-[10px] font-bold"
                                      title="Duplicate Product"
                                    >
                                      <RefreshCw size={12} />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setProducts(products.filter(item => item.id !== p.id))
                                        toast.error(`Removed "${p.name}" from catalog`)
                                      }}
                                      className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold"
                                      title="Delete Product"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {/* Pagination Controls */}
                            <tr>
                              <td colSpan="8" className="p-3 bg-gray-50/50">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-gray-500">
                                    Showing {startIndex + 1} to {Math.min(startIndex + prodPerPage, filtered.length)} of {filtered.length} products
                                  </span>
                                  <div className="flex gap-1">
                                    <button
                                      disabled={prodPage === 1}
                                      onClick={() => setProdPage(prodPage - 1)}
                                      className="px-2.5 py-1 rounded border bg-white font-bold hover:bg-gray-50 disabled:opacity-50 text-[10px]"
                                    >
                                      Prev
                                    </button>
                                    {Array.from({ length: Math.ceil(filtered.length / prodPerPage) }).map((_, i) => (
                                      <button
                                        key={i}
                                        onClick={() => setProdPage(i + 1)}
                                        className={`px-2.5 py-1 rounded border font-bold text-[10px] ${
                                          prodPage === i + 1 ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white hover:bg-gray-50'
                                        }`}
                                      >
                                        {i + 1}
                                      </button>
                                    ))}
                                    <button
                                      disabled={prodPage >= Math.ceil(filtered.length / prodPerPage)}
                                      onClick={() => setProdPage(prodPage + 1)}
                                      className="px-2.5 py-1 rounded border bg-white font-bold hover:bg-gray-50 disabled:opacity-50 text-[10px]"
                                    >
                                      Next
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </>
                        )
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. ADD PRODUCT / EDIT PRODUCT FORM */}
          {((activeSubItem === 'Add Product') || (activeSubItem === 'Product Management' && editingProduct)) && (
            <div className="kpi-card bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-5">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-base font-bold text-gray-800">
                  {editingProduct ? `Edit Product Profile: ${editingProduct.id}` : 'Product Registration Console'}
                </h3>
                <button
                  onClick={() => {
                    setEditingProduct(null)
                    setActiveItem('Products', 'Product Management')
                  }}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  Back to List
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = e.target
                  const name = form.pname.value
                  const category = form.pcat.value
                  const brand = form.pbrand.value
                  const price = Number(form.pprice.value)
                  const purchasePrice = Number(form.ppurchase.value)
                  const stock = Number(form.pstock.value)
                  const sku = form.psku.value
                  const description = form.pdesc.value
                  const unitType = form.punit.value
                  const gst = Number(form.pgst.value)
                  const reorderLevel = Number(form.preorder.value)
                  const expiryDate = form.pexpiry.value
                  const status = form.pstatus.value
                  const image = form.pimage.value || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=150&auto=format&fit=crop&q=60'

                  if (editingProduct) {
                    const updated = products.map(p => p.id === editingProduct.id ? {
                      ...p, name, category, brand, price, purchasePrice, stock, sku, description, unitType, gst, reorderLevel, expiryDate, status, image
                    } : p)
                    setProducts(updated)
                    toast.success('Product updated successfully!')
                    setEditingProduct(null)
                  } else {
                    const newProd = {
                      id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
                      name, category, brand, price, purchasePrice, stock, sku, description, unitType, gst, reorderLevel, expiryDate, status, image, isFeatured: false
                    }
                    setProducts([...products, newProd])
                    toast.success('Product registered successfully!')
                  }
                  setActiveItem('Products', 'Product Management')
                }}
                className="space-y-4 text-xs font-medium text-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left Column - Product details */}
                  <div className="space-y-4 md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold mb-1">Product Name *</label>
                        <input
                          name="pname"
                          className="input-field"
                          required
                          defaultValue={editingProduct?.name || ''}
                          placeholder="E.g., Syngenta Hybrid Corn Seeds"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Product SKU *</label>
                        <div className="flex gap-1.5">
                          <input
                            id="skuInput"
                            name="psku"
                            className="input-field"
                            required
                            defaultValue={editingProduct?.sku || ''}
                            placeholder="E.g., SKU-CRN-902"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('skuInput')
                              if (input) {
                                input.value = 'SKU-' + Math.random().toString(36).substring(3, 8).toUpperCase()
                              }
                            }}
                            className="bg-slate-100 hover:bg-slate-200 px-3 rounded-lg border font-bold text-[10px]"
                          >
                            Auto
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold mb-1">Category *</label>
                        <select name="pcat" className="input-field font-semibold" defaultValue={editingProduct?.category || 'Seeds'}>
                          {productCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Brand *</label>
                        <select name="pbrand" className="input-field font-semibold" defaultValue={editingProduct?.brand || 'IFFCO'}>
                          {productBrands.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Unit Type *</label>
                        <select name="punit" className="input-field font-semibold" defaultValue={editingProduct?.unitType || 'Bag'}>
                          <option value="Bag">Bag (50kg)</option>
                          <option value="Packet">Packet (1kg)</option>
                          <option value="Bottle">Bottle (500ml)</option>
                          <option value="Can">Can (5L)</option>
                          <option value="Kg">Kilogram (kg)</option>
                          <option value="Litre">Litre (L)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block font-bold mb-1">Purchase Price (₹) *</label>
                        <input
                          name="ppurchase"
                          type="number"
                          className="input-field"
                          required
                          defaultValue={editingProduct?.purchasePrice || ''}
                          placeholder="450"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Selling Price (₹) *</label>
                        <input
                          name="pprice"
                          type="number"
                          className="input-field"
                          required
                          defaultValue={editingProduct?.price || ''}
                          placeholder="520"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">GST / Tax (%) *</label>
                        <select name="pgst" className="input-field" defaultValue={editingProduct?.gst || 12}>
                          <option value={0}>0% (Tax Free)</option>
                          <option value={5}>5% (Seeds)</option>
                          <option value={12}>12% (Fertilizers)</option>
                          <option value={18}>18% (Pesticides)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Status</label>
                        <select name="pstatus" className="input-field" defaultValue={editingProduct?.status || 'Active'}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold mb-1">Stock Quantity *</label>
                        <input
                          name="pstock"
                          type="number"
                          className="input-field"
                          required
                          defaultValue={editingProduct?.stock ?? 100}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Reorder Level *</label>
                        <input
                          name="preorder"
                          type="number"
                          className="input-field"
                          required
                          defaultValue={editingProduct?.reorderLevel ?? 15}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Expiry Date</label>
                        <input
                          name="pexpiry"
                          type="date"
                          className="input-field"
                          defaultValue={editingProduct?.expiryDate || '2026-12-31'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Description</label>
                      <textarea
                        name="pdesc"
                        rows={2}
                        className="input-field py-2"
                        defaultValue={editingProduct?.description || ''}
                        placeholder="Detail the catalog description for farmers or POS sales staff..."
                      />
                    </div>
                  </div>

                  {/* Right Column - Image Upload & Preview Options */}
                  <div className="space-y-4 border-l pl-4 border-gray-150">
                    <div>
                      <label className="block font-bold mb-2">Product Image URI</label>
                      <input
                        id="imageInput"
                        name="pimage"
                        className="input-field"
                        defaultValue={editingProduct?.image || ''}
                        placeholder="https://images.unsplash.com/... or choose one below"
                      />
                    </div>

                    {/* Pre-canned stock images */}
                    <div>
                      <span className="block font-bold mb-2 text-gray-500">Quick Preset Stock Images</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { name: 'Seeds', url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=150&auto=format&fit=crop&q=60' },
                          { name: 'Fertilizers', url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8edd85?w=150&auto=format&fit=crop&q=60' },
                          { name: 'Pesticides', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=150&auto=format&fit=crop&q=60' },
                        ].map((img) => (
                          <button
                            key={img.name}
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('imageInput')
                              if (input) {
                                input.value = img.url
                                toast.success(`Selected stock image for ${img.name}!`)
                              }
                            }}
                            className="border hover:border-emerald-600 rounded-lg p-1.5 flex flex-col items-center justify-center gap-1.5 bg-slate-50"
                          >
                            <img src={img.url} alt={img.name} className="w-10 h-10 object-cover rounded" />
                            <span className="text-[9px] font-bold text-gray-600">{img.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Preview Button */}
                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-dashed border-emerald-200 text-center">
                      <p className="text-[10px] text-emerald-800 font-bold mb-2.5">Preview Product Layout before saving</p>
                      <button
                        type="button"
                        onClick={() => {
                          // Compile form details to state preview
                          const p = {
                            name: document.getElementsByName('pname')[0]?.value || 'Mahyco BT Hybrid seeds',
                            category: document.getElementsByName('pcat')[0]?.value || 'Seeds',
                            brand: document.getElementsByName('pbrand')[0]?.value || 'Mahyco',
                            price: Number(document.getElementsByName('pprice')[0]?.value) || 850,
                            stock: Number(document.getElementsByName('pstock')[0]?.value) || 50,
                            image: document.getElementById('imageInput')?.value || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=150&auto=format&fit=crop&q=60'
                          }
                          setPreviewingProduct(p)
                        }}
                        className="bg-white hover:bg-gray-100 text-emerald-800 font-bold py-1.5 px-3 border border-emerald-100 rounded-lg text-[10px] w-full"
                      >
                        Launch Preview
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-3 border-t">
                  <button type="submit" className="btn-primary text-xs py-2 px-5 font-bold uppercase tracking-wider">
                    {editingProduct ? 'Save Modifications' : 'Create Product'}
                  </button>
                  <button type="reset" className="btn-secondary text-xs py-2 px-4 font-bold">Reset Form</button>
                </div>
              </form>

              {/* Form Product Live Layout Preview Modal */}
              <Modal open={!!previewingProduct} onClose={() => setPreviewingProduct(null)} title="Live Product Card Layout" size="sm">
                <div className="space-y-4">
                  <div className="w-full h-44 rounded-xl overflow-hidden border bg-slate-50 relative">
                    <img src={previewingProduct?.image} alt={previewingProduct?.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-emerald-800 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full shadow-sm">
                      {previewingProduct?.category}
                    </span>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-gray-800 text-sm">{previewingProduct?.name}</h4>
                    <p className="text-[11px] text-gray-400 font-bold mt-0.5">{previewingProduct?.brand} Brand</p>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 border p-3 rounded-lg text-xs">
                    <div>
                      <span className="text-gray-400 font-bold block text-[9px] uppercase">Retail Price</span>
                      <span className="text-base font-black text-gray-900">₹{previewingProduct?.price}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 font-bold block text-[9px] uppercase">Available Stock</span>
                      <span className="font-bold text-emerald-800">{previewingProduct?.stock} units</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewingProduct(null)}
                    className="w-full btn-primary py-2 text-xs font-bold uppercase tracking-wider"
                  >
                    Close Preview
                  </button>
                </div>
              </Modal>
            </div>
          )}

          {/* 3. CATEGORIES MANAGEMENT */}
          {activeSubItem === 'Categories' && (
            <div className="kpi-card bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-800">Product Categories Registry</h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Add, rename, or toggle active categories for POS menus.</p>
                </div>
                <button
                  onClick={() => {
                    const catName = prompt('Enter Category Name:')
                    if (catName) {
                      setProductCategories([...productCategories, { name: catName, status: 'Active', count: 0 }])
                      toast.success(`Category "${catName}" added!`)
                    }
                  }}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Plus size={13} /> Add Category
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-bold bg-gray-50">
                      <th className="p-3">Category Name</th>
                      <th className="p-3">Linked Products</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productCategories.map((c, idx) => (
                      <tr key={idx} className="border-b hover:bg-slate-50/40">
                        <td className="p-3 font-semibold text-gray-850">{c.name}</td>
                        <td className="p-3 font-bold text-emerald-800">
                          {products.filter(p => p.category === c.name).length} items
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => {
                                const newName = prompt('Edit Category Name:', c.name)
                                if (newName) {
                                  setProductCategories(productCategories.map((item, i) => i === idx ? { ...item, name: newName } : item))
                                  toast.success('Category updated!')
                                }
                              }}
                              className="p-1 px-2 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setProductCategories(productCategories.map((item, i) => i === idx ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item))
                                toast.success(`Category "${c.name}" status updated!`)
                              }}
                              className="p-1 px-2.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold border"
                            >
                              Toggle
                            </button>
                            <button
                              onClick={() => {
                                setProductCategories(productCategories.filter((_, i) => i !== idx))
                                toast.error('Category deleted!')
                              }}
                              className="p-1 text-red-500 hover:text-red-750"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. BRAND MANAGEMENT */}
          {activeSubItem === 'Brands' && (
            <div className="kpi-card bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-800">Brand Management Directory</h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Verify or add agro-chemical or tool manufacturing brands.</p>
                </div>
                <button
                  onClick={() => {
                    const bName = prompt('Enter Brand Name:')
                    if (bName) {
                      setProductBrands([...productBrands, { name: bName, status: 'Active', logo: bName.slice(0, 2).toUpperCase() }])
                      toast.success(`Brand "${bName}" added!`)
                    }
                  }}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Plus size={13} /> Add Brand
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {productBrands.map((b, idx) => (
                  <div key={idx} className="p-4 rounded-xl border flex items-center justify-between hover:shadow-sm bg-slate-50/20 border-gray-150">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-800 font-black rounded-lg flex items-center justify-center border border-emerald-100 text-xs">
                        {b.logo}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-gray-850 block">{b.name}</span>
                        <span className={`text-[9px] font-bold ${b.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>{b.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          const newName = prompt('Edit Brand Name:', b.name)
                          if (newName) {
                            setProductBrands(productBrands.map((item, i) => i === idx ? { ...item, name: newName, logo: newName.slice(0, 2).toUpperCase() } : item))
                            toast.success('Brand name updated!')
                          }
                        }}
                        className="p-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-[9px] font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setProductBrands(productBrands.map((item, i) => i === idx ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item))
                          toast.success(`Brand status updated!`)
                        }}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 border text-[9px] font-bold text-gray-600"
                      >
                        Toggle
                      </button>
                      <button
                        onClick={() => {
                          setProductBrands(productBrands.filter((_, i) => i !== idx))
                          toast.error('Brand deleted!')
                        }}
                        className="p-1 text-red-500 hover:text-red-750 flex items-center"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. PRODUCT PRICING */}
          {activeSubItem === 'Product Pricing' && (
            <div className="space-y-6">
              {/* Pricing Operations */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bulk Price Adjustments */}
                <div className="kpi-card space-y-3 lg:col-span-1">
                  <h4 className="font-bold text-gray-800 text-xs border-b pb-2">Bulk Pricing Rules</h4>
                  <p className="text-[10px] text-gray-400">Increase or decrease price percentages for categories or brands instantly.</p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const category = e.target.bcat.value
                      const type = e.target.btype.value
                      const percent = Number(e.target.bpercent.value)
                      if (!percent) return

                      const multiplier = type === 'Increase' ? (1 + percent / 100) : (1 - percent / 100)
                      const updated = products.map(p => {
                        if (p.category === category) {
                          const newPrice = Math.round(p.price * multiplier)
                          // Log history
                          setPriceHistory(prev => [
                            { product: p.name, date: new Date().toISOString().split('T')[0], previous: p.price, current: newPrice, reason: `Bulk ${type} by ${percent}%` },
                            ...prev
                          ])
                          return { ...p, price: newPrice }
                        }
                        return p
                      })
                      setProducts(updated)
                      toast.success(`Bulk adjusted pricing for ${category} by ${type === 'Increase' ? '+' : '-'}${percent}%!`)
                    }}
                    className="space-y-2.5 text-[11px] font-medium text-gray-700"
                  >
                    <div>
                      <label className="block mb-0.5">Select Category</label>
                      <select name="bcat" className="input-field py-1 text-xs">
                        {productCategories.map(c => <option key={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-0.5">Action Type</label>
                      <select name="btype" className="input-field py-1 text-xs">
                        <option>Increase</option>
                        <option>Decrease</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-0.5">Percentage (%)</label>
                      <input name="bpercent" type="number" defaultValue="5" className="input-field py-1 text-xs" />
                    </div>
                    <button type="submit" className="w-full btn-primary py-1.5 text-[10px] font-bold uppercase">
                      Execute Bulk Rule
                    </button>
                  </form>
                </div>

                {/* Price Ledger List Table */}
                <div className="kpi-card space-y-3 lg:col-span-2">
                  <h4 className="font-bold text-gray-800 text-xs border-b pb-2">Active Pricing Modifications</h4>
                  <div className="overflow-y-auto max-h-64">
                    <table className="w-full text-[11px] text-left">
                      <thead>
                        <tr className="border-b text-gray-400 font-semibold bg-gray-50/50">
                          <th className="p-2">Product Name</th>
                          <th className="p-2 text-right">Retail Price</th>
                          <th className="p-2 text-center">Tax Split</th>
                          <th className="p-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id} className="border-b hover:bg-slate-50/45">
                            <td className="p-2 font-bold text-gray-800">{p.name}</td>
                            <td className="p-2 text-right font-black text-emerald-800">₹{p.price}</td>
                            <td className="p-2 text-center text-gray-400">{p.gst}% GST</td>
                            <td className="p-2 text-right">
                              <button
                                onClick={() => {
                                  const amt = prompt(`Enter new retail price for ${p.name}:`, p.price)
                                  if (amt && !isNaN(Number(amt))) {
                                    const nextPrice = Number(amt)
                                    setProducts(products.map(item => item.id === p.id ? { ...item, price: nextPrice } : item))
                                    setPriceHistory(prev => [
                                      { product: p.name, date: new Date().toISOString().split('T')[0], previous: p.price, current: nextPrice, reason: 'Manual Adjustment' },
                                      ...prev
                                    ])
                                    toast.success('Price updated!')
                                  }
                                }}
                                className="text-[10px] font-bold text-emerald-800 hover:underline"
                              >
                                Edit Price
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Price Change History Log */}
              <div className="kpi-card bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-xs font-bold text-gray-800">Historical Price Audit Log</h3>
                  <p className="text-[11px] text-gray-400 font-medium">System changes relating to product prices and batch rates.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b text-gray-400 font-semibold bg-gray-50">
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Previous Price</th>
                        <th className="p-3">Current Price</th>
                        <th className="p-3">Modification Reason</th>
                        <th className="p-3">Update Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceHistory.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-3 font-semibold text-gray-855">{item.product}</td>
                          <td className="p-3 font-medium text-red-500">₹{item.previous}</td>
                          <td className="p-3 font-bold text-green-700">₹{item.current}</td>
                          <td className="p-3 text-gray-600 font-medium">{item.reason}</td>
                          <td className="p-3 font-semibold text-gray-400">{item.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. DISCOUNTS MANAGEMENT */}
          {activeSubItem === 'Discounts' && (
            <div className="kpi-card bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-800">Seasonal Offers & Category-wise Promotions</h3>
                  <p className="text-xs text-gray-450 mt-0.5 font-medium">Create discounts mapping percentage reductions.</p>
                </div>
                <button
                  onClick={() => {
                    const dName = prompt('Enter Discount Offer Name:')
                    const rate = Number(prompt('Enter discount percentage (e.g. 15):'))
                    const scope = prompt('Enter discount scope (e.g. Category (Seeds) or Product (Urea)):', 'All catalog')
                    if (dName && !isNaN(rate)) {
                      setProductDiscounts([...productDiscounts, { name: dName, type: 'Percentage', rate, scope: scope || 'All catalog', active: true }])
                      toast.success(`Discount campaign "${dName}" created!`)
                    }
                  }}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Plus size={13} /> Create Discount
                </button>
              </div>

              <div className="space-y-3">
                {productDiscounts.map((d, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border flex justify-between items-center bg-slate-50/40 border-gray-150">
                    <div className="space-y-1">
                      <span className="font-bold text-xs text-gray-855 block">{d.name} ({d.rate}% Off)</span>
                      <span className="text-[10px] text-gray-400 font-semibold block">Type: {d.type} Discount • Scope: {d.scope}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setProductDiscounts(productDiscounts.map((item, i) => i === idx ? { ...item, active: !item.active } : item))
                          toast.success('Discount campaign status toggled!')
                        }}
                        className={`p-1.5 px-3 rounded-lg text-[10px] font-bold border transition-colors ${
                          d.active ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-100'
                        }`}
                      >
                        {d.active ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => {
                          setProductDiscounts(productDiscounts.filter((_, i) => i !== idx))
                          toast.error('Discount campaign deleted!')
                        }}
                        className="p-1.5 text-red-500 hover:text-red-750 flex items-center"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. FEATURED PRODUCTS */}
          {activeSubItem === 'Featured Products' && (
            <div className="kpi-card bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-855 border-b pb-3">Featured Products List</h3>
              <p className="text-xs text-gray-500 font-medium">Products marked as featured will display prominently on local POS terminal screens and client web apps.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {products.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl border flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-white border flex items-center justify-center">
                        <Package size={14} className="text-emerald-850" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-gray-800 block">{p.name}</span>
                        <span className="text-[9px] text-gray-400">{p.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const updated = products.map(item => item.id === p.id ? { ...item, isFeatured: !item.isFeatured } : item)
                        setProducts(updated)
                        toast.success(`${p.name} featured status modified!`)
                      }}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        p.isFeatured ? 'bg-yellow-50 border-yellow-100 text-yellow-600' : 'bg-white border-gray-150 text-gray-300'
                      }`}
                    >
                      <Star size={14} className={p.isFeatured ? 'fill-yellow-500' : ''} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. PRODUCT REVIEWS MODERATION */}
          {activeSubItem === 'Product Reviews' && (
            <div className="kpi-card bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-855">Customer Product Reviews</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Approve or hide customer reviews before publishing on catalogs.</p>
                </div>
                <div className="text-right text-xs">
                  <span className="font-bold text-gray-800 block">Average Store Rating</span>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <span className="font-black text-gray-850">4.1 / 5</span>
                    <div className="flex text-yellow-500"><Star size={11} className="fill-current" /><Star size={11} className="fill-current" /><Star size={11} className="fill-current" /><Star size={11} className="fill-current" /></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {productReviews.map((r, idx) => (
                  <div key={idx} className="p-3.5 border rounded-xl hover:bg-slate-50/50 space-y-2 text-xs border-gray-150 bg-slate-50/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-gray-800 text-xs block">{r.author}</span>
                        <span className="text-[9px] text-gray-400">Verified Farmer</span>
                      </div>
                      <div className="flex gap-0.5 text-yellow-500">
                        {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={11} className="fill-yellow-500" />)}
                      </div>
                    </div>
                    <p className="text-gray-650 font-medium text-xs">"{r.comment}"</p>
                    <div className="flex justify-between items-center pt-2 border-t text-[10px] border-gray-100">
                      <span className={`font-black uppercase tracking-wider text-[9px] ${r.status === 'Approved' ? 'text-green-600' : 'text-amber-600'}`}>{r.status}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setProductReviews(productReviews.map((item, i) => i === idx ? { ...item, status: 'Approved' } : item))
                            toast.success('Review approved!')
                          }}
                          className="font-bold text-emerald-800 hover:underline"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setProductReviews(productReviews.map((item, i) => i === idx ? { ...item, status: 'Hidden' } : item))
                            toast.error('Review hidden!')
                          }}
                          className="font-bold text-amber-800 hover:underline"
                        >
                          Hide Review
                        </button>
                        <button
                          onClick={() => {
                            setProductReviews(productReviews.filter((_, i) => i !== idx))
                            toast.error('Review deleted!')
                          }}
                          className="font-bold text-rose-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View Product Details Modal (Product Details Page) */}
          <Modal open={!!selectedProductDetails} onClose={() => setSelectedProductDetails(null)} title="Product Catalog Detail Profile" size="md">
            <div className="space-y-4 text-xs font-semibold text-gray-700">
              <div className="flex flex-col sm:flex-row gap-4 border-b pb-4">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center overflow-hidden border border-emerald-100 shadow-sm flex-shrink-0">
                  {selectedProductDetails?.image ? (
                    <img src={selectedProductDetails.image} alt={selectedProductDetails.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={28} />
                  )}
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-800">{selectedProductDetails?.name}</h4>
                  <p className="text-xs text-gray-400 font-bold mt-1">Brand: {selectedProductDetails?.brand} • Category: {selectedProductDetails?.category}</p>
                  <p className="text-[10px] text-gray-500 font-normal mt-1.5 leading-relaxed">{selectedProductDetails?.description || 'No description registered for this product variant.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border p-3 rounded-lg space-y-1.5">
                  <span className="block text-gray-400 font-bold uppercase text-[9px]">Inventory Stock details</span>
                  <div className="flex justify-between"><span>Current Stock:</span> <span className="font-bold text-gray-800">{selectedProductDetails?.stock} units</span></div>
                  <div className="flex justify-between"><span>Reorder Threshold:</span> <span className="font-bold text-gray-800">{selectedProductDetails?.reorderLevel} units</span></div>
                  <div className="flex justify-between"><span>Unit Package:</span> <span className="font-bold text-gray-800">{selectedProductDetails?.unitType || 'Bag'}</span></div>
                  <div className="flex justify-between"><span>Expiry Date:</span> <span className="font-bold text-gray-500">{selectedProductDetails?.expiryDate || 'N/A'}</span></div>
                </div>

                <div className="bg-slate-50 border p-3 rounded-lg space-y-1.5">
                  <span className="block text-gray-400 font-bold uppercase text-[9px]">Financial & Tax Rates</span>
                  <div className="flex justify-between"><span>Purchase Price:</span> <span className="font-bold text-gray-800">₹{selectedProductDetails?.purchasePrice || 'N/A'}</span></div>
                  <div className="flex justify-between"><span>Selling Price:</span> <span className="font-black text-emerald-800">₹{selectedProductDetails?.price}</span></div>
                  <div className="flex justify-between"><span>GST Applied:</span> <span className="font-bold text-gray-800">{selectedProductDetails?.gst}%</span></div>
                  <div className="flex justify-between"><span>Active Status:</span> <span className="text-green-600 font-bold">Active</span></div>
                </div>
              </div>

              {/* Mock Sales statistics */}
              <div className="p-3 bg-emerald-50/20 border border-emerald-100 rounded-xl space-y-2">
                <span className="block text-[9px] uppercase font-bold text-emerald-800">Estimated Sales Statistics (Last 30 Days)</span>
                <div className="flex justify-between text-xs">
                  <div><span>Units Sold:</span> <span className="font-bold block text-gray-800 text-sm">180 Packs</span></div>
                  <div><span>Net Revenue:</span> <span className="font-bold block text-emerald-800 text-sm">₹{((selectedProductDetails?.price || 0) * 180).toLocaleString()}</span></div>
                  <div><span>Net Profit:</span> <span className="font-bold block text-emerald-700 text-sm">₹{(((selectedProductDetails?.price || 0) - (selectedProductDetails?.purchasePrice || 0)) * 180).toLocaleString()}</span></div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const reqAmt = prompt('Enter restock replenishment amount:', '50')
                    if (reqAmt && !isNaN(Number(reqAmt))) {
                      const amount = Number(reqAmt)
                      const updated = products.map(p => p.id === selectedProductDetails.id ? { ...p, stock: p.stock + amount } : p)
                      setProducts(updated)
                      setSelectedProductDetails({ ...selectedProductDetails, stock: selectedProductDetails.stock + amount })
                      toast.success(`Replenished +${amount} units to inventory!`)
                    }
                  }}
                  className="flex-1 btn-primary py-2 text-xs font-bold uppercase"
                >
                  Replenish Stock
                </button>
                <button
                  onClick={() => setSelectedProductDetails(null)}
                  className="btn-secondary py-2 px-5 text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        </div>
      ) : activeCategory === 'Inventory Management' ? (
        <div className="space-y-6">

          {/* ===== INVENTORY OVERVIEW ===== */}
          {activeSubItem === 'Stock Overview' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Stock Overview</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Real-time stock health, movement trends and category analytics for your store.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toast.success('Inventory report exported!')} className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5"><Download size={13}/> Export Report</button>
                  <button onClick={() => setShowStockInModal(true)} className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Plus size={13}/> Stock In</button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[{label:'Total Items', val: invStockItems.length, icon: Boxes, color:'#236625', bg:'#E8F5E9'},
                  {label:'In Stock', val: invStockItems.filter(i=>i.status==='In Stock').length, icon: CheckCircle2, color:'#1B5E20', bg:'#C8E6C9'},
                  {label:'Low Stock', val: invStockItems.filter(i=>i.status==='Low Stock').length, icon: AlertTriangle, color:'#E65100', bg:'#FFE0B2'},
                  {label:'Out of Stock', val: invStockItems.filter(i=>i.status==='Out of Stock').length, icon: Ban, color:'#B71C1C', bg:'#FFCDD2'},
                  {label:'Expiring ≤30d', val: expiringItems.filter(i=>i.daysLeft<=30).length, icon: Clock, color:'#F57F17', bg:'#FFF9C4'},
                  {label:'Damage Reports', val: damageReports.length, icon: AlertTriangle, color:'#6A1B9A', bg:'#F3E5F5'},
                ].map((k,i) => (
                  <div key={i} className="kpi-card flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{k.label}</span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:k.bg}}>
                        <k.icon size={15} style={{color:k.color}}/>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-gray-800">{k.val}</span>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stock Movement */}
                <div className="kpi-card lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Stock Movement (This Week)</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stockMovementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="name" tick={{fontSize:10}}/>
                      <YAxis tick={{fontSize:10}}/>
                      <Tooltip/>
                      <Legend/>
                      <Bar dataKey="stockIn" name="Stock In" fill="#236625" radius={[3,3,0,0]}/>
                      <Bar dataKey="stockOut" name="Stock Out" fill="#66BB6A" radius={[3,3,0,0]}/>
                      <Bar dataKey="damage" name="Damage" fill="#EF5350" radius={[3,3,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="kpi-card">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Category Distribution</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={invCategoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                        {invCategoryData.map((entry,i)=>(<Cell key={i} fill={entry.color}/>))}
                      </Pie>
                      <Tooltip formatter={(v,n)=>[`${v} units`,n]}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {invCategoryData.map((c,i)=>(
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{background:c.color}}/>{c.name}</div>
                        <span className="font-bold text-gray-700">{c.value} units</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inventory Value Trend */}
              <div className="kpi-card">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Inventory Value Trend (₹)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={invValueTrend}>
                    <defs>
                      <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#236625" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#236625" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                    <XAxis dataKey="name" tick={{fontSize:10}}/>
                    <YAxis tick={{fontSize:10}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
                    <Tooltip formatter={v=>[`₹${v.toLocaleString()}`, 'Inventory Value']}/>
                    <Area type="monotone" dataKey="value" stroke="#236625" fill="url(#invGrad)" strokeWidth={2}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ===== STOCK MANAGEMENT ===== */}
          {(activeSubItem === 'Stock In' || activeSubItem === 'Stock Out') && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>{activeSubItem === 'Stock In' ? 'Stock In' : 'Stock Out'}</h2>
                  <p className="text-xs text-gray-400">View, update, and manage all stock items across categories. Use Stock In / Stock Out buttons below.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowStockInModal(true)} className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Plus size={13}/> Stock In</button>
                  <button onClick={() => setShowStockOutModal(true)} className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5"><Download size={13}/> Stock Out</button>
                </div>
              </div>

              {/* Filters */}
              <div className="kpi-card">
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-2 border rounded-lg px-3 bg-slate-50 flex-1 min-w-[180px]">
                    <Search size={13} className="text-gray-400"/>
                    <input type="text" placeholder="Search product or ID..." value={invSearch} onChange={e=>setInvSearch(e.target.value)} className="bg-transparent text-xs outline-none py-2 text-gray-700 w-full"/>
                  </div>
                  <select value={invCatFilter} onChange={e=>setInvCatFilter(e.target.value)} className="text-xs font-bold border rounded-lg px-3 py-2 bg-white">
                    <option value="All">All Categories</option>
                    <option>Seeds</option><option>Fertilizers</option><option>Pesticides</option><option>Irrigation Tools</option>
                  </select>
                  <select value={invStatusFilter2} onChange={e=>setInvStatusFilter2(e.target.value)} className="text-xs font-bold border rounded-lg px-3 py-2 bg-white">
                    <option value="All">All Statuses</option>
                    <option>In Stock</option><option>Low Stock</option><option>Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Product ID</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Available</th>
                      <th className="p-3">Reserved</th>
                      <th className="p-3">Reorder Level</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Last Updated</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvItems.map((item,idx)=>(
                      <tr key={idx} className="border-b hover:bg-slate-50/40 transition-colors">
                        <td className="p-3 font-mono text-gray-500">{item.id}</td>
                        <td className="p-3 font-semibold text-gray-800">{item.name}</td>
                        <td className="p-3 text-gray-500">{item.category}</td>
                        <td className={`p-3 font-black ${item.available===0?'text-red-600':item.available<=item.reorderLevel?'text-orange-600':'text-emerald-700'}`}>{item.available} {item.unit}</td>
                        <td className="p-3 text-gray-600">{item.reserved} {item.unit}</td>
                        <td className="p-3 text-gray-500">{item.reorderLevel}</td>
                        <td className="p-3 text-gray-500">{item.location}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            item.status==='In Stock'?'bg-green-100 text-green-800':
                            item.status==='Low Stock'?'bg-orange-100 text-orange-800':
                            'bg-red-100 text-red-800'}`}>{item.status}</span>
                        </td>
                        <td className="p-3 text-gray-400">{item.lastUpdated}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button onClick={()=>setSelectedInvItem(item)} className="text-emerald-700 hover:text-emerald-900" title="View Details"><Eye size={13}/></button>
                            <button onClick={()=>setBarcodeItem(item)} className="text-blue-600 hover:text-blue-800" title="Barcode"><Tag size={13}/></button>
                            <button onClick={()=>{
                              const qty = prompt(`Adjust stock for ${item.name}:`,'+10')
                              if(qty){
                                const delta = parseInt(qty.replace('+',''))
                                const dir = qty.trim().startsWith('-')?-1:1
                                setInvStockItems(prev=>prev.map(p=>p.id===item.id?{...p,available:Math.max(0,p.available+(dir*Math.abs(delta))),lastUpdated:new Date().toISOString().split('T')[0]}:p))
                                setInvTransactions(prev=>[{id:`TXN-${Date.now()}`,type:'Stock Adjustment',product:item.name,qty:delta*dir,unit:item.unit,date:new Date().toISOString().split('T')[0],by:'Admin',reason:'Manual Adjustment',ref:`ADJ-${Date.now()}`,valueChange:0},...prev])
                                toast.success(`Stock adjusted for ${item.name}!`)
                              }
                            }} className="text-gray-500 hover:text-gray-800" title="Adjust"><Edit2 size={13}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredInvItems.length===0&&(
                      <tr><td colSpan="10" className="p-6 text-center text-gray-400 font-semibold">No items match the current filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Item Detail Modal */}
              {selectedInvItem&&(
                <Modal isOpen={!!selectedInvItem} onClose={()=>setSelectedInvItem(null)} title={`Stock Details — ${selectedInvItem.name}`}>
                  <div className="space-y-3 text-xs text-gray-600">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-lg space-y-1.5">
                        <span className="block font-bold text-[9px] text-gray-400 uppercase">Stock Info</span>
                        <div className="flex justify-between"><span>Available:</span><span className="font-bold text-emerald-700">{selectedInvItem.available} {selectedInvItem.unit}</span></div>
                        <div className="flex justify-between"><span>Reserved:</span><span className="font-bold">{selectedInvItem.reserved}</span></div>
                        <div className="flex justify-between"><span>Reorder Level:</span><span className="font-bold">{selectedInvItem.reorderLevel}</span></div>
                        <div className="flex justify-between"><span>Location:</span><span className="font-bold">{selectedInvItem.location}</span></div>
                        <div className="flex justify-between"><span>Batch No:</span><span className="font-bold text-blue-700">{selectedInvItem.batchNo}</span></div>
                        <div className="flex justify-between"><span>Expiry:</span><span className="font-bold text-orange-600">{selectedInvItem.expiryDate}</span></div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg space-y-1.5">
                        <span className="block font-bold text-[9px] text-gray-400 uppercase">Pricing</span>
                        <div className="flex justify-between"><span>Purchase Price:</span><span className="font-bold">₹{selectedInvItem.purchasePrice}</span></div>
                        <div className="flex justify-between"><span>Selling Price:</span><span className="font-black text-emerald-700">₹{selectedInvItem.sellingPrice}</span></div>
                        <div className="flex justify-between"><span>Margin:</span><span className="font-bold text-blue-700">₹{selectedInvItem.sellingPrice-selectedInvItem.purchasePrice}</span></div>
                        <div className="flex justify-between"><span>Stock Value:</span><span className="font-bold">₹{(selectedInvItem.available*selectedInvItem.purchasePrice).toLocaleString()}</span></div>
                      </div>
                    </div>
                    <button onClick={()=>setSelectedInvItem(null)} className="w-full btn-secondary py-2 text-xs font-bold">Close</button>
                  </div>
                </Modal>
              )}

              {/* Barcode Modal */}
              {barcodeItem&&(
                <Modal isOpen={!!barcodeItem} onClose={()=>setBarcodeItem(null)} title={`Barcode / QR — ${barcodeItem.name}`}>
                  <div className="space-y-4 text-center">
                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6">
                      {/* Simulated barcode using CSS stripes */}
                      <div className="flex justify-center mb-3">
                        <div className="flex gap-0.5 items-end h-16">
                          {Array.from({length:30}).map((_,i)=>(
                            <div key={i} style={{width:i%3===0?3:i%5===0?2:1,height:i%4===0?`${56}px`:i%3===0?`${48}px`:`${40}px`,background:'#1a1a1a'}} className="rounded-sm"/>
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] font-mono text-gray-700 tracking-widest">{barcodeItem.batchNo}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{barcodeItem.id} • {barcodeItem.name}</p>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex justify-between bg-slate-50 px-3 py-1.5 rounded-lg"><span>Product ID:</span><span className="font-bold">{barcodeItem.id}</span></div>
                      <div className="flex justify-between bg-slate-50 px-3 py-1.5 rounded-lg"><span>Batch No:</span><span className="font-bold">{barcodeItem.batchNo}</span></div>
                      <div className="flex justify-between bg-slate-50 px-3 py-1.5 rounded-lg"><span>Category:</span><span className="font-bold">{barcodeItem.category}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>toast.success('Barcode printed!')} className="flex-1 btn-primary py-2 text-xs font-bold flex items-center justify-center gap-1.5"><Printer size={12}/> Print Barcode</button>
                      <button onClick={()=>setBarcodeItem(null)} className="btn-secondary px-4 py-2 text-xs font-bold">Close</button>
                    </div>
                  </div>
                </Modal>
              )}

              {/* Stock In Modal */}
              <Modal isOpen={showStockInModal} onClose={()=>setShowStockInModal(false)} title="Record Stock In">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Product</label>
                      <select id="stockInProduct" className="w-full border rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2" style={{focusRingColor:'#236625'}}>
                        {invStockItems.map(i=>(<option key={i.id} value={i.id}>{i.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Quantity</label>
                      <input id="stockInQty" type="number" min="1" defaultValue="10" className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Supplier / PO Ref</label>
                      <input id="stockInRef" type="text" placeholder="e.g. PO-2026-055" className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reason</label>
                      <select id="stockInReason" className="w-full border rounded-lg px-3 py-2 text-xs bg-white">
                        <option>Regular Restock</option><option>Supplier Delivery</option><option>Return from Branch</option><option>Sample Stock</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={()=>{
                      const prodId = document.getElementById('stockInProduct').value
                      const qty = parseInt(document.getElementById('stockInQty').value)||0
                      const ref = document.getElementById('stockInRef').value||`PO-${Date.now()}`
                      const reason = document.getElementById('stockInReason').value
                      if(qty>0){
                        setInvStockItems(prev=>prev.map(p=>p.id===prodId?{...p,available:p.available+qty,status:p.available+qty>p.reorderLevel?'In Stock':p.status,lastUpdated:new Date().toISOString().split('T')[0]}:p))
                        const prod = invStockItems.find(p=>p.id===prodId)
                        setInvTransactions(prev=>[{id:`TXN-${Date.now()}`,type:'Stock In',product:prod?.name||prodId,qty,unit:prod?.unit||'Unit',date:new Date().toISOString().split('T')[0],by:'Admin',reason,ref,valueChange:(prod?.purchasePrice||0)*qty},...prev])
                        toast.success(`Stock In recorded: +${qty} units`)
                        setShowStockInModal(false)
                      }else toast.error('Please enter a valid quantity.')
                    }} className="flex-1 btn-primary py-2 text-xs font-bold">Confirm Stock In</button>
                    <button onClick={()=>setShowStockInModal(false)} className="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                  </div>
                </div>
              </Modal>

              {/* Stock Out Modal */}
              <Modal isOpen={showStockOutModal} onClose={()=>setShowStockOutModal(false)} title="Record Stock Out">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Product</label>
                      <select id="stockOutProduct" className="w-full border rounded-lg px-3 py-2 text-xs bg-white">
                        {invStockItems.map(i=>(<option key={i.id} value={i.id}>{i.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Quantity</label>
                      <input id="stockOutQty" type="number" min="1" defaultValue="5" className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Order / Invoice Ref</label>
                      <input id="stockOutRef" type="text" placeholder="e.g. INV-9099" className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reason</label>
                      <select id="stockOutReason" className="w-full border rounded-lg px-3 py-2 text-xs bg-white">
                        <option>Customer Sale</option><option>Branch Transfer</option><option>Sample Issue</option><option>Return to Supplier</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={()=>{
                      const prodId = document.getElementById('stockOutProduct').value
                      const qty = parseInt(document.getElementById('stockOutQty').value)||0
                      const ref = document.getElementById('stockOutRef').value||`INV-${Date.now()}`
                      const reason = document.getElementById('stockOutReason').value
                      const prod = invStockItems.find(p=>p.id===prodId)
                      if(qty>0&&prod&&prod.available>=qty){
                        setInvStockItems(prev=>prev.map(p=>p.id===prodId?{
                          ...p,
                          available:p.available-qty,
                          status:p.available-qty===0?'Out of Stock':p.available-qty<=p.reorderLevel?'Low Stock':'In Stock',
                          lastUpdated:new Date().toISOString().split('T')[0]
                        }:p))
                        setInvTransactions(prev=>[{id:`TXN-${Date.now()}`,type:'Stock Out',product:prod.name,qty,unit:prod.unit,date:new Date().toISOString().split('T')[0],by:'Admin',reason,ref,valueChange:-(prod.sellingPrice*qty)},...prev])
                        toast.success(`Stock Out recorded: -${qty} units`)
                        setShowStockOutModal(false)
                      }else if(prod&&qty>prod.available){
                        toast.error(`Only ${prod.available} units available!`)
                      }else toast.error('Invalid quantity.')
                    }} className="flex-1 btn-primary py-2 text-xs font-bold">Confirm Stock Out</button>
                    <button onClick={()=>setShowStockOutModal(false)} className="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                  </div>
                </div>
              </Modal>
            </div>
          )}

          {/* ===== LOW STOCK ALERTS ===== */}
          {activeSubItem === 'Low Stock Alerts' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Low Stock Alerts</h2>
                  <p className="text-xs text-gray-400">Products at or below reorder level requiring immediate attention.</p>
                </div>
                <button onClick={()=>toast.success('Reorder requests sent to all suppliers!')} className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Send size={13}/> Reorder All</button>
              </div>

              {lowStockAlerts.length===0?(
                <div className="kpi-card text-center py-12">
                  <CheckCircle2 size={40} className="mx-auto text-green-500 mb-3"/>
                  <h3 className="font-bold text-gray-700">All stock levels are healthy!</h3>
                  <p className="text-xs text-gray-400 mt-1">No products are currently below their reorder threshold.</p>
                </div>
              ):(
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowStockAlerts.map((item,idx)=>(
                    <div key={idx} className={`kpi-card border-l-4 ${item.available===0?'border-red-500':'border-orange-400'}`}>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <p className="text-sm font-bold text-gray-800 leading-tight">{item.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{item.id} • {item.category}</p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${
                          item.available===0?'bg-red-100 text-red-700':'bg-orange-100 text-orange-700'}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-gray-600"><span>Available:</span><span className={`font-black ${item.available===0?'text-red-600':'text-orange-600'}`}>{item.available} {item.unit}</span></div>
                        <div className="flex justify-between text-gray-600"><span>Reorder Level:</span><span className="font-bold text-gray-700">{item.reorderLevel} {item.unit}</span></div>
                        <div className="flex justify-between text-gray-600"><span>Location:</span><span className="font-bold">{item.location}</span></div>
                        {/* Stock level bar */}
                        <div className="mt-2">
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${item.available===0?'bg-red-500':'bg-orange-400'}`}
                              style={{width:`${Math.min(100,(item.available/Math.max(item.reorderLevel*2,1))*100)}%`}}/>
                          </div>
                          <p className="text-[9px] text-gray-400 mt-1">{item.available} of {item.reorderLevel*2} optimal stock</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={()=>{
                          setInvStockItems(prev=>prev.map(p=>p.id===item.id?{...p,available:p.available+p.reorderLevel*2,status:'In Stock',lastUpdated:new Date().toISOString().split('T')[0]}:p))
                          setInvTransactions(prev=>[{id:`TXN-${Date.now()}`,type:'Stock In',product:item.name,qty:item.reorderLevel*2,unit:item.unit,date:new Date().toISOString().split('T')[0],by:'Admin',reason:'Emergency Restock',ref:`EMG-${Date.now()}`,valueChange:item.purchasePrice*item.reorderLevel*2},...prev])
                          toast.success(`Emergency restock placed for ${item.name}!`)
                        }} className="flex-1 btn-primary py-1.5 text-[10px] font-bold flex items-center justify-center gap-1"><RefreshCw size={10}/> Quick Restock</button>
                        <button onClick={()=>toast.success(`PO raised for ${item.name}`)} className="btn-secondary py-1.5 px-3 text-[10px] font-bold">Raise PO</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== EXPIRY TRACKER ===== */}
          {activeSubItem === 'Expiry Tracking' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Expiry Tracker</h2>
                  <p className="text-xs text-gray-400">Monitor product expiry dates and take timely action to prevent losses.</p>
                </div>
                <button onClick={()=>toast.success('Expiry report downloaded!')} className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5"><Download size={13}/> Download Report</button>
              </div>

              {/* Summary Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{label:'Critical (≤15 days)', val:expiringItems.filter(i=>i.daysLeft<=15).length, color:'bg-red-50 border-red-200 text-red-700'},
                  {label:'Expiring Soon (≤90d)', val:expiringItems.filter(i=>i.daysLeft<=90).length, color:'bg-orange-50 border-orange-200 text-orange-700'},
                  {label:'OK (>90 days)', val:expiringItems.filter(i=>i.daysLeft>90).length, color:'bg-green-50 border-green-200 text-green-700'},
                  {label:'Total Tracked', val:expiringItems.length, color:'bg-blue-50 border-blue-200 text-blue-700'},
                ].map((s,i)=>(
                  <div key={i} className={`border rounded-xl p-4 ${s.color}`}>
                    <p className="text-2xl font-black">{s.val}</p>
                    <p className="text-[10px] font-bold mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Expiry Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Batch No.</th>
                      <th className="p-3">Expiry Date</th>
                      <th className="p-3">Days Left</th>
                      <th className="p-3">Qty in Stock</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiringItems.map((item,idx)=>(
                      <tr key={idx} className="border-b hover:bg-slate-50/40">
                        <td className="p-3 font-semibold text-gray-800">{item.name}</td>
                        <td className="p-3 font-mono text-blue-600">{item.batch}</td>
                        <td className="p-3 text-gray-600">{item.expiry}</td>
                        <td className={`p-3 font-black ${item.daysLeft<=15?'text-red-600':item.daysLeft<=90?'text-orange-600':'text-green-700'}`}>{item.daysLeft} days</td>
                        <td className="p-3 text-gray-700 font-bold">{item.qty}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            item.status==='Critical'?'bg-red-100 text-red-700':
                            item.status==='Expiring Soon'?'bg-orange-100 text-orange-700':
                            'bg-green-100 text-green-700'}`}>{item.status}</span>
                        </td>
                        <td className="p-3">
                          <button onClick={()=>toast.success(`Action taken for ${item.name}`)} className="text-[10px] font-bold text-emerald-700 hover:underline">Mark Action</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== DAMAGE REPORTS ===== */}
          {activeSubItem === 'Damage Reports' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Damage Reports</h2>
                  <p className="text-xs text-gray-400">Log and track damaged inventory for write-offs and supplier claims.</p>
                </div>
                <button onClick={()=>setShowDamageModal(true)} className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Plus size={13}/> Report Damage</button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[{label:'Total Reports', val:damageReports.length, color:'text-gray-800'},
                  {label:'Verified', val:damageReports.filter(d=>d.status==='Verified').length, color:'text-green-700'},
                  {label:'Pending Review', val:damageReports.filter(d=>d.status==='Pending Review').length, color:'text-orange-600'},
                ].map((s,i)=>(
                  <div key={i} className="kpi-card text-center">
                    <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Report ID</th>
                      <th className="p-3">Product</th>
                      <th className="p-3">Qty Lost</th>
                      <th className="p-3">Value Lost</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Reported By</th>
                      <th className="p-3">Cause</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    {damageReports.map((d,idx)=>(
                      <tr key={idx} className="border-b hover:bg-slate-50/40">
                        <td className="p-3 font-mono text-gray-500">{d.id}</td>
                        <td className="p-3 font-semibold text-gray-800">{d.product}</td>
                        <td className="p-3 font-bold text-red-600">{d.qty} units</td>
                        <td className="p-3 font-bold text-red-700">₹{d.value.toLocaleString()}</td>
                        <td className="p-3 text-gray-500">{d.date}</td>
                        <td className="p-3 text-gray-600">{d.reportedBy}</td>
                        <td className="p-3 text-gray-600">{d.cause}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            d.status==='Verified'?'bg-green-100 text-green-700':'bg-orange-100 text-orange-700'}`}>{d.status}</span>
                        </td>
                        <td className="p-3 text-gray-500">{d.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Report Damage Modal */}
              <Modal isOpen={showDamageModal} onClose={()=>setShowDamageModal(false)} title="Report Damaged Stock">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Product</label>
                      <select id="dmgProduct" className="w-full border rounded-lg px-3 py-2 text-xs bg-white">
                        {invStockItems.map(i=>(<option key={i.id} value={i.id}>{i.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Qty Damaged</label>
                      <input id="dmgQty" type="number" min="1" defaultValue="1" className="w-full border rounded-lg px-3 py-2 text-xs"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Cause of Damage</label>
                      <select id="dmgCause" className="w-full border rounded-lg px-3 py-2 text-xs bg-white">
                        <option>Transit Breakage</option><option>Water Damage</option><option>Packaging Defect</option><option>Theft</option><option>Expiry</option><option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Action</label>
                      <select id="dmgAction" className="w-full border rounded-lg px-3 py-2 text-xs bg-white">
                        <option>Write-off</option><option>Supplier Claim Filed</option><option>Under Investigation</option><option>Insurance Claim</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={()=>{
                      const prodId = document.getElementById('dmgProduct').value
                      const qty = parseInt(document.getElementById('dmgQty').value)||1
                      const cause = document.getElementById('dmgCause').value
                      const action = document.getElementById('dmgAction').value
                      const prod = invStockItems.find(p=>p.id===prodId)
                      const newReport = {id:`DMG-${String(damageReports.length+1).padStart(3,'0')}`,product:prod?.name||prodId,qty,value:(prod?.purchasePrice||0)*qty,date:new Date().toISOString().split('T')[0],reportedBy:'Admin',cause,status:'Pending Review',action}
                      setDamageReports(prev=>[...prev,newReport])
                      if(prod) setInvStockItems(prev=>prev.map(p=>p.id===prodId?{...p,available:Math.max(0,p.available-qty),lastUpdated:new Date().toISOString().split('T')[0]}:p))
                      toast.success('Damage report filed successfully!')
                      setShowDamageModal(false)
                    }} className="flex-1 btn-primary py-2 text-xs font-bold">Submit Report</button>
                    <button onClick={()=>setShowDamageModal(false)} className="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                  </div>
                </div>
              </Modal>
            </div>
          )}

          {/* ===== TRANSACTION HISTORY ===== */}
          {activeSubItem === 'Inventory Reports' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Inventory Reports</h2>
                  <p className="text-xs text-gray-400">Complete ledger of all stock movements — in, out, adjustments, transfers and damage.</p>
                </div>
                <button onClick={()=>toast.success('Transaction ledger exported!')} className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5"><Download size={13}/> Export Ledger</button>
              </div>

              {/* Filters */}
              <div className="kpi-card">
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-2 border rounded-lg px-3 bg-slate-50 flex-1 min-w-[180px]">
                    <Search size={13} className="text-gray-400"/>
                    <input type="text" placeholder="Search product or reference..." value={txnSearch} onChange={e=>setTxnSearch(e.target.value)} className="bg-transparent text-xs outline-none py-2 text-gray-700 w-full"/>
                  </div>
                  <select value={txnTypeFilter} onChange={e=>setTxnTypeFilter(e.target.value)} className="text-xs font-bold border rounded-lg px-3 py-2 bg-white">
                    <option value="All">All Types</option>
                    <option>Stock In</option><option>Stock Out</option><option>Stock Adjustment</option><option>Damage Report</option><option>Transfer</option>
                  </select>
                </div>
              </div>

              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">TXN ID</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Product</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Done By</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Value Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTxns.map((t,idx)=>(
                      <tr key={idx} className="border-b hover:bg-slate-50/40 transition-colors">
                        <td className="p-3 font-mono text-gray-500">{t.id}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            t.type==='Stock In'?'bg-green-100 text-green-700':
                            t.type==='Stock Out'?'bg-blue-100 text-blue-700':
                            t.type==='Damage Report'?'bg-red-100 text-red-700':
                            t.type==='Transfer'?'bg-purple-100 text-purple-700':
                            'bg-orange-100 text-orange-700'}`}>{t.type}</span>
                        </td>
                        <td className="p-3 font-semibold text-gray-800">{t.product}</td>
                        <td className={`p-3 font-black ${t.type==='Stock In'?'text-emerald-700':'text-gray-700'}`}>{t.type==='Stock In'?'+':''}{t.qty} {t.unit}</td>
                        <td className="p-3 text-gray-500">{t.date}</td>
                        <td className="p-3 text-gray-600">{t.by}</td>
                        <td className="p-3 text-gray-500">{t.reason}</td>
                        <td className="p-3 font-mono text-blue-600">{t.ref}</td>
                        <td className={`p-3 font-bold ${t.valueChange>=0?'text-emerald-700':'text-red-600'}`}>{t.valueChange>=0?'+':''}₹{Math.abs(t.valueChange).toLocaleString()}</td>
                      </tr>
                    ))}
                    {filteredTxns.length===0&&(
                      <tr><td colSpan="9" className="p-6 text-center text-gray-400 font-semibold">No transactions match the current filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== BARCODE GENERATOR (standalone sub-page) ===== */}
          {activeSubItem === 'Barcode / QR Tracking' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Barcode / QR Generator</h2>
                <p className="text-xs text-gray-400">Generate and print barcodes for all inventory items.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {invStockItems.map((item,idx)=>(
                  <div key={idx} className="kpi-card text-center hover:shadow-md transition-shadow">
                    <p className="text-sm font-bold text-gray-800 mb-3 leading-tight">{item.name}</p>
                    <div className="bg-white border rounded-xl p-4 mb-3">
                      <div className="flex justify-center mb-2">
                        <div className="flex gap-0.5 items-end h-12">
                          {Array.from({length:28}).map((_,i)=>(
                            <div key={i} style={{width:i%3===0?3:i%5===0?2:1,height:i%4===0?'46px':i%3===0?'38px':'30px',background:'#1a1a1a'}} className="rounded-sm"/>
                          ))}
                        </div>
                      </div>
                      <p className="text-[9px] font-mono text-gray-500 tracking-widest">{item.batchNo}</p>
                    </div>
                    <div className="text-[10px] text-gray-500 space-y-0.5 mb-3">
                      <div className="flex justify-between"><span>ID:</span><span className="font-bold">{item.id}</span></div>
                      <div className="flex justify-between"><span>Category:</span><span className="font-bold">{item.category}</span></div>
                      <div className="flex justify-between"><span>Price:</span><span className="font-bold text-emerald-700">₹{item.sellingPrice}</span></div>
                    </div>
                    <button onClick={()=>toast.success(`Barcode for ${item.name} sent to printer!`)} className="w-full btn-primary py-1.5 text-[10px] font-bold flex items-center justify-center gap-1.5"><Printer size={11}/> Print Label</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback for unknown Inventory sub-items */}
          {!['Stock Overview','Stock In','Stock Out','Low Stock Alerts','Expiry Tracking','Barcode / QR Tracking','Damage Reports','Inventory Reports'].includes(activeSubItem) && (
            <div className="kpi-card text-center py-12">
              <Boxes size={40} className="mx-auto text-emerald-300 mb-3"/>
              <h3 className="font-bold text-gray-700">Inventory Module</h3>
              <p className="text-xs text-gray-400 mt-1">Select a sub-section from the sidebar to manage your inventory.</p>
            </div>
          )}
        </div>
      ) : activeCategory === 'Purchase Management' ? (
        <div className="space-y-6">

          {/* ===== SUPPLIERS ===== */}
          {activeSubItem === 'Suppliers' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{fontFamily:'Poppins,sans-serif'}}>Supplier Management</h2>
                  <p className="text-xs text-gray-400">Manage your product suppliers, payment terms and relationships.</p>
                </div>
                <button onClick={()=>setShowAddSupplierModal(true)} className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Plus size={13}/> Add Supplier</button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{label:'Total Suppliers',val:suppliers.length,color:'text-gray-800'},
                  {label:'Active',val:suppliers.filter(s=>s.status==='Active').length,color:'text-green-700'},
                  {label:'Total Purchase Value',val:'\u20b9'+suppliers.reduce((s,i)=>s+i.totalPurchases,0).toLocaleString(),color:'text-emerald-700'},
                  {label:'Avg Rating',val:(suppliers.reduce((s,i)=>s+i.rating,0)/suppliers.length).toFixed(1)+' \u2605',color:'text-amber-600'},
                ].map((k,i)=>(
                  <div key={i} className="kpi-card">
                    <p className={`text-xl font-black ${k.color}`}>{k.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div className="kpi-card">
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-2 border rounded-lg px-3 bg-slate-50 flex-1 min-w-[180px]">
                    <Search size={13} className="text-gray-400"/>
                    <input type="text" placeholder="Search suppliers..." value={supSearch} onChange={e=>setSupSearch(e.target.value)} className="bg-transparent text-xs outline-none py-2 text-gray-700 w-full"/>
                  </div>
                  <select value={supStatusFilter} onChange={e=>setSupStatusFilter(e.target.value)} className="text-xs font-bold border rounded-lg px-3 py-2 bg-white">
                    <option value="All">All Status</option>
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
              </div>

              {/* Supplier Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {suppliers
                  .filter(s=>{
                    const ms = s.name.toLowerCase().includes(supSearch.toLowerCase()) || s.contact.toLowerCase().includes(supSearch.toLowerCase())
                    return ms && (supStatusFilter==='All' || s.status===supStatusFilter)
                  })
                  .map((s,idx)=>(
                    <div key={idx} className="kpi-card hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0" style={{background:'linear-gradient(135deg,#236625,#66BB6A)'}}>
                            {s.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-800 leading-tight truncate max-w-[150px]">{s.name}</p>
                            <p className="text-[10px] text-gray-400">{s.id}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${s.status==='Active'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{s.status}</span>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600 mb-3">
                        <div className="flex items-center gap-2"><Phone size={10} className="text-gray-400"/> {s.phone}</div>
                        <div className="flex items-center gap-2"><Mail size={10} className="text-gray-400"/> {s.email}</div>
                        <div className="flex items-center gap-2"><MapPin size={10} className="text-gray-400"/> {s.address}</div>
                        <div className="flex items-center gap-2"><Tag size={10} className="text-gray-400"/> {s.categories}</div>
                      </div>
                      <div className="flex justify-between text-xs mb-3 bg-slate-50 rounded-lg p-2">
                        <div><span className="text-gray-400 text-[10px]">Total Purchases</span><p className="font-black text-emerald-700">{`\u20b9${s.totalPurchases.toLocaleString()}`}</p></div>
                        <div className="text-right"><span className="text-gray-400 text-[10px]">Rating</span><p className="font-black text-amber-600">{`\u2605 ${s.rating}`}</p></div>
                        <div className="text-right"><span className="text-gray-400 text-[10px]">Terms</span><p className="font-bold text-gray-700">{s.paymentTerms}</p></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={()=>setSelectedSupplier(s)} className="flex-1 btn-primary py-1.5 text-[10px] font-bold flex items-center justify-center gap-1"><Eye size={10}/> View</button>
                        <button onClick={()=>{setEditingSupplier(s);setShowAddSupplierModal(true)}} className="btn-secondary py-1.5 px-3 text-[10px] font-bold"><Edit2 size={10}/></button>
                        <button onClick={()=>{setSuppliers(prev=>prev.filter(x=>x.id!==s.id));toast.success('Supplier removed!')}} className="text-red-500 hover:bg-red-50 border border-red-200 rounded-lg py-1.5 px-3 text-[10px]"><Trash2 size={10}/></button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* View Supplier Modal */}
              {selectedSupplier && (
                <Modal isOpen={!!selectedSupplier} onClose={()=>setSelectedSupplier(null)} title={`Supplier Details \u2014 ${selectedSupplier.name}`}>
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-lg space-y-1.5">
                        <span className="block font-bold text-[9px] text-gray-400 uppercase">Contact Info</span>
                        <div className="flex justify-between"><span className="text-gray-500">Contact:</span><span className="font-bold">{selectedSupplier.contact}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Phone:</span><span className="font-bold">{selectedSupplier.phone}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Email:</span><span className="font-bold text-blue-600">{selectedSupplier.email}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Address:</span><span className="font-bold">{selectedSupplier.address}</span></div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg space-y-1.5">
                        <span className="block font-bold text-[9px] text-gray-400 uppercase">Business Info</span>
                        <div className="flex justify-between"><span className="text-gray-500">GST No.:</span><span className="font-mono font-bold text-[10px]">{selectedSupplier.gst}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Payment Terms:</span><span className="font-bold text-emerald-700">{selectedSupplier.paymentTerms}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Categories:</span><span className="font-bold">{selectedSupplier.categories}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Rating:</span><span className="font-bold text-amber-600">{`\u2605 ${selectedSupplier.rating}`}</span></div>
                      </div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center">
                      <p className="text-[10px] text-gray-500">Total Purchase Value</p>
                      <p className="text-2xl font-black text-emerald-700">{`\u20b9${selectedSupplier.totalPurchases.toLocaleString()}`}</p>
                    </div>
                    <button onClick={()=>setSelectedSupplier(null)} className="w-full btn-secondary py-2 text-xs font-bold">Close</button>
                  </div>
                </Modal>
              )}

              {/* Add / Edit Supplier Modal */}
              <Modal isOpen={showAddSupplierModal} onClose={()=>{setShowAddSupplierModal(false);setEditingSupplier(null)}} title={editingSupplier ? `Edit Supplier` : 'Add New Supplier'}>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {id:'supName',label:'Company Name',ph:'e.g. IFFCO Trading Division',def:editingSupplier?.name||''},
                      {id:'supContact',label:'Contact Person',ph:'e.g. Rajesh Verma',def:editingSupplier?.contact||''},
                      {id:'supPhone',label:'Mobile Number',ph:'+91 98765 43210',def:editingSupplier?.phone||''},
                      {id:'supEmail',label:'Email Address',ph:'supplier@email.com',def:editingSupplier?.email||''},
                      {id:'supGst',label:'GST Number',ph:'27AAAAA1234A1Z1',def:editingSupplier?.gst||''},
                      {id:'supAddress',label:'Address',ph:'City, State',def:editingSupplier?.address||''},
                    ].map(f=>(
                      <div key={f.id}>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{f.label}</label>
                        <input id={f.id} type="text" placeholder={f.ph} defaultValue={f.def} className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"/>
                      </div>
                    ))}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Payment Terms</label>
                      <select id="supTerms" defaultValue={editingSupplier?.paymentTerms||'Net 30'} className="w-full border rounded-lg px-3 py-2 text-xs bg-white">
                        <option>Net 15</option><option>Net 30</option><option>Net 45</option><option>Net 60</option><option>Advance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Status</label>
                      <select id="supStatus" defaultValue={editingSupplier?.status||'Active'} className="w-full border rounded-lg px-3 py-2 text-xs bg-white">
                        <option>Active</option><option>Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={()=>{
                      const name=document.getElementById('supName').value
                      const contact=document.getElementById('supContact').value
                      const phone=document.getElementById('supPhone').value
                      const email=document.getElementById('supEmail').value
                      const gst=document.getElementById('supGst').value
                      const address=document.getElementById('supAddress').value
                      const paymentTerms=document.getElementById('supTerms').value
                      const status=document.getElementById('supStatus').value
                      if(!name){toast.error('Company name is required!');return}
                      if(editingSupplier){
                        setSuppliers(prev=>prev.map(s=>s.id===editingSupplier.id?{...s,name,contact,phone,email,gst,address,paymentTerms,status}:s))
                        toast.success('Supplier updated!')
                      }else{
                        setSuppliers(prev=>[...prev,{id:`SUP-${String(prev.length+1).padStart(3,'0')}`,name,contact,phone,email,gst,address,categories:'General',paymentTerms,status,totalPurchases:0,rating:4.0}])
                        toast.success('Supplier added!')
                      }
                      setShowAddSupplierModal(false);setEditingSupplier(null)
                    }} className="flex-1 btn-primary py-2 text-xs font-bold">{editingSupplier?'Update Supplier':'Add Supplier'}</button>
                    <button onClick={()=>{setShowAddSupplierModal(false);setEditingSupplier(null)}} className="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                  </div>
                </div>
              </Modal>
            </div>
          )}

          {/* ===== PURCHASE ORDERS ===== */}
          {activeSubItem === 'Purchase Orders' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{fontFamily:'Poppins,sans-serif'}}>Purchase Orders</h2>
                  <p className="text-xs text-gray-400">Create, manage and track all purchase orders with suppliers.</p>
                </div>
                <button onClick={()=>setShowCreatePOModal(true)} className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Plus size={13}/> Create PO</button>
              </div>

              {/* PO Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[{label:'Total POs',val:purchaseOrders.length,color:'text-gray-800'},
                  {label:'Draft',val:purchaseOrders.filter(p=>p.status==='Draft').length,color:'text-gray-500'},
                  {label:'Pending',val:purchaseOrders.filter(p=>p.status==='Pending').length,color:'text-orange-600'},
                  {label:'Approved',val:purchaseOrders.filter(p=>p.status==='Approved').length,color:'text-blue-600'},
                  {label:'Received',val:purchaseOrders.filter(p=>p.status==='Received').length,color:'text-green-700'},
                ].map((k,i)=>(
                  <div key={i} className="kpi-card">
                    <p className={`text-2xl font-black ${k.color}`}>{k.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="kpi-card">
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-2 border rounded-lg px-3 bg-slate-50 flex-1 min-w-[180px]">
                    <Search size={13} className="text-gray-400"/>
                    <input type="text" placeholder="Search PO ID or supplier..." value={poSearch} onChange={e=>setPoSearch(e.target.value)} className="bg-transparent text-xs outline-none py-2 text-gray-700 w-full"/>
                  </div>
                  <select value={poStatusFilter} onChange={e=>setPoStatusFilter(e.target.value)} className="text-xs font-bold border rounded-lg px-3 py-2 bg-white">
                    <option value="All">All Status</option>
                    <option>Draft</option><option>Pending</option><option>Approved</option><option>Received</option><option>Cancelled</option>
                  </select>
                </div>
              </div>

              {/* PO Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">PO Number</th>
                      <th className="p-3">Supplier</th>
                      <th className="p-3">Products</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">PO Date</th>
                      <th className="p-3">Exp. Delivery</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrders
                      .filter(p=>{
                        const ms=p.id.toLowerCase().includes(poSearch.toLowerCase())||p.supplier.toLowerCase().includes(poSearch.toLowerCase())
                        return ms&&(poStatusFilter==='All'||p.status===poStatusFilter)
                      })
                      .map((po,idx)=>(
                        <tr key={idx} className="border-b hover:bg-slate-50/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-blue-600">{po.id}</td>
                          <td className="p-3 font-semibold text-gray-800 max-w-[140px] truncate">{po.supplier}</td>
                          <td className="p-3 text-gray-500 max-w-[180px] truncate">{po.items}</td>
                          <td className="p-3 font-black text-emerald-700">{`\u20b9${po.totalAmount.toLocaleString()}`}</td>
                          <td className="p-3 text-gray-500">{po.date}</td>
                          <td className="p-3 text-gray-500">{po.expectedDelivery}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              po.status==='Received'?'bg-green-100 text-green-700':
                              po.status==='Approved'?'bg-blue-100 text-blue-700':
                              po.status==='Pending'?'bg-orange-100 text-orange-700':
                              po.status==='Draft'?'bg-gray-100 text-gray-600':
                              'bg-red-100 text-red-700'}`}>{po.status}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2 items-center">
                              <button onClick={()=>setSelectedPO(po)} className="text-emerald-700 hover:text-emerald-900" title="View"><Eye size={13}/></button>
                              {po.status==='Approved'&&(
                                <button onClick={()=>setShowGRNModal(po)} className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100">GRN</button>
                              )}
                              {(po.status==='Draft'||po.status==='Pending')&&(
                                <button onClick={()=>{setPurchaseOrders(prev=>prev.map(p=>p.id===po.id?{...p,status:'Cancelled'}:p));toast.success(`PO ${po.id} cancelled`)}} className="text-red-500 hover:text-red-700" title="Cancel"><Ban size={13}/></button>
                              )}
                              <button onClick={()=>toast.success(`PO ${po.id} downloaded!`)} className="text-gray-500 hover:text-gray-700" title="Download"><Download size={13}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {purchaseOrders.filter(p=>(poStatusFilter==='All'||p.status===poStatusFilter)&&(p.id.toLowerCase().includes(poSearch.toLowerCase())||p.supplier.toLowerCase().includes(poSearch.toLowerCase()))).length===0&&(
                      <tr><td colSpan="8" className="p-6 text-center text-gray-400 font-semibold">No purchase orders match the current filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* View PO Modal */}
              {selectedPO&&(
                <Modal isOpen={!!selectedPO} onClose={()=>setSelectedPO(null)} title={`Purchase Order \u2014 ${selectedPO.id}`}>
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-lg space-y-1.5">
                        <span className="block text-[9px] font-bold text-gray-400 uppercase">PO Details</span>
                        <div className="flex justify-between"><span className="text-gray-500">PO Number:</span><span className="font-mono font-bold text-blue-700">{selectedPO.id}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Supplier:</span><span className="font-bold">{selectedPO.supplier}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">PO Date:</span><span className="font-bold">{selectedPO.date}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Exp. Delivery:</span><span className="font-bold">{selectedPO.expectedDelivery}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Status:</span>
                          <span className={`font-bold ${selectedPO.status==='Received'?'text-green-700':selectedPO.status==='Approved'?'text-blue-700':'text-orange-600'}`}>{selectedPO.status}</span>
                        </div>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg space-y-1.5">
                        <span className="block text-[9px] font-bold text-emerald-700 uppercase">Financial Summary</span>
                        <div className="flex justify-between"><span className="text-gray-500">Total Amount:</span><span className="font-black text-emerald-700">{`\u20b9${selectedPO.totalAmount.toLocaleString()}`}</span></div>
                        <div><span className="text-gray-500">Products:</span><p className="font-bold text-gray-700 mt-0.5 text-[10px]">{selectedPO.items}</p></div>
                        {selectedPO.remarks&&<div><span className="text-gray-500">Remarks:</span><p className="font-bold text-gray-700 mt-0.5">{selectedPO.remarks}</p></div>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {selectedPO.status==='Draft'&&(
                        <button onClick={()=>{setPurchaseOrders(prev=>prev.map(p=>p.id===selectedPO.id?{...p,status:'Pending'}:p));toast.success('PO sent to supplier!');setSelectedPO(null)}} className="flex-1 btn-primary py-2 text-xs font-bold flex items-center justify-center gap-1"><Send size={11}/> Send to Supplier</button>
                      )}
                      {selectedPO.status==='Pending'&&(
                        <button onClick={()=>{setPurchaseOrders(prev=>prev.map(p=>p.id===selectedPO.id?{...p,status:'Approved'}:p));toast.success('PO Approved!');setSelectedPO(null)}} className="flex-1 btn-primary py-2 text-xs font-bold flex items-center justify-center gap-1"><CheckCircle2 size={11}/> Approve PO</button>
                      )}
                      <button onClick={()=>toast.success(`PO ${selectedPO.id} downloaded!`)} className="btn-secondary px-3 py-2 text-xs font-bold flex items-center gap-1"><Download size={11}/> Download</button>
                      <button onClick={()=>setSelectedPO(null)} className="btn-secondary px-4 py-2 text-xs font-bold">Close</button>
                    </div>
                  </div>
                </Modal>
              )}

              {/* Create PO Modal */}
              <Modal isOpen={showCreatePOModal} onClose={()=>setShowCreatePOModal(false)} title="Create Purchase Order">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Supplier</label>
                      <select id="poSupplier" className="w-full border rounded-lg px-3 py-2 text-xs bg-white">
                        {suppliers.filter(s=>s.status==='Active').map(s=>(<option key={s.id} value={s.id}>{s.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Expected Delivery Date</label>
                      <input id="poDelivery" type="date" className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"/>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Products &amp; Quantities</label>
                      <textarea id="poItems" rows={3} placeholder="e.g. Urea 50kg (100 bags), NPK 19:19:19 (200 packs)" className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none resize-none"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Total Amount (\u20b9)</label>
                      <input id="poAmount" type="number" placeholder="Enter total PO value" className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Remarks</label>
                      <input id="poRemarks" type="text" placeholder="Optional notes..." className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"/>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>{
                      const supId=document.getElementById('poSupplier').value
                      const delivery=document.getElementById('poDelivery').value
                      const items=document.getElementById('poItems').value
                      const amount=parseFloat(document.getElementById('poAmount').value)||0
                      const remarks=document.getElementById('poRemarks').value
                      const sup=suppliers.find(s=>s.id===supId)
                      if(!items||amount<=0){toast.error('Please fill in products and amount!');return}
                      const newPO={id:`PO-2026-${String(purchaseOrders.length+1).padStart(3,'0')}`,supplier:sup?.name||supId,supId,items,totalAmount:amount,date:new Date().toISOString().split('T')[0],expectedDelivery:delivery||'TBD',status:'Draft',remarks}
                      setPurchaseOrders(prev=>[...prev,newPO])
                      toast.success('Purchase Order created as Draft!')
                      setShowCreatePOModal(false)
                    }} className="flex-1 btn-primary py-2 text-xs font-bold">Create PO (Draft)</button>
                    <button onClick={()=>setShowCreatePOModal(false)} className="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                  </div>
                </div>
              </Modal>

              {/* GRN Modal */}
              {showGRNModal&&(
                <Modal isOpen={!!showGRNModal} onClose={()=>setShowGRNModal(null)} title={`Goods Receipt Note \u2014 ${showGRNModal.id}`}>
                  <div className="space-y-3 text-xs">
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
                      <p className="font-bold text-blue-800">{showGRNModal.supplier}</p>
                      <p className="text-blue-600 text-[11px] mt-0.5">{showGRNModal.items}</p>
                      <p className="text-blue-500 text-[10px] mt-1">PO Value: {`\u20b9${showGRNModal.totalAmount.toLocaleString()}`}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Received Qty</label>
                        <input id="grnReceived" type="text" placeholder="e.g. 98 of 100 bags" className="w-full border rounded-lg px-3 py-2 text-xs"/>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Damaged Qty</label>
                        <input id="grnDamage" type="number" placeholder="0" defaultValue="0" className="w-full border rounded-lg px-3 py-2 text-xs"/>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Quality Check</label>
                        <select id="grnQuality" className="w-full border rounded-lg px-3 py-2 text-xs bg-white">
                          <option>Passed</option><option>Minor Issues</option><option>Major Issues</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Remarks</label>
                        <input id="grnRemarks" type="text" placeholder="Condition notes..." className="w-full border rounded-lg px-3 py-2 text-xs"/>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>{
                        const quality=document.getElementById('grnQuality').value
                        const remarks=document.getElementById('grnRemarks').value
                        setPurchaseOrders(prev=>prev.map(p=>p.id===showGRNModal.id?{...p,status:'Received',remarks:`GRN ${quality}: ${remarks||'Goods received OK'}`}:p))
                        toast.success(`Goods received for ${showGRNModal.id}! Inventory updated.`)
                        setShowGRNModal(null)
                      }} className="flex-1 btn-primary py-2 text-xs font-bold flex items-center justify-center gap-1"><CheckCircle2 size={11}/> Confirm Receipt</button>
                      <button onClick={()=>setShowGRNModal(null)} className="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          )}

          {/* ===== PURCHASE HISTORY ===== */}
          {activeSubItem === 'Purchase History' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{fontFamily:'Poppins,sans-serif'}}>Purchase History</h2>
                  <p className="text-xs text-gray-400">Full history of all procurement transactions and purchase orders.</p>
                </div>
                <button onClick={()=>toast.success('Purchase history exported!')} className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5"><Download size={13}/> Export</button>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="kpi-card">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Monthly Purchase Trend (\u20b9)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={purchaseTrendData}>
                      <defs>
                        <linearGradient id="purGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#236625" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#236625" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="name" tick={{fontSize:10}}/>
                      <YAxis tick={{fontSize:10}} tickFormatter={v=>`\u20b9${(v/1000).toFixed(0)}K`}/>
                      <Tooltip formatter={v=>[`\u20b9${v.toLocaleString()}`,'Purchase Amount']}/>
                      <Area type="monotone" dataKey="amount" stroke="#236625" fill="url(#purGrad)" strokeWidth={2}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="kpi-card">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Supplier Performance (Delivery % vs Quality %)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={supplierPerfData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis type="number" tick={{fontSize:10}} domain={[0,100]}/>
                      <YAxis dataKey="name" type="category" tick={{fontSize:10}} width={60}/>
                      <Tooltip/>
                      <Legend/>
                      <Bar dataKey="onTime" name="On-Time %" fill="#236625" radius={[0,3,3,0]}/>
                      <Bar dataKey="quality" name="Quality %" fill="#66BB6A" radius={[0,3,3,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Pie + Trend summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="kpi-card">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">Category-wise Procurement</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={purchaseCatData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                        {purchaseCatData.map((e,i)=>(<Cell key={i} fill={e.color}/>))}
                      </Pie>
                      <Tooltip formatter={(v,n)=>[`\u20b9${v.toLocaleString()}`,n]}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-1">
                    {purchaseCatData.map((c,i)=>(
                      <div key={i} className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{background:c.color}}/>{c.name}</div>
                        <span className="font-bold">{`\u20b9${(c.value/1000).toFixed(0)}K`}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="kpi-card lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">Top Suppliers by Volume</h3>
                  <div className="space-y-2">
                    {suppliers.sort((a,b)=>b.totalPurchases-a.totalPurchases).slice(0,5).map((s,i)=>(
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400 w-5">{i+1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-700 truncate max-w-[200px]">{s.name}</span>
                            <span className="text-xs font-black text-emerald-700">{`\u20b9${(s.totalPurchases/1000).toFixed(0)}K`}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-emerald-500" style={{width:`${(s.totalPurchases/560000)*100}%`}}/>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filters + History Table */}
              <div className="kpi-card">
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-2 border rounded-lg px-3 bg-slate-50 flex-1 min-w-[180px]">
                    <Search size={13} className="text-gray-400"/>
                    <input type="text" placeholder="Search PO ID or supplier..." value={phSearch} onChange={e=>setPhSearch(e.target.value)} className="bg-transparent text-xs outline-none py-2 text-gray-700 w-full"/>
                  </div>
                  <select value={phSupFilter} onChange={e=>setPhSupFilter(e.target.value)} className="text-xs font-bold border rounded-lg px-3 py-2 bg-white">
                    <option value="All">All Suppliers</option>
                    {suppliers.map(s=>(<option key={s.id}>{s.name}</option>))}
                  </select>
                  <select value={phStatusFilter} onChange={e=>setPhStatusFilter(e.target.value)} className="text-xs font-bold border rounded-lg px-3 py-2 bg-white">
                    <option value="All">All Status</option>
                    <option>Draft</option><option>Pending</option><option>Approved</option><option>Received</option><option>Cancelled</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                        <th className="p-3">Purchase ID</th>
                        <th className="p-3">Supplier</th>
                        <th className="p-3">Products</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseOrders
                        .filter(p=>{
                          const ms=p.id.toLowerCase().includes(phSearch.toLowerCase())||p.supplier.toLowerCase().includes(phSearch.toLowerCase())
                          return ms&&(phSupFilter==='All'||p.supplier===phSupFilter)&&(phStatusFilter==='All'||p.status===phStatusFilter)
                        })
                        .map((po,idx)=>(
                          <tr key={idx} className="border-b hover:bg-slate-50/40">
                            <td className="p-3 font-mono font-bold text-blue-600">{po.id}</td>
                            <td className="p-3 font-semibold text-gray-800 max-w-[140px] truncate">{po.supplier}</td>
                            <td className="p-3 text-gray-500 max-w-[160px] truncate">{po.items}</td>
                            <td className="p-3 font-black text-emerald-700">{`\u20b9${po.totalAmount.toLocaleString()}`}</td>
                            <td className="p-3 text-gray-500">{po.date}</td>
                            <td className="p-3">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                po.status==='Received'?'bg-green-100 text-green-700':
                                po.status==='Approved'?'bg-blue-100 text-blue-700':
                                po.status==='Pending'?'bg-orange-100 text-orange-700':
                                po.status==='Draft'?'bg-gray-100 text-gray-600':
                                'bg-red-100 text-red-700'}`}>{po.status}</span>
                            </td>
                            <td className="p-3">
                              <button onClick={()=>toast.success(`Invoice for ${po.id} downloaded!`)} className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-1"><Download size={10}/> Invoice</button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== PURCHASE RETURNS ===== */}
          {activeSubItem === 'Purchase Returns' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{fontFamily:'Poppins,sans-serif'}}>Purchase Returns</h2>
                  <p className="text-xs text-gray-400">Manage returns for damaged, wrong, or excess goods received from suppliers.</p>
                </div>
                <button onClick={()=>setShowReturnModal(true)} className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Plus size={13}/> New Return</button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{label:'Total Returns',val:purchaseReturns.length,color:'text-gray-800'},
                  {label:'Pending',val:purchaseReturns.filter(r=>r.status==='Pending').length,color:'text-orange-600'},
                  {label:'Approved',val:purchaseReturns.filter(r=>r.status==='Approved').length,color:'text-blue-600'},
                  {label:'Total Value Returned',val:`\u20b9${purchaseReturns.reduce((s,r)=>s+r.value,0).toLocaleString()}`,color:'text-red-600'},
                ].map((k,i)=>(
                  <div key={i} className="kpi-card">
                    <p className={`text-xl font-black ${k.color}`}>{k.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Returns Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Return ID</th>
                      <th className="p-3">Supplier</th>
                      <th className="p-3">Product</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Value</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">PO Ref</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseReturns
                      .filter(r=>r.supplier.toLowerCase().includes(retSearch.toLowerCase())||r.product.toLowerCase().includes(retSearch.toLowerCase()))
                      .map((r,idx)=>(
                        <tr key={idx} className="border-b hover:bg-slate-50/40">
                          <td className="p-3 font-mono text-gray-500">{r.id}</td>
                          <td className="p-3 font-semibold text-gray-800 max-w-[130px] truncate">{r.supplier}</td>
                          <td className="p-3 text-gray-600 max-w-[140px] truncate">{r.product}</td>
                          <td className="p-3 font-bold text-red-600">{r.qty} units</td>
                          <td className="p-3 font-bold text-red-700">{`\u20b9${r.value.toLocaleString()}`}</td>
                          <td className="p-3 text-gray-500 max-w-[160px] truncate">{r.reason}</td>
                          <td className="p-3 text-gray-500">{r.date}</td>
                          <td className="p-3 font-mono text-blue-600">{r.poRef}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              r.status==='Completed'?'bg-green-100 text-green-700':
                              r.status==='Approved'?'bg-blue-100 text-blue-700':
                              'bg-orange-100 text-orange-700'}`}>{r.status}</span>
                          </td>
                          <td className="p-3">
                            {r.status==='Pending'&&(
                              <button onClick={()=>{setPurchaseReturns(prev=>prev.map(x=>x.id===r.id?{...x,status:'Approved'}:x));toast.success(`Return ${r.id} approved!`)}} className="text-[10px] font-bold text-emerald-700 hover:underline">Approve</button>
                            )}
                            {r.status==='Approved'&&(
                              <button onClick={()=>{setPurchaseReturns(prev=>prev.map(x=>x.id===r.id?{...x,status:'Completed'}:x));toast.success(`Return ${r.id} completed!`)}} className="text-[10px] font-bold text-blue-700 hover:underline">Complete</button>
                            )}
                            {r.status==='Completed'&&<span className="text-[10px] text-gray-400">Done</span>}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* New Return Modal */}
              <Modal isOpen={showReturnModal} onClose={()=>setShowReturnModal(false)} title="Create Return Request">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Supplier</label>
                      <select id="retSupplier" className="w-full border rounded-lg px-3 py-2 text-xs bg-white">
                        {suppliers.map(s=>(<option key={s.id} value={s.name}>{s.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">PO Reference</label>
                      <select id="retPO" className="w-full border rounded-lg px-3 py-2 text-xs bg-white">
                        {purchaseOrders.map(p=>(<option key={p.id} value={p.id}>{p.id}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Product Name</label>
                      <input id="retProduct" type="text" placeholder="e.g. Urea 50kg" className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Quantity</label>
                      <input id="retQty" type="number" min="1" defaultValue="1" className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Return Value (\u20b9)</label>
                      <input id="retValue" type="number" placeholder="Total return value" className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reason</label>
                      <select id="retReason" className="w-full border rounded-lg px-3 py-2 text-xs bg-white">
                        <option>Damaged packaging on arrival</option>
                        <option>Wrong product delivered</option>
                        <option>Quality not as ordered</option>
                        <option>Near expiry products</option>
                        <option>Order cancelled - excess stock</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>{
                      const supplier=document.getElementById('retSupplier').value
                      const poRef=document.getElementById('retPO').value
                      const product=document.getElementById('retProduct').value
                      const qty=parseInt(document.getElementById('retQty').value)||1
                      const value=parseFloat(document.getElementById('retValue').value)||0
                      const reason=document.getElementById('retReason').value
                      if(!product){toast.error('Please enter product name!');return}
                      setPurchaseReturns(prev=>[...prev,{id:`RET-${String(prev.length+1).padStart(3,'0')}`,supplier,product,qty,value,reason,date:new Date().toISOString().split('T')[0],status:'Pending',poRef}])
                      toast.success('Return request created!')
                      setShowReturnModal(false)
                    }} className="flex-1 btn-primary py-2 text-xs font-bold">Submit Return</button>
                    <button onClick={()=>setShowReturnModal(false)} className="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                  </div>
                </div>
              </Modal>
            </div>
          )}

          {/* ===== SUPPLIER PAYMENTS ===== */}
          {activeSubItem === 'Supplier Payments' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{fontFamily:'Poppins,sans-serif'}}>Supplier Payments</h2>
                  <p className="text-xs text-gray-400">Track, manage and record all supplier invoice payments.</p>
                </div>
                <button onClick={()=>toast.success('Payment report downloaded!')} className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5"><Download size={13}/> Download Report</button>
              </div>

              {/* Payment KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {label:'Total Payable',val:`\u20b9${supplierPayments.reduce((s,p)=>s+p.amount,0).toLocaleString()}`,color:'text-gray-800',bg:'bg-white'},
                  {label:'Paid',val:`\u20b9${supplierPayments.filter(p=>p.status==='Paid').reduce((s,p)=>s+p.amount,0).toLocaleString()}`,color:'text-green-700',bg:'bg-green-50'},
                  {label:'Pending',val:`\u20b9${supplierPayments.filter(p=>p.status==='Pending').reduce((s,p)=>s+p.amount,0).toLocaleString()}`,color:'text-orange-600',bg:'bg-orange-50'},
                  {label:'Overdue',val:`\u20b9${supplierPayments.filter(p=>p.status==='Overdue').reduce((s,p)=>s+p.amount,0).toLocaleString()}`,color:'text-red-600',bg:'bg-red-50'},
                ].map((k,i)=>(
                  <div key={i} className={`kpi-card border ${k.bg}`}>
                    <p className={`text-xl font-black ${k.color}`}>{k.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="kpi-card">
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 border rounded-lg px-3 bg-slate-50 flex-1 min-w-[180px]">
                    <Search size={13} className="text-gray-400"/>
                    <input type="text" placeholder="Search supplier or invoice..." value={paySearch} onChange={e=>setPaySearch(e.target.value)} className="bg-transparent text-xs outline-none py-2 text-gray-700 w-full"/>
                  </div>
                  <select value={payStatusFilter} onChange={e=>setPayStatusFilter(e.target.value)} className="text-xs font-bold border rounded-lg px-3 py-2 bg-white">
                    <option value="All">All Status</option>
                    <option>Pending</option><option>Paid</option><option>Overdue</option><option>Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Payments Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Pay ID</th>
                      <th className="p-3">Supplier</th>
                      <th className="p-3">Invoice No.</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Paid Date</th>
                      <th className="p-3">Mode</th>
                      <th className="p-3">PO Ref</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierPayments
                      .filter(p=>{
                        const ms=p.supplier.toLowerCase().includes(paySearch.toLowerCase())||p.invoice.toLowerCase().includes(paySearch.toLowerCase())
                        return ms&&(payStatusFilter==='All'||p.status===payStatusFilter)
                      })
                      .map((pay,idx)=>(
                        <tr key={idx} className="border-b hover:bg-slate-50/40 transition-colors">
                          <td className="p-3 font-mono text-gray-500">{pay.id}</td>
                          <td className="p-3 font-semibold text-gray-800 max-w-[130px] truncate">{pay.supplier}</td>
                          <td className="p-3 font-mono text-blue-600 text-[10px]">{pay.invoice}</td>
                          <td className="p-3 font-black text-gray-800">{`\u20b9${pay.amount.toLocaleString()}`}</td>
                          <td className={`p-3 font-bold ${pay.status==='Overdue'?'text-red-600':'text-gray-500'}`}>{pay.dueDate}</td>
                          <td className="p-3 text-gray-500">{pay.paidDate||'\u2014'}</td>
                          <td className="p-3 text-gray-500">{pay.mode}</td>
                          <td className="p-3 font-mono text-blue-500 text-[10px]">{pay.poRef}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              pay.status==='Paid'?'bg-green-100 text-green-700':
                              pay.status==='Overdue'?'bg-red-100 text-red-700':
                              pay.status==='Pending'?'bg-orange-100 text-orange-700':
                              'bg-gray-100 text-gray-500'}`}>{pay.status}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2 items-center">
                              {(pay.status==='Pending'||pay.status==='Overdue')&&(
                                <button onClick={()=>setShowPaymentModal(pay)} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded">Pay Now</button>
                              )}
                              <button onClick={()=>toast.success(`Invoice ${pay.invoice} downloaded!`)} className="text-gray-500 hover:text-gray-700"><Download size={12}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Record Payment Modal */}
              {showPaymentModal&&(
                <Modal isOpen={!!showPaymentModal} onClose={()=>setShowPaymentModal(null)} title={`Record Payment \u2014 ${showPaymentModal.invoice}`}>
                  <div className="space-y-3">
                    <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl">
                      <p className="text-xs font-bold text-orange-800">{showPaymentModal.supplier}</p>
                      <p className="text-[10px] text-orange-600">Invoice: {showPaymentModal.invoice}</p>
                      <p className="text-2xl font-black text-orange-700 mt-1">{`\u20b9${showPaymentModal.amount.toLocaleString()}`}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Payment Date</label>
                        <input id="payDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"/>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Payment Mode</label>
                        <select id="payMode" className="w-full border rounded-lg px-3 py-2 text-xs bg-white">
                          <option>NEFT</option><option>RTGS</option><option>Cheque</option><option>UPI</option><option>Cash</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reference No.</label>
                        <input id="payRef" type="text" placeholder="UTR / Cheque / Txn No." className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"/>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Notes</label>
                        <input id="payNotes" type="text" placeholder="Optional..." className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"/>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>{
                        const paidDate=document.getElementById('payDate').value
                        const mode=document.getElementById('payMode').value
                        setSupplierPayments(prev=>prev.map(p=>p.id===showPaymentModal.id?{...p,status:'Paid',paidDate,mode}:p))
                        toast.success(`Payment of \u20b9${showPaymentModal.amount.toLocaleString()} recorded for ${showPaymentModal.supplier}!`)
                        setShowPaymentModal(null)
                      }} className="flex-1 btn-primary py-2 text-xs font-bold flex items-center justify-center gap-1"><CheckCircle2 size={11}/> Confirm Payment</button>
                      <button onClick={()=>setShowPaymentModal(null)} className="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          )}

          {/* Fallback overview for Purchase Management */}
          {!['Suppliers','Purchase Orders','Purchase History','Purchase Returns','Supplier Payments'].includes(activeSubItem) && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{fontFamily:'Poppins,sans-serif'}}>Purchase Overview</h2>
                <p className="text-xs text-gray-400">Procurement dashboard for your store. Select a section from sidebar.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  {label:'Total POs',val:purchaseOrders.length},
                  {label:'Monthly Value',val:`\u20b9${(purchaseTrendData[4].amount/1000).toFixed(0)}K`},
                  {label:'Active Suppliers',val:suppliers.filter(s=>s.status==='Active').length},
                  {label:'Pending POs',val:purchaseOrders.filter(p=>p.status==='Pending').length},
                  {label:'Returns',val:purchaseReturns.length},
                  {label:'Pending Payments',val:supplierPayments.filter(p=>p.status==='Pending'||p.status==='Overdue').length},
                ].map((k,i)=>(
                  <div key={i} className="kpi-card">
                    <p className="text-xl font-black text-gray-800">{k.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{k.label}</p>
                  </div>
                ))}
              </div>
              <div className="kpi-card text-center py-8">
                <ShoppingBag size={36} className="mx-auto text-emerald-300 mb-3"/>
                <h3 className="font-bold text-gray-700">Purchase Management</h3>
                <p className="text-xs text-gray-400 mt-1">Select a module from the sidebar to manage procurement activities.</p>
              </div>
            </div>
          )}
        </div>
      ) : activeCategory === 'Order Management' ? (
        <div className="space-y-6">

          {/* ===== ORDER OVERVIEW / DASHBOARD (Fallback) ===== */}
          {!['New Orders', 'Processing Orders', 'Delivered Orders', 'Cancelled Orders', 'Returns & Refunds', 'Invoices'].includes(activeSubItem) && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Order Overview</h2>
                <p className="text-xs text-gray-400">Real-time sales order processing, delivery tracking, and analytics.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Total Orders', val: orders.length, color: 'text-gray-800', bg: 'bg-white' },
                  { label: 'New Orders', val: orders.filter(o => o.status === 'New').length, color: 'text-blue-600', bg: 'bg-blue-50/50' },
                  { label: 'Processing Orders', val: orders.filter(o => o.status === 'Processing').length, color: 'text-orange-600', bg: 'bg-orange-50/50' },
                  { label: 'Delivered Orders', val: orders.filter(o => o.status === 'Delivered').length, color: 'text-green-700', bg: 'bg-green-50/50' },
                  { label: 'Cancelled Orders', val: orders.filter(o => o.status === 'Cancelled').length, color: 'text-red-600', bg: 'bg-red-50/50' },
                  { label: 'Return Requests', val: orderReturns.filter(r => r.status === 'Pending').length, color: 'text-purple-600', bg: 'bg-purple-50/50' },
                ].map((k, i) => (
                  <div key={i} className={`kpi-card border ${k.bg}`}>
                    <p className={`text-xl font-black ${k.color}`}>{k.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="kpi-card">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Order Trend (Revenue vs Volume)</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={orderTrendData}>
                      <defs>
                        <linearGradient id="ordTrendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#236625" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#236625" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }}/>
                      <YAxis tick={{ fontSize: 10 }} yAxisId="left" tickFormatter={v => `₹${(v/1000).toFixed(0)}K`}/>
                      <YAxis tick={{ fontSize: 10 }} yAxisId="right" orientation="right"/>
                      <Tooltip formatter={(v, n) => [n === 'revenue' ? `₹${v.toLocaleString()}` : v, n === 'revenue' ? 'Revenue' : 'Orders Count']}/>
                      <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#236625" fill="url(#ordTrendGrad)" strokeWidth={2}/>
                      <Bar yAxisId="right" dataKey="orders" fill="#66BB6A" alpha={0.6} barSize={15} radius={[3, 3, 0, 0]}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="kpi-card">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Order Status Distribution</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={4}>
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color}/>
                          ))}
                        </Pie>
                        <Tooltip/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {orderStatusData.map((st, i) => (
                        <div key={i} className="flex items-center justify-between text-xs border-b pb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }}/>
                            <span className="font-semibold text-gray-600">{st.name}</span>
                          </div>
                          <span className="font-black text-gray-800">{st.value} ({((st.value/orders.length)*100).toFixed(0)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row 2 - Daily / Monthly */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="kpi-card lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Daily Orders Peak Times</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={dailyOrderData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }}/>
                      <YAxis tick={{ fontSize: 10 }}/>
                      <Tooltip formatter={v => [v, 'Orders Received']}/>
                      <Bar dataKey="count" fill="#236625" radius={[3, 3, 0, 0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="kpi-card space-y-4">
                  <h3 className="text-sm font-bold text-gray-800">Order Growth Insights</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded-lg border">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Peak Ordering Time</p>
                      <p className="text-sm font-bold text-emerald-800 mt-0.5">12:00 PM — 06:00 PM</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Accounts for 68% of daily sales volume.</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Best Selling Product</p>
                      <p className="text-sm font-bold text-emerald-800 mt-0.5">BT Cotton Seeds 450g</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">High demand during current monsoon planting.</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Repeat Customer Rate</p>
                      <p className="text-sm font-bold text-emerald-800 mt-0.5">74.2%</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Strong customer retention among local farmers.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Analytics Module Segment */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="kpi-card">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">Top Customers by Revenue</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Balasaheb Vikhe', revenue: 15400, village: 'Loni' },
                      { name: 'Sanjay Pawar', revenue: 9800, village: 'Katphal' },
                      { name: 'Anita Deshpande', revenue: 8900, village: 'Baramati' },
                    ].map((cust, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-gray-700">{cust.name}</p>
                          <p className="text-[10px] text-gray-400">{cust.village}</p>
                        </div>
                        <span className="font-black text-emerald-700">₹{cust.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="kpi-card lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">Recent Activities</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'New Order Received', desc: 'Order ORD-9081 for ₹4,500 placed by Suresh Patil', time: '10m ago' },
                      { title: 'Order Processed', desc: 'Order ORD-9084 moved to dispatch ready', time: '1h ago' },
                      { title: 'Order Delivered', desc: 'Order ORD-9083 marked delivered successfully', time: '2h ago' },
                      { title: 'Refund Processed', desc: 'Refund of ₹6,700 issued to Meena Jadhav (ORD-9085)', time: '4h ago' },
                      { title: 'Invoice Generated', desc: 'INV-2026-091 created for Suresh Patil', time: '5h ago' }
                    ].map((act, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-gray-700">{act.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{act.desc}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Report Generator Segment */}
              <div className="kpi-card">
                <h3 className="text-sm font-bold text-gray-800 mb-3">Order Reports & Exports</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { label: 'Daily Orders Report', icon: FileCheck },
                    { label: 'Monthly Orders Report', icon: FileCheck },
                    { label: 'Cancelled Orders Report', icon: FileCheck },
                    { label: 'Returns Report', icon: FileCheck },
                    { label: 'Revenue Report', icon: FileCheck },
                  ].map((rep, idx) => (
                    <div key={idx} className="border rounded-xl p-3 bg-slate-50 flex flex-col justify-between h-24">
                      <rep.icon size={18} className="text-emerald-700"/>
                      <p className="text-[10px] font-bold text-gray-700 leading-tight mt-2">{rep.label}</p>
                      <div className="flex gap-2 mt-2 pt-1 border-t">
                        <button onClick={() => toast.success(`Exporting ${rep.label} to PDF...`)} className="text-[9px] font-bold text-red-600 hover:underline">PDF</button>
                        <button onClick={() => toast.success(`Exporting ${rep.label} to Excel...`)} className="text-[9px] font-bold text-green-700 hover:underline">Excel</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== 1. NEW ORDERS SUBMODULE ===== */}
          {activeSubItem === 'New Orders' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>New Orders</h2>
                  <p className="text-xs text-gray-400">Incoming pending orders requiring validation and processing.</p>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="kpi-card flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 border rounded-lg px-3 bg-slate-50 flex-1 min-w-[200px]">
                  <Search size={13} className="text-gray-400"/>
                  <input type="text" placeholder="Search Order ID or customer..." value={ordSearch} onChange={e => setOrdSearch(e.target.value)} className="bg-transparent text-xs outline-none py-2 text-gray-700 w-full"/>
                </div>
                <select value={ordPaymentFilter} onChange={e => setOrdPaymentFilter(e.target.value)} className="text-xs font-bold border rounded-lg px-3 py-2 bg-white">
                  <option value="All">All Payments</option>
                  <option>Paid</option><option>Pending</option><option>Failed</option>
                </select>
              </div>

              {/* Orders Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer Name</th>
                      <th className="p-3">Order Date</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment Status</th>
                      <th className="p-3">Order Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o => o.status === 'New' && (o.id.toLowerCase().includes(ordSearch.toLowerCase()) || o.customer.toLowerCase().includes(ordSearch.toLowerCase())) && (ordPaymentFilter === 'All' || o.payStatus === ordPaymentFilter))
                      .map((o, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50/40">
                          <td className="p-3 font-mono font-bold text-blue-600">{o.id}</td>
                          <td className="p-3 font-semibold text-gray-800">{o.customer}</td>
                          <td className="p-3 text-gray-500">{o.date}</td>
                          <td className="p-3 font-black text-gray-800">₹{o.amount.toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${o.payStatus === 'Paid' ? 'bg-green-100 text-green-700' : o.payStatus === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>{o.payStatus}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{o.status}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button onClick={() => setSelectedOrdDetails(o)} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded">View</button>
                              <button onClick={() => {
                                setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: 'Processing', trackingStep: 2 } : x));
                                toast.success(`Order ${o.id} verified and moved to processing.`);
                              }} className="text-[10px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-2 py-1 rounded">Process</button>
                              <button onClick={() => {
                                const reason = prompt('Reason for cancelling order:');
                                if (reason !== null) {
                                  setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: 'Cancelled', cancelReason: reason || 'Cancelled by admin', payStatus: x.payStatus === 'Paid' ? 'Refunded' : 'Failed' } : x));
                                  toast.error(`Order ${o.id} has been cancelled.`);
                                }
                              }} className="text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded">Cancel</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {orders.filter(o => o.status === 'New' && (o.id.toLowerCase().includes(ordSearch.toLowerCase()) || o.customer.toLowerCase().includes(ordSearch.toLowerCase())) && (ordPaymentFilter === 'All' || o.payStatus === ordPaymentFilter)).length === 0 && (
                      <tr><td colSpan="7" className="p-6 text-center text-gray-400 font-semibold">No new orders found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== 2. PROCESSING ORDERS SUBMODULE ===== */}
          {activeSubItem === 'Processing Orders' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Processing Orders</h2>
                <p className="text-xs text-gray-400">Verify items, pack shipments, assign logistics, and dispatch goods.</p>
              </div>

              {/* Processing Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Order Value</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Current Tracking Status</th>
                      <th className="p-3">Next Milestone Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o => o.status === 'Processing')
                      .map((o, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50/40">
                          <td className="p-3 font-mono font-bold text-blue-600">{o.id}</td>
                          <td className="p-3 font-semibold text-gray-800">{o.customer}</td>
                          <td className="p-3 font-black text-gray-800">₹{o.amount.toLocaleString()}</td>
                          <td className="p-3"><span className="text-[10px] font-bold uppercase">{o.payType} ({o.payStatus})</span></td>
                          <td className="p-3 font-bold text-orange-700">
                            {o.trackingStep === 2 ? 'Verified' :
                             o.trackingStep === 3 ? 'Packed' :
                             o.trackingStep === 4 ? 'Ready For Dispatch' : 'Dispatched'}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              {o.trackingStep === 2 && (
                                <button onClick={() => {
                                  setOrders(prev => prev.map(x => x.id === o.id ? { ...x, trackingStep: 3 } : x));
                                  toast.success(`Order ${o.id} packed successfully.`);
                                }} className="text-[10px] font-bold text-white bg-[#236625] px-2 py-1 rounded">Mark Packed</button>
                              )}
                              {o.trackingStep === 3 && (
                                <button onClick={() => {
                                  setOrders(prev => prev.map(x => x.id === o.id ? { ...x, trackingStep: 4 } : x));
                                  toast.success(`Order ${o.id} verified ready for dispatch.`);
                                }} className="text-[10px] font-bold text-white bg-[#236625] px-2 py-1 rounded">Set Ready For Dispatch</button>
                              )}
                              {o.trackingStep === 4 && (
                                <button onClick={() => {
                                  setOrders(prev => prev.map(x => x.id === o.id ? { ...x, trackingStep: 5 } : x));
                                  toast.success(`Order ${o.id} dispatched via delivery executive.`);
                                }} className="text-[10px] font-bold text-white bg-[#236625] px-2 py-1 rounded">Dispatch / Assign Delivery</button>
                              )}
                              {o.trackingStep === 5 && (
                                <button onClick={() => {
                                  setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: 'Delivered', trackingStep: 6, dateDelivered: new Date().toISOString().split('T')[0] } : x));
                                  toast.success(`Order ${o.id} marked as Delivered!`);
                                }} className="text-[10px] font-bold text-white bg-[#236625] px-2 py-1 rounded">Deliver Order</button>
                              )}
                              <button onClick={() => setSelectedOrdDetails(o)} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">Details</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {orders.filter(o => o.status === 'Processing').length === 0 && (
                      <tr><td colSpan="6" className="p-6 text-center text-gray-400 font-semibold">No orders are currently in processing.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== 3. DELIVERED ORDERS SUBMODULE ===== */}
          {activeSubItem === 'Delivered Orders' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Delivered Orders</h2>
                <p className="text-xs text-gray-400">History of all successfully fulfilled customer orders.</p>
              </div>

              {/* Delivered Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Delivery Date</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment Status</th>
                      <th className="p-3">Delivery Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o => o.status === 'Delivered')
                      .map((o, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50/40">
                          <td className="p-3 font-mono font-bold text-blue-600">{o.id}</td>
                          <td className="p-3 font-semibold text-gray-800">{o.customer}</td>
                          <td className="p-3 text-gray-500">{o.dateDelivered || o.date}</td>
                          <td className="p-3 font-black text-gray-800">₹{o.amount.toLocaleString()}</td>
                          <td className="p-3">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-700">{o.payStatus}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-700">Delivered</span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button onClick={() => setSelectedOrdDetails(o)} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">View Details</button>
                              <button onClick={() => toast.success(`Downloading invoice INV-${o.id}...`)} className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded flex items-center gap-1"><Download size={10}/> Invoice</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {orders.filter(o => o.status === 'Delivered').length === 0 && (
                      <tr><td colSpan="7" className="p-6 text-center text-gray-400 font-semibold">No delivered orders found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== 4. CANCELLED ORDERS SUBMODULE ===== */}
          {activeSubItem === 'Cancelled Orders' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Cancelled Orders</h2>
                <p className="text-xs text-gray-400">Monitor cancelled customer orders, reasons, and process refunds.</p>
              </div>

              {/* Cancelled Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Cancellation Reason</th>
                      <th className="p-3">Refund Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o => o.status === 'Cancelled')
                      .map((o, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50/40">
                          <td className="p-3 font-mono font-bold text-blue-600">{o.id}</td>
                          <td className="p-3 font-semibold text-gray-800">{o.customer}</td>
                          <td className="p-3 font-black text-gray-800">₹{o.amount.toLocaleString()}</td>
                          <td className="p-3 text-red-600 font-bold max-w-[200px] truncate">{o.cancelReason || 'Customer requested cancellation'}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${o.payStatus === 'Refunded' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>{o.payStatus}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button onClick={() => setSelectedOrdDetails(o)} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">View Details</button>
                              {o.payStatus === 'Failed' && (
                                <button onClick={() => {
                                  setOrders(prev => prev.map(x => x.id === o.id ? { ...x, payStatus: 'Refunded' } : x));
                                  toast.success(`Refund of ₹${o.amount} successfully processed back to customer bank/UPI.`);
                                }} className="text-[10px] font-bold text-white bg-purple-700 px-2 py-1 rounded">Process Refund</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    {orders.filter(o => o.status === 'Cancelled').length === 0 && (
                      <tr><td colSpan="6" className="p-6 text-center text-gray-400 font-semibold">No cancelled orders found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== 5. RETURNS & REFUNDS SUBMODULE ===== */}
          {activeSubItem === 'Returns & Refunds' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Returns & Refunds</h2>
                <p className="text-xs text-gray-400">Process returned goods and handle ledger refund approvals.</p>
              </div>

              {/* Filters */}
              <div className="kpi-card flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 border rounded-lg px-3 bg-slate-50 flex-1 min-w-[200px]">
                  <Search size={13} className="text-gray-400"/>
                  <input type="text" placeholder="Search Return or Order ID..." value={retSearchOrd} onChange={e => setRetSearchOrd(e.target.value)} className="bg-transparent text-xs outline-none py-2 text-gray-700 w-full"/>
                </div>
                <select value={retStatusFilter} onChange={e => setRetStatusFilter(e.target.value)} className="text-xs font-bold border rounded-lg px-3 py-2 bg-white">
                  <option value="All">All Statuses</option>
                  <option>Pending</option><option>Approved</option><option>Rejected</option><option>Refunded</option>
                </select>
              </div>

              {/* Returns Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Return ID</th>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Product Description</th>
                      <th className="p-3">Return Reason</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderReturns
                      .filter(r => (r.id.toLowerCase().includes(retSearchOrd.toLowerCase()) || r.ordId.toLowerCase().includes(retSearchOrd.toLowerCase())) && (retStatusFilter === 'All' || r.status === retStatusFilter))
                      .map((r, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50/40">
                          <td className="p-3 font-mono text-gray-500">{r.id}</td>
                          <td className="p-3 font-mono text-blue-600 font-bold">{r.ordId}</td>
                          <td className="p-3 font-semibold text-gray-800">{r.customer}</td>
                          <td className="p-3 text-gray-700">{r.product}</td>
                          <td className="p-3 text-gray-500 max-w-[200px] truncate">{r.reason}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              r.status === 'Refunded' ? 'bg-purple-100 text-purple-700' :
                              r.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                              r.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                              'bg-orange-100 text-orange-700'}`}>{r.status}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              {r.status === 'Pending' && (
                                <>
                                  <button onClick={() => {
                                    setOrderReturns(prev => prev.map(x => x.id === r.id ? { ...x, status: 'Approved' } : x));
                                    toast.success(`Return request ${r.id} approved.`);
                                  }} className="text-[10px] font-bold text-white bg-[#236625] px-2 py-1 rounded">Approve</button>
                                  <button onClick={() => {
                                    setOrderReturns(prev => prev.map(x => x.id === r.id ? { ...x, status: 'Rejected' } : x));
                                    toast.error(`Return request ${r.id} rejected.`);
                                  }} className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-1 rounded">Reject</button>
                                </>
                              )}
                              {r.status === 'Approved' && (
                                <button onClick={() => {
                                  setOrderReturns(prev => prev.map(x => x.id === r.id ? { ...x, status: 'Refunded' } : x));
                                  toast.success(`Refund of ₹${r.refundAmount} issued back to ${r.customer}`);
                                }} className="text-[10px] font-bold text-white bg-purple-700 px-2 py-1 rounded">Process Refund</button>
                              )}
                              {r.status === 'Refunded' && <span className="text-[10px] text-gray-400">Refunded (₹{r.refundAmount})</span>}
                              {r.status === 'Rejected' && <span className="text-[10px] text-red-500 font-bold">Rejected</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    {orderReturns.filter(r => (r.id.toLowerCase().includes(retSearchOrd.toLowerCase()) || r.ordId.toLowerCase().includes(retSearchOrd.toLowerCase())) && (retStatusFilter === 'All' || r.status === retStatusFilter)).length === 0 && (
                      <tr><td colSpan="7" className="p-6 text-center text-gray-400 font-semibold">No returns or refunds match the filter.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== 6. INVOICES SUBMODULE ===== */}
          {activeSubItem === 'Invoices' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Invoice Management</h2>
                  <p className="text-xs text-gray-400">Download, print or view order receipts and business invoices.</p>
                </div>
              </div>

              {/* Filter */}
              <div className="kpi-card flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 border rounded-lg px-3 bg-slate-50 flex-1 min-w-[200px]">
                  <Search size={13} className="text-gray-400"/>
                  <input type="text" placeholder="Search Invoice, Order ID or Customer..." value={invSearchOrd} onChange={e => setInvSearchOrd(e.target.value)} className="bg-transparent text-xs outline-none py-2 text-gray-700 w-full"/>
                </div>
              </div>

              {/* Invoices Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Invoice Number</th>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices
                      .filter(i => i.invoiceNo.toLowerCase().includes(invSearchOrd.toLowerCase()) || i.ordId.toLowerCase().includes(invSearchOrd.toLowerCase()) || i.customer.toLowerCase().includes(invSearchOrd.toLowerCase()))
                      .map((i, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50/40">
                          <td className="p-3 font-mono font-bold text-emerald-800">{i.invoiceNo}</td>
                          <td className="p-3 font-mono text-blue-600 font-bold">{i.ordId}</td>
                          <td className="p-3 font-semibold text-gray-800">{i.customer}</td>
                          <td className="p-3 font-black text-gray-800">₹{i.amount.toLocaleString()}</td>
                          <td className="p-3 text-gray-500">{i.date}</td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button onClick={() => {
                                const ord = orders.find(x => x.id === i.ordId);
                                if (ord) setSelectedOrdDetails(ord);
                                else toast.error('Order reference not found.');
                              }} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">View Invoice</button>
                              <button onClick={() => toast.success(`Downloading PDF for ${i.invoiceNo}`)} className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">Download PDF</button>
                              <button onClick={() => toast.success(`Printing invoice ${i.invoiceNo}`)} className="text-[10px] font-bold text-white bg-slate-700 px-2 py-1 rounded flex items-center gap-1"><Printer size={10}/> Print</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {invoices.filter(i => i.invoiceNo.toLowerCase().includes(invSearchOrd.toLowerCase()) || i.ordId.toLowerCase().includes(invSearchOrd.toLowerCase()) || i.customer.toLowerCase().includes(invSearchOrd.toLowerCase())).length === 0 && (
                      <tr><td colSpan="6" className="p-6 text-center text-gray-400 font-semibold">No invoices match the filter.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== ORDER DETAILS MODAL (TIMELINE & DETAILED INFO) ===== */}
          {selectedOrdDetails && (
            <Modal isOpen={!!selectedOrdDetails} onClose={() => setSelectedOrdDetails(null)} title={`Order Information — ${selectedOrdDetails.id}`}>
              <div className="space-y-4 text-xs">
                
                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border space-y-1.5">
                    <span className="block font-bold text-[9px] text-gray-400 uppercase">Customer Details</span>
                    <p className="font-bold text-gray-800 text-sm">{selectedOrdDetails.customer}</p>
                    <p className="text-gray-500">Phone: {selectedOrdDetails.phone}</p>
                    <p className="text-gray-500">Delivery Address: {selectedOrdDetails.address}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border space-y-1.5">
                    <span className="block font-bold text-[9px] text-gray-400 uppercase">Payment & Delivery Status</span>
                    <div className="flex justify-between"><span>Payment Method:</span><span className="font-bold text-gray-700">{selectedOrdDetails.payType}</span></div>
                    <div className="flex justify-between"><span>Payment Status:</span><span className={`font-bold uppercase ${selectedOrdDetails.payStatus === 'Paid' ? 'text-green-700' : 'text-orange-600'}`}>{selectedOrdDetails.payStatus}</span></div>
                    <div className="flex justify-between"><span>Delivery Milestone:</span><span className="font-bold text-[#236625]">{selectedOrdDetails.status}</span></div>
                  </div>
                </div>

                {/* Product List */}
                <div className="border rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-3 py-2 border-b"><span className="font-bold text-[9px] text-gray-400 uppercase">Product List</span></div>
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b bg-gray-50/50 text-gray-500">
                        <th className="p-2">Product Name</th>
                        <th className="p-2 text-right">Quantity</th>
                        <th className="p-2 text-right">Unit Price</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrdDetails.items?.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-semibold text-gray-800">{item.name}</td>
                          <td className="p-2 text-right">{item.qty}</td>
                          <td className="p-2 text-right">₹{item.price}</td>
                          <td className="p-2 text-right font-bold text-gray-800">₹{(item.qty * item.price).toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-50/30">
                        <td colSpan="3" className="p-2 font-bold text-right text-gray-600">Total Order Amount:</td>
                        <td className="p-2 font-black text-right text-emerald-800">₹{selectedOrdDetails.amount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Order Process Timeline */}
                <div className="kpi-card space-y-4">
                  <span className="block font-bold text-[9px] text-gray-400 uppercase mb-2">Order Tracking Timeline</span>
                  <div className="relative pl-6 border-l-2 border-gray-100 space-y-4 ml-2">
                    {[
                      { step: 1, label: 'Order Created', desc: 'Order placed by user/system.' },
                      { step: 2, label: 'Payment Received / Verified', desc: 'Transaction completed & registered.' },
                      { step: 3, label: 'Processing', desc: 'Order details verified by administrator.' },
                      { step: 4, label: 'Packed', desc: 'Goods verified and packaged ready.' },
                      { step: 5, label: 'Dispatched', desc: 'Goods dispatched with logistics.' },
                      { step: 6, label: 'Delivered', desc: 'Order successfully delivered to customer.' }
                    ].map((t, idx) => {
                      const isCompleted = selectedOrdDetails.status === 'Cancelled' ? false : (selectedOrdDetails.trackingStep >= t.step);
                      return (
                        <div key={idx} className="relative">
                          <div className={`absolute -left-[31px] top-0 w-[14px] h-[14px] rounded-full border-2 border-white flex items-center justify-center ${isCompleted ? 'bg-[#236625]' : 'bg-gray-300'}`}>
                            {isCompleted && <Check size={8} className="text-white"/>}
                          </div>
                          <div>
                            <p className={`font-bold leading-none ${isCompleted ? 'text-emerald-800' : 'text-gray-400'}`}>{t.label}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{t.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                    {selectedOrdDetails.status === 'Cancelled' && (
                      <div className="relative">
                        <div className="absolute -left-[31px] top-0 w-[14px] h-[14px] rounded-full bg-red-600 border-2 border-white flex items-center justify-center">
                          <Ban size={8} className="text-white"/>
                        </div>
                        <div>
                          <p className="font-bold leading-none text-red-600">Order Cancelled</p>
                          <p className="text-[10px] text-gray-400 mt-1">Reason: {selectedOrdDetails.cancelReason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => toast.success(`Invoice for ${selectedOrdDetails.id} sent to printer!`)} className="flex-1 btn-primary py-2 text-xs font-bold flex items-center justify-center gap-1.5"><Printer size={12}/> Print Receipt</button>
                  <button onClick={() => setSelectedOrdDetails(null)} className="btn-secondary px-6 py-2 text-xs font-bold">Close</button>
                </div>
              </div>
            </Modal>
          )}

        </div>
      ) : activeCategory === 'Customer Management' ? (
        <div className="space-y-6">

          {/* ===== CUSTOMER OVERVIEW (Fallback dashboard view) ===== */}
          {!['Customers', 'Farmer Profiles', 'Credit Accounts', 'Loyalty Points', 'Customer Feedback', 'Customer Reports'].includes(activeSubItem) && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Customer Overview</h2>
                <p className="text-xs text-gray-400">Track and manage shop loyalty, credit balances, customer satisfaction, and farming profiles.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Total Customers', val: customers.length, color: 'text-gray-800', bg: 'bg-white' },
                  { label: 'Active Customers', val: customers.filter(c => c.status === 'Active').length, color: 'text-green-700', bg: 'bg-green-50/50' },
                  { label: 'New This Month', val: 5, color: 'text-blue-600', bg: 'bg-blue-50/50' },
                  { label: 'Returning Customers', val: customers.filter(c => c.totalOrders > 5).length, color: 'text-emerald-700', bg: 'bg-emerald-50/50' },
                  { label: 'Credit Customers', val: customers.filter(c => c.creditBalance > 0).length, color: 'text-orange-600', bg: 'bg-orange-50/50' },
                  { label: 'Loyalty Members', val: customers.filter(c => c.loyaltyPoints > 100).length, color: 'text-purple-600', bg: 'bg-purple-50/50' },
                ].map((k, i) => (
                  <div key={i} className={`kpi-card border ${k.bg}`}>
                    <p className={`text-xl font-black ${k.color}`}>{k.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="kpi-card lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Customer Acquisition & Growth Trend</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={customerGrowthTrend}>
                      <defs>
                        <linearGradient id="custAcqGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#236625" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#236625" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }}/>
                      <YAxis tick={{ fontSize: 10 }}/>
                      <Tooltip/>
                      <Legend/>
                      <Area type="monotone" name="New Customers" dataKey="newCustomers" stroke="#236625" fill="url(#custAcqGrad)" strokeWidth={2}/>
                      <Bar name="Active Returning" dataKey="returningCustomers" fill="#FFA726" barSize={12} radius={[2, 2, 0, 0]}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="kpi-card flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Customer Segment Distribution</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={customerDistributionData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>
                        {customerDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color}/>
                        ))}
                      </Pie>
                      <Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {customerDistributionData.map((c, i) => (
                      <div key={i} className="flex justify-between text-[10px]">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}/>{c.name}</div>
                        <span className="font-bold text-gray-700">{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Insights & Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="kpi-card">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">Recent Customer Operations</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'New Customer Added', desc: 'Ramesh Patil registered under Farmer segment', time: 'Just now' },
                      { action: 'Loyalty Points Redeemed', desc: 'Anita Deshpande redeemed 200 points for a ₹100 seed discount coupon', time: '10m ago' },
                      { action: 'Credit Payment Received', desc: 'Suresh Patil cleared ₹1,500 outstanding credit amount', time: '45m ago' },
                      { action: 'Feedback Submitted', desc: 'Balasaheb Vikhe submitted rating: 5 stars', time: '2h ago' }
                    ].map((act, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-gray-700">{act.action}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{act.desc}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="kpi-card">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">High-Value VIP Customers</h3>
                  <div className="space-y-3">
                    {customers.sort((a,b) => b.totalSpending - a.totalSpending).slice(0, 3).map((cust, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800">{cust.name.charAt(0)}</div>
                          <div>
                            <p className="font-bold text-gray-800">{cust.name}</p>
                            <p className="text-[10px] text-gray-400">{cust.custType} • {cust.village}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-emerald-700">₹{cust.totalSpending.toLocaleString()}</p>
                          <p className="text-[9px] text-gray-400">{cust.totalOrders} Orders</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== 1. CUSTOMER LIST SUBMODULE ===== */}
          {activeSubItem === 'Customers' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Customer Profiles</h2>
                  <p className="text-xs text-gray-400">View contacts, transaction analytics, credit limits, and farm configurations.</p>
                </div>
                <button onClick={() => { setEditingCust(null); setShowAddCustModal(true); }} className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Plus size={13}/> Add Customer</button>
              </div>

              {/* Filters */}
              <div className="kpi-card flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 border rounded-lg px-3 bg-slate-50 flex-1 min-w-[200px]">
                  <Search size={13} className="text-gray-400"/>
                  <input type="text" placeholder="Search customer name, ID or mobile..." value={custSearch} onChange={e => setCustSearch(e.target.value)} className="bg-transparent text-xs outline-none py-2 text-gray-700 w-full"/>
                </div>
                <select value={custTypeFilter} onChange={e => setCustTypeFilter(e.target.value)} className="text-xs font-bold border rounded-lg px-3 py-2 bg-white">
                  <option value="All">All Types</option>
                  <option>Farmer</option><option>Retail Customer</option><option>Wholesale Customer</option>
                </select>
                <select value={custStatusFilter} onChange={e => setCustStatusFilter(e.target.value)} className="text-xs font-bold border rounded-lg px-3 py-2 bg-white">
                  <option value="All">All Statuses</option>
                  <option>Active</option><option>Suspended</option>
                </select>
              </div>

              {/* Customer Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Customer ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Mobile Number</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Spendings</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers
                      .filter(c => (c.name.toLowerCase().includes(custSearch.toLowerCase()) || c.id.toLowerCase().includes(custSearch.toLowerCase()) || c.mobile.includes(custSearch)) && (custTypeFilter === 'All' || c.custType === custTypeFilter) && (custStatusFilter === 'All' || c.status === custStatusFilter))
                      .map((c, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50/40">
                          <td className="p-3 font-mono font-bold text-blue-600">{c.id}</td>
                          <td className="p-3 font-semibold text-gray-800">{c.name}</td>
                          <td className="p-3 text-gray-500">{c.mobile}</td>
                          <td className="p-3 text-gray-500">{c.village}, {c.district}</td>
                          <td className="p-3"><span className="text-[10px] font-bold text-gray-700">{c.custType}</span></td>
                          <td className="p-3 font-black text-emerald-700">₹{c.totalSpending.toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button onClick={() => { setSelectedCustProfile(c); setProfileActiveTab('Overview'); }} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">View Profile</button>
                              <button onClick={() => { setEditingCust(c); setShowAddCustModal(true); }} className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">Edit</button>
                              <button onClick={() => {
                                setCustomers(prev => prev.map(x => x.id === c.id ? { ...x, status: x.status === 'Active' ? 'Suspended' : 'Active' } : x));
                                toast.success(`Status updated for ${c.name}`);
                              }} className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded">{c.status === 'Active' ? 'Suspend' : 'Activate'}</button>
                              <button onClick={() => {
                                if (confirm(`Remove profile of ${c.name}?`)) {
                                  setCustomers(prev => prev.filter(x => x.id !== c.id));
                                  toast.success('Customer profile deleted.');
                                }
                              }} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={12}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Add / Edit Customer Modal */}
              {showAddCustModal && (
                <Modal isOpen={showAddCustModal} onClose={() => { setShowAddCustModal(false); setEditingCust(null); }} title={editingCust ? `Edit Customer — ${editingCust.id}` : 'Register New Customer'}>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Full Name</label>
                        <input id="cName" type="text" defaultValue={editingCust?.name || ''} className="w-full border rounded-lg px-3 py-2 outline-none"/>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Mobile Number</label>
                        <input id="cMobile" type="text" defaultValue={editingCust?.mobile || ''} className="w-full border rounded-lg px-3 py-2 outline-none"/>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Email Address</label>
                        <input id="cEmail" type="email" defaultValue={editingCust?.email || ''} className="w-full border rounded-lg px-3 py-2 outline-none"/>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Gender</label>
                        <select id="cGender" defaultValue={editingCust?.gender || 'Male'} className="w-full border rounded-lg px-3 py-2 outline-none bg-white">
                          <option>Male</option><option>Female</option><option>Other</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block font-bold text-gray-500 uppercase mb-1">Address Details</label>
                        <input id="cAddress" type="text" defaultValue={editingCust?.address || ''} className="w-full border rounded-lg px-3 py-2 outline-none"/>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Village</label>
                        <input id="cVillage" type="text" defaultValue={editingCust?.village || ''} className="w-full border rounded-lg px-3 py-2 outline-none"/>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Taluka</label>
                        <input id="cTaluka" type="text" defaultValue={editingCust?.taluka || ''} className="w-full border rounded-lg px-3 py-2 outline-none"/>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">District</label>
                        <input id="cDistrict" type="text" defaultValue={editingCust?.district || 'Pune'} className="w-full border rounded-lg px-3 py-2 outline-none"/>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">State</label>
                        <input id="cState" type="text" defaultValue={editingCust?.state || 'Maharashtra'} className="w-full border rounded-lg px-3 py-2 outline-none"/>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Pincode</label>
                        <input id="cPincode" type="text" defaultValue={editingCust?.pincode || ''} className="w-full border rounded-lg px-3 py-2 outline-none"/>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Customer Type</label>
                        <select id="cType" defaultValue={editingCust?.custType || 'Farmer'} className="w-full border rounded-lg px-3 py-2 outline-none bg-white">
                          <option>Farmer</option><option>Retail Customer</option><option>Wholesale Customer</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => {
                        const name = document.getElementById('cName').value;
                        const mobile = document.getElementById('cMobile').value;
                        const email = document.getElementById('cEmail').value;
                        const gender = document.getElementById('cGender').value;
                        const address = document.getElementById('cAddress').value;
                        const village = document.getElementById('cVillage').value;
                        const taluka = document.getElementById('cTaluka').value;
                        const district = document.getElementById('cDistrict').value;
                        const state = document.getElementById('cState').value;
                        const pincode = document.getElementById('cPincode').value;
                        const custType = document.getElementById('cType').value;

                        if (!name || !mobile) {
                          toast.error('Name and Mobile number are required!');
                          return;
                        }

                        if (editingCust) {
                          setCustomers(prev => prev.map(x => x.id === editingCust.id ? { ...x, name, mobile, email, gender, address, village, taluka, district, state, pincode, custType } : x));
                          toast.success('Customer profile details updated.');
                        } else {
                          const newC = {
                            id: `CUST-${String(customers.length+1).padStart(3,'0')}`,
                            name, mobile, email, gender, address, village, taluka, district, state, pincode, custType,
                            totalOrders: 0, totalSpending: 0, status: 'Active', loyaltyPoints: 0, creditLimit: 10000, creditBalance: 0
                          };
                          setCustomers(prev => [...prev, newC]);
                          toast.success('New customer profile registered.');
                        }
                        setShowAddCustModal(false);
                        setEditingCust(null);
                      }} className="flex-1 btn-primary py-2 text-xs font-bold">Save Profile</button>
                      <button onClick={() => { setShowAddCustModal(false); setEditingCust(null); }} className="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          )}

          {/* ===== 2. FARMER PROFILES SUBMODULE ===== */}
          {activeSubItem === 'Farmer Profiles' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Farmer Configuration Ledger</h2>
                <p className="text-xs text-gray-400">Manage crop history, land sizes, irrigation resources, and soil conditions.</p>
              </div>

              {/* Farmer profiles cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {customers
                  .filter(c => c.custType === 'Farmer')
                  .map((c, idx) => (
                    <div key={idx} className="kpi-card space-y-3 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start border-b pb-2">
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm">{c.name}</h4>
                          <span className="text-[10px] text-gray-400 font-bold">{c.id} • {c.village}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">{c.farmingExp || '5 Years'} Exp</span>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-600">
                        <div className="flex justify-between"><span>Farm Name:</span><span className="font-bold text-gray-800">{c.farmName || 'N/A'}</span></div>
                        <div className="flex justify-between"><span>Cultivated Area:</span><span className="font-bold text-gray-800">{c.landArea || 'N/A'}</span></div>
                        <div className="flex justify-between"><span>Primary Crops:</span><span className="font-bold text-emerald-700">{c.cropType || 'N/A'}</span></div>
                        <div className="flex justify-between"><span>Irrigation Type:</span><span className="font-bold text-gray-800">{c.irrigation || 'N/A'}</span></div>
                        <div className="flex justify-between"><span>Soil Quality:</span><span className="font-bold text-gray-800">{c.soilType || 'N/A'}</span></div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <button onClick={() => setSelectedFarmerDetail(c)} className="flex-1 btn-primary py-1.5 text-[10px] font-bold flex items-center justify-center gap-1"><Eye size={10}/> Farm Analysis</button>
                        <button onClick={() => toast.success(`Crop recommendations report created for ${c.name}`)} className="btn-secondary py-1.5 px-2.5 text-[10px] font-bold">Recommend Crops</button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Farmer Detail Analysis Modal */}
              {selectedFarmerDetail && (
                <Modal isOpen={!!selectedFarmerDetail} onClose={() => setSelectedFarmerDetail(null)} title={`Farm & Crop Analysis — ${selectedFarmerDetail.name}`}>
                  <div className="space-y-4 text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border space-y-1.5">
                      <span className="block font-bold text-[9px] text-gray-400 uppercase">Farm Location</span>
                      <p className="font-semibold text-gray-800">{selectedFarmerDetail.farmName}</p>
                      <p className="text-gray-500">{selectedFarmerDetail.address}, Village {selectedFarmerDetail.village}, Taluka {selectedFarmerDetail.taluka}, District {selectedFarmerDetail.district}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="border p-3 rounded-lg">
                        <span className="block font-bold text-[9px] text-gray-400 uppercase mb-1">Soil Analysis</span>
                        <p className="font-bold text-gray-700">{selectedFarmerDetail.soilType}</p>
                        <p className="text-[10px] text-gray-400 mt-1">Recommended for: Sugarcane, Cotton, Maize, and Grams.</p>
                      </div>
                      <div className="border p-3 rounded-lg">
                        <span className="block font-bold text-[9px] text-gray-400 uppercase mb-1">Water Irrigation</span>
                        <p className="font-bold text-blue-700">{selectedFarmerDetail.irrigation}</p>
                        <p className="text-[10px] text-gray-400 mt-1">High water conservation utility structure.</p>
                      </div>
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl">
                      <span className="block font-bold text-[9px] text-emerald-800 uppercase mb-1">AI Crop Advisory Suggestions</span>
                      <p className="text-[11px] text-emerald-800 leading-tight">Due to {selectedFarmerDetail.soilType} and {selectedFarmerDetail.irrigation} profile, we advise deploying balanced fertilizer doses of IFFCO NPK 19:19:19. Next crop sowing suggested: Soybeans in July first week.</p>
                    </div>

                    <button onClick={() => setSelectedFarmerDetail(null)} className="w-full btn-secondary py-2 font-bold">Close Analysis</button>
                  </div>
                </Modal>
              )}
            </div>
          )}

          {/* ===== 3. CREDIT ACCOUNTS SUBMODULE ===== */}
          {activeSubItem === 'Credit Accounts' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Customer Credit Ledger</h2>
                  <p className="text-xs text-gray-400">Log credits given to local farmers (Udhari accounts) and track dues collection.</p>
                </div>
              </div>

              {/* Credit Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total Credit Authorized', val: `₹${customers.reduce((s,c) => s+c.creditLimit, 0).toLocaleString()}`, color: 'text-gray-800' },
                  { label: 'Outstanding Balance', val: `₹${customers.reduce((s,c) => s+c.creditBalance, 0).toLocaleString()}`, color: 'text-orange-600' },
                  { label: 'Available Credit Pool', val: `₹${customers.reduce((s,c) => s+(c.creditLimit-c.creditBalance), 0).toLocaleString()}`, color: 'text-green-700' },
                ].map((k, i) => (
                  <div key={i} className="kpi-card">
                    <p className="text-2xl font-black text-gray-800">{k.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Credit Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Customer</th>
                      <th className="p-3">Credit Limit</th>
                      <th className="p-3">Used Balance</th>
                      <th className="p-3">Remaining Limit</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Outstanding status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers
                      .filter(c => c.creditLimit > 0)
                      .map((c, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50/40">
                          <td className="p-3">
                            <p className="font-semibold text-gray-800">{c.name}</p>
                            <span className="text-[9px] text-gray-400">{c.id}</span>
                          </td>
                          <td className="p-3 text-gray-600 font-bold">₹{c.creditLimit.toLocaleString()}</td>
                          <td className={`p-3 font-bold ${c.creditBalance > 0 ? 'text-orange-600' : 'text-gray-500'}`}>₹{c.creditBalance.toLocaleString()}</td>
                          <td className="p-3 text-green-700 font-bold">₹{(c.creditLimit - c.creditBalance).toLocaleString()}</td>
                          <td className="p-3 text-gray-500">{c.creditDueDate || '—'}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${c.creditBalance > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{c.creditBalance > 0 ? 'Outstanding' : 'No Dues'}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button onClick={() => setShowAddCreditModal(c)} className="text-[10px] font-bold text-white bg-[#236625] px-2 py-1 rounded">Issue Credit</button>
                              {c.creditBalance > 0 && (
                                <button onClick={() => setShowCollectPaymentModal(c)} className="text-[10px] font-bold text-[#236625] bg-emerald-50 px-2 py-1 rounded">Collect Payment</button>
                              )}
                              <button onClick={() => toast.success(`Exporting credit ledger reports for ${c.name}`)} className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">Ledger</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Issue Credit Modal */}
              {showAddCreditModal && (
                <Modal isOpen={!!showAddCreditModal} onClose={() => setShowAddCreditModal(null)} title={`Issue Credit — ${showAddCreditModal.name}`}>
                  <div className="space-y-3 text-xs">
                    <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg">
                      <p className="font-bold text-orange-800">Current Outstanding Balance: ₹{showAddCreditModal.creditBalance}</p>
                      <p className="text-[10px] text-orange-600">Remaining allowed Credit Limit: ₹{showAddCreditModal.creditLimit - showAddCreditModal.creditBalance}</p>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Credit Amount (₹)</label>
                      <input id="credAmt" type="number" max={showAddCreditModal.creditLimit - showAddCreditModal.creditBalance} placeholder="Enter credit amount to add" className="w-full border rounded-lg px-3 py-2 outline-none"/>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Payment Due Date</label>
                      <input id="credDueDate" type="date" defaultValue={new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]} className="w-full border rounded-lg px-3 py-2 outline-none"/>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        const amt = parseFloat(document.getElementById('credAmt').value) || 0;
                        const dueDate = document.getElementById('credDueDate').value;
                        const maxAllowed = showAddCreditModal.creditLimit - showAddCreditModal.creditBalance;
                        if (amt <= 0 || amt > maxAllowed) {
                          toast.error(`Please enter a valid credit amount under ₹${maxAllowed}`);
                          return;
                        }
                        setCustomers(prev => prev.map(x => x.id === showAddCreditModal.id ? { ...x, creditBalance: x.creditBalance + amt, creditDueDate: dueDate } : x));
                        toast.success(`₹${amt} credit added successfully.`);
                        setShowAddCreditModal(null);
                      }} className="flex-1 btn-primary py-2 font-bold">Confirm Credit</button>
                      <button onClick={() => setShowAddCreditModal(null)} className="btn-secondary px-4 py-2 font-bold">Cancel</button>
                    </div>
                  </div>
                </Modal>
              )}

              {/* Collect Payment Modal */}
              {showCollectPaymentModal && (
                <Modal isOpen={!!showCollectPaymentModal} onClose={() => setShowCollectPaymentModal(null)} title={`Collect Credit Payment — ${showCollectPaymentModal.name}`}>
                  <div className="space-y-3 text-xs">
                    <div className="bg-green-50 border border-green-100 p-3 rounded-lg">
                      <p className="font-bold text-emerald-800">Total Outstanding Balance: ₹{showCollectPaymentModal.creditBalance}</p>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Collection Amount (₹)</label>
                      <input id="collectAmt" type="number" max={showCollectPaymentModal.creditBalance} defaultValue={showCollectPaymentModal.creditBalance} className="w-full border rounded-lg px-3 py-2 outline-none"/>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Payment Channel Mode</label>
                      <select id="collectMode" className="w-full border rounded-lg px-3 py-2 outline-none bg-white">
                        <option>Cash</option><option>UPI</option><option>Cheque</option><option>Bank Transfer</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        const amt = parseFloat(document.getElementById('collectAmt').value) || 0;
                        const mode = document.getElementById('collectMode').value;
                        if (amt <= 0 || amt > showCollectPaymentModal.creditBalance) {
                          toast.error('Invalid payment amount entered.');
                          return;
                        }
                        setCustomers(prev => prev.map(x => x.id === showCollectPaymentModal.id ? { ...x, creditBalance: Math.max(0, x.creditBalance - amt) } : x));
                        toast.success(`Collected ₹${amt} via ${mode} successfully.`);
                        setShowCollectPaymentModal(null);
                      }} className="flex-1 btn-primary py-2 font-bold">Confirm Payment Collection</button>
                      <button onClick={() => setShowCollectPaymentModal(null)} className="btn-secondary px-4 py-2 font-bold">Cancel</button>
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          )}

          {/* ===== 4. LOYALTY POINTS SUBMODULE ===== */}
          {activeSubItem === 'Loyalty Points' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Shop Loyalty Program</h2>
                <p className="text-xs text-gray-400">Track current points earned, redeemed details, and reward configurations.</p>
              </div>

              {/* Loyalty Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Customer ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Mobile Number</th>
                      <th className="p-3">Current Loyalty Points</th>
                      <th className="p-3">Membership Grade</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c, idx) => (
                      <tr key={idx} className="border-b hover:bg-slate-50/40">
                        <td className="p-3 font-mono text-gray-500">{c.id}</td>
                        <td className="p-3 font-semibold text-gray-800">{c.name}</td>
                        <td className="p-3 text-gray-500">{c.mobile}</td>
                        <td className="p-3 font-black text-emerald-800">{c.loyaltyPoints} points</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.loyaltyPoints > 1000 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            c.loyaltyPoints > 300 ? 'bg-slate-100 text-gray-800 border' :
                            'bg-orange-50 text-orange-700'
                          }`}>
                            {c.loyaltyPoints > 1000 ? 'Gold VIP Member' : c.loyaltyPoints > 300 ? 'Silver Member' : 'Regular Member'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button onClick={() => {
                              const pointsToRedeem = parseInt(prompt(`Current points: ${c.loyaltyPoints}. Enter points to redeem (10 points = ₹1):`));
                              if (pointsToRedeem > 0 && pointsToRedeem <= c.loyaltyPoints) {
                                setCustomers(prev => prev.map(x => x.id === c.id ? { ...x, loyaltyPoints: x.loyaltyPoints - pointsToRedeem } : x));
                                toast.success(`Successfully redeemed ${pointsToRedeem} points for ₹${(pointsToRedeem/10).toFixed(0)} discount.`);
                              } else if (pointsToRedeem > c.loyaltyPoints) {
                                toast.error('Insufficient loyalty points balance.');
                              }
                            }} className="text-[10px] font-bold text-white bg-amber-600 px-2 py-1 rounded">Redeem Points</button>
                            <button onClick={() => {
                              const addAmt = parseInt(prompt('Enter points to credit to this profile:'));
                              if (addAmt > 0) {
                                setCustomers(prev => prev.map(x => x.id === c.id ? { ...x, loyaltyPoints: x.loyaltyPoints + addAmt } : x));
                                toast.success(`Credited ${addAmt} loyalty points.`);
                              }
                            }} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">Add Points</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Loyalty log timeline */}
              <div className="kpi-card">
                <h3 className="text-sm font-bold text-gray-800 mb-3">Redemption & Reward History</h3>
                <div className="space-y-3">
                  {loyaltyHistory.map((lh, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-bold text-gray-800">{lh.customer}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{lh.action}</p>
                      </div>
                      <span className="font-mono text-gray-500">{lh.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== 5. CUSTOMER FEEDBACK SUBMODULE ===== */}
          {activeSubItem === 'Customer Feedback' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Customer Feedback Ledger</h2>
                <p className="text-xs text-gray-400">Review feedback submissions, mark resolution status, and submit management replies.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {feedbacks.map((f, idx) => (
                  <div key={idx} className="kpi-card space-y-3 border">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-gray-800 text-sm">{f.name}</span>
                        <p className="text-[10px] text-gray-400">{f.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex text-amber-500">
                          {Array.from({ length: f.rating }).map((_, i) => <span key={i}>★</span>)}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f.resolved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {f.resolved ? 'Resolved' : 'Pending Action'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 bg-slate-50 p-2.5 rounded-lg border-l-4 border-emerald-700 italic">"{f.comment}"</p>

                    {f.reply && (
                      <div className="text-xs text-emerald-800 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                        <span className="font-bold block text-[10px] uppercase text-emerald-950">Management Reply:</span>
                        {f.reply}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {!f.resolved && (
                        <button onClick={() => {
                          setFeedbacks(prev => prev.map(x => x.id === f.id ? { ...x, resolved: true } : x));
                          toast.success('Feedback marked resolved.');
                        }} className="text-[10px] font-bold text-white bg-[#236625] px-3 py-1 rounded">Mark Resolved</button>
                      )}
                      <button onClick={() => {
                        const rep = prompt('Submit reply note:');
                        if (rep) {
                          setFeedbacks(prev => prev.map(x => x.id === f.id ? { ...x, reply: rep } : x));
                          toast.success('Reply saved.');
                        }
                      }} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded">Reply</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== 6. CUSTOMER REPORTS SUBMODULE ===== */}
          {activeSubItem === 'Customer Reports' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Customer Reports & Analytics</h2>
                <p className="text-xs text-gray-400">Generate high resolution reports, PDF invoices, and excel balance sheets.</p>
              </div>

              {/* Reports Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: 'General Customer Report', desc: 'Acquisition & demographic breakdown sheets.' },
                  { title: 'Credit Ledger Statement', desc: 'Current outstanding balances and payment timelines.' },
                  { title: 'Loyalty Points Summary', desc: 'Outstanding liability points status report.' },
                  { title: 'Feedback Analytics Report', desc: 'Store satisfaction grades and resolved feedback issues.' }
                ].map((rep, idx) => (
                  <div key={idx} className="border rounded-xl p-4 bg-slate-50 flex flex-col justify-between h-36 hover:shadow-md transition-all">
                    <div>
                      <FileCheck className="text-emerald-700" size={20}/>
                      <h4 className="font-bold text-gray-800 text-xs mt-3 leading-tight">{rep.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 leading-snug">{rep.desc}</p>
                    </div>
                    <div className="flex gap-3 pt-2 border-t mt-3">
                      <button onClick={() => toast.success(`Downloading PDF statement for ${rep.title}`)} className="text-[10px] font-bold text-red-600 hover:underline">PDF</button>
                      <button onClick={() => toast.success(`Downloading Excel workbook for ${rep.title}`)} className="text-[10px] font-bold text-[#236625] hover:underline">Excel</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== CUSTOMER PROFILE DETAIL MODAL (TABS) ===== */}
          {selectedCustProfile && (
            <Modal isOpen={!!selectedCustProfile} onClose={() => setSelectedCustProfile(null)} title={`Customer Profile — ${selectedCustProfile.name}`} size="lg">
              <div className="space-y-4 text-xs">
                
                {/* Profile Tabs */}
                <div className="flex border-b text-xs overflow-x-auto">
                  {['Overview', 'Farm Configuration', 'Outstanding Credit', 'Loyalty Balance'].map((tabName) => (
                    <button
                      key={tabName}
                      onClick={() => setProfileActiveTab(tabName)}
                      className={`px-4 py-2 font-bold whitespace-nowrap -mb-px border-b-2 transition-all ${profileActiveTab === tabName ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                      {tabName}
                    </button>
                  ))}
                </div>

                {/* Tab Content: Overview */}
                {profileActiveTab === 'Overview' && (
                  <div className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded-lg border grid grid-cols-2 gap-3">
                      <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Mobile Phone</span><p className="font-bold text-gray-700">{selectedCustProfile.mobile}</p></div>
                      <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Email</span><p className="font-bold text-gray-700">{selectedCustProfile.email || '—'}</p></div>
                      <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Gender</span><p className="font-bold text-gray-700">{selectedCustProfile.gender}</p></div>
                      <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Customer Segment</span><p className="font-bold text-emerald-700">{selectedCustProfile.custType}</p></div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border">
                      <span className="text-gray-400 font-bold block text-[9px] uppercase">Home Location Address</span>
                      <p className="font-semibold text-gray-700">{selectedCustProfile.address}, {selectedCustProfile.village}, {selectedCustProfile.taluka}, {selectedCustProfile.district}, {selectedCustProfile.state} - {selectedCustProfile.pincode}</p>
                    </div>
                  </div>
                )}

                {/* Tab Content: Farm Configuration */}
                {profileActiveTab === 'Farm Configuration' && (
                  <div className="space-y-3">
                    {selectedCustProfile.custType === 'Farmer' ? (
                      <div className="bg-slate-50 p-3 rounded-lg border grid grid-cols-2 gap-3">
                        <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Farm Company</span><p className="font-bold text-gray-700">{selectedCustProfile.farmName || '—'}</p></div>
                        <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Cultivated Area</span><p className="font-bold text-gray-700">{selectedCustProfile.landArea || '—'}</p></div>
                        <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Irrigation resources</span><p className="font-bold text-gray-700">{selectedCustProfile.irrigation || '—'}</p></div>
                        <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Primary Crops grown</span><p className="font-bold text-emerald-800">{selectedCustProfile.cropType || '—'}</p></div>
                        <div className="col-span-2"><span className="text-gray-400 font-bold block text-[9px] uppercase">Soil Quality rating</span><p className="font-bold text-gray-700">{selectedCustProfile.soilType || '—'}</p></div>
                      </div>
                    ) : (
                      <p className="text-center text-gray-400 font-semibold py-4">Farmer profile fields are not applicable for this customer segment.</p>
                    )}
                  </div>
                )}

                {/* Tab Content: Outstanding Credit */}
                {profileActiveTab === 'Outstanding Credit' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-slate-50 p-3 border rounded-xl">
                        <span className="text-gray-400 font-bold block text-[9px] uppercase">Authorized Credit Limit</span>
                        <p className="text-lg font-black text-gray-800">₹{selectedCustProfile.creditLimit.toLocaleString()}</p>
                      </div>
                      <div className="bg-orange-50/50 p-3 border border-orange-100 rounded-xl">
                        <span className="text-orange-500 font-bold block text-[9px] uppercase">Outstanding Balance</span>
                        <p className="text-lg font-black text-orange-700">₹{selectedCustProfile.creditBalance.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content: Loyalty Balance */}
                {profileActiveTab === 'Loyalty Balance' && (
                  <div className="space-y-3">
                    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
                      <span className="text-emerald-700 font-bold block text-[10px] uppercase">Accrued Loyalty Points Balance</span>
                      <p className="text-3xl font-black text-emerald-800 mt-1">{selectedCustProfile.loyaltyPoints} points</p>
                      <p className="text-[10px] text-emerald-600 mt-1">Valued at ₹{(selectedCustProfile.loyaltyPoints/10).toFixed(0)} discount on next billing.</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={() => toast.success(`Client report exported for ${selectedCustProfile.name}`)} className="flex-1 btn-primary py-2 font-bold uppercase tracking-wider">Download Profile PDF</button>
                  <button onClick={() => setSelectedCustProfile(null)} className="btn-secondary px-6 py-2 font-bold">Close Profile</button>
                </div>
              </div>
            </Modal>
          )}

        </div>
      ) : activeCategory === 'Billing & POS' ? (
        <div className="space-y-6">

          {/* ===== BILLING OVERVIEW / DASHBOARD (Fallback) ===== */}
          {!['Billing', 'Bill History', 'Udhari / Credit', 'Payment Collection', 'Daily Cash Reports'].includes(activeSubItem) && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Billing & POS Dashboard</h2>
                <p className="text-xs text-gray-400">Terminal sales tracking, cash flow reports, outstanding credit logs and billing summaries.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: "Today's Sales", val: `₹${dailyCash.sales.toLocaleString()}`, color: 'text-emerald-800', bg: 'bg-emerald-50/50' },
                  { label: "Today's Bills", val: posBills.length + 1, color: 'text-blue-600', bg: 'bg-blue-50/50' },
                  { label: 'Total Revenue', val: `₹${(posBills.reduce((s, b) => s + b.amount, 0) + dailyCash.sales).toLocaleString()}`, color: 'text-gray-800', bg: 'bg-white' },
                  { label: 'Pending Credits', val: `₹${customers.reduce((s, c) => s + c.creditBalance, 0).toLocaleString()}`, color: 'text-orange-600', bg: 'bg-orange-50/50' },
                  { label: 'Split/UPI Payments', val: '40%', color: 'text-purple-600', bg: 'bg-purple-50/50' },
                  { label: 'Avg Bill Value', val: '₹4,820', color: 'text-slate-700', bg: 'bg-slate-50/50' },
                ].map((k, i) => (
                  <div key={i} className={`kpi-card border ${k.bg}`}>
                    <p className={`text-xl font-black ${k.color}`}>{k.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="kpi-card lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Today's Sales Trend (Hourly Breakdown)</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={posSalesByHour}>
                      <defs>
                        <linearGradient id="posSalesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#236625" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#236625" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="hour" tick={{ fontSize: 10 }}/>
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${v}`}/>
                      <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Sales Volume']}/>
                      <Area type="monotone" dataKey="amount" stroke="#236625" fill="url(#posSalesGrad)" strokeWidth={2}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="kpi-card flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Payment Method Share</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={paymentDistributionData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={4}>
                        {paymentDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color}/>
                        ))}
                      </Pie>
                      <Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {paymentDistributionData.map((c, i) => (
                      <div key={i} className="flex justify-between text-[10px]">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}/>{c.name}</div>
                        <span className="font-bold text-gray-700">{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cash Ledger Report & Refunds */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="kpi-card lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">Daily Cash Register Drawer</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { label: 'Opening Cash', val: dailyCash.opening, color: 'text-gray-500' },
                      { label: 'Total Sales', val: dailyCash.sales, color: 'text-[#236625]' },
                      { label: 'Cash Collected', val: dailyCash.collected, color: 'text-emerald-700' },
                      { label: 'Expenses logged', val: dailyCash.expenses, color: 'text-red-500' },
                      { label: 'Closing Register Balance', val: dailyCash.closing, color: 'text-gray-800 font-black' },
                    ].map((c, idx) => (
                      <div key={idx} className="bg-slate-50 border rounded-xl p-3 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase leading-tight mb-1">{c.label}</p>
                        <p className={`text-sm font-bold ${c.color}`}>₹{c.val.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="kpi-card flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Billing Quick Actions</h3>
                    <p className="text-[10px] text-gray-400 mt-1">Initiate immediate POS returns or adjustments.</p>
                  </div>
                  <div className="flex gap-2.5 mt-4">
                    <button onClick={() => {
                      const inv = prompt('Enter Invoice / Bill Number for Refund:');
                      const amt = prompt('Enter Refund Amount (₹):');
                      if (inv && amt) {
                        toast.success(`Refund of ₹${amt} successfully queued for Invoice ${inv}`);
                      }
                    }} className="flex-1 btn-primary py-2 text-[10px] font-bold">Quick Refund</button>
                    <button onClick={() => toast.success('Daily cash drawer reports cleared and exported.')} className="btn-secondary px-3 py-2 text-[10px] font-bold">Close Shift Drawer</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== 1. POS BILLING SCREEN SUBMODULE ===== */}
          {activeSubItem === 'Billing' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>POS Billing Terminal</h2>
                  <p className="text-xs text-gray-400">Scan barcodes, manage customer carts, configure discounts, and print bills.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Active Terminal</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Baramati Counter 01</span>
                  </div>
                </div>
              </div>

              {/* POS Grid layout */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* Left Side: Product Selection & Catalog (7 Columns) */}
                <div className="xl:col-span-7 space-y-4">
                  <div className="kpi-card space-y-3">
                    {/* Search & Categories */}
                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="flex items-center gap-2 border rounded-lg px-3 bg-slate-50 flex-1 min-w-[200px]">
                        <Search size={13} className="text-gray-400"/>
                        <input
                          type="text"
                          placeholder="Search product name, code, barcode..."
                          value={posSearchQuery}
                          onChange={e => setPosSearchQuery(e.target.value)}
                          className="bg-transparent text-xs outline-none py-2 text-gray-700 w-full"
                        />
                      </div>
                      <select
                        value={posCatFilter}
                        onChange={e => setPosCatFilter(e.target.value)}
                        className="text-xs font-bold border rounded-lg px-3 py-2 bg-white"
                      >
                        <option value="All">All Categories</option>
                        <option>Seeds</option><option>Fertilizers</option><option>Pesticides</option><option>Tools</option>
                      </select>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[360px] pr-1">
                      {products
                        .filter(p => (p.name.toLowerCase().includes(posSearchQuery.toLowerCase()) || p.id.toLowerCase().includes(posSearchQuery.toLowerCase()) || p.sku.toLowerCase().includes(posSearchQuery.toLowerCase())) && (posCatFilter === 'All' || p.category === posCatFilter))
                        .map((prod, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              if (prod.stock <= 0) {
                                toast.error(`${prod.name} is Out of stock!`);
                                return;
                              }
                              setPosCart(prev => {
                                const exist = prev.find(item => item.id === prod.id);
                                if (exist) {
                                  return prev.map(item => item.id === prod.id ? { ...item, qty: Math.min(prod.stock, item.qty + 1) } : item);
                                }
                                return [...prev, { id: prod.id, name: prod.name, price: prod.price, qty: 1, stock: prod.stock }];
                              });
                              toast.success(`${prod.name} added to cart.`);
                            }}
                            className={`border rounded-xl p-2 text-center cursor-pointer hover:border-[#236625] transition-all bg-slate-50/50 flex flex-col justify-between h-36 ${prod.stock <= 3 ? 'border-orange-300' : 'border-gray-100'}`}
                          >
                            <div className="relative w-full h-16 rounded-lg overflow-hidden bg-slate-100 mb-1.5 flex items-center justify-center">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                              {prod.stock <= 3 && (
                                <span className="absolute bottom-1 right-1 bg-orange-600 text-white font-bold text-[8px] uppercase px-1 rounded-sm">Low Stock ({prod.stock})</span>
                              )}
                            </div>
                            <div>
                              <h5 className="font-bold text-gray-800 text-[10px] leading-tight truncate">{prod.name}</h5>
                              <p className="font-black text-emerald-800 text-xs mt-0.5">₹{prod.price}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: Cart Summary & Billing Process (5 Columns) */}
                <div className="xl:col-span-5 space-y-4">
                  <div className="kpi-card flex flex-col justify-between min-h-[480px]">
                    <div>
                      {/* Customer Profile Picker */}
                      <div className="border-b pb-3 mb-3">
                        <span className="block font-bold text-[9px] text-gray-400 uppercase mb-1.5">Selected Customer</span>
                        {selectedPosCust ? (
                          <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold text-emerald-950">{selectedPosCust.name}</p>
                              <p className="text-[10px] text-emerald-700">Phone: {selectedPosCust.mobile} • Balance: ₹{selectedPosCust.creditBalance}</p>
                            </div>
                            <button onClick={() => setSelectedPosCust(null)} className="text-[10px] font-bold text-red-600 hover:underline">Change</button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <select
                              onChange={(e) => {
                                const custObj = customers.find(x => x.id === e.target.value);
                                if (custObj) setSelectedPosCust(custObj);
                              }}
                              className="w-full border rounded-lg px-3 py-2 text-xs bg-white outline-none"
                              defaultValue=""
                            >
                              <option value="" disabled>Select Existing Customer...</option>
                              {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.mobile})</option>)}
                            </select>
                            <button onClick={() => toast.success('Redirected to customer management to add new customer.')} className="btn-secondary text-[10px] font-bold whitespace-nowrap px-2">+ Quick Add</button>
                          </div>
                        )}
                      </div>

                      {/* Cart Table list */}
                      <span className="block font-bold text-[9px] text-gray-400 uppercase mb-2">Cart Item Details</span>
                      {posCart.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 border border-dashed rounded-xl bg-slate-50/50">
                          <ShoppingCart size={24} className="mx-auto mb-2 opacity-50"/>
                          <p className="text-xs font-semibold">Shopping cart is empty.</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                          {posCart.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between border-b pb-2 text-xs">
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-gray-800 truncate">{item.name}</p>
                                <p className="text-[10px] text-gray-400">₹{item.price} each</p>
                              </div>
                              <div className="flex items-center gap-1.5 px-3">
                                <button
                                  onClick={() => {
                                    setPosCart(prev => prev.map(x => x.id === item.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x));
                                  }}
                                  className="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 font-bold flex items-center justify-center"
                                >-</button>
                                <span className="font-bold w-5 text-center">{item.qty}</span>
                                <button
                                  onClick={() => {
                                    setPosCart(prev => prev.map(x => x.id === item.id ? { ...x, qty: Math.min(item.stock, x.qty + 1) } : x));
                                  }}
                                  className="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 font-bold flex items-center justify-center"
                                >+</button>
                              </div>
                              <div className="text-right whitespace-nowrap font-bold text-gray-800">
                                ₹{(item.qty * item.price).toLocaleString()}
                                <button
                                  onClick={() => {
                                    setPosCart(prev => prev.filter(x => x.id !== item.id));
                                    toast.success(`${item.name} removed from cart.`);
                                  }}
                                  className="text-red-500 hover:text-red-700 ml-2"
                                >✕</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Financial Summary & Payment */}
                    <div className="border-t pt-3 mt-3 space-y-2.5 text-xs text-gray-600">
                      <div className="flex justify-between"><span>Subtotal:</span><span className="font-bold text-gray-800">₹{posCart.reduce((s, i) => s + i.qty*i.price, 0).toLocaleString()}</span></div>
                      <div className="flex justify-between items-center">
                        <span>Discount (₹):</span>
                        <input
                          type="number"
                          value={posDiscount}
                          onChange={(e) => setPosDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-20 border rounded px-2 py-0.5 text-right font-bold"
                        />
                      </div>
                      <div className="flex justify-between"><span>Tax (Estimated 10%):</span><span className="font-bold">₹{(posCart.reduce((s, i) => s + i.qty*i.price, 0) * 0.1).toFixed(0)}</span></div>
                      <div className="flex justify-between text-base font-black border-t pt-2 text-[#236625]">
                        <span>Grand Total:</span>
                        <span>₹{(Math.max(0, posCart.reduce((s, i) => s + i.qty*i.price, 0)*1.1 - posDiscount)).toFixed(0)}</span>
                      </div>

                      {/* Payment Method Selector */}
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t">
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Pay Mode</label>
                          <select
                            value={paymentMode}
                            onChange={(e) => setPaymentMode(e.target.value)}
                            className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-white"
                          >
                            <option>Cash</option><option>UPI</option><option>Debit Card</option><option>Credit Card</option><option>Udhari</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Amount Received</label>
                          <input
                            type="number"
                            placeholder="Enter amount"
                            onChange={(e) => {
                              const rec = parseFloat(e.target.value) || 0;
                              const total = parseFloat((posCart.reduce((s, i) => s + i.qty*i.price, 0)*1.1 - posDiscount).toFixed(0)) || 0;
                              setChangeCalculation({ received: rec, change: Math.max(0, rec - total) });
                            }}
                            className="w-full border rounded-lg px-2.5 py-1 text-xs"
                          />
                        </div>
                      </div>

                      {changeCalculation.change > 0 && (
                        <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg text-center font-bold text-emerald-800 text-[11px]">
                          Return Change Amount: ₹{changeCalculation.change}
                        </div>
                      )}

                      <button
                        onClick={() => {
                          const total = parseFloat((posCart.reduce((s, i) => s + i.qty*i.price, 0)*1.1 - posDiscount).toFixed(0)) || 0;
                          if (posCart.length === 0) {
                            toast.error('Cart is empty!');
                            return;
                          }
                          const billNo = `BILL-${String(posBills.length + 1001)}`;
                          const newB = {
                            invoiceNo: billNo,
                            customerName: selectedPosCust?.name || 'Walk-in Customer',
                            phone: selectedPosCust?.mobile || 'N/A',
                            amount: total,
                            payMethod: paymentMode,
                            date: new Date().toISOString().split('T')[0],
                            status: paymentMode === 'Udhari' ? 'Pending' : 'Paid',
                            tax: parseFloat((total * 0.1).toFixed(0)),
                            discount: posDiscount,
                            items: posCart
                          };
                          setPosBills(prev => [newB, ...prev]);
                          if (paymentMode === 'Udhari' && selectedPosCust) {
                            setCustomers(prev => prev.map(x => x.id === selectedPosCust.id ? { ...x, creditBalance: x.creditBalance + total } : x));
                          }
                          toast.success(`Invoice ${billNo} generated successfully!`);
                          setIsInvoiceOpenModal(newB);
                          setPosCart([]);
                          setPosDiscount(0);
                        }}
                        className="w-full btn-primary py-2.5 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5"
                      >
                        <FileCheck size={14}/> Complete &amp; Generate Invoice
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ===== 2. BILL HISTORY SUBMODULE ===== */}
          {activeSubItem === 'Bill History' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Sales Transactions & Bill History</h2>
                <p className="text-xs text-gray-400">Search, audit, print duplicates or download professional invoices.</p>
              </div>

              {/* Filters */}
              <div className="kpi-card flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 border rounded-lg px-3 bg-slate-50 flex-1 min-w-[200px]">
                  <Search size={13} className="text-gray-400"/>
                  <input type="text" placeholder="Search Invoice Number or Customer..." value={billSearch} onChange={e => setBillSearch(e.target.value)} className="bg-transparent text-xs outline-none py-2 text-gray-700 w-full"/>
                </div>
                <select value={billPaymentMethodFilter} onChange={e => setBillPaymentMethodFilter(e.target.value)} className="text-xs font-bold border rounded-lg px-3 py-2 bg-white">
                  <option value="All">All Pay Modes</option>
                  <option>Cash</option><option>UPI</option><option>Debit Card</option><option>Credit Card</option><option>Udhari</option>
                </select>
              </div>

              {/* Bills history table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Invoice Number</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment Method</th>
                      <th className="p-3">Billing Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posBills
                      .filter(b => (b.invoiceNo.toLowerCase().includes(billSearch.toLowerCase()) || b.customerName.toLowerCase().includes(billSearch.toLowerCase())) && (billPaymentMethodFilter === 'All' || b.payMethod === billPaymentMethodFilter))
                      .map((b, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50/40">
                          <td className="p-3 font-mono font-bold text-emerald-800">{b.invoiceNo}</td>
                          <td className="p-3">
                            <p className="font-semibold text-gray-800">{b.customerName}</p>
                            <span className="text-[9px] text-gray-400">{b.phone}</span>
                          </td>
                          <td className="p-3 font-black text-gray-800">₹{b.amount.toLocaleString()}</td>
                          <td className="p-3 text-gray-600 font-bold">{b.payMethod}</td>
                          <td className="p-3 text-gray-500">{b.date}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${b.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{b.status}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button onClick={() => setIsInvoiceOpenModal(b)} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">View Invoice</button>
                              <button onClick={() => toast.success(`Receipt printed for ${b.invoiceNo}`)} className="text-[10px] font-bold text-white bg-slate-700 px-2 py-1 rounded flex items-center gap-1"><Printer size={10}/> Print</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== 3. UDHARI / CREDIT MANAGEMENT SUBMODULE ===== */}
          {activeSubItem === 'Udhari / Credit' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Udhari &amp; Customer Credit Dashboard</h2>
                <p className="text-xs text-gray-400">Review outstanding farmer credit balances and log partial payment collections.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total Outstanding Udhari Dues', val: `₹${customers.reduce((s,c) => s+c.creditBalance, 0).toLocaleString()}`, color: 'text-orange-700' },
                  { label: 'Total Available Credit Limit', val: `₹${customers.reduce((s,c) => s+(c.creditLimit - c.creditBalance), 0).toLocaleString()}`, color: 'text-green-700' },
                  { label: 'Total Accounts Tracked', val: customers.filter(c => c.creditLimit > 0).length, color: 'text-gray-800' }
                ].map((s, i) => (
                  <div key={i} className="kpi-card text-center">
                    <p className="text-xl font-black text-gray-800">{s.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Credit Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase tracking-wider text-left bg-gray-50/55">
                      <th className="p-3">Farmer / Customer</th>
                      <th className="p-3">Mobile No.</th>
                      <th className="p-3">Credit Limit</th>
                      <th className="p-3">Outstanding balance</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers
                      .filter(c => c.creditLimit > 0)
                      .map((c, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50/40">
                          <td className="p-3 font-semibold text-gray-800">{c.name}</td>
                          <td className="p-3 text-gray-500">{c.mobile}</td>
                          <td className="p-3 font-bold text-gray-700">₹{c.creditLimit.toLocaleString()}</td>
                          <td className={`p-3 font-black ${c.creditBalance > 0 ? 'text-red-600' : 'text-gray-500'}`}>₹{c.creditBalance.toLocaleString()}</td>
                          <td className="p-3 text-gray-500">{c.creditDueDate || '—'}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.creditBalance > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{c.creditBalance > 0 ? 'Dues Pending' : 'Clear'}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              {c.creditBalance > 0 ? (
                                <button onClick={() => setShowCollectPaymentModal(c)} className="text-[10px] font-bold text-white bg-emerald-700 px-2 py-1 rounded">Collect payment</button>
                              ) : (
                                <span className="text-[10px] text-gray-400 font-semibold">No Dues</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== 4. REFUNDS & ADJUSTMENTS ===== */}
          {activeSubItem === 'Payment Collection' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Returns & Billing Adjustments</h2>
                <p className="text-xs text-gray-400">Process refunds for items returned by farmers or adjust checkout balances.</p>
              </div>

              <div className="kpi-card max-w-md space-y-4">
                <h3 className="text-sm font-bold text-gray-800">Process POS Refund</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Invoice Number</label>
                    <input
                      type="text"
                      placeholder="e.g. BILL-1001"
                      value={refundInvoiceNo}
                      onChange={e => setRefundInvoiceNo(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Reason for refund</label>
                    <select
                      value={refundReason}
                      onChange={e => setRefundReason(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 outline-none bg-white"
                    >
                      <option>Damaged Product</option><option>Wrong crop seeds type</option><option>Customer returned goods</option><option>Double transaction billed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Refund Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="Total refund amount"
                      value={refundAmt}
                      onChange={e => setRefundAmt(parseFloat(e.target.value) || 0)}
                      className="w-full border rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!refundInvoiceNo || refundAmt <= 0) {
                        toast.error('Please enter valid invoice details and refund amount.');
                        return;
                      }
                      setPosBills(prev => prev.map(b => b.invoiceNo === refundInvoiceNo ? { ...b, amount: Math.max(0, b.amount - refundAmt) } : b));
                      toast.success(`Refund of ₹${refundAmt} successfully processed for invoice ${refundInvoiceNo}.`);
                      setRefundInvoiceNo('');
                      setRefundAmt(0);
                    }}
                    className="w-full btn-primary py-2.5 font-bold uppercase text-xs"
                  >
                    Confirm Refund &amp; Update Ledger
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== 5. DAILY CASH SHIFT REPORTS ===== */}
          {activeSubItem === 'Daily Cash Reports' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Daily Cash Shift Register</h2>
                  <p className="text-xs text-gray-400">Monitor cash box reconciliation, cash deposits, and daily counter expenses.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="kpi-card space-y-4">
                  <h3 className="text-sm font-bold text-gray-800">Shift Reconciliation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2"><span>Opening Balance:</span><span className="font-bold text-gray-700">₹{dailyCash.opening.toLocaleString()}</span></div>
                    <div className="flex justify-between border-b pb-2"><span>Cash Sales:</span><span className="font-bold text-emerald-700">₹{dailyCash.sales.toLocaleString()}</span></div>
                    <div className="flex justify-between border-b pb-2"><span>Cash Collected from credit:</span><span className="font-bold text-emerald-700">₹{dailyCash.collected.toLocaleString()}</span></div>
                    <div className="flex justify-between border-b pb-2"><span>Less counter expenses:</span><span className="font-bold text-red-600">₹{dailyCash.expenses.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm font-black border-t pt-2 text-gray-800"><span>Theoretical Closing Balance:</span><span>₹{dailyCash.closing.toLocaleString()}</span></div>
                  </div>
                </div>

                <div className="kpi-card space-y-3">
                  <h3 className="text-sm font-bold text-gray-800">Audit & Shift Close Operations</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Actual Physical Cash Counted (₹)</label>
                      <input id="physicalCash" type="number" placeholder="Enter physical cash box total" className="w-full border rounded-lg px-3 py-2 outline-none"/>
                    </div>
                    <button
                      onClick={() => {
                        const phys = parseFloat(document.getElementById('physicalCash').value) || 0;
                        const diff = phys - dailyCash.closing;
                        if (diff === 0) {
                          toast.success('Shift matched perfectly! Cash register closed.');
                        } else if (diff > 0) {
                          toast.success(`Shift closed with surplus of ₹${diff}. Recorded successfully.`);
                        } else {
                          toast.error(`Shift closed with deficit of ₹${Math.abs(diff)}. Deficit logged.`);
                        }
                        document.getElementById('physicalCash').value = '';
                      }}
                      className="w-full btn-primary py-2.5 font-bold uppercase text-xs"
                    >
                      Close Drawer Shift &amp; Audit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== POS PROFESSIONAL INVOICE MODAL SYSTEM ===== */}
          {isInvoiceOpenModal && (
            <Modal isOpen={!!isInvoiceOpenModal} onClose={() => setIsInvoiceOpenModal(null)} title="AgriERP Retail Sales Invoice" size="md">
              <div className="space-y-4 text-xs font-mono bg-white p-3 rounded-lg border text-gray-800">
                {/* Invoice Header */}
                <div className="text-center border-b pb-3 space-y-1">
                  <h2 className="text-lg font-black text-emerald-800" style={{ fontFamily: 'Poppins, sans-serif' }}>KRISHICARE AGRO-SERVICES</h2>
                  <p className="text-[10px] text-gray-400">APMC Market Road, Baramati, Pune (MH)</p>
                  <p className="text-[10px] text-gray-400">GSTIN: 27AAAAA1111A1Z1 • Phone: +91 98765 43210</p>
                </div>

                {/* Details info */}
                <div className="grid grid-cols-2 gap-2 text-[10px] pb-2 border-b">
                  <div>
                    <span className="font-bold block text-gray-400">INVOICE DETAILS</span>
                    <p>Bill ID: {isInvoiceOpenModal.invoiceNo}</p>
                    <p>Date: {isInvoiceOpenModal.date}</p>
                    <p>Payment: {isInvoiceOpenModal.payMethod}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold block text-gray-400">CUSTOMER DETAILS</span>
                    <p>{isInvoiceOpenModal.customerName}</p>
                    <p>Phone: {isInvoiceOpenModal.phone}</p>
                  </div>
                </div>

                {/* Table details */}
                <div>
                  <table className="w-full text-left text-[10px]">
                    <thead>
                      <tr className="border-b text-gray-500 font-bold">
                        <th className="pb-1">Product Description</th>
                        <th className="pb-1 text-center">Qty</th>
                        <th className="pb-1 text-right">Price</th>
                        <th className="pb-1 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isInvoiceOpenModal.items?.map((item, idx) => (
                        <tr key={idx} className="border-b border-dashed">
                          <td className="py-1.5">{item.name}</td>
                          <td className="py-1.5 text-center">{item.qty}</td>
                          <td className="py-1.5 text-right">₹{item.price}</td>
                          <td className="py-1.5 text-right">₹{(item.qty * item.price).toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="font-bold">
                        <td colSpan="3" className="pt-2 text-right">Subtotal:</td>
                        <td className="pt-2 text-right">₹{(isInvoiceOpenModal.amount - isInvoiceOpenModal.tax + isInvoiceOpenModal.discount).toLocaleString()}</td>
                      </tr>
                      {isInvoiceOpenModal.discount > 0 && (
                        <tr className="text-red-600">
                          <td colSpan="3" className="text-right">Discount:</td>
                          <td className="text-right">-₹{isInvoiceOpenModal.discount}</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan="3" className="text-right text-gray-400">Tax (approx 10%):</td>
                        <td className="text-right text-gray-500">₹{isInvoiceOpenModal.tax}</td>
                      </tr>
                      <tr className="font-black text-emerald-800 text-sm">
                        <td colSpan="3" className="pt-1.5 text-right">Grand Total:</td>
                        <td className="pt-1.5 text-right">₹{isInvoiceOpenModal.amount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer notes */}
                <div className="text-center pt-3 border-t border-dashed space-y-1 text-[9px] text-gray-400">
                  <p className="font-bold text-gray-600">Thank you for visiting KrishiCare!</p>
                  <p>Save water, save crops. Keep agricultural receipts for GST claim purposes.</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => toast.success(`Receipt printed for ${isInvoiceOpenModal.invoiceNo}`)} className="flex-1 btn-primary py-2 text-[10px] font-bold flex items-center justify-center gap-1"><Printer size={10}/> Print Receipt</button>
                  <button onClick={() => toast.success(`Invoice PDF downloaded for ${isInvoiceOpenModal.invoiceNo}`)} className="btn-secondary px-3 py-2 text-[10px] font-bold">Download PDF</button>
                  <button onClick={() => setIsInvoiceOpenModal(null)} className="btn-secondary px-4 py-2 text-[10px] font-bold">Close</button>
                </div>
              </div>
            </Modal>
          )}

        </div>
      ) : activeCategory === 'Delivery Management' ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Delivery Hub Dashboard</h2>
              <p className="text-xs text-gray-400">Track and dispatch deliveries, manage logistics staff, optimize routes and track cash collections.</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => {
                  setDeliveries(prev => prev.map(d => {
                    if (d.status === 'Pending') {
                      const availableExec = deliveryExecutives.find(e => e.status === 'Available');
                      if (availableExec) {
                        return { ...d, executive: availableExec.name, status: 'In Transit', eta: '45 mins' };
                      }
                    }
                    return d;
                  }));
                  toast.success('Auto-assignment model completed! Dispatched pending orders to Available executives.');
                }}
                className="btn-primary py-2 px-3 flex items-center gap-1.5 font-bold"
              >
                <Truck size={14}/> Auto-Assign Drivers
              </button>
              <button
                onClick={() => {
                  setDeliveries(prev => prev.map(d => {
                    if (d.status === 'Pending') {
                      return { ...d, executive: 'Sunita Desai', status: 'In Transit', eta: '1.5 Hours' };
                    }
                    return d;
                  }));
                  toast.success('Bulk assigned all pending orders to Sunita Desai.');
                }}
                className="btn-secondary py-2 px-3 font-bold"
              >
                Bulk Dispatch
              </button>
            </div>
          </div>

          {/* ================= 1. OVERVIEW SCREEN ================= */}
          {!['Delivery Assignments', 'Delivery Tracking', 'Delivery Staff', 'Route Optimization', 'Failed Deliveries', 'Delivery Reports'].includes(activeSubItem) && (
            <div className="space-y-6">
              {/* Dashboard Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Total Deliveries', val: deliveries.length, color: 'text-gray-800', bg: 'bg-white' },
                  { label: 'Pending Deliveries', val: deliveries.filter(d => d.status === 'Pending').length, color: 'text-amber-600', bg: 'bg-amber-50/50' },
                  { label: 'In Transit', val: deliveries.filter(d => d.status === 'In Transit').length, color: 'text-blue-600', bg: 'bg-blue-50/50' },
                  { label: 'Completed Deliveries', val: deliveries.filter(d => d.status === 'Delivered').length, color: 'text-[#236625]', bg: 'bg-emerald-50/50' },
                  { label: 'Failed Deliveries', val: deliveries.filter(d => d.status === 'Failed').length, color: 'text-red-600', bg: 'bg-red-50/50' },
                  { label: 'Delivery Success Rate', val: `${Math.round((deliveries.filter(d => d.status === 'Delivered').length / (deliveries.length || 1)) * 100)}%`, color: 'text-purple-600', bg: 'bg-purple-50/50' }
                ].map((c, i) => (
                  <div key={i} className={`kpi-card border ${c.bg}`}>
                    <p className={`text-xl font-black ${c.color}`}>{c.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{c.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trend Chart */}
                <div className="kpi-card lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Delivery Trend &amp; Performance (Weekly Overview)</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={deliveryTrendData}>
                      <defs>
                        <linearGradient id="deliveryGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#236625" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#236625" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }}/>
                      <YAxis tick={{ fontSize: 10 }}/>
                      <Tooltip/>
                      <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: 10 }}/>
                      <Area name="Completed Deliveries" type="monotone" dataKey="completed" stroke="#236625" fill="url(#deliveryGrad)" strokeWidth={2}/>
                      <Area name="Failed Attempts" type="monotone" dataKey="failed" stroke="#ef4444" fill="none" strokeWidth={1.5} strokeDasharray="4 4"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Status Distribution */}
                <div className="kpi-card flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Delivery Status Shares</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={deliveryStatusDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={4}>
                        {deliveryStatusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color}/>
                        ))}
                      </Pie>
                      <Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {deliveryStatusDistribution.map((c, i) => (
                      <div key={i} className="flex justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}/>
                          {c.name}
                        </div>
                        <span className="font-bold text-gray-700">{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Extra details, Complaints & Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active complaints table */}
                <div className="kpi-card space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-800">Active Delivery Complaints</h3>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{deliveryComplaints.filter(c => c.status === 'Pending').length} Pending</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b text-gray-400 font-semibold uppercase text-left bg-gray-50/50">
                          <th className="p-2">Comp ID</th>
                          <th className="p-2">Customer</th>
                          <th className="p-2">Complaint Type</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveryComplaints.map((c, idx) => (
                          <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/40">
                            <td className="p-2 font-mono font-bold text-emerald-800">{c.compId}</td>
                            <td className="p-2 font-semibold">{c.customer}</td>
                            <td className="p-2 text-gray-500">{c.type}</td>
                            <td className="p-2">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{c.status}</span>
                            </td>
                            <td className="p-2">
                              {c.status === 'Pending' ? (
                                <button
                                  onClick={() => {
                                    setDeliveryComplaints(prev => prev.map(x => x.compId === c.compId ? { ...x, status: 'Resolved' } : x));
                                    toast.success(`Complaint ${c.compId} resolved and archived.`);
                                  }}
                                  className="text-[9px] font-bold text-white bg-[#236625] px-2 py-0.5 rounded"
                                >
                                  Resolve
                                </button>
                              ) : (
                                <span className="text-[9px] font-semibold text-gray-400">Closed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Activities feed */}
                <div className="kpi-card space-y-3">
                  <h3 className="text-sm font-bold text-gray-800">Recent Delivery Activities</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Truck, title: 'Delivery Dispatched', desc: 'Ramesh Kumar (ORD-9082) dispatched with driver Sunita Desai.', time: '10m ago' },
                      { icon: CheckCircle2, title: 'OTP Verified Successfully', desc: 'Order ORD-9081 delivered securely via OTP 4821.', time: '1 hour ago' },
                      { icon: CreditCard, title: 'COD Payment Collected', desc: 'Collected ₹8,900 from Anita Deshpande via UPI on delivery.', time: '3 hours ago' },
                      { icon: AlertTriangle, title: 'Delivery Attempt Failed', desc: 'ORD-9086 failed. Reason: Customer Unavailable.', time: '1 day ago' }
                    ].map((act, i) => {
                      const IconComp = act.icon;
                      return (
                        <div key={i} className="flex gap-3 text-xs border-b pb-2 last:border-0 last:pb-0">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                            <IconComp size={14}/>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{act.title}</p>
                            <p className="text-[10px] text-gray-500">{act.desc}</p>
                            <span className="text-[9px] text-gray-400 block mt-0.5">{act.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. DELIVERY ASSIGNMENTS ================= */}
          {activeSubItem === 'Delivery Assignments' && (
            <div className="space-y-5">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase">Order Dispatch &amp; Assignments</h3>
                  <p className="text-xs text-gray-400">Assign drivers to incoming shipments or monitor delivery ETA status.</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 border rounded-lg px-3 bg-slate-50 text-xs">
                    <Search size={12} className="text-gray-400"/>
                    <input
                      type="text"
                      placeholder="Search Order, Customer..."
                      value={deliverySearchQuery}
                      onChange={e => setDeliverySearchQuery(e.target.value)}
                      className="bg-transparent outline-none py-1.5 w-40 text-gray-700"
                    />
                  </div>
                  <select
                    value={deliveryStatusFilter}
                    onChange={e => setDeliveryStatusFilter(e.target.value)}
                    className="border rounded-lg text-xs px-2 py-1 bg-white font-bold"
                  >
                    <option value="All">All Statuses</option>
                    <option>Pending</option>
                    <option>In Transit</option>
                    <option>Delivered</option>
                    <option>Failed</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase bg-gray-50/50">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Address</th>
                      <th className="p-3">Delivery Executive</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Expected Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries
                      .filter(d => {
                        const mSearch = d.customer.toLowerCase().includes(deliverySearchQuery.toLowerCase()) || d.orderId.toLowerCase().includes(deliverySearchQuery.toLowerCase());
                        const mStatus = deliveryStatusFilter === 'All' || d.status === deliveryStatusFilter;
                        return mSearch && mStatus;
                      })
                      .map((d, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50/30">
                          <td className="p-3 font-mono font-bold text-emerald-800">{d.orderId}</td>
                          <td className="p-3">
                            <p className="font-semibold text-gray-800">{d.customer}</p>
                            <span className="text-[9px] text-gray-400">Total COD: ₹{d.amount.toLocaleString()} ({d.payStatus})</span>
                          </td>
                          <td className="p-3 text-gray-500 max-w-[150px] truncate" title={d.address}>{d.address}</td>
                          <td className="p-3 font-semibold text-gray-700">
                            {d.executive ? (
                              <span className="flex items-center gap-1"><User size={10} className="text-gray-400"/> {d.executive}</span>
                            ) : (
                              <span className="text-red-500 font-bold italic">Unassigned</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              d.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              d.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                              d.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            }`}>{d.status}</span>
                          </td>
                          <td className="p-3 text-gray-500">{d.expectedDate}</td>
                          <td className="p-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => setSelectedDelDetails(d)} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">Details</button>
                              {!d.executive ? (
                                <button onClick={() => setShowAssignExecModal(d)} className="text-[10px] font-bold text-white bg-[#236625] px-2.5 py-1 rounded">Assign</button>
                              ) : (
                                <button onClick={() => setShowAssignExecModal(d)} className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded">Reassign</button>
                              )}
                              {d.status === 'In Transit' && (
                                <button onClick={() => setShowOtpVerifyModal(d)} className="text-[10px] font-bold text-white bg-amber-600 px-2.5 py-1 rounded">Verify OTP</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 3. DELIVERY TRACKING ================= */}
          {activeSubItem === 'Delivery Tracking' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Live Delivery Tracking Dashboard</h3>
                <p className="text-xs text-gray-400">Monitor vehicle routes, estimated arrival times, and delivery progress parameters.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Active tracking cards */}
                <div className="kpi-card space-y-4 lg:col-span-1">
                  <h4 className="text-xs font-bold text-gray-500 uppercase">Active Delivery Executive</h4>
                  <div className="bg-slate-50 p-3 rounded-lg border space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-700">Driver:</span>
                      <span className="font-semibold text-emerald-800">Sunita Desai</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-700">Mobile:</span>
                      <span>+91 98760 04567</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-700">Vehicle:</span>
                      <span>Agri-EV Motorcycle</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-700">Order ID:</span>
                      <span className="font-mono font-bold text-emerald-800">ORD-9082</span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-gray-500 uppercase mt-4">Delivery Progress</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-gray-700">
                      <span>Progress:</span>
                      <span>{trackingSimProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#236625] h-full transition-all duration-1000" style={{ width: `${trackingSimProgress}%` }}/>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>APMC Hub (Shop)</span>
                      <span>Loni Village (Customer)</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Status:</span>
                      <span className={`font-bold uppercase ${isSimulatingRoute ? 'text-blue-600 animate-pulse' : 'text-gray-500'}`}>
                        {isSimulatingRoute ? 'Simulating Live Route' : trackingSimProgress >= 100 ? 'Arrived (Awaiting OTP)' : 'Simulation Stopped'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsSimulatingRoute(prev => !prev);
                          toast.success(isSimulatingRoute ? 'Simulation paused.' : 'Live simulation started!');
                        }}
                        className={`w-full py-2 text-xs font-bold rounded-lg uppercase ${isSimulatingRoute ? 'bg-amber-600 text-white' : 'bg-[#236625] text-white'}`}
                      >
                        {isSimulatingRoute ? 'Pause Simulator' : 'Start Simulation'}
                      </button>
                      <button
                        onClick={() => {
                          setTrackingSimProgress(35);
                          setIsSimulatingRoute(false);
                          toast.success('Simulation reset.');
                        }}
                        className="bg-gray-100 border text-gray-600 px-3 py-2 text-xs font-bold rounded-lg"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live map area */}
                <div className="kpi-card lg:col-span-3 min-h-[350px] flex flex-col justify-between bg-slate-100 relative overflow-hidden border">
                  {/* Map Header Overlay */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur border rounded-lg p-2.5 shadow-sm text-xs z-10 space-y-1">
                    <p className="font-bold text-gray-800">Baramati Rural Route Optimization Path</p>
                    <p className="text-[10px] text-gray-400">Current Speed: {isSimulatingRoute ? '45 km/h' : '0 km/h'} • Remaining ETA: {trackingSimProgress >= 100 ? '0 mins' : `${Math.round((100 - trackingSimProgress) * 0.15 + 2)} mins`}</p>
                  </div>

                  {/* Simulated Map Visuals */}
                  <div className="flex-1 flex items-center justify-center relative p-8">
                    {/* Background Grid Map Graphic */}
                    <div className="absolute inset-0 bg-emerald-50/30 opacity-50" style={{ backgroundImage: 'radial-gradient(#236625 0.5px, transparent 0.5px), radial-gradient(#236625 0.5px, #f8fafc 0.5px)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}/>

                    {/* Path Route Line */}
                    <svg className="absolute w-full h-full inset-0 pointer-events-none">
                      <path
                        d="M 120 220 Q 220 90, 420 180 T 680 120"
                        fill="none"
                        stroke="#bbf7d0"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <path
                        id="routePath"
                        d="M 120 220 Q 220 90, 420 180 T 680 120"
                        fill="none"
                        stroke="#236625"
                        strokeWidth="4"
                        strokeDasharray="8,6"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Location Node: Shop (Start) */}
                    <div className="absolute left-[8%] bottom-[25%] bg-white border border-emerald-600 p-2 rounded-lg text-center shadow-md flex items-center gap-1.5 z-10">
                      <Store size={14} className="text-[#236625]"/>
                      <div className="text-left leading-none"><span className="text-[8px] text-gray-400 block font-bold uppercase">Pickup</span><span className="text-[10px] font-bold text-gray-800">KrishiCare Shop</span></div>
                    </div>

                    {/* Location Node: Customer Farm (End) */}
                    <div className="absolute right-[8%] top-[20%] bg-white border border-blue-600 p-2 rounded-lg text-center shadow-md flex items-center gap-1.5 z-10">
                      <MapPin size={14} className="text-blue-600"/>
                      <div className="text-left leading-none"><span className="text-[8px] text-gray-400 block font-bold uppercase">Destination</span><span className="text-[10px] font-bold text-gray-800">Loni Village</span></div>
                    </div>

                    {/* Animated Delivery Executive Marker */}
                    <div
                      className="absolute bg-emerald-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-all duration-1000 z-20 flex items-center justify-center"
                      style={{
                        left: `${15 + (trackingSimProgress * 0.7)}%`,
                        bottom: `${30 + (Math.sin(trackingSimProgress * 0.06) * 20)}%`
                      }}
                    >
                      <Truck size={16} className="animate-bounce"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. DELIVERY STAFF ================= */}
          {activeSubItem === 'Delivery Staff' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase">Delivery Executive Staff Registry</h3>
                  <p className="text-xs text-gray-400">Manage field executives, monitor online status, and track aggregate task deliveries.</p>
                </div>
                <button
                  onClick={() => {
                    const empName = prompt('Enter Delivery Executive name:');
                    const phoneNo = prompt('Enter mobile number:');
                    if (empName && phoneNo) {
                      setDeliveryExecutives(prev => [
                        ...prev,
                        { empId: `DEL-EXE-0${prev.length + 1}`, name: empName, mobile: phoneNo, assigned: 0, completed: 0, status: 'Available' }
                      ]);
                      toast.success(`Registered Delivery Executive ${empName} successfully!`);
                    }
                  }}
                  className="btn-primary text-xs py-2 px-3 font-bold flex items-center gap-1"
                >
                  <Plus size={12}/> Register Executive
                </button>
              </div>

              {/* Grid or Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase bg-gray-50/50">
                      <th className="p-3">Employee ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Mobile Number</th>
                      <th className="p-3">Assigned Orders</th>
                      <th className="p-3">Completed Deliveries</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryExecutives.map((exec, idx) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                        <td className="p-3 font-mono font-bold text-emerald-800">{exec.empId}</td>
                        <td className="p-3 font-bold text-gray-800">{exec.name}</td>
                        <td className="p-3 text-gray-500">{exec.mobile}</td>
                        <td className="p-3 font-black text-gray-700">{exec.assigned} active</td>
                        <td className="p-3 font-semibold text-emerald-700">{exec.completed} trips</td>
                        <td className="p-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            exec.status === 'Available' ? 'bg-green-100 text-green-700' :
                            exec.status === 'Busy' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>{exec.status}</span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setSelectedExecProfile(exec)} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">View Profile</button>
                            <button onClick={() => toast.success(`Calling ${exec.name} at ${exec.mobile}...`)} className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">Contact</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 5. ROUTE OPTIMIZATION ================= */}
          {activeSubItem === 'Route Optimization' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Automated Route Optimization Engine</h3>
                <p className="text-xs text-gray-400">Calculate shortest path matrix, reduce fuel consumption, and plan multi-delivery stops.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="kpi-card space-y-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase">Suggested Logistical Routes</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Route A (Fastest)', distance: '8.5 km', time: '18 Mins', rating: 'Best Route', color: 'border-emerald-600 bg-emerald-50/50' },
                      { name: 'Route B (Via NH-65 Bypass)', distance: '12.4 km', time: '24 Mins', rating: 'Toll Route', color: 'border-gray-200' },
                      { name: 'Route C (Rural Link Road)', distance: '9.8 km', time: '30 Mins', rating: 'Under Construction', color: 'border-gray-200' }
                    ].map((rt, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setActiveRouteOption(rt.name);
                          toast.success(`Selected optimization parameters for ${rt.name}`);
                        }}
                        className={`border rounded-xl p-3 cursor-pointer hover:border-emerald-500 transition-all ${activeRouteOption === rt.name ? 'border-[#236625] bg-emerald-50/50' : 'border-gray-200'}`}
                      >
                        <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                          <span>{rt.name}</span>
                          <span className="text-[9px] font-black text-emerald-800 uppercase">{rt.rating}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                          <span>Total Distance: {rt.distance}</span>
                          <span>Est. Travel Time: {rt.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 border p-3 rounded-lg text-xs space-y-2">
                    <span className="font-bold text-gray-700 block">Active Stop Matrix Sequence</span>
                    <div className="space-y-2 text-[11px] font-semibold text-gray-600">
                      <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-[9px]">S</span><span>KrishiCare Warehouse (Pickup)</span></div>
                      <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[9px]">1</span><span>ORD-9081 (Suresh Patil) - Drop 1</span></div>
                      <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px]">2</span><span>ORD-9082 (Ramesh Kumar) - Drop 2</span></div>
                      <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-slate-400 text-white flex items-center justify-center font-bold text-[9px]">E</span><span>Counter 01 (Terminal Return)</span></div>
                    </div>
                  </div>
                </div>

                {/* Map projection Area */}
                <div className="kpi-card lg:col-span-2 min-h-[300px] bg-slate-50 relative overflow-hidden border flex flex-col justify-between">
                  <div className="p-3 border-b bg-white flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-700">Multi-Stop Dispatch Path Projection</span>
                    <button onClick={() => toast.success('Optimized route matrix synchronized to delivery executive mobile app.')} className="btn-primary py-1 px-3 text-[10px] font-bold">Synchronize Driver App</button>
                  </div>
                  {/* Mock optimized Map layout */}
                  <div className="flex-1 relative flex items-center justify-center">
                    {/* SVG routing */}
                    <svg className="absolute w-full h-full inset-0 pointer-events-none">
                      <path
                        d="M 100 240 L 220 120 L 350 200 L 480 80"
                        fill="none"
                        stroke="#236625"
                        strokeWidth="3"
                        strokeDasharray="6,4"
                      />
                    </svg>

                    <div className="absolute left-[15%] bottom-[20%] bg-emerald-800 text-white p-2 rounded-lg shadow font-mono text-[9px] font-bold">W (Warehouse)</div>
                    <div className="absolute left-[38%] top-[30%] bg-amber-600 text-white p-2 rounded-lg shadow font-mono text-[9px] font-bold">Stop 1 (ORD-9081)</div>
                    <div className="absolute right-[40%] bottom-[30%] bg-blue-600 text-white p-2 rounded-lg shadow font-mono text-[9px] font-bold">Stop 2 (ORD-9082)</div>
                    <div className="absolute right-[15%] top-[15%] bg-slate-800 text-white p-2 rounded-lg shadow font-mono text-[9px] font-bold">Counter 01 (End)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. FAILED DELIVERIES ================= */}
          {activeSubItem === 'Failed Deliveries' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Failed &amp; Returned Delivery Attempts</h3>
                <p className="text-xs text-gray-400">Track shipping failure audits, log reasons, and queue order re-attempts or cancellations.</p>
              </div>

              {/* Table list */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase bg-gray-50/50">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Executive</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Failure Reason</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries
                      .filter(d => d.status === 'Failed')
                      .map((d, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50/30">
                          <td className="p-3 font-mono font-bold text-emerald-800">{d.orderId}</td>
                          <td className="p-3 font-semibold text-gray-800">{d.customer}</td>
                          <td className="p-3 text-gray-600">{d.executive || '—'}</td>
                          <td className="p-3 font-bold text-gray-700">₹{d.amount.toLocaleString()}</td>
                          <td className="p-3 font-medium text-red-600">{d.failReason || 'Wrong Address'}</td>
                          <td className="p-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setDeliveries(prev => prev.map(x => x.orderId === d.orderId ? { ...x, status: 'Pending', failReason: undefined } : x));
                                  toast.success(`Order ${d.orderId} queued for re-attempt.`);
                                }}
                                className="text-[10px] font-bold text-[#236625] bg-emerald-50 px-2 py-1 rounded"
                              >
                                Reattempt Delivery
                              </button>
                              <button onClick={() => toast.success(`SMS alert sent to ${d.customer}...`)} className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">Contact</button>
                              <button
                                onClick={() => {
                                  setDeliveries(prev => prev.map(x => x.orderId === d.orderId ? { ...x, status: 'Cancelled' } : x));
                                  toast.error(`Order ${d.orderId} cancelled due to delivery failure.`);
                                }}
                                className="text-[10px] font-bold text-white bg-red-600 px-2 py-1 rounded"
                              >
                                Cancel Order
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {deliveries.filter(d => d.status === 'Failed').length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-gray-400 font-semibold">No failed deliveries recorded. All shipments clear!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 7. DELIVERY REPORTS ================= */}
          {activeSubItem === 'Delivery Reports' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Logistics &amp; Delivery Reports</h3>
                <p className="text-xs text-gray-400">Generate audits for delivery success metrics, driver commissions, and failures.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="kpi-card space-y-4">
                  <h4 className="text-xs font-bold text-gray-800">Generate PDF/Excel Reports</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Report Configuration</label>
                      <select
                        value={deliveryReportType}
                        onChange={e => setDeliveryReportType(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-white"
                      >
                        <option value="Daily">Daily Delivery Report</option>
                        <option value="Executive">Executive Performance Report</option>
                        <option value="Failed">Failed Delivery Report</option>
                        <option value="Revenue">Delivery Revenue &amp; COD Report</option>
                      </select>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => {
                          toast.success(`Generating ${deliveryReportType} PDF report...`);
                          setTimeout(() => toast.success(`${deliveryReportType} Report PDF downloaded!`), 1000);
                        }}
                        className="flex-1 btn-primary py-2 text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Download size={12}/> Export PDF
                      </button>
                      <button
                        onClick={() => {
                          toast.success(`Generating ${deliveryReportType} Excel sheet...`);
                          setTimeout(() => toast.success(`${deliveryReportType} Report spreadsheet downloaded!`), 1000);
                        }}
                        className="btn-secondary px-3 py-2 text-xs font-bold"
                      >
                        Export Excel
                      </button>
                    </div>
                  </div>
                </div>

                <div className="kpi-card md:col-span-2 space-y-3">
                  <h4 className="text-xs font-bold text-gray-800">Active Delivery Summary Preview</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    {[
                      { label: 'Completed Trips', val: deliveries.filter(d => d.status === 'Delivered').length },
                      { label: 'Total COD Collected', val: `₹${deliveries.reduce((sum, d) => d.status === 'Delivered' && d.payStatus === 'Paid' ? sum + d.amount : sum, 0).toLocaleString()}` },
                      { label: 'COD Dues Outstanding', val: `₹${deliveries.reduce((sum, d) => d.status === 'In Transit' && d.payStatus === 'Pending' ? sum + d.amount : sum, 0).toLocaleString()}` },
                      { label: 'Total Failures Logged', val: deliveries.filter(d => d.status === 'Failed').length }
                    ].map((k, i) => (
                      <div key={i} className="bg-slate-50 border rounded-xl p-3">
                        <p className="text-xs font-bold text-gray-400 uppercase leading-tight mb-1">{k.label}</p>
                        <p className="text-sm font-black text-gray-800">{k.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= MODALS SYSTEM FOR DELIVERY ================= */}

          {/* Assign/Reassign Executive Modal */}
          {showAssignExecModal && (
            <Modal isOpen={!!showAssignExecModal} onClose={() => setShowAssignExecModal(null)} title="Assign Delivery Executive" size="sm">
              <div className="space-y-4 text-xs">
                <div>
                  <p className="font-bold text-gray-700">Assign Executive for Order {showAssignExecModal.orderId}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Customer: {showAssignExecModal.customer} | Address: {showAssignExecModal.address}</p>
                </div>
                <div className="space-y-2">
                  <label className="block font-bold text-gray-500 uppercase">Select Available Driver</label>
                  <select id="driverSelect" className="w-full border rounded-lg px-3 py-2 bg-white outline-none">
                    {deliveryExecutives
                      .filter(exec => exec.status !== 'Offline')
                      .map((exec, idx) => (
                        <option key={idx} value={exec.name}>{exec.name} ({exec.status})</option>
                      ))}
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      const driverName = document.getElementById('driverSelect').value;
                      setDeliveries(prev => prev.map(d => d.orderId === showAssignExecModal.orderId ? { ...d, executive: driverName, status: 'In Transit', eta: '1.5 Hours' } : d));
                      setDeliveryExecutives(prev => prev.map(exec => exec.name === driverName ? { ...exec, assigned: exec.assigned + 1, status: 'Busy' } : exec));
                      toast.success(`Order ${showAssignExecModal.orderId} assigned to driver ${driverName}.`);
                      setShowAssignExecModal(null);
                    }}
                    className="flex-1 btn-primary py-2.5 font-bold uppercase"
                  >
                    Confirm Assignment
                  </button>
                  <button onClick={() => setShowAssignExecModal(null)} className="btn-secondary px-4 py-2 font-bold">Cancel</button>
                </div>
              </div>
            </Modal>
          )}

          {/* OTP Verification Screen Modal */}
          {showOtpVerifyModal && (
            <Modal isOpen={!!showOtpVerifyModal} onClose={() => setShowOtpVerifyModal(null)} title="Delivery OTP Verification Screen" size="sm">
              <div className="space-y-4 text-xs text-center">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                  <Lock size={20}/>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Secure Delivery OTP Verification</h4>
                  <p className="text-[10px] text-gray-400 mt-1">Please request the 4-digit verification code sent to customer {showOtpVerifyModal.customer}.</p>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    maxLength="4"
                    placeholder="Enter 4-Digit OTP"
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    className="border text-center tracking-widest text-lg font-black rounded-lg px-4 py-2.5 outline-none max-w-[150px] mx-auto block"
                  />
                  <span className="text-[9px] text-emerald-700 block font-semibold">Hint for demo: OTP is {showOtpVerifyModal.codeRequired}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      if (otpInput === showOtpVerifyModal.codeRequired) {
                        setDeliveries(prev => prev.map(d => d.orderId === showOtpVerifyModal.orderId ? { ...d, status: 'Delivered', codeVerified: true, payStatus: 'Paid', actualTime: 'Just Now' } : d));
                        // Update driver completed status
                        setDeliveryExecutives(prev => prev.map(exec => exec.name === showOtpVerifyModal.executive ? { ...exec, completed: exec.completed + 1, assigned: Math.max(0, exec.assigned - 1), status: 'Available' } : exec));
                        toast.success(`OTP Verified successfully! Delivery marked complete.`);
                        setOtpInput('');
                        setShowOtpVerifyModal(null);
                      } else {
                        toast.error('Invalid OTP code. Please try again.');
                      }
                    }}
                    className="flex-1 btn-primary py-2.5 font-bold uppercase"
                  >
                    Confirm Delivery
                  </button>
                  <button onClick={() => { setShowOtpVerifyModal(null); setOtpInput(''); }} className="btn-secondary px-4 py-2 font-bold">Cancel</button>
                </div>
              </div>
            </Modal>
          )}

          {/* Details Modal */}
          {selectedDelDetails && (
            <Modal isOpen={!!selectedDelDetails} onClose={() => setSelectedDelDetails(null)} title="Delivery Order Details Overview" size="md">
              <div className="space-y-4 text-xs text-gray-800">
                <div className="border-b pb-3 grid grid-cols-2 gap-3">
                  <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Order ID</span><span className="font-mono font-bold text-emerald-800">{selectedDelDetails.orderId}</span></div>
                  <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Expected Date</span><span className="font-semibold text-gray-700">{selectedDelDetails.expectedDate}</span></div>
                  <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Customer</span><span className="font-bold text-gray-700">{selectedDelDetails.customer}</span></div>
                  <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Payment Status</span><span className="font-semibold text-gray-700">{selectedDelDetails.amount.toLocaleString()} ({selectedDelDetails.payStatus})</span></div>
                </div>

                <div>
                  <span className="text-gray-400 font-bold block text-[9px] uppercase mb-1">Destination Address</span>
                  <p className="bg-slate-50 p-2.5 rounded-lg border">{selectedDelDetails.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border">
                  <div>
                    <span className="text-gray-400 font-bold block text-[9px] uppercase">Assigned Executive</span>
                    <p className="font-bold text-gray-700 mt-0.5">{selectedDelDetails.executive || 'Unassigned'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-[9px] uppercase">ETA Status / Actual Time</span>
                    <p className="font-bold text-emerald-800 mt-0.5">{selectedDelDetails.actualTime || selectedDelDetails.eta || '—'}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                  {selectedDelDetails.status === 'In Transit' && (
                    <button
                      onClick={() => {
                        setShowOtpVerifyModal(selectedDelDetails);
                        setSelectedDelDetails(null);
                      }}
                      className="btn-primary py-2 px-4 font-bold uppercase"
                    >
                      Verify OTP
                    </button>
                  )}
                  <button onClick={() => setSelectedDelDetails(null)} className="btn-secondary px-6 py-2 font-bold">Close</button>
                </div>
              </div>
            </Modal>
          )}

          {/* Executive Performance Profile Modal */}
          {selectedExecProfile && (
            <Modal isOpen={!!selectedExecProfile} onClose={() => setSelectedExecProfile(null)} title="Delivery Executive Performance Profile" size="sm">
              <div className="space-y-4 text-xs">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#236625] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                    {selectedExecProfile.name[0]}
                  </div>
                  <h4 className="font-bold text-gray-800 mt-2">{selectedExecProfile.name}</h4>
                  <p className="text-[10px] text-gray-400">ID: {selectedExecProfile.empId} • {selectedExecProfile.mobile}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 border p-2 rounded-lg">
                    <span className="text-gray-400 block text-[9px] font-bold uppercase">Completed</span>
                    <span className="font-bold text-gray-800">{selectedExecProfile.completed}</span>
                  </div>
                  <div className="bg-slate-50 border p-2 rounded-lg">
                    <span className="text-gray-400 block text-[9px] font-bold uppercase">Active</span>
                    <span className="font-bold text-gray-800">{selectedExecProfile.assigned}</span>
                  </div>
                  <div className="bg-slate-50 border p-2 rounded-lg">
                    <span className="text-gray-400 block text-[9px] font-bold uppercase">COD Coll.</span>
                    <span className="font-bold text-[#236625]">₹15.8k</span>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <span className="font-bold text-gray-700 block mb-1">Performance Details</span>
                  <div className="flex justify-between"><span>Satisfaction Rating:</span><span className="font-bold text-amber-500">4.8 / 5.0 ★</span></div>
                  <div className="flex justify-between"><span>On-Time Rate:</span><span className="font-bold text-emerald-800">96.4%</span></div>
                  <div className="flex justify-between"><span>Active Status:</span><span className="font-bold">{selectedExecProfile.status}</span></div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => { toast.success(`Sending task alert to ${selectedExecProfile.name}`); setSelectedExecProfile(null); }} className="flex-1 btn-primary py-2 font-bold uppercase">Assign Urgent Job</button>
                  <button onClick={() => setSelectedExecProfile(null)} className="btn-secondary px-6 py-2 font-bold">Close</button>
                </div>
              </div>
            </Modal>
          )}

        </div>
      ) : activeCategory === 'Agri Intelligence' ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>AI Agri Intelligence Hub</h2>
              <p className="text-xs text-gray-400">Generate AI-powered crop recommendations, analyze soil health parameters, run disease detection scans, and monitor weather matrices.</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => {
                  toast.success('Syncing AI crop model weights with core agricultural servers...');
                  setTimeout(() => toast.success('Model weights updated! Version: AgriGPT-v4.2-Live'), 1000);
                }}
                className="btn-primary py-2 px-3 flex items-center gap-1.5 font-bold"
              >
                <Sprout size={14}/> Sync AI Models
              </button>
            </div>
          </div>

          {/* ================= 1. OVERVIEW SCREEN ================= */}
          {!['Weather Forecast', 'Crop Advisory', 'Disease Detection', 'Yield Prediction', 'Soil Health', 'Farmer Recommendations'].includes(activeSubItem) && (
            <div className="space-y-6">
              {/* Dashboard Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Farmers Assisted', val: '1,420', color: 'text-gray-800', bg: 'bg-white' },
                  { label: 'AI Advisories Generated', val: '3,840', color: 'text-[#236625]', bg: 'bg-emerald-50/50' },
                  { label: 'Disease Detections', val: '248', color: 'text-amber-600', bg: 'bg-amber-50/50' },
                  { label: 'Yield Predictions Run', val: '195', color: 'text-blue-600', bg: 'bg-blue-50/50' },
                  { label: 'Active Weather Alerts', val: '4', color: 'text-red-600', bg: 'bg-red-50/50' },
                  { label: 'Active Advisories', val: '32', color: 'text-purple-600', bg: 'bg-purple-50/50' }
                ].map((c, i) => (
                  <div key={i} className={`kpi-card border ${c.bg}`}>
                    <p className={`text-xl font-black ${c.color}`}>{c.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{c.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Usage Trend */}
                <div className="kpi-card">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">AI Recommendation Usage Trend (Monthly)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={[
                      { name: 'Jan', queries: 240, detections: 80 },
                      { name: 'Feb', queries: 320, detections: 95 },
                      { name: 'Mar', queries: 450, detections: 140 },
                      { name: 'Apr', queries: 620, detections: 190 },
                      { name: 'May', queries: 840, detections: 248 }
                    ]}>
                      <defs>
                        <linearGradient id="aiUsageGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#236625" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#236625" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }}/>
                      <YAxis tick={{ fontSize: 10 }}/>
                      <Tooltip/>
                      <Area name="Crop Advisories" type="monotone" dataKey="queries" stroke="#236625" fill="url(#aiUsageGrad)" strokeWidth={2}/>
                      <Area name="Disease Scans" type="monotone" dataKey="detections" stroke="#ffa726" fill="none" strokeWidth={1.5}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Crop Recommendation breakdown */}
                <div className="kpi-card">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Top AI Recommended Crops</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { name: 'Cotton', count: 480 },
                      { name: 'Sugarcane', count: 320 },
                      { name: 'Pomegranate', count: 210 },
                      { name: 'Wheat', count: 180 },
                      { name: 'Soybean', count: 150 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }}/>
                      <YAxis tick={{ fontSize: 10 }}/>
                      <Tooltip/>
                      <Bar name="Times Recommended" dataKey="count" fill="#236625" radius={[4, 4, 0, 0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Disease breakdown */}
                <div className="kpi-card flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Disease Scan Distribution</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={[
                        { name: 'Boll Rot', value: 45, color: '#e53935' },
                        { name: 'Early Blight', value: 30, color: '#ffb300' },
                        { name: 'Leaf Rust', value: 15, color: '#1e88e5' },
                        { name: 'Healthy Crops', value: 10, color: '#43a047' }
                      ]} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={4}>
                        {[
                          { name: 'Boll Rot', value: 45, color: '#e53935' },
                          { name: 'Early Blight', value: 30, color: '#ffb300' },
                          { name: 'Leaf Rust', value: 15, color: '#1e88e5' },
                          { name: 'Healthy Crops', value: 10, color: '#43a047' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color}/>
                        ))}
                      </Pie>
                      <Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {[
                      { name: 'Boll Rot (High)', color: '#e53935', pct: '45%' },
                      { name: 'Early Blight (Med)', color: '#ffb300', pct: '30%' },
                      { name: 'Leaf Rust (Low)', color: '#1e88e5', pct: '15%' },
                      { name: 'Healthy Leaf (Zero)', color: '#43a047', pct: '10%' }
                    ].map((c, i) => (
                      <div key={i} className="flex justify-between text-[10px]">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}/>{c.name}</div>
                        <span className="font-bold text-gray-700">{c.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Smart Analytics Insights */}
                <div className="kpi-card lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold text-gray-800">Smart AI Advisory Insights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    {[
                      { label: 'Most Recommended Crop', val: 'Pomegranate', desc: 'Highest Suitability Index (92%)' },
                      { label: 'High Demand Crops', val: 'Sugarcane', desc: 'Expected Market Premium: +15%' },
                      { label: 'High Risk Zones', val: 'Phaltan North', desc: 'High leaf rust risk detected' }
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-50 border rounded-xl p-3.5 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight block">{item.label}</span>
                          <span className="text-sm font-black text-[#236625] block mt-1">{item.val}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-2 block">{item.desc}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 flex gap-3 items-center text-xs">
                    <AlertTriangle className="text-orange-500 shrink-0" size={16}/>
                    <p className="text-gray-600 font-semibold leading-snug">
                      <span className="font-bold text-orange-700">Drought warning alert:</span> Water reserves in Loni taluka have dropped below 45% capacity. Irrigation advisor recommends prioritizing drip scheduling.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom activity log row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <div className="kpi-card lg:col-span-2 space-y-3">
                  <h3 className="text-sm font-bold text-gray-800">Recent Agri-Intelligence Events</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Leaf Disease Detected', desc: 'Tomato Early Blight scan completed for Suresh Patil. Confidence: 94%.', time: '10 mins ago' },
                      { title: 'Yield Forecast Created', desc: 'Ramesh Kumar generated sugarcane forecast (420 tons projected).', time: '40 mins ago' },
                      { title: 'Soil health analysis completed', desc: 'NPK profile completed for Jadhav Pomegranate block 2.', time: '2 hours ago' },
                      { title: 'Extreme Heatwave Alert issued', desc: 'Broadcasted warning alert to all cotton farmers in Baramati region.', time: '4 hours ago' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-gray-800">{item.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap ml-4">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Help widget */}
                <div className="kpi-card flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Model Configuration</h3>
                    <p className="text-[10px] text-gray-400 mt-1">Select and configure AI models for prediction algorithms.</p>
                  </div>
                  <div className="space-y-2.5 text-xs py-3">
                    <div className="flex justify-between"><span>Core NLP version:</span><span className="font-mono font-bold text-emerald-800">AgriGPT-4.0</span></div>
                    <div className="flex justify-between"><span>Computer Vision:</span><span className="font-mono font-bold text-emerald-800">AgriVision-V3</span></div>
                    <div className="flex justify-between"><span>Model accuracy:</span><span className="font-bold text-emerald-800">96.5% F1 Score</span></div>
                  </div>
                  <button onClick={() => toast.success('AI Diagnostics and health checks passed successfully.')} className="w-full btn-secondary py-2 text-[10px] font-bold uppercase">Run Diagnostics</button>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. WEATHER FORECAST ================= */}
          {activeSubItem === 'Weather Forecast' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Live Weather &amp; Climatology Forecast</h3>
                <p className="text-xs text-gray-400">Monitor micro-climate indicators, weekly weather trends, and issue broadcast alerts to farmers.</p>
              </div>

              {/* Current Weather parameters */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Current Temp', val: '34°C', sub: 'Feels like 36°', icon: ThermometerSun, color: 'text-amber-600', bg: 'bg-amber-50/50' },
                  { label: 'Relative Humidity', val: '55%', sub: 'Optimal crop rate', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50/50' },
                  { label: 'Precipitation', val: '0.0 mm', sub: '0% probability', icon: CloudSun, color: 'text-gray-600', bg: 'bg-white' },
                  { label: 'Wind Velocity', val: '12 km/h', sub: 'Wind direction: WNW', icon: Wind, color: 'text-slate-600', bg: 'bg-slate-50/50' },
                  { label: 'UV Radiation Index', val: '8.4', sub: 'Very High Risk', icon: ThermometerSun, color: 'text-orange-600', bg: 'bg-orange-50/50' },
                  { label: 'Air Quality (AQI)', val: '85', sub: 'Good/Satisfactory', icon: Leaf, color: 'text-emerald-700', bg: 'bg-emerald-50/50' }
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className={`kpi-card border ${item.bg} flex flex-col justify-between h-28`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{item.label}</span>
                        <Icon size={14} className={item.color}/>
                      </div>
                      <div>
                        <p className="text-lg font-black text-gray-800">{item.val}</p>
                        <p className="text-[9px] text-gray-400 font-bold mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 7-Day outlook forecast table */}
                <div className="kpi-card lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold text-gray-800">7-Day Meteorological Outlook</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b text-gray-400 font-semibold uppercase bg-gray-50/50">
                          <th className="p-3">Day</th>
                          <th className="p-3">Condition</th>
                          <th className="p-3">Max/Min Temp</th>
                          <th className="p-3">Humidity</th>
                          <th className="p-3">Rain Risk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { day: 'Mon (Today)', cond: 'Sunny / Hot', temp: '36°C / 24°C', hum: '52%', rain: '5%' },
                          { day: 'Tue', cond: 'Sunny / Clear', temp: '37°C / 25°C', hum: '48%', rain: '0%' },
                          { day: 'Wed', cond: 'Partly Cloudy', temp: '34°C / 23°C', hum: '60%', rain: '20%' },
                          { day: 'Thu', cond: 'Scattered Showers', temp: '31°C / 22°C', tempVal: 31, hum: '72%', rain: '85%' },
                          { day: 'Fri', cond: 'Thundershower', temp: '30°C / 21°C', hum: '80%', rain: '95%' },
                          { day: 'Sat', cond: 'Light Rain', temp: '32°C / 22°C', hum: '75%', rain: '60%' },
                          { day: 'Sun', cond: 'Partly Cloudy', temp: '34°C / 24°C', hum: '62%', rain: '10%' }
                        ].map((day, idx) => (
                          <tr key={idx} className="border-b hover:bg-slate-50/30">
                            <td className="p-3 font-semibold text-gray-800">{day.day}</td>
                            <td className="p-3 text-gray-600 font-bold">{day.cond}</td>
                            <td className="p-3 font-mono">{day.temp}</td>
                            <td className="p-3 text-gray-500">{day.hum}</td>
                            <td className={`p-3 font-bold ${parseInt(day.rain) > 50 ? 'text-blue-600' : 'text-gray-400'}`}>{day.rain}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Weather Broadcast Alerts */}
                <div className="kpi-card space-y-4">
                  <h4 className="text-xs font-bold text-gray-800">Climatological Broadcast Center</h4>
                  <div className="space-y-3">
                    {[
                      { type: 'Heatwave Alert', scope: 'Baramati Taluka', desc: 'Max temperatures exceeding 39°C projected. Advise farmers to irrigate during evening hours.', color: 'border-amber-300 bg-amber-50/40 text-amber-900' },
                      { type: 'Heavy Rain Warning', scope: 'Loni North Block', desc: 'Forecast of 65mm precipitation within 24h. Advise clearing field drainage lines.', color: 'border-blue-200 bg-blue-50/40 text-blue-900' }
                    ].map((alert, i) => (
                      <div key={i} className={`border rounded-xl p-3 text-xs space-y-1.5 ${alert.color}`}>
                        <div className="flex justify-between items-center font-bold">
                          <span>{alert.type}</span>
                          <span className="text-[9px] uppercase">{alert.scope}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{alert.desc}</p>
                        <button
                          onClick={() => toast.success(`Alert "${alert.type}" broadcasted to 620 farmers in ${alert.scope} via SMS.`)}
                          className="btn-primary py-1 px-3 mt-1.5 font-bold text-[9px] uppercase tracking-wider block"
                        >
                          Broadcast Warning SMS
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. CROP ADVISORY ================= */}
          {activeSubItem === 'Crop Advisory' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Crop Recommendation Engine</h3>
                <p className="text-xs text-gray-400">Configure regional parameters to forecast optimal agricultural crop options, Suitability Indices, and revenues.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Advisor Inputs panel */}
                <div className="kpi-card space-y-4">
                  <h4 className="text-xs font-bold text-gray-800">Agricultural Input Factors</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Target Farm Location</label>
                      <input
                        type="text"
                        value={cropAdvLoc}
                        onChange={e => setCropAdvLoc(e.target.value)}
                        placeholder="e.g. Baramati Village"
                        className="w-full border rounded-lg px-3 py-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Soil Texture Type</label>
                      <select
                        value={cropAdvSoil}
                        onChange={e => setCropAdvSoil(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-white"
                      >
                        <option>Black Clayey Soil</option>
                        <option>Red Sandy Soil</option>
                        <option>Loamy Soil</option>
                        <option>Alluvial Silt</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Active Cultivation Season</label>
                      <select
                        value={cropAdvSeason}
                        onChange={e => setCropAdvSeason(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-white"
                      >
                        <option>Kharif (Monsoon)</option>
                        <option>Rabi (Winter)</option>
                        <option>Zaid (Summer)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Irrigation / Water Capacity</label>
                      <select
                        value={cropAdvWater}
                        onChange={e => setCropAdvWater(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-white"
                      >
                        <option>High (Irrigated canal / tubewell)</option>
                        <option>Medium (Drip / well resources)</option>
                        <option>Low (Rainfed / dryland)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        toast.success('Analyzing soil texture and weather factors via AgriGPT crop models...');
                        setTimeout(() => {
                          const isBlack = cropAdvSoil.includes('Black');
                          const isHighWater = cropAdvWater.includes('High');
                          const result = {
                            bestCrop: isBlack ? 'BT Cotton (Hybrid)' : 'Pomegranate (Ganesh Var.)',
                            suitability: isBlack ? '94%' : '88%',
                            yieldEst: isBlack ? '12-14 Quintals / Acre' : '8-10 Tons / Acre',
                            profitEst: isBlack ? '₹45,000 / Acre' : '₹95,000 / Acre',
                            alternative: isBlack ? 'Sugarcane, Soybean' : 'Grapes, Fig'
                          };
                          setCropAdvResult(result);
                          toast.success('Crop recommendation generated!');
                        }, 1000);
                      }}
                      className="w-full btn-primary py-2.5 font-bold uppercase tracking-wider text-xs"
                    >
                      Run Crop Suitability Model
                    </button>
                  </div>
                </div>

                {/* Outputs Panel */}
                <div className="kpi-card lg:col-span-2 space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Suitability Recommendation Forecast</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Crop optimization parameters generated by AgriERP machine learning engine.</p>
                  </div>

                  {cropAdvResult ? (
                    <div className="space-y-4 flex-1 justify-center flex flex-col">
                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center max-w-md mx-auto w-full">
                        <span className="text-emerald-700 font-bold block text-[10px] uppercase">Best Recommended Crop Choice</span>
                        <p className="text-2xl font-black text-emerald-800 mt-1">{cropAdvResult.bestCrop}</p>
                        <p className="text-[11px] text-emerald-600 mt-1">Suitability Score: <span className="font-bold">{cropAdvResult.suitability} Match</span></p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto w-full text-xs">
                        <div className="bg-slate-50 p-3 rounded-lg border text-center">
                          <span className="text-gray-400 font-bold block text-[9px] uppercase">Expected Yield</span>
                          <span className="font-bold text-gray-700 block mt-1">{cropAdvResult.yieldEst}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border text-center">
                          <span className="text-gray-400 font-bold block text-[9px] uppercase">Estimated Net Profit</span>
                          <span className="font-bold text-emerald-800 block mt-1">{cropAdvResult.profitEst}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border text-xs max-w-md mx-auto w-full space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Alternative Options:</span>
                          <span className="font-bold text-gray-700">{cropAdvResult.alternative}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Growth Cycle:</span>
                          <span className="font-bold text-gray-700">165 - 180 Days</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400 border border-dashed rounded-xl bg-slate-50/50 flex-1 flex flex-col items-center justify-center">
                      <Sprout size={28} className="mx-auto mb-2 opacity-50"/>
                      <p className="text-xs font-semibold">Inputs configuration complete. Click suitability button to generate advice.</p>
                    </div>
                  )}

                  <div className="border-t pt-3 flex gap-2">
                    <button
                      onClick={() => {
                        if (!cropAdvResult) {
                          toast.error('Please generate suitability advice first.');
                          return;
                        }
                        const newR = {
                          id: `REC-${Date.now().toString().slice(-3)}`,
                          farmer: 'Walk-in Farmer',
                          crop: cropAdvResult.bestCrop,
                          irrigation: 'Drip system optimized',
                          fertilizer: 'Standard NPK schedule',
                          prevention: 'Weekly pesticide monitoring',
                          date: new Date().toISOString().split('T')[0]
                        };
                        setSavedRecommendations(prev => [newR, ...prev]);
                        toast.success('Recommendation report saved to Farmer Advice registry.');
                      }}
                      className="flex-1 btn-primary py-2 text-xs font-bold"
                    >
                      Save Advisory Report
                    </button>
                    <button onClick={() => toast.success('Recommendation details shared via WhatsApp message.')} className="btn-secondary px-4 py-2 text-xs font-bold">Share Advice</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. DISEASE DETECTION ================= */}
          {activeSubItem === 'Disease Detection' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">AI Crop Disease Diagnostics Scanner</h3>
                <p className="text-xs text-gray-400">Perform real-time computer vision diagnostic scans of plant leaf structures to isolate infestations.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Scanner Interface */}
                <div className="kpi-card space-y-4">
                  <h4 className="text-xs font-bold text-gray-800">Diagnostics Upload Scanner</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Select Crop Target</label>
                      <select
                        value={diseaseScanCrop}
                        onChange={e => setDiseaseScanCrop(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-white"
                      >
                        <option>Cotton</option>
                        <option>Tomato</option>
                        <option>Rice Crop</option>
                        <option>Pomegranate</option>
                      </select>
                    </div>

                    <div className="border border-dashed rounded-xl bg-slate-50/50 p-6 text-center space-y-2">
                      <Camera className="mx-auto text-emerald-800 opacity-60" size={24}/>
                      <span className="font-bold text-gray-700 block">Simulate Leaf Upload</span>
                      <p className="text-[10px] text-gray-400">Supported formats: JPG, PNG • Max size: 5MB</p>
                      <select id="diseaseMockImg" className="border rounded px-2.5 py-1 text-[10px] font-bold bg-white mt-2">
                        <option>cotton_leaf_spot.jpg</option>
                        <option>tomato_early_blight.png</option>
                        <option>healthy_rice_leaf.jpg</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        setDiseaseScanStatus('scanning');
                        toast.success('Analyzing visual markers in crop leaf structure...');
                        setTimeout(() => {
                          const mockSel = document.getElementById('diseaseMockImg').value;
                          let res = {};
                          if (mockSel.includes('blight')) {
                            res = { name: 'Early Blight (Alternaria)', confidence: '94%', severity: 'Moderate Risk', prevention: 'Remove infected debris immediately.', pesticide: 'Copper Oxychloride (2g/L water)' };
                          } else if (mockSel.includes('spot') || mockSel.includes('rot')) {
                            res = { name: 'Leaf Spot / Boll Rot', confidence: '92%', severity: 'High Risk', prevention: 'Avoid overhead water irrigation.', pesticide: 'Mancozeb 75% WP (2.5g/L)' };
                          } else {
                            res = { name: 'Healthy Crop Profile', confidence: '98%', severity: 'Healthy', prevention: 'Maintain optimal nutrient ratios.', pesticide: 'No treatment required.' };
                          }
                          setDiseaseScanResult(res);
                          setDiseaseScanStatus('done');
                          toast.success('AI diagnostics completed successfully.');
                        }, 1500);
                      }}
                      className="w-full btn-primary py-2.5 font-bold uppercase text-xs"
                      disabled={diseaseScanStatus === 'scanning'}
                    >
                      {diseaseScanStatus === 'scanning' ? 'Running AgriVision Scan...' : 'Perform Crop Leaf Diagnostics'}
                    </button>
                  </div>
                </div>

                {/* Scan outputs */}
                <div className="kpi-card lg:col-span-2 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Diagnostics Analysis Details</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Isolated diagnostic markers and recommended chemical/cultural remedies.</p>
                  </div>

                  {diseaseScanStatus === 'scanning' && (
                    <div className="text-center py-12 flex-1 flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-4 border-[#236625] border-t-transparent rounded-full animate-spin"/>
                      <p className="text-xs font-bold text-gray-600">AgriVision isolating leaf diagnostic indicators...</p>
                    </div>
                  )}

                  {diseaseScanStatus === 'done' && diseaseScanResult && (
                    <div className="space-y-4 py-3 flex-1 flex flex-col justify-center text-xs">
                      <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center max-w-md mx-auto w-full">
                        <span className="text-red-700 font-bold block text-[10px] uppercase">Detected Infestation</span>
                        <p className="text-xl font-black text-red-800 mt-1">{diseaseScanResult.name}</p>
                        <div className="flex justify-between text-[11px] text-gray-500 mt-2 max-w-[240px] mx-auto">
                          <span>Confidence: <span className="font-bold text-gray-700">{diseaseScanResult.confidence}</span></span>
                          <span>Severity: <span className="font-bold text-red-700">{diseaseScanResult.severity}</span></span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto w-full">
                        <div className="bg-slate-50 p-3 rounded-lg border">
                          <span className="text-gray-400 font-bold block text-[9px] uppercase mb-1">Prevention &amp; Culture tips</span>
                          <p className="text-gray-700 font-medium leading-relaxed">{diseaseScanResult.prevention}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border">
                          <span className="text-gray-400 font-bold block text-[9px] uppercase mb-1">Recommended Chemicals</span>
                          <p className="text-gray-700 font-bold leading-relaxed">{diseaseScanResult.pesticide}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {diseaseScanStatus === 'idle' && (
                    <div className="text-center py-12 text-gray-400 border border-dashed rounded-xl bg-slate-50/50 flex-1 flex flex-col items-center justify-center">
                      <Camera size={28} className="mx-auto mb-2 opacity-50"/>
                      <p className="text-xs font-semibold">Ready for leaf diagnostics. Select simulated file to run scanner.</p>
                    </div>
                  )}

                  <div className="border-t pt-3 flex gap-2">
                    <button onClick={() => toast.success('Advisory report downloaded as PDF.')} className="flex-1 btn-primary py-2 text-xs font-bold">Download Treatment PDF</button>
                    <button onClick={() => toast.success('Diagnostics shared with crop advisory executive.')} className="btn-secondary px-4 py-2 text-xs font-bold">Forward to Expert</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 5. YIELD PREDICTION ================= */}
          {activeSubItem === 'Yield Prediction' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Yield Forecasting Analytics</h3>
                <p className="text-xs text-gray-400">Model expected crop harvest outputs based on cultivated acreage size and soil conditions.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input config */}
                <div className="kpi-card space-y-4">
                  <h4 className="text-xs font-bold text-gray-800">Forecast Predictor Factors</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Select Target Seed/Crop</label>
                      <select
                        value={yieldCrop}
                        onChange={e => setYieldCrop(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-white"
                      >
                        {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Cultivation Acreage (Acres)</label>
                      <input
                        type="number"
                        value={yieldArea}
                        onChange={e => setYieldArea(Math.max(1, parseFloat(e.target.value) || 0))}
                        className="w-full border rounded-lg px-3 py-2 outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Soil Health Rating</label>
                      <select
                        value={yieldSoilHealth}
                        onChange={e => setYieldSoilHealth(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-white"
                      >
                        <option>Excellent (High Organic Matter)</option>
                        <option>Good (Standard nutrient ratios)</option>
                        <option>Moderate (Requires nitrogen dosing)</option>
                        <option>Poor (Needs organic replenishment)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        toast.success('Calculating crop yields via climatology historical records...');
                        setTimeout(() => {
                          const multiplier = yieldCrop.includes('Cotton') ? 2.5 : yieldCrop.includes('Urea') ? 0 : 12;
                          const ratePerAcre = multiplier || 8;
                          const tonnage = Math.round(yieldArea * ratePerAcre);
                          const ratePerTon = yieldCrop.includes('Cotton') ? 7200 : 3500;
                          setYieldResult({
                            tonnage: `${tonnage} Quintals`,
                            revenue: `₹${(tonnage * ratePerTon).toLocaleString()}`,
                            onTimeRate: '94%',
                            soilDose: 'Requires 40kg Potash and drip scheduling'
                          });
                          toast.success('Yield prediction generated!');
                        }, 1000);
                      }}
                      className="w-full btn-primary py-2.5 font-bold uppercase text-xs"
                    >
                      Run Yield Predictive Model
                    </button>
                  </div>
                </div>

                {/* Outputs Panel */}
                <div className="kpi-card lg:col-span-2 space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Harvest Forecast Output</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Calculated production outputs matching optimized moisture profiles.</p>
                  </div>

                  {yieldResult ? (
                    <div className="space-y-4 flex-1 flex flex-col justify-center text-xs">
                      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto w-full">
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
                          <span className="text-emerald-700 font-bold block text-[10px] uppercase">Projected Harvest</span>
                          <span className="text-xl font-black text-emerald-800 block mt-1">{yieldResult.tonnage}</span>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
                          <span className="text-emerald-700 font-bold block text-[10px] uppercase">Expected Market Value</span>
                          <span className="text-xl font-black text-[#236625] block mt-1">{yieldResult.revenue}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border text-xs max-w-md mx-auto w-full space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Predictive Confidence:</span>
                          <span className="font-bold text-gray-700">91.8% Accuracy</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fertility Advice:</span>
                          <span className="font-bold text-gray-700">{yieldResult.soilDose}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400 border border-dashed rounded-xl bg-slate-50/50 flex-1 flex flex-col items-center justify-center">
                      <FileText size={28} className="mx-auto mb-2 opacity-50"/>
                      <p className="text-xs font-semibold">Inputs configuration complete. Click predictive button to generate forecast.</p>
                    </div>
                  )}

                  <div className="border-t pt-3 flex gap-2">
                    <button onClick={() => toast.success('Yield projection logs saved and archived.')} className="flex-1 btn-primary py-2 text-xs font-bold">Archive Yield Logs</button>
                    <button onClick={() => toast.success('Yield report PDF downloaded successfully.')} className="btn-secondary px-4 py-2 text-xs font-bold">Download Report</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. SOIL HEALTH ================= */}
          {activeSubItem === 'Soil Health' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Soil Nutrient &amp; Moisture Analysis</h3>
                <p className="text-xs text-gray-400">Review soil pH levels, NPK macro-nutrients, and configure custom fertilizer recipes.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sliders matrix */}
                <div className="kpi-card space-y-4">
                  <h4 className="text-xs font-bold text-gray-800">Macro Nutrient Indices (NPK)</h4>
                  <div className="space-y-3.5 text-xs text-gray-600">
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Nitrogen (N)</span>
                        <span className="font-mono text-emerald-800">{soilN} mg/kg</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={soilN}
                        onChange={e => setSoilN(parseInt(e.target.value) || 0)}
                        className="w-full accent-[#236625]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Phosphorus (P)</span>
                        <span className="font-mono text-emerald-800">{soilP} mg/kg</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        value={soilP}
                        onChange={e => setSoilP(parseInt(e.target.value) || 0)}
                        className="w-full accent-[#236625]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Potassium (K)</span>
                        <span className="font-mono text-emerald-800">{soilK} mg/kg</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="300"
                        value={soilK}
                        onChange={e => setSoilK(parseInt(e.target.value) || 0)}
                        className="w-full accent-[#236625]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Soil pH Rating</span>
                        <span className="font-mono text-emerald-800">{soilPH} pH</span>
                      </div>
                      <input
                        type="range"
                        min="4.0"
                        max="9.0"
                        step="0.1"
                        value={soilPH}
                        onChange={e => setSoilPH(parseFloat(e.target.value) || 0)}
                        className="w-full accent-[#236625]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Soil Moisture</span>
                        <span className="font-mono text-emerald-800">{soilMoisture}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={soilMoisture}
                        onChange={e => setSoilMoisture(parseInt(e.target.value) || 0)}
                        className="w-full accent-[#236625]"
                      />
                    </div>
                  </div>
                </div>

                {/* Suggestions Output */}
                <div className="kpi-card lg:col-span-2 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">NPK Soil Improvement Recipe</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Custom chemical composition advice generated for this nutrient profile.</p>
                  </div>

                  <div className="space-y-4 py-4 text-xs">
                    {/* Nutrient Status indicators */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="bg-slate-50 border p-2.5 rounded-lg">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">pH Outlook</span>
                        <span className={`font-bold block mt-1 ${soilPH < 6.0 ? 'text-amber-600' : soilPH > 7.5 ? 'text-blue-600' : 'text-emerald-800'}`}>
                          {soilPH < 6.0 ? 'Acidic soil' : soilPH > 7.5 ? 'Alkaline' : 'Optimal Neutral'}
                        </span>
                      </div>
                      <div className="bg-slate-50 border p-2.5 rounded-lg">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Nitrogen Status</span>
                        <span className={`font-bold block mt-1 ${soilN < 30 ? 'text-red-600' : 'text-emerald-800'}`}>
                          {soilN < 30 ? 'Critical Low' : 'Optimal'}
                        </span>
                      </div>
                      <div className="bg-slate-50 border p-2.5 rounded-lg">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Phosphorus Status</span>
                        <span className={`font-bold block mt-1 ${soilP < 15 ? 'text-red-600' : 'text-emerald-800'}`}>
                          {soilP < 15 ? 'Critical Low' : 'Optimal'}
                        </span>
                      </div>
                      <div className="bg-slate-50 border p-2.5 rounded-lg">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Moisture Status</span>
                        <span className={`font-bold block mt-1 ${soilMoisture < 40 ? 'text-red-600' : 'text-emerald-800'}`}>
                          {soilMoisture < 40 ? 'Under-Irrigated' : 'Optimal'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border p-3.5 rounded-lg space-y-2">
                      <span className="font-bold text-gray-700 block">AI Recommended Chemical Fertilizer Dosing</span>
                      <div className="space-y-1 leading-snug">
                        {soilN < 30 && <p className="text-orange-700 font-semibold">• Apply 50kg Urea per acre to boost Nitrogen index.</p>}
                        {soilP < 15 && <p className="text-orange-700 font-semibold">• Apply 40kg DAP per acre to resolve Phosphorus deficiency.</p>}
                        {soilMoisture < 40 && <p className="text-orange-700 font-semibold">• Increase drip irrigation duration by 45 minutes daily.</p>}
                        {soilN >= 30 && soilP >= 15 && soilMoisture >= 40 && (
                          <p className="text-emerald-800 font-bold">• Current NPK profile is optimal. Maintenance dose of organic manure recommended.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3 flex gap-2">
                    <button onClick={() => toast.success('Fertilizer recipe shared to farmer mobile app.')} className="flex-1 btn-primary py-2 text-xs font-bold">Broadcast Fertilizer Recipe</button>
                    <button onClick={() => toast.success('NPK soil logs exported to Counter terminal printer.')} className="btn-secondary px-4 py-2 text-xs font-bold">Print Logs</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 7. FARMER AI RECOMMENDATIONS ================= */}
          {activeSubItem === 'Farmer Recommendations' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Historical Farmer AI Advisories</h3>
                <p className="text-xs text-gray-400">Search and audit generated agricultural recommendations saved in the terminal.</p>
              </div>

              {/* Table list */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase bg-gray-50/50">
                      <th className="p-3">ID</th>
                      <th className="p-3">Farmer</th>
                      <th className="p-3">Target Crop Choice</th>
                      <th className="p-3">Irrigation Advice</th>
                      <th className="p-3">Fertility Advice</th>
                      <th className="p-3">Prevention Advice</th>
                      <th className="p-3">Created Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedRecommendations.map((rec, idx) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                        <td className="p-3 font-mono font-bold text-emerald-800">{rec.id}</td>
                        <td className="p-3 font-semibold text-gray-800">{rec.farmer}</td>
                        <td className="p-3 font-bold text-emerald-800">{rec.crop}</td>
                        <td className="p-3 text-gray-600">{rec.irrigation}</td>
                        <td className="p-3 text-gray-500">{rec.fertilizer}</td>
                        <td className="p-3 text-gray-500">{rec.prevention}</td>
                        <td className="p-3 text-gray-400 font-mono">{rec.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      ) : activeCategory === 'Marketing' ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Store Marketing Dashboard</h2>
              <p className="text-xs text-gray-400">Manage customer promotional coupons, launch target SMS/Email campaigns, divide demographic segments, and analyze marketing ROI.</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setShowCreateCouponModal(true)}
                className="btn-primary py-2 px-3 flex items-center gap-1.5 font-bold"
              >
                <Plus size={14}/> Create Coupon
              </button>
              <button
                onClick={() => setShowSmsBuilderModal(true)}
                className="btn-secondary py-2 px-3 font-bold"
              >
                Launch SMS Campaign
              </button>
            </div>
          </div>

          {/* ================= 1. OVERVIEW SCREEN ================= */}
          {!['Coupons', 'Promotions', 'SMS Campaigns', 'Email Campaigns', 'Customer Notifications'].includes(activeSubItem) && (
            <div className="space-y-6">
              {/* Dashboard Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Active Campaigns', val: smsCampaigns.filter(c => c.status === 'Sent').length + emailCampaigns.length, color: 'text-gray-800', bg: 'bg-white' },
                  { label: 'Coupons Created', val: coupons.length, color: 'text-[#236625]', bg: 'bg-emerald-50/50' },
                  { label: 'Messages Sent', val: '1,460', color: 'text-blue-600', bg: 'bg-blue-50/50' },
                  { label: 'Campaign Reach', val: '1.8k Farmers', color: 'text-purple-600', bg: 'bg-purple-50/50' },
                  { label: 'Conversion Rate', val: '5.4%', color: 'text-amber-600', bg: 'bg-amber-50/50' },
                  { label: 'Revenue Impact', val: '₹2,45,000', color: 'text-emerald-800', bg: 'bg-emerald-50/50' }
                ].map((c, i) => (
                  <div key={i} className={`kpi-card border ${c.bg}`}>
                    <p className={`text-xl font-black ${c.color}`}>{c.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{c.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Impact trend */}
                <div className="kpi-card lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Marketing Generated Revenue (Monthly Impact)</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={[
                      { name: 'Jan', organic: 120000, promo: 45000 },
                      { name: 'Feb', organic: 140000, promo: 58000 },
                      { name: 'Mar', organic: 180000, promo: 95000 },
                      { name: 'Apr', organic: 160000, promo: 124000 },
                      { name: 'May', organic: 220000, promo: 245000 }
                    ]}>
                      <defs>
                        <linearGradient id="promoGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#236625" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#236625" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }}/>
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${v/1000}k`}/>
                      <Tooltip/>
                      <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: 10 }}/>
                      <Area name="Promo Campaign Revenue" type="monotone" dataKey="promo" stroke="#236625" fill="url(#promoGrad)" strokeWidth={2}/>
                      <Area name="Organic Store Sales" type="monotone" dataKey="organic" stroke="#64748b" fill="none" strokeWidth={1.5} strokeDasharray="4 4"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Engagement Breakdown */}
                <div className="kpi-card flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Engagement Channel Share</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={[
                        { name: 'SMS Alerts', value: 65, color: '#236625' },
                        { name: 'Email Newsletters', value: 20, color: '#66bb6a' },
                        { name: 'In-App Alerts', value: 15, color: '#ffa726' }
                      ]} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={4}>
                        {[
                          { name: 'SMS Alerts', value: 65, color: '#236625' },
                          { name: 'Email Newsletters', value: 20, color: '#66bb6a' },
                          { name: 'In-App Alerts', value: 15, color: '#ffa726' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color}/>
                        ))}
                      </Pie>
                      <Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {[
                      { name: 'SMS Broadcasts', color: '#236625', pct: '65%' },
                      { name: 'Email Newsletters', color: '#66bb6a', pct: '20%' },
                      { name: 'Push/Offer Alerts', color: '#ffa726', pct: '15%' }
                    ].map((c, i) => (
                      <div key={i} className="flex justify-between text-[10px]">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}/>{c.name}</div>
                        <span className="font-bold text-gray-700">{c.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom activity log row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <div className="kpi-card lg:col-span-2 space-y-3">
                  <h3 className="text-sm font-bold text-gray-800">Recent Marketing Events</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Promo Code Created', desc: 'Added coupon code KHARIF50 (Flat ₹50 Seed discount).', time: '1 hour ago' },
                      { title: 'SMS Campaign Sent', desc: 'Dispatched "Cotton Seeds Season Promo" to 620 farmers.', time: '2 hours ago' },
                      { title: 'Seasonal Offer Activated', desc: 'Bumper Rabi seed discount set to Active status.', time: '1 day ago' },
                      { title: 'Soil Warning Broadcasted', desc: 'Push alert sent to Loni North segment.', time: '2 days ago' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-gray-800">{item.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap ml-4">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Segments widget */}
                <div className="kpi-card space-y-3">
                  <h3 className="text-sm font-bold text-gray-800">Customer Segments</h3>
                  <div className="space-y-2.5">
                    {customerSegments.map((seg, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-gray-800">{seg.name}</p>
                          <p className="text-[9px] text-gray-400">{seg.desc}</p>
                        </div>
                        <span className="font-bold text-[#236625] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{seg.count} profiles</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. COUPON MANAGEMENT ================= */}
          {activeSubItem === 'Coupons' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase">Discount Coupons Register</h3>
                  <p className="text-xs text-gray-400">Configure promotional checkout coupon codes, discounts, limits, and expiration dates.</p>
                </div>
                <button
                  onClick={() => setShowCreateCouponModal(true)}
                  className="btn-primary text-xs py-2 px-3 font-bold flex items-center gap-1"
                >
                  <Plus size={12}/> Create Coupon
                </button>
              </div>

              {/* Coupons table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase bg-gray-50/50">
                      <th className="p-3">Coupon Code</th>
                      <th className="p-3">Coupon Name</th>
                      <th className="p-3">Discount Type</th>
                      <th className="p-3">Discount Value</th>
                      <th className="p-3">Expiry Date</th>
                      <th className="p-3">Usage Count</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((cp, idx) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                        <td className="p-3 font-mono font-bold text-emerald-800">{cp.code}</td>
                        <td className="p-3 font-semibold text-gray-800">{cp.name}</td>
                        <td className="p-3 text-gray-600">{cp.type}</td>
                        <td className="p-3 font-bold text-gray-800">
                          {cp.type === 'Percentage' ? `${cp.value}% Off` : `₹${cp.value} Off`}
                        </td>
                        <td className="p-3 text-gray-500 font-mono">{cp.endDate}</td>
                        <td className="p-3 font-bold text-gray-600">{cp.used} / {cp.limit}</td>
                        <td className="p-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            cp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>{cp.status}</span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                setCoupons(prev => prev.map(c => c.code === cp.code ? { ...c, status: c.status === 'Active' ? 'Disabled' : 'Active' } : c));
                                toast.success(`Coupon ${cp.code} status toggled.`);
                              }}
                              className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded"
                            >
                              {cp.status === 'Active' ? 'Disable' : 'Enable'}
                            </button>
                            <button
                              onClick={() => {
                                setCoupons(prev => prev.filter(c => c.code !== cp.code));
                                toast.error(`Coupon ${cp.code} deleted.`);
                              }}
                              className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 3. PROMOTIONS ================= */}
          {activeSubItem === 'Promotions' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase">Active Promotions Registry</h3>
                  <p className="text-xs text-gray-400">Track seasonal offers, category discounts, and catalog banner campaigns.</p>
                </div>
                <button
                  onClick={() => setShowCreatePromoModal(true)}
                  className="btn-primary text-xs py-2 px-3 font-bold flex items-center gap-1"
                >
                  <Plus size={12}/> Create Promotion
                </button>
              </div>

              {/* Grid lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {promotions.map((p, idx) => (
                  <div key={idx} className="kpi-card border flex justify-between items-start">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase border border-emerald-100">{p.type}</span>
                      <h4 className="font-bold text-sm text-gray-800 mt-1">{p.name}</h4>
                      <p className="text-xs text-gray-600">Discount Value: <span className="font-bold">{p.value}</span></p>
                      <p className="text-[10px] text-gray-400">Target Catalog: {p.scope}</p>
                    </div>

                    <div className="flex flex-col gap-2 text-right">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                      }`}>{p.status}</span>
                      <button
                        onClick={() => {
                          setPromotions(prev => prev.map(x => x.id === p.id ? { ...x, status: x.status === 'Active' ? 'Inactive' : 'Active' } : x));
                          toast.success(`Promo "${p.name}" status toggled.`);
                        }}
                        className="text-[10px] font-bold text-[#236625] bg-emerald-50 px-2.5 py-1 rounded mt-2 border border-emerald-100"
                      >
                        {p.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. SMS CAMPAIGNS ================= */}
          {activeSubItem === 'SMS Campaigns' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase">SMS Campaign Manager</h3>
                  <p className="text-xs text-gray-400">Draft SMS crop alerts, coupon codes, or reminders, and broadcast them instantly.</p>
                </div>
                <button
                  onClick={() => setShowSmsBuilderModal(true)}
                  className="btn-primary text-xs py-2 px-3 font-bold flex items-center gap-1"
                >
                  <Plus size={12}/> Draft SMS Campaign
                </button>
              </div>

              {/* SMS Logs Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase bg-gray-50/50">
                      <th className="p-3">Campaign ID</th>
                      <th className="p-3">Campaign Name</th>
                      <th className="p-3">Demographic Target</th>
                      <th className="p-3">Sent Count</th>
                      <th className="p-3">Delivered Rate</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Sent Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {smsCampaigns.map((sms, idx) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                        <td className="p-3 font-mono font-bold text-emerald-800">{sms.id}</td>
                        <td className="p-3 font-bold text-gray-800">{sms.name}</td>
                        <td className="p-3 text-gray-600 font-semibold">{sms.segment}</td>
                        <td className="p-3 font-bold">{sms.sent || '—'}</td>
                        <td className="p-3 font-semibold text-emerald-700">
                          {sms.delivered ? `${Math.round((sms.delivered / sms.sent)*100)}%` : '—'}
                        </td>
                        <td className="p-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            sms.status === 'Sent' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>{sms.status}</span>
                        </td>
                        <td className="p-3 text-gray-500 font-mono">{sms.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 5. EMAIL CAMPAIGNS ================= */}
          {activeSubItem === 'Email Campaigns' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase">Email Marketing Newsletters</h3>
                  <p className="text-xs text-gray-400">Launch HTML newsletters, crop advisories, and track customer email opens/clicks.</p>
                </div>
                <button
                  onClick={() => setShowEmailBuilderModal(true)}
                  className="btn-primary text-xs py-2 px-3 font-bold flex items-center gap-1"
                >
                  <Plus size={12}/> Design Email Campaign
                </button>
              </div>

              {/* Email Table list */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase bg-gray-50/50">
                      <th className="p-3">Campaign</th>
                      <th className="p-3">Subject Line</th>
                      <th className="p-3">Segment Target</th>
                      <th className="p-3">Sent</th>
                      <th className="p-3">Open Rate</th>
                      <th className="p-3">Click Rate</th>
                      <th className="p-3">Conversions</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailCampaigns.map((em, idx) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                        <td className="p-3 font-bold text-gray-800">{em.name}</td>
                        <td className="p-3 text-gray-600">{em.subject}</td>
                        <td className="p-3 font-semibold">{em.segment}</td>
                        <td className="p-3 font-black text-gray-700">{em.sent}</td>
                        <td className="p-3 font-bold text-emerald-800">{Math.round((em.opens / em.sent)*100)}%</td>
                        <td className="p-3 font-bold text-blue-700">{Math.round((em.clicks / em.opens)*100)}%</td>
                        <td className="p-3 font-bold text-purple-700">{em.conversions}</td>
                        <td className="p-3 text-gray-400 font-mono">{em.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 6. CUSTOMER NOTIFICATIONS ================= */}
          {activeSubItem === 'Customer Notifications' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase">Farmer Push Alerts</h3>
                  <p className="text-xs text-gray-400">Dispatch alerts, crop advisors or order status notifications directly to customer mobile interfaces.</p>
                </div>
                <button
                  onClick={() => setShowNotificationModal(true)}
                  className="btn-primary text-xs py-2 px-3 font-bold flex items-center gap-1"
                >
                  <Plus size={12}/> Dispatch Push Notification
                </button>
              </div>

              {/* Notification timeline logs */}
              <div className="kpi-card space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase">Notification Broadcast History</h4>
                <div className="space-y-3">
                  {customerNotifications.map((not, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 text-[9px] uppercase">{not.type}</span>
                        <h5 className="font-bold text-gray-800 mt-1">{not.title}</h5>
                        <p className="text-[10px] text-gray-500 mt-0.5">{not.content}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap ml-4">{not.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= MODALS SYSTEM FOR MARKETING ================= */}

          {/* Create Coupon Modal */}
          {showCreateCouponModal && (
            <Modal isOpen={!!showCreateCouponModal} onClose={() => setShowCreateCouponModal(null)} title="Create Discount Coupon" size="sm">
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Coupon Code *</label>
                    <input id="cpCode" type="text" placeholder="e.g. KHARIF50" className="w-full border rounded-lg px-3 py-2 outline-none font-bold uppercase"/>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Coupon Name</label>
                    <input id="cpName" type="text" placeholder="Monsoon Seeds discount" className="w-full border rounded-lg px-3 py-2 outline-none"/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Discount Type</label>
                    <select id="cpType" className="w-full border rounded-lg px-3 py-2 bg-white outline-none">
                      <option>Flat</option>
                      <option>Percentage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Discount Value</label>
                    <input id="cpVal" type="number" placeholder="50" className="w-full border rounded-lg px-3 py-2 outline-none font-bold"/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Usage Limit</label>
                    <input id="cpLimit" type="number" placeholder="100" className="w-full border rounded-lg px-3 py-2 outline-none"/>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">End Date</label>
                    <input id="cpEndDate" type="date" className="w-full border rounded-lg px-3 py-2 outline-none font-mono"/>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      const code = document.getElementById('cpCode').value;
                      const name = document.getElementById('cpName').value || 'Seasonal Discount';
                      const type = document.getElementById('cpType').value;
                      const val = parseInt(document.getElementById('cpVal').value) || 0;
                      const limit = parseInt(document.getElementById('cpLimit').value) || 100;
                      const end = document.getElementById('cpEndDate').value || new Date().toISOString().split('T')[0];
                      if (!code || val <= 0) {
                        toast.error('Please input a valid coupon code and value.');
                        return;
                      }
                      setCoupons(prev => [
                        { code: code.toUpperCase(), name, type, value: val, startDate: new Date().toISOString().split('T')[0], endDate: end, limit, status: 'Active', used: 0 },
                        ...prev
                      ]);
                      toast.success(`Coupon ${code.toUpperCase()} successfully created and activated!`);
                      setShowCreateCouponModal(false);
                    }}
                    className="flex-1 btn-primary py-2.5 font-bold uppercase"
                  >
                    Create Coupon
                  </button>
                  <button onClick={() => setShowCreateCouponModal(false)} className="btn-secondary px-4 py-2 font-bold">Cancel</button>
                </div>
              </div>
            </Modal>
          )}

          {/* Create Promotion Modal */}
          {showCreatePromoModal && (
            <Modal isOpen={!!showCreatePromoModal} onClose={() => setShowCreatePromoModal(null)} title="Create Promotion Offer" size="sm">
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Promotion Name *</label>
                  <input id="prName" type="text" placeholder="Monsoon Organic Bumper offer" className="w-full border rounded-lg px-3 py-2 outline-none"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Promotion Type</label>
                    <select id="prType" className="w-full border rounded-lg px-3 py-2 bg-white outline-none">
                      <option>Category Discount</option>
                      <option>Product Discount</option>
                      <option>Seasonal Offer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Promo Value Text</label>
                    <input id="prVal" type="text" placeholder="e.g. 15% Off Seeds" className="w-full border rounded-lg px-3 py-2 outline-none"/>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Target Scope (Product/Category)</label>
                  <input id="prScope" type="text" placeholder="e.g. Seeds / Urea" className="w-full border rounded-lg px-3 py-2 outline-none"/>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      const name = document.getElementById('prName').value;
                      const type = document.getElementById('prType').value;
                      const val = document.getElementById('prVal').value || 'Special Price';
                      const scope = document.getElementById('prScope').value || 'All Catalog';
                      if (!name) {
                        toast.error('Please input a valid promotion name.');
                        return;
                      }
                      setPromotions(prev => [
                        { id: `PRM-00${prev.length + 1}`, name, type, value: val, scope, status: 'Active' },
                        ...prev
                      ]);
                      toast.success(`Promo "${name}" registered successfully!`);
                      setShowCreatePromoModal(false);
                    }}
                    className="flex-1 btn-primary py-2.5 font-bold uppercase"
                  >
                    Confirm Promo
                  </button>
                  <button onClick={() => setShowCreatePromoModal(false)} className="btn-secondary px-4 py-2 font-bold">Cancel</button>
                </div>
              </div>
            </Modal>
          )}

          {/* SMS Builder Modal */}
          {showSmsBuilderModal && (
            <Modal isOpen={!!showSmsBuilderModal} onClose={() => setShowSmsBuilderModal(null)} title="Launch SMS Marketing Campaign" size="sm">
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Campaign Name *</label>
                  <input id="smsCampName" type="text" placeholder="Cotton Season Launch Alert" className="w-full border rounded-lg px-3 py-2 outline-none"/>
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Target Customer Segment</label>
                  <select id="smsCampSeg" className="w-full border rounded-lg px-3 py-2 bg-white outline-none">
                    <option>Farmers</option>
                    <option>Credit Customers</option>
                    <option>High Value Customers</option>
                    <option>New Customers</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">SMS Message Content *</label>
                  <textarea id="smsCampContent" rows="3" placeholder="Enter promotional text..." className="w-full border rounded-lg px-3 py-2 outline-none resize-none"></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      const name = document.getElementById('smsCampName').value;
                      const segment = document.getElementById('smsCampSeg').value;
                      const content = document.getElementById('smsCampContent').value;
                      if (!name || !content) {
                        toast.error('Please input campaign name and SMS content.');
                        return;
                      }
                      setSmsCampaigns(prev => [
                        { id: `SMS-${Date.now().toString().slice(-3)}`, name, segment, content, date: new Date().toISOString().split('T')[0], sent: 620, delivered: 610, failed: 10, status: 'Sent' },
                        ...prev
                      ]);
                      toast.success(`SMS Campaign "${name}" dispatched successfully to ${segment}!`);
                      setShowSmsBuilderModal(false);
                    }}
                    className="flex-1 btn-primary py-2.5 font-bold uppercase"
                  >
                    Send Now
                  </button>
                  <button onClick={() => setShowSmsBuilderModal(false)} className="btn-secondary px-4 py-2 font-bold">Cancel</button>
                </div>
              </div>
            </Modal>
          )}

          {/* Email Builder Modal */}
          {showEmailBuilderModal && (
            <Modal isOpen={!!showEmailBuilderModal} onClose={() => setShowEmailBuilderModal(null)} title="Launch Email Newsletter Campaign" size="sm">
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Campaign Name *</label>
                  <input id="emailCampName" type="text" placeholder="June Advisory Newsletter" className="w-full border rounded-lg px-3 py-2 outline-none"/>
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Email Subject Line *</label>
                  <input id="emailCampSub" type="text" placeholder="Crop advisories and rain alerts for June" className="w-full border rounded-lg px-3 py-2 outline-none"/>
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Target Customer Segment</label>
                  <select id="emailCampSeg" className="w-full border rounded-lg px-3 py-2 bg-white outline-none">
                    <option>All Customers</option>
                    <option>Farmers</option>
                    <option>High Value Customers</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      const name = document.getElementById('emailCampName').value;
                      const sub = document.getElementById('emailCampSub').value;
                      const seg = document.getElementById('emailCampSeg').value;
                      if (!name || !sub) {
                        toast.error('Please input campaign name and subject line.');
                        return;
                      }
                      setEmailCampaigns(prev => [
                        { id: `EML-${Date.now().toString().slice(-3)}`, name, segment: seg, subject: sub, date: new Date().toISOString().split('T')[0], sent: 840, opens: 380, clicks: 120, conversions: 15, status: 'Sent' },
                        ...prev
                      ]);
                      toast.success(`Email Campaign "${name}" dispatched successfully to ${seg}!`);
                      setShowEmailBuilderModal(false);
                    }}
                    className="flex-1 btn-primary py-2.5 font-bold uppercase"
                  >
                    Send Newsletter
                  </button>
                  <button onClick={() => setShowEmailBuilderModal(false)} className="btn-secondary px-4 py-2 font-bold">Cancel</button>
                </div>
              </div>
            </Modal>
          )}

          {/* Notification Builder Modal */}
          {showNotificationModal && (
            <Modal isOpen={!!showNotificationModal} onClose={() => setShowNotificationModal(null)} title="Dispatch Push Notification" size="sm">
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Notification Title *</label>
                  <input id="notTitle" type="text" placeholder="Heatwave warning broadcast" className="w-full border rounded-lg px-3 py-2 outline-none"/>
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Notification Type</label>
                  <select id="notType" className="w-full border rounded-lg px-3 py-2 bg-white outline-none">
                    <option>Offer Alert</option>
                    <option>Product Update</option>
                    <option>Order Update</option>
                    <option>Seasonal Recommendation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Alert Content *</label>
                  <textarea id="notContent" rows="3" placeholder="Enter alert text..." className="w-full border rounded-lg px-3 py-2 outline-none resize-none"></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      const title = document.getElementById('notTitle').value;
                      const type = document.getElementById('notType').value;
                      const content = document.getElementById('notContent').value;
                      if (!title || !content) {
                        toast.error('Please input title and alert text.');
                        return;
                      }
                      setCustomerNotifications(prev => [
                        { id: `NOT-${Date.now().toString().slice(-3)}`, title, type, content, date: new Date().toISOString().split('T')[0], status: 'Sent' },
                        ...prev
                      ]);
                      toast.success(`Push notification "${title}" dispatched successfully!`);
                      setShowNotificationModal(false);
                    }}
                    className="flex-1 btn-primary py-2.5 font-bold uppercase"
                  >
                    Dispatch Now
                  </button>
                  <button onClick={() => setShowNotificationModal(false)} className="btn-secondary px-4 py-2 font-bold">Cancel</button>
                </div>
              </div>
            </Modal>
          )}

        </div>
      ) : activeCategory === 'Support Center' ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Customer Support Center</h2>
              <p className="text-xs text-gray-400">Resolve customer complaints, process billing refund requests, manage live chats and call logs, and track staff workloads.</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setShowCreateTicketModal(true)}
                className="btn-primary py-2 px-3 flex items-center gap-1.5 font-bold"
              >
                <Plus size={14}/> Log Support Ticket
              </button>
              <button
                onClick={() => setShowCreateArticleModal(true)}
                className="btn-secondary py-2 px-3 font-bold"
              >
                Create Help Article
              </button>
            </div>
          </div>

          {/* ================= 1. OVERVIEW SCREEN ================= */}
          {!['Customer Complaints', 'Refund Requests', 'Help Desk', 'Support Tickets'].includes(activeSubItem) && (
            <div className="space-y-6">
              {/* Dashboard Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Total Tickets', val: supportTickets.length, color: 'text-gray-800', bg: 'bg-white' },
                  { label: 'Open Tickets', val: supportTickets.filter(t => t.status === 'Open').length, color: 'text-amber-600', bg: 'bg-amber-50/50' },
                  { label: 'Resolved Tickets', val: supportTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length, color: 'text-[#236625]', bg: 'bg-emerald-50/50' },
                  { label: 'Pending Tickets', val: supportTickets.filter(t => t.status === 'Pending').length, color: 'text-blue-600', bg: 'bg-blue-50/50' },
                  { label: 'Critical Tickets', val: supportTickets.filter(t => t.priority === 'Critical').length, color: 'text-red-600', bg: 'bg-red-50/50' },
                  { label: 'CSAT Rating', val: '94%', color: 'text-purple-600', bg: 'bg-purple-50/50' }
                ].map((c, i) => (
                  <div key={i} className={`kpi-card border ${c.bg}`}>
                    <p className={`text-xl font-black ${c.color}`}>{c.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{c.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Volume trend */}
                <div className="kpi-card lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Support Ticket Volume &amp; Resolution Trends (Weekly)</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={[
                      { name: 'Mon', volume: 14, resolved: 12 },
                      { name: 'Tue', volume: 18, resolved: 15 },
                      { name: 'Wed', volume: 15, resolved: 14 },
                      { name: 'Thu', volume: 22, resolved: 19 },
                      { name: 'Fri', volume: 25, resolved: 24 },
                      { name: 'Sat', volume: 12, resolved: 11 },
                      { name: 'Sun', volume: 8, resolved: 8 }
                    ]}>
                      <defs>
                        <linearGradient id="supportGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#236625" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#236625" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }}/>
                      <YAxis tick={{ fontSize: 10 }}/>
                      <Tooltip/>
                      <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: 10 }}/>
                      <Area name="Incoming Tickets" type="monotone" dataKey="volume" stroke="#236625" fill="url(#supportGrad)" strokeWidth={2}/>
                      <Area name="Resolved Tickets" type="monotone" dataKey="resolved" stroke="#42a5f5" fill="none" strokeWidth={1.5}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Categories share */}
                <div className="kpi-card flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Complaint Categories</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={[
                        { name: 'Billing Issues', value: 45, color: '#e53935' },
                        { name: 'Delivery Delays', value: 30, color: '#ffb300' },
                        { name: 'Product Quality', value: 15, color: '#1e88e5' },
                        { name: 'Other Support', value: 10, color: '#43a047' }
                      ]} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={4}>
                        {[
                          { name: 'Billing Issues', value: 45, color: '#e53935' },
                          { name: 'Delivery Delays', value: 30, color: '#ffb300' },
                          { name: 'Product Quality', value: 15, color: '#1e88e5' },
                          { name: 'Other Support', value: 10, color: '#43a047' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color}/>
                        ))}
                      </Pie>
                      <Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {[
                      { name: 'Billing Issues', color: '#e53935', pct: '45%' },
                      { name: 'Delivery Delays', color: '#ffb300', pct: '30%' },
                      { name: 'Product Defect', color: '#1e88e5', pct: '15%' },
                      { name: 'Other / Technical', color: '#43a047', pct: '10%' }
                    ].map((c, i) => (
                      <div key={i} className="flex justify-between text-[10px]">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}/>{c.name}</div>
                        <span className="font-bold text-gray-700">{c.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom activity log row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <div className="kpi-card lg:col-span-2 space-y-3">
                  <h3 className="text-sm font-bold text-gray-800">Recent Support Events</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'New Ticket Logged', desc: 'Ticket TKT-1001 logged by Suresh Patil. Issue: double billing.', time: '10 mins ago' },
                      { title: 'Refund Completed', desc: 'Processed refund of ₹6,700 for Meena Jadhav.', time: '1 hour ago' },
                      { title: 'Live Chat Closed', desc: 'Rider ETA query resolved and chat closed.', time: '3 hours ago' },
                      { title: 'Ticket Escalated', desc: 'ORD-9082 delayed delivery ticket escalated to Critical priority.', time: '1 day ago' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-gray-800">{item.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap ml-4">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agents workload widget */}
                <div className="kpi-card space-y-3">
                  <h3 className="text-sm font-bold text-gray-800">Support Staff Allocation</h3>
                  <div className="space-y-2.5">
                    {supportAgents.map((agent, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-gray-800">{agent.name}</p>
                          <p className="text-[9px] text-gray-400">{agent.role}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          agent.status === 'Online' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                        }`}>{agent.workload} active tickets</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. CUSTOMER COMPLAINTS ================= */}
          {activeSubItem === 'Customer Complaints' && (
            <div className="space-y-5">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase">Support Tickets &amp; Complaints</h3>
                  <p className="text-xs text-gray-400">Search incoming queries, assign responsibilities, and update resolution states.</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 border rounded-lg px-3 bg-slate-50 text-xs">
                    <Search size={12} className="text-gray-400"/>
                    <input
                      type="text"
                      placeholder="Search Ticket, Customer..."
                      value={ticketSearchQuery}
                      onChange={e => setTicketSearchQuery(e.target.value)}
                      className="bg-transparent outline-none py-1.5 w-40 text-gray-700"
                    />
                  </div>
                  <select
                    value={ticketStatusFilter}
                    onChange={e => setTicketStatusFilter(e.target.value)}
                    className="border rounded-lg text-xs px-2 py-1 bg-white font-bold"
                  >
                    <option value="All">All Statuses</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Pending</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>

              {/* Tickets table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase bg-gray-50/50">
                      <th className="p-3">Ticket ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Assigned Agent</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Created Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supportTickets
                      .filter(t => {
                        const mSearch = t.customer.toLowerCase().includes(ticketSearchQuery.toLowerCase()) || t.id.toLowerCase().includes(ticketSearchQuery.toLowerCase());
                        const mStatus = ticketStatusFilter === 'All' || t.status === ticketStatusFilter;
                        return mSearch && mStatus;
                      })
                      .map((t, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50/30">
                          <td className="p-3 font-mono font-bold text-emerald-800">{t.id}</td>
                          <td className="p-3 font-semibold text-gray-800">{t.customer}</td>
                          <td className="p-3 text-gray-500 font-medium">{t.type}</td>
                          <td className="p-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              t.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                              t.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                              t.priority === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                            }`}>{t.priority}</span>
                          </td>
                          <td className="p-3 text-gray-600 font-medium">{t.agent || 'Unassigned'}</td>
                          <td className="p-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              t.status === 'Resolved' || t.status === 'Closed' ? 'bg-green-100 text-green-700' :
                              t.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                            }`}>{t.status}</span>
                          </td>
                          <td className="p-3 text-gray-400 font-mono">{t.date}</td>
                          <td className="p-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => setSelectedTicket(t)} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">View</button>
                              <button onClick={() => setShowAssignAgentModal(t)} className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">Assign</button>
                              {t.status !== 'Resolved' && t.status !== 'Closed' && (
                                <button
                                  onClick={() => {
                                    setSupportTickets(prev => prev.map(x => x.id === t.id ? { ...x, status: 'Resolved' } : x));
                                    toast.success(`Ticket ${t.id} successfully marked as Resolved.`);
                                  }}
                                  className="text-[10px] font-bold text-white bg-[#236625] px-2 py-0.5 rounded"
                                >
                                  Resolve
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 3. REFUND REQUESTS ================= */}
          {activeSubItem === 'Refund Requests' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Refund Request Registry</h3>
                <p className="text-xs text-gray-400">Review outstanding return credit balances, inspect issues, and process payments.</p>
              </div>

              {/* Refunds Table */}
              <div className="kpi-card overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b text-gray-400 font-semibold uppercase bg-gray-50/50">
                      <th className="p-3">Refund ID</th>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refundRequests.map((rf, idx) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                        <td className="p-3 font-mono font-bold text-emerald-800">{rf.id}</td>
                        <td className="p-3 font-mono">{rf.orderId}</td>
                        <td className="p-3 font-semibold text-gray-800">{rf.customer}</td>
                        <td className="p-3 font-black text-gray-700">₹{rf.amount.toLocaleString()}</td>
                        <td className="p-3 text-gray-500 max-w-[150px] truncate" title={rf.reason}>{rf.reason}</td>
                        <td className="p-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            rf.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            rf.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>{rf.status}</span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex gap-2 justify-end">
                            {rf.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => {
                                    setRefundRequests(prev => prev.map(x => x.id === rf.id ? { ...x, status: 'Approved' } : x));
                                    toast.success(`Refund request ${rf.id} approved!`);
                                  }}
                                  className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setRefundRequests(prev => prev.map(x => x.id === rf.id ? { ...x, status: 'Rejected' } : x));
                                    toast.error(`Refund request ${rf.id} rejected.`);
                                  }}
                                  className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded"
                                >
                                  Reject
                                </button>
                              </>
                            ) : rf.status === 'Approved' ? (
                              <button
                                onClick={() => {
                                  setRefundRequests(prev => prev.map(x => x.id === rf.id ? { ...x, status: 'Completed' } : x));
                                  toast.success(`Refund transfer of ₹${rf.amount} completed to farmer account.`);
                                }}
                                className="text-[10px] font-bold text-white bg-[#236625] px-2.5 py-0.5 rounded"
                              >
                                Process Refund
                              </button>
                            ) : (
                              <span className="text-[10px] font-semibold text-gray-400">Processed</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 4. HELP DESK ================= */}
          {activeSubItem === 'Help Desk' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Knowledge Base panel */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-800 uppercase">Knowledge Base Guides</h3>
                    <button
                      onClick={() => setShowCreateArticleModal(true)}
                      className="btn-primary text-[10px] py-1.5 px-3 font-bold"
                    >
                      + Add Article
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {kbArticles.map((art, idx) => (
                      <div key={idx} className="kpi-card border space-y-2">
                        <span className="text-[9px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">{art.category}</span>
                        <h4 className="font-bold text-sm text-gray-800 mt-1">{art.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed italic">"{art.content}"</p>
                        <div className="pt-2 flex justify-between items-center border-t text-[10px]">
                          <button onClick={() => toast.success(`Sharing ${art.title} guide link via SMS...`)} className="font-bold text-[#236625]">Share with Farmer</button>
                          <button
                            onClick={() => {
                              setKbArticles(prev => prev.filter(x => x.id !== art.id));
                              toast.error('Article deleted.');
                            }}
                            className="font-bold text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call Log panel */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase">Call Support logs</h3>
                  <div className="space-y-3">
                    {callLogs.map((log, idx) => (
                      <div key={idx} className="kpi-card border text-xs space-y-1.5">
                        <div className="flex justify-between items-center font-bold text-gray-800">
                          <span>{log.customer} ({log.type})</span>
                          <span className="text-[9px] font-mono text-gray-400">{log.duration}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 italic">"Agent: {log.agent} • {log.notes}"</p>
                        <button
                          onClick={() => {
                            const note = prompt('Update resolution notes:', log.notes);
                            if (note !== null) {
                              setCallLogs(prev => prev.map(x => x.id === log.id ? { ...x, notes: note } : x));
                              toast.success('Call notes saved.');
                            }
                          }}
                          className="font-bold text-emerald-800 text-[10px] hover:underline"
                        >
                          Edit Log Notes
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 5. LIVE CHAT PANEL ================= */}
          {activeSubItem === 'Support Tickets' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Chats list */}
                <div className="kpi-card space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase">Active Live Chats</h4>
                  <div className="space-y-2">
                    {activeChats.map((chat, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedChat(chat)}
                        className={`border rounded-xl p-3 cursor-pointer hover:border-emerald-500 transition-all text-xs ${
                          selectedChat?.id === chat.id ? 'border-[#236625] bg-emerald-50/50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center font-bold text-gray-800">
                          <span>{chat.customer}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            chat.status === 'Active' ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-amber-100 text-amber-700'
                          }`}>{chat.status}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 truncate">{chat.messages[chat.messages.length - 1]?.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat window */}
                <div className="kpi-card lg:col-span-2 flex flex-col justify-between min-h-[350px] border">
                  {selectedChat ? (
                    <>
                      {/* Header */}
                      <div className="border-b pb-2 mb-2 flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-gray-800">{selectedChat.customer}</span>
                          <span className="text-[9px] text-gray-400 block">ID: {selectedChat.id}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setActiveChats(prev => prev.map(x => x.id === selectedChat.id ? { ...x, status: 'Closed' } : x));
                              toast.success('Live chat resolved and archived.');
                              setSelectedChat(null);
                            }}
                            className="text-[9px] font-bold text-white bg-[#236625] px-2 py-1 rounded"
                          >
                            Resolve Chat
                          </button>
                        </div>
                      </div>

                      {/* Messages body */}
                      <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px] p-2 bg-slate-50/50 border rounded-lg text-xs">
                        {selectedChat.messages.map((m, idx) => (
                          <div key={idx} className={`flex ${m.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-2.5 rounded-xl max-w-[200px] leading-relaxed ${
                              m.sender === 'agent' ? 'bg-emerald-800 text-white rounded-tr-none' : 'bg-slate-100 text-gray-800 rounded-tl-none'
                            }`}>
                              <p>{m.text}</p>
                              <span className="text-[8px] text-slate-300 block text-right mt-1 font-semibold">{m.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Input composer */}
                      <div className="flex gap-2 border-t pt-3 mt-3">
                        <input
                          type="text"
                          placeholder="Type reply to farmer..."
                          value={chatReplyText}
                          onChange={e => setChatReplyText(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && chatReplyText) {
                              const newMsg = { sender: 'agent', text: chatReplyText, time: 'Just Now' };
                              setActiveChats(prev => prev.map(x => x.id === selectedChat.id ? { ...x, messages: [...x.messages, newMsg] } : x));
                              setSelectedChat(prev => ({ ...prev, messages: [...prev.messages, newMsg] }));
                              setChatReplyText('');
                            }
                          }}
                          className="flex-1 border rounded-lg px-3 py-1.5 text-xs outline-none"
                        />
                        <button
                          onClick={() => {
                            if (chatReplyText) {
                              const newMsg = { sender: 'agent', text: chatReplyText, time: 'Just Now' };
                              setActiveChats(prev => prev.map(x => x.id === selectedChat.id ? { ...x, messages: [...x.messages, newMsg] } : x));
                              setSelectedChat(prev => ({ ...prev, messages: [...prev.messages, newMsg] }));
                              setChatReplyText('');
                            }
                          }}
                          className="btn-primary px-4 text-xs font-bold"
                        >
                          Send
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-400 border border-dashed rounded-xl bg-slate-50/50 flex-1 flex flex-col items-center justify-center">
                      <MessageSquare size={28} className="mx-auto mb-2 opacity-50"/>
                      <p className="text-xs font-semibold">Select an active chat session to launch interaction console.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= MODALS SYSTEM FOR SUPPORT ================= */}

          {/* Create Help Article Modal */}
          {showCreateArticleModal && (
            <Modal isOpen={!!showCreateArticleModal} onClose={() => setShowCreateArticleModal(null)} title="Create Knowledge Base Guide" size="sm">
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Article Title *</label>
                  <input id="kbTitle" type="text" placeholder="e.g. How to track delivery" className="w-full border rounded-lg px-3 py-2 outline-none"/>
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select id="kbCategory" className="w-full border rounded-lg px-3 py-2 bg-white outline-none">
                    <option>Orders</option>
                    <option>Billing</option>
                    <option>Products</option>
                    <option>Delivery</option>
                    <option>Technical</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Guide Content *</label>
                  <textarea id="kbContent" rows="4" placeholder="Describe instructions clearly..." className="w-full border rounded-lg px-3 py-2 outline-none resize-none"></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      const title = document.getElementById('kbTitle').value;
                      const cat = document.getElementById('kbCategory').value;
                      const content = document.getElementById('kbContent').value;
                      if (!title || !content) {
                        toast.error('Please input article title and content.');
                        return;
                      }
                      setKbArticles(prev => [
                        ...prev,
                        { id: `KB-${Date.now().toString().slice(-3)}`, title, category: cat, content }
                      ]);
                      toast.success(`Advisory article "${title}" published successfully!`);
                      setShowCreateArticleModal(false);
                    }}
                    className="flex-1 btn-primary py-2.5 font-bold uppercase"
                  >
                    Publish Article
                  </button>
                  <button onClick={() => setShowCreateArticleModal(false)} className="btn-secondary px-4 py-2 font-bold">Cancel</button>
                </div>
              </div>
            </Modal>
          )}

          {/* Assign Agent Modal */}
          {showAssignAgentModal && (
            <Modal isOpen={!!showAssignAgentModal} onClose={() => setShowAssignAgentModal(null)} title="Assign Support Agent" size="sm">
              <div className="space-y-4 text-xs">
                <div>
                  <p className="font-bold text-gray-700">Assign ticket {showAssignAgentModal.id}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Customer: {showAssignAgentModal.customer} | Details: {showAssignAgentModal.desc}</p>
                </div>
                <div className="space-y-2">
                  <label className="block font-bold text-gray-500 uppercase">Select Available Agent</label>
                  <select id="agentSelect" className="w-full border rounded-lg px-3 py-2 bg-white outline-none">
                    {supportAgents.map((ag, idx) => (
                      <option key={idx} value={ag.name}>{ag.name} ({ag.role})</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      const agentName = document.getElementById('agentSelect').value;
                      setSupportTickets(prev => prev.map(x => x.id === showAssignAgentModal.id ? { ...x, agent: agentName, status: 'In Progress' } : x));
                      toast.success(`Ticket ${showAssignAgentModal.id} assigned to agent ${agentName}.`);
                      setShowAssignAgentModal(null);
                    }}
                    className="flex-1 btn-primary py-2.5 font-bold uppercase"
                  >
                    Confirm Assignment
                  </button>
                  <button onClick={() => setShowAssignAgentModal(null)} className="btn-secondary px-4 py-2 font-bold">Cancel</button>
                </div>
              </div>
            </Modal>
          )}

          {/* Log Support Ticket Modal */}
          {showCreateTicketModal && (
            <Modal isOpen={!!showCreateTicketModal} onClose={() => setShowCreateTicketModal(null)} title="Log Customer Support Ticket" size="sm">
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Customer Name *</label>
                    <input id="tktCust" type="text" placeholder="e.g. Balasaheb Vikhe" className="w-full border rounded-lg px-3 py-2 outline-none"/>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Category</label>
                    <select id="tktCat" className="w-full border rounded-lg px-3 py-2 bg-white outline-none">
                      <option>Orders</option>
                      <option>Billing</option>
                      <option>Products</option>
                      <option>Delivery</option>
                      <option>Technical Issues</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Priority</label>
                    <select id="tktPriority" className="w-full border rounded-lg px-3 py-2 bg-white outline-none">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 uppercase mb-1">Assigned Expert</label>
                    <select id="tktAgent" className="w-full border rounded-lg px-3 py-2 bg-white outline-none">
                      {supportAgents.map((ag, idx) => (
                        <option key={idx} value={ag.name}>{ag.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-500 uppercase mb-1">Issue Description *</label>
                  <textarea id="tktDesc" rows="3" placeholder="Provide details of complaint..." className="w-full border rounded-lg px-3 py-2 outline-none resize-none"></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      const cust = document.getElementById('tktCust').value;
                      const cat = document.getElementById('tktCat').value;
                      const priority = document.getElementById('tktPriority').value;
                      const agent = document.getElementById('tktAgent').value;
                      const desc = document.getElementById('tktDesc').value;
                      if (!cust || !desc) {
                        toast.error('Please input customer name and issue details.');
                        return;
                      }
                      setSupportTickets(prev => [
                        { id: `TKT-${Date.now().toString().slice(-4)}`, customer: cust, type: cat, priority, status: 'Open', date: new Date().toISOString().split('T')[0], desc, agent },
                        ...prev
                      ]);
                      toast.success(`Support Ticket successfully generated and assigned to ${agent}!`);
                      setShowCreateTicketModal(false);
                    }}
                    className="flex-1 btn-primary py-2.5 font-bold uppercase"
                  >
                    Log Ticket
                  </button>
                  <button onClick={() => setShowCreateTicketModal(false)} className="btn-secondary px-4 py-2 font-bold">Cancel</button>
                </div>
              </div>
            </Modal>
          )}

          {/* Ticket Detail Modal */}
          {selectedTicket && (
            <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title="Support Ticket Details Overview" size="md">
              <div className="space-y-4 text-xs text-gray-800">
                <div className="border-b pb-3 grid grid-cols-2 gap-3">
                  <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Ticket ID</span><span className="font-mono font-bold text-emerald-800">{selectedTicket.id}</span></div>
                  <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Category / Date</span><span className="font-semibold text-gray-700">{selectedTicket.type} | {selectedTicket.date}</span></div>
                  <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Customer</span><span className="font-bold text-gray-700">{selectedTicket.customer}</span></div>
                  <div><span className="text-gray-400 font-bold block text-[9px] uppercase">Priority / Status</span><span className={`font-semibold ${selectedTicket.priority === 'Critical' ? 'text-red-600' : 'text-gray-700'}`}>{selectedTicket.priority} | {selectedTicket.status}</span></div>
                </div>

                <div>
                  <span className="text-gray-400 font-bold block text-[9px] uppercase mb-1">Issue Description</span>
                  <p className="bg-slate-50 p-2.5 rounded-lg border leading-relaxed">"{selectedTicket.desc}"</p>
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                  {selectedTicket.status !== 'Resolved' && selectedTicket.status !== 'Closed' && (
                    <button
                      onClick={() => {
                        setSupportTickets(prev => prev.map(x => x.id === selectedTicket.id ? { ...x, status: 'Resolved' } : x));
                        toast.success(`Ticket ${selectedTicket.id} resolved.`);
                        setSelectedTicket(null);
                      }}
                      className="btn-primary py-2 px-4 font-bold uppercase"
                    >
                      Resolve Ticket
                    </button>
                  )}
                  <button onClick={() => setSelectedTicket(null)} className="btn-secondary px-6 py-2 font-bold">Close</button>
                </div>
              </div>
            </Modal>
          )}

        </div>
      ) : activeCategory === 'Reports & Analytics' ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>Reports &amp; Analytics Console</h2>
              <p className="text-xs text-gray-400">Generate executive-level business intelligence reports, audit stocks, track cash flow and employee metrics.</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => {
                  toast.success("Printing current dashboard state...");
                  window.print();
                }}
                className="btn-secondary py-2 px-3 flex items-center gap-1.5 font-bold"
              >
                <Printer size={14}/> Print View
              </button>
              <button
                onClick={() => {
                  toast.success("Preparing PDF export of current workspace...");
                }}
                className="btn-primary py-2 px-3 flex items-center gap-1.5 font-bold"
              >
                <Download size={14}/> Export Executive Summary
              </button>
            </div>
          </div>

          {/* ================= 1. OVERVIEW SCREEN ================= */}
          {!['Sales Reports', 'Inventory Reports', 'Customer Reports', 'Financial Reports', 'Employee Reports', 'Delivery Reports', 'Product Performance', 'Agri Analytics', 'Custom Builder', 'Recent Reports'].includes(activeSubItem) && (
            <div className="space-y-6">
              {/* Dashboard Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Total Revenue', val: '₹14,89,500', color: 'text-[#236625]', bg: 'bg-emerald-50/50' },
                  { label: 'Total Orders', val: '1,480', color: 'text-gray-800', bg: 'bg-white' },
                  { label: 'Total Customers', val: '890', color: 'text-blue-600', bg: 'bg-blue-50/50' },
                  { label: 'Products Sold', val: '12.4K units', color: 'text-purple-600', bg: 'bg-purple-50/50' },
                  { label: 'Monthly Profit', val: '₹1,85,600', color: 'text-amber-600', bg: 'bg-amber-50/50' },
                  { label: 'Business Growth', val: '+14.2%', color: 'text-emerald-600', bg: 'bg-emerald-50/30' }
                ].map((c, i) => (
                  <div key={i} className={`kpi-card border ${c.bg}`}>
                    <p className={`text-lg font-black ${c.color}`}>{c.val}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{c.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue and Profit Trend */}
                <div className="kpi-card">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Revenue vs Profit Trend (Monthly)</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={[
                      { name: 'Jan', revenue: 240000, profit: 45000 },
                      { name: 'Feb', revenue: 290000, profit: 58000 },
                      { name: 'Mar', revenue: 350000, profit: 71000 },
                      { name: 'Apr', revenue: 410000, profit: 89000 },
                      { name: 'May', revenue: 489000, profit: 123500 }
                    ]}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#236625" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#236625" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }}/>
                      <YAxis tick={{ fontSize: 10 }}/>
                      <Tooltip/>
                      <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: 10 }}/>
                      <Area name="Revenue (₹)" type="monotone" dataKey="revenue" stroke="#236625" fill="url(#revGrad)" strokeWidth={2}/>
                      <Area name="Net Profit (₹)" type="monotone" dataKey="profit" stroke="#FFA726" fill="none" strokeWidth={1.5}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Sales volume and orders */}
                <div className="kpi-card">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Orders &amp; Sales Trends</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={[
                      { name: 'Jan', orders: 420, items: 3100 },
                      { name: 'Feb', orders: 510, items: 4200 },
                      { name: 'Mar', orders: 680, items: 5900 },
                      { name: 'Apr', orders: 790, items: 6800 },
                      { name: 'May', orders: 840, items: 7900 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }}/>
                      <YAxis tick={{ fontSize: 10 }}/>
                      <Tooltip/>
                      <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: 10 }}/>
                      <Line name="Total Orders" type="monotone" dataKey="orders" stroke="#42A5F5" strokeWidth={2}/>
                      <Line name="Units Sold" type="monotone" dataKey="items" stroke="#AB47BC" strokeWidth={1.5}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom activity log row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="kpi-card lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Customer Growth Analysis</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={[
                      { name: 'Jan', new: 120, returning: 240 },
                      { name: 'Feb', new: 150, returning: 280 },
                      { name: 'Mar', new: 180, returning: 320 },
                      { name: 'Apr', new: 210, returning: 380 },
                      { name: 'May', new: 240, returning: 410 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }}/>
                      <YAxis tick={{ fontSize: 10 }}/>
                      <Tooltip/>
                      <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: 10 }}/>
                      <Bar name="New Registrations" dataKey="new" fill="#66BB6A" radius={[4, 4, 0, 0]}/>
                      <Bar name="Returning Profiles" dataKey="returning" fill="#236625" radius={[4, 4, 0, 0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="kpi-card flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-gray-800">Category Sales Shares</h3>
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie data={[
                        { name: 'Fertilizers', value: 45, color: '#2E7D32' },
                        { name: 'Seeds', value: 25, color: '#66BB6A' },
                        { name: 'Pesticides', value: 20, color: '#FFA726' },
                        { name: 'Tools', value: 10, color: '#42A5F5' }
                      ]} cx="50%" cy="50%" innerRadius={25} outerRadius={45} dataKey="value">
                        {[
                          { name: 'Fertilizers', value: 45, color: '#2E7D32' },
                          { name: 'Seeds', value: 25, color: '#66BB6A' },
                          { name: 'Pesticides', value: 20, color: '#FFA726' },
                          { name: 'Tools', value: 10, color: '#42A5F5' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color}/>
                        ))}
                      </Pie>
                      <Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-1 text-[10px]">
                    {[
                      { name: 'Fertilizers', color: '#2E7D32', pct: '45%' },
                      { name: 'Seeds', color: '#66BB6A', pct: '25%' },
                      { name: 'Pesticides', color: '#FFA726', pct: '20%' },
                      { name: 'Tools & Others', color: '#42A5F5', pct: '10%' }
                    ].map((c, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }}/>{c.name}</div>
                        <span className="font-bold text-gray-700">{c.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. SALES REPORTS ================= */}
          {activeSubItem === 'Sales Reports' && (
            <div className="space-y-5">
              <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase">Sales Performance Audits</h3>
                  <p className="text-xs text-gray-400">Review total turnover, transactional counts, average order values, and store growth.</p>
                </div>
                <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg text-xs">
                  {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setSalesReportTab(tab)}
                      className={`px-3 py-1 rounded-md font-bold transition-all ${
                        salesReportTab === tab ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sales metrics breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Turnover', val: salesReportTab === 'Daily' ? '₹18,900' : salesReportTab === 'Weekly' ? '₹1,12,400' : salesReportTab === 'Monthly' ? '₹4,89,000' : '₹24,50,000', color: 'text-[#236625]' },
                  { label: 'Average Order Value', val: salesReportTab === 'Daily' ? '₹555' : salesReportTab === 'Weekly' ? '₹567' : salesReportTab === 'Monthly' ? '₹582' : '₹594', color: 'text-blue-600' },
                  { label: 'Transactions Registered', val: salesReportTab === 'Daily' ? '34' : salesReportTab === 'Weekly' ? '198' : salesReportTab === 'Monthly' ? '840' : '4,120', color: 'text-purple-600' },
                  { label: 'Turnover Growth', val: salesReportTab === 'Daily' ? '+4.2%' : salesReportTab === 'Weekly' ? '+6.8%' : salesReportTab === 'Monthly' ? '+12.5%' : '+18.1%', color: 'text-emerald-600' }
                ].map((c, i) => (
                  <div key={i} className="kpi-card border bg-white">
                    <p className="text-[10px] font-bold text-gray-400">{c.label}</p>
                    <p className={`text-lg font-black mt-1 ${c.color}`}>{c.val}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Best Selling Products list */}
                <div className="kpi-card lg:col-span-2 space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Best Selling Crop Supplies</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b bg-slate-50 text-gray-500 font-bold uppercase text-[10px]">
                          <th className="p-2.5">Product Name</th>
                          <th className="p-2.5">Units Sold</th>
                          <th className="p-2.5">Total Revenue</th>
                          <th className="p-2.5 text-right">Growth Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bestSellers.map((item, idx) => (
                          <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/50">
                            <td className="p-2.5 font-bold text-gray-800">{item.name}</td>
                            <td className="p-2.5 font-semibold text-gray-600">{item.sold} bags</td>
                            <td className="p-2.5 font-black text-gray-700">₹{item.revenue.toLocaleString()}</td>
                            <td className="p-2.5 text-right font-bold text-emerald-700">{item.growth}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sales growth chart */}
                <div className="kpi-card bg-white flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-gray-700 uppercase mb-4">Volume Output Analysis</h4>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={[
                      { name: 'Urea', sold: 450 },
                      { name: 'DAP', sold: 310 },
                      { name: 'BT Cotton', sold: 280 },
                      { name: 'Glyphosate', sold: 190 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5"/>
                      <XAxis dataKey="name" tick={{ fontSize: 9 }}/>
                      <YAxis tick={{ fontSize: 9 }}/>
                      <Tooltip/>
                      <Bar name="Bags Sold" dataKey="sold" fill="#236625" radius={[4, 4, 0, 0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. INVENTORY REPORTS ================= */}
          {activeSubItem === 'Inventory Reports' && (
            <div className="space-y-5">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase">Stock Valuation &amp; Movement Logs</h3>
                  <p className="text-xs text-gray-400">Audit warehouse totals, track low stock notifications, and monitor expiration alerts.</p>
                </div>
                <select
                  value={inventoryReportFilter}
                  onChange={e => setInventoryReportFilter(e.target.value)}
                  className="border rounded-lg text-xs px-2.5 py-1.5 bg-white font-bold"
                >
                  <option value="All">All Categories</option>
                  <option>Fertilizers</option>
                  <option>Seeds</option>
                  <option>Pesticides</option>
                </select>
              </div>

              {/* Status Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Low Stock Products', val: lowStockItems.length, color: 'text-amber-600', desc: 'Require reorder placement' },
                  { title: 'Out of Stock items', val: '1 product', color: 'text-red-600', desc: 'Potash Fertilizer currently zero' },
                  { title: 'Valuation Audit', val: '₹6,42,800', color: 'text-[#236625]', desc: 'Total cost of stored warehouse units' }
                ].map((c, i) => (
                  <div key={i} className="kpi-card border bg-white">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{c.title}</p>
                    <p className={`text-lg font-black mt-1 ${c.color}`}>{c.val}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">{c.desc}</p>
                  </div>
                ))}
              </div>

              {/* Tables grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alerts */}
                <div className="kpi-card bg-white space-y-3">
                  <h4 className="text-xs font-bold text-red-700 uppercase">Stock Out / Low Level Warnings</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b bg-red-50/50 text-red-800 font-bold uppercase text-[9px]">
                          <th className="p-2.5">Product</th>
                          <th className="p-2.5">SKU Code</th>
                          <th className="p-2.5">Current Stock</th>
                          <th className="p-2.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lowStockItems.map((item, idx) => (
                          <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                            <td className="p-2.5 font-bold text-gray-800">{item.name}</td>
                            <td className="p-2.5 font-mono text-gray-500">{item.sku}</td>
                            <td className="p-2.5 font-semibold text-gray-700">{item.stock} bags remaining</td>
                            <td className="p-2.5 text-right">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                item.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}>{item.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Expiration reports */}
                <div className="kpi-card bg-white space-y-3">
                  <h4 className="text-xs font-bold text-[#236625] uppercase">Batch Shelf-Life Expiry Tracker</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b bg-emerald-50/50 text-emerald-800 font-bold uppercase text-[9px]">
                          <th className="p-2.5">Product Batch</th>
                          <th className="p-2.5">Batch ID</th>
                          <th className="p-2.5">Expiry Date</th>
                          <th className="p-2.5 text-right">Days Remaining</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportsExpiringItems.map((item, idx) => (
                          <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                            <td className="p-2.5 font-bold text-gray-800">{item.name}</td>
                            <td className="p-2.5 font-mono text-gray-500">{item.batch}</td>
                            <td className="p-2.5 text-gray-600 font-medium">{item.expiry}</td>
                            <td className="p-2.5 text-right font-black text-amber-600">{item.daysLeft} days</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. CUSTOMER REPORTS ================= */}
          {activeSubItem === 'Customer Reports' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Customer Retention &amp; Demographics</h3>
                <p className="text-xs text-gray-400">Review register lists, identify high-spending customer accounts, and audit satisfaction rates.</p>
              </div>

              {/* Loyal list & chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="kpi-card lg:col-span-2 space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Top Loyalty Accounts &amp; Spend Profiles</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b bg-slate-50 text-gray-500 font-bold uppercase text-[9px]">
                          <th className="p-2.5">Farmer Name</th>
                          <th className="p-2.5">Total Orders placed</th>
                          <th className="p-2.5">Total Spend (₹)</th>
                          <th className="p-2.5 text-right">Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topCustomers.map((cust, idx) => (
                          <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                            <td className="p-2.5 font-bold text-gray-800">{cust.name}</td>
                            <td className="p-2.5 font-semibold text-gray-600">{cust.orders} times</td>
                            <td className="p-2.5 font-black text-[#236625]">₹{cust.spending.toLocaleString()}</td>
                            <td className="p-2.5 text-right text-gray-500">{cust.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="kpi-card bg-white flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-700 uppercase">Retention Statistics</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Farmer loyalty rates calculated since store launch.</p>
                  </div>
                  <div className="text-center py-6">
                    <p className="text-3xl font-black text-[#236625]">84.2%</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">Average Customer Retention Rate</p>
                  </div>
                  <div className="border-t pt-2 text-[10px] text-gray-400 leading-relaxed italic">
                    "84% of registered farmers return for seed/fertilizer updates within a 6-month cycle."
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 5. FINANCIAL REPORTS ================= */}
          {activeSubItem === 'Financial Reports' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Profit &amp; Loss Financial Statements</h3>
                <p className="text-xs text-gray-400">Track net profits, cogs margins, operating expenditure, and pending credit (Udhari) accounts.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* P&L Table */}
                <div className="kpi-card lg:col-span-2 space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">P&amp;L Breakdown (Monthly Cycle)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b bg-slate-50 text-gray-500 font-bold uppercase text-[9px]">
                          <th className="p-2.5">Account / Ledger Item</th>
                          <th className="p-2.5 text-right">Debit / Credit Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plStatement.map((row, idx) => (
                          <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                            <td className="p-2.5 font-bold text-gray-800">{row.item}</td>
                            <td className={`p-2.5 text-right font-black ${
                              row.type === 'income' ? 'text-emerald-700' :
                              row.type === 'expense' ? 'text-red-600' : 'text-blue-700'
                            }`}>
                              {row.type === 'income' ? '+' : row.type === 'expense' ? '-' : ''} ₹{row.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Finance indicators */}
                <div className="kpi-card bg-white flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Outstanding Udhari Balance</h4>
                  <div className="text-center py-4">
                    <p className="text-2xl font-black text-amber-600">₹84,300</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">Pending Ledger Collections</p>
                  </div>
                  <div className="space-y-2 border-t pt-3">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-500">Collected this month:</span>
                      <span className="font-bold text-emerald-700">₹45,200</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-500">Default risk margin:</span>
                      <span className="font-bold text-red-500">Low (2.4%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. EMPLOYEE REPORTS ================= */}
          {activeSubItem === 'Employee Reports' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Staff Performance &amp; Attendance Logs</h3>
                <p className="text-xs text-gray-400">Review shift attendance counts, registered leave metrics, and staff performance evaluations.</p>
              </div>

              {/* Employee table */}
              <div className="kpi-card bg-white overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b bg-slate-50 text-gray-500 font-bold uppercase text-[9px]">
                      <th className="p-3">Staff Name</th>
                      <th className="p-3">Designation / Role</th>
                      <th className="p-3">Present Days (Monthly)</th>
                      <th className="p-3">Leaves Taken</th>
                      <th className="p-3 text-right">Performance Index</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeAttendanceData.map((emp, idx) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                        <td className="p-3 font-bold text-gray-800">{emp.name}</td>
                        <td className="p-3 text-gray-500 font-medium">{emp.role}</td>
                        <td className="p-3 font-semibold text-gray-700">{emp.present} / 26 days</td>
                        <td className="p-3 text-red-600 font-bold">{emp.leaves} days</td>
                        <td className="p-3 text-right font-black text-[#236625]">{emp.performance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 7. DELIVERY REPORTS ================= */}
          {activeSubItem === 'Delivery Reports' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Logistics &amp; Fulfillment Summaries</h3>
                <p className="text-xs text-gray-400">Analyze delivery success rates, rider speed performance, and failed fulfillment attempts.</p>
              </div>

              {/* Rider Performance stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="kpi-card lg:col-span-2 space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Rider Fulfillment Audits</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b bg-slate-50 text-gray-500 font-bold uppercase text-[9px]">
                          <th className="p-2.5">Rider Name</th>
                          <th className="p-2.5">Completed Trips</th>
                          <th className="p-2.5">Failed Trips</th>
                          <th className="p-2.5">Success Rate</th>
                          <th className="p-2.5 text-right">Average ETA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveryRiderReports.map((rider, idx) => (
                          <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                            <td className="p-2.5 font-bold text-gray-800">{rider.name}</td>
                            <td className="p-2.5 font-semibold text-gray-600">{rider.completed} deliveries</td>
                            <td className="p-2.5 text-red-600 font-bold">{rider.failed}</td>
                            <td className="p-2.5 text-emerald-700 font-black">{rider.successRate}</td>
                            <td className="p-2.5 text-right text-gray-500 font-medium">{rider.avgTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="kpi-card bg-white flex flex-col justify-between text-center">
                  <h4 className="text-xs font-bold text-gray-750 uppercase text-left">Fulfillment Efficiency</h4>
                  <div className="py-6">
                    <p className="text-3xl font-black text-[#236625]">97.8%</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">Average Delivery Success Rate</p>
                  </div>
                  <p className="text-[9px] text-gray-455 italic leading-relaxed">
                    "Calculated out of 270 total store dispatches during the active month."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= 8. PRODUCT PERFORMANCE REPORTS ================= */}
          {activeSubItem === 'Product Performance' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Product Yield &amp; Category Sales Performance</h3>
                <p className="text-xs text-gray-400">Track best and worst selling inventory products, profit margins by SKU, and category contributions.</p>
              </div>

              {/* Best vs Least seller list */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="kpi-card lg:col-span-2 space-y-4 bg-white">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Top Performers vs Underperforming SKUs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Top Sellers */}
                    <div className="border rounded-xl p-3 bg-emerald-50/10 space-y-2">
                      <span className="text-[9px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Top Sellers</span>
                      <div className="space-y-1.5 text-xs pt-1.5">
                        <div className="flex justify-between font-medium"><span>Urea Fertilizer 50kg</span><span className="font-bold text-emerald-800">450 sold</span></div>
                        <div className="flex justify-between font-medium"><span>BT Cotton Seeds</span><span className="font-bold text-emerald-800">280 sold</span></div>
                      </div>
                    </div>

                    {/* Least Sellers */}
                    <div className="border rounded-xl p-3 bg-red-50/10 space-y-2">
                      <span className="text-[9px] font-bold uppercase text-red-800 bg-red-50 px-2 py-0.5 rounded">Slow Moving SKUs</span>
                      <div className="space-y-1.5 text-xs pt-1.5">
                        <div className="flex justify-between font-medium"><span>Bio-Fertilizer Extract 250ml</span><span className="font-bold text-red-700">12 sold</span></div>
                        <div className="flex justify-between font-medium"><span>Garden Spade Tool V2</span><span className="font-bold text-red-700">8 sold</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="kpi-card bg-white flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Margin Contributor</h4>
                  <div className="text-center py-4">
                    <p className="text-2xl font-black text-emerald-800">Seeds Category</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">Generates 38% of overall gross profits</p>
                  </div>
                  <div className="border-t pt-2 text-[9px] text-gray-400 text-center leading-relaxed">
                    Pricing adjustments: Seed discount programs launched in May helped increase sales by 12%.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 9. AGRI ANALYTICS ================= */}
          {activeSubItem === 'Agri Analytics' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Farmer Intelligence &amp; Crop Advisory Reports</h3>
                <p className="text-xs text-gray-400">Track soil analysis predictions, disease scan metrics, and agricultural advisory logs.</p>
              </div>

              {/* Agri table and charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="kpi-card lg:col-span-2 space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">AI Recommendation Audits</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b bg-slate-50 text-gray-500 font-bold uppercase text-[9px]">
                          <th className="p-2.5">Advisory Query / Scan Type</th>
                          <th className="p-2.5">Calculated Run Count</th>
                          <th className="p-2.5 text-right">Prediction Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agriAIReports.map((report, idx) => (
                          <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                            <td className="p-2.5 font-bold text-gray-800">{report.type}</td>
                            <td className="p-2.5 font-semibold text-gray-600">{report.count} scans run</td>
                            <td className="p-2.5 text-right font-black text-[#236625]">{report.accuracy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="kpi-card bg-white flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-gray-750 uppercase">Active Yield Predictions</h4>
                  <div className="text-center py-4">
                    <p className="text-2xl font-black text-emerald-800">+18%</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">Average Yield Forecast Increase</p>
                  </div>
                  <p className="text-[9px] text-gray-450 italic leading-relaxed text-center">
                    Based on 140 sugarcane and cotton fields implementing personalized crop cycles.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= 10. CUSTOM REPORT BUILDER ================= */}
          {activeSubItem === 'Custom Builder' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Custom Business Report Constructor</h3>
                <p className="text-xs text-gray-400">Select target schemas, configure date horizons, filter parameters, and instantly generate reports.</p>
              </div>

              {/* Form and Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Controls */}
                <div className="kpi-card bg-white space-y-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Builder Parameters</h4>
                  
                  {/* Select Report Type */}
                  <div className="space-y-1.5 text-xs">
                    <label className="block font-bold text-gray-500 uppercase">Report Type</label>
                    <select
                      value={customReportType}
                      onChange={e => setCustomReportType(e.target.value)}
                      className="w-full border rounded-lg px-2.5 py-2 bg-white outline-none font-semibold text-gray-700"
                    >
                      <option>Sales</option>
                      <option>Inventory</option>
                      <option>Finance</option>
                      <option>Employee</option>
                    </select>
                  </div>

                  {/* Date Pickers */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1">
                      <label className="block font-bold text-gray-500 uppercase">Start Date</label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={e => setCustomStartDate(e.target.value)}
                        className="w-full border rounded-lg px-2 py-1.5 outline-none font-medium text-gray-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-gray-500 uppercase">End Date</label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={e => setCustomEndDate(e.target.value)}
                        className="w-full border rounded-lg px-2 py-1.5 outline-none font-medium text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Select Metrics */}
                  <div className="space-y-2 text-xs">
                    <label className="block font-bold text-gray-500 uppercase">Target Metrics</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(selectedMetrics).map(key => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer font-medium text-gray-600">
                          <input
                            type="checkbox"
                            checked={selectedMetrics[key]}
                            onChange={e => setSelectedMetrics(prev => ({ ...prev, [key]: e.target.checked }))}
                            className="rounded border-gray-300 text-[#236625] focus:ring-[#236625]"
                          />
                          <span className="capitalize">{key}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="space-y-1.5 text-xs">
                    <label className="block font-bold text-gray-500 uppercase">Product Category Filter</label>
                    <select
                      value={builderFilters.category}
                      onChange={e => setBuilderFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border rounded-lg px-2 py-1.5 bg-white outline-none font-medium text-gray-600"
                    >
                      <option>All</option>
                      <option>Fertilizers</option>
                      <option>Seeds</option>
                      <option>Pesticides</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      const randId = `REP-${Math.floor(100 + Math.random() * 900)}`;
                      const newRep = {
                        id: randId,
                        type: `${customReportType} Report`,
                        generatedBy: 'Dilip Patil',
                        date: new Date().toISOString().split('T')[0],
                        size: '85 KB',
                        format: 'PDF'
                      };
                      setRecentReports(prev => [newRep, ...prev]);
                      setPreviewReport({
                        id: randId,
                        type: customReportType,
                        range: `${customStartDate} to ${customEndDate}`,
                        metrics: Object.keys(selectedMetrics).filter(k => selectedMetrics[k]),
                        category: builderFilters.category
                      });
                      toast.success(`Custom Report ${randId} successfully generated!`);
                    }}
                    className="w-full btn-primary py-2.5 font-bold uppercase text-xs"
                  >
                    Generate Report
                  </button>
                </div>

                {/* Preview Window */}
                <div className="lg:col-span-2 kpi-card bg-white flex flex-col justify-between min-h-[300px]">
                  {previewReport ? (
                    <div className="space-y-4 text-xs flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="border-b pb-2 flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-gray-800 text-sm">{previewReport.type} Custom Report</h4>
                            <p className="text-[10px] text-gray-450 mt-0.5">Parameters: {previewReport.range} | Category: {previewReport.category}</p>
                          </div>
                          <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{previewReport.id}</span>
                        </div>

                        {/* Generated dummy columns */}
                        <div className="overflow-x-auto border rounded-xl">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b bg-slate-50 text-[10px] font-bold text-gray-400 uppercase">
                                <th className="p-2.5">Date Period</th>
                                {previewReport.metrics.map(metric => (
                                  <th key={metric} className="p-2.5 capitalize">{metric}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { date: 'May 01 - May 10', rev: '₹1,50,000', ord: '230', cust: '45', prof: '₹34,000', exp: '₹1,16,000', tax: '₹4,500' },
                                { date: 'May 11 - May 20', rev: '₹1,85,000', ord: '290', cust: '52', prof: '₹42,000', exp: '₹1,43,000', tax: '₹5,200' },
                                { date: 'May 21 - May 30', rev: '₹1,54,000', ord: '320', cust: '60', prof: '₹47,500', exp: '₹1,06,500', tax: '₹8,800' }
                              ].map((row, rIdx) => (
                                <tr key={rIdx} className="border-b last:border-0 hover:bg-slate-50/50">
                                  <td className="p-2.5 font-bold text-gray-800">{row.date}</td>
                                  {previewReport.metrics.includes('revenue') && <td className="p-2.5 text-emerald-800 font-bold">{row.rev}</td>}
                                  {previewReport.metrics.includes('orders') && <td className="p-2.5 font-medium">{row.ord} orders</td>}
                                  {previewReport.metrics.includes('customers') && <td className="p-2.5 font-medium">{row.cust} farmers</td>}
                                  {previewReport.metrics.includes('profit') && <td className="p-2.5 font-black text-emerald-700">{row.prof}</td>}
                                  {previewReport.metrics.includes('expenses') && <td className="p-2.5 font-medium text-red-600">{row.exp}</td>}
                                  {previewReport.metrics.includes('tax') && <td className="p-2.5 font-medium text-gray-500">{row.tax}</td>}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t pt-3">
                        <button
                          onClick={() => toast.success('Downloading generated custom report as CSV...')}
                          className="flex-1 btn-secondary py-2 font-bold uppercase text-[10px]"
                        >
                          Download CSV
                        </button>
                        <button
                          onClick={() => toast.success('Exporting custom document layout as Excel spreadsheet...')}
                          className="flex-1 btn-secondary py-2 font-bold uppercase text-[10px]"
                        >
                          Download Excel
                        </button>
                        <button
                          onClick={() => toast.success('Publishing generated PDF to administrative archives...')}
                          className="flex-1 btn-primary py-2 font-bold uppercase text-[10px]"
                        >
                          Print / Export PDF
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400 border border-dashed rounded-xl bg-slate-50/50 flex-1 flex flex-col items-center justify-center">
                      <FileText size={32} className="mx-auto mb-2 opacity-50 text-[#236625]"/>
                      <p className="text-xs font-semibold">Define builder options and click 'Generate Report' to visualize details.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= 11. RECENT REPORTS ================= */}
          {activeSubItem === 'Recent Reports' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Recent Reports Registry</h3>
                <p className="text-xs text-gray-400">Inspect historical print logs, download files, or clean audit records.</p>
              </div>

              {/* Reports list */}
              <div className="kpi-card bg-white overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b bg-slate-50 text-gray-500 font-bold uppercase text-[9px]">
                      <th className="p-3">Report ID</th>
                      <th className="p-3">Report Type</th>
                      <th className="p-3">Generated By</th>
                      <th className="p-3">Creation Date</th>
                      <th className="p-3">File Size</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((rep, idx) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                        <td className="p-3 font-mono font-bold text-emerald-800">{rep.id}</td>
                        <td className="p-3 font-bold text-gray-800">{rep.type}</td>
                        <td className="p-3 text-gray-600 font-medium">{rep.generatedBy}</td>
                        <td className="p-3 text-gray-550 font-medium font-mono">{rep.date}</td>
                        <td className="p-3 text-gray-400 font-mono font-bold">{rep.size} ({rep.format})</td>
                        <td className="p-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => toast.success(`Launching audit preview for ${rep.id}...`)}
                              className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded"
                            >
                              View
                            </button>
                            <button
                              onClick={() => toast.success(`Downloading ${rep.id} (${rep.format})...`)}
                              className="text-[10px] font-bold text-white bg-[#236625] px-2 py-0.5 rounded"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => {
                                setRecentReports(prev => prev.filter(x => x.id !== rep.id));
                                toast.error(`Report ${rep.id} removed from system.`);
                              }}
                              className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      ) : activeCategory === 'Settings' ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: 'Poppins,sans-serif' }}>System Settings &amp; Configurations</h2>
              <p className="text-xs text-gray-400">Configure roles, permissions, security protocols, backup policies, printers, taxes, and system variables.</p>
            </div>
          </div>

          {/* ================= 1. OVERVIEW SCREEN ================= */}
          {!['Role Permissions', 'Notification Settings', 'Security Settings', 'Backup Settings', 'System Preferences', 'Shop Appearance', 'Printer Settings', 'Tax Settings', 'Audit Logs', 'System Health'].includes(activeSubItem) && (
            <div className="space-y-6">
              {/* Dashboard Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Shop Status', val: 'Active / Open', color: 'text-emerald-700 bg-emerald-50/50' },
                  { label: 'Active Users', val: '14 Users', color: 'text-gray-850 bg-white' },
                  { label: 'Security Score', val: '92 / 100', color: 'text-blue-600 bg-blue-50/50' },
                  { label: 'Notification Status', val: '3 Active Channels', color: 'text-purple-600 bg-purple-50/50' },
                  { label: 'Backup Status', val: 'Healthy', color: 'text-amber-600 bg-amber-50/50' },
                  { label: 'System Health', val: '100% Online', color: 'text-emerald-700 bg-emerald-50/30' }
                ].map((c, i) => (
                  <div key={i} className="kpi-card border bg-white">
                    <p className="text-[10px] font-bold text-gray-400">{c.label}</p>
                    <p className={`text-sm font-black mt-1.5 ${c.color.split(' ')[0]}`}>{c.val}</p>
                  </div>
                ))}
              </div>

              {/* Status breakdown details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="kpi-card bg-white lg:col-span-2 space-y-3">
                  <h3 className="text-xs font-bold text-gray-700 uppercase">Executive Security Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="border rounded-xl p-3 bg-blue-50/10 space-y-1">
                      <span className="text-[9px] font-bold text-blue-800 uppercase bg-blue-50 px-2 py-0.5 rounded">Two-Factor Authentication</span>
                      <p className="text-gray-800 font-semibold pt-1">Status: Disabled</p>
                      <p className="text-[9px] text-gray-400">Enable 2FA under Security settings to increase score.</p>
                    </div>
                    <div className="border rounded-xl p-3 bg-emerald-50/10 space-y-1">
                      <span className="text-[9px] font-bold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded">Last Database Backup</span>
                      <p className="text-gray-800 font-semibold pt-1">Status: Scheduled Completed</p>
                      <p className="text-[9px] text-gray-400">Snapshot saved 14 hours ago (42.8 MB).</p>
                    </div>
                  </div>
                </div>

                <div className="kpi-card bg-white flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-gray-700 uppercase">Active Preferences</h3>
                  <div className="space-y-1.5 text-xs pt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Store Currency:</span>
                      <span className="font-bold text-gray-700">{sysPrefs.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Standard Time:</span>
                      <span className="font-bold text-gray-700">GMT +5:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Measurement System:</span>
                      <span className="font-bold text-gray-700">Metric (kg)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. ROLE PERMISSIONS ================= */}
          {activeSubItem === 'Role Permissions' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Role Templates', val: Object.keys(rolePermissionsMatrix).length, color: 'text-gray-800', bg: 'bg-white' },
                  { label: 'Custom Overrides', val: `${Object.keys(employeeOverrides).length} Staff Profiles`, color: 'text-[#236625]', bg: 'bg-emerald-50/50' },
                  { label: 'Global Admin Override', val: 'Full Control', color: 'text-blue-600', bg: 'bg-blue-50/50' },
                  { label: 'Avg Security Index', val: '94%', color: 'text-purple-600', bg: 'bg-purple-50/50' }
                ].map((card, idx) => (
                  <div key={idx} className={`kpi-card border ${card.bg}`}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{card.label}</p>
                    <p className={`text-base font-black mt-1 ${card.color}`}>{card.val}</p>
                  </div>
                ))}
              </div>

              {/* Mode Switcher */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setPermissionsTabMode('templates')}
                  className={`py-2 px-4 text-xs font-bold border-b-2 transition-all ${
                    permissionsTabMode === 'templates' ? 'border-[#236625] text-emerald-800 font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-650'
                  }`}
                >
                  Configure Role Templates
                </button>
                <button
                  onClick={() => setPermissionsTabMode('overrides')}
                  className={`py-2 px-4 text-xs font-bold border-b-2 transition-all ${
                    permissionsTabMode === 'overrides' ? 'border-[#236625] text-emerald-800 font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-650'
                  }`}
                >
                  Custom Employee Overrides
                </button>
              </div>

              {/* MODE 1: ROLE TEMPLATES */}
              {permissionsTabMode === 'templates' && (
                <div className="space-y-5">
                  <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 uppercase">Role-Based Access Templates</h3>
                      <p className="text-xs text-gray-400">Configure standard privileges that automatically apply to all staff holding this role.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Role Template:</label>
                      <select
                        value={selectedPermissionsRole}
                        onChange={e => setSelectedPermissionsRole(e.target.value)}
                        className="border rounded-lg text-xs px-2.5 py-1.5 bg-white font-bold text-gray-700 outline-none"
                      >
                        {Object.keys(rolePermissionsMatrix).map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="kpi-card bg-white space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-xs font-bold text-gray-700">Module Toggles for: <span className="text-emerald-800 font-black">{selectedPermissionsRole}</span></span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const updated = {};
                            granularPermissionsList.forEach(p => { updated[p.key] = true; });
                            setRolePermissionsMatrix(prev => ({ ...prev, [selectedPermissionsRole]: updated }));
                            toast.success(`Granted all 34 privileges to ${selectedPermissionsRole}.`);
                          }}
                          className="text-[9px] font-bold text-[#236625] bg-emerald-50 px-2 py-1 rounded"
                        >
                          Grant All
                        </button>
                        <button
                          onClick={() => {
                            const updated = {};
                            granularPermissionsList.forEach(p => { updated[p.key] = false; });
                            setRolePermissionsMatrix(prev => ({ ...prev, [selectedPermissionsRole]: updated }));
                            toast.error(`Revoked all permissions for ${selectedPermissionsRole}.`);
                          }}
                          className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded"
                        >
                          Revoke All
                        </button>
                        <button
                          onClick={() => {
                            const copyTarget = prompt('Enter role name to clone current matrix into (e.g. Warehouse Staff):');
                            if (copyTarget && rolePermissionsMatrix[copyTarget] !== undefined) {
                              setRolePermissionsMatrix(prev => ({
                                ...prev,
                                [copyTarget]: { ...prev[selectedPermissionsRole] }
                              }));
                              toast.success(`Cloned ${selectedPermissionsRole} permissions to ${copyTarget}!`);
                            } else if (copyTarget) {
                              toast.error(`Role name "${copyTarget}" is invalid.`);
                            }
                          }}
                          className="text-[9px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded"
                        >
                          Clone Matrix
                        </button>
                      </div>
                    </div>

                    {/* Accordion Grouping */}
                    <div className="space-y-4">
                      {['System', 'Core Operations', 'Inventory & Sales', 'HR & Staff', 'Logistics', 'Finance & Support'].map(grpName => {
                        const items = granularPermissionsList.filter(p => p.group === grpName);
                        return (
                          <div key={grpName} className="border rounded-xl p-4 bg-slate-50/20 space-y-3">
                            <h4 className="text-xs font-black text-[#236625] uppercase tracking-wider">{grpName} Category</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {items.map(p => (
                                <label key={p.key} className="border bg-white rounded-lg p-2.5 flex justify-between items-center text-xs cursor-pointer hover:border-emerald-500 transition-all">
                                  <span className="font-semibold text-gray-700">{p.label}</span>
                                  <input
                                    type="checkbox"
                                    checked={!!rolePermissionsMatrix[selectedPermissionsRole][p.key]}
                                    onChange={e => {
                                      const checked = e.target.checked;
                                      setRolePermissionsMatrix(prev => ({
                                        ...prev,
                                        [selectedPermissionsRole]: {
                                          ...prev[selectedPermissionsRole],
                                          [p.key]: checked
                                        }
                                      }));
                                    }}
                                    className="rounded text-[#236625] focus:ring-[#236625] w-4.5 h-4.5 cursor-pointer"
                                  />
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: CUSTOM EMPLOYEE OVERRIDES */}
              {permissionsTabMode === 'overrides' && (
                <div className="space-y-5">
                  <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 uppercase">Individual Employee Overrides</h3>
                      <p className="text-xs text-gray-400">Add exemptions and custom capabilities directly to a specific user account.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Select Employee Profile:</label>
                      <select
                        value={selectedOverrideEmployee}
                        onChange={e => setSelectedOverrideEmployee(e.target.value)}
                        className="border rounded-lg text-xs px-2.5 py-1.5 bg-white font-bold text-gray-700 outline-none"
                      >
                        {['Raju Pawar', 'Sunita Desai', 'Seema Kulkarni'].map(emp => (
                          <option key={emp} value={emp}>{emp}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="kpi-card bg-white space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <span className="text-xs font-bold text-gray-700">Custom Permissions for: <span className="text-emerald-800 font-black">{selectedOverrideEmployee}</span></span>
                        <p className="text-[10px] text-gray-450 mt-0.5">Base Role: {selectedOverrideEmployee === 'Raju Pawar' ? 'Support Agent' : selectedOverrideEmployee === 'Sunita Desai' ? 'Billing Operator' : 'Inventory Representative'}</p>
                      </div>
                      <button
                        onClick={() => {
                          setEmployeeOverrides(prev => {
                            const next = { ...prev };
                            delete next[selectedOverrideEmployee];
                            return next;
                          });
                          toast.error(`Cleared all custom overrides for ${selectedOverrideEmployee}.`);
                        }}
                        className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded"
                      >
                        Clear Overrides
                      </button>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-gray-600">Select Specific Permissions to Explicitly Grant:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {granularPermissionsList.map(p => {
                          const isOverridden = !!(employeeOverrides[selectedOverrideEmployee] && employeeOverrides[selectedOverrideEmployee][p.key]);
                          return (
                            <label key={p.key} className={`border rounded-lg p-2.5 flex justify-between items-center text-xs cursor-pointer transition-all hover:border-emerald-500 ${
                              isOverridden ? 'border-emerald-500 bg-emerald-50/20' : 'bg-white'
                            }`}>
                              <div>
                                <span className="font-semibold text-gray-700 block">{p.label}</span>
                                <span className="text-[9px] text-gray-400">{p.group}</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={isOverridden}
                                onChange={e => {
                                  const checked = e.target.checked;
                                  setEmployeeOverrides(prev => {
                                    const next = { ...prev };
                                    if (!next[selectedOverrideEmployee]) {
                                      next[selectedOverrideEmployee] = {};
                                    }
                                    if (checked) {
                                      next[selectedOverrideEmployee][p.key] = true;
                                    } else {
                                      delete next[selectedOverrideEmployee][p.key];
                                      if (Object.keys(next[selectedOverrideEmployee]).length === 0) {
                                        delete next[selectedOverrideEmployee];
                                      }
                                    }
                                    return next;
                                  });
                                  toast.success(`Custom override "${p.label}" updated for ${selectedOverrideEmployee}.`);
                                }}
                                className="rounded text-[#236625] focus:ring-[#236625] w-4.5 h-4.5 cursor-pointer"
                              />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 3. NOTIFICATION SETTINGS ================= */}
          {activeSubItem === 'Notification Settings' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Notification Subscriptions</h3>
                <p className="text-xs text-gray-400">Enable transmission channels for alerts, order confirmations, and warehouse warnings.</p>
              </div>

              <div className="kpi-card bg-white space-y-4">
                <div className="border-b pb-3">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Delivery Communication Channels</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {[
                      { key: 'inApp', label: 'In-App Alerts' },
                      { key: 'email', label: 'Email Notices' },
                      { key: 'sms', label: 'Direct SMS' },
                      { key: 'whatsapp', label: 'WhatsApp Alerts' }
                    ].map(ch => (
                      <label key={ch.key} className="border rounded-xl p-3 flex justify-between items-center cursor-pointer text-xs bg-slate-50/50">
                        <span className="font-semibold text-gray-800">{ch.label}</span>
                        <input
                          type="checkbox"
                          checked={notificationPreferences.channels[ch.key]}
                          onChange={e => {
                            const val = e.target.checked;
                            setNotificationPreferences(prev => ({
                              ...prev,
                              channels: { ...prev.channels, [ch.key]: val }
                            }));
                            toast.success(`Notification channel ${ch.label} updated.`);
                          }}
                          className="rounded text-[#236625] focus:ring-[#236625]"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Event rules */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Event Trigger Configuration</h4>
                  <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b bg-slate-50 text-[10px] font-bold text-gray-400 uppercase">
                          <th className="p-2.5">Alert Event</th>
                          <th className="p-2.5">In-App</th>
                          <th className="p-2.5">Email</th>
                          <th className="p-2.5">SMS</th>
                          <th className="p-2.5">WhatsApp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(notificationPreferences.events).map(ev => (
                          <tr key={ev} className="border-b last:border-0 hover:bg-slate-50/30">
                            <td className="p-2.5 font-bold text-gray-800 capitalize">{ev.replace(/([A-Z])/g, ' $1')}</td>
                            {['inApp', 'email', 'sms', 'whatsapp'].map(ch => (
                              <td key={ch} className="p-2.5">
                                <input
                                  type="checkbox"
                                  checked={notificationPreferences.events[ev][ch]}
                                  onChange={e => {
                                    const val = e.target.checked;
                                    setNotificationPreferences(prev => ({
                                      ...prev,
                                      events: {
                                        ...prev.events,
                                        [ev]: { ...prev.events[ev], [ch]: val }
                                      }
                                    }));
                                  }}
                                  className="rounded text-[#236625] focus:ring-[#236625] cursor-pointer"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. SECURITY SETTINGS ================= */}
          {activeSubItem === 'Security Settings' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Security Center &amp; Access Controls</h3>
                <p className="text-xs text-gray-400">Review credential logs, change administrative pass-keys, and toggle 2FA guards.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Change Password Form */}
                <div className="kpi-card bg-white space-y-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Change Security Password</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Current Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={changePasswordForm.current}
                        onChange={e => setChangePasswordForm(prev => ({ ...prev, current: e.target.value }))}
                        className="w-full border rounded-lg px-3 py-2 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={changePasswordForm.new}
                        onChange={e => setChangePasswordForm(prev => ({ ...prev, new: e.target.value }))}
                        className="w-full border rounded-lg px-3 py-2 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={changePasswordForm.confirm}
                        onChange={e => setChangePasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                        className="w-full border rounded-lg px-3 py-2 outline-none font-mono"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!changePasswordForm.current || !changePasswordForm.new || !changePasswordForm.confirm) {
                          toast.error('Please fill in all password fields.');
                          return;
                        }
                        if (changePasswordForm.new !== changePasswordForm.confirm) {
                          toast.error('Confirm password does not match.');
                          return;
                        }
                        toast.success('System administrative password updated successfully!');
                        setChangePasswordForm({ current: '', new: '', confirm: '' });
                      }}
                      className="w-full btn-primary py-2.5 font-bold uppercase text-xs"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Session monitoring & 2FA */}
                <div className="lg:col-span-2 kpi-card bg-white space-y-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Access Protections &amp; Session Logs</h4>
                  
                  {/* Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-3">
                    <label className="border rounded-xl p-3 flex justify-between items-center cursor-pointer text-xs bg-slate-50/30">
                      <div>
                        <span className="block font-bold text-gray-800">Two-Factor Authentication (2FA)</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Prompt mobile OTP during login.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={enable2fa}
                        onChange={e => {
                          setEnable2fa(e.target.checked);
                          toast.success(e.target.checked ? '2FA enforcement activated!' : '2FA enforcement deactivated.');
                        }}
                        className="rounded text-[#236625] focus:ring-[#236625]"
                      />
                    </label>

                    <label className="border rounded-xl p-3 flex justify-between items-center cursor-pointer text-xs bg-slate-50/30">
                      <div>
                        <span className="block font-bold text-gray-800">Unrecognized Login Alerts</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Send alerts for new devices.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={loginAlerts}
                        onChange={e => {
                          setLoginAlerts(e.target.checked);
                          toast.success('Unrecognized device log notifications updated.');
                        }}
                        className="rounded text-[#236625] focus:ring-[#236625]"
                      />
                    </label>
                  </div>

                  {/* Active devices table */}
                  <div className="space-y-2 text-xs">
                    <h5 className="font-bold text-gray-600">Active Authorized Terminal Sessions</h5>
                    <div className="border rounded-xl overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b bg-slate-50 text-[10px] font-bold text-gray-400 uppercase">
                            <th className="p-2.5">User Terminal / Device</th>
                            <th className="p-2.5">IP Address</th>
                            <th className="p-2.5">Connection State</th>
                            <th className="p-2.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeDevices.map((d, i) => (
                            <tr key={i} className="border-b last:border-0 hover:bg-slate-50/30">
                              <td className="p-2.5 font-bold text-gray-800">{d.device}</td>
                              <td className="p-2.5 font-mono text-gray-500">{d.ip}</td>
                              <td className="p-2.5 font-medium text-emerald-800">{d.active}</td>
                              <td className="p-2.5 text-right">
                                {i !== 0 ? (
                                  <button
                                    onClick={() => {
                                      setActiveDevices(prev => prev.filter((_, idx) => idx !== i));
                                      toast.success('Device session terminated.');
                                    }}
                                    className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded"
                                  >
                                    Force Log Out
                                  </button>
                                ) : (
                                  <span className="text-[9px] font-semibold text-gray-400">Current</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 5. BACKUP SETTINGS ================= */}
          {activeSubItem === 'Backup Settings' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Database Backups &amp; Archive Registers</h3>
                <p className="text-xs text-gray-400">Inspect historical backup records, create immediate snapshots, and run system restore processes.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Backup triggers */}
                <div className="kpi-card bg-white space-y-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Backup Operations</h4>
                  <div className="space-y-2 text-xs">
                    <button
                      onClick={() => {
                        const newB = {
                          date: new Date().toISOString().replace('T', ' ').slice(0, 19),
                          size: '42.9 MB',
                          status: 'Completed',
                          type: 'Manual'
                        };
                        setBackupHistory(prev => [newB, ...prev]);
                        toast.success('Full database snapshot written successfully!');
                      }}
                      className="w-full btn-primary py-2.5 font-bold uppercase text-xs"
                    >
                      Backup Database Now
                    </button>
                    <button
                      onClick={() => {
                        toast.success('Scheduled automatic backups every 24 hours at 02:00 AM.');
                      }}
                      className="w-full btn-secondary py-2.5 font-bold uppercase text-xs"
                    >
                      Configure Scheduler
                    </button>
                  </div>
                </div>

                {/* History table */}
                <div className="lg:col-span-2 kpi-card bg-white space-y-3">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Historical Database Snapshots</h4>
                  <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b bg-slate-50 text-[10px] font-bold text-gray-400 uppercase">
                          <th className="p-2.5">Snapshot timestamp</th>
                          <th className="p-2.5">Archive Size</th>
                          <th className="p-2.5">Trigger Class</th>
                          <th className="p-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {backupHistory.map((b, i) => (
                          <tr key={i} className="border-b last:border-0 hover:bg-slate-50/30">
                            <td className="p-2.5 font-bold text-gray-800 font-mono">{b.date}</td>
                            <td className="p-2.5 font-semibold text-gray-600 font-mono">{b.size}</td>
                            <td className="p-2.5 text-gray-500 font-medium">{b.type}</td>
                            <td className="p-2.5 text-right flex gap-1 justify-end">
                              <button
                                onClick={() => toast.success(`Restoring database to checkpoint ${b.date}...`)}
                                className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded"
                              >
                                Restore
                              </button>
                              <button
                                onClick={() => toast.success(`Downloading backup archive file...`)}
                                className="text-[9px] font-bold text-white bg-[#236625] px-2 py-0.5 rounded"
                              >
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. SYSTEM PREFERENCES ================= */}
          {activeSubItem === 'System Preferences' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Business Preferences Settings</h3>
                <p className="text-xs text-gray-400">Configure currency notations, primary translation dictionaries, date layouts, and measurement variables.</p>
              </div>

              <div className="kpi-card bg-white max-w-xl space-y-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase">System Parameters</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Shop Currency</label>
                    <select
                      value={sysPrefs.currency}
                      onChange={e => setSysPrefs(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full border rounded-lg px-2.5 py-2 bg-white outline-none font-medium"
                    >
                      <option>₹ INR</option>
                      <option>$ USD</option>
                      <option>€ EUR</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Default Language</label>
                    <select
                      value={sysPrefs.language}
                      onChange={e => setSysPrefs(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full border rounded-lg px-2.5 py-2 bg-white outline-none font-medium"
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Marathi</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Standard Date Format</label>
                    <select
                      value={sysPrefs.dateFormat}
                      onChange={e => setSysPrefs(prev => ({ ...prev, dateFormat: e.target.value }))}
                      className="w-full border rounded-lg px-2.5 py-2 bg-white outline-none font-medium"
                    >
                      <option>DD-MM-YYYY</option>
                      <option>YYYY-MM-DD</option>
                      <option>MM-DD-YYYY</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Measurement Standard</label>
                    <select
                      value={sysPrefs.units}
                      onChange={e => setSysPrefs(prev => ({ ...prev, units: e.target.value }))}
                      className="w-full border rounded-lg px-2.5 py-2 bg-white outline-none font-medium"
                    >
                      <option>Metric (kg, Litre)</option>
                      <option>Imperial (lbs, Gallon)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t text-xs">
                  <button
                    onClick={() => {
                      toast.success('System preferences saved successfully!');
                    }}
                    className="flex-1 btn-primary py-2.5 font-bold uppercase"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={() => {
                      setSysPrefs({
                        currency: '₹ INR',
                        timeZone: 'IST (UTC+05:30)',
                        dateFormat: 'DD-MM-YYYY',
                        language: 'English',
                        units: 'Metric (kg, Litre)'
                      });
                      toast.error('Preferences reset to default values.');
                    }}
                    className="btn-secondary px-6 py-2.5 font-bold"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= 7. SHOP APPEARANCE ================= */}
          {activeSubItem === 'Shop Appearance' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Shop Appearance &amp; Brand Aesthetics</h3>
                <p className="text-xs text-gray-400">Configure public profiles layout, upload brand logos, and select client theme layouts.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customizer */}
                <div className="kpi-card bg-white space-y-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Design Customizations</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Upload Shop Logo (URL)</label>
                      <input
                        type="text"
                        value={appearanceLogo}
                        onChange={e => setAppearanceLogo(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-gray-500 uppercase">Primary Theme Color</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={appearanceThemeColor}
                          onChange={e => setAppearanceThemeColor(e.target.value)}
                          className="w-8 h-8 rounded border cursor-pointer bg-transparent"
                        />
                        <span className="font-mono text-gray-700 font-bold">{appearanceThemeColor}</span>
                      </div>
                    </div>

                    <label className="border rounded-xl p-3 flex justify-between items-center cursor-pointer bg-slate-50/50 mt-1">
                      <div>
                        <span className="block font-bold text-gray-800">Simulated Dark Mode</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Toggle admin interface contrast.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={appearanceDarkMode}
                        onChange={e => {
                          setAppearanceDarkMode(e.target.checked);
                          toast.success(`Dark mode ${e.target.checked ? 'activated' : 'deactivated'}.`);
                        }}
                        className="rounded text-[#236625] focus:ring-[#236625]"
                      />
                    </label>

                    <button
                      onClick={() => {
                        toast.success('Shop appearance configurations saved successfully!');
                      }}
                      className="w-full btn-primary py-2.5 font-bold uppercase text-xs"
                    >
                      Save Configurations
                    </button>
                  </div>
                </div>

                {/* Preview Frame */}
                <div className="lg:col-span-2 kpi-card bg-white flex flex-col justify-between border">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Simulated Client Portal Preview</h4>
                  <div className="border rounded-xl p-6 bg-slate-50/50 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <img
                      src={appearanceLogo}
                      alt="Brand Logo"
                      className="w-16 h-16 rounded-full border border-gray-200 shadow-sm"
                    />
                    <div>
                      <h5 className="font-black text-gray-800 text-sm">KrishiCare Agro-Services Ltd.</h5>
                      <p className="text-xs text-gray-400 mt-0.5">Shop Terminal Branch ID: KCS-IND-412</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-1.5 rounded-lg text-white font-bold text-xs" style={{ backgroundColor: appearanceThemeColor }}>
                        Primary Button
                      </button>
                      <button className="px-4 py-1.5 rounded-lg border bg-white font-bold text-xs text-gray-500">
                        Cancel Button
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 8. PRINTER SETTINGS ================= */}
          {activeSubItem === 'Printer Settings' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Receipt Printers &amp; Label Configurations</h3>
                <p className="text-xs text-gray-400">Configure store hardware printers, default invoice outputs, and label widths.</p>
              </div>

              <div className="kpi-card bg-white max-w-xl space-y-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase">Hardware Ports &amp; Rules</h4>
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Invoice Receipt Printer</label>
                    <select
                      value={printerSettings.invoicePrinter}
                      onChange={e => setPrinterSettings(prev => ({ ...prev, invoicePrinter: e.target.value }))}
                      className="w-full border rounded-lg px-2.5 py-2 bg-white outline-none font-medium"
                    >
                      <option>Epson TM-T88VI (Thermal)</option>
                      <option>HP LaserJet Pro M404 (A4 Paper)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Inventory Label Printer</label>
                    <select
                      value={printerSettings.labelPrinter}
                      onChange={e => setPrinterSettings(prev => ({ ...prev, labelPrinter: e.target.value }))}
                      className="w-full border rounded-lg px-2.5 py-2 bg-white outline-none font-medium"
                    >
                      <option>Zebra ZD421 (Barcode)</option>
                      <option>DYMO LabelWriter 550</option>
                    </select>
                  </div>

                  <label className="border rounded-xl p-3 flex justify-between items-center cursor-pointer bg-slate-50/50 mt-1">
                    <div>
                      <span className="block font-bold text-gray-800">Auto Print Invoice</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Print receipt automatically on POS checkout.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={printerSettings.autoPrint}
                      onChange={e => {
                        setPrinterSettings(prev => ({ ...prev, autoPrint: e.target.checked }));
                        toast.success(`Auto print ${e.target.checked ? 'activated' : 'deactivated'}.`);
                      }}
                      className="rounded text-[#236625] focus:ring-[#236625]"
                    />
                  </label>
                </div>

                <div className="flex gap-2 pt-2 border-t text-xs">
                  <button
                    onClick={() => {
                      toast.success('Printer hardware settings saved successfully!');
                    }}
                    className="flex-1 btn-primary py-2.5 font-bold uppercase"
                  >
                    Save Hardware Settings
                  </button>
                  <button
                    onClick={() => {
                      toast.success(`Sending character stream test print to ${printerSettings.invoicePrinter}...`);
                    }}
                    className="btn-secondary px-6 py-2.5 font-bold"
                  >
                    Test Print
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= 9. TAX CONFIGURATION ================= */}
          {activeSubItem === 'Tax Settings' && (
            <div className="space-y-5">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase">GST &amp; Centralized Tax Rules</h3>
                  <p className="text-xs text-gray-400">Configure central/state/interstate GST rates and define pricing tax inclusions.</p>
                </div>
                <button
                  onClick={() => {
                    const ruleName = prompt('Enter Tax Rule Name (e.g. GST-12):');
                    const ruleRate = parseFloat(prompt('Enter Tax Percentage Value (e.g. 12):'));
                    if (ruleName && !isNaN(ruleRate)) {
                      setSettingsTaxRules(prev => [...prev, { name: ruleName, rate: ruleRate, type: 'GST', status: 'Active' }]);
                      toast.success(`Tax rule ${ruleName} created.`);
                    }
                  }}
                  className="btn-primary py-2 px-3 text-xs font-bold"
                >
                  + Add Tax Rule
                </button>
              </div>

              {/* Tax Rules Table */}
              <div className="kpi-card bg-white overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b bg-slate-50 text-[10px] font-bold text-gray-400 uppercase">
                      <th className="p-3">Rule Name</th>
                      <th className="p-3">Rate (%)</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settingsTaxRules.map((rule, idx) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                        <td className="p-3 font-bold text-gray-800">{rule.name}</td>
                        <td className="p-3 font-semibold text-gray-650">{rule.rate}%</td>
                        <td className="p-3 text-gray-500 font-medium font-mono">{rule.type}</td>
                        <td className="p-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            rule.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>{rule.status}</span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                setSettingsTaxRules(prev => prev.map((r, i) => i === idx ? { ...r, status: r.status === 'Active' ? 'Disabled' : 'Active' } : r));
                                toast.success('Tax rule status toggled.');
                              }}
                              className="text-[9px] font-bold text-[#236625] bg-emerald-50 px-2 py-0.5 rounded"
                            >
                              Toggle
                            </button>
                            <button
                              onClick={() => {
                                setSettingsTaxRules(prev => prev.filter((_, i) => i !== idx));
                                toast.error('Tax rule deleted.');
                              }}
                              className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 10. AUDIT LOGS ================= */}
          {activeSubItem === 'Audit Logs' && (
            <div className="space-y-5">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase">Operational Audit registers</h3>
                  <p className="text-xs text-gray-400">Search system modifications, role adjustments, and checkout actions.</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 border rounded-lg px-3 bg-white text-xs">
                    <Search size={12} className="text-gray-400"/>
                    <input
                      type="text"
                      placeholder="Search log history..."
                      value={auditSearchQuery}
                      onChange={e => setAuditSearchQuery(e.target.value)}
                      className="bg-transparent outline-none py-1.5 w-40 text-gray-700 font-medium"
                    />
                  </div>
                  <button
                    onClick={() => toast.success('Exporting operational audit logs as CSV spreadsheet...')}
                    className="btn-secondary text-xs font-bold py-1 px-3"
                  >
                    Export Logs
                  </button>
                </div>
              </div>

              {/* Logs Table */}
              <div className="kpi-card bg-white overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b bg-slate-50 text-[10px] font-bold text-gray-400 uppercase">
                      <th className="p-3">User</th>
                      <th className="p-3">Action Description</th>
                      <th className="p-3">Target Module</th>
                      <th className="p-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs
                      .filter(l => l.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) || l.user.toLowerCase().includes(auditSearchQuery.toLowerCase()))
                      .map((log, idx) => (
                        <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/30">
                          <td className="p-3 font-bold text-gray-800">{log.user}</td>
                          <td className="p-3 text-gray-655 font-medium">{log.action}</td>
                          <td className="p-3"><span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{log.module}</span></td>
                          <td className="p-3 text-right text-gray-400 font-mono">{log.time}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 11. SYSTEM HEALTH ================= */}
          {activeSubItem === 'System Health' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase">Diagnostics Monitor &amp; System Performance</h3>
                <p className="text-xs text-gray-400">Verify storage allocations, database execution responses, and cluster health indexes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Database Status', val: 'Healthy', status: 'OK', desc: 'No locked queries', color: 'text-emerald-700 bg-emerald-50/50' },
                  { label: 'Application latency', val: '48 ms', status: 'OK', desc: 'Average response rate', color: 'text-emerald-700 bg-emerald-50/50' },
                  { label: 'Cloud Storage', val: '34% Used', status: 'OK', desc: '3.4 GB of 10 GB limits', color: 'text-emerald-700 bg-emerald-50/50' },
                  { label: 'API Cluster Health', val: '100% Online', status: 'OK', desc: 'All endpoints responding', color: 'text-emerald-700 bg-emerald-50/50' }
                ].map((monitor, idx) => (
                  <div key={idx} className="kpi-card border bg-white space-y-1.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{monitor.label}</p>
                    <div className="flex justify-between items-center">
                      <p className={`text-base font-black ${monitor.color.split(' ')[0]}`}>{monitor.val}</p>
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">
                        {monitor.status}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-455 mt-1">{monitor.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-slate-50/50 p-4 border border-dashed rounded-xl flex flex-col items-center justify-center text-center space-y-2 py-8">
          <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
            <Sprout size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-700">Workspace: {activeSubItem}</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Real-time local ledger records for this shop terminal will load here automatically.</p>
          </div>
          <button onClick={() => toast.success(`${activeSubItem} synchronized with core database!`)} className="btn-secondary text-[10px] py-1 px-3 mt-2 flex items-center gap-1">
            <RefreshCw size={10} /> Sync Ledger
          </button>
        </div>
      )}
    </div>
  )
}

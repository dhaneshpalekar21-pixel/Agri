import React, { useState, useEffect } from 'react'
import {
  Sprout, LayoutDashboard, Users, FileText, ShoppingBag, Receipt, Boxes,
  AlertTriangle, Truck, Compass, BarChart3, LifeBuoy, MessageSquare, ClipboardList,
  CreditCard, Calendar, CheckSquare, Award, Megaphone, LogOut, Search, Plus, Check,
  UserCheck, CheckCircle2, ChevronRight, X, Clock, Settings, User, Bell, Phone, FileDown, Eye, Filter, Trash2, Minus, QrCode, Edit
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

// Product catalog mock data removed in favor of MongoDB

const INITIAL_CUSTOMERS = [
  { id: 'c1', name: 'Rajesh Kumar', mobile: '+91 98765 43210', village: 'Wardha Main', type: 'Wholesale', history: [{ id: 'ord-3829', total: 4350, date: '2026-05-28' }] },
  { id: 'c2', name: 'Amit Yadav', mobile: '+91 91234 56789', village: 'Karanja', type: 'Retail', history: [{ id: 'ord-9231', total: 980, date: '2026-06-02' }] },
  { id: 'c3', name: 'Priya Sharma', mobile: '+91 94567 12345', village: 'Deoli', type: 'Wholesale', history: [] },
  { id: 'c4', name: 'Vijay Patil', mobile: '+91 99887 76655', village: 'Seloo', type: 'Retail', history: [] }
]

const INITIAL_LEADS = [
  { id: 'l1', name: 'Gopal Deshmukh', mobile: '+91 95432 10987', village: 'Arvi', status: 'New', notes: 'Interested in drip irrigation setup.' },
  { id: 'l2', name: 'Sanjay Tambe', mobile: '+91 98888 77777', village: 'Hinganghat', status: 'Converted', notes: 'Converted to wholesale customer.' },
  { id: 'l3', name: 'Harish Rane', mobile: '+91 91111 22222', village: 'Wardha', status: 'Lost', notes: 'Decided to buy local manure.' }
]

export default function EmployeePortal() {
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const role = user?.designation || user?.role || 'Sales Executive'

  // Global Products State (Shared/Modified by Inventory Manager)
  const [products, setProducts] = useState([])

  const loadProducts = async () => {
    try {
      const { default: api } = await import('../../services/api')
      const response = await api.get('/products')
      console.log("API Response:", response.data)

      const apiProducts = response.data.products || response.data
      const uiProducts = apiProducts.map(p => ({
        _id: p._id,
        id: p.productId,
        name: p.productName,
        code: p.productId,
        category: p.category,
        brand: p.brand || '',
        purchasePrice: p.purchasePrice || 0,
        sellingPrice: p.sellingPrice,
        stock: p.stockQuantity,
        reorderLevel: 10,
        isRecommended: false
      }))

      setProducts(uiProducts)
      console.log("Inventory Products:", uiProducts)
    } catch (err) {
      console.error("Failed to load products:", err)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // CRM States (Sales Executive)
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS)
  const [leads, setLeads] = useState(INITIAL_LEADS)
  const [orders, setOrders] = useState([])

  const fetchOrders = async () => {
    try {
      const { default: api } = await import('../../services/api')
      const res = await api.get('/orders')
      console.log("Fetched Orders:", res.data)
      const uiOrders = res.data.map(o => ({
        _id: o._id,
        id: o.orderId,
        customerName: o.customerName || 'Unknown',
        total: o.totalAmount,
        date: o.createdAt ? o.createdAt.split('T')[0] : '',
        status: o.orderStatus,
        itemsCount: o.items ? o.items.length : 0,
        items: o.items,
        assignedDeliveryExecutive: o.assignedDeliveryExecutive,
        assignedDeliveryExecutiveEmail: o.assignedDeliveryExecutiveEmail,
        assignedDeliveryExecutiveId: o.assignedDeliveryExecutiveId,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus
      }))
      setOrders(uiOrders)
      const filteredOrders = uiOrders.filter(o => o.status === 'Confirmed')
      console.log("Visible Orders:", filteredOrders)
    } catch (err) {
      console.error('Failed to load orders', err)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateOrderDb = async (orderStringId, payload) => {
    try {
      const order = orders.find(o => o.id === orderStringId)
      if (!order) return
      const { default: api } = await import('../../services/api')
      const res = await api.put(`/orders/${order._id}`, payload)
      console.log("Order Status Updated / Assigned Order:", res.data)
      fetchOrders()
    } catch (err) {
      console.error('Failed to update order', err)
    }
  }

  // --- DOWNSTREAM SYNC ---
  // Ensure legacy portal states sync dynamically with the MongoDB orders truth.
  useEffect(() => {
    setPackingOrders(orders.filter(o => ['Processing', 'Packed'].includes(o.status)).map(o => ({
      id: o.id,
      customer: o.customerName,
      itemsCount: o.itemsCount,
      priority: 'Medium',
      status: o.status
    })))

    setDispatchPrep(orders.filter(o => ['Packed', 'Ready For Dispatch'].includes(o.status)).map(o => ({
      id: o.id,
      destination: 'Customer Address',
      packingStatus: o.status,
      dispatchStatus: o.status === 'Ready For Dispatch' ? 'Ready' : 'Pending'
    })))

    setDeliveries(orders.filter(o => ['Ready For Dispatch', 'Assigned', 'Out For Delivery', 'Delivered'].includes(o.status)).map(o => ({
      id: `DEL-${o.id}`,
      orderId: o.id,
      customerName: o.customerName,
      village: 'Unknown',
      amount: o.total,
      paymentMethod: 'COD',
      date: o.date,
      timeSlot: 'Morning (8AM - 12PM)',
      status: o.status,
      executive: o.assignedDeliveryExecutive || 'Unassigned',
      executiveId: 'N/A',
      otp: '1234'
    })))

    const currentUserEmail = useAuthStore.getState().user?.email || 'deliveryboy@agroerp.com'
    console.log("Current User:", currentUserEmail)
    
    console.log("--- DEBUGGING DELIVERY ASSIGNMENTS ---")
    orders.forEach(o => {
      console.log(`Order ${o.id} - Status: ${o.status} - Assigned Email:`, o.assignedDeliveryExecutiveEmail)
    })
    console.log("--------------------------------------")
    
    const assignedOrders = orders.filter(o => 
      o.assignedDeliveryExecutiveEmail === currentUserEmail && 
      ['Assigned', 'Out For Delivery', 'Delivered'].includes(o.status)
    )
    console.log("Visible Orders:", assignedOrders)

    setMyDeliveries(assignedOrders.map(o => ({
      id: `DEL-${o.id}`,
      orderId: o.id,
      customerName: o.customerName,
      address: 'Delivery Address Placeholder',
      amount: o.total,
      paymentMethod: o.paymentMethod === 'cod' ? 'COD' : 'Online',
      codCollected: o.paymentStatus === 'Paid',
      otp: '1234',
      status: o.status,
      mobile: '+91 99999 00000'
    })))
    
    setDeliveryHistory(orders.filter(o => 
      o.assignedDeliveryExecutiveEmail === currentUserEmail && 
      ['Delivered', 'Completed'].includes(o.status)
    ).map(o => ({
      id: `DEL-${o.id}`,
      orderId: o.id,
      customer: o.customerName,
      address: 'Delivery Address Placeholder',
      date: o.date,
      status: o.status,
      amount: o.total,
      paymentMethod: o.paymentMethod === 'cod' ? 'COD' : 'Online',
      codCollected: o.paymentStatus === 'Paid'
    })))

    const visiblePayments = orders.filter(o => o.status === 'Delivered' || o.paymentStatus !== 'Paid').map(o => ({
      id: `PAY-${o.id}`,
      orderId: o.id,
      customer: o.customerName,
      amount: o.total,
      method: o.paymentMethod === 'cod' ? 'Cash' : o.paymentMethod === 'online' ? 'Online' : 'Credit',
      date: o.date,
      status: o.paymentStatus === 'Paid' ? 'Verified' : 'Pending'
    }))
    
    setPayments(visiblePayments)

    console.log("Finance Orders:", orders)
    console.log("Finance Visible Orders:", visiblePayments)

  }, [orders])

  // Customer Management Modals & Inputs
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [customerEditId, setCustomerEditId] = useState(null)
  const [custName, setCustName] = useState('')
  const [custMobile, setCustMobile] = useState('')
  const [custVillage, setCustVillage] = useState('')
  const [custType, setCustType] = useState('Retail')
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState(null)
  const [searchCustQuery, setSearchCustQuery] = useState('')
  const [contactingCust, setContactingCust] = useState(null)

  // Order Creation State
  const [selectedOrderCustomer, setSelectedOrderCustomer] = useState(INITIAL_CUSTOMERS[0].id)
  const [orderItems, setOrderItems] = useState([])
  const [discountPercent, setDiscountPercent] = useState(0)
  const [orderStatus, setOrderStatus] = useState('Draft')
  const [generatedInvoice, setGeneratedInvoice] = useState(null)

  // Product Catalog search
  const [catalogSearch, setCatalogSearch] = useState('')
  const [catalogFilter, setCatalogFilter] = useState('All')

  // Leads Management States
  const [leadModalOpen, setLeadModalOpen] = useState(false)
  const [leadName, setLeadName] = useState('')
  const [leadMobile, setLeadMobile] = useState('')
  const [leadVillage, setLeadVillage] = useState('')
  const [leadNotes, setLeadNotes] = useState('')

  // Follow ups List
  const [followups, setFollowups] = useState([
    { id: 'f1', name: 'Rajesh Kumar', date: '2026-06-03', notes: 'Remind about Urea stock availability.', status: 'Scheduled' },
    { id: 'f2', name: 'Gopal Deshmukh', date: '2026-06-04', notes: 'Present drip kit solar subsidy details.', status: 'Scheduled' },
    { id: 'f3', name: 'Priya Sharma', date: '2026-06-01', notes: 'Verify Aadhaar KYC upload.', status: 'Done' }
  ])
  const [newFollowupDate, setNewFollowupDate] = useState('')
  const [newFollowupNotes, setNewFollowupNotes] = useState('')
  const [followupModalOpen, setFollowupModalOpen] = useState(false)
  const [followupCustomer, setFollowupCustomer] = useState('')

  // ----------------------------------------------------
  // FINANCE EXECUTIVE STATES & DUMMY DATA
  // ----------------------------------------------------
  const [payments, setPayments] = useState([])
  const [selectedPayment, setSelectedPayment] = useState(null)
  
  const [expenses, setExpenses] = useState([
    { id: 'EXP-501', category: 'Inventory Purchase', amount: 45000, date: '2026-06-01', description: 'Procurement of Urea and Hybrid Wheat seeds' },
    { id: 'EXP-502', category: 'Transportation', amount: 3500, date: '2026-06-01', description: 'Diesel for delivery truck' },
    { id: 'EXP-503', category: 'Utilities', amount: 1800, date: '2026-05-28', description: 'Office electricity bill' },
    { id: 'EXP-504', category: 'Marketing', amount: 5000, date: '2026-05-25', description: 'Village leaflet distributions and banner placement' }
  ])
  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [newExpCategory, setNewExpCategory] = useState('Utilities')
  const [newExpAmount, setNewExpAmount] = useState('')
  const [newExpDate, setNewExpDate] = useState('')
  const [newExpDesc, setNewExpDesc] = useState('')

  const [creditCustomers, setCreditCustomers] = useState([
    { id: 'c1', name: 'Rajesh Kumar', village: 'Wardha Main', outstanding: 8500, dueDate: '2026-06-15', status: 'Due' },
    { id: 'c2', name: 'Amit Yadav', village: 'Karanja', outstanding: 1200, dueDate: '2026-06-20', status: 'Due' },
    { id: 'c4', name: 'Vijay Patil', village: 'Seloo', outstanding: 0, dueDate: '2026-05-20', status: 'Paid' }
  ])
  const [collectionModalOpen, setCollectionModalOpen] = useState(false)
  const [collectionCustId, setCollectionCustId] = useState('')
  const [collectionAmt, setCollectionAmt] = useState('')
  const [selectedCreditLedger, setSelectedCreditLedger] = useState(null)
  const [revenueTimeframe, setRevenueTimeframe] = useState('monthly')

  // ----------------------------------------------------
  // CUSTOMER SUPPORT EXECUTIVE STATES & DUMMY DATA
  // ----------------------------------------------------
  const [complaints, setComplaints] = useState([
    { id: 'CMP-2091', customerName: 'Rajesh Kumar', orderId: 'ord-3829', type: 'Delay Delivery', priority: 'High', status: 'Open' },
    { id: 'CMP-2092', customerName: 'Amit Yadav', orderId: 'ord-9231', type: 'Damaged Products', priority: 'Critical', status: 'Assigned' },
    { id: 'CMP-2093', customerName: 'Priya Sharma', orderId: 'ord-5521', type: 'Billing Discrepancy', priority: 'Medium', status: 'Resolved' }
  ])
  const [selectedComplaint, setSelectedComplaint] = useState(null)

  const [supportTickets, setSupportTickets] = useState([
    { id: 'TCK-8012', customer: 'Vijay Patil', subject: 'Drip Kit Installation Guide', category: 'Technical', status: 'Open', date: '2026-06-02' },
    { id: 'TCK-8013', customer: 'Rajesh Kumar', subject: 'Seed Germination Query', category: 'Products', status: 'Resolved', date: '2026-06-01' },
    { id: 'TCK-8014', customer: 'Amit Yadav', subject: 'Failed Payment Refund', category: 'Billing', status: 'Open', date: '2026-06-02' }
  ])
  const [selectedSupportTicket, setSelectedSupportTicket] = useState(null)

  const [refundRequests, setRefundRequests] = useState([
    { id: 'REF-301', orderId: 'ord-9231', customer: 'Amit Yadav', amount: 980, reason: 'Damaged insecticide bottle in packaging', status: 'Pending Review' },
    { id: 'REF-302', orderId: 'ord-3829', customer: 'Rajesh Kumar', amount: 1500, reason: 'Duplicate payment verification', status: 'Forwarded to Finance' }
  ])
  const [selectedRefundRequest, setSelectedRefundRequest] = useState(null)

  const [activeChats, setActiveChats] = useState([
    { id: 'chat-1', farmer: 'Rajesh Kumar', phone: '+91 98765 43210', messages: [{ sender: 'farmer', text: 'Hello, is neem pesticide available in stock?' }, { sender: 'support', text: 'Yes Rajesh, neem pesticides are in ready stock in our Wardha main silo.' }], active: true },
    { id: 'chat-2', farmer: 'Amit Yadav', phone: '+91 91234 56789', messages: [{ sender: 'farmer', text: 'Need installation notes for Jain drip kit.' }], active: true }
  ])
  const [selectedChatId, setSelectedChatId] = useState('chat-1')
  const [chatInputText, setChatInputText] = useState('')

  const [customerQueries, setCustomerQueries] = useState([
    { id: 'QRY-701', customer: 'Priya Sharma', type: 'Bulk Seed Discounts', priority: 'Medium', status: 'Open' },
    { id: 'QRY-702', customer: 'Vijay Patil', type: 'Dealer Franchise queries', priority: 'High', status: 'Escalated' }
  ])
  const [selectedQuery, setSelectedQuery] = useState(null)

  // ----------------------------------------------------
  // HR MANAGER STATES & DUMMY DATA
  // ----------------------------------------------------
  const [staff, setStaff] = useState([
    { id: 'EMP-01', name: 'Suresh Patil', dept: 'Sales', designation: 'Sales Executive', status: 'Active', date: '2025-01-15' },
    { id: 'EMP-02', name: 'Milind Deshmukh', dept: 'Inventory', designation: 'Inventory Manager', status: 'Active', date: '2025-02-10' },
    { id: 'EMP-03', name: 'Sanjay Gore', dept: 'Finance', designation: 'Finance Executive', status: 'Active', date: '2025-03-01' },
    { id: 'EMP-04', name: 'Anjali Rane', dept: 'Support', designation: 'Customer Support Executive', status: 'Active', date: '2025-04-05' },
    { id: 'EMP-05', name: 'Sunita Joshi', dept: 'HR', designation: 'HR Manager', status: 'Active', date: '2025-05-12' }
  ])
  const [selectedStaff, setSelectedStaff] = useState(null)
  
  const [attendanceLogs, setAttendanceLogs] = useState([
    { name: 'Suresh Patil', checkIn: '09:05 AM', checkOut: '06:00 PM', hours: 8.5, status: 'Present' },
    { name: 'Milind Deshmukh', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: 9.25, status: 'Present' },
    { name: 'Sanjay Gore', checkIn: '09:45 AM', checkOut: '06:00 PM', hours: 8.25, status: 'Late' },
    { name: 'Anjali Rane', checkIn: '--', checkOut: '--', hours: 0, status: 'Absent' }
  ])
  
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LV-401', employee: 'Anjali Rane', type: 'Sick Leave', start: '2026-06-02', end: '2026-06-03', status: 'Pending' },
    { id: 'LV-402', employee: 'Suresh Patil', type: 'Casual Leave', start: '2026-06-10', end: '2026-06-12', status: 'Approved' }
  ])
  const [selectedLeave, setSelectedLeave] = useState(null)

  const [payrollRecords, setPayrollRecords] = useState([
    { name: 'Suresh Patil', salary: 32000, bonus: 5000, deduction: 1200, net: 35800 },
    { name: 'Milind Deshmukh', salary: 45000, bonus: 0, deduction: 1500, net: 43500 },
    { name: 'Sanjay Gore', salary: 40000, bonus: 2000, deduction: 1000, net: 41000 }
  ])
  const [selectedPayroll, setSelectedPayroll] = useState(null)

  const [jobOpenings, setJobOpenings] = useState([
    { id: 'JOB-901', title: 'Delivery Coordinator', dept: 'Logistics', status: 'Open', applicants: 6 },
    { id: 'JOB-902', title: 'Warehouse Staff', dept: 'Operations', status: 'Open', applicants: 4 }
  ])
  const [applicants, setApplicants] = useState([
    { id: 'APP-101', name: 'Rajesh Tambe', jobTitle: 'Delivery Coordinator', status: 'Applied', interviewDate: '' },
    { id: 'APP-102', name: 'Vikram Shinde', jobTitle: 'Warehouse Staff', status: 'Shortlisted', interviewDate: '2026-06-05' }
  ])
  const [interviewModalOpen, setInterviewModalOpen] = useState(false)
  const [selectedApplicantId, setSelectedApplicantId] = useState('')
  const [interviewDate, setInterviewDate] = useState('')

  const [performanceReviews, setPerformanceReviews] = useState([
    { name: 'Suresh Patil', rating: 4.5, productivity: 92, targetAchieved: '76%' },
    { name: 'Milind Deshmukh', rating: 4.2, productivity: 88, targetAchieved: '90%' }
  ])
  const [reviewEmployeeName, setReviewEmployeeName] = useState('')
  const [reviewRating, setReviewRating] = useState('5')
  const [reviewProductivity, setReviewProductivity] = useState('')
  const [reviewTarget, setReviewTarget] = useState('')

  const [announcements, setAnnouncements] = useState([
    { id: 'ANN-01', title: 'Summer Season Holiday Notice', category: 'Holiday Notice', content: 'AgriERP centers will remain closed on June 15th for the local harvest festival.', date: '2026-06-01' },
    { id: 'ANN-02', title: 'New Attendance Policy Update', category: 'Policy Updates', content: 'Check-in buffer time is updated to 15 minutes starting tomorrow.', date: '2026-05-30' }
  ])
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false)
  const [annTitle, setAnnTitle] = useState('')
  const [annCategory, setAnnCategory] = useState('Policy Updates')
  const [annContent, setAnnContent] = useState('')


  // ----------------------------------------------------
  // MARKETING EXECUTIVE STATES & DUMMY DATA
  // ----------------------------------------------------
  const [mCampaigns, setMCampaigns] = useState([
    { id: 'CAMP-01', name: 'Kharif Fertilizers Promo', type: 'SMS Blast', start: '2026-06-01', end: '2026-06-15', status: 'Active', reach: 1200 },
    { id: 'CAMP-02', name: 'Monsoon Seed Discounts', type: 'Email Campaign', start: '2026-06-05', end: '2026-06-25', status: 'Scheduled', reach: 3500 },
    { id: 'CAMP-03', name: 'Jain Drip Kit Offer', type: 'WhatsApp Broadcast', start: '2026-05-20', end: '2026-05-30', status: 'Completed', reach: 850 }
  ])
  const [coupons, setCoupons] = useState([
    { code: 'AGRI10', type: 'Percentage', value: 10, usage: 142, expiry: '2026-07-31', status: 'Active' },
    { code: 'SEEDFREE', type: 'Fixed Amount', value: 200, usage: 89, expiry: '2026-06-30', status: 'Active' },
    { code: 'MONSOON50', type: 'Percentage', value: 15, usage: 0, expiry: '2026-06-10', status: 'Active' }
  ])
  const [promotions, setPromotions] = useState([
    { id: 'PRM-01', name: 'NPK Fertilizer Price Drop', scope: 'Product (NPK Fertilizer)', discount: '10% Off', expiry: '2026-06-15', status: 'Active' },
    { id: 'PRM-02', name: 'Free Delivery on Farm Equipment', scope: 'Category (Farm Equipment)', discount: 'Free Shipping', expiry: '2026-06-30', status: 'Active' }
  ])
  const [smsCampaigns, setSmsCampaigns] = useState([
    { id: 'SMS-101', segment: 'Farmers', text: 'Get 10% off on all seeds using code AGRI10. Visit AgriERP silos today!', scheduled: '2026-06-02', status: 'Sent', sent: 1200, delivered: 1150, failed: 50 }
  ])
  const [emailCampaigns, setEmailCampaigns] = useState([
    { id: 'EML-201', subject: 'Prep your farm for the Monsoon season!', template: 'Summer Harvest Newsletter', openRate: '42%', clickRate: '18%', conversion: '5.2%', status: 'Sent' }
  ])
  const [whatsappCampaigns, setWhatsappCampaigns] = useState([
    { id: 'WA-301', title: 'Neem Cake Fertilizer ready stock alert!', date: '2026-06-02', status: 'Sent' }
  ])
  const [customerSegments, setCustomerSegments] = useState([
    { name: 'Farmers', size: 1450, criteria: 'Purchased seeds in last 6 months' },
    { name: 'Retail Customers', size: 820, criteria: 'Purchase count < 3' },
    { name: 'Wholesale Customers', size: 180, criteria: 'Purchase total > ₹20,000' },
    { name: 'Premium Customers', size: 340, criteria: 'Loyalty points > 1000' },
    { name: 'Inactive Customers', size: 210, criteria: 'No purchase in 3 months' }
  ])
  const [banners, setBanners] = useState([
    { id: 'BAN-01', name: 'Kharif Banner', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80', status: 'Published', start: '2026-06-01', end: '2026-06-30' },
    { id: 'BAN-02', name: 'Seed Fest Banner', image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80', status: 'Draft', start: '2026-07-01', end: '2026-07-15' }
  ])

  // Modals & inputs
  const [campaignModalOpen, setCampaignModalOpen] = useState(false)
  const [newCampName, setNewCampName] = useState('')
  const [newCampType, setNewCampType] = useState('SMS Blast')
  const [newCampStart, setNewCampStart] = useState('')
  const [newCampEnd, setNewCampEnd] = useState('')
  const [couponModalOpen, setCouponModalOpen] = useState(false)
  const [newCoupCode, setNewCoupCode] = useState('')
  const [newCoupType, setNewCoupType] = useState('Percentage')
  const [newCoupVal, setNewCoupVal] = useState('')
  const [newCoupExpiry, setNewCoupExpiry] = useState('')
  const [promoModalOpen, setPromoModalOpen] = useState(false)
  const [newPromoName, setNewPromoName] = useState('')
  const [newPromoScope, setNewPromoScope] = useState('Product')
  const [newPromoDisc, setNewPromoDisc] = useState('')
  const [newPromoExpiry, setNewPromoExpiry] = useState('')
  const [smsModalOpen, setSmsModalOpen] = useState(false)
  const [smsText, setSmsText] = useState('')
  const [smsSegment, setSmsSegment] = useState('Farmers')
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailTemplate, setEmailTemplate] = useState('Summer Harvest Newsletter')
  const [waModalOpen, setWaModalOpen] = useState(false)
  const [waText, setWaText] = useState('')
  const [waSegment, setWaSegment] = useState('Farmers')
  const [segmentModalOpen, setSegmentModalOpen] = useState(false)
  const [newSegName, setNewSegName] = useState('')
  const [newSegCriteria, setNewSegCriteria] = useState('')
  const [bannerModalOpen, setBannerModalOpen] = useState(false)
  const [newBanName, setNewBanName] = useState('')
  const [newBanImage, setNewBanImage] = useState('')
  const [newBanStart, setNewBanStart] = useState('')
  const [newBanEnd, setNewBanEnd] = useState('')

  // ----------------------------------------------------
  // WAREHOUSE STAFF STATES & DUMMY DATA
  // ----------------------------------------------------
  const [receivedGoods, setReceivedGoods] = useState([
    { id: 'REC-001', name: 'NPK Fertilizer Granular', supplier: 'IFFCO Ltd', qty: 250, date: '2026-06-02', status: 'Received', condition: 'Perfect' },
    { id: 'REC-002', name: 'Premium Hybrid Wheat Seeds', supplier: 'KrushiCare Ltd', qty: 120, date: '2026-06-02', status: 'Verified', condition: 'Perfect' },
    { id: 'REC-003', name: 'Broad Spectrum Insecticide', supplier: 'Bayer India', qty: 85, date: '2026-06-01', status: 'Pending', condition: 'Awaiting Check' }
  ])

  const [storageLocations, setStorageLocations] = useState([
    { rack: 'Rack A-1', area: 'Section Alpha (Seeds)', product: 'Premium Hybrid Wheat Seeds', space: '20% Free' },
    { rack: 'Rack B-3', area: 'Section Beta (Fertilizers)', product: 'NPK Granular Fertilizer', space: '5% Free' },
    { rack: 'Rack C-2', area: 'Section Gamma (Pesticides)', product: 'Broad Spectrum Insecticide', space: '60% Free' },
    { rack: 'Rack D-1', area: 'Section Delta (Farm Equip)', product: 'Battery Knapsack Sprayer', space: '40% Free' }
  ])

  const [packingOrders, setPackingOrders] = useState([])
  const [dispatchPrep, setDispatchPrep] = useState([])

  const [stockMovements, setStockMovements] = useState([
    { id: 'MVT-901', product: 'NPK Granular Fertilizer', from: 'Receiving Dock A', to: 'Rack B-3', qty: 150, date: '2026-06-02' },
    { id: 'MVT-902', product: 'Organic Sweet Corn Seeds', from: 'Receiving Dock B', to: 'Rack A-1', qty: 80, date: '2026-06-01' }
  ])

  const [barcodeScans, setBarcodeScans] = useState([
    { code: 'WHT-2967', product: 'Premium Hybrid Wheat Seeds (HD-2967)', type: 'Inventory Count', status: 'Verified', time: '11:15 AM' },
    { code: 'NPK-1919', product: 'NPK Granular Fertilizer (19-19-19)', type: 'Order Dispatch Verification', status: 'Matched', time: '10:42 AM' }
  ])

  const [damageReportsState, setDamageReportsState] = useState([
    { id: 'DMG-401', product: 'NPK Granular Fertilizer', qty: 3, type: 'Moisture Seepage', date: '2026-06-02', status: 'Reported' },
    { id: 'DMG-402', product: 'Broad Spectrum Insecticide', qty: 1, type: 'Broken Seal', date: '2026-05-30', status: 'Approved' }
  ])

  const [warehouseTasks, setWarehouseTasks] = useState([
    { id: 'TSK-201', task: 'Restack Seed Rack Section A-1', priority: 'High', status: 'Pending', notes: 'Keep high moisture seeds on top shelves.' },
    { id: 'TSK-202', task: 'Unload Bayer Pesticides Truck', priority: 'High', status: 'Completed', notes: 'Verify Batch numbers match invoices.' },
    { id: 'TSK-203', task: 'Clean Spill Area Section B', priority: 'Medium', status: 'In Progress', notes: 'Use granular absorbent compound.' }
  ])

  // Warehouse specific Modals and input states
  const [receiveModalOpen, setReceiveModalOpen] = useState(false)
  const [recProdName, setRecProdName] = useState('')
  const [recSupplier, setRecSupplier] = useState('')
  const [recQty, setRecQty] = useState('')
  const [recCondition, setRecCondition] = useState('Perfect')

  const [moveModalOpen, setMoveModalOpen] = useState(false)
  const [moveProductState, setMoveProductState] = useState('')
  const [moveFrom, setMoveFrom] = useState('')
  const [moveTo, setMoveTo] = useState('')
  const [moveQty, setMoveQty] = useState('')

  const [damageModalOpen, setDamageModalOpen] = useState(false)
  const [dmgProductState, setDmgProductState] = useState('')
  const [dmgQty, setDmgQty] = useState('')
  const [dmgType, setDmgType] = useState('Packaging Torn')

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskPriority, setTaskPriority] = useState('Medium')
  const [taskNotes, setTaskNotes] = useState('')

  const [scannerModalOpen, setScannerModalOpen] = useState(false)
  const [scanCodeInput, setScanCodeInput] = useState('')
  const [scanningStatus, setScanningStatus] = useState(null)

  const [packingSlipOrder, setPackingSlipOrder] = useState(null)


  // ----------------------------------------------------
  // DELIVERY COORDINATOR STATES & DUMMY DATA
  // ----------------------------------------------------
  const [deliveries, setDeliveries] = useState([])
  // DELIVERY EXECUTIVE REGISTRY — 3 real accounts
  const DELIVERY_EXECUTIVES = [
    { id: 'DE-001', name: 'Ravi Nair',     email: 'deliveryboy@agroerp.com',      mobile: '+91 98765 00001', status: 'Available' },
    { id: 'DE-002', name: 'Rahul Sharma',  email: 'rahul.delivery@agroerp.com',   mobile: '+91 98765 00002', status: 'Available' },
    { id: 'DE-003', name: 'Amit Verma',    email: 'amit.delivery@agroerp.com',    mobile: '+91 98765 00003', status: 'Available' }
  ]

  const [deliveryStaff, setDeliveryStaff] = useState([
    { id: 'DE-001', name: 'Ravi Nair',    email: 'deliveryboy@agroerp.com',    mobile: '+91 98765 00001', assigned: 2, completed: 18, status: 'Available' },
    { id: 'DE-002', name: 'Rahul Sharma', email: 'rahul.delivery@agroerp.com', mobile: '+91 98765 00002', assigned: 1, completed: 12, status: 'Available' },
    { id: 'DE-003', name: 'Amit Verma',   email: 'amit.delivery@agroerp.com',  mobile: '+91 98765 00003', assigned: 0, completed: 9,  status: 'Available' }
  ])
  const [failedDeliveries, setFailedDeliveries] = useState([
    { id: 'DEL-705', orderId: 'ord-1024', customer: 'Vijay Patil', reason: 'Customer Unavailable', date: '2026-06-01', executive: 'Suresh Patil' }
  ])
  const [deliveryComplaints, setDeliveryComplaints] = useState([
    { id: 'DCM-101', customer: 'Rajesh Kumar', orderId: 'ord-3829', type: 'Delayed Package', status: 'Open' }
  ])
  const [optimizedRoutes, setOptimizedRoutes] = useState([
    { id: 'r1', name: 'Wardha Route', stops: 'Wardha Main -> Wardha East -> Seloo', distance: '35 km', time: '1.2 hrs' },
    { id: 'r2', name: 'Karanja Route', stops: 'Karanja Silo -> Karanja West', distance: '18 km', time: '45 mins' }
  ])

  // Modals & form input states
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedDeliveryForAssign, setSelectedDeliveryForAssign] = useState(null)
  const [assignExecutive, setAssignExecutive] = useState('deliveryboy@agroerp.com')
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleSlot, setScheduleSlot] = useState('10:00 AM - 01:00 PM')
  const [routeModalOpen, setRouteModalOpen] = useState(false)
  const [routeNameInput, setRouteNameInput] = useState('')
  const [routeStopsInput, setRouteStopsInput] = useState('')
  const [routeDistInput, setRouteDistInput] = useState('')
  const [routeTimeInput, setRouteTimeInput] = useState('')

  // ----------------------------------------------------
  // DELIVERY EXECUTIVE STATES & DUMMY DATA
  // ----------------------------------------------------
  // DELIVERY EXECUTIVE STATES
  // ----------------------------------------------------
  const [myDeliveries, setMyDeliveries] = useState([])
  const [deliveryHistory, setDeliveryHistory] = useState([])

  const [otpInput, setOtpInput] = useState('')
  const [otpSelectedDelivery, setOtpSelectedDelivery] = useState(null)
  const [otpVerified, setOtpVerified] = useState(null)

  const [codSelectedDelivery, setCodSelectedDelivery] = useState(null)
  const [codPaymentMethod, setCodPaymentMethod] = useState('Cash')
  const [codReceiptDelivery, setCodReceiptDelivery] = useState(null)

  const [deNotifications, setDeNotifications] = useState([
    { id: 1, text: 'New delivery DEL-810 assigned to you for Rajesh Kumar.', time: '10 min ago', type: 'assign' },
    { id: 2, text: 'OTP verification pending for DEL-811 (Amit Yadav).', time: '25 min ago', type: 'otp' },
    { id: 3, text: 'COD collection reminder: ₹4,350 from Rajesh Kumar.', time: '1 hour ago', type: 'cod' }
  ])


  // ----------------------------------------------------
  // INVENTORY MANAGER STATES
  // ----------------------------------------------------
  const [prodModalOpen, setProdModalOpen] = useState(false)
  const [prodEditId, setProdEditId] = useState(null)
  const [pName, setPName] = useState('')
  const [pCode, setPCode] = useState('')
  const [pCategory, setPCategory] = useState('Seeds')
  const [pBrand, setPBrand] = useState('')
  const [pPurchasePrice, setPPurchasePrice] = useState('')
  const [pSellingPrice, setPSellingPrice] = useState('')
  const [pStock, setPStock] = useState('')
  const [pReorder, setPReorder] = useState('')

  // Stock Control Ledger
  const [stockLedger, setStockLedger] = useState([
    { id: 'l-1', product: 'NPK Granular Fertilizer', qty: 50, type: 'Purchase', date: '2026-06-01' },
    { id: 'l-2', product: 'Broad Spectrum Insecticide', qty: 2, type: 'Sale', date: '2026-06-02' }
  ])
  const [stockInProduct, setStockInProduct] = useState('p1')
  const [stockInQty, setStockInQty] = useState('')
  const [stockInType, setStockInType] = useState('Purchase')

  // Barcode & QR code generator selection
  const [selectedBarcodeProd, setSelectedBarcodeProd] = useState('p1')

  // Expiry tracking records
  const [expiryRecords, setExpiryRecords] = useState([
    { batch: 'BAT-NPK-029', name: 'NPK Granular Fertilizer', expiry: '2026-07-15', days: 43, status: 'Near Expiry' },
    { batch: 'BAT-INS-108', name: 'Broad Spectrum Insecticide', expiry: '2026-05-10', days: -23, status: 'Expired' },
    { batch: 'BAT-WHT-200', name: 'Premium Hybrid Wheat Seeds', expiry: '2027-12-01', days: 547, status: 'Safe' }
  ])

  // Warehouse Stock view list
  const [warehouses, setWarehouses] = useState([
    { name: 'Main Silo (Seeds)', available: 315, reserved: 45, damaged: 2 },
    { name: 'Cold Storage (Pesticides)', available: 8, reserved: 1, damaged: 0 },
    { name: 'Chemical Store (Fertilizers)', available: 102, reserved: 20, damaged: 5 }
  ])

  // Damage reporting history
  const [damageHistory, setDamageHistory] = useState([
    { product: 'NPK Granular Fertilizer', qty: 5, reason: 'Moisture Seepage', date: '2026-05-28' }
  ])
  const [damageProduct, setDamageProduct] = useState('p4')
  const [damageQty, setDamageQty] = useState('')
  const [damageReason, setDamageReason] = useState('')

  // Restock requests
  const [restockRequests, setRestockRequests] = useState([
    { id: 'req-201', product: 'Systemic Fungicide', qty: 100, urgency: 'High', status: 'Pending' },
    { id: 'req-202', product: 'NPK Granular Fertilizer', qty: 200, urgency: 'Medium', status: 'Approved' }
  ])
  const [restockProduct, setRestockProduct] = useState('p7')
  const [restockQty, setRestockQty] = useState('')
  const [restockUrgency, setRestockUrgency] = useState('Medium')

  // Notifications List (Combined/Filtered by Role)
  const [notifications, setNotifications] = useState(
    role === 'Inventory Manager'
      ? [
          { id: 1, text: 'Low Stock Alert: Broad Spectrum Insecticide (8 left).', time: '10m ago' },
          { id: 2, text: 'Expiry Warning: NPK Granular Fertilizer batch BAT-NPK-029 is expiring soon.', time: '2 hours ago' },
          { id: 3, text: 'Stock Adjustment: 5 bags marked damaged due to moisture.', time: '1 day ago' }
        ]
      : [
          { id: 1, text: 'New customer Gopal Deshmukh assigned to your route.', time: '1 hour ago' },
          { id: 2, text: 'You achieved 76% of your monthly sales target.', time: '4 hours ago' },
          { id: 3, text: 'Reminder: Call Rajesh Kumar tomorrow.', time: '1 day ago' }
        ]
  )

  // Commission Metrics (Sales)
  const commissionAchieved = 12450
  const incentivesEarned = 3500
  const bonusEarned = 5000

  // Reports selection
  const [reportType, setReportType] = useState(role === 'Inventory Manager' ? 'stock' : 'sales')

  // Sync state hooks with localStorage for multi-role workflows
  useEffect(() => {
    localStorage.setItem('agri_orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem('agri_payments', JSON.stringify(payments))
  }, [payments])

  useEffect(() => {
    localStorage.setItem('agri_packingOrders', JSON.stringify(packingOrders))
  }, [packingOrders])

  useEffect(() => {
    localStorage.setItem('agri_dispatchPrep', JSON.stringify(dispatchPrep))
  }, [dispatchPrep])

  useEffect(() => {
    localStorage.setItem('agri_deliveries', JSON.stringify(deliveries))
  }, [deliveries])

  // ----------------------------------------------------
  // SALES EXECUTIVE ACTIONS
  // ----------------------------------------------------
  const handleSaveCustomer = (e) => {
    e.preventDefault()
    if (!custName || !custMobile || !custVillage) return

    if (customerEditId) {
      setCustomers(prev => prev.map(c => c.id === customerEditId ? { ...c, name: custName, mobile: custMobile, village: custVillage, type: custType } : c))
      setNotifications(prev => [{ id: Date.now(), text: `Updated profile of customer: ${custName}`, time: 'Just now' }, ...prev])
    } else {
      const newCust = {
        id: `c-${Date.now()}`,
        name: custName,
        mobile: custMobile,
        village: custVillage,
        type: custType,
        history: []
      }
      setCustomers(prev => [...prev, newCust])
      setNotifications(prev => [{ id: Date.now(), text: `Created new customer profile: ${custName}`, time: 'Just now' }, ...prev])
    }

    setCustName('')
    setCustMobile('')
    setCustVillage('')
    setCustType('Retail')
    setCustomerEditId(null)
    setCustomerModalOpen(false)
  }

  const handleEditCustomerClick = (c) => {
    setCustomerEditId(c.id)
    setCustName(c.name)
    setCustMobile(c.mobile)
    setCustVillage(c.village)
    setCustType(c.type)
    setCustomerModalOpen(true)
  }

  const handleAddOrderItem = (prod) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.id === prod.id)
      if (existing) {
        return prev.map(item => item.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...prod, quantity: 1 }]
    })
  }

  const handleUpdateOrderItemQty = (id, delta) => {
    setOrderItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta
        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    }))
  }

  const handleRemoveOrderItem = (id) => {
    setOrderItems(prev => prev.filter(item => item.id !== id))
  }

  const getOrderSubtotal = () => orderItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
  const getOrderDiscount = () => (getOrderSubtotal() * discountPercent) / 100
  const getOrderTax = () => ((getOrderSubtotal() - getOrderDiscount()) * 18) / 100
  const getOrderTotal = () => getOrderSubtotal() - getOrderDiscount() + getOrderTax()

  const handleSaveOrder = async () => {
    const cust = customers.find(c => c.id === selectedOrderCustomer)
    if (!cust || orderItems.length === 0) return

    try {
      const { default: api } = await import('../../services/api')
      const payload = {
        items: orderItems.map(c => ({
          productId: c.id,
          name: c.name,
          price: c.price,
          quantity: c.quantity,
          image: c.image || ''
        })),
        totalAmount: getOrderTotal(),
        paymentMethod: 'cod',
        customerName: cust.name,
        customerEmail: cust.email || '',
        customerId: cust.id || 'walkin'
      }

      const res = await api.post('/orders', payload)
      const newOrder = res.data

      fetchOrders()


    setCustomers(prev => prev.map(c => {
      if (c.id === cust.id) {
        return {
          ...c,
          history: [...c.history, { id: newOrder.orderId, total: newOrder.totalAmount, date: newOrder.createdAt.split('T')[0] }]
        }
      }
      return c
    }))

    setNotifications(prev => [{ id: Date.now(), text: `Saved order ${newOrder.orderId} for customer ${cust.name}.`, time: 'Just now' }, ...prev])

    setOrderItems([])
    setDiscountPercent(0)
    setOrderStatus('Draft')
    } catch (err) {
      console.error('Failed to create order', err)
      setNotifications(prev => [{ id: Date.now(), text: 'Failed to create order.', time: 'Just now' }, ...prev])
    }
  }

  const handleAddLead = (e) => {
    e.preventDefault()
    if (!leadName || !leadMobile || !leadVillage) return
    const newL = {
      id: `l-${Date.now()}`,
      name: leadName,
      mobile: leadMobile,
      village: leadVillage,
      status: 'New',
      notes: leadNotes
    }
    setLeads(prev => [newL, ...prev])
    setLeadName('')
    setLeadMobile('')
    setLeadVillage('')
    setLeadNotes('')
    setLeadModalOpen(false)
  }

  const handleConvertLead = (lead) => {
    const newCust = {
      id: `c-${Date.now()}`,
      name: lead.name,
      mobile: lead.mobile,
      village: lead.village,
      type: 'Retail',
      history: []
    }
    setCustomers(prev => [...prev, newCust])
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'Converted' } : l))
    setNotifications(prev => [{ id: Date.now(), text: `Converted lead ${lead.name} to registered Customer.`, time: 'Just now' }, ...prev])
  }

  // ----------------------------------------------------
  // INVENTORY MANAGER ACTIONS
  // ----------------------------------------------------
  const handleSaveProduct = (e) => {
    e.preventDefault()
    if (!pName || !pCode || !pBrand || !pPurchasePrice || !pSellingPrice || !pStock || !pReorder) return

    const apiPayload = {
      productId: pCode,
      productName: pName,
      category: pCategory,
      brand: pBrand,
      purchasePrice: parseFloat(pPurchasePrice),
      sellingPrice: parseFloat(pSellingPrice),
      stockQuantity: parseInt(pStock),
      status: 'Active'
    }

    import('../../services/api').then(({ default: api }) => {
      if (prodEditId) {
        const prod = products.find(p => p.id === prodEditId)
        if (prod && prod._id) {
          api.put(`/products/${prod._id}`, apiPayload).then(() => {
            loadProducts()
            setNotifications(prev => [{ id: Date.now(), text: `Updated product: ${pName}`, time: 'Just now' }, ...prev])
            setProdModalOpen(false)
            setProdEditId(null)
          }).catch(console.error)
        }
      } else {
        api.post('/products', apiPayload).then(() => {
          loadProducts()
          setNotifications(prev => [{ id: Date.now(), text: `Added product: ${pName}`, time: 'Just now' }, ...prev])
          setProdModalOpen(false)
        }).catch(console.error)
      }
    })
  }

  const handleEditProductClick = (p) => {
    setProdEditId(p.id)
    setPName(p.name)
    setPCode(p.code)
    setPCategory(p.category)
    setPBrand(p.brand)
    setPPurchasePrice(p.purchasePrice)
    setPSellingPrice(p.sellingPrice)
    setPStock(p.stock)
    setPReorder(p.reorderLevel)
    setProdModalOpen(true)
  }

  const handleDeleteProduct = (id, name) => {
    const prod = products.find(p => p.id === id)
    if (prod && prod._id) {
      import('../../services/api').then(({ default: api }) => {
        api.delete(`/products/${prod._id}`).then(() => {
          loadProducts()
          setNotifications(prev => [{ id: Date.now(), text: `Deleted product: ${name}`, time: 'Just now' }, ...prev])
        }).catch(console.error)
      })
    }
  }

  const handleStockControlSubmit = (e) => {
    e.preventDefault()
    const qty = parseInt(stockInQty)
    if (isNaN(qty) || qty <= 0) return

    const prod = products.find(p => p.id === stockInProduct)
    if (!prod) return

    // Update stock quantity
    setProducts(prev => prev.map(p => {
      if (p.id === stockInProduct) {
        const adjustment = stockInType === 'Stock Out' || stockInType === 'Sale' ? -qty : qty
        return { ...p, stock: Math.max(0, p.stock + adjustment) }
      }
      return p
    }))

    // Add to ledger
    const newLedgerRow = {
      id: `l-${Date.now()}`,
      product: prod.name,
      qty: qty,
      type: stockInType,
      date: new Date().toISOString().split('T')[0]
    }
    setStockLedger(prev => [newLedgerRow, ...prev])
    setStockInQty('')

    setNotifications(prev => [{ id: Date.now(), text: `Logged ${stockInType} transaction for ${prod.name}`, time: 'Just now' }, ...prev])
  }

  const handleReportDamageSubmit = (e) => {
    e.preventDefault()
    const qty = parseInt(damageQty)
    if (isNaN(qty) || qty <= 0 || !damageReason) return

    const prod = products.find(p => p.id === damageProduct)
    if (!prod) return

    // Deduct available stock and log damage
    setProducts(prev => prev.map(p => {
      if (p.id === damageProduct) {
        return { ...p, stock: Math.max(0, p.stock - qty) }
      }
      return p
    }))

    const newDamageRow = {
      product: prod.name,
      qty: qty,
      reason: damageReason,
      date: new Date().toISOString().split('T')[0]
    }
    setDamageHistory(prev => [newDamageRow, ...prev])

    setDamageQty('')
    setDamageReason('')

    setNotifications(prev => [{ id: Date.now(), text: `Reported ${qty} units of ${prod.name} as damaged.`, time: 'Just now' }, ...prev])
  }

  const handleRestockRequestSubmit = (e) => {
    e.preventDefault()
    const qty = parseInt(restockQty)
    if (isNaN(qty) || qty <= 0) return

    const prod = products.find(p => p.id === restockProduct)
    if (!prod) return

    const newReq = {
      id: `req-${Math.floor(200 + Math.random() * 800)}`,
      product: prod.name,
      qty: qty,
      urgency: restockUrgency,
      status: 'Pending'
    }
    setRestockRequests(prev => [newReq, ...prev])

    setRestockQty('')
    setRestockUrgency('Medium')

    setNotifications(prev => [{ id: Date.now(), text: `Created restock request for ${prod.name} (${qty} units).`, time: 'Just now' }, ...prev])
  }

  const getRoleMenu = () => {
    switch (role) {
      case 'Sales Executive':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'customers', label: 'Customers', icon: Users },
          { id: 'leads', label: 'Leads', icon: UserCheck },
          { id: 'orders', label: 'Orders', icon: ShoppingBag },
          { id: 'create_order', label: 'Create Order', icon: Plus },
          { id: 'catalog', label: 'Product Catalog', icon: Boxes },
          { id: 'targets', label: 'Sales Targets', icon: Award },
          { id: 'followups', label: 'Follow Ups', icon: Clock },
          { id: 'commission', label: 'Commission', icon: CreditCard },
          { id: 'reports', label: 'Sales Reports', icon: BarChart3 },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ]
      case 'Inventory Manager':
        return [
          { id: 'dashboard', label: 'Inventory Dashboard', icon: LayoutDashboard },
          { id: 'products', label: 'Product Manager', icon: Boxes },
          { id: 'stock', label: 'Stock Control', icon: ClipboardList },
          { id: 'alerts', label: 'Low Stock Alerts', icon: AlertTriangle },
          { id: 'barcode', label: 'Barcode System', icon: FileText },
          { id: 'reports', label: 'Inventory Reports', icon: BarChart3 }
        ]
      case 'Finance Executive':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'payments', label: 'Payments', icon: CreditCard },
          { id: 'invoices', label: 'Invoices', icon: FileText },
          { id: 'credit', label: 'Credit Management', icon: Users },
          { id: 'revenue', label: 'Revenue Tracking', icon: BarChart3 },
          { id: 'expenses', label: 'Expenses', icon: Receipt },
          { id: 'reports', label: 'Financial Reports', icon: ClipboardList },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ]
      case 'Customer Support Executive':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'complaints', label: 'Complaints', icon: AlertTriangle },
          { id: 'tickets', label: 'Support Tickets', icon: FileText },
          { id: 'refunds', label: 'Refund Requests', icon: Receipt },
          { id: 'chat', label: 'Live Chat', icon: MessageSquare },
          { id: 'queries', label: 'Customer Queries', icon: Search },
          { id: 'resolution', label: 'Resolution Center', icon: CheckSquare },
          { id: 'reports', label: 'Support Reports', icon: BarChart3 },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ]
      case 'HR Manager':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'employees', label: 'Employees', icon: Users },
          { id: 'attendance', label: 'Attendance', icon: Clock },
          { id: 'leaves', label: 'Leave Management', icon: Calendar },
          { id: 'payroll', label: 'Payroll', icon: CreditCard },
          { id: 'recruitment', label: 'Recruitment', icon: UserCheck },
          { id: 'reviews', label: 'Performance Reviews', icon: Award },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
          { id: 'reports', label: 'HR Reports', icon: ClipboardList },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ]
      case 'Delivery Coordinator':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'assignments', label: 'Delivery Assignments', icon: ClipboardList },
          { id: 'scheduling', label: 'Delivery Scheduling', icon: Calendar },
          { id: 'routes', label: 'Route Planning', icon: Compass },
          { id: 'tracking', label: 'Live Tracking', icon: Truck },
          { id: 'staff_list', label: 'Delivery Staff', icon: Users },
          { id: 'failed', label: 'Failed Deliveries', icon: AlertTriangle },
          { id: 'complaints', label: 'Delivery Complaints', icon: MessageSquare },
          { id: 'reports', label: 'Delivery Reports', icon: BarChart3 },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ]
      case 'Marketing Executive':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'campaigns', label: 'Campaigns', icon: Compass },
          { id: 'coupons', label: 'Coupons', icon: CreditCard },
          { id: 'promotions', label: 'Promotions', icon: Award },
          { id: 'sms', label: 'SMS Marketing', icon: MessageSquare },
          { id: 'email', label: 'Email Marketing', icon: FileText },
          { id: 'whatsapp', label: 'WhatsApp Campaigns', icon: MessageSquare },
          { id: 'segments', label: 'Customer Segments', icon: Users },
          { id: 'banners', label: 'Banner Management', icon: Boxes },
          { id: 'reports', label: 'Marketing Reports', icon: BarChart3 },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ]
      case 'Warehouse Staff':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'receiving', label: 'Receiving Goods', icon: Boxes },
          { id: 'storage', label: 'Storage Management', icon: Compass },
          { id: 'packing', label: 'Packing Orders', icon: Calendar },
          { id: 'dispatch', label: 'Dispatch Preparation', icon: Truck },
          { id: 'movement', label: 'Stock Movement', icon: Sprout },
          { id: 'scanner', label: 'Barcode Scanner', icon: QrCode },
          { id: 'damage_reports', label: 'Damage Reports', icon: AlertTriangle },
          { id: 'tasks', label: 'Warehouse Tasks', icon: ClipboardList },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ]
      case 'Delivery Executive':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'my_deliveries', label: 'My Deliveries', icon: Truck },
          { id: 'delivery_history', label: 'Delivery History', icon: ClipboardList },
          { id: 'otp_verification', label: 'OTP Verification', icon: CheckSquare },
          { id: 'cod_collection', label: 'COD Collection', icon: CreditCard },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ]
      default:
        return [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    }
  }

  const roleMenu = getRoleMenu()

  // Inventory Dashboard metrics
  const totalProductsCount = products.length
  const availableStockSum = products.reduce((acc, p) => acc + p.stock, 0)
  const lowStockProductsCount = products.filter(p => p.stock > 0 && p.stock <= p.reorderLevel).length
  const outOfStockProductsCount = products.filter(p => p.stock === 0).length
  const expiringCount = expiryRecords.filter(e => e.status !== 'Safe').length
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.purchasePrice * p.stock), 0)

  return (
    <div className="min-h-screen bg-[#F8FCF8] text-[#1E293B] flex flex-col lg:flex-row antialiased font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="w-80 bg-white border-r border-[#D8EAD8] flex flex-col justify-between hidden lg:flex flex-shrink-0">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-[#D8EAD8]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#236625] to-[#2F8F2F]">
              <Sprout className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#236625] tracking-tight">AgriERP</h2>
              <p className="text-xs text-gray-500 font-bold">Employee Console</p>
            </div>
          </div>

          {/* User widget */}
          <div className="m-4 p-4 rounded-2xl bg-gradient-to-br from-[#F1F8F1] to-[#D8EAD8]/30 border border-[#D8EAD8] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#236625] text-white font-bold flex items-center justify-center text-sm shadow-md">
              {role.charAt(0)}
            </div>
            <div className="min-w-0 flex-grow">
              <h4 className="text-sm font-bold text-gray-800 truncate">{role === 'Delivery Executive' ? (user?.name || 'Delivery Executive') : role === 'Inventory Manager' ? 'Milind Deshmukh' : role === 'Finance Executive' ? 'Sanjay Gore' : role === 'Customer Support Executive' ? 'Anjali Rane' : role === 'HR Manager' ? 'Sunita Joshi' : role === 'Delivery Coordinator' ? 'Vikram Shinde' : role === 'Marketing Executive' ? 'Karan Patil' : role === 'Warehouse Staff' ? 'Madhur Kadam' : 'Suresh Patil'}</h4>
              <p className="text-3xs text-[#236625] font-black uppercase tracking-wider">{role}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-2">Modules</p>
            {roleMenu.map(item => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#236625] to-[#2F8F2F] text-white shadow-lg shadow-[#236625]/20 scale-[1.02]'
                      : 'text-gray-600 hover:bg-[#F1F8F1] hover:text-[#236625]'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white animate-pulse' : 'text-gray-400'} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-[#D8EAD8]">
          <button
            onClick={() => { logout(); window.location.href = '/login' }}
            className="w-full flex items-center justify-center gap-2 p-3 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider rounded-xl border border-red-100 transition-colors"
          >
            <LogOut size={16} /> Logout Console
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="lg:hidden h-16 bg-white border-b border-[#D8EAD8] px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#236625]">
            <Sprout className="text-white w-5 h-5" />
          </div>
          <span className="text-base font-black text-[#236625] tracking-tight">AgriERP Console</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100 text-[#236625]">
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 flex">
          <div className="w-72 bg-white h-full flex flex-col justify-between shadow-2xl p-4 animate-slide-right">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#236625] text-white font-bold flex items-center justify-center">
                  {role.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{role === 'Delivery Executive' ? (user?.name || 'Delivery Executive') : role === 'Inventory Manager' ? 'Milind Deshmukh' : role === 'Finance Executive' ? 'Sanjay Gore' : role === 'Customer Support Executive' ? 'Anjali Rane' : role === 'HR Manager' ? 'Sunita Joshi' : role === 'Delivery Coordinator' ? 'Vikram Shinde' : role === 'Marketing Executive' ? 'Karan Patil' : role === 'Warehouse Staff' ? 'Madhur Kadam' : 'Suresh Patil'}</h4>
                  <p className="text-[10px] text-[#236625] font-black uppercase tracking-wider">{role}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {roleMenu.map(item => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false) }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                        isActive ? 'bg-[#236625] text-white' : 'text-gray-600 hover:bg-[#F1F8F1]'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
            <button
              onClick={() => { logout(); window.location.href = '/login' }}
              className="w-full p-2.5 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider rounded-xl border border-red-100 flex items-center justify-center gap-2"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* WORKSPACE AREA */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto max-w-screen-xl mx-auto w-full">
        
        {/* ==================================================== */}
        {/* CUSTOMER SUPPORT EXECUTIVE MODULES */}
        {/* ==================================================== */}
        {role === 'Customer Support Executive' && (
          <>
            {/* SUBMODULE: SUPPORT DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Welcome Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#236625] via-[#2F8F2F] to-[#55FA62] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Support Assistance Console</span>
                    <h1 className="text-2xl md:text-3xl font-black mt-3">Welcome, Anjali Rane!</h1>
                    <p className="text-xs mt-2 text-emerald-100 font-medium">Verify pending complaints and resolve refund requests forwarded today.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
                    <LifeBuoy size={24} />
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-emerald-200">CSAT Score</p>
                      <p className="text-base font-black">92% Satisfaction</p>
                    </div>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Open Tickets</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      {supportTickets.filter(t => t.status === 'Open').length}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Pending Complaints</p>
                    <h4 className="text-xl font-black text-rose-600 mt-1">
                      {complaints.filter(c => c.status !== 'Resolved').length}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Resolved Tickets</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      {supportTickets.filter(t => t.status === 'Resolved').length}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Refund Requests</p>
                    <h4 className="text-xl font-black text-amber-700 mt-1">
                      {refundRequests.filter(r => r.status === 'Pending Review').length}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Active Chats</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      {activeChats.filter(c => c.active).length}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">CSAT Goal</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">95%</h4>
                  </div>
                </div>

                {/* Dashboard Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Ticket trends */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Weekly Ticket Volume</h3>
                    <div className="h-44 flex items-end justify-between gap-2 pt-4">
                      {[
                        { label: 'Mon', val: 8 },
                        { label: 'Tue', val: 12 },
                        { label: 'Wed', val: 5 },
                        { label: 'Thu', val: 14 },
                        { label: 'Fri', val: 10 },
                        { label: 'Sat', val: 15 },
                        { label: 'Sun', val: 9 }
                      ].map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <span className="text-[9px] text-[#236625] font-black">{day.val}</span>
                          <div className="w-full bg-[#236625] rounded-t-md" style={{ height: `${(day.val / 20) * 100}%` }} />
                          <span className="text-3xs text-gray-400 font-bold">{day.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Complaint categories distribution */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Complaints Category Distribution</h3>
                    <div className="space-y-3 font-semibold text-xs text-gray-600">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Delay Delivery</span>
                          <span className="font-bold text-gray-850">40%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-[#236625] h-2 rounded-full" style={{ width: '40%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Damaged Products</span>
                          <span className="font-bold text-gray-850">35%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-[#236625] h-2 rounded-full" style={{ width: '35%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Billing Discrepancy</span>
                          <span className="font-bold text-gray-850">25%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-[#236625] h-2 rounded-full" style={{ width: '25%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: COMPLAINT MANAGEMENT */}
            {activeTab === 'complaints' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Farmer Complaints Directory</h3>
                    <p className="text-xs text-gray-500 font-semibold">Track and address high priority product or delivery complaints.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Complaint ID</th>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Type</th>
                        <th className="p-4 text-center">Priority</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map(c => (
                        <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{c.id}</td>
                          <td className="p-4 font-bold text-gray-700">{c.customerName}</td>
                          <td className="p-4 font-mono text-gray-500">{c.orderId}</td>
                          <td className="p-4 text-gray-600 font-medium">{c.type}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${c.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : c.priority === 'High' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-755'}`}>
                              {c.priority}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${c.status === 'Resolved' ? 'bg-[#E8F5E9] text-[#2E7D32]' : c.status === 'Closed' ? 'bg-gray-100 text-gray-700' : 'bg-amber-50 text-amber-700'}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            {c.status === 'Open' && (
                              <button
                                onClick={() => {
                                  setComplaints(prev => prev.map(item => item.id === c.id ? { ...item, status: 'Assigned' } : item))
                                }}
                                className="bg-[#236625] text-white px-2 py-0.5 rounded text-3xs font-black uppercase tracking-wider"
                              >
                                Assign
                              </button>
                            )}
                            {c.status !== 'Resolved' && c.status !== 'Closed' && (
                              <button
                                onClick={() => {
                                  setComplaints(prev => prev.map(item => item.id === c.id ? { ...item, status: 'Resolved' } : item))
                                  setNotifications(prev => [
                                    { id: Date.now(), text: `Complaint ${c.id} marked as resolved`, time: 'Just now' },
                                    ...prev
                                  ])
                                }}
                                className="bg-emerald-600 text-white px-2 py-0.5 rounded text-3xs font-black uppercase tracking-wider"
                              >
                                Resolve
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedComplaint(c)}
                              className="text-[#236625] underline font-bold uppercase text-[10px]"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Complaint modal */}
                {selectedComplaint && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setSelectedComplaint(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Complaint Details</h3>
                      <div className="text-xs text-gray-600 space-y-2 border-b border-[#F1F8F1] pb-4 font-semibold">
                        <p><strong>Complaint ID:</strong> {selectedComplaint.id}</p>
                        <p><strong>Customer Name:</strong> {selectedComplaint.customerName}</p>
                        <p><strong>Order Reference:</strong> {selectedComplaint.orderId}</p>
                        <p><strong>Complaint Issue:</strong> {selectedComplaint.type}</p>
                        <p><strong>Priority Level:</strong> {selectedComplaint.priority}</p>
                        <p><strong>Status:</strong> {selectedComplaint.status}</p>
                      </div>
                      <button onClick={() => setSelectedComplaint(null)} className="w-full btn-secondary text-xs uppercase py-2.5">Close</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: SUPPORT TICKETS */}
            {activeTab === 'tickets' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Customer Support Tickets</h3>
                    <p className="text-xs text-gray-500 font-semibold">General technical and product configuration tickets.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Ticket ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Subject</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supportTickets.map(t => (
                        <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{t.id}</td>
                          <td className="p-4 font-bold text-gray-700">{t.customer}</td>
                          <td className="p-4 text-gray-650 font-semibold">{t.subject}</td>
                          <td className="p-4 font-bold text-[#236625]">{t.category}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${t.status === 'Resolved' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-amber-50 text-amber-700'}`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            {t.status === 'Open' && (
                              <button
                                onClick={() => {
                                  setSupportTickets(prev => prev.map(item => item.id === t.id ? { ...item, status: 'Resolved' } : item))
                                }}
                                className="bg-[#236625] text-white px-2 py-0.5 rounded text-3xs font-black uppercase tracking-wider"
                              >
                                Resolve
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedSupportTicket(t)}
                              className="text-[#236625] underline font-bold uppercase text-[10px]"
                            >
                              Open Ticket
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Ticket modal */}
                {selectedSupportTicket && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setSelectedSupportTicket(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Support Ticket Details</h3>
                      <div className="text-xs text-gray-600 space-y-2 border-b border-[#F1F8F1] pb-4 font-semibold">
                        <p><strong>Ticket ID:</strong> {selectedSupportTicket.id}</p>
                        <p><strong>Customer:</strong> {selectedSupportTicket.customer}</p>
                        <p><strong>Subject:</strong> {selectedSupportTicket.subject}</p>
                        <p><strong>Category:</strong> {selectedSupportTicket.category}</p>
                        <p><strong>Status:</strong> {selectedSupportTicket.status}</p>
                        <p><strong>Date Opened:</strong> {selectedSupportTicket.date}</p>
                      </div>
                      <button onClick={() => setSelectedSupportTicket(null)} className="w-full btn-secondary text-xs uppercase py-2.5">Close</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: REFUND REQUESTS */}
            {activeTab === 'refunds' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Refund Claims Registry</h3>
                    <p className="text-xs text-gray-500 font-semibold">Review damaged or return-order refunds prior to forwarding to finance.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Refund ID</th>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Reason</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {refundRequests.map(r => (
                        <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{r.id}</td>
                          <td className="p-4 font-mono text-gray-500">{r.orderId}</td>
                          <td className="p-4 font-bold text-gray-700">{r.customer}</td>
                          <td className="p-4 font-black">₹{r.amount.toLocaleString()}</td>
                          <td className="p-4 text-gray-600 font-medium">{r.reason}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${r.status === 'Approved' ? 'bg-[#E8F5E9] text-[#2E7D32]' : r.status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            {r.status === 'Pending Review' && (
                              <>
                                <button
                                  onClick={() => {
                                    setRefundRequests(prev => prev.map(item => item.id === r.id ? { ...item, status: 'Approved' } : item))
                                  }}
                                  className="bg-emerald-600 text-white px-2 py-0.5 rounded text-3xs font-black uppercase tracking-wider"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setRefundRequests(prev => prev.map(item => item.id === r.id ? { ...item, status: 'Rejected' } : item))
                                  }}
                                  className="bg-rose-600 text-white px-2 py-0.5 rounded text-3xs font-black uppercase tracking-wider"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => {
                                    setRefundRequests(prev => prev.map(item => item.id === r.id ? { ...item, status: 'Forwarded to Finance' } : item))
                                    setNotifications(prev => [
                                      { id: Date.now(), text: `Refund request ${r.id} forwarded to finance department`, time: 'Just now' },
                                      ...prev
                                    ])
                                  }}
                                  className="bg-blue-600 text-white px-2 py-0.5 rounded text-3xs font-black uppercase tracking-wider"
                                >
                                  Forward
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setSelectedRefundRequest(r)}
                              className="text-[#236625] underline font-bold uppercase text-[10px]"
                            >
                              Review Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Review Request Modal */}
                {selectedRefundRequest && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setSelectedRefundRequest(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Refund Claim Details</h3>
                      <div className="text-xs text-gray-600 space-y-2 border-b border-[#F1F8F1] pb-4 font-semibold">
                        <p><strong>Refund ID:</strong> {selectedRefundRequest.id}</p>
                        <p><strong>Order ID:</strong> {selectedRefundRequest.orderId}</p>
                        <p><strong>Customer:</strong> {selectedRefundRequest.customer}</p>
                        <p><strong>Amount:</strong> ₹{selectedRefundRequest.amount.toLocaleString()}</p>
                        <p><strong>Claim Reason:</strong> {selectedRefundRequest.reason}</p>
                        <p><strong>Status:</strong> {selectedRefundRequest.status}</p>
                      </div>
                      <button onClick={() => setSelectedRefundRequest(null)} className="w-full btn-secondary text-xs uppercase py-2.5">Close</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: LIVE CHAT */}
            {activeTab === 'chat' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                  
                  {/* Left Pane: Active Chat list */}
                  <div className="p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-3">
                    <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Active Chat Sessions</h4>
                    <div className="space-y-2">
                      {activeChats.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedChatId(c.id)}
                          className={`w-full text-left p-3 rounded-2xl border text-xs font-semibold flex justify-between items-center transition-all ${
                            selectedChatId === c.id
                              ? 'border-[#236625] bg-[#F1F8F1]/40'
                              : 'border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          <div>
                            <p className="text-gray-800">{c.farmer}</p>
                            <p className="text-3xs text-gray-400">{c.phone}</p>
                          </div>
                          {c.active && (
                            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Middle Pane: Chat Window */}
                  <div className="p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm flex flex-col justify-between md:col-span-2 min-h-[400px]">
                    <div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
                        <h4 className="text-xs font-bold text-gray-800">
                          Chatting with {activeChats.find(c => c.id === selectedChatId)?.farmer}
                        </h4>
                        <button
                          onClick={() => {
                            setActiveChats(prev => prev.map(c => c.id === selectedChatId ? { ...c, active: false } : c))
                          }}
                          className="text-rose-600 text-3xs font-black uppercase border border-rose-100 hover:bg-rose-50 px-2 py-1 rounded"
                        >
                          Close Chat
                        </button>
                      </div>

                      {/* Chat messages */}
                      <div className="space-y-3 h-64 overflow-y-auto pr-2">
                        {activeChats.find(c => c.id === selectedChatId)?.messages.map((m, idx) => (
                          <div key={idx} className={`flex ${m.sender === 'support' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-2xl text-xs max-w-xs ${m.sender === 'support' ? 'bg-[#236625] text-white rounded-tr-none' : 'bg-gray-100 text-gray-700 rounded-tl-none'}`}>
                              {m.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chat Input */}
                    <div className="border-t border-gray-100 pt-3 flex gap-2">
                      <input
                        type="text"
                        value={chatInputText}
                        onChange={(e) => setChatInputText(e.target.value)}
                        placeholder="Type support reply..."
                        className="flex-grow px-3 py-2 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                      />
                      <button
                        onClick={() => {
                          if (!chatInputText) return
                          setActiveChats(prev => prev.map(c => {
                            if (c.id === selectedChatId) {
                              return { ...c, messages: [...c.messages, { sender: 'support', text: chatInputText }] }
                            }
                            return c
                          }))
                          setChatInputText('')
                        }}
                        className="btn-primary text-xs uppercase px-4 py-2"
                      >
                        Reply
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* SUBMODULE: CUSTOMER QUERIES */}
            {activeTab === 'queries' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">General Customer Queries</h3>
                    <p className="text-xs text-gray-500 font-semibold">Respond to general crop help, franchise, and dealer inquiries.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Query ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Query Issue</th>
                        <th className="p-4 text-center">Priority</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerQueries.map(q => (
                        <tr key={q.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{q.id}</td>
                          <td className="p-4 font-bold text-gray-700">{q.customer}</td>
                          <td className="p-4 text-gray-600 font-medium">{q.type}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${q.priority === 'High' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                              {q.priority}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${q.status === 'Closed' ? 'bg-gray-100 text-gray-700' : q.status === 'Escalated' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                              {q.status}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            {q.status === 'Open' && (
                              <>
                                <button
                                  onClick={() => {
                                    setCustomerQueries(prev => prev.map(item => item.id === q.id ? { ...item, status: 'Closed' } : item))
                                  }}
                                  className="bg-emerald-600 text-white px-2 py-0.5 rounded text-3xs font-black uppercase tracking-wider"
                                >
                                  Close
                                </button>
                                <button
                                  onClick={() => {
                                    setCustomerQueries(prev => prev.map(item => item.id === q.id ? { ...item, status: 'Escalated' } : item))
                                    setNotifications(prev => [
                                      { id: Date.now(), text: `Query ${q.id} escalated to administrator`, time: 'Just now' },
                                      ...prev
                                    ])
                                  }}
                                  className="bg-rose-600 text-white px-2 py-0.5 rounded text-3xs font-black uppercase tracking-wider"
                                >
                                  Escalate
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setSelectedQuery(q)}
                              className="text-[#236625] underline font-bold uppercase text-[10px]"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Query modal */}
                {selectedQuery && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setSelectedQuery(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Customer Query Details</h3>
                      <div className="text-xs text-gray-600 space-y-2 border-b border-[#F1F8F1] pb-4 font-semibold">
                        <p><strong>Query ID:</strong> {selectedQuery.id}</p>
                        <p><strong>Customer Name:</strong> {selectedQuery.customer}</p>
                        <p><strong>Subject Type:</strong> {selectedQuery.type}</p>
                        <p><strong>Priority Level:</strong> {selectedQuery.priority}</p>
                        <p><strong>Status:</strong> {selectedQuery.status}</p>
                      </div>
                      <button onClick={() => setSelectedQuery(null)} className="w-full btn-secondary text-xs uppercase py-2.5">Close</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: RESOLUTION CENTER */}
            {activeTab === 'resolution' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-800">Resolution Operations Overview</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-2xl text-center">
                      <p className="text-3xs font-extrabold uppercase text-gray-400">Escalated Cases</p>
                      <h4 className="text-xl font-black text-rose-600 mt-1">
                        {customerQueries.filter(q => q.status === 'Escalated').length} cases
                      </h4>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl text-center">
                      <p className="text-3xs font-extrabold uppercase text-gray-400">Pending Resolution</p>
                      <h4 className="text-xl font-black text-amber-700 mt-1">
                        {complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length} cases
                      </h4>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl text-center">
                      <p className="text-3xs font-extrabold uppercase text-gray-400">Total Solved Center Cases</p>
                      <h4 className="text-xl font-black text-emerald-700 mt-1">142 cases</h4>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: SUPPORT REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-800">Export Customer Support Reports</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const printWindow = window.open('', '_blank');
                          printWindow.document.write(`
                            <html>
                              <head><title>AgriERP Support Audit Report</title></head>
                              <body style="font-family: Arial; padding: 40px; color: #333;">
                                <h2>Customer Support Audit Report</h2>
                                <p><strong>Generated By:</strong> Anjali Rane</p>
                                <p><strong>Role:</strong> Customer Support Executive</p>
                                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                                <hr/>
                                <p>This document details support metrics, tickets, and resolved customer claims.</p>
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                          printWindow.print();
                        }}
                        className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 px-3 py-1.5 rounded-xl shadow-sm"
                      >
                        <FileDown size={14} /> Export to PDF
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 border-b border-[#F1F8F1] pb-4">
                    {['tickets', 'complaints', 'refunds', 'resolutions'].map(t => (
                      <button
                        key={t}
                        onClick={() => setReportType(t)}
                        className={`px-4 py-2 text-xs font-black uppercase border-b-2 transition-all ${
                          reportType === t ? 'border-[#236625] text-[#236625]' : 'border-transparent text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        {t} Report
                      </button>
                    ))}
                  </div>

                  <div className="table-wrapper">
                    {reportType === 'tickets' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Ticket ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Subject</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {supportTickets.map(t => (
                            <tr key={t.id} className="border-b border-gray-50">
                              <td className="p-4 font-mono font-bold text-gray-500">{t.id}</td>
                              <td className="p-4 font-bold text-gray-700">{t.customer}</td>
                              <td className="p-4 text-gray-600">{t.subject}</td>
                              <td className="p-4 font-bold text-[#236625]">{t.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {reportType === 'complaints' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Complaint ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {complaints.map(c => (
                            <tr key={c.id} className="border-b border-gray-50">
                              <td className="p-4 font-mono font-bold text-gray-500">{c.id}</td>
                              <td className="p-4 font-bold text-gray-700">{c.customerName}</td>
                              <td className="p-4 text-gray-600">{c.type}</td>
                              <td className="p-4 font-bold text-rose-600">{c.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {reportType === 'refunds' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Refund ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {refundRequests.map(r => (
                            <tr key={r.id} className="border-b border-gray-50">
                              <td className="p-4 font-mono font-bold text-gray-500">{r.id}</td>
                              <td className="p-4 font-bold text-gray-700">{r.customer}</td>
                              <td className="p-4 font-black">₹{r.amount.toLocaleString()}</td>
                              <td className="p-4 text-gray-500 font-bold">{r.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {reportType === 'resolutions' && (
                      <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs font-semibold text-gray-600">
                        <p>Total logged cases resolved: <strong>142</strong></p>
                        <p>Average resolution time: <strong>4.2 hours</strong></p>
                        <p>Escalation frequency rate: <strong>3.1%</strong></p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: SUPPORT NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="text-[#236625]" size={16} /> Support Notifications Feed
                  </h3>
                  <div className="space-y-3">
                    {[
                      { text: 'New complaint received: Delay Delivery (CMP-2091) from Rajesh Kumar.', time: '10m ago' },
                      { text: 'New support ticket: Drip Kit Installation Guide (TCK-8012) from Vijay Patil.', time: '1 hour ago' },
                      { text: 'New refund claim submitted: REF-301 from Amit Yadav.', time: '2 hours ago' },
                      { text: 'Live chat request: Amit Yadav has initiated a support chat.', time: '3 hours ago' }
                    ].map((n, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center text-xs font-semibold text-gray-700 hover:bg-[#F1F8F1]/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#236625] animate-pulse" />
                          <span>{n.text}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ==================================================== */}
        {/* FINANCE EXECUTIVE MODULES */}
        {/* ==================================================== */}
        {role === 'Finance Executive' && (
          <>
            {/* SUBMODULE: FINANCE DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Welcome Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#236625] via-[#2F8F2F] to-[#55FA62] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Financial Control Console</span>
                    <h1 className="text-2xl md:text-3xl font-black mt-3">Welcome, Sanjay Gore!</h1>
                    <p className="text-xs mt-2 text-emerald-100 font-medium">Verify outstanding credit collections. Keep track of daily expenses and revenue milestones.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
                    <CreditCard size={24} />
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-emerald-200">Total Net Profit</p>
                      <p className="text-base font-black">
                        ₹{(payments.reduce((acc, p) => acc + p.amount, 0) - expenses.reduce((acc, e) => acc + e.amount, 0)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Today's Revenue</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      ₹{payments.filter(p => p.date === '2026-06-02').reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Monthly Revenue</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      ₹{payments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between bg-amber-50 border-amber-200">
                    <p className="text-3xs font-extrabold uppercase text-amber-700">Outstanding Payments</p>
                    <h4 className="text-xl font-black text-amber-700 mt-1">
                      ₹{creditCustomers.reduce((acc, c) => acc + c.outstanding, 0).toLocaleString()}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Credit Recovered</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">₹12,500</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between bg-rose-50 border-rose-200">
                    <p className="text-3xs font-extrabold uppercase text-rose-700">Total Expenses</p>
                    <h4 className="text-xl font-black text-rose-700 mt-1">
                      ₹{expenses.reduce((acc, e) => acc + e.amount, 0).toLocaleString()}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Net Profit</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      ₹{(payments.reduce((acc, p) => acc + p.amount, 0) - expenses.reduce((acc, e) => acc + e.amount, 0)).toLocaleString()}
                    </h4>
                  </div>
                </div>

                {/* Dashboard Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Revenue curve graph */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Weekly Revenue Trend (₹)</h3>
                    <div className="h-44 flex items-end justify-between gap-2 pt-4">
                      {[
                        { label: 'Mon', val: 12000 },
                        { label: 'Tue', val: 18500 },
                        { label: 'Wed', val: 8000 },
                        { label: 'Thu', val: 24000 },
                        { label: 'Fri', val: 15000 },
                        { label: 'Sat', val: 32000 },
                        { label: 'Sun', val: 23930 }
                      ].map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <span className="text-[9px] text-[#236625] font-black">{day.val / 1000}k</span>
                          <div className="w-full bg-[#236625] rounded-t-md hover:opacity-85 transition-opacity" style={{ height: `${(day.val / 35000) * 100}%` }} />
                          <span className="text-3xs text-gray-400 font-bold">{day.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expense category breakdown */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Expenses Distribution</h3>
                    <div className="space-y-3 font-semibold text-xs text-gray-600">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Inventory Purchase</span>
                          <span className="font-bold text-gray-850">₹45,000 (81%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-rose-500 h-2 rounded-full" style={{ width: '81%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Marketing</span>
                          <span className="font-bold text-gray-850">₹5,000 (9%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-rose-400 h-2 rounded-full" style={{ width: '9%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Transportation</span>
                          <span className="font-bold text-gray-850">₹3,500 (6.3%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-rose-300 h-2 rounded-full" style={{ width: '6.3%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Utilities</span>
                          <span className="font-bold text-gray-850">₹1,800 (3.2%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-rose-200 h-2 rounded-full" style={{ width: '3.2%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: PAYMENTS LIST */}
            {activeTab === 'payments' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Incoming Payments Registry</h3>
                    <p className="text-xs text-gray-500 font-semibold">Verify transactions from farmers and wholesale partners.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Payment ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{p.id}</td>
                          <td className="p-4 font-bold text-gray-700">{p.customer}</td>
                          <td className="p-4 font-black">₹{p.amount.toLocaleString()}</td>
                          <td className="p-4 text-gray-500 font-bold">{p.method}</td>
                          <td className="p-4 text-gray-500">{p.date}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${p.status === 'Verified' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-amber-50 text-amber-700'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            {p.status === 'Pending' && (
                              <button
                                onClick={() => {
                                  setPayments(prev => prev.map(item => item.id === p.id ? { ...item, status: 'Verified' } : item))
                                  if (p.orderId) {
                                    updateOrderDb(p.orderId, { orderStatus: 'Completed', paymentStatus: 'Paid' })
                                  } else {
                                    const match = orders.find(o => o.customerName === p.customer && o.status === 'Delivered')
                                    if (match) updateOrderDb(match.id, { orderStatus: 'Completed', paymentStatus: 'Paid' })
                                  }
                                  setNotifications(prev => [
                                    { id: Date.now(), text: `Payment transaction ${p.id} verified successfully. Order status updated to Paid & Completed.`, time: 'Just now' },
                                    ...prev
                                  ])
                                }}
                                className="bg-[#236625] text-white px-2.5 py-1 rounded-lg text-3xs font-black uppercase tracking-wider"
                              >
                                Verify
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedPayment(p)}
                              className="text-[#236625] underline font-bold uppercase text-[10px]"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Details popup */}
                {selectedPayment && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setSelectedPayment(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Payment Transaction details</h3>
                      <div className="text-xs text-gray-600 space-y-2 border-b border-[#F1F8F1] pb-4 font-semibold">
                        <p><strong>Payment ID:</strong> {selectedPayment.id}</p>
                        <p><strong>Farmer Name:</strong> {selectedPayment.customer}</p>
                        <p><strong>Amount:</strong> ₹{selectedPayment.amount.toLocaleString()}</p>
                        <p><strong>Payment Method:</strong> {selectedPayment.method}</p>
                        <p><strong>Transaction Date:</strong> {selectedPayment.date}</p>
                        <p><strong>Status:</strong> {selectedPayment.status}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => {
                            const printWindow = window.open('', '_blank');
                            printWindow.document.write(`
                              <html>
                                <head><title>Payment Receipt ${selectedPayment.id}</title></head>
                                <body style="font-family: Arial; padding: 40px; color: #333;">
                                  <h2>AgriERP Retail Payment Receipt</h2>
                                  <hr/>
                                  <p><strong>Payment ID:</strong> ${selectedPayment.id}</p>
                                  <p><strong>Customer:</strong> ${selectedPayment.customer}</p>
                                  <p><strong>Amount Paid:</strong> ₹${selectedPayment.amount.toLocaleString()}</p>
                                  <p><strong>Method:</strong> ${selectedPayment.method}</p>
                                  <p><strong>Date:</strong> ${selectedPayment.date}</p>
                                  <hr/>
                                  <p>Payment Status: <strong>VERIFIED</strong></p>
                                </body>
                              </html>
                            `);
                            printWindow.document.close();
                            printWindow.print();
                          }}
                          className="btn-primary text-xs uppercase py-2.5"
                        >
                          Print Receipt
                        </button>
                        <button onClick={() => setSelectedPayment(null)} className="btn-secondary text-xs uppercase py-2.5">Close</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: INVOICES */}
            {activeTab === 'invoices' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Financial Retail Invoices</h3>
                    <p className="text-xs text-gray-500 font-semibold">Retrieve and export print invoices for audit compliance.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Invoice Number</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">INV-{p.id.split('-')[1]}</td>
                          <td className="p-4 font-bold text-gray-700">{p.customer}</td>
                          <td className="p-4 font-black">₹{p.amount.toLocaleString()}</td>
                          <td className="p-4 text-gray-500">{p.date}</td>
                          <td className="p-4 text-center">
                            <span className="status-badge bg-[#E8F5E9] text-[#2E7D32]">Paid</span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            <button
                              onClick={() => {
                                const printWindow = window.open('', '_blank');
                                printWindow.document.write(`
                                  <html>
                                    <head><title>AgriERP Invoice INV-${p.id.split('-')[1]}</title></head>
                                    <body style="font-family: Arial; padding: 40px; color: #333;">
                                      <h2>AgriERP Commercial Invoice</h2>
                                      <hr/>
                                      <p><strong>Invoice ID:</strong> INV-${p.id.split('-')[1]}</p>
                                      <p><strong>Customer:</strong> ${p.customer}</p>
                                      <p><strong>Amount:</strong> ₹${p.amount.toLocaleString()}</p>
                                      <p><strong>Date:</strong> ${p.date}</p>
                                      <p>Standard GST 18% is accounted in transaction values.</p>
                                    </body>
                                  </html>
                                `);
                                printWindow.document.close();
                                printWindow.print();
                              }}
                              className="text-[#236625] underline font-bold uppercase text-[10px]"
                            >
                              Download PDF / Print
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBMODULE: CREDIT MANAGEMENT */}
            {activeTab === 'credit' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Credit Ledger (Udhari Account)</h3>
                    <p className="text-xs text-gray-500 font-semibold">Monitor credit balances and log partial or full collections.</p>
                  </div>
                  <button onClick={() => setCollectionModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">Record Collection</button>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Farmer Name</th>
                        <th className="p-4">Village</th>
                        <th className="p-4">Outstanding Credit</th>
                        <th className="p-4">Due Date</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {creditCustomers.map(cc => (
                        <tr key={cc.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-bold text-gray-700">{cc.name}</td>
                          <td className="p-4 text-gray-600">{cc.village}</td>
                          <td className="p-4 font-black text-rose-600">₹{cc.outstanding.toLocaleString()}</td>
                          <td className="p-4 text-gray-500">{cc.dueDate}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${cc.status === 'Paid' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-rose-50 text-rose-700'}`}>
                              {cc.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedCreditLedger(cc)}
                              className="text-[#236625] underline font-bold uppercase text-[10px]"
                            >
                              View Ledger
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Record Collection Modal */}
                {collectionModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setCollectionModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Record Credit Payment Collection</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Select Credit Customer</label>
                          <select
                            value={collectionCustId}
                            onChange={(e) => setCollectionCustId(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold"
                          >
                            <option value="">-- Choose Account --</option>
                            {creditCustomers.filter(c => c.outstanding > 0).map(c => (
                              <option key={c.id} value={c.id}>{c.name} (Outstanding: ₹{c.outstanding})</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Collection Amount (₹)</label>
                          <input
                            type="number"
                            value={collectionAmt}
                            onChange={(e) => setCollectionAmt(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                            placeholder="e.g. 5000"
                          />
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              const amt = parseFloat(collectionAmt)
                              if (!collectionCustId || isNaN(amt) || amt <= 0) return
                              setCreditCustomers(prev => prev.map(c => {
                                if (c.id === collectionCustId) {
                                  const rem = Math.max(0, c.outstanding - amt)
                                  return { ...c, outstanding: rem, status: rem === 0 ? 'Paid' : 'Due' }
                                }
                                return c
                              }))
                              
                              const targetCust = creditCustomers.find(c => c.id === collectionCustId)
                              setPayments(prev => [
                                {
                                  id: `PAY-${Date.now().toString().slice(-4)}`,
                                  customer: targetCust?.name || 'Customer',
                                  amount: amt,
                                  method: 'Cash',
                                  date: new Date().toISOString().split('T')[0],
                                  status: 'Verified'
                                },
                                ...prev
                              ])

                              setNotifications(prev => [
                                { id: Date.now(), text: `Collected ₹${amt} credit from ${targetCust?.name}`, time: 'Just now' },
                                ...prev
                              ])

                              setCollectionCustId('')
                              setCollectionAmt('')
                              setCollectionModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Record
                          </button>
                          <button onClick={() => setCollectionModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Ledger popover */}
                {selectedCreditLedger && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setSelectedCreditLedger(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Ledger details: {selectedCreditLedger.name}</h3>
                      <div className="space-y-3 font-semibold text-xs text-gray-600">
                        <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1">
                          <p className="flex justify-between"><span>Credit Limit:</span> <span className="font-bold">₹15,000</span></p>
                          <p className="flex justify-between"><span>Outstanding Credit:</span> <span className="font-bold text-rose-600">₹{selectedCreditLedger.outstanding.toLocaleString()}</span></p>
                          <p className="flex justify-between"><span>Repayment Date:</span> <span className="font-bold">{selectedCreditLedger.dueDate}</span></p>
                        </div>
                        <h4 className="font-black text-gray-700 uppercase tracking-widest text-[10px] pt-2">Transaction History</h4>
                        <div className="space-y-1.5 max-h-28 overflow-y-auto">
                          <div className="flex justify-between text-3xs border-b border-gray-100 pb-1">
                            <span>Initial Fertilizer Purchase Credit</span>
                            <span className="font-bold">₹{selectedCreditLedger.outstanding > 0 ? (selectedCreditLedger.outstanding + 2000).toLocaleString() : '10,000'}</span>
                          </div>
                          {selectedCreditLedger.outstanding === 0 && (
                            <div className="flex justify-between text-3xs text-emerald-700">
                              <span>Full Repayment Collected</span>
                              <span className="font-bold">✓ Cleared</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button onClick={() => setSelectedCreditLedger(null)} className="w-full btn-secondary text-xs uppercase py-2.5">Close</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: REVENUE TRACKING */}
            {activeTab === 'revenue' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Revenue Analytics</h3>
                    <p className="text-xs text-gray-500 font-semibold">Inspect cash flow and comparison curves over time.</p>
                  </div>
                  <div className="flex gap-2">
                    {['daily', 'monthly', 'yearly'].map(tf => (
                      <button
                        key={tf}
                        onClick={() => setRevenueTimeframe(tf)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all uppercase ${
                          revenueTimeframe === tf
                            ? 'bg-[#236625] text-white shadow-md'
                            : 'bg-[#F1F8F1] text-[#236625] hover:bg-[#D8EAD8]/40'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-gray-800">Revenue Stream Analysis ({revenueTimeframe.toUpperCase()})</h4>
                  <div className="h-48 flex items-end justify-between gap-4 pt-4">
                    {revenueTimeframe === 'daily' && [
                      { label: '09:00', val: 3200 },
                      { label: '11:00', val: 7800 },
                      { label: '13:00', val: 4500 },
                      { label: '15:00', val: 9800 },
                      { label: '17:00', val: 12000 },
                      { label: '19:00', val: 6500 }
                    ].map((h, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <span className="text-[10px] text-[#236625] font-black">₹{h.val}</span>
                        <div className="w-full bg-[#236625] rounded-t-md" style={{ height: `${(h.val / 15000) * 100}%` }} />
                        <span className="text-3xs text-gray-400 font-bold">{h.label}</span>
                      </div>
                    ))}
                    {revenueTimeframe === 'monthly' && [
                      { label: 'Jan', val: 180000 },
                      { label: 'Feb', val: 240000 },
                      { label: 'Mar', val: 310000 },
                      { label: 'Apr', val: 215000 },
                      { label: 'May', val: 380000 },
                      { label: 'Jun', val: 23930 }
                    ].map((m, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <span className="text-[10px] text-[#236625] font-black">₹{(m.val / 1000).toFixed(0)}k</span>
                        <div className="w-full bg-[#236625] rounded-t-md" style={{ height: `${(m.val / 400000) * 100}%` }} />
                        <span className="text-3xs text-gray-400 font-bold">{m.label}</span>
                      </div>
                    ))}
                    {revenueTimeframe === 'yearly' && [
                      { label: '2023', val: 1824000 },
                      { label: '2024', val: 2450000 },
                      { label: '2025', val: 3824500 },
                      { label: '2026 (YTD)', val: 1145000 }
                    ].map((y, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <span className="text-[10px] text-[#236625] font-black">₹{(y.val / 100000).toFixed(1)}L</span>
                        <div className="w-full bg-[#236625] rounded-t-md" style={{ height: `${(y.val / 4000000) * 100}%` }} />
                        <span className="text-3xs text-gray-400 font-bold">{y.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: EXPENSES */}
            {activeTab === 'expenses' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Operational Expenses Registry</h3>
                    <p className="text-xs text-gray-500 font-semibold">Log logistics, salaries, marketing, and inventory purchases.</p>
                  </div>
                  <button onClick={() => setExpenseModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">Add Expense</button>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Expense ID</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map(e => (
                        <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{e.id}</td>
                          <td className="p-4 font-bold text-gray-700">{e.category}</td>
                          <td className="p-4 font-black text-rose-600">₹{e.amount.toLocaleString()}</td>
                          <td className="p-4 text-gray-500">{e.date}</td>
                          <td className="p-4 text-gray-600 font-medium">{e.description}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => {
                                setExpenses(prev => prev.filter(item => item.id !== e.id))
                              }}
                              className="text-rose-600 underline font-bold uppercase text-[10px]"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Expense Modal */}
                {expenseModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setExpenseModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Log Operational Expense</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Category</label>
                          <select
                            value={newExpCategory}
                            onChange={(e) => setNewExpCategory(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold"
                          >
                            <option>Salary</option>
                            <option>Transportation</option>
                            <option>Marketing</option>
                            <option>Utilities</option>
                            <option>Inventory Purchase</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Amount (₹)</label>
                          <input
                            type="number"
                            value={newExpAmount}
                            onChange={(e) => setNewExpAmount(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                            placeholder="e.g. 1500"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Date</label>
                          <input
                            type="date"
                            value={newExpDate}
                            onChange={(e) => setNewExpDate(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Description</label>
                          <input
                            type="text"
                            value={newExpDesc}
                            onChange={(e) => setNewExpDesc(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                            placeholder="Describe the expense details"
                            required
                          />
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              const amt = parseFloat(newExpAmount)
                              if (!newExpDesc || isNaN(amt) || amt <= 0) return
                              setExpenses(prev => [
                                {
                                  id: `EXP-${Date.now().toString().slice(-3)}`,
                                  category: newExpCategory,
                                  amount: amt,
                                  date: newExpDate || new Date().toISOString().split('T')[0],
                                  description: newExpDesc
                                },
                                ...prev
                              ])
                              setNotifications(prev => [
                                { id: Date.now(), text: `Logged new expense: ₹${amt} under ${newExpCategory}`, time: 'Just now' },
                                ...prev
                              ])
                              setNewExpAmount('')
                              setNewExpDesc('')
                              setExpenseModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Add Log
                          </button>
                          <button onClick={() => setExpenseModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: FINANCIAL REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-800">Export Financial Reports</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const printWindow = window.open('', '_blank');
                          printWindow.document.write(`
                            <html>
                              <head><title>AgriERP Financial Audit Report</title></head>
                              <body style="font-family: Arial; padding: 40px; color: #333;">
                                <h2>Finance Executive Audit Report</h2>
                                <p><strong>Generated By:</strong> Sanjay Gore</p>
                                <p><strong>Role:</strong> Finance Executive</p>
                                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                                <hr/>
                                <p>This audit sheet confirms standard financial calculations for AgriERP operations.</p>
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                          printWindow.print();
                        }}
                        className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 px-3 py-1.5 rounded-xl shadow-sm"
                      >
                        <FileDown size={14} /> Export to PDF
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 border-b border-[#F1F8F1] pb-4">
                    {['revenue', 'expense', 'p&l', 'credit', 'collection'].map(t => (
                      <button
                        key={t}
                        onClick={() => setReportType(t)}
                        className={`px-4 py-2 text-xs font-black uppercase border-b-2 transition-all ${
                          reportType === t ? 'border-[#236625] text-[#236625]' : 'border-transparent text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        {t} Report
                      </button>
                    ))}
                  </div>

                  <div className="table-wrapper">
                    {reportType === 'revenue' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Transaction ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Method</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map(p => (
                            <tr key={p.id} className="border-b border-gray-50">
                              <td className="p-4 font-mono font-bold text-gray-500">{p.id}</td>
                              <td className="p-4 font-bold text-gray-700">{p.customer}</td>
                              <td className="p-4 font-black">₹{p.amount.toLocaleString()}</td>
                              <td className="p-4 text-gray-500 font-bold">{p.method}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {reportType === 'expense' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Expense ID</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenses.map(e => (
                            <tr key={e.id} className="border-b border-gray-50">
                              <td className="p-4 font-mono font-bold text-gray-500">{e.id}</td>
                              <td className="p-4 font-bold text-gray-700">{e.category}</td>
                              <td className="p-4 font-black text-rose-600">₹{e.amount.toLocaleString()}</td>
                              <td className="p-4 text-gray-600">{e.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {reportType === 'p&l' && (
                      <div className="p-4 bg-gray-50 rounded-2xl space-y-3 text-xs font-semibold text-gray-600">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span>Total Revenue Streams:</span>
                          <span className="font-bold text-emerald-700">₹{payments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span>Total Logged Expenses:</span>
                          <span className="font-bold text-rose-600">₹{expenses.reduce((acc, e) => acc + e.amount, 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-900 font-black text-sm pt-2">
                          <span>Net Operating Profit:</span>
                          <span>₹{(payments.reduce((acc, p) => acc + p.amount, 0) - expenses.reduce((acc, e) => acc + e.amount, 0)).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                    {reportType === 'credit' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Farmer</th>
                            <th className="p-4">Outstanding Credit</th>
                            <th className="p-4">Due Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {creditCustomers.map(cc => (
                            <tr key={cc.id} className="border-b border-gray-50">
                              <td className="p-4 font-bold text-gray-700">{cc.name}</td>
                              <td className="p-4 font-black text-rose-600">₹{cc.outstanding.toLocaleString()}</td>
                              <td className="p-4 text-gray-500">{cc.dueDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {reportType === 'collection' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Date</th>
                            <th className="p-4">Collector</th>
                            <th className="p-4 text-center">Amount Collected</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-50">
                            <td className="p-4 text-gray-500">2026-06-02</td>
                            <td className="p-4 font-bold text-gray-700">Sanjay Gore</td>
                            <td className="p-4 text-center font-black text-emerald-700">₹12,500</td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: FINANCE NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="text-[#236625]" size={16} /> Finance Notifications feed
                  </h3>
                  <div className="space-y-3">
                    {[
                      { text: 'Outstanding credit alert: Rajesh Kumar has outstanding credit of ₹8,500 due on 2026-06-15.', time: '10m ago' },
                      { text: 'New payment verification requested: ₹4,350 UPI reference from Rajesh Kumar.', time: '1 hour ago' },
                      { text: 'Utility expense logged: ₹1,800 electricity bill payment.', time: '1 day ago' },
                      { text: 'Monthly revenue milestone achieved: ₹20,000 threshold crossed.', time: '2 days ago' }
                    ].map((n, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center text-xs font-semibold text-gray-700 hover:bg-[#F1F8F1]/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#236625] animate-pulse" />
                          <span>{n.text}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ==================================================== */}
        {/* INVENTORY MANAGER MODULES */}
        {/* ==================================================== */}
        {role === 'Inventory Manager' && (
          <>
            {/* SUBMODULE: INVENTORY DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Welcome Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#236625] via-[#2F8F2F] to-[#55FA62] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Inventory Control Console</span>
                    <h1 className="text-2xl md:text-3xl font-black mt-3">Welcome, Milind Deshmukh!</h1>
                    <p className="text-xs mt-2 text-emerald-100 font-medium">Verify chemical stocks in Cold Storage B. Keep track of Low Stock alerts generated today.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
                    <Boxes size={24} />
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-emerald-200">Total Stock Items</p>
                      <p className="text-base font-black">{availableStockSum.toLocaleString()} units</p>
                    </div>
                  </div>
                </div>

                {/* Dashboard KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Total Products</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">{totalProductsCount}</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Available Stock</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">{availableStockSum.toLocaleString()}</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between bg-amber-50 border-amber-200">
                    <p className="text-3xs font-extrabold uppercase text-amber-700">Low Stock</p>
                    <h4 className="text-xl font-black text-amber-700 mt-1">{lowStockProductsCount}</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between bg-rose-50 border-rose-200">
                    <p className="text-3xs font-extrabold uppercase text-rose-700">Out of Stock</p>
                    <h4 className="text-xl font-black text-rose-700 mt-1">{outOfStockProductsCount}</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Expiring Items</p>
                    <h4 className="text-xl font-black text-rose-600 mt-1">{expiringCount}</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Inventory Value</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">₹{totalInventoryValue.toLocaleString()}</h4>
                  </div>
                </div>

                {/* Stock Movement Charts (Simulated) & Expiry summaries */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Stock movement visual list */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Visual Stock Category Distribution</h3>
                    <div className="space-y-3 font-semibold text-xs text-gray-600">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Seeds (3 products)</span>
                          <span className="font-bold text-gray-800">315 units</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-[#236625] h-2 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Fertilizers (2 products)</span>
                          <span className="font-bold text-gray-800">102 units</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-[#236625] h-2 rounded-full" style={{ width: '25%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Pesticides (2 products)</span>
                          <span className="font-bold text-gray-800">8 units</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-[#236625] h-2 rounded-full" style={{ width: '5%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expiry alerts dashboard widget */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-gray-800">Critical Expiry Warnings</h3>
                    <div className="space-y-2">
                      {expiryRecords.filter(e => e.status !== 'Safe').map((e, idx) => (
                        <div key={idx} className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex justify-between items-center text-xs font-semibold">
                          <div>
                            <p>{e.name}</p>
                            <p className="text-3xs text-gray-400">Batch: {e.batch}</p>
                          </div>
                          <span className="font-black uppercase tracking-wider">{e.status} ({e.days} days)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notifications Alert Hub */}
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="text-[#236625]" size={16} /> Live Inventory Notifications
                  </h3>
                  <div className="space-y-2">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center text-xs font-semibold text-gray-700">
                        <span>{n.text}</span>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* SUBMODULE: PRODUCT MANAGER */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 font-heading">Product Catalog Inventory</h3>
                    <p className="text-xs text-gray-500">Add, edit, or adjust store catalog products.</p>
                  </div>
                  <button onClick={() => setProdModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">
                    Add Product
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Name</th>
                        <th className="p-4 text-center">Code</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Brand</th>
                        <th className="p-4 text-right">Purchase Price</th>
                        <th className="p-4 text-right">Selling Price</th>
                        <th className="p-4 text-center">Stock</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-bold text-gray-700">{p.name}</td>
                          <td className="p-4 text-center font-mono font-bold text-gray-500">{p.code}</td>
                          <td className="p-4 text-gray-600">{p.category}</td>
                          <td className="p-4 text-gray-500">{p.brand}</td>
                          <td className="p-4 text-right font-semibold">₹{p.purchasePrice}</td>
                          <td className="p-4 text-right font-black">₹{p.sellingPrice}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${p.stock === 0 ? 'bg-rose-50 text-rose-700' : p.stock <= p.reorderLevel ? 'bg-amber-50 text-amber-700' : 'bg-[#E8F5E9] text-[#2E7D32]'}`}>
                              {p.stock} Qty
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            <button onClick={() => handleEditProductClick(p)} className="text-blue-600 underline font-bold uppercase text-[10px]">Edit</button>
                            <button onClick={() => handleDeleteProduct(p.id, p.name)} className="text-rose-600 underline font-bold uppercase text-[10px]">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add/Edit Product Modal */}
                {prodModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => { setProdModalOpen(false); setProdEditId(null) }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">{prodEditId ? 'Edit Product' : 'Add New Product'}</h3>
                      <form onSubmit={handleSaveProduct} className="grid grid-cols-2 gap-4 text-xs font-semibold">
                        <div className="col-span-2 space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Product Name</label>
                          <input type="text" value={pName} onChange={(e) => setPName(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. Organic Urea" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Product Code</label>
                          <input type="text" value={pCode} onChange={(e) => setPCode(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. URE-ORG" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Brand</label>
                          <input type="text" value={pBrand} onChange={(e) => setPBrand(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. IFFCO" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Category</label>
                          <select value={pCategory} onChange={(e) => setPCategory(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none font-bold text-gray-700">
                            <option>Seeds</option>
                            <option>Fertilizers</option>
                            <option>Pesticides</option>
                            <option>Farm Equipment</option>
                            <option>Irrigation Products</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Stock Quantity</label>
                          <input type="number" value={pStock} onChange={(e) => setPStock(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. 100" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Purchase Price (₹)</label>
                          <input type="number" value={pPurchasePrice} onChange={(e) => setPPurchasePrice(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. 800" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Selling Price (₹)</label>
                          <input type="number" value={pSellingPrice} onChange={(e) => setPSellingPrice(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. 1000" required />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Reorder Trigger Level</label>
                          <input type="number" value={pReorder} onChange={(e) => setPReorder(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. 10" required />
                        </div>
                        <div className="col-span-2 pt-2 grid grid-cols-2 gap-3">
                          <button type="submit" className="btn-primary text-xs uppercase py-2.5">Save Product</button>
                          <button type="button" onClick={() => { setProdModalOpen(false); setProdEditId(null) }} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: STOCK CONTROL */}
            {activeTab === 'stock' && (
              <div className="space-y-6 animate-fade-in">
                {/* Order Approvals Processing */}
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-[#236625] flex items-center gap-2">
                    <ClipboardList size={16} /> Awaiting Inventory Order Approvals
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Review orders submitted by Sales Executives and approve them to route to the warehouse for packaging.</p>
                  {orders.filter(o => o.status === 'Confirmed').length === 0 ? (
                    <p className="text-xs text-gray-400 font-bold italic py-4 text-center">No orders currently awaiting inventory approval.</p>
                  ) : (
                    <div className="table-wrapper">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer Name</th>
                            <th className="p-4">Order Date</th>
                            <th className="p-4 text-right">Total Amount</th>
                            <th className="p-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.filter(o => o.status === 'Confirmed').map(ord => (
                            <tr key={ord.id} className="border-b border-gray-50 font-semibold">
                              <td className="p-4 font-mono font-bold text-gray-600">{ord.id}</td>
                              <td className="p-4 text-gray-800">{ord.customerName}</td>
                              <td className="p-4 text-gray-500">{ord.date}</td>
                              <td className="p-4 text-right font-black text-gray-900">₹{ord.total.toLocaleString()}</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => {
                                    updateOrderDb(ord.id, { orderStatus: 'Processing' })
                                    const newPackOrder = {
                                      id: ord.id,
                                      customer: ord.customerName,
                                      itemsCount: ord.itemsCount || Math.floor(1 + Math.random() * 5),
                                      priority: ord.total > 5000 ? 'High' : 'Medium',
                                      status: 'Pending'
                                    }
                                    setPackingOrders(prev => [newPackOrder, ...prev])
                                    const newDispatchPrep = {
                                      id: ord.id,
                                      destination: 'Silo Storage Area / Main Gate',
                                      packingStatus: 'Pending',
                                      dispatchStatus: 'Awaiting Packing'
                                    }
                                    setDispatchPrep(prev => [newDispatchPrep, ...prev])
                                    setNotifications(prev => [{ id: Date.now(), text: `Inventory approved for order ${ord.id}. Forwarded to Warehouse.`, time: 'Just now' }, ...prev])
                                  }}
                                  className="bg-[#236625] text-white px-3 py-1.5 rounded-xl text-3xs font-black uppercase tracking-wider"
                                >
                                  Approve & Release
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Stock In / Out Adjustment Logger */}
                <div className="grid md:grid-cols-3 gap-6 items-start">
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Log Stock Transaction</h3>
                    <form onSubmit={handleStockControlSubmit} className="space-y-3 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Select Product</label>
                        <select value={stockInProduct} onChange={(e) => setStockInProduct(e.target.value)} className="w-full p-2.5 border border-[#D8EAD8] rounded-xl text-xs outline-none font-bold text-gray-700">
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.stock} units)</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Transaction Quantity</label>
                        <input type="number" value={stockInQty} onChange={(e) => setStockInQty(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. 10" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Transaction Type</label>
                        <select value={stockInType} onChange={(e) => setStockInType(e.target.value)} className="w-full p-2.5 border border-[#D8EAD8] rounded-xl text-xs outline-none font-bold text-gray-700">
                          <option>Purchase</option>
                          <option>Sale</option>
                          <option>Return</option>
                          <option>Adjustment</option>
                        </select>
                      </div>
                      <button type="submit" className="btn-primary w-full py-2.5 text-xs font-black uppercase mt-2">Log Transaction</button>
                    </form>
                  </div>

                  {/* Stock movement ledger */}
                  <div className="table-wrapper md:col-span-2">
                    <div className="table-header">
                      <h3 className="text-sm font-bold text-gray-800">Stock Movements Ledger</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Product</th>
                            <th className="p-4 text-center">Quantity</th>
                            <th className="p-4 text-center">Type</th>
                            <th className="p-4">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockLedger.map(l => (
                            <tr key={l.id} className="border-b border-gray-50 font-medium">
                              <td className="p-4 text-gray-700">{l.product}</td>
                              <td className="p-4 text-center font-bold">{l.qty} units</td>
                              <td className="p-4 text-center">
                                <span className={`status-badge ${l.type === 'Purchase' || l.type === 'Return' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-rose-50 text-rose-700'}`}>
                                  {l.type}
                                </span>
                              </td>
                              <td className="p-4 text-gray-500">{l.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Warehouse Views & Damage Reports */}
                <div className="grid md:grid-cols-3 gap-6 items-start">
                  
                  {/* Warehouse view */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4 md:col-span-2">
                    <h3 className="text-sm font-bold text-gray-800">Warehouse Stock Registry</h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {warehouses.map((w, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2 text-xs font-semibold text-gray-600">
                          <p className="font-bold text-gray-800 border-b border-gray-200 pb-1">{w.name}</p>
                          <p>Available: <strong className="text-[#236625]">{w.available}</strong></p>
                          <p>Reserved: <strong className="text-gray-700">{w.reserved}</strong></p>
                          <p>Damaged: <strong className="text-rose-600">{w.damaged}</strong></p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Damage Report Form */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Report Damaged Stock</h3>
                    <form onSubmit={handleReportDamageSubmit} className="space-y-3 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Product</label>
                        <select value={damageProduct} onChange={(e) => setDamageProduct(e.target.value)} className="w-full p-2.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold">
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.stock} units)</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Quantity Damaged</label>
                        <input type="number" value={damageQty} onChange={(e) => setDamageQty(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Reason for Damage</label>
                        <input type="text" value={damageReason} onChange={(e) => setDamageReason(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. Moisture Seepage" required />
                      </div>
                      <button type="submit" className="btn-primary w-full py-2.5 text-xs font-black uppercase mt-2 bg-rose-600 hover:bg-rose-700">Submit Damage Report</button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: LOW STOCK ALERTS */}
            {activeTab === 'alerts' && (
              <div className="space-y-6 animate-fade-in">
                {/* Restock pipeline creator */}
                <div className="grid md:grid-cols-3 gap-6 items-start">
                  
                  {/* Restock Request Form */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Raise Restock Request</h3>
                    <form onSubmit={handleRestockRequestSubmit} className="space-y-3 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Product</label>
                        <select value={restockProduct} onChange={(e) => setRestockProduct(e.target.value)} className="w-full p-2.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold">
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Request Quantity</label>
                        <input type="number" value={restockQty} onChange={(e) => setRestockQty(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Urgency</label>
                        <select value={restockUrgency} onChange={(e) => setRestockUrgency(e.target.value)} className="w-full p-2.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold">
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                      </div>
                      <button type="submit" className="btn-primary w-full py-2.5 text-xs font-black uppercase mt-2">Submit Request</button>
                    </form>
                  </div>

                  {/* Requests list & low stock alerts */}
                  <div className="table-wrapper md:col-span-2">
                    <div className="table-header">
                      <h3 className="text-sm font-bold text-gray-800">Pending Restock & Procurement Requests</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {restockRequests.map(r => (
                        <div key={r.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center text-xs font-semibold">
                          <div>
                            <p className="text-gray-800">{r.product} (x{r.qty})</p>
                            <p className="text-3xs text-gray-400">Urgency: {r.urgency} • Request ID: {r.id}</p>
                          </div>
                          <span className={`status-badge ${r.status === 'Approved' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-amber-50 text-amber-700'}`}>{r.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Low stock alerts table */}
                <div className="table-wrapper">
                  <div className="table-header">
                    <h3 className="text-sm font-bold text-gray-800 text-amber-700">Store Low Stock Items</h3>
                  </div>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Product Name</th>
                        <th className="p-4 text-center">Current Stock</th>
                        <th className="p-4 text-center">Reorder Level</th>
                        <th className="p-4 text-center">Alert Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.filter(p => p.stock <= p.reorderLevel).map(p => (
                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-bold text-gray-700">{p.name}</td>
                          <td className="p-4 text-center font-bold text-rose-600">{p.stock} units</td>
                          <td className="p-4 text-center text-gray-500">{p.reorderLevel} units</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${p.stock === 0 ? 'bg-rose-50 text-rose-700 font-bold' : 'bg-amber-50 text-amber-700 font-bold'}`}>
                              {p.stock === 0 ? 'Critical Out of Stock' : 'Reorder Alert'}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            <button
                              onClick={() => {
                                setRestockProduct(p.id)
                                setRestockQty(p.reorderLevel * 2)
                              }}
                              className="text-[#236625] underline font-bold uppercase text-2xs"
                            >
                              Procure
                            </button>
                            <button
                              onClick={() => setNotifications(prev => [{ id: Date.now(), text: `Admin notified regarding low stock on ${p.name}`, time: 'Just now' }, ...prev])}
                              className="text-gray-500 underline font-bold uppercase text-2xs"
                            >
                              Notify Admin
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* SUBMODULE: BARCODE SYSTEM & EXPIRY */}
            {activeTab === 'barcode' && (
              <div className="space-y-6 animate-fade-in">
                {/* Barcode QR Generator card */}
                <div className="grid md:grid-cols-3 gap-6 items-start">
                  
                  {/* Generator Selector */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Generate Product Label</h3>
                    <div className="space-y-1 text-xs">
                      <label className="text-[10px] font-black text-gray-400 uppercase">Product Select</label>
                      <select value={selectedBarcodeProd} onChange={(e) => setSelectedBarcodeProd(e.target.value)} className="w-full p-2.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold">
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        const printWindow = window.open('', '_blank');
                        const p = products.find(prod => prod.id === selectedBarcodeProd)
                        printWindow.document.write(`
                          <html>
                            <head><title>Print Label ${p.code}</title></head>
                            <body style="font-family: Arial; padding: 40px; text-align: center;">
                              <h3>AgriERP Label</h3>
                              <p><strong>Name:</strong> ${p.name}</p>
                              <p><strong>Code:</strong> ${p.code}</p>
                              <p><strong>Price:</strong> ₹${p.sellingPrice}</p>
                              <div style="border: 2px solid black; padding: 10px; width: 200px; margin: 20px auto;">
                                ||||| | ||||| | |||
                              </div>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                        printWindow.print();
                      }}
                      className="btn-primary w-full py-2.5 text-xs font-black uppercase border-none mt-2"
                    >
                      Print Label
                    </button>
                  </div>

                  {/* Previews */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4 md:col-span-2">
                    <h3 className="text-sm font-bold text-gray-800">Label Previews</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-6 justify-around">
                      
                      {/* Barcode preview */}
                      <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase">Barcode Preview</p>
                        <div className="w-48 bg-white border border-gray-200 p-4 rounded-xl flex flex-col items-center">
                          {/* Simulated SVG Barcode */}
                          <svg className="w-full h-12" viewBox="0 0 100 20">
                            <rect x="5" y="2" width="2" height="16" fill="black" />
                            <rect x="9" y="2" width="1" height="16" fill="black" />
                            <rect x="12" y="2" width="4" height="16" fill="black" />
                            <rect x="18" y="2" width="2" height="16" fill="black" />
                            <rect x="22" y="2" width="1" height="16" fill="black" />
                            <rect x="25" y="2" width="3" height="16" fill="black" />
                            <rect x="30" y="2" width="2" height="16" fill="black" />
                            <rect x="34" y="2" width="4" height="16" fill="black" />
                            <rect x="40" y="2" width="1" height="16" fill="black" />
                            <rect x="43" y="2" width="2" height="16" fill="black" />
                            <rect x="47" y="2" width="3" height="16" fill="black" />
                            <rect x="52" y="2" width="2" height="16" fill="black" />
                            <rect x="56" y="2" width="1" height="16" fill="black" />
                            <rect x="59" y="2" width="4" height="16" fill="black" />
                            <rect x="65" y="2" width="2" height="16" fill="black" />
                            <rect x="69" y="2" width="1" height="16" fill="black" />
                            <rect x="72" y="2" width="3" height="16" fill="black" />
                            <rect x="77" y="2" width="2" height="16" fill="black" />
                            <rect x="81" y="2" width="4" height="16" fill="black" />
                            <rect x="87" y="2" width="1" height="16" fill="black" />
                            <rect x="90" y="2" width="2" height="16" fill="black" />
                          </svg>
                          <span className="text-3xs font-mono font-bold mt-2 text-gray-500">
                            {products.find(prod => prod.id === selectedBarcodeProd)?.code || 'WHT-2967'}
                          </span>
                        </div>
                      </div>

                      {/* QR Preview */}
                      <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase">QR Code Preview</p>
                        <div className="w-28 h-28 bg-white border border-gray-200 p-2 rounded-xl flex items-center justify-center">
                          {/* Simulated QR Code SVG */}
                          <svg className="w-full h-full" viewBox="0 0 20 20">
                            {/* Corners */}
                            <rect x="1" y="1" width="5" height="5" fill="black" />
                            <rect x="2" y="2" width="3" height="3" fill="white" />
                            <rect x="3" y="3" width="1" height="1" fill="black" />
                            <rect x="14" y="1" width="5" height="5" fill="black" />
                            <rect x="15" y="2" width="3" height="3" fill="white" />
                            <rect x="16" y="3" width="1" height="1" fill="black" />
                            <rect x="1" y="14" width="5" height="5" fill="black" />
                            <rect x="2" y="15" width="3" height="3" fill="white" />
                            <rect x="3" y="16" width="1" height="1" fill="black" />
                            {/* Pixels */}
                            <rect x="8" y="2" width="2" height="2" fill="black" />
                            <rect x="11" y="4" width="1" height="3" fill="black" />
                            <rect x="7" y="8" width="4" height="2" fill="black" />
                            <rect x="9" y="12" width="3" height="1" fill="black" />
                            <rect x="15" y="9" width="2" height="2" fill="black" />
                            <rect x="17" y="15" width="2" height="3" fill="black" />
                          </svg>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Expiry Tracking list */}
                <div className="table-wrapper">
                  <div className="table-header">
                    <h3 className="text-sm font-bold text-gray-800">Expiry Tracking by Batch</h3>
                  </div>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Batch Code</th>
                        <th className="p-4">Product Name</th>
                        <th className="p-4">Expiry Date</th>
                        <th className="p-4 text-center">Remaining Days</th>
                        <th className="p-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expiryRecords.map((r, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{r.batch}</td>
                          <td className="p-4 font-bold text-gray-700">{r.name}</td>
                          <td className="p-4 text-gray-500">{r.expiry}</td>
                          <td className="p-4 text-center font-bold text-gray-700">{r.days} days</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${r.status === 'Safe' ? 'bg-[#E8F5E9] text-[#2E7D32]' : r.status === 'Near Expiry' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* SUBMODULE: REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-800">Generate Stock Reports</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const printWindow = window.open('', '_blank');
                          printWindow.document.write(`
                            <html>
                              <head><title>AgriERP Inventory Audit Report</title></head>
                              <body style="font-family: Arial; padding: 40px; color: #333;">
                                <h2>AgriERP Inventory Audit Report</h2>
                                <p><strong>Generated By:</strong> Milind Deshmukh</p>
                                <p><strong>Role:</strong> Inventory Manager</p>
                                <p><strong>Report Type:</strong> ${reportType.toUpperCase()}</p>
                                <hr/>
                                <p>Report generated successfully on ${new Date().toLocaleDateString()}</p>
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                          printWindow.print();
                        }}
                        className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 px-3 py-1.5 rounded-xl shadow-sm"
                      >
                        <FileDown size={14} /> Export to PDF
                      </button>
                    </div>
                  </div>

                  {/* Report Type selector */}
                  <div className="flex gap-2 border-b border-[#F1F8F1] pb-4">
                    {['stock', 'lowstock', 'expiry', 'damage'].map(t => (
                      <button
                        key={t}
                        onClick={() => setReportType(t)}
                        className={`px-4 py-2 text-xs font-black uppercase border-b-2 transition-all ${
                          reportType === t ? 'border-[#236625] text-[#236625]' : 'border-transparent text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        {t} Report
                      </button>
                    ))}
                  </div>

                  {/* Data tables */}
                  <div className="table-wrapper">
                    {reportType === 'stock' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Product Name</th>
                            <th className="p-4 text-center">Code</th>
                            <th className="p-4 text-right">Selling Price</th>
                            <th className="p-4 text-center">Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(p => (
                            <tr key={p.id} className="border-b border-gray-50">
                              <td className="p-4 font-bold text-gray-700">{p.name}</td>
                              <td className="p-4 text-center font-mono text-gray-500">{p.code}</td>
                              <td className="p-4 text-right font-semibold">₹{p.sellingPrice}</td>
                              <td className="p-4 text-center font-bold text-gray-700">{p.stock} units</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {reportType === 'lowstock' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Product Name</th>
                            <th className="p-4 text-center">Stock</th>
                            <th className="p-4 text-center">Reorder level</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.filter(p => p.stock <= p.reorderLevel).map(p => (
                            <tr key={p.id} className="border-b border-gray-50">
                              <td className="p-4 font-bold text-gray-700">{p.name}</td>
                              <td className="p-4 text-center font-bold text-rose-600">{p.stock} units</td>
                              <td className="p-4 text-center text-gray-500">{p.reorderLevel} units</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {reportType === 'expiry' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Batch</th>
                            <th className="p-4">Product</th>
                            <th className="p-4 text-center">Remaining Days</th>
                            <th className="p-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expiryRecords.map((e, idx) => (
                            <tr key={idx} className="border-b border-gray-50">
                              <td className="p-4 font-mono text-gray-500">{e.batch}</td>
                              <td className="p-4 font-bold text-gray-700">{e.name}</td>
                              <td className="p-4 text-center">{e.days} days</td>
                              <td className="p-4 text-center font-bold">{e.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {reportType === 'damage' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Product</th>
                            <th className="p-4 text-center">Quantity</th>
                            <th className="p-4">Reason</th>
                            <th className="p-4">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {damageHistory.map((d, idx) => (
                            <tr key={idx} className="border-b border-gray-50">
                              <td className="p-4 font-bold text-gray-700">{d.product}</td>
                              <td className="p-4 text-center font-bold text-rose-600">{d.qty} units</td>
                              <td className="p-4 text-gray-600">{d.reason}</td>
                              <td className="p-4 text-gray-500">{d.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ==================================================== */}
        {/* SALES EXECUTIVE MODULES */}
        {/* ==================================================== */}
        {role === 'Sales Executive' && (
          <>
            {/* SUBMODULE: SALES DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Welcome banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#236625] via-[#2F8F2F] to-[#55FA62] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Sales Executive CRM</span>
                    <h1 className="text-2xl md:text-3xl font-black mt-3">Welcome, Suresh Patil!</h1>
                    <p className="text-xs mt-2 text-emerald-100 font-medium">Summer season seeds targets are active. Cotton & Wheat orders represent your highest conversion focus.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
                    <Award size={24} />
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-emerald-200">Achievement</p>
                      <p className="text-base font-black">76% of Target</p>
                    </div>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Today's Sales</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">₹25,400</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Monthly Sales</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">₹3,80,000</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">New Customers</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">12</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Orders Created</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">18</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Sales Target</p>
                    <h4 className="text-xl font-black text-rose-600 mt-1">₹5,00,000</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Target Achieved</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">76%</h4>
                  </div>
                </div>

                {/* Target Progress Bar & Commission metrics */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4 md:col-span-2">
                    <h3 className="text-sm font-bold text-gray-800">Target Completion progress</h3>
                    <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden relative">
                      <div className="bg-[#236625] h-full rounded-full" style={{ width: '76%' }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 font-semibold pt-1">
                      <span>Achieved: ₹3,80,000</span>
                      <span>Remaining Target: ₹1,20,000</span>
                    </div>
                  </div>

                  {/* Commission Tracking */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-gray-800">Commission & Earnings</h3>
                    <div className="space-y-2 text-xs font-semibold text-gray-600">
                      <div className="flex justify-between">
                        <span>Monthly Commission:</span>
                        <span className="font-bold text-[#236625]">₹{commissionAchieved.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sales Incentives:</span>
                        <span className="font-bold text-[#236625]">₹{incentivesEarned.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-[#F1F8F1] pt-2 text-gray-800 font-black">
                        <span>Total Bonus Earnings:</span>
                        <span>₹{bonusEarned.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom Visual Charts & Follow-ups */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Daily Sales Trend Chart (CSS simulated) */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Daily Sales Trend (₹)</h3>
                    <div className="h-44 flex items-end justify-between gap-2 pt-4">
                      {[
                        { day: 'Mon', amt: 8500 },
                        { day: 'Tue', amt: 12000 },
                        { day: 'Wed', amt: 9000 },
                        { day: 'Thu', amt: 14500 },
                        { day: 'Fri', amt: 22000 },
                        { day: 'Sat', amt: 18000 },
                        { day: 'Sun', amt: 25400 }
                      ].map((d, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <span className="text-[9px] text-[#236625] font-black">{d.amt / 1000}k</span>
                          <div className="w-full bg-[#236625] rounded-t-md hover:opacity-85 transition-opacity" style={{ height: `${(d.amt / 30000) * 100}%` }} />
                          <span className="text-3xs text-gray-400 font-bold">{d.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Follow-ups */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-gray-800">Scheduled Customer Follow-ups</h3>
                      <button onClick={() => setActiveTab('customers')} className="text-3xs text-[#236625] font-black uppercase underline">Add Call</button>
                    </div>
                    <div className="space-y-3">
                      {followups.map(f => (
                        <div key={f.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-gray-800">{f.name}</p>
                            <p className="text-3xs text-gray-400">{f.notes}</p>
                          </div>
                          <div className="text-right">
                            <span className={`status-badge text-[9px] ${f.status === 'Done' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-amber-50 text-amber-700'}`}>
                              {f.status}
                            </span>
                            <span className="text-3xs text-gray-400 block mt-1">{f.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notification logs */}
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="text-[#236625]" size={16} /> Notification Updates
                  </h3>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center text-xs font-semibold text-gray-700">
                        <span>{n.text}</span>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* SUBMODULE: CUSTOMERS */}
            {activeTab === 'customers' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#D8EAD8] shadow-sm">
                  <div className="relative flex-grow max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, village..."
                      value={searchCustQuery}
                      onChange={(e) => setSearchCustQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-[#D8EAD8] rounded-xl text-xs outline-none focus:border-[#236625] font-bold"
                    />
                  </div>
                  <button onClick={() => setCustomerModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">
                    Add Customer
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Name</th>
                        <th className="p-4 text-center">Mobile</th>
                        <th className="p-4">Village</th>
                        <th className="p-4 text-center">Type</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.filter(c => {
                        return c.name.toLowerCase().includes(searchCustQuery.toLowerCase()) || c.village.toLowerCase().includes(searchCustQuery.toLowerCase())
                      }).map(c => (
                        <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-bold text-gray-700">{c.name}</td>
                          <td className="p-4 text-gray-500">{c.mobile}</td>
                          <td className="p-4 text-gray-600">{c.village}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${c.type === 'Wholesale' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-blue-50 text-blue-700'}`}>
                              {c.type}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-3">
                            <button onClick={() => setSelectedCustomerProfile(c)} className="text-[#236625] underline font-bold uppercase text-[10px]">View Profile</button>
                            <button onClick={() => { setSelectedOrderCustomer(c.id); setActiveTab('create_order') }} className="text-[#236625] underline font-bold uppercase text-[10px]">Create Order</button>
                            <button onClick={() => setContactingCust(c)} className="text-gray-500 hover:text-[#236625]"><Phone size={14} className="inline" /></button>
                            <button onClick={() => handleEditCustomerClick(c)} className="text-blue-600 underline font-bold uppercase text-[10px]">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Customer Add/Edit Modal */}
                {customerModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => { setCustomerModalOpen(false); setCustomerEditId(null) }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">{customerEditId ? 'Edit Customer' : 'Add New Customer'}</h3>
                      <form onSubmit={handleSaveCustomer} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Customer Name</label>
                          <input type="text" value={custName} onChange={(e) => setCustName(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. Ramesh" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Mobile Number</label>
                          <input type="text" value={custMobile} onChange={(e) => setCustMobile(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. +91 9988..." required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Village</label>
                          <input type="text" value={custVillage} onChange={(e) => setCustVillage(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. Seloo" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Customer Type</label>
                          <select value={custType} onChange={(e) => setCustType(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold">
                            <option>Retail</option>
                            <option>Wholesale</option>
                          </select>
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button type="submit" className="btn-primary text-xs uppercase py-2.5">Save Profile</button>
                          <button type="button" onClick={() => { setCustomerModalOpen(false); setCustomerEditId(null) }} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Profile Popover with Purchase history */}
                {selectedCustomerProfile && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setSelectedCustomerProfile(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Customer Profile: {selectedCustomerProfile.name}</h3>
                      <div className="text-xs text-gray-600 space-y-2 border-b border-[#F1F8F1] pb-4 font-semibold">
                        <p><strong>Mobile:</strong> {selectedCustomerProfile.mobile}</p>
                        <p><strong>Village:</strong> {selectedCustomerProfile.village}</p>
                        <p><strong>Type:</strong> {selectedCustomerProfile.type}</p>
                      </div>
                      <h4 className="text-xs font-bold text-gray-800">Purchase History</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedCustomerProfile.history.length === 0 ? (
                          <p className="text-3xs text-gray-400 font-bold uppercase">No purchases registered yet.</p>
                        ) : (
                          selectedCustomerProfile.history.map(h => (
                            <div key={h.id} className="flex justify-between items-center p-2 bg-gray-50 border border-gray-100 rounded-lg text-3xs font-semibold">
                              <span>{h.id} ({h.date})</span>
                              <span className="font-bold text-[#236625]">₹{h.total.toLocaleString()}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Call Simulator */}
                {contactingCust && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 text-center relative animate-scale-up">
                      <button onClick={() => setContactingCust(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <div className="w-12 h-12 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto animate-pulse">
                        <Phone size={24} />
                      </div>
                      <h3 className="text-sm font-bold text-gray-800">Calling {contactingCust.name}...</h3>
                      <p className="text-2xs text-gray-500 font-medium">{contactingCust.mobile}</p>
                      <div className="space-y-2 text-left pt-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Follow-up Call Notes</label>
                        <textarea
                          placeholder="Add follow-up notes from the call..."
                          value={newFollowupNotes}
                          onChange={(e) => setNewFollowupNotes(e.target.value)}
                          className="w-full px-3 py-2 border border-[#D8EAD8] rounded-xl text-xs outline-none focus:border-[#236625] h-16"
                        />
                        <label className="text-[10px] font-black text-gray-400 uppercase">Schedule Next Call Date</label>
                        <input
                          type="date"
                          value={newFollowupDate}
                          onChange={(e) => setNewFollowupDate(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => {
                            if (newFollowupNotes) {
                              setFollowups(prev => [
                                { id: `f-${Date.now()}`, name: contactingCust.name, date: newFollowupDate || new Date().toISOString().split('T')[0], notes: newFollowupNotes, status: 'Scheduled' },
                                ...prev
                              ])
                              setNewFollowupNotes('')
                              setNewFollowupDate('')
                            }
                            setContactingCust(null)
                          }}
                          className="btn-primary text-xs uppercase py-2.5"
                        >
                          Save & End
                        </button>
                        <button onClick={() => setContactingCust(null)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* SUBMODULE: ORDER CREATOR */}
            {activeTab === 'create_order' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid md:grid-cols-3 gap-6 items-start">
                  
                  {/* Creator form */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4 md:col-span-2">
                    <h3 className="text-sm font-bold text-gray-800">Generate New Sales Order</h3>
                    
                    {/* Select Customer */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase">Select Registered Customer</label>
                      <select
                        value={selectedOrderCustomer}
                        onChange={(e) => setSelectedOrderCustomer(e.target.value)}
                        className="w-full p-2.5 border border-[#D8EAD8] rounded-xl text-xs outline-none focus:border-[#236625] text-gray-700 font-bold"
                      >
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.village})</option>
                        ))}
                      </select>
                    </div>

                    {/* Items in this order */}
                    <div className="space-y-2 border-t border-[#F1F8F1] pt-4">
                      <h4 className="text-xs font-bold text-gray-800 mb-2">Order Items</h4>
                      {orderItems.length === 0 ? (
                        <p className="text-3xs text-gray-400 uppercase font-black">No products added. Click "+" on the catalog list to add.</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                          {orderItems.map(item => (
                            <div key={item.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between text-xs">
                              <span className="font-semibold text-gray-700 truncate max-w-xs">{item.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => handleUpdateOrderItemQty(item.id, -1)} className="p-0.5 rounded bg-white border border-gray-200"><Minus size={12} /></button>
                                  <span className="font-bold text-gray-800">{item.quantity}</span>
                                  <button onClick={() => handleUpdateOrderItemQty(item.id, 1)} className="p-0.5 rounded bg-white border border-gray-200"><Plus size={12} /></button>
                                </div>
                                <button onClick={() => handleRemoveOrderItem(item.id)} className="text-rose-600"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Order Details Catalog Quick list */}
                    <div className="space-y-2 border-t border-[#F1F8F1] pt-4">
                      <h4 className="text-xs font-bold text-[#236625]">Add Products Catalog</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-2">
                        {products.map(p => (
                          <button
                            key={p.id}
                            onClick={() => handleAddOrderItem({ id: p.id, name: p.name, price: p.sellingPrice })}
                            className="p-2 border border-[#D8EAD8] hover:bg-[#F1F8F1] transition-colors rounded-xl text-left text-3xs font-semibold flex justify-between items-center"
                          >
                            <div className="min-w-0">
                              <p className="text-gray-800 truncate">{p.name}</p>
                              <p className="text-gray-500 font-bold mt-0.5">₹{p.sellingPrice}</p>
                            </div>
                            <Plus size={14} className="text-[#236625] flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order pricing summary */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-gray-800">Pricing Summary</h3>
                    
                    <div className="space-y-2 text-xs font-semibold text-gray-500 border-b border-[#F1F8F1] pb-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-bold text-gray-700">₹{getOrderSubtotal().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Discount (%)</span>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={discountPercent}
                          onChange={(e) => setDiscountPercent(parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-0.5 border border-[#D8EAD8] rounded text-xs text-center text-gray-700"
                        />
                      </div>
                      <div className="flex justify-between">
                        <span>GST Tax (18%)</span>
                        <span className="font-bold text-gray-700">₹{getOrderTax().toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-[#F1F8F1] pt-4">
                      <span>Grand Total</span>
                      <span>₹{getOrderTotal().toLocaleString()}</span>
                    </div>

                    {/* Status Toggle */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase">Order Status</label>
                      <select
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                        className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold"
                      >
                        <option>Draft</option>
                        <option>Submitted</option>
                        <option>Confirmed</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button onClick={handleSaveOrder} className="btn-primary py-2.5 text-xs font-black uppercase" disabled={orderItems.length === 0}>Save Order</button>
                      <button
                        onClick={() => {
                          const cust = customers.find(c => c.id === selectedOrderCustomer)
                          if (!cust) return
                          setGeneratedInvoice({
                            id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
                            customer: cust,
                            items: orderItems,
                            subtotal: getOrderSubtotal(),
                            discount: getOrderDiscount(),
                            tax: getOrderTax(),
                            total: getOrderTotal(),
                            date: new Date().toLocaleDateString()
                          })
                        }}
                        className="btn-secondary py-2.5 text-xs font-black uppercase border-2 hover:bg-[#F1F8F1]"
                        disabled={orderItems.length === 0}
                      >
                        Invoice
                      </button>
                    </div>
                  </div>
                </div>

                {/* Invoice preview modal */}
                {generatedInvoice && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setGeneratedInvoice(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Generated Retail Invoice</h3>
                      <div className="border border-dashed border-[#D8EAD8] p-4 rounded-2xl space-y-4 text-xs font-semibold text-gray-600">
                        <div className="flex justify-between">
                          <span><strong>Invoice No:</strong> {generatedInvoice.id}</span>
                          <span><strong>Date:</strong> {generatedInvoice.date}</span>
                        </div>
                        <hr className="border-dashed border-[#D8EAD8]"/>
                        <p><strong>Customer:</strong> {generatedInvoice.customer.name}</p>
                        <p><strong>Village:</strong> {generatedInvoice.customer.village}</p>
                        <hr className="border-dashed border-[#D8EAD8]"/>
                        <div className="space-y-1">
                          {generatedInvoice.items.map(item => (
                            <div key={item.id} className="flex justify-between text-3xs font-bold">
                              <span>{item.name} (x{item.quantity})</span>
                              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <hr className="border-dashed border-[#D8EAD8]"/>
                        <div className="space-y-1 text-right">
                          <p>Subtotal: ₹{generatedInvoice.subtotal.toLocaleString()}</p>
                          <p className="text-emerald-700">Discount: -₹{generatedInvoice.discount.toLocaleString()}</p>
                          <p>Tax (18% GST): ₹{generatedInvoice.tax.toLocaleString()}</p>
                          <p className="text-gray-900 font-black text-xs">Total: ₹{generatedInvoice.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            const printWindow = window.open('', '_blank');
                            printWindow.document.write(`
                              <html>
                                <head><title>AgriERP Invoice ${generatedInvoice.id}</title></head>
                                <body style="font-family: Arial; padding: 40px; color: #333;">
                                  <h2>AgriERP Invoice - Sales Executive Console</h2>
                                  <p><strong>Invoice ID:</strong> ${generatedInvoice.id}</p>
                                  <p><strong>Date:</strong> ${generatedInvoice.date}</p>
                                  <p><strong>Farmer Name:</strong> ${generatedInvoice.customer.name}</p>
                                  <hr/>
                                  <p><strong>Total Amount (with GST):</strong> ₹${generatedInvoice.total.toLocaleString()}</p>
                                  <p>Thank you for buying from AgriERP!</p>
                                </body>
                              </html>
                            `);
                            printWindow.document.close();
                            printWindow.print();
                            setGeneratedInvoice(null)
                          }}
                          className="btn-primary text-xs uppercase py-2.5"
                        >
                          Print / Print PDF
                        </button>
                        <button onClick={() => setGeneratedInvoice(null)} className="btn-secondary text-xs uppercase py-2.5">Close</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: PRODUCT CATALOG */}
            {activeTab === 'catalog' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#D8EAD8] shadow-sm">
                  <div className="relative flex-grow max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search catalog products..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-[#D8EAD8] rounded-xl text-xs outline-none focus:border-[#236625] font-bold"
                    />
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Seeds', 'Fertilizers', 'Pesticides', 'Farm Equipment', 'Irrigation Products'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCatalogFilter(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          catalogFilter === cat
                            ? 'bg-[#236625] text-white shadow-md'
                            : 'bg-[#F1F8F1] text-[#236625] hover:bg-[#D8EAD8]/40'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Catalog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {products.filter(p => {
                    const matchSearch = p.name.toLowerCase().includes(catalogSearch.toLowerCase())
                    const matchCat = catalogFilter === 'All' || p.category === catalogFilter
                    return matchSearch && matchCat
                  }).map(product => (
                    <div key={product.id} className="kpi-card flex flex-col justify-between p-0 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm overflow-hidden group">
                      <div className="relative h-40 overflow-hidden bg-gray-100">
                        {/* Static images representing categories for employee quick overview */}
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.isRecommended ? 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80' : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80'})` }} />
                        {product.isRecommended && (
                          <span className="absolute top-2 left-2 bg-[#236625] text-white text-[8px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase">
                            Recommended Choice
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="text-xs font-bold text-gray-800 line-clamp-2 h-8">{product.name}</h4>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{product.category}</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#F1F8F1] pt-2">
                          <span className="text-xs font-black text-gray-900">₹{product.sellingPrice.toLocaleString()}</span>
                          <span className={`text-[10px] font-bold ${product.stock > 0 ? 'text-[#2E7D32]' : 'text-rose-600'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBMODULE: LEADS PIPELINE */}
            {activeTab === 'leads' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Leads Tracking pipeline</h3>
                    <p className="text-xs text-gray-500 font-semibold">Convert prospective farmers into loyal customers.</p>
                  </div>
                  <button onClick={() => setLeadModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">Add Lead</button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Pipeline Columns */}
                  {['New', 'Converted', 'Lost'].map(status => (
                    <div key={status} className="p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm space-y-4">
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider flex justify-between items-center border-b border-[#F1F8F1] pb-2">
                        <span>{status} Pipeline</span>
                        <span className="bg-[#F1F8F1] text-[#236625] text-3xs font-bold px-2 py-0.5 rounded-full">
                          {leads.filter(l => l.status === status).length}
                        </span>
                      </h4>
                      <div className="space-y-3">
                        {leads.filter(l => l.status === status).map(lead => (
                          <div key={lead.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                            <div className="flex justify-between items-start">
                              <p className="text-xs font-bold text-gray-800">{lead.name}</p>
                              {status === 'New' && (
                                <button
                                  onClick={() => handleConvertLead(lead)}
                                  className="text-[9px] bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#D8EAD8] font-black uppercase px-2 py-0.5 rounded"
                                >
                                  Convert
                                </button>
                              )}
                            </div>
                            <p className="text-3xs text-gray-500">Village: {lead.village} • {lead.mobile}</p>
                            <p className="text-3xs text-gray-400 italic">Notes: {lead.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Lead Modal */}
                {leadModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setLeadModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Add New Lead</h3>
                      <form onSubmit={handleAddLead} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Farmer Name</label>
                          <input type="text" value={leadName} onChange={(e) => setLeadName(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Mobile</label>
                          <input type="text" value={leadMobile} onChange={(e) => setLeadMobile(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Village</label>
                          <input type="text" value={leadVillage} onChange={(e) => setLeadVillage(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Interest / Notes</label>
                          <input type="text" value={leadNotes} onChange={(e) => setLeadNotes(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. Interested in Hybrid wheat seeds" />
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button type="submit" className="btn-primary text-xs uppercase py-2.5">Save Lead</button>
                          <button type="button" onClick={() => setLeadModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-800">Generate Audit Reports</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const printWindow = window.open('', '_blank');
                          printWindow.document.write(`
                            <html>
                              <head><title>AgriERP Sales Executive Audit Report</title></head>
                              <body style="font-family: Arial; padding: 40px; color: #333;">
                                <h2>Sales Executive Audit Report</h2>
                                <p><strong>Generated By:</strong> Suresh Patil</p>
                                <p><strong>Role:</strong> Sales Executive</p>
                                <p><strong>Report Type:</strong> ${reportType.toUpperCase()}</p>
                                <hr/>
                                <p>Report compiled successfully on ${new Date().toLocaleDateString()}</p>
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                          printWindow.print();
                        }}
                        className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 px-3 py-1.5 rounded-xl shadow-sm"
                      >
                        <FileDown size={14} /> Export to PDF
                      </button>
                    </div>
                  </div>

                  {/* Report selector */}
                  <div className="flex gap-2 border-b border-[#F1F8F1] pb-4">
                    {['sales', 'customer', 'order'].map(t => (
                      <button
                        key={t}
                        onClick={() => setReportType(t)}
                        className={`px-4 py-2 text-xs font-black uppercase border-b-2 transition-all ${
                          reportType === t ? 'border-[#236625] text-[#236625]' : 'border-transparent text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        {t} Report
                      </button>
                    ))}
                  </div>

                  {/* Simulated data lists */}
                  <div className="table-wrapper">
                    {reportType === 'sales' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Customer Name</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(o => (
                            <tr key={o.id} className="border-b border-gray-50">
                              <td className="p-4 font-bold text-gray-700">{o.customerName}</td>
                              <td className="p-4 text-gray-500">{o.date}</td>
                              <td className="p-4 font-black">₹{o.total.toLocaleString()}</td>
                              <td className="p-4">
                                <span className="status-badge bg-[#E8F5E9] text-[#2E7D32]">{o.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {reportType === 'customer' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Customer</th>
                            <th className="p-4">Mobile</th>
                            <th className="p-4">Village</th>
                            <th className="p-4">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers.map(c => (
                            <tr key={c.id} className="border-b border-gray-50">
                              <td className="p-4 font-bold text-gray-700">{c.name}</td>
                              <td className="p-4 text-gray-500">{c.mobile}</td>
                              <td className="p-4 text-gray-600">{c.village}</td>
                              <td className="p-4">{c.type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {reportType === 'order' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(o => (
                            <tr key={o.id} className="border-b border-gray-50">
                              <td className="p-4 font-bold text-gray-700">{o.id}</td>
                              <td className="p-4">{o.customerName}</td>
                              <td className="p-4 text-gray-500">{o.date}</td>
                              <td className="p-4 font-black">₹{o.total.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: ORDERS LIST */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Sales Orders Directory</h3>
                    <p className="text-xs text-gray-500 font-semibold">Track pending, confirmed, and delivered orders.</p>
                  </div>
                  <button onClick={() => setActiveTab('create_order')} className="btn-primary text-xs uppercase px-5 py-2.5">Create Order</button>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{o.id}</td>
                          <td className="p-4 font-bold text-gray-700">{o.customerName}</td>
                          <td className="p-4 text-gray-500">{o.date}</td>
                          <td className="p-4 font-black">₹{o.total.toLocaleString()}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${o.status === 'Delivered' ? 'bg-[#E8F5E9] text-[#2E7D32]' : o.status === 'Confirmed' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                              <button
                                onClick={() => {
                                  const cust = customers.find(c => c.name === o.customerName) || { name: o.customerName, village: 'Unknown' }
                                  setGeneratedInvoice({
                                    id: o.id.replace('ord', 'INV'),
                                    customer: cust,
                                    items: [],
                                    subtotal: o.total / 1.18,
                                    discount: 0,
                                    tax: o.total - (o.total / 1.18),
                                    total: o.total,
                                    date: o.date
                                  })
                                }}
                                className="text-[#236625] underline font-bold uppercase text-[10px]"
                              >
                                View Invoice
                              </button>
                              {o.status === 'Pending' && (
                                <button
                                  onClick={() => updateOrderDb(o.id, { orderStatus: 'Confirmed' })}
                                  className="text-blue-600 underline font-bold uppercase text-[10px] ml-2"
                                >
                                  Confirm
                                </button>
                              )}
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBMODULE: SALES TARGETS */}
            {activeTab === 'targets' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-6">
                  <h3 className="text-sm font-bold text-gray-800">Monthly Sales Target Overview</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gradient-to-br from-[#F1F8F1] to-[#D8EAD8]/30 border border-[#D8EAD8] rounded-2xl">
                      <p className="text-3xs font-extrabold uppercase text-gray-400">Monthly Target</p>
                      <h4 className="text-xl font-black text-rose-600 mt-1">₹5,00,000</h4>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-[#F1F8F1] to-[#D8EAD8]/30 border border-[#D8EAD8] rounded-2xl">
                      <p className="text-3xs font-extrabold uppercase text-gray-400">Current Achievement</p>
                      <h4 className="text-xl font-black text-[#236625] mt-1">₹3,80,000</h4>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-[#F1F8F1] to-[#D8EAD8]/30 border border-[#D8EAD8] rounded-2xl">
                      <p className="text-3xs font-extrabold uppercase text-gray-400">Remaining Target</p>
                      <h4 className="text-xl font-black text-amber-700 mt-1">₹1,20,000</h4>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-700">
                      <span>Overall Progress</span>
                      <span>76%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden relative">
                      <div className="bg-[#236625] h-full rounded-full" style={{ width: '76%' }} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F1F8F1] space-y-3">
                    <h4 className="text-xs font-bold text-gray-800">Target Breakdown by Category</h4>
                    <div className="space-y-2 text-xs font-semibold text-gray-600">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Seeds</span>
                          <span>90% (₹1,80,000 / ₹2,00,000)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-[#236625] h-2 rounded-full" style={{ width: '90%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Fertilizers</span>
                          <span>60% (₹1,20,000 / ₹2,00,000)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-[#236625] h-2 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Pesticides</span>
                          <span>80% (₹80,000 / ₹1,00,000)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-[#236625] h-2 rounded-full" style={{ width: '80%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: FOLLOW UPS */}
            {activeTab === 'followups' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Customer Follow-ups Panel</h3>
                    <p className="text-xs text-gray-500 font-semibold">Interact and log relationship calls with farmers.</p>
                  </div>
                  <button onClick={() => setFollowupModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">Schedule Follow Up</button>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Follow Up Date</th>
                        <th className="p-4">Notes</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {followups.map(f => (
                        <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-bold text-gray-700">{f.name}</td>
                          <td className="p-4 text-gray-500">{f.date}</td>
                          <td className="p-4 text-gray-600 font-medium">{f.notes}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${f.status === 'Done' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-amber-50 text-amber-700'}`}>
                              {f.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {f.status === 'Scheduled' && (
                              <button
                                onClick={() => {
                                  setFollowups(prev => prev.map(item => item.id === f.id ? { ...item, status: 'Done' } : item))
                                }}
                                className="text-[#236625] underline font-bold uppercase text-[10px]"
                              >
                                Complete Call
                              </button>
                            )}
                            {f.status === 'Done' && (
                              <span className="text-gray-400 font-bold uppercase text-[10px]">Closed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Follow-up Modal */}
                {followupModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setFollowupModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Schedule Customer Follow Up</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Select Customer</label>
                          <select
                            value={followupCustomer}
                            onChange={(e) => setFollowupCustomer(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold"
                          >
                            <option value="">-- Choose Customer --</option>
                            {customers.map(c => (
                              <option key={c.id} value={c.name}>{c.name} ({c.village})</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Notes / Reminder</label>
                          <input
                            type="text"
                            value={newFollowupNotes}
                            onChange={(e) => setNewFollowupNotes(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                            placeholder="e.g. Call to clarify bulk seeds pricing"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Follow Up Date</label>
                          <input
                            type="date"
                            value={newFollowupDate}
                            onChange={(e) => setNewFollowupDate(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              if (!followupCustomer || !newFollowupNotes) return
                              setFollowups(prev => [
                                { id: `f-${Date.now()}`, name: followupCustomer, date: newFollowupDate || new Date().toISOString().split('T')[0], notes: newFollowupNotes, status: 'Scheduled' },
                                ...prev
                              ])
                              setFollowupCustomer('')
                              setNewFollowupNotes('')
                              setNewFollowupDate('')
                              setFollowupModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Schedule
                          </button>
                          <button onClick={() => setFollowupModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: COMMISSION */}
            {activeTab === 'commission' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm text-center">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Monthly Commission</p>
                    <h4 className="text-2xl font-black text-[#236625] mt-2">₹12,450</h4>
                  </div>
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm text-center">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Sales Incentives</p>
                    <h4 className="text-2xl font-black text-[#236625] mt-2">₹3,500</h4>
                  </div>
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm text-center">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Bonus Earned</p>
                    <h4 className="text-2xl font-black text-[#236625] mt-2">₹5,000</h4>
                  </div>
                </div>

                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-800">Visual Earnings Performance Trend</h3>
                  <div className="h-44 flex items-end justify-between gap-4 pt-4">
                    {[
                      { month: 'Jan', amt: 8000 },
                      { month: 'Feb', amt: 12000 },
                      { month: 'Mar', amt: 15500 },
                      { month: 'Apr', amt: 11000 },
                      { month: 'May', amt: 20950 }
                    ].map((d, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <span className="text-[10px] text-[#236625] font-black">₹{d.amt}</span>
                        <div className="w-full bg-gradient-to-t from-[#236625] to-[#2F8F2F] rounded-t-md hover:opacity-85 transition-opacity" style={{ height: `${(d.amt / 25000) * 100}%` }} />
                        <span className="text-xs text-gray-400 font-bold">{d.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="text-[#236625]" size={16} /> All Sales Notification Logs
                  </h3>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center text-xs font-semibold text-gray-700 hover:bg-[#F1F8F1]/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#236625] animate-pulse" />
                          <span>{n.text}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ==================================================== */}
        {/* HR MANAGER MODULES */}
        {/* ==================================================== */}
        {role === 'HR Manager' && (
          <>
            {/* SUBMODULE: HR DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Welcome Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#236625] via-[#2F8F2F] to-[#55FA62] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Human Resources Operations Console</span>
                    <h1 className="text-2xl md:text-3xl font-black mt-3">Welcome, Sunita Joshi!</h1>
                    <p className="text-xs mt-2 text-emerald-100 font-medium">Coordinate payroll cycles, approve leave requests, and monitor attendance metrics for AgriERP staff.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
                    <Users size={24} />
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-emerald-200">Active Staff</p>
                      <p className="text-base font-black">{staff.filter(s => s.status === 'Active').length} Employees</p>
                    </div>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Total Employees</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">{staff.length}</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Present Today</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      {attendanceLogs.filter(a => a.status === 'Present' || a.status === 'Late').length}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between bg-amber-50 border-amber-250">
                    <p className="text-3xs font-extrabold uppercase text-amber-700">On Leave Today</p>
                    <h4 className="text-xl font-black text-amber-700 mt-1">
                      {leaveRequests.filter(l => l.status === 'Approved').length}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between bg-rose-50 border-rose-250">
                    <p className="text-3xs font-extrabold uppercase text-rose-700">Pending Leaves</p>
                    <h4 className="text-xl font-black text-rose-700 mt-1">
                      {leaveRequests.filter(l => l.status === 'Pending').length}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Monthly Payroll</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      ₹{payrollRecords.reduce((acc, p) => acc + p.net, 0).toLocaleString()}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Open Vacancies</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      {jobOpenings.filter(j => j.status === 'Open').length}
                    </h4>
                  </div>
                </div>

                {/* Visual Charts */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Attendance Trend Chart */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4 md:col-span-2">
                    <h3 className="text-sm font-bold text-gray-800">Weekly Attendance Rate (%)</h3>
                    <div className="h-44 flex items-end justify-between gap-4 pt-4">
                      {[
                        { label: 'Mon', val: 96 },
                        { label: 'Tue', val: 98 },
                        { label: 'Wed', val: 90 },
                        { label: 'Thu', val: 94 },
                        { label: 'Fri', val: 88 },
                        { label: 'Sat', val: 82 }
                      ].map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <span className="text-[10px] text-[#236625] font-black">{day.val}%</span>
                          <div className="w-full bg-gradient-to-t from-[#236625] to-[#2F8F2F] rounded-t-md hover:opacity-85 transition-opacity" style={{ height: `${day.val}%` }} />
                          <span className="text-xs text-gray-400 font-bold">{day.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Staff Department Distribution */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Staff Distribution</h3>
                    <div className="space-y-3 font-semibold text-xs text-gray-600">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Sales Dept</span>
                          <span className="font-bold text-gray-800">{staff.filter(s => s.dept === 'Sales').length} Staff</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-[#236625] h-2 rounded-full" style={{ width: `${(staff.filter(s => s.dept === 'Sales').length / staff.length) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Support Dept</span>
                          <span className="font-bold text-gray-800">{staff.filter(s => s.dept === 'Support').length} Staff</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-[#236625] h-2 rounded-full" style={{ width: `${(staff.filter(s => s.dept === 'Support').length / staff.length) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Finance Dept</span>
                          <span className="font-bold text-gray-800">{staff.filter(s => s.dept === 'Finance').length} Staff</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-[#236625] h-2 rounded-full" style={{ width: `${(staff.filter(s => s.dept === 'Finance').length / staff.length) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Leaves Quick View */}
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-800">Pending Leave Action Pipeline</h3>
                  {leaveRequests.filter(l => l.status === 'Pending').length === 0 ? (
                    <p className="text-xs text-gray-500 font-medium">All leave requests processed.</p>
                  ) : (
                    <div className="space-y-3">
                      {leaveRequests.filter(l => l.status === 'Pending').map(leave => (
                        <div key={leave.id} className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex justify-between items-center text-xs font-semibold">
                          <div>
                            <p className="text-gray-850 font-bold">{leave.employee}</p>
                            <p className="text-3xs text-gray-400 font-extrabold uppercase">{leave.type} • {leave.start} to {leave.end}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setLeaveRequests(prev => prev.map(item => item.id === leave.id ? { ...item, status: 'Approved' } : item))
                                setNotifications(prev => [{ id: Date.now(), text: `Approved leave request for ${leave.employee}`, time: 'Just now' }, ...prev])
                              }}
                              className="bg-[#236625] text-white px-3 py-1.5 rounded-xl text-3xs font-black uppercase tracking-wider"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setLeaveRequests(prev => prev.map(item => item.id === leave.id ? { ...item, status: 'Rejected' } : item))
                                setNotifications(prev => [{ id: Date.now(), text: `Rejected leave request for ${leave.employee}`, time: 'Just now' }, ...prev])
                              }}
                              className="bg-rose-600 text-white px-3 py-1.5 rounded-xl text-3xs font-black uppercase tracking-wider"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUBMODULE: EMPLOYEES */}
            {activeTab === 'employees' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Employee Directory</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">View profiles and manage employment active status logs.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Employee ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Designation</th>
                        <th className="p-4">Joining Date</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map(s => (
                        <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{s.id}</td>
                          <td className="p-4 font-bold text-gray-700">{s.name}</td>
                          <td className="p-4 text-gray-600 font-medium">{s.dept}</td>
                          <td className="p-4 text-gray-500 font-bold">{s.designation}</td>
                          <td className="p-4 text-gray-500">{s.date}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${s.status === 'Active' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-rose-50 text-rose-700'}`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-3">
                            <button onClick={() => setSelectedStaff(s)} className="text-[#236625] underline font-bold uppercase text-[10px]">View Profile</button>
                            {s.status === 'Active' ? (
                              <button
                                onClick={() => {
                                  setStaff(prev => prev.map(item => item.id === s.id ? { ...item, status: 'Suspended' } : item))
                                  setNotifications(prev => [{ id: Date.now(), text: `Suspended employee account: ${s.name}`, time: 'Just now' }, ...prev])
                                }}
                                className="text-rose-600 underline font-bold uppercase text-[10px]"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setStaff(prev => prev.map(item => item.id === s.id ? { ...item, status: 'Active' } : item))
                                  setNotifications(prev => [{ id: Date.now(), text: `Activated employee account: ${s.name}`, time: 'Just now' }, ...prev])
                                }}
                                className="text-emerald-700 underline font-bold uppercase text-[10px]"
                              >
                                Activate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Profile detail popover */}
                {selectedStaff && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setSelectedStaff(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Employee File: {selectedStaff.name}</h3>
                      <div className="text-xs text-gray-600 space-y-2 border-b border-[#F1F8F1] pb-4 font-semibold">
                        <p><strong>Employee ID:</strong> {selectedStaff.id}</p>
                        <p><strong>Full Name:</strong> {selectedStaff.name}</p>
                        <p><strong>Department:</strong> {selectedStaff.dept}</p>
                        <p><strong>Designation:</strong> {selectedStaff.designation}</p>
                        <p><strong>Employment Status:</strong> {selectedStaff.status}</p>
                        <p><strong>Date Joined:</strong> {selectedStaff.date}</p>
                      </div>
                      <button onClick={() => setSelectedStaff(null)} className="w-full btn-secondary text-xs uppercase py-2.5">Close File</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: ATTENDANCE */}
            {activeTab === 'attendance' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Daily Attendance Log</h3>
                    <p className="text-xs text-gray-500 font-semibold">Check-ins, check-outs, and logged hours for the current shift.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Employee Name</th>
                        <th className="p-4">Check In</th>
                        <th className="p-4">Check Out</th>
                        <th className="p-4 text-center">Hours Logged</th>
                        <th className="p-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceLogs.map((log, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-bold text-gray-700">{log.name}</td>
                          <td className="p-4 font-mono text-gray-500">{log.checkIn}</td>
                          <td className="p-4 font-mono text-gray-500">{log.checkOut}</td>
                          <td className="p-4 text-center font-bold text-gray-600">{log.hours} hrs</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${
                              log.status === 'Present' ? 'bg-[#E8F5E9] text-[#2E7D32]' : log.status === 'Late' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBMODULE: LEAVE MANAGEMENT */}
            {activeTab === 'leaves' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Leave Requests Manager</h3>
                    <p className="text-xs text-gray-500 font-semibold">Review, approve, or reject pending employee leave applications.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Leave ID</th>
                        <th className="p-4">Employee</th>
                        <th className="p-4">Leave Type</th>
                        <th className="p-4">Start Date</th>
                        <th className="p-4">End Date</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map(leave => (
                        <tr key={leave.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{leave.id}</td>
                          <td className="p-4 font-bold text-gray-700">{leave.employee}</td>
                          <td className="p-4 font-bold text-[#236625]">{leave.type}</td>
                          <td className="p-4 text-gray-500">{leave.start}</td>
                          <td className="p-4 text-gray-500">{leave.end}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${
                              leave.status === 'Approved' ? 'bg-[#E8F5E9] text-[#2E7D32]' : leave.status === 'Rejected' ? 'bg-rose-50 text-rose-700' : leave.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {leave.status}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            {leave.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => {
                                    setLeaveRequests(prev => prev.map(item => item.id === leave.id ? { ...item, status: 'Approved' } : item))
                                    setNotifications(prev => [{ id: Date.now(), text: `Approved leave request for ${leave.employee}`, time: 'Just now' }, ...prev])
                                  }}
                                  className="bg-emerald-600 text-white px-2 py-0.5 rounded text-3xs font-black uppercase tracking-wider"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setLeaveRequests(prev => prev.map(item => item.id === leave.id ? { ...item, status: 'Rejected' } : item))
                                    setNotifications(prev => [{ id: Date.now(), text: `Rejected leave request for ${leave.employee}`, time: 'Just now' }, ...prev])
                                  }}
                                  className="bg-rose-600 text-white px-2 py-0.5 rounded text-3xs font-black uppercase tracking-wider"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button onClick={() => setSelectedLeave(leave)} className="text-[#236625] underline font-bold uppercase text-[10px]">Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Leave details popover */}
                {selectedLeave && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setSelectedLeave(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Leave Details</h3>
                      <div className="text-xs text-gray-600 space-y-2 border-b border-[#F1F8F1] pb-4 font-semibold">
                        <p><strong>Request ID:</strong> {selectedLeave.id}</p>
                        <p><strong>Employee:</strong> {selectedLeave.employee}</p>
                        <p><strong>Type:</strong> {selectedLeave.type}</p>
                        <p><strong>Start Date:</strong> {selectedLeave.start}</p>
                        <p><strong>End Date:</strong> {selectedLeave.end}</p>
                        <p><strong>Current Status:</strong> {selectedLeave.status}</p>
                      </div>
                      <button onClick={() => setSelectedLeave(null)} className="w-full btn-secondary text-xs uppercase py-2.5">Close</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: PAYROLL */}
            {activeTab === 'payroll' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Payroll Directory</h3>
                    <p className="text-xs text-gray-500 font-semibold">Calculate and approve net employee salaries and view payslips.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Employee Name</th>
                        <th className="p-4 text-right">Basic Salary</th>
                        <th className="p-4 text-right">Bonus Incentives</th>
                        <th className="p-4 text-right">Deductions</th>
                        <th className="p-4 text-right">Net Payable Salary</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrollRecords.map((pay, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-bold text-gray-700">{pay.name}</td>
                          <td className="p-4 text-right font-semibold">₹{pay.salary.toLocaleString()}</td>
                          <td className="p-4 text-right text-emerald-700 font-bold">+₹{pay.bonus.toLocaleString()}</td>
                          <td className="p-4 text-right text-rose-600 font-bold">-₹{pay.deduction.toLocaleString()}</td>
                          <td className="p-4 text-right font-black">₹{pay.net.toLocaleString()}</td>
                          <td className="p-4 text-center space-x-2">
                            <button onClick={() => setSelectedPayroll(pay)} className="text-[#236625] underline font-bold uppercase text-[10px]">View Payslip</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Payslip Generator Popover */}
                {selectedPayroll && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setSelectedPayroll(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Generated Payslip</h3>
                      <div className="border border-dashed border-[#D8EAD8] p-4 rounded-2xl space-y-4 text-xs font-semibold text-gray-600">
                        <p className="text-center font-black uppercase tracking-wider text-gray-800 text-[10px]">AgriERP Salary Slip</p>
                        <hr className="border-dashed border-[#D8EAD8]"/>
                        <p><strong>Employee Name:</strong> {selectedPayroll.name}</p>
                        <p><strong>Salary Period:</strong> May 2026</p>
                        <hr className="border-dashed border-[#D8EAD8]"/>
                        <p className="flex justify-between"><span>Basic Salary:</span> <span>₹{selectedPayroll.salary.toLocaleString()}</span></p>
                        <p className="flex justify-between text-emerald-700"><span>Bonus/Incentives:</span> <span>+₹{selectedPayroll.bonus.toLocaleString()}</span></p>
                        <p className="flex justify-between text-rose-600"><span>PF/Taxes Deductions:</span> <span>-₹{selectedPayroll.deduction.toLocaleString()}</span></p>
                        <hr className="border-dashed border-[#D8EAD8]"/>
                        <p className="flex justify-between text-gray-900 font-black text-xs"><span>Net Salary:</span> <span>₹{selectedPayroll.net.toLocaleString()}</span></p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            const printWindow = window.open('', '_blank');
                            printWindow.document.write(`
                              <html>
                                <head><title>Payslip ${selectedPayroll.name}</title></head>
                                <body style="font-family: Arial; padding: 40px; color: #333;">
                                  <h2 style="text-align: center;">AgriERP Salary Statement</h2>
                                  <hr/>
                                  <p><strong>Employee:</strong> ${selectedPayroll.name}</p>
                                  <p><strong>Statement Month:</strong> May 2026</p>
                                  <p><strong>Basic:</strong> ₹${selectedPayroll.salary.toLocaleString()}</p>
                                  <p><strong>Bonus:</strong> ₹${selectedPayroll.bonus.toLocaleString()}</p>
                                  <p><strong>Deductions:</strong> ₹${selectedPayroll.deduction.toLocaleString()}</p>
                                  <hr/>
                                  <h3>Net Transferred Amount: ₹${selectedPayroll.net.toLocaleString()}</h3>
                                  <p style="font-size: 10px; color: gray;">This is a system generated payslip for internal auditing compliance.</p>
                                </body>
                              </html>
                            `);
                            printWindow.document.close();
                            printWindow.print();
                            setSelectedPayroll(null)
                          }}
                          className="btn-primary text-xs uppercase py-2.5"
                        >
                          Print / PDF
                        </button>
                        <button onClick={() => setSelectedPayroll(null)} className="btn-secondary text-xs uppercase py-2.5">Close</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: RECRUITMENT */}
            {activeTab === 'recruitment' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid md:grid-cols-3 gap-6 items-start">
                  {/* Vacancy lists */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4 md:col-span-1">
                    <h3 className="text-sm font-bold text-gray-800">Job Vacancies Board</h3>
                    <div className="space-y-3">
                      {jobOpenings.map(job => (
                        <div key={job.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold space-y-1">
                          <p className="font-bold text-gray-800">{job.title}</p>
                          <p className="text-3xs text-gray-400 uppercase font-black">{job.dept} • {job.status}</p>
                          <p className="text-3xs text-[#236625] font-black">{job.applicants} Applicants registered</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Applicants Directory */}
                  <div className="table-wrapper md:col-span-2">
                    <div className="table-header">
                      <h3 className="text-sm font-bold text-gray-800">Candidate Pipeline</h3>
                    </div>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                          <th className="p-4">Candidate Name</th>
                          <th className="p-4">Applied Designation</th>
                          <th className="p-4">Interview Schedule</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicants.map(app => (
                          <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="p-4 font-bold text-gray-700">{app.name}</td>
                            <td className="p-4 text-gray-500 font-bold">{app.jobTitle}</td>
                            <td className="p-4 font-mono text-gray-500">{app.interviewDate || 'Not Scheduled'}</td>
                            <td className="p-4 text-center">
                              <span className={`status-badge ${
                                app.status === 'Hired' ? 'bg-[#E8F5E9] text-[#2E7D32]' : app.status === 'Shortlisted' ? 'bg-blue-50 text-blue-700' : app.status === 'Applied' ? 'bg-gray-100 text-gray-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="p-4 text-center space-x-2">
                              {app.status !== 'Hired' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedApplicantId(app.id)
                                      setInterviewModalOpen(true)
                                    }}
                                    className="bg-blue-600 text-white px-2 py-0.5 rounded text-3xs font-black uppercase tracking-wider"
                                  >
                                    Schedule
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Move candidate to staff list
                                      const newStaff = {
                                        id: `EMP-${Date.now().toString().slice(-2)}`,
                                        name: app.name,
                                        dept: app.jobTitle.includes('Delivery') ? 'Logistics' : 'Operations',
                                        designation: app.jobTitle,
                                        status: 'Active',
                                        date: new Date().toISOString().split('T')[0]
                                      }
                                      setStaff(prev => [...prev, newStaff])
                                      
                                      // Log to payroll
                                      const newPayroll = {
                                        name: app.name,
                                        salary: 22000,
                                        bonus: 0,
                                        deduction: 500,
                                        net: 21500
                                      }
                                      setPayrollRecords(prev => [...prev, newPayroll])

                                      setApplicants(prev => prev.map(a => a.id === app.id ? { ...a, status: 'Hired' } : a))
                                      setNotifications(prev => [{ id: Date.now(), text: `Hired candidate ${app.name} as ${app.jobTitle}`, time: 'Just now' }, ...prev])
                                    }}
                                    className="bg-emerald-600 text-white px-2 py-0.5 rounded text-3xs font-black uppercase tracking-wider"
                                  >
                                    Hire
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Interview Scheduler Modal */}
                {interviewModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setInterviewModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Schedule Interview Slot</h3>
                      <div className="space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Interview Date</label>
                          <input
                            type="date"
                            value={interviewDate}
                            onChange={(e) => setInterviewDate(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              if (!interviewDate) return
                              setApplicants(prev => prev.map(a => a.id === selectedApplicantId ? { ...a, status: 'Interview Scheduled', interviewDate: interviewDate } : a))
                              const candidate = applicants.find(a => a.id === selectedApplicantId)
                              setNotifications(prev => [{ id: Date.now(), text: `Scheduled interview for ${candidate?.name} on ${interviewDate}`, time: 'Just now' }, ...prev])
                              setInterviewDate('')
                              setInterviewModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Save Slot
                          </button>
                          <button onClick={() => setInterviewModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: PERFORMANCE REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid md:grid-cols-3 gap-6 items-start">
                  {/* Reviews Form */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4 md:col-span-1">
                    <h3 className="text-sm font-bold text-gray-800">Log Performance Review</h3>
                    <div className="space-y-3 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Select Employee</label>
                        <select
                          value={reviewEmployeeName}
                          onChange={(e) => setReviewEmployeeName(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold"
                        >
                          <option value="">-- Choose Employee --</option>
                          {staff.map(s => (
                            <option key={s.id} value={s.name}>{s.name} ({s.designation})</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Rating Score (1-5 Stars)</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold"
                        >
                          <option>5</option>
                          <option>4</option>
                          <option>3</option>
                          <option>2</option>
                          <option>1</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Productivity Rate (%)</label>
                        <input
                          type="number"
                          placeholder="e.g. 95"
                          value={reviewProductivity}
                          onChange={(e) => setReviewProductivity(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Sales / Operational Target Achievement</label>
                        <input
                          type="text"
                          placeholder="e.g. 85%"
                          value={reviewTarget}
                          onChange={(e) => setReviewTarget(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (!reviewEmployeeName || !reviewProductivity) return
                          const exists = performanceReviews.find(r => r.name === reviewEmployeeName)
                          if (exists) {
                            setPerformanceReviews(prev => prev.map(r => r.name === reviewEmployeeName ? { ...r, rating: parseFloat(reviewRating), productivity: parseInt(reviewProductivity), targetAchieved: reviewTarget || 'N/A' } : r))
                          } else {
                            setPerformanceReviews(prev => [...prev, { name: reviewEmployeeName, rating: parseFloat(reviewRating), productivity: parseInt(reviewProductivity), targetAchieved: reviewTarget || 'N/A' }])
                          }
                          setNotifications(prev => [{ id: Date.now(), text: `Logged performance review for ${reviewEmployeeName}`, time: 'Just now' }, ...prev])
                          setReviewEmployeeName('')
                          setReviewProductivity('')
                          setReviewTarget('')
                        }}
                        className="btn-primary w-full py-2.5 text-xs font-black uppercase mt-2 border-none"
                      >
                        Submit Evaluation
                      </button>
                    </div>
                  </div>

                  {/* Rating Score board */}
                  <div className="table-wrapper md:col-span-2">
                    <div className="table-header">
                      <h3 className="text-sm font-bold text-gray-800">Evaluations Register</h3>
                    </div>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                          <th className="p-4">Employee</th>
                          <th className="p-4 text-center">Productivity score</th>
                          <th className="p-4 text-center">Achievements</th>
                          <th className="p-4 text-center">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {performanceReviews.map((rev, idx) => (
                          <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="p-4 font-bold text-gray-700">{rev.name}</td>
                            <td className="p-4 text-center font-bold text-[#236625]">{rev.productivity}% Score</td>
                            <td className="p-4 text-center font-semibold text-gray-500">{rev.targetAchieved}</td>
                            <td className="p-4 text-center">
                              <span className="bg-emerald-50 text-emerald-800 status-badge">★ {rev.rating} / 5</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: ANNOUNCEMENTS */}
            {activeTab === 'announcements' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Corporate Announcements Board</h3>
                    <p className="text-xs text-gray-500 font-semibold">Publish updates on holidays, rules, and general company policies.</p>
                  </div>
                  <button onClick={() => setAnnouncementModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">
                    Publish Alert
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-3 relative">
                      <span className="absolute top-4 right-4 bg-[#F1F8F1] text-[#236625] text-3xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full">{ann.category}</span>
                      <h4 className="text-sm font-bold text-gray-800 pt-2">{ann.title}</h4>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">{ann.content}</p>
                      <hr className="border-gray-100" />
                      <p className="text-3xs text-gray-400 font-bold uppercase">Date: {ann.date}</p>
                    </div>
                  ))}
                </div>

                {/* Announcement Creator Modal */}
                {announcementModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setAnnouncementModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">New Board Announcement</h3>
                      <div className="space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Title</label>
                          <input type="text" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. Offices Closed on June 15th" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Category</label>
                          <select value={annCategory} onChange={(e) => setAnnCategory(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold">
                            <option>Policy Updates</option>
                            <option>Holiday Notice</option>
                            <option>Event</option>
                            <option>General</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Alert Content</label>
                          <textarea value={annContent} onChange={(e) => setAnnContent(e.target.value)} className="w-full px-3 py-2 border border-[#D8EAD8] rounded-xl text-xs outline-none h-20" placeholder="Details of the announcement" required />
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              if (!annTitle || !annContent) return
                              setAnnouncements(prev => [
                                { id: `ANN-${Date.now().toString().slice(-3)}`, title: annTitle, category: annCategory, content: annContent, date: new Date().toISOString().split('T')[0] },
                                ...prev
                              ])
                              setNotifications(prev => [{ id: Date.now(), text: `Published corporate announcement: ${annTitle}`, time: 'Just now' }, ...prev])
                              setAnnTitle('')
                              setAnnContent('')
                              setAnnouncementModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Publish
                          </button>
                          <button onClick={() => setAnnouncementModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: HR REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-800">Generate HR Audit Reports</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const printWindow = window.open('', '_blank');
                          printWindow.document.write(`
                            <html>
                              <head><title>AgriERP HR Manager Audit Report</title></head>
                              <body style="font-family: Arial; padding: 40px; color: #333;">
                                <h2>AgriERP Human Resources Audit Report</h2>
                                <p><strong>Generated By:</strong> Sunita Joshi</p>
                                <p><strong>Role:</strong> HR Manager</p>
                                <p><strong>Report Type:</strong> ${reportType.toUpperCase()}</p>
                                <hr/>
                                <p>Report compiled successfully on ${new Date().toLocaleDateString()}</p>
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                          printWindow.print();
                        }}
                        className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 px-3 py-1.5 rounded-xl shadow-sm"
                      >
                        <FileDown size={14} /> Export to PDF
                      </button>
                    </div>
                  </div>

                  {/* Report selector */}
                  <div className="flex gap-2 border-b border-[#F1F8F1] pb-4">
                    {['staff', 'attendance', 'payroll'].map(t => (
                      <button
                        key={t}
                        onClick={() => setReportType(t)}
                        className={`px-4 py-2 text-xs font-black uppercase border-b-2 transition-all ${
                          reportType === t ? 'border-[#236625] text-[#236625]' : 'border-transparent text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        {t} Report
                      </button>
                    ))}
                  </div>

                  {/* Data tables */}
                  <div className="table-wrapper">
                    {reportType === 'staff' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Employee ID</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Department</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {staff.map(s => (
                            <tr key={s.id} className="border-b border-gray-50">
                              <td className="p-4 font-mono font-bold text-gray-500">{s.id}</td>
                              <td className="p-4 font-bold text-gray-700">{s.name}</td>
                              <td className="p-4 text-gray-600 font-medium">{s.dept}</td>
                              <td className="p-4">
                                <span className={`status-badge ${s.status === 'Active' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-rose-50 text-rose-700'}`}>{s.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {reportType === 'attendance' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Employee Name</th>
                            <th className="p-4 text-center">Hours Logged</th>
                            <th className="p-4 text-center">Shift Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceLogs.map((log, idx) => (
                            <tr key={idx} className="border-b border-gray-50">
                              <td className="p-4 font-bold text-gray-700">{log.name}</td>
                              <td className="p-4 text-center font-bold text-gray-600">{log.hours} hrs</td>
                              <td className="p-4 text-center font-bold text-gray-650">{log.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {reportType === 'payroll' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Employee Name</th>
                            <th className="p-4 text-right">Basic Salary</th>
                            <th className="p-4 text-right">Net Payable Salary</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payrollRecords.map((pay, idx) => (
                            <tr key={idx} className="border-b border-gray-50">
                              <td className="p-4 font-bold text-gray-700">{pay.name}</td>
                              <td className="p-4 text-right">₹{pay.salary.toLocaleString()}</td>
                              <td className="p-4 text-right font-black text-gray-900">₹{pay.net.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: HR NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="text-[#236625]" size={16} /> All HR Notification Logs
                  </h3>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center text-xs font-semibold text-gray-700 hover:bg-[#F1F8F1]/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#236625] animate-pulse" />
                          <span>{n.text}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ==================================================== */}
        {/* DELIVERY COORDINATOR MODULES */}
        {/* ==================================================== */}
        {role === 'Delivery Coordinator' && (
          <>
            {/* SUBMODULE: DELIVERY DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Welcome Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#236625] via-[#2F8F2F] to-[#55FA62] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Logistics Operations Console</span>
                    <h1 className="text-2xl md:text-3xl font-black mt-3">Welcome, Vikram Shinde!</h1>
                    <p className="text-xs mt-2 text-emerald-100 font-medium">Coordinate route optimizations, assign deliveries, and track shipment dispatch statuses in real time.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
                    <Truck size={24} />
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-emerald-200">Active Shipments</p>
                      <p className="text-base font-black">{deliveries.filter(d => d.status !== 'Delivered').length} Packages</p>
                    </div>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Today's Deliveries</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      {deliveries.filter(d => d.date === '2026-06-02').length}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Pending Deliveries</p>
                    <h4 className="text-xl font-black text-amber-700 mt-1">
                      {deliveries.filter(d => d.status === 'Assigned').length}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between bg-blue-50 border-blue-200">
                    <p className="text-3xs font-extrabold uppercase text-blue-700">In Transit Orders</p>
                    <h4 className="text-xl font-black text-blue-700 mt-1">
                      {deliveries.filter(d => d.status === 'In Transit').length}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between bg-emerald-50 border-emerald-200">
                    <p className="text-3xs font-extrabold uppercase text-[#2E7D32]">Completed Today</p>
                    <h4 className="text-xl font-black text-[#2E7D32] mt-1">
                      {deliveries.filter(d => d.status === 'Delivered').length}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between bg-rose-50 border-rose-200">
                    <p className="text-3xs font-extrabold uppercase text-rose-700">Failed Deliveries</p>
                    <h4 className="text-xl font-black text-rose-700 mt-1">{failedDeliveries.length}</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Success Rate</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">88%</h4>
                  </div>
                </div>

                {/* Dashboard Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Delivery Trend */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Daily Delivery Trend</h3>
                    <div className="h-44 flex items-end justify-between gap-2 pt-4">
                      {[
                        { label: 'Mon', val: 15 },
                        { label: 'Tue', val: 22 },
                        { label: 'Wed', val: 18 },
                        { label: 'Thu', val: 30 },
                        { label: 'Fri', val: 25 },
                        { label: 'Sat', val: 32 },
                        { label: 'Sun', val: 12 }
                      ].map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <span className="text-[9px] text-[#236625] font-black">{day.val}</span>
                          <div className="w-full bg-[#236625] rounded-t-md hover:opacity-85 transition-opacity" style={{ height: `${(day.val / 35) * 100}%` }} />
                          <span className="text-3xs text-gray-400 font-bold">{day.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Status Analytics */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Delivery Status Analytics</h3>
                    <div className="space-y-3 font-semibold text-xs text-gray-600">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Delivered</span>
                          <span className="font-bold text-gray-800">65%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-[#236625] h-2 rounded-full" style={{ width: '65%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>In Transit</span>
                          <span className="font-bold text-gray-800">20%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Assigned / Pending</span>
                          <span className="font-bold text-gray-800">10%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Failed Logs</span>
                          <span className="font-bold text-gray-800">5%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-rose-500 h-2 rounded-full" style={{ width: '5%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Executive Performance List */}
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-800">Executive Performance</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {deliveryStaff.map((staff, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 border border-gray-150 rounded-2xl space-y-2 text-xs font-semibold text-gray-600">
                        <p className="font-bold text-gray-800 border-b border-gray-200 pb-1 flex justify-between">
                          <span>{staff.name}</span>
                          <span className={`status-badge text-[9px] ${staff.status === 'Available' ? 'bg-[#E8F5E9] text-[#2E7D32]' : staff.status === 'Busy' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>{staff.status}</span>
                        </p>
                        <p>Mobile: <strong className="text-gray-700">{staff.mobile}</strong></p>
                        <p>Assigned Today: <strong className="text-[#236625]">{staff.assigned}</strong></p>
                        <p>Completed: <strong className="text-gray-700">{staff.completed}</strong></p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: DELIVERY ASSIGNMENTS */}
            {activeTab === 'assignments' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Delivery Assignments Panel</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Assign shipments and manage route allocations for delivery executives.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Delivery Address</th>
                        <th className="p-4">Assigned Executive</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveries.map(d => (
                        <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{d.orderId}</td>
                          <td className="p-4 font-bold text-gray-700">{d.customerName}</td>
                          <td className="p-4 text-gray-600 font-medium">{d.address}</td>
                          <td className="p-4 text-gray-500 font-bold">{d.executive || 'Unassigned'}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${
                              d.status === 'Delivered' ? 'bg-[#E8F5E9] text-[#2E7D32]' : d.status === 'In Transit' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedDeliveryForAssign(d.id)
                                setAssignModalOpen(true)
                              }}
                              className="text-[#236625] underline font-bold uppercase text-[10px]"
                            >
                              Assign / Reassign
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Assignment Modal */}
                {assignModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setAssignModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800 font-sans">Assign Shipment Executive</h3>
                      <div className="space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Select Delivery Executive</label>
                          <select
                            value={assignExecutive}
                            onChange={(e) => setAssignExecutive(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold"
                          >
                            {deliveryStaff.map((staff) => (
                              <option key={staff.id} value={staff.email}>
                                {staff.name} ({staff.id}) — {staff.status}
                              </option>
                            ))}
                          </select>
                          {(() => {
                            const sel = deliveryStaff.find(s => s.email === assignExecutive)
                            return sel ? (
                              <div className="p-3 bg-[#F1F8F1] border border-[#D8EAD8] rounded-xl space-y-1 text-[10px] font-semibold text-gray-600">
                                <div className="flex justify-between"><span className="font-black text-gray-400 uppercase">ID</span><span className="font-black text-[#236625]">{sel.id}</span></div>
                                <div className="flex justify-between"><span className="font-black text-gray-400 uppercase">Email</span><span>{sel.email}</span></div>
                                <div className="flex justify-between"><span className="font-black text-gray-400 uppercase">Mobile</span><span>{sel.mobile}</span></div>
                              </div>
                            ) : null
                          })()}
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              const selExec = deliveryStaff.find(s => s.email === assignExecutive)
                              setDeliveries(prev => prev.map(d => d.id === selectedDeliveryForAssign ? {
                                ...d,
                                executive: selExec?.name || assignExecutive,
                                executiveEmail: assignExecutive,
                                executiveId: selExec?.id || 'DE-???',
                                status: 'Assigned'
                              } : d))
                              const currentDel = deliveries.find(d => d.id === selectedDeliveryForAssign)
                              if (currentDel && currentDel.orderId) {
                                updateOrderDb(currentDel.orderId, { 
                                  orderStatus: 'Assigned',
                                  assignedDeliveryExecutive: selExec?.name || assignExecutive,
                                  assignedDeliveryExecutiveId: selExec?.id || 'DE-???',
                                  assignedDeliveryExecutiveName: selExec?.name || assignExecutive,
                                  assignedDeliveryExecutiveEmail: assignExecutive
                                })
                              }
                              setNotifications(prev => [{ id: Date.now(), text: `Assigned ${selExec?.name || assignExecutive} (${selExec?.id}) to delivery ${selectedDeliveryForAssign}`, time: 'Just now' }, ...prev])
                              setAssignModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Confirm Assignment
                          </button>
                          <button onClick={() => setAssignModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: DELIVERY SCHEDULING */}
            {activeTab === 'scheduling' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Delivery Scheduling Manager</h3>
                    <p className="text-xs text-gray-500 font-semibold">Reschedule delivery windows and assign specific slots for deliveries.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Delivery Date</th>
                        <th className="p-4">Time Slot</th>
                        <th className="p-4">Assigned Executive</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveries.map(d => (
                        <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{d.orderId}</td>
                          <td className="p-4 font-bold text-gray-700">{d.customerName}</td>
                          <td className="p-4 text-gray-600">{d.date}</td>
                          <td className="p-4 font-mono text-[#236625] font-bold">{d.timeSlot}</td>
                          <td className="p-4 text-gray-500 font-semibold">{d.executive}</td>
                          <td className="p-4 text-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedDeliveryForAssign(d.id)
                                setScheduleDate(d.date)
                                setScheduleSlot(d.timeSlot)
                                setScheduleModalOpen(true)
                              }}
                              className="text-[#236625] underline font-bold uppercase text-[10px]"
                            >
                              Change Schedule
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Scheduling Modal */}
                {scheduleModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setScheduleModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Edit Delivery Schedule</h3>
                      <div className="space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Delivery Date</label>
                          <input
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Time Slot</label>
                          <select
                            value={scheduleSlot}
                            onChange={(e) => setScheduleSlot(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold"
                          >
                            <option>09:00 AM - 12:00 PM</option>
                            <option>10:00 AM - 01:00 PM</option>
                            <option>01:00 PM - 04:00 PM</option>
                            <option>02:00 PM - 05:00 PM</option>
                            <option>05:00 PM - 08:00 PM</option>
                          </select>
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              setDeliveries(prev => prev.map(d => d.id === selectedDeliveryForAssign ? { ...d, date: scheduleDate, timeSlot: scheduleSlot } : d))
                              setNotifications(prev => [{ id: Date.now(), text: `Rescheduled delivery for ${selectedDeliveryForAssign} to ${scheduleDate} (${scheduleSlot})`, time: 'Just now' }, ...prev])
                              setScheduleModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Save Schedule
                          </button>
                          <button onClick={() => setScheduleModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: ROUTE PLANNING */}
            {activeTab === 'routes' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Route Planning & Distance Optimization</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Simulate routing paths, distances, and estimated times of arrival.</p>
                  </div>
                  <button onClick={() => setRouteModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">
                    Plan New Route
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Route Name</th>
                        <th className="p-4">Stops Sequence</th>
                        <th className="p-4 text-center">Total Distance</th>
                        <th className="p-4 text-center">Estimated Time</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {optimizedRoutes.map(route => (
                        <tr key={route.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-bold text-gray-700">{route.name}</td>
                          <td className="p-4 text-gray-600 font-medium">{route.stops}</td>
                          <td className="p-4 text-center font-bold text-gray-800">{route.distance}</td>
                          <td className="p-4 text-center font-mono text-[#236625] font-black">{route.time}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => {
                                setOptimizedRoutes(prev => prev.filter(r => r.id !== route.id))
                              }}
                              className="text-rose-600 underline font-bold uppercase text-[10px]"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Route Creator Modal */}
                {routeModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setRouteModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Add Optimized Route</h3>
                      <div className="space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Route Name</label>
                          <input type="text" value={routeNameInput} onChange={(e) => setRouteNameInput(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. Wardha North Link" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Stops Sequence</label>
                          <input type="text" value={routeStopsInput} onChange={(e) => setRouteStopsInput(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. Silo -> Stop A -> Stop B" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Total Distance (km)</label>
                          <input type="text" value={routeDistInput} onChange={(e) => setRouteDistInput(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. 24 km" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Estimated Time</label>
                          <input type="text" value={routeTimeInput} onChange={(e) => setRouteTimeInput(e.target.value)} className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none" placeholder="e.g. 1 hr 10 mins" required />
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              if (!routeNameInput || !routeStopsInput) return
                              setOptimizedRoutes(prev => [
                                ...prev,
                                {
                                  id: `r-${Date.now()}`,
                                  name: routeNameInput,
                                  stops: routeStopsInput,
                                  distance: routeDistInput || 'N/A',
                                  time: routeTimeInput || 'N/A'
                                }
                              ])
                              setNotifications(prev => [{ id: Date.now(), text: `Optimized new route: ${routeNameInput}`, time: 'Just now' }, ...prev])
                              setRouteNameInput('')
                              setRouteStopsInput('')
                              setRouteDistInput('')
                              setRouteTimeInput('')
                              setRouteModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Save Route
                          </button>
                          <button onClick={() => setRouteModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: LIVE TRACKING */}
            {activeTab === 'tracking' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Live Delivery Shipment Tracking</h3>
                    <p className="text-xs text-gray-500 font-semibold">Monitor delivery status cycles (Assigned → Picked Up → In Transit → Delivered).</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {deliveries.filter(d => d.status !== 'Delivered').map(delivery => (
                    <div key={delivery.id} className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-150 pb-3 gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <span className="font-mono text-gray-500">{delivery.orderId}</span>
                            <span>({delivery.customerName})</span>
                          </h4>
                          <p className="text-3xs text-gray-400 uppercase font-black tracking-wider mt-0.5">Route: {delivery.route} • Driver: {delivery.executive}</p>
                        </div>
                        <div className="flex gap-2">
                          {['Assigned', 'Picked Up', 'In Transit', 'Delivered'].map(statusOption => (
                            <button
                              key={statusOption}
                              onClick={() => {
                                setDeliveries(prev => prev.map(d => d.id === delivery.id ? { ...d, status: statusOption } : d))
                                updateOrderDb(delivery.orderId, { orderStatus: statusOption === 'Delivered' ? 'Delivered' : 'Out For Delivery' })
                                if (statusOption === 'Delivered') {
                                  const orderObj = orders.find(o => o.id === delivery.orderId)
                                  const amountVal = orderObj ? orderObj.total : 2400
                                  const newPayment = {
                                    id: `PAY-${Math.floor(1000 + Math.random() * 8999)}`,
                                    customer: delivery.customerName,
                                    amount: amountVal,
                                    method: 'UPI',
                                    date: new Date().toISOString().split('T')[0],
                                    status: 'Pending',
                                    orderId: delivery.orderId
                                  }
                                  setPayments(prev => [newPayment, ...prev])
                                }
                                setNotifications(prev => [{ id: Date.now(), text: `Delivery status for ${delivery.orderId} changed to ${statusOption}`, time: 'Just now' }, ...prev])
                              }}
                              className={`px-2.5 py-1 text-3xs font-black uppercase tracking-wider rounded-lg border transition-all ${
                                delivery.status === statusOption
                                  ? 'bg-[#236625] text-white border-[#236625] scale-[1.02]'
                                  : 'bg-white text-gray-550 border-gray-200 hover:bg-[#F1F8F1]'
                              }`}
                            >
                              {statusOption}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Visual progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-3xs font-extrabold uppercase text-gray-400">
                          <span className={delivery.status === 'Assigned' || delivery.status === 'Picked Up' || delivery.status === 'In Transit' || delivery.status === 'Delivered' ? 'text-[#236625]' : ''}>Assigned</span>
                          <span className={delivery.status === 'Picked Up' || delivery.status === 'In Transit' || delivery.status === 'Delivered' ? 'text-[#236625]' : ''}>Picked Up</span>
                          <span className={delivery.status === 'In Transit' || delivery.status === 'Delivered' ? 'text-blue-600 font-bold' : ''}>In Transit</span>
                          <span className={delivery.status === 'Delivered' ? 'text-emerald-700 font-bold' : ''}>Delivered</span>
                        </div>
                        <div className="w-full bg-gray-150 h-3 rounded-full overflow-hidden relative">
                          <div className={`h-full rounded-full transition-all duration-300 ${delivery.status === 'In Transit' ? 'bg-blue-500' : 'bg-[#236625]'}`} style={{
                            width: delivery.status === 'Assigned' ? '12.5%' : delivery.status === 'Picked Up' ? '37.5%' : delivery.status === 'In Transit' ? '70%' : '100%'
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBMODULE: DELIVERY STAFF */}
            {activeTab === 'staff_list' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Logistics Delivery Staff</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Verify executive load metrics, phone numbers, and availability flags.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Executive Name</th>
                        <th className="p-4 hidden md:table-cell">ID</th>
                        <th className="p-4 hidden lg:table-cell">Email</th>
                        <th className="p-4">Mobile</th>
                        <th className="p-4 text-center">Assigned</th>
                        <th className="p-4 text-center">Completed</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryStaff.map((staff, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-bold text-gray-700">{staff.name}</td>
                          <td className="p-4 font-mono text-[10px] text-[#236625] font-black hidden md:table-cell">{staff.id}</td>
                          <td className="p-4 text-gray-500 text-[10px] hidden lg:table-cell">{staff.email}</td>
                          <td className="p-4 text-gray-500">{staff.mobile}</td>
                          <td className="p-4 text-center font-bold text-[#236625]">{staff.assigned}</td>
                          <td className="p-4 text-center text-gray-500 font-medium">{staff.completed}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${
                              staff.status === 'Available' ? 'bg-[#E8F5E9] text-[#2E7D32]' : staff.status === 'Busy' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {staff.status}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            {staff.status !== 'Available' ? (
                              <button
                                onClick={() => {
                                  setDeliveryStaff(prev => prev.map(s => s.id === staff.id ? { ...s, status: 'Available' } : s))
                                }}
                                className="text-emerald-700 underline font-bold uppercase text-[10px]"
                              >
                                Make Available
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setDeliveryStaff(prev => prev.map(s => s.id === staff.id ? { ...s, status: 'Offline' } : s))
                                }}
                                className="text-rose-600 underline font-bold uppercase text-[10px]"
                              >
                                Go Offline
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBMODULE: FAILED DELIVERIES */}
            {activeTab === 'failed' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Failed Shipment Logs</h3>
                    <p className="text-xs text-gray-500 font-semibold">Review reasons for failed dispatches and trigger correction processes.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Failed Reason</th>
                        <th className="p-4">Log Date</th>
                        <th className="p-4">Assigned Driver</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {failedDeliveries.map((f, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{f.orderId}</td>
                          <td className="p-4 font-bold text-gray-700">{f.customer}</td>
                          <td className="p-4 text-rose-600 font-bold">{f.reason}</td>
                          <td className="p-4 text-gray-500">{f.date}</td>
                          <td className="p-4 text-gray-600 font-semibold">{f.executive}</td>
                          <td className="p-4 text-center space-x-3">
                            <button
                              onClick={() => {
                                setDeliveries(prev => [
                                  ...prev,
                                  {
                                    id: `DEL-${Date.now()}`,
                                    orderId: f.orderId,
                                    customerName: f.customer,
                                    address: 'Reassigned from failure log',
                                    executive: 'Ramesh Patil',
                                    status: 'Assigned',
                                    date: new Date().toISOString().split('T')[0],
                                    timeSlot: '10:00 AM - 01:00 PM',
                                    route: 'Wardha Route'
                                  }
                                ])
                                setFailedDeliveries(prev => prev.filter(item => item.orderId !== f.orderId))
                                setNotifications(prev => [{ id: Date.now(), text: `Rescheduled shipment for ${f.orderId}`, time: 'Just now' }, ...prev])
                              }}
                              className="text-[#236625] underline font-bold uppercase text-[10px]"
                            >
                              Reschedule & Reassign
                            </button>
                            <button
                              onClick={() => {
                                setFailedDeliveries(prev => prev.filter(item => item.orderId !== f.orderId))
                                setNotifications(prev => [{ id: Date.now(), text: `Cancelled shipment ${f.orderId} from log`, time: 'Just now' }, ...prev])
                              }}
                              className="text-rose-600 underline font-bold uppercase text-[10px]"
                            >
                              Cancel Order
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBMODULE: DELIVERY COMPLAINTS */}
            {activeTab === 'complaints' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Logistics Delivery Complaints</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Resolve customer delivery complaints, late arrivals, and packaging damage issues.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Complaint ID</th>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Complaint Issue</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryComplaints.map((c, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-[#236625]">{c.id}</td>
                          <td className="p-4 font-bold text-gray-700">{c.customer}</td>
                          <td className="p-4 font-mono text-gray-500">{c.orderId}</td>
                          <td className="p-4 text-gray-600 font-medium">{c.type}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${
                              c.status === 'Resolved' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            {c.status === 'Open' && (
                              <>
                                <button
                                  onClick={() => {
                                    setDeliveryComplaints(prev => prev.map(item => item.id === c.id ? { ...item, status: 'Resolved' } : item))
                                    setNotifications(prev => [{ id: Date.now(), text: `Resolved delivery complaint ${c.id}`, time: 'Just now' }, ...prev])
                                  }}
                                  className="bg-emerald-600 text-white px-2 py-0.5 rounded text-3xs font-black uppercase tracking-wider"
                                >
                                  Resolve
                                </button>
                                <button
                                  onClick={() => {
                                    setDeliveryComplaints(prev => prev.map(item => item.id === c.id ? { ...item, status: 'Escalated' } : item))
                                    setNotifications(prev => [{ id: Date.now(), text: `Escalated delivery complaint ${c.id}`, time: 'Just now' }, ...prev])
                                  }}
                                  className="bg-rose-600 text-white px-2 py-0.5 rounded text-3xs font-black uppercase tracking-wider"
                                >
                                  Escalate
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBMODULE: DELIVERY REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-800">Export Delivery Audit Reports</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const printWindow = window.open('', '_blank');
                          printWindow.document.write(`
                            <html>
                              <head><title>AgriERP Delivery Coordinator Audit Report</title></head>
                              <body style="font-family: Arial; padding: 40px; color: #333;">
                                <h2>AgriERP Logistics Delivery Audit Report</h2>
                                <p><strong>Generated By:</strong> Vikram Shinde</p>
                                <p><strong>Role:</strong> Delivery Coordinator</p>
                                <p><strong>Report Type:</strong> ${reportType.toUpperCase()}</p>
                                <hr/>
                                <p>Logistics audit report compiled successfully on ${new Date().toLocaleDateString()}</p>
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                          printWindow.print();
                        }}
                        className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 px-3 py-1.5 rounded-xl shadow-sm"
                      >
                        <FileDown size={14} /> Export to PDF
                      </button>
                    </div>
                  </div>

                  {/* Report selector */}
                  <div className="flex gap-2 border-b border-[#F1F8F1] pb-4">
                    {['delivery', 'performance', 'failed'].map(t => (
                      <button
                        key={t}
                        onClick={() => setReportType(t)}
                        className={`px-4 py-2 text-xs font-black uppercase border-b-2 transition-all ${
                          reportType === t ? 'border-[#236625] text-[#236625]' : 'border-transparent text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        {t} Report
                      </button>
                    ))}
                  </div>

                  {/* Report Data Table */}
                  <div className="table-wrapper">
                    {reportType === 'delivery' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deliveries.map(d => (
                            <tr key={d.id} className="border-b border-gray-50">
                              <td className="p-4 font-mono font-bold text-gray-500">{d.orderId}</td>
                              <td className="p-4 font-bold text-gray-700">{d.customerName}</td>
                              <td className="p-4 font-bold">{d.status}</td>
                              <td className="p-4 text-gray-500">{d.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {reportType === 'performance' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Driver Name</th>
                            <th className="p-4 text-center">Assigned</th>
                            <th className="p-4 text-center">Completed</th>
                            <th className="p-4 text-center">Efficiency Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deliveryStaff.map((staff, idx) => (
                            <tr key={idx} className="border-b border-gray-50">
                              <td className="p-4 font-bold text-gray-700">{staff.name}</td>
                              <td className="p-4 text-center font-bold">{staff.assigned} loads</td>
                              <td className="p-4 text-center font-bold">{staff.completed} loads</td>
                              <td className="p-4 text-center text-emerald-700 font-black">94%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {reportType === 'failed' && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Reason</th>
                            <th className="p-4">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {failedDeliveries.map((f, idx) => (
                            <tr key={idx} className="border-b border-gray-50">
                              <td className="p-4 font-mono font-bold text-gray-500">{f.orderId}</td>
                              <td className="p-4 text-rose-600 font-bold">{f.reason}</td>
                              <td className="p-4 text-gray-500">{f.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: LOGISTICS NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="text-[#236625]" size={16} /> All Delivery Notification Logs
                  </h3>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center text-xs font-semibold text-gray-700 hover:bg-[#F1F8F1]/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#236625] animate-pulse" />
                          <span>{n.text}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ==================================================== */}
        {/* MARKETING EXECUTIVE MODULES */}
        {/* ==================================================== */}
        {role === 'Marketing Executive' && (
          <>
            {/* SUBMODULE: MARKETING DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Welcome Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#236625] via-[#2F8F2F] to-[#55FA62] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Marketing Console</span>
                    <h1 className="text-2xl md:text-3xl font-black mt-3">Welcome, Karan Patil!</h1>
                    <p className="text-xs mt-2 text-emerald-100 font-medium">Design campaigns, distribute coupon incentives, launch SMS/Email outreach, and audit marketing performance statistics.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
                    <Megaphone size={24} />
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-emerald-200">Active Campaigns</p>
                      <p className="text-base font-black">{mCampaigns.filter(c => c.status === 'Active').length} Live</p>
                    </div>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Active Campaigns</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      {mCampaigns.filter(c => c.status === 'Active').length}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Coupons Created</p>
                    <h4 className="text-xl font-black text-emerald-800 mt-1">
                      {coupons.length}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Messages Sent</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      {smsCampaigns.reduce((acc, c) => acc + c.sent, 0) + emailCampaigns.length * 3500 + whatsappCampaigns.length * 850}
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between bg-emerald-50 border-emerald-200">
                    <p className="text-3xs font-extrabold uppercase text-[#2E7D32]">Conversion Rate</p>
                    <h4 className="text-xl font-black text-[#2E7D32] mt-1">4.8%</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between bg-blue-50 border-blue-200">
                    <p className="text-3xs font-extrabold uppercase text-blue-700">Revenue Impact</p>
                    <h4 className="text-xl font-black text-blue-700 mt-1">₹2.45L</h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Customer Reach</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      {customerSegments.reduce((acc, s) => acc + s.size, 0)}
                    </h4>
                  </div>
                </div>

                {/* Dashboard Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Campaign Performance Bar Chart */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Campaign Outreach Reach</h3>
                    <div className="h-44 flex items-end justify-between gap-4 pt-4">
                      {mCampaigns.map((camp, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                          <span className="text-[9px] text-[#236625] font-black">{camp.reach}</span>
                          <div className="w-full bg-[#236625] rounded-t-md hover:opacity-85 transition-opacity" style={{ height: `${(camp.reach / 4000) * 100}%` }} />
                          <span className="text-3xs text-gray-400 font-bold truncate max-w-[70px]">{camp.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Segments distribution */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Customer Segment Sizes</h3>
                    <div className="space-y-3 font-semibold text-xs text-gray-600">
                      {customerSegments.map((seg, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between mb-1">
                            <span>{seg.name}</span>
                            <span className="font-bold text-gray-800">{seg.size} farmers</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full">
                            <div className="bg-[#236625] h-2 rounded-full" style={{ width: `${(seg.size / 1500) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Campaign Performance Table */}
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-800">Active Marketing Campaigns</h3>
                  <div className="table-wrapper">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                          <th className="p-4">Campaign Name</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Duration</th>
                          <th className="p-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mCampaigns.map((camp, idx) => (
                          <tr key={idx} className="border-b border-gray-50">
                            <td className="p-4 font-bold text-gray-800">{camp.name}</td>
                            <td className="p-4 text-gray-500 font-bold">{camp.type}</td>
                            <td className="p-4 text-gray-500">{camp.start} &rarr; {camp.end}</td>
                            <td className="p-4 text-center">
                              <span className={`status-badge ${
                                camp.status === 'Active' ? 'bg-[#E8F5E9] text-[#2E7D32]' : camp.status === 'Scheduled' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {camp.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: CAMPAIGNS */}
            {activeTab === 'campaigns' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Campaigns Manager</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Launch and analyze structured outreach programs for farmers.</p>
                  </div>
                  <button onClick={() => setCampaignModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">
                    Launch New Campaign
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {mCampaigns.map((camp) => (
                    <div key={camp.id} className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">{camp.type}</span>
                          <h4 className="text-sm font-bold text-gray-800 mt-2">{camp.name}</h4>
                        </div>
                        <span className={`status-badge text-[9px] ${
                          camp.status === 'Active' ? 'bg-[#E8F5E9] text-[#2E7D32]' : camp.status === 'Scheduled' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>{camp.status}</span>
                      </div>
                      
                      <div className="space-y-2 text-xs font-semibold text-gray-600 border-t border-b border-gray-100 py-3">
                        <p className="flex justify-between"><span>Campaign ID:</span> <span className="font-mono text-gray-800">{camp.id}</span></p>
                        <p className="flex justify-between"><span>Start Date:</span> <span className="text-gray-800">{camp.start}</span></p>
                        <p className="flex justify-between"><span>End Date:</span> <span className="text-gray-800">{camp.end}</span></p>
                        <p className="flex justify-between"><span>Est. Reach:</span> <span className="text-[#236625] font-black">{camp.reach} users</span></p>
                      </div>

                      <div className="flex gap-2 justify-end">
                        {camp.status === 'Active' ? (
                          <button
                            onClick={() => {
                              setMCampaigns(prev => prev.map(c => c.id === camp.id ? { ...c, status: 'Paused' } : c))
                              setNotifications(prev => [{ id: Date.now(), text: `Paused campaign: ${camp.name}`, time: 'Just now' }, ...prev])
                            }}
                            className="bg-amber-600 text-white px-3 py-1 rounded-xl text-3xs font-black uppercase"
                          >
                            Pause
                          </button>
                        ) : camp.status === 'Paused' || camp.status === 'Scheduled' ? (
                          <button
                            onClick={() => {
                              setMCampaigns(prev => prev.map(c => c.id === camp.id ? { ...c, status: 'Active' } : c))
                              setNotifications(prev => [{ id: Date.now(), text: `Activated campaign: ${camp.name}`, time: 'Just now' }, ...prev])
                            }}
                            className="bg-emerald-600 text-white px-3 py-1 rounded-xl text-3xs font-black uppercase"
                          >
                            Activate
                          </button>
                        ) : null}
                        <button
                          onClick={() => {
                            setMCampaigns(prev => prev.filter(c => c.id !== camp.id))
                            setNotifications(prev => [{ id: Date.now(), text: `Deleted campaign: ${camp.name}`, time: 'Just now' }, ...prev])
                          }}
                          className="bg-rose-600 text-white px-3 py-1 rounded-xl text-3xs font-black uppercase"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Campaign Modal */}
                {campaignModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setCampaignModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800 font-sans">Launch New Outreach Campaign</h3>
                      <div className="space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Campaign Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Wheat Harvesting Promo"
                            value={newCampName}
                            onChange={(e) => setNewCampName(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Campaign Type</label>
                          <select
                            value={newCampType}
                            onChange={(e) => setNewCampType(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none font-bold text-gray-700"
                          >
                            <option>SMS Blast</option>
                            <option>Email Campaign</option>
                            <option>WhatsApp Broadcast</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Start Date</label>
                          <input
                            type="date"
                            value={newCampStart}
                            onChange={(e) => setNewCampStart(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">End Date</label>
                          <input
                            type="date"
                            value={newCampEnd}
                            onChange={(e) => setNewCampEnd(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              if (!newCampName || !newCampStart || !newCampEnd) return
                              const newC = {
                                id: `CAMP-${Math.floor(10 + Math.random() * 89)}`,
                                name: newCampName,
                                type: newCampType,
                                start: newCampStart,
                                end: newCampEnd,
                                status: 'Scheduled',
                                reach: Math.floor(800 + Math.random() * 2000)
                              }
                              setMCampaigns(prev => [...prev, newC])
                              setNotifications(prev => [{ id: Date.now(), text: `Created new outreach campaign: ${newCampName}`, time: 'Just now' }, ...prev])
                              setNewCampName('')
                              setNewCampStart('')
                              setNewCampEnd('')
                              setCampaignModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Launch Campaign
                          </button>
                          <button onClick={() => setCampaignModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: COUPONS */}
            {activeTab === 'coupons' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Coupons Directory</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Manage customer discount vouchers and seasonal codes.</p>
                  </div>
                  <button onClick={() => setCouponModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">
                    Generate New Coupon
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Coupon Code</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Value</th>
                        <th className="p-4">Expiry Date</th>
                        <th className="p-4 text-center">Usage Count</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((coup) => (
                        <tr key={coup.code} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-[#236625] text-sm">{coup.code}</td>
                          <td className="p-4 font-bold text-gray-600">{coup.type}</td>
                          <td className="p-4 font-black text-gray-900">{coup.type === 'Percentage' ? `${coup.value}%` : `₹${coup.value}`}</td>
                          <td className="p-4 text-gray-500">{coup.expiry}</td>
                          <td className="p-4 text-center font-bold text-gray-700">{coup.usage} times</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${
                              coup.status === 'Active' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {coup.status}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            <button
                              onClick={() => {
                                setCoupons(prev => prev.map(c => c.code === coup.code ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c))
                                setNotifications(prev => [{ id: Date.now(), text: `Toggled status of coupon ${coup.code}`, time: 'Just now' }, ...prev])
                              }}
                              className="text-[#236625] underline font-bold uppercase text-[10px] mr-2"
                            >
                              Toggle Status
                            </button>
                            <button
                              onClick={() => {
                                setCoupons(prev => prev.filter(c => c.code !== coup.code))
                                setNotifications(prev => [{ id: Date.now(), text: `Deleted coupon code ${coup.code}`, time: 'Just now' }, ...prev])
                              }}
                              className="text-rose-600 underline font-bold uppercase text-[10px]"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Coupon Modal */}
                {couponModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setCouponModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Generate Promotional Voucher</h3>
                      <div className="space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Coupon Code</label>
                          <input
                            type="text"
                            placeholder="e.g. KHARIF15"
                            value={newCoupCode}
                            onChange={(e) => setNewCoupCode(e.target.value.toUpperCase())}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none font-mono font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Discount Type</label>
                          <select
                            value={newCoupType}
                            onChange={(e) => setNewCoupType(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none font-bold text-gray-700"
                          >
                            <option>Percentage</option>
                            <option>Fixed Amount</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Discount Value</label>
                          <input
                            type="number"
                            placeholder="e.g. 15 or 150"
                            value={newCoupVal}
                            onChange={(e) => setNewCoupVal(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Expiry Date</label>
                          <input
                            type="date"
                            value={newCoupExpiry}
                            onChange={(e) => setNewCoupExpiry(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              if (!newCoupCode || !newCoupVal || !newCoupExpiry) return
                              const newC = {
                                code: newCoupCode,
                                type: newCoupType,
                                value: Number(newCoupVal),
                                usage: 0,
                                expiry: newCoupExpiry,
                                status: 'Active'
                              }
                              setCoupons(prev => [...prev, newC])
                              setNotifications(prev => [{ id: Date.now(), text: `Generated coupon code: ${newCoupCode}`, time: 'Just now' }, ...prev])
                              setNewCoupCode('')
                              setNewCoupVal('')
                              setNewCoupExpiry('')
                              setCouponModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Generate
                          </button>
                          <button onClick={() => setCouponModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: PROMOTIONS */}
            {activeTab === 'promotions' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Promotions Board</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Set live category price-cuts and global store discount campaigns.</p>
                  </div>
                  <button onClick={() => setPromoModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">
                    Launch New Promotion
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {promotions.map((promo) => (
                    <div key={promo.id} className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-[#236625] bg-[#E8F5E9] px-2.5 py-1 rounded-full">{promo.scope}</span>
                          <span className={`status-badge text-[9px] ${promo.status === 'Active' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-gray-100 text-gray-700'}`}>{promo.status}</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-800 mt-3">{promo.name}</h4>
                        <div className="mt-3 flex items-center justify-between text-xs font-semibold text-gray-500 border-t border-gray-50 pt-3">
                          <span>Discount Offer: <strong className="text-gray-900">{promo.discount}</strong></span>
                          <span>Expiry: <strong className="text-gray-700">{promo.expiry}</strong></span>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setPromotions(prev => prev.map(p => p.id === promo.id ? { ...p, status: p.status === 'Active' ? 'Suspended' : 'Active' } : p))
                            setNotifications(prev => [{ id: Date.now(), text: `Toggled status for promotion: ${promo.name}`, time: 'Just now' }, ...prev])
                          }}
                          className="bg-emerald-600 text-white px-3 py-1 rounded-xl text-3xs font-black uppercase"
                        >
                          Toggle Status
                        </button>
                        <button
                          onClick={() => {
                            setPromotions(prev => prev.filter(p => p.id !== promo.id))
                            setNotifications(prev => [{ id: Date.now(), text: `Deleted promotion: ${promo.name}`, time: 'Just now' }, ...prev])
                          }}
                          className="bg-rose-600 text-white px-3 py-1 rounded-xl text-3xs font-black uppercase"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Create Promotion Modal */}
                {promoModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setPromoModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Launch Product / Category Promotion</h3>
                      <div className="space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Promotion Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Tractor Parts Off-season Sale"
                            value={newPromoName}
                            onChange={(e) => setNewPromoName(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Promotion Scope</label>
                          <input
                            type="text"
                            placeholder="e.g. Category (Seeds) or Product (NPK)"
                            value={newPromoScope}
                            onChange={(e) => setNewPromoScope(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Discount Code / Offer Detail</label>
                          <input
                            type="text"
                            placeholder="e.g. 15% Off or Free Shipping"
                            value={newPromoDisc}
                            onChange={(e) => setNewPromoDisc(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Expiry Date</label>
                          <input
                            type="date"
                            value={newPromoExpiry}
                            onChange={(e) => setNewPromoExpiry(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              if (!newPromoName || !newPromoScope || !newPromoDisc || !newPromoExpiry) return
                              const newP = {
                                id: `PRM-${Math.floor(10 + Math.random() * 89)}`,
                                name: newPromoName,
                                scope: newPromoScope,
                                discount: newPromoDisc,
                                expiry: newPromoExpiry,
                                status: 'Active'
                              }
                              setPromotions(prev => [...prev, newP])
                              setNotifications(prev => [{ id: Date.now(), text: `Launched promotion: ${newPromoName}`, time: 'Just now' }, ...prev])
                              setNewPromoName('')
                              setNewPromoScope('')
                              setNewPromoDisc('')
                              setNewPromoExpiry('')
                              setPromoModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Launch Promo
                          </button>
                          <button onClick={() => setPromoModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: SMS MARKETING */}
            {activeTab === 'sms' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* SMS Composer Form */}
                  <div className="md:col-span-1 p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <MessageSquare className="text-[#236625]" size={16} /> SMS Campaign Composer
                    </h3>
                    <div className="space-y-3 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Target Customer Segment</label>
                        <select
                          value={smsSegment}
                          onChange={(e) => setSmsSegment(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold font-sans"
                        >
                          {customerSegments.map((seg, idx) => (
                            <option key={idx} value={seg.name}>{seg.name} ({seg.size} users)</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Message Body</label>
                        <textarea
                          rows={4}
                          placeholder="Type your SMS marketing copy here..."
                          value={smsText}
                          onChange={(e) => setSmsText(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none resize-none"
                        />
                        <div className="text-[10px] text-gray-400 text-right font-black">
                          {smsText.length} / 160 characters ({Math.ceil(smsText.length / 160)} SMS)
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!smsText) return
                          const targetSeg = customerSegments.find(s => s.name === smsSegment)
                          const size = targetSeg ? targetSeg.size : 100
                          const newS = {
                            id: `SMS-${Math.floor(100 + Math.random() * 899)}`,
                            segment: smsSegment,
                            text: smsText,
                            scheduled: new Date().toISOString().split('T')[0],
                            status: 'Sent',
                            sent: size,
                            delivered: Math.floor(size * 0.96),
                            failed: Math.floor(size * 0.04)
                          }
                          setSmsCampaigns(prev => [newS, ...prev])
                          setNotifications(prev => [{ id: Date.now(), text: `Dispatched SMS blast to: ${smsSegment}`, time: 'Just now' }, ...prev])
                          setSmsText('')
                          setSmsModalOpen(true)
                        }}
                        className="w-full btn-primary text-xs uppercase py-2.5 flex items-center justify-center gap-2"
                      >
                        <Megaphone size={14} /> Send SMS Blast
                      </button>
                    </div>
                  </div>

                  {/* SMS History Logs */}
                  <div className="md:col-span-2 p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">SMS Outgoing Log</h3>
                    <div className="table-wrapper">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">SMS ID</th>
                            <th className="p-4">Segment</th>
                            <th className="p-4">Message Preview</th>
                            <th className="p-4 text-center">Delivery Analytics</th>
                            <th className="p-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {smsCampaigns.map((sms) => (
                            <tr key={sms.id} className="border-b border-gray-50">
                              <td className="p-4 font-mono font-bold text-gray-500">{sms.id}</td>
                              <td className="p-4 font-bold text-gray-700">{sms.segment}</td>
                              <td className="p-4 max-w-[200px] truncate text-gray-600 font-medium" title={sms.text}>{sms.text}</td>
                              <td className="p-4 text-center font-bold text-gray-600">
                                <div className="flex justify-center items-center gap-2">
                                  <span className="text-emerald-700">✓ {sms.delivered}</span>
                                  <span className="text-rose-600">✗ {sms.failed}</span>
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <span className="status-badge bg-[#E8F5E9] text-[#2E7D32]">
                                  {sms.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* SMS Sent confirmation Modal */}
                {smsModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 relative animate-scale-up">
                      <button onClick={() => setSmsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#236625]">
                        <Check size={24} />
                      </div>
                      <h3 className="text-sm font-bold text-gray-800">SMS Broadcast Dispatched!</h3>
                      <p className="text-xs text-gray-500">Your marketing message has been added to the SMS gateway queue for immediate routing to selected farmers.</p>
                      <button onClick={() => setSmsModalOpen(false)} className="btn-primary text-xs uppercase py-2 w-full">Got it</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: EMAIL MARKETING */}
            {activeTab === 'email' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Email composer */}
                  <div className="md:col-span-1 p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <FileText className="text-[#236625]" size={16} /> Email Campaign Composer
                    </h3>
                    <div className="space-y-3 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Email Subject</label>
                        <input
                          type="text"
                          placeholder="e.g. Prepare Your Tractor for Monsoon!"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Template Layout</label>
                        <select
                          value={emailTemplate}
                          onChange={(e) => setEmailTemplate(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none font-bold text-gray-700"
                        >
                          <option>Summer Harvest Newsletter</option>
                          <option>Monsoon Seed Discounts</option>
                          <option>Festival Special Offer</option>
                        </select>
                      </div>
                      <button
                        onClick={() => {
                          if (!emailSubject) return
                          const newE = {
                            id: `EML-${Math.floor(200 + Math.random() * 899)}`,
                            subject: emailSubject,
                            template: emailTemplate,
                            openRate: `${Math.floor(35 + Math.random() * 20)}%`,
                            clickRate: `${Math.floor(10 + Math.random() * 15)}%`,
                            conversion: `${(1 + Math.random() * 5).toFixed(1)}%`,
                            status: 'Sent'
                          }
                          setEmailCampaigns(prev => [newE, ...prev])
                          setNotifications(prev => [{ id: Date.now(), text: `Email Campaign Sent: ${emailSubject}`, time: 'Just now' }, ...prev])
                          setEmailSubject('')
                          setEmailModalOpen(true)
                        }}
                        className="w-full btn-primary text-xs uppercase py-2.5"
                      >
                        Send Newsletter
                      </button>
                    </div>
                  </div>

                  {/* Email history table */}
                  <div className="md:col-span-2 p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Sent Email Newsletters</h3>
                    <div className="table-wrapper">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Email ID</th>
                            <th className="p-4">Subject</th>
                            <th className="p-4">Template Name</th>
                            <th className="p-4 text-center">Open Rate</th>
                            <th className="p-4 text-center">Click Rate</th>
                            <th className="p-4 text-center">Conv. Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {emailCampaigns.map((eml) => (
                            <tr key={eml.id} className="border-b border-gray-50">
                              <td className="p-4 font-mono font-bold text-gray-500">{eml.id}</td>
                              <td className="p-4 font-bold text-gray-700">{eml.subject}</td>
                              <td className="p-4 text-gray-500 font-bold">{eml.template}</td>
                              <td className="p-4 text-center font-black text-emerald-800">{eml.openRate}</td>
                              <td className="p-4 text-center font-black text-blue-700">{eml.clickRate}</td>
                              <td className="p-4 text-center font-black text-gray-800">{eml.conversion}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Email Confirmation Modal */}
                {emailModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 relative animate-scale-up">
                      <button onClick={() => setEmailModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#236625]">
                        <Check size={24} />
                      </div>
                      <h3 className="text-sm font-bold text-gray-800">Email Campaign Sent!</h3>
                      <p className="text-xs text-gray-500">The newsletter broadcast has been delivered to all registered email addresses in our CRM system.</p>
                      <button onClick={() => setEmailModalOpen(false)} className="btn-primary text-xs uppercase py-2 w-full">Got it</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: WHATSAPP CAMPAIGNS */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* WhatsApp composer */}
                  <div className="md:col-span-1 p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <MessageSquare className="text-[#236625]" size={16} /> WhatsApp Broadcast Builder
                    </h3>
                    <div className="space-y-3 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Target Segment</label>
                        <select
                          value={waSegment}
                          onChange={(e) => setWaSegment(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none text-gray-700 font-bold"
                        >
                          {customerSegments.map((seg, idx) => (
                            <option key={idx} value={seg.name}>{seg.name} ({seg.size} users)</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Broadcast Content</label>
                        <textarea
                          rows={4}
                          placeholder="Type WhatsApp message layout here..."
                          value={waText}
                          onChange={(e) => setWaText(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none resize-none"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (!waText) return
                          const newW = {
                            id: `WA-${Math.floor(300 + Math.random() * 899)}`,
                            title: waText.slice(0, 30) + '...',
                            date: new Date().toISOString().split('T')[0],
                            status: 'Sent'
                          }
                          setWhatsappCampaigns(prev => [newW, ...prev])
                          setNotifications(prev => [{ id: Date.now(), text: `WhatsApp Broadcast dispatched: ${newW.title}`, time: 'Just now' }, ...prev])
                          setWaText('')
                          setWaModalOpen(true)
                        }}
                        className="w-full btn-primary text-xs uppercase py-2.5 flex items-center justify-center gap-2"
                      >
                        <Megaphone size={14} /> Dispatch Broadcast
                      </button>
                    </div>
                  </div>

                  {/* WhatsApp history */}
                  <div className="md:col-span-2 p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">WhatsApp Dispatch Logs</h3>
                    <div className="table-wrapper">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Broadcast ID</th>
                            <th className="p-4">Snippet Preview</th>
                            <th className="p-4">Dispatch Date</th>
                            <th className="p-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {whatsappCampaigns.map((wa) => (
                            <tr key={wa.id} className="border-b border-gray-50">
                              <td className="p-4 font-mono font-bold text-gray-500">{wa.id}</td>
                              <td className="p-4 text-gray-700 font-bold">{wa.title}</td>
                              <td className="p-4 text-gray-500">{wa.date}</td>
                              <td className="p-4 text-center">
                                <span className="status-badge bg-[#E8F5E9] text-[#2E7D32]">
                                  {wa.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* WhatsApp modal */}
                {waModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 relative animate-scale-up">
                      <button onClick={() => setWaModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#236625]">
                        <Check size={24} />
                      </div>
                      <h3 className="text-sm font-bold text-gray-800">WhatsApp Broadcast Queue</h3>
                      <p className="text-xs text-gray-500">Your bulk message layout has been verified and forwarded to the WhatsApp Business API endpoint for delivery.</p>
                      <button onClick={() => setWaModalOpen(false)} className="btn-primary text-xs uppercase py-2 w-full">Got it</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: CUSTOMER SEGMENTS */}
            {activeTab === 'segments' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Customer Segments Panel</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Filter and segment customer bases according to purchase history and criteria.</p>
                  </div>
                  <button onClick={() => setSegmentModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">
                    Define New Segment
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {customerSegments.map((seg, idx) => (
                    <div key={idx} className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-gray-800">{seg.name}</h4>
                        <span className="text-xs font-black text-[#236625] bg-[#E8F5E9] px-2.5 py-1 rounded-full">{seg.size} farmers</span>
                      </div>
                      <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                        Criteria: <strong className="text-gray-700">{seg.criteria}</strong>
                      </p>
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => {
                            setCustomerSegments(prev => prev.filter(s => s.name !== seg.name))
                            setNotifications(prev => [{ id: Date.now(), text: `Deleted customer segment: ${seg.name}`, time: 'Just now' }, ...prev])
                          }}
                          className="bg-rose-600 text-white px-3 py-1 rounded-xl text-3xs font-black uppercase"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Segment Modal */}
                {segmentModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setSegmentModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Define Customer Segment</h3>
                      <div className="space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Segment Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Rice Growers"
                            value={newSegName}
                            onChange={(e) => setNewSegName(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Target Filter Criteria</label>
                          <input
                            type="text"
                            placeholder="e.g. Purchases > ₹10,000 in Kharif"
                            value={newSegCriteria}
                            onChange={(e) => setNewSegCriteria(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              if (!newSegName || !newSegCriteria) return
                              const newS = {
                                name: newSegName,
                                size: Math.floor(100 + Math.random() * 900),
                                criteria: newSegCriteria
                              }
                              setCustomerSegments(prev => [...prev, newS])
                              setNotifications(prev => [{ id: Date.now(), text: `Defined new segment: ${newSegName}`, time: 'Just now' }, ...prev])
                              setNewSegName('')
                              setNewSegCriteria('')
                              setSegmentModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Define Segment
                          </button>
                          <button onClick={() => setSegmentModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: BANNER MANAGEMENT */}
            {activeTab === 'banners' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Banner Management Editor</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Control promotional banners shown on client landing portals.</p>
                  </div>
                  <button onClick={() => setBannerModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">
                    Upload Banner Asset
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {banners.map((ban) => (
                    <div key={ban.id} className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                      <div className="h-44 w-full rounded-2xl overflow-hidden relative group bg-gray-150">
                        <img src={ban.image} alt={ban.name} className="w-full h-full object-cover" />
                        <span className={`absolute top-3 left-3 status-badge text-[9px] ${
                          ban.status === 'Published' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-gray-100 text-gray-700'
                        }`}>{ban.status}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                        <div>
                          <h4 className="font-bold text-gray-800">{ban.name}</h4>
                          <p className="text-[10px] text-gray-400 mt-1">{ban.start} &rarr; {ban.end}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setBanners(prev => prev.map(b => b.id === ban.id ? { ...b, status: b.status === 'Published' ? 'Draft' : 'Published' } : b))
                              setNotifications(prev => [{ id: Date.now(), text: `Changed status of banner: ${ban.name}`, time: 'Just now' }, ...prev])
                            }}
                            className="bg-emerald-600 text-white px-3 py-1 rounded-xl text-3xs font-black uppercase"
                          >
                            Toggle Publish
                          </button>
                          <button
                            onClick={() => {
                              setBanners(prev => prev.filter(b => b.id !== ban.id))
                              setNotifications(prev => [{ id: Date.now(), text: `Removed banner: ${ban.name}`, time: 'Just now' }, ...prev])
                            }}
                            className="bg-rose-600 text-white px-3 py-1 rounded-xl text-3xs font-black uppercase"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Banner Upload Modal */}
                {bannerModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setBannerModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Upload Banner Asset</h3>
                      <div className="space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Banner Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Monsoon Seed Fest Banner"
                            value={newBanName}
                            onChange={(e) => setNewBanName(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Banner Mockup Image URL</label>
                          <input
                            type="text"
                            placeholder="Unsplash URL or file path"
                            value={newBanImage}
                            onChange={(e) => setNewBanImage(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                          <p className="text-[9px] text-gray-400 mt-1 font-semibold">Leave empty to use a premium farming backdrop default image.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase">Start Date</label>
                            <input
                              type="date"
                              value={newBanStart}
                              onChange={(e) => setNewBanStart(e.target.value)}
                              className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase">End Date</label>
                            <input
                              type="date"
                              value={newBanEnd}
                              onChange={(e) => setNewBanEnd(e.target.value)}
                              className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                            />
                          </div>
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              if (!newBanName) return
                              const img = newBanImage || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80'
                              const newB = {
                                id: `BAN-${Math.floor(10 + Math.random() * 89)}`,
                                name: newBanName,
                                image: img,
                                start: newBanStart || '2026-06-01',
                                end: newBanEnd || '2026-06-30',
                                status: 'Draft'
                              }
                              setBanners(prev => [...prev, newB])
                              setNotifications(prev => [{ id: Date.now(), text: `Uploaded new banner draft: ${newBanName}`, time: 'Just now' }, ...prev])
                              setNewBanName('')
                              setNewBanImage('')
                              setNewBanStart('')
                              setNewBanEnd('')
                              setBannerModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Upload Banner
                          </button>
                          <button onClick={() => setBannerModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: REPORTS */}
            {activeTab === 'reports' && (() => {
              const currentReportType = ['campaigns', 'coupons', 'segments'].includes(reportType) ? reportType : 'campaigns';
              return (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-gray-800">Export Marketing Audit Reports</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const printWindow = window.open('', '_blank');
                            printWindow.document.write(`
                              <html>
                                <head><title>AgriERP Marketing Executive Audit Report</title></head>
                                <body style="font-family: Arial; padding: 40px; color: #333;">
                                  <h2>AgriERP Marketing Executive Audit Report</h2>
                                  <p><strong>Generated By:</strong> Karan Patil</p>
                                  <p><strong>Role:</strong> Marketing Executive</p>
                                  <p><strong>Report Type:</strong> ${currentReportType.toUpperCase()} Report</p>
                                  <hr/>
                                  <p>Marketing audit report compiled successfully on ${new Date().toLocaleDateString()}</p>
                                </body>
                              </html>
                            `);
                            printWindow.document.close();
                            printWindow.print();
                          }}
                          className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 px-3 py-1.5 rounded-xl shadow-sm"
                        >
                          <FileDown size={14} /> Export to PDF
                        </button>
                      </div>
                    </div>

                    {/* Report selector */}
                    <div className="flex gap-2 border-b border-[#F1F8F1] pb-4">
                      {['campaigns', 'coupons', 'segments'].map(t => (
                        <button
                          key={t}
                          onClick={() => setReportType(t)}
                          className={`px-4 py-2 text-xs font-black uppercase border-b-2 transition-all ${
                            currentReportType === t ? 'border-[#236625] text-[#236625]' : 'border-transparent text-gray-400 hover:text-gray-700'
                          }`}
                        >
                          {t} Report
                        </button>
                      ))}
                    </div>

                    {/* Report Data Table */}
                    <div className="table-wrapper">
                      {currentReportType === 'campaigns' && (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                              <th className="p-4">Campaign ID</th>
                              <th className="p-4">Name</th>
                              <th className="p-4">Type</th>
                              <th className="p-4 text-right">Reach</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mCampaigns.map(c => (
                              <tr key={c.id} className="border-b border-gray-50">
                                <td className="p-4 font-mono font-bold text-gray-500">{c.id}</td>
                                <td className="p-4 font-bold text-gray-700">{c.name}</td>
                                <td className="p-4 font-bold text-gray-500">{c.type}</td>
                                <td className="p-4 text-right font-black text-gray-800">{c.reach}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {currentReportType === 'coupons' && (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                              <th className="p-4">Coupon Code</th>
                              <th className="p-4">Discount Type</th>
                              <th className="p-4 text-center">Discount Value</th>
                              <th className="p-4 text-center">Times Used</th>
                            </tr>
                          </thead>
                          <tbody>
                            {coupons.map((c, idx) => (
                              <tr key={idx} className="border-b border-gray-50">
                                <td className="p-4 font-mono font-bold text-[#236625]">{c.code}</td>
                                <td className="p-4 font-bold text-gray-700">{c.type}</td>
                                <td className="p-4 text-center font-bold">{c.value}</td>
                                <td className="p-4 text-center font-bold text-[#236625]">{c.usage} times</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {currentReportType === 'segments' && (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                              <th className="p-4">Segment Name</th>
                              <th className="p-4">Filter Criteria</th>
                              <th className="p-4 text-right">Total Reach</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customerSegments.map((s, idx) => (
                              <tr key={idx} className="border-b border-gray-50">
                                <td className="p-4 font-bold text-gray-700">{s.name}</td>
                                <td className="p-4 font-medium text-gray-600">{s.criteria}</td>
                                <td className="p-4 text-right font-bold text-gray-800">{s.size}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* SUBMODULE: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="text-[#236625]" size={16} /> All Marketing Notification Logs
                  </h3>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center text-xs font-semibold text-gray-700 hover:bg-[#F1F8F1]/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#236625] animate-pulse" />
                          <span>{n.text}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ==================================================== */}
        {/* WAREHOUSE STAFF MODULES */}
        {/* ==================================================== */}
        {role === 'Warehouse Staff' && (
          <>
            {/* SUBMODULE: WAREHOUSE DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Welcome Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#236625] via-[#2F8F2F] to-[#55FA62] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Logistics & Storage Control</span>
                    <h1 className="text-2xl md:text-3xl font-black mt-3">Welcome, Madhur Kadam!</h1>
                    <p className="text-xs mt-2 text-emerald-100 font-medium">Verify incoming goods, allocate storage slots, pack orders, prepare shipments, and manage daily warehouse operations.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl border border-white/10">
                    <Boxes size={24} />
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-emerald-200">Active Tasks</p>
                      <p className="text-base font-black">{warehouseTasks.filter(t => t.status !== 'Completed').length} Pending</p>
                    </div>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Received Today</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      {receivedGoods.filter(g => g.date === '2026-06-02').length} Loads
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Pending Packing</p>
                    <h4 className="text-xl font-black text-amber-700 mt-1">
                      {packingOrders.filter(o => o.status !== 'Packed').length} Orders
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between bg-blue-50 border-blue-200">
                    <p className="text-3xs font-extrabold uppercase text-blue-700">Ready to Ship</p>
                    <h4 className="text-xl font-black text-blue-700 mt-1">
                      {dispatchPrep.filter(d => d.dispatchStatus === 'Ready').length} Invoices
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between bg-emerald-50 border-emerald-200">
                    <p className="text-3xs font-extrabold uppercase text-[#2E7D32]">Racks Allocated</p>
                    <h4 className="text-xl font-black text-[#2E7D32] mt-1">
                      {storageLocations.length} locations
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between bg-rose-50 border-rose-200">
                    <p className="text-3xs font-extrabold uppercase text-rose-700">Damaged Items</p>
                    <h4 className="text-xl font-black text-rose-700 mt-1">
                      {damageReportsState.reduce((acc, r) => acc + r.qty, 0)} Units
                    </h4>
                  </div>
                  <div className="kpi-card p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex flex-col justify-between">
                    <p className="text-3xs font-extrabold uppercase text-gray-400">Tasks Completed</p>
                    <h4 className="text-xl font-black text-[#236625] mt-1">
                      {warehouseTasks.filter(t => t.status === 'Completed').length} Tasks
                    </h4>
                  </div>
                </div>

                {/* Dashboard Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Daily Warehouse Activity */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Daily Warehouse Load Activity</h3>
                    <div className="h-44 flex items-end justify-between gap-4 pt-4">
                      {[
                        { day: 'Mon', rec: 12, pack: 18 },
                        { day: 'Tue', rec: 15, pack: 22 },
                        { day: 'Wed', rec: 9, pack: 15 },
                        { day: 'Thu', rec: 20, pack: 25 },
                        { day: 'Fri', rec: 18, pack: 20 },
                        { day: 'Sat', rec: 22, pack: 30 },
                        { day: 'Sun', rec: 5, pack: 8 }
                      ].map((act, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div className="w-full flex gap-1 items-end h-32 justify-center">
                            <div className="w-3 bg-[#236625] rounded-t-sm hover:opacity-85 transition-opacity" style={{ height: `${(act.rec / 35) * 100}%` }} title={`Received: ${act.rec}`} />
                            <div className="w-3 bg-blue-500 rounded-t-sm hover:opacity-85 transition-opacity" style={{ height: `${(act.pack / 35) * 100}%` }} title={`Packed: ${act.pack}`} />
                          </div>
                          <span className="text-3xs text-gray-400 font-bold">{act.day}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 text-3xs font-black uppercase text-gray-500 justify-center">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#236625] rounded-sm" /> Received Loads</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm" /> Packed Orders</span>
                    </div>
                  </div>

                  {/* Dispatch & Damage Analysis */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Operational Health Metrics</h3>
                    <div className="space-y-4 font-semibold text-xs text-gray-600">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Packing Accuracy</span>
                          <span className="font-bold text-gray-800">99.4%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-[#236625] h-2 rounded-full" style={{ width: '99.4%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Dispatch Performance SLA</span>
                          <span className="font-bold text-gray-800">92%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Damage Rate (v/s Received)</span>
                          <span className="font-bold text-gray-800">1.2%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-rose-500 h-2 rounded-full" style={{ width: '1.2%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Rack Utilization Index</span>
                          <span className="font-bold text-gray-800">76%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '76%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tasks List Summary */}
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <ClipboardList className="text-[#236625]" size={16} /> Urgent Warehouse Tasks
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {warehouseTasks.filter(t => t.status !== 'Completed').map(task => (
                      <div key={task.id} className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex flex-col justify-between gap-3 text-xs font-semibold text-gray-600">
                        <div>
                          <p className="font-bold text-gray-800 border-b border-gray-100 pb-1.5 flex justify-between">
                            <span>{task.task}</span>
                            <span className={`status-badge text-[9px] ${task.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{task.priority}</span>
                          </p>
                          <p className="mt-2 text-gray-500 font-semibold">{task.notes}</p>
                        </div>
                        <button
                          onClick={() => {
                            setWarehouseTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'Completed' } : t))
                            setNotifications(prev => [{ id: Date.now(), text: `Completed task: ${task.task}`, time: 'Just now' }, ...prev])
                          }}
                          className="bg-[#236625] text-white py-1.5 rounded-xl font-bold uppercase text-[10px]"
                        >
                          Mark Complete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUBMODULE: RECEIVING GOODS */}
            {activeTab === 'receiving' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Incoming Shipments & Goods Intake</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Verify stock loads arriving from suppliers, update storage, and verify quality logs.</p>
                  </div>
                  <button onClick={() => setReceiveModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">
                    Log Incoming Load
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Receipt ID</th>
                        <th className="p-4">Product Name</th>
                        <th className="p-4">Supplier</th>
                        <th className="p-4 text-center">Quantity</th>
                        <th className="p-4 text-center">Condition</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receivedGoods.map((goods) => (
                        <tr key={goods.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{goods.id}</td>
                          <td className="p-4 font-bold text-gray-700">{goods.name}</td>
                          <td className="p-4 text-gray-500 font-semibold">{goods.supplier}</td>
                          <td className="p-4 text-center font-bold text-gray-800">{goods.qty} Bags</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge text-[9px] ${goods.condition === 'Perfect' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                              {goods.condition}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${
                              goods.status === 'Received' ? 'bg-[#E8F5E9] text-[#2E7D32]' : goods.status === 'Verified' ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-800'
                            }`}>
                              {goods.status}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            {goods.status === 'Pending' && (
                              <button
                                onClick={() => {
                                  setReceivedGoods(prev => prev.map(g => g.id === goods.id ? { ...g, status: 'Verified', condition: 'Perfect' } : g))
                                  setNotifications(prev => [{ id: Date.now(), text: `Verified quantity and condition for shipment: ${goods.name}`, time: 'Just now' }, ...prev])
                                }}
                                className="text-[#236625] underline font-bold uppercase text-[10px]"
                              >
                                Verify Goods
                              </button>
                            )}
                            {goods.status === 'Verified' && (
                              <button
                                onClick={() => {
                                  setReceivedGoods(prev => prev.map(g => g.id === goods.id ? { ...g, status: 'Received' } : g))
                                  setNotifications(prev => [{ id: Date.now(), text: `Received and updated stock database for: ${goods.name}`, time: 'Just now' }, ...prev])
                                }}
                                className="text-emerald-700 underline font-bold uppercase text-[10px]"
                              >
                                Commit to Stock
                              </button>
                            )}
                            {goods.status === 'Received' && (
                              <span className="text-gray-400 text-[10px] font-black uppercase">Stored</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Intake Modal */}
                {receiveModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setReceiveModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800 font-sans">Receive Incoming Stock Load</h3>
                      <div className="space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Product Name</label>
                          <input
                            type="text"
                            placeholder="e.g. NPK Fertilizer Granular"
                            value={recProdName}
                            onChange={(e) => setRecProdName(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Supplier Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Bayer Cropscience"
                            value={recSupplier}
                            onChange={(e) => setRecSupplier(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Intake Quantity</label>
                          <input
                            type="number"
                            placeholder="e.g. 150"
                            value={recQty}
                            onChange={(e) => setRecQty(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Verification Condition</label>
                          <select
                            value={recCondition}
                            onChange={(e) => setRecCondition(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none font-bold text-gray-700"
                          >
                            <option>Perfect</option>
                            <option>Packaging Damaged</option>
                            <option>Moisture Seeped</option>
                          </select>
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              if (!recProdName || !recSupplier || !recQty) return
                              const newRec = {
                                id: `REC-${Math.floor(100 + Math.random() * 899)}`,
                                name: recProdName,
                                supplier: recSupplier,
                                qty: Number(recQty),
                                date: new Date().toISOString().split('T')[0],
                                status: 'Pending',
                                condition: recCondition
                              }
                              setReceivedGoods(prev => [...prev, newRec])
                              setNotifications(prev => [{ id: Date.now(), text: `Logged new incoming load: ${recProdName} (${recQty} units)`, time: 'Just now' }, ...prev])
                              setRecProdName('')
                              setRecSupplier('')
                              setRecQty('')
                              setReceiveModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Add Receipt
                          </button>
                          <button onClick={() => setReceiveModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: STORAGE MANAGEMENT */}
            {activeTab === 'storage' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Storage Rack Allocation & Layout</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Locate, move, and organize allocated rack space inside the central warehouse.</p>
                  </div>
                  <button onClick={() => setMoveModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">
                    Plan Stock Move
                  </button>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  {storageLocations.map((loc, idx) => (
                    <div key={idx} className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase text-[#236625] bg-[#E8F5E9] px-2.5 py-1 rounded-full">{loc.rack}</span>
                        <span className="text-xs font-black text-emerald-800">{loc.space}</span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-800">{loc.area}</h4>
                      <div className="space-y-1.5 text-xs font-semibold text-gray-500 border-t border-gray-55 border-gray-100 pt-3">
                        <p>Product: <strong className="text-gray-900">{loc.product}</strong></p>
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            setMoveProductState(loc.product)
                            setMoveFrom(loc.rack)
                            setMoveModalOpen(true)
                          }}
                          className="text-[#236625] underline text-[10px] font-black uppercase"
                        >
                          Move Stock
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Storage Move Modal */}
                {moveModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setMoveModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Move Stock Location Allocation</h3>
                      <div className="space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Product Name</label>
                          <input
                            type="text"
                            value={moveProductState}
                            onChange={(e) => setMoveProductState(e.target.value)}
                            placeholder="e.g. Premium Hybrid Wheat Seeds"
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase">From Location</label>
                            <input
                              type="text"
                              value={moveFrom}
                              onChange={(e) => setMoveFrom(e.target.value)}
                              placeholder="e.g. Rack A-1"
                              className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase">To Location</label>
                            <input
                              type="text"
                              value={moveTo}
                              onChange={(e) => setMoveTo(e.target.value)}
                              placeholder="e.g. Rack C-4"
                              className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Transfer Quantity</label>
                          <input
                            type="number"
                            value={moveQty}
                            onChange={(e) => setMoveQty(e.target.value)}
                            placeholder="e.g. 50"
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              if (!moveProductState || !moveFrom || !moveTo || !moveQty) return
                              const newMov = {
                                id: `MVT-${Math.floor(900 + Math.random() * 99)}`,
                                product: moveProductState,
                                from: moveFrom,
                                to: moveTo,
                                qty: Number(moveQty),
                                date: new Date().toISOString().split('T')[0]
                              }
                              setStockMovements(prev => [newMov, ...prev])
                              setStorageLocations(prev => prev.map(loc => loc.rack === moveFrom ? { ...loc, space: '80% Free', product: 'Empty' } : loc.rack === moveTo ? { ...loc, product: moveProductState, space: '10% Free' } : loc))
                              setNotifications(prev => [{ id: Date.now(), text: `Transferred ${moveQty} units of ${moveProductState} from ${moveFrom} to ${moveTo}`, time: 'Just now' }, ...prev])
                              setMoveProductState('')
                              setMoveFrom('')
                              setMoveTo('')
                              setMoveQty('')
                              setMoveModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Transfer Stock
                          </button>
                          <button onClick={() => setMoveModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: PACKING ORDERS */}
            {activeTab === 'packing' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Order Packing Dashboard</h3>
                    <p className="text-xs text-gray-500 font-semibold">Assemble customer order packages, verify item lists, and print logistics packing slips.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4 text-center">Items count</th>
                        <th className="p-4 text-center">Priority</th>
                        <th className="p-4 text-center">Packing Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packingOrders.map((ord) => (
                        <tr key={ord.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{ord.id}</td>
                          <td className="p-4 font-bold text-gray-700">{ord.customer}</td>
                          <td className="p-4 text-center font-bold text-gray-600">{ord.itemsCount} Products</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge text-[9px] ${ord.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-gray-100 text-gray-600'}`}>
                              {ord.priority}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${
                              ord.status === 'Packed' ? 'bg-[#E8F5E9] text-[#2E7D32]' : ord.status === 'In Progress' ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-800'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-3">
                            {ord.status === 'Processing' && (
                              <button
                                onClick={() => {
                                  updateOrderDb(ord.id, { orderStatus: 'Packed' })
                                  setNotifications(prev => [{ id: Date.now(), text: `Marked items packed for ${ord.id}`, time: 'Just now' }, ...prev])
                                }}
                                className="text-emerald-700 underline font-bold uppercase text-[10px]"
                              >
                                Mark Packed
                              </button>
                            )}
                            {ord.status === 'Packed' && (
                              <span className="text-emerald-700 font-black text-[10px] uppercase">Packed</span>
                            )}
                            {ord.status === 'Packed' && (
                              <button
                                onClick={() => {
                                  setPackingSlipOrder(ord)
                                }}
                                className="text-[#236625] underline font-bold uppercase text-[10px]"
                              >
                                Print Packing Slip
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Packing Slip Modal */}
                {packingSlipOrder && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setPackingSlipOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <div className="text-center pb-2 border-b border-gray-100">
                        <h4 className="font-bold text-gray-800">AgriERP Packing Verification Slip</h4>
                        <p className="text-[10px] text-gray-400 mt-1">Order ID: {packingSlipOrder.id}</p>
                      </div>
                      <div className="space-y-2 text-xs font-semibold text-gray-600">
                        <p className="flex justify-between"><span>Customer Name:</span> <strong className="text-gray-800">{packingSlipOrder.customer}</strong></p>
                        <p className="flex justify-between"><span>Priority Label:</span> <span className="text-rose-700">{packingSlipOrder.priority}</span></p>
                        <p className="flex justify-between"><span>Verifying Handler:</span> <span className="text-gray-800">Madhur Kadam</span></p>
                        <p className="flex justify-between"><span>Package Units Count:</span> <strong className="text-[#236625]">{packingSlipOrder.itemsCount} Packages</strong></p>
                        <p className="text-[10px] text-gray-400 pt-2 text-center italic">Package barcode checked & verified by Warehouse Staff scanner.</p>
                      </div>
                      <div className="pt-2 grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            const slipPrint = window.open('', '_blank');
                            slipPrint.document.write(`
                              <html>
                                <head><title>AgriERP Packing Slip - ${packingSlipOrder.id}</title></head>
                                <body style="font-family: Arial; padding: 30px; border: 2px dashed #333; max-width: 400px; margin: 40px auto;">
                                  <h2 style="text-align: center; color: #236625;">AgriERP Packing Slip</h2>
                                  <p><strong>Order ID:</strong> ${packingSlipOrder.id}</p>
                                  <p><strong>Customer:</strong> ${packingSlipOrder.customer}</p>
                                  <p><strong>Packages Count:</strong> ${packingSlipOrder.itemsCount} bags/units</p>
                                  <p><strong>Verified By:</strong> Madhur Kadam (Warehouse Staff)</p>
                                  <hr style="border-top: 2px dashed #ccc;"/>
                                  <div style="text-align: center; margin-top: 20px;">
                                    <p>[BARCODE LOGISTICS VERIFIED]</p>
                                  </div>
                                </body>
                              </html>
                            `);
                            slipPrint.document.close();
                            slipPrint.print();
                          }}
                          className="btn-primary text-xs uppercase py-2.5"
                        >
                          Print Slip
                        </button>
                        <button onClick={() => setPackingSlipOrder(null)} className="btn-secondary text-xs uppercase py-2.5">Close</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: DISPATCH PREPARATION */}
            {activeTab === 'dispatch' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Dispatch Preparation Roster</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Organize packed parcels, compile dispatch lists, and verify delivery vehicle handovers.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Destination Address</th>
                        <th className="p-4 text-center">Packing Status</th>
                        <th className="p-4 text-center">Dispatch Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dispatchPrep.map((prep) => (
                        <tr key={prep.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{prep.id}</td>
                          <td className="p-4 font-bold text-gray-700">{prep.destination}</td>
                          <td className="p-4 text-center">
                            <span className="status-badge bg-[#E8F5E9] text-[#2E7D32]">{prep.packingStatus}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${
                              prep.dispatchStatus === 'Ready' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {prep.dispatchStatus}
                            </span>
                          </td>
                          <td className="p-4 text-center space-x-2">
                            {prep.dispatchStatus !== 'Ready' && prep.packingStatus === 'Packed' ? (
                              <button
                                onClick={() => {
                                  updateOrderDb(prep.id, { orderStatus: 'Ready For Dispatch' })
                                  setNotifications(prev => [{ id: Date.now(), text: `Marked order ${prep.id} ready for dispatcher handover`, time: 'Just now' }, ...prev])
                                }}
                                className="text-emerald-700 underline font-bold uppercase text-[10px]"
                              >
                                Ready For Dispatch
                              </button>
                            ) : prep.dispatchStatus === 'Ready' ? (
                              <span className="text-emerald-700 font-black text-[10px] uppercase">Awaiting Handover</span>
                            ) : (
                              <span className="text-amber-700 text-[10px] font-black uppercase">Awaiting Packing</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBMODULE: STOCK MOVEMENT */}
            {activeTab === 'movement' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Stock Movements History</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Audit stock transfers between different warehouse sections, storage shelves, and intake docks.</p>
                  </div>
                  <button onClick={() => setMoveModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">
                    Transfer Stock
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-105 border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Movement ID</th>
                        <th className="p-4">Product Name</th>
                        <th className="p-4">From Location</th>
                        <th className="p-4">To Location</th>
                        <th className="p-4 text-center">Qty Moved</th>
                        <th className="p-4 text-center">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockMovements.map((mov) => (
                        <tr key={mov.id} className="border-b border-gray-50">
                          <td className="p-4 font-mono font-bold text-gray-500">{mov.id}</td>
                          <td className="p-4 font-bold text-gray-800">{mov.product}</td>
                          <td className="p-4 font-bold text-gray-500">{mov.from}</td>
                          <td className="p-4 font-bold text-[#236625]">{mov.to}</td>
                          <td className="p-4 text-center font-black text-gray-800">{mov.qty} Bags</td>
                          <td className="p-4 text-center text-gray-500">{mov.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBMODULE: BARCODE SCANNER */}
            {activeTab === 'scanner' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Scanner Simulator */}
                  <div className="md:col-span-1 p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <QrCode className="text-[#236625]" size={16} /> Barcode Scan Simulator
                    </h3>
                    <div className="space-y-3 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Input Product Barcode</label>
                        <input
                          type="text"
                          placeholder="e.g. WHT-2967 or NPK-1919"
                          value={scanCodeInput}
                          onChange={(e) => setScanCodeInput(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs font-mono font-bold outline-none"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (!scanCodeInput) return
                          const p = products.find(prod => prod.code === scanCodeInput.toUpperCase() || prod.id === scanCodeInput)
                          if (p) {
                            const newScan = {
                              code: scanCodeInput.toUpperCase(),
                              product: p.name,
                              type: 'Barcode Verification',
                              status: 'Verified',
                              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }
                            setBarcodeScans(prev => [newScan, ...prev])
                            setNotifications(prev => [{ id: Date.now(), text: `Scanned & Verified: ${p.name}`, time: 'Just now' }, ...prev])
                            setScanningStatus({ success: true, text: `Match Found: ${p.name} (${p.brand})` })
                          } else {
                            setScanningStatus({ success: false, text: `No Product found matching code "${scanCodeInput}"` })
                          }
                          setScanCodeInput('')
                          setScannerModalOpen(true)
                        }}
                        className="w-full btn-primary text-xs uppercase py-2.5 flex items-center justify-center gap-2"
                      >
                        <QrCode size={14} /> Scan & Verify Code
                      </button>
                    </div>
                  </div>

                  {/* Scan History */}
                  <div className="md:col-span-2 p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Scan Logs</h3>
                    <div className="table-wrapper">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                            <th className="p-4">Scanned Code</th>
                            <th className="p-4">Product Name</th>
                            <th className="p-4">Verification Type</th>
                            <th className="p-4 text-center">Scan Status</th>
                            <th className="p-4 text-center">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {barcodeScans.map((scan, idx) => (
                            <tr key={idx} className="border-b border-gray-50">
                              <td className="p-4 font-mono font-bold text-gray-500">{scan.code}</td>
                              <td className="p-4 font-bold text-gray-700">{scan.product}</td>
                              <td className="p-4 text-gray-500 font-bold">{scan.type}</td>
                              <td className="p-4 text-center">
                                <span className="status-badge bg-[#E8F5E9] text-[#2E7D32]">
                                  {scan.status}
                                </span>
                              </td>
                              <td className="p-4 text-center text-gray-500 font-bold">{scan.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Scan Result Modal */}
                {scannerModalOpen && scanningStatus && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 relative animate-scale-up">
                      <button onClick={() => setScannerModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                        scanningStatus.success ? 'bg-emerald-50 text-[#236625]' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {scanningStatus.success ? <Check size={24} /> : <AlertTriangle size={24} />}
                      </div>
                      <h3 className="text-sm font-bold text-gray-800">
                        {scanningStatus.success ? 'Barcode Verified!' : 'Scan Mismatch'}
                      </h3>
                      <p className="text-xs text-gray-500">{scanningStatus.text}</p>
                      <button onClick={() => setScannerModalOpen(false)} className="btn-primary text-xs uppercase py-2 w-full">Got it</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: DAMAGE REPORTS */}
            {activeTab === 'damage_reports' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Damage Reports & Spill Logs</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Report damaged stock packages, moisture leakages, or broken boxes for manager audit.</p>
                  </div>
                  <button onClick={() => setDamageModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">
                    File Damage Report
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-105 border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="p-4">Report ID</th>
                        <th className="p-4">Product Name</th>
                        <th className="p-4 text-center">Quantity</th>
                        <th className="p-4">Damage Description</th>
                        <th className="p-4 text-center">Filing Date</th>
                        <th className="p-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {damageReportsState.map((dmg) => (
                        <tr key={dmg.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-500">{dmg.id}</td>
                          <td className="p-4 font-bold text-gray-700">{dmg.product}</td>
                          <td className="p-4 text-center font-bold text-rose-700">{dmg.qty} Bags</td>
                          <td className="p-4 text-gray-600 font-medium">{dmg.type}</td>
                          <td className="p-4 text-center text-gray-55 text-gray-400">{dmg.date}</td>
                          <td className="p-4 text-center">
                            <span className={`status-badge ${
                              dmg.status === 'Approved' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {dmg.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Damage Modal */}
                {damageModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setDamageModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">File Warehouse Damage Report</h3>
                      <div className="space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Product Name</label>
                          <input
                            type="text"
                            placeholder="e.g. NPK Granular Fertilizer"
                            value={dmgProductState}
                            onChange={(e) => setDmgProductState(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Quantity Damaged</label>
                          <input
                            type="number"
                            placeholder="e.g. 5"
                            value={dmgQty}
                            onChange={(e) => setDmgQty(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Damage Reason / Details</label>
                          <select
                            value={dmgType}
                            onChange={(e) => setDmgType(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none font-bold text-gray-700"
                          >
                            <option>Packaging Torn</option>
                            <option>Moisture Damage</option>
                            <option>Broken Seal / Cap</option>
                            <option>Impact / Dropped</option>
                          </select>
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              if (!dmgProductState || !dmgQty) return
                              const newD = {
                                id: `DMG-${Math.floor(400 + Math.random() * 99)}`,
                                product: dmgProductState,
                                qty: Number(dmgQty),
                                type: dmgType,
                                date: new Date().toISOString().split('T')[0],
                                status: 'Reported'
                              }
                              setDamageReportsState(prev => [...prev, newD])
                              setNotifications(prev => [{ id: Date.now(), text: `Filed damage report for ${dmgQty} units of ${dmgProductState}`, time: 'Just now' }, ...prev])
                              setDmgProductState('')
                              setDmgQty('')
                              setDamageModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            File Report
                          </button>
                          <button onClick={() => setDamageModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: WAREHOUSE TASKS */}
            {activeTab === 'tasks' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center p-4 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Warehouse Staff Tasks Schedule</h3>
                    <p className="text-xs text-gray-500 font-semibold font-sans">Manage shift duties, shelf restacking lists, and packaging priorities.</p>
                  </div>
                  <button onClick={() => setTaskModalOpen(true)} className="btn-primary text-xs uppercase px-5 py-2.5">
                    Add Custom Task
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {warehouseTasks.map((task) => (
                    <div key={task.id} className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-[#236625] bg-[#E8F5E9] px-2.5 py-1 rounded-full">{task.priority} Priority</span>
                          <span className={`status-badge text-[9px] ${
                            task.status === 'Completed' ? 'bg-[#E8F5E9] text-[#2E7D32]' : task.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-gray-105 bg-gray-100 text-gray-700'
                          }`}>{task.status}</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-800 mt-3">{task.task}</h4>
                        <p className="text-xs text-gray-400 mt-2 leading-relaxed">{task.notes}</p>
                      </div>

                      <div className="flex gap-2 justify-end">
                        {task.status === 'Pending' && (
                          <button
                            onClick={() => {
                              setWarehouseTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'In Progress' } : t))
                              setNotifications(prev => [{ id: Date.now(), text: `Started task: ${task.task}`, time: 'Just now' }, ...prev])
                            }}
                            className="bg-amber-600 text-white px-3 py-1 rounded-xl text-3xs font-black uppercase"
                          >
                            Start Task
                          </button>
                        )}
                        {task.status !== 'Completed' && (
                          <button
                            onClick={() => {
                              setWarehouseTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'Completed' } : t))
                              setNotifications(prev => [{ id: Date.now(), text: `Completed task: ${task.task}`, time: 'Just now' }, ...prev])
                            }}
                            className="bg-emerald-600 text-white px-3 py-1 rounded-xl text-3xs font-black uppercase"
                          >
                            Mark Complete
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setWarehouseTasks(prev => prev.filter(t => t.id !== task.id))
                            setNotifications(prev => [{ id: Date.now(), text: `Removed task: ${task.task}`, time: 'Just now' }, ...prev])
                          }}
                          className="bg-rose-600 text-white px-3 py-1 rounded-xl text-3xs font-black uppercase"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Task Modal */}
                {taskModalOpen && (
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                      <button onClick={() => setTaskModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                      <h3 className="text-sm font-bold text-gray-800">Add Custom Warehouse Task</h3>
                      <div className="space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Task Description</label>
                          <input
                            type="text"
                            placeholder="e.g. Verify shelf height Section C"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Priority level</label>
                          <select
                            value={taskPriority}
                            onChange={(e) => setTaskPriority(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none font-bold text-gray-700"
                          >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Notes / Instructions</label>
                          <textarea
                            rows={3}
                            placeholder="Add task notes..."
                            value={taskNotes}
                            onChange={(e) => setTaskNotes(e.target.value)}
                            className="w-full px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none resize-none"
                          />
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              if (!taskName) return
                              const newT = {
                                id: `TSK-${Math.floor(200 + Math.random() * 99)}`,
                                task: taskName,
                                priority: taskPriority,
                                notes: taskNotes || 'No notes added.',
                                status: 'Pending'
                              }
                              setWarehouseTasks(prev => [...prev, newT])
                              setNotifications(prev => [{ id: Date.now(), text: `Added custom task: ${taskName}`, time: 'Just now' }, ...prev])
                              setTaskName('')
                              setTaskNotes('')
                              setTaskModalOpen(false)
                            }}
                            className="btn-primary text-xs uppercase py-2.5"
                          >
                            Add Task
                          </button>
                          <button onClick={() => setTaskModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMODULE: REPORTS */}
            {activeTab === 'reports' && (() => {
              const currentReportType = ['receiving', 'packing', 'damage', 'movement'].includes(reportType) ? reportType : 'receiving';
              return (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-gray-800">Export Warehouse Audit Reports</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const printWindow = window.open('', '_blank');
                            printWindow.document.write(`
                              <html>
                                <head><title>AgriERP Warehouse Staff Audit Report</title></head>
                                <body style="font-family: Arial; padding: 40px; color: #333;">
                                  <h2>AgriERP Warehouse Operations Audit Report</h2>
                                  <p><strong>Generated By:</strong> Madhur Kadam</p>
                                  <p><strong>Role:</strong> Warehouse Staff</p>
                                  <p><strong>Report Type:</strong> ${currentReportType.toUpperCase()} Audit</p>
                                  <hr/>
                                  <p>Warehouse operations audit report compiled successfully on ${new Date().toLocaleDateString()}</p>
                                </body>
                              </html>
                            `);
                            printWindow.document.close();
                            printWindow.print();
                          }}
                          className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 px-3 py-1.5 rounded-xl shadow-sm"
                        >
                          <FileDown size={14} /> Export to PDF
                        </button>
                      </div>
                    </div>

                    {/* Report selector */}
                    <div className="flex gap-2 border-b border-[#F1F8F1] pb-4">
                      {['receiving', 'packing', 'damage', 'movement'].map(t => (
                        <button
                          key={t}
                          onClick={() => setReportType(t)}
                          className={`px-4 py-2 text-xs font-black uppercase border-b-2 transition-all ${
                            currentReportType === t ? 'border-[#236625] text-[#236625]' : 'border-transparent text-gray-400 hover:text-gray-700'
                          }`}
                        >
                          {t} Report
                        </button>
                      ))}
                    </div>

                    {/* Report Data Table */}
                    <div className="table-wrapper">
                      {currentReportType === 'receiving' && (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                              <th className="p-4">Receipt ID</th>
                              <th className="p-4">Product Name</th>
                              <th className="p-4">Supplier</th>
                              <th className="p-4 text-center">Intake Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {receivedGoods.map(g => (
                              <tr key={g.id} className="border-b border-gray-50">
                                <td className="p-4 font-mono font-bold text-gray-500">{g.id}</td>
                                <td className="p-4 font-bold text-gray-700">{g.name}</td>
                                <td className="p-4 font-bold text-gray-500">{g.supplier}</td>
                                <td className="p-4 text-center font-black text-gray-800">{g.qty} units</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {currentReportType === 'packing' && (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                              <th className="p-4">Order ID</th>
                              <th className="p-4">Customer Name</th>
                              <th className="p-4 text-center">Items Packaged</th>
                              <th className="p-4 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {packingOrders.map((o, idx) => (
                              <tr key={idx} className="border-b border-gray-50">
                                <td className="p-4 font-mono font-bold text-[#236625]">{o.id}</td>
                                <td className="p-4 font-bold text-gray-700">{o.customer}</td>
                                <td className="p-4 text-center font-bold">{o.itemsCount} bags</td>
                                <td className="p-4 text-center font-bold text-[#236625]">{o.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {currentReportType === 'damage' && (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                              <th className="p-4">Damage ID</th>
                              <th className="p-4">Product Name</th>
                              <th className="p-4 text-center">Quantity Lost</th>
                              <th className="p-4">Reason / Issue</th>
                            </tr>
                          </thead>
                          <tbody>
                            {damageReportsState.map((d, idx) => (
                              <tr key={idx} className="border-b border-gray-50">
                                <td className="p-4 font-bold text-gray-500 font-mono">{d.id}</td>
                                <td className="p-4 font-bold text-gray-700">{d.product}</td>
                                <td className="p-4 text-center font-bold text-rose-700">{d.qty} bags</td>
                                <td className="p-4 font-medium text-gray-600">{d.type}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {currentReportType === 'movement' && (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                              <th className="p-4">Transfer ID</th>
                              <th className="p-4">Product</th>
                              <th className="p-4">From Shelf</th>
                              <th className="p-4">To Shelf</th>
                              <th className="p-4 text-center">Qty Moved</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stockMovements.map((m, idx) => (
                              <tr key={idx} className="border-b border-gray-50">
                                <td className="p-4 font-bold text-gray-500 font-mono">{m.id}</td>
                                <td className="p-4 font-bold text-gray-700">{m.product}</td>
                                <td className="p-4 text-gray-600">{m.from}</td>
                                <td className="p-4 text-gray-800 font-bold">{m.to}</td>
                                <td className="p-4 text-center font-bold">{m.qty} units</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* SUBMODULE: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="text-[#236625]" size={16} /> All Warehouse Notification Logs
                  </h3>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center text-xs font-semibold text-gray-700 hover:bg-[#F1F8F1]/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#236625] animate-pulse" />
                          <span>{n.text}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ====================================================== */}
        {/* DELIVERY EXECUTIVE MODULES */}
        {/* ====================================================== */}
        {role === 'Delivery Executive' && (() => {
          const todayDeliveries = myDeliveries.filter(d => d.date === new Date().toISOString().split('T')[0])
          const pendingCount = myDeliveries.filter(d => d.status !== 'Delivered' && d.status !== 'Failed').length
          const completedCount = myDeliveries.filter(d => d.status === 'Delivered').length + deliveryHistory.filter(d => d.status === 'Delivered').length
          const codTotal = myDeliveries.filter(d => d.codCollected).reduce((acc, d) => acc + (d.amount || 0), 0)
            + deliveryHistory.filter(d => d.codCollected).reduce((acc, d) => acc + (d.amount || 0), 0)

          const statusColor = (s) => {
            if (s === 'Delivered') return 'bg-[#E8F5E9] text-[#2E7D32]'
            if (s === 'Out For Delivery') return 'bg-blue-50 text-blue-700'
            if (s === 'Picked Up') return 'bg-purple-50 text-purple-700'
            if (s === 'Accepted') return 'bg-amber-50 text-amber-700'
            if (s === 'Failed') return 'bg-rose-50 text-rose-700'
            return 'bg-gray-100 text-gray-600'
          }

          const nextStatus = (s) => {
            if (s === 'Assigned') return 'Accepted'
            if (s === 'Accepted') return 'Picked Up'
            if (s === 'Picked Up') return 'Out For Delivery'
            if (s === 'Out For Delivery') return 'Delivered'
            return null
          }

          const nextStatusLabel = (s) => {
            if (s === 'Assigned') return 'Accept Delivery'
            if (s === 'Accepted') return 'Pick Up Order'
            if (s === 'Picked Up') return 'Start Delivery'
            if (s === 'Out For Delivery') return 'Mark Delivered'
            return null
          }

          const advanceStatus = (del) => {
            const next = nextStatus(del.status)
            if (!next) return
            setMyDeliveries(prev => prev.map(d => d.id === del.id ? { ...d, status: next } : d))
            setDeNotifications(prev => [{ id: Date.now(), text: `Status for ${del.id} (${del.customerName}) updated to ${next}.`, time: 'Just now', type: 'assign' }, ...prev])
            // When delivered, update shared orders state
            if (next === 'Delivered') {
              updateOrderDb(del.orderId, { orderStatus: 'Delivered' })
              if (del.paymentMethod === 'COD') {
                setDeNotifications(prev => [{ id: Date.now() + 1, text: `COD collection pending: ₹${del.amount} from ${del.customerName}.`, time: 'Just now', type: 'cod' }, ...prev])
              }
            }
          }

          return (
            <>
              {/* SUBMODULE: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Welcome Banner */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-[#236625] via-[#2F8F2F] to-[#55FA62] text-white shadow-xl">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Delivery Executive Console</span>
                    <h1 className="text-2xl md:text-3xl font-black mt-3">Good Morning, {user?.name || 'Delivery Executive'}!</h1>
                    <p className="text-xs mt-2 text-emerald-100 font-medium">You have {pendingCount} pending deliveries today. Stay safe on the road!</p>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-5 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm">
                      <p className="text-3xs font-extrabold uppercase text-gray-400">Today's Deliveries</p>
                      <h4 className="text-3xl font-black text-[#236625] mt-1">{myDeliveries.length}</h4>
                    </div>
                    <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl shadow-sm">
                      <p className="text-3xs font-extrabold uppercase text-amber-600">Pending</p>
                      <h4 className="text-3xl font-black text-amber-700 mt-1">{pendingCount}</h4>
                    </div>
                    <div className="p-5 bg-[#E8F5E9] border border-[#D8EAD8] rounded-2xl shadow-sm">
                      <p className="text-3xs font-extrabold uppercase text-[#236625]">Completed</p>
                      <h4 className="text-3xl font-black text-[#236625] mt-1">{completedCount}</h4>
                    </div>
                    <div className="p-5 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm">
                      <p className="text-3xs font-extrabold uppercase text-gray-400">COD Collected</p>
                      <h4 className="text-2xl font-black text-[#236625] mt-1">₹{codTotal.toLocaleString()}</h4>
                    </div>
                  </div>

                  {/* Active Deliveries Quick View */}
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2"><Truck size={16} className="text-[#236625]" /> Active Deliveries</h3>
                    {myDeliveries.filter(d => d.status !== 'Delivered').map(del => (
                      <div key={del.id} className="p-4 bg-[#F8FCF8] border border-[#D8EAD8] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-black text-gray-800">{del.customerName} <span className="font-mono text-gray-400 font-normal text-[10px]">({del.id})</span></p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{del.address}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Slot: {del.timeSlot}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`status-badge text-[10px] ${statusColor(del.status)}`}>{del.status}</span>
                          {nextStatus(del.status) && (
                            <button onClick={() => advanceStatus(del)} className="bg-[#236625] text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase">
                              {nextStatusLabel(del.status)}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {myDeliveries.filter(d => d.status !== 'Delivered').length === 0 && (
                      <p className="text-xs text-gray-400 italic text-center py-4">No active deliveries right now. All clear!</p>
                    )}
                  </div>

                  {/* Workflow Info */}
                  <div className="p-5 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">Your Delivery Workflow</h3>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase">
                      {['Assigned', 'Accepted', 'Picked Up', 'Out For Delivery', 'Delivered'].map((s, i, arr) => (
                        <React.Fragment key={s}>
                          <span className="px-3 py-1.5 rounded-full bg-[#F1F8F1] text-[#236625] border border-[#D8EAD8]">{s}</span>
                          {i < arr.length - 1 && <span className="text-gray-400">→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBMODULE: MY DELIVERIES */}
              {activeTab === 'my_deliveries' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-5 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">My Deliveries</h3>
                      <p className="text-xs text-gray-500 font-medium">Manage and update your delivery statuses</p>
                    </div>
                    <span className="bg-[#236625] text-white text-[10px] font-black px-3 py-1.5 rounded-full">{myDeliveries.length} Total</span>
                  </div>

                  <div className="space-y-4">
                    {myDeliveries.map(del => (
                      <div key={del.id} className="p-5 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-gray-500 font-bold">{del.id}</span>
                              <span className="text-[10px] text-gray-400">•</span>
                              <span className="font-mono text-xs text-[#236625] font-bold">{del.orderId}</span>
                            </div>
                            <h4 className="text-sm font-black text-gray-800 mt-0.5">{del.customerName}</h4>
                          </div>
                          <span className={`status-badge text-[10px] ${statusColor(del.status)}`}>{del.status}</span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="flex items-start gap-2">
                            <Phone size={14} className="text-[#236625] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-gray-400 font-bold text-[10px] uppercase">Mobile</p>
                              <p className="font-bold text-gray-800">{del.mobile}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 sm:col-span-2">
                            <Compass size={14} className="text-[#236625] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-gray-400 font-bold text-[10px] uppercase">Address</p>
                              <p className="font-bold text-gray-800">{del.address}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Calendar size={14} className="text-[#236625] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-gray-400 font-bold text-[10px] uppercase">Time Slot</p>
                              <p className="font-bold text-gray-800">{del.timeSlot}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CreditCard size={14} className="text-[#236625] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-gray-400 font-bold text-[10px] uppercase">Payment</p>
                              <p className="font-bold text-gray-800">{del.paymentMethod} — ₹{del.amount.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {del.status !== 'Delivered' && del.status !== 'Failed' && (
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                            {nextStatus(del.status) && (
                              <button
                                onClick={() => advanceStatus(del)}
                                className="bg-[#236625] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider"
                              >
                                {nextStatusLabel(del.status)}
                              </button>
                            )}
                            <a
                              href={`tel:${del.mobile.replace(/\s/g, '')}`}
                              className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                            >
                              <Phone size={12} /> Call Customer
                            </a>
                            {del.status === 'Out For Delivery' && (
                              <button
                                onClick={() => { setOtpSelectedDelivery(del); setActiveTab('otp_verification'); setOtpInput(''); setOtpVerified(null) }}
                                className="bg-amber-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                              >
                                Verify OTP
                              </button>
                            )}
                          </div>
                        )}
                        {del.status === 'Delivered' && (
                          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            <CheckCircle2 size={14} className="text-[#236625]" />
                            <span className="text-xs font-bold text-[#236625]">Delivered successfully</span>
                            {del.paymentMethod === 'COD' && !del.codCollected && (
                              <button onClick={() => { setCodSelectedDelivery(del); setActiveTab('cod_collection') }} className="ml-auto bg-amber-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase">Collect COD</button>
                            )}
                            {del.codCollected && <span className="ml-auto text-[10px] font-black text-[#236625] bg-[#E8F5E9] px-3 py-1.5 rounded-xl">COD Collected ✓</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBMODULE: DELIVERY HISTORY */}
              {activeTab === 'delivery_history' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-5 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                    <h3 className="text-sm font-bold text-gray-800">Delivery History</h3>
                    <p className="text-xs text-gray-500 font-medium">Past completed and failed delivery records</p>
                  </div>

                  <div className="bg-white border border-[#D8EAD8] rounded-3xl shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                          <th className="p-4">Delivery ID</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4 hidden md:table-cell">Address</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...deliveryHistory, ...myDeliveries.filter(d => d.status === 'Delivered' || d.status === 'Failed')].map(d => (
                          <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="p-4 font-mono font-bold text-gray-500 text-[10px]">{d.id}</td>
                            <td className="p-4 font-bold text-gray-700">{d.customer || d.customerName}</td>
                            <td className="p-4 text-gray-500 hidden md:table-cell">{d.address}</td>
                            <td className="p-4 text-gray-500">{d.date}</td>
                            <td className="p-4 text-center">
                              <span className={`status-badge text-[10px] ${statusColor(d.status)}`}>{d.status}</span>
                            </td>
                            <td className="p-4 text-right font-black text-gray-800">₹{(d.amount || 0).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-[#E8F5E9] border border-[#D8EAD8] rounded-2xl text-center">
                      <p className="text-3xs font-black uppercase text-[#236625]">Total Delivered</p>
                      <p className="text-2xl font-black text-[#236625] mt-1">{[...deliveryHistory, ...myDeliveries].filter(d => d.status === 'Delivered').length}</p>
                    </div>
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-center">
                      <p className="text-3xs font-black uppercase text-rose-600">Total Failed</p>
                      <p className="text-2xl font-black text-rose-700 mt-1">{[...deliveryHistory, ...myDeliveries].filter(d => d.status === 'Failed').length}</p>
                    </div>
                    <div className="p-4 bg-white border border-[#D8EAD8] rounded-2xl text-center">
                      <p className="text-3xs font-black uppercase text-gray-400">COD Collected</p>
                      <p className="text-xl font-black text-[#236625] mt-1">₹{([...deliveryHistory, ...myDeliveries]).filter(d => d.codCollected).reduce((acc, d) => acc + (d.amount || 0), 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBMODULE: OTP VERIFICATION */}
              {activeTab === 'otp_verification' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-5 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                    <h3 className="text-sm font-bold text-gray-800">OTP Verification</h3>
                    <p className="text-xs text-gray-500 font-medium">Verify OTP from customer to confirm delivery completion</p>
                  </div>

                  {/* Delivery Selector */}
                  <div className="p-5 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h4 className="text-xs font-black text-gray-700 uppercase">Select Delivery</h4>
                    <div className="space-y-2">
                      {myDeliveries.filter(d => d.status === 'Out For Delivery').map(del => (
                        <button
                          key={del.id}
                          onClick={() => { setOtpSelectedDelivery(del); setOtpInput(''); setOtpVerified(null) }}
                          className={`w-full p-4 rounded-2xl border text-left text-xs font-bold transition-all ${otpSelectedDelivery?.id === del.id ? 'border-[#236625] bg-[#F1F8F1]' : 'border-gray-200 hover:border-[#236625]/40'}`}
                        >
                          <span className="font-mono text-gray-500">{del.id}</span> — <span className="text-gray-800">{del.customerName}</span>
                          <span className="block text-[10px] text-gray-400 mt-0.5">{del.address}</span>
                        </button>
                      ))}
                      {myDeliveries.filter(d => d.status === 'Out For Delivery').length === 0 && (
                        <p className="text-xs text-gray-400 italic text-center py-4">No deliveries pending OTP verification. Mark a delivery as 'Out For Delivery' first.</p>
                      )}
                    </div>
                  </div>

                  {/* OTP Entry */}
                  {otpSelectedDelivery && (
                    <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-5">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-black text-gray-800">{otpSelectedDelivery.customerName}</h4>
                          <p className="text-[10px] text-gray-400 font-semibold">{otpSelectedDelivery.id} • {otpSelectedDelivery.address}</p>
                        </div>
                        <CheckSquare size={24} className="text-[#236625]" />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Enter OTP Provided by Customer</label>
                        <input
                          type="text"
                          maxLength={4}
                          value={otpInput}
                          onChange={e => { setOtpInput(e.target.value); setOtpVerified(null) }}
                          className="w-full text-center text-3xl font-black tracking-[1rem] px-4 py-4 border-2 border-[#D8EAD8] rounded-2xl focus:border-[#236625] outline-none text-gray-800"
                          placeholder="_ _ _ _"
                        />
                        {otpVerified === true && (
                          <div className="p-3 bg-[#E8F5E9] border border-[#D8EAD8] rounded-xl flex items-center gap-2 text-[#236625] text-xs font-black">
                            <CheckCircle2 size={16} /> OTP Verified! Delivery confirmed.
                          </div>
                        )}
                        {otpVerified === false && (
                          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-black">
                            <AlertTriangle size={16} /> Incorrect OTP. Please ask the customer to check again.
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            if (otpInput === otpSelectedDelivery.otp) {
                              setOtpVerified(true)
                              setMyDeliveries(prev => prev.map(d => d.id === otpSelectedDelivery.id ? { ...d, status: 'Delivered' } : d))
                              updateOrderDb(otpSelectedDelivery.orderId, { orderStatus: 'Delivered' })
                              setDeNotifications(prev => [{ id: Date.now(), text: `OTP verified and delivery ${otpSelectedDelivery.id} marked as Delivered.`, time: 'Just now', type: 'otp' }, ...prev])
                              if (otpSelectedDelivery.paymentMethod === 'COD') {
                                setDeNotifications(prev => [{ id: Date.now() + 1, text: `COD collection pending: ₹${otpSelectedDelivery.amount} from ${otpSelectedDelivery.customerName}.`, time: 'Just now', type: 'cod' }, ...prev])
                              }
                            } else {
                              setOtpVerified(false)
                            }
                          }}
                          className="bg-[#236625] text-white py-3 rounded-2xl text-xs font-black uppercase"
                        >
                          Verify OTP
                        </button>
                        <button
                          onClick={() => { setOtpInput(''); setOtpVerified(null) }}
                          className="bg-gray-100 text-gray-600 py-3 rounded-2xl text-xs font-black uppercase"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUBMODULE: COD COLLECTION */}
              {activeTab === 'cod_collection' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-5 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm">
                    <h3 className="text-sm font-bold text-gray-800">COD Collection</h3>
                    <p className="text-xs text-gray-500 font-medium">Collect cash-on-delivery payments from customers</p>
                  </div>

                  {/* Pending COD */}
                  <div className="p-5 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h4 className="text-xs font-black text-gray-700 uppercase flex items-center gap-2"><CreditCard size={14} className="text-[#236625]" /> Pending COD Collections</h4>
                    {myDeliveries.filter(d => d.status === 'Delivered' && d.paymentMethod === 'COD' && !d.codCollected).map(del => (
                      <div key={del.id} className={`p-4 rounded-2xl border ${codSelectedDelivery?.id === del.id ? 'border-[#236625] bg-[#F1F8F1]' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-black text-gray-800">{del.customerName}</p>
                            <p className="font-mono text-[10px] text-gray-400">{del.id} • {del.orderId}</p>
                          </div>
                          <span className="text-base font-black text-[#236625]">₹{del.amount.toLocaleString()}</span>
                        </div>
                        <div className="mt-3 space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Payment Method</label>
                          <div className="flex gap-2">
                            {['Cash', 'UPI'].map(m => (
                              <button
                                key={m}
                                onClick={() => { setCodSelectedDelivery(del); setCodPaymentMethod(m) }}
                                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase border transition-all ${codPaymentMethod === m && codSelectedDelivery?.id === del.id ? 'bg-[#236625] text-white border-[#236625]' : 'border-gray-200 text-gray-600 hover:border-[#236625]/40'}`}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              setMyDeliveries(prev => prev.map(d => d.id === del.id ? { ...d, codCollected: true, paymentMethod: codPaymentMethod } : d))
                              const newPay = { id: `PAY-${Math.floor(1000 + Math.random() * 8999)}`, customer: del.customerName, amount: del.amount, method: codPaymentMethod, date: new Date().toISOString().split('T')[0], status: 'Pending', orderId: del.orderId }
                              setPayments(prev => [newPay, ...prev])
                              setCodReceiptDelivery({ ...del, collectedMethod: codPaymentMethod })
                              setCodSelectedDelivery(null)
                              setDeNotifications(prev => [{ id: Date.now(), text: `COD ₹${del.amount} collected from ${del.customerName} via ${codPaymentMethod}.`, time: 'Just now', type: 'cod' }, ...prev])
                            }}
                            className="w-full bg-[#236625] text-white py-2.5 rounded-xl text-xs font-black uppercase"
                          >
                            Mark Payment Collected
                          </button>
                        </div>
                      </div>
                    ))}
                    {myDeliveries.filter(d => d.status === 'Delivered' && d.paymentMethod === 'COD' && !d.codCollected).length === 0 && (
                      <p className="text-xs text-gray-400 italic text-center py-4">No pending COD collections.</p>
                    )}
                  </div>

                  {/* COD Receipt Modal */}
                  {codReceiptDelivery && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative animate-scale-up">
                        <button onClick={() => setCodReceiptDelivery(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                        <div className="text-center">
                          <CheckCircle2 size={40} className="text-[#236625] mx-auto" />
                          <h3 className="text-sm font-black text-gray-800 mt-2">Payment Received!</h3>
                          <p className="text-xs text-gray-500 mt-1">COD Collection Receipt</p>
                        </div>
                        <div className="space-y-2 text-xs font-semibold bg-[#F8FCF8] p-4 rounded-2xl">
                          <div className="flex justify-between"><span className="text-gray-500">Delivery ID</span><span className="font-bold">{codReceiptDelivery.id}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-bold">{codReceiptDelivery.customerName}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-black text-[#236625]">₹{codReceiptDelivery.amount.toLocaleString()}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-bold">{codReceiptDelivery.collectedMethod}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-bold">{new Date().toLocaleDateString()}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Collected By</span><span className="font-bold">{user?.name || 'Delivery Executive'}</span></div>
                        </div>
                        <button
                          onClick={() => {
                            const w = window.open('', '_blank')
                            w.document.write(`<html><head><title>COD Receipt</title></head><body style="font-family:sans-serif;padding:20px"><h2>AgriERP — COD Receipt</h2><p><b>Delivery:</b> ${codReceiptDelivery.id}</p><p><b>Customer:</b> ${codReceiptDelivery.customerName}</p><p><b>Amount:</b> ₹${codReceiptDelivery.amount}</p><p><b>Method:</b> ${codReceiptDelivery.collectedMethod}</p><p><b>Date:</b> ${new Date().toLocaleDateString()}</p><p><b>Collected By:</b> ${user?.name || 'Delivery Executive'} (Delivery Executive)</p></body></html>`)
                            w.print()
                          }}
                          className="w-full bg-[#236625] text-white py-2.5 rounded-xl text-xs font-black uppercase"
                        >
                          Print Receipt
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Collected COD */}
                  <div className="p-5 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-3">
                    <h4 className="text-xs font-black text-gray-700 uppercase flex items-center gap-2"><Check size={14} className="text-[#236625]" /> Collected Today</h4>
                    {myDeliveries.filter(d => d.codCollected).map(del => (
                      <div key={del.id} className="p-3 bg-[#E8F5E9] border border-[#D8EAD8] rounded-xl flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-700">{del.customerName} <span className="text-gray-400 font-normal">({del.id})</span></span>
                        <span className="font-black text-[#236625]">₹{del.amount.toLocaleString()} ✓</span>
                      </div>
                    ))}
                    {myDeliveries.filter(d => d.codCollected).length === 0 && (
                      <p className="text-xs text-gray-400 italic text-center py-2">No COD collected yet today.</p>
                    )}
                  </div>
                </div>
              )}

              {/* SUBMODULE: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Bell className="text-[#236625]" size={16} /> Delivery Notifications
                    </h3>
                    <div className="space-y-3">
                      {deNotifications.map(n => (
                        <div key={n.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-start text-xs font-semibold text-gray-700 hover:bg-[#F1F8F1]/40 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${n.type === 'assign' ? 'bg-[#236625]' : n.type === 'otp' ? 'bg-amber-500' : 'bg-blue-500'} animate-pulse`} />
                            <span>{n.text}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{n.time}</span>
                        </div>
                      ))}
                      {deNotifications.length === 0 && (
                        <p className="text-xs text-gray-400 italic text-center py-4">No notifications.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )
        })()}

      </main>

    </div>
  )
}

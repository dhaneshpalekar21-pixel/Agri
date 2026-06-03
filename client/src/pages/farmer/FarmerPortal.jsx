import React, { useState, useEffect } from 'react'
import {
  Sprout, LayoutDashboard, ShoppingBag, ShoppingCart, Receipt, CreditCard,
  MapPin, BrainCircuit, Landmark, Tractor, Award, LifeBuoy, Bell, User,
  Sun, Cloud, CloudRain, Wind, Thermometer, ShieldAlert, ArrowRight, Search,
  Filter, Star, Trash2, CheckCircle2, ChevronRight, Plus, Minus, Download,
  Send, Upload, Loader2, Calendar, FileText, Check, AlertTriangle, ShieldCheck
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

// Dummy Data
const INITIAL_PRODUCTS = []

const MOCK_SCHEMES = [
  { id: 's1', name: 'PM-Kisan Samman Nidhi', benefit: '₹6,000 per year in 3 installments', status: 'Approved', verified: true, desc: 'Government scheme providing income support of ₹6,000 per year to all landholding farmer families.' },
  { id: 's2', name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', benefit: 'Crop Insurance Cover at minimal premium', status: 'Pending Verification', verified: false, desc: 'Crop insurance scheme offering financial support to farmers suffering crop loss/damage.' },
  { id: 's3', name: 'Subsidized Solar Pump Scheme (KUSUM)', benefit: '60% subsidy on Solar Water Pumps', status: 'Eligible (Apply Now)', verified: false, desc: 'Scheme for installation of solar pumps and grid-connected solar power plants.' }
]

const MOCK_RENTALS = [
  { id: 'r1', name: 'John Deere Tractor (55 HP)', charge: '₹2,500 / day', status: 'Available', type: 'Tractor', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80' },
  { id: 'r2', name: 'Rotavator Tiller Attachment', charge: '₹800 / day', status: 'Booked', type: 'Rotavator', image: 'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=400&q=80' },
  { id: 'r3', name: 'Combine Harvester (Multi-Crop)', charge: '₹6,000 / day', status: 'Available', type: 'Harvester', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' },
  { id: 'r4', name: 'Power Boom Sprayer (Trailer Mounted)', charge: '₹1,500 / day', status: 'Available', type: 'Sprayer', image: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?w=400&q=80' }
]

const MOCK_ORDERS = [
  { id: 'ord-3829', date: '2026-05-28', total: 4350, itemsCount: 3, status: 'Delivered', deliveryDay: 'Delivered on May 30' },
  { id: 'ord-8832', date: '2026-06-01', total: 2800, itemsCount: 1, status: 'Shipped', deliveryDay: 'Expected June 4' },
  { id: 'ord-9231', date: '2026-06-02', total: 980, itemsCount: 1, status: 'Processing', deliveryDay: 'Expected June 5' }
]

const MOCK_LEDGER = [
  { date: '2026-05-10', reference: 'Purchase ord-2118', debit: 4500, credit: 0, balance: 12500 },
  { date: '2026-05-15', reference: 'Cash Repayment', debit: 0, credit: 5000, balance: 7500 },
  { date: '2026-05-28', reference: 'Purchase ord-3829', debit: 4350, credit: 0, balance: 11850 },
  { date: '2026-06-01', reference: 'Online Payment', debit: 0, credit: 1850, balance: 10000 }
]

const MOCK_REWARDS = [
  { id: 'rew-1', title: '₹500 Discount Coupon', points: 500, code: 'AGRI500' },
  { id: 'rew-2', title: 'Free Hybrid Corn Seeds Bag', points: 1200, code: 'FREECORN' },
  { id: 'rew-3', title: '1-Day Tractor Rental Voucher', points: 2500, code: 'RENTFREE' }
]

export default function FarmerPortal() {
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Cart State
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')

  // Marketplace Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null) // Product detail modal
  const [productsList, setProductsList] = useState([])

  useEffect(() => {
    import('../../services/api').then(({ default: api }) => {
      api.get('/products').then(res => {
        const uiProducts = (res.data.products || res.data).map(p => ({
          id: p._id,
          name: p.productName,
          category: p.category,
          price: p.sellingPrice,
          rating: 4.5,
          reviews: 12,
          stock: p.stockQuantity > 0 ? 'In Stock' : 'Out of Stock',
          image: p.image || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=150&auto=format&fit=crop&q=60',
          desc: p.description
        }))
        setProductsList(uiProducts)
      }).catch(console.error)
    })
  }, [])

  // Orders State
  const [orders, setOrders] = useState([])
  const [activeOrderTrack, setActiveOrderTrack] = useState(null)

  const fetchOrders = async () => {
    try {
      const { default: api } = await import('../../services/api')
      const customerId = user?.id || user?._id || 'guest'
      const res = await api.get(`/orders?customerId=${customerId}`)
      const uiOrders = res.data.map(o => ({
        _id: o._id,
        id: o.orderId,
        date: o.createdAt ? o.createdAt.split('T')[0] : 'Unknown Date',
        itemsCount: o.items ? o.items.length : 0,
        total: o.totalAmount,
        status: o.orderStatus
      }))
      setOrders(uiOrders)
      if (uiOrders.length > 0) {
        setActiveOrderTrack(uiOrders.find(o => o.status !== 'Delivered') || uiOrders[0])
      }
    } catch (err) { console.error('Failed to load orders', err) }
  }

  useEffect(() => {
    fetchOrders()
  }, [user])

  // Credit State
  const [ledger, setLedger] = useState(MOCK_LEDGER)
  const [outstandingCredit, setOutstandingCredit] = useState(10000)
  const [creditLimit] = useState(50000)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')

  // AI Services States
  const [scanImage, setScanImage] = useState(null)
  const [scanLoading, setScanLoading] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [advisorySoil, setAdvisorySoil] = useState('Clayey-Loam')
  const [advisorySeason, setAdvisorySeason] = useState('Monsoon')
  const [yieldCrop, setYieldCrop] = useState('Wheat')
  const [yieldAcres, setYieldAcres] = useState(5)

  // Equipment Rental Bookings
  const [rentals, setRentals] = useState(MOCK_RENTALS)
  const [rentDuration, setRentDuration] = useState(1)
  const [bookedEquipment, setBookedEquipment] = useState(null)

  // Loyalty Program Points
  const [loyaltyPoints, setLoyaltyPoints] = useState(750)
  const [redeemedCodes, setRedeemedCodes] = useState([])

  // Support tickets
  const [tickets, setTickets] = useState([
    { id: 't-101', subject: 'Seed Germination Issue', status: 'Closed', date: '2026-05-15' },
    { id: 't-102', subject: 'Credit Repayment Sync Delay', status: 'Open', date: '2026-06-01' }
  ])
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketMessage, setTicketMessage] = useState('')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { sender: 'support', text: 'Namaskar! Welcome to AgriERP Live Chat. How can we help you today?' }
  ])
  const [chatInput, setChatInput] = useState('')

  // Profile Edit fields
  const [profileName, setProfileName] = useState('Rajesh Kumar')
  const [profilePhone, setProfilePhone] = useState('+91 98765 43210')
  const [profileAddress, setProfileAddress] = useState('Plot 42, Krushi Nagar, District Wardha, Maharashtra, 442001')
  const [profileDoc, setProfileDoc] = useState('Aadhaar_Card_Verified.pdf')
  const [kycStatus, setKycStatus] = useState('Verified')

  // Notification lists
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', text: 'Your order #ord-9231 is being processed.', time: '2 hours ago' },
    { id: 2, type: 'weather', text: 'Heavy Rainfall alert issued for Wardha district from June 4.', time: '5 hours ago' },
    { id: 3, type: 'recommendation', text: 'AI recommendation: Ideal time to apply urea to cotton crops.', time: '1 day ago' },
    { id: 4, type: 'promotion', text: 'Get 10% discount on Sprayers using coupon KISHAN10.', time: '2 days ago' }
  ])

  // Helpers
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setNotifications(prev => [
      { id: Date.now(), type: 'order', text: `Added ${product.name} to shopping cart.`, time: 'Just now' },
      ...prev
    ])
  }

  const updateCartQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta
        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    }))
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id)
      }
      return [...prev, product]
    })
  }

  const applyCoupon = () => {
    if (appliedCoupon.trim().toUpperCase() === 'KISHAN50') {
      setCouponDiscount(250)
      setCouponError('')
    } else if (appliedCoupon.trim().toUpperCase() === 'AGRI10') {
      setCouponDiscount(100)
      setCouponError('')
    } else {
      setCouponError('Invalid Coupon Code')
      setCouponDiscount(0)
    }
  }

  const getCartSubtotal = () => cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
  const getCartTotal = () => Math.max(0, getCartSubtotal() - couponDiscount)

  const handleCheckout = async (paymentMethod) => {
    const total = getCartTotal()
    if (cart.length === 0) return

    try {
      const { default: api } = await import('../../services/api')
      const payload = {
        items: cart.map(c => ({
          productId: c.id,
          name: c.name,
          price: c.price,
          quantity: c.quantity,
          image: c.image
        })),
        totalAmount: total,
        paymentMethod,
        customerName: profileName,
        customerEmail: user?.email || '',
        customerId: user?.id || user?._id || 'guest'
      }

      const res = await api.post('/orders', payload)
      console.log("Order Created:", res.data)
      const newOrder = res.data

      const newUiOrder = {
        _id: newOrder._id,
        id: newOrder.orderId,
        date: newOrder.createdAt ? newOrder.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        itemsCount: newOrder.items ? newOrder.items.length : 0,
        total: newOrder.totalAmount,
        status: newOrder.orderStatus
      }

      setOrders(prev => [newUiOrder, ...prev])
      fetchOrders()

      // If Udhari / Credit option was chosen, update ledger and credit balance
      if (paymentMethod === 'credit') {
        setOutstandingCredit(prev => prev + total)
        setLedger(prev => [
          ...prev,
          {
            date: newOrder.createdAt ? newOrder.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
            reference: `Purchase ${newOrder.orderId}`,
            debit: total,
            credit: 0,
            balance: outstandingCredit + total
          }
        ])
      }

      // Grant loyalty points (1 point per 10 rupees)
      const pointsEarned = Math.floor(total / 10)
      setLoyaltyPoints(prev => prev + pointsEarned)

      setCart([])
      setAppliedCoupon('')
      setCouponDiscount(0)
      setActiveTab('orders')
      setNotifications(prev => [
        { id: Date.now(), type: 'order', text: `Order ${newOrder.orderId} placed successfully using ${paymentMethod === 'credit' ? 'Udhari' : 'Cash on Delivery'}.`, time: 'Just now' },
        ...prev
      ])
    } catch (err) {
      console.error('Checkout failed', err)
    }
  }

  const handleMakePayment = () => {
    const amt = parseFloat(paymentAmount)
    if (isNaN(amt) || amt <= 0 || amt > outstandingCredit) return

    setOutstandingCredit(prev => prev - amt)
    setLedger(prev => [
      ...prev,
      {
        date: new Date().toISOString().split('T')[0],
        reference: 'Repayment (Digital)',
        debit: 0,
        credit: amt,
        balance: outstandingCredit - amt
      }
    ])
    setPaymentAmount('')
    setPaymentModalOpen(false)
    // Gain loyalty bonus points for repayment
    setLoyaltyPoints(prev => prev + 50)
    setNotifications(prev => [
      { id: Date.now(), type: 'order', text: `Repayment of ₹${amt} processed successfully. Outstanding: ₹${outstandingCredit - amt}`, time: 'Just now' },
      ...prev
    ])
  }

  // AI disease simulator
  const handleDiseaseUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) return
    setScanImage(URL.createObjectURL(e.target.files[0]))
    setScanLoading(true)
    setScanResult(null)

    setTimeout(() => {
      setScanLoading(false)
      setScanResult({
        disease: 'Early Blight (Alternaria Solani)',
        confidence: '94%',
        severity: 'Medium',
        treatment: 'Spray Copper Hydroxide fungicide (e.g., Kocide 3000) at 1.5g/L. Remove and burn heavily infected lower leaves. Ensure crop rotation next season.'
      })
    }, 2000)
  }

  // Equipment renting
  const handleRentBooking = (equip) => {
    setRentals(prev => prev.map(item => item.id === equip.id ? { ...item, status: 'Booked' } : item))
    setNotifications(prev => [
      { id: Date.now(), type: 'recommendation', text: `Rented ${equip.name} successfully. Status: Booked.`, time: 'Just now' },
      ...prev
    ])
    setBookedEquipment(equip)
  }

  // Loyalty coupon redeemer
  const handleRedeemPoints = (reward) => {
    if (loyaltyPoints < reward.points) return
    setLoyaltyPoints(prev => prev - reward.points)
    setRedeemedCodes(prev => [...prev, { ...reward, date: new Date().toLocaleDateString() }])
    setNotifications(prev => [
      { id: Date.now(), type: 'promotion', text: `Redeemed ${reward.points} points for coupon code ${reward.code}.`, time: 'Just now' },
      ...prev
    ])
  }

  // Support Ticket Form
  const handleCreateTicket = (e) => {
    e.preventDefault()
    if (!ticketSubject || !ticketMessage) return
    const newT = {
      id: `t-${Math.floor(103 + Math.random() * 900)}`,
      subject: ticketSubject,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    }
    setTickets(prev => [newT, ...prev])
    setTicketSubject('')
    setTicketMessage('')
    setNotifications(prev => [
      { id: Date.now(), type: 'order', text: `Support ticket ${newT.id} raised successfully.`, time: 'Just now' },
      ...prev
    ])
  }

  // Chat message sender
  const handleSendChatMessage = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const newMsgs = [...chatMessages, { sender: 'farmer', text: chatInput }]
    setChatMessages(newMsgs)
    setChatInput('')

    // Simulated reply
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'support', text: 'Thank you for reaching out. A Krushi representative is reviewing your details.' }
      ])
    }, 1200)
  }

  // Dynamic values
  const totalOrdersCount = orders.length
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Browse Products', icon: ShoppingBag },
    { id: 'cart', label: 'Shopping Cart', icon: ShoppingCart, count: cart.length },
    { id: 'orders', label: 'Orders & Invoice', icon: Receipt },
    { id: 'udhari', label: 'Udhari & Credit', icon: CreditCard },
    { id: 'myfarm', label: 'My Farm', icon: MapPin },
    { id: 'ai', label: 'AI Services', icon: BrainCircuit },
    { id: 'schemes', label: 'Govt Schemes', icon: Landmark },
    { id: 'rental', label: 'Equipment Rental', icon: Tractor },
    { id: 'loyalty', label: 'Loyalty Program', icon: Award },
    { id: 'support', label: 'Support Center', icon: LifeBuoy },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications.length },
    { id: 'profile', label: 'My Profile', icon: User }
  ]

  return (
    <div className="min-h-screen bg-[#F8FCF8] text-[#1E293B] flex flex-col lg:flex-row antialiased font-sans">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="w-80 bg-white border-r border-[#D8EAD8] flex flex-col justify-between hidden lg:flex flex-shrink-0">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-[#D8EAD8]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#236625] to-[#2F8F2F]">
              <Sprout className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#236625] tracking-tight">AgriERP</h2>
              <p className="text-xs text-gray-500 font-bold">Farmer Portal</p>
            </div>
          </div>

          {/* User Widget */}
          <div className="m-4 p-4 rounded-2xl bg-gradient-to-br from-[#F1F8F1] to-[#D8EAD8]/30 border border-[#D8EAD8] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#236625] text-white font-bold flex items-center justify-center text-sm shadow-md">
              {profileName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-gray-800 truncate">{profileName}</h4>
              <p className="text-2xs text-[#236625] font-semibold">{profilePhone}</p>
            </div>
          </div>

          {/* Nav list */}
          <nav className="px-3 py-2 space-y-1">
            {menuItems.map(item => {
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
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-[#236625]' : 'bg-[#EF4444] text-white'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-[#D8EAD8]">
          <button
            onClick={() => { logout(); window.location.href = '/login' }}
            className="w-full flex items-center justify-center gap-2 p-3 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider rounded-xl border border-red-100 transition-colors"
          >
            Logout Portal
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="lg:hidden h-16 bg-white border-b border-[#D8EAD8] px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#236625]">
            <Sprout className="text-white w-5 h-5" />
          </div>
          <span className="text-base font-black text-[#236625]">AgriERP Portal</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 text-[#236625] font-bold"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 flex">
          <div className="w-72 bg-white h-full flex flex-col justify-between shadow-2xl p-4 animate-slide-right">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#236625] text-white font-bold flex items-center justify-center">
                  R
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{profileName}</h4>
                  <p className="text-3xs text-gray-400 font-semibold">{profilePhone}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {menuItems.map(item => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false) }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'bg-[#236625] text-white'
                          : 'text-gray-600 hover:bg-[#F1F8F1]'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="bg-[#EF4444] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{item.count}</span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
            <button
              onClick={() => { logout(); window.location.href = '/login' }}
              className="w-full p-2.5 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider rounded-xl border border-red-100"
            >
              Logout Portal
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto max-w-screen-xl mx-auto w-full">
        
        {/* SUBMODULE: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Welcome card & Weather banner */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-[#236625] via-[#2F8F2F] to-[#55FA62] text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <span className="text-3xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Kishan Suvidha</span>
                  <h1 className="text-2xl md:text-3xl font-black mt-3">Welcome back, {profileName}!</h1>
                  <p className="text-xs mt-2 text-emerald-100 font-medium">Summer harvest calendar is active. Ensure scheduled drip irrigation for Cotton field by tomorrow morning.</p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <span className="text-2xs font-extrabold uppercase bg-white text-[#236625] px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md">
                    <CheckCircle2 size={14} /> KYC Status: {kycStatus}
                  </span>
                </div>
              </div>

              {/* Weather Summary widget */}
              <div className="p-6 rounded-3xl bg-white border border-[#D8EAD8] shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Wardha Weather</h3>
                    <p className="text-3xs text-gray-400">Current Forecast</p>
                  </div>
                  <Sun size={28} className="text-amber-500 animate-spin" style={{ animationDuration: '20s' }} />
                </div>
                <div className="my-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-gray-900">34°C</span>
                  <span className="text-xs text-[#236625] font-extrabold">Partly Sunny</span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-[#F1F8F1] pt-3 text-center">
                  <div>
                    <p className="text-[10px] text-gray-400">Humidity</p>
                    <p className="text-xs font-bold text-gray-700">48%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Wind</p>
                    <p className="text-xs font-bold text-gray-700">12 km/h</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Rain Prob</p>
                    <p className="text-xs font-bold text-gray-700">10%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="kpi-card flex flex-col justify-between p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm">
                <p className="text-3xs font-extrabold uppercase text-gray-400">Total Orders</p>
                <h4 className="text-2xl font-black text-[#236625] mt-1">{totalOrdersCount}</h4>
              </div>
              <div className="kpi-card flex flex-col justify-between p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm">
                <p className="text-3xs font-extrabold uppercase text-gray-400">Active Orders</p>
                <h4 className="text-2xl font-black text-amber-600 mt-1">{activeOrdersCount}</h4>
              </div>
              <div className="kpi-card flex flex-col justify-between p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm">
                <p className="text-3xs font-extrabold uppercase text-gray-400">Credit Outstanding</p>
                <h4 className="text-2xl font-black text-rose-600 mt-1">₹{outstandingCredit.toLocaleString()}</h4>
              </div>
              <div className="kpi-card flex flex-col justify-between p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm">
                <p className="text-3xs font-extrabold uppercase text-gray-400">Credit Limit Remaining</p>
                <h4 className="text-2xl font-black text-[#236625] mt-1">₹{(creditLimit - outstandingCredit).toLocaleString()}</h4>
              </div>
              <div className="kpi-card flex flex-col justify-between p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm">
                <p className="text-3xs font-extrabold uppercase text-gray-400">Loyalty Points</p>
                <h4 className="text-2xl font-black text-[#236625] mt-1">{loyaltyPoints}</h4>
              </div>
              <div className="kpi-card flex flex-col justify-between p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm bg-rose-50 border-rose-200">
                <p className="text-3xs font-extrabold uppercase text-rose-600">Weather Alerts</p>
                <h4 className="text-2xl font-black text-rose-700 mt-1">1</h4>
              </div>
            </div>

            {/* Crop Health & Advisory Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Crop health summary */}
              <div className="p-6 rounded-3xl bg-white border border-[#D8EAD8] shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sprout className="text-[#236625]" size={18} /> Crop Health Summary
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>Field A: Cotton (10 Acres)</span>
                      <span className="text-[#236625]">Good (88%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-[#236625] rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>Field B: Wheat (5 Acres)</span>
                      <span className="text-[#236625]">Excellent (94%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-[#236625] rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-3xs text-amber-800 font-bold flex gap-2">
                    <AlertTriangle className="flex-shrink-0" size={16} />
                    <span>Recommendation: High humidity might increase fungal risks in Wheat crops. Keep systemic fungicide handy.</span>
                  </div>
                </div>
              </div>

              {/* AI recommendations feed */}
              <div className="p-6 rounded-3xl bg-white border border-[#D8EAD8] shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BrainCircuit className="text-[#236625]" size={18} /> AI Recommendations
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-[#F1F8F1] border border-[#D8EAD8]/40 text-xs font-bold text-gray-700 flex justify-between items-center">
                    <div>
                      <span className="text-[#236625] text-4xs tracking-widest block uppercase mb-1">Best Seed Choice</span>
                      <span>Premium Hybrid Wheat Seeds (HD-2967)</span>
                    </div>
                    <button onClick={() => setActiveTab('products')} className="text-2xs text-[#236625] underline uppercase font-black">Buy</button>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F1F8F1] border border-[#D8EAD8]/40 text-xs font-bold text-gray-700 flex justify-between items-center">
                    <div>
                      <span className="text-[#236625] text-4xs tracking-widest block uppercase mb-1">Fertilizer Tips</span>
                      <span>Apply NPK Granular (19-19-19) on 3rd week after sowing.</span>
                    </div>
                    <button onClick={() => setActiveTab('ai')} className="text-2xs text-[#236625] underline uppercase font-black">Advisory</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="table-wrapper">
              <div className="table-header">
                <h3 className="text-sm font-bold text-gray-800">Recent Marketplace Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-2xs text-[#236625] font-black uppercase flex items-center gap-1">
                  View All Orders <ChevronRight size={14} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-4 font-bold text-gray-700">{order.id}</td>
                        <td className="p-4 text-gray-500">{order.date}</td>
                        <td className="p-4 text-gray-600">{order.itemsCount} items</td>
                        <td className="p-4 font-bold text-gray-800">₹{order.total.toLocaleString()}</td>
                        <td className="p-4 text-center">
                          <span className={`status-badge ${
                            order.status === 'Delivered' ? 'bg-[#E8F5E9] text-[#2E7D32]' :
                            order.status === 'Shipped' ? 'bg-blue-50 text-blue-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {order.status}
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

        {/* SUBMODULE: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#D8EAD8] shadow-sm">
              <div className="relative flex-grow max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search seeds, fertilizer, equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-[#D8EAD8] rounded-xl text-xs outline-none focus:border-[#236625] text-gray-700 font-bold"
                />
              </div>

              {/* Categories filters */}
              <div className="flex flex-wrap gap-2">
                {['All', 'Seeds', 'Fertilizers', 'Pesticides', 'Farm Equipment', 'Irrigation Products'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#236625] text-white shadow-md'
                        : 'bg-[#F1F8F1] text-[#236625] hover:bg-[#D8EAD8]/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {productsList.filter(p => {
                const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
                const matchCat = selectedCategory === 'All' || p.category === selectedCategory
                return matchSearch && matchCat
              }).map(product => (
                <div key={product.id} className="kpi-card flex flex-col justify-between p-0 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm overflow-hidden group">
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur text-[10px] text-gray-600 font-black px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-gray-800 line-clamp-2 h-8 hover:text-[#236625] cursor-pointer" onClick={() => setSelectedProduct(product)}>
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-2 text-amber-500">
                        <Star size={12} className="fill-amber-500" />
                        <span className="text-3xs font-bold text-gray-600">{product.rating} ({product.reviews})</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-black text-gray-900">₹{product.price.toLocaleString()}</span>
                      <span className={`text-[10px] font-bold ${product.stock === 'In Stock' ? 'text-[#2E7D32]' : 'text-rose-600'}`}>{product.stock}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button
                        onClick={() => addToCart(product)}
                        className="btn-primary text-2xs py-2 rounded-lg font-black uppercase text-center"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="btn-secondary text-2xs py-2 rounded-lg font-black uppercase text-center"
                      >
                        {wishlist.find(w => w.id === product.id) ? 'Wishlisted' : 'Wishlist'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Product Details Modal */}
            {selectedProduct && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl p-6 relative animate-scale-up">
                  <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg font-black">✕</button>
                  <div className="grid grid-cols-2 gap-4">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-40 object-cover rounded-xl" />
                    <div>
                      <span className="text-[10px] font-black text-[#236625] bg-[#F1F8F1] px-2 py-0.5 rounded-full">{selectedProduct.category}</span>
                      <h3 className="text-xs font-black text-gray-800 mt-2">{selectedProduct.name}</h3>
                      <p className="text-lg font-black text-gray-900 mt-2">₹{selectedProduct.price.toLocaleString()}</p>
                      <p className="text-3xs text-gray-500 mt-2 leading-relaxed">{selectedProduct.desc}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3 border-t border-[#F1F8F1] pt-4">
                    <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null) }} className="btn-primary text-xs uppercase px-5 py-2.5">Add to Cart</button>
                    <button onClick={() => { toggleWishlist(selectedProduct); setSelectedProduct(null) }} className="btn-secondary text-xs uppercase px-5 py-2.5">Add to Wishlist</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBMODULE: SHOPPING CART */}
        {activeTab === 'cart' && (
          <div className="space-y-6 animate-fade-in">
            {cart.length === 0 ? (
              <div className="p-8 text-center bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                <ShoppingCart size={48} className="text-[#236625] mx-auto animate-bounce" />
                <h3 className="text-sm font-bold text-gray-800">Your Cart is Empty</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">Explore seed inventory, fertilizers, and equipment in the Marketplace to load your cart.</p>
                <button onClick={() => setActiveTab('products')} className="btn-primary uppercase text-xs">Shop Marketplace</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="p-4 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-bold text-gray-800 truncate">{item.name}</h4>
                        <p className="text-xs font-black text-[#236625] mt-1">₹{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQuantity(item.id, -1)} className="p-1 rounded bg-[#F1F8F1] text-[#236625] hover:bg-[#D8EAD8]/40"><Minus size={14} /></button>
                        <span className="text-xs font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, 1)} className="p-1 rounded bg-[#F1F8F1] text-[#236625] hover:bg-[#D8EAD8]/40"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-rose-600 hover:text-rose-800 p-2"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>

                {/* Summary Panel */}
                <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-6">
                  <h3 className="text-sm font-bold text-gray-800">Order Summary</h3>
                  <div className="space-y-2 border-b border-[#F1F8F1] pb-4">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-gray-700">₹{getCartSubtotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Coupon Discount</span>
                      <span className="font-bold text-emerald-600">-₹{couponDiscount}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>GST (Included)</span>
                      <span className="font-bold text-gray-700">₹0</span>
                    </div>
                  </div>

                  {/* Apply Coupon */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Coupon Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try KISHAN50"
                        value={appliedCoupon}
                        onChange={(e) => setAppliedCoupon(e.target.value)}
                        className="flex-grow px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none focus:border-[#236625] text-gray-700 uppercase"
                      />
                      <button onClick={applyCoupon} className="btn-secondary text-2xs py-1.5">Apply</button>
                    </div>
                    {couponError && <p className="text-[10px] text-rose-500 font-bold">{couponError}</p>}
                  </div>

                  <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-[#F1F8F1] pt-4">
                    <span>Total Amount</span>
                    <span>₹{getCartTotal().toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-2">
                    <button
                      onClick={() => handleCheckout('cod')}
                      className="btn-primary w-full py-3 text-xs uppercase font-black tracking-wider"
                    >
                      Pay on Delivery (COD)
                    </button>
                    <button
                      onClick={() => handleCheckout('credit')}
                      className="btn-secondary w-full py-3 text-xs uppercase font-black tracking-wider border-2 hover:bg-[#F1F8F1]"
                      disabled={outstandingCredit + getCartTotal() > creditLimit}
                    >
                      Purchase on Udhari (Credit)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBMODULE: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            {/* Active order tracking */}
            {activeOrderTrack && (
              <div className="p-6 rounded-3xl bg-white border border-[#D8EAD8] shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-[#F1F8F1] pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Track Order {activeOrderTrack.id}</h3>
                    <p className="text-3xs text-gray-400">Order placed on {activeOrderTrack.date}</p>
                  </div>
                  <span className="text-xs font-black text-[#236625] bg-[#F1F8F1] px-3 py-1 rounded-full">
                    Status: {activeOrderTrack.status}
                  </span>
                </div>

                {/* Steps indicator */}
                <div className="grid grid-cols-4 gap-4 text-center">
                  {[
                    { step: 'Order Placed', active: true },
                    { step: 'Processing', active: activeOrderTrack.status !== 'Pending' },
                    { step: 'Shipped', active: activeOrderTrack.status === 'Shipped' || activeOrderTrack.status === 'Delivered' },
                    { step: 'Delivered', active: activeOrderTrack.status === 'Delivered' }
                  ].map((s, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${s.active ? 'bg-[#236625] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {idx + 1}
                      </div>
                      <span className={`text-3xs block font-bold ${s.active ? 'text-gray-800' : 'text-gray-400'}`}>{s.step}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center bg-[#F1F8F1] p-4 rounded-2xl">
                  <div className="text-xs text-gray-600 font-bold">
                    <span>Delivery Partner assigned: </span>
                    <span className="text-[#236625]">Krushi Logistics Service</span>
                  </div>
                  {/* Mock print/download invoice */}
                  <button
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`
                        <html>
                          <head><title>AgriERP Invoice ${activeOrderTrack.id}</title></head>
                          <body style="font-family: Arial; padding: 40px; color: #333;">
                            <h2>AgriERP Invoice - Farmer Portal</h2>
                            <p><strong>Order ID:</strong> ${activeOrderTrack.id}</p>
                            <p><strong>Date:</strong> ${activeOrderTrack.date}</p>
                            <p><strong>Billed To:</strong> Rajesh Kumar (Farmer ID: W-9281)</p>
                            <hr/>
                            <p><strong>Total Amount:</strong> ₹${activeOrderTrack.total.toLocaleString()}</p>
                            <p><strong>Status:</strong> ${activeOrderTrack.status}</p>
                            <p>Thank you for choosing AgriERP!</p>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }}
                    className="flex items-center gap-1 bg-white hover:bg-gray-50 border border-[#D8EAD8] text-xs font-bold text-gray-700 px-3 py-1.5 rounded-xl shadow-sm"
                  >
                    <Download size={14} /> Download Invoice PDF
                  </button>
                </div>
              </div>
            )}

            {/* Order History */}
            <div className="table-wrapper">
              <div className="table-header">
                <h3 className="text-sm font-bold text-gray-800">Order History & Invoices</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-4 font-bold text-gray-700">{o.id}</td>
                        <td className="p-4 text-gray-500">{o.date}</td>
                        <td className="p-4 font-black text-gray-800">₹{o.total.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`status-badge ${
                            o.status === 'Delivered' ? 'bg-[#E8F5E9] text-[#2E7D32]' :
                            o.status === 'Shipped' ? 'bg-blue-50 text-blue-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-center space-x-2">
                          <button onClick={() => setActiveOrderTrack(o)} className="text-2xs text-[#236625] underline font-bold uppercase">Track</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBMODULE: UDHARI / CREDIT */}
        {activeTab === 'udhari' && (
          <div className="space-y-6 animate-fade-in">
            {/* Credit Limits Summary */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-[#D8EAD8] shadow-sm">
                <h3 className="text-sm font-bold text-gray-800">Outstanding Credit</h3>
                <p className="text-4xl font-black text-rose-600 mt-2">₹{outstandingCredit.toLocaleString()}</p>
                <div className="w-full bg-gray-100 h-2.5 rounded-full mt-4">
                  <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: `${(outstandingCredit / creditLimit) * 100}%` }} />
                </div>
                <p className="text-3xs text-gray-400 mt-2 font-bold uppercase tracking-wider">Outstanding ratio of total credit limit</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#D8EAD8] shadow-sm">
                <h3 className="text-sm font-bold text-gray-800">Credit Limit</h3>
                <p className="text-4xl font-black text-[#236625] mt-2">₹{creditLimit.toLocaleString()}</p>
                <p className="text-3xs text-gray-400 mt-2 font-bold uppercase tracking-wider">Approved credit line limit for pesticides/seeds</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#D8EAD8] shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Outstanding Payments</h3>
                  <p className="text-2xs text-gray-500 mt-1">Settle your outstanding credit balance safely using online bank transfer or debit cards.</p>
                </div>
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="btn-primary w-full text-xs uppercase py-2.5 font-bold"
                  disabled={outstandingCredit === 0}
                >
                  Make Payment
                </button>
              </div>
            </div>

            {/* Financial ledger statement */}
            <div className="table-wrapper">
              <div className="table-header">
                <h3 className="text-sm font-bold text-gray-800">Ledger Statements</h3>
                <button
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`
                      <html>
                        <head><title>AgriERP Ledger Rajesh Kumar</title></head>
                        <body style="font-family: Arial; padding: 40px; color: #333;">
                          <h2>AgriERP Financial Ledger Statement</h2>
                          <p><strong>Farmer:</strong> Rajesh Kumar</p>
                          <p><strong>Credit Line Status:</strong> Active</p>
                          <hr/>
                          <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%;">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Reference</th>
                                <th>Debit (Added)</th>
                                <th>Credit (Paid)</th>
                                <th>Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${ledger.map(row => `
                                <tr>
                                  <td>${row.date}</td>
                                  <td>${row.reference}</td>
                                  <td>₹${row.debit}</td>
                                  <td>₹${row.credit}</td>
                                  <td>₹${row.balance}</td>
                                </tr>
                              `).join('')}
                            </tbody>
                          </table>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.print();
                  }}
                  className="btn-secondary text-2xs py-1.5"
                >
                  View Statement Print
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                      <th className="p-4">Date</th>
                      <th className="p-4">Reference</th>
                      <th className="p-4 text-right">Debit</th>
                      <th className="p-4 text-right">Credit</th>
                      <th className="p-4 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 font-medium">
                        <td className="p-4 text-gray-500">{row.date}</td>
                        <td className="p-4 font-bold text-gray-700">{row.reference}</td>
                        <td className="p-4 text-right text-rose-600 font-bold">₹{row.debit > 0 ? row.debit.toLocaleString() : '-'}</td>
                        <td className="p-4 text-right text-[#2E7D32] font-bold">₹{row.credit > 0 ? row.credit.toLocaleString() : '-'}</td>
                        <td className="p-4 text-right font-black text-gray-800">₹{row.balance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Modal */}
            {paymentModalOpen && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 relative">
                  <button onClick={() => setPaymentModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                  <h3 className="text-sm font-bold text-gray-800">Settle Outstanding Credit</h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Payment Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D8EAD8] rounded-xl text-xs outline-none focus:border-[#236625] text-gray-700 font-bold"
                    />
                  </div>
                  <div className="pt-2 grid grid-cols-2 gap-3">
                    <button onClick={handleMakePayment} className="btn-primary text-xs uppercase py-2.5">Confirm</button>
                    <button onClick={() => setPaymentModalOpen(false)} className="btn-secondary text-xs uppercase py-2.5">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBMODULE: MY FARM */}
        {activeTab === 'myfarm' && (
          <div className="space-y-6 animate-fade-in">
            {/* Details and Soil */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <MapPin className="text-[#236625]" size={18} /> Farm Location & Size
                </h3>
                <div className="space-y-2 text-xs font-semibold text-gray-600">
                  <p><strong>District:</strong> Wardha, Maharashtra</p>
                  <p><strong>Coordinates:</strong> 20.7453° N, 78.6022° E</p>
                  <p><strong>Total Land Area:</strong> 15 Acres</p>
                  <p><strong>Irrigation Type:</strong> Drip & Tube-well</p>
                </div>
              </div>

              <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Sprout className="text-[#236625]" size={18} /> Soil Health Metrics
                </h3>
                <div className="space-y-2 text-xs font-semibold text-gray-600">
                  <p><strong>Soil Type:</strong> Clayey-Loam</p>
                  <p><strong>pH Level:</strong> 6.8 (Healthy Neutral)</p>
                  <p><strong>Nitrogen (N):</strong> Medium</p>
                  <p><strong>Phosphorus (P):</strong> High</p>
                  <p><strong>Organic Carbon:</strong> 0.65%</p>
                </div>
              </div>

              <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="text-[#236625]" size={18} /> Current Season Crop
                </h3>
                <div className="space-y-2 text-xs font-semibold text-gray-600">
                  <p><strong>Primary Crop:</strong> Cotton (Hybrid-Gold)</p>
                  <p><strong>Sowing Date:</strong> 2026-05-12</p>
                  <p><strong>Estimated Harvest:</strong> October 2026</p>
                  <p><strong>Stage:</strong> Vegetative growth</p>
                </div>
              </div>
            </div>

            {/* Crop Calendar & History */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-800">Crop Advisory Calendar</h3>
                <div className="space-y-3 font-semibold text-xs">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-gray-800">Fertilizer Application</p>
                      <p className="text-3xs text-[#236625]">Apply Nitrogen / Urea mix</p>
                    </div>
                    <span className="text-3xs bg-[#236625] text-white px-2 py-0.5 rounded-full font-bold">Week 4</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">First Pruning Cycle</p>
                      <p className="text-3xs text-gray-400">Pest monitoring & weed removal</p>
                    </div>
                    <span className="text-3xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">Week 8</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-800">Historical Crops Record</h3>
                <div className="space-y-3 font-semibold text-xs text-gray-600">
                  <div className="flex justify-between border-b border-[#F1F8F1] pb-2">
                    <span>Kharif 2025: Soybean</span>
                    <span className="font-bold text-gray-800">Yield: 9.5 Quintals / Acre</span>
                  </div>
                  <div className="flex justify-between border-b border-[#F1F8F1] pb-2">
                    <span>Rabi 2024-25: Wheat</span>
                    <span className="font-bold text-gray-800">Yield: 22 Quintals / Acre</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBMODULE: AI SERVICES */}
        {activeTab === 'ai' && (
          <div className="space-y-6 animate-fade-in">
            {/* Disease Detection Upload */}
            <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <BrainCircuit className="text-[#236625]" size={18} /> AI Crop Disease Detection
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">Upload a clear photo of the leaves showing spots, rot, or insect damage to get an instant diagnosis and treatment advice.</p>
              
              <div className="flex flex-col md:flex-row items-center gap-6 pt-2">
                <label className="w-full md:w-60 h-32 rounded-2xl border-2 border-dashed border-[#D8EAD8] hover:border-[#236625] transition-colors flex flex-col items-center justify-center cursor-pointer p-4 text-center bg-gray-50/50">
                  <Upload className="text-[#236625] mb-2" size={24} />
                  <span className="text-3xs font-extrabold text-[#236625] uppercase">Select Crop Image</span>
                  <input type="file" accept="image/*" onChange={handleDiseaseUpload} className="hidden" />
                </label>

                {scanLoading && (
                  <div className="flex items-center gap-2 font-bold text-xs text-[#236625]">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Analyzing crop metrics...</span>
                  </div>
                )}

                {scanResult && (
                  <div className="flex-1 p-4 rounded-2xl bg-[#F1F8F1] border border-[#D8EAD8]/40 space-y-2 animate-scale-up">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-rose-600">{scanResult.disease}</span>
                      <span className="text-3xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold">Severity: {scanResult.severity}</span>
                    </div>
                    <p className="text-3xs text-gray-600 leading-relaxed font-semibold"><strong>Suggested Remedy:</strong> {scanResult.treatment}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Yield prediction calculator */}
            <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-gray-800">Yield & Revenue Predictor</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Crop Selection</label>
                    <select
                      value={yieldCrop}
                      onChange={(e) => setYieldCrop(e.target.value)}
                      className="w-full p-2 border border-[#D8EAD8] rounded-xl text-xs outline-none focus:border-[#236625] text-gray-700 font-bold"
                    >
                      <option>Wheat</option>
                      <option>Cotton</option>
                      <option>Soybean</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase">
                      <span>Land Area (Acres)</span>
                      <span className="text-[#236625]">{yieldAcres} Acres</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={yieldAcres}
                      onChange={(e) => setYieldAcres(parseInt(e.target.value))}
                      className="w-full accent-[#236625]"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#F1F8F1] rounded-2xl border border-[#D8EAD8]/40 space-y-3 flex flex-col justify-center">
                  <div className="flex justify-between text-xs font-semibold text-gray-600">
                    <span>Estimated Harvest Yield:</span>
                    <span className="font-bold text-gray-800">{yieldCrop === 'Wheat' ? yieldAcres * 22 : yieldCrop === 'Cotton' ? yieldAcres * 8 : yieldAcres * 10} Quintals</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-gray-600">
                    <span>Revenue Forecast:</span>
                    <span className="font-black text-[#236625]">₹{(yieldCrop === 'Wheat' ? yieldAcres * 22 * 2125 : yieldCrop === 'Cotton' ? yieldAcres * 8 * 6250 : yieldAcres * 10 * 4800).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather advisory */}
            <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-800">7-Day Weather & Crop Advisory</h3>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                {[
                  { day: 'Tue', temp: '34°', desc: 'Sunny', icon: Sun },
                  { day: 'Wed', temp: '33°', desc: 'Sunny', icon: Sun },
                  { day: 'Thu', temp: '31°', desc: 'Cloudy', icon: Cloud },
                  { day: 'Fri', temp: '29°', desc: 'Rain', icon: CloudRain },
                  { day: 'Sat', temp: '28°', desc: 'Rain', icon: CloudRain },
                  { day: 'Sun', temp: '30°', desc: 'Windy', icon: Wind },
                  { day: 'Mon', temp: '32°', desc: 'Partly Sunny', icon: Sun }
                ].map((w, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-center flex flex-col items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{w.day}</span>
                    <w.icon className="text-[#236625] my-2" size={16} />
                    <span className="text-xs font-black text-gray-700">{w.temp}</span>
                    <span className="text-[9px] text-gray-400 font-bold">{w.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBMODULE: GOVERNMENT SCHEMES */}
        {activeTab === 'schemes' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6">
              {MOCK_SCHEMES.map(scheme => (
                <div key={scheme.id} className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${scheme.status === 'Approved' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-amber-50 text-amber-700'}`}>
                      {scheme.status}
                    </span>
                    <h3 className="text-xs font-black text-gray-800 mt-3">{scheme.name}</h3>
                    <p className="text-3xs text-gray-500 leading-relaxed mt-2">{scheme.desc}</p>
                  </div>
                  <div className="border-t border-[#F1F8F1] pt-3 flex justify-between items-center">
                    <span className="text-2xs font-extrabold text-[#236625]">{scheme.benefit}</span>
                    <button className="text-2xs text-[#236625] font-black uppercase underline">Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMODULE: EQUIPMENT RENTAL */}
        {activeTab === 'rental' && (
          <div className="space-y-6 animate-fade-in">
            {/* Booking confirmation notice */}
            {bookedEquipment && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 font-bold flex gap-2 items-center">
                <CheckCircle2 size={16} />
                <span>Rented {bookedEquipment.name} successfully. Status: Booked. Expected delivery within 24 hours.</span>
              </div>
            )}

            <div className="grid md:grid-cols-4 gap-6">
              {rentals.map(equip => (
                <div key={equip.id} className="p-0 bg-white border border-[#D8EAD8] rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
                  <img src={equip.image} alt={equip.name} className="w-full h-32 object-cover" />
                  <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">{equip.name}</h4>
                      <p className="text-[#236625] font-black text-xs mt-1">{equip.charge}</p>
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <span className={`text-[10px] font-bold ${equip.status === 'Available' ? 'text-[#2E7D32]' : 'text-rose-600'}`}>
                        {equip.status}
                      </span>
                      <button
                        onClick={() => handleRentBooking(equip)}
                        className="btn-primary text-2xs py-1.5 uppercase font-black"
                        disabled={equip.status === 'Booked'}
                      >
                        Rent Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMODULE: LOYALTY PROGRAM */}
        {activeTab === 'loyalty' && (
          <div className="space-y-6 animate-fade-in">
            {/* Points board */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#236625] to-[#2F8F2F] text-white shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold">Current Loyalty Points</h3>
                  <p className="text-5xl font-black mt-2">{loyaltyPoints}</p>
                </div>
                <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider mt-4">Collect points with every fertilizer/seed order.</p>
              </div>

              <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold text-gray-800">Redeem Points for Vouchers</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {MOCK_REWARDS.map(rew => (
                    <div key={rew.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex flex-col justify-between items-center text-center">
                      <span className="text-2xs font-bold text-gray-700">{rew.title}</span>
                      <span className="text-3xs text-[#236625] font-extrabold my-2">{rew.points} Points</span>
                      <button
                        onClick={() => handleRedeemPoints(rew)}
                        className="btn-primary text-2xs py-1.5 w-full uppercase font-black"
                        disabled={loyaltyPoints < rew.points}
                      >
                        Redeem
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Redeemed Codes History */}
            {redeemedCodes.length > 0 && (
              <div className="table-wrapper">
                <div className="table-header">
                  <h3 className="text-sm font-bold text-gray-800">Redeemed Voucher Codes</h3>
                </div>
                <div className="p-4 space-y-2">
                  {redeemedCodes.map((code, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs font-bold">
                      <span className="text-gray-800">{code.title}</span>
                      <span className="text-emerald-700 bg-white px-3 py-1 rounded border border-emerald-200">{code.code}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBMODULE: SUPPORT CENTER */}
        {activeTab === 'support' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {/* Ticket Raiser Form */}
              <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold text-gray-800">Raise a Support Ticket</h3>
                <form onSubmit={handleCreateTicket} className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. Delayed Delivery / Fertilizer quality"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D8EAD8] rounded-xl text-xs outline-none focus:border-[#236625] text-gray-700 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Message</label>
                    <textarea
                      placeholder="Explain your problem in detail"
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D8EAD8] rounded-xl text-xs outline-none focus:border-[#236625] text-gray-700 font-bold h-24"
                    />
                  </div>
                  <button type="submit" className="btn-primary text-xs uppercase px-5 py-2.5">Submit Ticket</button>
                </form>
              </div>

              {/* Chat Support Side Widget */}
              <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Live Krushi Chat</h3>
                  <p className="text-2xs text-gray-500 mt-1">Chat live with our crop advisors and customer support representatives.</p>
                </div>
                <button
                  onClick={() => setChatOpen(true)}
                  className="btn-primary w-full text-xs uppercase py-2.5 font-bold"
                >
                  Start Live Chat
                </button>
              </div>
            </div>

            {/* Ticket status table */}
            <div className="table-wrapper">
              <div className="table-header">
                <h3 className="text-sm font-bold text-gray-800">Ticket Status</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                      <th className="p-4">Ticket ID</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(t => (
                      <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-4 font-bold text-gray-700">{t.id}</td>
                        <td className="p-4 text-gray-500">{t.subject}</td>
                        <td className="p-4 text-gray-600">{t.date}</td>
                        <td className="p-4 text-center">
                          <span className={`status-badge ${t.status === 'Open' ? 'bg-amber-50 text-amber-700' : 'bg-[#E8F5E9] text-[#2E7D32]'}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chat Overlay / Drawer */}
            {chatOpen && (
              <div className="fixed bottom-4 right-4 z-50 w-80 bg-white rounded-3xl shadow-2xl border border-[#D8EAD8] overflow-hidden flex flex-col h-96">
                <div className="bg-[#236625] text-white p-4 flex justify-between items-center">
                  <span className="text-xs font-bold">Krushi Live Chat</span>
                  <button onClick={() => setChatOpen(false)} className="text-white hover:text-gray-200">✕</button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto space-y-2 text-xs">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'farmer' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-2 rounded-xl max-w-[80%] ${msg.sender === 'farmer' ? 'bg-[#236625] text-white' : 'bg-gray-100 text-gray-800'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendChatMessage} className="p-3 border-t border-[#F1F8F1] flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-grow px-3 py-1.5 border border-[#D8EAD8] rounded-xl text-xs outline-none focus:border-[#236625]"
                  />
                  <button type="submit" className="p-1.5 bg-[#236625] text-white rounded-xl"><Send size={16} /></button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* SUBMODULE: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-800">Notifications & Alerts</h3>
              <div className="space-y-3">
                {notifications.map(notif => (
                  <div key={notif.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notif.type === 'weather' ? 'bg-amber-100 text-amber-700' :
                        notif.type === 'order' ? 'bg-[#E8F5E9] text-[#2E7D32]' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {notif.type === 'weather' ? <Wind size={16} /> : notif.type === 'order' ? <ShoppingCart size={16} /> : <Bell size={16} />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{notif.text}</p>
                        <span className="text-[10px] text-gray-400 font-bold block mt-1">{notif.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBMODULE: MY PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6">
              {/* KYC Status Details */}
              <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                  <ShieldCheck size={36} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">KYC Status: Verified</h3>
                  <p className="text-3xs text-gray-400 mt-1">Aadhaar details & Land Record Verified.</p>
                </div>
              </div>

              {/* Personal Info details */}
              <div className="p-6 bg-white border border-[#D8EAD8] rounded-3xl shadow-sm space-y-4 md:col-span-2">
                <h3 className="text-sm font-bold text-gray-800">Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D8EAD8] rounded-xl text-xs outline-none focus:border-[#236625] text-gray-700 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D8EAD8] rounded-xl text-xs outline-none focus:border-[#236625] text-gray-700 font-bold"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Address</label>
                    <input
                      type="text"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-[#D8EAD8] rounded-xl text-xs outline-none focus:border-[#236625] text-gray-700 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  )
}

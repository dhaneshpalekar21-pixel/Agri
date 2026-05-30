import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Check, X, Shield, Crown, Sparkles, AlertCircle, HelpCircle, ChevronRight, Eye, UserPlus } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function PremiumPlans() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [plans, setPlans] = useState([
    {
      id: 'plan-starter',
      name: 'Agri Starter',
      monthlyPrice: 499,
      yearlyPrice: 4990,
      duration: 'Monthly / Yearly',
      subscribers: 142,
      status: 'Active',
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-indigo-500',
      badgeColor: 'bg-indigo-500/10 text-indigo-500',
      features: ['2 Sub-users Included', 'Standard Invoice System', 'Basic Inventory Sync', 'Local Offline Storage API', 'Email Support']
    },
    {
      id: 'plan-pro',
      name: 'Agri Pro Plus',
      monthlyPrice: 1299,
      yearlyPrice: 12990,
      duration: 'Monthly / Yearly',
      subscribers: 894,
      status: 'Active',
      popular: true,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-500',
      badgeColor: 'bg-emerald-500/10 text-emerald-500',
      features: ['10 Sub-users Included', 'Multi-warehouse Sync', 'Smart AI Disease Diagnosis', 'Automated GST Invoicing', '24/7 Priority Support']
    },
    {
      id: 'plan-enterprise',
      name: 'Agri Enterprise',
      monthlyPrice: 3499,
      yearlyPrice: 34990,
      duration: 'Monthly / Yearly',
      subscribers: 215,
      status: 'Active',
      color: 'from-violet-500 to-purple-600',
      textColor: 'text-purple-500',
      badgeColor: 'bg-purple-500/10 text-purple-500',
      features: ['Unlimited Sub-users', 'Custom Domain Integration', 'Full IoT API Access', 'Custom AI Weather Forecasts', 'Dedicated Account Manager']
    }
  ])

  const [activeTab, setActiveTab] = useState('monthly') // monthly vs yearly
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  
  // Form State
  const [formName, setFormName] = useState('')
  const [formMonthlyPrice, setFormMonthlyPrice] = useState('')
  const [formYearlyPrice, setFormYearlyPrice] = useState('')
  const [formDuration, setFormDuration] = useState('Monthly / Yearly')
  const [formStatus, setFormStatus] = useState('Active')
  const [formFeatures, setFormFeatures] = useState('')

  const handleOpenCreate = () => {
    setEditingPlan(null)
    setFormName('')
    setFormMonthlyPrice('')
    setFormYearlyPrice('')
    setFormDuration('Monthly / Yearly')
    setFormStatus('Active')
    setFormFeatures('Sub-users, Invoicing, Advanced Analytics, Dedicated Support')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan)
    setFormName(plan.name)
    setFormMonthlyPrice(plan.monthlyPrice)
    setFormYearlyPrice(plan.yearlyPrice)
    setFormDuration(plan.duration)
    setFormStatus(plan.status)
    setFormFeatures(plan.features.join(', '))
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const featureArray = formFeatures.split(',').map(f => f.trim()).filter(Boolean)
    if (editingPlan) {
      // Edit
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? {
        ...p,
        name: formName,
        monthlyPrice: parseFloat(formMonthlyPrice) || 0,
        yearlyPrice: parseFloat(formYearlyPrice) || 0,
        duration: formDuration,
        status: formStatus,
        features: featureArray
      } : p))
    } else {
      // Create
      const newPlan = {
        id: `plan-${Date.now()}`,
        name: formName,
        monthlyPrice: parseFloat(formMonthlyPrice) || 0,
        yearlyPrice: parseFloat(formYearlyPrice) || 0,
        duration: formDuration,
        subscribers: 0,
        status: formStatus,
        color: 'from-amber-500 to-orange-600',
        textColor: 'text-amber-500',
        badgeColor: 'bg-amber-500/10 text-amber-500',
        features: featureArray
      }
      setPlans(prev => [...prev, newPlan])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Header wrapper */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Crown className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Premium Plans Management
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5">Configure multi-tenant premium tiers, pricing rates, and benefit availability matrices</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2.5">
          <button
            onClick={handleOpenCreate}
            className="btn-primary text-xs md:text-sm flex items-center gap-2 px-5 py-2.5 font-bold"
          >
            <Plus size={16} /> Create Premium Plan
          </button>
        </div>
      </div>

      {/* Toggle Tab */}
      <div className="flex justify-center">
        <div className={`p-1.5 rounded-xl flex gap-1 ${isDark ? 'bg-slate-900 border border-slate-850' : 'bg-slate-100'}`}>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
              activeTab === 'monthly'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-450 hover:text-slate-650 dark:hover:text-slate-200'
            }`}
          >
            Monthly Tiers
          </button>
          <button
            onClick={() => setActiveTab('yearly')}
            className={`px-5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'yearly'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-450 hover:text-slate-650 dark:hover:text-slate-200'
            }`}
          >
            Yearly Packages <span className="bg-rose-500 text-white text-[9px] md:text-[10px] px-2 py-0.5 rounded font-black whitespace-nowrap">SAVE 15%</span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
        {plans.map(plan => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-2xl overflow-hidden p-6 md:p-8 flex flex-col justify-between transition-all duration-300 border min-h-[400px] ${
              plan.popular
                ? 'ring-2 ring-emerald-500 shadow-xl'
                : isDark ? 'border-slate-800 bg-slate-900/40 backdrop-blur' : 'border-slate-200 bg-white'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles size={11} /> Popular
              </div>
            )}

            <div>
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase inline-flex items-center justify-center ${plan.badgeColor} whitespace-nowrap`}>
                  {plan.status}
                </span>
                <h3 className="text-xl font-extrabold mt-3 text-slate-800 dark:text-slate-100">{plan.name}</h3>
                <p className="text-slate-400 text-xs font-semibold mt-1">{plan.duration}</p>
              </div>

              <div className="my-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-800 dark:text-slate-100">
                  ₹{(activeTab === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice).toLocaleString('en-IN')}
                </span>
                <span className="text-xs md:text-sm text-slate-400 font-semibold">/{activeTab}</span>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs md:text-sm">
                    <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-650'}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleOpenEdit(plan)}
              className="w-full btn-secondary text-xs md:text-sm flex items-center justify-center gap-2 py-3 mt-auto font-bold"
            >
              <Edit2 size={14} /> Edit Pricing & Benefits
            </button>
          </motion.div>
        ))}
      </div>

      {/* Plan List Table */}
      <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
        <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Premium Subscription Matrix</h3>
            <p className="text-xs text-slate-400 mt-1">Total active multi-tenant accounts aggregated by tier levels</p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 w-fit">
            {plans.reduce((acc, p) => acc + p.subscribers, 0)} Total Subscriptions
          </span>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-450 uppercase`}>
                <th className="px-6 py-4 min-w-[200px]">Plan Name</th>
                <th className="px-6 py-4 min-w-[140px]">Monthly Price</th>
                <th className="px-6 py-4 min-w-[140px]">Yearly Price</th>
                <th className="px-6 py-4 min-w-[160px]">Billing Duration</th>
                <th className="px-6 py-4 text-center min-w-[160px]">Active Subscribers</th>
                <th className="px-6 py-4 min-w-[120px]">Status</th>
                <th className="px-6 py-4 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {plans.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                  <td className="px-6 py-3.5 font-bold flex items-center gap-3 text-slate-800 dark:text-slate-150">
                    <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${p.color} flex-shrink-0`} />
                    <span className="truncate">{p.name}</span>
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-slate-650 dark:text-slate-300">₹{p.monthlyPrice.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-650 dark:text-slate-300">₹{p.yearlyPrice.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3.5 text-slate-400 font-medium">{p.duration}</td>
                  <td className="px-6 py-3.5 text-center font-bold text-emerald-500">{p.subscribers}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap inline-flex items-center justify-center ${p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 text-slate-400 hover:text-emerald-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className={`rounded-xl border p-6 md:p-8 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} space-y-6`}>
        <div>
          <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100">Benefit Comparison Matrix</h3>
          <p className="text-xs text-slate-400 mt-1">Detailed overview of strict parameters configurations per tier</p>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs md:text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} font-bold`}>
                <th className="py-3 text-slate-450 min-w-[200px]">Feature Set</th>
                <th className="py-3 text-indigo-500 text-center min-w-[150px]">Agri Starter</th>
                <th className="py-3 text-emerald-500 text-center min-w-[150px]">Agri Pro Plus</th>
                <th className="py-3 text-purple-500 text-center min-w-[150px]">Agri Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="h-14">
                <td className="py-3.5 font-semibold text-slate-700 dark:text-slate-300">Max Shops</td>
                <td className="py-3.5 text-center">1 shop</td>
                <td className="py-3.5 text-center font-bold">5 shops</td>
                <td className="py-3.5 text-center font-extrabold text-emerald-500">Unlimited</td>
              </tr>
              <tr className="h-14">
                <td className="py-3.5 font-semibold text-slate-700 dark:text-slate-300">Monthly API Rate Limit</td>
                <td className="py-3.5 text-center">10,000 reqs</td>
                <td className="py-3.5 text-center">150,000 reqs</td>
                <td className="py-3.5 text-center font-bold text-emerald-500">Unlimited (No Limit)</td>
              </tr>
              <tr className="h-14">
                <td className="py-3.5 font-semibold text-slate-700 dark:text-slate-300">Smart AI Models</td>
                <td className="py-3.5 text-center text-slate-450">Basic Advisory</td>
                <td className="py-3.5 text-center font-semibold">Disease + advisory</td>
                <td className="py-3.5 text-center font-bold text-emerald-500">All AI services + Custom models</td>
              </tr>
              <tr className="h-14">
                <td className="py-3.5 font-semibold text-slate-700 dark:text-slate-300">Support Tier</td>
                <td className="py-3.5 text-center text-slate-450">Email</td>
                <td className="py-3.5 text-center font-semibold">Priority Email & Chat</td>
                <td className="py-3.5 text-center font-bold text-purple-500">Dedicated VIP SLA Manager</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Management Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-lg p-6 md:p-8 rounded-2xl border shadow-2xl z-10 ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-450 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>

              <h3 className="text-lg font-extrabold mb-6 flex items-center gap-2.5">
                <Shield className="text-emerald-500 w-5 h-5" />
                {editingPlan ? 'Edit Premium Plan Settings' : 'Create New Premium Plan'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Plan Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="input-field py-2.5 text-sm"
                    placeholder="e.g. Agri Diamond Core"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Monthly Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={formMonthlyPrice}
                      onChange={e => setFormMonthlyPrice(e.target.value)}
                      className="input-field py-2.5 text-sm"
                      placeholder="e.g. 1999"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Yearly Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={formYearlyPrice}
                      onChange={e => setFormYearlyPrice(e.target.value)}
                      className="input-field py-2.5 text-sm"
                      placeholder="e.g. 19990"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Billing Period Duration</label>
                  <select
                    value={formDuration}
                    onChange={e => setFormDuration(e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="Monthly Only">Monthly Only</option>
                    <option value="Yearly Only">Yearly Only</option>
                    <option value="Monthly / Yearly">Monthly & Yearly Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Plan Features (Comma-separated)</label>
                  <textarea
                    rows={3}
                    value={formFeatures}
                    onChange={e => setFormFeatures(e.target.value)}
                    className="input-field py-2.5 text-sm"
                    placeholder="GST, Invoicing, Priority Support"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 btn-secondary text-sm py-3 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary text-sm py-3 font-semibold"
                  >
                    Save Configuration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

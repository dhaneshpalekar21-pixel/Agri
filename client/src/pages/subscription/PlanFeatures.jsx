import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ToggleLeft, ToggleRight, Sparkles, Check, X, Shield, Plus, ListFilter, Sliders, Settings2 } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function PlanFeatures() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [features, setFeatures] = useState([
    { id: 'f-billing', name: 'Standard billing & invoicing', category: 'Core Billing', starter: true, pro: true, enterprise: true },
    { id: 'f-inventory', name: 'Inventory control & sync', category: 'Core Inventory', starter: true, pro: true, enterprise: true },
    { id: 'f-ai-doctor', name: 'AI Plant Disease Diagnosis', category: 'AI Services', starter: false, pro: true, enterprise: true },
    { id: 'f-crop-recommend', name: 'Crop Recommendation Model', category: 'AI Services', starter: false, pro: true, enterprise: true },
    { id: 'f-drone', name: 'Drone Sprayer Reservation Network', category: 'Integrations', starter: false, pro: false, enterprise: true },
    { id: 'f-iot', name: 'IoT Probe Soil Telemetry Feed', category: 'Integrations', starter: false, pro: false, enterprise: true },
    { id: 'f-custom-branding', name: 'Agribusiness Whitelabel Branding', category: 'Enterprise Customize', starter: false, pro: false, enterprise: true }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newFeatureName, setNewFeatureName] = useState('')
  const [newFeatureCategory, setNewFeatureCategory] = useState('Core Billing')
  const [assignStarter, setAssignStarter] = useState(false)
  const [assignPro, setAssignPro] = useState(true)
  const [assignEnterprise, setAssignEnterprise] = useState(true)

  const handleToggle = (id, plan) => {
    setFeatures(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          [plan]: !f[plan]
        }
      }
      return f
    }))
  }

  const handleAddFeature = (e) => {
    e.preventDefault()
    if (!newFeatureName.trim()) return
    const newF = {
      id: `f-${Date.now()}`,
      name: newFeatureName,
      category: newFeatureCategory,
      starter: assignStarter,
      pro: assignPro,
      enterprise: assignEnterprise
    }
    setFeatures(prev => [...prev, newF])
    setNewFeatureName('')
    setShowAddForm(false)
  }

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Settings2 className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Plan Features Management
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5">Bind features, restrict access scopes, and toggles parameters dynamically for tenants</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary text-xs md:text-sm flex items-center gap-2 px-5 py-2.5 font-bold"
          >
            <Plus size={16} /> Add Feature Parameter
          </button>
        </div>
      </div>

      {/* Feature Add Form Component */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`p-6 md:p-8 rounded-xl border space-y-4 ${
            isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'
          }`}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 mb-3">Register New System Permission Feature</h3>
          <form onSubmit={handleAddFeature} className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
            <div>
              <label className="block text-2xs font-bold text-slate-400 mb-2">Feature Name</label>
              <input
                type="text"
                required
                value={newFeatureName}
                onChange={e => setNewFeatureName(e.target.value)}
                className="input-field py-2.5 text-xs md:text-sm"
                placeholder="e.g. Export Marketing advisory"
              />
            </div>
            <div>
              <label className="block text-2xs font-bold text-slate-400 mb-2">Category Group</label>
              <select
                value={newFeatureCategory}
                onChange={e => setNewFeatureCategory(e.target.value)}
                className="input-field py-2.5 text-xs md:text-sm"
              >
                <option value="Core Billing">Core Billing</option>
                <option value="Core Inventory">Core Inventory</option>
                <option value="AI Services">AI Services</option>
                <option value="Integrations">Integrations</option>
                <option value="Enterprise Customize">Enterprise Customize</option>
              </select>
            </div>
            <div className="flex gap-5 py-2.5 md:justify-center items-center">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                <input type="checkbox" checked={assignStarter} onChange={e => setAssignStarter(e.target.checked)} className="accent-indigo-500 w-4 h-4" />
                <span>Starter</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                <input type="checkbox" checked={assignPro} onChange={e => setAssignPro(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                <span>Pro</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                <input type="checkbox" checked={assignEnterprise} onChange={e => setAssignEnterprise(e.target.checked)} className="accent-purple-500 w-4 h-4" />
                <span>Enterprise</span>
              </label>
            </div>
            <div>
              <button type="submit" className="w-full btn-primary text-xs md:text-sm py-2.5 font-bold">
                Register Feature
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Feature Availability Matrix */}
      <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
        <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Feature Matrix Grid</h3>
            <p className="text-xs text-slate-400 mt-1">Click toggles to directly adjust feature availability across client instances</p>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-450 uppercase`}>
                <th className="px-6 py-4 min-w-[250px]">Feature Parameter</th>
                <th className="px-6 py-4 min-w-[180px]">Category Group</th>
                <th className="px-6 py-4 text-center min-w-[140px]">Starter Tier</th>
                <th className="px-6 py-4 text-center min-w-[140px]">Pro Plus Tier</th>
                <th className="px-6 py-4 text-center min-w-[140px]">Enterprise Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {features.map(f => (
                <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                  <td className="px-6 py-3.5 font-bold flex items-center gap-2.5 text-slate-800 dark:text-slate-150">
                    {f.category === 'AI Services' && <Sparkles size={14} className="text-emerald-500 flex-shrink-0" />}
                    <span className="truncate">{f.name}</span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-455 font-medium">{f.category}</td>
                  
                  {/* Starter Toggle */}
                  <td className="px-6 py-3.5 text-center">
                    <button
                      onClick={() => handleToggle(f.id, 'starter')}
                      className={`text-xl transition-all inline-flex items-center justify-center p-1 rounded-lg ${f.starter ? 'text-emerald-500' : 'text-slate-400'}`}
                    >
                      {f.starter ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                  </td>

                  {/* Pro Toggle */}
                  <td className="px-6 py-3.5 text-center">
                    <button
                      onClick={() => handleToggle(f.id, 'pro')}
                      className={`text-xl transition-all inline-flex items-center justify-center p-1 rounded-lg ${f.pro ? 'text-emerald-500' : 'text-slate-400'}`}
                    >
                      {f.pro ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                  </td>

                  {/* Enterprise Toggle */}
                  <td className="px-6 py-3.5 text-center">
                    <button
                      onClick={() => handleToggle(f.id, 'enterprise')}
                      className={`text-xl transition-all inline-flex items-center justify-center p-1 rounded-lg ${f.enterprise ? 'text-emerald-500' : 'text-slate-400'}`}
                    >
                      {f.enterprise ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Usage & Metrics (Restrictions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
        <div className={`rounded-xl border p-6 md:p-8 space-y-4 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Strict Premium Limits Setup</h3>
          <div className="space-y-4 text-xs md:text-sm flex-1">
            <div className="flex justify-between items-center pb-3 border-b dark:border-slate-800">
              <span className="font-semibold text-slate-455">Starter SKU upload Limit</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Max 50 items</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b dark:border-slate-800">
              <span className="font-semibold text-slate-455">Pro SKU upload Limit</span>
              <span className="font-bold text-emerald-500">Max 5,000 items</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b dark:border-slate-800">
              <span className="font-semibold text-slate-455">Starter monthly SMS quota</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">250 SMS</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-455">Pro monthly SMS quota</span>
              <span className="font-bold text-emerald-500">2,500 SMS</span>
            </div>
          </div>
        </div>

        <div className={`rounded-xl border p-6 md:p-8 space-y-4 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Parameter Performance Insight</h3>
          <div className="space-y-4.5 flex-1">
            <div>
              <div className="flex justify-between text-2xs md:text-xs font-bold mb-2">
                <span>AI Crop Disease Diagnosis Trigger Hits</span>
                <span className="text-emerald-500">89% Utilized</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '89%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-2xs md:text-xs font-bold mb-2">
                <span>IoT Sensor Telemetry Sync Packets</span>
                <span className="text-blue-500">62% Utilized</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-2xs md:text-xs font-bold mb-2">
                <span>Direct Tele-Consult Expert Bookings</span>
                <span className="text-indigo-500">45% Utilized</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

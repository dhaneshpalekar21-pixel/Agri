import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  ShieldAlert, ShieldCheck, Save, RefreshCw, Key,
  ChevronDown, Sliders, Settings, Check, X, CheckSquare
} from 'lucide-react'

const INITIAL_GROUPS = [
  {
    moduleName: 'Platform Settings',
    description: 'Landing page editor, brand customized logo assets, and SEO parameters.',
    permissions: { create: true, read: true, update: true, delete: false }
  },
  {
    moduleName: 'Vendor Logistics',
    description: 'Vendor catalog approval, commissions payouts setups, and suspension logs.',
    permissions: { create: true, read: true, update: true, delete: true }
  },
  {
    moduleName: 'Financial Billing & Udhari',
    description: 'Credit balance logs, ledger modifications, invoice PDF generation, and refunds.',
    permissions: { create: false, read: true, update: false, delete: false }
  },
  {
    moduleName: 'Government Schemes API',
    description: 'Farmer subsidy qualifications verification and governmental payouts sync.',
    permissions: { create: true, read: true, update: true, delete: false }
  }
];

export default function PermissionSettings() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [groups, setGroups] = useState(INITIAL_GROUPS)
  const [selectedRole, setSelectedRole] = useState('Regional Hub Manager')
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    setActiveItem('Security & Access', 'Permission Settings')
  }, [setActiveItem])

  const handleCheckboxToggle = (moduleName, type) => {
    setGroups(groups.map(g => {
      if (g.moduleName === moduleName) {
        return {
          ...g,
          permissions: {
            ...g.permissions,
            [type]: !g.permissions[type]
          }
        }
      }
      return g
    }))
  }

  const handleSaveChanges = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-850 dark:text-slate-100 flex items-center gap-2">
            🔑 Permission Policy Matrix
          </h2>
          <p className="text-xs text-slate-500 font-medium">Fine-tune CRUD parameters, API overrides, regional limitations, and access rules per security group</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Save size={13} />
            <span>Save Policies Configuration</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in flex items-center gap-2">
          <ShieldCheck size={16} /> Matrix policy modifications deployed successfully to active sessions.
        </div>
      )}

      {/* Selector and explanation */}
      <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4`}>
        <div className="space-y-1">
          <span className="text-4xs font-extrabold uppercase text-slate-400">SELECT PRIVILEGE GROUP</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={`w-full text-2xs p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-300 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-800 focus:border-emerald-500'} transition-all`}
          >
            <option value="Regional Hub Manager">Regional Hub Manager</option>
            <option value="Financial Accountant">Financial Accountant</option>
            <option value="Field Service Agent">Field Service Agent</option>
          </select>
        </div>
        <p className="text-3xs text-slate-400 font-semibold leading-relaxed max-w-md">
          Modifying these values affects permissions for all users assigned to this role. Revocations take effect immediately on their next client HTTP call.
        </p>
      </div>

      {/* Collapsible Groups & Checkbox Table */}
      <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-4xs font-bold uppercase tracking-wider text-slate-400 ${theme === 'dark' ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <th className="p-4 w-[40%]">ERP Module & Scope Description</th>
                <th className="p-4 text-center">Create (POST)</th>
                <th className="p-4 text-center">Read (GET)</th>
                <th className="p-4 text-center">Update (PUT)</th>
                <th className="p-4 text-center">Delete (DELETE)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
              {groups.map((g, idx) => (
                <tr key={idx} className={theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50'}>
                  <td className="p-4">
                    <h4 className="font-extrabold text-slate-850 dark:text-slate-150">{g.moduleName}</h4>
                    <p className="text-3xs text-slate-400 mt-1 leading-relaxed font-semibold">{g.description}</p>
                  </td>
                  
                  {['create', 'read', 'update', 'delete'].map((type) => (
                    <td key={type} className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={g.permissions[type]}
                        onChange={() => handleCheckboxToggle(g.moduleName, type)}
                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer accent-emerald-600"
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
  )
}

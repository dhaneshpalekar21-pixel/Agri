import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Key, Shield, Plus, Edit, Trash2, ArrowUpRight,
  ChevronDown, Search, Award, CheckCircle, RefreshCw, X, Sliders
} from 'lucide-react'

const INITIAL_ROLES = [
  { name: 'Super Administrator', type: 'System', assignedUsers: 3, permissionsCount: 142, createdDate: '2026-01-10', status: 'Active', desc: 'Root level control with access to configurations, audit logs, and cloud data backup operations.' },
  { name: 'Regional Hub Manager', type: 'User Defined', assignedUsers: 14, permissionsCount: 88, createdDate: '2026-02-15', status: 'Active', desc: 'Manage warehouse logistics, orders dispatch, local inventory adjustments, and field agent rosters.' },
  { name: 'Financial Accountant', type: 'User Defined', assignedUsers: 5, permissionsCount: 52, createdDate: '2026-03-01', status: 'Active', desc: 'Review vendor sales reports, payout invoices, platform commission settings, and tax collections.' },
  { name: 'Field Service Agent', type: 'User Defined', assignedUsers: 120, permissionsCount: 14, createdDate: '2026-03-20', status: 'Active', desc: 'Log farmer complaints, coordinate physical inspections, update GPS coordinates, and crop logs.' }
];

export default function RoleManagement() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [roles, setRoles] = useState(INITIAL_ROLES)
  const [selectedRole, setSelectedRole] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  
  // New role form states
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newType, setNewType] = useState('User Defined')

  useEffect(() => {
    setActiveItem('Security & Access', 'Role Management')
  }, [setActiveItem])

  const handleAddRole = (e) => {
    e.preventDefault()
    if (!newName.trim()) return

    const newRole = {
      name: newName,
      type: newType,
      assignedUsers: 0,
      permissionsCount: 12,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      desc: newDesc
    }

    setRoles([...roles, newRole])
    setNewName('')
    setNewDesc('')
    setShowAddForm(false)
  }

  const handleDeleteRole = (name) => {
    setRoles(roles.filter(r => r.name !== name))
    if (selectedRole?.name === name) setSelectedRole(null)
  }

  const handleToggleStatus = (name) => {
    setRoles(roles.map(r => {
      if (r.name === name) {
        return { ...r, status: r.status === 'Active' ? 'Disabled' : 'Active' }
      }
      return r
    }))
    if (selectedRole?.name === name) {
      setSelectedRole(prev => ({ ...prev, status: prev.status === 'Active' ? 'Disabled' : 'Active' }))
    }
  }

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          🛡️ Role & Group Policy Management
        </h2>
        <p className="text-xs text-slate-500 font-medium">Define security roles, system authorization classifications, descriptions, and user mappings</p>
      </div>

      {/* KPI summaries */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Defined Roles", val: roles.length, icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Privileged Users Mapped", val: roles.reduce((acc, r)=>acc+r.assignedUsers, 0), icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "System Roles", val: roles.filter(r=>r.type==='System').length, icon: Key, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Active Access Control List", val: "100%", icon: Sliders, color: "text-amber-500", bg: "bg-amber-500/10" }
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex items-center gap-4`}>
            <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
              <item.icon size={18} />
            </div>
            <div>
              <p className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">{item.label}</p>
              <h4 className="text-base font-black text-slate-855 dark:text-slate-155 mt-0.5">{item.val}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Workspace splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table list */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex justify-between items-center gap-2`}>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full text-xs pl-9 pr-4 py-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-850 focus:border-emerald-500'} transition-all`}
              />
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={13} /> Add New Role
            </button>
          </div>

          {/* Create form modal-like drawer inside list */}
          <AnimatePresence>
            {showAddForm && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleAddRole}
                className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-3 text-xs`}
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-4xs font-bold text-slate-450 mb-1">ROLE NAME</label>
                    <input
                      type="text"
                      placeholder="e.g. Inspector Agent"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-800 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-200 focus:border-emerald-500'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-bold text-slate-450 mb-1">CLASSIFICATION TYPE</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-800 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-200 focus:border-emerald-500'}`}
                    >
                      <option value="User Defined">User Defined</option>
                      <option value="System">System Role</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-4xs font-bold text-slate-450 mb-1">DESCRIPTION</label>
                  <textarea
                    placeholder="Provide role description and department references..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows="2"
                    className={`w-full p-2.5 rounded-lg border outline-none resize-none ${theme === 'dark' ? 'bg-slate-955 border-slate-800 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-200 focus:border-emerald-500'}`}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1.5 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer">Create Role</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-4xs font-bold uppercase tracking-wider text-slate-400 ${theme === 'dark' ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <th className="p-3">Role Name</th>
                    <th className="p-3">Classification Type</th>
                    <th className="p-3">Assigned Accounts</th>
                    <th className="p-3">Permissions Count</th>
                    <th className="p-3">Created Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                  {filteredRoles.map((r, i) => (
                    <tr
                      key={i}
                      onClick={() => setSelectedRole(r)}
                      className={`cursor-pointer transition-colors ${selectedRole?.name === r.name ? (theme==='dark'?'bg-emerald-950/10':'bg-emerald-500/5') : (theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50')}`}
                    >
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{r.name}</td>
                      <td className="p-3 text-slate-500 font-semibold">{r.type}</td>
                      <td className="p-3 font-medium text-slate-400">{r.assignedUsers} Accounts</td>
                      <td className="p-3 font-medium text-slate-400">{r.permissionsCount} Policies</td>
                      <td className="p-3 text-slate-400 text-3xs font-semibold">{r.createdDate}</td>
                      <td className="p-3">
                        <span className={`px-1.5 py-0.5 rounded text-4xs font-extrabold ${r.status === 'Active' ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 bg-slate-500/10'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-right flex gap-1.5 justify-end" onClick={e=>e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleStatus(r.name)}
                          className="px-2 py-1 rounded text-4xs font-bold border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
                        >
                          Toggle
                        </button>
                        <button
                          onClick={() => handleDeleteRole(r.name)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right side: Role descriptions details */}
        <div>
          {selectedRole ? (
            <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}>
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-850 border-slate-150">
                <div>
                  <h4 className="font-extrabold">{selectedRole.name}</h4>
                  <span className="text-4xs font-bold text-slate-400">{selectedRole.type}</span>
                </div>
                <button onClick={() => setSelectedRole(null)} className="p-1 hover:bg-slate-150 dark:hover:bg-slate-855 rounded">
                  <X size={14} />
                </button>
              </div>

              <div>
                <span className="text-4xs font-extrabold uppercase text-slate-400">Scope Definition</span>
                <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-350">{selectedRole.desc}</p>
              </div>

              {/* simulated hierarchy */}
              <div className="space-y-2 border-t pt-3 dark:border-slate-850 border-slate-150">
                <span className="text-4xs font-extrabold uppercase text-slate-400">Role Authority Hierarchy</span>
                <div className="space-y-1.5 pl-2 relative border-l border-slate-200 dark:border-slate-800 ml-1 mt-1 text-3xs">
                  <div className="text-slate-400 font-bold">System Root Admin</div>
                  <div className="text-slate-800 dark:text-slate-200 font-extrabold flex items-center gap-1">
                    <ArrowUpRight size={10} className="text-emerald-500" /> {selectedRole.name}
                  </div>
                  <div className="text-slate-400">Department Operators</div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-4xs font-bold text-emerald-500 mt-4 flex items-center gap-1.5">
                <CheckCircle size={12} />
                <span>Group policy bindings are active and synchronized.</span>
              </div>
            </div>
          ) : (
            <div className={`p-6 border text-center text-slate-400 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} py-12 rounded-xl`}>
              Select a system role from the table console list to display role heirarchy trees, descriptions, and access control settings.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

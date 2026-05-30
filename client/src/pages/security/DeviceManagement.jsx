import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  Laptop, Smartphone, ShieldCheck, ShieldAlert, Trash2, Search,
  Eye, RefreshCw, X, Globe, User, Clock, AlertTriangle
} from 'lucide-react'

const INITIAL_DEVICES = [
  { id: "DEV-101", name: "Pune Office Admin PC", type: "Desktop", browser: "Chrome v124.0", ip: "192.168.1.45", lastActive: "Just now", status: "Active & Trusted" },
  { id: "DEV-102", name: "Amit iPhone 15", type: "Mobile", browser: "Safari Mobile", ip: "103.45.22.10", lastActive: "15 mins ago", status: "Active & Trusted" },
  { id: "DEV-103", name: "Unknown Linux client", type: "Server/Curl", browser: "Curl Client", ip: "185.220.101.4", lastActive: "2 hours ago", status: "Flagged & Blocked" }
];

export default function DeviceManagement() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [devices, setDevices] = useState(INITIAL_DEVICES)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    setActiveItem('Security & Access', 'Device Management')
  }, [setActiveItem])

  const handleRevokeDevice = (id) => {
    setDevices(devices.map(d => {
      if (d.id === id) {
        return { ...d, status: 'Revoked & Blocked' }
      }
      return d
    }))
    if (selectedDevice?.id === id) {
      setSelectedDevice(prev => ({ ...prev, status: 'Revoked & Blocked' }))
    }
  }

  const handleTrustDevice = (id) => {
    setDevices(devices.map(d => {
      if (d.id === id) {
        return { ...d, status: 'Active & Trusted' }
      }
      return d
    }))
    if (selectedDevice?.id === id) {
      setSelectedDevice(prev => ({ ...prev, status: 'Active & Trusted' }))
    }
  }

  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                          d.ip.includes(search) ||
                          d.browser.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || d.status.includes(statusFilter)
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Authorized Device Manager
        </h2>
        <p className="text-xs text-slate-500 font-medium">Verify login hardware agents, IP locations history, browser signatures, and revoke active tokens</p>
      </div>

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Connections", val: devices.filter(d=>d.status.includes('Active')).length, icon: Laptop, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Trusted Devices", val: devices.filter(d=>d.status.includes('Trusted')).length, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Blocked Hardware", val: devices.filter(d=>d.status.includes('Blocked')).length, icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "Revoked Logs", val: devices.filter(d=>d.status.includes('Revoked')).length, icon: ShieldAlert, color: "text-amber-500", bg: "bg-amber-500/10" }
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

      {/* Body grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device logs table */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex flex-col sm:flex-row gap-3 items-center justify-between`}>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search device name, browser, IP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full text-xs pl-9 pr-4 py-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-850 focus:border-emerald-500'} transition-all`}
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`text-3xs font-bold p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-855 text-slate-355' : 'bg-slate-50 border-slate-250 text-slate-655'}`}
            >
              <option value="All">All Hardware</option>
              <option value="Trusted">Trusted</option>
              <option value="Blocked">Blocked</option>
              <option value="Revoked">Revoked</option>
            </select>
          </div>

          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-4xs font-bold uppercase tracking-wider text-slate-400 ${theme === 'dark' ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <th className="p-3">Device Name</th>
                    <th className="p-3">Client Type</th>
                    <th className="p-3">Browser UA</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Last Active</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                  {filteredDevices.map(d => (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedDevice(d)}
                      className={`cursor-pointer transition-colors ${selectedDevice?.id === d.id ? (theme==='dark'?'bg-emerald-950/10':'bg-emerald-500/5') : (theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50')}`}
                    >
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{d.name}</td>
                      <td className="p-3 text-slate-500 font-semibold">{d.type}</td>
                      <td className="p-3 text-slate-400 font-medium">{d.browser}</td>
                      <td className="p-3 font-bold text-slate-700 dark:text-slate-300">{d.ip}</td>
                      <td className="p-3 text-slate-400 text-3xs font-semibold">{d.lastActive}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-4xs font-extrabold ${d.status.includes('Trusted') ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right side: details and actions */}
        <div>
          {selectedDevice ? (
            <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}>
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-850 border-slate-150">
                <div>
                  <h4 className="font-extrabold">{selectedDevice.name}</h4>
                  <span className="text-4xs font-bold text-slate-400">ID: {selectedDevice.id}</span>
                </div>
                <button onClick={() => setSelectedDevice(null)} className="p-1 hover:bg-slate-150 dark:hover:bg-slate-855 rounded">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2 text-2xs leading-relaxed">
                <div className="flex justify-between text-3xs font-semibold text-slate-450 border-b pb-2 dark:border-slate-850 border-slate-150">
                  <span>Operating Browser:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedDevice.browser}</span>
                </div>
                <div className="flex justify-between text-3xs font-semibold text-slate-455 border-b pb-2 dark:border-slate-855 border-slate-155">
                  <span>IP Address Location:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedDevice.ip}</span>
                </div>
                <div className="flex justify-between text-3xs font-semibold text-slate-455 border-b pb-2 dark:border-slate-855 border-slate-155">
                  <span>Device Authorization:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedDevice.status}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                {!selectedDevice.status.includes('Blocked') && !selectedDevice.status.includes('Revoked') ? (
                  <button
                    onClick={() => handleRevokeDevice(selectedDevice.id)}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-3xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} /> Revoke Access & Block Device
                  </button>
                ) : (
                  <button
                    onClick={() => handleTrustDevice(selectedDevice.id)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-3xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck size={12} /> Trust Hardware Device
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className={`p-6 border text-center text-slate-400 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} py-12 rounded-xl`}>
              Select an authorized device file from the list table to view OS signatures, IP audits, and execute emergency session revokes.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, AlertTriangle, Compass, CheckCircle, RefreshCw, Eye, Settings, HelpCircle } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function IotIntegrations() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [devices, setDevices] = useState([
    { id: 'iot-1', name: 'Nashik Soil Probe 01', type: 'Moisture Sensor', status: 'Online', lastActive: '2026-05-29 13:10', location: 'Nashik, MH', connectivity: 'LoRaWAN' },
    { id: 'iot-2', name: 'Satara Weather Station', type: 'Anemometer', status: 'Online', lastActive: '2026-05-29 13:05', location: 'Satara, MH', connectivity: 'Cellular 4G' },
    { id: 'iot-3', name: 'Guntur Soil Probe 04', type: 'N-P-K Sensor', status: 'Offline', lastActive: '2026-05-28 18:00', location: 'Guntur, AP', connectivity: 'LoRaWAN' },
    { id: 'iot-4', name: 'Hassan Smart Valve', type: 'Irrigation Controller', status: 'Online', lastActive: '2026-05-29 12:45', location: 'Hassan, KA', connectivity: 'Wi-Fi Mesh' }
  ])

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Cpu className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Smart Farming IoT Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium font-body">Monitor connected soil telemetry probes, smart valves, weather sensors and LoRaWAN gateways</p>
        </div>
      </div>

      {/* KPI Stats widgets (Equal Sizing) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Total Devices</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">{devices.length}</span>
            <span className="text-xs text-slate-400 font-semibold">Active Sensors</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Online Sensors</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-emerald-500">
              {devices.filter(d => d.status === 'Online').length}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Healthy Status</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Offline / Warning</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-rose-500">
              {devices.filter(d => d.status === 'Offline').length}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Requires Inspection</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Real-time alerts</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-amber-500">2 Active</span>
            <span className="text-[10px] md:text-xs text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded whitespace-nowrap">Warning</span>
          </div>
        </div>
      </div>

      {/* Connected Devices Table */}
      <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
        <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Telemetry Hardware Registry</h3>
            <p className="text-xs text-slate-400 mt-1">Direct controls and signal health monitoring for farm probes</p>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-450 uppercase`}>
                <th className="px-6 py-4 min-w-[200px]">Device Name</th>
                <th className="px-6 py-4 min-w-[160px]">Device Type</th>
                <th className="px-6 py-4 min-w-[140px]">Gateway Connectivity</th>
                <th className="px-6 py-4 min-w-[160px]">Last Heartbeat Active</th>
                <th className="px-6 py-4 min-w-[140px]">Location Region</th>
                <th className="px-6 py-4 min-w-[120px]">Status</th>
                <th className="px-6 py-4 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {devices.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                  <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150 truncate">{d.name}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-655 dark:text-slate-350">{d.type}</td>
                  <td className="px-6 py-3.5 text-slate-455 font-semibold">{d.connectivity}</td>
                  <td className="px-6 py-3.5 font-mono text-slate-400">{d.lastActive}</td>
                  <td className="px-6 py-3.5 text-slate-455 truncate">{d.location}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap inline-flex items-center justify-center ${
                      d.status === 'Online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500 animate-pulse'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button className="p-2 text-slate-450 hover:text-emerald-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

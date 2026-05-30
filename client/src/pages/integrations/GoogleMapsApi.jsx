import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Map, Settings, Compass, HelpCircle, Activity, ShieldAlert, Globe, CheckCircle } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function GoogleMapsApi() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [mapsKey, setMapsKey] = useState('AIzaSyA8bLd28F39ks8A')
  const [geocodeActive, setGeocodeActive] = useState(true)
  const [routeOptimization, setRouteOptimization] = useState(true)

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Map className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Google Maps API Integration
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Verify geolocation limits, configure optimal route metrics and trace pricing quotas</p>
        </div>
      </div>

      {/* Main Configurations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Settings Panel */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><Settings size={18} /> Credentials Setup</h3>
            <p className="text-xs text-slate-455 mt-1">Configure Maps API key parameters</p>
          </div>

          <form className="space-y-4 flex-1 mt-4">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Google Maps API Key</label>
              <input
                type="text"
                value={mapsKey}
                onChange={e => setMapsKey(e.target.value)}
                className="input-field py-2.5 text-sm font-mono"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                <input type="checkbox" checked={geocodeActive} onChange={e => setGeocodeActive(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                <span>Enable Geocoding (Address translation)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                <input type="checkbox" checked={routeOptimization} onChange={e => setRouteOptimization(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                <span>Enable Route Optimization API</span>
              </label>
            </div>

            <button type="button" className="w-full btn-primary text-xs md:text-sm py-3 font-semibold mt-4">
              Apply API Settings
            </button>
          </form>
        </div>

        {/* Maps quota tracker */}
        <div className={`lg:col-span-2 rounded-xl border p-6 md:p-8 space-y-6 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Monthly Usage Quotas</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium font-body">Pricing parameters usage compared to Google ₹16,600 free credit monthly threshold</p>
          </div>

          <div className="space-y-4.5">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Geocoding API Hits</span>
                <span className="text-emerald-500">₹4,200 / ₹16,600</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Directions API (Route Optimization)</span>
                <span className="text-blue-500">₹6,800 / ₹16,600</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '41%' }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

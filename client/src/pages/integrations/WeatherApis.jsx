import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CloudRain, Settings, Sparkles, AlertCircle, HelpCircle, CheckCircle, Eye } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function WeatherApis() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [weatherKey, setWeatherKey] = useState('owm_live_39dkf9302kd')
  const [provider, setProvider] = useState('OpenWeatherMap')

  const [forecasts] = useState([
    { region: 'Pune, MH', temp: '32°C', condition: 'Sunny', humidity: '55%', pressure: '1012 hPa' },
    { region: 'Guntur, AP', temp: '38°C', condition: 'Humid', humidity: '72%', pressure: '1008 hPa' },
    { region: 'Hassan, KA', temp: '28°C', condition: 'Cloudy', humidity: '64%', pressure: '1013 hPa' }
  ])

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <CloudRain className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Weather Advisory APIs
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Verify OpenWeatherMap API secret credentials, trace forecast requests, and monitor alerts</p>
        </div>
      </div>

      {/* Main Configurations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Settings Panel */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><Settings size={18} /> Credentials Setup</h3>
            <p className="text-xs text-slate-455 mt-1">Configure telemetry providers</p>
          </div>

          <form className="space-y-4 flex-1 mt-4">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Weather Provider</label>
              <select
                value={provider}
                onChange={e => setProvider(e.target.value)}
                className="input-field py-2.5 text-sm"
              >
                <option value="OpenWeatherMap">OpenWeatherMap API</option>
                <option value="AccuWeather">AccuWeather Premium</option>
                <option value="Climacell">Climacell Tomorrow.io</option>
              </select>
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">API Secret Access Key</label>
              <input
                type="text"
                value={weatherKey}
                onChange={e => setWeatherKey(e.target.value)}
                className="input-field py-2.5 text-sm font-mono"
              />
            </div>

            <button type="button" className="w-full btn-primary text-xs md:text-sm py-3 font-semibold mt-4">
              Apply Provider Config
            </button>
          </form>
        </div>

        {/* Region Weather Forecast Matrix */}
        <div className={`lg:col-span-2 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm flex flex-col justify-between`}>
          <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Active Regional Forecast Telemetry</h3>
            <p className="text-xs text-slate-400 mt-1">Verify live weather advisory translation status by district</p>
          </div>
          <div className="overflow-x-auto w-full flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-455 uppercase`}>
                  <th className="px-6 py-4">District Region</th>
                  <th className="px-6 py-4">Temperature</th>
                  <th className="px-6 py-4">Condition</th>
                  <th className="px-6 py-4">Humidity %</th>
                  <th className="px-6 py-4 text-right">Pressure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
                {forecasts.map(f => (
                  <tr key={f.region} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                    <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150">{f.region}</td>
                    <td className="px-6 py-3.5 font-bold text-slate-700 dark:text-slate-200">{f.temp}</td>
                    <td className="px-6 py-3.5 font-semibold text-emerald-500">{f.condition}</td>
                    <td className="px-6 py-3.5 text-slate-455">{f.humidity}</td>
                    <td className="px-6 py-3.5 text-right text-slate-400 font-mono">{f.pressure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, HelpCircle, CheckCircle, RefreshCw, Send, ArrowUpRight, TrendingUp } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function ApiMonitoring() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [testEndpoint, setTestEndpoint] = useState('/v1/weather/forecast')
  const [testing, setTesting] = useState(false)
  const [testResponse, setTestResponse] = useState(null)

  const [endpoints, setEndpoints] = useState([
    { path: '/v1/auth/login', requests: 42950, latency: '42ms', status: 'Online', uptime: '99.98%', lastCheck: '2026-05-29 13:30' },
    { path: '/v1/payouts/razorpay', requests: 12050, latency: '120ms', status: 'Online', uptime: '99.95%', lastCheck: '2026-05-29 13:28' },
    { path: '/v1/advisories/disease', requests: 8940, latency: '240ms', status: 'Online', uptime: '99.90%', lastCheck: '2026-05-29 13:25' },
    { path: '/v1/iot/telemetry', requests: 184500, latency: '15ms', status: 'Online', uptime: '100.00%', lastCheck: '2026-05-29 13:29' }
  ])

  const handleTestApi = (e) => {
    e.preventDefault()
    setTesting(true)
    setTestResponse(null)
    setTimeout(() => {
      setTesting(false)
      setTestResponse({
        status: 200,
        time: '85ms',
        payload: '{ "success": true, "message": "Weather advisory parsed. Temperature matching successful." }'
      })
    }, 1000)
  }

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Activity className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            API Performance Control Center
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Verify end-point latency aggregates, check API uptime, and test JSON responses</p>
        </div>
      </div>

      {/* KPI Stats widgets (Equal Sizing) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Global Success Rate</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-emerald-500">99.96%</span>
            <span className="text-xs text-slate-400 font-semibold">SLA Status</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Total API Request hits</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">2,50,429</span>
            <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
              <TrendingUp size={12} /> +14.2%
            </span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Average Latency</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">45 ms</span>
            <span className="text-xs text-slate-400 font-semibold">Under 150ms limit</span>
          </div>
        </div>

        <div className={`kpi-card p-6 md:p-8 flex flex-col justify-between ${isDark ? 'bg-slate-900/40 border-slate-850' : ''}`}>
          <span className="text-slate-400 text-2xs md:text-xs font-bold uppercase tracking-wider block">Failed Handshakes</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl md:text-3xl font-black text-rose-500">29 reqs</span>
            <span className="text-xs text-slate-400 font-semibold">Trace errors</span>
          </div>
        </div>
      </div>

      {/* Main Configurations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Left: API test tool */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><Activity size={18} /> API testing tool</h3>
            <p className="text-xs text-slate-455 mt-1">Execute live endpoint handshake check</p>
          </div>

          <form onSubmit={handleTestApi} className="space-y-4 flex-1 mt-4">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Endpoint URL</label>
              <select
                value={testEndpoint}
                onChange={e => setTestEndpoint(e.target.value)}
                className="input-field py-2.5 text-sm font-mono"
              >
                <option value="/v1/weather/forecast">GET /v1/weather/forecast</option>
                <option value="/v1/advisories/disease">POST /v1/advisories/disease</option>
                <option value="/v1/iot/telemetry">POST /v1/iot/telemetry</option>
              </select>
            </div>

            <button type="submit" className="w-full btn-primary text-xs md:text-sm py-3 font-semibold flex items-center justify-center gap-2 mt-4">
              <Send size={16} /> Execute Test Check
            </button>
          </form>

          {/* Test Output Panel */}
          {testing && <div className="mt-4 animate-pulse text-2xs text-slate-400">Executing handshake...</div>}
          {testResponse && (
            <div className="mt-4 p-4 border dark:border-slate-850 rounded-xl bg-slate-950 text-emerald-400 font-mono text-2xs space-y-2 max-w-full overflow-hidden">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span>STATUS: {testResponse.status}</span>
                <span>TIME: {testResponse.time}</span>
              </div>
              <pre className="whitespace-pre-wrap">{testResponse.payload}</pre>
            </div>
          )}
        </div>

        {/* Right: Endpoints Uptime list */}
        <div className={`lg:col-span-2 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm flex flex-col justify-between`}>
          <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Live Uptime Monitoring Register</h3>
            <p className="text-xs text-slate-400 mt-1">Uptime metrics and active checks tracker</p>
          </div>
          <div className="overflow-x-auto w-full flex-1">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-455 uppercase`}>
                  <th className="px-6 py-4">API Endpoint</th>
                  <th className="px-6 py-4 text-center">Requests Count</th>
                  <th className="px-6 py-4 text-center">Average Latency</th>
                  <th className="px-6 py-4 text-center">Uptime SLA</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
                {endpoints.map(ep => (
                  <tr key={ep.path} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                    <td className="px-6 py-3.5 font-mono text-slate-800 dark:text-slate-150 font-bold">{ep.path}</td>
                    <td className="px-6 py-3.5 text-center font-bold text-slate-500">{ep.requests.toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-center font-semibold text-emerald-500">{ep.latency}</td>
                    <td className="px-6 py-3.5 text-center font-mono font-semibold text-slate-455">{ep.uptime}</td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 inline-flex items-center justify-center whitespace-nowrap">
                        {ep.status}
                      </span>
                    </td>
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

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Settings, Sparkles, AlertCircle, HelpCircle, CheckCircle, BarChart2 } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function AiApis() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [provider, setProvider] = useState('Gemini')
  const [geminiKey, setGeminiKey] = useState('AIzaSyD9xKsL290F3k')

  const [models] = useState([
    { name: 'Gemini 1.5 Pro', type: 'Diagnosis / Chatbot', tokenCost: '0.075 / 1k', status: 'Online' },
    { name: 'Gemini 1.5 Flash', type: 'Advisory Engine', tokenCost: '0.015 / 1k', status: 'Online' },
    { name: 'Claude 3.5 Sonnet', type: 'Advisory Support Agent', tokenCost: '0.150 / 1k', status: 'Online' }
  ])

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Cpu className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            AI Service Providers API Configuration
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Verify Gemini or OpenAI token access points, audit token limits, and trace response times</p>
        </div>
      </div>

      {/* Main Configurations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Settings Panel */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><Settings size={18} /> Credentials Setup</h3>
            <p className="text-xs text-slate-455 mt-1">Configure active LLM backends</p>
          </div>

          <form className="space-y-4 flex-1 mt-4">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">AI Provider</label>
              <select
                value={provider}
                onChange={e => setProvider(e.target.value)}
                className="input-field py-2.5 text-sm"
              >
                <option value="Gemini">Google Gemini APIs</option>
                <option value="OpenAI">OpenAI GPT Engines</option>
                <option value="Anthropic">Anthropic Claude</option>
              </select>
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">API Secret Access Key</label>
              <input
                type="text"
                value={geminiKey}
                onChange={e => setGeminiKey(e.target.value)}
                className="input-field py-2.5 text-sm font-mono"
              />
            </div>

            <button type="button" className="w-full btn-primary text-xs md:text-sm py-3 font-semibold mt-4">
              Apply Provider Config
            </button>
          </form>
        </div>

        {/* Models list */}
        <div className={`lg:col-span-2 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm flex flex-col justify-between`}>
          <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Configured AI Subsystems Models</h3>
            <p className="text-xs text-slate-400 mt-1">Verify live operational status of agronomic intelligence models</p>
          </div>
          <div className="overflow-x-auto w-full flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-455 uppercase`}>
                  <th className="px-6 py-4">Model Name</th>
                  <th className="px-6 py-4">Primary ERP Task</th>
                  <th className="px-6 py-4">Estimated Token Cost (INR)</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
                {models.map(m => (
                  <tr key={m.name} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                    <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150">{m.name}</td>
                    <td className="px-6 py-3.5 text-slate-655 dark:text-slate-350">{m.type}</td>
                    <td className="px-6 py-3.5 text-slate-400 font-mono">{m.tokenCost}</td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 inline-flex items-center justify-center whitespace-nowrap">
                        {m.status}
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

import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  Cpu, Sparkles, TrendingUp, ShieldAlert, Zap,
  Activity, CheckCircle, RefreshCw, Download
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

const AI_ACCURACY_TREND = [
  { week: 'Wk 1', CropModel: 92, DiseaseModel: 88 },
  { week: 'Wk 2', CropModel: 94, DiseaseModel: 91 },
  { week: 'Wk 3', CropModel: 95, DiseaseModel: 89 },
  { week: 'Wk 4', CropModel: 96, DiseaseModel: 93 },
  { week: 'Wk 5', CropModel: 97, DiseaseModel: 94 }
];

const AI_MODELS = [
  { name: 'Crop Recommendation v4', inferenceTime: '110ms', accuracy: '97.2%', driftRate: '0.2%' },
  { name: 'Leaf Disease Segmentation', inferenceTime: '240ms', accuracy: '94.8%', driftRate: '0.8%' },
  { name: 'Weather Predictor LSTM', inferenceTime: '45ms', accuracy: '92.1%', driftRate: '1.2%' }
];

export default function AIReports() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [downloadMsg, setDownloadMsg] = useState(false)

  useEffect(() => {
    setActiveItem('Reports & Analytics', 'AI Reports')
  }, [setActiveItem])

  const triggerDownload = () => {
    setDownloadMsg(true)
    setTimeout(() => setDownloadMsg(false), 3000)

    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`AI Model Accuracy & Drift Report\nGenerated: ${new Date().toLocaleString()}`))
    link.setAttribute('download', `ai_model_performance_report.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-850 dark:text-slate-100 flex items-center gap-2">
            🤖 AI Engine Performance Reports
          </h2>
          <p className="text-xs text-slate-500 font-medium">Verify AI recommendation precision, inference latency, image diagnosis logs, and GPU loads</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={triggerDownload}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Download size={13} />
            <span>Export AI Telemetry</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {downloadMsg && (
        <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded-lg text-xs font-bold animate-fade-in">
          AI Telemetry dump completed. Check browser downloads.
        </div>
      )}

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "AI Requests Handled", val: "1.84 Lakh Queries", icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Overall Accuracy Ratio", val: "95.8% Rate", icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Inference Latency Avg", val: "124 ms Speed", icon: Zap, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "GPU Process Load", val: "74% Active", icon: Activity, color: "text-amber-500", bg: "bg-amber-500/10" }
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

      {/* Split workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Accuracy curve */}
        <div className={`lg:col-span-2 p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-slate-855 dark:text-slate-200">Model Validation Accuracy Trends</h4>
            <span className="text-4xs text-slate-400 font-bold uppercase">LSTM & CNN metrics</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={AI_ACCURACY_TREND}>
                <defs>
                  <linearGradient id="cropGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="diseaseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ background: theme === 'dark' ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 10 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="CropModel" stroke="#8b5cf6" fillOpacity={1} fill="url(#cropGrad)" strokeWidth={2} name="Crop Advisor Model" />
                <Area type="monotone" dataKey="DiseaseModel" stroke="#3b82f6" fillOpacity={1} fill="url(#diseaseGrad)" strokeWidth={2} name="Disease Detector CNN" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Models specification log list */}
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between`}>
          <div className="space-y-4">
            <span className="text-4xs font-extrabold uppercase text-slate-400">Deployed Models Status</span>
            <div className="space-y-3 mt-2">
              {AI_MODELS.map((model, idx) => (
                <div key={idx} className="p-3 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1.5">
                  <div className="flex justify-between items-start font-bold">
                    <span className="text-2xs text-slate-800 dark:text-slate-105">{model.name}</span>
                    <span className="text-4xs px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 uppercase">{model.accuracy} Acc</span>
                  </div>
                  <div className="flex justify-between text-4xs font-semibold text-slate-455">
                    <span>Latency: {model.inferenceTime}</span>
                    <span>Drift: {model.driftRate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded bg-purple-500/10 border border-purple-500/20 text-4xs font-bold text-purple-500 mt-4 flex items-center gap-1.5">
            <CheckCircle size={12} />
            <span>AI weights sync completed. Next calibration scheduled in 12h.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

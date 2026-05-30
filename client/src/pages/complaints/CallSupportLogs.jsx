import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Play, Pause,
  Search, Calendar, User, Clock, CheckCircle, Notebook, Save, X, Volume2
} from 'lucide-react'

const INITIAL_CALLS = [
  {
    id: "CALL-701",
    callerName: "Rajendra Pawar",
    phoneNumber: "+91-9842104921",
    agent: "Amit Shinde",
    duration: "4m 32s",
    status: "Resolved",
    timestamp: "2026-05-28 10:15 AM",
    type: "Incoming",
    recordingUrl: "https://example.com/audio/701.mp3",
    notes: "Farmer had query about organic certifications for fruit crops. Forwarded him catalog download links."
  },
  {
    id: "CALL-702",
    callerName: "Karan Johar (Vendor Co)",
    phoneNumber: "+91-8832104320",
    agent: "Sunita Pawar",
    duration: "2m 15s",
    status: "Pending Action",
    timestamp: "2026-05-28 09:45 AM",
    type: "Outgoing",
    recordingUrl: "https://example.com/audio/702.mp3",
    notes: "Followed up with vendor regarding signature validation on dispatch agreement."
  },
  {
    id: "CALL-703",
    callerName: "Mahadev Rao",
    phoneNumber: "+91-7210984321",
    agent: "Sunita Pawar",
    duration: "0m 00s",
    status: "Missed Call",
    timestamp: "2026-05-28 08:30 AM",
    type: "Missed",
    recordingUrl: null,
    notes: "Customer hung up before agent picked up. Needs callback."
  }
];

export default function CallSupportLogs() {
  const { setActiveItem, theme } = useSuperAdminStore()

  useEffect(() => {
    setActiveItem('Complaint & Support', 'Call Support Logs')
  }, [setActiveItem])

  const [calls, setCalls] = useState(INITIAL_CALLS)
  const [selectedCall, setSelectedCall] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [isPlaying, setIsPlaying] = useState(false)
  const [notesText, setNotesText] = useState('')
  const [audioProgress, setAudioProgress] = useState(25)

  const filteredCalls = calls.filter(c => {
    const matchesSearch = c.callerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.phoneNumber.includes(searchQuery) ||
                          c.agent.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'All' || c.type === typeFilter
    return matchesSearch && matchesType
  })

  useEffect(() => {
    if (selectedCall) {
      setNotesText(selectedCall.notes || '')
      setIsPlaying(false)
      setAudioProgress(25)
    }
  }, [selectedCall])

  const handleUpdateNotes = () => {
    if (!selectedCall) return
    const updated = calls.map(c => {
      if (c.id === selectedCall.id) {
        return { ...c, notes: notesText }
      }
      return c
    })
    setCalls(updated)
    setSelectedCall(updated.find(c => c.id === selectedCall.id))
  }

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Voice Call Support Logs
        </h2>
        <p className="text-xs text-slate-500 font-medium">Audit recorded conversations, track support staff phone responses, and verify call stats</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Calls Logged", val: calls.length, icon: Phone, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Incoming Calls", val: calls.filter(c=>c.type==='Incoming').length, icon: PhoneIncoming, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Outgoing Callbacks", val: calls.filter(c=>c.type==='Outgoing').length, icon: PhoneOutgoing, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Unanswered / Missed", val: calls.filter(c=>c.type==='Missed').length, icon: PhoneMissed, color: "text-rose-500", bg: "bg-rose-500/10" }
        ].map((kpi, i) => (
          <div key={i} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex items-center gap-4`}>
            <div className={`p-3 rounded-lg ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={18} />
            </div>
            <div>
              <p className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">{kpi.label}</p>
              <h4 className="text-base font-black text-slate-850 dark:text-slate-150 mt-0.5">{kpi.val}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Search & Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex flex-col sm:flex-row gap-3 items-center justify-between`}>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search caller name, agent, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full text-xs pl-9 pr-4 py-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-850 focus:border-emerald-500'} transition-all`}
              />
            </div>

            <div className="flex gap-1">
              {['All', 'Incoming', 'Outgoing', 'Missed'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-4xs font-bold transition-all border ${typeFilter === t ? 'bg-emerald-600 border-emerald-600 text-white' : 'dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-4xs font-bold uppercase tracking-wider text-slate-400 ${theme === 'dark' ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <th className="p-3">Call ID</th>
                    <th className="p-3">Caller Name</th>
                    <th className="p-3">Phone Number</th>
                    <th className="p-3">Support Agent</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Call Status</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                  {filteredCalls.map(c => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCall(c)}
                      className={`cursor-pointer transition-colors ${selectedCall?.id === c.id ? (theme==='dark'?'bg-emerald-950/10':'bg-emerald-500/5') : (theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50')}`}
                    >
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{c.id}</td>
                      <td className="p-3 font-medium flex items-center gap-1.5">
                        {c.type === 'Incoming' && <PhoneIncoming size={12} className="text-emerald-500" />}
                        {c.type === 'Outgoing' && <PhoneOutgoing size={12} className="text-sky-500" />}
                        {c.type === 'Missed' && <PhoneMissed size={12} className="text-rose-500" />}
                        <span>{c.callerName}</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-500">{c.phoneNumber}</td>
                      <td className="p-3 text-slate-400 font-semibold">{c.agent}</td>
                      <td className="p-3 text-slate-655 dark:text-slate-355 font-bold">{c.duration}</td>
                      <td className="p-3">
                        <span className={`px-1.5 py-0.5 rounded text-4xs font-extrabold ${c.status === 'Resolved' ? 'text-emerald-500 bg-emerald-500/10' : c.status === 'Missed Call' ? 'text-rose-500 bg-rose-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-3xs font-semibold">{c.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Playback and notes */}
        <div>
          {selectedCall ? (
            <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}>
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-850 border-slate-150">
                <div>
                  <h4 className="font-extrabold">{selectedCall.id}</h4>
                  <p className="text-3xs text-slate-400 font-semibold">{selectedCall.callerName} ({selectedCall.type})</p>
                </div>
                <button onClick={() => setSelectedCall(null)} className="p-1 hover:bg-slate-150 dark:hover:bg-slate-855 rounded">
                  <X size={14} />
                </button>
              </div>

              {/* Call recording player controls */}
              {selectedCall.recordingUrl ? (
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 border-slate-200 space-y-3">
                  <span className="text-4xs font-extrabold uppercase text-slate-400 flex items-center gap-1"><Volume2 size={11} /> RECORDING PLAYBACK</span>
                  <div className="flex items-center gap-3">
                    <button onClick={handleTogglePlay} className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center cursor-pointer">
                      {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                    </button>
                    <div className="flex-1 space-y-1">
                      {/* Audio wave simulator */}
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded overflow-hidden flex items-end justify-between p-0.5">
                        {[15, 45, 25, 75, 10, 65, 35, 90, 20, 55, 45, 80, 15, 60, 25, 45, 15, 70, 25].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-sm transition-all duration-150 ${isPlaying && i % 3 === 0 ? "h-[85%] bg-emerald-500" : "h-[45%] bg-slate-400"}`}
                            style={{ height: isPlaying ? `${Math.floor(Math.random() * 85) + 15}%` : undefined }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-4xs font-bold text-slate-400">
                        <span>0:45</span>
                        <span>{selectedCall.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-center font-bold text-3xs">
                  No recording available for missed calls.
                </div>
              )}

              {/* Call support agent notes */}
              <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 border-slate-200">
                <div className="flex justify-between items-center text-4xs font-extrabold text-slate-400">
                  <span className="flex items-center gap-1"><Notebook size={10} /> AGENT CALL MEMO</span>
                  <button onClick={handleUpdateNotes} className="text-emerald-500 hover:text-emerald-400 flex items-center gap-0.5 cursor-pointer">
                    <Save size={10} /> Save Note
                  </button>
                </div>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Record summary notes of support discussion..."
                  rows="3"
                  className="w-full bg-transparent border-none outline-none text-2xs p-0 resize-none font-medium text-slate-600 dark:text-slate-350 placeholder-slate-400"
                />
              </div>

              {/* Detail fields */}
              <div className="space-y-2 pt-2 border-t dark:border-slate-850 border-slate-150">
                <div className="flex justify-between text-3xs font-semibold text-slate-400">
                  <span>Support Agent:</span>
                  <span className="text-slate-700 dark:text-slate-200">{selectedCall.agent}</span>
                </div>
                <div className="flex justify-between text-3xs font-semibold text-slate-400">
                  <span>Phone Line:</span>
                  <span className="text-slate-700 dark:text-slate-200">{selectedCall.phoneNumber}</span>
                </div>
                <div className="flex justify-between text-3xs font-semibold text-slate-400">
                  <span>Call timestamp:</span>
                  <span className="text-slate-700 dark:text-slate-200">{selectedCall.timestamp}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-6 border text-center text-slate-400 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} py-12 rounded-xl`}>
              Select a call support log file to activate playback controls, edit agent logs, and review conversation memo details.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

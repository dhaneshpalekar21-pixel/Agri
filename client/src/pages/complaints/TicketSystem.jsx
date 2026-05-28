import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  Search, Filter, Send, MessageSquare, AlertTriangle, ShieldCheck, CheckCircle,
  Clock, ArrowUpRight, Plus, RefreshCw, X, ShieldAlert, UserPlus, FileText
} from 'lucide-react'

const INITIAL_TICKETS = [
  {
    id: "ERP-TKT-991",
    userOrVendor: "Ramesh Seeds Corp",
    issueType: "Catalog Setup Error",
    assignedStaff: "Pranali Joshi",
    priority: "High",
    status: "Open",
    createdTimestamp: "2026-05-28 09:30 AM",
    slaHoursRemaining: 4,
    conversation: [
      { sender: "Ramesh Seeds Corp", msg: "When uploading CSV file for tomato seed catalog, the system crashes with a validation error on column 4." }
    ]
  },
  {
    id: "ERP-TKT-992",
    userOrVendor: "Vitthal Kale (Farmer)",
    issueType: "SMS Service Alert",
    assignedStaff: "Amit Shinde",
    priority: "Medium",
    status: "Pending",
    createdTimestamp: "2026-05-27 15:45 PM",
    slaHoursRemaining: 18,
    conversation: [
      { sender: "Vitthal Kale (Farmer)", msg: "Not receiving sowed crop disease confirmation alerts on SMS. Checked my mobile, signal is fine." }
    ]
  },
  {
    id: "ERP-TKT-993",
    userOrVendor: "Maharashtra Warehouse Hub",
    issueType: "Hardware Integration (IoT)",
    assignedStaff: "Sanjay Deshmukh",
    priority: "Critical",
    status: "Escalated",
    createdTimestamp: "2026-05-27 11:20 AM",
    slaHoursRemaining: 0,
    conversation: [
      { sender: "Warehouse Hub", msg: "Gate weight scale Bluetooth sensor not syncing weights to the dispatch app. Trucks are piling up outside." }
    ]
  },
  {
    id: "ERP-TKT-994",
    userOrVendor: "Rajesh Agro Agency",
    issueType: "GST Invoicing Issue",
    assignedStaff: "Sunita Pawar",
    priority: "Low",
    status: "Closed",
    createdTimestamp: "2026-05-26 14:00 PM",
    slaHoursRemaining: 48,
    conversation: [
      { sender: "Rajesh Agro Agency", msg: "Tax invoice PDF displays incorrect CGST breakdown." },
      { sender: "Sunita Pawar", msg: "Updated tax module mapping. Regenerated invoice successfully.", time: "2026-05-26 16:30" }
    ]
  }
];

const SUPPORT_STAFF_LIST = ["Amit Shinde", "Sunita Pawar", "Pranali Joshi", "Sanjay Deshmukh"];

export default function TicketSystem() {
  const { setActiveItem, theme } = useSuperAdminStore()

  useEffect(() => {
    setActiveItem('Complaint & Support', 'Ticket System')
  }, [setActiveItem])

  const [tickets, setTickets] = useState(INITIAL_TICKETS)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [replyMessage, setReplyMessage] = useState('')

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.userOrVendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.issueType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleSendReply = () => {
    if (!replyMessage.trim()) return
    const newMsg = {
      sender: "Super Admin",
      msg: replyMessage,
      time: new Date().toLocaleString()
    }
    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          conversation: [...t.conversation, newMsg]
        }
      }
      return t
    })
    setTickets(updated)
    setSelectedTicket(updated.find(t => t.id === selectedTicket.id))
    setReplyMessage('')
  }

  const handleEscalate = (id) => {
    const updated = tickets.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: 'Escalated',
          priority: 'Critical',
          slaHoursRemaining: 0
        }
      }
      return t
    })
    setTickets(updated)
    if (selectedTicket?.id === id) {
      setSelectedTicket(updated.find(t => t.id === id))
    }
  }

  const handleReassign = (id, staff) => {
    const updated = tickets.map(t => {
      if (t.id === id) {
        return { ...t, assignedStaff: staff }
      }
      return t
    })
    setTickets(updated)
    if (selectedTicket?.id === id) {
      setSelectedTicket(updated.find(t => t.id === id))
    }
  }

  const handleCloseTicket = (id) => {
    const updated = tickets.map(t => {
      if (t.id === id) {
        return { ...t, status: 'Closed' }
      }
      return t
    })
    setTickets(updated)
    if (selectedTicket?.id === id) {
      setSelectedTicket(updated.find(t => t.id === id))
    }
  }

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
      case 'High': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'Medium': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Closed': return 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
      case 'Escalated': return 'bg-rose-500/15 text-rose-500 border border-rose-500/30 font-bold'
      case 'Pending': return 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
      default: return 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          🎫 Platform Helpdesk & SLA Monitor
        </h2>
        <p className="text-xs text-slate-500 font-medium">Global ticket desk resolving website issues, API key sync faults, and hardware telemetry glitches</p>
      </div>

      {/* KPI counters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "All Tickets", val: tickets.length, color: "text-slate-500 bg-slate-500/10" },
          { label: "Open", val: tickets.filter(t=>t.status==='Open').length, color: "text-blue-500 bg-blue-500/10" },
          { label: "Pending", val: tickets.filter(t=>t.status==='Pending').length, color: "text-amber-500 bg-amber-500/10" },
          { label: "Escalated", val: tickets.filter(t=>t.status==='Escalated').length, color: "text-rose-500 bg-rose-500/10" },
          { label: "Closed", val: tickets.filter(t=>t.status==='Closed').length, color: "text-emerald-500 bg-emerald-500/10" }
        ].map((t, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm text-center`}>
            <p className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">{t.label}</p>
            <h4 className={`text-lg font-black mt-1 ${t.color.split(' ')[0]}`}>{t.val}</h4>
          </div>
        ))}
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Ticket Lists */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex flex-col sm:flex-row gap-3 items-center justify-between`}>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search ticket ID, customer/vendor, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full text-xs pl-9 pr-4 py-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-850 focus:border-emerald-500'} transition-all`}
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`text-3xs font-bold p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-350' : 'bg-slate-50 border-slate-250 text-slate-650'}`}
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Escalated">Escalated</option>
                <option value="Closed">Closed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className={`text-3xs font-bold p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-855 text-slate-355' : 'bg-slate-50 border-slate-255 text-slate-655'}`}
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-4xs font-bold uppercase tracking-wider text-slate-400 ${theme === 'dark' ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <th className="p-3">Ticket ID</th>
                    <th className="p-3">User/Vendor</th>
                    <th className="p-3">Issue Category</th>
                    <th className="p-3">Assigned Staff</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Created Timestamp</th>
                    <th className="p-3">SLA Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                  {filteredTickets.map(t => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`cursor-pointer transition-colors ${selectedTicket?.id === t.id ? (theme==='dark'?'bg-emerald-950/10':'bg-emerald-500/5') : (theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50')}`}
                    >
                      <td className="p-3 font-bold text-slate-850 dark:text-slate-150">{t.id}</td>
                      <td className="p-3 font-medium">{t.userOrVendor}</td>
                      <td className="p-3 text-slate-500 font-semibold">{t.issueType}</td>
                      <td className="p-3 font-medium text-slate-400">{t.assignedStaff}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-4xs font-extrabold border uppercase ${getPriorityStyle(t.priority)}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-3xs font-semibold">{t.createdTimestamp}</td>
                      <td className="p-3">
                        {t.status === 'Closed' ? (
                          <span className="text-4xs text-emerald-500 font-bold uppercase">SLA Met</span>
                        ) : t.slaHoursRemaining === 0 ? (
                          <span className="text-4xs text-rose-500 font-extrabold uppercase animate-pulse">SLA Breached</span>
                        ) : (
                          <span className="text-4xs text-amber-500 font-bold uppercase">{t.slaHoursRemaining}h left</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Conversation Desk */}
        <div>
          {selectedTicket ? (
            <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}>
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-850 border-slate-150">
                <div>
                  <h4 className="font-extrabold">{selectedTicket.id}</h4>
                  <p className="text-3xs text-slate-400 font-semibold">{selectedTicket.userOrVendor}</p>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="p-1 hover:bg-slate-150 dark:hover:bg-slate-855 rounded">
                  <X size={14} />
                </button>
              </div>

              {/* SLA Indicators */}
              <div className="flex gap-2">
                <div className="flex-1 p-2.5 rounded-lg border dark:border-slate-850 border-slate-200 text-center">
                  <span className="text-4xs font-bold text-slate-400 uppercase">SLA REMAINING</span>
                  <p className={`text-xs font-black mt-0.5 ${selectedTicket.slaHoursRemaining === 0 ? "text-rose-500" : "text-amber-500"}`}>
                    {selectedTicket.slaHoursRemaining === 0 ? "SLA Breached!" : `${selectedTicket.slaHoursRemaining} Hours`}
                  </p>
                </div>
                <div className="flex-1 p-2.5 rounded-lg border dark:border-slate-850 border-slate-200 text-center">
                  <span className="text-4xs font-bold text-slate-400 uppercase">PRIORITY</span>
                  <p className="text-xs font-black mt-0.5 text-slate-700 dark:text-slate-200">
                    {selectedTicket.priority}
                  </p>
                </div>
              </div>

              {/* Assignment Selector */}
              <div className="space-y-1">
                <span className="text-4xs font-extrabold uppercase text-slate-400 flex items-center gap-1"><UserPlus size={10} /> Assign Support Agent</span>
                <select
                  value={selectedTicket.assignedStaff}
                  onChange={(e) => handleReassign(selectedTicket.id, e.target.value)}
                  className={`w-full text-2xs p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-300 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-800 focus:border-emerald-500'} transition-all`}
                >
                  {SUPPORT_STAFF_LIST.map(staff => (
                    <option key={staff} value={staff}>{staff}</option>
                  ))}
                </select>
              </div>

              {/* Conversation Chat thread */}
              <div className="space-y-2 border-t pt-3 dark:border-slate-850 border-slate-150">
                <span className="text-4xs font-extrabold uppercase text-slate-400">Message Stream</span>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedTicket.conversation.map((c, i) => (
                    <div key={i} className={`p-2 rounded-lg text-2xs ${c.sender === 'Super Admin' ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : 'bg-slate-150 dark:bg-slate-850'}`}>
                      <div className="flex justify-between items-center text-4xs font-bold text-slate-400">
                        <span>{c.sender}</span>
                        <span>{c.time || selectedTicket.createdTimestamp}</span>
                      </div>
                      <p className="mt-1 text-slate-750 dark:text-slate-250 font-medium">{c.msg}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-1.5 mt-2">
                  <input
                    type="text"
                    placeholder="Type client response..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                    className={`flex-1 text-2xs p-1.5 rounded border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 focus:border-emerald-500'}`}
                  />
                  <button onClick={handleSendReply} className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer">
                    <Send size={11} />
                  </button>
                </div>
              </div>

              {/* Resolution Controls */}
              <div className="flex gap-2">
                {selectedTicket.status !== 'Closed' && (
                  <button
                    onClick={() => handleCloseTicket(selectedTicket.id)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-3xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <CheckCircle size={12} /> Resolve & Close
                  </button>
                )}

                {selectedTicket.status !== 'Escalated' && selectedTicket.status !== 'Closed' && (
                  <button
                    onClick={() => handleEscalate(selectedTicket.id)}
                    className="flex-1 py-2 bg-rose-600/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded font-bold text-3xs flex items-center justify-center gap-1 border border-rose-500/20 transition-all cursor-pointer"
                  >
                    <ShieldAlert size={12} /> Escalate Ticket
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className={`p-6 border text-center text-slate-400 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} py-12 rounded-xl`}>
              Select a helpdesk support ticket to see SLA clocks, reassign staff delegates, and manage escalation settings.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

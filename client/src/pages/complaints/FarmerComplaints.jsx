import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, Send, ShieldAlert, CheckCircle, Clock, AlertTriangle, Eye, ArrowUpRight,
  TrendingUp, MessageSquare, Plus, FileText, CornerDownRight, RefreshCw, X, ArrowLeft
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock initial farmer complaints data
const INITIAL_COMPLAINTS = [
  {
    id: "FMR-TKT-101",
    farmerName: "Ramesh Patil",
    category: "Seeds Quality",
    priority: "High",
    assignedStaff: "Amit Shinde",
    status: "Open",
    createdDate: "2026-05-27",
    description: "The Bt Cotton seeds purchased last week have very low germination rate. We sowed them 5 days ago but only 10% sowed signs of growth.",
    attachmentUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400",
    timeline: [
      { date: "2026-05-27 10:00 AM", event: "Ticket created by Ramesh Patil" },
      { date: "2026-05-27 02:00 PM", event: "Assigned to Amit Shinde" }
    ],
    replies: [
      { sender: "System", message: "Your ticket has been logged and assigned. Our support agent will reach out shortly.", time: "2026-05-27 10:00 AM" }
    ]
  },
  {
    id: "FMR-TKT-102",
    farmerName: "Sanjay Deshmukh",
    category: "Payment Issue",
    priority: "Critical",
    assignedStaff: "Sunita Pawar",
    status: "Escalated",
    createdDate: "2026-05-26",
    description: "Paid ₹12,500 for urea via UPI, amount debited from bank account but order status still shows 'Payment Pending'. Please resolve immediately.",
    attachmentUrl: null,
    timeline: [
      { date: "2026-05-26 09:15 AM", event: "Ticket created by Sanjay Deshmukh" },
      { date: "2026-05-26 11:30 AM", event: "Assigned to Sunita Pawar" },
      { date: "2026-05-26 04:00 PM", event: "Escalated to Billing Manager by Sunita Pawar" }
    ],
    replies: [
      { sender: "Sunita Pawar", message: "Hello Sanjay, we have verified that the payment is held in the gateway. We are initiating verification with the bank.", time: "2026-05-26 11:45 AM" }
    ]
  },
  {
    id: "FMR-TKT-103",
    farmerName: "Vitthal Kale",
    category: "Delivery Delay",
    priority: "Medium",
    assignedStaff: "Amit Shinde",
    status: "Pending",
    createdDate: "2026-05-25",
    description: "Drip irrigation pipe set was scheduled to deliver on 24th May. It is still showing in transit. Water is urgently needed for crops.",
    attachmentUrl: null,
    timeline: [
      { date: "2026-05-25 08:00 AM", event: "Ticket created by Vitthal Kale" },
      { date: "2026-05-25 10:00 AM", event: "Assigned to Amit Shinde" }
    ],
    replies: []
  },
  {
    id: "FMR-TKT-104",
    farmerName: "Ananda Rao",
    category: "App/Technical Support",
    priority: "Low",
    assignedStaff: "Pranali Joshi",
    status: "Resolved",
    createdDate: "2026-05-24",
    description: "Unable to download soil report PDF from the mobile app dashboard. It gives an error code 403.",
    attachmentUrl: null,
    timeline: [
      { date: "2026-05-24 11:00 AM", event: "Ticket created by Ananda Rao" },
      { date: "2026-05-24 12:30 PM", event: "Assigned to Pranali Joshi" },
      { date: "2026-05-24 03:00 PM", event: "Issue resolved. PDF permission updated." }
    ],
    replies: [
      { sender: "Pranali Joshi", message: "Hi Ananda, we have fixed the server permission issue. Please update your app and try downloading it now.", time: "2026-05-24 02:45 PM" },
      { sender: "Ananda Rao", message: "Yes, it works now. Thank you so much for the quick help!", time: "2026-05-24 03:00 PM" }
    ]
  }
];

const ANALYTICS_DATA = [
  { name: 'Mon', Tickets: 12 },
  { name: 'Tue', Tickets: 19 },
  { name: 'Wed', Tickets: 15 },
  { name: 'Thu', Tickets: 25 },
  { name: 'Fri', Tickets: 22 },
  { name: 'Sat', Tickets: 10 },
  { name: 'Sun', Tickets: 8 }
];

export default function FarmerComplaints() {
  const { setActiveItem, theme } = useSuperAdminStore()
  
  useEffect(() => {
    // Keep sidebar item selection in sync
    setActiveItem('Complaint & Support', 'Farmer Complaints')
  }, [setActiveItem])

  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [replyText, setReplyText] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)

  // Filter complaints
  const filteredComplaints = complaints.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ticket.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleSendReply = () => {
    if (!replyText.trim()) return

    const newReply = {
      sender: "Super Admin",
      message: replyText,
      time: new Date().toLocaleString()
    }

    const updatedComplaints = complaints.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        return {
          ...ticket,
          replies: [...ticket.replies, newReply],
          timeline: [...ticket.timeline, { date: new Date().toLocaleString(), event: `Reply added by Admin: "${replyText.substring(0, 30)}..."` }]
        }
      }
      return ticket
    })

    setComplaints(updatedComplaints)
    setSelectedTicket(updatedComplaints.find(t => t.id === selectedTicket.id))
    setReplyText('')
  }

  const handleEscalate = (id) => {
    const updated = complaints.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: 'Escalated',
          priority: 'Critical',
          timeline: [...t.timeline, { date: new Date().toLocaleString(), event: "Ticket escalated to senior management" }]
        }
      }
      return t
    })
    setComplaints(updated)
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket(updated.find(t => t.id === id))
    }
  }

  const handleResolve = (id) => {
    const updated = complaints.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: 'Resolved',
          timeline: [...t.timeline, { date: new Date().toLocaleString(), event: "Ticket marked as Resolved by Admin" }]
        }
      }
      return t
    })
    setComplaints(updated)
    if (selectedTicket && selectedTicket.id === id) {
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
      case 'Resolved': return 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
      case 'Escalated': return 'bg-rose-500/15 text-rose-500 border border-rose-500/30 animate-pulse'
      case 'Pending': return 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
      default: return 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
            🌾 Farmer Support Dashboard
          </h2>
          <p className="text-xs text-slate-500 font-medium">Manage crop feedback, quality issue logs, and support queries from farmer profiles</p>
        </div>
      </div>

      {/* Mini KPIs & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Farmer Tickets", value: complaints.length, icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Active Escalations", value: complaints.filter(c => c.status === 'Escalated').length, icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10" },
          { title: "Avg Resolution Rate", value: "92.4%", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { title: "Open Issues", value: complaints.filter(c => c.status === 'Open' || c.status === 'Pending').length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" }
        ].map((kpi, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex items-center gap-4`}>
            <div className={`p-3 rounded-lg ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={20} />
            </div>
            <div>
              <p className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">{kpi.title}</p>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle: Ticket List & Search */}
        <div className={`lg:col-span-2 space-y-4`}>
          {/* Controls Panel */}
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between`}>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search ticket ID, farmer, issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full text-xs pl-9 pr-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500'} outline-none transition-all`}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`text-3xs font-semibold p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Escalated">Escalated</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className={`text-3xs font-semibold p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-855 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Table / List */}
          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-4xs font-extrabold uppercase tracking-wider text-slate-400 ${theme === 'dark' ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <th className="p-3">Ticket ID</th>
                    <th className="p-3">Farmer Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Assigned Staff</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400 font-medium">No complaints matched the criteria.</td>
                    </tr>
                  ) : (
                    filteredComplaints.map((ticket) => (
                      <tr
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? (theme === 'dark' ? 'bg-emerald-950/10' : 'bg-emerald-500/5') : (theme === 'dark' ? 'hover:bg-slate-850' : 'hover:bg-slate-50')}`}
                      >
                        <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{ticket.id}</td>
                        <td className="p-3 font-medium">{ticket.farmerName}</td>
                        <td className="p-3 text-slate-500">{ticket.category}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-4xs font-extrabold border uppercase ${getPriorityStyle(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 font-medium">{ticket.assignedStaff}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-md text-4xs font-extrabold uppercase ${getStatusStyle(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicket(ticket);
                            }}
                            className={`p-1.5 rounded-lg border transition-all ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}
                          >
                            <Eye size={12} className="text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Pane: Selected Ticket Detail & Actions */}
        <div className="space-y-4">
          {selectedTicket ? (
            <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between space-y-4`}>
              {/* Card Header */}
              <div className="flex justify-between items-start border-b pb-3 dark:border-slate-850 border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedTicket.id}</h4>
                    <span className={`px-1.5 py-0.5 rounded-full text-4xs font-black border uppercase ${getPriorityStyle(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <p className="text-3xs text-slate-400 font-semibold mt-1">Submitted by: {selectedTicket.farmerName} on {selectedTicket.createdDate}</p>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className={`p-1 rounded-lg border ${theme === 'dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                  <X size={14} className="text-slate-400" />
                </button>
              </div>

              {/* Ticket Body Details */}
              <div className="space-y-3 text-2xs leading-relaxed">
                <div>
                  <h5 className="font-extrabold text-slate-400 uppercase text-3xs">Complaint details</h5>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedTicket.description}</p>
                </div>

                {/* Attachment Section */}
                {selectedTicket.attachmentUrl && (
                  <div>
                    <h5 className="font-extrabold text-slate-400 uppercase text-3xs">Attachment (Image)</h5>
                    <div className="mt-1.5 relative group cursor-pointer" onClick={() => setShowImageModal(true)}>
                      <img
                        src={selectedTicket.attachmentUrl}
                        alt="attachment"
                        className="rounded-lg max-h-32 object-cover border border-slate-250 dark:border-slate-800 w-full"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white rounded-lg transition-opacity duration-200">
                        <span className="text-3xs font-bold uppercase">Click to view</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Controls */}
                <div className="flex gap-2 pt-2">
                  {selectedTicket.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolve(selectedTicket.id)}
                      className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-3xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                      <CheckCircle size={12} />
                      <span>Resolve</span>
                    </button>
                  )}

                  {selectedTicket.status !== 'Escalated' && selectedTicket.status !== 'Resolved' && (
                    <button
                      onClick={() => handleEscalate(selectedTicket.id)}
                      className="flex-1 py-1.5 px-3 bg-rose-600/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg font-bold text-3xs flex items-center justify-center gap-1.5 border border-rose-500/20 transition-all cursor-pointer"
                    >
                      <ShieldAlert size={12} />
                      <span>Escalate</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Thread reply system */}
              <div className="border-t pt-4 dark:border-slate-850 border-slate-150 space-y-3">
                <h5 className="font-extrabold text-slate-400 uppercase text-3xs">Conversation History</h5>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                  {selectedTicket.replies.length === 0 ? (
                    <p className="text-4xs text-slate-400 italic">No message logs present.</p>
                  ) : (
                    selectedTicket.replies.map((reply, i) => (
                      <div key={i} className={`p-2 rounded-lg text-2xs ${reply.sender === 'Super Admin' ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : 'bg-slate-100 dark:bg-slate-850'}`}>
                        <div className="flex justify-between items-center text-4xs font-bold text-slate-400">
                          <span>{reply.sender}</span>
                          <span>{reply.time}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 mt-1 font-medium">{reply.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Reply box */}
                <div className="flex items-center gap-1.5 mt-2">
                  <input
                    type="text"
                    placeholder="Type official reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                    className={`flex-1 text-2xs px-2.5 py-1.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-800 focus:border-emerald-500'} transition-all`}
                  />
                  <button
                    onClick={handleSendReply}
                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-colors"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>

              {/* Ticket History timeline */}
              <div className="border-t pt-4 dark:border-slate-850 border-slate-150 space-y-2">
                <h5 className="font-extrabold text-slate-400 uppercase text-3xs">Ticket Timeline</h5>
                <div className="space-y-2 relative border-l border-slate-200 dark:border-slate-800 pl-3 ml-1">
                  {selectedTicket.timeline.map((item, idx) => (
                    <div key={idx} className="relative text-3xs text-slate-500">
                      <span className="absolute -left-4 top-1 w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      <span className="font-semibold">{item.date}: </span>
                      <span>{item.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm text-center py-12 text-slate-400 font-medium`}>
              Select a ticket from the table list to open conversation logs, escalation controls, and reply widgets.
            </div>
          )}
        </div>
      </div>

      {/* Image Modal Preview */}
      <AnimatePresence>
        {showImageModal && selectedTicket?.attachmentUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl p-2"
            >
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors z-10 cursor-pointer"
              >
                <X size={16} />
              </button>
              <img
                src={selectedTicket.attachmentUrl}
                alt="Enlarged Attachment"
                className="w-full h-auto object-contain max-h-[70vh] rounded-lg"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

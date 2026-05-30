import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, Send, MessageSquare, AlertTriangle, ShieldCheck, IndianRupee,
  Briefcase, Truck, ArrowRight, Notebook, HelpCircle, Save, CheckCircle, RefreshCw, X
} from 'lucide-react'

const INITIAL_VENDOR_COMPLAINTS = [
  {
    id: "VND-TKT-201",
    vendorName: "Krishna Fertilisers",
    issueType: "Payment Dispute",
    description: "Commission invoice #INV-4921 has a calculation error. The system charged 12% instead of the agreed promotional 10% rate.",
    amountDisputed: "₹4,200",
    priority: "High",
    status: "Open",
    adminNotes: "Checking agreement sign-off docs from March 2026.",
    timeline: [
      { time: "2026-05-26 14:00", text: "Ticket filed by Krishna Fertilisers" }
    ],
    responses: [
      { sender: "System", text: "Dispute ticket generated. Assigned to Finance Desk.", time: "2026-05-26 14:00" }
    ]
  },
  {
    id: "VND-TKT-202",
    vendorName: "Maratha Seeds Ltd",
    issueType: "Product Complaints",
    description: "A customer returned 5 packets of maize seeds claiming packaging seal damage. We want confirmation of shipping hub liability.",
    amountDisputed: "₹1,850",
    priority: "Medium",
    status: "Pending Admin Action",
    adminNotes: "Needs verification from the Kolhapur Hub dispatcher log.",
    timeline: [
      { time: "2026-05-25 11:30", text: "Product complaint logged" },
      { time: "2026-05-25 13:00", text: "Assigned to Hub Supervisor" }
    ],
    responses: [
      { sender: "Maratha Seeds Ltd", text: "Please expedite, our batch audits are this Friday.", time: "2026-05-25 15:45" }
    ]
  },
  {
    id: "VND-TKT-203",
    vendorName: "Om logistics & Agro",
    issueType: "Delivery Dispute",
    description: "Shipment batch #S-2201 rejected at Satara warehouse due to unloading delay. Our truck spent 6 hours idle. Demanding detention fees.",
    amountDisputed: "₹8,500",
    priority: "Critical",
    status: "Escalated",
    adminNotes: "Contacted Satara hub manager; waiting for CCTV timestamps.",
    timeline: [
      { time: "2026-05-24 09:00", text: "Dispute submitted by Logistics partner" },
      { time: "2026-05-24 16:30", text: "Escalated to Logistics Manager by Admin" }
    ],
    responses: [
      { sender: "Admin Staff", text: "We are reviewing warehouse logs to check gate entry timings.", time: "2026-05-24 14:30" }
    ]
  }
];

export default function VendorComplaints() {
  const { setActiveItem, theme } = useSuperAdminStore()

  useEffect(() => {
    setActiveItem('Complaint & Support', 'Vendor Complaints')
  }, [setActiveItem])

  const [complaints, setComplaints] = useState(INITIAL_VENDOR_COMPLAINTS)
  const [selectedDispute, setSelectedDispute] = useState(null)
  const [search, setSearch] = useState('')
  const [statusSelect, setStatusSelect] = useState('All')
  const [responseMsg, setResponseMsg] = useState('')
  const [notesInput, setNotesInput] = useState('')

  const filteredDisputes = complaints.filter(d => {
    const matchesText = d.id.toLowerCase().includes(search.toLowerCase()) ||
                        d.vendorName.toLowerCase().includes(search.toLowerCase()) ||
                        d.issueType.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusSelect === 'All' || d.status === statusSelect
    return matchesText && matchesStatus
  })

  const handleUpdateNotes = () => {
    if (!selectedDispute) return
    const updated = complaints.map(d => {
      if (d.id === selectedDispute.id) {
        return { ...d, adminNotes: notesInput }
      }
      return d
    })
    setComplaints(updated)
    setSelectedDispute(updated.find(d => d.id === selectedDispute.id))
  }

  const handleSendResponse = () => {
    if (!responseMsg.trim()) return
    const newResp = {
      sender: "ERP Admin Support",
      text: responseMsg,
      time: new Date().toLocaleString()
    }
    const updated = complaints.map(d => {
      if (d.id === selectedDispute.id) {
        return {
          ...d,
          responses: [...d.responses, newResp],
          timeline: [...d.timeline, { time: new Date().toLocaleString(), text: `Admin sent response: "${responseMsg.substring(0,25)}..."` }]
        }
      }
      return d
    })
    setComplaints(updated)
    setSelectedDispute(updated.find(d => d.id === selectedDispute.id))
    setResponseMsg('')
  }

  const handleCloseDispute = (id) => {
    const updated = complaints.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: 'Resolved & Closed',
          timeline: [...d.timeline, { time: new Date().toLocaleString(), text: "Dispute resolved and ticket closed." }]
        }
      }
      return d
    })
    setComplaints(updated)
    if (selectedDispute?.id === id) {
      setSelectedDispute(updated.find(d => d.id === id))
    }
  }

  useEffect(() => {
    if (selectedDispute) {
      setNotesInput(selectedDispute.adminNotes || '')
    }
  }, [selectedDispute])

  const getPriorityColor = (p) => {
    if (p === 'Critical') return 'text-rose-500 bg-rose-500/10'
    if (p === 'High') return 'text-amber-500 bg-amber-500/10'
    return 'text-blue-500 bg-blue-500/10'
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Vendor Complaints & Disputes
        </h2>
        <p className="text-xs text-slate-500 font-medium">Resolve commission issues, bulk inventory rejections, and logistical disputes</p>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Vendor Disputes", val: complaints.filter(c=>c.status!=='Resolved & Closed').length, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Payment Issues Logged", val: complaints.filter(c=>c.issueType==='Payment Dispute').length, icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Product Integrity Claims", val: complaints.filter(c=>c.issueType==='Product Complaints').length, icon: Briefcase, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Logistics Penalties", val: "₹14,500 Total", icon: Truck, color: "text-indigo-500", bg: "bg-indigo-500/10" }
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex items-center gap-4`}>
            <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
              <item.icon size={18} />
            </div>
            <div>
              <p className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">{item.label}</p>
              <h4 className="text-base font-black text-slate-850 dark:text-slate-150 mt-0.5">{item.val}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Ticket Console */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex flex-col sm:flex-row gap-3 items-center justify-between`}>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search vendor name, issue category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full text-xs pl-9 pr-4 py-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-850 focus:border-emerald-500'} transition-all`}
              />
            </div>
            
            <select
              value={statusSelect}
              onChange={(e) => setStatusSelect(e.target.value)}
              className={`text-3xs font-bold p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-350' : 'bg-slate-50 border-slate-250 text-slate-650'}`}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Pending Admin Action">Pending Action</option>
              <option value="Escalated">Escalated</option>
              <option value="Resolved & Closed">Resolved & Closed</option>
            </select>
          </div>

          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-4xs font-bold uppercase tracking-wider text-slate-400 ${theme === 'dark' ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <th className="p-3">Ticket ID</th>
                    <th className="p-3">Vendor</th>
                    <th className="p-3">Issue Category</th>
                    <th className="p-3">Disputed Amount</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                  {filteredDisputes.map(d => (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedDispute(d)}
                      className={`cursor-pointer transition-colors ${selectedDispute?.id === d.id ? (theme==='dark'?'bg-emerald-950/10':'bg-emerald-500/5') : (theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50')}`}
                    >
                      <td className="p-3 font-bold text-slate-850 dark:text-slate-150">{d.id}</td>
                      <td className="p-3 font-medium">{d.vendorName}</td>
                      <td className="p-3 font-medium text-slate-500">{d.issueType}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-extrabold">{d.amountDisputed}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-4xs font-extrabold ${getPriorityColor(d.priority)}`}>
                          {d.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-1.5 py-0.5 rounded text-4xs font-extrabold ${d.status === 'Resolved & Closed' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
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

        {/* Right Side: Interaction Drawer */}
        <div>
          {selectedDispute ? (
            <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}>
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-850 border-slate-150">
                <div>
                  <h4 className="font-extrabold">{selectedDispute.id}</h4>
                  <p className="text-3xs text-slate-400 font-semibold">{selectedDispute.vendorName}</p>
                </div>
                <button onClick={() => setSelectedDispute(null)} className="p-1 hover:bg-slate-150 dark:hover:bg-slate-850 rounded">
                  <X size={14} />
                </button>
              </div>

              <div>
                <span className="text-4xs font-extrabold uppercase text-slate-400">Issue description</span>
                <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-350">{selectedDispute.description}</p>
              </div>

              {/* Private Admin Notes */}
              <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 border-slate-200">
                <div className="flex justify-between items-center text-4xs font-extrabold text-slate-400">
                  <span className="flex items-center gap-1"><Notebook size={10} /> PRIVATE ADMIN NOTES</span>
                  <button onClick={handleUpdateNotes} className="text-emerald-500 hover:text-emerald-400 flex items-center gap-0.5 cursor-pointer">
                    <Save size={10} /> Update
                  </button>
                </div>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Type notes for admin review only..."
                  rows="2"
                  className="w-full bg-transparent border-none outline-none text-2xs p-0 resize-none font-medium text-slate-600 dark:text-slate-300 placeholder-slate-400"
                />
              </div>

              {/* Message Stream */}
              <div className="space-y-2 border-t pt-3 dark:border-slate-850 border-slate-150">
                <span className="text-4xs font-extrabold uppercase text-slate-400">Vendor Messages</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedDispute.responses.map((r, i) => (
                    <div key={i} className={`p-2 rounded ${r.sender === 'System' ? 'bg-slate-100 dark:bg-slate-850 text-slate-400' : 'bg-blue-500/5 dark:bg-blue-500/10'}`}>
                      <div className="flex justify-between items-center text-4xs font-bold text-slate-400">
                        <span>{r.sender}</span>
                        <span>{r.time}</span>
                      </div>
                      <p className="mt-0.5 text-2xs text-slate-750 dark:text-slate-250 font-medium">{r.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-1.5 mt-2">
                  <input
                    type="text"
                    placeholder="Reply to vendor..."
                    value={responseMsg}
                    onChange={(e) => setResponseMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendResponse()}
                    className={`flex-1 text-2xs p-1.5 rounded border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 focus:border-emerald-500'}`}
                  />
                  <button onClick={handleSendResponse} className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer">
                    <Send size={11} />
                  </button>
                </div>
              </div>

              {/* Action Controls */}
              {selectedDispute.status !== 'Resolved & Closed' && (
                <button
                  onClick={() => handleCloseDispute(selectedDispute.id)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-3xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle size={12} /> Mark as Resolved & Close Dispute
                </button>
              )}
            </div>
          ) : (
            <div className={`p-6 rounded-xl border text-center text-slate-400 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} py-12`}>
              Select a dispute ticket to view payment information, write private logs, and send responses directly to the vendor account.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

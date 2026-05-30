import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, Send, MapPin, Truck, AlertOctagon, CheckCircle,
  Eye, RefreshCw, X, ArrowRight, User, Calendar, Image as ImageIcon
} from 'lucide-react'

const INITIAL_DELIVERIES = [
  {
    id: "DLV-TKT-301",
    customerName: "Balasaheb Vikhe",
    partner: "Express Agro Logistics",
    issue: "Damaged Product (Fertilizer Bag)",
    details: "The urea bag was torn from the side upon delivery. Fertilizer spilled inside the delivery van. The farmer rejected the package.",
    status: "Open",
    priority: "High",
    trackerState: "Rejected & Returned",
    images: ["https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400"],
    timeline: [
      { date: "2026-05-27", event: "Package arrived at Satara Hub" },
      { date: "2026-05-27", event: "Delivered & Rejected due to leakage" }
    ],
    responses: []
  },
  {
    id: "DLV-TKT-302",
    customerName: "Mahadev Rao",
    partner: "Sahyadri Delivery Cargo",
    issue: "Delay Complaint",
    details: "Delivery is delayed by 3 days. Soil testing kit was promised on Monday. Crops are ready for planting, delay is causing panic.",
    status: "Pending Investigation",
    priority: "Critical",
    trackerState: "In Transit (Delayed)",
    images: [],
    timeline: [
      { date: "2026-05-25", event: "Manifested and Dispatched" },
      { date: "2026-05-26", event: "Delayed at Pune bypass" }
    ],
    responses: [
      { sender: "Sahyadri Cargo", text: "Driver got stuck due to local road blockage. Expected delivery by tomorrow noon.", time: "2026-05-27 10:30" }
    ]
  }
];

export default function DeliveryComplaints() {
  const { setActiveItem, theme } = useSuperAdminStore()

  useEffect(() => {
    setActiveItem('Complaint & Support', 'Delivery Complaints')
  }, [setActiveItem])

  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [replyText, setReplyText] = useState('')
  const [uploadedPreview, setUploadedPreview] = useState(null)
  const [showImgModal, setShowImgModal] = useState(false)

  const filteredIssues = deliveries.filter(d => {
    const matchesSearch = d.id.toLowerCase().includes(searchText.toLowerCase()) ||
                          d.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
                          d.issue.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSendResponse = () => {
    if (!replyText.trim() && !uploadedPreview) return
    const newResp = {
      sender: "ERP Admin Support",
      text: replyText || "Image attachment received.",
      time: new Date().toLocaleString()
    }
    const updated = deliveries.map(d => {
      if (d.id === selectedIssue.id) {
        const newImages = uploadedPreview ? [...d.images, uploadedPreview] : d.images
        return {
          ...d,
          images: newImages,
          responses: [...d.responses, newResp],
          timeline: [...d.timeline, { date: new Date().toLocaleDateString(), event: `Response added: ${replyText.substring(0, 20)}` }]
        }
      }
      return d
    })
    setDeliveries(updated)
    setSelectedIssue(updated.find(d => d.id === selectedIssue.id))
    setReplyText('')
    setUploadedPreview(null)
  }

  const handleResolveIssue = (id) => {
    const updated = deliveries.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: 'Resolved',
          trackerState: 'Resolved & Closed',
          timeline: [...d.timeline, { date: new Date().toLocaleDateString(), event: "Delivery complaint closed successfully." }]
        }
      }
      return d
    })
    setDeliveries(updated)
    if (selectedIssue?.id === id) {
      setSelectedIssue(updated.find(d => d.id === id))
    }
  }

  const handleMockUpload = () => {
    setUploadedPreview("https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=400")
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          Delivery Complaints & Transit Logs
        </h2>
        <p className="text-xs text-slate-500 font-medium">Investigate transit delays, damaged seed bags, and logistics partner performance</p>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Delivery Disputes", val: deliveries.filter(d=>d.status!=='Resolved').length, icon: AlertOctagon, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "Transit Partners Registered", val: "12 Agencies", icon: Truck, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Damaged Package Claims", val: deliveries.filter(d=>d.issue.includes('Damage')).length, icon: AlertOctagon, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "On-Time Dispatch Rate", val: "94.8%", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" }
        ].map((c, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex items-center gap-4`}>
            <div className={`p-3 rounded-lg ${c.bg} ${c.color}`}>
              <c.icon size={18} />
            </div>
            <div>
              <p className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">{c.label}</p>
              <h4 className="text-base font-black text-slate-855 dark:text-slate-155 mt-0.5">{c.val}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Body Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex flex-col sm:flex-row gap-3 items-center justify-between`}>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search ticket, customer, transit partner..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={`w-full text-xs pl-9 pr-4 py-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-850 focus:border-emerald-500'} transition-all`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`text-3xs font-bold p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 text-slate-355' : 'bg-slate-50 border-slate-250 text-slate-655'}`}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Pending Investigation">Pending Investigation</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-4xs font-bold uppercase tracking-wider text-slate-400 ${theme === 'dark' ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <th className="p-3">Ticket ID</th>
                    <th className="p-3">Customer / Farmer</th>
                    <th className="p-3">Logistics Agency</th>
                    <th className="p-3">Issue Type</th>
                    <th className="p-3">Transit Status</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                  {filteredIssues.map(d => (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedIssue(d)}
                      className={`cursor-pointer transition-colors ${selectedIssue?.id === d.id ? (theme==='dark'?'bg-emerald-950/10':'bg-emerald-500/5') : (theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50')}`}
                    >
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{d.id}</td>
                      <td className="p-3 font-medium">{d.customerName}</td>
                      <td className="p-3 text-slate-550 font-medium">{d.partner}</td>
                      <td className="p-3 text-slate-500 font-semibold">{d.issue}</td>
                      <td className="p-3">
                        <span className="text-4xs font-extrabold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {d.trackerState}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-1.5 py-0.5 rounded text-4xs font-extrabold ${d.status === 'Resolved' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
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

        {/* Action Center & Map Tracker simulation */}
        <div>
          {selectedIssue ? (
            <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}>
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-850 border-slate-150">
                <div>
                  <h4 className="font-extrabold">{selectedIssue.id}</h4>
                  <p className="text-3xs text-slate-400 font-semibold">{selectedIssue.partner}</p>
                </div>
                <button onClick={() => setSelectedIssue(null)} className="p-1 hover:bg-slate-150 dark:hover:bg-slate-855 rounded">
                  <X size={14} />
                </button>
              </div>

              {/* Transit Tracker integration panel */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 border-slate-200 space-y-2">
                <span className="text-4xs font-extrabold uppercase text-slate-400 flex items-center gap-1"><MapPin size={10} /> Live Dispatch Tracker</span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Truck size={14} />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-2xs">{selectedIssue.trackerState}</h5>
                    <p className="text-4xs text-slate-400 mt-0.5">Assigned Partner: {selectedIssue.partner}</p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-4xs font-extrabold uppercase text-slate-400">Issue description</span>
                <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-355">{selectedIssue.details}</p>
              </div>

              {/* Proof of damage photos */}
              {selectedIssue.images.length > 0 && (
                <div>
                  <span className="text-4xs font-extrabold uppercase text-slate-400">Damage Proof Images</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {selectedIssue.images.map((img, i) => (
                      <div key={i} className="relative group cursor-pointer border rounded-lg overflow-hidden" onClick={() => setShowImgModal(true)}>
                        <img src={img} alt="proof" className="h-16 w-full object-cover" />
                        <span className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-4xs font-bold transition-opacity">PREVIEW</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Responder logs */}
              <div className="border-t pt-3 dark:border-slate-850 border-slate-150 space-y-2">
                <span className="text-4xs font-extrabold uppercase text-slate-400">Logistics Agent Dialogue</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedIssue.responses.map((r, i) => (
                    <div key={i} className="p-2 rounded bg-slate-100 dark:bg-slate-850">
                      <div className="flex justify-between items-center text-4xs font-bold text-slate-400">
                        <span>{r.sender}</span>
                        <span>{r.time}</span>
                      </div>
                      <p className="mt-0.5 text-2xs font-semibold">{r.text}</p>
                    </div>
                  ))}
                </div>

                {/* Upload proof image simulation */}
                <div className="flex items-center justify-between border p-2 rounded bg-slate-50 dark:bg-slate-950 dark:border-slate-850 border-slate-200">
                  <span className="text-4xs font-bold text-slate-400 flex items-center gap-1">
                    <ImageIcon size={11} /> {uploadedPreview ? "damage_proof.jpg" : "Attach Proof Image"}
                  </span>
                  <button onClick={handleMockUpload} className="px-2 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-4xs font-bold cursor-pointer">
                    {uploadedPreview ? "Attached" : "Browse"}
                  </button>
                </div>

                <div className="flex gap-1.5 mt-2">
                  <input
                    type="text"
                    placeholder="Enter dispatch notes/reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className={`flex-1 text-2xs p-1.5 rounded border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 focus:border-emerald-500'}`}
                  />
                  <button onClick={handleSendResponse} className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer">
                    <Send size={11} />
                  </button>
                </div>
              </div>

              {selectedIssue.status !== 'Resolved' && (
                <button
                  onClick={() => handleResolveIssue(selectedIssue.id)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-3xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle size={12} /> Resolve & Complete Dispatch Ticket
                </button>
              )}
            </div>
          ) : (
            <div className={`p-6 border text-center text-slate-400 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} py-12 rounded-xl`}>
              Select a delivery complaint ticket to view logistics partner tracking details, uploaded images, and to coordinate resolutions.
            </div>
          )}
        </div>
      </div>

      {/* Large Image Preview Modal */}
      <AnimatePresence>
        {showImgModal && selectedIssue?.images?.[0] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl p-2"
            >
              <button
                onClick={() => setShowImgModal(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors z-10 cursor-pointer"
              >
                <X size={16} />
              </button>
              <img
                src={selectedIssue.images[0]}
                alt="Damage proof"
                className="w-full h-auto object-contain max-h-[70vh]"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion } from 'framer-motion'
import {
  MessageSquare, User, Bot, Sparkles, Send, Check, X,
  Clock, Star, Award, Search, Zap, CheckCircle2
} from 'lucide-react'

const INITIAL_CHATS = [
  {
    id: "CHAT-401",
    customerName: "Sanjay Patil (Farmer)",
    activeAgent: "Amit Shinde",
    satisfaction: 4.8,
    responseTime: "25s",
    status: "Active",
    messages: [
      { sender: "Customer", text: "How can I apply for the dry farming subsidy plan?" },
      { sender: "Agent", text: "Hello Sanjay! You can navigate to the 'Government Schemes' page in your profile and click apply under Dry Land Subsidy." },
      { sender: "Customer", text: "It asks for land verification record number. Where do I upload that document?" }
    ],
    aiSuggestions: [
      "You can upload the 7/12 land record document directly in the KYC tab.",
      "The land verification record should be uploaded in PDF or JPG format, under 5MB.",
      "Let me forward this to the land verification cell for quick verification."
    ]
  },
  {
    id: "CHAT-402",
    customerName: "Patil Seeds Outlet (Vendor)",
    activeAgent: "Sunita Pawar",
    satisfaction: 4.5,
    responseTime: "45s",
    status: "Active",
    messages: [
      { sender: "Customer", text: "My inventory listings are showing offline since this morning." },
      { sender: "Agent", text: "Checking your vendor status. Yes, your warehouse subscription plan expired yesterday." }
    ],
    aiSuggestions: [
      "Please navigate to Billing -> Subscription to renew your active catalog tier.",
      "I can grant a 24-hour grace period extension while you process the renewal."
    ]
  }
];

export default function LiveChatMonitoring() {
  const { setActiveItem, theme } = useSuperAdminStore()

  useEffect(() => {
    setActiveItem('Complaint & Support', 'Live Chat Monitoring')
  }, [setActiveItem])

  const [chats, setChats] = useState(INITIAL_CHATS)
  const [selectedChat, setSelectedChat] = useState(null)
  const [typedMessage, setTypedMessage] = useState('')

  const handleSendAdminMessage = (textToSend = '') => {
    const finalMsg = textToSend || typedMessage
    if (!finalMsg.trim()) return

    const newMsg = {
      sender: "Admin Monitor",
      text: finalMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const updated = chats.map(c => {
      if (c.id === selectedChat.id) {
        return {
          ...c,
          messages: [...c.messages, newMsg]
        }
      }
      return c
    })

    setChats(updated)
    setSelectedChat(updated.find(c => c.id === selectedChat.id))
    if (!textToSend) setTypedMessage('')
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          💬 Live Chat Monitoring Room
        </h2>
        <p className="text-xs text-slate-500 font-medium">Intervene in active support rooms, review support responses, and check AI-assisted suggestions</p>
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Live Chats", val: chats.length, icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Avg Response Time", val: "34 Seconds", icon: Clock, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "AI Suggestions Used", val: "68% Rate", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Chat Satisfaction Score", val: "4.7 / 5.0", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" }
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

      {/* Main live chat interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[550px]">
        {/* Left Side: Active Rooms list */}
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex flex-col justify-between`}>
          <div className="space-y-4">
            <span className="text-4xs font-extrabold uppercase text-slate-400">Active Chat Channels</span>
            <div className="space-y-2 mt-2">
              {chats.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedChat(c)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedChat?.id === c.id ? 'border-emerald-500 bg-emerald-500/5' : 'dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850'}`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-100">{c.customerName}</span>
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                  <p className="text-3xs text-slate-400 font-medium mt-1">Agent: {c.activeAgent}</p>
                  <div className="flex items-center justify-between text-4xs font-bold text-slate-400 mt-2">
                    <span className="flex items-center gap-0.5"><Clock size={10} /> RT: {c.responseTime}</span>
                    <span className="flex items-center gap-0.5"><Star size={10} className="text-amber-500" /> {c.satisfaction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Pane: Chat log and text field */}
        <div className={`lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 h-full`}>
          {selectedChat ? (
            <>
              {/* Messages viewport */}
              <div className={`md:col-span-2 p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex flex-col justify-between h-full`}>
                <div className="flex justify-between items-center border-b pb-2 dark:border-slate-850 border-slate-150">
                  <div>
                    <h4 className="font-bold text-xs">{selectedChat.customerName}</h4>
                    <p className="text-4xs text-slate-400">Active monitoring: Super Admin can intervene</p>
                  </div>
                  <button onClick={() => setSelectedChat(null)} className="p-1 rounded hover:bg-slate-150 dark:hover:bg-slate-850">
                    <X size={14} />
                  </button>
                </div>

                {/* Conversation logs */}
                <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1 scrollbar-thin">
                  {selectedChat.messages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.sender === 'Customer' ? 'items-start' : 'items-end'}`}>
                      <span className="text-4xs text-slate-400 font-bold mb-0.5">{m.sender}</span>
                      <div className={`p-2.5 rounded-xl text-2xs max-w-[85%] font-medium ${m.sender === 'Customer' ? 'bg-slate-100 dark:bg-slate-850 text-slate-850 dark:text-slate-200' : 'bg-emerald-600 text-white'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply bar */}
                <div className="flex items-center gap-1.5 border-t pt-3 dark:border-slate-850 border-slate-150">
                  <input
                    type="text"
                    placeholder="Intervene in chat..."
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendAdminMessage()}
                    className={`flex-1 text-2xs p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-850 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 focus:border-emerald-500'}`}
                  />
                  <button onClick={() => handleSendAdminMessage()} className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer">
                    <Send size={12} />
                  </button>
                </div>
              </div>

              {/* Right Side of middle pane: AI suggestions */}
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex flex-col justify-between h-full`}>
                <div className="space-y-4">
                  <span className="text-4xs font-extrabold uppercase text-slate-400 flex items-center gap-1"><Sparkles size={11} className="text-purple-500 animate-pulse" /> AI Chat Suggestions</span>
                  <div className="space-y-2.5 mt-2">
                    {selectedChat.aiSuggestions.map((suggestion, i) => (
                      <div
                        key={i}
                        onClick={() => handleSendAdminMessage(suggestion)}
                        className={`p-2.5 rounded-lg border dark:border-slate-850 bg-slate-50 dark:bg-slate-950 hover:border-purple-500 hover:bg-purple-500/5 cursor-pointer text-3xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold transition-all`}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-4xs font-bold text-emerald-500 flex items-center gap-1.5">
                  <Zap size={12} />
                  <span>Click suggestions to send instantly</span>
                </div>
              </div>
            </>
          ) : (
            <div className={`md:col-span-3 p-6 border text-center text-slate-400 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} py-12 rounded-xl flex items-center justify-center h-full`}>
              Select an active room channel from the left sidebar panel to begin chat monitoring, response validation, or AI smart suggestion triggers.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { useState } from 'react'
import { Bell, Package, CreditCard, AlertTriangle, CheckCheck, Trash2, Banknote } from 'lucide-react'
import toast from 'react-hot-toast'

const demoNotifications = [
  { _id: 'n1', type: 'expiry', icon: AlertTriangle, title: 'Product Expiry Alert', message: 'Chlorpyrifos 500ml (Batch B003) expires in 8 days', isRead: false, time: '10 min ago', severity: 'red' },
  { _id: 'n2', type: 'stock', icon: Package, title: 'Low Stock Alert', message: 'Urea Fertilizer 50kg — only 3 bags remaining', isRead: false, time: '25 min ago', severity: 'orange' },
  { _id: 'n3', type: 'udhari', icon: Banknote, title: 'Udhari Due Reminder', message: 'Suresh Patil — ₹4,500 due. Due date: Jun 15', isRead: false, time: '1 hour ago', severity: 'orange' },
  { _id: 'n4', type: 'expiry', icon: AlertTriangle, title: 'Product Expiry Warning', message: 'DAP Fertilizer batch B002 expires in 21 days', isRead: true, time: '3 hours ago', severity: 'yellow' },
  { _id: 'n5', type: 'stock', icon: Package, title: 'Out of Stock', message: 'Drip Tape 16mm — stock is now 0. Please reorder.', isRead: true, time: '1 day ago', severity: 'red' },
  { _id: 'n6', type: 'system', icon: Bell, title: 'System Update', message: 'AgroERP has been updated to v2.1.0 with new features', isRead: true, time: '2 days ago', severity: 'blue' },
]

const severityStyles = {
  red: { bg: '#fef2f2', border: '#fecaca', dot: '#ef4444' },
  orange: { bg: '#fff7ed', border: '#fed7aa', dot: '#f97316' },
  yellow: { bg: '#fefce8', border: '#fef08a', dot: '#eab308' },
  blue: { bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6' },
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(demoNotifications)

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    toast.success('All notifications marked as read')
  }

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
  }

  const deleteNotif = (id) => {
    setNotifications(prev => prev.filter(n => n._id !== id))
    toast.success('Notification removed')
  }

  const unread = notifications.filter(n => !n.isRead)
  const read = notifications.filter(n => n.isRead)

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Notifications
            {unreadCount > 0 && (
              <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500">{unreadCount} unread alerts</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAll} className="btn-secondary text-sm">
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Unread</p>
          {unread.map(n => {
            const s = severityStyles[n.severity] || severityStyles.blue
            return (
              <div
                key={n._id}
                className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all"
                style={{ background: s.bg, borderColor: s.border }}
                onClick={() => markRead(n._id)}
              >
                <span className="flex-shrink-0 mt-0.5">{React.createElement(n.icon, { size: 20, className: "text-slate-500" })}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-800 text-sm">{n.title}</p>
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ background: s.dot }} />
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteNotif(n._id) }} className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Read */}
      {read.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Earlier</p>
          {read.map(n => (
            <div key={n._id} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 opacity-70 hover:opacity-100 transition-opacity">
              <span className="flex-shrink-0 mt-0.5">{React.createElement(n.icon, { size: 20, className: "text-slate-400" })}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-700 text-sm">{n.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
              <button onClick={() => deleteNotif(n._id)} className="p-1 text-gray-300 hover:text-red-500 flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {notifications.length === 0 && (
        <div className="text-center py-16">
          <Bell size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No notifications</p>
        </div>
      )}
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useSuperAdminStore } from '../../store/superAdminStore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Megaphone, Plus, Search, Calendar, RefreshCw, X, CheckCircle,
  TrendingUp, Users, AlertCircle, ArrowUpRight
} from 'lucide-react'

const INITIAL_ANNOUNCEMENTS = [
  { title: "Platform Upgrade: Dashboard Integration", category: "New Feature", publishDate: "2026-05-28", targetAudience: "All Users", status: "Published" },
  { title: "System Offline: Core Server Upgrade", category: "Maintenance Notice", publishDate: "2026-05-27", targetAudience: "All Roles", status: "Published" },
  { title: "Regional Sowing Meet: Baramati Division", category: "Event Notice", publishDate: "2026-05-29", targetAudience: "Pune Region", status: "Scheduled" }
];

export default function Announcements() {
  const { setActiveItem, theme } = useSuperAdminStore()
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('New Feature')
  const [target, setTarget] = useState('All Users')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    setActiveItem('Notification Center', 'Announcements')
  }, [setActiveItem])

  const handleCreateAnnouncement = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const newAnn = {
      title,
      category,
      publishDate: new Date().toISOString().split('T')[0],
      targetAudience: target,
      status: "Published"
    }

    setAnnouncements([newAnn, ...announcements])
    setTitle('')
    setShowAddForm(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const getCategoryColor = (cat) => {
    if (cat === 'New Feature') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    if (cat === 'Maintenance Notice') return 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 dark:border-slate-800 border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-855 dark:text-slate-100 flex items-center gap-2">
            General Board Announcements
          </h2>
          <p className="text-xs text-slate-500 font-medium">Post website bulletins, upcoming maintenance timelines, regional sowing conventions, and new features</p>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-bold animate-fade-in">
          Announcement published and displayed on active user home dashboards.
        </div>
      )}

      {/* Workspace splits */}
      <div className="space-y-4">
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex justify-between items-center gap-2`}>
          <span className="text-4xs font-extrabold uppercase text-slate-400">Board bulletins history</span>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus size={13} /> Create Announcement
          </button>
        </div>

        {/* Add Form drawer inside page */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleCreateAnnouncement}
              className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-4xs font-bold text-slate-450 mb-1">BULLETIN TITLE</label>
                  <input
                    type="text"
                    placeholder="e.g. Scheduled Power Outage in Hub"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-800 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-200 focus:border-emerald-500'}`}
                  />
                </div>
                <div>
                  <label className="block text-4xs font-bold text-slate-455 mb-1 font-heading">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-slate-955 border-slate-855 text-slate-200 focus:border-emerald-500' : 'bg-slate-50 border-slate-250 text-slate-800 focus:border-emerald-500'} transition-all`}
                  >
                    <option value="New Feature">New Feature</option>
                    <option value="Maintenance Notice">Maintenance Notice</option>
                    <option value="Event Notice">Event Notice</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1.5 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer">Publish Bulletin</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Announcements data table */}
        <div className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-4xs font-bold uppercase tracking-wider text-slate-400 ${theme === 'dark' ? 'bg-slate-850/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                  <th className="p-3">Announcement Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Publish Date</th>
                  <th className="p-3">Target Segment</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                {announcements.map((ann, i) => (
                  <tr key={i} className={theme==='dark'?'hover:bg-slate-850':'hover:bg-slate-50'}>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{ann.title}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-4xs font-extrabold border uppercase ${getCategoryColor(ann.category)}`}>
                        {ann.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-semibold">{ann.publishDate}</td>
                    <td className="p-3 text-slate-500 font-medium">{ann.targetAudience}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-4xs font-extrabold ${ann.status === 'Published' ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 bg-slate-500/10'}`}>
                        {ann.status}
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

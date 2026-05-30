import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Landmark, Search, Filter, Eye, Download, X, HelpCircle, FileText, Calendar, Info } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function SchemesDirectory() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [selectedScheme, setSelectedScheme] = useState(null)

  const [schemes, setSchemes] = useState([
    {
      id: 'sch-1',
      name: 'PM Kisan Samman Nidhi Yojana',
      type: 'Central Government',
      category: 'Agriculture Subsidy',
      launchDate: '2018-12-01',
      criteria: 'Small and marginal farmers with land ownership up to 2 hectares.',
      status: 'Active',
      deadline: '2026-12-31',
      description: 'An initiative by the Government of India that provides up to ₹6,000 per year in three equal installments to small and marginal farmers.',
      documents: ['Application_Form.pdf', 'Land_Verification_Guidelines.pdf']
    },
    {
      id: 'sch-2',
      name: 'Pradhan Mantri Krishi Sinchayee Yojana',
      type: 'Central Government',
      category: 'Irrigation',
      launchDate: '2015-07-01',
      criteria: 'All agricultural lands, self-help groups, cooperative societies.',
      status: 'Active',
      deadline: '2026-10-15',
      description: 'Launched to improve farm water use efficiency through micro-irrigation systems, under the motto "Har Khet Ko Pani" and "Per Drop More Crop".',
      documents: ['Micro_Irrigation_Subsidy_Rules.pdf']
    },
    {
      id: 'sch-3',
      name: 'MahaDBT Farmer Equipment Scheme',
      type: 'State Government',
      category: 'Equipment Support',
      launchDate: '2020-04-10',
      criteria: 'Registered farmers in Maharashtra possessing active 7/12 extract.',
      status: 'Active',
      deadline: '2026-06-30',
      description: 'Provides subsidy ranging from 40% to 50% for purchasing tractors, power tillers, rotavators, and other essential agricultural machinery.',
      documents: ['Equipment_Subsidy_Pricing_List.pdf']
    },
    {
      id: 'sch-4',
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      type: 'Central Government',
      category: 'Crop Insurance',
      launchDate: '2016-02-18',
      criteria: 'All farmers growing notified crops in notified areas during Kharif/Rabi.',
      status: 'Active',
      deadline: '2026-07-31',
      description: 'A uniform crop insurance scheme protecting farmers against crop loss due to natural calamities, pests, and diseases.',
      documents: ['PMFBY_Policy_Guidelines_2026.pdf', 'Claim_Procedure_Manual.pdf']
    },
    {
      id: 'sch-5',
      name: 'Gujarat Solar Pump Subsidy Scheme',
      type: 'State Government',
      category: 'Irrigation',
      launchDate: '2022-01-15',
      criteria: 'Farmers in Gujarat with no existing electrical grid connection for wells.',
      status: 'Active',
      deadline: '2026-08-15',
      description: 'Enables farmers to install off-grid solar water pumps under subsidy to promote environment-friendly irrigation routines.',
      documents: ['Solar_Pump_Eligibility_FAQ.pdf']
    }
  ])

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.criteria.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filterType === 'All' || s.category === filterType || s.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Sticky Header Topbar */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Landmark className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Government Schemes Directory
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Coordinate, publish and audit central & state government agricultural subsidy plans</p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className={`p-6 md:p-8 rounded-2xl border flex flex-col md:flex-row items-center gap-4 justify-between ${
        isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'
      }`}>
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border w-full md:max-w-md ${
          isDark ? 'bg-slate-950/50 border-slate-800 focus-within:border-emerald-600' : 'bg-slate-50 border-slate-200 focus-within:border-emerald-600'
        } transition-all`}>
          <Search size={18} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search schemes, criteria..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full placeholder-slate-455 text-slate-700 dark:text-slate-200"
          />
        </div>

        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          {['All', 'Central Government', 'State Government', 'Agriculture Subsidy', 'Irrigation', 'Crop Insurance', 'Equipment Support'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Directory Table */}
      <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-450 uppercase`}>
                <th className="px-6 py-4 min-w-[220px]">Scheme Name</th>
                <th className="px-6 py-4 min-w-[140px]">Scheme Type</th>
                <th className="px-6 py-4 min-w-[140px]">Launch Date</th>
                <th className="px-6 py-4 min-w-[250px]">Eligibility Criteria</th>
                <th className="px-6 py-4 min-w-[120px]">Status</th>
                <th className="px-6 py-4 min-w-[150px]">Deadline</th>
                <th className="px-6 py-4 text-right min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {filteredSchemes.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                  <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150">
                    <div className="max-w-[220px] truncate">{s.name}</div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded font-bold text-3xs ${
                      s.type === 'Central Government' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'
                    } whitespace-nowrap`}>
                      {s.type}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-450 font-medium">{s.launchDate}</td>
                  <td className="px-6 py-3.5">
                    <p className="max-w-[240px] truncate text-slate-655 dark:text-slate-350" title={s.criteria}>
                      {s.criteria}
                    </p>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 inline-flex items-center justify-center whitespace-nowrap">
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-405">{s.deadline}</td>
                  <td className="px-6 py-3.5 text-right flex justify-end gap-1 items-center">
                    <button
                      onClick={() => setSelectedScheme(s)}
                      className="p-2 text-slate-400 hover:text-emerald-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheme Detail Modal */}
      <AnimatePresence>
        {selectedScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScheme(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-lg p-6 md:p-8 rounded-2xl border shadow-2xl z-10 ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <button
                onClick={() => setSelectedScheme(null)}
                className="absolute top-4 right-4 text-slate-450 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>

              <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Landmark className="text-emerald-500 w-5 h-5" />
                {selectedScheme.name}
              </h3>

              <div className="space-y-4 text-xs md:text-sm">
                <div>
                  <span className="font-bold text-slate-400 block mb-1">Description</span>
                  <p className="text-slate-655 dark:text-slate-300 leading-relaxed">{selectedScheme.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-slate-400 block mb-1">Launch Date</span>
                    <span className="font-semibold">{selectedScheme.launchDate}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 block mb-1">Application Deadline</span>
                    <span className="font-semibold text-rose-500">{selectedScheme.deadline}</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block mb-2">Available Program Documents</span>
                  <div className="space-y-2">
                    {selectedScheme.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 border dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                        <span className="font-mono text-xs text-slate-655 dark:text-slate-350">{doc}</span>
                        <button className="text-xs font-bold text-emerald-500 flex items-center gap-1 hover:underline">
                          <Download size={12} /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

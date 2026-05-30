import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Search, HelpCircle, Activity, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function FarmerEligibility() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [landHolding, setLandHolding] = useState('1.5')
  const [region, setRegion] = useState('Maharashtra')
  const [cropType, setCropType] = useState('Cotton')
  const [annualIncome, setAnnualIncome] = useState('120000')
  const [eligibilityResult, setEligibilityResult] = useState(null)

  const [verifications] = useState([
    { id: 'f-v-1', name: 'Ramesh Patil', landVerified: 'Verified', incomeVerified: 'Verified', cropMatch: 'Cotton', eligibility: 'Eligible' },
    { id: 'f-v-2', name: 'Sanjay Deshmukh', landVerified: 'Verified', incomeVerified: 'Verified', cropMatch: 'Sugarcane', eligibility: 'Eligible' },
    { id: 'f-v-3', name: 'Anil Rao', landVerified: 'Pending', incomeVerified: 'Verified', cropMatch: 'Paddy', eligibility: 'Pending Verification' },
    { id: 'f-v-4', name: 'Vijay Gowda', landVerified: 'Failed', incomeVerified: 'Verified', cropMatch: 'Coffee', eligibility: 'Not Eligible' }
  ])

  const handleCheckEligibility = (e) => {
    e.preventDefault()
    const holdingVal = parseFloat(landHolding) || 0
    const incomeVal = parseFloat(annualIncome) || 0
    
    if (holdingVal <= 2.0 && incomeVal <= 150000) {
      setEligibilityResult({
        eligible: true,
        matchingSchemes: ['PM Kisan Samman Nidhi Yojana', 'Pradhan Mantri Krishi Sinchayee Yojana'],
        advisory: 'Eligible for category-A micro subsidies. Please submit active 7/12 land extract to proceed.'
      })
    } else {
      setEligibilityResult({
        eligible: false,
        matchingSchemes: ['MahaDBT Farmer Equipment Scheme (Partial)'],
        advisory: 'Exceeds marginal farming land holding or income criteria. State equipment subsidies remain available.'
      })
    }
  }

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <UserCheck className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Farmer Eligibility Hub
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Verify land registries, audit income profiles, and trace subsidy qualifications</p>
        </div>
      </div>

      {/* Calculator Grid & Checker Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Left: Input parameters form */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">Smart Eligibility Calculator</h3>
            <p className="text-xs text-slate-400">Input holding and region stats to calculate match rates</p>
          </div>

          <form onSubmit={handleCheckEligibility} className="space-y-4 flex-1 mt-4">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Land Holding Area (Hectares)</label>
              <input
                type="number"
                step="0.1"
                required
                value={landHolding}
                onChange={e => setLandHolding(e.target.value)}
                className="input-field py-2.5 text-sm"
                placeholder="e.g. 1.5"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">State Region</label>
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="input-field py-2.5 text-sm"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Active Crop</label>
              <select
                value={cropType}
                onChange={e => setCropType(e.target.value)}
                className="input-field py-2.5 text-sm"
              >
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Paddy">Paddy</option>
                <option value="Wheat">Wheat</option>
              </select>
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Annual Family Income (INR)</label>
              <input
                type="number"
                required
                value={annualIncome}
                onChange={e => setAnnualIncome(e.target.value)}
                className="input-field py-2.5 text-sm"
                placeholder="e.g. 120000"
              />
            </div>

            <button type="submit" className="w-full btn-primary text-xs md:text-sm py-3 font-semibold mt-4">
              Evaluate Eligibility Status
            </button>
          </form>
        </div>

        {/* Right: Results Dashboard View */}
        <div className={`lg:col-span-2 rounded-xl border p-6 md:p-8 space-y-6 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Calculated Matching Report</h3>
            <p className="text-xs text-slate-400 mt-1">Real-time parameters validation output</p>
          </div>

          <div className="flex flex-col justify-center items-center h-full min-h-[300px] text-center border-2 border-dashed dark:border-slate-800 rounded-2xl p-6">
            {eligibilityResult ? (
              <div className="space-y-4 max-w-md">
                <div className="flex justify-center">
                  {eligibilityResult.eligible ? (
                    <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-full">
                      <CheckCircle2 size={36} />
                    </div>
                  ) : (
                    <div className="p-3.5 bg-rose-500/10 text-rose-500 rounded-full">
                      <XCircle size={36} />
                    </div>
                  )}
                </div>
                <h4 className="text-lg font-black text-slate-800 dark:text-slate-100">
                  {eligibilityResult.eligible ? 'Parameters Approved' : 'Criteria Failed'}
                </h4>
                <p className="text-xs md:text-sm text-slate-455 dark:text-slate-400 leading-relaxed">
                  {eligibilityResult.advisory}
                </p>
                <div className="space-y-2 mt-4 text-left">
                  <span className="text-2xs font-bold text-slate-400 uppercase tracking-wide block">Matching Schemes</span>
                  {eligibilityResult.matchingSchemes.map((s, i) => (
                    <div key={i} className="p-2.5 rounded-lg border dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-xs font-semibold flex items-center justify-between">
                      <span>{s}</span>
                      <ArrowRight size={13} className="text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-w-sm">
                <div className="flex justify-center text-slate-400">
                  <ShieldCheck size={40} />
                </div>
                <h4 className="font-bold text-slate-500 text-sm">Waiting for Calculation</h4>
                <p className="text-2xs text-slate-400 leading-relaxed">
                  Fill in the farmer parameters on the left and submit to trigger eligibility rules verification.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Verification Status Table */}
      <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
        <div className={`px-6 py-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Verification Status Indicators</h3>
            <p className="text-xs text-slate-400 mt-1">Audit profile registries matching status</p>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-450 uppercase`}>
                <th className="px-6 py-4 min-w-[200px]">Farmer Profile</th>
                <th className="px-6 py-4 min-w-[160px]">Land Ownership</th>
                <th className="px-6 py-4 min-w-[160px]">Income Category</th>
                <th className="px-6 py-4 min-w-[160px]">Primary Crop</th>
                <th className="px-6 py-4 min-w-[180px]">Calculated Eligibility</th>
                <th className="px-6 py-4 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {verifications.map(v => (
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                  <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150 truncate">{v.name}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap inline-flex items-center justify-center ${v.landVerified === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {v.landVerified}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 inline-flex items-center justify-center whitespace-nowrap">
                      {v.incomeVerified}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-450 font-semibold">{v.cropMatch}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap inline-flex items-center justify-center ${
                      v.eligibility === 'Eligible' ? 'bg-emerald-500/10 text-emerald-500' :
                      v.eligibility === 'Not Eligible' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'
                    }`}>
                      {v.eligibility}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button className="text-xs font-bold text-emerald-500 hover:underline whitespace-nowrap">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

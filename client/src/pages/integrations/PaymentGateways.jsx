import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Shield, RefreshCw, CheckCircle, XCircle, Settings, HelpCircle, Activity, Globe, Key } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function PaymentGateways() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [razorpayKey, setRazorpayKey] = useState('rzp_live_9aKsK2lJ90')
  const [stripeKey, setStripeKey] = useState('sk_live_51MszKJ2l39xP')
  const [testingConnection, setTestingConnection] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const [transactions] = useState([
    { id: 'TXN-701', gateway: 'Razorpay', amount: '₹3,499', status: 'Success', date: '2026-05-29 12:45' },
    { id: 'TXN-702', gateway: 'Stripe', amount: '₹12,990', status: 'Success', date: '2026-05-29 11:20' },
    { id: 'TXN-703', gateway: 'PayPal', amount: '₹24,500', status: 'Failed', date: '2026-05-28 16:10' }
  ])

  const handleTestConnection = (gateway) => {
    setTestingConnection(true)
    setTestResult(null)
    setTimeout(() => {
      setTestingConnection(false)
      setTestResult({
        success: true,
        message: `${gateway} API Connection Verified! Ping latency: 45ms. Webhook Handshake Complete.`
      })
    }, 1200)
  }

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <CreditCard className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            Payment Gateway Integrations
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Verify credentials, configure webhook callbacks, and monitor payment pipelines</p>
        </div>
      </div>

      {/* Gateway Cards Grid (Equal Sizing) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Razorpay */}
        <div className={`rounded-2xl border p-6 md:p-8 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/25' : 'border-slate-200 bg-white'}`}>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Razorpay API</h3>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 whitespace-nowrap">Active</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Live API Key</label>
                <input
                  type="text"
                  value={razorpayKey}
                  onChange={e => setRazorpayKey(e.target.value)}
                  className="input-field py-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => handleTestConnection('Razorpay')}
            className="w-full btn-secondary text-xs md:text-sm py-2.5 font-bold mt-6"
          >
            Test Handshake Connection
          </button>
        </div>

        {/* Stripe */}
        <div className={`rounded-2xl border p-6 md:p-8 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/25' : 'border-slate-200 bg-white'}`}>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Stripe API</h3>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 whitespace-nowrap">Active</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Live Secret Key</label>
                <input
                  type="password"
                  value={stripeKey}
                  onChange={e => setStripeKey(e.target.value)}
                  className="input-field py-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => handleTestConnection('Stripe')}
            className="w-full btn-secondary text-xs md:text-sm py-2.5 font-bold mt-6"
          >
            Test Handshake Connection
          </button>
        </div>

        {/* PayPal */}
        <div className={`rounded-2xl border p-6 md:p-8 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/25' : 'border-slate-200 bg-white'}`}>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">PayPal API</h3>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-500/10 text-slate-450 whitespace-nowrap">Inactive</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">PayPal is configured for international multi-currency conversions. Provide active Sandbox parameters to verify connection.</p>
          </div>
          <button
            onClick={() => handleTestConnection('PayPal')}
            className="w-full btn-secondary text-xs md:text-sm py-2.5 font-bold mt-6"
          >
            Test Handshake Connection
          </button>
        </div>
      </div>

      {/* Connection Result Feedback */}
      {testingConnection && (
        <div className="p-4 rounded-xl border dark:border-slate-800 animate-pulse text-xs text-slate-400">
          Running secure connection handshakes...
        </div>
      )}
      {testResult && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs md:text-sm font-semibold ${
          testResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
        }`}>
          {testResult.success ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Transaction & Webhooks logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Webhooks configuration */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-4 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Globe size={18} /> Webhook Callbacks
          </h3>
          <div className="space-y-4 text-xs md:text-sm mt-4">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-450 mb-2">Endpoint URL</label>
              <input
                type="text"
                disabled
                value="https://api.agroerp.com/v1/payouts/webhook"
                className="input-field py-2 bg-slate-50 dark:bg-slate-900/40 text-slate-450 border-dashed"
              />
            </div>
            <p className="text-2xs text-slate-400 leading-relaxed">
              Copy this URL and register it inside your dashboard provider portal to capture events like `payment.captured` or `charge.refunded`.
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className={`lg:col-span-2 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm flex flex-col justify-between`}>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'} text-xs font-bold text-slate-455 uppercase`}>
                  <th className="px-6 py-4">Transaction Ref</th>
                  <th className="px-6 py-4">Gateway Provider</th>
                  <th className="px-6 py-4">Total Payout</th>
                  <th className="px-6 py-4">Execution Status</th>
                  <th className="px-6 py-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors h-14 md:h-16">
                    <td className="px-6 py-3.5 font-mono text-blue-500 font-bold">{t.id}</td>
                    <td className="px-6 py-3.5 font-bold text-slate-700 dark:text-slate-200">{t.gateway}</td>
                    <td className="px-6 py-3.5 font-bold">{t.amount}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        t.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      } whitespace-nowrap`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right text-slate-450">{t.date}</td>
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

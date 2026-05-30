import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Settings, Share2, Sparkles, AlertCircle, HelpCircle, CheckCircle, Smartphone } from 'lucide-react'
import { useSuperAdminStore } from '../../store/superAdminStore'

export default function WhatsappApis() {
  const { theme } = useSuperAdminStore()
  const isDark = theme === 'dark'

  const [accessToken, setAccessToken] = useState('EAAG3p2JjZCw0BAG...')
  const [phoneNumberId, setPhoneNumberId] = useState('109520481904')
  
  const [status, setStatus] = useState('Connected')

  return (
    <div className="w-full max-w-full space-y-6 md:space-y-10">
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Smartphone className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />
            WhatsApp Business API setup
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">Verify Meta credentials, manage message templates and webhook verification payloads</p>
        </div>
      </div>

      {/* Main Configurations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Settings Panel */}
        <div className={`rounded-xl border p-6 md:p-8 space-y-6 flex flex-col justify-between ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><Settings size={18} /> Credentials Setup</h3>
            <p className="text-xs text-slate-455 mt-1">Configure Meta Developer parameters</p>
          </div>

          <form className="space-y-4 flex-1 mt-4">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">Phone Number ID</label>
              <input
                type="text"
                value={phoneNumberId}
                onChange={e => setPhoneNumberId(e.target.value)}
                className="input-field py-2.5 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-2">System User Access Token</label>
              <input
                type="password"
                value={accessToken}
                onChange={e => setAccessToken(e.target.value)}
                className="input-field py-2.5 text-sm font-mono"
              />
            </div>

            <button type="button" className="w-full btn-primary text-xs md:text-sm py-3 font-semibold mt-4">
              Apply WhatsApp Config
            </button>
          </form>
        </div>

        {/* Webhooks Setup */}
        <div className={`lg:col-span-2 rounded-xl border p-6 md:p-8 space-y-6 ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Webhook Event Callback</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium font-body">Map Meta webhook verification token handshake</p>
          </div>

          <div className="space-y-4 text-xs md:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-slate-450 mb-2">Webhook URL</label>
                <input
                  type="text"
                  disabled
                  value="https://api.agroerp.com/v1/whatsapp/webhook"
                  className="input-field py-2 bg-slate-50 dark:bg-slate-900/40 text-slate-455 border-dashed"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-slate-455 mb-2">Verification Token</label>
                <input
                  type="text"
                  disabled
                  value="verification_token_agroerp_2026"
                  className="input-field py-2 bg-slate-50 dark:bg-slate-900/40 text-slate-455 border-dashed"
                />
              </div>
            </div>
            <p className="text-2xs text-slate-400 leading-relaxed mt-2">
              Register these parameters inside the WhatsApp product configurations in the Meta App Developer Console to enable live notifications sync.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Save, Store, Bell, Shield, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export default function Settings() {
  const { user } = useAuthStore()
  const { register, handleSubmit } = useForm({
    defaultValues: {
      shopName: 'Patil Krushi Seva Kendra',
      address: 'Baramati, Pune - 413102',
      gstNumber: '27AABCU9603R1ZX',
      phone: '9876543210',
      email: user?.email || '',
    },
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('shop')

  const onSave = async (data) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Settings saved!')
    setLoading(false)
  }

  const tabs = [
    { id: 'shop', label: 'Shop Info', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Settings</h1>
        <p className="text-sm text-gray-500">Manage your shop configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all"
            style={activeTab === id ? { background: 'white', color: '#2E7D32', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' } : { color: '#64748b' }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'shop' && (
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="kpi-card space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">Shop Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
              <input id="set-shopName" className="input-field" {...register('shopName')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea id="set-address" className="input-field resize-none" rows={2} {...register('address')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                <input id="set-gst" className="input-field" {...register('gstNumber')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input id="set-phone" className="input-field" {...register('phone')} />
              </div>
            </div>
          </div>

          <div className="kpi-card space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">Inventory Thresholds</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert (Days)</label>
                <input id="set-stock" type="number" defaultValue={5} className="input-field" {...register('lowStockDays')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Alert (Days)</label>
                <input id="set-expiry" type="number" defaultValue={30} className="input-field" {...register('expiryAlertDays')} />
              </div>
            </div>
          </div>

          <button id="save-settings" type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      )}

      {activeTab === 'notifications' && (
        <div className="kpi-card space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">Notification Preferences</h3>
          {[
            { id: 'notif-expiry', label: 'Expiry Alerts', desc: 'Get alerts for expiring products' },
            { id: 'notif-stock', label: 'Low Stock Alerts', desc: 'Get alerts when stock is low' },
            { id: 'notif-udhari', label: 'Udhari Reminders', desc: 'Get reminders for pending dues' },
            { id: 'notif-sales', label: 'Daily Sales Summary', desc: 'Get daily sales report' },
          ].map(({ id, label, desc }) => (
            <div key={id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input id={id} type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="kpi-card space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">Change Password</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input id="sec-current" type="password" className="input-field" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input id="sec-new" type="password" className="input-field" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input id="sec-confirm" type="password" className="input-field" placeholder="••••••••" />
          </div>
          <button onClick={() => toast.success('Password updated!')} className="btn-primary">
            <Shield size={15} /> Update Password
          </button>
        </div>
      )}
    </div>
  )
}

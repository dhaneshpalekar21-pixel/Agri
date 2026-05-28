import { Crown, Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: 499,
    period: '/month',
    color: '#64748b',
    bg: '#f8fafc',
    features: ['1 Shop', '2 Users', 'Billing & Invoicing', 'Basic Inventory', 'Email Support'],
    notIncluded: ['Analytics', 'Weather Advisory', 'Multi-branch'],
    current: false,
  },
  {
    name: 'Pro',
    price: 1299,
    period: '/month',
    color: '#2E7D32',
    bg: 'linear-gradient(135deg, #2E7D32, #66BB6A)',
    features: ['1 Shop', '10 Users', 'Full Billing Suite', 'Advanced Inventory', 'Analytics & Reports', 'Weather Advisory', 'Udhari Management', 'Priority Support'],
    notIncluded: ['Multi-branch'],
    current: true,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 3499,
    period: '/month',
    color: '#7c3aed',
    bg: '#faf5ff',
    features: ['Unlimited Shops', 'Unlimited Users', 'All Pro Features', 'Multi-branch Dashboard', 'Custom Branding', 'API Access', 'Dedicated Support'],
    notIncluded: [],
    current: false,
  },
]

export default function Subscription() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Subscription Plans</h1>
        <p className="text-sm text-gray-500 mt-1">Choose the right plan for your agriculture business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {plans.map(plan => (
          <div
            key={plan.name}
            className={`rounded-2xl overflow-hidden ${plan.popular ? 'shadow-2xl scale-105' : 'shadow-sm'}`}
            style={{ border: plan.popular ? '2px solid #2E7D32' : '1px solid #e2e8f0' }}
          >
            {/* Header */}
            <div className="p-5" style={{ background: plan.popular ? plan.bg : 'white' }}>
              {plan.popular && (
                <div className="flex items-center gap-1 text-xs font-semibold text-white bg-white/20 px-2 py-1 rounded-full w-fit mb-3">
                  <Crown size={11} /> Most Popular
                </div>
              )}
              <h3 className="text-lg font-bold" style={{ fontFamily: 'Poppins, sans-serif', color: plan.popular ? 'white' : plan.color }}>
                {plan.name}
              </h3>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-3xl font-bold" style={{ color: plan.popular ? 'white' : '#1e293b', fontFamily: 'Poppins, sans-serif' }}>
                  ₹{plan.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm mb-1" style={{ color: plan.popular ? 'rgba(255,255,255,0.7)' : '#64748b' }}>{plan.period}</span>
              </div>
            </div>

            {/* Features */}
            <div className="p-5 bg-white">
              <div className="space-y-2.5 mb-4">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check size={15} style={{ color: '#2E7D32', flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
                {plan.notIncluded.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-300 line-through">
                    <Check size={15} className="text-gray-200 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <button
                className={plan.current ? 'btn-secondary w-full justify-center' : 'btn-primary w-full justify-center'}
                style={plan.current ? {} : { background: `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)` }}
              >
                {plan.current ? 'Current Plan' : 'Upgrade Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="kpi-card max-w-4xl mx-auto">
        <h3 className="font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Billing History</h3>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              {['Invoice', 'Plan', 'Amount', 'Date', 'Status'].map(h => (
                <th key={h} className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { inv: 'SUB-001', plan: 'Pro', amount: 1299, date: '2024-05-01', status: 'paid' },
              { inv: 'SUB-002', plan: 'Pro', amount: 1299, date: '2024-04-01', status: 'paid' },
              { inv: 'SUB-003', plan: 'Pro', amount: 1299, date: '2024-03-01', status: 'paid' },
            ].map(b => (
              <tr key={b.inv} className="border-b border-gray-50">
                <td className="py-3 text-sm font-mono text-blue-600">{b.inv}</td>
                <td className="py-3 text-sm font-medium text-gray-700">{b.plan}</td>
                <td className="py-3 text-sm font-bold">₹{b.amount}</td>
                <td className="py-3 text-sm text-gray-500">{b.date}</td>
                <td className="py-3"><span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-medium">{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

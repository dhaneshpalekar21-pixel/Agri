import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const colorMap = {
  green: { bg: '#f0fdf4', icon: '#2E7D32', text: '#2E7D32' },
  blue: { bg: '#eff6ff', icon: '#1d4ed8', text: '#1d4ed8' },
  orange: { bg: '#fff7ed', icon: '#c2410c', text: '#c2410c' },
  red: { bg: '#fef2f2', icon: '#dc2626', text: '#dc2626' },
  purple: { bg: '#faf5ff', icon: '#7c3aed', text: '#7c3aed' },
  teal: { bg: '#f0fdfa', icon: '#0f766e', text: '#0f766e' },
}

export default function KPICard({ title, value, subtitle, icon: Icon, color = 'green', trend, trendValue, prefix = '', suffix = '' }) {
  const c = colorMap[color] || colorMap.green

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : '#64748b'
  const trendBg = trend === 'up' ? '#f0fdf4' : trend === 'down' ? '#fef2f2' : '#f8fafc'

  return (
    <div className="kpi-card animate-slide-up">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}
          </p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>

        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
          {Icon && <Icon size={22} style={{ color: c.icon }} />}
        </div>
      </div>

      {trendValue !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full" style={{ background: trendBg, color: trendColor }}>
            <TrendIcon size={11} />
            {trendValue}%
          </span>
          <span className="text-xs text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  )
}

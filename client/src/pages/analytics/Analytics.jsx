import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from 'recharts'

const monthlySales = [
  { month: 'Jan', sales: 145000, profit: 38000, expenses: 107000 },
  { month: 'Feb', sales: 162000, profit: 43000, expenses: 119000 },
  { month: 'Mar', sales: 198000, profit: 58000, expenses: 140000 },
  { month: 'Apr', sales: 175000, profit: 49000, expenses: 126000 },
  { month: 'May', sales: 221000, profit: 67000, expenses: 154000 },
  { month: 'Jun', sales: 248000, profit: 78000, expenses: 170000 },
]

const topProducts = [
  { name: 'Urea 50kg', sales: 48, revenue: 21600 },
  { name: 'DAP 50kg', sales: 35, revenue: 47250 },
  { name: 'BT Seeds', sales: 62, revenue: 45880 },
  { name: 'Chlorpyrifos', sales: 28, revenue: 8960 },
  { name: 'NPK 1kg', sales: 90, revenue: 7650 },
]

const dailyRevenue = [
  { day: 'Mon', revenue: 12400 },
  { day: 'Tue', revenue: 8900 },
  { day: 'Wed', revenue: 15600 },
  { day: 'Thu', revenue: 11200 },
  { day: 'Fri', revenue: 18900 },
  { day: 'Sat', revenue: 22100 },
  { day: 'Sun', revenue: 9800 },
]

const COLORS = ['#2E7D32', '#66BB6A', '#FFA726', '#42A5F5', '#AB47BC']

export default function Analytics() {
  const totalRevenue = monthlySales.reduce((a, m) => a + m.sales, 0)
  const totalProfit = monthlySales.reduce((a, m) => a + m.profit, 0)
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Analytics & Reports</h1>
        <p className="text-sm text-gray-500">Business insights at a glance</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: '6M Revenue', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, color: '#2E7D32' },
          { label: '6M Profit', value: `₹${(totalProfit / 1000).toFixed(0)}k`, color: '#2E7D32' },
          { label: 'Profit Margin', value: `${profitMargin}%`, color: '#1d4ed8' },
          { label: 'Avg Daily Sales', value: `₹${Math.round(totalRevenue / 180 / 1000)}k`, color: '#7c3aed' },
        ].map(s => (
          <div key={s.label} className="kpi-card text-center p-4">
            <p className="text-xl font-bold" style={{ color: s.color, fontFamily: 'Poppins, sans-serif' }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue + Profit */}
      <div className="kpi-card">
        <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Monthly Sales vs Profit (6 Months)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={monthlySales} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profitG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#66BB6A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} formatter={(v, n) => [`₹${v.toLocaleString('en-IN')}`, n]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="sales" stroke="#2E7D32" strokeWidth={2.5} fill="url(#salesG)" name="Sales" />
            <Area type="monotone" dataKey="profit" stroke="#66BB6A" strokeWidth={2} fill="url(#profitG)" name="Profit" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <div className="kpi-card">
          <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Top Products by Revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#2E7D32" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Revenue */}
        <div className="kpi-card">
          <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Daily Revenue (This Week)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyRevenue} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {dailyRevenue.map((entry, i) => (
                  <rect key={i} fill={i === 5 ? '#2E7D32' : '#dcfce7'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

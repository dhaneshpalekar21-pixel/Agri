export default function Badge({ label, color = 'green' }) {
  const colorMap = {
    green: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
    red: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
    orange: { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
    blue: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
    gray: { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
    purple: { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' },
    yellow: { bg: '#fefce8', text: '#854d0e', border: '#fef08a' },
  }

  const c = colorMap[color] || colorMap.gray

  return (
    <span
      className="status-badge"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {label}
    </span>
  )
}

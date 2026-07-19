/**
 * StaffOps/SustainabilityMetrics.jsx — Environmental sustainability dashboard
 * Shows energy, waste, water, carbon, and solar metrics
 */

function MetricBar({ label, icon, current, max, unit, color }) {
  const pct = Math.min(100, Math.round((current / max) * 100))
  return (
    <div className="metric-item">
      <div className="metric-header">
        <span className="metric-icon">{icon}</span>
        <span className="metric-label">{label}</span>
        <span className="metric-value">{current.toLocaleString()} {unit}</span>
      </div>
      <div className="metric-bar-bg">
        <div
          className="metric-bar-fill"
          style={{ width: `${pct}%`, background: color }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${label}: ${current} of ${max} ${unit}`}
        />
      </div>
      <span className="metric-pct">{pct}% of capacity</span>
    </div>
  )
}

function MetricCircle({ label, icon, value, unit, color }) {
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (value / 100) * circumference
  return (
    <div className="metric-circle-item">
      <svg width="88" height="88" className="metric-svg" aria-hidden="true">
        <circle cx="44" cy="44" r="36" fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx="44" cy="44" r="36" fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="metric-circle-inner">
        <span className="metric-circle-icon">{icon}</span>
        <span className="metric-circle-value">{value}{unit}</span>
      </div>
      <span className="metric-circle-label">{label}</span>
    </div>
  )
}

export default function SustainabilityMetrics({ sustainability }) {
  if (!sustainability) {
    return (
      <div className="card">
        <h2 className="card-title">🌱 Sustainability Dashboard</h2>
        <p className="text-muted">Loading metrics...</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="card-title">🌱 Sustainability Dashboard</h2>

      {/* Circular metrics */}
      <div className="metric-circles">
        <MetricCircle
          label="Waste Recycled"
          icon="♻️"
          value={sustainability.wasteRecycled}
          unit="%"
          color="#22c55e"
        />
        <MetricCircle
          label="Carbon Offset"
          icon="🌍"
          value={sustainability.carbonOffset}
          unit="%"
          color="#3b82f6"
        />
        <MetricCircle
          label="Solar Output"
          icon="☀️"
          value={Math.round((sustainability.solarOutput / 500) * 100)}
          unit="%"
          color="#f59e0b"
        />
      </div>

      {/* Bar metrics */}
      <div className="metric-bars">
        <MetricBar
          label="Energy Usage"
          icon="⚡"
          current={sustainability.energy.current}
          max={sustainability.energy.capacity}
          unit={sustainability.energy.unit}
          color="linear-gradient(90deg, #3b82f6, #6366f1)"
        />
        <MetricBar
          label="Water Usage"
          icon="💧"
          current={sustainability.waterUsage.current}
          max={sustainability.waterUsage.target}
          unit={sustainability.waterUsage.unit}
          color="linear-gradient(90deg, #06b6d4, #3b82f6)"
        />
      </div>
    </div>
  )
}

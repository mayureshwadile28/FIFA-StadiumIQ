/**
 * CommandCenter/CrowdHeatmap.jsx — Visual heatmap of stadium sections
 * Color-coded by occupancy: green (safe), yellow (warning), red (critical)
 */
import { STATUS_COLORS } from '../../utils/constants.js'

function getHeatColor(pct) {
  if (pct >= 100) return '#dc2626'
  if (pct >= 92) return '#ef4444'
  if (pct >= 80) return '#f59e0b'
  if (pct >= 60) return '#eab308'
  if (pct >= 40) return '#22c55e'
  return '#16a34a'
}

function getBarGradient(pct) {
  if (pct >= 92) return 'linear-gradient(90deg, #ef4444, #dc2626)'
  if (pct >= 80) return 'linear-gradient(90deg, #f59e0b, #ef4444)'
  if (pct >= 60) return 'linear-gradient(90deg, #22c55e, #f59e0b)'
  return 'linear-gradient(90deg, #16a34a, #22c55e)'
}

export default function CrowdHeatmap({ sections }) {
  if (!sections || sections.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">🗺️ Crowd Heatmap</h2>
        <p className="text-muted">Waiting for live data...</p>
      </div>
    )
  }

  const seatingSections = sections.filter(s => s.type === 'seating')
  const concourseSections = sections.filter(s => s.type === 'concourse')

  return (
    <div className="card heatmap-card">
      <h2 className="card-title">🗺️ Live Crowd Heatmap</h2>

      {/* Stadium visual layout */}
      <div className="stadium-visual" role="img" aria-label="Stadium occupancy heatmap">
        <div className="stadium-ring">
          {seatingSections.map((section, i) => {
            const angle = (i / seatingSections.length) * 360
            const color = getHeatColor(section.occupancyPercent)
            return (
              <div
                key={section.id}
                className="stadium-section-block"
                style={{
                  transform: `rotate(${angle}deg) translateY(-80px)`,
                  background: color,
                  opacity: 0.85 + (section.occupancyPercent / 100) * 0.15,
                }}
                title={`${section.name}: ${section.occupancyPercent}%`}
                role="presentation"
              >
                <span
                  className="section-label"
                  style={{ transform: `rotate(-${angle}deg)` }}
                >
                  {section.occupancyPercent}%
                </span>
              </div>
            )
          })}
          <div className="stadium-field">
            <span>⚽</span>
          </div>
        </div>
      </div>

      {/* Detailed list */}
      <div className="section-list">
        <h3 className="section-list-title">Seating Sections</h3>
        {seatingSections.map(section => (
          <div key={section.id} className="section-row" aria-label={`${section.name}: ${section.occupancyPercent}% occupied`}>
            <div className="section-info">
              <span className="section-name">{section.name}</span>
              <span className="section-gate">{section.gate}</span>
            </div>
            <div className="section-bar-wrapper">
              <div
                className="section-bar"
                style={{
                  width: `${Math.min(100, section.occupancyPercent)}%`,
                  background: getBarGradient(section.occupancyPercent),
                }}
                role="progressbar"
                aria-valuenow={section.occupancyPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <span
              className="section-pct"
              style={{ color: STATUS_COLORS[section.status]?.text || '#374151' }}
            >
              {section.occupancyPercent}%
            </span>
            <span
              className="status-badge"
              style={{
                background: STATUS_COLORS[section.status]?.bg || '#f3f4f6',
                color: STATUS_COLORS[section.status]?.text || '#374151',
                borderColor: STATUS_COLORS[section.status]?.border || '#d1d5db',
              }}
            >
              {section.status.replace('_', ' ')}
            </span>
          </div>
        ))}

        <h3 className="section-list-title" style={{ marginTop: '1rem' }}>Concourse Areas</h3>
        {concourseSections.map(section => (
          <div key={section.id} className="section-row" aria-label={`${section.name}: ${section.occupancyPercent}% occupied`}>
            <div className="section-info">
              <span className="section-name">{section.name}</span>
              <span className="section-gate">{section.gate}</span>
            </div>
            <div className="section-bar-wrapper">
              <div
                className="section-bar"
                style={{
                  width: `${Math.min(100, section.occupancyPercent)}%`,
                  background: getBarGradient(section.occupancyPercent),
                }}
                role="progressbar"
                aria-valuenow={section.occupancyPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <span
              className="section-pct"
              style={{ color: STATUS_COLORS[section.status]?.text || '#374151' }}
            >
              {section.occupancyPercent}%
            </span>
            <span
              className="status-badge"
              style={{
                background: STATUS_COLORS[section.status]?.bg || '#f3f4f6',
                color: STATUS_COLORS[section.status]?.text || '#374151',
                borderColor: STATUS_COLORS[section.status]?.border || '#d1d5db',
              }}
            >
              {section.status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

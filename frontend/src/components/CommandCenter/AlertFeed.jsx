/**
 * CommandCenter/AlertFeed.jsx — Real-time alert feed with severity badges
 */
import { SEVERITY_COLORS } from '../../utils/constants.js'
import { formatTime } from '../../utils/formatters.js'

export default function AlertFeed({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">🚨 Live Alerts</h2>
        <div className="empty-state">
          <span className="empty-icon">✅</span>
          <p>No active alerts — all sections operating normally</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card alert-card">
      <h2 className="card-title">
        🚨 Live Alerts
        <span className="alert-count">{alerts.length}</span>
      </h2>

      <div className="alert-list" role="log" aria-label="Stadium alerts" aria-live="polite" aria-atomic="false">
        {alerts.map((alert, index) => {
          const colors = SEVERITY_COLORS[alert.severity] || SEVERITY_COLORS.MEDIUM
          return (
            <div
              key={alert.id}
              className={`alert-item ${index === 0 ? 'alert-new' : ''}`}
              role="alert"
              style={{
                borderLeftColor: colors.border,
                background: colors.bg,
              }}
            >
              <div className="alert-header">
                <span
                  className="severity-badge"
                  style={{
                    background: colors.border,
                    color: colors.text,
                  }}
                >
                  {alert.severity}
                </span>
                <span className="alert-time">{formatTime(alert.timestamp)}</span>
              </div>
              <p className="alert-message">{alert.message}</p>
              <div className="alert-details">
                <span className="alert-gate">📍 {alert.gate}</span>
                <span className="alert-phase">⏱️ {alert.phase}</span>
              </div>
              <p className="alert-action">
                <strong>Quick action:</strong> {alert.quickAction}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

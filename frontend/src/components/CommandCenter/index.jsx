/**
 * CommandCenter/index.jsx — Main organizer dashboard
 * Shows: live crowd heatmap, alert feed, AI recommendation panel
 */
import CrowdHeatmap from './CrowdHeatmap.jsx'
import AlertFeed from './AlertFeed.jsx'
import AIRecommendation from './AIRecommendation.jsx'
import { useSocket } from '../../hooks/useSocket.js'
import { formatMatchMinute, formatNumber } from '../../utils/formatters.js'

export default function CommandCenter() {
  const { alerts, sections, snapshot, connected } = useSocket()

  return (
    <div
      role="tabpanel"
      id="panel-command"
      aria-labelledby="tab-command"
    >
      {/* Live connection status */}
      {!connected && (
        <div role="alert" className="connection-alert">
          <span className="spinner" aria-hidden="true" />
          Connecting to live stadium data...
        </div>
      )}

      {/* Match phase badge */}
      {snapshot && (
        <div className="phase-bar">
          <div className="phase-badge">
            <span className="phase-dot" />
            {snapshot.phase}
          </div>
          <span className="phase-minute">{formatMatchMinute(snapshot.matchMinute)}</span>
          <span className="phase-attendance">
            👥 {formatNumber(snapshot.totalAttendance)} fans
          </span>
        </div>
      )}

      {/* Main grid layout */}
      <div className="dashboard-grid">
        {/* Heatmap — takes 2/3 width on large screens */}
        <div className="grid-main">
          <CrowdHeatmap sections={sections} />
        </div>

        {/* Sidebar — alerts and AI */}
        <div className="grid-sidebar">
          <AlertFeed alerts={alerts} />
          <AIRecommendation />
        </div>
      </div>
    </div>
  )
}

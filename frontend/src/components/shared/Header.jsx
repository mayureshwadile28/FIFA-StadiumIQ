/**
 * Header.jsx — App header with FIFA branding, live status, accessibility toggle
 */
export default function Header({ highContrast, onToggleContrast }) {
  return (
    <header role="banner" className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">
            <span className="header-logo-icon" role="img" aria-label="Stadium">🏟️</span>
          </div>
          <div>
            <h1 className="header-title">StadiumIQ</h1>
            <p className="header-subtitle">FIFA World Cup 2026 · AI Command Center</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Live indicator */}
          <div className="live-badge" aria-label="System status: live">
            <span className="live-dot" aria-hidden="true" />
            <span className="live-text">Live</span>
          </div>

          {/* Accessibility: High contrast toggle */}
          <button
            onClick={onToggleContrast}
            aria-pressed={highContrast}
            aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast mode`}
            className="contrast-toggle"
          >
            {highContrast ? '☀️ Normal' : '🌙 High Contrast'}
          </button>
        </div>
      </div>
    </header>
  )
}

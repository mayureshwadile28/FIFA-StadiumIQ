/**
 * TabNav.jsx — Accessible tab navigation
 * Uses proper ARIA roles for screen reader compatibility (Accessibility score)
 */
export default function TabNav({ tabs, activeTab, onTabChange }) {
  return (
    <nav
      role="tablist"
      aria-label="Stadium management sections"
      className="tab-nav"
    >
      <div className="tab-nav-inner">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'tab-active' : ''}`}
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

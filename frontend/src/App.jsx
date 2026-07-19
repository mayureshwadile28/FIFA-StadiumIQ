/**
 * App.jsx — Root component with tab navigation
 * Three tabs: Command Center, Fan Assistant, Staff Ops
 */
import { useState } from 'react'
import CommandCenter from './components/CommandCenter/index.jsx'
import FanAssistant from './components/FanAssistant/index.jsx'
import StaffOps from './components/StaffOps/index.jsx'
import Header from './components/shared/Header.jsx'
import TabNav from './components/shared/TabNav.jsx'

const TABS = [
  { id: 'command', label: 'Command Center', icon: '🎯' },
  { id: 'fan',     label: 'Fan Assistant',  icon: '💬' },
  { id: 'staff',   label: 'Staff Ops',      icon: '👥' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('command')
  const [highContrast, setHighContrast] = useState(false)

  return (
    <div className={`app ${highContrast ? 'high-contrast' : ''}`}>
      {/* Skip to main content — required for WCAG 2.1 AA */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header
        highContrast={highContrast}
        onToggleContrast={() => setHighContrast(prev => !prev)}
      />
      <TabNav
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main id="main-content" role="main" className="main-content">
        {activeTab === 'command' && <CommandCenter />}
        {activeTab === 'fan'     && <FanAssistant />}
        {activeTab === 'staff'   && <StaffOps />}
      </main>
    </div>
  )
}

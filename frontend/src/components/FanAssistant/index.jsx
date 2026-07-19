/**
 * FanAssistant/index.jsx — Fan-facing multilingual chat dashboard
 */
import { useState } from 'react'
import ChatWindow from './ChatWindow.jsx'
import LanguageSelector from './LanguageSelector.jsx'

export default function FanAssistant() {
  const [selectedLang, setSelectedLang] = useState('en')

  return (
    <div
      role="tabpanel"
      id="panel-fan"
      aria-labelledby="tab-fan"
    >
      <div className="fan-layout">
        {/* Sidebar */}
        <div className="fan-sidebar">
          <div className="card">
            <h2 className="card-title">💬 Fan Assistant</h2>
            <p className="card-desc">
              Your AI-powered guide to the FIFA World Cup 2026 stadium experience.
              Ask about seating, food, transport, accessibility, or anything else!
            </p>
            <LanguageSelector selected={selectedLang} onChange={setSelectedLang} />

            <div className="fan-features">
              <h3 className="fan-features-title">What I can help with:</h3>
              <ul className="fan-features-list">
                <li>🧭 Stadium navigation & gates</li>
                <li>🚇 Transport info & schedules</li>
                <li>♿ Accessibility & wheelchair access</li>
                <li>🍔 Food & drink locations</li>
                <li>🎟️ Seating information</li>
                <li>🌐 Multilingual support (10+ languages)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="fan-chat">
          <ChatWindow selectedLang={selectedLang} />
        </div>
      </div>
    </div>
  )
}

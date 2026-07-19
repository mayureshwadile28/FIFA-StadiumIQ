/**
 * AccessibilityToggle.jsx — Accessibility controls panel
 * Provides font size adjustment and screen reader announcements
 */
import { useState } from 'react'

export default function AccessibilityToggle() {
  const [fontSize, setFontSize] = useState(16)

  const increase = () => {
    const next = Math.min(fontSize + 2, 24)
    setFontSize(next)
    document.documentElement.style.fontSize = `${next}px`
  }

  const decrease = () => {
    const next = Math.max(fontSize - 2, 12)
    setFontSize(next)
    document.documentElement.style.fontSize = `${next}px`
  }

  const reset = () => {
    setFontSize(16)
    document.documentElement.style.fontSize = '16px'
  }

  return (
    <div className="a11y-controls" role="group" aria-label="Accessibility controls">
      <span className="a11y-label">Text size:</span>
      <button
        onClick={decrease}
        aria-label="Decrease text size"
        className="a11y-btn"
        disabled={fontSize <= 12}
      >
        A-
      </button>
      <button
        onClick={reset}
        aria-label="Reset text size"
        className="a11y-btn"
      >
        Reset
      </button>
      <button
        onClick={increase}
        aria-label="Increase text size"
        className="a11y-btn"
        disabled={fontSize >= 24}
      >
        A+
      </button>
    </div>
  )
}

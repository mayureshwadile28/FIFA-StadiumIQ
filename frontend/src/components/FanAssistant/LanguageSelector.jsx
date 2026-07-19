/**
 * FanAssistant/LanguageSelector.jsx — Dropdown for selecting preferred language
 * The AI will auto-detect the language, but this helps with quick suggestions
 */
import { LANGUAGES } from '../../utils/constants.js'

export default function LanguageSelector({ selected, onChange }) {
  return (
    <div className="lang-selector">
      <label htmlFor="language-select" className="lang-label">
        🌍 Language
      </label>
      <select
        id="language-select"
        value={selected}
        onChange={e => onChange(e.target.value)}
        className="lang-dropdown"
        aria-label="Select your preferred language"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
      <p className="lang-hint">
        Tip: You can type in any language — the AI will auto-detect and respond in the same language!
      </p>
    </div>
  )
}

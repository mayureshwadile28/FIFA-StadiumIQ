/**
 * CommandCenter/AIRecommendation.jsx — AI-powered decision panel
 * Calls Gemini via backend and displays structured action plan
 */
import { useState } from 'react'
import { useAI } from '../../hooks/useAI.js'
import { SEVERITY_COLORS } from '../../utils/constants.js'

export default function AIRecommendation() {
  const { getDecision, loading, error } = useAI()
  const [decision, setDecision] = useState(null)

  const handleGetDecision = async () => {
    const result = await getDecision()
    if (result) setDecision(result)
  }

  return (
    <div className="card ai-card">
      <h2 className="card-title">🤖 AI Recommendation Engine</h2>
      <p className="card-desc">
        Powered by Gemini 2.5 Pro — analyses live crowd data and generates actionable plans
      </p>

      <button
        onClick={handleGetDecision}
        disabled={loading}
        className="ai-button"
        aria-busy={loading}
      >
        {loading ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Analysing crowd data...
          </>
        ) : (
          <>
            <span aria-hidden="true">⚡</span>
            Get AI Recommendation
          </>
        )}
      </button>

      {error && (
        <div className="ai-error" role="alert">
          <span>⚠️</span> {error}
        </div>
      )}

      {decision && (
        <div className="ai-result" aria-live="polite">
          {/* Severity header */}
          <div className="ai-severity-row">
            <span
              className="ai-severity-badge"
              style={{
                background: SEVERITY_COLORS[decision.severity]?.bg || '#f3f4f6',
                color: SEVERITY_COLORS[decision.severity]?.text || '#374151',
                borderColor: SEVERITY_COLORS[decision.severity]?.border || '#d1d5db',
              }}
            >
              {decision.severity}
            </span>
            <span className="ai-priority">
              Priority: <strong>{decision.priority_section}</strong>
            </span>
          </div>

          {/* Reasoning */}
          <div className="ai-reasoning">
            <span className="ai-reasoning-icon">💡</span>
            <p>{decision.reasoning}</p>
          </div>

          {/* Actions */}
          <div className="ai-actions">
            <h3>Recommended Actions</h3>
            <ol className="ai-actions-list">
              {decision.actions?.map((action, i) => (
                <li key={i} className="ai-action-item">
                  <span className="action-number">{i + 1}</span>
                  <span>{action}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Relief time */}
          <div className="ai-relief">
            <span className="ai-relief-icon">⏱️</span>
            Estimated relief: <strong>{decision.estimated_relief_time}</strong>
          </div>
        </div>
      )}
    </div>
  )
}

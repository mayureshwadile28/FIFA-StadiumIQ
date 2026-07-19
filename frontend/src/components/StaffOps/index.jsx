/**
 * StaffOps/index.jsx — Staff operations dashboard
 * Volunteer assignments, AI shift optimiser, sustainability metrics
 */
import { useState } from 'react'
import VolunteerList from './VolunteerList.jsx'
import SustainabilityMetrics from './SustainabilityMetrics.jsx'
import { useSocket } from '../../hooks/useSocket.js'
import { useAI } from '../../hooks/useAI.js'
import { SEVERITY_COLORS } from '../../utils/constants.js'

export default function StaffOps() {
  const { snapshot } = useSocket()
  const { optimiseStaff, loading, error } = useAI()
  const [optimisation, setOptimisation] = useState(null)

  const handleOptimise = async () => {
    const result = await optimiseStaff()
    if (result) setOptimisation(result)
  }

  return (
    <div
      role="tabpanel"
      id="panel-staff"
      aria-labelledby="tab-staff"
    >
      <div className="staff-layout">
        {/* Left column: volunteers */}
        <div className="staff-main">
          <VolunteerList staff={snapshot?.staff} />

          {/* AI Optimiser */}
          <div className="card ai-card">
            <h2 className="card-title">🤖 AI Shift Optimiser</h2>
            <p className="card-desc">
              Analyses crowd patterns and suggests optimal staff redeployments
            </p>

            <button
              onClick={handleOptimise}
              disabled={loading}
              className="ai-button"
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Optimising shifts...
                </>
              ) : (
                <>
                  <span aria-hidden="true">⚡</span>
                  Optimise Shifts
                </>
              )}
            </button>

            {error && (
              <div className="ai-error" role="alert">
                <span>⚠️</span> {error}
              </div>
            )}

            {optimisation && (
              <div className="ai-result" aria-live="polite">
                {/* Priority action */}
                <div className="ai-reasoning">
                  <span className="ai-reasoning-icon">🎯</span>
                  <div>
                    <strong>Priority Action</strong>
                    <p>{optimisation.priority_action}</p>
                  </div>
                </div>

                {/* Redeployments */}
                {optimisation.redeployments?.length > 0 && (
                  <div className="redeployments">
                    <h3>Suggested Redeployments</h3>
                    {optimisation.redeployments.map((rd, i) => (
                      <div key={i} className="redeploy-card">
                        <div className="redeploy-header">
                          <span className="redeploy-role">{rd.volunteer_role}</span>
                          <span className="redeploy-count">×{rd.count}</span>
                        </div>
                        <div className="redeploy-flow">
                          <span className="redeploy-from">{rd.from_zone}</span>
                          <span className="redeploy-arrow">→</span>
                          <span className="redeploy-to">{rd.to_zone}</span>
                        </div>
                        <p className="redeploy-reason">{rd.reason}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sustainability tip */}
                <div className="sustainability-tip">
                  <span className="tip-icon">🌱</span>
                  <div>
                    <strong>Sustainability Tip</strong>
                    <p>{optimisation.sustainability_tip}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: sustainability */}
        <div className="staff-sidebar">
          <SustainabilityMetrics sustainability={snapshot?.sustainability} />
        </div>
      </div>
    </div>
  )
}

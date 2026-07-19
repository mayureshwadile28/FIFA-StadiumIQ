/**
 * ai.js — AI API routes
 * All routes call geminiService.js — the Gemini key never leaves the backend.
 */
import { Router } from 'express'
import { sanitiseMiddleware } from '../middleware/sanitise.js'
import { analyzeCrowd, fanChat, optimizeStaff } from '../services/geminiService.js'
import { getContextForAI, getStadiumSnapshot } from '../mockData/stadiumData.js'

const router = Router()

// POST /api/ai/decision — Command Center AI recommendation
router.post('/decision', sanitiseMiddleware, async (req, res) => {
  try {
    const context = getContextForAI()
    const result = await analyzeCrowd(context)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('[AI Route] /decision error:', error)
    res.status(500).json({ success: false, error: 'AI service temporarily unavailable' })
  }
})

// POST /api/ai/chat — Fan Assistant multilingual chat
router.post('/chat', sanitiseMiddleware, async (req, res) => {
  const { message } = req.body
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Message is required' })
  }
  try {
    const snapshot = getStadiumSnapshot()
    const context = `
      Match phase: ${snapshot.phase}
      Total attendance: ${snapshot.totalAttendance.toLocaleString()} fans
      Active alerts: ${snapshot.activeAlerts.length}
      Next metro: ${snapshot.transport.metro[0].nextArrival} minutes
      Open gates: ${snapshot.sections.filter(s => s.status === 'safe').map(s => s.gate).join(', ')}
    `
    const reply = await fanChat(message, context)
    res.json({ success: true, data: { reply } })
  } catch (error) {
    console.error('[AI Route] /chat error:', error)
    res.status(500).json({ success: false, error: 'AI service temporarily unavailable' })
  }
})

// POST /api/ai/optimise — Staff Ops optimisation
router.post('/optimise', sanitiseMiddleware, async (req, res) => {
  try {
    const snapshot = getStadiumSnapshot()
    const context = JSON.stringify({
      phase: snapshot.phase,
      staff: snapshot.staff,
      criticalSections: snapshot.sections.filter(s =>
        s.status === 'critical' || s.status === 'over_capacity'
      ),
      sustainability: snapshot.sustainability,
    })
    const result = await optimizeStaff(context)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('[AI Route] /optimise error:', error)
    res.status(500).json({ success: false, error: 'AI service temporarily unavailable' })
  }
})

export default router

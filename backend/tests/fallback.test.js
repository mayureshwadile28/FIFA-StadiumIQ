/**
 * fallback.test.js — Rigorous unit tests for the local fallback AI engine
 * Verifies all failover paths, context-aware actions, and multilingual support
 */
import { jest } from '@jest/globals'

// Mock the Google Generative AI module to throw an error, triggering the fallback engine
jest.unstable_mockModule('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockRejectedValue(new Error('API Quota Exceeded / Network Error')),
    }),
  })),
}))

// Import after mocking
const { analyzeCrowd, fanChat, optimizeStaff, clearCache } = await import('../services/geminiService.js')

describe('Gemini Service Fallback Engine', () => {
  beforeEach(() => {
    clearCache()
  })

  describe('analyzeCrowd Fallback', () => {
    it('should return a LOW severity fallback when there are no critical sections', async () => {
      const emptyContext = JSON.stringify({
        matchPhase: 'Kickoff',
        criticalSections: [],
      })

      const result = await analyzeCrowd(emptyContext)

      expect(result).toHaveProperty('severity', 'LOW')
      expect(result.priority_section).toContain('None')
      expect(result.actions).toHaveLength(3)
      expect(result.estimated_relief_time).toBe('0 minutes')
      expect(result.reasoning).toContain('safe and optimal')
    })

    it('should return a HIGH/CRITICAL severity fallback referencing the most congested section', async () => {
      const crowdContext = JSON.stringify({
        matchPhase: 'Halftime',
        criticalSections: [
          { name: 'North Lower A', gate: 'Gate 1', occupancyPercent: 96, type: 'seating' },
        ],
        standbyStaff: [
          { name: 'Liam B.', role: 'crowd guide' },
        ],
      })

      const result = await analyzeCrowd(crowdContext)

      expect(result.severity).toBe('HIGH')
      expect(result.priority_section).toBe('North Lower A')
      expect(result.actions[0]).toContain('Gate 1')
      expect(result.actions[1]).toContain('Liam B.')
      expect(result.actions[1]).toContain('crowd guide')
      expect(result.reasoning).toContain('North Lower A')
      expect(result.reasoning).toContain('96%')
    })
  })

  describe('fanChat Fallback (Multilingual & Context-Aware)', () => {
    const context = `
      Match phase: Halftime
      Total attendance: 45,000 fans
      Active alerts: 0
      Next metro: 6 minutes
      Open gates: Gate 1, Gate 4, Gate 8
    `

    it('should detect English and answer transport questions', async () => {
      const response = await fanChat('When is the next metro?', context)
      expect(response).toContain('Stadium Central in 6 minutes')
    })

    it('should detect English and prioritize accessibility routes', async () => {
      const response = await fanChat('Is there a wheelchair access route?', context)
      expect(response).toContain('Gate 4 or Gate 8')
      expect(response).toContain('wheelchair')
    })

    it('should detect Spanish (Español) and answer in Spanish', async () => {
      const response = await fanChat('¿Hola, donde está la puerta abierta?', context)
      expect(response).toContain('Las puertas de acceso seguras abiertas son')
      expect(response).toContain('Gate 1')
    })

    it('should detect French (Français) and answer in French', async () => {
      const response = await fanChat('Bonjour, où est le métro?', context)
      expect(response).toContain('Stadium Central dans 6 minutes')
    })

    it('should detect Portuguese (Português) and answer in Portuguese', async () => {
      const response = await fanChat('Oi, tem acessibilidade para cadeiras de rodas?', context)
      expect(response).toContain('Portão 4 ou Portão 8')
      expect(response).toContain('acessibilidade')
    })
  })

  describe('optimizeStaff Fallback', () => {
    it('should suggest standard volunteer shift coverage if there are no critical sections', async () => {
      const emptyContext = JSON.stringify({
        phase: 'Gates open',
        criticalSections: [],
      })

      const result = await optimizeStaff(emptyContext)

      expect(result.redeployments).toHaveLength(1)
      expect(result.redeployments[0].volunteer_role).toBe('crowd guide')
      expect(result.redeployments[0].to_zone).toBe('Gate 1')
      expect(result.priority_action).toContain('halftime crowd patterns')
    })

    it('should suggest active volunteer redeployment to critical sections', async () => {
      const staffContext = JSON.stringify({
        phase: 'Halftime',
        criticalSections: [
          { name: 'North Lower A', gate: 'Gate 1', occupancyPercent: 96 },
        ],
        sustainability: {
          energy: { current: 3200 },
          wasteRecycled: 75,
        },
      })

      const result = await optimizeStaff(staffContext)

      expect(result.redeployments).toHaveLength(2)
      expect(result.redeployments[0].to_zone).toBe('North Lower A')
      expect(result.redeployments[1].to_zone).toBe('Gate 1')
      expect(result.priority_action).toContain('North Lower A')
      expect(result.sustainability_tip).toContain('energy consumption is high')
    })
  })
})

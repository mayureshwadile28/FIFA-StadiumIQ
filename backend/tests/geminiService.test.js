/**
 * geminiService.test.js — Unit tests for Gemini AI service
 * Tests use mocked API responses (no real API calls in tests)
 */
import { jest } from '@jest/globals'

// Mock the Google Generative AI module
const mockGenerateContent = jest.fn()
jest.unstable_mockModule('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    }),
  })),
}))

// Import after mocking
const { analyzeCrowd, fanChat, optimizeStaff, clearCache } = await import('../services/geminiService.js')

describe('geminiService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    clearCache()
  })

  describe('analyzeCrowd', () => {
    it('should return structured crowd analysis JSON', async () => {
      const mockResponse = {
        severity: 'HIGH',
        priority_section: 'North Lower A',
        actions: [
          'Open Gate 2 for overflow from Gate 1',
          'Deploy 3 stewards to North Lower A',
          'Announce alternative seating via PA system',
        ],
        estimated_relief_time: '12 minutes',
        reasoning: 'North Lower A is at 96% capacity during halftime rush',
      }

      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockResponse) },
      })

      const result = await analyzeCrowd('{"test": "data"}')

      expect(result).toEqual(mockResponse)
      expect(result.severity).toBe('HIGH')
      expect(result.actions).toHaveLength(3)
      expect(result.priority_section).toBe('North Lower A')
      expect(mockGenerateContent).toHaveBeenCalledTimes(1)
    })

    it('should handle markdown-wrapped JSON response', async () => {
      const mockResponse = {
        severity: 'LOW',
        priority_section: 'East Stand',
        actions: ['Continue monitoring'],
        estimated_relief_time: '0 minutes',
        reasoning: 'All sections within safe capacity',
      }

      mockGenerateContent.mockResolvedValue({
        response: { text: () => '```json\n' + JSON.stringify(mockResponse) + '\n```' },
      })

      const result = await analyzeCrowd('{"test": "data"}')
      expect(result.severity).toBe('LOW')
    })

    it('should throw on invalid JSON response', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => 'This is not JSON' },
      })

      await expect(analyzeCrowd('{"test": "data"}')).rejects.toThrow()
    })
  })

  describe('fanChat', () => {
    it('should return a string response', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => 'Gate 4 is the closest entrance to the East Stand!' },
      })

      const result = await fanChat('Where is Gate 4?', 'stadium context here')

      expect(typeof result).toBe('string')
      expect(result).toContain('Gate 4')
      expect(mockGenerateContent).toHaveBeenCalledTimes(1)
    })

    it('should trim whitespace from response', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => '  Hello!  \n' },
      })

      const result = await fanChat('Hi', 'context')
      expect(result).toBe('Hello!')
    })
  })

  describe('optimizeStaff', () => {
    it('should return structured staff optimization JSON', async () => {
      const mockResponse = {
        redeployments: [
          {
            volunteer_role: 'crowd guide',
            from_zone: 'Gate 3',
            to_zone: 'Gate 1',
            count: 1,
            reason: 'Gate 1 experiencing high inflow',
          },
        ],
        priority_action: 'Activate standby stewards at South exit',
        sustainability_tip: 'Switch off concourse B lighting — area is empty',
      }

      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(mockResponse) },
      })

      const result = await optimizeStaff('{"test": "staff data"}')

      expect(result.redeployments).toHaveLength(1)
      expect(result.redeployments[0].volunteer_role).toBe('crowd guide')
      expect(result.priority_action).toBeTruthy()
      expect(result.sustainability_tip).toBeTruthy()
    })
  })
})

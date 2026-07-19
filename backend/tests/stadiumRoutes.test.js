/**
 * stadiumRoutes.test.js — Integration tests for stadium data routes
 * Uses supertest to test HTTP endpoints directly
 */
import { jest } from '@jest/globals'

// Mock the Gemini service to avoid real API calls
jest.unstable_mockModule('../services/geminiService.js', () => ({
  analyzeCrowd: jest.fn().mockResolvedValue({
    severity: 'MEDIUM',
    priority_section: 'North Lower A',
    actions: ['Test action'],
    estimated_relief_time: '5 minutes',
    reasoning: 'Test reasoning',
  }),
  fanChat: jest.fn().mockResolvedValue('Test response from AI'),
  optimizeStaff: jest.fn().mockResolvedValue({
    redeployments: [],
    priority_action: 'Test action',
    sustainability_tip: 'Test tip',
  }),
}))

// Mock socket.io to prevent simulation from starting
jest.unstable_mockModule('socket.io', () => ({
  Server: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    emit: jest.fn(),
  })),
}))

const { default: supertest } = await import('supertest')
const { default: express } = await import('express')
const { default: stadiumRoutes } = await import('../routes/stadium.js')
const { default: aiRoutes } = await import('../routes/ai.js')

// Create a minimal test app
const app = express()
app.use(express.json())
app.use('/api/stadium', stadiumRoutes)
app.use('/api/ai', aiRoutes)

describe('Stadium Routes', () => {
  describe('GET /api/stadium/snapshot', () => {
    it('should return stadium snapshot data', async () => {
      const res = await supertest(app).get('/api/stadium/snapshot')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('matchMinute')
      expect(res.body.data).toHaveProperty('phase')
      expect(res.body.data).toHaveProperty('sections')
      expect(res.body.data).toHaveProperty('transport')
      expect(res.body.data).toHaveProperty('staff')
      expect(res.body.data).toHaveProperty('sustainability')
      expect(res.body.data).toHaveProperty('totalAttendance')
    })

    it('should include all 12 stadium sections', async () => {
      const res = await supertest(app).get('/api/stadium/snapshot')
      expect(res.body.data.sections).toHaveLength(12)
    })

    it('should have valid occupancy data for each section', async () => {
      const res = await supertest(app).get('/api/stadium/snapshot')
      res.body.data.sections.forEach(section => {
        expect(section).toHaveProperty('id')
        expect(section).toHaveProperty('name')
        expect(section).toHaveProperty('capacity')
        expect(section).toHaveProperty('occupancyPercent')
        expect(section).toHaveProperty('status')
        expect(['safe', 'warning', 'critical', 'over_capacity']).toContain(section.status)
      })
    })
  })

  describe('GET /api/stadium/transport', () => {
    it('should return transport data', async () => {
      const res = await supertest(app).get('/api/stadium/transport')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('metro')
      expect(res.body.data).toHaveProperty('buses')
      expect(res.body.data).toHaveProperty('parkingLots')
      expect(res.body.data.metro).toHaveLength(3)
      expect(res.body.data.buses).toHaveLength(3)
    })
  })

  describe('GET /api/stadium/staff', () => {
    it('should return staff data', async () => {
      const res = await supertest(app).get('/api/stadium/staff')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('volunteers')
      expect(res.body.data).toHaveProperty('medicalPosts')
      expect(res.body.data.volunteers).toHaveLength(8)
    })
  })

  describe('GET /api/stadium/sustainability', () => {
    it('should return sustainability metrics', async () => {
      const res = await supertest(app).get('/api/stadium/sustainability')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('energy')
      expect(res.body.data).toHaveProperty('wasteRecycled')
      expect(res.body.data).toHaveProperty('waterUsage')
      expect(res.body.data).toHaveProperty('carbonOffset')
    })
  })
})

describe('AI Routes', () => {
  describe('POST /api/ai/decision', () => {
    it('should return AI crowd analysis', async () => {
      const res = await supertest(app).post('/api/ai/decision')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('severity')
      expect(res.body.data).toHaveProperty('actions')
    })
  })

  describe('POST /api/ai/chat', () => {
    it('should return AI chat response', async () => {
      const res = await supertest(app)
        .post('/api/ai/chat')
        .send({ message: 'Where is Gate 4?' })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('reply')
    })

    it('should reject empty messages', async () => {
      const res = await supertest(app)
        .post('/api/ai/chat')
        .send({ message: '' })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
    })

    it('should reject missing message field', async () => {
      const res = await supertest(app)
        .post('/api/ai/chat')
        .send({})

      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/ai/optimise', () => {
    it('should return staff optimisation suggestions', async () => {
      const res = await supertest(app).post('/api/ai/optimise')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty('redeployments')
      expect(res.body.data).toHaveProperty('priority_action')
      expect(res.body.data).toHaveProperty('sustainability_tip')
    })
  })
})

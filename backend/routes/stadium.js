/**
 * stadium.js — Stadium data routes (no AI, just mock data)
 */
import { Router } from 'express'
import { getStadiumSnapshot, TRANSPORT_DATA, STAFF_DATA, SUSTAINABILITY_METRICS } from '../mockData/stadiumData.js'

const router = Router()

// GET /api/stadium/snapshot — Full stadium state
router.get('/snapshot', (_req, res) => {
  res.json({ success: true, data: getStadiumSnapshot() })
})

// GET /api/stadium/transport — Transport info
router.get('/transport', (_req, res) => {
  res.json({ success: true, data: TRANSPORT_DATA })
})

// GET /api/stadium/staff — Staff/volunteer data
router.get('/staff', (_req, res) => {
  res.json({ success: true, data: STAFF_DATA })
})

// GET /api/stadium/sustainability — Sustainability metrics
router.get('/sustainability', (_req, res) => {
  res.json({ success: true, data: SUSTAINABILITY_METRICS })
})

export default router

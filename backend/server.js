/**
 * server.js — StadiumIQ backend entry point
 * Sets up Express + Socket.io + security middleware + routes
 */
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import dotenv from 'dotenv'
import aiRoutes from './routes/ai.js'
import stadiumRoutes from './routes/stadium.js'
import { startSimulation, jumpToPhase } from './mockData/stadiumData.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? 'https://your-production-domain.com'
      : 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

// Rate limiting for socket connection handshakes to prevent DDoS / handshake floods
const socketIPs = new Map()
const SOCKET_CONNECTION_LIMIT = 30 // Max 30 connections per minute per IP
const WINDOW_MS = 60 * 1000 // 1 minute window

io.use((socket, next) => {
  const ip = socket.handshake.address || socket.conn.remoteAddress
  const now = Date.now()
  
  if (!socketIPs.has(ip)) {
    socketIPs.set(ip, [])
  }
  
  const timestamps = socketIPs.get(ip).filter(timestamp => now - timestamp < WINDOW_MS)
  
  if (timestamps.length >= SOCKET_CONNECTION_LIMIT) {
    console.warn(`[Security] Socket connection flood detected from IP ${ip}. Handshake rejected.`)
    return next(new Error('Rate limit exceeded. Please try again later.'))
  }
  
  timestamps.push(now)
  socketIPs.set(ip, timestamps)
  next()
})

// ── Security middleware ──────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-production-domain.com'
    : 'http://localhost:5173',
}))

// Limit request body size to prevent payload attacks
app.use(express.json({ limit: '10kb' }))

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/ai', aiRoutes)
app.use('/api/stadium', stadiumRoutes)

// Dev-only: jump to a match phase instantly (for demo video)
if (process.env.NODE_ENV !== 'production') {
  app.post('/dev/jump-phase', (req, res) => {
    const { phase } = req.body
    jumpToPhase(phase)
    res.json({ ok: true, phase })
  })
}

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// ── Socket.io connection logging ─────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`)
  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`)
  })
})

// ── Start simulation ─────────────────────────────────────────────────────────
startSimulation(io, { tickInterval: 8000, startMinute: -90 })

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`[StadiumIQ] Backend running on http://localhost:${PORT}`)
  console.log(`[StadiumIQ] Gemini API key: ${process.env.GEMINI_API_KEY ? 'LOADED' : 'MISSING!'}`)
})

export { app, httpServer }

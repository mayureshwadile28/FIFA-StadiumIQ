/**
 * useSocket.js — Subscribes to live crowd data from the backend via Socket.io
 * Dynamically falls back to HTTP REST polling on serverless hosting (e.g., Vercel)
 */
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'

// Dynamically determine socket server endpoint
const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL
  }
  const host = window.location.hostname
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:3001'
  }
  // On serverless deploys (like Vercel), socket connection won't connect,
  // but we still try to connect to the relative origin.
  return `${window.location.protocol}//${window.location.host}`
}

const socket = io(getSocketUrl(), { autoConnect: true })

export function useSocket() {
  const [alerts, setAlerts] = useState([])
  const [sections, setSections] = useState([])
  const [snapshot, setSnapshot] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('crowd-alert', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 20))
    })

    socket.on('sections-update', (data) => {
      setSections(data)
    })

    socket.on('stadium-snapshot', (data) => {
      setSnapshot(data)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('crowd-alert')
      socket.off('sections-update')
      socket.off('stadium-snapshot')
    }
  }, [])

  // Progressive enhancement: Fallback to HTTP polling if Socket.io is unavailable
  useEffect(() => {
    if (connected) return

    // If socket.io is disconnected (or unsupported by serverless hosting), poll every 5s
    const API_BASE = import.meta.env.VITE_API_BASE || (
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3001/api'
        : `${window.location.protocol}//${window.location.host}/api`
    )

    const fetchSnapshot = async () => {
      try {
        const res = await axios.get(`${API_BASE}/stadium/snapshot`)
        if (res.data && res.data.success) {
          setSnapshot(res.data.data)
          setSections(res.data.data.sections)
          setAlerts(res.data.data.activeAlerts || [])
        }
      } catch (err) {
        console.warn('[useSocket] Fallback HTTP polling failed:', err.message)
      }
    }

    fetchSnapshot()
    const interval = setInterval(fetchSnapshot, 5000)

    return () => clearInterval(interval)
  }, [connected])

  return { alerts, sections, snapshot, connected }
}

/**
 * useSocket.js — Subscribes to live crowd data from the backend via Socket.io
 */
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SOCKET_URL || `http://${window.location.hostname}:3001`)

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

  return { alerts, sections, snapshot, connected }
}

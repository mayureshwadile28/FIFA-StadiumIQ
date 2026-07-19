/**
 * useAI.js — Hook for calling backend AI endpoints
 * IMPORTANT: This calls the BACKEND, not Gemini directly.
 * The Gemini API key never touches the frontend.
 */
import { useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || `http://${window.location.hostname}:3001/api`

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Get AI recommendation for crowd management
   */
  async function getDecision() {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(`${API_BASE}/ai/decision`)
      return res.data.data
    } catch (err) {
      setError(err.response?.data?.error || 'AI service unavailable')
      return null
    } finally {
      setLoading(false)
    }
  }

  /**
   * Send a fan chat message
   * @param {string} message - Fan's message in any language
   */
  async function sendChatMessage(message) {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(`${API_BASE}/ai/chat`, { message })
      return res.data.data.reply
    } catch (err) {
      setError(err.response?.data?.error || 'AI service unavailable')
      return null
    } finally {
      setLoading(false)
    }
  }

  /**
   * Get staff optimisation suggestions
   */
  async function optimiseStaff() {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post(`${API_BASE}/ai/optimise`)
      return res.data.data
    } catch (err) {
      setError(err.response?.data?.error || 'AI service unavailable')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { getDecision, sendChatMessage, optimiseStaff, loading, error }
}

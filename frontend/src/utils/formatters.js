/**
 * formatters.js — Utility functions for formatting display values
 */

/**
 * Formats a number with locale-aware thousand separators
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  return num.toLocaleString()
}

/**
 * Formats a timestamp into a short readable time string
 * @param {string} isoString - ISO 8601 timestamp
 * @returns {string} e.g. "14:32:05"
 */
export function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/**
 * Returns a human-readable match minute label
 * @param {number} minute - Match minute (negative = pre-match)
 * @returns {string}
 */
export function formatMatchMinute(minute) {
  if (minute < 0) return `${Math.abs(minute)} min to kickoff`
  if (minute <= 45) return `${minute}'`
  if (minute <= 60) return 'HT'
  if (minute <= 90) return `${minute}'`
  return `${minute}' (FT)`
}

/**
 * Returns a percentage string with clamping
 * @param {number} value
 * @param {number} max
 * @returns {string}
 */
export function formatPercent(value, max = 100) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)))
  return `${pct}%`
}

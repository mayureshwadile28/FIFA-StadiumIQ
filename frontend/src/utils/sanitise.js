/**
 * sanitise.js — Frontend input sanitisation
 * Strips HTML and limits length before sending to backend.
 */
export function sanitiseInput(input, maxLength = 500) {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, maxLength)
}

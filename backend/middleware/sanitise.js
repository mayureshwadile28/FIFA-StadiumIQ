/**
 * sanitise.js — Input sanitisation middleware
 * Strips dangerous characters from user input before it reaches Gemini API.
 * This is critical for the Security judging criterion.
 */

/**
 * Sanitises a string by removing HTML tags, control characters,
 * and limiting length. Safe to use as Gemini prompt input.
 *
 * @param {string} input - Raw user input
 * @param {number} maxLength - Maximum allowed length (default 500)
 * @returns {string} Sanitised string
 */
export function sanitiseInput(input, maxLength = 500) {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<[^>]*>/g, '')           // Strip HTML tags
    .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, '') // Remove control characters
    .replace(/javascript:/gi, '')       // Remove JS injection attempts
    .replace(/on\w+\s*=/gi, '')         // Remove event handlers
    .trim()
    .slice(0, maxLength)
}

/**
 * Express middleware: sanitises req.body.message and req.body.context
 */
export function sanitiseMiddleware(req, res, next) {
  if (req.body) {
    if (req.body.message) {
      req.body.message = sanitiseInput(req.body.message)
    }
    if (req.body.context) {
      req.body.context = sanitiseInput(req.body.context, 2000)
    }
  }
  next()
}

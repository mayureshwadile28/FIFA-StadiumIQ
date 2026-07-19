# Security Policy — StadiumIQ

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Email**: security@stadiumiq.dev
2. **Do NOT** create a public GitHub issue for security vulnerabilities
3. Include steps to reproduce the issue

## Security Measures Implemented

### API Key Protection
- Gemini API key is stored in environment variables only
- The key **never** leaves the backend server
- `.env` is in `.gitignore` — never committed to version control
- Frontend calls backend routes, not Gemini directly

### Input Sanitisation
- All user inputs are sanitised before reaching Gemini API
- HTML tags, control characters, and JS injection patterns are stripped
- Input length is capped at 500 characters (2000 for context)
- Backend middleware (`sanitise.js`) enforces sanitisation on every AI route

### Rate Limiting
- 100 requests per 15 minutes per IP on all `/api/` routes
- Prevents abuse and protects against denial-of-service attacks

### HTTP Security Headers
- **Helmet.js** sets secure HTTP headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Strict-Transport-Security` (in production)
  - Content Security Policy headers

### Request Body Limits
- JSON body size limited to 10KB to prevent payload attacks

### CORS
- Origin restricted to the frontend domain only
- Only GET and POST methods are allowed

## Dependencies

All dependencies are from trusted, widely-used npm packages:
- `express` — most popular Node.js framework
- `helmet` — industry-standard security headers
- `express-rate-limit` — established rate limiting library
- `@google/generative-ai` — official Google SDK

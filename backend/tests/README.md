# Backend Tests

## Running Tests

```bash
npm test
```

## Test Files

- `geminiService.test.js` — Unit tests for the Gemini AI service (mocked API)
- `stadiumRoutes.test.js` — Integration tests for all HTTP endpoints

## Mocking Strategy

All Gemini API calls are mocked using `jest.unstable_mockModule()` (ESM-compatible).
Tests never make real API calls — they verify:
- Correct request/response formats
- Error handling
- Input validation
- Data structure integrity

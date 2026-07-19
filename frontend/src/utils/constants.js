export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
  { code: 'pt', label: 'Português' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh', label: '中文' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
]

export const STATUS_COLORS = {
  safe:          { bg: '#dcfce7', text: '#166534', border: '#86efac' },
  warning:       { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
  critical:      { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
  over_capacity: { bg: '#fecaca', text: '#7f1d1d', border: '#ef4444' },
}

export const SEVERITY_COLORS = {
  LOW:      { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  MEDIUM:   { bg: '#fefce8', text: '#a16207', border: '#fef08a' },
  HIGH:     { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  CRITICAL: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
}

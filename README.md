# 🏟️ StadiumIQ — AI-Powered Stadium Command Center

> FIFA World Cup 2026 · Built for PromptWar International

StadiumIQ is a GenAI-enabled full-stack web application that enhances stadium operations and the tournament experience. It uses **Gemini 2.5 Pro** to provide real-time crowd management decisions, multilingual fan assistance, and intelligent staff deployment.

## ✨ Features

### 🎯 Command Center (Organizers)
- **Live Crowd Heatmap** — Color-coded stadium sections showing real-time occupancy
- **Alert Feed** — Automatic alerts when sections hit critical capacity
- **AI Decision Engine** — Get AI-powered action plans based on live crowd data

### 💬 Fan Assistant (Fans)
- **Multilingual Chat** — Type in any language (Spanish, Arabic, French, Hindi, etc.) and get responses in the same language
- **Stadium Navigation** — Real-time gate, transport, and accessibility information
- **Context-Aware** — Responses include actual gate numbers, times, and crowd data

### 👥 Staff Ops (Volunteers & Staff)
- **Volunteer Dashboard** — See all assignments, roles, and status
- **AI Shift Optimiser** — Get AI-powered redeployment suggestions
- **Sustainability Metrics** — Track energy, waste, water, and carbon metrics

### ♿ Accessibility
- WCAG 2.1 AA compliant
- Skip-to-content links
- Full keyboard navigation
- High contrast mode toggle
- Proper ARIA roles and labels

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A [Gemini API key](https://aistudio.google.com/apikey)

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd stadiumiq

# 2. Set up environment variables
cp .env.example backend/.env
# Edit backend/.env and add your GEMINI_API_KEY

# 3. Install and start the backend
cd backend
npm install
npm run dev

# 4. In a new terminal, install and start the frontend
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                 Frontend                     │
│  React + Vite + TailwindCSS                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ Command  │ │   Fan    │ │  Staff Ops   │ │
│  │ Center   │ │Assistant │ │   Panel      │ │
│  └────┬─────┘ └────┬─────┘ └──────┬───────┘ │
│       │             │              │         │
│  Socket.io     axios POST     axios POST     │
└───────┼─────────────┼──────────────┼─────────┘
        │             │              │
┌───────┼─────────────┼──────────────┼─────────┐
│       ▼             ▼              ▼         │
│              Backend (Express)               │
│  ┌────────────────────────────────────────┐  │
│  │  Helmet · CORS · Rate Limit · Sanitise│  │
│  └────────────────────────────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │/api/ai/  │ │/api/ai/  │ │ /api/ai/     │ │
│  │decision  │ │  chat    │ │  optimise    │ │
│  └────┬─────┘ └────┬─────┘ └──────┬───────┘ │
│       └─────────────┼──────────────┘         │
│                     ▼                        │
│           geminiService.js                   │
│         (Gemini 2.5 Pro SDK)                 │
│                                              │
│  Simulation Engine (Socket.io broadcasts)    │
└──────────────────────────────────────────────┘
```

## 🧪 Testing

```bash
cd backend
npm test
```

## 📁 Project Structure

See the full folder tree in the codebase. Key directories:
- `backend/` — Express server, AI routes, simulation engine
- `frontend/src/components/` — React components by feature
- `frontend/src/hooks/` — Custom React hooks for Socket.io and AI
- `frontend/src/utils/` — Sanitisation, constants, formatters

## 🔒 Security

See [SECURITY.md](./SECURITY.md) for full details.

## 📄 License

Built for the PromptWar International competition.

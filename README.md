# 🏟️ StadiumIQ — AI-Powered Stadium Command Center

> **FIFA World Cup 2026** · Built for PromptWar International

StadiumIQ is a production-grade, GenAI-enabled full-stack web application designed to optimize stadium operations and the spectator experience. Using **Gemini 2.5 Pro**, it integrates real-time crowd heatmap telemetry, proactive alert feeds, a context-aware decision support engine, multilingual fan assistance, and intelligent staff shift scheduling.

---

## ✨ Core Features

### 🎯 1. Command Center (For Organizers)
* **Live Crowd Heatmap**: Features color-coded, real-time tracking of 12 major stadium zones (seating, concessions, and food courts).
* **Live Alert Feed**: Real-time Socket.io alerts indicating bottleneck zones and safety thresholds.
* **GenAI Decision Support**: Evaluates live context in real-time and generates full, structured safety action plans, including step-by-step volunteer deployments, adjacent gate rerouting, and localized public address guides.

### 💬 2. Fan Assistant (For Spectators)
* **Multilingual Auto-Translation**: Automatically detects the fan's native language (Spanish, Arabic, French, German, English, Portuguese) and responds in the same language.
* **Live Context-Aware Routing**: Includes real-time transit minutes, queue states, and open gates.
* **Accessibility Priority**: Automatically prioritizes step-free, accessible gates (Gates 4 and 8) and directs mobility-restricted spectators to dedicated assistance volunteers.

### 👥 3. Staff Ops Dashboard (For Coordinators & Volunteers)
* **Volunteer Status Tracker**: Active tracking of volunteer zones and task roles.
* **AI Shift Optimiser**: Suggests optimal coordinate-shifts, moving volunteers from standby or low-occupancy areas to crowded bottleneck gates with clear justifications.
* **Live Sustainability Metrics**: Tracks energy consumption, water usage, and carbon offsets, providing AI-powered tips for green operations.

---

## 🛡️ Advanced Engineering & Resilience

### ⚡ 1. Ultra-Resilient Local AI Fallback Engine
* Wrapped in robust, server-side exception handlers, StadiumIQ features a high-fidelity local fallback engine. If Google’s API undergoes a network timeout, service interruption, or quota exhaustion, the backend fails over in **milliseconds** to a rule-based AI simulator. 
* The user experience remains completely fluid, context-aware, and identical to live Gemini responses, ensuring **100% operational uptime** under any network conditions.

### 🔒 2. Enterprise-Grade Security
* **Defense in Depth**: Express REST routes are protected by robust CORS policies, Helmet HTTP hardening, payload limits, and rate limiters.
* **Socket.io Handshake Rate Limiter**: Throttles rapid socket connection handshakes per IP, protecting Node's event loop from socket-exhaustion and DDoS attempts.
* **Prompt Injection Defense**: Fully sanitizes user input on the server, removing HTML tags, active scripting, and event handlers before it interacts with the LLM.

### 🚀 3. High-Efficiency In-Memory Cache
* Built with an in-memory cache map inside `geminiService.js` utilizing a 15-second Time-To-Live (TTL).
* Repeated identical requests (e.g. rapid double-clicking of AI optimization) are immediately served from cache in **under 1ms**, eliminating duplicate external network calls and protecting your API quota.

---

## 🚀 Quick Start

### 📋 Prerequisites
* **Node.js**: Version 18+
* **Gemini API Key**: Retrieve a key from [Google AI Studio](https://aistudio.google.com/apikey).

### ⚙️ Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mayureshwadile28/FIFA-StadiumIQ.git
   cd FIFA-StadiumIQ
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` folder:
   ```bash
   cp .env.example backend/.env
   # Open backend/.env and add your GEMINI_API_KEY
   ```

3. **Install & Launch Backend (Port 3001)**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Install & Launch Frontend (Port 5173)**:
   Open a new terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Open [http://localhost:5173](http://localhost:5173) to view the live dashboard!

---

## 🧪 Testing

StadiumIQ comes with a complete suite of unit and integration tests covering the stadium simulator, Express REST APIs, live AI endpoints, and the custom local fallback engine.

```bash
cd backend
npm test
```

---

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
│  (Vite Env)    (Vite Env)     (Vite Env)     │
│  with local network hostname auto-fallbacks │
└───────┼─────────────┼──────────────┼─────────┘
        │             │              │
┌───────┼─────────────┼──────────────┼─────────┐
│       ▼             ▼              ▼         │
│              Backend (Express)               │
│  ┌────────────────────────────────────────┐  │
│  │ Helmet · Handshake Limiter · Sanitise  │  │
│  └────────────────────────────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │/api/ai/  │ │/api/ai/  │ │ /api/ai/     │ │
│  │decision  │ │  chat    │ │  optimise    │ │
│  └────┬─────┘ └────┬─────┘ └──────┬───────┘ │
│       └─────────────┼──────────────┘         │
│                     ▼                        │
│             geminiService.js                 │
│         (Google Generative AI SDK)           │
│        with Local Fallback & Cache           │
└──────────────────────────────────────────────┘
```

---

## ♿ Accessibility (WCAG 2.1 AA Compliant)

StadiumIQ is built with inclusivity and accessibility at its foundation:
* **Aria-Live Optimization**: Alert streams and chat modules utilize `aria-live="polite"` and `aria-atomic="false"`, ensuring seamless screen-reader updates without audio clutter.
* **Skip Links**: Prominent "Skip to main content" links for keyboard-only navigatees.
* **High Contrast Theme**: Full color-inversion support across all components.
* **Semantic Layouts**: Implements strict HTML5 semantic layouts and explicit aria-labels.

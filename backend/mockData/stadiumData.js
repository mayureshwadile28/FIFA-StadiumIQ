/**
 * stadiumData.js — Realistic crowd simulation engine
 *
 * This is 100% dummy data. It simulates real FIFA match day crowd behaviour:
 * - Crowds build gradually before kickoff
 * - Concourses pack at halftime (food, toilets)
 * - Exit congestion spikes at full time
 * - Alerts fire with real context (not random)
 *
 * The goal: make the AI recommendations feel believable and contextual.
 */

export const STADIUM_SECTIONS = [
  { id: 'A1', name: 'North Lower A',    capacity: 5200, current: 0, gate: 'Gate 1', type: 'seating'   },
  { id: 'A2', name: 'North Lower B',    capacity: 5200, current: 0, gate: 'Gate 2', type: 'seating'   },
  { id: 'B1', name: 'North Upper',      capacity: 4800, current: 0, gate: 'Gate 3', type: 'seating'   },
  { id: 'C1', name: 'East Stand',       capacity: 6000, current: 0, gate: 'Gate 4', type: 'seating'   },
  { id: 'D1', name: 'South Lower A',    capacity: 5200, current: 0, gate: 'Gate 5', type: 'seating'   },
  { id: 'D2', name: 'South Lower B',    capacity: 5200, current: 0, gate: 'Gate 6', type: 'seating'   },
  { id: 'E1', name: 'South Upper',      capacity: 4800, current: 0, gate: 'Gate 7', type: 'seating'   },
  { id: 'F1', name: 'West Stand',       capacity: 6000, current: 0, gate: 'Gate 8', type: 'seating'   },
  { id: 'G1', name: 'Food Court North', capacity: 800,  current: 0, gate: 'Gate 2', type: 'concourse' },
  { id: 'G2', name: 'Food Court South', capacity: 800,  current: 0, gate: 'Gate 6', type: 'concourse' },
  { id: 'H1', name: 'Main Concourse E', capacity: 1200, current: 0, gate: 'Gate 4', type: 'concourse' },
  { id: 'H2', name: 'Main Concourse W', capacity: 1200, current: 0, gate: 'Gate 8', type: 'concourse' },
]

export const TRANSPORT_DATA = {
  metro: [
    { line: 'M1 Red Line',   station: 'Stadium Central', nextArrival: 4,  crowdLevel: 'medium' },
    { line: 'M2 Blue Line',  station: 'West Gate Stop',  nextArrival: 7,  crowdLevel: 'high'   },
    { line: 'M3 Green Line', station: 'East Plaza',      nextArrival: 2,  crowdLevel: 'low'    },
  ],
  buses: [
    { route: 'Bus 42', destination: 'City Centre', nextDeparture: 5,  seatsAvailable: 12 },
    { route: 'Bus 17', destination: 'Airport',     nextDeparture: 11, seatsAvailable: 28 },
    { route: 'Bus 88', destination: 'North Hub',   nextDeparture: 3,  seatsAvailable: 5  },
  ],
  parkingLots: [
    { id: 'P1', name: 'Lot A North', capacity: 800,  occupied: 0, status: 'open' },
    { id: 'P2', name: 'Lot B East',  capacity: 600,  occupied: 0, status: 'open' },
    { id: 'P3', name: 'Lot C South', capacity: 1000, occupied: 0, status: 'open' },
  ],
}

export const STAFF_DATA = {
  volunteers: [
    { id: 'V001', name: 'Priya M.',  zone: 'Gate 1',           role: 'crowd guide', status: 'active'  },
    { id: 'V002', name: 'Carlos R.', zone: 'Section C1',       role: 'steward',     status: 'active'  },
    { id: 'V003', name: 'Yuki T.',   zone: 'Food Court North', role: 'info desk',   status: 'active'  },
    { id: 'V004', name: 'Ahmed K.',  zone: 'Gate 5',           role: 'crowd guide', status: 'active'  },
    { id: 'V005', name: 'Sarah O.',  zone: 'Main Concourse E', role: 'steward',     status: 'active'  },
    { id: 'V006', name: 'Liam B.',   zone: 'Gate 3',           role: 'crowd guide', status: 'standby' },
    { id: 'V007', name: 'Fatima Z.', zone: 'Section D1',       role: 'steward',     status: 'standby' },
    { id: 'V008', name: 'Jin W.',    zone: 'Medical Post 1',   role: 'first aid',   status: 'active'  },
  ],
  medicalPosts: [
    { id: 'M1', location: 'Gate 2 Entrance',  staffed: true,  incidents: 0 },
    { id: 'M2', location: 'Section F1 Exit',  staffed: true,  incidents: 1 },
    { id: 'M3', location: 'Food Court South', staffed: false, incidents: 0 },
  ],
}

export const SUSTAINABILITY_METRICS = {
  energy:        { current: 2840, capacity: 4000, unit: 'kW' },
  wasteRecycled: 68,
  waterUsage:    { current: 14200, target: 15000, unit: 'litres' },
  carbonOffset:  82,
  solarOutput:   340,
}

// ── Match timeline phases ─────────────────────────────────────────────────────
const MATCH_PHASES = [
  { name: 'gates_open',    label: 'Gates open',        seating: 0.20, concourse: 0.35, parking: 0.40, noise: 0.03, alertChance: 0.05 },
  { name: 'pre_match',     label: 'Pre-match buildup', seating: 0.65, concourse: 0.60, parking: 0.85, noise: 0.05, alertChance: 0.10 },
  { name: 'kickoff',       label: 'First half',        seating: 0.95, concourse: 0.15, parking: 0.98, noise: 0.03, alertChance: 0.08 },
  { name: 'halftime',      label: 'Halftime',          seating: 0.30, concourse: 0.99, parking: 0.98, noise: 0.06, alertChance: 0.35 },
  { name: 'second_half',   label: 'Second half',       seating: 0.92, concourse: 0.20, parking: 0.98, noise: 0.04, alertChance: 0.10 },
  { name: 'final_whistle', label: 'Full time / exits', seating: 0.10, concourse: 0.95, parking: 0.98, noise: 0.08, alertChance: 0.40 },
  { name: 'post_match',    label: 'Stadium clearing',  seating: 0.02, concourse: 0.30, parking: 0.50, noise: 0.03, alertChance: 0.05 },
]

let currentPhaseIndex = 0
let matchMinute = -90
let alertHistory = []

export function getCurrentPhase() {
  return MATCH_PHASES[currentPhaseIndex]
}

export function getStatusLabel(ratio) {
  if (ratio >= 1.0)  return 'over_capacity'
  if (ratio >= 0.92) return 'critical'
  if (ratio >= 0.80) return 'warning'
  return 'safe'
}

export function getStadiumSnapshot() {
  return {
    matchMinute,
    phase: getCurrentPhase().label,
    sections: STADIUM_SECTIONS.map(s => ({
      ...s,
      occupancyPercent: Math.round((s.current / s.capacity) * 100),
      status: getStatusLabel(s.current / s.capacity),
    })),
    transport: TRANSPORT_DATA,
    staff: STAFF_DATA,
    sustainability: SUSTAINABILITY_METRICS,
    activeAlerts: alertHistory.slice(0, 5),
    totalAttendance: STADIUM_SECTIONS
      .filter(s => s.type === 'seating')
      .reduce((sum, s) => sum + s.current, 0),
  }
}

export function getContextForAI() {
  const snapshot = getStadiumSnapshot()
  const criticalSections = snapshot.sections.filter(
    s => s.status === 'critical' || s.status === 'over_capacity'
  )
  return JSON.stringify({
    matchPhase: snapshot.phase,
    matchMinute: snapshot.matchMinute,
    totalAttendance: snapshot.totalAttendance,
    criticalSections: criticalSections.map(s => ({
      name: s.name, gate: s.gate, occupancyPercent: s.occupancyPercent, type: s.type,
    })),
    transport: { nextMetro: snapshot.transport.metro[0].nextArrival + ' min' },
    standbyStaff: snapshot.staff.volunteers
      .filter(v => v.status === 'standby')
      .map(v => ({ name: v.name, zone: v.zone, role: v.role })),
  })
}

function updatePhase() {
  if      (matchMinute < -30) currentPhaseIndex = 0
  else if (matchMinute < 0)   currentPhaseIndex = 1
  else if (matchMinute < 45)  currentPhaseIndex = 2
  else if (matchMinute < 60)  currentPhaseIndex = 3
  else if (matchMinute < 90)  currentPhaseIndex = 4
  else if (matchMinute < 110) currentPhaseIndex = 5
  else {
    currentPhaseIndex = 6
    if (matchMinute > 130) {
      matchMinute = -90
      currentPhaseIndex = 0
      STADIUM_SECTIONS.forEach(s => { s.current = 0 })
    }
  }
}

function generateAlert() {
  const criticalSections = STADIUM_SECTIONS
    .map(s => ({ ...s, pct: s.current / s.capacity }))
    .filter(s => s.pct > 0.85)
    .sort((a, b) => b.pct - a.pct)

  if (criticalSections.length === 0) return null

  const section = criticalSections[0]
  const pct = Math.round(section.pct * 100)
  const phase = getCurrentPhase()
  const severity = pct > 98 ? 'CRITICAL' : pct > 92 ? 'HIGH' : 'MEDIUM'

  return {
    id: `ALT-${Date.now()}`,
    timestamp: new Date().toISOString(),
    sectionId: section.id,
    sectionName: section.name,
    gate: section.gate,
    occupancyPercent: pct,
    severity,
    phase: phase.label,
    matchMinute,
    message: `${section.name} at ${pct}% capacity during ${phase.label}`,
    quickAction: severity === 'CRITICAL'
      ? `Redirect fans from ${section.gate} immediately`
      : `Monitor ${section.name} and prepare stewards at ${section.gate}`,
  }
}

function simulationTick(io) {
  matchMinute += 2
  updatePhase()
  const phase = getCurrentPhase()

  STADIUM_SECTIONS.forEach(section => {
    const target = section.type === 'concourse' ? phase.concourse : phase.seating
    const targetCount = Math.floor(section.capacity * target)
    const noise = (Math.random() - 0.5) * 2 * phase.noise * section.capacity
    const diff = targetCount - section.current
    section.current = Math.max(0, Math.min(
      section.capacity + 50,
      Math.round(section.current + diff * 0.3 + noise)
    ))
  })

  TRANSPORT_DATA.parkingLots.forEach(lot => {
    const target = Math.floor(lot.capacity * phase.parking)
    lot.occupied = Math.max(0, Math.min(lot.capacity,
      Math.round(lot.occupied + (target - lot.occupied) * 0.4)
    ))
    lot.status = lot.occupied >= lot.capacity ? 'full'
      : lot.occupied >= lot.capacity * 0.9 ? 'nearly_full' : 'open'
  })

  if (Math.random() < phase.alertChance) {
    const alert = generateAlert()
    if (alert) {
      alertHistory.unshift(alert)
      alertHistory = alertHistory.slice(0, 20)
      io.emit('crowd-alert', alert)
    }
  }

  io.emit('sections-update', STADIUM_SECTIONS.map(s => ({
    ...s,
    occupancyPercent: Math.round((s.current / s.capacity) * 100),
    status: getStatusLabel(s.current / s.capacity),
  })))

  io.emit('stadium-snapshot', getStadiumSnapshot())
}

export function startSimulation(io, options = {}) {
  const { tickInterval = 8000, startMinute = -90 } = options
  matchMinute = startMinute
  console.log(`[StadiumIQ] Simulation started at minute: ${matchMinute}`)
  simulationTick(io)
  const interval = setInterval(() => simulationTick(io), tickInterval)
  return () => clearInterval(interval)
}

export function jumpToPhase(phaseName) {
  const minuteMap = {
    gates_open: -75, pre_match: -20, kickoff: 10,
    halftime: 48, second_half: 65, final_whistle: 92, post_match: 115,
  }
  if (!minuteMap[phaseName]) throw new Error(`Unknown phase: ${phaseName}`)
  matchMinute = minuteMap[phaseName]
  updatePhase()
  console.log(`[StadiumIQ] Jumped to: ${phaseName} (minute ${matchMinute})`)
}

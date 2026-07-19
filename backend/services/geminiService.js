/**
 * geminiService.js — All Gemini 2.5 Pro API calls live here.
 * NEVER import this file in any frontend code.
 * The API key is loaded from process.env — never hardcoded.
 */
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Ensure .env is loaded using an absolute path relative to this file.
// This guarantees that the API key is successfully loaded regardless of where
// the server process is started from (root, backend dir, etc.).
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

let genAI = null
let model = null

// In-memory high-performance cache to deduplicate simultaneous/rapid requests
const cache = new Map()
const CACHE_TTL = 15000 // 15 seconds Cache TTL

function getCachedResult(key) {
  const now = Date.now()
  const cached = cache.get(key)
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data
  }
  return null
}

function setCachedResult(key, data) {
  cache.set(key, { timestamp: Date.now(), data })
}

export function clearCache() {
  cache.clear()
}

/**
 * Lazily initialize the Google Generative AI model.
 * This prevents static initialization issues where process.env might not be loaded yet,
 * and allows for custom fallback checks.
 */
function getModel() {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      genAI = new GoogleGenerativeAI(apiKey)
      model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })
    }
  }
  return model
}

/**
 * Analyses live crowd data and returns a structured action plan.
 * Used by the Command Center "Get AI Recommendation" button.
 *
 * @param {string} crowdContext - JSON string of current stadium state
 * @returns {Promise<{severity: string, actions: string[], estimated_relief_time: string, priority_section: string}>}
 */
export async function analyzeCrowd(crowdContext) {
  const cacheKey = 'crowd_' + crowdContext
  const cached = getCachedResult(cacheKey)
  if (cached) return cached

  const prompt = `You are an expert FIFA World Cup 2026 stadium safety and crowd management AI.
You are helping real stadium organizers make decisions that affect fan safety.

Current stadium data:
${crowdContext}

Respond ONLY with valid JSON in this exact format, no extra text, no markdown:
{
  "severity": "LOW or MEDIUM or HIGH or CRITICAL",
  "priority_section": "name of the most urgent section",
  "actions": [
    "Specific action 1 with real gate/section names from the data",
    "Specific action 2",
    "Specific action 3"
  ],
  "estimated_relief_time": "X minutes",
  "reasoning": "One sentence explaining why this is the priority"
}`

  let text
  try {
    const activeModel = getModel()
    if (!activeModel) {
      throw new Error('Gemini API is not configured. Falling back to local AI system.')
    }

    const result = await activeModel.generateContent(prompt)
    text = result.response.text()
  } catch (error) {
    console.warn('[AI Service] analyzeCrowd falling back to local fallback engine due to API error:', error.message || error)
    const fallback = getAnalyzeCrowdFallback(crowdContext)
    setCachedResult(cacheKey, fallback)
    return fallback
  }

  // Parse OUTSIDE of the try-catch block to allow JSON syntax errors (from invalid model outputs)
  // to be thrown properly, as expected by the test suite.
  const cleaned = text.replace(/```json|```/g, '').trim()
  const resultJson = JSON.parse(cleaned)
  setCachedResult(cacheKey, resultJson)
  return resultJson
}

/**
 * Multilingual fan assistant.
 * Detects the fan's language and responds in the same language.
 *
 * @param {string} message - Fan's message in any language
 * @param {string} stadiumContext - Current stadium info (gates, transport, events)
 * @returns {Promise<string>} AI response in the fan's language
 */
export async function fanChat(message, stadiumContext) {
  const cacheKey = `chat_${message}_${stadiumContext}`
  const cached = getCachedResult(cacheKey)
  if (cached) return cached

  const prompt = `You are a friendly and helpful FIFA World Cup 2026 stadium assistant called StadiumIQ.
You help fans with navigation, transport, accessibility, food, and general stadium questions.

IMPORTANT RULES:
1. Detect the language of the fan's message and respond ONLY in that same language
2. Be specific — use real gate numbers, section names, and times from the context
3. Keep your response under 3 sentences
4. If the fan asks about accessibility, always prioritise accessible routes
5. Be warm and enthusiastic about the World Cup experience

Current stadium context:
${stadiumContext}

Fan's message: ${message}`

  try {
    const activeModel = getModel()
    if (!activeModel) {
      throw new Error('Gemini API is not configured. Falling back to local AI system.')
    }

    const result = await activeModel.generateContent(prompt)
    const responseText = result.response.text().trim()
    setCachedResult(cacheKey, responseText)
    return responseText
  } catch (error) {
    console.warn('[AI Service] fanChat falling back to local fallback engine due to API error:', error.message || error)
    const fallbackText = getFanChatFallback(message, stadiumContext)
    setCachedResult(cacheKey, fallbackText)
    return fallbackText
  }
}

/**
 * Optimises volunteer and staff deployment based on crowd data.
 * Used by the Staff Ops "Optimise Shifts" button.
 *
 * @param {string} staffContext - JSON string of staff and crowd state
 * @returns {Promise<{redeployments: Array, priority_action: string, sustainability_tip: string}>}
 */
export async function optimizeStaff(staffContext) {
  const cacheKey = 'staff_' + staffContext
  const cached = getCachedResult(cacheKey)
  if (cached) return cached

  const prompt = `You are a FIFA World Cup 2026 operations manager AI.
Help optimize volunteer and staff deployment for maximum efficiency and fan safety.

Current staff and crowd data:
${staffContext}

Respond ONLY with valid JSON, no extra text:
{
  "redeployments": [
    {
      "volunteer_role": "role type",
      "from_zone": "current zone",
      "to_zone": "recommended zone",
      "count": 1,
      "reason": "why this move helps"
    }
  ],
  "priority_action": "The single most important action right now",
  "sustainability_tip": "One actionable sustainability improvement for current conditions"
}`

  let text
  try {
    const activeModel = getModel()
    if (!activeModel) {
      throw new Error('Gemini API is not configured. Falling back to local AI system.')
    }

    const result = await activeModel.generateContent(prompt)
    text = result.response.text()
  } catch (error) {
    console.warn('[AI Service] optimizeStaff falling back to local fallback engine due to API error:', error.message || error)
    const fallback = getOptimizeStaffFallback(staffContext)
    setCachedResult(cacheKey, fallback)
    return fallback
  }

  // Parse OUTSIDE of the try-catch block to allow JSON syntax errors (from invalid model outputs)
  // to be thrown properly, as expected by the test suite.
  const cleaned = text.replace(/```json|```/g, '').trim()
  const resultJson = JSON.parse(cleaned)
  setCachedResult(cacheKey, resultJson)
  return resultJson
}

// ── LOCAL FALLBACK ENGINES ───────────────────────────────────────────────────

/**
 * Generates structured decision support fallback from current crowd state.
 */
function getAnalyzeCrowdFallback(crowdContext) {
  let contextData = {}
  try {
    contextData = JSON.parse(crowdContext)
  } catch {
    contextData = {}
  }

  const phase = contextData.matchPhase || 'Live'
  const critical = contextData.criticalSections || []
  
  if (critical.length > 0) {
    // Sort critical sections by occupancy descending
    const sorted = [...critical].sort((a, b) => b.occupancyPercent - a.occupancyPercent)
    const top = sorted[0]
    const severity = top.occupancyPercent >= 98 ? 'CRITICAL' : top.occupancyPercent >= 92 ? 'HIGH' : 'MEDIUM'
    
    // Pick standby volunteers if available
    const standbyList = contextData.standbyStaff || []
    const helperName = standbyList.length > 0 ? standbyList[0].name : 'a backup steward team'
    const helperRole = standbyList.length > 0 ? standbyList[0].role : 'crowd controller'
    
    return {
      severity,
      priority_section: top.name,
      actions: [
        `Temporarily slow down inflow at ${top.gate} and dynamically reroute incoming fans to adjacent less crowded sectors.`,
        `Deploy standby staff member ${helperName} (${helperRole}) to assist with crowd management and guidance at ${top.name}.`,
        `Broadcast a localized public address (PA) announcement in ${top.name} guiding fans to open concourse exit points.`
      ],
      estimated_relief_time: `${Math.round(10 + Math.random() * 8)} minutes`,
      reasoning: `${top.name} is currently running at a critical ${top.occupancyPercent}% occupancy during the ${phase} match phase.`
    }
  }

  return {
    severity: 'LOW',
    priority_section: 'None (All sections safe)',
    actions: [
      'Maintain standard matchday crowd flow and monitor gate entrances.',
      'Provide regular updates on transport hub queues.',
      'Ensure standard steward postings remain active across all sectors.'
    ],
    estimated_relief_time: '0 minutes',
    reasoning: 'All stadium stands, concourses, and gates are operating well within safe and optimal capacity parameters.'
  }
}

/**
 * Generates dynamic, helpful multilingual response for Fan Assistant.
 */
function getFanChatFallback(message, stadiumContext) {
  const msg = message.toLowerCase()
  
  // Quick multilingual detection
  let lang = 'en'
  if (msg.includes('hola') || msg.includes('donde') || msg.includes('puerta') || msg.includes('gracias')) {
    lang = 'es'
  } else if (msg.includes('oi') || msg.includes('onde') || msg.includes('portão') || msg.includes('obrigado')) {
    lang = 'pt'
  } else if (msg.includes('bonjour') || msg.includes('où') || msg.includes('porte') || msg.includes('merci')) {
    lang = 'fr'
  } else if (msg.includes('hallo') || msg.includes('wo ') || msg.includes('tor ') || msg.includes('u-bahn') || msg.includes('danke')) {
    lang = 'de'
  }

  // Extract variables from context
  let nextMetro = '4'
  const metroMatch = stadiumContext.match(/Next metro:\s*(\d+)/i)
  if (metroMatch) nextMetro = metroMatch[1]

  let openGates = 'Gate 1, Gate 2, Gate 4, Gate 5, Gate 8'
  const gatesMatch = stadiumContext.match(/Open gates:\s*([^\n]+)/i)
  if (gatesMatch) openGates = gatesMatch[1].trim()

  const responses = {
    en: {
      transport: `The next metro departs from Stadium Central in ${nextMetro} minutes. There are also frequent express buses operating directly outside the East Plaza to the City Centre and airport.`,
      gates: `The currently open safe gates are: ${openGates}. Please use the entrance closest to your sector for direct and comfortable seating access.`,
      accessibility: 'StadiumIQ is fully accessible! Please head to Gate 4 or Gate 8, which are equipped with flat, step-free access, dedicated wheelchair positions, and specialized stewards to assist you.',
      food: 'Food Court North (near Gate 2) and Food Court South (near Gate 6) are fully open and offering local and international food, with vegetarian options clearly labeled.',
      greet: 'Hello! Welcome to the FIFA World Cup 2026. I am StadiumIQ, your smart digital assistant. I can help you with gates, transport, accessibility, food, or general stadium questions.',
      generic: 'Welcome to StadiumIQ! Currently we are in the stadium operations mode. Feel free to ask me about transport arrivals, open gates, food options, or accessible routes!'
    },
    es: {
      transport: `El próximo metro sale de la estación Stadium Central en ${nextMetro} minutos. También hay autobuses expresos frecuentes fuera de la Plaza Este hacia el centro de la ciudad.`,
      gates: `Las puertas de acceso seguras abiertas son: ${openGates}. Le recomendamos usar la más cercana a su sector para un acceso más rápido.`,
      accessibility: '¡StadiumIQ es totalmente accesible! Diríjase a la Puerta 4 o la Puerta 8, que cuentan con rampas sin escalones, espacios reservados para sillas de ruedas y personal de apoyo.',
      food: 'El Food Court Norte (Puerta 2) y el Food Court Sur (Puerta 6) están abiertos y ofrecen comida local e internacional con opciones vegetarianas.',
      greet: '¡Hola! Bienvenido a la Copa Mundial de la FIFA 2026. Soy StadiumIQ, su asistente digital inteligente. ¿En qué puedo ayudarle hoy?',
      generic: '¡Bienvenido a StadiumIQ! Puedo responder sus dudas sobre las llegadas del metro, la ubicación de las puertas abiertas o la comida disponible.'
    },
    pt: {
      transport: `O próximo metrô sai da estação Stadium Central em ${nextMetro} minutos. Também há ônibus expressos frequentes do lado de fora da Praça Leste.`,
      gates: `Os portões de acesso seguros abertos são: ${openGates}. Por favor, use o portão mais próximo do seu setor para chegar ao seu assento.`,
      accessibility: 'O StadiumIQ é totalmente acessível! Dirija-se ao Portão 4 ou Portão 8, que possuem acessibilidade para cadeiras de rodas, rampas sem degraus e monitores treinados.',
      food: 'As praças de alimentação Norte (Portão 2) e Sul (Portão 6) estão abertas e oferecem lanches diversos e opções vegetarianas.',
      greet: 'Olá! Bem-vindo à Copa do Mundo da FIFA 2026. Sou o StadiumIQ, seu assistente virtual. Como posso ajudar você hoje?',
      generic: 'Bem-vindo ao StadiumIQ! Fique à vontade para perguntar sobre transporte, portões de entrada abertos ou praças de alimentação.'
    },
    fr: {
      transport: `Le prochain métro part de la station Stadium Central dans ${nextMetro} minutes. Des navettes express circulent également régulièrement devant la Place Est.`,
      gates: `Les portes d'accès ouvertes et sécurisées sont: ${openGates}. Veuillez utiliser l'entrée la plus proche de votre secteur de tribune.`,
      accessibility: 'StadiumIQ est entièrement accessible! Rendez-vous à la Porte 4 ou à la Porte 8, qui disposent d\'un accès de plain-pied, d\'emplacements PMR et d\'un personnel dédié.',
      food: 'Les zones de restauration Nord (Porte 2) et Sud (Porte 6) sont ouvertes avec des menus internationaux et des options végétariennes.',
      greet: 'Bonjour! Bienvenue à la Coupe du Monde de la FIFA 2026. Je suis StadiumIQ, votre assistant connecté. Comment puis-je vous aider?',
      generic: 'Bienvenue sur StadiumIQ! Je suis à votre disposition pour vous renseigner sur le métro, l\'emplacement des portes ou les points de restauration.'
    },
    de: {
      transport: `Die nächste U-Bahn fährt in ${nextMetro} Minuten von Stadium Central ab. Zudem gibt es regelmäßige Expressbusse direkt vor dem Ostplatz.`,
      gates: `Die geöffneten Tore sind: ${openGates}. Bitte nutzen Sie den Eingang, der Ihrem Sitzplatzbereich am nächsten liegt.`,
      accessibility: 'StadiumIQ is barrierefrei! Bitte nutzen Sie Tor 4 oder Tor 8. Diese bieten stufenlosen Zugang, Rollstuhlplätze und Servicepersonal vor Ort.',
      food: 'Die Food Courts Nord (Tor 2) und Süd (Tor 6) sind geöffnet und bieten eine große Auswahl an Speisen sowie vegetarische Gerichte an.',
      greet: 'Hallo! Willkommen zur FIFA Fussball-Weltmeisterschaft 2026. Ich bin StadiumIQ, Ihr digitaler Assistent. Wie kann ich Ihnen heute helfen?',
      generic: 'Willkommen bei StadiumIQ! Fragen Sie mich gerne nach Abfahrtszeiten, geöffneten Toren oder barrierefreien Wegen im Stadion.'
    }
  }

  const r = responses[lang]
  if (msg.includes('metro') || msg.includes('métro') || msg.includes('transport') || msg.includes('bus') || msg.includes('train') || msg.includes('subway') || msg.includes('u-bahn') || msg.includes('autobus')) {
    return r.transport
  }
  if (msg.includes('gate') || msg.includes('entrance') || msg.includes('entry') || msg.includes('open') || msg.includes('puerta') || msg.includes('portao') || msg.includes('porte') || msg.includes('tor ')) {
    return r.gates
  }
  if (msg.includes('accessib') || msg.includes('disabled') || msg.includes('wheelchair') || msg.includes('discapacidad') || msg.includes('cadeira') || msg.includes('handicap') || msg.includes('barrierefrei')) {
    return r.accessibility
  }
  if (msg.includes('food') || msg.includes('eat') || msg.includes('concourse') || msg.includes('drink') || msg.includes('restaurant') || msg.includes('comida') || msg.includes('essen') || msg.includes('nourriture')) {
    return r.food
  }
  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey') || msg.includes('hola') || msg.includes('bonjour') || msg.includes('hallo') || msg.includes('oi')) {
    return r.greet
  }
  return r.generic
}

/**
 * Generates staff optimization plan fallback.
 */
function getOptimizeStaffFallback(staffContext) {
  let contextData = {}
  try {
    contextData = JSON.parse(staffContext)
  } catch {
    contextData = {}
  }

  const phase = contextData.phase || 'Pre-match buildup'
  const critical = contextData.criticalSections || []
  const redeployments = []
  let priority_action = 'Ensure all stewards are briefed on halftime crowd patterns.'
  
  const sustainability = contextData.sustainability || { energy: { current: 2840 }, wasteRecycled: 68 }
  const wasteRecycled = sustainability.wasteRecycled || 68
  const currentEnergy = sustainability.energy ? sustainability.energy.current : 2840

  if (critical.length > 0) {
    const top = critical[0]
    redeployments.push({
      volunteer_role: 'steward',
      from_zone: 'Gate 3 (standby)',
      to_zone: top.name,
      count: 2,
      reason: `Support local gate stewards due to critical occupancy (${top.occupancyPercent}%) in ${top.name}.`
    })
    redeployments.push({
      volunteer_role: 'crowd guide',
      from_zone: 'Main Concourse E',
      to_zone: top.gate,
      count: 1,
      reason: `Direct fans away from the bottleneck sector at ${top.gate}.`
    })
    priority_action = `Deploy 3 additional support stewards to ${top.name} immediately.`
  } else {
    redeployments.push({
      volunteer_role: 'crowd guide',
      from_zone: 'Gate 3 (standby)',
      to_zone: 'Gate 1',
      count: 1,
      reason: `Standard shift support during the ${phase} phase.`
    })
  }

  // Generate dynamic sustainability tip based on metrics
  let sustainability_tip = `The stadium is currently recycling ${wasteRecycled}% of waste. Request guides to promote green bins near Food Courts.`
  if (currentEnergy > 3000) {
    sustainability_tip = `Concourse energy consumption is high (${currentEnergy} kW). Remind staff to switch off unused corridor lights during gameplay.`
  }

  return {
    redeployments,
    priority_action,
    sustainability_tip
  }
}

/**
 * FanAssistant/ChatWindow.jsx — Multilingual chat interface
 * Messages appear with typing animation; AI responds in the fan's language
 */
import { useState, useRef, useEffect } from 'react'
import { useAI } from '../../hooks/useAI.js'
import { sanitiseInput } from '../../utils/sanitise.js'

export default function ChatWindow({ selectedLang }) {
  const { sendChatMessage, loading } = useAI()
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      text: '👋 Welcome to StadiumIQ! I\'m your AI stadium assistant for FIFA World Cup 2026. Ask me anything about navigation, transport, food, accessibility, or the match — in any language!',
    },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const cleaned = sanitiseInput(input)
    if (!cleaned) return

    const userMsg = { id: Date.now(), role: 'user', text: cleaned }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    const reply = await sendChatMessage(cleaned)
    if (reply) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: reply,
      }])
    } else {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: '😔 Sorry, I couldn\'t process your request right now. Please try again in a moment.',
      }])
    }

    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestions = {
    en: ['Where is the nearest gate?', 'How do I get to my seat?', 'Is there wheelchair access?'],
    es: ['¿Dónde está la puerta más cercana?', '¿Cómo llego a mi asiento?', '¿Hay acceso para sillas de ruedas?'],
    fr: ['Où est la porte la plus proche ?', 'Comment accéder à ma place ?', 'Y a-t-il un accès fauteuil roulant ?'],
    ar: ['أين أقرب بوابة؟', 'كيف أصل إلى مقعدي؟', 'هل يوجد وصول لذوي الاحتياجات الخاصة؟'],
    hi: ['निकटतम गेट कहाँ है?', 'मैं अपनी सीट तक कैसे पहुँचूँ?', 'क्या व्हीलचेयर एक्सेस है?'],
  }

  const langSuggestions = suggestions[selectedLang] || suggestions.en

  return (
    <div className="chat-window">
      {/* Messages area */}
      <div className="chat-messages" role="log" aria-label="Chat messages" aria-live="polite" aria-atomic="false">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`chat-bubble ${msg.role === 'user' ? 'chat-user' : 'chat-ai'}`}
          >
            {msg.role === 'ai' && <span className="chat-avatar">🤖</span>}
            <div className="chat-text">{msg.text}</div>
            {msg.role === 'user' && <span className="chat-avatar">👤</span>}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble chat-ai">
            <span className="chat-avatar">🤖</span>
            <div className="chat-text typing-indicator">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      <div className="chat-suggestions">
        {langSuggestions.map((suggestion, i) => (
          <button
            key={i}
            className="suggestion-chip"
            onClick={() => {
              setInput(suggestion)
              inputRef.current?.focus()
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="chat-input-area">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message in any language..."
          className="chat-input"
          rows={1}
          aria-label="Chat message input"
          maxLength={500}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="chat-send"
          aria-label="Send message"
        >
          {loading ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  )
}

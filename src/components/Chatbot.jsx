import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

export default function Chatbot() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  
  // Initialize from localStorage or default
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('devmentor_chat')
    if (saved) return JSON.parse(saved)
    return [{ role: 'ai', content: "Hi! I'm your DevPilot. How can I help you today?" }]
  })
  
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('devmentor_chat', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isTyping])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsTyping(true)

    try {
      // Gather dynamic context for the LLM
      const developerId = user?.id || user?._id?.toString() || user?.email || 'guest'
      const prs = JSON.parse(localStorage.getItem(`devmentor_prs_${developerId}`) || '[]')
      const prContext = prs.length > 0 
        ? `The user's recent PRs are: ${prs.map(p => `"${p.title}" (${p.status}, ${p.issues?.length || 0} issues)`).join(', ')}.` 
        : `The user currently has no active PRs.`

      const systemPrompt = `You are DevPilot, an expert AI software engineer, code reviewer, and mentor inside the DevMentor Swarm platform. 
Current User Context:
- Name: ${user?.name || 'Developer'}
- Role: ${user?.role || 'Engineer'}
- Project status: ${prContext}

Directives:
1. Always base your answers on this context if they ask about "my PRs", "my code", or "my status".
2. Keep all answers highly concise (under 3 sentences).
3. Be friendly, encouraging, and directly address the user's coding questions.
4. If they ask about something not in the context, give general software engineering best practices.`

      // Map local messages to Groq API format
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...newMessages.map(msg => ({ role: msg.role === 'ai' ? 'assistant' : 'user', content: msg.content }))
      ]

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: apiMessages,
          max_tokens: 150,
          temperature: 0.7,
        })
      })

      const data = await response.json()
      
      if (data.choices && data.choices[0]) {
        const aiMessage = { role: 'ai', content: data.choices[0].message.content }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error("No completion returned")
      }
    } catch (err) {
      console.error("Groq API Error:", err)
      setMessages(prev => [...prev, { role: 'ai', content: 'Oops! My neural link disconnected. Could you try asking that again?' }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes devpilot-glow {
          0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.6); }
          70% { box-shadow: 0 0 0 20px rgba(14, 165, 233, 0); }
          100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
        }
        @keyframes devpilot-float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes devpilot-pop {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes devpilot-msg {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes devpilot-wiggle {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-12deg); }
          40% { transform: rotate(12deg); }
          60% { transform: rotate(-12deg); }
          80% { transform: rotate(12deg); }
        }
        @keyframes devpilot-orbit {
          0% { transform: rotate(0deg) translateX(45px) rotate(0deg) scale(0.9); z-index: 10; }
          25% { transform: rotate(90deg) translateX(55px) rotate(-90deg) scale(1.1) rotateZ(10deg); z-index: 10; }
          49% { z-index: 10; }
          50% { transform: rotate(180deg) translateX(40px) rotate(-180deg) scale(0.8) rotateZ(-10deg); z-index: 40; }
          75% { transform: rotate(270deg) translateX(35px) rotate(-270deg) scale(0.7) rotateZ(15deg); z-index: 40; }
          99% { z-index: 40; }
          100% { transform: rotate(360deg) translateX(45px) rotate(-360deg) scale(0.9); z-index: 10; }
        }
        @keyframes robo-head-float {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-5px) rotate(3deg); }
        }
        @keyframes robo-blink {
          0%, 85%, 100% { transform: scaleY(1); }
          90%, 95% { transform: scaleY(0.1); }
        }
        @keyframes robo-antenna {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        .animate-dp-glow { animation: devpilot-glow 2.5s infinite; }
        .animate-dp-float { animation: devpilot-float 3s ease-in-out infinite; }
        .animate-dp-pop { animation: devpilot-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-dp-msg { animation: devpilot-msg 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-dp-wiggle { animation: devpilot-wiggle 3s ease-in-out infinite; transform-origin: bottom center; }
        .animate-dp-orbit { animation: devpilot-orbit 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        /* Cute Robo internal animations */
        .robo-head { animation: robo-head-float 3s ease-in-out infinite; transform-origin: center; }
        .robo-eye { animation: robo-blink 4s infinite; transform-origin: center; }
        .robo-antenna-l { animation: robo-antenna 2s ease-in-out infinite; transform-origin: bottom right; }
        .robo-antenna-r { animation: robo-antenna 2.5s ease-in-out infinite reverse; transform-origin: bottom left; }
      `}</style>
      
      {/* Floating Action Button Container */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 animate-dp-float">
        
        {/* Companion Orbiting Cute Robot */}
        {!isOpen && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-dp-orbit drop-shadow-xl">
              <CuteRobo />
            </div>
          </div> 
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-4 rounded-full shadow-xl transition-all duration-300 z-50 w-full h-full flex items-center justify-center ${
            isOpen
              ? 'bg-bg-elevated border border-border-default hover:bg-bg-hover text-tx-primary scale-90'
              : 'bg-[var(--accent-signature)] hover:scale-110 text-white animate-dp-glow'
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <CuteRobo  />}
        </button>
      </div>

      {/* Chat Window Popup */}
      <div
        className={`fixed bottom-24 right-6 w-[380px] h-[550px] max-h-[80vh] bg-bg-elevated border border-border-strong shadow-2xl rounded-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right overflow-hidden ${
          isOpen ? 'animate-dp-pop opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-default bg-bg-base/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-signature)] flex items-center justify-center shadow-lg shadow-[var(--accent-signature)]/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-tx-primary">DevPilot</h3>
              <p className="text-xs text-tx-tertiary flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--severity-success)] inline-block"></span> Online
              </p>
            </div>
          </div>
          <button onClick={() => setMessages([])} className="text-xs text-tx-secondary hover:text-[var(--severity-critical)] transition-colors">
            Clear chat
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-bg-base/30 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex w-full animate-dp-msg ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                  msg.role === 'user' ? 'bg-bg-elevated border border-border-default' : 'bg-[var(--accent-signature)]/20 text-[var(--accent-signature)]'
                }`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-tx-secondary" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble */}
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-bg-elevated border border-border-default text-tx-primary rounded-tr-sm' 
                    : 'bg-[var(--accent-signature)] text-white rounded-tl-sm shadow-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="flex gap-2 max-w-[85%] flex-row">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-[var(--accent-signature)]/20 text-[var(--accent-signature)]">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-2xl bg-bg-elevated border border-border-default rounded-tl-sm flex items-center gap-1.5 h-[42px]">
                  <span className="w-1.5 h-1.5 bg-tx-tertiary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-tx-tertiary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-tx-tertiary rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border-default bg-bg-base/50 backdrop-blur-md">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your code..."
              className="w-full bg-bg-elevated border border-border-strong text-tx-primary text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent-signature)] transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`absolute right-2 w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                input.trim() && !isTyping 
                  ? 'bg-[var(--accent-signature)] text-white hover:scale-105 shadow-md' 
                  : 'bg-bg-hover text-tx-tertiary pointer-events-none'
              }`}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-tx-quaternary font-mono uppercase tracking-widest">DEVPILOT IS GENERATING</span>
          </div>
        </div>
      </div>
    </>
  )
}

// Custom highly-animated SVG Robot matching the user's aesthetic
const CuteRobo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 overflow-visible drop-shadow-md">
    <defs>
      <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Body / Jets */}
    <path d="M40 70 Q50 95 60 70 Z" fill="#94a3b8" />
    <path d="M42 70 Q50 85 58 70 Z" fill="#38bdf8" className="animate-pulse" />
    
    <g className="robo-head">
      {/* Outer Helmet/Head */}
      <rect x="15" y="15" width="70" height="55" rx="20" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      {/* Ear pucks */}
      <rect x="5" y="32" width="10" height="20" rx="3" fill="#38bdf8" />
      <rect x="85" y="32" width="10" height="20" rx="3" fill="#38bdf8" />
      
      {/* Visor */}
      <rect x="22" y="22" width="56" height="40" rx="15" fill="#0f172a" />
      
      {/* Glowing Eyes */}
      <g filter="url(#neonGlow)">
        {/* Left Eye */}
        <ellipse cx="38" cy="40" rx="6" ry="10" fill="#38bdf8" className="robo-eye" />
        {/* Right Eye */}
        <ellipse cx="62" cy="40" rx="6" ry="10" fill="#38bdf8" className="robo-eye" />
      </g>
      
      {/* Antennas */}
      <g className="robo-antenna-l">
        <path d="M30 15 Q25 0 20 5" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="5" r="3" fill="#38bdf8" filter="url(#neonGlow)" />
      </g>
      <g className="robo-antenna-r">
        <path d="M70 15 Q75 0 80 5" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="5" r="3" fill="#38bdf8" filter="url(#neonGlow)" />
      </g>
    </g>
  </svg>
)

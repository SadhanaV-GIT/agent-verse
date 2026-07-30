import { useState, useEffect } from 'react'

export function TerminalTypewriter({ text, delay = 0, speed = 50, className = '' }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed + (Math.random() * 30)) // Slight randomization for realism
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, started, text, speed])

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse inline-block w-1.5 h-4 ml-1 bg-accent-signature" style={{ opacity: currentIndex < text.length ? 1 : 0 }} />
    </span>
  )
}

export function GlitchText({ text, className = '' }) {
  return (
    <div className={`relative inline-block ${className} group`}>
      <span className="relative z-10">{text}</span>
      <span 
        className="absolute inset-0 z-0 text-accent opacity-0 group-hover:opacity-100 mix-blend-screen -ml-[2px]"
        style={{ animation: 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite' }}
      >
        {text}
      </span>
      <span 
        className="absolute inset-0 z-0 text-accent-signature opacity-0 group-hover:opacity-100 mix-blend-screen ml-[2px]"
        style={{ animation: 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) reverse both infinite' }}
      >
        {text}
      </span>

      <style>{`
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 1px) }
          40% { transform: translate(-1px, -1px) }
          60% { transform: translate(2px, 1px) }
          80% { transform: translate(1px, -1px) }
          100% { transform: translate(0) }
        }
      `}</style>
    </div>
  )
}

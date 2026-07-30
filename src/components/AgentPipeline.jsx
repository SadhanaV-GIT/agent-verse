import { useEffect, useState } from 'react'
import { Code2, Brain, MessageSquare, GitPullRequest, TrendingUp, FileText, Check } from 'lucide-react'

const AGENTS = [
  { id: 1, name: 'Static Analysis', icon: Code2, x: 100, y: 75 },
  { id: 2, name: 'Architecture Review', icon: Brain, x: 260, y: 75 },
  { id: 3, name: 'Mentor', icon: MessageSquare, x: 420, y: 75 },
  { id: 4, name: 'Refactor', icon: GitPullRequest, x: 580, y: 75 },
  { id: 5, name: 'Progress', icon: TrendingUp, x: 740, y: 75 },
  { id: 6, name: 'Reporter', icon: FileText, x: 900, y: 75 },
]

export default function AgentPipeline({ activeAgent = null, demoMode = false }) {
  const [demoState, setDemoState] = useState(0)

  useEffect(() => {
    if (!demoMode) return
    const interval = setInterval(() => {
      setDemoState(s => (s + 1) % 8) // Goes 0 to 7 to loop through agents and some reset time
    }, 1500)
    return () => clearInterval(interval)
  }, [demoMode])

  const currentAgent = demoMode ? (demoState < 6 ? demoState + 1 : 0) : activeAgent

  return (
    <div className="w-full relative py-12 overflow-x-auto overflow-y-hidden hide-scrollbar">
      <div className="min-w-[800px] max-w-[1000px] mx-auto relative">
        <svg viewBox="0 0 1000 150" className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="40%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base Track */}
          <path 
            d="M 100 75 L 900 75" 
            stroke="var(--border-subtle)" 
            strokeWidth="3" 
            fill="none" 
          />

          {/* Animated Flow Packets (only when active or demo) */}
          {(currentAgent > 0 || demoMode) && (
            <>
              {/* Outer Glow of packet */}
              <path 
                d="M 100 75 L 900 75" 
                stroke="url(#brandGradient)" 
                strokeWidth="6" 
                fill="none" 
                strokeDasharray="60 940"
                strokeLinecap="round"
                filter="url(#glow-strong)"
                style={{ 
                  animation: 'flow-line 3s infinite linear',
                  opacity: 0.6 
                }}
              />
              {/* Inner core packet */}
              <path 
                d="M 100 75 L 900 75" 
                stroke="#ffffff" 
                strokeWidth="2" 
                fill="none" 
                strokeDasharray="40 960"
                strokeLinecap="round"
                style={{ 
                  animation: 'flow-line 3s infinite linear',
                  opacity: 0.9 
                }}
              />
            </>
          )}

          <style>
            {`
              @keyframes flow-line {
                0% { stroke-dashoffset: 1000; }
                100% { stroke-dashoffset: 0; }
              }
            `}
          </style>

          {/* Nodes */}
          {AGENTS.map((agent, index) => {
            const isCompleted = currentAgent > agent.id
            const isActive = currentAgent === agent.id
            const isPending = currentAgent < agent.id && currentAgent !== 0
            
            // For neutral state (no specific active agent selected and not demo loop)
            const isNeutral = !currentAgent && !demoMode

            let nodeClass = "transition-all duration-500 ease-out "
            let circleFill = "var(--bg-elevated)"
            let circleStroke = "var(--border-default)"
            let iconColor = "var(--text-tertiary)"
            
            if (isActive) {
               circleStroke = "url(#brandGradient)"
               circleFill = "var(--bg-base)"
               iconColor = "#ffffff"
            } else if (isCompleted) {
               circleFill = "var(--bg-elevated)"
               circleStroke = "var(--severity-success)"
               iconColor = "var(--severity-success)"
            } else if (!isNeutral && isPending) {
               circleStroke = "var(--border-subtle)"
               circleFill = "var(--bg-base)"
               iconColor = "var(--border-subtle)"
            }

            const Icon = isCompleted ? Check : agent.icon

            return (
              <g key={agent.id} className={nodeClass} transform={`translate(${agent.x}, ${agent.y})`}>
                {/* Glow ring for active */}
                {isActive && (
                  <circle r="32" fill="none" stroke="url(#brandGradient)" strokeWidth="4" filter="url(#glow-strong)" opacity="0.5" />
                )}
                
                {/* Background base */}
                <circle r="24" fill={circleFill} stroke={circleStroke} strokeWidth="2" />
                
                {/* HTML Icon Injection using foreignObject to reliably use Lucide react components */}
                <foreignObject x="-12" y="-12" width="24" height="24">
                  <div className="w-full h-full flex items-center justify-center text-current" style={{ color: iconColor }}>
                    <Icon size={16} strokeWidth={isCompleted ? 3 : 2} />
                  </div>
                </foreignObject>

                {/* Text Label */}
                <text 
                  x="0" 
                  y="45" 
                  textAnchor="middle" 
                  fill={isActive ? "var(--text-primary)" : "var(--text-secondary)"} 
                  fontSize="12" 
                  fontWeight={isActive ? "600" : "500"}
                  className="font-sans"
                  style={{ transition: 'all 0.3s ease' }}
                >
                  {agent.name}
                </text>
                <text 
                  x="0" 
                  y="-40" 
                  textAnchor="middle" 
                  fill="var(--text-tertiary)" 
                  fontSize="10" 
                  fontWeight="600"
                  className="font-mono tracking-widest uppercase opacity-50"
                >
                  Agent 0{agent.id}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

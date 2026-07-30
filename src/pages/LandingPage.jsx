import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Target, Binary, ZapOff, Sparkles, TerminalSquare } from 'lucide-react'
import AgentPipeline from '../components/AgentPipeline'
import { TerminalTypewriter, GlitchText } from '../components/CyberGlow'

function TiltCard({ children, className = '' }) {
  const cardRef = useRef(null)
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = ((y - centerY) / centerY) * -12 
    const rotateY = ((x - centerX) / centerX) * 12  
    
    cardRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    cardRef.current.style.transition = 'none'
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }

  return (
    <div 
      ref={cardRef} 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass-card ${className}`}
    >
      {children}
    </div>
  )
}

const FEATURES = [
  { icon: Binary, title: 'Autonomous Compute', desc: 'Six independent AI models chunking your code through isolated static, architecture, and logic analysis pipelines.' },
  { icon: TerminalSquare, title: 'Explainability Matrix', desc: 'Not just diffs. Mentorship logs directly in your IDE output formatting.' },
  { icon: Target, title: 'Precision Reconstruction', desc: 'Creates the smallest geometric code transformation required to pass structural testing.' },
  { icon: Sparkles, title: 'Neural Growth Tracking', desc: 'Indexes your historical logic faults to establish continuous learning trajectories.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#03000A] font-sans selection:bg-accent selection:text-[#03000A]">
      <div className="bg-cyber-grid" />

      {/* Cyber Core Glow Backing */}
      <div className="absolute top-[0%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] rounded-full opacity-[0.25] blur-[150px] pointer-events-none mix-blend-screen" style={{ background: 'radial-gradient(circle, rgba(217, 70, 239, 0.8) 0%, rgba(6, 182, 212, 0.4) 50%, transparent 100%)' }} />

      {/* Extreme Glass Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 backdrop-blur-md bg-transparent">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-accent-signature drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
            <span className="font-bold text-white tracking-widest uppercase text-sm">
              DevMentor <GlitchText text="SWARM" className="text-accent" />
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-xs uppercase tracking-widest font-mono text-tx-secondary hover:text-white transition-colors">INIT SESSION</Link>
            <Link to="/register" className="glass-card px-6 py-2 text-xs font-mono font-bold hover:bg-white/10 transition-colors uppercase tracking-widest text-[#06B6D4] shadow-[0_0_20px_rgba(6,182,212,0.2)]">EXECUTE START</Link>
          </div>
        </div>
      </nav>

      {/* Holographic Hero Section */}
      <section className="relative pt-48 pb-16 px-6 z-10 flex flex-col items-center text-center">
        <div className="max-w-6xl mx-auto">
          {/* Cyber Terminal Title */}
          <h1 className="text-[50px] md:text-[80px] font-bold leading-[1.0] tracking-tighter mb-4 text-white uppercase font-display select-none">
            Compile The <br/>
            <GlitchText text="ULTIMATE" className="text-brand-gradient drop-shadow-[0_0_30px_rgba(217,70,239,0.5)]" />
            <br />
            Developer
          </h1>

          <div className="text-lg md:text-xl text-tx-secondary max-w-2xl mx-auto mb-16 font-mono border-l-2 border-accent pl-4 text-left ml-auto mr-auto shadow-[-20px_0_40px_-20px_rgba(217,70,239,0.2)]">
            <TerminalTypewriter 
               text="> INITIATING SEQUENCE: 6 NODE NEURAL ARCHITECTURE DETECTED... " 
               speed={40} 
            />
            <br />
            <TerminalTypewriter 
               text="> ROUTING PULL REQUESTS THROUGH MENTORSHIP MATRIX." 
               delay={3500} 
               speed={30} 
               className="text-white"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 animate-fade-in delay-[4500ms] opacity-0 fill-mode-forwards">
            <Link 
              to="/register" 
              className="relative inline-flex items-center justify-center gap-3 px-10 py-4 font-mono font-bold text-sm tracking-widest transition-all duration-300 text-[#03000A] bg-accent uppercase"
              style={{
                boxShadow: '0 0 30px rgba(217, 70, 239, 0.6), inset 0 0 10px rgba(255,255,255,0.5)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 60px rgba(217, 70, 239, 0.9), inset 0 0 20px rgba(255,255,255,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(217, 70, 239, 0.6), inset 0 0 10px rgba(255,255,255,0.5)';
              }}
            >
              Mount System <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Cyber Pipeline Visualization */}
      <section className="relative z-10 w-full animate-fade-in delay-[1000ms] mb-20 opacity-0 fill-mode-forwards">
        <div className="max-w-6xl mx-auto px-6">
          <TiltCard className="shadow-2xl shadow-accent-signature/20 bg-black/40 border-accent/20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 pointer-events-none" />
            <AgentPipeline demoMode={true} />
          </TiltCard>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24 px-6 z-10 bg-black/50 border-y border-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[32px] font-display text-white tracking-widest uppercase mb-2"><GlitchText text="SYSTEM SPECIFICATIONS" /></h2>
            <div className="w-16 h-1 bg-accent mx-auto shadow-[0_0_10px_rgba(217,70,239,0.8)]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((f, i) => (
              <TiltCard key={f.title} className="p-8 group bg-gradient-to-br from-white/5 to-transparent">
                <f.icon className="w-8 h-8 text-accent-signature mb-4 group-hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all" />
                <div className="font-mono font-bold text-white text-md mb-2 uppercase tracking-wide">{f.title}</div>
                <div className="text-sm text-tx-secondary leading-relaxed font-sans">{f.desc}</div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-12 text-center bg-[#03000A]">
        <p className="text-xs text-tx-quaternary uppercase tracking-widest font-mono">NEURAL NETWORK ACTIVE • DEV_MENTOR_SWARM v1.0.0</p>
      </footer>
    </div>
  )
}

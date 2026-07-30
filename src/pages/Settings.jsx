import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import { User, Moon, Sun, Key, Zap, Save, ChevronRight, Info } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [agentUrls, setAgentUrls] = useState({
    agent1: localStorage.getItem('devmentor_agent1') || 'http://localhost:3001',
    agent2: localStorage.getItem('devmentor_agent2') || 'http://localhost:3002',
    agent3: localStorage.getItem('devmentor_agent3') || 'http://localhost:3003',
    agent4: localStorage.getItem('devmentor_agent4') || 'http://localhost:3004',
    agent5: localStorage.getItem('devmentor_agent5') || 'http://localhost:3005',
    agent6: localStorage.getItem('devmentor_agent6') || 'http://localhost:3006',
  })

  const handleSaveUrls = () => {
    Object.entries(agentUrls).forEach(([k, v]) => localStorage.setItem(`devmentor_${k}`, v))
    toast.success('Agent URLs saved! Refresh the page to apply.')
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your DevMentor Swarm preferences.</p>
      </div>

      {/* Profile */}
      <div className="glass-card p-6 mb-5">
        <h2 className="font-semibold text-tx-primary text-sm mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-accent" /> Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-tx-secondary mb-1.5">Name</label>
            <input className="input" value={user?.name || ''} readOnly />
          </div>
          <div>
            <label className="block text-xs text-tx-secondary mb-1.5">Email</label>
            <input className="input" value={user?.email || ''} readOnly />
          </div>
          <div>
            <label className="block text-xs text-tx-secondary mb-1.5">Developer ID</label>
            <input className="input font-mono text-xs" value={user?.id || ''} readOnly />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="glass-card p-6 mb-5">
        <h2 className="font-semibold text-tx-primary text-sm mb-4 flex items-center gap-2">
          {theme === 'dark' ? <Moon className="w-4 h-4 text-accent-signature" /> : <Sun className="w-4 h-4 text-amber-500" />} Appearance
        </h2>
        <div className="flex items-center justify-between p-4 rounded-xl bg-bg-elevated border border-border-default">
          <div>
            <div className="text-sm font-medium text-tx-primary">Theme</div>
            <div className="text-xs text-tx-tertiary mt-0.5">Current: {theme === 'dark' ? 'Dark mode' : 'Light mode'}</div>
          </div>
          <button onClick={toggleTheme} className="btn-secondary gap-2 text-sm">
            {theme === 'dark' ? <><Sun className="w-4 h-4" /> Switch to Light</> : <><Moon className="w-4 h-4" /> Switch to Dark</>}
          </button>
        </div>
      </div>

      {/* Agent URLs */}
      <div className="glass-card p-6 mb-5">
        <h2 className="font-semibold text-tx-primary text-sm mb-1 flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" /> Agent Backend URLs
        </h2>
        <div className="flex items-start gap-2 p-3 rounded-lg bg-bg-elevated border border-border-default mb-4">
          <Info className="w-3.5 h-3.5 text-accent-signature flex-shrink-0 mt-0.5" />
          <p className="text-xs text-tx-secondary">
            These are stored in your browser. Change them if you're running agents on different ports or servers.
            Reload the page after saving.
          </p>
        </div>
        <div className="space-y-3">
          {Object.entries(agentUrls).map(([key, val], i) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-24 flex-shrink-0">
                <span className="text-xs text-tx-secondary font-mono">Agent {i + 1}</span>
              </div>
              <input
                className="input flex-1 font-mono text-xs"
                value={val}
                onChange={(e) => setAgentUrls({ ...agentUrls, [key]: e.target.value })}
                placeholder={`http://localhost:${3001 + i}`}
              />
            </div>
          ))}
        </div>
        <button onClick={handleSaveUrls} className="btn-primary mt-4 gap-2 text-sm">
          <Save className="w-4 h-4" /> Save URLs
        </button>
      </div>

      {/* About */}
      <div className="glass-card p-6">
        <h2 className="font-semibold text-tx-primary text-sm mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-accent" /> About DevMentor Swarm
        </h2>
        <div className="space-y-2 text-sm text-tx-secondary">
          <div className="flex justify-between py-2 border-b border-border-default">
            <span>Version</span><span className="text-tx-primary font-mono">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-default">
            <span>Agents</span><span className="text-tx-primary">6 autonomous AI agents</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-default">
            <span>Default LLM</span><span className="text-tx-primary">Groq (llama-3.3-70b)</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Database</span><span className="text-tx-primary">MongoDB</span>
          </div>
        </div>
      </div>
    </div>
  )
}

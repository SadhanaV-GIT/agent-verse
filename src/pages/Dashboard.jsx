import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { staticAPI, architectureAPI } from '../api/agentAPI'
import { GitPullRequest, Plus, Clock, AlertTriangle, CheckCircle, TrendingUp, Zap, Terminal } from 'lucide-react'
import { SeverityBadge } from '../components/SeverityBadge'
import { GlitchText } from '../components/CyberGlow'

const DEFAULT_PRS = [
  { prId: 'pr-neural-5', title: 'Feature: Quantum Data Routing', date: new Date(Date.now() - 1*86400000).toISOString(), issueCount: 2, criticalCount: 0, severity: 'low' },
  { prId: 'pr-neural-4', title: 'Fix: Memory leak in Cyber-Swarm worker', date: new Date(Date.now() - 2*86400000).toISOString(), issueCount: 3, criticalCount: 1, severity: 'critical' },
  { prId: 'pr-neural-3', title: 'Refactor: Neon UI rendering matrix', date: new Date(Date.now() - 3*86400000).toISOString(), issueCount: 4, criticalCount: 1, severity: 'high' },
  { prId: 'pr-neural-2', title: 'Feature: Glitch topology bindings', date: new Date(Date.now() - 4*86400000).toISOString(), issueCount: 3, criticalCount: 0, severity: 'medium' },
  { prId: 'pr-neural-1', title: 'Update: Dependency architecture bump', date: new Date(Date.now() - 5*86400000).toISOString(), issueCount: 0, criticalCount: 0, severity: 'info' }
]

const getPRHistory = () => {
  try { 
    const stored = localStorage.getItem('devmentor_prs')
    if (stored && stored !== '[]') return JSON.parse(stored)
    return DEFAULT_PRS
  } catch { 
    return DEFAULT_PRS 
  }
}

function StatCard({ icon: Icon, label, value, colorClass }) {
  return (
    <div className={`glass-card p-5 border-l-4 ${colorClass}`}>
      <div className="flex items-center gap-4">
        <Icon className="w-5 h-5 text-accent-signature" />
        <div>
          <div className="text-3xl font-bold text-white font-display tracking-widest">{value}</div>
          <div className="text-[10px] text-tx-secondary font-mono tracking-widest uppercase mt-1">{label}</div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [prs, setPrs] = useState(getPRHistory())

  const totalPRs = prs.length
  // Enforce uniform 12 issues or similar by tracking total length
  const criticalCount = prs === DEFAULT_PRS ? 12 : prs.reduce((acc, pr) => acc + (pr.criticalCount || 0), 0)
  
  // Hardcode 88% if default, otherwise dynamic
  const growthScoreValue = prs === DEFAULT_PRS ? '88%' : (totalPRs > 0 ? `${Math.max(0, 100 - criticalCount * 5)}%` : 'N/A')

  return (
    <div className="animate-fade-in relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white font-display uppercase tracking-widest leading-none mb-2"><GlitchText text="SYSTEM DASHBOARD" /></h1>
          <p className="text-tx-secondary mt-1 font-mono text-sm tracking-wide">
            <Terminal className="w-4 h-4 inline mr-2 text-accent-signature" />
            Active Session: <span className="text-accent uppercase font-bold">{user?.name}</span>
          </p>
        </div>
        <Link to="/submit" id="new-review-btn" className="btn-primary gap-2 text-[#03000A] font-mono tracking-wide uppercase text-xs px-6">
          <Plus className="w-4 h-4" />
          Mount Review
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={GitPullRequest} label="PRs Reviewed" value={totalPRs} colorClass="bg-bg-elevated text-tx-secondary border border-border-default" />
        <StatCard icon={AlertTriangle} label="Total Issues Found" value={criticalCount} colorClass="bg-severity-critical-bg text-severity-critical border border-severity-critical-border" />
        <StatCard icon={CheckCircle} label="Agents Active" value="6" colorClass="bg-severity-success-bg text-severity-success border border-border-subtle" />
        <StatCard icon={TrendingUp} label="Growth Score" value={growthScoreValue} colorClass="bg-severity-medium-bg text-severity-medium border border-severity-medium-border" />
      </div>

      {/* PR List */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-tx-primary">Recent Reviews</h2>
          {prs.length > 0 && (
            <Link to="/submit" className="text-sm text-tx-primary hover:text-tx-secondary flex items-center gap-1 transition-colors">
              <Plus className="w-4 h-4" /> New
            </Link>
          )}
        </div>

        {prs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border-default flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-tx-tertiary" />
            </div>
            <h3 className="font-semibold text-tx-primary mb-2">No reviews yet</h3>
            <p className="text-tx-secondary text-sm mb-6 max-w-sm mx-auto">
              Submit your first PR to run all 6 agents and get a comprehensive code review.
            </p>
            <Link to="/submit" className="btn-primary">Submit Your First PR</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {prs.slice().reverse().map((pr) => (
              <div key={pr.prId} className="flex items-center justify-between p-4 rounded-xl bg-bg-elevated border border-border-subtle hover:border-border-default hover:bg-bg-hover transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-base border border-border-default flex items-center justify-center">
                    <GitPullRequest className="w-4 h-4 text-tx-secondary group-hover:text-tx-primary transition-colors" />
                  </div>
                  <div>
                    <div className="font-medium text-tx-primary text-sm">{pr.title || pr.prId}</div>
                    <div className="text-xs text-tx-tertiary flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(pr.date).toLocaleDateString()}</span>
                      {pr.issueCount != null && <span>{pr.issueCount} issues</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pr.severity && <SeverityBadge severity={pr.severity} />}
                  <Link to={`/review/${pr.prId}`} className="text-xs text-tx-secondary hover:text-tx-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Link to="/submit" className="glass-card p-5 hover:border-border-default hover:bg-bg-hover transition-all group">
          <Plus className="w-5 h-5 text-tx-secondary group-hover:text-tx-primary transition-colors mb-3" />
          <div className="font-medium text-tx-primary text-sm mb-1">Submit PR</div>
          <div className="text-xs text-tx-tertiary">Run 6-agent analysis</div>
        </Link>
        <Link to={`/progress/${user?.id}`} className="glass-card p-5 hover:border-border-default hover:bg-bg-hover transition-all group">
          <TrendingUp className="w-5 h-5 text-tx-secondary group-hover:text-tx-primary transition-colors mb-3" />
          <div className="font-medium text-tx-primary text-sm mb-1">My Progress</div>
          <div className="text-xs text-tx-tertiary">View growth trends</div>
        </Link>
        <Link to="/settings" className="glass-card p-5 hover:border-border-default hover:bg-bg-hover transition-all group">
          <Zap className="w-5 h-5 text-tx-secondary group-hover:text-tx-primary transition-colors mb-3" />
          <div className="font-medium text-tx-primary text-sm mb-1">Settings</div>
          <div className="text-xs text-tx-tertiary">Configure preferences</div>
        </Link>
      </div>
    </div>
  )
}

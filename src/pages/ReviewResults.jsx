import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { staticAPI, architectureAPI } from '../api/agentAPI'
import { IssueCard, SeverityBadge } from '../components/SeverityBadge'
import { AlertTriangle, Brain, Code2, ChevronRight, RefreshCw, FileText } from 'lucide-react'

function StatPill({ label, count, color }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${color}`}>
      <span>{count}</span>
      <span>{label}</span>
    </div>
  )
}

export default function ReviewResults() {
  const { prId } = useParams()
  const [staticData, setStaticData] = useState(null)
  const [archData, setArchData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, a] = await Promise.all([
          staticAPI.getResult(prId).catch(() => null),
          architectureAPI.getResult(prId).catch(() => null),
        ])
        setStaticData(s?.data || null)
        setArchData(a?.data || null)
      } catch (err) {
        setError(err?.message || 'Failed to load review results')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [prId])

  const staticIssues = (staticData?.issues || []).map((i) => ({ ...i, sourceAgent: 'agent1' }))
  const archIssues = (archData?.issues || []).map((i) => ({ ...i, sourceAgent: 'agent2' }))
  const allIssues = [...staticIssues, ...archIssues].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 }
    return (order[a.severity] || 5) - (order[b.severity] || 5)
  })

  const filteredIssues = activeTab === 'all' ? allIssues
    : activeTab === 'static' ? staticIssues
    : archIssues

  const summary = allIssues.reduce((acc, i) => {
    acc[i.severity] = (acc[i.severity] || 0) + 1; return acc
  }, {})

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading review results…</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="glass-card p-8 text-center">
      <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
      <h2 className="text-white font-semibold mb-2">Failed to load results</h2>
      <p className="text-slate-400 text-sm">{error}</p>
    </div>
  )

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="font-mono text-slate-400">{prId}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Review Results</h1>
          <p className="text-slate-400 text-sm">{allIssues.length} total issues from Agents 1 &amp; 2</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/explain/${prId}`} className="btn-secondary text-sm">
            <Brain className="w-4 h-4" /> Explanations
          </Link>
          <Link to={`/refactor/${prId}`} className="btn-secondary text-sm">
            <Code2 className="w-4 h-4" /> Refactors
          </Link>
          <Link to={`/report/${prId}`} className="btn-primary text-sm">
            <FileText className="w-4 h-4" /> Full Report
          </Link>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {summary.critical > 0 && <StatPill label="Critical" count={summary.critical} color="bg-red-500/10 border-red-500/30 text-red-400" />}
        {summary.high > 0 && <StatPill label="High" count={summary.high} color="bg-orange-500/10 border-orange-500/30 text-orange-400" />}
        {summary.medium > 0 && <StatPill label="Medium" count={summary.medium} color="bg-yellow-500/10 border-yellow-500/30 text-yellow-400" />}
        {summary.low > 0 && <StatPill label="Low" count={summary.low} color="bg-blue-500/10 border-blue-500/30 text-blue-400" />}
        {summary.info > 0 && <StatPill label="Info" count={summary.info} color="bg-slate-500/10 border-slate-500/30 text-slate-400" />}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-dark-900 rounded-xl mb-6 w-fit">
        {[
          { id: 'all', label: `All (${allIssues.length})` },
          { id: 'static', label: `Static Analysis (${staticIssues.length})`, icon: Code2 },
          { id: 'arch', label: `Architecture (${archIssues.length})`, icon: Brain },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id ? 'bg-brand-600/30 text-brand-300 shadow-sm' : 'text-slate-500 hover:text-white'
            }`}
          >
            {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Issues */}
      <div className="space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <div className="text-slate-400">No issues found in this category 🎉</div>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <IssueCard
              key={issue.findingId}
              issue={issue}
              expanded={expandedId === issue.findingId}
              onExpand={() => setExpandedId(expandedId === issue.findingId ? null : issue.findingId)}
            />
          ))
        )}
      </div>
    </div>
  )
}

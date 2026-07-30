import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { refactorAPI } from '../api/agentAPI'
import DiffViewer from '../components/DiffViewer'
import { Code2, ChevronRight, AlertTriangle, CheckCircle, SkipForward, ChevronDown } from 'lucide-react'

const RISK_COLORS = {
  low:    'bg-green-500/10 border-green-500/20 text-green-400',
  medium: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  high:   'bg-red-500/10 border-red-500/20 text-red-400',
}

function SuggestionCard({ suggestion, index }) {
  const [expanded, setExpanded] = useState(index < 2)

  const isValid   = suggestion.status === 'valid'
  const isSkipped = suggestion.status === 'skipped'

  return (
    <div className={`glass-card overflow-hidden ${isSkipped ? 'opacity-60' : ''}`}>
      <button
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-white/2 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isValid ? 'bg-green-500/10 border border-green-500/20' : 'bg-slate-800 border border-white/5'}`}>
          {isValid ? <CheckCircle className="w-4 h-4 text-green-400" /> : <SkipForward className="w-4 h-4 text-slate-500" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {isValid && (
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${RISK_COLORS[suggestion.riskLevel] || RISK_COLORS.low}`}>
                {suggestion.riskLevel} risk
              </span>
            )}
            {suggestion.requiresTests && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">
                Tests recommended
              </span>
            )}
            {isSkipped && <span className="text-xs text-slate-500">Skipped — requires redesign</span>}
            {suggestion.filePath && (
              <span className="text-xs text-slate-600 font-mono truncate">{suggestion.filePath}</span>
            )}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{suggestion.rationale || 'No rationale provided.'}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform mt-1 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && isValid && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 animate-fade-in">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Code Change</div>
          <DiffViewer suggestion={suggestion} />
        </div>
      )}
    </div>
  )
}

export default function RefactorSuggestions() {
  const { prId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    refactorAPI.getResult(prId)
      .then((res) => setData(res?.data))
      .catch((err) => setError(err?.message || 'Failed to load suggestions'))
      .finally(() => setLoading(false))
  }, [prId])

  const suggestions = data?.suggestions || []
  const validCount   = suggestions.filter((s) => s.status === 'valid').length
  const skippedCount = suggestions.filter((s) => s.status === 'skipped').length

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading refactor suggestions…</p>
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
            <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/review/${prId}`} className="hover:text-white font-mono">{prId}</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Refactors</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Refactor Suggestions</h1>
          <p className="text-slate-400 text-sm">
            Agent 4 generated minimal, behavior-preserving diffs for each finding.
          </p>
        </div>
        <Link to={`/report/${prId}`} className="btn-primary text-sm">
          View Full Report →
        </Link>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-green-400">{validCount} actionable fixes</span>
        </div>
        {skippedCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-white/5">
            <SkipForward className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">{skippedCount} skipped (require redesign)</span>
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-dark-800/60 border border-white/5 mb-6">
        <Code2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-slate-400">
          Each suggestion is the <strong className="text-white">smallest possible change</strong> that resolves the issue while preserving existing behavior. Always review before applying.
        </p>
      </div>

      {error && <div className="glass-card p-6 text-center text-red-400 mb-6">{error}</div>}

      {suggestions.length === 0 && !error ? (
        <div className="glass-card p-10 text-center">
          <Code2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No refactor suggestions found for this PR.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion, idx) => (
            <SuggestionCard key={suggestion.findingId || idx} suggestion={suggestion} index={idx} />
          ))}
        </div>
      )}
    </div>
  )
}

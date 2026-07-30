import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { refactorAPI } from '../api/agentAPI'
import DiffViewer from '../components/DiffViewer'
import { Code2, ChevronRight, AlertTriangle, CheckCircle, SkipForward, ChevronDown } from 'lucide-react'

const RISK_COLORS = {
  low:    'bg-[var(--severity-success-bg)] border-[rgba(31,136,61,0.3)] text-[var(--severity-success)]',
  medium: 'bg-[var(--severity-high-bg)] border-[var(--severity-high-border)] text-[var(--severity-high)]',
  high:   'bg-[var(--severity-critical-bg)] border-[var(--severity-critical-border)] text-[var(--severity-critical)]',
}

function SuggestionCard({ suggestion, index }) {
  const [expanded, setExpanded] = useState(index < 2)

  const isValid   = suggestion.status === 'valid'
  const isSkipped = suggestion.status === 'skipped'

  return (
    <div className={`glass-card overflow-hidden ${isSkipped ? 'opacity-60' : ''}`}>
      <button
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-bg-hover transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isValid ? 'bg-[var(--severity-success-bg)] border border-[rgba(31,136,61,0.3)]' : 'bg-bg-elevated border border-border-default'}`}>
          {isValid ? <CheckCircle className="w-4 h-4 text-[var(--severity-success)]" /> : <SkipForward className="w-4 h-4 text-tx-tertiary" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {isValid && (
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${RISK_COLORS[suggestion.riskLevel] || RISK_COLORS.low}`}>
                {suggestion.riskLevel} risk
              </span>
            )}
            {suggestion.requiresTests && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--severity-high-bg)] border border-[var(--severity-high-border)] text-[var(--severity-high)] font-medium">
                Tests recommended
              </span>
            )}
            {isSkipped && <span className="text-xs text-tx-tertiary">Skipped — requires redesign</span>}
            {suggestion.filePath && (
              <span className="text-xs text-tx-tertiary font-mono truncate">{suggestion.filePath}</span>
            )}
          </div>
          <p className="text-sm text-tx-primary leading-relaxed">{suggestion.rationale || 'No rationale provided.'}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-tx-tertiary flex-shrink-0 transition-transform mt-1 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && isValid && (
        <div className="px-5 pb-5 border-t border-border-default pt-4 animate-fade-in">
          <div className="text-xs font-semibold text-tx-secondary uppercase tracking-wider mb-3">Code Change</div>
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
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-tx-secondary text-sm">Loading refactor suggestions…</p>
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-tx-tertiary text-xs mb-2">
            <Link to="/dashboard" className="hover:text-tx-primary transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/review/${prId}`} className="hover:text-tx-primary font-mono">{prId}</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Refactors</span>
          </div>
          <h1 className="text-3xl font-bold text-tx-primary mb-1">Refactor Suggestions</h1>
          <p className="text-tx-secondary text-sm">
            Agent 4 generated minimal, behavior-preserving diffs for each finding.
          </p>
        </div>
        <Link to={`/report/${prId}`} className="btn-primary text-sm">
          View Full Report →
        </Link>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--severity-success-bg)] border border-[rgba(31,136,61,0.3)]">
          <CheckCircle className="w-4 h-4 text-[var(--severity-success)]" />
          <span className="text-sm font-medium text-[var(--severity-success)]">{validCount} actionable fixes</span>
        </div>
        {skippedCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-elevated border border-border-default">
            <SkipForward className="w-4 h-4 text-tx-tertiary" />
            <span className="text-sm text-tx-secondary">{skippedCount} skipped (require redesign)</span>
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-bg-elevated border border-border-default mb-6">
        <Code2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p className="text-sm text-tx-secondary">
          Each suggestion is the <strong className="text-tx-primary">smallest possible change</strong> that resolves the issue while preserving existing behavior. Always review before applying.
        </p>
      </div>

      {error && <div className="glass-card p-6 text-center text-[var(--severity-critical)] mb-6">{error}</div>}

      {suggestions.length === 0 && !error ? (
        <div className="glass-card p-10 text-center">
          <Code2 className="w-10 h-10 text-tx-tertiary mx-auto mb-3" />
          <p className="text-tx-secondary">No refactor suggestions found for this PR.</p>
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

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { explainerAPI } from '../api/agentAPI'
import { SeverityBadge } from '../components/SeverityBadge'
import { MessageSquare, ChevronRight, Lightbulb, Heart, BookOpen, ChevronDown } from 'lucide-react'

function ExplainerCard({ explanation, index }) {
  const [expanded, setExpanded] = useState(index < 3)

  return (
    <div className="glass-card overflow-hidden">
      <button
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-bg-hover transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-8 h-8 rounded-lg bg-bg-elevated border border-border-default flex items-center justify-center flex-shrink-0 mt-0.5">
          <MessageSquare className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {explanation.severity && <SeverityBadge severity={explanation.severity} />}
            <span className="text-xs text-tx-tertiary font-mono truncate">{explanation.findingId}</span>
          </div>
          {explanation.originalMessage && (
            <p className="text-sm text-tx-primary leading-relaxed line-clamp-2">{explanation.originalMessage}</p>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-tx-tertiary flex-shrink-0 transition-transform mt-1 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-border-default pt-4 space-y-4 animate-fade-in">
          {/* Main explanation */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider mb-2">
              <MessageSquare className="w-3.5 h-3.5" /> Mentor says
            </div>
            <p className="text-sm text-tx-primary leading-relaxed">
              {explanation.explanation || 'No explanation generated.'}
            </p>
          </div>

          {/* Teaching note */}
          {explanation.teachingNote && (
            <div className="bg-[var(--severity-high-bg)] border border-[var(--severity-high-border)] rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--severity-high)] mb-2">
                <Lightbulb className="w-3.5 h-3.5" /> Teaching Note
              </div>
              <p className="text-sm text-tx-primary leading-relaxed">{explanation.teachingNote}</p>
            </div>
          )}

          {/* Encouragement */}
          {explanation.encouragement && (
            <div className="flex items-center gap-2 text-sm text-accent italic">
              <Heart className="w-3.5 h-3.5 flex-shrink-0" />
              {explanation.encouragement}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ExplanationsView() {
  const { prId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    explainerAPI.getResult(prId)
      .then((res) => setData(res?.data))
      .catch((err) => setError(err?.message || 'Failed to load explanations'))
      .finally(() => setLoading(false))
  }, [prId])

  const explanations = data?.explanations || []

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-tx-secondary text-sm">Loading mentor explanations…</p>
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
            <span>Explanations</span>
          </div>
          <h1 className="text-3xl font-bold text-tx-primary mb-1">Mentor Explanations</h1>
          <p className="text-tx-secondary text-sm">
            Agent 3 explains every finding in plain English — the <em>why</em>, not just the what.
          </p>
        </div>
        <Link to={`/refactor/${prId}`} className="btn-primary text-sm">
          View Refactors →
        </Link>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-bg-elevated border border-border-default mb-6">
        <BookOpen className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <p className="text-sm text-tx-secondary">
          Each explanation is written in a mentoring tone — focused on teaching you <strong className="text-tx-primary">why</strong> something is a problem so you understand it, not just copy a fix.
        </p>
      </div>

      {error && (
        <div className="glass-card p-6 text-center text-[var(--severity-critical)] mb-6">{error}</div>
      )}

      {explanations.length === 0 && !error ? (
        <div className="glass-card p-10 text-center">
          <MessageSquare className="w-10 h-10 text-tx-tertiary mx-auto mb-3" />
          <p className="text-tx-secondary">No explanations found for this PR.</p>
          <p className="text-tx-tertiary text-sm mt-1">Make sure you ran the full pipeline from the Submit page.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {explanations.map((explanation, idx) => (
            <ExplainerCard key={explanation.findingId || idx} explanation={explanation} index={idx} />
          ))}
        </div>
      )}
    </div>
  )
}

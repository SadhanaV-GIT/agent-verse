import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { reportAPI } from '../api/agentAPI'
import { SeverityBadge } from '../components/SeverityBadge'
import ReactMarkdown from 'react-markdown'
import {
  FileText, ChevronRight, Download, AlertTriangle, Code2,
  TrendingUp, CheckCircle, Share2, RefreshCw, Terminal
} from 'lucide-react'
import toast from 'react-hot-toast'

function AgentOutputStat({ label, value, color }) {
  return (
    <div className="text-center p-4 rounded-xl bg-bg-elevated border border-border-default shadow-sm group hover:border-border-strong transition-colors">
      <div className={`text-2xl font-bold mb-1 tracking-wider group-hover:scale-110 transition-transform ${color}`}>{value}</div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-tx-secondary">{label}</div>
    </div>
  )
}

export default function FinalReport() {
  const { prId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showMarkdown, setShowMarkdown] = useState(false)

  useEffect(() => {
    reportAPI.getReport(prId)
      .then((res) => setData(res?.data))
      .catch((err) => setError(err?.message || 'Failed to load report'))
      .finally(() => setLoading(false))
  }, [prId])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Report link copied!')
  }

  const handleDownload = () => {
    if (!data?.markdownReport) return
    const blob = new Blob([data.markdownReport], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `devmentor-report-${prId}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Report downloaded!')
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-tx-secondary font-mono text-sm tracking-widest uppercase">Compiling report…</p>
      </div>
    </div>
  )

  if (error || !data) return (
    <div className="glass-card p-8 text-center">
      <AlertTriangle className="w-10 h-10 text-[var(--severity-critical)] mx-auto mb-3 animate-pulse" />
      <h2 className="text-tx-primary font-bold mb-2">Report Not Found</h2>
      <p className="text-tx-tertiary text-sm">{error || 'Run the pipeline first.'}</p>
      <Link to="/submit" className="btn-primary mt-4">Submit New PR</Link>
    </div>
  )

  return (
    <div className="animate-fade-in relative z-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 border-b border-border-default pb-6">
        <div>
          <div className="flex items-center gap-2 text-tx-tertiary text-xs font-mono tracking-wider mb-4">
            <Link to="/dashboard" className="hover:text-tx-primary transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3 text-accent" />
            <span className="text-tx-primary font-bold">{prId}</span>
            <ChevronRight className="w-3 h-3 text-accent" />
            <span>Report</span>
          </div>
          <h1 className="text-3xl font-bold text-tx-primary tracking-tight leading-none mb-2">Final Analysis Report</h1>
          {data.prTitle && (
            <p className="text-tx-secondary mt-1 font-mono text-sm tracking-wide">
              <Terminal className="w-4 h-4 inline mr-2 text-accent-signature" />
              PR: <span className="text-tx-primary">{data.prTitle}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopyLink} className="btn-secondary text-sm gap-2">
            <Share2 className="w-4 h-4" /> Share
          </button>
          {data.markdownReport && (
            <button onClick={handleDownload} className="btn-secondary text-sm gap-2">
              <Download className="w-4 h-4" /> Download .md
            </button>
          )}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-3">
          <FileText className="w-3.5 h-3.5" /> Executive Summary
        </div>
        <p className="text-tx-primary leading-relaxed">{data.summary || 'Summary not available.'}</p>
        {data.developerTrendNote && (
          <div className="mt-4 pt-4 border-t border-border-default flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-accent italic">{data.developerTrendNote}</p>
          </div>
        )}
      </div>

      {/* Agent output stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <AgentOutputStat label="Static Issues" value={data.agentOutputs?.agent1IssueCount ?? '—'} color="text-[var(--severity-low)]" />
        <AgentOutputStat label="Arch Issues" value={data.agentOutputs?.agent2IssueCount ?? '—'} color="text-[var(--accent-signature)]" />
        <AgentOutputStat label="Explanations" value={data.agentOutputs?.agent3ExplanationCount ?? '—'} color="text-[var(--accent)]" />
        <AgentOutputStat label="Refactors" value={data.agentOutputs?.agent4SuggestionCount ?? '—'} color="text-[var(--severity-success)]" />
        <AgentOutputStat label="Developer PRs" value={data.agentOutputs?.developerPRCount ?? '—'} color="text-[var(--severity-high)]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Issues */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-tx-primary text-sm mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[var(--severity-high)]" /> Top Issues
          </h3>
          <div className="space-y-3">
            {(data.topIssues || []).length === 0 ? (
              <p className="text-tx-tertiary text-sm">No top issues recorded.</p>
            ) : (
              data.topIssues.map((issue, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated border border-border-default">
                  <SeverityBadge severity={issue.severity} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-tx-primary leading-snug">{issue.message}</p>
                    {issue.explanation && (
                      <p className="text-xs text-tx-tertiary mt-1 line-clamp-2">{issue.explanation}</p>
                    )}
                    {issue.hasRefactor && (
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--severity-success)] mt-1">
                        <CheckCircle className="w-3 h-3" /> Fix available
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Refactor Highlights */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-tx-primary text-sm mb-4 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[var(--severity-success)]" /> Refactor Highlights
          </h3>
          <div className="space-y-3">
            {(data.refactorHighlights || []).length === 0 ? (
              <p className="text-tx-tertiary text-sm">No refactor highlights.</p>
            ) : (
              data.refactorHighlights.map((r, i) => (
                <div key={i} className="p-3 rounded-lg bg-bg-elevated border border-border-default">
                  {r.filePath && <div className="text-xs font-mono text-tx-tertiary mb-1">{r.filePath}</div>}
                  <p className="text-sm text-tx-primary">{r.rationale}</p>
                  <div className={`text-xs mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-medium ${
                    r.riskLevel === 'low' ? 'bg-[var(--severity-success-bg)] border-[rgba(31,136,61,0.3)] text-[var(--severity-success)]' :
                    r.riskLevel === 'high' ? 'bg-[var(--severity-critical-bg)] border-[var(--severity-critical-border)] text-[var(--severity-critical)]' :
                    'bg-[var(--severity-high-bg)] border-[var(--severity-high-border)] text-[var(--severity-high)]'
                  }`}>{r.riskLevel} risk</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Markdown Report */}
      {data.markdownReport && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-tx-primary text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" /> Full Markdown Report
            </h3>
            <button onClick={() => setShowMarkdown(!showMarkdown)} className="text-xs text-accent-signature hover:underline">
              {showMarkdown ? 'Collapse' : 'Expand'}
            </button>
          </div>
          {showMarkdown && (
            <div className="prose prose-sm max-w-none prose-headings:text-tx-primary prose-a:text-accent-signature prose-strong:text-tx-primary prose-code:text-accent prose-code:bg-bg-elevated prose-code:px-1 prose-code:rounded animate-fade-in text-tx-primary">
              <ReactMarkdown>{data.markdownReport}</ReactMarkdown>
            </div>
          )}
          {!showMarkdown && (
            <div className="text-tx-tertiary text-sm italic">Click "Expand" to read the full report, or download it as Markdown.</div>
          )}
        </div>
      )}

      {/* Navigation footer */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-default">
        <Link to={`/refactor/${prId}`} className="btn-ghost">← Refactor Suggestions</Link>
        <Link to="/submit" className="btn-primary">Submit Another PR</Link>
      </div>
    </div>
  )
}

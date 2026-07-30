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
import { GlitchText } from '../components/CyberGlow'

function AgentOutputStat({ label, value, color }) {
  return (
    <div className="text-center p-4 rounded-xl bg-black/40 border border-white/10 shadow-inner group hover:border-white/20 transition-colors">
      <div className={`text-2xl font-bold mb-1 font-display tracking-wider group-hover:scale-110 transition-transform ${color}`}>{value}</div>
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
        <p className="text-tx-secondary font-mono text-sm tracking-widest uppercase">Compiling neural report…</p>
      </div>
    </div>
  )

  if (error || !data) return (
    <div className="glass-card p-8 text-center">
      <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3 animate-pulse" />
      <h2 className="text-white font-bold mb-2 font-display uppercase tracking-widest">Report Not Found</h2>
      <p className="text-tx-tertiary text-sm font-mono">{error || 'Run the pipeline first.'}</p>
      <Link to="/submit" className="btn-primary mt-4">Initiate New Sequence</Link>
    </div>
  )

  return (
    <div className="animate-fade-in relative z-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-tx-secondary text-[10px] font-mono tracking-widest uppercase mb-4">
            <Link to="/dashboard" className="hover:text-white">Core System</Link>
            <ChevronRight className="w-3 h-3 text-accent" />
            <span className="text-white font-bold">{prId}</span>
            <ChevronRight className="w-3 h-3 text-accent" />
            <span>Output Matrix</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-display uppercase tracking-widest leading-none mb-2"><GlitchText text="FINAL NEURAL REPORT" /></h1>
          {data.prTitle && (
            <p className="text-tx-secondary mt-1 font-mono text-sm tracking-wide">
              <Terminal className="w-4 h-4 inline mr-2 text-accent-signature" />
              Vector: <span className="text-white">{data.prTitle}</span>
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
      <div className="glass-card p-6 mb-6 border-brand-500/20">
        <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <FileText className="w-3.5 h-3.5" /> Executive Summary
        </div>
        <p className="text-slate-200 leading-relaxed">{data.summary || 'Summary not available.'}</p>
        {data.developerTrendNote && (
          <div className="mt-4 pt-4 border-t border-white/5 flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-accent-300 italic">{data.developerTrendNote}</p>
          </div>
        )}
      </div>

      {/* Agent output stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <AgentOutputStat label="Static Issues" value={data.agentOutputs?.agent1IssueCount ?? '—'} color="text-blue-400" />
        <AgentOutputStat label="Arch Issues" value={data.agentOutputs?.agent2IssueCount ?? '—'} color="text-purple-400" />
        <AgentOutputStat label="Explanations" value={data.agentOutputs?.agent3ExplanationCount ?? '—'} color="text-brand-400" />
        <AgentOutputStat label="Refactors" value={data.agentOutputs?.agent4SuggestionCount ?? '—'} color="text-green-400" />
        <AgentOutputStat label="Developer PRs" value={data.agentOutputs?.developerPRCount ?? '—'} color="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Issues */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" /> Top Issues
          </h3>
          <div className="space-y-3">
            {(data.topIssues || []).length === 0 ? (
              <p className="text-slate-500 text-sm">No top issues recorded.</p>
            ) : (
              data.topIssues.map((issue, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-dark-900/50 border border-white/5">
                  <SeverityBadge severity={issue.severity} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 leading-snug">{issue.message}</p>
                    {issue.explanation && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{issue.explanation}</p>
                    )}
                    {issue.hasRefactor && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400 mt-1">
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
          <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-green-400" /> Refactor Highlights
          </h3>
          <div className="space-y-3">
            {(data.refactorHighlights || []).length === 0 ? (
              <p className="text-slate-500 text-sm">No refactor highlights.</p>
            ) : (
              data.refactorHighlights.map((r, i) => (
                <div key={i} className="p-3 rounded-lg bg-dark-900/50 border border-white/5">
                  {r.filePath && <div className="text-xs font-mono text-slate-500 mb-1">{r.filePath}</div>}
                  <p className="text-sm text-slate-300">{r.rationale}</p>
                  <div className={`text-xs mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-medium ${
                    r.riskLevel === 'low' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                    r.riskLevel === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
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
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-400" /> Full Markdown Report
            </h3>
            <button onClick={() => setShowMarkdown(!showMarkdown)} className="text-xs text-brand-400 hover:text-brand-300">
              {showMarkdown ? 'Collapse' : 'Expand'}
            </button>
          </div>
          {showMarkdown && (
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-a:text-brand-400 prose-strong:text-white prose-code:text-brand-300 prose-code:bg-dark-800 prose-code:px-1 prose-code:rounded animate-fade-in">
              <ReactMarkdown>{data.markdownReport}</ReactMarkdown>
            </div>
          )}
          {!showMarkdown && (
            <div className="text-slate-500 text-sm italic">Click "Expand" to read the full report, or download it as Markdown.</div>
          )}
        </div>
      )}

      {/* Navigation footer */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
        <Link to={`/refactor/${prId}`} className="btn-ghost">← Refactor Suggestions</Link>
        <Link to="/submit" className="btn-primary">Submit Another PR</Link>
      </div>
    </div>
  )
}

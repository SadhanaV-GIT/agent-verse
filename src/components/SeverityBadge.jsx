import { AlertTriangle, AlertCircle, Info, Shield, ChevronDown } from 'lucide-react'

const SEVERITY_CONFIG = {
  // Canonical stored values (matches DB enum)
  critical: { label: 'Critical', color: 'text-severity-critical', borderColor: 'border-severity-critical-border', bg: 'bg-severity-critical-bg', icon: Shield },
  high:     { label: 'High',     color: 'text-severity-high', borderColor: 'border-severity-high-border', bg: 'bg-severity-high-bg', icon: AlertTriangle },
  medium:   { label: 'Medium',   color: 'text-severity-medium', borderColor: 'border-severity-medium-border', bg: 'bg-severity-medium-bg', icon: AlertCircle },
  low:      { label: 'Low',      color: 'text-severity-low', borderColor: 'border-severity-low-border', bg: 'bg-severity-low-bg', icon: Info },
  info:     { label: 'Info',     color: 'text-tx-secondary', borderColor: 'border-border-default', bg: 'bg-bg-elevated', icon: Info },
  // Aliases: LLM prompt values that may leak through before service normalisation
  error:    { label: 'High',     color: 'text-severity-high', borderColor: 'border-severity-high-border', bg: 'bg-severity-high-bg', icon: AlertTriangle },
  warning:  { label: 'Medium',   color: 'text-severity-medium', borderColor: 'border-severity-medium-border', bg: 'bg-severity-medium-bg', icon: AlertCircle },
  // Catch-all: unknown value renders as visible gray instead of silently becoming Info
  unknown:  { label: 'Unknown',  color: 'text-tx-secondary', borderColor: 'border-border-default', bg: 'bg-bg-elevated', icon: AlertCircle },
}

export function SeverityBadge({ severity }) {
  const config = SEVERITY_CONFIG[(severity || '').toLowerCase()] || SEVERITY_CONFIG.unknown
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.bg} ${config.borderColor} ${config.color}`}>
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      {config.label}
    </span>
  )
}

export function IssueCard({ issue, explanation, onExpand, expanded }) {
  const config = SEVERITY_CONFIG[(issue.severity || '').toLowerCase()] || SEVERITY_CONFIG.unknown
  const Icon = config.icon

  return (
    <div
      className={`glass-card p-5 border ${config.borderColor} ${config.bg} cursor-pointer hover:bg-bg-hover transition-colors`}
      onClick={onExpand}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-bg-base border ${config.borderColor} ${config.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <SeverityBadge severity={issue.severity} />
              <span className="text-xs text-tx-tertiary font-mono">{issue.type}</span>
              {issue.filePath && (
                <span className="text-xs text-tx-tertiary font-mono truncate">
                  {issue.filePath}{issue.line ? `:${issue.line}` : ''}
                </span>
              )}
            </div>
            <p className="text-sm text-tx-primary leading-relaxed">{issue.message}</p>
            {explanation && !expanded && (
              <p className="text-xs text-tx-tertiary mt-1 line-clamp-1">{explanation.explanation}</p>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-tx-quaternary flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </div>

      {expanded && explanation && (
        <div className="mt-4 pt-4 border-t border-border-subtle space-y-3 animate-fade-in">
          <div>
            <div className="text-xs font-semibold text-tx-secondary uppercase tracking-wider mb-1">Mentor Explanation</div>
            <p className="text-sm text-tx-secondary leading-relaxed">{explanation.explanation}</p>
          </div>
          {explanation.teachingNote && (
            <div className="bg-bg-elevated border border-border-default rounded-lg p-3">
              <div className="text-xs font-semibold text-tx-primary mb-1">💡 Teaching Note</div>
              <p className="text-sm text-tx-secondary">{explanation.teachingNote}</p>
            </div>
          )}
          {explanation.encouragement && (
            <p className="text-xs text-accent italic">{explanation.encouragement}</p>
          )}
        </div>
      )}
    </div>
  )
}

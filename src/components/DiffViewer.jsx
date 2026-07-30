import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

function parseDiff(diff) {
  if (!diff) return []
  return diff.split('\n').map((line) => {
    if (line.startsWith('+') && !line.startsWith('+++')) return { type: 'add', content: line }
    if (line.startsWith('-') && !line.startsWith('---')) return { type: 'remove', content: line }
    return { type: 'context', content: line }
  })
}

export default function DiffViewer({ suggestion }) {
  const [view, setView] = useState('diff') // 'diff' | 'side'
  const [copied, setCopied] = useState(false)

  const diffLines = parseDiff(suggestion.diff)

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion.refactoredCode || suggestion.diff || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!suggestion.diff && !suggestion.originalCode) {
    return (
      <div className="code-block p-4 text-tx-tertiary text-sm">
        No diff available for this suggestion.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setView('diff')} className={`text-xs px-3 py-1 rounded-lg transition-colors ${view === 'diff' ? 'bg-bg-elevated text-tx-primary border border-border-default' : 'text-tx-secondary hover:text-tx-primary'}`}>
            Diff View
          </button>
          <button onClick={() => setView('side')} className={`text-xs px-3 py-1 rounded-lg transition-colors ${view === 'side' ? 'bg-bg-elevated text-tx-primary border border-border-default' : 'text-tx-secondary hover:text-tx-primary'}`}>
            Side by Side
          </button>
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-tx-tertiary hover:text-tx-primary transition-colors">
          {copied ? <Check className="w-3.5 h-3.5 text-[var(--severity-success)]" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {view === 'diff' ? (
        <div className="code-block p-4 overflow-x-auto">
          {diffLines.map((line, idx) => (
            <div key={idx} className={`font-mono text-xs leading-relaxed px-2 ${
              line.type === 'add' ? 'diff-add' : line.type === 'remove' ? 'diff-remove' : 'diff-ctx'
            }`}>
              {line.content || ' '}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-[var(--severity-critical)] font-medium mb-1 px-1">Before</div>
            <div className="code-block p-3 text-xs font-mono text-tx-primary overflow-x-auto whitespace-pre">
              {suggestion.originalCode || ''}
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--severity-success)] font-medium mb-1 px-1">After</div>
            <div className="code-block p-3 text-xs font-mono text-tx-primary overflow-x-auto whitespace-pre">
              {suggestion.refactoredCode || ''}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

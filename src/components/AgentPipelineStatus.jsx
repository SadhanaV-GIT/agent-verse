import { Check, Loader2, AlertCircle, Clock } from 'lucide-react'

const AGENTS = [
  { id: 1, name: 'Static Analysis', description: 'Syntax & style issues' },
  { id: 2, name: 'Architecture Review', description: 'Design & SOLID violations' },
  { id: 3, name: 'Explainer', description: 'Mentor-style explanations' },
  { id: 4, name: 'Refactor Suggestion', description: 'Minimal code diffs' },
  { id: 5, name: 'Progress Tracking', description: 'Growth profile update' },
  { id: 6, name: 'Report Generator', description: 'Final PR summary' },
]

// status: 'pending' | 'running' | 'done' | 'error'
export default function AgentPipelineStatus({ agentStatuses = {} }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
        <h3 className="font-semibold text-white text-sm">Agent Pipeline</h3>
      </div>

      <div className="space-y-3">
        {AGENTS.map((agent, idx) => {
          const status = agentStatuses[agent.id] || 'pending'
          const isRunning = status === 'running'
          const isDone = status === 'done'
          const isError = status === 'error'

          return (
            <div key={agent.id} className="flex items-center gap-4">
              {/* Step indicator */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-500 ${
                isDone ? 'agent-step-done' : isRunning ? 'agent-step-running' : isError ? 'agent-step-error' : 'agent-step-pending'
              }`}>
                {isDone ? <Check className="w-4 h-4" /> : isRunning ? <Loader2 className="w-4 h-4 animate-spin text-brand-400" /> : isError ? <AlertCircle className="w-4 h-4" /> : <span className="text-slate-600">{agent.id}</span>}
              </div>

              {/* Connector line */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm font-medium transition-colors ${isDone ? 'text-white' : isRunning ? 'text-brand-300' : 'text-slate-500'}`}>
                      Agent {agent.id} — {agent.name}
                    </div>
                    <div className="text-xs text-slate-600">{agent.description}</div>
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isDone ? 'bg-accent-500/20 text-accent-400' :
                    isRunning ? 'bg-brand-500/20 text-brand-300 animate-pulse' :
                    isError ? 'bg-red-500/20 text-red-400' :
                    'bg-slate-800 text-slate-600'
                  }`}>
                    {isDone ? '✓ Done' : isRunning ? '⟳ Running' : isError ? '✗ Error' : 'Pending'}
                  </div>
                </div>
                {/* Progress bar */}
                {isRunning && (
                  <div className="mt-2 h-0.5 bg-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full animate-pulse w-3/4" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

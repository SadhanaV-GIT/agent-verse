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
    <div className="bg-bg-elevated border border-border-default rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-border-default pb-4">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <h3 className="font-semibold text-tx-primary text-sm">Agent Pipeline</h3>
      </div>

      <div className="space-y-4 relative">
        {/* Animated vertical connecting line */}
        <div className="absolute left-4 top-4 bottom-4 w-px bg-border-default z-0" />

        {AGENTS.map((agent, idx) => {
          const status = agentStatuses[agent.id] || 'pending'
          const isRunning = status === 'running'
          const isDone = status === 'done'
          const isError = status === 'error'

          return (
            <div key={agent.id} className="flex items-start gap-4 relative z-10 group">
              {/* Step indicator */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-500 border-2 ${
                isDone ? 'bg-bg-base border-[#238636] text-[#238636] shadow-[0_0_10px_rgba(35,134,54,0.2)]' : 
                isRunning ? 'bg-bg-base border-accent text-accent shadow-[0_0_15px_var(--accent)] scale-110' : 
                isError ? 'bg-bg-base border-[#f85149] text-[#f85149] shadow-[0_0_10px_rgba(248,81,73,0.2)]' : 
                'bg-bg-base border-border-strong text-tx-tertiary'
              }`}>
                {isDone ? <Check className="w-4 h-4" /> : 
                 isRunning ? <Loader2 className="w-4 h-4 animate-spin text-accent" /> : 
                 isError ? <AlertCircle className="w-4 h-4" /> : 
                 <span>{agent.id}</span>
                }
              </div>

              {/* Action card */}
              <div className={`flex-1 p-3 rounded-lg border transition-all duration-300 transform group-hover:-translate-y-0.5 group-hover:shadow-md ${
                isRunning ? 'bg-bg-base border-accent shadow-sm' :
                isDone ? 'bg-bg-base border-border-default shadow-sm opacity-90' :
                'bg-bg-hover border-transparent'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm font-semibold transition-colors ${
                      isDone ? 'text-tx-primary' : 
                      isRunning ? 'text-accent' : 
                      'text-tx-secondary'
                    }`}>
                      Agent {agent.id} — {agent.name}
                    </div>
                    <div className="text-xs text-tx-tertiary mt-1">{agent.description}</div>
                  </div>
                  <div className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border ${
                    isDone ? 'bg-[rgba(35,134,54,0.1)] text-[#238636] border-[rgba(35,134,54,0.2)]' :
                    isRunning ? 'bg-[var(--accent)] text-accent-text border-accent animate-pulse' :
                    isError ? 'bg-[rgba(248,81,73,0.1)] text-[#f85149] border-[rgba(248,81,73,0.2)]' :
                    'bg-bg-elevated text-tx-tertiary border-border-default'
                  }`}>
                    {isDone ? '✓ Done' : isRunning ? '⟳ Running' : isError ? '✗ Error' : 'Pending'}
                  </div>
                </div>
                {/* Progress bar for running agent */}
                {isRunning && (
                  <div className="mt-4 h-1 bg-border-default rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full animate-[pulse_1s_ease-in-out_infinite] w-3/4 shadow-[0_0_10px_var(--accent)]" />
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

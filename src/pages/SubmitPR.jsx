import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { staticAPI, architectureAPI, explainerAPI, refactorAPI, progressAPI, reportAPI } from '../api/agentAPI'
import AgentPipelineStatus from '../components/AgentPipelineStatus'
import toast from 'react-hot-toast'
import { Upload, Plus, Trash2, Play, FileCode2, ChevronRight, Terminal } from 'lucide-react'
import { GlitchText } from '../components/CyberGlow'

const SAMPLE_CODE = `// Sample JavaScript file with intentional issues
function getUserData(userId) {
  var data = db.query("SELECT * FROM users WHERE id = " + userId);
  var result = [];
  for(var i = 0; i < data.length; i++) {
    result.push(data[i]);
  }
  console.log("Got data:", data);
  return result;
}

class UserManager {
  constructor() {
    this.users = [];
    this.orders = [];
    this.products = [];
    this.payments = [];
    this.notifications = [];
    this.reports = [];
  }
  
  addUser(user) { this.users.push(user); }
  deleteUser(id) { this.users = this.users.filter(u => u.id != id); }
  processOrder(order) { this.orders.push(order); }
  sendEmail(to, subject, body) { /* email logic */ }
  generateReport() { /* report logic */ }
  processPayment(amount) { return amount * 1.18; }
}
`

export default function SubmitPR() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [prTitle, setPrTitle] = useState('')
  const [files, setFiles] = useState([{ path: 'src/app.js', content: '' }])
  const [agentStatuses, setAgentStatuses] = useState({})
  const [running, setRunning] = useState(false)
  const [currentPrId, setCurrentPrId] = useState(null)

  const setAgentStatus = (agentNum, status) =>
    setAgentStatuses((prev) => ({ ...prev, [agentNum]: status }))

  const addFile = () => setFiles([...files, { path: '', content: '' }])
  const removeFile = (idx) => setFiles(files.filter((_, i) => i !== idx))
  const updateFile = (idx, key, val) =>
    setFiles(files.map((f, i) => (i === idx ? { ...f, [key]: val } : f)))

  const useSample = () => {
    setFiles([{ path: 'src/app.js', content: SAMPLE_CODE }])
    setPrTitle('Feature: User management refactor')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validFiles = files.filter((f) => f.path && f.content)
    if (validFiles.length === 0) return toast.error('Add at least one file with content')
    if (!prTitle) return toast.error('Please enter a PR title')

    setRunning(true)
    setAgentStatuses({})

    const prId = `pr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setCurrentPrId(prId)

    try {
      // Agent 1 — Static Analysis
      setAgentStatus(1, 'running')
      const a1 = await staticAPI.analyze(prId, prTitle, validFiles)
      setAgentStatus(1, 'done')

      // Agent 2 — Architecture Review
      setAgentStatus(2, 'running')
      const a2 = await architectureAPI.review(prId, validFiles)
      setAgentStatus(2, 'done')

      // Combine all issues for downstream agents
      const allIssues = [
        ...(a1.issues || []).map((i) => ({ ...i, sourceAgent: 'agent1' })),
        ...(a2.issues || []).map((i) => ({ ...i, sourceAgent: 'agent2' })),
      ]

      // Agent 3 — Explainer (feed combined issues)
      setAgentStatus(3, 'running')
      await explainerAPI.explain(prId, allIssues)
      setAgentStatus(3, 'done')

      // Agent 4 — Refactor (feed combined findings with file content)
      setAgentStatus(4, 'running')
      const findingsWithContext = allIssues.map((issue) => {
        const file = validFiles.find((f) => f.path === issue.filePath)
        return { ...issue, fileContent: file?.content || '' }
      })
      await refactorAPI.suggest(prId, findingsWithContext)
      setAgentStatus(4, 'done')

      // Agent 5 — Progress Tracking
      setAgentStatus(5, 'running')
      const developerId = user.id || user._id?.toString() || user.email
      await progressAPI.update(developerId, user.name, prId, new Date().toISOString(), allIssues)
      setAgentStatus(5, 'done')

      // Agent 6 — Report
      setAgentStatus(6, 'running')
      await reportAPI.generate(prId, prTitle, user.name)
      setAgentStatus(6, 'done')

      // Save to local history
      const prs = JSON.parse(localStorage.getItem('devmentor_prs') || '[]')
      const topSeverity = allIssues.find((i) => i.severity === 'critical')?.severity ||
                          allIssues.find((i) => i.severity === 'high')?.severity ||
                          allIssues[0]?.severity
      prs.push({
        prId, title: prTitle, date: new Date().toISOString(),
        issueCount: allIssues.length, criticalCount: allIssues.filter((i) => i.severity === 'critical').length,
        severity: topSeverity,
      })
      localStorage.setItem('devmentor_prs', JSON.stringify(prs))

      toast.success('All 6 agents completed! 🎉')
      setTimeout(() => navigate(`/report/${prId}`), 800)
    } catch (error) {
      // Find which agent failed
      const failedAgent = Object.entries(agentStatuses).find(([, s]) => s === 'running')?.[0]
      if (failedAgent) setAgentStatus(Number(failedAgent), 'error')
      toast.error(error?.message || 'Analysis failed. Check that all agents are running.')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="animate-fade-in relative z-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-display uppercase tracking-widest text-white mb-2"><GlitchText text="EXECUTE ANALYSIS" /></h1>
        <p className="text-tx-secondary text-sm font-mono tracking-wide">
          <Terminal className="w-4 h-4 inline mr-2 text-accent-signature" />
          Mount a new pull request into the Swarm for multi-agent evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-white">PR Details</label>
              <button type="button" onClick={useSample} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                <FileCode2 className="w-3.5 h-3.5" /> Load Sample Code
              </button>
            </div>
            <input
              id="pr-title"
              type="text"
              value={prTitle}
              onChange={(e) => setPrTitle(e.target.value)}
              className="input"
              placeholder="e.g. Feature: Add user authentication"
            />
          </div>

          {/* Files */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white">Code Files</h3>
              <button type="button" onClick={addFile} className="btn-ghost text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add File
              </button>
            </div>

            <div className="space-y-4">
              {files.map((file, idx) => (
                <div key={idx} className="border border-white/5 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 bg-dark-900/60 px-3 py-2 border-b border-white/5">
                    <FileCode2 className="w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={file.path}
                      onChange={(e) => updateFile(idx, 'path', e.target.value)}
                      className="flex-1 bg-transparent text-xs font-mono text-slate-300 focus:outline-none placeholder-slate-600"
                      placeholder="src/example.js"
                    />
                    {files.length > 1 && (
                      <button type="button" onClick={() => removeFile(idx)} className="text-slate-600 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={file.content}
                    onChange={(e) => updateFile(idx, 'content', e.target.value)}
                    className="w-full bg-transparent font-mono text-xs text-slate-300 p-3 focus:outline-none resize-none placeholder-slate-700 min-h-[200px]"
                    placeholder="// Paste your code here..."
                    spellCheck={false}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            id="run-pipeline-btn"
            type="button"
            onClick={handleSubmit}
            disabled={running}
            className="btn-primary w-full py-4 text-base gap-3"
          >
            {running ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Running Pipeline...</>
            ) : (
              <><Play className="w-5 h-5" /> Run 6-Agent Analysis</>
            )}
          </button>
        </div>

        {/* Pipeline Status */}
        <div className="space-y-4">
          <AgentPipelineStatus agentStatuses={agentStatuses} />
          <div className="glass-card p-5">
            <h4 className="text-sm font-medium text-white mb-3">How it works</h4>
            <div className="space-y-2.5">
              {['Paste code for any language', 'All 6 agents run sequentially', 'Results appear per-agent in real time', 'Get mentor explanations + diffs', 'Track your growth over time'].map((step, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-400">
                  <div className="w-5 h-5 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</div>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

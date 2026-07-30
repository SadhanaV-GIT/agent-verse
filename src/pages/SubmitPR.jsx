import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { staticAPI, architectureAPI, explainerAPI, refactorAPI, progressAPI, reportAPI } from '../api/agentAPI'
import AgentPipelineStatus from '../components/AgentPipelineStatus'
import toast from 'react-hot-toast'
import { Upload, Plus, Trash2, Play, FileCode2, ChevronRight, Terminal, GitBranch, GitMerge } from 'lucide-react'

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
      setAgentStatus(1, 'running')
      const a1 = await staticAPI.analyze(prId, prTitle, validFiles)
      setAgentStatus(1, 'done')

      setAgentStatus(2, 'running')
      const a2 = await architectureAPI.review(prId, validFiles)
      setAgentStatus(2, 'done')

      const allIssues = [
        ...(a1.issues || []).map((i) => ({ ...i, sourceAgent: 'agent1' })),
        ...(a2.issues || []).map((i) => ({ ...i, sourceAgent: 'agent2' })),
      ]

      setAgentStatus(3, 'running')
      await explainerAPI.explain(prId, allIssues)
      setAgentStatus(3, 'done')

      setAgentStatus(4, 'running')
      const findingsWithContext = allIssues.map((issue) => {
        const file = validFiles.find((f) => f.path === issue.filePath)
        return { ...issue, fileContent: file?.content || '' }
      })
      await refactorAPI.suggest(prId, findingsWithContext)
      setAgentStatus(4, 'done')

      setAgentStatus(5, 'running')
      const developerId = user.id || user._id?.toString() || user.email
      await progressAPI.update(developerId, user.name, prId, new Date().toISOString(), allIssues)
      setAgentStatus(5, 'done')

      setAgentStatus(6, 'running')
      await reportAPI.generate(prId, prTitle, user.name)
      setAgentStatus(6, 'done')

      const prs = JSON.parse(localStorage.getItem(`devmentor_prs_${developerId}`) || '[]')
      const topSeverity = allIssues.find((i) => i.severity === 'critical')?.severity ||
                          allIssues.find((i) => i.severity === 'high')?.severity ||
                          allIssues[0]?.severity
      prs.push({
        prId, title: prTitle, date: new Date().toISOString(),
        issueCount: allIssues.length, criticalCount: allIssues.filter((i) => i.severity === 'critical').length,
        severity: topSeverity,
      })
      localStorage.setItem(`devmentor_prs_${developerId}`, JSON.stringify(prs))

      toast.success('Pull request analyzed successfully.')
      setTimeout(() => navigate(`/report/${prId}`), 800)
    } catch (error) {
      const failedAgent = Object.entries(agentStatuses).find(([, s]) => s === 'running')?.[0]
      if (failedAgent) setAgentStatus(Number(failedAgent), 'error')
      toast.error(error?.message || 'Analysis failed. Check that all agents are running.')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="w-full text-tx-primary pb-16">
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-border-default pb-6">
        <div>
          <h1 className="text-[32px] font-medium text-tx-primary mb-2 tracking-tight">Open a pull request</h1>
          <p className="text-tx-secondary text-sm">Create a new pull request by comparing changes across files.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 text-sm bg-bg-elevated border border-border-default rounded-md px-4 py-3 text-tx-secondary">
        <GitBranch className="w-4 h-4 text-tx-primary" />
        <span className="bg-bg-hover px-2 py-0.5 rounded-md border border-border-strong text-tx-primary font-mono text-xs">base: main</span>
        <span className="mx-1">←</span>
        <span className="bg-bg-hover px-2 py-0.5 rounded-md border border-border-strong text-tx-primary font-mono text-xs">compare: feature-branch</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-4">
            <div className="hidden md:flex w-12 h-12 rounded-full border border-border-default overflow-hidden items-center justify-center bg-bg-elevated text-lg font-bold text-tx-secondary flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            
            <div className="flex-1 bg-bg-base border border-border-default rounded-md flex flex-col pt-2 relative shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="absolute top-4 -left-[9px] hidden md:block">
                <div className="w-4 h-4 bg-bg-base border-l border-t border-border-default transform -rotate-45"></div>
              </div>
              
              <div className="px-4 pb-2 border-b border-border-default flex justify-between items-center bg-bg-base z-10 rounded-t-md">
                <div className="flex gap-4">
                  <span className="text-sm font-semibold text-tx-primary px-2 py-1 border-b-2 border-[#fd8c73]">Write</span>
                </div>
                <button type="button" onClick={useSample} className="text-xs text-accent-signature hover:underline">
                  Load sample
                </button>
              </div>
              
              <div className="bg-bg-elevated p-2">
                <input
                  type="text"
                  value={prTitle}
                  onChange={(e) => setPrTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-base border border-border-default rounded-md text-sm text-tx-primary focus:outline-none focus:ring-2 focus:ring-[rgba(88,166,255,0.3)] focus:border-accent-signature transition-all mb-4"
                  placeholder="Title"
                />
                
                <div className="space-y-4">
                  {files.map((file, idx) => (
                    <div key={idx} className="border border-border-default rounded-md overflow-hidden bg-bg-base">
                      <div className="flex items-center gap-2 bg-bg-hover px-3 py-2 border-b border-border-default">
                        <FileCode2 className="w-4 h-4 text-tx-secondary" />
                        <input
                          type="text"
                          value={file.path}
                          onChange={(e) => updateFile(idx, 'path', e.target.value)}
                          className="flex-1 bg-transparent text-xs font-mono text-tx-primary focus:outline-none"
                          placeholder="path/to/file.js"
                        />
                        {files.length > 1 && (
                          <button type="button" onClick={() => removeFile(idx)} className="text-tx-secondary hover:text-severity-critical transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <textarea
                        value={file.content}
                        onChange={(e) => updateFile(idx, 'content', e.target.value)}
                        className="w-full bg-bg-base font-mono text-xs text-tx-primary p-3 focus:outline-none resize-y min-h-[200px]"
                        placeholder="// Add your code changes here..."
                        spellCheck={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-bg-elevated border-t border-border-default p-3 flex justify-between items-center rounded-b-md">
                <button type="button" onClick={addFile} className="text-sm font-medium text-tx-primary bg-bg-hover border border-border-default hover:bg-[#30363d] px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add file
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={running}
                  className="bg-accent hover:bg-accent-hover text-accent-text px-6 py-2 rounded-md text-sm font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-2 disabled:opacity-50 border border-[rgba(240,246,252,0.1)]"
                >
                  {running ? (
                    <><div className="w-4 h-4 border-2 border-[var(--accent-text)] opacity-30 border-t-[var(--accent-text)] rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <><GitMerge className="w-4 h-4" /> Create pull request</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar Status */}
        <div className="lg:col-span-1">
          <AgentPipelineStatus agentStatuses={agentStatuses} />
          <div className="mt-6 text-xs text-tx-secondary space-y-4">
            <h4 className="font-semibold text-tx-primary mb-2 border-b border-border-default pb-2">Swarm Active Reviewers</h4>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-bg-elevated transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-[var(--severity-critical)] shadow-[0_0_8px_var(--severity-critical)]"></span> Static Analysis Agent
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-bg-elevated transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-[var(--severity-high)] shadow-[0_0_8px_var(--severity-high)]"></span> Architecture Agent
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-bg-elevated transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-[var(--severity-low)] shadow-[0_0_8px_var(--severity-low)]"></span> Security & Explainer
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-bg-elevated transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-[var(--severity-success)] shadow-[0_0_8px_var(--severity-success)]"></span> Refactor Agent
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

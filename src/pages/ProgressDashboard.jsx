import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { progressAPI } from '../api/agentAPI'
import { useAuth } from '../context/AuthContext'
import {
  TrendingUp, TrendingDown, ChevronRight, Award, AlertTriangle, BarChart3, Activity, Terminal
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts'
import { GlitchText } from '../components/CyberGlow'

const COLORS = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#3b82f6', info: '#6b7280' }
const CHART_COLORS = ['#D946EF', '#10b981', '#f97316', '#ef4444', '#eab308', '#06B6D4', '#a78bfa', '#34d399']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-black/90 border border-white/10 rounded-xl p-3 text-xs shadow-[0_0_15px_rgba(217,70,239,0.2)]">
      <p className="text-tx-secondary mb-1 font-mono uppercase tracking-widest">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-bold font-mono">{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function ProgressDashboard() {
  const { devId } = useParams()
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const targetId = devId || user?.id

  useEffect(() => {
    if (!targetId) return
    progressAPI.getDashboard(targetId)
      .then((res) => setData(res?.data))
      .catch((err) => setError(err?.message || 'Failed to load progress data'))
      .finally(() => setLoading(false))
  }, [targetId])

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-tx-secondary text-sm font-mono tracking-widest uppercase">Connecting to neural grid...</p>
      </div>
    </div>
  )

  if (error || !data || !data.developer) return (
    <div className="glass-card p-10 text-center">
      <Activity className="w-10 h-10 text-tx-secondary mx-auto mb-3 animate-pulse" />
      <h2 className="text-white font-bold mb-2 font-display uppercase tracking-widest">No Telemetry Detected</h2>
      <p className="text-tx-tertiary text-sm mb-5 font-mono">Execute a PR analysis to begin indexing your neural growth.</p>
      <Link to="/submit" className="btn-primary">Initiate Review Cycle</Link>
    </div>
  )

  const { developer, trendData, severityBreakdown, topMistakes, growthScore } = data

  const trendChartData = (trendData || []).map((d, i) => ({
    name: `CYCLE ${i + 1}`,
    issues: d.issueCount,
    date: d.reviewDate ? new Date(d.reviewDate).toLocaleDateString() : `CYC ${i + 1}`,
  }))

  const pieData = Object.entries(severityBreakdown || {})
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))

  const mistakesChartData = (topMistakes || []).slice(0, 8).map((m) => ({
    name: m.type?.replace(/-/g, ' ').slice(0, 20) || 'Unknown',
    count: m.count,
  }))

  const growthTrend = trendChartData.length >= 2
    ? trendChartData[trendChartData.length - 1].issues < trendChartData[0].issues ? 'improving' : 'declining'
    : 'neutral'

  return (
    <div className="animate-fade-in relative z-10">
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white font-display uppercase tracking-widest leading-none mb-2"><GlitchText text="NEURAL GROWTH METRICS" /></h1>
          <p className="text-tx-secondary mt-1 font-mono text-sm tracking-wide">
            <Terminal className="w-4 h-4 inline mr-2 text-accent-signature" />
            Analyzing telemetry for: <span className="text-accent uppercase font-bold">{developer.developerName}</span> ({developer.totalPRsReviewed} cycles)
          </p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'PRs Reviewed', value: developer.totalPRsReviewed, icon: BarChart3, color: 'from-brand-500 to-brand-700' },
          { label: 'Total Issues Found', value: developer.totalIssuesFound, icon: AlertTriangle, color: 'from-red-500 to-red-700' },
          { label: 'Growth Score', value: `${Math.round(growthScore)}%`, icon: Award, color: 'from-accent-500 to-accent-600' },
          { label: 'Trend', value: growthTrend === 'improving' ? '↓ Improving' : growthTrend === 'declining' ? '↑ Watch out' : '→ Stable', icon: TrendingUp, color: growthTrend === 'improving' ? 'from-green-500 to-green-700' : 'from-amber-500 to-amber-700' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Growth Score bar */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white text-sm">Growth Score</h3>
          <span className="text-2xl font-bold text-accent-400">{Math.round(growthScore)}%</span>
        </div>
        <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${growthScore}%`, background: 'linear-gradient(90deg, #6366f1, #10b981)' }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">Based on average issues per PR. Higher = fewer recurring mistakes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Issues over time */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white text-sm mb-5">Issues Per PR Over Time</h3>
          {trendChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="issues" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6, fill: '#818cf8' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-slate-600 text-sm">Not enough data yet</div>
          )}
        </div>

        {/* Severity breakdown pie */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white text-sm mb-5">Issue Severity Breakdown</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name.toLowerCase()] || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span className="text-slate-400 text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-slate-600 text-sm">No severity data</div>
          )}
        </div>
      </div>

      {/* Top recurring mistakes */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-white text-sm mb-5">Top Recurring Mistakes</h3>
        {mistakesChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mistakesChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={140} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {mistakesChartData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-40 flex items-center justify-center text-slate-600 text-sm">No mistake data yet</div>
        )}
      </div>
    </div>
  )
}

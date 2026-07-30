import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GitPullRequest, MapPin, Building, Users, Link as LinkIcon, Star, CheckSquare, Smile, Pencil, Heart, Share2, Clock, Zap, Camera } from 'lucide-react'
import toast from 'react-hot-toast'

const getPRHistory = (userId) => {
  if (!userId) return []
  try { 
    const newKey = `devmentor_prs_${userId}`
    let stored = localStorage.getItem(newKey)
    if (!stored) {
      const oldStored = localStorage.getItem('devmentor_prs')
      if (oldStored && oldStored !== '[]') {
        localStorage.setItem(newKey, oldStored)
        stored = oldStored
      }
    }
    if (stored && stored !== '[]') return JSON.parse(stored)
    return []
  } catch { 
    return [] 
  }
}

export default function Dashboard() {
  const { user } = useAuth()
  const developerId = user?.id || user?._id?.toString() || user?.email || 'guest'
  const [prs, setPrs] = useState(() => getPRHistory(developerId))
  const [activeTab, setActiveTab] = useState('repositories')

  // Avatar handling (persisted locally for the session/demo)
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem(`avatar_${developerId}`) || null)
  const fileInputRef = import('react').then(React => React.useRef(null)) // fallback import, though standard useRef is better

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error('Image must be less than 5MB')
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
      localStorage.setItem(`avatar_${developerId}`, url)
      toast.success('Profile picture updated!')
    }
  }

  useEffect(() => {
    setPrs(getPRHistory(developerId))
  }, [developerId])

  return (
    <div className="flex flex-col md:flex-row gap-8 text-tx-primary mt-6">
      
      {/* Left Sidebar - Profile */}
      <div className="w-full md:w-[296px] shrink-0">
        <div className="relative mb-4 group inline-block w-full">
          {/* Main Avatar Container */}
          <div 
            className="w-full aspect-square rounded-full border-2 border-border-default overflow-hidden flex items-center justify-center bg-bg-elevated text-6xl font-bold text-tx-secondary shadow-sm transition-all duration-300 group-hover:border-border-strong relative cursor-pointer"
            onClick={() => document.getElementById('avatar-upload')?.click()}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase() || 'U'
            )}
            
            {/* Hover Edit Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200">
              <div className="flex items-center gap-1.5 text-white/90">
                <Camera className="w-4 h-4" />
                <span className="text-xs font-semibold">Edit</span>
              </div>
            </div>
          </div>
          
          <input 
            id="avatar-upload"
            type="file" 
            onChange={handleAvatarChange} 
            accept="image/png, image/jpeg, image/webp" 
            className="hidden" 
          />

          {/* GitHub-style emoji status badge */}
          <StatusDropdown />
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-tx-primary leading-tight">{user?.name || "Developer"}</h1>
          <h2 className="text-xl text-tx-secondary font-light mb-2">{user?.name?.toLowerCase().replace(/\s+/g, '') || "developer"}</h2>
          
          {/* GitHub-style action buttons */}
          <div className="flex gap-2 mb-4">
            <EditProfileModal user={user} />
            <button 
              onClick={() => toast.success('You are now sponsoring this developer! 💖')}
              className="p-1.5 rounded-md border border-border-default bg-bg-elevated hover:bg-bg-hover text-tx-secondary hover:text-[var(--severity-critical)] transition-all duration-200 shadow-sm" title="Sponsor"
            >
              <Heart className="w-4 h-4" />
            </button>
            <ShareDropdown />
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-default bg-bg-elevated mb-4 cursor-pointer hover:bg-bg-hover transition-colors group/status">
            <Zap className="w-4 h-4 text-[var(--severity-high)]" />
            <span className="text-xs text-tx-secondary group-hover/status:text-tx-primary transition-colors">Building multi-agent AI systems</span>
          </div>

          <p className="text-base text-tx-primary mb-4">Full-stack software engineer & DevMentor Swarm enthusiast.</p>
          <div className="flex items-center gap-1 text-sm text-tx-secondary mb-4">
            <Users className="w-4 h-4" />
            <span className="font-semibold text-tx-primary hover:text-accent-signature cursor-pointer">12</span> <span className="hover:text-accent-signature cursor-pointer">followers</span>
            <span className="mx-1">·</span>
            <span className="font-semibold text-tx-primary hover:text-accent-signature cursor-pointer">8</span> <span className="hover:text-accent-signature cursor-pointer">following</span>
          </div>
          <div className="flex flex-col gap-1.5 text-sm text-tx-primary mb-4">
            <div className="flex items-center gap-2"><Building className="w-4 h-4 text-tx-secondary" /> Acme Inc.</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-tx-secondary" /> San Francisco, CA</div>
            <div className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-tx-secondary" /> <span className="text-accent-signature hover:underline cursor-pointer">devmentor.ai</span></div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-tx-secondary" /> <span className="text-tx-secondary">Active now</span></div>
          </div>

          {/* Achievements / Highlights */}
          <div className="border-t border-border-default pt-4 mb-4">
            <h3 className="text-xs font-semibold text-tx-secondary mb-3 uppercase tracking-wider">Achievements</h3>
            <div className="flex gap-1.5 flex-wrap">
              <span className="w-8 h-8 rounded-full bg-[var(--severity-high-bg)] border border-[var(--severity-high-border)] flex items-center justify-center text-sm cursor-pointer hover:scale-110 transition-transform" title="Early Adopter">🚀</span>
              <span className="w-8 h-8 rounded-full bg-[var(--severity-success-bg)] border border-[rgba(31,136,61,0.3)] flex items-center justify-center text-sm cursor-pointer hover:scale-110 transition-transform" title="Bug Hunter">🐛</span>
              <span className="w-8 h-8 rounded-full bg-[var(--severity-low-bg)] border border-[var(--severity-low-border)] flex items-center justify-center text-sm cursor-pointer hover:scale-110 transition-transform" title="Code Review Expert">⭐</span>
              <span className="w-8 h-8 rounded-full bg-[var(--severity-critical-bg)] border border-[var(--severity-critical-border)] flex items-center justify-center text-sm cursor-pointer hover:scale-110 transition-transform" title="AI Pioneer">🤖</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full min-w-0">
        
        {/* Tabs */}
        <div className="border-b border-border-default mb-6 sticky top-0 bg-bg-base z-10 pt-2">
          <nav className="flex gap-4">
            <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-[#fd8c73] text-tx-primary' : 'border-transparent text-tx-primary hover:border-border-strong'}`}>
              Overview
            </button>
            <button onClick={() => setActiveTab('repositories')} className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'repositories' ? 'border-[#fd8c73] text-tx-primary' : 'border-transparent text-tx-primary hover:border-border-strong'}`}>
              Repositories
              <span className="bg-border-default text-tx-primary rounded-full px-2 py-0.5 text-xs font-semibold">{prs.length}</span>
            </button>
            <button onClick={() => setActiveTab('projects')} className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'projects' ? 'border-[#fd8c73] text-tx-primary' : 'border-transparent text-tx-primary hover:border-border-strong'}`}>
              Projects
            </button>
            <button onClick={() => setActiveTab('packages')} className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'packages' ? 'border-[#fd8c73] text-tx-primary' : 'border-transparent text-tx-primary hover:border-border-strong'}`}>
              Packages
            </button>
          </nav>
        </div>

        {/* Repositories Tab Content */}
        {activeTab === 'repositories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <input 
                type="text" 
                placeholder="Find a repository..." 
                className="w-full md:w-80 px-3 py-1.5 rounded-md border border-border-default bg-bg-base text-tx-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 shadow-sm"
              />
              <Link to="/submit" className="hidden md:flex bg-accent hover:bg-accent-hover text-accent-text px-4 py-1.5 rounded-md text-sm shadow-sm transition-all duration-300 items-center gap-2 ml-4 font-semibold hover:-translate-y-0.5 hover:shadow-md border border-[rgba(240,246,252,0.1)]">
                <CheckSquare className="w-4 h-4" /> New Analysis
              </Link>
            </div>

            <div className="space-y-4 pt-2">
              {prs.length === 0 ? (
                <div className="py-16 text-center bg-bg-elevated rounded-xl border border-dashed border-border-strong mt-4 transition-all duration-300 hover:border-accent hover:bg-bg-hover group">
                  <div className="w-16 h-16 rounded-2xl bg-bg-base flex items-center justify-center mx-auto mb-5 border border-border-default shadow-sm group-hover:scale-105 transition-transform duration-300">
                     <GitPullRequest className="w-8 h-8 text-tx-tertiary group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-tx-primary">Ready to optimize your codebase?</h3>
                  <p className="text-tx-secondary text-sm mb-6 max-w-sm mx-auto">Your repository history is empty. Submit a pull request or code snippet to let the DevMentor swarm analyze it.</p>
                  <Link to="/submit" className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg text-sm shadow-sm transition-all duration-300 inline-flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-md font-semibold">
                    <CheckSquare className="w-4 h-4" /> Initiate Review Cycle
                  </Link>
                </div>
              ) : (
                prs.slice().reverse().map((pr) => (
                  <div key={pr.prId} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border border-border-default rounded-xl bg-bg-base hover:bg-bg-elevated transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Link to={`/review/${pr.prId}`} className="text-xl font-bold text-accent-signature hover:underline truncate">
                          {pr.title || pr.prId}
                        </Link>
                        {pr.severity && (
                          <span className="border border-border-default rounded-full text-xs text-tx-secondary px-2.5 py-0.5 whitespace-nowrap bg-bg-elevated group-hover:border-accent transition-colors">
                            {pr.severity}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-tx-secondary mb-3 max-w-2xl line-clamp-1">
                        Results from a 6-Agent AI Code Review Pipeline identifying potential architecture, syntax, and performance bottlenecks.
                      </div>
                      <div className="flex items-center gap-5 text-xs text-tx-tertiary">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#f1e05a] shadow-[0_0_5px_rgba(241,224,90,0.5)]"></span>
                          JavaScript
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-accent-signature cursor-pointer transition-colors"><Star className="w-3.5 h-3.5" /> 0</span>
                        <span className="flex items-center gap-1.5 hover:text-accent-signature cursor-pointer transition-colors"><GitPullRequest className="w-3.5 h-3.5" /> {pr.issueCount || 0} issues</span>
                        <span className="text-tx-quaternary">Updated {new Date(pr.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex shrink-0">
                      <button className="flex items-center gap-2 bg-bg-elevated hover:bg-bg-hover border border-border-default px-4 py-1.5 rounded-lg text-sm shadow-sm transition-all duration-300 text-tx-primary font-medium hover:scale-105 active:scale-95">
                        <Star className="w-4 h-4 text-tx-tertiary group-hover:text-accent-signature transition-colors" /> Star
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab !== 'repositories' && (
          <div className="py-12 text-center text-tx-secondary">
            <h3 className="font-semibold text-lg mb-4">Nothing to show for {activeTab}</h3>
          </div>
        )}
      </div>
    </div>
  )
}

// Subcomponents for Interactive Profile Widgets

function StatusDropdown() {
  const [open, setOpen] = useState(false)
  const emojis = ['🚀', '💻', '🤒', '🌴', '🎯']

  return (
    <div className="absolute bottom-2 right-2">
      <button 
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-bg-elevated border-2 border-border-default flex items-center justify-center text-lg hover:bg-bg-hover transition-all duration-200 shadow-sm hover:scale-110 hover:border-border-strong group/emoji" title="Set status"
      >
        <Smile className="w-5 h-5 text-tx-tertiary group-hover/emoji:text-accent transition-colors" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-12 left-0 w-72 bg-bg-elevated border border-border-default rounded-lg shadow-xl z-50 animate-fade-in text-sm">
            <div className="p-3 border-b border-border-default">
              <p className="font-semibold text-tx-primary mb-2">Edit status</p>
              <div className="flex bg-bg-base border border-border-default rounded-md overflow-hidden">
                <div className="px-3 flex items-center justify-center bg-bg-hover border-r border-border-default cursor-pointer">
                  <Smile className="w-4 h-4 text-tx-secondary" />
                </div>
                <input type="text" placeholder="What's happening?" className="flex-1 bg-transparent px-3 py-1.5 focus:outline-none text-tx-primary" />
              </div>
            </div>
            <div className="p-2">
              <p className="text-xs text-tx-tertiary px-2 pt-1 pb-2">Suggestions</p>
              {emojis.map((emoji, i) => (
                <button 
                  key={i} 
                  onClick={() => { toast.success(`Status updated to ${emoji}`); setOpen(false) }}
                  className="w-full text-left px-3 py-1.5 hover:bg-bg-hover rounded-md transition-colors text-tx-primary flex items-center gap-2"
                >
                  <span className="text-base">{emoji}</span>
                  <span className="text-tx-secondary">
                    {i === 0 ? 'Getting things done' : i === 1 ? 'Coding' : i === 2 ? 'Out sick' : i === 3 ? 'Vacationing' : 'Focusing'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ShareDropdown() {
  const [open, setOpen] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Profile URL copied!')
    setOpen(false)
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-md border border-border-default bg-bg-elevated hover:bg-bg-hover text-tx-secondary hover:text-accent-signature transition-all duration-200 shadow-sm" title="Share profile"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 w-48 bg-bg-elevated border border-border-default rounded-lg shadow-lg z-50 py-1 animate-fade-in text-sm">
            <button onClick={copyLink} className="w-full text-left px-4 py-2 hover:bg-bg-hover text-tx-primary transition-colors">
              Copy link
            </button>
            <button onClick={() => {toast('Shared to Twitter!'); setOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-bg-hover text-tx-primary transition-colors">
              Share to Twitter
            </button>
            <button onClick={() => {toast('Shared to LinkedIn!'); setOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-bg-hover text-tx-primary transition-colors">
              Share to LinkedIn
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function EditProfileModal({ user }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md border border-border-default bg-bg-elevated hover:bg-bg-hover text-tx-primary text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Pencil className="w-3.5 h-3.5" /> Edit profile
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-bg-elevated border border-border-default rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-tx-primary mb-4">Edit Profile</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-tx-secondary mb-1">Name</label>
                <input type="text" defaultValue={user?.name} className="input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-tx-secondary mb-1">Bio</label>
                <textarea defaultValue="Full-stack software engineer & DevMentor Swarm enthusiast." className="input h-20 resize-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-tx-secondary mb-1">Company</label>
                  <input type="text" defaultValue="Acme Inc." className="input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-tx-secondary mb-1">Location</label>
                  <input type="text" defaultValue="San Francisco, CA" className="input" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
              <button 
                onClick={() => {
                  toast.success('Profile updated successfully!')
                  setOpen(false)
                }} 
                className="btn-primary"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

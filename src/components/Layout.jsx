import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { 
  LogOut, Github, Settings, LayoutDashboard, GitPullRequest, User,
  Bell, Plus, Inbox, ChevronDown, Sun, Moon, GitBranch, FileCode2, BarChart3, BookOpen
} from 'lucide-react'

export default function Layout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const progressHref = user ? `/progress/${user.id}` : '/dashboard'

  return (
    <div className="flex flex-col min-h-screen bg-bg-base text-tx-primary">
      {/* GitHub Style Top Navigation */}
      <header className="flex items-center justify-between px-6 py-4 bg-bg-elevated border-b border-border-default">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-tx-primary hover:text-tx-secondary transition-colors">
            <Github className="w-8 h-8" fill="currentColor" />
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <NavTab href="/dashboard" label="Dashboard" current={location.pathname} />
            <NavTab href="/submit" label="Pull Requests" current={location.pathname} />
            <NavTab href={progressHref} label="Insights" current={location.pathname} />
            <NavTab href="/settings" label="Settings" current={location.pathname} />
          </nav>
        </div>

        <div className="flex items-center gap-1">
          {/* Theme toggle icon */}
          <button 
            onClick={toggleTheme} 
            className="relative p-2 rounded-md text-tx-secondary hover:text-tx-primary hover:bg-bg-hover transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification Bell */}
          <NotificationsDropdown />

          {/* Inbox */}
          <InboxDropdown />

          {/* Create / Plus dropdown */}
          <CreateDropdown />

          {/* Separator */}
          <div className="w-px h-5 bg-border-default mx-1"></div>

          {/* Profile avatar with dropdown */}
          <ProfileDropdown user={user} onLogout={handleLogout} />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto p-8 relative">
        <Outlet />
      </main>
    </div>
  )
}

function NavTab({ href, label, current }) {
  const isActive = current.startsWith(href) && href !== '/dashboard' 
    ? current.startsWith(href) 
    : current === href

  return (
    <Link
      to={href}
      className={`text-sm font-semibold transition-colors px-2 py-1 rounded-md ${
        isActive 
          ? 'text-tx-primary bg-bg-hover' 
          : 'text-tx-secondary hover:text-tx-primary hover:bg-bg-hover'
      }`}
    >
      {label}
    </Link>
  )
}

function CreateDropdown() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)} 
        className="flex items-center gap-0.5 p-2 rounded-md text-tx-secondary hover:text-tx-primary hover:bg-bg-hover transition-colors"
        title="Create new..."
      >
        <Plus className="w-4 h-4" />
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-52 bg-bg-elevated border border-border-default rounded-lg shadow-lg z-50 py-1 animate-fade-in">
            <Link to="/submit" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-tx-primary hover:bg-bg-hover transition-colors">
              <GitPullRequest className="w-4 h-4 text-tx-tertiary" /> New code review
            </Link>
            <Link to="/submit" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-tx-primary hover:bg-bg-hover transition-colors">
              <FileCode2 className="w-4 h-4 text-tx-tertiary" /> New repository
            </Link>
            <div className="border-t border-border-default my-1" />
            <Link to="/submit" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-tx-primary hover:bg-bg-hover transition-colors">
              <BookOpen className="w-4 h-4 text-tx-tertiary" /> Import repository
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)} 
        className="flex items-center gap-1 rounded-full hover:ring-2 hover:ring-border-strong transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-border-default border border-border-strong flex items-center justify-center text-xs font-bold overflow-hidden cursor-pointer">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <ChevronDown className="w-3 h-3 text-tx-secondary" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-56 bg-bg-elevated border border-border-default rounded-lg shadow-lg z-50 py-1 animate-fade-in">
            <div className="px-4 py-3 border-b border-border-default">
              <div className="text-sm font-semibold text-tx-primary">{user?.name || 'User'}</div>
              <div className="text-xs text-tx-tertiary truncate">{user?.email || ''}</div>
            </div>
            <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-tx-primary hover:bg-bg-hover transition-colors">
              <User className="w-4 h-4 text-tx-tertiary" /> Your profile
            </Link>
            <Link to="/submit" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-tx-primary hover:bg-bg-hover transition-colors">
              <GitPullRequest className="w-4 h-4 text-tx-tertiary" /> Your pull requests
            </Link>
            <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-tx-primary hover:bg-bg-hover transition-colors">
              <Settings className="w-4 h-4 text-tx-tertiary" /> Settings
            </Link>
            <div className="border-t border-border-default my-1" />
            <button onClick={() => { setOpen(false); onLogout() }} className="flex items-center gap-3 px-4 py-2 text-sm text-tx-primary hover:bg-bg-hover transition-colors w-full text-left">
              <LogOut className="w-4 h-4 text-tx-tertiary" /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function NotificationsDropdown() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)} 
        className="relative p-2 rounded-md text-tx-secondary hover:text-tx-primary hover:bg-bg-hover transition-colors" 
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-accent-signature rounded-full border border-bg-elevated"></span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-80 bg-bg-elevated border border-border-default rounded-lg shadow-lg z-50 animate-fade-in overflow-hidden">
            <div className="px-4 py-3 border-b border-border-default flex justify-between items-center bg-bg-base">
              <span className="text-sm font-semibold text-tx-primary">Notifications</span>
              <button className="text-xs text-accent-signature hover:underline">Mark all as read</button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <div className="p-4 hover:bg-bg-hover transition-colors cursor-pointer border-b border-border-default last:border-0 flex gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-accent-signature flex-shrink-0" />
                <div>
                  <p className="text-sm text-tx-primary"><strong className="font-semibold">Review requested:</strong> user-auth-fix</p>
                  <p className="text-xs text-tx-tertiary mt-1">2 hours ago in acme/project</p>
                </div>
              </div>
              <div className="p-4 hover:bg-bg-hover transition-colors cursor-pointer border-b border-border-default last:border-0 flex gap-3 opacity-60">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-transparent flex-shrink-0" />
                <div>
                  <p className="text-sm text-tx-primary"><strong className="font-semibold">Merged:</strong> feature/new-dashboard</p>
                  <p className="text-xs text-tx-tertiary mt-1">Yesterday</p>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 border-t border-border-default text-center bg-bg-base">
              <Link to="/notifications" className="text-xs text-tx-secondary hover:text-tx-primary" onClick={() => setOpen(false)}>View all notifications</Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function InboxDropdown() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-md text-tx-secondary hover:text-tx-primary hover:bg-bg-hover transition-colors" 
        title="Inbox"
      >
        <Inbox className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-72 bg-bg-elevated border border-border-default rounded-lg shadow-lg z-50 py-4 px-6 text-center animate-fade-in">
            <Inbox className="w-8 h-8 text-tx-tertiary mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-tx-primary mb-1">Your inbox is empty</h4>
            <p className="text-xs text-tx-secondary mb-4">You're all caught up! ✨</p>
          </div>
        </>
      )}
    </div>
  )
}

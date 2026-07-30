import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { 
  LayoutDashboard, GitPullRequest, Moon, Sun, LogOut, 
  Settings, User, Zap, ChevronRight
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: GitPullRequest, label: 'Submit PR', href: '/submit' },
  { icon: User, label: 'My Progress', href: null }, // dynamic
]

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
    <div className="flex min-h-screen bg-[#03000A] selection:bg-accent selection:text-[#03000A]">
      <div className="bg-cyber-grid" />
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-3xl z-20">
        {/* Logo */}
        <div className="p-6 border-b border-white/10 text-center">
          <Link to="/dashboard" className="inline-flex flex-col items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Zap className="w-5 h-5 text-accent-signature" />
            </div>
            <div>
              <div className="font-bold text-white text-md uppercase tracking-widest font-display">DevMentor</div>
              <div className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mt-0.5 animate-pulse">Swarm</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem href="/dashboard" label="Dashboard" icon={LayoutDashboard} current={location.pathname} />
          <NavItem href="/submit" label="Submit PR" icon={GitPullRequest} current={location.pathname} />
          <NavItem href={progressHref} label="My Progress" icon={User} current={location.pathname} />
          <NavItem href="/settings" label="Settings" icon={Settings} current={location.pathname} />
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group border border-transparent hover:border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-[0_0_10px_rgba(217,70,239,0.3)]">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate uppercase tracking-wider">{user?.name}</div>
              <div className="text-[10px] text-tx-secondary truncate font-mono">{user?.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button 
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-tx-secondary hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all text-[10px] uppercase tracking-widest font-mono"
            >
              {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-tx-secondary hover:text-severity-critical hover:bg-severity-critical-bg transition-all text-[10px] uppercase tracking-widest font-mono"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-transparent z-10 relative">
        <div className="max-w-6xl mx-auto p-8 relative">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function NavItem({ href, label, icon: Icon, current }) {
  const isActive = current.startsWith(href) && href !== '/dashboard' 
    ? current.startsWith(href) 
    : current === href

  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
        isActive 
          ? 'bg-bg-elevated text-tx-primary border border-border-default' 
          : 'text-tx-secondary hover:text-tx-primary hover:bg-bg-hover'
      }`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-tx-primary' : 'text-tx-secondary'}`} />
      {label}
    </Link>
  )
}

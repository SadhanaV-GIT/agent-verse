import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Github, User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) return toast.error('Please fill in all fields')
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register(name, email, password)
      toast.success('Account created! Welcome to DevMentor Swarm 🚀')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-base">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Github className="w-10 h-10 text-tx-primary" />
          <div>
            <div className="font-bold text-tx-primary">DevMentor <span className="text-accent">Swarm</span></div>
            <div className="text-xs text-tx-tertiary">Code Review Copilot</div>
          </div>
        </div>

        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold text-tx-primary mb-1">Create your account</h1>
          <p className="text-tx-secondary text-sm mb-8">Start getting AI-powered code reviews for free.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-tx-secondary mb-2">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tx-tertiary" />
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-10"
                  placeholder="Your Name"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-tx-secondary mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tx-tertiary" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-tx-secondary mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tx-tertiary" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-tx-tertiary hover:text-tx-primary transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button id="register-submit" type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? <div className="w-4 h-4 border-2 border-accent-text/30 border-t-accent-text rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-tx-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-signature hover:underline font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

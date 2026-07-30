import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/authAPI'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('devmentor_token'))
  const [loading, setLoading] = useState(true)

  // Normalize user so user.id is always the string ID
  const normalizeUser = (u) => u ? { ...u, id: u.id || u._id?.toString() } : null

  useEffect(() => {
    if (token) {
      authAPI.getMe(token)
        .then((data) => setUser(normalizeUser(data.user)))
        .catch(() => { setToken(null); localStorage.removeItem('devmentor_token') })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    const data = await authAPI.login(email, password)
    setToken(data.token)
    setUser(normalizeUser(data.user))
    localStorage.setItem('devmentor_token', data.token)
    return data
  }

  const register = async (name, email, password) => {
    const data = await authAPI.register(name, email, password)
    setToken(data.token)
    setUser(normalizeUser(data.user))
    localStorage.setItem('devmentor_token', data.token)
    return data
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('devmentor_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

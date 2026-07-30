import axios from 'axios'

const AGENT1 = import.meta.env.VITE_AGENT1_URL || 'http://localhost:3001'
const AGENT2 = import.meta.env.VITE_AGENT2_URL || 'http://localhost:3002'
const AGENT3 = import.meta.env.VITE_AGENT3_URL || 'http://localhost:3003'
const AGENT4 = import.meta.env.VITE_AGENT4_URL || 'http://localhost:3004'
const AGENT5 = import.meta.env.VITE_AGENT5_URL || 'http://localhost:3005'
const AGENT6 = import.meta.env.VITE_AGENT6_URL || 'http://localhost:3006'

const createClient = (baseURL) => {
  const client = axios.create({ baseURL, timeout: 120000 })

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('devmentor_token')
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`)
      } else {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error?.response?.data || { message: error.message })
  )

  return client
}

export const agent1 = createClient(AGENT1)
export const agent2 = createClient(AGENT2)
export const agent3 = createClient(AGENT3)
export const agent4 = createClient(AGENT4)
export const agent5 = createClient(AGENT5)
export const agent6 = createClient(AGENT6)

export const authAPI = {
  login: (email, password) => agent1.post('/api/auth/login', { email, password }),
  register: (name, email, password) => agent1.post('/api/auth/register', { name, email, password }),
  getMe: (token) => {
    const c = axios.create({ baseURL: AGENT1 })
    return c.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data)
  },
}

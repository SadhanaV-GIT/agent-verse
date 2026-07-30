// import { agent1 } from './client' // Bypassed

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  register: async (name, email, password) => {
    await delay(600);
    return { token: 'demo-token', user: { id: 'demo123', name, email, role: 'developer' } }
  },
  login: async (email, password) => {
    await delay(600);
    return { token: 'demo-token', user: { id: 'demo123', name: 'Demo User', email, role: 'developer' } }
  },
  getMe: async (token) => {
    await delay(300);
    return { user: { id: 'demo123', name: 'Demo User', email: 'demo@example.com', role: 'developer' } }
  },
}

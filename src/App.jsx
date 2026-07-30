import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import SubmitPR from './pages/SubmitPR'
import ReviewResults from './pages/ReviewResults'
import ExplanationsView from './pages/ExplanationsView'
import RefactorSuggestions from './pages/RefactorSuggestions'
import ProgressDashboard from './pages/ProgressDashboard'
import FinalReport from './pages/FinalReport'
import Settings from './pages/Settings'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-bg-elevated text-tx-primary border border-border-default shadow-lg',
              style: { 
                background: 'var(--bg-elevated)', 
                color: 'var(--tx-primary)', 
                border: '1px solid var(--border-default)' 
              },
              success: { iconTheme: { primary: 'var(--severity-success)', secondary: 'var(--bg-elevated)' } },
              error: { iconTheme: { primary: 'var(--severity-critical)', secondary: 'var(--bg-elevated)' } },
            }}
          />
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected — wrapped in layout */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/submit" element={<SubmitPR />} />
              <Route path="/review/:prId" element={<ReviewResults />} />
              <Route path="/explain/:prId" element={<ExplanationsView />} />
              <Route path="/refactor/:prId" element={<RefactorSuggestions />} />
              <Route path="/progress/:devId" element={<ProgressDashboard />} />
              <Route path="/report/:prId" element={<FinalReport />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

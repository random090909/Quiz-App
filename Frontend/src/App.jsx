import { useState, useEffect } from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import UserDetails from './pages/UserDetails'
import Pretest from './pages/Pretest'
import Intervention from './pages/Intervention'
import Posttest from './pages/Posttest'
import PretestResult from './pages/PretestResult'
import PosttestResult from './pages/PosttestResult'
import ResultsAll from './pages/ResultsAll'
import ProtectedRoute from './components/ProtectedRoute'
import { isAuthenticated } from './utils/auth'

function App() {
  const [authChecked, setAuthChecked] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const isAuth = isAuthenticated()
      setAuthenticated(isAuth)
      setAuthChecked(true)
    }
    checkAuth()

    // Listen for storage changes (when token is removed in another tab/window)
    const handleStorageChange = () => {
      checkAuth()
    }
    
    // Listen for custom authChange event (triggered on logout in same tab)
    const handleAuthChange = () => {
      checkAuth()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authChange', handleAuthChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [])

  // Show nothing while checking auth
  if (!authChecked) {
    return null
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={authenticated ? <Navigate to="/home" replace /> : <Login />} 
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-details" 
          element={
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pretest" 
          element={
            <ProtectedRoute>
              <Pretest />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/intervention" 
          element={
            <ProtectedRoute>
              <Intervention />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/posttest" 
          element={
            <ProtectedRoute>
              <Posttest />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pretest-result" 
          element={
            <ProtectedRoute>
              <PretestResult />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/posttest-result" 
          element={
            <ProtectedRoute>
              <PosttestResult />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/results-all" 
          element={
            <ProtectedRoute>
              <ResultsAll />
            </ProtectedRoute>
          } 
        />
        {/* Catch-all route - redirect to login if not authenticated */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthContext from './context/AuthContext'
import axios from 'axios'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setLoading(false)
  }, [token])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('token', authToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
  }

  const loginAsGuest = () => {
    const guestToken = 'guest'
    setUser({ name: 'Guest', email: '' })
    setToken(guestToken)
    localStorage.setItem('token', guestToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <AuthContext.Provider value={{ user, token, login, loginAsGuest, logout }}>
        <Routes>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </AuthContext.Provider>
    </Router>
  )
}

export default App

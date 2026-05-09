import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import './Dashboard.css'

export default function Dashboard() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: '', description: '', category: 'other' })
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/habits')
      setHabits(response.data)
    } catch (error) {
      console.error('Failed to fetch habits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateHabit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/habits', newHabit)
      setNewHabit({ name: '', description: '', category: 'other' })
      setShowForm(false)
      fetchHabits()
    } catch (error) {
      console.error('Failed to create habit:', error)
    }
  }

  const handleLogHabit = async (habitId) => {
    try {
      await axios.post(`/api/habits/${habitId}/log`)
      fetchHabits()
    } catch (error) {
      console.error('Failed to log habit:', error)
    }
  }

  const handleDeleteHabit = async (habitId) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      try {
        await axios.delete(`/api/habits/${habitId}`)
        fetchHabits()
      } catch (error) {
        console.error('Failed to delete habit:', error)
      }
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return <div className="loading">Loading habits...</div>
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Original Actions</h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-top">
          <h2>Your Daily Habits</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn-add">
            {showForm ? 'Cancel' : '+ Add Habit'}
          </button>
        </div>

        {showForm && (
          <form className="habit-form" onSubmit={handleCreateHabit}>
            <div className="form-group">
              <label>Habit Name</label>
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                required
                placeholder="e.g., Read Bible Daily"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                placeholder="Why is this habit important to you?"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={newHabit.category}
                onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
              >
                <option value="spiritual">Spiritual</option>
                <option value="health">Health</option>
                <option value="learning">Learning</option>
                <option value="fitness">Fitness</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button type="submit" className="btn-primary">Create Habit</button>
          </form>
        )}

        <div className="habits-grid">
          {habits.length === 0 ? (
            <p className="no-habits">No habits yet. Start your journey by creating your first habit!</p>
          ) : (
            habits.map(habit => (
              <div key={habit.id} className="habit-card">
                <div className="habit-header">
                  <h3>{habit.name}</h3>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteHabit(habit.id)}
                    title="Delete habit"
                  >
                    ✕
                  </button>
                </div>
                {habit.description && <p className="habit-description">{habit.description}</p>}
                <div className="habit-category">{habit.category}</div>
                <button
                  onClick={() => handleLogHabit(habit.id)}
                  className="btn-log"
                >
                  ✓ Mark Today as Done
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

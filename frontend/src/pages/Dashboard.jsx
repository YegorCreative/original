import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import StreakBadge from '../components/StreakBadge'
import PrayerTimer from '../components/PrayerTimer'
import Leaderboard from '../components/Leaderboard'
import './Dashboard.css'

const CATEGORY_ICONS = {
  spiritual: '✝️',
  health: '🥗',
  learning: '📚',
  fitness: '💪',
  other: '⭐',
}

// Trigger haptic feedback on the device when a habit is logged
function triggerLogHaptic() {
  if (navigator.vibrate) {
    navigator.vibrate([80, 40, 80])
  }
}

const MOCK_HABITS = [
  { id: 1, name: 'Morning Prayer', description: 'Start the day with gratitude', category: 'spiritual', currentStreak: 7, longestStreak: 14, completedToday: false, total_completed: 21 },
  { id: 2, name: 'Read Bible', description: 'One chapter per day', category: 'spiritual', currentStreak: 3, longestStreak: 10, completedToday: true, total_completed: 15 },
  { id: 3, name: 'Morning Run', description: '30 minutes outside', category: 'fitness', currentStreak: 5, longestStreak: 12, completedToday: false, total_completed: 18 },
  { id: 4, name: 'Read 20 Pages', description: 'Non-fiction growth book', category: 'learning', currentStreak: 2, longestStreak: 8, completedToday: false, total_completed: 10 },
]

export default function Dashboard() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [prayerHabitId, setPrayerHabitId] = useState(null)
  const [newHabit, setNewHabit] = useState({ name: '', description: '', category: 'spiritual' })
  const navigate = useNavigate()
  const { token, logout } = useContext(AuthContext)
  const isGuest = token === 'guest'

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    if (isGuest) {
      setHabits(MOCK_HABITS)
      setLoading(false)
      return
    }
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
    if (isGuest) {
      const fakeHabit = { ...newHabit, id: Date.now(), currentStreak: 0, longestStreak: 0, completedToday: false, total_completed: 0 }
      setHabits(prev => [fakeHabit, ...prev])
      setNewHabit({ name: '', description: '', category: 'spiritual' })
      setShowForm(false)
      return
    }
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
    if (isGuest) {
      triggerLogHaptic()
      setHabits(prev => prev.map(h => h.id === habitId ? { ...h, completedToday: !h.completedToday } : h))
      return
    }
    try {
      triggerLogHaptic()
      await axios.post(`/api/habits/${habitId}/log`)
      fetchHabits()
    } catch (error) {
      console.error('Failed to log habit:', error)
    }
  }

  const handleDeleteHabit = async (habitId) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      if (isGuest) {
        setHabits(prev => prev.filter(h => h.id !== habitId))
        return
      }
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

  const totalStreak = habits.reduce((sum, h) => sum + (h.currentStreak || 0), 0)

  return (
    <div className="dashboard">
      {isGuest && (
        <div className="guest-banner">
          👋 You're in guest mode — data is not saved. <a href="/login">Log in</a> or <a href="/signup">sign up</a> to save your habits.
        </div>
      )}
      <header className="dashboard-header">
        <div>
          <h1>Original Actions</h1>
          <p className="header-sub">Build the habit. Shape the life.</p>
        </div>
        <div className="header-right">
          <span className="total-streak" title="Sum of all current streaks">🔥 {totalStreak} total days</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
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
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={newHabit.category}
                onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
              >
                <option value="spiritual">✝️ Spiritual</option>
                <option value="health">🥗 Health</option>
                <option value="learning">📚 Learning</option>
                <option value="fitness">💪 Fitness</option>
                <option value="other">⭐ Other</option>
              </select>
            </div>

            <button type="submit" className="btn-primary">Create Habit</button>
          </form>
        )}

        <div className="habits-grid">
          {habits.length === 0 ? (
            <div className="no-habits">
              <p>No habits yet. Start your journey!</p>
              <button className="btn-add" onClick={() => setShowForm(true)}>+ Add Your First Habit</button>
            </div>
          ) : (
            habits.map(habit => (
              <div
                key={habit.id}
                className={`habit-card ${habit.completedToday ? 'completed' : ''} ${habit.category}`}
              >
                <div className="habit-header">
                  <span className="habit-icon">{CATEGORY_ICONS[habit.category] || '⭐'}</span>
                  <h3>{habit.name}</h3>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteHabit(habit.id)}
                    title="Delete habit"
                  >
                    ✕
                  </button>
                </div>

                {habit.description && (
                  <p className="habit-description">{habit.description}</p>
                )}

                <StreakBadge
                  currentStreak={parseInt(habit.currentStreak) || 0}
                  longestStreak={parseInt(habit.longestStreak) || 0}
                />

                <div className="habit-footer">
                  <button
                    onClick={() => handleLogHabit(habit.id)}
                    className={`btn-log ${habit.completedToday ? 'done' : ''}`}
                  >
                    {habit.completedToday ? '✓ Done Today!' : '✓ Mark Done'}
                  </button>

                  {habit.category === 'spiritual' && (
                    <button
                      className="btn-pray"
                      onClick={() => setPrayerHabitId(
                        prayerHabitId === habit.id ? null : habit.id
                      )}
                    >
                      🙏 Pray
                    </button>
                  )}
                </div>

                {prayerHabitId === habit.id && (
                  <PrayerTimer
                    onComplete={() => {
                      handleLogHabit(habit.id)
                      setPrayerHabitId(null)
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>

        <Leaderboard />
      </main>
    </div>
  )
}

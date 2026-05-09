import { useState, useEffect } from 'react'
import axios from 'axios'
import './Leaderboard.css'

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/leaderboard')
      .then(r => setLeaders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="lb-loading">Loading leaderboard...</div>

  return (
    <div className="leaderboard">
      <h2>🏆 Community Leaderboard</h2>
      <p className="lb-sub">Most habits completed this week</p>

      <div className="lb-list">
        {leaders.length === 0 ? (
          <p className="lb-empty">No activity yet this week. Be the first!</p>
        ) : leaders.map((user, i) => (
          <div key={user.id} className={`lb-row ${i < 3 ? 'top' : ''}`}>
            <span className="lb-rank">{MEDALS[i] || `#${i + 1}`}</span>
            <span className="lb-name">{user.name}</span>
            <span className="lb-count">{user.completions_this_week} days</span>
          </div>
        ))}
      </div>
    </div>
  )
}

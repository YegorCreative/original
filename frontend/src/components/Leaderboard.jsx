import { useState, useEffect } from 'react'
import axios from 'axios'
import './Leaderboard.css'

const MEDALS = ['1', '2', '3']

const MOCK_LEADERS = [
  { id: 1, name: 'Sarah M.', completions_this_week: 7 },
  { id: 2, name: 'James K.', completions_this_week: 6 },
  { id: 3, name: 'Grace L.', completions_this_week: 5 },
  { id: 4, name: 'David R.', completions_this_week: 4 },
]

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/leaderboard')
      .then(r => setLeaders(r.data))
      .catch(() => setLeaders(MOCK_LEADERS))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="lb-loading">Loading leaderboard...</div>

  return (
    <div className="leaderboard">
      <h2>Community Rhythm</h2>
      <p className="lb-sub">Showing up together this week</p>

      <div className="lb-list">
        {leaders.length === 0 ? (
          <p className="lb-empty">No activity yet this week. Be the first!</p>
        ) : leaders.map((user, i) => (
          <div key={user.id} className={`lb-row ${i < 3 ? 'top' : ''}`}>
            <span className="lb-rank">{i < 3 ? `#${i + 1}` : `#${i + 1}`}</span>
            <span className="lb-name">{user.name}</span>
            <span className="lb-count">{user.completions_this_week} days</span>
          </div>
        ))}
      </div>
    </div>
  )
}

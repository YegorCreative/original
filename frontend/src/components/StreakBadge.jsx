import './StreakBadge.css'

export default function StreakBadge({ currentStreak, longestStreak }) {
  const getFlameColor = (streak) => {
    if (streak >= 30) return '#ff4500'
    if (streak >= 14) return '#ff8c00'
    if (streak >= 7)  return '#ffa500'
    if (streak >= 3)  return '#ffcc00'
    return '#ccc'
  }

  return (
    <div className="streak-badge">
      <span
        className="flame"
        style={{ color: getFlameColor(currentStreak) }}
        title={`Longest streak: ${longestStreak} days`}
      >
        🔥
      </span>
      <div className="streak-numbers">
        <span className="streak-current">{currentStreak}</span>
        <span className="streak-label">day streak</span>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import PrayerRequestCard from '../components/PrayerRequestCard'
import PrayerTimer from '../components/PrayerTimer'
import './PrayerScreen.css'

// Future React Native: PrayerScreen component
// Local storage key for guest persistence
const STORAGE_KEY = 'oa_prayer_requests'

function loadRequests() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export default function PrayerScreen() {
  const [requests, setRequests] = useState(loadRequests)
  const [newText, setNewText] = useState('')
  const [showTimer, setShowTimer] = useState(false)
  const [showAnswered, setShowAnswered] = useState(false)

  // Persist to local storage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
  }, [requests])

  const addRequest = (e) => {
    e.preventDefault()
    const text = newText.trim()
    if (!text) return
    setRequests(prev => [{
      id: Date.now(),
      text,
      prayedToday: false,
      answered: false,
      createdAt: new Date().toISOString(),
    }, ...prev])
    setNewText('')
  }

  const togglePrayed = (id) => {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, prayedToday: !r.prayedToday } : r
    ))
  }

  const markAnswered = (id) => {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, answered: true, answeredAt: new Date().toISOString() } : r
    ))
  }

  const removeRequest = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id))
  }

  const active = requests.filter(r => !r.answered)
  const answered = requests.filter(r => r.answered)
  const prayedCount = active.filter(r => r.prayedToday).length

  return (
    <div className="prayer-screen">
      <div className="screen-header">
        <div>
          <h2 className="screen-title">Prayer</h2>
          <p className="screen-sub">Bring what's on your heart.</p>
        </div>
        <button
          className={`btn-timer-toggle${showTimer ? ' active' : ''}`}
          onClick={() => setShowTimer(v => !v)}
        >
          Timer
        </button>
      </div>

      {/* Future React Native: <PrayerTimerModal visible={showTimer} /> */}
      {showTimer && (
        <div className="timer-wrapper">
          <PrayerTimer onComplete={() => setShowTimer(false)} />
        </div>
      )}

      {active.length > 0 && (
        <div className="prayer-progress">
          <div className="prayer-progress-label">
            <span>{prayedCount} of {active.length} prayed today</span>
          </div>
          <div className="prayer-progress-bar">
            <div
              className="prayer-progress-fill"
              style={{ width: `${active.length ? (prayedCount / active.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      <form className="prayer-add-form" onSubmit={addRequest}>
        <input
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="What would you like to bring to God?"
          maxLength={200}
        />
        <button type="submit" className="btn-add-request">Add</button>
      </form>

      {active.length === 0 ? (
        <div className="screen-empty">
          <p>No requests yet.</p>
          <p className="screen-empty-hint">Nothing is too small to bring before God.</p>
        </div>
      ) : (
        <div className="requests-list">
          {active.map(r => (
            <PrayerRequestCard
              key={r.id}
              request={r}
              onPrayedToday={togglePrayed}
              onMarkAnswered={markAnswered}
              onDelete={removeRequest}
            />
          ))}
        </div>
      )}

      {answered.length > 0 && (
        <div className="answered-section">
          <button
            className="answered-toggle"
            onClick={() => setShowAnswered(v => !v)}
          >
            Answered prayers — {answered.length}
            <span className="toggle-caret">{showAnswered ? ' −' : ' +'}</span>
          </button>
          {showAnswered && (
            <div className="answered-list">
              {answered.map(r => (
                <div key={r.id} className="answered-card">
                  <span className="answered-check">✓</span>
                  <p className="answered-text">{r.text}</p>
                  <button className="btn-remove-answered" onClick={() => removeRequest(r.id)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

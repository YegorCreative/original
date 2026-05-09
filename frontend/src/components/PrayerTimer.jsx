import { useState, useEffect, useRef, useCallback } from 'react'
import './PrayerTimer.css'

// Haptic pulse patterns (milliseconds: vibrate, pause, vibrate, ...)
const HAPTIC_PATTERNS = {
  start:   [200, 100, 200],
  pulse:   [50],
  halfway: [100, 50, 100, 50, 100],
  done:    [300, 100, 300, 100, 600],
}

const DURATIONS = [
  { label: '1 min',  seconds: 60 },
  { label: '3 min',  seconds: 180 },
  { label: '5 min',  seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
]

function haptic(pattern) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}

export default function PrayerTimer({ onComplete }) {
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[1])
  const [secondsLeft, setSecondsLeft] = useState(null)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [holding, setHolding] = useState(false)
  const intervalRef = useRef(null)
  const holdRef = useRef(null)

  // Tick countdown
  useEffect(() => {
    if (!running || secondsLeft === null) return

    if (secondsLeft <= 0) {
      setRunning(false)
      setDone(true)
      haptic(HAPTIC_PATTERNS.done)
      if (onComplete) onComplete()
      return
    }

    // Pulse haptic every 30 seconds
    if (secondsLeft % 30 === 0 && secondsLeft !== selectedDuration.seconds) {
      haptic(HAPTIC_PATTERNS.pulse)
    }

    // Halfway haptic
    if (secondsLeft === Math.floor(selectedDuration.seconds / 2)) {
      haptic(HAPTIC_PATTERNS.halfway)
    }

    intervalRef.current = setTimeout(() => {
      setSecondsLeft(s => s - 1)
    }, 1000)

    return () => clearTimeout(intervalRef.current)
  }, [running, secondsLeft, selectedDuration, onComplete])

  const start = () => {
    setDone(false)
    setSecondsLeft(selectedDuration.seconds)
    setRunning(true)
    haptic(HAPTIC_PATTERNS.start)
  }

  const pause = () => {
    setRunning(false)
    clearTimeout(intervalRef.current)
  }

  const reset = () => {
    setRunning(false)
    setDone(false)
    setSecondsLeft(null)
    clearTimeout(intervalRef.current)
  }

  // Hold-to-pray: haptic every 2 seconds while held
  const onHoldStart = useCallback(() => {
    if (running) return
    setHolding(true)
    haptic(HAPTIC_PATTERNS.start)
    holdRef.current = setInterval(() => haptic(HAPTIC_PATTERNS.pulse), 2000)
  }, [running])

  const onHoldEnd = useCallback(() => {
    setHolding(false)
    clearInterval(holdRef.current)
    if (!running) haptic(HAPTIC_PATTERNS.done)
  }, [running])

  useEffect(() => {
    return () => {
      clearTimeout(intervalRef.current)
      clearInterval(holdRef.current)
    }
  }, [])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const progress = secondsLeft !== null
    ? ((selectedDuration.seconds - secondsLeft) / selectedDuration.seconds) * 100
    : 0

  return (
    <div className="prayer-timer">
      <h3>Prayer Timer</h3>

      {secondsLeft === null && !done && (
        <div className="duration-picker">
          {DURATIONS.map(d => (
            <button
              key={d.seconds}
              className={`duration-btn ${selectedDuration.seconds === d.seconds ? 'active' : ''}`}
              onClick={() => setSelectedDuration(d)}
            >
              {d.label}
            </button>
          ))}
        </div>
      )}

      {secondsLeft !== null && (
        <div className="timer-display">
          <svg className="progress-ring" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" className="ring-bg" />
            <circle
              cx="60" cy="60" r="54"
              className="ring-fill"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
            />
          </svg>
          <span className="timer-text">{formatTime(secondsLeft)}</span>
        </div>
      )}

      {done && (
        <div className="timer-done">
          <span>🙏 Amen! Great job.</span>
        </div>
      )}

      <div className="timer-controls">
        {!running && secondsLeft === null && !done && (
          <button className="btn-start" onClick={start}>Start Prayer</button>
        )}
        {running && (
          <button className="btn-pause" onClick={pause}>Pause</button>
        )}
        {!running && secondsLeft !== null && !done && (
          <>
            <button className="btn-start" onClick={() => setRunning(true)}>Resume</button>
            <button className="btn-reset" onClick={reset}>Reset</button>
          </>
        )}
        {done && (
          <button className="btn-reset" onClick={reset}>Pray Again</button>
        )}
      </div>

      {!running && secondsLeft === null && !done && (
        <div className="hold-section">
          <button
            className={`btn-hold ${holding ? 'holding' : ''}`}
            onMouseDown={onHoldStart}
            onMouseUp={onHoldEnd}
            onTouchStart={(e) => { e.preventDefault(); onHoldStart() }}
            onTouchEnd={onHoldEnd}
          >
            {holding ? 'Praying...' : 'Hold to Pray'}
          </button>
          <p className="hold-hint">Hold this button while you pray — feel gentle pulses guiding you.</p>
        </div>
      )}
    </div>
  )
}

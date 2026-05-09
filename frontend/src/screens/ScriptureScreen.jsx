import { useState, useEffect } from 'react'
import './ScriptureScreen.css'

// Future React Native: ScriptureScreen component

// 7-passage reading plan — hardcoded (no external API required)
const READING_PLAN = [
  {
    id: 1,
    reference: 'Psalm 23:1–6',
    title: 'The Lord Is My Shepherd',
    text: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. He guides me along the right paths for his name\'s sake. Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me. You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows. Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.',
    prompt: 'Where do you need God\'s peace and guidance right now?',
  },
  {
    id: 2,
    reference: 'Matthew 6:25–27',
    title: 'Do Not Worry',
    text: '"Therefore I tell you, do not worry about your life, what you will eat or drink; or about your body, what you will wear. Is not life more than food, and the body more than clothes? Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they? Can any one of you by worrying add a single hour to your life?"',
    prompt: 'What worry can you release to God\'s care today?',
  },
  {
    id: 3,
    reference: 'Romans 8:38–39',
    title: 'Nothing Can Separate Us',
    text: 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.',
    prompt: 'What does it mean to you that nothing can separate you from God\'s love?',
  },
  {
    id: 4,
    reference: 'Lamentations 3:22–24',
    title: 'Great Is Your Faithfulness',
    text: 'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness. I say to myself, "The Lord is my portion; therefore I will wait for him."',
    prompt: 'How have you seen God\'s faithfulness recently?',
  },
  {
    id: 5,
    reference: 'John 15:4–5',
    title: 'Remain in Me',
    text: '"Remain in me, as I also remain in you. No branch can bear fruit by itself; it must remain in the vine. Neither can you bear fruit unless you remain in me. I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing."',
    prompt: 'What does remaining in Christ look like for you today?',
  },
  {
    id: 6,
    reference: 'Philippians 4:6–7',
    title: 'The Peace That Surpasses Understanding',
    text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
    prompt: 'What would it look like to pray through your anxious thoughts today?',
  },
  {
    id: 7,
    reference: 'Isaiah 40:31',
    title: 'Renewed Strength',
    text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    prompt: 'Where do you need renewed strength today?',
  },
]

const LOG_KEY = 'oa_reading_log'
const REFLECTIONS_KEY = 'oa_reading_reflections'
const PLAN_INDEX_KEY = 'oa_reading_plan_index'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export default function ScriptureScreen() {
  const [log, setLog] = useState(() => loadJSON(LOG_KEY, {}))
  const [reflections, setReflections] = useState(() => loadJSON(REFLECTIONS_KEY, {}))
  const [planIndex, setPlanIndex] = useState(() => {
    const saved = localStorage.getItem(PLAN_INDEX_KEY)
    return saved ? parseInt(saved, 10) : 0
  })
  const [draftReflection, setDraftReflection] = useState('')
  const [reflectionSaved, setReflectionSaved] = useState(false)

  const today = todayStr()
  const passage = READING_PLAN[planIndex % READING_PLAN.length]
  const completedToday = log[today] === passage.id
  const savedReflection = reflections[`${today}_${passage.id}`]

  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(log))
  }, [log])

  useEffect(() => {
    localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections))
  }, [reflections])

  const markRead = () => {
    setLog(prev => ({ ...prev, [today]: passage.id }))
    // Queue next passage for next session
    const next = (planIndex + 1) % READING_PLAN.length
    setPlanIndex(next)
    localStorage.setItem(PLAN_INDEX_KEY, String(next))
  }

  const saveReflection = () => {
    if (!draftReflection.trim()) return
    const key = `${today}_${passage.id}`
    setReflections(prev => ({ ...prev, [key]: draftReflection.trim() }))
    setReflectionSaved(true)
    setDraftReflection('')
    setTimeout(() => setReflectionSaved(false), 2500)
  }

  // Calculate consecutive-day streak from today backwards
  const readStreak = (() => {
    let count = 0
    const d = new Date()
    while (true) {
      const key = d.toISOString().slice(0, 10)
      if (!log[key]) break
      count++
      d.setDate(d.getDate() - 1)
    }
    return count
  })()

  const totalRead = Object.keys(log).length

  return (
    <div className="scripture-screen">
      <div className="screen-header">
        <div>
          <h2 className="screen-title">Scripture</h2>
          <p className="screen-sub">One passage. Read slowly.</p>
        </div>
        {readStreak > 0 && (
          <div className="reading-streak-badge">
            <span className="rsb-num">{readStreak}</span>
            <span className="rsb-unit">day{readStreak !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Future React Native: <ScriptureCard passage={passage} completed={completedToday} /> */}
      <div className={`scripture-card${completedToday ? ' done' : ''}`}>
        <div className="sc-meta">
          <span className="sc-ref">{passage.reference}</span>
          {completedToday && <span className="sc-badge">Read</span>}
        </div>
        <h3 className="sc-title">{passage.title}</h3>
        <p className="sc-text">{passage.text}</p>

        {!completedToday ? (
          <button className="btn-mark-read" onClick={markRead}>
            Mark as Read
          </button>
        ) : (
          <div className="sc-reflection">
            <p className="sc-prompt">{passage.prompt}</p>
            {savedReflection ? (
              <div className="sc-saved">
                <span className="sc-saved-label">Your reflection</span>
                <p>{savedReflection}</p>
              </div>
            ) : (
              <>
                <textarea
                  rows={3}
                  placeholder="Write your reflection here..."
                  value={draftReflection}
                  onChange={e => setDraftReflection(e.target.value)}
                />
                <button
                  className="btn-save-reflection"
                  onClick={saveReflection}
                  disabled={!draftReflection.trim()}
                >
                  {reflectionSaved ? 'Saved' : 'Save Reflection'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Future React Native: <RhythmScore stats={stats} /> */}
      <div className="reading-stats">
        <div className="rs-item">
          <span className="rs-num">{totalRead}</span>
          <span className="rs-label">passages read</span>
        </div>
        <div className="rs-divider" />
        <div className="rs-item">
          <span className="rs-num">{readStreak}</span>
          <span className="rs-label">day streak</span>
        </div>
        <div className="rs-divider" />
        <div className="rs-item">
          <span className="rs-num">{READING_PLAN.length}</span>
          <span className="rs-label">in this plan</span>
        </div>
      </div>

      <div className="plan-list">
        <h4 className="plan-list-title">Reading Plan</h4>
        {READING_PLAN.map((p, i) => {
          const isCompleted = Object.values(log).includes(p.id)
          const isCurrent = i === planIndex % READING_PLAN.length
          return (
            <div
              key={p.id}
              className={`plan-item${isCurrent ? ' current' : ''}${isCompleted ? ' completed' : ''}`}
            >
              <span className="plan-day">Day {i + 1}</span>
              <div className="plan-item-info">
                <span className="plan-ref">{p.reference}</span>
                <span className="plan-title-small">{p.title}</span>
              </div>
              {isCompleted && <span className="plan-check">✓</span>}
              {isCurrent && !isCompleted && <span className="plan-current-dot" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

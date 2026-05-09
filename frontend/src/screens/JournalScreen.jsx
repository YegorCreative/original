import { useState, useEffect } from 'react'
import JournalEntryCard from '../components/JournalEntryCard'
import './JournalScreen.css'

// Future React Native: JournalScreen component

const PROMPTS = [
  { id: 'teaching',  category: 'Reflection', text: 'What is God teaching me today?' },
  { id: 'surrender', category: 'Surrender',  text: 'What should I surrender and trust to God?' },
  { id: 'action',    category: 'Action',     text: 'What faithful action can I take today?' },
  { id: 'gratitude', category: 'Gratitude',  text: 'What am I grateful for right now?' },
  { id: 'presence',  category: 'Presence',   text: 'Where have I seen God at work recently?' },
]

const ENTRIES_KEY = 'oa_journal_entries'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(ENTRIES_KEY) || '[]')
  } catch {
    return []
  }
}

export default function JournalScreen() {
  const [entries, setEntries] = useState(loadEntries)
  const [selectedId, setSelectedId] = useState(PROMPTS[0].id)
  const [response, setResponse] = useState('')
  const [justSaved, setJustSaved] = useState(false)

  // Persist every change
  useEffect(() => {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
  }, [entries])

  const selectedPrompt = PROMPTS.find(p => p.id === selectedId)
  const today = todayStr()
  const todayEntries = entries.filter(e => e.date === today)
  const pastEntries = entries.filter(e => e.date !== today)

  const saveEntry = () => {
    if (!response.trim()) return
    const entry = {
      id: Date.now(),
      promptId: selectedId,
      promptText: selectedPrompt.text,
      category: selectedPrompt.category,
      response: response.trim(),
      date: today,
      createdAt: new Date().toISOString(),
    }
    setEntries(prev => [entry, ...prev])
    setResponse('')
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2500)
  }

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  // Rotate to next prompt
  const nextPrompt = () => {
    const idx = PROMPTS.findIndex(p => p.id === selectedId)
    setSelectedId(PROMPTS[(idx + 1) % PROMPTS.length].id)
    setResponse('')
  }

  return (
    <div className="journal-screen">
      <div className="screen-header">
        <div>
          <h2 className="screen-title">Journal</h2>
          <p className="screen-sub">A few honest words.</p>
        </div>
        {entries.length > 0 && (
          <div className="entry-count-badge">
            <span className="ecb-num">{entries.length}</span>
            <span className="ecb-label">entr{entries.length !== 1 ? 'ies' : 'y'}</span>
          </div>
        )}
      </div>

      {/* Future React Native: <JournalCompose prompt={selectedPrompt} onSave={saveEntry} /> */}
      <div className="journal-compose">
        <div className="prompt-picker">
          {PROMPTS.map(p => (
            <button
              key={p.id}
              className={`prompt-chip${selectedId === p.id ? ' active' : ''}`}
              onClick={() => { setSelectedId(p.id); setResponse('') }}
            >
              {p.category}
            </button>
          ))}
        </div>

        <p className="compose-prompt">{selectedPrompt.text}</p>

        <textarea
          className="journal-textarea"
          rows={5}
          placeholder="Write freely — this is just for you."
          value={response}
          onChange={e => setResponse(e.target.value)}
        />

        <div className="compose-actions">
          <button className="btn-next-prompt" onClick={nextPrompt}>
            Different prompt
          </button>
          <button
            className="btn-save-entry"
            onClick={saveEntry}
            disabled={!response.trim()}
          >
            {justSaved ? 'Saved' : 'Save Entry'}
          </button>
        </div>
      </div>

      {entries.length === 0 && (
        <div className="screen-empty">
          <p>No entries yet.</p>
          <p className="screen-empty-hint">Begin small. Even one sentence matters.</p>
        </div>
      )}

      {todayEntries.length > 0 && (
        <div className="entries-section">
          <h4 className="entries-label">Today</h4>
          <div className="entries-list">
            {todayEntries.map(e => (
              <JournalEntryCard key={e.id} entry={e} onDelete={deleteEntry} />
            ))}
          </div>
        </div>
      )}

      {pastEntries.length > 0 && (
        <div className="entries-section">
          <h4 className="entries-label">Previous entries</h4>
          <div className="entries-list">
            {pastEntries.map(e => (
              <JournalEntryCard key={e.id} entry={e} onDelete={deleteEntry} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

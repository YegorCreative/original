import './JournalEntryCard.css'

// Future React Native: <JournalEntryCard /> component
export default function JournalEntryCard({ entry, onDelete }) {
  const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="journal-entry-card">
      <div className="jec-header">
        <span className="jec-category">{entry.category}</span>
        <span className="jec-date">{date}</span>
        <button
          className="jec-delete"
          onClick={() => onDelete(entry.id)}
          title="Remove entry"
        >
          ✕
        </button>
      </div>
      <p className="jec-prompt">{entry.promptText}</p>
      <p className="jec-response">{entry.response}</p>
    </div>
  )
}

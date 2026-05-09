import './PrayerRequestCard.css'

// Future React Native: <PrayerRequestCard /> component
export default function PrayerRequestCard({ request, onPrayedToday, onMarkAnswered, onDelete }) {
  const date = new Date(request.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className={`prayer-request-card${request.prayedToday ? ' prayed' : ''}`}>
      <div className="prc-body">
        <p className="prc-text">{request.text}</p>
        <span className="prc-date">{date}</span>
      </div>
      <div className="prc-actions">
        <button
          className={`prc-btn prc-pray${request.prayedToday ? ' done' : ''}`}
          onClick={() => onPrayedToday(request.id)}
        >
          {request.prayedToday ? 'Prayed' : 'Pray'}
        </button>
        <button
          className="prc-btn prc-answered"
          onClick={() => onMarkAnswered(request.id)}
        >
          Answered
        </button>
        <button
          className="prc-btn prc-delete"
          onClick={() => onDelete(request.id)}
          title="Remove request"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

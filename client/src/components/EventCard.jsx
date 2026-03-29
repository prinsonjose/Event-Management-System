import './EventCard.css';

const EventCard = ({ event, actions, showAdmin = false }) => {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date(new Date().setHours(0, 0, 0, 0));
  const isFull = event.registrationCount >= event.maxParticipants;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`event-card ${isPast ? 'event-card-past' : ''}`}>
      <div className="event-card-header">
        <div className="event-card-date">
          <span className="event-date-month">{eventDate.toLocaleString('en-US', { month: 'short' })}</span>
          <span className="event-date-day">{eventDate.getDate()}</span>
        </div>
        <div className="event-card-badges">
          {isPast && <span className="badge badge-expired">Expired</span>}
          {!isPast && isFull && <span className="badge badge-full">Full</span>}
          {!isPast && !isFull && <span className="badge badge-open">Open</span>}
        </div>
      </div>

      <h3 className="event-card-title">{event.name}</h3>

      <div className="event-card-details">
        <div className="event-detail">
          <span className="detail-icon">📍</span>
          <span>{event.venue}</span>
        </div>
        <div className="event-detail">
          <span className="detail-icon">🕐</span>
          <span>{event.time}</span>
        </div>
        <div className="event-detail">
          <span className="detail-icon">📅</span>
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="event-detail">
          <span className="detail-icon">👥</span>
          <span>{event.registrationCount || 0} / {event.maxParticipants}</span>
        </div>
      </div>

      <p className="event-card-desc">
        {event.description?.length > 120
          ? event.description.substring(0, 120) + '...'
          : event.description}
      </p>

      {showAdmin && event.createdBy && (
        <div className="event-card-admin">
          <span className="detail-icon">🏫</span>
          <span>By {event.createdBy.name} — {event.createdBy.college || 'N/A'}</span>
        </div>
      )}

      {actions && <div className="event-card-actions">{actions}</div>}
    </div>
  );
};

export default EventCard;

import React from 'react';

const EventCard = ({ event, onBook, onUnjoin, userId }) => {
  // Check if the current logged-in user is already in the attendees list
  const isJoined = event.attendees?.includes(userId);

  return (
    <div className="event-card">
      <div 
        className="card-thumb" 
        style={{ 
          backgroundImage: `url(${event.imageUrl || 'https://via.placeholder.com/400x200?text=Event'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <span className="card-badge">{event.attendees?.length || 0} JOINED</span>
        
        {/* Dynamic Category Badge based on AI/Fallback result */}
        <div className="category-tag">
          {event.category === 'Technology' && '✨ TECHNOLOGY'}
          {event.category === 'Fitness' && '💪 FITNESS'}
          {event.category === 'Social' && '🤝 SOCIAL'}
          {event.category === 'Education' && '📚 EDUCATION'}
          {event.category === 'Entertainment' && '🎭 ENTERTAINMENT'}
          {!['Technology', 'Fitness', 'Social', 'Education', 'Entertainment'].includes(event.category) && '📍 GENERAL'}
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{event.title}</h3>
        <p className="card-desc">{event.description}</p>
        
        <div className="card-meta">
          <div>
            <div className="meta-label">📅 DATE</div>
            <div className="meta-value">
              {new Date(event.date).toLocaleDateString('en-GB', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </div>
          <div>
            <div className="meta-label">📍 LOCATION</div>
            <div className="meta-value">{event.location}</div>
          </div>
        </div>

        {/* Conditional Button: Show Unjoin if already joined, otherwise show Join */}
        <div className="card-actions">
          {!isJoined ? (
            <button 
              className="card-btn book" 
              onClick={() => onBook(event._id)}
            >
              JOIN EVENT
            </button>
          ) : (
            <button 
              className="card-btn unjoin" 
              onClick={() => onUnjoin(event._id)}
              style={{ borderColor: '#ff4d4d', color: '#ff4d4d' }}
            >
              UNJOIN
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
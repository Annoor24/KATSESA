import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

function EventsArchive() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events_archive"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="events-archive-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/association')}>
          ← Back
        </button>
        <h2 className="page-title">Events Archive</h2>
      </header>

      <div className="events-grid">
        {loading ? (
          <p className="loading-text">Loading memories...</p>
        ) : events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="event-card glass-card">
              {event.images && event.images[0] && (
                <div className="event-gallery-preview">
                  <img src={event.images[0]} alt={event.title} />
                  {event.images.length > 1 && (
                    <span className="gallery-count">+{event.images.length - 1} photos</span>
                  )}
                </div>
              )}
              <div className="event-info">
                <span className="event-date">{event.date}</span>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                {event.writeup && <button className="read-more-btn">Read Write-up</button>}
              </div>
            </div>
          ))
        ) : (
          <div className="no-events glass-card">
            <p>No events archived yet. Stay tuned for upcoming activities!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsArchive;

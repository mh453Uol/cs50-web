import { Event } from '../../models/Event';
import './Events.css';

interface Props {
  events: Event[];
}

const Events = ({ events }: Props) => {
  return (
    <div data-testid="Events" className="events-section">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-dark text-white" id="ramadan-events-header">
          <h2 className="mb-0">
            <i className="bi bi-calendar-event me-2"></i> Ramadan Events
            <small className="d-block text-light opacity-75" style={{ fontFamily: "'Amiri', 'Times New Roman', serif" }}>فعاليات رمضان</small>
          </h2>
        </div>
        <div className="card-body">
          {events.length > 0 ? (
            <div className="events-gallery">
              <div className="row g-3">
                {events.map((event) => (
                  <div key={event.id} className="col-12 col-md-6 col-lg-4">
                    <div className="gallery-item position-relative">
                      <a href={event.posterImage} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={event.posterImage} 
                          className="gallery-image img-fluid rounded" 
                          alt={event.altText}
                          style={{ cursor: 'pointer', width: '100%', height: '250px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                        />
                      </a>
                      
                      {/* Event Information Overlay */}
                      <div className="gallery-overlay">
                        <div className="event-info">
                          <h6 className="event-title text-white mb-1">{event.title}</h6>
                          <div className="event-meta">
                            <span className="badge bg-warning text-dark me-2">
                              <i className="bi bi-calendar me-1"></i> {event.date}
                            </span>
                            <span className="badge bg-warning text-dark">
                              <i className="bi bi-clock me-1"></i> {event.time}
                            </span>
                          </div>
                          <p className="event-location text-light mt-2 mb-0">
                            <i className="bi bi-geo-alt me-1"></i> {event.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="alert alert-info d-flex align-items-center">
              <i className="bi bi-info-circle fs-4 me-3"></i>
              <div>
                <h5 className="mb-1">No events scheduled yet</h5>
                <p className="mb-0">Please check back later for upcoming Ramadan events.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
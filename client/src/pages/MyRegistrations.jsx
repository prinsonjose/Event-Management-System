import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Popup from '../components/Popup';
import './Dashboard.css';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchRegistrations = async () => {
    try {
      const { data } = await API.get('/registrations/my');
      setRegistrations(data.registrations);
    } catch (err) {
      setPopup({
        type: 'error',
        title: 'Error',
        message: 'Failed to load registrations',
        onConfirm: () => setPopup(null)
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegistrations(); }, []);

  const handleCancel = async (eventId) => {
    setPopup({
      type: 'confirm',
      title: 'Cancel Registration',
      message: 'Are you sure you want to cancel this registration?',
      onConfirm: async () => {
        setPopup(null);
        try {
          await API.delete(`/registrations/${eventId}`);
          setRegistrations(registrations.filter(r => (r.event?._id || r.event) !== eventId));
          setPopup({
            type: 'success',
            title: 'Success',
            message: 'Registration cancelled successfully.',
            onConfirm: () => setPopup(null)
          });
        } catch (err) {
          setPopup({
            type: 'error',
            title: 'Error',
            message: err.response?.data?.message || 'Failed to cancel registration',
            onConfirm: () => setPopup(null)
          });
        }
      },
      onCancel: () => setPopup(null)
    });
  };

  if (loading) return <LoadingSpinner text="Loading your registrations..." />;

  return (
    <div className="dashboard">
      {popup && <Popup {...popup} />}
      
      <div className="dashboard-header">
        <div>
          <h1>My Registrations</h1>
          <p className="dashboard-subtitle">Events you've registered for</p>
        </div>
      </div>

      {registrations.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h3>No registrations yet</h3>
          <p>Browse events and register to see them here</p>
          <button className="btn btn-primary" onClick={() => navigate('/student')}>Browse Events</button>
        </div>
      ) : (
        <div className="events-grid">
          {registrations.map(reg => {
            const event = reg.event;
            if (!event) return null;
            const isPast = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <div key={reg._id} className={`event-card ${isPast ? 'event-card-past' : ''}`}>
                <div className="event-card-header">
                  <div className="event-card-date">
                    <span className="event-date-month">{new Date(event.date).toLocaleString('en-US', { month: 'short' })}</span>
                    <span className="event-date-day">{new Date(event.date).getDate()}</span>
                  </div>
                  <div className="event-card-badges">
                    <span className="badge badge-registered">✓ Registered</span>
                    {isPast && <span className="badge badge-expired">Past</span>}
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
                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                {event.createdBy && (
                  <div className="event-card-admin">
                    <span className="detail-icon">🏫</span>
                    <span>By {event.createdBy.name}</span>
                  </div>
                )}

                <div className="event-card-actions">
                  <button className="btn btn-sm btn-outline" onClick={() => navigate(`/events/${event._id}`)}>Details</button>
                  {!isPast && (
                    <button className="btn btn-sm btn-danger" onClick={() => handleCancel(event._id)}>Cancel Registration</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;

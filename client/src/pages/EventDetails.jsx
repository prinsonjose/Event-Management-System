import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Popup from '../components/Popup';
import './EventForm.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [popup, setPopup] = useState(null);

  const fetchEvent = async () => {
    try {
      const { data } = await API.get(`/events/${id}`);
      setEvent(data.event);
      setIsRegistered(data.isRegistered);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to load event details' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvent(); }, [id]);

  const handleRegister = async () => {
    setActionLoading(true);
    try {
      await API.post(`/registrations/${id}`);
      setIsRegistered(true);
      setPopup({
        type: 'success',
        title: 'Registration Successful!',
        message: 'You have successfully registered for this event.',
        onConfirm: () => setPopup(null)
      });
      fetchEvent();
    } catch (err) {
      setPopup({
        type: 'error',
        title: 'Registration Failed',
        message: err.response?.data?.message || 'Failed to register',
        onConfirm: () => setPopup(null)
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    setPopup({
      type: 'confirm',
      title: 'Cancel Registration',
      message: 'Are you sure you want to cancel your registration for this event?',
      onConfirm: async () => {
        setPopup(null);
        setActionLoading(true);
        try {
          await API.delete(`/registrations/${id}`);
          setIsRegistered(false);
          setPopup({
            type: 'success',
            title: 'Success',
            message: 'Your registration has been cancelled.',
            onConfirm: () => setPopup(null)
          });
          fetchEvent();
        } catch (err) {
          setPopup({
            type: 'error',
            title: 'Error',
            message: err.response?.data?.message || 'Failed to cancel registration',
            onConfirm: () => setPopup(null)
          });
        } finally {
          setActionLoading(false);
        }
      },
      onCancel: () => setPopup(null)
    });
  };

  if (loading) return <LoadingSpinner text="Loading event details..." />;
  if (!event) return (
    <div className="event-details-page">
      <div className="empty-state">
        <span className="empty-icon">❌</span>
        <h3>Event not found</h3>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );

  const isPast = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const isFull = (event.registrationCount || 0) >= event.maxParticipants;
  const admin = event.createdBy;

  return (
    <div className="event-details-page">
      {popup && <Popup {...popup} />}

      <div className="event-details-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <h1>{event.name}</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {isPast && <span className="badge badge-expired">Expired</span>}
            {!isPast && isFull && <span className="badge badge-full">Full</span>}
            {!isPast && !isFull && <span className="badge badge-open">Open</span>}
            {isRegistered && <span className="badge badge-registered">Registered</span>}
          </div>
        </div>

        <div className="event-meta">
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <div className="meta-content">
              <span className="meta-label">Date</span>
              <span className="meta-value">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
          <div className="meta-item">
            <span className="meta-icon">🕐</span>
            <div className="meta-content">
              <span className="meta-label">Time</span>
              <span className="meta-value">{event.time}</span>
            </div>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📍</span>
            <div className="meta-content">
              <span className="meta-label">Venue</span>
              <span className="meta-value">{event.venue}</span>
            </div>
          </div>
          <div className="meta-item">
            <span className="meta-icon">🌍</span>
            <div className="meta-content">
              <span className="meta-label">Location</span>
              <span className="meta-value">{event.location}</span>
            </div>
          </div>
          <div className="meta-item">
            <span className="meta-icon">👥</span>
            <div className="meta-content">
              <span className="meta-label">Participants</span>
              <span className="meta-value">{event.registrationCount || 0} / {event.maxParticipants}</span>
            </div>
          </div>
        </div>

        <div className="event-description">
          <h3>About This Event</h3>
          <p>{event.description}</p>
        </div>

        {admin && (
          <div className="admin-contact">
            <h3>📞 Organizer Contact</h3>
            <div className="contact-grid">
              <div className="contact-item">
                <span>👤</span>
                <span>{admin.name}</span>
              </div>
              <div className="contact-item">
                <span>📧</span>
                <a href={`mailto:${admin.email}`}>{admin.email}</a>
              </div>
              {admin.phone && (
                <div className="contact-item">
                  <span>📱</span>
                  <a href={`tel:${admin.phone}`}>{admin.phone}</a>
                </div>
              )}
              {admin.college && (
                <div className="contact-item">
                  <span>🏫</span>
                  <span>{admin.college}</span>
                </div>
              )}
              {admin.department && (
                <div className="contact-item">
                  <span>🏛️</span>
                  <span>{admin.department}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="event-actions-bottom">
          <button className="btn btn-outline" onClick={() => navigate(-1)}>← Back</button>

          {user.role === 'student' && !isRegistered && !isPast && !isFull && (
            <button className="btn btn-primary" onClick={handleRegister} disabled={actionLoading}>
              {actionLoading ? 'Registering...' : 'Register for Event'}
            </button>
          )}

          {user.role === 'student' && isRegistered && !isPast && (
            <button className="btn btn-danger" onClick={handleCancelRegistration} disabled={actionLoading}>
              {actionLoading ? 'Cancelling...' : 'Cancel Registration'}
            </button>
          )}

          {user.role === 'student' && !isRegistered && isPast && (
            <button className="btn btn-primary" disabled>Event Expired</button>
          )}

          {user.role === 'student' && !isRegistered && isFull && !isPast && (
            <button className="btn btn-primary" disabled>Event Full</button>
          )}

          {user.role === 'admin' && (
            <>
              <button className="btn btn-outline" onClick={() => navigate(`/admin/edit-event/${event._id}`)}>Edit Event</button>
              <button className="btn btn-outline" onClick={() => navigate(`/admin/participants/${event._id}`)}>View Participants</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

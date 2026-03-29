import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import './Dashboard.css';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const { data } = await API.get('/events');
      setEvents(data.events);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to load events' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? All registrations will also be deleted.')) return;
    try {
      await API.delete(`/events/${id}`);
      setEvents(events.filter(e => e._id !== id));
      setAlert({ type: 'success', message: 'Event deleted successfully' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete event' });
    }
  };

  if (loading) return <LoadingSpinner text="Loading your events..." />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name} 👋</h1>
          <p className="dashboard-subtitle">Manage your events and registrations</p>
        </div>
        <Link to="/admin/create-event" className="btn btn-primary">
          + Create Event
        </Link>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-number">{events.length}</span>
          <span className="stat-label">Total Events</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{events.filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0))).length}</span>
          <span className="stat-label">Active Events</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{events.reduce((sum, e) => sum + (e.registrationCount || 0), 0)}</span>
          <span className="stat-label">Total Registrations</span>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📅</span>
          <h3>No events yet</h3>
          <p>Create your first event to get started</p>
          <Link to="/admin/create-event" className="btn btn-primary">Create Event</Link>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <EventCard
              key={event._id}
              event={event}
              actions={
                <>
                  <button className="btn btn-sm btn-outline" onClick={() => navigate(`/events/${event._id}`)}>
                    View
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={() => navigate(`/admin/edit-event/${event._id}`)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={() => navigate(`/admin/participants/${event._id}`)}>
                    Participants ({event.registrationCount || 0})
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(event._id)}>
                    Delete
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

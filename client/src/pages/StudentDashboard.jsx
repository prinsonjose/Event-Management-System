import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import './Dashboard.css';

const StudentDashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [eventsRes, regsRes] = await Promise.all([
        API.get('/events'),
        API.get('/registrations/my'),
      ]);
      setEvents(eventsRes.data.events);
      const regSet = new Set(regsRes.data.registrations.map(r => r.event?._id || r.event));
      setRegisteredIds(regSet);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to load events' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    let result = [...events];
    const now = new Date(new Date().setHours(0, 0, 0, 0));

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(s) ||
        e.venue.toLowerCase().includes(s) ||
        e.description?.toLowerCase().includes(s) ||
        e.createdBy?.college?.toLowerCase().includes(s)
      );
    }

    if (filter === 'upcoming') {
      result = result.filter(e => new Date(e.date) >= now);
    } else if (filter === 'past') {
      result = result.filter(e => new Date(e.date) < now);
    } else if (filter === 'available') {
      result = result.filter(e => new Date(e.date) >= now && e.registrationCount < e.maxParticipants);
    } else if (filter === 'registered') {
      result = result.filter(e => registeredIds.has(e._id));
    }

    setFilteredEvents(result);
  }, [events, search, filter, registeredIds]);

  const handleRegister = async (eventId) => {
    try {
      await API.post(`/registrations/${eventId}`);
      setRegisteredIds(prev => new Set([...prev, eventId]));
      setAlert({ type: 'success', message: 'Successfully registered for the event!' });
      fetchData();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Registration failed' });
    }
  };

  if (loading) return <LoadingSpinner text="Loading events..." />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Hello, {user?.name} 👋</h1>
          <p className="dashboard-subtitle">Discover and register for college events</p>
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="search-filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search events by name, venue, or college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          {[
            { key: 'all', label: 'All' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'available', label: 'Available' },
            { key: 'registered', label: 'Registered' },
            { key: 'past', label: 'Past' },
          ].map(f => (
            <button
              key={f.key}
              className={`filter-btn ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="results-count">{filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found</p>

      {filteredEvents.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No events found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => {
            const isPast = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
            const isFull = event.registrationCount >= event.maxParticipants;
            const isRegistered = registeredIds.has(event._id);

            return (
              <EventCard
                key={event._id}
                event={event}
                showAdmin
                actions={
                  <>
                    <button className="btn btn-sm btn-outline" onClick={() => navigate(`/events/${event._id}`)}>
                      Details
                    </button>
                    {isRegistered ? (
                      <span className="badge badge-registered">✓ Registered</span>
                    ) : (
                      <button
                        className="btn btn-sm btn-primary"
                        disabled={isPast || isFull}
                        onClick={() => handleRegister(event._id)}
                      >
                        {isPast ? 'Expired' : isFull ? 'Full' : 'Register'}
                      </button>
                    )}
                  </>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

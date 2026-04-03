import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import './EventForm.css';

const EventForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    name: '', date: '', time: '', venue: '', location: '', description: '', maxParticipants: '',
  });

  useEffect(() => {
    if (isEdit) {
      const fetchEvent = async () => {
        try {
          const { data } = await API.get(`/events/${id}`);
          const e = data.event;
          setFormData({
            name: e.name,
            date: e.date ? new Date(e.date).toISOString().split('T')[0] : '',
            time: e.time,
            venue: e.venue,
            location: e.location || '',
            description: e.description,
            maxParticipants: e.maxParticipants,
          });
        } catch (err) {
          setAlert({ type: 'error', message: 'Failed to load event' });
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert(null);

    try {
      if (isEdit) {
        await API.put(`/events/${id}`, formData);
        setAlert({ type: 'success', message: 'Event updated successfully!' });
      } else {
        await API.post('/events', formData);
        setAlert({ type: 'success', message: 'Event created successfully!' });
      }
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to save event' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading event..." />;

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>{isEdit ? 'Edit Event' : 'Create New Event'}</h1>
          <p>{isEdit ? 'Update the event details below' : 'Fill in the details for your new event'}</p>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="name">Event Name *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Annual Tech Fest 2026" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="time">Time *</label>
              <input type="text" id="time" name="time" value={formData.time} onChange={handleChange} placeholder="10:00 AM - 4:00 PM" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="venue">Venue *</label>
              <input type="text" id="venue" name="venue" value={formData.venue} onChange={handleChange} placeholder="Main Auditorium" required />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Campus Ground / Room 101" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="maxParticipants">Max Participants *</label>
            <input type="number" id="maxParticipants" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} placeholder="100" min="1" required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your event in detail..." rows="5" required />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;

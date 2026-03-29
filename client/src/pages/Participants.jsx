import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import './EventForm.css';

const Participants = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get(`/registrations/event/${eventId}`);
        setRegistrations(data.registrations);
        setEvent(data.event);
      } catch (err) {
        setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to load participants' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  const handleExport = () => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/api/registrations/event/${eventId}/export?token=${token}`, '_blank');
  };

  const handleExportFetch = async () => {
    try {
      const response = await API.get(`/registrations/event/${eventId}/export`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${event?.name || 'participants'}_participants.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setAlert({ type: 'success', message: 'CSV downloaded successfully!' });
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to export CSV' });
    }
  };

  if (loading) return <LoadingSpinner text="Loading participants..." />;

  return (
    <div className="participants-page">
      <div className="participants-header">
        <div>
          <h1>Participants</h1>
          {event && <p>{event.name} — {registrations.length} / {event.maxParticipants} registered</p>}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline" onClick={() => navigate('/admin')}>← Back</button>
          <button className="btn btn-primary" onClick={handleExportFetch} disabled={registrations.length === 0}>
            📥 Export CSV
          </button>
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {registrations.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">👥</span>
          <h3>No participants yet</h3>
          <p>Students haven't registered for this event yet</p>
        </div>
      ) : (
        <div className="participants-table-container">
          <table className="participants-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>College</th>
                <th>Course</th>
                <th>Year</th>
                <th>Registered At</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg, index) => (
                <tr key={reg._id}>
                  <td>{index + 1}</td>
                  <td>{reg.student?.name || 'N/A'}</td>
                  <td>{reg.student?.email || 'N/A'}</td>
                  <td>{reg.student?.phone || 'N/A'}</td>
                  <td>{reg.student?.college || 'N/A'}</td>
                  <td>{reg.student?.course || 'N/A'}</td>
                  <td>{reg.student?.year || 'N/A'}</td>
                  <td>{new Date(reg.registeredAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Participants;

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import './EventForm.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    college: user?.college || '',
    department: user?.department || '',
    course: user?.course || '',
    year: user?.year || '',
    semester: user?.semester || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    if (formData.phone && !/^\d{10}$/.test(formData.phone.trim())) {
      setAlert({ type: 'error', message: 'Phone number must be exactly 10 digits' });
      return;
    }

    try {
      await updateUser(formData);
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
      setEditing(false);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p>{user?.email} — {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</p>
          </div>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} disabled={!editing} />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} disabled={!editing} placeholder="Not provided" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="college">College</label>
            <input type="text" id="college" name="college" value={formData.college} onChange={handleChange} disabled={!editing} placeholder="Not provided" />
          </div>

          {user?.role === 'admin' && (
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} disabled={!editing} placeholder="Not provided" />
            </div>
          )}

          {user?.role === 'student' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="course">Course</label>
                <input type="text" id="course" name="course" value={formData.course} onChange={handleChange} disabled={!editing} placeholder="Not provided" />
              </div>
              <div className="form-group">
                <label htmlFor="year">Year</label>
                <select id="year" name="year" value={formData.year} onChange={handleChange} disabled={!editing}>
                  <option value="">Select year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="5th">5th Year</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="semester">Semester</label>
                <select id="semester" name="semester" value={formData.semester} onChange={handleChange} disabled={!editing}>
                  <option value="">Select</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="form-actions">
            {editing ? (
              <>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

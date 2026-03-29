import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import './Auth.css';

const Register = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', college: '', department: '', course: '', year: '', semester: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[@$!%*?&#^()_\-+=]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isPasswordValid) {
      setError('Password does not meet all requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await register({ ...formData, role });
      setSuccess(data.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container auth-container-wide">
        <div className="auth-header">
          <span className="auth-logo">🎓</span>
          <h1>Create Account</h1>
          <p>Join EventHub to manage and participate in events</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} />}

        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => setRole('student')}
          >
            🎒 Student
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
          >
            👨‍💼 Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required />
            </div>
          </div>

          {formData.password && (
            <div className="password-requirements">
              <p className="req-title">Password Requirements:</p>
              <div className="req-list">
                <span className={passwordChecks.length ? 'req-met' : 'req-unmet'}>✓ 8+ characters</span>
                <span className={passwordChecks.uppercase ? 'req-met' : 'req-unmet'}>✓ Uppercase letter</span>
                <span className={passwordChecks.lowercase ? 'req-met' : 'req-unmet'}>✓ Lowercase letter</span>
                <span className={passwordChecks.number ? 'req-met' : 'req-unmet'}>✓ Number</span>
                <span className={passwordChecks.special ? 'req-met' : 'req-unmet'}>✓ Special character</span>
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
            </div>
            <div className="form-group">
              <label htmlFor="college">College Name</label>
              <input type="text" id="college" name="college" value={formData.college} onChange={handleChange} placeholder="Your college name" />
            </div>
          </div>

          {role === 'admin' && (
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} placeholder="Computer Science" />
            </div>
          )}

          {role === 'student' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="course">Course</label>
                <input type="text" id="course" name="course" value={formData.course} onChange={handleChange} placeholder="B.Tech CSE" />
              </div>
              <div className="form-group">
                <label htmlFor="year">Year</label>
                <select id="year" name="year" value={formData.year} onChange={handleChange}>
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
                <select id="semester" name="semester" value={formData.semester} onChange={handleChange}>
                  <option value="">Select semester</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading || !isPasswordValid}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

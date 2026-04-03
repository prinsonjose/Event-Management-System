import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  return (
    <nav className={`navbar ${menuOpen ? 'navbar-menu-open' : ''}`}>
      <div className="navbar-container">
        <Link to={isAdmin ? '/admin' : '/student'} className="navbar-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">EventHub</span>
        </Link>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`hamburger ${menuOpen ? 'active' : ''}`}></span>
        </button>
      </div>

      <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
        <div className="navbar-links">
          {isAdmin ? (
            <>
              <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/admin/create-event" className="nav-link" onClick={() => setMenuOpen(false)}>Create Event</Link>
              <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>Profile</Link>
            </>
          ) : (
            <>
              <Link to="/student" className="nav-link" onClick={() => setMenuOpen(false)}>Events</Link>
              <Link to="/student/my-registrations" className="nav-link" onClick={() => setMenuOpen(false)}>My Registrations</Link>
              <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>Profile</Link>
            </>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-greeting">
            <span className="user-role-badge">{user.role}</span>
            {user.name}
          </span>
          <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

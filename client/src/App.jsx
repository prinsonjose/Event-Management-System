import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import EventForm from './pages/EventForm';
import EventDetails from './pages/EventDetails';
import MyRegistrations from './pages/MyRegistrations';
import Participants from './pages/Participants';
import Profile from './pages/Profile';
import './index.css';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner text="Loading EventHub..." />;

  return (
    <>
      {user && <Navbar />}
      <main className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Register />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/create-event" element={<ProtectedRoute role="admin"><EventForm /></ProtectedRoute>} />
          <Route path="/admin/edit-event/:id" element={<ProtectedRoute role="admin"><EventForm /></ProtectedRoute>} />
          <Route path="/admin/participants/:eventId" element={<ProtectedRoute role="admin"><Participants /></ProtectedRoute>} />

          {/* Student */}
          <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/my-registrations" element={<ProtectedRoute role="student"><MyRegistrations /></ProtectedRoute>} />

          {/* Shared */}
          <Route path="/events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Default */}
          <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/student') : '/login'} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;

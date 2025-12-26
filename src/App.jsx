import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LogOut, User, Menu } from 'lucide-react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Booking from './pages/Booking';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="text-primary">TURF</span>BOOK
        </Link>

        {user ? (
          <div className="flex-center" style={{ gap: '1.5rem' }}>
            <span className="text-muted" style={{ display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
              Hi, {user.name}
            </span>
            <button _onClick={onLogout} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">Login</Link>
        )}
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />
        <main style={{ paddingBottom: '2rem' }}>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="/" element={<Home />} />
            <Route
              path="/booking/:id"
              element={
                <ProtectedRoute user={user}>
                  <Booking />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

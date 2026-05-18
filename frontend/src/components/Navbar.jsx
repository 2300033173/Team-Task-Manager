import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, logout }) {
  const navigate = useNavigate();
  const initial = user.name ? user.name[0].toUpperCase() : '?';

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="nav">
      <span className="nav-brand">🗂 Team Task Manager</span>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="nav-user">
          <div className="nav-avatar">{initial}</div>
          <div>
            <div className="nav-name">{user.name}</div>
          </div>
        </div>
        <button className="nav-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

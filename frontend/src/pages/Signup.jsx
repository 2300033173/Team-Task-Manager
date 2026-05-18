import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

export default function Signup({ onLogin }) {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'member';
  const isAdmin = role === 'admin';
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { accessToken, refreshToken, user } = await authAPI.signup(form);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      onLogin(accessToken, user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <button className="auth-back" onClick={() => navigate('/')}>← Back to Home</button>

        <div className={`auth-role-badge ${isAdmin ? 'auth-role-admin' : 'auth-role-member'}`}>
          {isAdmin ? '👑 Admin Registration' : '👤 Member Registration'}
        </div>

        <div className="auth-logo">
          <h1>🗂 Team Task Manager</h1>
          <p>{isAdmin ? 'Create an admin account to start managing projects' : 'Create a member account to join projects'}</p>
        </div>

        {isAdmin && (
          <div className="auth-info-box admin-info">
            <strong>As Admin you can:</strong> create projects, add members, create &amp; assign tasks, view full analytics.
          </div>
        )}
        {!isAdmin && (
          <div className="auth-info-box member-info">
            <strong>As Member you can:</strong> join projects (via Admin invite), view tasks, update your assigned tasks.
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password <span style={{ color: '#aaa', fontWeight: 400 }}>(min 6 characters)</span></label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className={`btn ${isAdmin ? 'btn-admin' : 'btn-member'}`}
            style={{ width: '100%', marginTop: '6px', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Creating account...' : `Create ${isAdmin ? 'Admin' : 'Member'} Account`}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to={`/login?role=${role}`}>Sign in as {isAdmin ? 'Admin' : 'Member'}</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: '8px' }}>
          <span
            style={{ cursor: 'pointer', color: isAdmin ? '#2e7d32' : '#e65100', fontWeight: 600 }}
            onClick={() => navigate(`/signup?role=${isAdmin ? 'member' : 'admin'}`)}
          >
            Switch to {isAdmin ? '👤 Member' : '👑 Admin'} registration →
          </span>
        </div>
      </div>
    </div>
  );
}

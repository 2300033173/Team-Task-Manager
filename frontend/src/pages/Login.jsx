import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

export default function Login({ onLogin }) {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'admin';
  const isAdmin = role === 'admin';
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { accessToken, refreshToken, user } = await authAPI.login(form);
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
        {/* Back to home */}
        <button className="auth-back" onClick={() => navigate('/')}>← Back to Home</button>

        {/* Role indicator */}
        <div className={`auth-role-badge ${isAdmin ? 'auth-role-admin' : 'auth-role-member'}`}>
          {isAdmin ? '👑 Admin Login' : '👤 Member Login'}
        </div>

        <div className="auth-logo">
          <h1>🗂 Team Task Manager</h1>
          <p>{isAdmin ? 'Sign in to manage your team and projects' : 'Sign in to view and update your tasks'}</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className={`btn ${isAdmin ? 'btn-admin' : 'btn-member'}`}
            style={{ width: '100%', marginTop: '6px', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : `Sign In as ${isAdmin ? 'Admin' : 'Member'}`}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to={`/signup?role=${role}`}>
            Register as {isAdmin ? 'Admin' : 'Member'}
          </Link>
        </div>
        <div className="auth-footer" style={{ marginTop: '8px' }}>
          <Link to="/forgot-password" style={{ color: '#d32f2f', fontWeight: 600 }}>
            Forgot Password?
          </Link>
        </div>
        <div className="auth-footer" style={{ marginTop: '8px' }}>
          <span
            style={{ cursor: 'pointer', color: isAdmin ? '#2e7d32' : '#e65100', fontWeight: 600 }}
            onClick={() => navigate(`/login?role=${isAdmin ? 'member' : 'admin'}`)}
          >
            Switch to {isAdmin ? '👤 Member' : '👑 Admin'} login →
          </span>
        </div>
      </div>
    </div>
  );
}

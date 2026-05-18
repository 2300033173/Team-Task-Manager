import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // email, reset, success
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      setMessage(res.message);
      setStep('reset');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword(resetToken, newPassword);
      setStep('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <button className="auth-back" onClick={() => navigate('/login')}>← Back to Login</button>

        <div className="auth-logo">
          <h1>🔐 Reset Password</h1>
        </div>

        {step === 'email' && (
          <>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
              Enter your email address and we'll send you a reset token
            </p>
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleRequestReset}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="btn btn-admin"
                style={{ width: '100%', padding: '12px' }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Token'}
              </button>
            </form>
          </>
        )}

        {step === 'reset' && (
          <>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
              {message}
            </p>
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label>Reset Token</label>
                <input
                  type="text"
                  placeholder="Paste the token from your email"
                  value={resetToken}
                  onChange={e => setResetToken(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-admin"
                style={{ width: '100%', padding: '12px' }}
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        {step === 'success' && (
          <>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ fontSize: '48px', marginBottom: '10px' }}>✅</p>
              <p style={{ color: '#2e7d32', fontWeight: 600, marginBottom: '20px' }}>
                Password reset successful!
              </p>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-admin"
                style={{ width: '100%', padding: '12px' }}
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

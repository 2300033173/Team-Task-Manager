import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    if (accessToken && userData) setUser(JSON.parse(userData));
    setLoading(false);
  }, []);

  const login = (accessToken, userData) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <BrowserRouter>
      {user && <Navbar user={user} logout={logout} />}
      <Routes>
        <Route path="/"              element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login"         element={user ? <Navigate to="/dashboard" /> : <Login onLogin={login} />} />
        <Route path="/signup"        element={user ? <Navigate to="/dashboard" /> : <Signup onLogin={login} />} />
        <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
        <Route path="/dashboard"     element={user ? <Dashboard />              : <Navigate to="/" />} />
        <Route path="/projects"      element={user ? <Projects />               : <Navigate to="/" />} />
        <Route path="/projects/:projectId" element={user ? <ProjectDetail user={user} /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

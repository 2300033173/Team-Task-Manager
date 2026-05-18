import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, projectAPI } from '../api';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    Promise.all([dashboardAPI.user(), projectAPI.list()])
      .then(([dash, proj]) => {
        setUserData(dash);
        setProjects(proj.projects);
      })
      .catch(console.error);
  }, []);

  if (!userData) return <div className="loading">Loading dashboard...</div>;

  const byStatus = { 'To Do': 0, 'In Progress': 0, 'Done': 0 };
  userData.byStatus.forEach(s => { byStatus[s._id] = s.count; });

  const adminProjects = projects.filter(p => p.role === 'Admin');
  const memberProjects = projects.filter(p => p.role === 'Member');

  return (
    <div className="container">
      <div className="page-header">
        <h2>📊 Dashboard</h2>
        <Link to="/projects" className="btn btn-primary btn-sm">View All Projects</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{userData.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number">{byStatus['To Do']}</div>
          <div className="stat-label">To Do</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-number">{byStatus['In Progress']}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-number">{byStatus['Done']}</div>
          <div className="stat-label">Done</div>
        </div>
        <div className="stat-card red">
          <div className="stat-number">{userData.overdue.length}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Projects summary */}
        <div className="card">
          <div className="section-title">🗂 My Projects</div>
          {adminProjects.length > 0 && (
            <>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#e65100', marginBottom: '8px', textTransform: 'uppercase' }}>
                Admin ({adminProjects.length})
              </div>
              {adminProjects.map(p => (
                <Link key={p.project._id} to={`/projects/${p.project._id}`} style={{ display: 'block', padding: '8px 12px', background: '#fff3e0', borderRadius: '8px', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>
                  {p.project.name}
                </Link>
              ))}
            </>
          )}
          {memberProjects.length > 0 && (
            <>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#2e7d32', marginBottom: '8px', marginTop: '10px', textTransform: 'uppercase' }}>
                Member ({memberProjects.length})
              </div>
              {memberProjects.map(p => (
                <Link key={p.project._id} to={`/projects/${p.project._id}`} style={{ display: 'block', padding: '8px 12px', background: '#e8f5e9', borderRadius: '8px', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>
                  {p.project.name}
                </Link>
              ))}
            </>
          )}
          {projects.length === 0 && <div className="empty-state">No projects yet</div>}
        </div>

        {/* Overdue tasks */}
        <div className="card">
          <div className="section-title">⚠️ Overdue Tasks</div>
          {userData.overdue.length === 0 ? (
            <div className="empty-state">🎉 No overdue tasks!</div>
          ) : (
            <ul className="overdue-list">
              {userData.overdue.map(t => (
                <li key={t._id} className="overdue-item">
                  <div>
                    <strong>{t.title}</strong>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                      Due: {new Date(t.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`status-badge status-${t.status === 'To Do' ? 'todo' : t.status === 'In Progress' ? 'progress' : 'done'}`}>
                    {t.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

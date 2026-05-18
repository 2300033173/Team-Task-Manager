import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = () => projectAPI.list().then(d => setProjects(d.projects)).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await projectAPI.create(form);
      setForm({ name: '', description: '' });
      setShowForm(false);
      load();
    } catch (err) { setError(err.message); }
  };

  const adminProjects = projects.filter(p => p.role === 'Admin');
  const memberProjects = projects.filter(p => p.role === 'Member');

  return (
    <div className="container">
      <div className="page-header">
        <h2>🗂 Projects</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ New Project</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="section-title">Create New Project</div>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Project Name *</label>
              <input type="text" placeholder="e.g. Website Redesign" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="What is this project about?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">Create Project</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setError(''); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Admin projects */}
      {adminProjects.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span className="role-badge role-admin">👑 Admin</span>
            <span style={{ fontSize: '13px', color: '#888' }}>Projects you manage</span>
          </div>
          <div className="projects-grid" style={{ marginBottom: '28px' }}>
            {adminProjects.map(p => (
              <div key={p.project._id} className="project-card" onClick={() => navigate(`/projects/${p.project._id}`)}>
                <h3>{p.project.name}</h3>
                <p>{p.project.description || 'No description provided'}</p>
                <div className="project-card-footer">
                  <span className="role-badge role-admin">Admin</span>
                  <span style={{ fontSize: '12px', color: '#aaa' }}>Click to open →</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Member projects */}
      {memberProjects.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span className="role-badge role-member">👤 Member</span>
            <span style={{ fontSize: '13px', color: '#888' }}>Projects you're part of</span>
          </div>
          <div className="projects-grid">
            {memberProjects.map(p => (
              <div key={p.project._id} className="project-card member-card" onClick={() => navigate(`/projects/${p.project._id}`)}>
                <h3>{p.project.name}</h3>
                <p>{p.project.description || 'No description provided'}</p>
                <div className="project-card-footer">
                  <span className="role-badge role-member">Member</span>
                  <span style={{ fontSize: '12px', color: '#aaa' }}>Click to open →</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {projects.length === 0 && !showForm && (
        <div className="card">
          <div className="empty-state">
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
            <div style={{ fontWeight: 600, marginBottom: '6px' }}>No projects yet</div>
            <div>Click "New Project" to create your first project</div>
          </div>
        </div>
      )}
    </div>
  );
}

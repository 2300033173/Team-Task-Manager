import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectAPI, taskAPI, dashboardAPI } from '../api';

const STATUSES = ['To Do', 'In Progress', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const statusClass = s => s === 'To Do' ? 'status-todo' : s === 'In Progress' ? 'status-progress' : 'status-done';
const priorityClass = p => p === 'Low' ? 'priority-low' : p === 'Medium' ? 'priority-medium' : 'priority-high';
const priorityCardClass = p => p === 'Low' ? 'priority-low-card' : p === 'Medium' ? 'priority-medium-card' : 'priority-high-card';

function TaskCard({ task, isAdmin, currentUserId, members, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    assignedTo: task.assignedTo?._id || ''
  });

  const isAssignedToMe = String(task.assignedTo?._id) === String(currentUserId);
  const canEdit = isAdmin || isAssignedToMe;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  const save = async () => {
    const updates = isAdmin
      ? { ...form, assignedTo: form.assignedTo || null }
      : { status: form.status, description: form.description };
    await onUpdate(task._id, updates);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="task-card">
        <div className="task-edit-form">
          {isAdmin && (
            <div className="form-group">
              <label>Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
          )}
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          {isAdmin && (
            <>
              <div className="form-group">
                <label>Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}>
                  <option value="">Unassigned</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </>
          )}
          {!isAdmin && (
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', padding: '6px 8px', background: '#ffebee', borderRadius: '6px' }}>
              ℹ️ As a member, you can update status and description only.
            </div>
          )}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="btn btn-primary btn-sm" onClick={save}>Save</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : priorityCardClass(task.priority)}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="task-card-title">{task.title}</div>
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0, marginLeft: '8px' }}>
          {canEdit && (
            <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>Edit</button>
          )}
          {isAdmin && (
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(task._id)}>Del</button>
          )}
        </div>
      </div>
      {task.description && <div className="task-card-desc">{task.description}</div>}
      <div className="task-card-meta">
        <span className={`status-badge ${statusClass(task.status)}`}>{task.status}</span>
        <span className={`priority-badge ${priorityClass(task.priority)}`}>{task.priority}</span>
        {task.assignedTo && (
          <span className="assignee-chip">
            👤 {task.assignedTo.name}
            {isAssignedToMe && <span style={{ color: '#d32f2f', fontWeight: 700 }}> (you)</span>}
          </span>
        )}
        {task.dueDate && (
          <span className={`due-chip ${isOverdue ? 'overdue' : ''}`}>
            {isOverdue ? '⚠️' : '📅'} {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ProjectDetail({ user }) {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dashData, setDashData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });
  const [memberEmail, setMemberEmail] = useState('');
  const [error, setError] = useState('');
  const [taskError, setTaskError] = useState('');
  const [memberTaskView, setMemberTaskView] = useState('all');

  const load = async () => {
    try {
      const [detail, dash] = await Promise.all([
        projectAPI.get(projectId),
        dashboardAPI.project(projectId)
      ]);
      setProject(detail.project);
      setMembers(detail.members);
      setTasks(detail.tasks);
      setDashData(dash);
      const me = detail.members.find(m => String(m.id) === String(user.id));
      setIsAdmin(me?.role === 'Admin');
    } catch (err) { console.error(err); }
  };

  useEffect(() => { load(); }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskError('');
    try {
      await taskAPI.create(projectId, {
        ...taskForm,
        assignedTo: taskForm.assignedTo || undefined,
        dueDate: taskForm.dueDate || undefined
      });
      setTaskForm({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });
      setShowTaskForm(false);
      load();
    } catch (err) { setTaskError(err.message); }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try { await taskAPI.update(projectId, taskId, updates); load(); }
    catch (err) { alert(err.message); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try { await taskAPI.delete(projectId, taskId); load(); }
    catch (err) { alert(err.message); }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await projectAPI.addMember(projectId, { email: memberEmail });
      setMemberEmail('');
      setShowMemberForm(false);
      load();
    } catch (err) { setError(err.message); }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try { await projectAPI.removeMember(projectId, memberId); load(); }
    catch (err) { alert(err.message); }
  };

  if (!project) return <div className="loading">Loading project...</div>;

  const byStatus = {};
  STATUSES.forEach(s => { byStatus[s] = tasks.filter(t => t.status === s); });

  const myTasks = tasks.filter(t => String(t.assignedTo?._id) === String(user.id));
  const myTasksByStatus = {};
  STATUSES.forEach(s => { myTasksByStatus[s] = myTasks.filter(t => t.status === s); });

  const byStatusCount = { 'To Do': 0, 'In Progress': 0, 'Done': 0 };
  if (dashData) dashData.byStatus.forEach(s => { byStatusCount[s._id] = s.count; });

  const displayTasks = memberTaskView === 'assigned' ? myTasks : tasks;
  const displayByStatus = memberTaskView === 'assigned' ? myTasksByStatus : byStatus;

  return (
    <div className="container">
      <div style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>
        <Link to="/projects">Projects</Link> / {project.name}
      </div>

      <div className="page-header">
        <div>
          <h2>{project.name}</h2>
          {project.description && <p style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>{project.description}</p>}
        </div>
        <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-member'}`}>
          {isAdmin ? '👑 Admin' : '👤 Member'}
        </span>
      </div>

      {isAdmin ? (
        <div className="admin-banner">👑 You are the Admin — you can create/edit/delete tasks and manage members.</div>
      ) : (
        <div className="member-banner">👤 You are a Member — you can view all tasks and update tasks assigned to you.</div>
      )}

      {dashData && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{dashData.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card green">
            <div className="stat-number">{byStatusCount['To Do']}</div>
            <div className="stat-label">To Do</div>
          </div>
          <div className="stat-card orange">
            <div className="stat-number">{byStatusCount['In Progress']}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card purple">
            <div className="stat-number">{byStatusCount['Done']}</div>
            <div className="stat-label">Done</div>
          </div>
          <div className="stat-card red">
            <div className="stat-number">{dashData.overdue.length}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div className="section-title" style={{ marginBottom: 0 }}>👥 Members</div>
            {isAdmin && (
              <button className="btn btn-primary btn-sm" onClick={() => setShowMemberForm(!showMemberForm)}>+ Add Member</button>
            )}
          </div>

          {isAdmin && showMemberForm && (
            <form onSubmit={handleAddMember} style={{ marginBottom: '14px' }}>
              {error && <div className="error-msg">{error}</div>}
              <div className="inline-form">
                <input type="email" placeholder="member@email.com" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} required style={{ marginBottom: 0 }} />
                <button type="submit" className="btn btn-success btn-sm" style={{ whiteSpace: 'nowrap' }}>Add</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setShowMemberForm(false); setError(''); }}>✕</button>
              </div>
            </form>
          )}

          {members.map(m => (
            <div key={m.id} className="member-row">
              <div className="member-info">
                <div className={`member-avatar ${m.role === 'Admin' ? 'admin-avatar' : ''}`}>{m.name[0].toUpperCase()}</div>
                <div>
                  <div className="member-name">
                    {m.name}
                    {String(m.id) === String(user.id) && <span style={{ color: '#d32f2f', fontSize: '11px', marginLeft: '6px' }}>(you)</span>}
                  </div>
                  <div className="member-email">{m.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`role-badge ${m.role === 'Admin' ? 'role-admin' : 'role-member'}`}>{m.role}</span>
                {isAdmin && String(m.id) !== String(user.id) && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemoveMember(m.id)}>Remove</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {isAdmin && dashData?.tasksPerUser?.length > 0 && (
          <div className="card">
            <div className="section-title">📊 Tasks per Member</div>
            <table className="user-task-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Tasks Assigned</th>
                </tr>
              </thead>
              <tbody>
                {dashData.tasksPerUser.map(t => {
                  const member = members.find(m => String(m.id) === String(t._id));
                  return (
                    <tr key={t._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="member-avatar" style={{ width: 28, height: 28, fontSize: 12 }}>{member?.name?.[0]?.toUpperCase() || '?'}</div>
                          {member?.name || 'Unknown'}
                        </div>
                      </td>
                      <td><span style={{ fontWeight: 700, color: '#d32f2f', fontSize: '16px' }}>{t.count}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {dashData?.overdue?.length > 0 && (
          <div className="card">
            <div className="section-title">⚠️ Overdue Tasks</div>
            <ul className="overdue-list">
              {dashData.overdue.map(t => (
                <li key={t._id} className="overdue-item">
                  <div>
                    <strong>{t.title}</strong>
                    {t.assignedTo && <div style={{ fontSize: '11px', color: '#888' }}>Assigned to: {t.assignedTo.name}</div>}
                  </div>
                  <span style={{ fontSize: '11px', color: '#d32f2f', fontWeight: 600 }}>Due {new Date(t.dueDate).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div className="section-title" style={{ marginBottom: 0 }}>📋 Task Board</div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowTaskForm(!showTaskForm)}>+ New Task</button>
        )}
      </div>

      {!isAdmin && (
        <div className="member-tasks-section">
          <div className="member-tasks-tabs">
            <button className={`member-tasks-tab ${memberTaskView === 'all' ? 'active' : ''}`} onClick={() => setMemberTaskView('all')}>
              All Tasks ({tasks.length})
            </button>
            <button className={`member-tasks-tab ${memberTaskView === 'assigned' ? 'active' : ''}`} onClick={() => setMemberTaskView('assigned')}>
              Assigned to Me ({myTasks.length})
            </button>
          </div>
        </div>
      )}

      {isAdmin && showTaskForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="section-title">Create New Task</div>
          {taskError && <div className="error-msg">{taskError}</div>}
          <form onSubmit={handleCreateTask}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Title *</label>
                <input type="text" placeholder="Task title" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <textarea placeholder="Task description" value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} rows={2} />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Assign To</label>
                <select value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                  <option value="">— Unassigned —</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">Create Task</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowTaskForm(false); setTaskError(''); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="kanban">
        {STATUSES.map(status => (
          <div key={status} className="kanban-col">
            <div className="kanban-col-header">
              <h3>{status === 'To Do' ? '📝' : status === 'In Progress' ? '⚙️' : '✅'} {status}</h3>
              <span className="col-count">{displayByStatus[status].length}</span>
            </div>
            {displayByStatus[status].length === 0 ? (
              <div className="empty-state" style={{ padding: '20px 10px', fontSize: '12px' }}>No tasks</div>
            ) : (
              displayByStatus[status].map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  isAdmin={isAdmin}
                  currentUserId={user.id}
                  members={members}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

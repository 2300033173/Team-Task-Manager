const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  let token = localStorage.getItem('accessToken');
  const headers = { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }), ...options.headers };
  let res = await fetch(`${API}${endpoint}`, { ...options, headers });
  let data = await res.json();
  
  // If token expired, try to refresh
  if (res.status === 401 && localStorage.getItem('refreshToken')) {
    try {
      const refreshRes = await fetch(`${API}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') })
      });
      const refreshData = await refreshRes.json();
      if (refreshRes.ok) {
        localStorage.setItem('accessToken', refreshData.accessToken);
        localStorage.setItem('refreshToken', refreshData.refreshToken);
        // Retry original request with new token
        const retryHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${refreshData.accessToken}`, ...options.headers };
        res = await fetch(`${API}${endpoint}`, { ...options, headers: retryHeaders });
        data = await res.json();
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }
  
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const authAPI = {
  signup: (data) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  refresh: (refreshToken) => request('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (resetToken, newPassword) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ resetToken, newPassword }) }),
};

export const projectAPI = {
  list: () => request('/projects'),
  get: (id) => request(`/projects/${id}`),
  create: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  addMember: (projectId, data) => request(`/projects/${projectId}/members`, { method: 'POST', body: JSON.stringify(data) }),
  removeMember: (projectId, userId) => request(`/projects/${projectId}/members/${userId}`, { method: 'DELETE' }),
};

export const taskAPI = {
  list: (projectId) => request(`/projects/${projectId}/tasks`),
  create: (projectId, data) => request(`/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(data) }),
  update: (projectId, taskId, data) => request(`/projects/${projectId}/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (projectId, taskId) => request(`/projects/${projectId}/tasks/${taskId}`, { method: 'DELETE' }),
  assign: (projectId, taskId, userId) => request(`/projects/${projectId}/tasks/${taskId}/assign`, { method: 'POST', body: JSON.stringify({ userId }) }),
};

export const dashboardAPI = {
  user: () => request('/dashboard/user'),
  project: (projectId) => request(`/dashboard/project/${projectId}`),
};

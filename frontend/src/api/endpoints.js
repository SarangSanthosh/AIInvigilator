import api from './axios';

// Authentication endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/update/', data),
  logout: () => api.post('/auth/logout/'),
};

// Malpractice detection endpoints
export const malpracticeAPI = {
  getAll: (params) => api.get('/malpractices/', { params }),
  getById: (id) => api.get(`/malpractices/${id}/`),
  verify: (id) => api.post(`/malpractices/${id}/verify/`),
  unverify: (id) => api.post(`/malpractices/${id}/unverify/`),
  delete: (id) => api.delete(`/malpractices/${id}/`),
  getStats: () => api.get('/malpractices/stats/'),
  getByBuilding: (building) => api.get('/malpractices/by_building/', { params: { building } }),
};

// Lecture hall endpoints
export const lectureHallAPI = {
  getAll: () => api.get('/lecture-halls/'),
  getById: (id) => api.get(`/lecture-halls/${id}/`),
  create: (data) => api.post('/lecture-halls/', data),
  update: (id, data) => api.put(`/lecture-halls/${id}/`, data),
  delete: (id) => api.delete(`/lecture-halls/${id}/`),
  getBuildings: () => api.get('/lecture-halls/buildings/'),
  getByBuilding: (building) => api.get('/lecture-halls/by_building/', { params: { building } }),
};

// Teacher endpoints
export const teacherAPI = {
  getAll: () => api.get('/teachers/'),
  getById: (id) => api.get(`/teachers/${id}/`),
  update: (id, data) => api.put(`/teachers/${id}/`, data),
};

// Dashboard endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats/'),
};

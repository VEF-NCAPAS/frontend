import api from '../config/axiosConfig';
const API_URL = import.meta.env.VITE_API_URL;

export const registerCandidate = async (data) => {
  const response = await api.post(
    `${API_URL}/auth/register/candidate`,
    data
  );

  return response.data;
};

export const registerRecruiter = async (data) => {
  const response = await api.post(
    `${API_URL}/auth/register/recruiter`,
    data
  );

  return response.data;
};

export const login = async (data) => {
  const response = await api.post(
    `${API_URL}/auth/login`,
    data
  );

  return response.data;
};

export const logout = ({ navigate, redirectTo = '/pages/login' } = {}) => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
  localStorage.removeItem('email');
  localStorage.removeItem('rememberSession');

  if (api.defaults && api.defaults.headers && api.defaults.headers.common) {
    delete api.defaults.headers.common.Authorization;
  }

  if (typeof navigate === 'function') {
    navigate(redirectTo);
  } else {
    window.location.href = redirectTo;
  }
};


import api from '../config/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL;

const extractPayload = (response) => {
  const payload = response?.data;

  if (payload && typeof payload === 'object') {
    if (payload.data !== undefined) return payload.data;
    if (payload.content !== undefined) return payload.content;
  }

  return payload;
};

export const changePassword = async (data) => {
  const token = localStorage.getItem('token');

  const response = await api.patch(
    `${API_URL}/user/change-password`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const getGlobalDiversityStats = async () => {
  const response = await api.get(
    `${API_URL}/user/diversity`
  );

  return extractPayload(response);
};

export const getUserGrowthReport = async (params = {}) => {
  const response = await api.get(
    `${API_URL}/user/reports/users-growth`,
    { params }
  );

  return extractPayload(response);
};
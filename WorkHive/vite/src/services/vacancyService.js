
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

export const getVacancies = async (params) => {
  const response = await api.get(
    `${API_URL}/vacancy`,
    {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const getVacancyById = async (id) => {
  const response = await api.get(`${API_URL}/vacancy/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const createVacancy = async (vacancyData) => {
  const response = await api.post(
    `${API_URL}/vacancy`,
    vacancyData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.data;
};

export const updateVacancy = async (id, vacancyData) => {
  const response = await api.put(
    `${API_URL}/vacancy/${id}`,
    vacancyData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.data;
};

export const deleteVacancy = async (id) => {
  const response = await api.delete(
    `${API_URL}/vacancy/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.data;
};

export const getVacancyVolumeReport = async (params = {}) => {
  const response = await api.get(`${API_URL}/vacancy/reports`, { params });
  return extractPayload(response);
};

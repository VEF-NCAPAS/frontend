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

export const createApplication = async (applicationData) => {
  const response = await api.post(
    `${API_URL}/application`,
    applicationData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const getApplications = async (params = {}) => {
  const response = await api.get(
    `${API_URL}/application`,
    {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await api.get(
    `${API_URL}/application/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const withdrawApplication = async (id) => {
  const response = await api.patch(
    `${API_URL}/application/${id}/withdraw`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const getApplicationsByVacancy = async (vacancyId, params = {}) => {
  const response = await api.get(
    `${API_URL}/application/vacancy/${vacancyId}`,
    {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const reviewApplication = async (id) => {
  const response = await api.patch(
    `${API_URL}/application/${id}/review`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const updateApplicationStatus = async (id, statusData) => {
  const response = await api.patch(
    `${API_URL}/application/${id}/status`,
    statusData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const getApplicationVolumeReport = async (params = {}) => {
  const response = await api.get(`${API_URL}/application/reports`, { params });
  return extractPayload(response);
};

import api from '../config/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL;

export const createCv = async (data) => {
  const response = await api.post(
    `${API_URL}/cv`,
    data
  );

  return response.data;
};

export const getCvByCandidate = async (id) => {
  const response = await api.get(
    `${API_URL}/cv/me`
  );

  return response.data;
};
export const getCvById = async (id) => {
  const response = await api.get(
    `${API_URL}/cv/${id}`
  );

  return response.data;
};

export const updateCv = async (id, data) => {
  const response = await api.put(
    `${API_URL}/cv/${id}`,
    data
  );

  return response.data;
};
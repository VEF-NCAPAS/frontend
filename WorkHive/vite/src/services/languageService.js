import api from '../config/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllLanguages = async () => {
  const response = await api.get(
    `${API_URL}/languages`
  );

  return response.data;
};

export const getLanguageById = async (id) => {
  const response = await api.get(
    `${API_URL}/languages/${id}`
  );

  return response.data;
};
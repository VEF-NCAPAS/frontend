import api from '../config/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllRequirements = async () => {
  const response = await api.get(
    `${API_URL}/requirement`
  );

  return response.data;
};

export const getRequirementById = async (id) => {
  const response = await api.get(
    `${API_URL}/requirement/${id}`
  );

  return response.data;
};
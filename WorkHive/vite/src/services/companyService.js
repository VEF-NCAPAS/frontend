import api from '../config/axiosConfig';
const API_URL = import.meta.env.VITE_API_URL;

export const getCompanies = async () => {
  const response = await api.get(
    `${API_URL}/company`
  );

  return response.data;
};
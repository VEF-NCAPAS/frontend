import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export const getCompanies = async () => {
  const response = await axios.get(
    `${API_URL}/company`
  );

  return response.data;
};
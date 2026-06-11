
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getVacancies = async (params) => {
  const response = await axios.get(
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
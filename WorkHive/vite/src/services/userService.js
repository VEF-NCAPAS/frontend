import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const changePassword = async (data) => {
  const token = localStorage.getItem('token');

  const response = await axios.patch(
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
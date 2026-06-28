import api from '../config/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL;

export const createTechnicalTest = async (technicalTestData) => {
  const response = await api.post(
    `${API_URL}/technical-tests`,
    technicalTestData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const updateTechnicalTest = async (id, technicalTestData) => {
  const response = await api.put(
    `${API_URL}/technical-tests/${id}`,
    technicalTestData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

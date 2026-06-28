import api from '../config/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL;

export const createInterview = async (interviewData) => {
  const response = await api.post(
    `${API_URL}/interviews`,
    interviewData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const updateInterview = async (id, interviewData) => {
  const response = await api.put(
    `${API_URL}/interviews/${id}`,
    interviewData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

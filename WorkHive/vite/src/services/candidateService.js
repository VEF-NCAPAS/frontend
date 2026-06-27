import api from '../config/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL;

export const getCandidatesByVacancy = async (vacancyId, params = {}) => {
  const response = await api.get(
    `${API_URL}/candidates/vacancy/${vacancyId}`,
    {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};
import api from '../config/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllSkills = async () => {
  const response = await api.get(
    `${API_URL}/skill`
  );

  return response.data;
};

export const getSkillById = async (id) => {
  const response = await api.get(
    `${API_URL}/skill/${id}`
  );

  return response.data;
};
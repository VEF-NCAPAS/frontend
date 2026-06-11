import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const registerCandidate = async (data) => {
  const response = await axios.post(
    `${API_URL}/auth/register/candidate`,
    data
  );

  return response.data;
};

export const registerRecruiter = async (data) => {
  const response = await axios.post(
    `${API_URL}/auth/register/recruiter`,
    data
  );

  return response.data;
};

export const login = async (data) => {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    data
  );

  return response.data;
};

export const changePassword = async (data) => {
  const token = localStorage.getItem('token');

  const response = await axios.patch(
    `${API_URL}/auth/change-password`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};
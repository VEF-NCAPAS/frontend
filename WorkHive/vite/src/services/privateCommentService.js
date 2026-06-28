import api from '../config/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL;

export const createPrivateComment = async (commentData) => {
  const response = await api.post(
    `${API_URL}/privateComment`,
    commentData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const getPrivateCommentById = async (id) => {
  const response = await api.get(
    `${API_URL}/privateComment/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const getPrivateCommentsByApplication = async (applicationId, params = {}) => {
  const response = await api.get(
    `${API_URL}/privateComment/application/${applicationId}`,
    {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const updatePrivateComment = async (id, commentData) => {
  const response = await api.patch(
    `${API_URL}/privateComment/${id}`,
    commentData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

export const deletePrivateComment = async (id) => {
  const response = await api.delete(
    `${API_URL}/privateComment/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

  return response.data;
};

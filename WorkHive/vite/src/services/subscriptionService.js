import api from '../config/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL;

const extractPayload = (response) => {
  const payload = response?.data;

  if (payload && typeof payload === 'object') {
    if (payload.data !== undefined) return payload.data;
    if (payload.content !== undefined) return payload.content;
  }

  return payload;
};

export const createCheckoutSession = async () => {
  const token = localStorage.getItem('token');

  const response = await api.post(
    `${API_URL}/subscriptions/checkout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return extractPayload(response);
};
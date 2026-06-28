import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isApiRequest = error.config.url.includes('/api');
    
    if (error.response?.status === 401 && isApiRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/pages/login";
    }

    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      window.location.href = "/pages/login";
    }

    return Promise.reject(error);
  }
);

export default api;
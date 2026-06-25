import api from '../config/axiosConfig';
const API_URL = import.meta.env.VITE_API_URL;

export const getCompanies = async () => {
  const response = await api.get(
    `${API_URL}/company`
  );

  return response.data;
};

export const getCompanyById = async (companyId) => {
  const response = await api.get(`${API_URL}/company/${companyId}`);
  return response.data;
};

export const getMyCompany = async () => {
  const response = await api.get(`${API_URL}/company/my-company`);
  return response.data;
};

export const updateCompany = async (companyId, companyData) => {
  const response = await api.put(
    `${API_URL}/company/${companyId}`,
    companyData
  );

  return response.data;
};

export const getCompanyGenderDiversity = async (companyId) => {
  const response = await api.get(
    `${API_URL}/company/${companyId}/diversity`
  );

  return response.data;
};

export const createCompany = async (companyData) => {
  const response = await api.post(
    `${API_URL}/company`,
    companyData
  );

  return response.data;
};

export const deleteCompany = async (companyId) => {
  const response = await api.delete(
    `${API_URL}/company/${companyId}`
  );

  return response.data;
};

export const getCompaniesAdmin = async (
  page = 0,
  size = 10,
  sortBy = 'name',
  sortOrder = 'asc'
) => {
  const response = await api.get(`${API_URL}/company/admin`, {
    params: {
      page,
      size,
      sortBy,
      sortOrder
    }
  });

  return response.data;
};
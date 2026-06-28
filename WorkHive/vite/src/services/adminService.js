import api from '../config/axiosConfig';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

const extractPayload = (response) => {
  const payload = response?.data;

  if (payload && typeof payload === 'object') {
    if (payload.data !== undefined) return payload.data;
    if (payload.content !== undefined) return payload.content;
  }

  return payload;
};

const normalizeGender = (value) => {
  if (!value) return '';

  const normalizedValue = String(value).toUpperCase();

  switch (normalizedValue) {
    case 'MALE':
    case 'MASCULINO':
    case 'M':
      return 'Masculino';
    case 'FEMALE':
    case 'FEMENINO':
    case 'F':
      return 'Femenino';
    case 'OTHER':
    case 'OTRO':
    case 'O':
      return 'Otro';
    default:
      return value;
  }
};

const normalizeRole = (value) => {
  if (!value) return '';

  const normalizedValue = String(value).toUpperCase();

  switch (normalizedValue) {
    case 'CANDIDATE':
    case 'CANDIDATO':
      return 'Candidato';
    case 'RECRUITER':
    case 'RECLUTADOR':
      return 'Reclutador';
    case 'ADMINISTRATOR':
    case 'ADMIN':
    case 'ADMINISTRADOR':
      return 'Administrador';
    default:
      return value;
  }
};

const toBackendGender = (value) => {
  if (!value) return '';

  const normalizedValue = String(value).toLowerCase();

  switch (normalizedValue) {
    case 'masculino':
    case 'male':
    case 'm':
      return 'MALE';
    case 'femenino':
    case 'female':
    case 'f':
      return 'FEMALE';
    case 'otro':
    case 'other':
    case 'o':
      return 'OTHER';
    default:
      return value;
  }
};

const normalizeUser = (user = {}) => ({
  id: user.id ?? user.userId,
  name: user.name ?? '',
  email: user.email ?? '',
  gender: normalizeGender(user.gender),
  role: normalizeRole(user.role)
});

const buildUserPayload = (userData = {}) => ({
  name: userData.name,
  email: userData.email,
  gender: toBackendGender(userData.gender),
  ...(userData.password ? { password: userData.password } : {})
});

const buildRecruiterPayload = (userData = {}) => ({
  ...buildUserPayload(userData),
  ...(userData.company ? { company: { companyId: userData.company } } : {})
});

export const adminService = {
  // Get all companies from PostgreSQL database
  getCompanies: async () => {
    const response = await fetch(`${API_URL}/company`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener las empresas de la base de datos');
    const res = await response.json();
    return res.data.map((c) => ({
      id: c.id,
      name: c.companyName,
      location: c.location || 'No especificada',
      sector: c.sector || ''
    }));
  },

  // Create a new company
  createCompany: async (companyData) => {
    const response = await fetch(`${API_URL}/company`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: companyData.name,
        location: companyData.location || 'No especificada',
        sector: companyData.sector || ''
      })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al crear la empresa en el servidor');
    }
    const res = await response.json();
    return {
      id: res.data.id,
      name: res.data.companyName,
      location: res.data.location,
      sector: res.data.sector
    };
  },

  // Update an existing company by ID
  updateCompany: async (id, companyData) => {
    const response = await fetch(`${API_URL}/company/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        name: companyData.name,
        location: companyData.location || 'No especificada',
        sector: companyData.sector || ''
      })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al actualizar la empresa en el servidor');
    }
    const res = await response.json();
    return {
      id: res.data.id,
      name: res.data.companyName,
      location: res.data.location,
      sector: res.data.sector
    };
  },

  // Delete a company by ID
  deleteCompany: async (id) => {
    const response = await fetch(`${API_URL}/company/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al eliminar la empresa en el servidor');
    }
    return true;
  },

  getUsers: async () => {
    let page = 0;
    let last = false;
    let allUsers = [];

    while (!last) {
      const response = await api.get(`${API_URL}/user/all`, {
        params: {
          page,
          size: 50,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }
      });

      const payload = extractPayload(response);

      allUsers.push(...payload.content);

      last = payload.last;
      page++;
    }

    return allUsers.map(normalizeUser);
  },

  getUserById: async (id) => {
    const response = await api.get(`${API_URL}/user/${id}`);
    return normalizeUser(extractPayload(response));
  },

  createUser: async (userData) => {
      try {
        const response = await api.post(
          `${API_URL}/user/register/candidate`,
          buildUserPayload(userData)
        );

        return normalizeUser(extractPayload(response));
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
          error.message ||
          'Error al crear el candidato'
        );
      }
    },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(
        `${API_URL}/user/admin/${id}`,
        buildUserPayload(userData)
      );

      return normalizeUser(extractPayload(response));
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Error al actualizar el usuario'
      );
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`${API_URL}/user/delete/${id}`);
      return extractPayload(response) ?? true;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Error al eliminar el usuario'
      );
    }
  },

  getCandidates: async () => {
    const users = await adminService.getUsers();
    return users.filter((user) => normalizeRole(user.role) === 'Candidato');
  },

  getRecruiters: async () => {
    const users = await adminService.getUsers();
    return users.filter((user) => normalizeRole(user.role) === 'Reclutador');
  },

  createCandidate: async (userData) => adminService.createUser(userData),

  createRecruiter: async (userData) => {
    try {
      const response = await api.post(
        `${API_URL}/user/register/recruiter`,
        buildRecruiterPayload(userData)
      );

      return normalizeUser(extractPayload(response));
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Error al crear el reclutador'
      );
    }
  },

  updateCandidate: async (id, userData) => adminService.updateUser(id, userData),

  updateRecruiter: async (id, userData) => adminService.updateUser(id, userData),

  deleteCandidate: async (id) => adminService.deleteUser(id),

  deleteRecruiter: async (id) => adminService.deleteUser(id)
};

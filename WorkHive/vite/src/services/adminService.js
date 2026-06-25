const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
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
  }
};

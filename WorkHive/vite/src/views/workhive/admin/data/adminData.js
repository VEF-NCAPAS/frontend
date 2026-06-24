export const userFields = [
  { name: 'name', label: 'Nombre completo' },
  { name: 'email', label: 'Correo electrónico', type: 'email' },
  { name: 'role', label: 'Tipo de usuario', options: ['Candidato', 'Reclutador'] },
  { name: 'status', label: 'Estado', options: ['Activo', 'Pendiente', 'Suspendido'] },
  { name: 'password', label: 'Contraseña', type: 'password', required: false }
];

export const userColumns = [
  { name: 'name', label: 'Nombre' },
  { name: 'email', label: 'Correo' },
  { name: 'role', label: 'Rol' },
  { name: 'status', label: 'Estado' }
];

export const users = [
  { id: 1, name: 'Ana Martínez', email: 'ana@correo.com', role: 'Candidato', status: 'Activo', password: '' },
  { id: 2, name: 'Carlos Hernández', email: 'carlos@talentohub.com', role: 'Reclutador', status: 'Activo', password: '' },
  { id: 3, name: 'Sofía López', email: 'sofia@correo.com', role: 'Candidato', status: 'Pendiente', password: '' }
];

export const companyFields = [
  { name: 'name', label: 'Nombre de la empresa' },
  { name: 'location', label: 'Ubicación' },
  { name: 'sector', label: 'Sector' }
];

export const companyColumns = [
  { name: 'name', label: 'Empresa' },
  { name: 'location', label: 'Ubicación' },
  { name: 'sector', label: 'Sector' }
];

export const companies = [
  {
    id: 1,
    name: 'Talento Hub',
    sector: 'Recursos humanos',
    contact: 'Carlos Hernández',
    email: 'contacto@talentohub.com',
    status: 'Activo'
  },
  { id: 2, name: 'Nova Tech', sector: 'Tecnología', contact: 'María Rivera', email: 'empleos@novatech.com', status: 'Activo' },
  { id: 3, name: 'Grupo Horizonte', sector: 'Servicios', contact: 'José Aguilar', email: 'rrhh@horizonte.com', status: 'Pendiente' }
];

export const candidateFields = [
  { name: 'name', label: 'Nombre completo' },
  { name: 'email', label: 'Correo electrónico', type: 'email' },
  { name: 'profession', label: 'Profesión o especialidad' },
  { name: 'gender', label: 'Género', options: ['Femenino', 'Masculino', 'Otro'] },
  { name: 'status', label: 'Estado', options: ['Activo', 'Inactivo', 'Suspendido'] }
];

export const candidateColumns = [
  { name: 'name', label: 'Candidato' },
  { name: 'email', label: 'Correo' },
  { name: 'profession', label: 'Profesión' },
  { name: 'gender', label: 'Género' },
  { name: 'status', label: 'Estado' }
];

export const candidates = [
  { id: 1, name: 'Ana Martínez', email: 'ana@correo.com', profession: 'Diseñadora UX/UI', gender: 'Femenino', status: 'Activo' },
  { id: 2, name: 'Luis Ramírez', email: 'luis@correo.com', profession: 'Desarrollador frontend', gender: 'Masculino', status: 'Activo' },
  { id: 3, name: 'Sofía López', email: 'sofia@correo.com', profession: 'Analista de datos', gender: 'Femenino', status: 'Inactivo' }
];

export const jobFields = [
  { name: 'name', label: 'Título de la oferta' },
  { name: 'company', label: 'Empresa publicadora' },
  { name: 'location', label: 'Ubicación' },
  { name: 'modality', label: 'Modalidad', options: ['Presencial', 'Híbrido', 'Remoto'] },
  { name: 'published', label: 'Fecha de publicación', type: 'date' },
  { name: 'applicants', label: 'Postulantes', type: 'number' },
  { name: 'status', label: 'Estado', options: ['Activo', 'Pendiente', 'Suspendido'] }
];

export const jobColumns = [
  { name: 'name', label: 'Oferta' },
  { name: 'company', label: 'Empresa publicadora' },
  { name: 'location', label: 'Ubicación' },
  { name: 'modality', label: 'Modalidad' },
  { name: 'published', label: 'Publicada' },
  { name: 'applicants', label: 'Postulantes' },
  { name: 'status', label: 'Estado' }
];

export const jobs = [
  {
    id: 1,
    name: 'Desarrollador Frontend React',
    company: 'Nova Tech',
    location: 'San Salvador',
    modality: 'Híbrido',
    published: '2026-06-02',
    applicants: 28,
    status: 'Activo'
  },
  {
    id: 2,
    name: 'Especialista de reclutamiento',
    company: 'Talento Hub',
    location: 'Santa Tecla',
    modality: 'Presencial',
    published: '2026-05-28',
    applicants: 17,
    status: 'Activo'
  },
  {
    id: 3,
    name: 'Analista de datos junior',
    company: 'Grupo Horizonte',
    location: 'La Libertad',
    modality: 'Remoto',
    published: '2026-05-24',
    applicants: 34,
    status: 'Pendiente'
  }
];

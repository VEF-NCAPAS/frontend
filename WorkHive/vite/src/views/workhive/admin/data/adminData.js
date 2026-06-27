export const candidateFields = [
  { name: 'name', label: 'Nombre completo' },
  { name: 'email', label: 'Correo electrónico', type: 'email' },
  { name: 'gender', label: 'Género', options: ['Masculino', 'Femenino', 'Otro'] },
  { name: 'password', label: 'Contraseña', type: 'password' }
];

export const candidateColumns = [
  { name: 'name', label: 'Nombre' },
  { name: 'email', label: 'Correo' },
  { name: 'gender', label: 'Género' }
];

export const recruiterFields = [
  { name: 'name', label: 'Nombre completo' },
  { name: 'email', label: 'Correo electrónico', type: 'email' },
  { name: 'gender', label: 'Género', options: ['Masculino', 'Femenino', 'Otro'] },
  { name: 'password', label: 'Contraseña', type: 'password' },
  { name: 'company', label: 'Empresa', type: 'select' }
];

export const recruiterColumns = [
  { name: 'name', label: 'Nombre' },
  { name: 'email', label: 'Correo' },
  { name: 'gender', label: 'Género' }
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
  { name: 'companyName', label: 'Empresa' },
  { name: 'location', label: 'Ubicación' },
  { name: 'sector', label: 'Sector' }
];



export const candidates = [
  { id: 1, name: 'Ana Martínez', email: 'ana@correo.com', profession: 'Diseñadora UX/UI', gender: 'Femenino', status: 'Activo' },
  { id: 2, name: 'Luis Ramírez', email: 'luis@correo.com', profession: 'Desarrollador frontend', gender: 'Masculino', status: 'Activo' },
  { id: 3, name: 'Sofía López', email: 'sofia@correo.com', profession: 'Analista de datos', gender: 'Femenino', status: 'Inactivo' }
]

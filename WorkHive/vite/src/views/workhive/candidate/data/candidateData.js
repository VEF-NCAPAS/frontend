import { IconBell, IconBriefcase, IconMessageCircle } from '@tabler/icons-react';

export const jobs = [
  {
    title: 'Desarrollador Frontend React',
    company: 'Nexa Digital',
    location: 'San Salvador',
    type: 'Tiempo completo',
    salary: '$1,200 - $1,600',
    posted: 'Hace 2 horas',
    tags: ['React', 'JavaScript', 'Remoto']
  },
  {
    title: 'Disenador UX/UI',
    company: 'Impulso Studio',
    location: 'Santa Tecla',
    type: 'Hibrido',
    salary: '$950 - $1,250',
    posted: 'Hoy',
    tags: ['Figma', 'Research', 'Producto']
  },
  {
    title: 'Analista de datos junior',
    company: 'Grupo Centro',
    location: 'La Libertad',
    type: 'Tiempo completo',
    salary: '$900 - $1,100',
    posted: 'Ayer',
    tags: ['SQL', 'Power BI', 'Excel']
  }
];

export const applications = [
  { role: 'Desarrollador Frontend React', company: 'Nexa Digital', date: '24 mayo 2026', status: 'En revision', color: 'warning' },
  { role: 'Especialista de soporte', company: 'CloudDesk', date: '18 mayo 2026', status: 'Entrevista', color: 'primary' },
  { role: 'Disenador UX/UI', company: 'Impulso Studio', date: '09 mayo 2026', status: 'Finalizada', color: 'default' }
];

export const notices = [
  {
    title: 'Tu postulacion esta en revision',
    detail: 'Nexa Digital reviso tu perfil para Desarrollador Frontend React.',
    time: 'Hace 20 minutos',
    unread: true,
    icon: IconBriefcase
  },
  {
    title: 'Nueva oferta recomendada',
    detail: 'Analista de datos junior coincide con tus preferencias de busqueda.',
    time: 'Hace 3 horas',
    unread: true,
    icon: IconBell
  },
  {
    title: 'Invitacion a entrevista',
    detail: 'CloudDesk te invita a confirmar tu horario de entrevista.',
    time: 'Ayer',
    unread: false,
    icon: IconMessageCircle
  }
];

export const buttonSX = { textTransform: 'none', whiteSpace: 'nowrap' };

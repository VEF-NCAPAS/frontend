import { IconBell, IconBriefcase, IconMessageCircle } from '@tabler/icons-react';

export const applications = [
  {
    id: 'postulacion-frontend-nexa',
    jobId: 'frontend-react-nexa',
    role: 'Desarrollador Frontend React',
    company: 'Nexa Digital',
    date: '24 mayo 2026',
    status: 'En revisión',
    color: 'warning',
    nextStep: 'El equipo de reclutamiento está revisando tu perfil y CV.',
    timeline: [
      { title: 'Postulación enviada', date: '24 mayo 2026', completed: true },
      { title: 'Revisión de perfil', date: 'En proceso', completed: true },
      { title: 'Entrevista técnica', date: 'Pendiente', completed: false },
      { title: 'Decisión final', date: 'Pendiente', completed: false }
    ]
  },
  {
    id: 'postulacion-soporte-clouddesk',
    role: 'Especialista de soporte',
    company: 'CloudDesk',
    date: '18 mayo 2026',
    status: 'Entrevista',
    color: 'primary',
    location: 'San Salvador',
    type: 'Tiempo completo',
    salary: '$850 - $1,050',
    nextStep: 'Entrevista virtual programada para el 15 junio 2026 a las 10:00 a. m.',
    timeline: [
      { title: 'Postulación enviada', date: '18 mayo 2026', completed: true },
      { title: 'Revisión de perfil', date: '22 mayo 2026', completed: true },
      { title: 'Entrevista con reclutamiento', date: '15 junio 2026', completed: true },
      { title: 'Decisión final', date: 'Pendiente', completed: false }
    ]
  },
  {
    id: 'postulacion-ux-impulso',
    jobId: 'ux-ui-impulso',
    role: 'Disenador UX/UI',
    company: 'Impulso Studio',
    date: '09 mayo 2026',
    status: 'Finalizada',
    color: 'default',
    nextStep: 'El proceso finalizó. Puedes continuar explorando nuevas oportunidades.',
    timeline: [
      { title: 'Postulación enviada', date: '09 mayo 2026', completed: true },
      { title: 'Revisión de portafolio', date: '12 mayo 2026', completed: true },
      { title: 'Proceso finalizado', date: '20 mayo 2026', completed: true }
    ]
  }
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

export const pastelBackButtonSX = {
  ...buttonSX,
  bgcolor: '#cceeff',
  boxShadow: 'none',
  color: '#17698e',
  '&:hover': { bgcolor: '#b8e5fa', boxShadow: 'none' }
};

export const applicationStatusSX = {
  'En revisión': { bgcolor: '#fff0d6', borderColor: '#f5a623', color: '#b76700', fontWeight: 600 },
  Entrevista: { bgcolor: '#e1f0ff', borderColor: '#64a8e8', color: '#246da8', fontWeight: 600 },
  Finalizada: { bgcolor: '#edf0f4', borderColor: '#9ba5b1', color: '#4f5965', fontWeight: 600 }
};

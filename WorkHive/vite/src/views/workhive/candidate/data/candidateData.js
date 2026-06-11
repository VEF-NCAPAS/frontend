import { IconBell, IconBriefcase, IconMessageCircle } from '@tabler/icons-react';

export const jobs = [
  {
    id: 'frontend-react-nexa',
    title: 'Desarrollador Frontend React',
    company: 'Nexa Digital',
    location: 'San Salvador',
    type: 'Tiempo completo',
    modality: 'Remoto',
    salary: '$1,200 - $1,600',
    posted: 'Hace 2 horas',
    tags: ['React', 'JavaScript', 'Remoto'],
    description:
      'Buscamos una persona apasionada por crear experiencias web claras, rápidas y accesibles para productos digitales utilizados por miles de personas.',
    responsibilities: [
      'Desarrollar interfaces responsivas con React y Material UI.',
      'Convertir diseños de producto en componentes reutilizables.',
      'Colaborar con diseño, producto y backend durante cada entrega.',
      'Participar en revisiones de código y mejoras de rendimiento.'
    ],
    requirements: [
      'Experiencia de al menos 2 años desarrollando aplicaciones con React.',
      'Dominio de JavaScript, HTML, CSS y consumo de APIs REST.',
      'Conocimiento de Git y metodologías ágiles.',
      'Capacidad de comunicación y trabajo en equipo.'
    ],
    benefits: ['Trabajo remoto flexible', 'Seguro médico', 'Presupuesto para formación', 'Equipo de trabajo proporcionado']
  },
  {
    id: 'ux-ui-impulso',
    title: 'Disenador UX/UI',
    company: 'Impulso Studio',
    location: 'Santa Tecla',
    type: 'Hibrido',
    modality: 'Híbrido',
    salary: '$950 - $1,250',
    posted: 'Hoy',
    tags: ['Figma', 'Research', 'Producto'],
    description:
      'Únete a nuestro equipo de producto para investigar necesidades reales y diseñar experiencias digitales sencillas, inclusivas y memorables.',
    responsibilities: [
      'Diseñar flujos, wireframes y prototipos de alta fidelidad.',
      'Realizar entrevistas y pruebas de usabilidad.',
      'Mantener y ampliar el sistema de diseño.',
      'Presentar decisiones de diseño a clientes y equipo interno.'
    ],
    requirements: [
      'Portafolio de proyectos UX/UI.',
      'Dominio de Figma y prototipado.',
      'Conocimiento de investigación de usuarios.',
      'Buena comunicación visual y escrita.'
    ],
    benefits: ['Horario flexible', 'Modalidad híbrida', 'Capacitaciones', 'Días libres adicionales']
  },
  {
    id: 'datos-junior-grupo-centro',
    title: 'Analista de datos junior',
    company: 'Grupo Centro',
    location: 'La Libertad',
    type: 'Tiempo completo',
    modality: 'Presencial',
    salary: '$900 - $1,100',
    posted: 'Ayer',
    tags: ['SQL', 'Power BI', 'Excel'],
    description:
      'Buscamos una persona analítica que transforme datos operativos en reportes claros para apoyar las decisiones del negocio.',
    responsibilities: [
      'Preparar reportes y tableros en Power BI.',
      'Consultar y depurar información usando SQL.',
      'Analizar tendencias y presentar hallazgos.',
      'Apoyar la mejora de calidad de los datos.'
    ],
    requirements: [
      'Estudios en informática, estadística, economía o carreras relacionadas.',
      'Conocimiento de SQL, Excel y Power BI.',
      'Pensamiento analítico y atención al detalle.',
      'Deseable experiencia con Python.'
    ],
    benefits: ['Seguro de vida', 'Plan de carrera', 'Capacitación técnica', 'Bonificación por desempeño']
  }
];

export const applications = [
  {
    id: 'postulacion-frontend-nexa',
    jobId: 'frontend-react-nexa',
    role: 'Desarrollador Frontend React',
    company: 'Nexa Digital',
    date: '24 mayo 2026',
    status: 'En revision',
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

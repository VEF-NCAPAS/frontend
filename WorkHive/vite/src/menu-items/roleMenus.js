// assets
import {
  IconBell,
  IconBriefcase,
  IconBuilding,
  IconChartBar,
  IconClipboardList,
  IconFileText,
  IconListDetails,
  IconSearch,
  IconSettings,
  IconSquarePlus,
  IconUserCheck,
  IconUserCircle,
  IconUsers
} from '@tabler/icons-react';

// ==============================|| WORKHIVE ROLE MENU ITEMS ||============================== //

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  CANDIDATE: 'CANDIDATE',
  RECRUITER: 'RECRUITER'
};

const normalizeRole = (role) => {
  const normalizedRole = String(role || '')
    .trim()
    .toUpperCase();

  if (['ADMIN', 'ADMINISTRADOR', 'ADMINISTRATOR'].includes(normalizedRole)) return USER_ROLES.ADMIN;
  if (['CANDIDATE', 'CANDIDATO'].includes(normalizedRole)) return USER_ROLES.CANDIDATE;
  if (['RECRUITER', 'RECLUTADOR', 'EMPRESA', 'COMPANY'].includes(normalizedRole)) return USER_ROLES.RECRUITER;

  return USER_ROLES.CANDIDATE;
};

export const getCurrentUserRole = () => {
  const storedRole = localStorage.getItem('role');

  // Mock temporal para probar el sidebar mientras el backend no entregue rol.
  // Cambia VITE_MOCK_ROLE en .env o localStorage.role por: ADMIN, CANDIDATE o RECRUITER.
  const mockRole = import.meta.env.VITE_MOCK_ROLE || USER_ROLES.CANDIDATE;

  return normalizeRole(storedRole || mockRole);
};

const workHiveMenus = {
  [USER_ROLES.ADMIN]: {
    id: 'workhive-admin',
    title: 'WorkHive',
    type: 'group',
    children: [
      {
        id: 'admin-users',
        title: 'Usuarios',
        type: 'item',
        url: '/usuarios',
        icon: IconUsers,
        breadcrumbs: false
      },
      {
        id: 'admin-companies',
        title: 'Empresas',
        type: 'item',
        url: '/empresas',
        icon: IconBuilding,
        breadcrumbs: false
      },
      {
        id: 'admin-jobs',
        title: 'Ofertas de empleo',
        type: 'item',
        url: '/ofertas-empleo',
        icon: IconBriefcase,
        breadcrumbs: false
      },
      {
        id: 'admin-candidates',
        title: 'Candidatos',
        type: 'item',
        url: '/candidatos',
        icon: IconUserCheck,
        breadcrumbs: false
      },
      {
        id: 'admin-reports',
        title: 'Reportes / Estadisticas',
        type: 'item',
        url: '/reportes-estadisticas',
        icon: IconChartBar,
        breadcrumbs: false
      },
      {
        id: 'admin-settings',
        title: 'Configuracion',
        type: 'item',
        url: '/configuracion',
        icon: IconSettings,
        breadcrumbs: false
      }
    ]
  },
  [USER_ROLES.CANDIDATE]: {
    id: 'workhive-candidate',
    title: 'WorkHive',
    type: 'group',
    children: [
      {
        id: 'candidate-search-jobs',
        title: 'Buscar empleos',
        type: 'item',
        url: '/',
        icon: IconSearch,
        breadcrumbs: false
      },
      {
        id: 'candidate-applications',
        title: 'Mis postulaciones',
        type: 'item',
        url: '/mis-postulaciones',
        icon: IconClipboardList,
        breadcrumbs: false
      },
      {
        id: 'candidate-profile',
        title: 'Mi perfil',
        type: 'item',
        url: '/mi-perfil',
        icon: IconUserCircle,
        breadcrumbs: false
      },
      {
        id: 'candidate-cv',
        title: 'CV / Hoja de vida',
        type: 'item',
        url: '/cv-hoja-de-vida',
        icon: IconFileText,
        breadcrumbs: false
      },
      {
        id: 'candidate-notifications',
        title: 'Notificaciones',
        type: 'item',
        url: '/notificaciones',
        icon: IconBell,
        breadcrumbs: false
      }
    ]
  },
  [USER_ROLES.RECRUITER]: {
    id: 'workhive-recruiter',
    title: 'WorkHive',
    type: 'group',
    children: [
      {
        id: 'recruiter-publish-job',
        title: 'Publicar oferta',
        type: 'item',
        url: '/publicar-oferta',
        icon: IconSquarePlus,
        breadcrumbs: false
      },
      {
        id: 'recruiter-jobs',
        title: 'Mis ofertas',
        type: 'item',
        url: '/mis-ofertas',
        icon: IconListDetails,
        breadcrumbs: false
      },
      {
        id: 'recruiter-applicants',
        title: 'Postulantes',
        type: 'item',
        url: '/postulantes',
        icon: IconUsers,
        breadcrumbs: false
      },
      {
        id: 'recruiter-company-profile',
        title: 'Perfil de empresa',
        type: 'item',
        url: '/perfil-empresa',
        icon: IconBuilding,
        breadcrumbs: false
      },
      {
        id: 'recruiter-statistics',
        title: 'Estadisticas',
        type: 'item',
        url: '/estadisticas',
        icon: IconChartBar,
        breadcrumbs: false
      }
    ]
  }
};

export const getMenuItemsByRole = (role) => ({
  items: [workHiveMenus[normalizeRole(role)] || workHiveMenus[USER_ROLES.CANDIDATE]]
});

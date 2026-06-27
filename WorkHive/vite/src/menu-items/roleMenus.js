// assets
import {
  IconBriefcase,
  IconBuilding,
  IconChartBar,
  IconClipboardList,
  IconFileText,
  IconListDetails,
  IconSearch,
  IconSquarePlus,
  IconUserCheck,
  IconUserCircle,
  IconUsers,
  IconRosette
} from '@tabler/icons-react';

// ==============================|| WORKHIVE ROLE MENU ITEMS ||============================== //

export const USER_ROLES = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  CANDIDATE: 'CANDIDATE',
  RECRUITER: 'RECRUITER'
};

const normalizeRole = (role) => {
  const normalizedRole = String(role || '')
    .trim()
    .toUpperCase();

  if (['ADMIN', 'ADMINISTRADOR', 'ADMINISTRATOR'].includes(normalizedRole)) return USER_ROLES.ADMINISTRATOR;
  if (['CANDIDATE', 'CANDIDATO'].includes(normalizedRole)) return USER_ROLES.CANDIDATE;
  if (['RECRUITER', 'RECLUTADOR', 'EMPRESA', 'COMPANY'].includes(normalizedRole)) return USER_ROLES.RECRUITER;

  return USER_ROLES.CANDIDATE;
};

export const getRoleByPathname = (pathname = '') => {
  const normalizedPath = String(pathname).toLowerCase();

  if (normalizedPath === '/admin' || normalizedPath.startsWith('/admin/')) return USER_ROLES.ADMINISTRATOR;
  if (normalizedPath === '/candidato' || normalizedPath.startsWith('/candidato/')) return USER_ROLES.CANDIDATE;
  if (normalizedPath === '/reclutador' || normalizedPath.startsWith('/reclutador/')) return USER_ROLES.RECRUITER;

  return null;
};

export const getCurrentUserRole = (pathname = window.location.pathname) => {
  const routeRole = getRoleByPathname(pathname);
  if (routeRole) return routeRole;

  const storedRole = localStorage.getItem('role');

  const mockRole = import.meta.env.VITE_MOCK_ROLE || USER_ROLES.CANDIDATE;

  return normalizeRole(storedRole || mockRole);
};

const workHiveMenus = {
  [USER_ROLES.ADMINISTRATOR]: {
    id: 'workhive-admin',
    title: 'WorkHive',
    type: 'group',
    children: [
      {
        id: 'admin-users',
        title: 'Usuarios',
        type: 'item',
        url: '/admin/usuarios',
        icon: IconUsers,
        breadcrumbs: false
      },
      {
        id: 'admin-companies',
        title: 'Empresas',
        type: 'item',
        url: '/admin/empresas',
        icon: IconBuilding,
        breadcrumbs: false
      },
      {
        id: 'admin-jobs',
        title: 'Ofertas de empleo',
        type: 'item',
        url: '/admin/ofertas-empleo',
        icon: IconBriefcase,
        breadcrumbs: false
      },
      {
        id: 'admin-candidates',
        title: 'Candidatos',
        type: 'item',
        url: '/admin/candidatos',
        icon: IconUserCheck,
        breadcrumbs: false
      },
      {
        id: 'admin-reports',
        title: 'Reportes / Estadisticas',
        type: 'item',
        url: '/admin/reportes-estadisticas',
        icon: IconChartBar,
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
        url: '/candidato/buscar-empleos',
        icon: IconSearch,
        breadcrumbs: false
      },
      {
        id: 'candidate-applications',
        title: 'Mis postulaciones',
        type: 'item',
        url: '/candidato/mis-postulaciones',
        icon: IconClipboardList,
        breadcrumbs: false
      },
      {
        id: 'candidate-profile',
        title: 'Mi perfil',
        type: 'item',
        url: '/candidato/mi-perfil',
        icon: IconUserCircle,
        breadcrumbs: false
      },
      {
        id: 'candidate-cv',
        title: 'CV / Hoja de vida',
        type: 'item',
        url: '/candidato/cv-hoja-de-vida',
        icon: IconFileText,
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
        url: '/reclutador/publicar-oferta',
        icon: IconSquarePlus,
        breadcrumbs: false
      },
      {
        id: 'recruiter-jobs',
        title: 'Mis ofertas',
        type: 'item',
        url: '/reclutador/mis-ofertas',
        icon: IconListDetails,
        breadcrumbs: false
      },
      {
        id: 'recruiter-applicants',
        title: 'Postulantes',
        type: 'item',
        url: '/reclutador/postulantes',
        icon: IconUsers,
        breadcrumbs: false
      },
      {
        id: 'recruiter-search-candidates',
        title: 'Buscar candidatos por Skill',
        type: 'item',
        url: '/reclutador/buscar-candidatos',
        icon: IconSearch,
        breadcrumbs: false
      },
      {
        id: 'recruiter-search-candidates-by-score',
        title: 'Buscar candidatos por Score',
        type: 'item',
        url: '/reclutador/buscar-candidatos-por-score',
        icon: IconRosette,
        breadcrumbs: false
      },
      {
        id: 'recruiter-company-profile',
        title: 'Perfil de empresa',
        type: 'item',
        url: '/reclutador/perfil-empresa',
        icon: IconBuilding,
        breadcrumbs: false
      },
      {
        id: 'recruiter-statistics',
        title: 'Estadisticas',
        type: 'item',
        url: '/reclutador/estadisticas',
        icon: IconChartBar,
        breadcrumbs: false
      }
    ]
  }
};

export const getMenuItemsByRole = (role) => ({
  items: [workHiveMenus[normalizeRole(role)] || workHiveMenus[USER_ROLES.CANDIDATE]]
});
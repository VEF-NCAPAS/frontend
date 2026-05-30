import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing kept for non-candidate role access
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

const RolePage = Loadable(lazy(() => import('views/workhive/RolePage')));
import {
  CandidateApplicationsPage,
  CandidateJobsPage,
  CandidateNotificationsPage,
  CandidateProfilePage,
  CandidateResumePage
} from 'views/workhive/candidate';

const workHiveRoutes = [
  { path: 'usuarios', title: 'Usuarios', description: 'Gestion de usuarios registrados en WorkHive.' },
  { path: 'empresas', title: 'Empresas', description: 'Administracion de empresas y perfiles asociados.' },
  { path: 'ofertas-empleo', title: 'Ofertas de empleo', description: 'Control y revision de ofertas publicadas.' },
  { path: 'candidatos', title: 'Candidatos', description: 'Consulta de candidatos disponibles en la plataforma.' },
  { path: 'reportes-estadisticas', title: 'Reportes / Estadisticas', description: 'Resumen de indicadores y reportes del sistema.' },
  { path: 'configuracion', title: 'Configuracion', description: 'Ajustes generales de WorkHive.' },
  { path: 'publicar-oferta', title: 'Publicar oferta', description: 'Crea una nueva oferta de empleo para candidatos.' },
  { path: 'mis-ofertas', title: 'Mis ofertas', description: 'Gestion de ofertas publicadas por la empresa.' },
  { path: 'postulantes', title: 'Postulantes', description: 'Revision de candidatos que aplicaron a tus ofertas.' },
  { path: 'perfil-empresa', title: 'Perfil de empresa', description: 'Datos publicos y administrativos de la empresa.' },
  { path: 'estadisticas', title: 'Estadisticas', description: 'Indicadores de ofertas, postulaciones y rendimiento.' }
];

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <CandidateJobsPage />
    },
    { path: 'buscar-empleos', element: <CandidateJobsPage /> },
    { path: 'mis-postulaciones', element: <CandidateApplicationsPage /> },
    { path: 'mi-perfil', element: <CandidateProfilePage /> },
    { path: 'cv-hoja-de-vida', element: <CandidateResumePage /> },
    { path: 'notificaciones', element: <CandidateNotificationsPage /> },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    ...workHiveRoutes.map((route) => ({
      path: route.path,
      element: <RolePage title={route.title} description={route.description} />
    }))
  ]
};

export default MainRoutes;

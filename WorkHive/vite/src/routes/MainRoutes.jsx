import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';


const RolePage = Loadable(lazy(() => import('views/workhive/RolePage')));

// recruiter routing
const PublishJob = Loadable(lazy(() => import('views/workhive/recruiter/PublishJob')));
const MyJobs = Loadable(lazy(() => import('views/workhive/recruiter/MyJobs')));
const Applicants = Loadable(lazy(() => import('views/workhive/recruiter/Applicants')));
const CompanyProfile = Loadable(lazy(() => import('views/workhive/recruiter/CompanyProfile')));
const Statistics = Loadable(lazy(() => import('views/workhive/recruiter/Statistics')));
const SearchCandidates = Loadable(lazy(() => import('views/workhive/recruiter/SearchCandidates')));

const workHiveRoutes = [
  { path: 'usuarios', title: 'Usuarios', description: 'Gestion de usuarios registrados en WorkHive.' },
  { path: 'empresas', title: 'Empresas', description: 'Administracion de empresas y perfiles asociados.' },
  { path: 'ofertas-empleo', title: 'Ofertas de empleo', description: 'Control y revision de ofertas publicadas.' },
  { path: 'candidatos', title: 'Candidatos', description: 'Consulta de candidatos disponibles en la plataforma.' },
  { path: 'reportes-estadisticas', title: 'Reportes / Estadisticas', description: 'Resumen de indicadores y reportes del sistema.' },
  { path: 'configuracion', title: 'Configuracion', description: 'Ajustes generales de WorkHive.' },
  { path: 'buscar-empleos', title: 'Buscar empleos', description: 'Explora ofertas laborales disponibles en El Salvador.' },
  { path: 'mis-postulaciones', title: 'Mis postulaciones', description: 'Seguimiento de aplicaciones realizadas por el candidato.' },
  { path: 'mi-perfil', title: 'Mi perfil', description: 'Informacion personal y profesional del candidato.' },
  { path: 'cv-hoja-de-vida', title: 'CV / Hoja de vida', description: 'Gestion de curriculum y documentos profesionales.' },
  { path: 'notificaciones', title: 'Notificaciones', description: 'Avisos recientes sobre empleos, postulaciones y mensajes.' },
  { path: 'publicar-oferta', title: 'Publicar oferta', description: 'Crea una nueva oferta de empleo para candidatos.' },
  { path: 'mis-ofertas', title: 'Mis ofertas', description: 'Gestion de ofertas publicadas por la empresa.' },
  { path: 'postulantes', title: 'Postulantes', description: 'Revision de candidatos que aplicaron a tus ofertas.' },
  { path: 'perfil-empresa', title: 'Perfil de empresa', description: 'Datos publicos y administrativos de la empresa.' },
  { path: 'estadisticas', title: 'Estadisticas', description: 'Indicadores de ofertas, postulaciones y rendimiento.' },
  { path: 'buscar-candidatos', title: 'Buscar candidatos', description: 'Busqueda de candidatos por habilidades.' }
];

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    ...workHiveRoutes.map((route) => {
      let element = <RolePage title={route.title} description={route.description} />;
      
      if (route.path === 'publicar-oferta') element = <PublishJob />;
      else if (route.path === 'mis-ofertas') element = <MyJobs />;
      else if (route.path === 'postulantes') element = <Applicants />;
      else if (route.path === 'perfil-empresa') element = <CompanyProfile />;
      else if (route.path === 'estadisticas') element = <Statistics />;
      else if (route.path === 'buscar-candidatos') element = <SearchCandidates />;

      return {
        path: route.path,
        element: element
      };
    })
  ]
};

export default MainRoutes;

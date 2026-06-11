import MainLayout from 'layout/MainLayout';

import {
  RecruiterApplicantsPage,
  RecruiterCompanyProfilePage,
  RecruiterDashboardPage,
  RecruiterJobsPage,
  RecruiterPublishJobPage,
  RecruiterStatisticsPage,
  RecruiterSearchCandidatesPage
} from 'views/workhive/recruiter';

const RecruiterRoutes = {
  path: '/reclutador',
  element: <MainLayout />,
  children: [
    { index: true, element: <RecruiterDashboardPage /> },
    { path: 'publicar-oferta', element: <RecruiterPublishJobPage /> },
    { path: 'mis-ofertas', element: <RecruiterJobsPage /> },
    { path: 'postulantes', element: <RecruiterApplicantsPage /> },
    { path: 'perfil-empresa', element: <RecruiterCompanyProfilePage /> },
    { path: 'estadisticas', element: <RecruiterStatisticsPage /> },
    { path: 'buscar-candidatos', element: <RecruiterSearchCandidatesPage /> }
  ]
};

export default RecruiterRoutes;

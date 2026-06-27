import MainLayout from 'layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import {
  RecruiterApplicantsPage,
  RecruiterCompanyProfilePage,
  RecruiterDashboardPage,
  RecruiterJobsPage,
  RecruiterPublishJobPage,
  RecruiterStatisticsPage,
  RecruiterSearchCandidatesPage,
  RecruiterSearchCandidatesByScorePage
} from 'views/workhive/recruiter';

const RecruiterRoutes = {
  path: '/reclutador',
  element: (
    <ProtectedRoute allowedRoles={['RECRUITER']}>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <RecruiterDashboardPage /> },
    { path: 'publicar-oferta', element: <RecruiterPublishJobPage /> },
    { path: 'mis-ofertas', element: <RecruiterJobsPage /> },
    { path: 'postulantes', element: <RecruiterApplicantsPage /> },
    { path: 'perfil-empresa', element: <RecruiterCompanyProfilePage /> },
    { path: 'estadisticas', element: <RecruiterStatisticsPage /> },
    { path: 'buscar-candidatos', element: <RecruiterSearchCandidatesPage /> },
    { path: 'buscar-candidatos-por-score', element: <RecruiterSearchCandidatesByScorePage /> }

  ]
};

export default RecruiterRoutes;
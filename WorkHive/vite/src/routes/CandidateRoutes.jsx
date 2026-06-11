import MainLayout from 'layout/MainLayout';

import {
  CandidateAccountSettingsPage,
  CandidateApplicationsPage,
  CandidateChangePasswordPage,
  CandidateJobsPage,
  CandidateProfileEditPage,
  CandidateProfilePage,
  CandidateResumePage
} from 'views/workhive/candidate';
import ProtectedRoute from './ProtectedRoute';

const CandidateRoutes = {
  path: '/candidato',
  element: (
    <ProtectedRoute allowedRoles={['CANDIDATE']}>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <CandidateJobsPage /> },
    { path: 'buscar-empleos', element: <CandidateJobsPage /> },
    { path: 'mis-postulaciones', element: <CandidateApplicationsPage /> },
    { path: 'mi-perfil', element: <CandidateProfilePage /> },
    { path: 'mi-perfil/editar', element: <CandidateProfileEditPage /> },
    { path: 'cv-hoja-de-vida', element: <CandidateResumePage /> },
    { path: 'configuracion-cuenta', element: <CandidateAccountSettingsPage /> },
    { path: 'configuracion-cuenta/cambiar-contrasena', element: <CandidateChangePasswordPage /> }
  ]
};

export default CandidateRoutes;

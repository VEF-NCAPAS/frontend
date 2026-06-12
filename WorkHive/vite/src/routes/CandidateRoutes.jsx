import MainLayout from 'layout/MainLayout';

import {
  CandidateAccountSettingsPage,
  CandidateApplicationDetailPage,
  CandidateApplicationsPage,
  CandidateChangePasswordPage,
  CandidateJobsPage,
  CandidateJobDetailPage,
  CandidateProfileEditPage,
  CandidateProfilePage,
  CandidateResumePage
} from 'views/workhive/candidate';

const CandidateRoutes = {
  path: '/candidato',
  element: <MainLayout logoClickable={false} />,
  children: [
    { index: true, element: <CandidateJobsPage /> },
    { path: 'buscar-empleos', element: <CandidateJobsPage /> },
    { path: 'buscar-empleos/:jobId', element: <CandidateJobDetailPage /> },
    { path: 'mis-postulaciones', element: <CandidateApplicationsPage /> },
    { path: 'mis-postulaciones/:applicationId', element: <CandidateApplicationDetailPage /> },
    { path: 'mi-perfil', element: <CandidateProfilePage /> },
    { path: 'mi-perfil/editar', element: <CandidateProfileEditPage /> },
    { path: 'cv-hoja-de-vida', element: <CandidateResumePage /> },
    { path: 'configuracion-cuenta', element: <CandidateAccountSettingsPage /> },
    { path: 'configuracion-cuenta/cambiar-contrasena', element: <CandidateChangePasswordPage /> }
  ]
};

export default CandidateRoutes;

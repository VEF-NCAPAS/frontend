import MainLayout from 'layout/MainLayout';

import {
  AdminCandidatesPage,
  AdminCompaniesPage,
  AdminDashboardPage,
  AdminJobsPage,
  AdminReportsPage,
  AdminUsersPage
} from 'views/workhive/admin';

const AdminRoutes = {
  path: '/admin',
  element: <MainLayout logoClickable={false} showSearch={false} />,
  children: [
    { index: true, element: <AdminDashboardPage /> },
    { path: 'usuarios', element: <AdminUsersPage /> },
    { path: 'empresas', element: <AdminCompaniesPage /> },
    { path: 'ofertas-empleo', element: <AdminJobsPage /> },
    { path: 'candidatos', element: <AdminCandidatesPage /> },
    { path: 'reportes-estadisticas', element: <AdminReportsPage /> }
  ]
};

export default AdminRoutes;

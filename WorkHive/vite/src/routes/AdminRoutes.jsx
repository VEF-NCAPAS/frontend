import MainLayout from 'layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import {
  AdminCandidatesPage,
  AdminCompaniesPage,
  AdminDashboardPage,
  AdminRecruitersPage,
  AdminReportsPage,
} from 'views/workhive/admin';

const AdminRoutes = {
  path: '/admin',
  element: (
    <ProtectedRoute allowedRoles={['ADMINISTRATOR']} logoClickable={false} showSearch={false} >
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <AdminDashboardPage /> },
    { path: 'candidatos', element: <AdminCandidatesPage /> },
    { path: 'empresas', element: <AdminCompaniesPage /> },
    { path: 'reclutadores', element: <AdminRecruitersPage /> },
    { path: 'reportes-estadisticas', element: <AdminReportsPage /> }
  ]
};

export default AdminRoutes;

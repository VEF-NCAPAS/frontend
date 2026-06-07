import AdminEntityPage from '../components/AdminEntityPage';
import { userColumns, userFields, users } from '../data/adminData';

export default function UsersPage() {
  return (
    <AdminEntityPage
      title="Usuarios"
      description="Crea y administra las cuentas de candidatos y reclutadores."
      entityName="Usuario"
      storageKey="workhive-admin-users"
      fields={userFields}
      columns={userColumns}
      initialRecords={users}
    />
  );
}

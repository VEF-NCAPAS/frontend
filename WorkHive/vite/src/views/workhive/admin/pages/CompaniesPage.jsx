import AdminEntityPage from '../components/AdminEntityPage';
import { companies, companyColumns, companyFields } from '../data/adminData';

export default function CompaniesPage() {
  return (
    <AdminEntityPage
      title="Empresas"
      description="Administra las empresas y sus responsables de reclutamiento."
      entityName="Empresa"
      storageKey="workhive-admin-companies"
      fields={companyFields}
      columns={companyColumns}
      initialRecords={companies}
    />
  );
}

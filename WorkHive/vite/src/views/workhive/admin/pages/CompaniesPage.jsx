import AdminCompanyEntityPage from '../components/AdminCompanyEntityPage';
import { companyColumns, companyFields } from '../data/adminData';

export default function CompaniesPage() {
  return (
    <AdminCompanyEntityPage
      title="Empresas"
      description="Administra las empresas y sus responsables de reclutamiento."
      entityName="Empresa"
      fields={companyFields}
      columns={companyColumns}
    />
  );
}

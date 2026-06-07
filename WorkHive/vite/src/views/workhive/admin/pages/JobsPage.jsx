import AdminEntityPage from '../components/AdminEntityPage';
import { jobColumns, jobFields, jobs } from '../data/adminData';

export default function JobsPage() {
  return (
    <AdminEntityPage
      title="Ofertas de empleo"
      description="Revisa qué empresas publican ofertas y administra su estado."
      entityName="Oferta"
      storageKey="workhive-admin-jobs"
      fields={jobFields}
      columns={jobColumns}
      initialRecords={jobs}
    />
  );
}

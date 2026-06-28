import { useEffect, useState } from 'react';
import AdminEntityPage from '../components/AdminEntityPage';
import { recruiterColumns, recruiterFields } from '../data/adminData';
import { adminService } from '../../../../services/adminService';
import { getCompaniesAdmin } from '../../../../services/companyService';

export default function RecruitersPage() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await getCompaniesAdmin();
        const items = response?.data?.content || [];
        setCompanies(items.map((company) => ({ value: company.id, label: company.companyName || company.name })));
      } catch {
        setCompanies([]);
      }
    };

    loadCompanies();
  }, []);

  return (
    <AdminEntityPage
      title="Reclutadores"
      description="Consulta, crea y actualiza los perfiles de reclutadores."
      entityName="Reclutador"
      storageKey="workhive-admin-recruiters"
      fields={recruiterFields}
      columns={recruiterColumns}
      initialRecords={[]}
      loadRemoteRecords={() => adminService.getRecruiters()}
      createRemoteRecord={(data) => adminService.createRecruiter(data)}
      updateRemoteRecord={(id, data) => adminService.updateRecruiter(id, data)}
      deleteRemoteRecord={(id) => adminService.deleteRecruiter(id)}
      fieldOptions={{ company: companies }}
    />
  );
}

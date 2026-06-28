import AdminEntityPage from '../components/AdminEntityPage';
import { candidateColumns, candidateFields, users } from '../data/adminData';
import { adminService } from '../../../../services/adminService';

export default function CandidatesPage() {
  return (
    <AdminEntityPage
      title="Candidatos"
      description="Consulta, actualiza y elimina usuarios con rol candidato."
      entityName="Candidato"
      storageKey="workhive-admin-candidates"
      fields={candidateFields}
      columns={candidateColumns}
      initialRecords={users}
      loadRemoteRecords={() => adminService.getCandidates()}
      createRemoteRecord={(data) => adminService.createCandidate(data)}
      updateRemoteRecord={(id, data) => adminService.updateCandidate(id, data)}
      deleteRemoteRecord={(id) => adminService.deleteCandidate(id)}
    />
  );
}

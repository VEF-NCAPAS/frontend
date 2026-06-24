import AdminEntityPage from '../components/AdminEntityPage';
import { candidateColumns, candidateFields, candidates } from '../data/adminData';

export default function CandidatesPage() {
  return (
    <AdminEntityPage
      title="Candidatos"
      description="Consulta, crea y actualiza los perfiles de candidatos."
      entityName="Candidato"
      storageKey="workhive-admin-candidates"
      fields={candidateFields}
      columns={candidateColumns}
      initialRecords={candidates}
    />
  );
}

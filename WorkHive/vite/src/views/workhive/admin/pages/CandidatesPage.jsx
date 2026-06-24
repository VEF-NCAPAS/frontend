import AdminCandidateEntityPage from '../components/AdminCandidateEntityPage';
import { candidateColumns, candidateFields } from '../data/adminData';

export default function CandidatesPage() {
  return (
    <AdminCandidateEntityPage
      title="Candidatos"
      description="Consulta, crea y actualiza los perfiles de candidatos."
      entityName="Candidato"
      fields={candidateFields}
      columns={candidateColumns}
    />
  );
}

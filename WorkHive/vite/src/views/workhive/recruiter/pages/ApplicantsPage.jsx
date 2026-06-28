import Typography from '@mui/material/Typography';

import RecruiterPage from '../components/RecruiterPage';

export default function RecruiterApplicantsPage() {
  return (
    <RecruiterPage title="Postulantes" description="Revisa candidatos y da seguimiento a cada proceso.">
      <Typography color="text.secondary">Aqui apareceran los candidatos que aplicaron a tus ofertas.</Typography>
    </RecruiterPage>
  );
}

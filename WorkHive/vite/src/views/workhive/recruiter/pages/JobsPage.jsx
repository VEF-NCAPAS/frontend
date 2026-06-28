import Typography from '@mui/material/Typography';

import RecruiterPage from '../components/RecruiterPage';

export default function RecruiterJobsPage() {
  return (
    <RecruiterPage title="Mis ofertas" description="Gestiona las vacantes publicadas por tu empresa.">
      <Typography color="text.secondary">Aqui apareceran tus ofertas activas, pausadas y finalizadas.</Typography>
    </RecruiterPage>
  );
}

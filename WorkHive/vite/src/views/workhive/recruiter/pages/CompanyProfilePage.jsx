import Typography from '@mui/material/Typography';

import RecruiterPage from '../components/RecruiterPage';

export default function RecruiterCompanyProfilePage() {
  return (
    <RecruiterPage title="Perfil de empresa" description="Administra la informacion publica de tu empresa.">
      <Typography color="text.secondary">Completa los datos de la empresa para atraer mejores candidatos.</Typography>
    </RecruiterPage>
  );
}

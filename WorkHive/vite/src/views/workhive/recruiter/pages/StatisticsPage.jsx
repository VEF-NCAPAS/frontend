import Typography from '@mui/material/Typography';

import RecruiterPage from '../components/RecruiterPage';

export default function RecruiterStatisticsPage() {
  return (
    <RecruiterPage title="Estadisticas" description="Consulta el rendimiento de tus ofertas y procesos.">
      <Typography color="text.secondary">Aqui se mostraran los indicadores de reclutamiento de tu empresa.</Typography>
    </RecruiterPage>
  );
}

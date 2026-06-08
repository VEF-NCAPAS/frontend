import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';

const stats = [
  ['12', 'Ofertas activas'],
  ['48', 'Postulantes nuevos'],
  ['7', 'Procesos en revision']
];

export default function RecruiterDashboardPage() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <MainCard title="Panel de reclutador">
          <Typography color="text.secondary">Administra las ofertas y candidatos de tu empresa desde un solo lugar.</Typography>
        </MainCard>
      </Grid>
      {stats.map(([value, label]) => (
        <Grid key={label} size={{ xs: 12, sm: 4 }}>
          <MainCard border>
            <Typography variant="h2" color="secondary.main">
              {value}
            </Typography>
            <Typography color="text.secondary">{label}</Typography>
          </MainCard>
        </Grid>
      ))}
    </Grid>
  );
}

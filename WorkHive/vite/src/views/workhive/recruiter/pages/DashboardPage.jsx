import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import {
  IconBriefcase,
  IconUsers,
  IconCrown
} from '@tabler/icons-react';

import MainCard from 'ui-component/cards/MainCard';

export default function RecruiterDashboardPage() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <MainCard>
          <Typography variant="h3" color="secondary.main" gutterBottom>
            Panel de Reclutador
          </Typography>

          <Typography color="text.secondary">
            Gestiona las ofertas laborales, revisa candidatos y optimiza tu proceso de selección desde un solo lugar.
          </Typography>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <MainCard border>
          <Stack spacing={2} alignItems="center">
            <IconBriefcase size={42} color="#673ab7" />
            <Typography variant="h5" color="secondary.main">
              Gestión de ofertas
            </Typography>
            <Typography color="text.secondary" align="center">
              Publica nuevas vacantes, administra las existentes y mantén actualizada la información de cada puesto.
            </Typography>
          </Stack>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <MainCard border>
          <Stack spacing={2} alignItems="center">
            <IconUsers size={42} color="#673ab7" />
            <Typography variant="h5" color="secondary.main">
              Búsqueda de candidatos
            </Typography>
            <Typography color="text.secondary" align="center">
              Explora perfiles, revisa postulaciones y encuentra el talento que mejor se adapte a las necesidades de tu empresa.
            </Typography>
          </Stack>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <MainCard border>
          <Stack spacing={2} alignItems="center">
            <IconCrown size={42} color="#673ab7" />
            <Typography variant="h5" color="secondary.main">
              Plan Premium
            </Typography>
            <Typography color="text.secondary" align="center">
             Accede a funciones exclusivas, como la búsqueda de candidatos por puntuación y herramientas avanzadas para mejorar tu proceso de contratación.
            </Typography>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
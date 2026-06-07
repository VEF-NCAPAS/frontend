import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';

export default function AdminDashboard() {
  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <MainCard border>
            <Stack spacing={2} alignItems="flex-start">
              <Box>
                <Typography variant="h2" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                  ¡Hola, Admin!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Bienvenido al panel de administración de WorkHive. Desde aquí puedes gestionar usuarios, empresas, ofertas y revisar
                  reportes.
                </Typography>
              </Box>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}

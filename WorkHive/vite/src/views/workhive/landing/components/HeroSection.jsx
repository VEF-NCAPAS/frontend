import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function HeroSection() {
  return (
    <Stack spacing={3} alignItems="center" textAlign="center" sx={{ py: { xs: 8, md: 14 } }}>
      <Typography variant="h1" color="secondary.main">
        Encuentra talento. Encuentra oportunidades.
      </Typography>
      <Typography variant="h4" color="text.secondary" sx={{ maxWidth: 720, fontWeight: 400 }}>
        WorkHive conecta candidatos y empresas para construir mejores equipos.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button component={Link} to="/pages/register" variant="contained" color="secondary" size="large">
          Crear cuenta
        </Button>
        <Button component={Link} to="/pages/login" variant="outlined" color="secondary" size="large">
          Iniciar sesion
        </Button>
      </Stack>
    </Stack>
  );
}

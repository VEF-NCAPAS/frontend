import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import Logo from 'ui-component/Logo';

import FeatureCard from '../components/FeatureCard';
import HeroSection from '../components/HeroSection';

const features = [
  ['Para candidatos', 'Descubre ofertas, administra postulaciones y presenta tu experiencia profesional.'],
  ['Para reclutadores', 'Publica vacantes, revisa postulantes y mejora tus procesos de seleccion.'],
  ['Para empresas', 'Construye equipos con talento que coincide con tus necesidades.']
];

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 2 }}>
          <Logo />
          <Button component={Link} to="/pages/login" variant="outlined" color="secondary">
            Iniciar sesion
          </Button>
        </Stack>
        <HeroSection />
        <Grid container spacing={3} sx={{ pb: 8 }}>
          {features.map(([title, description]) => (
            <Grid key={title} size={{ xs: 12, md: 4 }}>
              <FeatureCard title={title} description={description} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

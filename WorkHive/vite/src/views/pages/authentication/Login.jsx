import { Link } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';

export default function Login() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Stack direction="column" justifyContent="space-between" sx={{ minHeight: '100vh' }}>
        <Stack justifyContent="center" alignItems="center" sx={{ flexGrow: 1, py: 4 }}>
          <Box sx={{ width: '100%', maxWidth: 560, mx: 2 }}>
            <AuthCardWrapper>
              <Stack spacing={2.5} alignItems="center" sx={{ width: '100%' }}>
                <Logo />

                <Stack spacing={0.8} alignItems="center" sx={{ width: '100%' }}>
                  <Typography color="secondary.main" gutterBottom variant={downMD ? 'h3' : 'h2'} textAlign="center">
                    Iniciar sesión
                  </Typography>

                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Accede para buscar empleo, administrar ofertas o revisar candidatos.
                  </Typography>
                </Stack>

                <AuthLogin />

                <Divider sx={{ width: '100%' }} />

                <Typography variant="body2" color="text.secondary" align="center">
                  ¿No tienes cuenta?{' '}
                  <Typography component={Link} to="/pages/register" variant="subtitle2" color="primary" sx={{ textDecoration: 'none' }}>
                    Regístrate aquí
                  </Typography>
                </Typography>
              </Stack>
            </AuthCardWrapper>
          </Box>
        </Stack>

        <Box sx={{ px: 3, py: 2 }}>
          <AuthFooter />
        </Box>
      </Stack>
    </AuthWrapper1>
  );
}

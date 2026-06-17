import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { login } from 'services/authService';
// material-ui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const API_URL = import.meta.env.VITE_API_URL;

export default function AuthLogin() {
  const [searchParams] = useSearchParams();
  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const isExistingCompany = searchParams.get('tipo') === 'empresa';

  const handleChange = (event) => {
    setError('');
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      setError('Ingresa tu correo electrónico.');
      return false;
    }

    if (!form.password.trim()) {
      setError('Ingresa tu contraseña.');
      return false;
    }

    return true;
  };

  const redirectByRole = (role) => {
      switch (role) {
        case 'CANDIDATE':
          window.location.href = '/candidato';
          break;

        case 'RECRUITER':
          window.location.href = '/reclutador';
          break;

        case 'ADMIN':
        case 'ADMINISTRATOR':
          window.location.href = '/admin';
          break;

        default:
          window.location.href = '/';
      }
    };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      const response = await login({
        email: form.email,
        password: form.password
      });

      const data = response.data;

      localStorage.setItem('name', data.name);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('email', data.email);

      if (checked) {
        localStorage.setItem('rememberSession', 'true');
      } else {
        localStorage.removeItem('rememberSession');
      }

      redirectByRole(data.role);

    } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Correo o contraseña incorrectos.'
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2.5} sx={{ width: '100%' }}>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'primary.light',
          border: '1px solid',
          borderColor: 'primary.200'
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <WorkOutlineIcon color="primary" />

          <Box>
            <Typography variant="subtitle1" color="primary.dark">
              {isExistingCompany ? 'Acceso para empresas existentes' : 'Plataforma de empleo y reclutamiento'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {isExistingCompany
                ? 'Inicia sesión con tu cuenta de reclutador para administrar ofertas y candidatos.'
                : 'Ingresa para gestionar postulaciones, ofertas y perfiles.'}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <FormControl fullWidth>
        <InputLabel htmlFor="login-email">Correo electrónico</InputLabel>
        <OutlinedInput
          id="login-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          label="Correo electrónico"
          placeholder="ejemplo@correo.com"
        />
      </FormControl>

      <FormControl fullWidth>
        <InputLabel htmlFor="login-password">Contraseña</InputLabel>
        <OutlinedInput
          id="login-password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="mostrar contraseña"
                onClick={() => setShowPassword((prev) => !prev)}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} color="primary" />}
          label="Mantener sesión iniciada"
        />

        <Typography variant="subtitle2" color="secondary" sx={{ cursor: 'pointer' }}>
          ¿Olvidaste tu contraseña?
        </Typography>
      </Stack>

      <AnimateButton>
        <Button
          disableElevation
          fullWidth
          size="large"
          variant="contained"
          color="secondary"
          onClick={handleLogin}
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </AnimateButton>
    </Stack>
  );
}

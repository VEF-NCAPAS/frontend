import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function AuthRegister() {
  const [userType, setUserType] = useState('CANDIDATE');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });

  const [message, setMessage] = useState({
    type: '',
    text: ''
  });

  const isCandidate = userType === 'CANDIDATE';

  const selectedInfo = useMemo(() => {
    if (isCandidate) {
      return {
        icon: <PersonSearchOutlinedIcon color="primary" />,
        title: 'Registro para candidatos',
        description: 'Crea tu perfil para buscar oportunidades, guardar ofertas y postularte fácilmente.',
        chip: 'Busco empleo',
        chipColor: 'primary'
      };
    }

    return {
      icon: <BusinessOutlinedIcon color="secondary" />,
      title: 'Registro para empresas',
      description: 'Crea una cuenta de reclutador para publicar ofertas y administrar candidatos.',
      chip: 'Busco talento',
      chipColor: 'secondary'
    };
  }, [isCandidate]);

  const handleChange = (event) => {
    setMessage({ type: '', text: '' });

    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setMessage({
        type: 'error',
        text: isCandidate ? 'Ingresa tu nombre completo.' : 'Ingresa el nombre del reclutador.'
      });
      return false;
    }

    if (!form.email.trim()) {
      setMessage({
        type: 'error',
        text: 'Ingresa tu correo electrónico.'
      });
      return false;
    }

    if (!form.password.trim()) {
      setMessage({
        type: 'error',
        text: 'Ingresa una contraseña.'
      });
      return false;
    }

    if (form.password.length < 6) {
      setMessage({
        type: 'error',
        text: 'La contraseña debe tener al menos 6 caracteres.'
      });
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Las contraseñas no coinciden.'
      });
      return false;
    }

    if (!isCandidate && !form.companyName.trim()) {
      setMessage({
        type: 'error',
        text: 'Ingresa el nombre de la empresa.'
      });
      return false;
    }

    if (!acceptedTerms) {
      setMessage({
        type: 'error',
        text: 'Debes aceptar los términos y condiciones.'
      });
      return false;
    }

    return true;
  };

  const getEndpoint = () => {
    if (isCandidate) {
      return `${API_URL}/auth/register/candidate`;
    }

    return `${API_URL}/auth/register/recruiter`;
  };

  const buildPayload = () => {
    if (isCandidate) {
      return {
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'CANDIDATE'
      };
    }

    return {
      name: form.name,
      email: form.email,
      password: form.password,
      role: 'RECRUITER',
      companyName: form.companyName
    };
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const response = await fetch(getEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(buildPayload())
      });

      if (!response.ok) {
        throw new Error('No se pudo crear la cuenta. Revisa los datos ingresados.');
      }

      setMessage({
        type: 'success',
        text: 'Cuenta creada correctamente. Ahora puedes iniciar sesión.'
      });

      setTimeout(() => {
        window.location.href = '/free/pages/login';
      }, 1000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Ocurrió un error al registrar la cuenta.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2.2} sx={{ width: '100%' }}>
      <ToggleButtonGroup
        fullWidth
        exclusive
        value={userType}
        color="primary"
        onChange={(event, value) => {
          if (value) {
            setUserType(value);
            setMessage({ type: '', text: '' });
          }
        }}
      >
        <ToggleButton value="CANDIDATE">Soy candidato</ToggleButton>
        <ToggleButton value="RECRUITER">Soy empresa</ToggleButton>
      </ToggleButtonGroup>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.default'
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          {selectedInfo.icon}

          <Box>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="subtitle1">{selectedInfo.title}</Typography>
              <Chip label={selectedInfo.chip} size="small" color={selectedInfo.chipColor} variant="outlined" />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              {selectedInfo.description}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {!isCandidate && (
        <Button
          component={Link}
          to="/pages/login?tipo=empresa"
          fullWidth
          variant="outlined"
          color="secondary"
          size="large"
          sx={{ textTransform: 'none' }}
        >
          Soy una empresa existente
        </Button>
      )}

      {message.text && <Alert severity={message.type}>{message.text}</Alert>}

      <FormControl fullWidth>
        <InputLabel htmlFor="register-name">{isCandidate ? 'Nombre completo' : 'Nombre del reclutador'}</InputLabel>
        <OutlinedInput
          id="register-name"
          name="name"
          value={form.name}
          onChange={handleChange}
          label={isCandidate ? 'Nombre completo' : 'Nombre del reclutador'}
          placeholder={isCandidate ? 'Ej. Juan Pérez' : 'Ej. Carlos López'}
        />
      </FormControl>

      <FormControl fullWidth>
        <InputLabel htmlFor="register-email">Correo electrónico</InputLabel>
        <OutlinedInput
          id="register-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          label="Correo electrónico"
          placeholder="ejemplo@correo.com"
        />
      </FormControl>

      {!isCandidate && (
        <FormControl fullWidth>
          <InputLabel htmlFor="register-company">Nombre de la empresa</InputLabel>
          <OutlinedInput
            id="register-company"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            label="Nombre de la empresa"
            placeholder="Ej. Empresa S.A. de C.V."
          />
        </FormControl>
      )}

      <FormControl fullWidth>
        <InputLabel htmlFor="register-password">Contraseña</InputLabel>
        <OutlinedInput
          id="register-password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          label="Contraseña"
          placeholder="Mínimo 6 caracteres"
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

      <FormControl fullWidth>
        <InputLabel htmlFor="register-confirm-password">Confirmar contraseña</InputLabel>
        <OutlinedInput
          id="register-confirm-password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={handleChange}
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
        />
      </FormControl>

      <FormControlLabel
        control={<Checkbox checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} color="primary" />}
        label={
          <Typography variant="body2" color="text.secondary">
            Acepto los términos y condiciones de uso.
          </Typography>
        }
      />

      <AnimateButton>
        <Button
          disableElevation
          fullWidth
          size="large"
          variant="contained"
          color="secondary"
          onClick={handleRegister}
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          {loading ? 'Creando cuenta...' : isCandidate ? 'Crear cuenta de candidato' : 'Crear cuenta de empresa'}
        </Button>
      </AnimateButton>
    </Stack>
  );
}

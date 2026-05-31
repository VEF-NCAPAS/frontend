import { useEffect, useMemo, useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
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

const DEFAULT_COMPANIES = [
  { id: 1, name: 'Banco Agrícola' },
  { id: 2, name: 'TELUS International' },
  { id: 3, name: 'Dollarcity' },
  { id: 4, name: 'Huawei El Salvador' },
  { id: 5, name: 'Hencorp' },
  { id: 6, name: 'OnlyDevs' }
];

const getCompanyList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.companies)) return data.companies;

  return [];
};

const normalizeCompany = (company, index) => {
  if (typeof company === 'string') {
    return {
      id: index + 1,
      name: company
    };
  }

  return {
    id: company.id ?? company.companyId ?? company.codigo ?? index + 1,
    name: company.name ?? company.companyName ?? company.nombre ?? company.razonSocial ?? ''
  };
};

export default function AuthRegister() {
  const [userType, setUserType] = useState('CANDIDATE');
  const [companyMode, setCompanyMode] = useState('EXISTING');
  const [companies, setCompanies] = useState(DEFAULT_COMPANIES);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companiesLoading, setCompaniesLoading] = useState(false);
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
  const isExistingCompanyMode = companyMode === 'EXISTING';

  useEffect(() => {
    if (isCandidate) return undefined;

    let ignore = false;

    const loadCompanies = async () => {
      try {
        setCompaniesLoading(true);

        const response = await fetch(`${API_URL}/companies`);

        if (!response.ok) {
          throw new Error('No se pudo cargar el catálogo de empresas.');
        }

        const data = await response.json();

        const normalizedCompanies = getCompanyList(data)
          .map(normalizeCompany)
          .filter((company) => company.name.trim());

        if (!ignore && normalizedCompanies.length > 0) {
          setCompanies(normalizedCompanies);
        }
      } catch {
        if (!ignore) {
          setCompanies(DEFAULT_COMPANIES);
        }
      } finally {
        if (!ignore) {
          setCompaniesLoading(false);
        }
      }
    };

    loadCompanies();

    return () => {
      ignore = true;
    };
  }, [isCandidate]);

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

    if (!isCandidate && isExistingCompanyMode && !selectedCompany) {
      setMessage({
        type: 'error',
        text: 'Selecciona una empresa existente o agrega una nueva.'
      });
      return false;
    }

    if (!isCandidate && !isExistingCompanyMode && !form.companyName.trim()) {
      setMessage({
        type: 'error',
        text: 'Ingresa el nombre de la nueva empresa.'
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
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: 'CANDIDATE'
      };
    }

    return {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: 'RECRUITER',
      companyId: isExistingCompanyMode ? selectedCompany?.id : null,
      companyName: isExistingCompanyMode ? selectedCompany?.name : form.companyName.trim()
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
        window.location.href = '/pages/login';
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
            setCompanyMode('EXISTING');
            setSelectedCompany(null);
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
        <Stack spacing={1.4}>
          <ToggleButtonGroup
            fullWidth
            exclusive
            value={companyMode}
            color="secondary"
            onChange={(event, value) => {
              if (value) {
                setCompanyMode(value);
                setSelectedCompany(null);
                setForm((prev) => ({
                  ...prev,
                  companyName: ''
                }));
                setMessage({ type: '', text: '' });
              }
            }}
          >
            <ToggleButton value="EXISTING">Empresa existente</ToggleButton>
            <ToggleButton value="NEW">Agregar empresa</ToggleButton>
          </ToggleButtonGroup>

          {isExistingCompanyMode ? (
            <Autocomplete
              fullWidth
              loading={companiesLoading}
              options={companies}
              value={selectedCompany}
              getOptionLabel={(option) => option?.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => {
                setSelectedCompany(value);
                setMessage({ type: '', text: '' });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Empresa existente"
                  placeholder="Busca o selecciona una empresa"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {companiesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          ) : (
            <FormControl fullWidth>
              <InputLabel htmlFor="register-company">Nombre de la nueva empresa</InputLabel>
              <OutlinedInput
                id="register-company"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                label="Nombre de la nueva empresa"
                placeholder="Ej. Empresa S.A. de C.V."
              />
            </FormControl>
          )}

          <Typography variant="caption" color="text.secondary">
            Si la empresa ya existe, selecciónala. Si no aparece, agrega una nueva.
          </Typography>
        </Stack>
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

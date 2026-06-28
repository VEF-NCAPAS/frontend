import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile } from 'services/userService';
import { getGenderLabel, getStoredGender, normalizeGender } from 'utils/genderUtils';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';

import PageHeading from '../components/PageHeading';
import ActionResultDialog from '../components/ActionResultDialog';
import { buttonSX } from '../data/candidateData';

import { IconArrowLeft, IconDeviceFloppy, IconShieldCheck } from '@tabler/icons-react';

const emptyProfile = {
  name: '',
  email: '',
  gender: ''
};

const genderOptions = [
  { value: 'FEMALE', label: 'Femenino' },
  { value: 'MALE', label: 'Masculino' },
  { value: 'OTHER', label: 'Otro' }
];

const getStoredProfile = () => ({
  name: localStorage.getItem('name') || '',
  email: localStorage.getItem('email') || '',
  gender: getStoredGender()
});

const syncProfileStorage = (profile) => {
  localStorage.setItem('name', profile?.name || '');
  localStorage.setItem('email', profile?.email || '');

  const gender = normalizeGender(profile?.gender);

  if (gender) {
    localStorage.setItem('gender', gender);
  }
};

export default function CandidateProfileEditPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState(() => ({ ...emptyProfile, ...getStoredProfile() }));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setMessage(null);

        const profile = await getMyProfile();
        const loadedProfile = {
          name: profile?.name || localStorage.getItem('name') || '',
          email: profile?.email || localStorage.getItem('email') || '',
          gender: normalizeGender(profile?.gender)
        };

        if (!ignore) {
          setValues(loadedProfile);
          syncProfileStorage(loadedProfile);
        }
      } catch (err) {
        if (!ignore) {
          setValues((previous) => ({ ...previous, ...getStoredProfile(), gender: getStoredGender() }));
          setMessage({
            type: 'warning',
            text: err.response?.data?.message || err.message || 'No se pudo cargar tu perfil. Revisa los datos antes de guardar.'
          });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  const validate = () => {
    const validationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.name.trim()) {
      validationErrors.name = 'El nombre es obligatorio.';
    } else if (values.name.trim().length < 2) {
      validationErrors.name = 'Ingresa al menos 2 caracteres.';
    }

    if (!values.email.trim()) {
      validationErrors.email = 'El correo es obligatorio.';
    } else if (!emailRegex.test(values.email.trim())) {
      validationErrors.email = 'Ingresa un correo valido.';
    }

    if (!values.gender) {
      validationErrors.gender = 'Selecciona un genero.';
    }

    return validationErrors;
  };

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setMessage(null);
  };

  const handleSubmit = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage({ type: 'error', text: 'Por favor corrige los campos marcados.' });
      return;
    }

    try {
      setSaving(true);
      setErrors({});
      setMessage(null);

      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        gender: values.gender
      };

      const updatedProfile = await updateMyProfile(payload);

      const gender = normalizeGender(updatedProfile?.gender) || payload.gender;

      setValues({
        name: updatedProfile?.name || payload.name,
        email: updatedProfile?.email || payload.email,
        gender
      });
      syncProfileStorage({ ...(updatedProfile || payload), gender });
      setSaveDialogOpen(true);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'No se pudo actualizar tu perfil.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeading
        title="Editar perfil"
        description="Actualiza los datos personales asociados a tu cuenta de candidato."
        action={
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<IconArrowLeft size={18} />}
            sx={{ textTransform: 'none' }}
            onClick={() => navigate('/candidato/mi-perfil')}
          >
            Volver
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard border>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Avatar sx={{ width: 82, height: 82, bgcolor: 'secondary.light', color: 'secondary.dark' }}>
                <IconShieldCheck size={44} />
              </Avatar>
              <Box>
                <Typography variant="h3">{values.name || 'Tu nombre'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {values.email || 'tu-correo@ejemplo.com'}
                </Typography>
              </Box>
              <Chip
                label={getGenderLabel(values.gender) || 'Genero pendiente'}
                color={values.gender ? 'success' : 'warning'}
                variant="outlined"
                sx={{ px: 1.5, py: 0.75, fontWeight: 600 }}
              />
              <Divider flexItem />
              <Typography variant="body2" color="text.secondary">
                Estos datos se guardaran directamente en tu perfil de WorkHive.
              </Typography>
            </Stack>
          </MainCard>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {message && <Alert severity={message.type}>{message.text}</Alert>}
            <MainCard title="Informacion personal" border>
              {loading ? (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CircularProgress color="secondary" size={22} />
                  <Typography variant="body2" color="text.secondary">
                    Cargando perfil...
                  </Typography>
                </Stack>
              ) : (
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Nombre completo"
                      value={values.name}
                      onChange={handleChange('name')}
                      error={Boolean(errors.name)}
                      helperText={errors.name || ''}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Correo electronico"
                      type="email"
                      value={values.email}
                      onChange={handleChange('email')}
                      error={Boolean(errors.email)}
                      helperText={errors.email || ''}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth error={Boolean(errors.gender)}>
                      <InputLabel id="candidate-profile-gender-label">Genero</InputLabel>
                      <Select
                        labelId="candidate-profile-gender-label"
                        value={values.gender}
                        label="Genero"
                        onChange={handleChange('gender')}
                      >
                        {genderOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.gender || ''}</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </MainCard>

            <MainCard title="Guardar cambios" border>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
                <Box>
                  <Typography variant="h4">Perfil del candidato</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Se enviaran nombre, correo y genero al backend.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={saving ? <CircularProgress color="inherit" size={18} /> : <IconDeviceFloppy size={18} />}
                  sx={buttonSX}
                  onClick={handleSubmit}
                  disabled={loading || saving}
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </Stack>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>

      <ActionResultDialog
        open={saveDialogOpen}
        onClose={() => {
          setSaveDialogOpen(false);
          navigate('/candidato/mi-perfil');
        }}
        title="Perfil guardado"
        description="Tu perfil fue actualizado correctamente."
      />
    </>
  );
}

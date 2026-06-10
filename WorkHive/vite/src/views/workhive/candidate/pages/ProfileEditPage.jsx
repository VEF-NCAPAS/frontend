import { useEffect, useMemo, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useLocalStorage } from 'hooks/useLocalStorage';
import MainCard from 'ui-component/cards/MainCard';

import PageHeading from '../components/PageHeading';
import { buttonSX } from '../data/candidateData';

import { IconCheckupList, IconShieldCheck } from '@tabler/icons-react';

const defaultProfile = {
  firstName: 'Ana',
  lastName: 'Martinez',
  experience: '3 años',
  skills: 'React, JavaScript, TypeScript, Material UI',
  available: true
};

export default function CandidateProfileEditPage() {
  const { state: storedProfile, setState: setStoredProfile } = useLocalStorage('candidate-profile', defaultProfile);
  const [values, setValues] = useState(storedProfile);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setValues(storedProfile);
  }, [storedProfile]);

  const skills = useMemo(
    () => values.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
    [values.skills]
  );

  const validate = () => {
    const validationErrors = {};

    if (!values.firstName.trim()) {
      validationErrors.firstName = 'El nombre es obligatorio.';
    } else if (values.firstName.trim().length < 2) {
      validationErrors.firstName = 'Ingresa al menos 2 caracteres.';
    }

    if (!values.lastName.trim()) {
      validationErrors.lastName = 'El apellido es obligatorio.';
    } else if (values.lastName.trim().length < 2) {
      validationErrors.lastName = 'Ingresa al menos 2 caracteres.';
    }

    if (!values.experience.trim()) {
      validationErrors.experience = 'La experiencia es obligatoria.';
    }

    if (!values.skills.trim()) {
      validationErrors.skills = 'Agrega al menos una habilidad.';
    }

    return validationErrors;
  };

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setMessage(null);
  };

  const handleToggle = () => {
    setValues((prev) => ({ ...prev, available: !prev.available }));
    setMessage(null);
  };

  const handleSubmit = () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage({ type: 'error', text: 'Por favor corrige los campos marcados.' });
      return;
    }

    setStoredProfile(values);
    setErrors({});
    setMessage({ type: 'success', text: 'Perfil guardado correctamente.' });
  };

  return (
    <>
      <PageHeading
        title="Editar perfil"
        description="Actualiza tu información principal, tus habilidades y tu disponibilidad de trabajo."
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard border>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Avatar sx={{ width: 82, height: 82, bgcolor: 'secondary.light', color: 'secondary.dark' }}>
                <IconShieldCheck size={44} />
              </Avatar>
              <Box>
                <Typography variant="h3">{`${values.firstName} ${values.lastName}`}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {values.experience} de experiencia
                </Typography>
              </Box>
              <Chip
                label={values.available ? 'Disponible para trabajar' : 'No disponible para trabajar'}
                color={values.available ? 'success' : 'warning'}
                variant="outlined"
                sx={{ px: 1.5, py: 0.75, fontWeight: 600 }}
              />
              <Divider flexItem />
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                <Chip label="Habilidades activas" color="secondary" size="small" />
                <Chip label="Perfil visible" color="warning" size="small" />
              </Stack>
            </Stack>
          </MainCard>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {message && <Alert severity={message.type}>{message.text}</Alert>}
            <MainCard title="Información personal" border>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombres"
                    value={values.firstName}
                    onChange={handleChange('firstName')}
                    error={Boolean(errors.firstName)}
                    helperText={errors.firstName || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellidos"
                    value={values.lastName}
                    onChange={handleChange('lastName')}
                    error={Boolean(errors.lastName)}
                    helperText={errors.lastName || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Experiencia"
                    value={values.experience}
                    onChange={handleChange('experience')}
                    error={Boolean(errors.experience)}
                    helperText={errors.experience || 'Ej. 3 años, 5+ años, Senior'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Disponibilidad
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Activa o desactiva tu estado de trabajo.
                      </Typography>
                    </Box>
                    <Switch checked={values.available} color="success" onChange={handleToggle} />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Habilidades"
                    placeholder="React, JavaScript, TypeScript, Material UI"
                    value={values.skills}
                    onChange={handleChange('skills')}
                    error={Boolean(errors.skills)}
                    helperText={errors.skills || 'Separa cada habilidad con coma.'}
                    multiline
                    minRows={2}
                  />
                </Grid>
              </Grid>
            </MainCard>

            <MainCard title="Resumen de perfil" border>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4">Estado del perfil</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ajusta tu disponibilidad y muestra tus principales habilidades.
                    </Typography>
                  </Box>
                  <Button variant="contained" color="secondary" sx={buttonSX} onClick={handleSubmit}>
                    Guardar cambios
                  </Button>
                </Stack>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Chip label={`Skills: ${skills.length}`} color="secondary" size="small" />
                  <Chip label={values.available ? 'Listo para contratar' : 'En pausa'} color={values.available ? 'success' : 'warning'} size="small" />
                  <Chip label="Visibilidad alta" color="warning" size="small" />
                </Stack>
                <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(124, 77, 255, 0.08)' }}>
                  <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                    <IconCheckupList size={18} style={{ color: '#7c4dff' }} />
                    <Typography variant="body2" color="text.secondary">
                      Mantén tu perfil actualizado y visible para más empresas. Si no estás buscando trabajo, desactiva tu disponibilidad.
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

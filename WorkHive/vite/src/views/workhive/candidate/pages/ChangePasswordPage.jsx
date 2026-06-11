import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import MainCard from 'ui-component/cards/MainCard';

import PageHeading from '../components/PageHeading';
import { buttonSX } from '../data/candidateData';

import { IconLock, IconArrowLeft } from '@tabler/icons-react';
import { changePassword } from 'services/authService';
const defaultForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
};

export default function CandidateChangePasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setMessage(null);
  };

  const handleSubmit = async () => {
    const validation = {};

    if (!form.currentPassword.trim()) {
      validation.currentPassword = 'Ingresa la contraseña actual.';
    }
    if (form.newPassword.length < 8) {
      validation.newPassword = 'La nueva contraseña debe tener al menos 8 caracteres.';
    }
    if (form.confirmPassword !== form.newPassword) {
      validation.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      setMessage({ type: 'error', text: 'Corrige los campos marcados antes de continuar.' });
      return;
    }

    try {

      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });

      setForm(defaultForm);
      setErrors({});

      setMessage({
        type: 'success',
        text: 'Contraseña actualizada correctamente.'
      });

    } catch (err) {

      setMessage({
        type: 'error',
        text:
          err.response?.data?.message ||
          err.message ||
          'No se pudo cambiar la contraseña.'
      });

    }
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <IconButton
          color="secondary"
          onClick={() => navigate('/candidato/configuracion-cuenta')}
          sx={{ p: 1.5, bgcolor: 'secondary.lighter', '&:hover': { bgcolor: 'secondary.light' } }}
        >
          <IconArrowLeft size={24} />
        </IconButton>
      </Box>
      <PageHeading
        title="Cambiar contraseña"
        description="Define una nueva contraseña segura para tu cuenta de candidato."
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {message && <Alert severity={message.type}>{message.text}</Alert>}
            <MainCard title="Información de seguridad" border>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  type="password"
                  label="Contraseña actual"
                  value={form.currentPassword}
                  onChange={handleChange('currentPassword')}
                  error={Boolean(errors.currentPassword)}
                  helperText={errors.currentPassword || 'Ingresa tu contraseña actual para confirmar el cambio.'}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Nueva contraseña"
                  value={form.newPassword}
                  onChange={handleChange('newPassword')}
                  error={Boolean(errors.newPassword)}
                  helperText={errors.newPassword || 'Usa al menos 8 caracteres, una mayúscula y un número si es posible.'}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Confirmar contraseña"
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword || 'Escribe la nueva contraseña nuevamente para confirmar.'}
                />
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="secondary" sx={buttonSX} onClick={handleSubmit} startIcon={<IconLock size={18} />}>
                    Cambiar contraseña
                  </Button>
                </Stack>
              </Stack>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { useLocalStorage } from 'hooks/useLocalStorage';
import MainCard from 'ui-component/cards/MainCard';

import PageHeading from '../components/PageHeading';
import { buttonSX } from '../data/candidateData';

import { IconCamera, IconKey, IconLogout, IconShieldCheck } from '@tabler/icons-react';

export default function CandidateAccountSettingsPage() {
  const navigate = useNavigate();
  const { state: settings, setState: setSettings } = useLocalStorage('candidate-account-settings', {
    hideProfile: false
  });

  const accountOptions = useMemo(
    () => [
      {
        title: 'Cambiar contraseña',
        description: 'Actualiza tu clave de acceso para mantener segura tu cuenta.',
        icon: IconKey,
        action: (
          <Button variant="outlined" color="secondary" sx={buttonSX} onClick={() => navigate('/configuracion-cuenta/cambiar-contrasena')}>
            Cambiar
          </Button>
        )
      },
      {
        title: 'Ocultar mi perfil',
        description: 'Activa el modo privado para hacer tu perfil invisible temporalmente.',
        icon: IconShieldCheck,
        action: (
          <Switch
            checked={settings.hideProfile}
            onChange={() => setSettings((prev) => ({ ...prev, hideProfile: !prev.hideProfile }))}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'success.main'
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'success.main'
              }
            }}
          />
        )
      },
      {
        title: 'Cambiar fotografía',
        description: 'Sube una nueva imagen para tu perfil de candidato.',
        icon: IconCamera,
        action: (
          <Button variant="outlined" color="secondary" sx={buttonSX} onClick={() => navigate('/configuracion-cuenta/cambiar-foto')}>
            Subir foto
          </Button>
        )
      },
      {
        title: 'Cerrar sesión',
        description: 'Finaliza tu sesión actual en WorkHive.',
        icon: IconLogout,
        action: (
          <Button variant="contained" color="secondary" sx={buttonSX}>
            Cerrar sesión
          </Button>
        )
      }
    ],
    [navigate, settings.hideProfile, setSettings]
  );

  return (
    <>
      <PageHeading title="Configuración de cuenta" description="Administra la seguridad y privacidad de tu perfil." />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            {accountOptions.map((option) => {
              const OptionIcon = option.icon;

              return (
                <MainCard key={option.title} border contentSX={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Avatar variant="rounded" sx={{ bgcolor: 'secondary.light', color: 'secondary.main' }}>
                      <OptionIcon size={22} />
                    </Avatar>
                    <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                      <Typography variant="h4">{option.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Stack>
                    {option.action}
                  </Stack>
                </MainCard>
              );
            })}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

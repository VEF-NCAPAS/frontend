import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';

import PageHeading from '../components/PageHeading';
import { buttonSX } from '../data/candidateData';

import { IconPencil, IconUser } from '@tabler/icons-react';

const professionalInfo = [
  ['Correo', 'ana.martinez@correo.com'],
  ['Ubicacion', 'San Salvador, El Salvador'],
  ['Experiencia', '3 anos']
];

export default function CandidateProfilePage() {
  return (
    <>
      <PageHeading
        title="Mi perfil"
        description="Manten actualizada tu informacion para destacar ante las empresas."
        action={
          <Button variant="contained" color="secondary" startIcon={<IconPencil size={18} />} sx={buttonSX}>
            Editar perfil
          </Button>
        }
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard border>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Avatar sx={{ width: 82, height: 82, bgcolor: 'secondary.light', color: 'secondary.main' }}>
                <IconUser size={44} />
              </Avatar>
              <Box>
                <Typography variant="h3">Ana Martinez</Typography>
                <Typography variant="body2" color="text.secondary">
                  Desarrolladora Frontend
                </Typography>
              </Box>
              <Chip label="Disponible para trabajar" color="success" variant="outlined" />
              <Divider flexItem />
              <Box sx={{ width: '100%' }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">Perfil completado</Typography>
                  <Typography variant="subtitle1" color="secondary.main">
                    78%
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={78} color="secondary" sx={{ height: 8, borderRadius: 8 }} />
              </Box>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <MainCard title="Informacion profesional" border>
              <Grid container spacing={2.5}>
                {professionalInfo.map(([label, value]) => (
                  <Grid key={label} size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </MainCard>
            <MainCard title="Habilidades" border>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {['React', 'JavaScript', 'TypeScript', 'Material UI', 'Git', 'Figma'].map((skill) => (
                  <Chip key={skill} label={skill} color="secondary" variant="outlined" />
                ))}
              </Stack>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

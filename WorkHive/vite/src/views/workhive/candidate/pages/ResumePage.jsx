import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';

import PageHeading from '../components/PageHeading';
import { buttonSX } from '../data/candidateData';

import { IconCheck, IconFileText, IconUpload } from '@tabler/icons-react';

const recommendations = [
  'Incluye resultados medibles en tu experiencia.',
  'Agrega habilidades relevantes para cada oferta.',
  'Manten un formato claro y de maximo dos paginas.'
];

export default function CandidateResumePage() {
  return (
    <>
      <PageHeading
        title="CV / Hoja de vida"
        description="Gestiona tu curriculum y mantenlo listo para nuevas postulaciones."
        action={
          <Button variant="contained" color="secondary" startIcon={<IconUpload size={18} />} sx={buttonSX}>
            Subir nuevo CV
          </Button>
        }
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <MainCard title="Documento principal" border>
            <Stack spacing={2.5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                <Avatar variant="rounded" sx={{ width: 58, height: 58, bgcolor: 'secondary.light', color: 'secondary.main' }}>
                  <IconFileText size={30} />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4">CV_Ana_Martinez_2026.pdf</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Actualizado el 20 de mayo de 2026 - 1.2 MB
                  </Typography>
                </Box>
                <Chip label="Principal" size="small" color="success" variant="outlined" />
              </Stack>
              <Divider />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button variant="contained" color="secondary" fullWidth sx={buttonSX}>
                  Vista previa
                </Button>
                <Button variant="outlined" color="secondary" fullWidth sx={buttonSX}>
                  Descargar
                </Button>
              </Stack>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <MainCard title="Recomendaciones" border>
            <Stack spacing={2}>
              {recommendations.map((recommendation) => (
                <Stack key={recommendation} direction="row" spacing={1.25} alignItems="flex-start">
                  <Avatar sx={{ width: 22, height: 22, bgcolor: 'success.light', color: 'success.dark' }}>
                    <IconCheck size={14} />
                  </Avatar>
                  <Typography variant="body2">{recommendation}</Typography>
                </Stack>
              ))}
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}

import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';

import JobItem from '../components/JobItem';
import PageHeading from '../components/PageHeading';
import { buttonSX, jobs } from '../data/candidateData';

import { IconSearch } from '@tabler/icons-react';

export default function CandidateJobsPage() {
  return (
    <>
      <PageHeading
        title="Buscar empleos"
        description="Encuentra oportunidades que coincidan con tu experiencia en El Salvador."
        action={
          <Button component={Link} to="/mi-perfil" variant="outlined" color="secondary" sx={buttonSX}>
            Completar mi perfil
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <MainCard contentSX={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }} sx={{ mb: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h4">Que empleo estas buscando?</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    placeholder="Cargo, empresa o palabra clave"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconSearch size={18} />
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField select fullWidth defaultValue="all" label="Ubicacion">
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="ss">San Salvador</MenuItem>
                    <MenuItem value="st">Santa Tecla</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button fullWidth variant="contained" color="secondary" sx={{ ...buttonSX, height: '100%', minHeight: 50 }}>
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </MainCard>

          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h3">Ofertas recomendadas</Typography>
              <Typography variant="body2" color="text.secondary">
                24 resultados
              </Typography>
            </Stack>
            {jobs.map((job) => (
              <JobItem key={job.title} job={job} />
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <MainCard title="Tu busqueda" border>
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Recibe alertas cuando se publiquen empleos relacionados con frontend y diseno.
                </Typography>
                <Button fullWidth variant="outlined" color="secondary" sx={buttonSX}>
                  Crear alerta de empleo
                </Button>
              </Stack>
            </MainCard>
            <MainCard title="Perfil destacado" border>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Completado</Typography>
                  <Typography variant="subtitle1" color="secondary.main">
                    78%
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={78} color="secondary" sx={{ height: 8, borderRadius: 8 }} />
                <Typography variant="body2" color="text.secondary">
                  Agrega tu experiencia mas reciente para aumentar la visibilidad.
                </Typography>
              </Stack>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

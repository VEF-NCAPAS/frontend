import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
import { buttonSX } from '../data/candidateData';

import { IconSearch } from '@tabler/icons-react';
import { getVacancies } from 'services/vacancyService';
export default function CandidateJobsPage() {
  const [title, setTitle] = useState('');
  const [modality, setModality] = useState('');

  const [vacancies, setVacancies] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
  try {
    setLoading(true);

    const result = await getVacancies({
      page: 0,
      size: 10,
      sortBy: 'title',
      sortOrder: 'asc',
      ...(title && { title }),
      ...(modality && { modality })
    });

      setVacancies(result.data.content);
      setTotalElements(result.data.totalElements);

    } catch (error) {

      if (error.response?.status === 404) {
        setVacancies([]);
        setTotalElements(0);
        return;
      }

      console.error(error);

    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      handleSearch();
    }, []);
 
  return (  
    <>
      <PageHeading
        title="Buscar empleos"
        description="Encuentra oportunidades que coincidan con tu experiencia en El Salvador."
        action={
          <Button component={Link} to="/candidato/mi-perfil" variant="outlined" color="secondary" sx={buttonSX}>
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Cargo o palabra clave"
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
                  <TextField
                    select
                    fullWidth
                    value={modality}
                    label="Modalidad"
                    onChange={(e) => setModality(e.target.value)}
                  >
                    <MenuItem value="">Todas</MenuItem>
                    <MenuItem value="REMOTE">Remoto</MenuItem>
                    <MenuItem value="HYBRID">Híbrido</MenuItem>
                    <MenuItem value="ONSITE">Presencial</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={handleSearch}
                    disabled={loading}
                    sx={{ ...buttonSX, height: '100%', minHeight: 50 }}
                  >
                    {loading ? 'Buscando...' : 'Buscar'}
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </MainCard>

          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h3">Ofertas recomendadas</Typography>
              <Typography variant="body2" color="text.secondary">
                {totalElements} resultados
              </Typography>
            </Stack>
            {vacancies.map((job) => (
              <JobItem key={job.id} job={job} />
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
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
